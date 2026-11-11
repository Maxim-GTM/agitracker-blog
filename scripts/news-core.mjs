// Shared news logic: used by the fetcher (scripts/fetch-news.mjs, Node) and by the
// Astro pages (src/lib/news.ts) so a weekly brief is built the same way everywhere.
import { createHash } from 'node:crypto';

/**
 * @typedef {{ id: string, title: string, url: string, source: string, published: string,
 *   firstSeen: string, summary: string, topic: string }} NewsItem
 * @typedef {{ id: string, name: string, kind: string, site: string, feed: string, aiOnly: boolean,
 *   strict?: boolean, snippet?: boolean }} NewsSource
 * @typedef {{ lead: NewsItem, also: { title: string, url: string, source: string }[], sources: number, line: number, score: number }} Story
 */

export const KINDS = {
  lab: { label: 'AI lab', weight: 3 },
  company: { label: 'Company', weight: 3 },
  publication: { label: 'Publication', weight: 2 },
  research: { label: 'Research', weight: 2 },
  community: { label: 'Newsletter / community', weight: 1.5 },
  newswire: { label: 'Newswire', weight: 1 },
};

/** Display order matters: it is the section order of the weekly brief. */
export const TOPICS = [
  { id: 'models', label: 'Models & research', blurb: 'New models, papers, benchmarks and capability results.' },
  { id: 'products', label: 'Products & launches', blurb: 'Launches, features and agents that people can use now.' },
  { id: 'business', label: 'Business & funding', blurb: 'Funding, acquisitions, partnerships and revenue.' },
  { id: 'policy', label: 'Policy & safety', blurb: 'Regulation, court cases, copyright and AI safety.' },
  { id: 'infrastructure', label: 'Chips & infrastructure', blurb: 'GPUs, data centres, energy and compute.' },
  { id: 'open-source', label: 'Open source', blurb: 'Open-weight models, tools and community releases.' },
  { id: 'general', label: 'More AI news', blurb: 'Everything else worth a look this week.' },
];

const AI_TERMS =
  /\b(ai|a\.i\.|artificial intelligence|machine learning|deep learning|generative|genai|llms?|large language models?|chatbots?|chatgpt|gpt-?\d[\w.-]*|openai|anthropic|claude|gemini|gemma|deepmind|copilot|llama|mistral|deepseek|xai|grok|perplexity|cursor|midjourney|stable diffusion|sora|neural networks?|foundation models?|agentic|ai agents?|transformers?|nvidia|hugging face|diffusion models?|rag|mcp|reasoning models?|superintelligence|agi)\b/i;
const AI_TITLE_STRICT =
  /\b(ai|a\.i\.|artificial intelligence|llms?|generative|genai|chatgpt|openai|anthropic|gemini|agentic|ai agents?|machine learning)\b/i;

/** Is this item about AI? `strict` (newswires, general feeds) requires an AI term in the headline. */
export function isAiRelevant(title, summary, strict = false) {
  if (AI_TITLE_STRICT.test(title)) return true;
  if (strict) return false;
  return AI_TERMS.test(title) || AI_TERMS.test(summary);
}

const RULES = [
  ['policy', /\b(regulat\w*|lawsuits?|sues?|sued|court|judge|ruling|congress|senate|legislat\w*|copyright\w*|antitrust|ftc|eu ai act|ai safety|safety|alignment|deepfakes?|privacy|governance|executive order|export controls?|attorney general|lawmakers?|probe|investigation|white house|senators?|fbi|government|commerce department|bioweapons?)\b/gi],
  ['business', /\b(raises?|raised|funding|valuation|series [a-f]|invests?|investments?|investors?|acquir\w*|acquisitions?|merger|ipo|revenue|earnings|layoffs?|stake|buyout|profit|shares|stock|sells off|billion|trillion)\b/gi],
  ['infrastructure', /\b(gpus?|tpus?|chips?|semiconductors?|data ?cent(?:er|re)s?|compute|tsmc|hbm|power grid|electricity|nuclear|supercomputers?|datacenters?|ai factor(?:y|ies)|blackwell|rubin)\b/gi],
  ['open-source', /\b(open[- ]source|open[- ]weights?|open models?|hugging face|apache 2\.0|permissive licen[cs]e)\b/gi],
  ['models', /\b(models?|benchmarks?|papers?|researchers?|reasoning|pre-?training|post-?training|fine-?tun\w*|architectures?|datasets?|arxiv|state-of-the-art|sota|scaling|multimodal|embeddings?|gpt-?\d\w*|gemini \d\w*|claude (?:opus|sonnet|haiku|fable|mythos|\d\S*)|llama \d|qwen\d?|deepseek)\b/gi],
  ['products', /\b(launch\w*|introduc\w*|unveils?|rolls? out|rolling out|now available|is available|release[sd]?|debuts?|ships?|rollout|agents?|assistants?|copilot|chatgpt|apps?|tools?|features?|pricing|plugins?|sdk|api|now (?:on|in|with)|coming to|try)\b/gi],
];

