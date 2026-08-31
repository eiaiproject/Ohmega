import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ohmega.web.id',
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
  compressHTML: true,
});
