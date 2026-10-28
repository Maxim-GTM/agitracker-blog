// Build-time SVG charts for /data/ pages. No client-side library: every chart is
// static SVG in the HTML (indexable, fast), and the same SVG is rasterized to PNG
// for embedding. Marks follow the house data-viz rules: thin bars with 4px rounded
// data-ends, 2px lines, >= 8px markers with a surface ring, hairline solid grid,
// text in ink tokens (never series colors), legend for >= 2 series.
import type { Dataset } from './datasets';

// Categorical order validated for light mode on the paper surface (scripts/validate_palette.js):
// darker steps of the brand hues signal, lilac, sun, sky, rose.
export const PALETTE = ['#00994a', '#6c4fe0', '#c98a00', '#1a78c2', '#cc3d70'];
const SURFACE = '#fbf7ef';
const GRID = '#e2dacb';
const INK = '#000000';
const MUTED = '#4a463f';
const FONT = "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', Helvetica, Arial, sans-serif";

type Row = Dataset['rows'][number];
type Filter = { key: string; equals?: string | number; in?: (string | number)[]; notIn?: (string | number)[]; contains?: string; notNull?: boolean; max?: number; min?: number };

export interface ChartSpec {
  id: string;
  type: 'hbar' | 'column' | 'scatter' | 'line';
  title: string;
  /** Units and scope, shown under the title. */
  subtitle?: string;
  /** One-sentence takeaway shown under the chart. */
  caption: string;
  alt: string;
  /** Row filters, all must match. */
  filter?: Filter[];
  /** Category (hbar/column) or x value (scatter/line) column key. */
  x: string;
  /** Value column key; omitted for aggregate "count". */
  y?: string;
  aggregate?: 'count' | 'sum' | 'median';
  /** Column whose values split the data into series (stacked column, colored scatter). */
  series?: string;
  /** Map raw series values to display names; unmapped values go to "Other". */
  seriesMap?: Record<string, string>;
  /** Fixed series order (also fixes the color slot of each series). */
  seriesOrder?: string[];
  /** x column holds dates; they are bucketed by year for column charts. */
  xIsDate?: boolean;
  log?: boolean;
  sort?: 'desc' | 'asc' | 'none';
  limit?: number;
  /** Column used to name points/bars (defaults to x). */
  labelKey?: string;
  /** Scatter/line: only these labels are written next to points. */
  annotate?: string[];
  yLabel?: string;
  xLabel?: string;
  /** Value formatting. */
  unit?: string;
  prefix?: string;
  decimals?: number;
  /** Print values without thousands separators (years). */
  plain?: boolean;
  /** Inline data instead of rows: {label, value, series?, x?}. */
  data?: { label: string; value: number; series?: string; x?: number | string }[];
  /** Source line for the PNG footer; defaults to the dataset page. */
  source?: string;
  /** Note shown in the caption about excluded points, scale, etc. */
  note?: string;
}

export interface Point {
  label: string;
  x?: number;
  value: number;
  series: string;
}

// ---------- data ----------

export function dateToYear(v: unknown): number | null {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return null;
  const y = +m[1], mo = m[2] ? +m[2] - 1 : 6, d = m[3] ? +m[3] - 1 : m[2] ? 15 : 0;
  return y + (mo * 30.44 + d) / 365.25;
}

const matches = (r: Row, f: Filter) => {
  const v = r[f.key] as unknown;
  if (f.notNull && (v == null || v === '')) return false;
  if (f.equals !== undefined && v !== f.equals) return false;
  if (f.in && !f.in.includes(v as string)) return false;
  if (f.notIn && f.notIn.includes(v as string)) return false;
  if (f.contains && !String(v ?? '').toLowerCase().includes(f.contains.toLowerCase())) return false;
  if (f.max !== undefined && !(typeof v === 'number' && v <= f.max)) return false;
  if (f.min !== undefined && !(typeof v === 'number' && v >= f.min)) return false;
  return true;
};

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

