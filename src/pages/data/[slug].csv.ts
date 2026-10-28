import type { APIRoute, GetStaticPaths } from 'astro';
import { datasets, toCsv, type Dataset } from '../../lib/datasets';

export const getStaticPaths: GetStaticPaths = () => datasets.map((d) => ({ params: { slug: d.slug }, props: { d } }));

export const GET: APIRoute<{ d: Dataset }> = ({ props: { d } }) =>
  new Response(toCsv(d), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
