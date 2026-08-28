# OHMEGA CMS Auth: Runbook

Panduan end-to-end deploy OAuth Worker + setup GitHub OAuth App + aktifkan
`/admin` di ohmega.web.id. Estimasi total: 15-20 menit.

## Prasyarat

- Akses owner ke repo `eiaiproject/Ohmega` di GitHub
- Akun Cloudflare (gratis): pastikan domain `ohmega.web.id` sudah ditambahkan ke dashboard
- Node.js 20+ & npm terinstall
- Terminal dengan akses ke `wrangler` (install global: `npm install -g wrangler`)

---

## Langkah 1: Merge PR #1

PR sudah ready di branch `feature/admin-cms`. Review terakhir:

```bash
cd /path/to/Ohmega
gh pr view 1              # cek status
gh pr merge 1 --squash    # squash merge ke main
```

Setelah merge, Cloudflare Pages otomatis rebuild situs. Tunggu ±1-2 menit.

**Verifikasi**: buka <https://ohmega.web.id/admin/>: halaman Decap muncul
(tapi Login dengan GitHub belum akan berhasil sampai Langkah 5 selesai).

---

## Langkah 2: Buat GitHub OAuth App

1. Buka <https://github.com/settings/developers>
2. Klik **OAuth Apps** (sidebar kiri) → **New OAuth App**
3. Isi form:
   - **Application name**: `OHMEGA CMS`
   - **Homepage URL**: `https://ohmega.web.id`
   - **Application description**: `OAuth bridge untuk Decap CMS OHMEGA`
   - **Authorization callback URL**: sementara `https://example.com/callback`
     (akan di-update di Langkah 4 setelah dapat URL worker)
4. Klik **Register application**
5. Di halaman detail OAuth App:
   - **Catat Client ID** (misal `Iv1.abc123def456`)
   - Klik **Generate a new client secret** → **catat Client Secret**
     (hanya tampil sekali!)

---

## Langkah 3: Deploy Cloudflare Worker

```bash
cd scripts/ohmega-cms-auth

# Login wrangler (sekali saja, browser akan terbuka)
wrangler login

# Set secrets
wrangler secret put GITHUB_CLIENT_ID
# Paste Client ID dari Langkah 2, Enter

wrangler secret put GITHUB_CLIENT_SECRET
# Paste Client Secret dari Langkah 2, Enter

# Deploy
wrangler deploy
```

**Output** yang diharapkan:

```
Total Upload: 1.xx KiB / gzip: 0.xx KiB
Worker Startup Time: 50ms
Uploaded ohmega-cms-auth (X.XX sec)
Deployed ohmega-cms-auth triggers (0.XX sec)
   https://ohmega-cms-auth.<subdomain>.workers.dev
```

**Catat URL worker**: misal `https://ohmega-cms-auth.anggie.workers.dev`.

**Verifikasi cepat**:

```bash
curl https://ohmega-cms-auth.<subdomain>.workers.dev/
```

Harus return JSON:

```json
{ "ok": true, "service": "ohmega-cms-auth", "endpoints": ["/auth", "/callback"], "repo": "eiaiproject/Ohmega" }
```

---

## Langkah 4: Update GitHub OAuth App callback

1. Kembali ke <https://github.com/settings/developers> → klik OAuth App yang
   baru dibuat
2. **Authorization callback URL**: ganti dari `https://example.com/callback`
   ke `https://ohmega-cms-auth.<subdomain>.workers.dev/callback`
3. Klik **Update application**

---

## Langkah 5: Kaitkan Worker dengan Decap

Edit `public/admin/config.yml` di repo:

```yaml
backend:
  name: github
  repo: eiaiproject/Ohmega
  branch: main
  base_url: https://ohmega.web.id
  auth_endpoint: https://ohmega-cms-auth.<subdomain>.workers.dev   # ← URL worker dari Langkah 3
```

Commit & push:

```bash
git add public/admin/config.yml
git commit -m "chore(cms): point Decap auth_endpoint to deployed worker"
git push
```

