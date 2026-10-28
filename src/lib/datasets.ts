// Datasets under /data/. Each one is a JSON file in src/data/datasets/<slug>.json.
// Files are validated here at build time, so a malformed dataset fails the build
// with a clear message instead of shipping a broken page.
import type { ChartSpec } from './charts';

export type ColumnType = 'text' | 'number' | 'date' | 'url' | 'tags';

export interface Source {
  title: string;
  url: string;
}

export interface Column {
  key: string;
  label: string;
  type?: ColumnType;
  /** Shown under the table header as a short definition, e.g. units. */
  note?: string;
}

export interface Dataset {
  slug: string;
  /** Short name used in navigation and cards. */
  name: string;
  /** <title> text (the site name is appended). Aim for 50-60 characters. */
  title: string;
  /** On-page H1. */
  h1: string;
  /** Meta description, 120-160 characters. */
  description: string;
  /** One-sentence summary shown on the hub card. */
  summary: string;
  published: string;
  updated: string;
  keywords: string[];
  /** Paragraphs (Markdown) shown under the H1. The first one answers the main query directly. */
  intro: string[];
  /** Headline numbers: each one a self-contained, quotable sentence with its source. */
  keyFindings: { text: string; source: Source }[];
  /** Name of the table section, e.g. "Water and energy per prompt, by model". */
  tableTitle: string;
  columns: Column[];
  /** Each row must carry the source that proves it. */
  rows: (Record<string, string | number | string[] | null> & { source: Source })[];
  /** Optional extra sections (Markdown) shown after the table. */
  sections?: { heading: string; body: string }[];
  methodology: string[];
  faq: { q: string; a: string }[];
  /** e.g. "2019/2026" or "2026". */
  temporalCoverage?: string;
  /** Slugs of other datasets to cross-link. */
  related?: string[];
  /** Headline numbers for the "at a glance" strip: 3-4 short value/label pairs. */
  stats?: { value: string; label: string }[];
  /** Figures rendered as build-time SVG (and PNG for embedding). */
  charts?: ChartSpec[];
  /** Original analyses that use this dataset: blog post slugs. */
  research?: string[];
  /** Version history, newest first. */
  changelog?: { date: string; note: string }[];
}

export const LICENSE = {
  name: 'CC BY 4.0',
  url: 'https://creativecommons.org/licenses/by/4.0/',
};

const files = import.meta.glob<Dataset>('../data/datasets/*.json', { eager: true, import: 'default' });

function fail(slug: string, msg: string): never {
  throw new Error(`Dataset "${slug}": ${msg}`);
}

function validate(d: Dataset, file: string): Dataset {
  const slug = d.slug ?? file;
  const required = [
    'slug', 'name', 'title', 'h1', 'description', 'summary', 'published', 'updated',
    'keywords', 'intro', 'keyFindings', 'tableTitle', 'columns', 'rows', 'methodology', 'faq',
  ] as const;
  for (const key of required) if (d[key] == null) fail(slug, `missing "${key}"`);
  if (`${d.slug}.json` !== file) fail(slug, `slug must match the file name (${file})`);
  if (d.description.length < 50 || d.description.length > 165)
    fail(slug, `description is ${d.description.length} characters; keep it 50-165`);
  for (const k of ['published', 'updated'] as const)
    if (Number.isNaN(Date.parse(d[k]))) fail(slug, `"${k}" is not a date`);
  if (!d.rows.length) fail(slug, 'has no rows');
  const keys = new Set(d.columns.map((c) => c.key));
  d.rows.forEach((row, i) => {
    if (!row.source?.url || !row.source?.title) fail(slug, `row ${i + 1} has no source {title, url}`);
    for (const k of Object.keys(row)) if (k !== 'source' && !keys.has(k)) fail(slug, `row ${i + 1} has unknown key "${k}"`);
  });
  (d.charts ?? []).forEach((c) => {
    if (c.data) return;
    for (const k of [c.x, c.y, c.series, c.labelKey, ...(c.filter ?? []).map((f) => f.key)])
      if (k && !keys.has(k)) fail(slug, `chart "${c.id}" uses unknown column "${k}"`);
  });
  d.keyFindings.forEach((f, i) => {
    if (!f.source?.url) fail(slug, `key finding ${i + 1} has no source`);
  });
  return d;
}

export const datasets: Dataset[] = Object.entries(files)
  .map(([path, d]) => validate(d, path.split('/').pop()!))
  .sort((a, b) => a.name.localeCompare(b.name));

export const datasetUrl = (d: Dataset) => `/data/${d.slug}/`;
export const getDataset = (slug: string) => datasets.find((d) => d.slug === slug);

/** Plain-text cell value, used for CSV and for table sorting. */
export function cellText(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join('; ');
  return String(v);
}

export function toCsv(d: Dataset): string {
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const header = [...d.columns.map((c) => c.label), 'Source', 'Source URL'];
  const lines = d.rows.map((r) => [
    ...d.columns.map((c) => cellText(r[c.key])),
    r.source.title,
    r.source.url,
  ]);
  return [header, ...lines].map((l) => l.map(esc).join(',')).join('\n') + '\n';
}

export function toJson(d: Dataset, siteUrl: string) {
  return {
    name: d.h1,
    description: d.description,
    url: new URL(datasetUrl(d), siteUrl).href,
    license: LICENSE.url,
    publisher: 'agitracker.io',
    updated: d.updated,
    columns: d.columns,
    rows: d.rows,
  };
}
