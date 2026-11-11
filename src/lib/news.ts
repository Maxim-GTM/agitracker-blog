// Read-side of the news feature: loads the data written by scripts/fetch-news.mjs and shapes it for pages.
import MarkdownIt from 'markdown-it';
import itemsFile from '../data/news/items.json';
import sourcesFile from '../data/news/sources.json';
import statusFile from '../data/news/status.json';
import {
  KINDS,
  TOPICS,
  buildBrief,
  isoWeek,
  parseWeekKey,
  type NewsItem,
  type NewsSource,
  type Story,
} from '../../scripts/news-core.mjs';

export { KINDS, TOPICS };
export type { NewsItem, NewsSource, Story };

export const sources = sourcesFile as NewsSource[];
export const sourceMap = new Map(sources.map((s) => [s.id, s]));
export const sourceName = (id: string) => sourceMap.get(id)?.name ?? id;
export const kindLabel = (id: string) => KINDS[(sourceMap.get(id)?.kind ?? 'publication') as keyof typeof KINDS].label;

/** Press releases are paid placements, so links to them are marked nofollow. Editorial links are plain. */
export const linkRel = (id: string) =>
  sourceMap.get(id)?.kind === 'newswire' ? 'nofollow noopener noreferrer' : 'noopener noreferrer';

export const items = (itemsFile as { updatedAt: string; items: NewsItem[] }).items;
export const updatedAt = new Date((itemsFile as { updatedAt: string }).updatedAt);
export const coverageStart = new Date((statusFile as { coverageStart: string }).coverageStart);

/** Topics that get their own landing page ('More AI news' is a catch-all and does not). */
export const TOPIC_PAGES = TOPICS.filter((t) => t.id !== 'general');
export const topicMeta = (id: string) => TOPICS.find((t) => t.id === id) ?? TOPICS[TOPICS.length - 1];
export const topicUrl = (id: string) => `/news/topic/${id}/`;
export const swatchFor = (kind: string) =>
  ({ lab: 'signal', company: 'signal', publication: 'sun', research: 'sky', community: 'lilac', newswire: 'rose' })[kind] ?? 'paper';

export const topicSwatch = (id: string) =>
  ({ models: 'lilac', products: 'signal', business: 'sun', policy: 'rose', infrastructure: 'sky', 'open-source': 'signal', general: 'paper' })[id] ?? 'paper';

// ---------- formatting ----------

const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const shortFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const longFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
export const formatDay = (d: Date | string) => dayFmt.format(new Date(d));
export const formatShort = (d: Date | string) => shortFmt.format(new Date(d));
export const formatLong = (d: Date | string) => longFmt.format(new Date(d));
export const formatTime = (d: Date | string) => `${timeFmt.format(new Date(d))} UTC`;
export const dayKey = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

/** Newest first, grouped by UTC calendar day. */
export function groupByDay(list: NewsItem[]) {
  const groups: { day: string; items: NewsItem[] }[] = [];
  for (const it of list) {
    const day = dayKey(it.published);
    const last = groups[groups.length - 1];
    if (last?.day === day) last.items.push(it);
    else groups.push({ day, items: [it] });
  }
  return groups;
}

// ---------- weekly briefs ----------

type Brief = ReturnType<typeof buildBrief>;
export interface WeeklyBrief extends Brief {
  key: string;
  start: string;
  end: string;
  /** Tracking began part-way through this week, so early days may be thinner. */
  partial: boolean;
  /** The week is still running: the brief is rebuilt on every refresh. */
  live: boolean;
  frozenAt?: string;
}

const frozen = import.meta.glob<Omit<WeeklyBrief, 'live'>>('../data/news/weeks/*.json', { eager: true, import: 'default' });
const notes = import.meta.glob<string>('../data/news/notes/*.md', { eager: true, query: '?raw', import: 'default' });

const md = new MarkdownIt({ html: false, linkify: true });

/** Optional editor's note, from src/data/news/notes/<year>-w<nn>.md. */
export function editorNote(key: string): string | undefined {
  const raw = Object.entries(notes).find(([path]) => path.endsWith(`/${key}.md`))?.[1];
  return raw?.trim() ? md.render(raw.trim()) : undefined;
}

const MIN_LIVE_ITEMS = 8;

/** All briefs, newest first: completed weeks from disk, plus the running week once it has enough items. */
export function getBriefs(): WeeklyBrief[] {
  const briefs = new Map<string, WeeklyBrief>();
  for (const b of Object.values(frozen)) briefs.set(b.key, { ...b, live: false });

  const current = isoWeek(new Date());
  if (!briefs.has(current.key)) {
    const inWeek = items.filter((i) => {
      const t = new Date(i.published).getTime();
      return t >= current.start.getTime() && t <= current.end.getTime();
    });
    if (inWeek.length >= MIN_LIVE_ITEMS) {
      briefs.set(current.key, {
        key: current.key,
        start: current.start.toISOString(),
        end: current.end.toISOString(),
        partial: current.start.getTime() < coverageStart.getTime() - 86_400_000,
        live: true,
        ...buildBrief(inWeek, sourceMap),
      });
    }
  }
  return [...briefs.values()].sort((a, b) => b.key.localeCompare(a.key));
}

export const weekUrl = (key: string) => `/news/weekly/${key}/`;

/** "Nov 9–15, 2026" or "Dec 28, 2026–Jan 3, 2027". */
export function weekRange(b: { start: string; end: string }) {
  const s = new Date(b.start);
  const e = new Date(b.end);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  if (sameMonth) return `${shortFmt.format(s)}–${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  if (s.getUTCFullYear() === e.getUTCFullYear()) return `${shortFmt.format(s)} – ${shortFmt.format(e)}, ${e.getUTCFullYear()}`;
  return `${longFmt.format(s)} – ${longFmt.format(e)}`;
}

export const briefTitle = (b: WeeklyBrief) => `AI Weekly Brief: ${weekRange(b)}`;

/** One-sentence meta description built from the brief's own top headlines. */
export function briefDescription(b: WeeklyBrief) {
  const heads = b.top.slice(0, 2).map((s) => s.lead.title.replace(/[.\s]+$/, ''));
  const base = `The ${b.stats.stories} AI stories that mattered from ${b.stats.sources} sources, ${weekRange(b)}.`;
  const out = heads.length ? `${base} Led by: ${heads.join('; ')}.` : base;
  return out.length > 158 ? `${out.slice(0, 155).replace(/\s+\S*$/, '')}…` : out;
}

export { parseWeekKey };
