/** Editorial ordering is separate from publication chronology used by feeds and metadata. */
interface EditorialEntry {
  data: {
    title: string;
    coverageGroup?: 'general-ai' | 'bifrost';
  };
  body?: string;
}

/** An author can override the archive heuristic when a passing reference is misleading. */
export function isBifrostCoverage(entry: EditorialEntry): boolean {
  if (entry.data.coverageGroup) return entry.data.coverageGroup === 'bifrost';
  return /\b(?:bifrost|maxim)\b/i.test(entry.data.title)
    || (entry.body?.match(/\b(?:bifrost|maxim)\b/gi)?.length ?? 0) >= 8;
}

/**
 * Spread both coverage groups throughout the listing, preserving the input order within each.
 * The available mix determines the spacing: a 2:1 inventory gives two general stories per
 * Bifrost story. A smaller general pool is spread throughout, rather than exhausted up front.
 * Call once before slicing or paginating; never alter dates to achieve display order.
 */
export function mixEditorialCoverage<T extends EditorialEntry>(entries: readonly T[]): T[] {
  const general: T[] = [];
  const bifrost: T[] = [];
  for (const entry of entries) (isBifrostCoverage(entry) ? bifrost : general).push(entry);
  const mixed: T[] = [];
  let g = 0;
  let b = 0;
  for (let i = 0; i < entries.length; i++) {
    // Integer arithmetic avoids rounding drift at exact group boundaries.
    const generalDue = g < general.length && g * entries.length < (i + 1) * general.length;
    mixed.push(generalDue ? general[g++] : bifrost[b++]);
  }
  return mixed;
}
