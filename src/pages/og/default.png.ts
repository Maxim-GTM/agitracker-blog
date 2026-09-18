import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';
import { SITE } from '../../site.config';

export const GET: APIRoute = async () => {
  const png = await renderOg({
    title: SITE.tagline,
    tags: [
      { name: 'Benchmarks', swatch: 'signal' },
      { name: 'Compute', swatch: 'sun' },
      { name: 'Forecasts', swatch: 'lilac' },
    ],
    footer: 'agitracker.io',
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