export function chartPoints(spec: ChartSpec, rows: Row[]): Point[] {
  if (spec.data) {
    return spec.data.map((d) => ({
      label: d.label,
      value: d.value,
      series: d.series ?? '',
      x: typeof d.x === 'number' ? d.x : d.x != null ? dateToYear(d.x) ?? undefined : undefined,
    }));
  }
  const rs = rows.filter((r) => (spec.filter ?? []).every((f) => matches(r, f)));
  const seriesOf = (r: Row) => {
    if (!spec.series) return '';
    const raw = String(r[spec.series] ?? '');
    if (!spec.seriesMap) return raw;
    return spec.seriesMap[raw] ?? 'Other';
  };
  if (spec.type === 'scatter' || spec.type === 'line') {
    return rs
      .map((r) => ({
        label: String(r[spec.labelKey ?? spec.x] ?? ''),
        x: dateToYear(r[spec.x]) ?? undefined,
        value: Number(r[spec.y!]),
        series: seriesOf(r),
      }))
      .filter((p) => p.x != null && Number.isFinite(p.value) && r0(p.value, spec.log))
      .sort((a, b) => a.x! - b.x!);
  }
  // hbar / column: group by category (and series)
  const keyOf = (r: Row) => {
    const v = r[spec.x];
    if (spec.xIsDate) return String(Math.floor(dateToYear(v) ?? 0));
    return String(v ?? '');
  };
  const groups = new Map<string, Map<string, number[]>>();
  for (const r of rs) {
    const k = keyOf(r);
    if (!k || k === '0') continue;
    const s = seriesOf(r);
    const v = spec.aggregate === 'count' ? 1 : Number(r[spec.y!]);
    if (!Number.isFinite(v)) continue;
    if (!groups.has(k)) groups.set(k, new Map());
    const g = groups.get(k)!;
    g.set(s, [...(g.get(s) ?? []), v]);
  }
  const pts: Point[] = [];
  for (const [k, g] of groups)
    for (const [s, vs] of g)
      pts.push({
        label: spec.aggregate || spec.type === 'column' ? k : String(rs.find((r) => keyOf(r) === k)?.[spec.labelKey ?? spec.x] ?? k),
        value: spec.aggregate === 'median' ? median(vs) : spec.aggregate === 'sum' || spec.aggregate === 'count' ? vs.reduce((a, b) => a + b, 0) : vs[0],
        series: s,
      });
  return pts;
}
const r0 = (v: number, log?: boolean) => (log ? v > 0 : true);

// ---------- formatting ----------

export function fmt(v: number, spec: Pick<ChartSpec, 'unit' | 'prefix' | 'decimals' | 'plain'>): string {
  if (spec.plain) return `${spec.prefix ?? ''}${+v.toFixed(spec.decimals ?? 0)}${spec.unit ?? ''}`;
  const d = spec.decimals ?? (Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : Math.abs(v) >= 1 ? 2 : 3);
  let s = v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  if (Math.abs(v) >= 10000 && !spec.unit?.startsWith(' ')) s = compact(v);
  return `${spec.prefix ?? ''}${s}${spec.unit ?? ''}`;
}
const compact = (v: number) =>
  Math.abs(v) >= 1e9 ? `${+(v / 1e9).toFixed(1)}B` : Math.abs(v) >= 1e6 ? `${+(v / 1e6).toFixed(1)}M` : Math.abs(v) >= 1e3 ? `${+(v / 1e3).toFixed(1)}K` : `${v}`;

function niceTicks(min: number, max: number, count = 5): number[] {
  if (max === min) max = min + 1;
  const span = max - min, step0 = span / count, mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-9; t += step) out.push(+t.toFixed(10));
  return out;
}
/** Axis domain that always contains [min, max]: bounds rounded outward to a nice step. */
function niceDomain(min: number, max: number, count = 5, integer = false) {
  if (max === min) max = min + 1;
  const span = max - min, step0 = span / count, mag = 10 ** Math.floor(Math.log10(step0));
  // Integer axes (counts, decimals: 0) never use 2.5 steps or steps below 1.
  const mults = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  const step = Math.max(integer ? 1 : 0, mults.map((m) => m * mag).find((st) => span / st <= count) ?? 10 * mag);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = lo; t <= hi + step * 1e-9; t += step) ticks.push(+t.toFixed(10));
  return { lo, hi, ticks };
}
function logTicks(min: number, max: number): number[] {
  const out: number[] = [];
  for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++) out.push(10 ** e);
  return out;
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tickLabel = (t: number, spec: ChartSpec) => (spec.log ? fmt(t, { ...spec, decimals: t < 1 ? 3 : 0 }) : fmt(t, spec));

