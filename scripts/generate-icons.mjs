// Regenerates favicons, app icons and the publisher logo from src/assets/brand.
// Run with: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const ICON = 'src/assets/brand/icon.png';
const COMBINED = 'src/assets/brand/combined.png';
const PAPER = { r: 251, g: 247, b: 239, alpha: 1 };

const square = (size, pad = 0, background = { r: 0, g: 0, b: 0, alpha: 0 }) =>
  sharp(ICON)
    .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background })
    .png({ compressionLevel: 9 });

// ICO container holding PNG payloads (supported by every modern browser).
async function ico(sizes) {
  const images = await Promise.all(sizes.map((s) => square(s).toBuffer()));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e);
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(img.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += img.length;
  });
  return Buffer.concat([header, ...images]);
}

await writeFile('public/favicon.ico', await ico([16, 32, 48]));
await square(96).toFile('public/favicon-96x96.png');
await square(180, 18, PAPER).toFile('public/apple-touch-icon.png');
await square(192, 16, PAPER).toFile('public/icon-192.png');
await square(512, 40, PAPER).toFile('public/icon-512.png');
await square(512, 96, PAPER).toFile('public/icon-maskable-512.png');
await sharp(COMBINED).resize(600, 600).png({ compressionLevel: 9 }).toFile('public/logo.png');
console.log('Icons generated in /public');
