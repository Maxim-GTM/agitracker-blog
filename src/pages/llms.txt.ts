import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';
import { datasets, datasetUrl } from '../lib/datasets';

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
