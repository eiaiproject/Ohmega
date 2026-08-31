# OHMEGA Landing Page

Landing page penjualan untuk **OHMEGA**: telur omega lokal Sidoarjo dengan layanan antar ke rumah.  
Dibangun dengan [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), static site, siap deploy ke [Cloudflare Pages](https://pages.cloudflare.com).

**[ohmega.web.id](https://ohmega.web.id)**: domain produksi.

> Untuk edit harga atau tulis artikel edukasi, lihat bagian [Mengubah Harga](#mengubah-harga) dan [Menulis Artikel Edukasi](#menulis-artikel-edukasi) di bawah.

---

## Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Astro 7 (static site generation) |
| CSS | Tailwind CSS v4, design tokens via `@theme` |
| TypeScript | Type-safe data, props, utilities |
| Ikon | Reicon (`reicon@1.1.103`): local SVG sprite, outline weight |
| Font | Nunito Sans (self-hosted WOFF2, 4 weights) |
| Deployment | Cloudflare Pages (SSG, branch `main`) |
| Tracking | Cloudflare Web Analytics (placeholder: token belum diisi) |

---

## Prerequisites

- Node.js 20+
- npm

---

## Memulai

```bash
# Install dependencies
npm install

# Development server (default http://localhost:4321)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

Build output di `dist/`.

---

## Struktur Proyek

```
src/
  assets/styles/global.css    : Tailwind `@import`, @font-face, design tokens, utility classes, prose
  components/
    common/                   : Button, Container, Icon, SectionHeading, WhatsAppButton
    layout/                   : Header, MobileMenu, Footer
    sections/                 : Hero, TrustBar, Products, ProductCard, Nutrition,
                                Delivery, Certifications, OrderSteps, Producer,
                                BlogTeaser, FinalCTA, StickyMobileCTA
    blog/                     : ArticleCard, ArticleMeta (komponen untuk halaman blog)
  content.config.ts           : Astro content collection: 'articles'
  data/                       : site.ts, navigation.ts, products.ts, nutrition.ts
  lib/content.ts              : loader untuk prices.yaml + articles collection
  icons/                      : index.ts (sprite loader), sprite/*.svg, README.md
  layouts/
    BaseLayout.astro          : HTML shell, SEO meta, JSON-LD, tracking, scroll reveal
    BlogLayout.astro          : Layout khusus halaman /blog (dengan OG image per artikel)
  pages/
    index.astro               : Halaman utama
    blog/
      index.astro             : Daftar artikel edukasi
      [slug].astro            : Detail artikel (Markdown)
      rss.xml.ts              : RSS feed
    404.astro                 : Halaman tidak ditemukan
    sitemap.xml.ts            : Sitemap endpoint (dynamic, termasuk artikel)
  utils/                      : whatsapp.ts, seo.ts
content/
  prices.yaml                 : Harga 3 kemasan
  articles/<slug>.md          : Artikel edukasi (satu file MD per artikel)
public/
  logo/                       : ohmega-logo.svg (wordmark + simbol telur)
  images/                     : hero.webp, product-{4,10,30}.webp (+ .png sumber), producer.webp
  images/blog/                : Gambar hero artikel
  certifications/             : nkv.svg, sig.png, halal.svg
  labels/                     : label-isi-{4,10,30}.{svg,png} (label brand cetak)
  fonts/                      : nunito-sans-{regular,semibold,bold,extrabold}.woff2
  robots.txt, _headers, social-preview.{svg,png}, favicon.svg
scripts/
  generate-icons.mjs          : Buat SVG sprite dari paket reicon
  generate-label.mjs          : Render label cetak (PNG 300 DPI) dari SVG master
  generate-product-images.mjs : Konversi PNG ke WebP teroptimasi
  generate-social-preview.mjs : Render social-preview.png dari SVG
tests/
  e2e.spec.ts                 : Playwright E2E tests untuk landing & blog
```

---

## Data & Konfigurasi

Semua data bisnis terpusat di `src/data/`: jangan hardcode nilai berulang.

### Identitas & kontak: `src/data/site.ts`

```ts
brandName               // OHMEGA
tagline                 // Kaya Protein, Rendah Kolesterol
whatsappDisplay         // 085111331269
whatsappInternational   // 6285111331269
instagramHandle         // ohmega_id
serviceArea             // Sidoarjo
producerName            // PT Mahkota Unggas Sejahtera
producerCity            // Mojokerto
deliveryArea            // Perumahan Amartha Safira
```

### Produk & harga: `src/data/products.ts`

Setiap produk memiliki:
- `id`, `name`, `quantity`, `image`, `imageAlt`, `description`
- `status: 'available' | 'coming-soon'`
- `price`, `pricePerUnit`, `savings`: **otomatis dihitung dari `content/prices.yaml`** (jangan diedit manual)
- `whatsappHref` (URL + pesan ter-encode, harga otomatis mengikuti `content/prices.yaml`)
- `buttonLabel`

### Harga: `content/prices.yaml`

**Satu-satunya file harga.** Ubah angka `pack4` / `pack10` / `pack30` untuk menyesuaikan harga (lihat bagian [Mengubah Harga](#mengubah-harga)).

### Kandungan gizi: `src/data/nutrition.ts`

Angka per 100 gram: Omega-3, DHA, EPA.

### Navigasi: `src/data/navigation.ts`

Anchor link untuk header & footer.

---

## Mengganti Aset Visual

### Logo

Ganti file `public/logo/ohmega-logo.svg`.  
Proporsi asli: 864×150. Scaling otomatis via `h-* w-auto`.

### Foto produk & hero

| Aset | File | Ukuran rekomendasi |
|------|------|-------------------|
| Hero | `public/images/hero.webp` | 800×1000 px, 4:5 |
| Isi 10 | `public/images/product-10.webp` | 800×800 px |
| Isi 30 | `public/images/product-30.webp` | 800×800 px |
| Isi 4 | `public/images/product-4.webp` | 800×800 px |
| Produksi | `public/images/producer.webp` | 1600×1066 px, 3:2 (tampil utuh) |

> **Catatan:** File `.png` di `public/images/` adalah sumber resolusi penuh (1254×1254), dan sumber foto produksi adalah `public/nick-fewings-qlLCBkTSYAI-unsplash.jpg` (3032×2021). Setelah mengganti sumber, buat ulang WebP dengan `node scripts/generate-product-images.mjs`, lalu update `imageAlt` di `src/data/products.ts`.

### Logo sertifikasi

| Sertifikat | File |
|------------|------|
| NKV | `public/certifications/nkv.svg` |
| SIG | `public/certifications/sig.png` |
| Halal | `public/certifications/halal.svg` |

> **Catatan:** Logo resmi dan nomor sertifikat belum tersedia.  
> Saat tersedia, ganti file SVG dan update teks di `src/components/sections/CertificationsSection.astro`.

### Label brand (cetak)

Label untuk kemasan telur, tersedia di `public/labels/`:

| File | Ukuran | Penggunaan |
|------|--------|-----------|
| `label-isi-4.svg` / `.png` | 5×5 cm (591×591 px @300 DPI) | Kemasan isi 4 (rasio 1:1) |
| `label-isi-10.svg` / `.png` | 15×5 cm (1772×591 px @300 DPI) | Kemasan isi 10 |
| `label-isi-30.svg` / `.png` | 15×5 cm (1772×591 px @300 DPI) | Kemasan isi 30 |

Layout mengikuti referensi desain label (file `public/xml version=...png`): logo besar di atas, stempel brand bulat di kanan atas, nama produk + pill ukuran isi + tagline, tiga badge berbentuk telur (NKV · SIG · HALAL) di bawah, dan strip kontak. Warna seluruhnya dari palet brand (referensi aslinya memakai ungu/pink yang diganti ke warna OHMEGA).  
Konten: logo OHMEGA (warna asli), nama produk + ukuran isi, tagline, badge NKV (BUP 3516070-053), SIG (17.1.F.FP), HALAL, nomor WhatsApp, dan `ohmega.web.id`.  
**SVG** adalah master editabel (buka di Illustrator/Inkscape/Canva). **PNG** siap cetak 300 DPI dengan metadata ukuran fisik.  
Setelah mengedit SVG, buat ulang PNG dengan `node scripts/generate-label.mjs`.  
> Catatan: teks dirender dengan font fallback sistem (Helvetica/Arial) karena Nunito Sans tidak selalu ter-install; wordmark logo tetap vektor asli.  
> Label full-bleed tanpa area bleed: saat mencetak, pastikan percetakan tidak memotong tepi (atau tambahkan margin sendiri 2–3 mm di sekitar desain).

### Metadata & SEO

| Item | Lokasi |
|------|--------|
| Site title / description | `src/utils/seo.ts` |
| Social preview image | `public/social-preview.png` (1200×630, dari SVG via script: lihat di bawah) |
| Favicon | `public/favicon.svg` |
| robots.txt | `public/robots.txt` |
| Security headers | `public/_headers` |

**Social preview:** edit `public/social-preview.svg`, lalu jalankan `node scripts/generate-social-preview.mjs` untuk membuat ulang `social-preview.png`. PNG wajib dipakai untuk og:image (WhatsApp/Facebook/Twitter tidak mendukung SVG). Setelah mengganti, naikkan `ogImageVersion` di `src/data/site.ts` agar platform tidak memakai cache lama.  
> Catatan: teks di PNG (headline, tagline, dll.) dirender dengan font fallback sistem (Helvetica/Arial) karena Nunito Sans tidak selalu ter-install; wordmark logo tetap vektor Nunito Sans asli. Jika ingin hasil persis brand font, install Nunito Sans di mesin sebelum menjalankan script.  
> Urutan: jalankan `node scripts/generate-product-images.mjs` dulu (membuat foto WebP), lalu `node scripts/generate-social-preview.mjs`.

---

## Mengubah Harga

Edit **satu file**: `content/prices.yaml`: ubah angka `pack4` / `pack10`
/ `pack30`, lalu commit & deploy.

Otomatis ikut menyesuaikan:
- Harga per butir di kartu produk
- Label "Hemat …" (isi 30 vs isi 10): hanya tampil jika memang lebih hemat
- Pesan WhatsApp saat pemesanan
- Tulisan "Mulai Rp… per butir" di hero & trust bar

Format mata uang: `Rp` + locale `id-ID` (contoh: Rp29.000, Rp81.000).

> Pengiriman di luar Perumahan Amartha Safira dikonfirmasi per pesanan melalui WhatsApp.

---

## Mengubah Nomor WhatsApp

Edit dua nilai di `src/data/site.ts`:

```ts
whatsappDisplay: '085111331269',        // Tampilan di halaman
whatsappInternational: '6285111331269', // Format wa.me (tanpa +/00)
```

Pesan WhatsApp untuk setiap paket diatur di `src/data/products.ts` (fungsi `waLink()` inline).

---

## Menulis Artikel Edukasi

Buat file baru di `content/articles/<slug>.md`:

```markdown
---
title: "Judul artikel"
slug: "slug-artikel"
date: 2026-08-26
description: "Ringkasan 1-2 kalimat."
hero: "/images/blog/hero-gambar.webp"
heroAlt: "Deskripsi gambar"
tags: ["Omega-3", "Resep"]
status: "published"  # atau "draft"
---

## Heading utama

Isi artikel dalam Markdown. Heading utama otomatis jadi <h2>.
```

Gunakan `status: draft` untuk yang masih ditulis, `published` untuk yang siap tampil.

---

## Menambahkan Sertifikat & Dokumen

1. Ganti file SVG logo di `public/certifications/`
2. Update `src/components/sections/CertificationsSection.astro`:
   - Ganti teks "Dokumen sedang dipersiapkan" dengan `Nomor: …`
   - Hapus class `opacity-50` pada `<img>` jika logo resmi sudah siap
3. Update `nutritionNote` di `src/data/nutrition.ts` jika dokumen pengujian sudah tersedia

---

## Deployment (Cloudflare Pages)

1. Push repository ke GitHub
2. Buat project baru di Cloudflare Pages
3. Hubungkan repository GitHub
4. Branch: `main`
5. **Build command**: `npm run build`
6. **Output directory**: `dist`
7. Deploy
8. (Opsional) tambahkan custom domain `ohmega.web.id`

### File penting untuk deployment

- `public/_headers`: security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- `public/robots.txt`: izinkan crawler
- `src/pages/sitemap.xml.ts`: sitemap otomatis

---

## Animasi

Animasi ringan via CSS + IntersectionObserver:

- **Scroll reveal**: elemen dengan class `.reveal` fade+slide up saat masuk viewport
- **Card hover**: `.card-hover` → translateY(-4px) + shadow deeper
- **Hero entrance**: konten & gambar fade in dengan stagger 0.2s
- **Badge pulse**: badge produk scale in saat muncul
- **Button micro-interactions**: hover lift + WA button glow

Semua animasi non-esensial: di-nonaktifkan saat `prefers-reduced-motion: reduce`.

---

## Ikon

Semua ikon UI berasal dari [reicon.dev](https://reicon.dev) (outline weight), disimpan sebagai SVG sprite lokal.  
Lihat `src/icons/README.md` untuk mapping nama ikon.

### Aturan ikon

- Ikon dekoratif: `aria-hidden="true"`
- Ikon fungsional: accessible label eksplisit
- Ukuran inline: 16–18px, tombol: 18–20px, feature card: 24–32px
- Tidak mencampur outline dan filled dalam grup yang sama
- Tidak menggunakan emoji, emoticon, atau karakter Unicode sebagai ikon

---

## Aturan Proyek

- **Tanpa emoji, emoticon, atau karakter Unicode sebagai ikon**: di seluruh codebase
- **Tanpa data palsu**: tidak ada testimonial, rating, harga palsu, nomor sertifikat palsu, countdown, atau stok terbatas
- **Tanpa backend**: static site murni. Pemesanan via WhatsApp
- **Tanpa framework JS**: React, Vue, Svelte, jQuery tidak digunakan
- **Nunito Sans** satu-satunya font: jangan import Inter atau font lain
- Klaim produk harus diverifikasi dengan dokumen pendukung sebelum publikasi

---

## Placeholder yang Masih Perlu Diganti

| Item | Status | Lokasi Penggantian |
|------|--------|-------------------|
| Logo NKV | Placeholder | `public/certifications/nkv.svg` |
| Foto hero | Placeholder (SVG) | `public/images/hero.webp` |

| Foto area produksi | **Sudah diganti** (unsplash, JPG→WebP) | `public/images/producer.webp` |
| Nomor sertifikat NKV | Tersedia (BUP 3516070-053) | `src/components/sections/CertificationsSection.astro` |
| Cloudflare Analytics token | Belum diisi | `src/layouts/BaseLayout.astro` (komentar) |
| Domain produksi | `https://ohmega.web.id` | `src/data/site.ts` (`siteUrl`) |
| Instagram | @ohmega_id (belum diverifikasi) | `src/data/site.ts` |
