import { test, expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const WA_NUMBER = '6285111331269';
const NAV_ITEMS = ['Beranda', 'Produk', 'Kandungan', 'Cara Terima', 'Tentang', 'Blog'];
const NAV_TARGETS = ['/#beranda', '/#produk', '/#kandungan', '/#pengiriman', '/#tentang', '/#blog'];

async function gotoHome(page: Page): Promise<void> {
  await page.goto(BASE);
}

async function gotoFirstArticle(page: Page): Promise<void> {
  await page.goto(`${BASE}/blog`);
  const href = await page.locator('a[href^="/blog/"]').first().getAttribute('href');
  if (!href) throw new Error('No article link found on /blog');
  await page.goto(`${BASE}${href}`);
}

async function expectTexts(scope: Locator, texts: string[]): Promise<void> {
  for (const t of texts) {
    await expect(scope).toContainText(t);
  }
}

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test('document head carries SEO metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/OHMEGA/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Omega-3/);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /ohmega\.web\.id/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /OHMEGA/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-preview/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'id_ID');
    await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    await expectTexts(jsonLd, ['LocalBusiness', 'OHMEGA']);
    expect(await jsonLd.textContent()).toContain('Offer');
  });

  test('header navigation targets and contact', async ({ page }) => {
    const nav = page.locator('header nav');
    await expect(page.locator('header a[href="/"]').first()).toBeVisible();
    for (const item of NAV_ITEMS) {
      await expect(nav.locator(`a:has-text("${item}")`)).toBeVisible();
    }
    for (const target of NAV_TARGETS) {
      await expect(nav.locator(`a[href="${target}"]`)).toHaveCount(1);
    }
    await expect(nav.locator('a[href*="wa.me"]').first()).toHaveAttribute('href', new RegExp(WA_NUMBER));
    await expect(page.locator('[data-menu-toggle]')).toHaveCount(1);
  });

  test('hero introduces product and price', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(page.locator('main h1').first()).toContainText('Telur Omega');
    await expect(hero.locator('a[href*="wa.me"]').first()).toBeVisible();
    await expect(page.locator('a:has-text("Lihat Pilihan Kemasan")')).toHaveAttribute('href', '#produk');
    await expect(page.locator('text=/Mulai Rp/').first()).toBeVisible();
    await expect(hero.locator('ul').locator('text=Zona inti kami antar')).toBeVisible();
    await expect(hero.locator('ul').locator('a[href="#pengiriman"]:has-text("ojek Anda")')).toBeVisible();
    await expect(hero.locator('img[src="/images/hero.webp"]')).toBeVisible();
  });

  test('products show packs with correct prices', async ({ page }) => {
    const section = page.locator('#produk');
    await expect(section.locator('h2')).toContainText('Pilih Kemasan');
    await expect(section.locator('article')).toHaveCount(3);
    await expectTexts(page.locator('article:has-text("OHMEGA Isi 4")'), ['Rp12.000']);
    await expectTexts(page.locator('article:has-text("OHMEGA Isi 10")'), ['Rp29.000']);
    await expectTexts(page.locator('article:has-text("OHMEGA Isi 30")'), ['Rp81.000']);
    for (const id of ['product-4', 'product-10', 'product-30']) {
      await expect(page.locator(`img[src*="${id}"]`)).toBeVisible();
    }
    const cards = section.locator('article');
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).locator('a[href*="wa.me"]')).toHaveCount(1);
    }
  });

  test('nutrition lists lab values per 100 gram', async ({ page }) => {
    const section = page.locator('#kandungan');
    await expect(section.locator('h2')).toContainText('Kandungan');
    await expectTexts(section, ['Omega-3', '793,1', 'DHA', '399,8', 'EPA', '7,9']);
    await expect(section.locator('text=per 100 gram').first()).toBeVisible();
  });

  test('pickup section explains hybrid handover', async ({ page }) => {
    const section = page.locator('#pengiriman');
    await expect(section.locator('h2')).toContainText('Cara Terima');
    await expect(section.locator('iframe')).toHaveCount(1);
    await expect(section.locator('a[href*="wa.me"]').first()).toContainText('Tanya Cara Terima');
    await expect(section.locator('a[href*="google.com/maps"]')).toContainText('Petunjuk Arah');
    await expectTexts(section, ['Perumahan Amartha Safira', 'Ojek yang Anda Pesan', 'memesan ojek sendiri', 'Titik ambil']);
  });

  test('certifications, steps, producer, and final CTA', async ({ page }) => {
    const certs = page.locator('#sertifikasi');
    await expectTexts(certs, ['NKV', 'SIG', 'Halal']);
    await expect(page.locator('a[href*="sisnasnkv"]')).toBeVisible();
    await expect(page.locator('ol li')).toHaveCount(3);
    await expect(page.locator('text=Kirim Pesan WhatsApp')).toBeVisible();
    await expect(page.locator('text=Konfirmasi & Terima')).toBeVisible();
    const about = page.locator('section#tentang');
    await expectTexts(about, ['PT Mahkota Unggas Sejahtera', 'Mojokerto']);
    await expect(page.locator('img[src="/images/producer.webp"]')).toBeVisible();
    const cta = page.locator('#final-cta');
    await expect(cta.locator('h2')).toContainText('Siap Pesan OHMEGA');
    await expect(cta.locator('a[href*="wa.me"]')).toHaveCount(1);
    await expect(page.locator('#sticky-wa')).toHaveCount(1);
  });

  test('footer brand, contact, and Sidoarjo base', async ({ page }) => {
    const footer = page.locator('footer');
    await expectTexts(footer, ['OHMEGA', 'Kaya Protein', '2026', 'Berbasis di Sidoarjo']);
    await expect(footer.locator('a[href*="wa.me"]')).toHaveAttribute('href', new RegExp(WA_NUMBER));
    await expect(footer.locator('a[href*="instagram.com/ohmega_id"]')).toBeVisible();
    for (const item of NAV_ITEMS) {
      await expect(footer.locator(`a:has-text("${item}")`)).toBeVisible();
    }
  });

  test('every WhatsApp link uses the business number', async ({ page }) => {
    const waLinks = page.locator('a[href*="wa.me"]');
    const count = await waLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      expect(await waLinks.nth(i).getAttribute('href')).toContain(WA_NUMBER);
    }
    const packHref = await page.locator('article:has-text("Isi 4") a[href*="wa.me"]').getAttribute('href');
    expect(decodeURIComponent(packHref ?? '')).toContain('isi 4');
  });

  test('landmarks present and images carry alt text', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('header[data-header]')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    const images = page.locator('main img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      expect(await images.nth(i).getAttribute('alt')).not.toBeNull();
    }
  });

  test('landing images return no errors', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (resp) => {
      if (resp.url().match(/\.(webp|png|jpg|svg|woff2)$/) && resp.status() >= 400) {
        failed.push(`${resp.url()} -> ${resp.status()}`);
      }
    });
    await gotoHome(page);
    await expect(page.locator('img[src="/images/hero.webp"]')).toBeVisible();
    await expect(page.locator('#produk article').first()).toBeVisible();
    expect(failed).toEqual([]);
  });
});

