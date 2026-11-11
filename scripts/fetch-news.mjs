// Pulls the RSS/Atom feeds listed in src/data/news/sources.json, keeps AI-relevant items,
// and merges them into src/data/news/items.json (a rolling window). Completed ISO weeks are
// frozen into src/data/news/weeks/<year>-w<nn>.json so briefs stay stable after items expire.
//
//   node scripts/fetch-news.mjs            fetch and write
//   node scripts/fetch-news.mjs --dry      fetch and report only
//
// Politeness: identifies itself, one request per feed per run, 20 s timeout, bounded concurrency.
// Only headline, link, source, date and a short (<= 220 char) snippet are stored: never full text.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';
import {
  buildBrief,
  classify,
  isAiRelevant,
  isoWeek,
  itemId,
  normalizeUrl,
  stringifyItems,
} from './news-core.mjs';

const DIR = 'src/data/news';
const RETAIN_DAYS = 35;
const MIN_ITEMS_TO_FREEZE = 15;
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;
const UA = 'agitracker-newsbot/1.0 (+https://agitracker.io/news/sources/)';
const DRY = process.argv.includes('--dry');
const DAY = 86_400_000;

const sources = JSON.parse(readFileSync(join(DIR, 'sources.json'), 'utf8'));
const sourceMap = new Map(sources.map((s) => [s.id, s]));
const readJson = (file, fallback) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback);

const prev = readJson(join(DIR, 'items.json'), { updatedAt: null, items: [] });
const prevStatus = readJson(join(DIR, 'status.json'), { coverageStart: null, updatedAt: null, sources: {} });
const now = new Date();

// ---------- parsing ----------

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: false,
  trimValues: true,
  processEntities: true,
  maxNestedTags: 64,
});

const asArray = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
const text = (v) => {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === 'object') return text(v['#text'] ?? v['@_href'] ?? '');
  return String(v);
};

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

/** HTML -> plain single-line text. */
function plain(html) {
  const stripped = sanitizeHtml(String(html), { allowedTags: [], allowedAttributes: {} });
  return decode(decode(stripped)).replace(/\s+/g, ' ').trim();
}

function snippet(raw, title) {
  let s = plain(raw)
    .replace(/\s*The post .{0,200} appeared first on .{0,100}\.?$/i, '')
    .replace(/\s*(Read more|Continue reading|Read the full story|Learn more)[^a-z]*$/i, '')
    .replace(/\s*(Comments?|Article URL|Points:).*$/i, '')
    .trim();
  if (s.toLowerCase().startsWith(title.toLowerCase().slice(0, 40))) s = s.slice(title.length).replace(/^[\s:.\-–—]+/, '');
  if (s.length < 40) return '';
  if (s.length <= 220) return s;
  const cut = s.slice(0, 220);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 120 ? cut.lastIndexOf(' ') : 220).replace(/[\s,;:.\-–—]+$/, '')}…`;
}

function linkOf(entry) {
  const link = entry.link;
  if (typeof link === 'string') return link;
  const links = asArray(link);
  const alt = links.find((l) => typeof l === 'object' && (!l['@_rel'] || l['@_rel'] === 'alternate') && l['@_href']);
  if (alt) return alt['@_href'];
  const first = links[0];
  if (first && typeof first === 'object') return first['@_href'] ?? text(first);
  const guid = text(entry.guid ?? entry.id);
  return /^https?:\/\//.test(guid) ? guid : '';
}

function parseFeed(xml) {
  const doc = parser.parse(xml);
  const entries = doc.rss?.channel?.item ?? doc.feed?.entry ?? doc['rdf:RDF']?.item ?? doc.RDF?.item;
  return asArray(entries);
}

// ---------- fetching ----------

async function fetchFeed(source) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(source.feed, {
        headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8' },
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      if (!/<(rss|feed|rdf:RDF)[\s>]/i.test(body.slice(0, 2000))) throw new Error('not an RSS/Atom document');
      return parseFeed(body);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastError;
}

function toItem(source, entry) {
  const title = plain(text(entry.title));
  const url = normalizeUrl(linkOf(entry));
  if (!title || title.length < 12 || !url) return null;
  const dateRaw = text(entry.pubDate ?? entry.published ?? entry.updated ?? entry['dc:date'] ?? entry.date);
  let published = dateRaw ? new Date(dateRaw) : null;
  if (!published || Number.isNaN(published.getTime())) published = null;
  if (published && published.getTime() > now.getTime() + 2 * 3_600_000) published = now; // clock-skewed feed
  if (!published) published = now;
  if (now.getTime() - published.getTime() > RETAIN_DAYS * DAY) return null;

  const rawSummary = source.snippet === false ? '' : text(entry.description ?? entry.summary ?? entry['content:encoded'] ?? entry.content);
  const summary = snippet(rawSummary, title);
  const forFilter = source.snippet === false ? '' : plain(rawSummary).slice(0, 600);
  if (!source.aiOnly && !isAiRelevant(title, forFilter, source.strict)) return null;
  if (source.aiOnly && source.strict && !isAiRelevant(title, forFilter, true)) return null;

  return {
    id: itemId(url),
    title,
    url,
    source: source.id,
    published: published.toISOString(),
    firstSeen: now.toISOString(),
    summary,
    topic: classify(title, summary),
  };
}

async function pool(list, limit, fn) {
  const results = new Array(list.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (next < list.length) {
        const i = next++;
        results[i] = await fn(list[i]);
      }
    }),
  );
  return results;
}

// ---------- run ----------

const results = await pool(sources, CONCURRENCY, async (source) => {
  try {
    const entries = await fetchFeed(source);
    const items = entries.map((e) => toItem(source, e)).filter(Boolean);
    return { source, ok: true, scanned: entries.length, items };
  } catch (err) {
    return { source, ok: false, error: String(err.message ?? err).slice(0, 120), items: [] };
  }
});

const okCount = results.filter((r) => r.ok).length;
console.log(`Feeds: ${okCount}/${sources.length} reachable`);
for (const r of results) {
  console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.source.id.padEnd(20)} ${r.ok ? `${r.items.length}/${r.scanned} kept` : r.error}`);
}
if (okCount === 0) {
  console.error('No feed was reachable: leaving data untouched.');
  process.exit(1);
}

