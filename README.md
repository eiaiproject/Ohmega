# OHMEGA Landing Page

Landing page penjualan untuk **OHMEGA** — telur omega lokal Sidoarjo dengan layanan antar ke rumah.  
Dibangun dengan [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), static site, siap deploy ke [Cloudflare Pages](https://pages.cloudflare.com).

**[ohmega.id](https://ohmega.id)** — domain produksi.

---

## Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Astro 7 (static site generation) |
| CSS | Tailwind CSS v4, design tokens via `@theme` |
| TypeScript | Type-safe data, props, utilities |
| Ikon | Reicon (`reicon@1.1.103`) — local SVG sprite, outline weight |
| Font | Nunito Sans (self-hosted WOFF2, 4 weights) |
| Deployment | Cloudflare Pages (SSG, branch `main`) |
| Tracking | Cloudflare Web Analytics (placeholder — token belum diisi) |

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
  assets/styles/global.css     — Tailwind `@import`, @font-face, design tokens, utility classes
  components/
    common/                    — Button, Container, Icon, SectionHeading, WhatsAppButton
    layout/                    — Header, MobileMenu, Footer
    sections/                  — Hero, TrustBar, Products, ProductCard, Nutrition,
                                 Delivery, Certifications, OrderSteps, Producer,
                                 FinalCTA, StickyMobileCTA
  data/                        — site.ts, navigation.ts, products.ts, nutrition.ts
  icons/                       — index.ts (sprite loader), sprite/*.svg, README.md
  layouts/BaseLayout.astro     — HTML shell, SEO meta, JSON-LD, tracking, scroll reveal
  pages/
    index.astro                — Halaman utama
    404.astro                  — Halaman tidak ditemukan
    sitemap.xml.ts             — Sitemap endpoint
  utils/                       — whatsapp.ts, seo.ts
public/
  logo/                        — ohmega-logo.svg (wordmark + simbol telur)
  images/                      — hero.webp, product-{10,30,4,6}.svg, producer.svg
  certifications/              — nkv.svg, sig.svg, halal.svg
  fonts/                       — nunito-sans-{regular,semibold,bold,extrabold}.woff2
  robots.txt, _headers, social-preview.svg, favicon.svg
```

---

## Data & Konfigurasi

Semua data bisnis terpusat di `src/data/` — jangan hardcode nilai berulang.

### Identitas & kontak — `src/data/site.ts`

```ts
brandName               // OHMEGA
tagline                 // High Protein, Low Cholesterol
whatsappDisplay         // 085111331269
whatsappInternational   // 6285111331269
instagramHandle         // ohmega_id
serviceArea             // Sidoarjo
producerName            // PT Mahkota Unggas Sejahtera
producerCity            // Mojokerto
deliveryArea            // Perumahan Amartha Safira
deliveryFlatRate        // 5000
```

### Produk & harga — `src/data/products.ts`

Setiap produk memiliki:
- `id`, `name`, `quantity`, `image`, `imageAlt`, `description`
- `status: 'available' | 'coming-soon'`
- `price`, `pricePerUnit`, `savings` (untuk produk tersedia)
- `whatsappHref` (URL + pesan ter-encode)
- `buttonLabel`

### Kandungan gizi — `src/data/nutrition.ts`

Angka per 100 gram — Omega-3, DHA, EPA.

### Navigasi — `src/data/navigation.ts`

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
| Isi 10 | `public/images/product-10.svg` | 400×400 px |
| Isi 30 | `public/images/product-30.svg` | 400×400 px |
| Isi 4 | `public/images/product-4.svg` | 400×400 px |
| Isi 6 | `public/images/product-6.svg` | 400×400 px |
| Produksi | `public/images/producer.svg` | 1200×400 px, 3:1 |

> **Catatan:** Foto produk asli belum tersedia. Gunakan SVG placeholder atau file `.webp`/`.jpg`.  
> Setelah diganti, update `imageAlt` di `src/data/products.ts`.

### Logo sertifikasi

| Sertifikat | File |
|------------|------|
| NKV | `public/certifications/nkv.svg` |
| SIG | `public/certifications/sig.svg` |
| Halal | `public/certifications/halal.svg` |

> **Catatan:** Logo resmi dan nomor sertifikat belum tersedia.  
> Saat tersedia, ganti file SVG dan update teks di `src/components/sections/CertificationsSection.astro`.

### Metadata & SEO

| Item | Lokasi |
|------|--------|
| Site title / description | `src/utils/seo.ts` |
| Social preview image | `public/social-preview.svg` (ganti dengan `.jpg` 1200×630 jika perlu) |
| Favicon | `public/favicon.svg` |
| robots.txt | `public/robots.txt` |
| Security headers | `public/_headers` |

---

## Mengubah Harga & Ongkir

| Data | File | Field |
|------|------|-------|
| Harga produk | `src/data/products.ts` | `price`, `pricePerUnit`, `savings` |
| Ongkir flat | `src/data/site.ts` | `deliveryFlatRate` (number), `deliveryFlatRateLabel` (string) |

Format mata uang: `Rp` + locale `id-ID` (contoh: Rp29.000, Rp81.000, Rp5.000).

---

## Mengubah Nomor WhatsApp

Edit dua nilai di `src/data/site.ts`:

```ts
whatsappDisplay: '085111331269',        // Tampilan di halaman
whatsappInternational: '6285111331269', // Format wa.me (tanpa +/00)
```

Pesan WhatsApp untuk setiap paket diatur di `src/data/products.ts` (fungsi `waLink()` inline).

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
8. (Opsional) tambahkan custom domain `ohmega.id`

### File penting untuk deployment

- `public/_headers` — security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- `public/robots.txt` — izinkan crawler
- `src/pages/sitemap.xml.ts` — sitemap otomatis

---

## Animasi

Animasi ringan via CSS + IntersectionObserver:

- **Scroll reveal**: elemen dengan class `.reveal` fade+slide up saat masuk viewport
- **Card hover**: `.card-hover` → translateY(-4px) + shadow deeper
- **Hero entrance**: konten & gambar fade in dengan stagger 0.2s
- **Badge pulse**: badge produk scale in saat muncul
- **Button micro-interactions**: hover lift + WA button glow

Semua animasi non-esensial — di-nonaktifkan saat `prefers-reduced-motion: reduce`.

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

- **Tanpa emoji, emoticon, atau karakter Unicode sebagai ikon** — di seluruh codebase
- **Tanpa data palsu** — tidak ada testimonial, rating, harga palsu, nomor sertifikat palsu, countdown, atau stok terbatas
- **Tanpa backend** — static site murni. Pemesanan via WhatsApp
- **Tanpa framework JS** — React, Vue, Svelte, jQuery tidak digunakan
- **Nunito Sans** satu-satunya font — jangan import Inter atau font lain
- Klaim produk harus diverifikasi dengan dokumen pendukung sebelum publikasi

---

## Placeholder yang Masih Perlu Diganti

| Item | Status | Lokasi Penggantian |
|------|--------|-------------------|
| Logo NKV | Placeholder | `public/certifications/nkv.svg` |
| Logo SIG | Placeholder | `public/certifications/sig.svg` |
| Logo Halal | Placeholder | `public/certifications/halal.svg` |
| Foto hero | Placeholder (SVG) | `public/images/hero.webp` |
| Foto produk isi 10 | Placeholder (SVG) | `public/images/product-10.svg` |
| Foto produk isi 30 | Placeholder (SVG) | `public/images/product-30.svg` |
| Foto produk isi 4 | Placeholder (SVG) | `public/images/product-4.svg` |
| Foto produk isi 6 | Placeholder (SVG) | `public/images/product-6.svg` |
| Foto area produksi | Placeholder (SVG) | `public/images/producer.svg` |
| Social preview | `public/social-preview.svg` (placeholder) | Ganti dengan `.jpg` 1200×630 |
| Nomor sertifikat NKV | Belum tersedia | `src/components/sections/CertificationsSection.astro` |
| Nomor sertifikat SIG | Belum tersedia | `src/components/sections/CertificationsSection.astro` |
| Nomor sertifikat Halal | Belum tersedia | `src/components/sections/CertificationsSection.astro` |
| Dokumen pengujian gizi | Belum tersedia | `src/data/nutrition.ts` (`nutritionNote`) |
| Cloudflare Analytics token | Belum diisi | `src/layouts/BaseLayout.astro` (komentar) |
| Domain produksi | `https://ohmega.id` | `src/data/site.ts` (`siteUrl`) |
| Instagram | @ohmega_id (belum diverifikasi) | `src/data/site.ts` |