/** Keyword classifier: headline hits count triple, excerpt hits are only a tiebreaker. Approximate by design. */
export function classify(title, summary = '') {
  let best = 'general';
  let bestScore = 2.9; // need at least one headline hit (3) or three excerpt hits
  for (const [topic, re] of RULES) {
    const inTitle = (title.match(re) ?? []).length;
    const inBody = Math.min((summary.match(re) ?? []).length, 3);
    const score = 3 * inTitle + inBody;
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

const TRACKING = /^(utm_|fbclid|gclid|mc_|ref$|ref_|cmpid|ocid|src$|source$|taid|guccounter|campaign|ito$|at_|xtor)/i;

/** Drop tracking parameters and fragments so the same article collapses to one URL. */
export function normalizeUrl(raw) {
  try {
    const u = new URL(raw.trim());
    if (!/^https?:$/.test(u.protocol)) return null;
    u.hash = '';
    u.hostname = u.hostname.toLowerCase();
    for (const key of [...u.searchParams.keys()]) if (TRACKING.test(key)) u.searchParams.delete(key);
    u.searchParams.sort();
    let s = u.href;
    if (u.pathname !== '/' && s.endsWith('/') && !u.search) s = s.slice(0, -1);
    return s;
  } catch {
    return null;
  }
}

export const itemId = (url) => createHash('sha1').update(url).digest('hex').slice(0, 12);

// ---------- ISO weeks (Monday start, UTC) ----------

const DAY = 86_400_000;

/** @param {Date} date */
export function isoWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  const start = new Date(d.getTime() - dow * DAY);
  const thursday = new Date(start.getTime() + 3 * DAY);
  const year = thursday.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const week = Math.floor((thursday.getTime() - jan1.getTime()) / (7 * DAY)) + 1;
  const end = new Date(start.getTime() + 7 * DAY - 1); // Sunday 23:59:59.999
  return { year, week, key: `${year}-w${String(week).padStart(2, '0')}`, start, end };
}

/** "2026-w46" -> same shape as isoWeek(); null when malformed. */
export function parseWeekKey(key) {
  const m = /^(\d{4})-w(\d{2})$/.exec(key);
  if (!m) return null;
  const year = Number(m[1]);
  const week = Number(m[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week1Monday = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * DAY);
  const start = new Date(week1Monday.getTime() + (week - 1) * 7 * DAY);
  const w = isoWeek(start);
  return w.key === key ? w : null;
}

// ---------- Story clustering and weekly brief ----------

const STOP = new Set(
  'the a an and or of to in on for with from by at as is are was were be been it its this that these those how what why when who will can new says said after over into about more than up out your you our their his her they we not but just now could would should may might has have had also via vs per amid ahead'.split(' '),
);

function tokens(title) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9.\- ]+/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/**
 * Groups near-identical headlines from different outlets into one story, and ranks stories:
 * primary sources weigh more, and every additional independent outlet adds to the score.
 * Similarity is IDF-weighted, so rare shared words ("affair", "IPO") count for more than
 * words every headline uses ("Nvidia", "model").
 * @param {NewsItem[]} items
 * @param {Map<string, NewsSource>} sources
 * @returns {Story[]}
 */
export function clusterStories(items, sources) {
  const weight = (it) => KINDS[sources.get(it.source)?.kind ?? 'publication']?.weight ?? 1;
  const ordered = [...items].sort((a, b) => weight(b) - weight(a) || a.published.localeCompare(b.published));
  const toks = new Map(ordered.map((it) => [it.id, tokens(it.title)]));
  const df = new Map();
  for (const t of toks.values()) for (const w of t) df.set(w, (df.get(w) ?? 0) + 1);
  const idf = (w) => Math.log((ordered.length + 1) / (df.get(w) ?? 1));

  /** @type {{ lead: NewsItem, tok: Set<string>, members: NewsItem[], line?: number }[]} */
  const clusters = [];
  for (const it of ordered) {
    const tok = toks.get(it.id);
    let home;
    let homeScore = 0;
    for (const c of clusters) {
      if (c.members.some((m) => m.source === it.source)) continue;
      let shared = 0;
      let sharedN = 0;
      let union = 0;
      for (const w of tok) {
        const x = idf(w);
        union += x;
        if (c.tok.has(w)) {
          shared += x;
          sharedN++;
        }
      }
      for (const w of c.tok) if (!tok.has(w)) union += idf(w);
      const sim = union ? shared / union : 0;
      // Two rare words in common (weight >= 6) and a reasonable overlap, or a very strong overlap.
      if (sharedN >= 2 && ((shared >= 6 && sim >= 0.22) || sim >= 0.5) && sim > homeScore) {
        home = c;
        homeScore = sim;
      }
    }
    if (home) {
      home.members.push(it);
      for (const w of tok) home.tok.add(w);
    } else {
      clusters.push({ lead: it, tok: new Set(tok), members: [it] });
    }
  }
  // Second pass: group clusters that follow the same running story (many angles on one event),
  // so one big story cannot fill the whole headline list.
  const line = clusters.map((_, i) => i);
  const find = (i) => (line[i] === i ? i : (line[i] = find(line[i])));
  for (let a = 0; a < clusters.length; a++) {
    for (let b = a + 1; b < clusters.length; b++) {
      let shared = 0;
      let sharedN = 0;
      let union = 0;
      for (const w of clusters[a].tok) {
        const x = idf(w);
        union += x;
        if (clusters[b].tok.has(w)) {
          shared += x;
          sharedN++;
        }
      }
      for (const w of clusters[b].tok) if (!clusters[a].tok.has(w)) union += idf(w);
      if (sharedN >= 2 && shared >= 6 && shared / union >= 0.12) line[find(b)] = find(a);
    }
  }
  clusters.forEach((c, i) => (c.line = find(i)));
  return clusters
    .map((c) => {
      const outlets = new Set(c.members.map((m) => m.source)).size;
      const lead = c.lead;
      return {
        lead,
        also: c.members.filter((m) => m !== lead).map((m) => ({ title: m.title, url: m.url, source: m.source })),
        sources: outlets,
        line: c.line,
        score: weight(lead) + 2 * (outlets - 1) + (lead.summary ? 0.25 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || b.lead.published.localeCompare(a.lead.published));
}

/**
 * The weekly brief: headline stories, a few per topic, primary-source announcements and press releases.
 * @param {NewsItem[]} items  items published inside the week
 * @param {Map<string, NewsSource>} sources
 */
export function buildBrief(items, sources) {
  const kindOf = (it) => sources.get(it.source)?.kind ?? 'publication';
  const wire = items.filter((i) => kindOf(i) === 'newswire');
  const editorial = items.filter((i) => kindOf(i) !== 'newswire');
  const stories = clusterStories(editorial, sources);

  // Headline list: at most two stories per running storyline, so one event cannot take all eight slots.
  const perLine = new Map();
  const top = [];
  for (const st of stories) {
    if ((perLine.get(st.line) ?? 0) >= 2) continue;
    perLine.set(st.line, (perLine.get(st.line) ?? 0) + 1);
    top.push(st);
    if (top.length === 8) break;
  }
  const used = new Set(top.map((s) => s.lead.id));
  const sections = TOPICS.map((t) => {
    const inTopic = stories.filter((s) => s.lead.topic === t.id);
    return {
      topic: t.id,
      count: inTopic.length,
      stories: inTopic.filter((s) => !used.has(s.lead.id)).slice(0, 6),
    };
  }).filter((s) => s.stories.length > 0);

  const labs = editorial
    .filter((i) => ['lab', 'company'].includes(kindOf(i)) && !used.has(i.id))
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, 12);

  const wireStories = clusterStories(wire, sources).slice(0, 6).map((s) => s.lead);

  return {
    stats: {
      items: items.length,
      stories: stories.length,
      sources: new Set(items.map((i) => i.source)).size,
      byTopic: Object.fromEntries(TOPICS.map((t) => [t.id, stories.filter((s) => s.lead.topic === t.id).length])),
    },
    top,
    sections,
    labs,
    newswire: wireStories,
  };
}

/** Compact one-item-per-line JSON so data commits produce readable diffs. */
export function stringifyItems(meta, items) {
  return `{${Object.entries(meta)
    .map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`)
    .join(',')},"items":[\n${items.map((i) => JSON.stringify(i)).join(',\n')}\n]}\n`;
}
