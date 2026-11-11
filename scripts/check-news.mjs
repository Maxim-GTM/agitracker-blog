// Sanity checks for the news data. Fails on structural problems; warns on staleness.
//   node scripts/check-news.mjs            errors fail, staleness warns
//   node scripts/check-news.mjs --strict   staleness fails too (use in monitoring)
import { readFileSync, readdirSync } from 'node:fs';
import { TOPICS } from './news-core.mjs';

const DIR = 'src/data/news';
const read = (f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
const strict = process.argv.includes('--strict');
const errors = [];
const warnings = [];

const sources = read('sources.json');
const ids = new Set(sources.map((s) => s.id));
if (ids.size !== sources.length) errors.push('sources.json has duplicate ids');
for (const s of sources) {
  if (!/^https:\/\//.test(s.feed) || !/^https?:\/\//.test(s.site)) errors.push(`${s.id}: feed/site must be URLs`);
}

const { updatedAt, items } = read('items.json');
const topics = new Set(TOPICS.map((t) => t.id));
const seen = new Set();
for (const i of items) {
  if (seen.has(i.id)) errors.push(`duplicate item ${i.id}`);
  seen.add(i.id);
  if (!ids.has(i.source)) errors.push(`${i.id}: unknown source ${i.source}`);
  if (!topics.has(i.topic)) errors.push(`${i.id}: unknown topic ${i.topic}`);
  if (!/^https?:\/\//.test(i.url)) errors.push(`${i.id}: bad url`);
  if (i.summary.length > 221) errors.push(`${i.id}: excerpt longer than 220 characters`);
  if (Number.isNaN(Date.parse(i.published))) errors.push(`${i.id}: bad date`);
}

for (const f of readdirSync(`${DIR}/weeks`).filter((f) => f.endsWith('.json'))) {
  const w = read(`weeks/${f}`);
  if (`${w.key}.json` !== f) errors.push(`${f}: key mismatch`);
  if (!w.top?.length) errors.push(`${f}: empty brief`);
}

const status = read('status.json');
const newest = items[0] && Date.parse(items[0].published);
if (!newest || Date.now() - newest > 12 * 3_600_000) warnings.push('newest headline is more than 12 hours old: is the fetch job running?');
for (const [id, st] of Object.entries(status.sources)) {
  if (st.failing && Date.now() - Date.parse(st.since) > 3 * 86_400_000) warnings.push(`${id}: failing since ${st.since} (${st.error})`);
}

console.log(`${items.length} items, ${sources.length} sources, last change ${updatedAt}`);
for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
