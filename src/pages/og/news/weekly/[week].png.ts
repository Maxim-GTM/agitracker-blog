import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg } from '../../../../lib/og';
import { briefTitle, getBriefs, topicMeta, topicSwatch } from '../../../../lib/news';

export const getStaticPaths = (() => getBriefs().map((brief) => ({ params: { week: brief.key }, props: { brief } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ brief: ReturnType<typeof getBriefs>[number] }> = async ({ props: { brief } }) => {
  const png = await renderOg({
    kicker: 'Weekly brief',
    title: briefTitle(brief),
    tags: brief.sections.slice(0, 3).map((s) => ({ name: topicMeta(s.topic).label, swatch: topicSwatch(s.topic) })),
    footer: `${brief.stats.stories} stories / ${brief.stats.sources} sources`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
