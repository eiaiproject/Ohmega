import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getAllArticles } from '../lib/content';

export const GET: APIRoute = async () => {
  const articles = await getAllArticles();
  const staticUrls = ['/', '/blog'];
  const articleUrls = articles.map((a) => `/blog/${a.data.slug || a.id}`);
  const all = [...staticUrls, ...articleUrls];

  const urls = all
    .map((p) => `  <url><loc>${site.siteUrl}${p}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
