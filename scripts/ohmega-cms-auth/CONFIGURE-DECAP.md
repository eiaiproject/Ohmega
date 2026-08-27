# Konfigurasi Decap CMS Setelah Worker Live

Setelah worker ter-deploy (lihat [DEPLOY.md](./DEPLOY.md)), kaitkan
Decap CMS dengan worker lewat file `public/admin/config.yml`.

## Edit config.yml

```yaml
backend:
  name: github
  repo: eiaiproject/Ohmega
  branch: main
  base_url: https://ohmega.web.id
  auth_endpoint: https://ohmega-cms-auth.<subdomain>.workers.dev
```

Ganti `<subdomain>` dengan subdomain kamu. Contoh final:

```yaml
auth_endpoint: https://ohmega-cms-auth.anggie.workers.dev
```

## Commit & Push

```bash
git add public/admin/config.yml
git commit -m "chore(cms): point Decap auth_endpoint to deployed worker"
git push
```

Cloudflare Pages akan rebuild dalam ±1-2 menit. Setelah itu:

- Buka <https://ohmega.web.id/admin/>
- Klik **Login with GitHub**
- Login pertama akan minta otorisasi GitHub
- Setelah selesai, dashboard CMS muncul

## (Opsional) Custom Domain

Untuk pakai `cms-auth.ohmega.web.id` daripada `*.workers.dev`,
lihat [DEPLOY.md § Custom Domain](./DEPLOY.md#custom-domain-opsional-gratis).
