import type { APIRoute } from 'astro';
import { getAllArticles } from '../../lib/content';
import { site } from '../../data/site';

export const GET: APIRoute = async ({ site: astroSite }) => {
  const articles = await getAllArticles();
  const baseUrl = (astroSite?.toString() ?? site.siteUrl).replace(/\/$/, '');

  const items = articles
    .map((article) => {
      const slug = article.data.slug || article.id;
      const url = `${baseUrl}/blog/${slug}`;
      return `
    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${article.data.description}]]></description>
      <pubDate>${article.data.date.toUTCString()}</pubDate>
      ${article.data.tags?.map((t) => `<category>${t}</category>`).join('\n      ') ?? ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog OHMEGA</title>
    <link>${baseUrl}/blog</link>
    <description>Artikel edukasi tentang telur omega, gizi keluarga, dan resep praktis dari tim OHMEGA ${site.serviceArea}.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
