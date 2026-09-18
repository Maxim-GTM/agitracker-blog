// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { readPostMeta } from './scripts/post-dates.mjs';
import rehypeTableWrap from './scripts/rehype-table-wrap.mjs';

const SITE = 'https://agitracker.io';
const posts = readPostMeta('src/content/blog');

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => {
        const slug = page.match(/\/blog\/(.+)\/$/)?.[1];
        return !page.includes('/404') && !(slug && posts.hidden.has(slug));
      },
      // Google ignores changefreq/priority; an accurate <lastmod> is what matters.
      serialize(item) {
        const slug = item.url.match(/\/blog\/(.+)\/$/)?.[1];
        if (slug && posts.lastmod.has(slug)) item.lastmod = posts.lastmod.get(slug);
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'vitesse-dark', wrap: false },
    processor: unified({
      rehypePlugins: [
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
          },
        ],
        rehypeTableWrap,
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  image: { responsiveStyles: true },
});