Cloudflare Pages akan rebuild dalam ±1-2 menit.

---

## Langkah 6 (opsional): Custom Domain untuk Worker

Pakai `cms-auth.ohmega.web.id` (lebih rapi dari `*.workers.dev`):

1. Dashboard Cloudflare → **Workers & Pages** → `ohmega-cms-auth` →
   **Settings** → **Triggers** → **Custom Domains** → **Add Custom Domain**
2. Isi `cms-auth.ohmega.web.id` → klik **Add Custom Domain**
3. Cloudflare otomatis setup DNS (CNAME): tidak perlu edit zone manual
4. Ulangi **Langkah 4** dengan URL baru (`https://cms-auth.ohmega.web.id/callback`)
5. Ulangi **Langkah 5** dengan URL baru di `auth_endpoint`

---

## Langkah 7: Test End-to-End

1. Buka <https://ohmega.web.id/admin/>
2. Klik **Login with GitHub**
3. Popup terbuka → klik **Authorize** di halaman GitHub OAuth
4. Popup tertutup otomatis, dashboard Decap muncul
5. Coba edit angka harga atau buat artikel dummy → klik **Publish**
6. Cek GitHub repo → ada commit baru dari akun Anda di branch `main`
7. Tunggu ±1-2 menit → cek <https://ohmega.web.id> (harga updated)
   atau <https://ohmega.web.id/blog> (artikel baru muncul)

---

## Troubleshooting

### `wrangler login` hang / tidak ada browser

```bash
wrangler login --browser=false
# Akan tampil URL + kode. Buka URL di browser manual, paste kode.
```

### `error: missing_GITHUB_CLIENT_ID` saat buka `/admin`

Secret belum masuk. Ulangi:

```bash
cd scripts/ohmega-cms-auth
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler deploy  # redeploy agar secret ter-load
```

### Popup login Decap tidak nutup otomatis

- Browser block popup. Izinkan popup untuk domain `ohmega.web.id`.
- Atau tunggu: fallback akan redirect ke `/admin` dengan token di URL.

### "Failed to load" di console browser saat buka `/admin`

- Cek URL worker accessible: buka `https://ohmega-cms-auth.<subdomain>.workers.dev/`
  di tab baru. Harus return JSON, bukan error Cloudflare.
- Cek GitHub OAuth App callback URL **persis sama** dengan
  `https://<worker-url>/callback` (case-sensitive, trailing slash).

### Edit sudah publish tapi harga di situs tidak berubah

- Cek status build di dashboard Cloudflare Pages → tab **Deployments**
- Kalau build sukses tapi tidak berubah, hard-refresh browser (`Cmd+Shift+R`)
- Pastikan nilai `pack4` / `pack10` / `pack30` di collection **Harga Produk**
  sudah benar (tanpa desimal, tanpa Rp, tanpa titik).

### Worker perlu update di masa depan

```bash
cd scripts/ohmega-cms-auth
# edit worker.js
wrangler deploy
```

Worker baru live dalam ±10 detik. Tidak perlu redeploy Cloudflare Pages.

---

## Checklist

- [ ] PR #1 sudah merged
- [ ] GitHub OAuth App dibuat (Homepage `https://ohmega.web.id`, callback `<worker>/callback`)
- [ ] Client ID & Secret dicatat
- [ ] `wrangler login` selesai
- [ ] Secrets di-set: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- [ ] `wrangler deploy` sukses, URL worker dicatat
- [ ] GitHub OAuth App callback URL di-update ke `<worker>/callback`
- [ ] `public/admin/config.yml` `auth_endpoint` di-update ke URL worker
- [ ] Commit & push config.yml, Cloudflare Pages rebuild sukses
- [ ] Test login di <https://ohmega.web.id/admin/> → berhasil
- [ ] Test edit harga/artikel → publish → muncul di situs

Setelah semua dicentang, `/admin` siap dipakai untuk edit harga & tulis
artikel edukasi tanpaentuh terminal lagi.