// Merge: keep known items as they are (stable first-seen), add new ones, drop expired ones.
const byId = new Map(prev.items.map((i) => [i.id, i]));
let added = 0;
for (const r of results) {
  for (const it of r.items) {
    if (!byId.has(it.id)) {
      byId.set(it.id, it);
      added++;
    }
  }
}
// Re-apply the current topic rules to everything stored, so rule improvements are retroactive.
for (const i of byId.values()) i.topic = classify(i.title, i.summary);
// Same headline from the same outlet under two URLs (e.g. AMP, or a re-slugged post): keep the first.
const seenTitle = new Set();
const cutoff = now.getTime() - RETAIN_DAYS * DAY;
const merged = [...byId.values()]
  .filter((i) => new Date(i.published).getTime() >= cutoff && sourceMap.has(i.source))
  .sort((a, b) => b.published.localeCompare(a.published) || a.id.localeCompare(b.id))
  .filter((i) => {
    const k = `${i.source}|${i.title.toLowerCase()}`;
    if (seenTitle.has(k)) return false;
    seenTitle.add(k);
    return true;
  });

// Freeze completed weeks that have enough data (see firstWeek below).
mkdirSync(join(DIR, 'weeks'), { recursive: true });
const coverageStart = prevStatus.coverageStart ?? now.toISOString();
const currentWeek = isoWeek(now);
// Feeds only expose their latest entries, so weeks before tracking began would be lopsided
// (long-history feeds dominate). Freeze only weeks from the one we started in onwards.
const firstWeek = isoWeek(new Date(coverageStart));
const frozenNow = [];
const byWeek = new Map();
for (const it of merged) {
  const w = isoWeek(new Date(it.published));
  if (!byWeek.has(w.key)) byWeek.set(w.key, { w, items: [] });
  byWeek.get(w.key).items.push(it);
}
for (const [key, { w, items }] of byWeek) {
  const file = join(DIR, 'weeks', `${key}.json`);
  if (key >= currentWeek.key || key < firstWeek.key || existsSync(file) || items.length < MIN_ITEMS_TO_FREEZE) continue;
  const brief = {
    key,
    start: w.start.toISOString(),
    end: w.end.toISOString(),
    partial: w.start.getTime() < new Date(coverageStart).getTime() - DAY,
    frozenAt: now.toISOString(),
    ...buildBrief(items, sourceMap),
  };
  frozenNow.push(key);
  if (!DRY) writeFileSync(file, `${JSON.stringify(brief, null, 1)}\n`);
}

// Status: only the fields that change on real transitions, so quiet runs produce no diff.
const status = { coverageStart, updatedAt: prevStatus.updatedAt, sources: {} };
for (const r of results) {
  const before = prevStatus.sources?.[r.source.id];
  const mine = merged.filter((i) => i.source === r.source.id);
  status.sources[r.source.id] = r.ok
    ? { failing: false, items: mine.length, newest: mine[0]?.published ?? null }
    : { failing: true, since: before?.failing ? before.since : now.toISOString(), error: r.error, items: mine.length, newest: mine[0]?.published ?? null };
}
const signature = (s) => JSON.stringify({ ...s, updatedAt: null });
const itemsChanged = JSON.stringify(prev.items.map((i) => i.id)) !== JSON.stringify(merged.map((i) => i.id));
const statusChanged = signature(status) !== signature(prevStatus);

console.log(`New items: ${added}. Stored: ${merged.length}. Frozen weeks: ${frozenNow.join(', ') || 'none'}.`);
if (DRY) process.exit(0);

if (itemsChanged || statusChanged) status.updatedAt = now.toISOString();
if (itemsChanged || !existsSync(join(DIR, 'items.json'))) {
  writeFileSync(join(DIR, 'items.json'), stringifyItems({ updatedAt: now.toISOString() }, merged));
}
if (statusChanged || itemsChanged) writeFileSync(join(DIR, 'status.json'), `${JSON.stringify(status, null, 1)}\n`);
console.log(itemsChanged || statusChanged ? 'Data updated.' : 'No changes.');
