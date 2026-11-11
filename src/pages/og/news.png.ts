import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';
import { sources } from '../../lib/news';

export const GET: APIRoute = async () => {
  const png = await renderOg({
    kicker: 'Daily',
    title: 'Latest AI news, updated daily',
    tags: [
      { name: 'Models', swatch: 'lilac' },
      { name: 'Products', swatch: 'signal' },
      { name: 'Business', swatch: 'sun' },
    ],
    footer: `${sources.length} sources`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
