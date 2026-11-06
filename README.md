# agitracker.io

The agitracker.io blog: a static Astro site with a neobrutalist design built from the brand logo, generated from Markdown files.

## Publish a post

Follow [AGENTS.md](AGENTS.md) for publisher identity and attribution rules. Maxim/Bifrost pages are external vendor resources; never call them "our guide", "our comparison" or "our docs".

1. Add a Markdown file to `src/content/blog/`. The file name becomes the URL: `my-post.md` becomes `/blog/my-post/`.
   You can also run `npm run new "My post title"` to create one from the template.
2. Push to `main`. The site rebuilds, and the post appears on the home page, in the archive, on its topic pages, in the sitemap, in the RSS feed and in `llms.txt`, with its own social card.

A post only needs this frontmatter:

```md
---
title: What counts as AGI? Five definitions, compared
description: One or two sentences (120–160 characters) shown in Google results and link previews.
pubDate: 2026-09-15
tags: [AGI definitions, Explainers]
---
```

All the optional fields (`updatedDate`, `cover`, `featured`, `draft`, `faq`, `seoTitle`, `canonical`, `noindex`, `author`) are documented in [`src/content/blog/_template.md`](src/content/blog/_template.md). Files that start with `_` are never published.

- **Images:** to add a cover or inline images, make the post a folder (`my-post/index.md`) and put the images next to it: `cover: ./cover.png`. They are converted to WebP and resized automatically.
- **Drafts:** `draft: true` shows the post in `npm run dev` but never publishes it.
- **Validation:** frontmatter is checked at build time. A missing description or a bad date fails the build with a clear message instead of shipping a broken page.

## SEO built in

| What | Where |
| --- | --- |
| Title, meta description, canonical URL, robots directives | `src/components/BaseHead.astro` |
| Open Graph and Twitter/X cards, article published/modified times and tags | `src/components/BaseHead.astro` |
| A 1200×630 social image for every post, generated at build time | `src/lib/og.ts` → `/og/<slug>.png` |
| JSON-LD: WebSite, Organization, BlogPosting, BreadcrumbList, FAQPage, CollectionPage, ProfilePage | `src/lib/schema.ts` |
| XML sitemap with real `lastmod` dates; drafts and `noindex` posts left out | `astro.config.mjs` → `/sitemap-index.xml` |
| `robots.txt` pointing to the sitemap | `src/pages/robots.txt.ts` |
| RSS feed with full article content | `/rss.xml` |
| `llms.txt` and `llms-full.txt` for AI assistants and answer engines | `src/pages/llms*.txt.ts` |
| Breadcrumbs, author pages, topic pages, related posts and previous/next links for internal linking | `src/pages/`, `src/components/` |
| Favicons, touch icons and web manifest | `public/` (regenerate with `node scripts/generate-icons.mjs`) |
| Performance: static HTML, self-hosted preloaded fonts, responsive WebP images, about 2 KB of JavaScript | throughout |

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
npm run check    # type-check
```

Requires Node 22.12 or newer.

## Deploy (Cloudflare)

The site deploys to Cloudflare Workers as static files, using `wrangler.jsonc`. In the Cloudflare project settings, use:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Node version:** 22 (picked up from `.nvmrc`)

Every push to `main` then rebuilds and publishes the site. Add `agitracker.io` under the Worker's custom domains. `public/_headers` sets long-lived caching for hashed assets and a few security headers.

Keep `wrangler.jsonc` in the repo. Without it, Wrangler auto-configures the project by adding the `@astrojs/cloudflare` server adapter, which breaks the build: the social-image generator needs `sharp`, which can't run inside Cloudflare's runtime. This site doesn't need a server.

## Configure

- Site name, URL, description and social profiles: `src/site.config.ts`
- Authors: `src/data/authors.ts`. Add a key there and use it in a post with `author: <key>`.
- Colours, type and the chamfered-corner system: `src/styles/global.css`
- Article typography: `src/styles/prose.css`

## Editorial listing order

Home-page selections and the main topical listings use `src/lib/editorial-order.ts` to interleave broader AI coverage with Bifrost-heavy coverage. This is a display order, separate from the publication chronology used by feeds, metadata, article navigation and date archives. It preserves the original order within each group and spaces the available groups throughout a listing; it cannot create a 2:1 inventory where there is insufficient broader coverage. Mix the complete filtered listing before pagination or slicing, so articles are never repeated or omitted across pages.

The optional article field `coverageGroup: general-ai` or `coverageGroup: bifrost` explicitly sets the editorial group. Without it, the archive fallback flags titles naming Bifrost/Maxim or articles with at least eight body mentions; this is an editorial triage heuristic, not an affiliation or sponsorship judgement. Use the override when a general article contains substantial references without being centred on that subject. New broader-AI assignments should explicitly use `coverageGroup: general-ai`.

Cards show the real update date when present, otherwise the original publication date, with the corresponding label. No article timestamps are changed to control placement. Run `node scripts/check-editorial-order.mjs`, `npm run check` and `npm run build` after changing the ordering. The broader coverage assignments and proposed calendar are in `docs/editorial-plan-2026-11-05.md` and `docs/editorial-calendar-2026-11.csv`. The calendar retains proposed dates and records actual publication dates and live URLs in separate columns.