// Approximate text width for layout (Atkinson-ish average glyph width).
const textW = (s: string, size: number) => s.length * size * 0.54;
const truncate = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1) + '…' : s);

/** Bar path: square at the baseline, 4px rounded data-end. */
function hbarPath(x0: number, x1: number, y: number, h: number) {
  const r = Math.min(4, (x1 - x0) / 2, h / 2);
  return `M${x0},${y}H${x1 - r}Q${x1},${y} ${x1},${y + r}V${y + h - r}Q${x1},${y + h} ${x1 - r},${y + h}H${x0}Z`;
}
function colPath(x: number, w: number, yBase: number, yTop: number, round: boolean) {
  const r = round ? Math.min(4, w / 2, (yBase - yTop) / 2) : 0;
  return `M${x},${yBase}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yBase}Z`;
}

// ---------- render ----------

export interface RenderOpts {
  /** Draw title, subtitle and source footer inside the SVG (for the PNG export). */
  standalone?: boolean;
  sourceLine?: string;
}

export function renderChart(spec: ChartSpec, rows: Row[], opts: RenderOpts = {}): string {
  const pts = chartPoints(spec, rows);
  const W = 760;
  const head = opts.standalone ? 74 + (spec.subtitle ? 0 : -22) : 8;
  const foot = opts.standalone ? 40 : 0;
  let body: { svg: string; h: number };
  if (spec.type === 'hbar') body = hbar(spec, pts, W, head);
  else if (spec.type === 'column') body = column(spec, pts, W, head);
  else body = scatter(spec, pts, W, head);
  const H = body.h + foot;
  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t-${spec.id} d-${spec.id}" font-family="${esc(FONT)}">`,
    `<title id="t-${spec.id}">${esc(spec.title)}</title><desc id="d-${spec.id}">${esc(spec.alt)}</desc>`,
    `<rect width="${W}" height="${H}" fill="${SURFACE}"/>`,
  );
  if (opts.standalone) {
    parts.push(`<text x="24" y="38" font-size="22" font-weight="700" fill="${INK}">${esc(truncate(spec.title, 64))}</text>`);
    if (spec.subtitle) parts.push(`<text x="24" y="62" font-size="14" fill="${MUTED}">${esc(truncate(spec.subtitle, 100))}</text>`);
  }
  parts.push(body.svg);
  if (opts.standalone) {
    parts.push(
      `<line x1="24" x2="${W - 24}" y1="${H - 34}" y2="${H - 34}" stroke="${GRID}"/>`,
      `<text x="24" y="${H - 13}" font-size="13" fill="${MUTED}">${esc(truncate(opts.sourceLine ?? '', 92))}</text>`,
      `<text x="${W - 24}" y="${H - 13}" font-size="13" font-weight="700" fill="${INK}" text-anchor="end">agitracker.io/data</text>`,
    );
  }
  parts.push('</svg>');
  return parts.join('');
}

function seriesList(spec: ChartSpec, pts: Point[]) {
  const seen = [...new Set(pts.map((p) => p.series))];
  if (!spec.seriesOrder) return seen;
  return [...spec.seriesOrder.filter((s) => seen.includes(s)), ...seen.filter((s) => !spec.seriesOrder!.includes(s))];
}
const colorOf = (spec: ChartSpec, all: string[], s: string) =>
  all.length <= 1 ? PALETTE[0] : PALETTE[Math.max(0, (spec.seriesOrder ?? all).indexOf(s)) % PALETTE.length];

/** Legend that wraps onto extra lines; returns its SVG and the vertical space it used. */
function legend(spec: ChartSpec, series: string[], x: number, y: number, maxX = 736): { svg: string; h: number } {
  if (series.length < 2) return { svg: '', h: 0 };
  let cx = x, cy = y;
  const svg = series
    .map((s) => {
      const w = 18 + textW(s, 13) + 22;
      if (cx + w > maxX && cx > x) {
        cx = x;
        cy += 22;
      }
      const out = `<rect x="${cx}" y="${cy - 10}" width="12" height="12" rx="3" fill="${colorOf(spec, series, s)}"/><text x="${cx + 18}" y="${cy}" font-size="13" fill="${INK}">${esc(s)}</text>`;
      cx += w;
      return out;
    })
    .join('');
  return { svg, h: cy - y + 22 };
}

