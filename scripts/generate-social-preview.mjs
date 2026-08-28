import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const svgPath = resolve(root, 'public/social-preview.svg');
const logoPath = resolve(root, 'public/logo/ohmega-logo.svg');
const productPath = resolve(root, 'public/images/product-10.webp');
const outPath = resolve(root, 'public/social-preview.png');

// Logo OHMEGA (SVG) warna asli, di-inline sebagai data URI. librsvg tidak membaca file eksternal.
const logo = readFileSync(logoPath);
const logoUri = `data:image/svg+xml;base64,${logo.toString('base64')}`;

// Foto produk diperkecil & di-inline sebagai data URI.
// Pakai WebP (hasil generate-product-images.mjs) jika ada, fallback ke PNG.
let productSource = productPath;
if (!existsSync(productSource)) {
  productSource = resolve(root, 'public/images/product-10.png');
  console.warn('product-10.webp belum ada. Jalankan dulu node scripts/generate-product-images.mjs (memakai PNG sementara).');
}
const product = await sharp(productSource)
  .resize(384, 384, { fit: 'cover' })
  .png()
  .toBuffer();
// Catatan: output PNG (bukan WebP) karena librsvg tidak mendukung dekode WebP di <image>.
const productUri = `data:image/png;base64,${product.toString('base64')}`;

let svg = readFileSync(svgPath, 'utf-8');
svg = svg
  .replace('href="logo/ohmega-logo.svg"', `href="${logoUri}"`)
  .replace('href="images/product-10.webp"', `href="${productUri}"`);

mkdirSync(dirname(outPath), { recursive: true });
await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile(outPath);

console.log(`Generated ${outPath}`);
