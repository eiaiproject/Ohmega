# OHMEGA CMS Auth — Cloudflare Worker

Worker kecil untuk jadi OAuth bridge antara **Decap CMS** (di `ohmega.web.id/admin`)
dan **GitHub**. Tanpa worker ini, halaman admin tidak akan bisa login.

## Isi Folder

- `worker.js` — kode Worker
- `wrangler.toml` — konfigurasi deploy + non-secret vars
- `package.json` — metadata
- `DEPLOY.md` — panduan deploy step-by-step
- `CONFIGURE-DECAP.md` — cara kaitkan worker dengan Decap CMS

## Ringkas

```bash
# Install wrangler (sekali)
npm install -g wrangler

# Login
wrangler login

# Set secrets
wrangler secret put GITHUB_CLIENT_ID     # paste dari GitHub OAuth App
wrangler secret put GITHUB_CLIENT_SECRET # paste dari GitHub OAuth App

# Deploy
wrangler deploy

# Verifikasi
curl https://ohmega-cms-auth.<subdomain>.workers.dev/
```

Lihat **[DEPLOY.md](./DEPLOY.md)** untuk panduan lengkap.
