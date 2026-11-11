// Local/manual run of the news pipeline against src/data/news (production refreshes run in the
// Cloudflare cron Worker, workers/news-cron, which commits the same files through the GitHub API).
//
//   node scripts/fetch-news.mjs            fetch and write
//   node scripts/fetch-news.mjs --dry      fetch and report only
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runPipeline } from './news-pipeline.mjs';

const DIR = 'src/data/news';
const DRY = process.argv.includes('--dry');
const readJson = (file, fallback) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback);

const { ok, log, files } = await runPipeline({
  sources: readJson(join(DIR, 'sources.json'), []),
  prev: readJson(join(DIR, 'items.json'), { updatedAt: null, items: [] }),
  prevStatus: readJson(join(DIR, 'status.json'), { coverageStart: null, updatedAt: null, sources: {} }),
  frozenKeys: new Set(readdirSync(join(DIR, 'weeks')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5))),
});
console.log(log.join('\n'));
if (!ok) process.exit(1);
const names = Object.keys(files);
if (DRY || names.length === 0) {
  console.log(DRY ? `Dry run: would write ${names.join(', ') || 'nothing'}.` : 'No changes.');
} else {
  for (const [name, body] of Object.entries(files)) {
    const path = join(DIR, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
  }
  console.log(`Data updated: ${names.join(', ')}.`);
}
