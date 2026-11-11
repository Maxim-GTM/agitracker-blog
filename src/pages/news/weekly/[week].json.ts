import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../../../site.config';
import { briefTitle, getBriefs, sourceName, topicMeta, weekUrl } from '../../../lib/news';
import type { NewsItem } from '../../../lib/news';

export const getStaticPaths = (() => getBriefs().map((brief) => ({ params: { week: brief.key }, props: { brief } }))) satisfies GetStaticPaths;

const row = (it: NewsItem, rank?: number) => ({
  ...(rank ? { rank } : {}),
  title: it.title,
  url: it.url,
  source: sourceName(it.source),
  published: it.published,
  topic: topicMeta(it.topic).label,
});

export const GET: APIRoute<{ brief: ReturnType<typeof getBriefs>[number] }> = ({ props: { brief } }) =>
  new Response(
    JSON.stringify(
      {
        title: briefTitle(brief),
        page: new URL(weekUrl(brief.key), SITE.url).href,
        week: brief.key,
        start: brief.start,
        end: brief.end,
        inProgress: brief.live,
        stats: brief.stats,
        note: 'Headlines and links belong to their publishers. Please link to the page above when you reference this brief.',
        topStories: brief.top.map((s, i) => ({ ...row(s.lead, i + 1), outlets: s.sources, alsoReportedBy: s.also.map((a) => ({ source: sourceName(a.source), url: a.url })) })),
        sections: brief.sections.map((s) => ({ topic: topicMeta(s.topic).label, stories: s.stories.map((st) => row(st.lead)) })),
        fromTheLabs: brief.labs.map((i) => row(i)),
        pressReleases: brief.newswire.map((i) => row(i)),
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
