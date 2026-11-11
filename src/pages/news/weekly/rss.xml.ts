import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../../../site.config';
import { briefDescription, briefTitle, getBriefs, sourceName, weekUrl } from '../../../lib/news';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One entry per weekly brief, linking to the brief page on this site.
export const GET: APIRoute = (context) => {
  const briefs = getBriefs().filter((b) => b.stats.stories >= 8);
  return rss({
    title: `${SITE.name} AI Weekly Brief`,
    description: 'The week’s top AI stories from labs, publications and newswires, ranked and grouped by topic.',
    site: context.site ?? SITE.url,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${SITE.lang}</language><atom:link href="${new URL('/news/weekly/rss.xml', SITE.url)}" rel="self" type="application/rss+xml" />`,
    items: briefs.map((b) => ({
      title: briefTitle(b),
      link: weekUrl(b.key),
      pubDate: new Date(b.live ? b.start : (b.frozenAt ?? b.end)),
      description: briefDescription(b),
      content: `<ol>${b.top
        .map((s) => `<li><a href="${esc(s.lead.url)}">${esc(s.lead.title)}</a> (${esc(sourceName(s.lead.source))})</li>`)
        .join('')}</ol><p><a href="${new URL(weekUrl(b.key), SITE.url).href}">Read the full brief</a></p>`,
    })),
  });
};
