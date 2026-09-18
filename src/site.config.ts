export const SITE = {
  name: 'agitracker.io',
  url: 'https://agitracker.io',
  title: 'agitracker.io: tracking the road to AGI',
  tagline: 'Tracking the road to general intelligence.',
  description:
    'Plain-language analysis of AI benchmarks, model releases, compute trends and expert forecasts: an independent tracker of progress toward artificial general intelligence.',
  locale: 'en_US',
  lang: 'en',
  /** Used for twitter:site. Leave empty to omit. */
  twitter: '',
  /** Official profiles, emitted as Organization `sameAs`. */
  socials: [] as { label: string; url: string }[],
  themeColor: '#02FA73',
} as const;

export const NAV = [
  { href: '/blog/', label: 'Articles' },
  { href: '/tags/', label: 'Topics' },
  { href: '/about/', label: 'About' },
] as const;
