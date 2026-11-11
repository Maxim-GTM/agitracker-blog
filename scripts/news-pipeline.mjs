// The news pipeline as a pure function: feeds in, changed data files out. No file or network
// assumptions beyond `fetch` (scripts/fetch-news.mjs does the file I/O). Only headline, link, source, date and a short
// feed-supplied excerpt (<= 220 chars) are kept: never full text.
import { XMLParser } from 'fast-xml-parser';
import { buildBrief, classify, isAiRelevant, isoWeek, itemId, normalizeUrl, stringifyItems } from './news-core.mjs';

export const RETAIN_DAYS = 35;
const MIN_ITEMS_TO_FREEZE = 15;
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;
const DAY = 86_400_000;
export const UA = 'agitracker-newsbot/1.0 (+https://agitracker.io/news/sources/)';

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
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
const stripTags = (s) => s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ');

/** HTML -> plain single-line text. Output is escaped again wherever it is rendered. */
function plain(html) {
  let s = decode(stripTags(String(html)));
  if (s.includes('<')) s = stripTags(s);
  return s.replace(/\s+/g, ' ').trim();
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

const parseFeed = (xml) => {
  const doc = parser.parse(xml);
  return asArray(doc.rss?.channel?.item ?? doc.feed?.entry ?? doc['rdf:RDF']?.item ?? doc.RDF?.item);
};

async function fetchFeed(source, fetchImpl) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchImpl(source.feed, {
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
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastError;
}

function toItem(source, entry, now) {
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

  return { id: itemId(url), title, url, source: source.id, published: published.toISOString(), firstSeen: now.toISOString(), summary, topic: classify(title, summary) };
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

/**
 * @param {object} input
 * @param {any[]} input.sources         contents of sources.json
 * @param {{ items: any[] }} input.prev contents of items.json (or { items: [] })
 * @param {any} input.prevStatus        contents of status.json (or empty)
 * @param {Set<string>} input.frozenKeys week keys that already have a frozen file
 * @returns {Promise<{ ok: boolean, log: string[], added: number, files: Record<string, string> }>}
 */
export async function runPipeline({ sources, prev, prevStatus, frozenKeys, now = new Date(), fetchImpl = fetch }) {
  const log = [];
  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  const results = await pool(sources, CONCURRENCY, async (source) => {
    try {
      const entries = await fetchFeed(source, fetchImpl);
      return { source, ok: true, scanned: entries.length, items: entries.map((e) => toItem(source, e, now)).filter(Boolean) };
    } catch (err) {
      return { source, ok: false, error: String(err?.message ?? err).slice(0, 120), items: [] };
    }
  });

  const okCount = results.filter((r) => r.ok).length;
  log.push(`Feeds: ${okCount}/${sources.length} reachable`);
  for (const r of results) log.push(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.source.id.padEnd(20)} ${r.ok ? `${r.items.length}/${r.scanned} kept` : r.error}`);
  // Never overwrite good data because the network (or this host) is down.
  if (okCount < Math.ceil(sources.length / 4)) {
    log.push('Too few feeds reachable: leaving data untouched.');
    return { ok: false, log, added: 0, files: {} };
  }

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

  // Freeze completed weeks. Feeds only expose recent entries, so weeks before tracking began
  // would be lopsided; freeze only from the week tracking started in.
  const files = {};
  const coverageStart = prevStatus.coverageStart ?? now.toISOString();
  const currentWeek = isoWeek(now);
  const firstWeek = isoWeek(new Date(coverageStart));
  const byWeek = new Map();
  for (const it of merged) {
    const w = isoWeek(new Date(it.published));
    if (!byWeek.has(w.key)) byWeek.set(w.key, { w, items: [] });
    byWeek.get(w.key).items.push(it);
  }
  const frozenNow = [];
  for (const [key, { w, items }] of byWeek) {
    if (key >= currentWeek.key || key < firstWeek.key || frozenKeys.has(key) || items.length < MIN_ITEMS_TO_FREEZE) continue;
    const brief = {
      key,
      start: w.start.toISOString(),
      end: w.end.toISOString(),
      partial: w.start.getTime() < new Date(coverageStart).getTime() - DAY,
      frozenAt: now.toISOString(),
      ...buildBrief(items, sourceMap),
    };
    files[`weeks/${key}.json`] = `${JSON.stringify(brief, null, 1)}\n`;
    frozenNow.push(key);
  }

  // Status holds only fields that change on real transitions, so quiet runs produce no diff.
  const status = { coverageStart, updatedAt: prevStatus.updatedAt ?? null, sources: {} };
  for (const r of results) {
    const before = prevStatus.sources?.[r.source.id];
    const mine = merged.filter((i) => i.source === r.source.id);
    const base = { items: mine.length, newest: mine[0]?.published ?? null };
    status.sources[r.source.id] = r.ok
      ? { failing: false, ...base }
      : { failing: true, since: before?.failing ? before.since : now.toISOString(), error: r.error, ...base };
  }
  const signature = (s) => JSON.stringify({ ...s, updatedAt: null });
  const itemsChanged = JSON.stringify(prev.items.map((i) => i.id)) !== JSON.stringify(merged.map((i) => i.id));
  const statusChanged = signature(status) !== signature(prevStatus);
  if (itemsChanged || statusChanged) status.updatedAt = now.toISOString();
  if (itemsChanged) files['items.json'] = stringifyItems({ updatedAt: now.toISOString() }, merged);
  if (itemsChanged || statusChanged) files['status.json'] = `${JSON.stringify(status, null, 1)}\n`;

  log.push(`New items: ${added}. Stored: ${merged.length}. Frozen weeks: ${frozenNow.join(', ') || 'none'}.`);
  return { ok: true, log, added, files };
}
