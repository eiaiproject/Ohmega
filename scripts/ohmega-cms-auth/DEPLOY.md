# Panduan Deploy Worker OHMEGA CMS Auth

Setup OAuth bridge antara Decap CMS dan GitHub di Cloudflare Workers.
Free tier 100k request/hari — lebih dari cukup untuk CMS internal.

## Estimasi Waktu

± 15 menit. Langkah 1-2 (GitHub OAuth App) ± 5 menit, langkah 3-6 (Worker) ± 10 menit.

## Prasyarat

- Akun Cloudflare (gratis) — <https://dash.cloudflare.com/sign-up>
- Repo `eiaiproject/Ohmega` adalah milik kamu (atau kamu owner)
- Node.js 20+ & npm terinstall

---

## Langkah 1: Buat GitHub OAuth App

1. Login ke GitHub → buka <https://github.com/settings/developers>
2. Klik **OAuth Apps** (sidebar kiri) → **New OAuth App**
3. Isi form:
   - **Application name**: `OHMEGA CMS`
   - **Homepage URL**: `https://ohmega.web.id`
   - **Application description**: `OAuth bridge untuk Decap CMS OHMEGA`
   - **Authorization callback URL**: sementara isi `https://example.com/callback` (nanti di-update setelah worker dapat URL)
4. Klik **Register application**
5. Di halaman detail OAuth App:
   - Catat **Client ID** (misal `Iv1.abc123def456`)
   - Klik **Generate a new client secret** → catat **Client Secret** (hanya tampil sekali!)

> ⚠️ **Jaga kerahasiaan Client Secret.** Siapa pun yang punya ini bisa
> commit atas nama kamu ke repo.

## Langkah 2: Install wrangler (sekali)

```bash
npm install -g wrangler
wrangler --version   # harus tampil versi
```

## Langkah 3: Login wrangler

```bash
wrangler login
```

Browser akan terbuka ke halaman Cloudflare. Klik **Allow**. Setelah itu
terminal akan kembali ke prompt — wrangler sudah tersimpan kredensialnya
di `~/.config/.wrangler/config/default.toml`.

## Langkah 4: Set secrets

Masuk ke folder worker:

```bash
cd scripts/ohmega-cms-auth
```

Set dua secret (tiap command akan minta paste nilai):

```bash
wrangler secret put GITHUB_CLIENT_ID
# Paste Client ID dari langkah 1, tekan Enter

wrangler secret put GITHUB_CLIENT_SECRET
# Paste Client Secret dari langkah 1, tekan Enter
```

Verifikasi:

```bash
wrangler secret list
# Harus muncul GITHUB_CLIENT_ID dan GITHUB_CLIENT_SECRET
```

## Langkah 5: Deploy

```bash
wrangler deploy
```

Output:

```
Total Upload: 1.xx KiB / gzip: 0.xx KiB
Worker Startup Time: 50ms
Uploaded ohmega-cms-auth (X.XX sec)
Deployed ohmega-cms-auth triggers (0.XX sec)
   https://ohmega-cms-auth.<subdomain>.workers.dev
Current Version ID: ...
```

**Catat URL worker** — misal `https://ohmega-cms-auth.anggie.workers.dev`.

Test:

```bash
curl https://ohmega-cms-auth.<subdomain>.workers.dev/
```

Harus return JSON `{ ok: true, service: "ohmega-cms-auth", ... }`.

## Langkah 6: Update GitHub OAuth App callback

Kembali ke <https://github.com/settings/developers> → klik OAuth App kamu →
**Authorization callback URL**:

- Ganti dari `https://example.com/callback` ke:
  ```
  https://ohmega-cms-auth.<subdomain>.workers.dev/callback
  ```
- Klik **Update application**

## Langkah 7: Update Decap CMS config

Edit `public/admin/config.yml` di repo ini:

```yaml
backend:
  name: github
  repo: eiaiproject/Ohmega
  branch: main
  base_url: https://ohmega.web.id
  auth_endpoint: https://ohmega-cms-auth.<subdomain>.workers.dev   # ← URL worker
```

Commit & push. Cloudflare Pages akan rebuild dan halaman `/admin` siap.

## Selesai ✅

Cek end-to-end:
1. Buka <https://ohmega.web.id/admin/>
2. Klik **Login with GitHub**
3. Popup terbuka ke GitHub → klik **Authorize**
4. Popup tertutup otomatis, Decap CMS menampilkan dashboard
5. Coba edit harga atau buat artikel dummy → klik **Publish**
6. Cek GitHub repo → commit baru dari akun kamu

---

## Custom Domain (Opsional, Gratis)

Kalau mau worker di subdomain `cms-auth.ohmega.web.id` (lebih rapi dari
`*.workers.dev`):

1. Di Cloudflare dashboard → **Workers & Pages** → `ohmega-cms-auth`
   → **Settings** → **Triggers** → **Custom Domains** → **Add Custom Domain**
2. Isi `cms-auth.ohmega.web.id` → klik **Add Custom Domain**
3. Cloudflare otomatis setup DNS record (CNAME)
4. Update `public/admin/config.yml` `auth_endpoint` ke URL baru
5. Update GitHub OAuth App callback URL ke URL baru + `/callback`
6. Commit & push.

## Troubleshooting

### `wrangler login` hang / tidak bisa dibuka

Pastikan browser diizinkan membuka link otomatis. Atau pakai:

```bash
wrangler login --browser=false
# Akan tampil URL + kode, buka manual di browser
```

### Worker deploy error "Authentication error [code: 10000]"

Belum login. Ulangi `wrangler login`.

### Login Decap muncul error "Failed to load"

- Buka DevTools browser → tab Console → lihat error
- Cek URL worker bisa diakses: buka `https://...workers.dev/` di tab baru
- Pastikan GitHub OAuth App callback URL persis sama dengan URL worker + `/callback`

### `error: missing_GITHUB_CLIENT_ID`

Secret belum di-set. Ulangi `wrangler secret put GITHUB_CLIENT_ID`.

### Popup login tidak nutup otomatis

- Browser block popup. Izinkan popup untuk domain `ohmega.web.id`.
- Atau tunggu — fallback code akan redirect ke `/admin` dengan token di URL.

## Update Worker di Masa Depan

```bash
cd scripts/ohmega-cms-auth
# edit worker.js
wrangler deploy
```

Worker baru live dalam ~10 detik. Tidak perlu redeploy Cloudflare Pages.
