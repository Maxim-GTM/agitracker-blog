// Branded 1200x630 social cards, rendered at build time with Satori (layout -> SVG)
// and sharp (SVG -> PNG). No external service, no runtime cost.
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Paths are resolved from the project root: builds always run there.
const read = (p: string) => readFile(join(process.cwd(), p));

let assets: Promise<{ display: Buffer; body: Buffer; icon: string; wordmark: string }> | undefined;
function loadAssets() {
  assets ??= (async () => {
    const [display, body, icon, wordmark] = await Promise.all([
      read('node_modules/@fontsource/oxanium/files/oxanium-latin-800-normal.woff'),
      read('node_modules/@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-700-normal.woff'),
      read('src/assets/brand/icon.png'),
      read('src/assets/brand/title.png'),
    ]);
    const uri = (b: Buffer) => `data:image/png;base64,${b.toString('base64')}`;
    return { display, body, icon: uri(icon), wordmark: uri(wordmark) };
  })();
  return assets;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

const SWATCH: Record<string, string> = {
  signal: '#02FA73',
  sun: '#FFD23F',
  lilac: '#C4B3FF',
  sky: '#7CC8FF',
  rose: '#FF9EBB',
};

export interface OgInput {
  title: string;
  kicker?: string;
  tags?: { name: string; swatch: string }[];
  footer?: string;
}

export async function renderOg({ title, kicker, tags = [], footer }: OgInput): Promise<Buffer> {
  const { display, body, icon, wordmark } = await loadAssets();
  const size = title.length > 80 ? 60 : title.length > 50 ? 70 : 84;

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      padding: 40,
      background: '#EFE8D8',
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.16) 1.5px, transparent 2px)',
      backgroundSize: '26px 26px',
      fontFamily: 'Atkinson',
    },
    h(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#FBF7EF',
        border: '6px solid #000',
        boxShadow: '16px 16px 0 #000',
        marginRight: 16,
        marginBottom: 16,
      },
      [
        h(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 36px',
            borderBottom: '6px solid #000',
            background: '#02FA73',
          },
          [
            h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [
              h('img', { width: 74, height: 59 }, undefined, { src: icon }),
              h('img', { width: 250, height: 61 }, undefined, { src: wordmark }),
            ]),
            kicker
              ? h('div', { fontFamily: 'Oxanium', fontSize: 28, color: '#000' }, kicker)
              : h('div', { display: 'flex' }, ''),
          ],
        ),
        h(
          'div',
          { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '34px 44px 36px' },
          [
            h(
              'div',
              { fontFamily: 'Oxanium', fontSize: size, lineHeight: 1.02, letterSpacing: -1.5, color: '#000', display: 'flex' },
              title,
            ),
            h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
              h(
                'div',
                { display: 'flex', gap: 12 },
                tags.slice(0, 3).map((t) =>
                  h(
                    'div',
                    {
                      display: 'flex',
                      padding: '6px 16px',
                      border: '4px solid #000',
                      boxShadow: '4px 4px 0 #000',
                      background: SWATCH[t.swatch] ?? SWATCH.signal,
                      fontFamily: 'Oxanium',
                      fontSize: 24,
                    },
                    t.name,
                  ),
                ),
              ),
              footer ? h('div', { fontSize: 26, color: '#4A463F', display: 'flex' }, footer) : h('div', {}, ''),
            ]),
          ],
        ),
      ],
    ),
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Oxanium', data: display, weight: 800, style: 'normal' },
      { name: 'Atkinson', data: body, weight: 700, style: 'normal' },
    ],
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
