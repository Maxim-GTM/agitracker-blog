import type { APIRoute, GetStaticPaths } from 'astro';
import { formatDate, getPosts, readingTime, tagSwatch, type Post } from '../../lib/posts';
import { renderOg } from '../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute<{ post: Post }> = async ({ props: { post } }) => {
  const png = await renderOg({
    title: post.data.title,
    tags: post.data.tags.map((name) => ({ name, swatch: tagSwatch(name) })),
    footer: `${formatDate(post.data.updatedDate ?? post.data.pubDate)}  /  ${readingTime(post.body).minutes} min read`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
