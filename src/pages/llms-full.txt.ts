import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { formatDate, getPosts, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).filter((p) => !p.data.noindex);
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
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
