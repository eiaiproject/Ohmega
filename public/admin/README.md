# Halaman Admin OHMEGA (`/admin`)

Folder ini berisi **Decap CMS**: antarmuka web untuk mengedit data situs tanpa
entuh kode. Disajikan sebagai static file, tidak ada server.

## Cara Pakai

1. Buka <https://ohmega.web.id/admin/> di browser.
2. Klik **Login with GitHub** → izinkan akses ke repo `eiaiproject/Ohmega`.
3. Pilih menu:
   - **Harga Produk**: ubah angka `pack4` / `pack10` / `pack30`, klik Publish.
   - **Artikel Edukasi**: buat baru, edit, atau hapus artikel.
4. Setiap Publish = commit ke `main` + auto-deploy ke Cloudflare Pages (~1-2 menit).

## Setup Awal (sekali saja, owner saja)

### 1. OAuth Bridge

Decap CMS default butuh OAuth App sebagai bridge login. Karena situs di-host
di Cloudflare Pages (bukan Netlify), gunakan salah satu:

**Opsi A: Cloudflare Worker (gratis):**
1. Deploy worker dari folder `scripts/ohmega-cms-auth/` (lihat
   `scripts/ohmega-cms-auth/DEPLOY.md` untuk panduan lengkap) ke Cloudflare
   Workers.
2. Set secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
3. URL worker (misal `https://ohmega-cms-auth.workers.dev`) → masukkan ke
   `public/admin/config.yml` bagian `auth_endpoint` (lihat juga
   `scripts/ohmega-cms-auth/CONFIGURE-DECAP.md`).

**Opsi B: OAuth proxy gratis publik:**
Gunakan layanan seperti [decaporg/oauth-client](https://github.com/decaporg/oauth-client).
Konfigurasi lebih lanjut lihat [docs Decap](https://decapcms.org/docs/external-oauth-clients/).

### 2. GitHub OAuth App

1. Buka <https://github.com/settings/developers> → New OAuth App.
2. Homepage URL: `https://ohmega.web.id`
3. Authorization callback URL: `https://ohmega.web.id/admin/`
4. Catat **Client ID** (juga Client Secret, simpan di secret manager).

## File-file di Folder Ini

| File | Fungsi |
|------|--------|
| `index.html` | Halaman UI Decap, load script dari CDN. |
| `config.yml` | Skema data: koleksi Harga + koleksi Artikel. |

## Keamanan

- Folder ini sengaja **tidak di-robots-txt**-block; yang jadi gate adalah OAuth.
- File `index.html` menyertakan `<meta name="robots" content="noindex">` agar
  tidak terindeks Google.
- Login via GitHub OAuth, hanya akun yang kamu izinkan di OAuth App yang bisa
  masuk.
