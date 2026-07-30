import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ohmega.id',
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
  compressHTML: true,
});
