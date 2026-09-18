import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUTHORS } from './data/authors';

/**
 * Every .md / .mdx file in src/content/blog becomes a post at /blog/<file-name>/.
 * The frontmatter below is validated at build time, so a typo fails loudly
 * instead of shipping a broken page.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z
        .string()
        .min(40, 'Write at least 40 characters: this is the search-result snippet.')
        .max(320),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z
        .string()
        .default('team')
        .refine((id) => id in AUTHORS, 'Unknown author: add them to src/data/authors.ts first.'),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Optional overrides for search engines. */
      seoTitle: z.string().max(70).optional(),
      canonical: z.url().optional(),
      noindex: z.boolean().default(false),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /** Rendered at the end of the post and emitted as FAQPage structured data. */
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    }),
});

export const collections = { blog };
