// Usage: npm run new "Post title"  ->  creates src/content/blog/post-title.md
import { existsSync, writeFileSync } from 'node:fs';
import { slug } from 'github-slugger';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Give the post a title: npm run new "What counts as AGI?"');
  process.exit(1);
}
const file = `src/content/blog/${slug(title)}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
description: "TODO: one or two sentences (120-160 characters) shown in Google results and link previews."
pubDate: ${today}
tags: []
draft: true
---

Start writing here.
`,
);
console.log(`Created ${file}. Fill in the description and remove "draft: true" to publish.`);
