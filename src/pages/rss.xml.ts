import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getAuthor } from '../data/authors';
import { SITE } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';

const md = new MarkdownIt({ html: true, linkify: true });

export const GET: APIRoute = async (context) => {
  const posts = (await getPosts()).filter((p) => !p.data.noindex);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    customData: [
      `<language>${SITE.lang}</language>`,
      `<atom:link href="${new URL('/rss.xml', SITE.url)}" rel="self" type="application/rss+xml" />`,
      `<image><url>${new URL('/icon-512.png', SITE.url)}</url><title>${SITE.name}</title><link>${SITE.url}/</link></image>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      link: postUrl(post),
      pubDate: post.data.pubDate,
      description: post.data.description,
      categories: post.data.tags,
      customData: `<dc:creator><![CDATA[${getAuthor(post.data.author).name}]]></dc:creator>`,
      content: sanitizeHtml(md.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
  });
};
