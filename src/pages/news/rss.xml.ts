import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../../site.config';
import { items, sourceName, topicMeta, updatedAt } from '../../lib/news';

// Live headline feed: title, original link, source and publisher-supplied excerpt only.
export const GET: APIRoute = (context) =>
  rss({
    title: `${SITE.name} AI News`,
    description: 'AI headlines from labs, publications and newswires, collected daily. Links go to the original sources.',
    site: context.site ?? SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    customData: [
      `<language>${SITE.lang}</language>`,
      `<atom:link href="${new URL('/news/rss.xml', SITE.url)}" rel="self" type="application/rss+xml" />`,
      `<lastBuildDate>${updatedAt.toUTCString()}</lastBuildDate>`,
    ].join(''),
    items: items.slice(0, 60).map((i) => ({
      title: `${i.title} (${sourceName(i.source)})`,
      link: i.url,
      pubDate: new Date(i.published),
      description: i.summary || i.title,
      categories: [topicMeta(i.topic).label],
      customData: `<dc:source>${sourceName(i.source).replace(/&/g, '&amp;')}</dc:source>`,
    })),
  });
