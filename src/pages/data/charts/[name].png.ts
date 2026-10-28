import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { datasets, type Dataset } from '../../../lib/datasets';
import { renderChart, type ChartSpec } from '../../../lib/charts';

// PNG versions of every /data/ chart, with title and source footer drawn in,
// for embedding in other sites, slides and social posts.
export const getStaticPaths: GetStaticPaths = () =>
  datasets.flatMap((d) =>
    (d.charts ?? []).map((c) => ({ params: { name: `${d.slug}-${c.id}` }, props: { d, c } })),
  );

export const GET: APIRoute<{ d: Dataset; c: ChartSpec }> = async ({ props: { d, c } }) => {
  const sourceLine = `Source: ${c.source ?? `agitracker.io analysis of ${d.rows.length} records`}. Data: CC BY 4.0`;
  const svg = renderChart(c, d.rows, { standalone: true, sourceLine });
  const png = await sharp(Buffer.from(svg), { density: 192 }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
