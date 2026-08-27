# Ohmega — Admin CMS & Blog Edukasi

**Repo:** `eiaiproject/Ohmega`
**Branch baru:** `feature/admin-cms`
**Produksi:** `ohmega.web.id` (Cloudflare Pages, branch `main`)

---

## 🎯 Tujuan
- Tambah halaman admin (`/admin`) untuk edit **harga produk** tanpa edit kode.
- Tambah **blog edukasi** (artikel terkait telur omega) dengan halaman daftar + detail.
- Tetap **statis** (SSG), tanpa server, tanpa database.
- Setiap perubahan di CMS → commit otomatis → Cloudflare rebuild → situs live.

---

## 🧰 Keputusan Arsitektur (disetujui)

| Topik | Pilihan | Alasan |
|---|---|---|
| CMS | **Decap CMS** (open-source) | Git-based, gratis, tidak perlu server. Login via GitHub. |
| Login | **GitHub OAuth** (otomatis) | Standar untuk Decap CMS, tinggal login sekali. |
| Alur publish | **Auto-merge ke `main`** | Karena situs statis & tidak ada CI, deploy Cloudflare sudah cukup aman sebagai verifikasi. |
| Field artikel | Standar blogging (judul, slug, tanggal, ringkasan, hero image, body markdown, tag, status draft/published, SEO) | Cukup lengkap untuk edukasi produk. |
| Gambar artikel | **Upload ke `public/images/blog/`** | Gratis, satu tempat dengan source, repo masih kecil. |

---

## 🏗️ Arsitektur

### Halaman baru
```
src/pages/admin/index.astro       ← redirect ke /admin/index.html
src/pages/admin/index.html        ← load Decap CMS UI (dari CDN: decap-cms.org)
src/pages/blog/index.astro        ← daftar artikel edukasi
src/pages/blog/[slug].astro       ← detail artikel
src/pages/blog/rss.xml.ts         ← RSS feed
```

### Konten yang dikelola lewat CMS
1. **Prices** — angkat `src/data/prices.ts` dari hardcoded ke file YAML/JSON di `content/prices.yaml` + loader Astro.
2. **Articles** (koleksi baru) — file Markdown di `content/articles/<slug>.md` dengan frontmatter.

### File baru (semua di branch `feature/admin-cms`)
```
public/admin/config.yml            ← konfigurasi Decap (collections: prices, articles)
public/admin/index.html            ← Decap UI mount point
content/prices.yaml                ← data harga (sumber baru, replace prices.ts)
content/articles/<slug>.md         ← artikel edukasi (satu file per artikel)
src/lib/content.ts                 ← helper: getPrices(), getAllArticles(), getArticle(slug)
src/components/blog/ArticleCard.astro
src/components/blog/ArticleMeta.astro
src/components/sections/BlogTeaserSection.astro   ← section "Edukasi" di landing page
src/layouts/BlogLayout.astro                      ← layout untuk halaman blog
```

### File yang di-refactor
- `src/data/products.ts` — ganti `import { prices }` jadi `import { prices } from '../lib/content'`
- `src/data/site.ts` — tambah `blogEnabled = true`
- `src/pages/index.astro` — tambah `<BlogTeaserSection />` di urutan akhir
- `src/pages/sitemap.xml.ts` — tambah URL blog + setiap artikel
- `src/layouts/BaseLayout.astro` — tidak ada perubahan
- `src/data/prices.ts` → **dihapus** (datanya pindah ke `content/prices.yaml`)

---

## 📋 Tahap Implementasi

### 1. Setup Decap CMS (1 file)
- `public/admin/index.html` — script tag dari CDN Decap
- `public/admin/config.yml` — backend `git-gateway`, 2 collections:
  - **Prices**: field `pack4`, `pack10`, `pack30` (number, required)
  - **Articles**: field standar blog (lihat tabel)

### 2. Migrasi prices ke YAML
- Bikin `content/prices.yaml` dengan angka saat ini
- Bikin `src/lib/content.ts`:
  ```ts
  import pricesData from '../../content/prices.yaml';
  export const prices = { pack4: pricesData.pack4, ... };
  export const perUnitPrice = (q, p) => Math.round(p / q);
  ```
- `src/data/products.ts` & `src/utils/whatsapp.ts`: ganti import ke `../lib/content`
- Hapus `src/data/prices.ts`

