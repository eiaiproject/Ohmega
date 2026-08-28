# Konfigurasi Decap CMS Setelah Worker Live

Setelah worker ter-deploy (lihat [DEPLOY.md](./DEPLOY.md)), kaitkan
Decap CMS dengan worker lewat file `public/admin/config.yml`.

## Edit config.yml

Penting: Decap GitHub backend (`class GitHubBackend`) construct popup URL
sebagai `${base_url}/${auth_endpoint}`. Setting yang benar:

- `base_url` = URL worker (host only, tanpa path)
- `auth_endpoint` = path di worker (`auth` saja, tanpa leading slash)

Jangan set `base_url` ke site URL: Decap akan treat worker URL sebagai
path (bug substring), bukan host.

```yaml
backend:
  name: github
  repo: eiaiproject/Ohmega
  branch: main
  base_url: https://<subdomain>.workers.dev
  auth_endpoint: auth
```

Ganti `<subdomain>` dengan subdomain kamu. Contoh final:

```yaml
base_url: https://ohmega.eiai.workers.dev
auth_endpoint: auth
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
