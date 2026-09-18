import type { APIRoute } from 'astro';
import { SITE } from '../site.config';

// Search engines and AI crawlers are welcome: being cited is the point.
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
