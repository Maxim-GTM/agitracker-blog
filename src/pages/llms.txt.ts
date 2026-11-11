import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';
import { datasets, datasetUrl } from '../lib/datasets';
import { briefTitle, getBriefs, weekUrl } from '../lib/news';

// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and answer engines.
export const GET: APIRoute = async () => {
  const posts = (await getPosts()).filter((p) => !p.data.noindex);
  const abs = (path: string) => new URL(path, SITE.url).href;
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `Full text of every article: ${abs('/llms-full.txt')}`,
    '',
    '## Data',
    '',
    `Open datasets (CC BY 4.0), each with CSV and JSON downloads: ${abs('/data/')}`,
    '',
    ...datasets.map((d) => `- [${d.h1}](${abs(datasetUrl(d))}): ${d.summary} CSV: ${abs(`/data/${d.slug}.csv`)}`),
    '',
    '## AI news',
    '',
    `- [Live AI news feed](${abs('/news/')}): headlines from AI labs, publications and newswires, refreshed about every 30 minutes. RSS: ${abs('/news/rss.xml')}`,
    `- [Weekly briefs](${abs('/news/weekly/')}): the top stories of each week. RSS: ${abs('/news/weekly/rss.xml')}`,
    ...getBriefs().slice(0, 8).map((b) => `- [${briefTitle(b)}](${abs(weekUrl(b.key))})`),
    `- [Sources and method](${abs('/news/sources/')})`,
    '',
    '## Articles',
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(postUrl(p))}): ${p.data.description}`),
    '',
    '## Site',
    '',
    `- [All articles](${abs('/blog/')})`,
    `- [Open datasets](${abs('/data/')})`,
    `- [Topics](${abs('/tags/')})`,
    `- [About](${abs('/about/')})`,
    `- [RSS feed](${abs('/rss.xml')})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
