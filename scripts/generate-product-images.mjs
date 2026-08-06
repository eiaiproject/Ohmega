import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const imagesDir = resolve(root, 'public/images');

// Foto produk: sumber PNG → WebP 800px (2× dari ukuran kartu ~400px), quality 80.
// Catatan: jika ada kemasan baru, tambahkan angkanya di sini.
const packs = [4, 10, 30];

for (const n of packs) {
  const src = resolve(imagesDir, `product-${n}.png`);
  const out = resolve(imagesDir, `product-${n}.webp`);

  const srcKB = Math.round(statSync(src).size / 1024);
  const { size } = await sharp(src)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  const outKB = Math.round(size / 1024);

  console.log(`product-${n}: ${srcKB}KB → ${outKB}KB (${Math.round((1 - outKB / srcKB) * 100)}% lebih kecil)`);
}

// Foto area produksi: sumber JPG → WebP 1600px (rasio asli 3:2 dipertahankan;
// krop ke rasio container 3:1 dilakukan CSS object-cover di halaman).
const producerSrc = resolve(root, 'public/nick-fewings-qlLCBkTSYAI-unsplash.jpg');
const producerOut = resolve(imagesDir, 'producer.webp');

{
  const srcKB = Math.round(statSync(producerSrc).size / 1024);
  const { size } = await sharp(producerSrc)
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(producerOut);
  const outKB = Math.round(size / 1024);

  console.log(`producer: ${srcKB}KB → ${outKB}KB (${Math.round((1 - outKB / srcKB) * 100)}% lebih kecil)`);
}

console.log('Selesai. File WebP siap dipakai.');
