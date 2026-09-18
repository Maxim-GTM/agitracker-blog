// schema.org JSON-LD builders. Every page gets WebSite + Organization;
// posts add BlogPosting, BreadcrumbList and (optionally) FAQPage.
import { SITE } from '../site.config';
import type { Author } from '../data/authors';

const abs = (path: string) => new URL(path, SITE.url).href;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: abs('/logo.png'), width: 600, height: 600 },
    ...(SITE.socials.length && { sameAs: SITE.socials.map((s) => s.url) }),
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export function person(author: Author, url: string) {
  return {
    '@type': author.kind ?? 'Person',
    name: author.name,
    url: abs(url),
    description: author.bio,
    ...(author.links?.length && { sameAs: author.links.map((l) => l.url) }),
  };
}

export function blogPosting(p: {
  url: string;
  title: string;
  description: string;
  image: string;
  published: Date;
  modified?: Date;
  author: Author;
  authorUrl: string;
  tags: string[];
  words: number;
}) {
  const url = abs(p.url);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: p.title,
    description: p.description,
    image: { '@type': 'ImageObject', url: abs(p.image), width: 1200, height: 630 },
    datePublished: p.published.toISOString(),
    dateModified: (p.modified ?? p.published).toISOString(),
    author: person(p.author, p.authorUrl),
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: SITE.lang,
    wordCount: p.words,
    ...(p.tags.length && { keywords: p.tags.join(', '), articleSection: p.tags[0] }),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function itemList(name: string, urls: string[]) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(u) })),
  };
}

export function collectionPage(p: { url: string; name: string; description: string; items: string[] }) {
  return {
    '@type': 'CollectionPage',
    '@id': abs(p.url),
    url: abs(p.url),
    name: p.name,
    description: p.description,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: itemList(p.name, p.items),
  };
}

/** Wraps nodes in one @graph so entities can reference each other by @id. */
export const graph = (nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