function hbar(spec: ChartSpec, pts: Point[], W: number, top: number) {
  let data = [...pts];
  if (spec.sort !== 'none') data.sort((a, b) => (spec.sort === 'asc' ? a.value - b.value : b.value - a.value));
  if (spec.limit) data = data.slice(0, spec.limit);
  const labelW = Math.min(250, Math.max(...data.map((d) => textW(truncate(d.label, 40), 13))) + 12);
  const x0 = 24 + labelW, x1 = W - 90;
  const band = 30, bar = 18;
  const vals = data.map((d) => d.value);
  const lo = spec.log ? 10 ** Math.floor(Math.log10(Math.min(...vals))) : 0;
  const hi = spec.log ? 10 ** Math.ceil(Math.log10(Math.max(...vals))) : niceDomain(0, Math.max(...vals), 5, spec.decimals === 0).hi;
  const sx = (v: number) => (spec.log ? x0 + ((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * (x1 - x0) : x0 + (v / hi) * (x1 - x0));
  const ticks = spec.log ? logTicks(lo, hi) : niceDomain(0, hi, 5, spec.decimals === 0).ticks;
  const plotTop = top + 26, plotH = data.length * band, axisY = plotTop + plotH;
  const out: string[] = [];
  for (const t of ticks) {
    const x = sx(t);
    out.push(`<line x1="${x}" x2="${x}" y1="${plotTop - 6}" y2="${axisY}" stroke="${GRID}" stroke-width="1"/>`);
    out.push(`<text x="${x}" y="${axisY + 18}" font-size="12" fill="${MUTED}" text-anchor="middle" style="font-variant-numeric:tabular-nums">${esc(tickLabel(t, spec))}</text>`);
  }
  data.forEach((d, i) => {
    const y = plotTop + i * band + (band - bar) / 2;
    const xe = Math.max(sx(d.value), x0 + 2);
    const v = fmt(d.value, spec);
    out.push(`<text x="${x0 - 10}" y="${y + bar / 2 + 4.5}" font-size="13" fill="${INK}" text-anchor="end">${esc(truncate(d.label, 40))}</text>`);
    out.push(`<g><title>${esc(`${d.label}: ${v}`)}</title><path d="${hbarPath(x0, xe, y, bar)}" fill="${PALETTE[0]}"/><rect x="${x0}" y="${y - 5}" width="${x1 - x0 + 80}" height="${bar + 10}" fill="transparent"/></g>`);
    out.push(`<text x="${xe + 6}" y="${y + bar / 2 + 4.5}" font-size="12.5" fill="${INK}" style="font-variant-numeric:tabular-nums">${esc(v)}</text>`);
  });
  out.push(`<line x1="${x0}" x2="${x0}" y1="${plotTop - 6}" y2="${axisY}" stroke="${MUTED}" stroke-width="1"/>`);
  if (spec.yLabel) out.push(`<text x="${(x0 + x1) / 2}" y="${axisY + 38}" font-size="12.5" fill="${MUTED}" text-anchor="middle">${esc(spec.yLabel)}</text>`);
  return { svg: out.join(''), h: axisY + (spec.yLabel ? 52 : 34) };
}

function column(spec: ChartSpec, pts: Point[], W: number, top: number) {
  const series = seriesList(spec, pts);
  const cats = [...new Set(pts.map((p) => p.label))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const totals = cats.map((c) => pts.filter((p) => p.label === c).reduce((a, p) => a + p.value, 0));
  const { hi, ticks } = niceDomain(0, Math.max(...totals), 5, spec.decimals === 0);
  const lg = legend(spec, series, 56, top + 18);
  const x0 = 56, x1 = W - 24, plotTop = top + 18 + lg.h, plotH = 260, base = plotTop + plotH;
  const slot = (x1 - x0) / cats.length, bw = Math.min(24 * (series.length > 1 ? 1.4 : 1), slot * 0.62);
  const sy = (v: number) => base - (v / hi) * plotH;
  const out: string[] = [lg.svg];
  for (const t of ticks) {
    out.push(`<line x1="${x0}" x2="${x1}" y1="${sy(t)}" y2="${sy(t)}" stroke="${GRID}"/>`);
    out.push(`<text x="${x0 - 8}" y="${sy(t) + 4}" font-size="12" fill="${MUTED}" text-anchor="end" style="font-variant-numeric:tabular-nums">${esc(fmt(t, spec))}</text>`);
  }
  const every = Math.ceil(cats.length / 14);
  cats.forEach((c, i) => {
    const cx = x0 + slot * i + slot / 2, x = cx - bw / 2;
    let acc = 0;
    const segs = series.map((s) => ({ s, v: pts.filter((p) => p.label === c && p.series === s).reduce((a, p) => a + p.value, 0) })).filter((g) => g.v > 0);
    segs.forEach((g, k) => {
      const yb = sy(acc) - (k > 0 ? 1 : 0), yt = sy(acc + g.v) + (k < segs.length - 1 ? 1 : 0);
      acc += g.v;
      out.push(`<g><title>${esc(`${c}${g.s ? `, ${g.s}` : ''}: ${fmt(g.v, spec)}`)}</title><path d="${colPath(x, bw, yb, yt, k === segs.length - 1)}" fill="${colorOf(spec, series, g.s)}"/></g>`);
    });
    out.push(`<text x="${cx}" y="${sy(totals[i]) - 6}" font-size="11.5" fill="${INK}" text-anchor="middle" style="font-variant-numeric:tabular-nums">${esc(fmt(totals[i], spec))}</text>`);
    if (i % every === 0) out.push(`<text x="${cx}" y="${base + 18}" font-size="12" fill="${MUTED}" text-anchor="middle">${esc(c)}</text>`);
  });
  out.push(`<line x1="${x0}" x2="${x1}" y1="${base}" y2="${base}" stroke="${MUTED}"/>`);
  if (spec.yLabel) out.push(`<text x="14" y="${plotTop + plotH / 2}" font-size="12.5" fill="${MUTED}" text-anchor="middle" transform="rotate(-90 14 ${plotTop + plotH / 2})">${esc(spec.yLabel)}</text>`);
  return { svg: out.join(''), h: base + 34 };
}

function scatter(spec: ChartSpec, pts: Point[], W: number, top: number) {
  const series = seriesList(spec, pts);
  const xs = pts.map((p) => p.x!), ys = pts.map((p) => p.value);
  const xt = niceTicks(Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs)), 7).filter(Number.isInteger);
  const xlo = Math.min(Math.floor(Math.min(...xs)), xt[0]), xhi = Math.max(Math.ceil(Math.max(...xs)), xt[xt.length - 1]);
  const yd = niceDomain(Math.min(...ys), Math.max(...ys));
  const ylo = spec.log ? 10 ** Math.floor(Math.log10(Math.min(...ys))) : yd.lo;
  const yhi = spec.log ? 10 ** Math.ceil(Math.log10(Math.max(...ys))) : yd.hi;
  const yt = spec.log ? logTicks(ylo, yhi) : yd.ticks;
  const lg = legend(spec, series, 70, top + 18);
  const x0 = 70, x1 = W - 28, plotTop = top + 18 + lg.h, plotH = 300, base = plotTop + plotH;
  const sx = (v: number) => x0 + ((v - xlo) / (xhi - xlo)) * (x1 - x0);
  // Log scales get a small pad below the lowest decade so points never sit on the axis line.
  const lpLo = Math.log10(ylo) - (spec.log ? 0.12 : 0), lpHi = Math.log10(yhi);
  const sy = (v: number) => (spec.log ? base - ((Math.log10(v) - lpLo) / (lpHi - lpLo)) * plotH : base - ((v - ylo) / (yhi - ylo)) * plotH);
  const out: string[] = [lg.svg];
  for (const t of yt) {
    out.push(`<line x1="${x0}" x2="${x1}" y1="${sy(t)}" y2="${sy(t)}" stroke="${GRID}"/>`);
    out.push(`<text x="${x0 - 8}" y="${sy(t) + 4}" font-size="12" fill="${MUTED}" text-anchor="end" style="font-variant-numeric:tabular-nums">${esc(tickLabel(t, spec))}</text>`);
  }
  for (const t of xt) out.push(`<text x="${sx(t)}" y="${base + 18}" font-size="12" fill="${MUTED}" text-anchor="middle">${t}</text>`);
  out.push(`<line x1="${x0}" x2="${x1}" y1="${base}" y2="${base}" stroke="${MUTED}"/>`);
  if (spec.type === 'line')
    for (const s of series) {
      const ps = pts.filter((p) => p.series === s);
      out.push(`<polyline points="${ps.map((p) => `${sx(p.x!)},${sy(p.value)}`).join(' ')}" fill="none" stroke="${colorOf(spec, series, s)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
    }
  for (const p of pts) {
    const cx = sx(p.x!), cy = sy(p.value), c = colorOf(spec, series, p.series);
    out.push(`<g><title>${esc(`${p.label}${p.series ? ` (${p.series})` : ''}: ${fmt(p.value, spec)}, ${yearMonth(p.x!)}`)}</title><circle cx="${cx}" cy="${cy}" r="12" fill="transparent"/><circle cx="${cx}" cy="${cy}" r="4.5" fill="${c}" stroke="${SURFACE}" stroke-width="2"/></g>`);
  }
  // selective direct labels, right of the point unless near the right edge
  // Single-series line charts: label the peak and the latest value directly on the line.
  // With several series the legend and hover values carry identity (labels would collide).
  if (spec.type === 'line' && series.length === 1)
    for (const s of series) {
      const ps = pts.filter((p) => p.series === s);
      const last = ps[ps.length - 1], peak = ps.reduce((m, p) => (p.value > m.value ? p : m), ps[0]);
      for (const p of peak === last ? [last] : [peak, last]) {
        const cx = sx(p.x!), cy = sy(p.value), end = p === last;
        // Peak: centered above. Latest: left of the point at its own height, clear of the incoming line.
        out.push(`<text x="${cx + (end ? 4 : 0)}" y="${end ? cy - 40 : cy - 12}" font-size="12.5" font-weight="700" fill="${INK}" text-anchor="${end ? 'end' : 'middle'}" paint-order="stroke" stroke="${SURFACE}" stroke-width="4" stroke-linejoin="round" style="font-variant-numeric:tabular-nums">${esc(`${fmt(p.value, spec)} (${yearMonth(p.x!)})`)}</text>`);
      }
    }
  // Annotation syntax: "Name" (auto side), "Name<" (left), "Name>" (right), "Name^" (above), "Name_" (below).
  for (const raw of spec.annotate ?? []) {
    const side = /[<>^_]$/.test(raw) ? raw.slice(-1) : '';
    const name = side ? raw.slice(0, -1) : raw;
    const p = pts.find((q) => q.label === name);
    if (!p) continue;
    const cx = sx(p.x!), cy = sy(p.value);
    const dir = side || (cx < x1 - 150 ? '>' : '<');
    const [dx, dy, anchor] =
      dir === '<' ? [-9, 4, 'end'] : dir === '>' ? [9, 4, 'start'] : dir === '^' ? [0, -11, 'middle'] : [0, 19, 'middle'];
    out.push(`<text x="${cx + dx}" y="${cy + dy}" font-size="12" font-weight="700" fill="${INK}" text-anchor="${anchor}" paint-order="stroke" stroke="${SURFACE}" stroke-width="4" stroke-linejoin="round">${esc(name)}</text>`);
  }
  if (spec.yLabel) out.push(`<text x="16" y="${plotTop + plotH / 2}" font-size="12.5" fill="${MUTED}" text-anchor="middle" transform="rotate(-90 16 ${plotTop + plotH / 2})">${esc(spec.yLabel)}</text>`);
  if (spec.xLabel) out.push(`<text x="${(x0 + x1) / 2}" y="${base + 38}" font-size="12.5" fill="${MUTED}" text-anchor="middle">${esc(spec.xLabel)}</text>`);
  return { svg: out.join(''), h: base + (spec.xLabel ? 50 : 32) };
}

const yearMonth = (x: number) => {
  const y = Math.floor(x), m = Math.min(11, Math.floor((x - y) * 12));
  return new Date(Date.UTC(y, m, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};
