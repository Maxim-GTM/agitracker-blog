import { getCollection, type CollectionEntry } from 'astro:content';
import { slug as githubSlug } from 'github-slugger';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts show up only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;
export const ogImageUrl = (post: Post) => `/og/${post.id}.png`;

export const tagSlug = (tag: string) => githubSlug(tag);
export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}/`;

export function readingTime(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 230)) };
}

export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export function collectTags(posts: Post[]): TagInfo[] {
  const map = new Map<string, TagInfo>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      const t = map.get(slug) ?? { name, slug, count: 0 };
      t.count++;
      map.set(slug, t);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Posts that share the most tags with `post`, newest first on ties. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags.map(tagSlug));
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: p.data.tags.filter((t) => tags.has(tagSlug(t))).length }))
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Topic colour: stable per tag so the same topic always wears the same colour. */
const SWATCHES = ['signal', 'sun', 'lilac', 'sky', 'rose'] as const;
export function tagSwatch(tag: string) {
  let h = 0;
  for (const c of tagSlug(tag)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return SWATCHES[h % SWATCHES.length];
}

const fmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const fmtShort = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });
export const formatDate = (d: Date) => fmt.format(d);
export const formatDay = (d: Date) => fmtShort.format(d);
