/**
 * Pusat data konten dari CMS.
 * - Harga dibaca dari `content/prices.yaml` (bisa diedit via /admin).
 * - Artikel dibaca dari `content/articles/*.md` via Astro content collections.
 */
import { parse } from 'yaml';
import pricesRaw from '../../content/prices.yaml?raw';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// ───────────────────────────────────────────────────────────
//  HARGA
// ───────────────────────────────────────────────────────────
const pricesData = parse(pricesRaw) as {
  pack4: number;
  pack10: number;
  pack30: number;
};

export const prices = {
  pack4: pricesData.pack4,
  pack10: pricesData.pack10,
  pack30: pricesData.pack30,
} as const;

/** Harga per butir = harga kemasan ÷ jumlah butir (dibulatkan). */
export function perUnitPrice(quantity: number, price: number): number {
  return Math.round(price / quantity);
}

// ───────────────────────────────────────────────────────────
//  ARTIKEL EDUKASI
// ───────────────────────────────────────────────────────────
export type Article = CollectionEntry<'articles'>;

/** Semua artikel berstatus published, urut terbaru → tertua. */
export async function getAllArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');
  return articles.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Satu artikel by slug. */
export async function getArticle(slug: string): Promise<Article | undefined> {
  const entry = await getEntry('articles', slug);
  if (!entry || entry.data.status !== 'published') return undefined;
  return entry;
}
