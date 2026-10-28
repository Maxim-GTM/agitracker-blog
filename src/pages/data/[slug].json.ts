import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../../site.config';
import { datasets, toJson, type Dataset } from '../../lib/datasets';

export const getStaticPaths: GetStaticPaths = () => datasets.map((d) => ({ params: { slug: d.slug }, props: { d } }));

export const GET: APIRoute<{ d: Dataset }> = ({ props: { d } }) =>
  new Response(JSON.stringify(toJson(d, SITE.url), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
