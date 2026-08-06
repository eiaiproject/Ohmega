import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const labelsDir = resolve(root, 'public/labels');

// Master SVG (unit cm) di-inline logonya lalu dirender ke PNG 300 DPI siap cetak.
// Ukuran: isi 4 = 5×5 cm, isi 10/30 = 15×5 cm (300 DPI → 591 / 1772 px).
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(
  readFileSync(resolve(root, 'public/logo/ohmega-logo.svg'))
).toString('base64')}`;

const labels = [
  { name: 'label-isi-4', width: 591, height: 591 },
  { name: 'label-isi-10', width: 1772, height: 591 },
  { name: 'label-isi-30', width: 1772, height: 591 },
];

for (const { name, width, height } of labels) {
  let svg = readFileSync(resolve(labelsDir, `${name}.svg`), 'utf8')
    // Ganti href relatif dengan data URI agar librsvg bisa memuat logo.
    .replaceAll('../logo/ohmega-logo.svg', logoDataUri)
    // Rasterisasi pada ukuran piksel eksak (librsvg membaca width/height).
    .replace(/width="[^"]+"/, `width="${width}"`)
    .replace(/height="[^"]+"/, `height="${height}"`);

  const out = resolve(labelsDir, `${name}.png`);
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(width, height, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .withMetadata({ density: 300 }) // metadata 300 DPI agar ukuran cetak 15×5 / 5×5 cm
    .toFile(out);

  console.log(`${name}: ${width}×${height}px (300 DPI) → public/labels/${name}.png`);
}

console.log('Selesai. PNG siap cetak, SVG master tetap sebagai sumber editabel.');
