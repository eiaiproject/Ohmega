import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ohmega.web.id',
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
  compressHTML: true,
  // Halaman admin Decap di /admin/index.html dilayani dari public/ sebagai static file.
  // Decap menggunakan routing client-side (hash-based), tidak butuh trailingSlash khusus.
});
