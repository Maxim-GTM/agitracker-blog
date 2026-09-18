// Reads post frontmatter at config time so the sitemap can emit accurate <lastmod>
// values and skip drafts / noindex posts (astro:content isn't available in astro.config).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { slug as githubSlug } from 'github-slugger';
import { parse } from 'yaml';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Mirrors the glob loader's id generation so sitemap URLs match real routes. */
function entryId(dir, file, data) {
  if (data.slug) return String(data.slug);
  const rel = relative(dir, file).replace(/\\/g, '/');
  return rel
    .slice(0, -extname(rel).length)
    .split('/')
    .map((s) => githubSlug(s))
    .join('/')
    .replace(/\/index$/, '');
}

/** @returns {{ lastmod: Map<string, string>, hidden: Set<string> }} */
export function readPostMeta(dir) {
  const lastmod = new Map();
  const hidden = new Set();
  for (const file of walk(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const fm = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    let data;
    try {
      data = parse(fm[1]) ?? {};
    } catch {
      continue; // Astro's content loader reports the YAML error with a clearer message.
    }
    const id = entryId(dir, file, data);
    if (data.draft || data.noindex) hidden.add(id);
    const date = data.updatedDate ?? data.pubDate;
    if (date) lastmod.set(id, new Date(date).toISOString());
  }
  return { lastmod, hidden };
}
