# Panduan Admin OHMEGA

Dokumen ini menjelaskan cara mengelola konten situs OHMEGA lewat CMS tanpa
entuh kode. Disarankan untuk pemilik situs, admin, atau siapa pun yang
bertanggung jawab memperbarui harga & konten edukasi.

## Daftar Isi

1. [Mengakses Halaman Admin](#mengakses-halaman-admin)
2. [Login Pertama Kali](#login-pertama-kali)
3. [Mengedit Harga Produk](#mengedit-harga-produk)
4. [Mengelola Artikel Edukasi](#mengelola-artikel-edukasi)
5. [Tips & Best Practices](#tips--best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Mengakses Halaman Admin

Buka <https://ohmega.web.id/admin/> di browser. Bookmark alamat ini untuk
akses cepat.

Tidak ada tombol "Login Admin" di halaman utama: sengaja, agar tidak
memancing orang coba-coba. Halaman ini juga di-`Disallow` di `robots.txt`
sehingga tidak akan terindeks Google.

## Login Pertama Kali

Setup OAuth hanya perlu dilakukan sekali oleh pemilik repo. Setelah itu
semua admin yang punya akses tulis ke repo `eiaiproject/Ohmega` bisa login
langsung.

### Setup OAuth (owner)

Karena situs di-host di Cloudflare Pages (bukan Netlify), perlu OAuth
bridge sebagai perantara antara Decap ↔ GitHub.

**Opsi paling mudah: deploy Cloudflare Worker** yang sudah disiapkan di
folder `scripts/ohmega-cms-auth/` (lihat
[`scripts/ohmega-cms-auth/DEPLOY.md`](scripts/ohmega-cms-auth/DEPLOY.md) untuk
panduan langkah-demi-langkah).

Ringkas:

1. `cd scripts/ohmega-cms-auth && npm install -g wrangler && wrangler login`
2. Set secrets di Cloudflare: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
3. `wrangler deploy` → catat URL worker
   (misal `https://ohmega-cms-auth.<subdomain>.workers.dev`)
4. Buat GitHub OAuth App di <https://github.com/settings/developers>:
   - Homepage URL: `https://ohmega.web.id`
   - Authorization callback URL: `<worker-url>/callback`
5. Edit `public/admin/config.yml` di repo:
   - Ganti `auth_endpoint: api.netlify.com` → URL worker kamu
   (lihat juga [`scripts/ohmega-cms-auth/CONFIGURE-DECAP.md`](scripts/ohmega-cms-auth/CONFIGURE-DECAP.md))
6. Commit & deploy. CMS siap pakai.

**Opsi alternatif:** Pakai layanan OAuth publik seperti
[silverbulletmd/decap-cms-oauth-provider](https://github.com/silverbulletmd/decap-cms-oauth-provider).
Konfigurasi lebih lanjut di [docs Decap](https://decapcms.org/docs/external-oauth-clients/).

### Login sebagai admin

1. Buka <https://ohmega.web.id/admin/>.
2. Klik **Login with GitHub**.
3. Izinkan akses ke repo `eiaiproject/Ohmega`.
4. Kamu akan masuk ke dashboard CMS.

## Mengedit Harga Produk

1. Di dashboard, klik **Harga Produk** di sidebar.
2. Klik kanan pada entry "Harga" → **Edit** (atau langsung klik entry-nya).
3. Ubah angka di field:
   - **Harga Isi 4 (Rp)**: harga per kemasan 4 butir
   - **Harga Isi 10 (Rp)**: harga per kemasan 10 butir
   - **Harga Isi 30 (Rp)**: harga per kemasan 30 butir
4. Klik **Publish** di kanan atas.
5. Tunggu ~1-2 menit. Cloudflare Pages akan rebuild & deploy otomatis.
6. Cek <https://ohmega.web.id>: harga sudah ter-update.

**Yang ikut menyesuaikan otomatis:**
- Harga per butir di kartu produk
- Label "Hemat …" untuk kemasan isi 30
- Teks "Mulai Rp… per butir" di hero & trust bar
- Pesan WhatsApp yang dikirim saat pelanggan memesan
- Struktur data JSON-LD di `<head>` (untuk Google)

## Mengelola Artikel Edukasi

### Membuat artikel baru

1. Di dashboard, klik **Artikel Edukasi** → **New Article**.
2. Isi field:
   - **Judul**: tampil sebagai `<h1>`, misal *"5 Resep Sarapan dengan Telur Omega"*
   - **Slug**: bagian URL: `/blog/<slug>`. Contoh: `5-resep-sarapan-telur-omega`
   - **Tanggal Publish**: tanggal artikel
   - **Ringkasan**: 1-2 kalimat untuk kartu & meta description
   - **Hero Image**: gambar utama, rekomendasi 1200×630 px
   - **Hero Image Alt**: deskripsi gambar untuk aksesibilitas
   - **Tag**: label-topik, misal `Omega-3`, `Resep`
   - **Status**: `draft` (belum tampil) atau `published` (langsung tampil)
   - **SEO Title**: opsional, judul untuk Google
   - **SEO Description**: opsional, deskripsi untuk Google
   - **Isi Artikel**: tulis dalam Markdown
3. Klik **Publish**.

### Mengedit artikel existing

1. **Artikel Edukasi** → klik judul artikel.
2. Edit field yang perlu diubah.
3. **Publish** lagi untuk simpan & deploy.

### Menghapus artikel

1. **Artikel Edukasi** → klik judul artikel.
2. Klik menu titik-titik di kanan atas → **Delete**.
3. Konfirmasi. Artikel hilang dari situs setelah deploy.

### Markdown yang didukung

- Heading: `## Judul`, `### Subjudul`
- Bold: `**teks**`, italic: `*teks*`
- Link: `[teks](https://...)`
- List: `- item` atau `1. item`
- Blockquote: `> kutipan`
- Code: `` `inline` `` atau blok 3 backtick

Heading utama (`##`) otomatis jadi `<h2>` di halaman. Heading di body
jangan pakai `#` (sudah dipakai judul artikel).

## Tips & Best Practices

### Harga

- **Selalu update 3 harga bersamaan**: kalau hanya satu yang berubah,
  perbandingan "Paling Hemat" di kemasan 30 bisa tidak akurat.
- **Test** perubahan dengan buka <https://ohmega.web.id> setelah deploy
  selesai (cek status build di dashboard Cloudflare).

### Artikel

- **Slug permanen**: setelah dipublikasikan, jangan ubah slug, karena
  link luar (Google, medsos) akan jadi 404. Kalau harus ganti, buat
  redirect manual di Cloudflare Pages.
- **Hero image**: kompres dulu sebelum upload (gunakan
  `scripts/generate-product-images.mjs` style atau [squoosh.app](https://squoosh.app)).
  Ukuran ideal 1200×630 px, format WebP atau JPG, maks ~200 KB.
- **Tulis ringkasan** yang menarik: ini yang muncul di kartu, Google
  snippet, dan share preview.
- **Status draft**: gunakan `draft` saat masih menulis. Ganti ke
  `published` saat siap tampil.

## Troubleshooting

### Tombol "Publish" abu-abu / tidak bisa simpan

- Kemungkinan OAuth bridge (worker) tidak aktif atau kredensial salah.
- Cek status worker di dashboard Cloudflare.
- Cek `public/admin/config.yml` → `auth_endpoint` harusnya URL worker, bukan
  `api.netlify.com`.

### Login berhasil tapi tidak bisa commit

- Pastikan akun GitHub kamu punya akses **tulis** ke repo `eiaiproject/Ohmega`.
- Kalau tidak, tambahkan sebagai collaborator (owner repo yang atur).

### Perubahan tidak muncul di situs setelah 5 menit

- Cek status build di dashboard Cloudflare Pages.
- Lihat build log untuk error.
- Kalau tidak ada error tapi tidak berubah, coba hard-refresh
  (Ctrl+Shift+R): CDN cache mungkin masih memegang versi lama.

### Salah hapus / edit artikel

- Karena ini Git, semua perubahan tercatat. Buka tab **Commits** di
  dashboard CMS → klik commit yang salah → "Revert".
- Atau lewat GitHub: `git revert <commit-sha>` lalu push.

### Lupa OAuth setup

- Lihat [Login Pertama Kali](#login-pertama-kali) di atas.
- Hubungi owner repo kalau perlu akses OAuth baru.

---

Butuh bantuan lebih? Buka issue di
<https://github.com/eiaiproject/Ohmega/issues>.