test.describe('Blog, feeds, and errors', () => {
  test('blog listing shows cards and feed link', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page).toHaveTitle(/Blog OHMEGA/);
    await expect(page.locator('h1')).toContainText('Edukasi Telur Omega');
    await expect(page.locator('article').first()).toBeVisible();
    await expect(page.locator('article a[href^="/blog/"]').first()).toBeVisible();
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveCount(1);
  });

  test('article page renders content, back link, CTA, and schema', async ({ page }) => {
    await gotoFirstArticle(page);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('a[href="/blog"]')).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
    expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('BlogPosting');
  });

  test('unknown route shows recovery action', async ({ page }) => {
    const resp = await page.goto(`${BASE}/halaman-tidak-ada`);
    expect(resp?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('Halaman tidak ditemukan');
    const btn = page.locator('a:has-text("Kembali ke Beranda")');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/');
  });

  test('sitemap, robots, and RSS serve expected markers', async ({ page }) => {
    const feeds: Array<[string, string[]]> = [
      [`${BASE}/sitemap.xml`, ['<urlset', '/blog']],
      [`${BASE}/robots.txt`, ['Sitemap:', 'Allow: /']],
      [`${BASE}/blog/rss.xml`, ['<rss', 'Blog OHMEGA']],
    ];
    for (const [url, markers] of feeds) {
      const resp = await page.goto(url);
      expect(resp?.status()).toBe(200);
      const body = (await resp?.text()) ?? '';
      for (const m of markers) {
        expect(body).toContain(m);
      }
    }
  });
});
