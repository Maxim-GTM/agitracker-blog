import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { formatDate, getPosts, postUrl } from '../lib/posts';
import { datasets, datasetUrl } from '../lib/datasets';

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).filter((p) => !p.data.noindex);
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    ...datasets.flatMap((d) => [
      '---',
      '',
      `# ${d.h1}`,
      '',
      `URL: ${new URL(datasetUrl(d), SITE.url).href}`,
      `Updated: ${d.updated}  |  License: CC BY 4.0  |  CSV: ${new URL(`/data/${d.slug}.csv`, SITE.url).href}`,
      '',
      ...d.intro,
      '',
      '## Key findings',
      '',
      ...d.keyFindings.map((f) => `- ${f.text} (Source: ${f.source.title}, ${f.source.url})`),
      '',
      '## Methodology',
      '',
      ...d.methodology,
      '',
    ]),
    ...posts.flatMap((p) => [
      '---',
      '',
      `# ${p.data.title}`,
      '',
      `URL: ${new URL(postUrl(p), SITE.url).href}`,
      `Published: ${formatDate(p.data.pubDate)}${p.data.updatedDate ? ` (updated ${formatDate(p.data.updatedDate)})` : ''}`,
      p.data.tags.length ? `Topics: ${p.data.tags.join(', ')}` : '',
      '',
      p.body?.trim() ?? '',
      '',
    ]),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