### 3. Halaman blog
- `src/lib/content.ts` tambah:
  ```ts
  import { getCollection } from 'astro:content';
  export const getAllArticles = () => getCollection('articles', d => d.data.status === 'published');
  export const getArticle = (slug) => getEntry('articles', slug);
  ```
- `src/pages/blog/index.astro` — grid 3 kolom
- `src/pages/blog/[slug].astro` — render markdown + `ArticleMeta`
- `astro.config.mjs` tambah `contentDir: 'content'`

### 4. Section "Edukasi" di landing
- `BlogTeaserSection.astro` — 3 artikel terbaru, kartu horizontal

### 5. SEO
- Sitemap tambah `/blog` + `/blog/<slug>`
- OG image blog
- RSS di `/blog/rss.xml`

### 6. Dokumentasi
- Tambah `docs/admin.md` — cara pakai: buka `/admin`, login, edit, publish
- Update `README.md` — catat section admin & blog

---

## 🔐 Keamanan & Akses

| Aspek | Penanganan |
|---|---|
| `/admin` di `robots.txt`? | **Tidak perlu** — `noindex` di meta tag halaman admin Decap. |
| Bot coba akses `/admin`? | Aman, cuma muncul form login tanpa OAuth. |
| File Decap di `public/admin/`? | Statis, semua orang bisa akses. Yang jadi gate: GitHub OAuth. |
| OAuth App di GitHub? | **Tidak perlu dibuat manual** — Decap pakai **GitHub Gateway** lewat `api.netlify.com` (gratis) atau **Cloudflare Pages Git Gateway** (kalau di-host di Netlify). **Untuk Cloudflare Pages**: butuh OAuth App manual (callback `https://ohmega.web.id/admin/`). |
| Image upload artikel? | Decap simpan di `public/images/blog/`, otomatis commit. |

> ⚠️ **Catatan penting untuk Cloudflare Pages:** Decap CMS default pakai `git-gateway` (Netlify). Di Cloudflare Pages tidak ada Git Gateway bawaan, jadi butuh **GitHub OAuth App manual** sebagai jembatan.

**Langkah setup OAuth (sekali saja, ~5 menit):**
1. Buka GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://ohmega.web.id`
3. Authorization callback URL: `https://ohmega.web.id/admin/`
4. Copy **Client ID** → masukkan ke `public/admin/config.yml` (`backend.client_id`)
5. (Client Secret hanya dipakai oleh Decap di browser session, tidak disimpan di repo)

Setelah itu Decap bisa commit langsung ke GitHub lewat akun kamu. Gratis, tanpa server tambahan.

**Alur commit:** Decap → GitHub OAuth → commit ke branch `main` → Cloudflare Pages rebuild otomatis → situs live (~1-2 menit).

---

## ✅ Verifikasi (setelah implementasi)

```bash
npm install
npm run build      # harusnya build sukses, termasuk halaman blog
npm run preview    # cek /admin redirect, /blog rendering, /blog/<slug> rendering
gh pr create --base main --head feature/admin-cms --title "feat: admin CMS & blog edukasi"
gh pr merge --auto --squash   # atau manual review
```

Cek setelah deploy:
- [ ] `/admin` → tampil UI Decap
- [ ] Login via GitHub → masuk dashboard
- [ ] Edit `pack4` jadi `13000` → publish → cek PR/commit di branch `cms` → auto-merge → tunggu 1-2 menit → `ohmega.web.id` tampil `Rp13.000`
- [ ] Bikin artikel baru `telur-omega-untuk-anak.md` → publish → cek `/blog` dan `/blog/telur-omega-untuk-anak`
- [ ] Sitemap mengandung URL blog & artikel

---

## ⏱️ Estimasi

- Setup Decap + migrasi prices: **~30 menit**
- Halaman blog + section edukasi: **~45 menit**
- Setup Cloudflare Worker OAuth bridge: **~20 menit**
- Test & verifikasi: **~20 menit**
- **Total: ~2 jam**

---

## 📌 Setelah Selesai (belum perlu, catat untuk nanti)

- `ponytail:` — kalau traffic artikel naik, pindah dari `content/articles/*.md` ke headless CMS (Sanity/Payload) + ISR. Repo sudah pisah, migrasi tidak ganggu situs.
- `ponytail:` — kalau butuh multi-admin atau role-based, pindah ke Sanity/Payload.
- SEO artikel: tambah `article:author`, JSON-LD `BlogPosting` di detail page.
- Analytics: `data-track` event blog (baca artikel, klik CTA di artikel).
