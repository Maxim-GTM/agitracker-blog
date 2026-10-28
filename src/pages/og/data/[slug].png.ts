import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg } from '../../../lib/og';
import { datasets, type Dataset } from '../../../lib/datasets';

export const getStaticPaths: GetStaticPaths = () => datasets.map((d) => ({ params: { slug: d.slug }, props: { d } }));

export const GET: APIRoute<{ d: Dataset }> = async ({ props: { d } }) => {
  const png = await renderOg({
    title: d.h1,
    kicker: 'Open dataset',
    tags: [{ name: 'Data', swatch: 'sky' }],
    footer: `${d.rows.length} records  /  CC BY 4.0  /  agitracker.io/data`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
