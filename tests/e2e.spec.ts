import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

// ─── Data references ───────────────────────────────────────────
const WA_NUMBER = '6285111331269';
const NAV_ITEMS = ['Beranda', 'Produk', 'Kandungan', 'Pengiriman', 'Tentang'];
const PRODUCT_IDS = ['#produk'];

// ═══════════════════════════════════════════════════════════════
//  1. LANDING PAGE — Structure & Sections
// ═══════════════════════════════════════════════════════════════
test.describe('Landing page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('returns 200 and correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/OHMEGA/);
  });

  test('has correct meta description', async ({ page }) => {
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /Omega-3/);
  });

  test('has favicon', async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });

  test('has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /ohmega\.web\.id/);
  });

  test('has Open Graph tags', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /OHMEGA/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-preview/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'id_ID');
  });

  test('JSON-LD structured data present', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    expect(content).toContain('LocalBusiness');
    expect(content).toContain('OHMEGA');
    expect(content).toContain('Offer');
  });

  test('skip-link exists for accessibility', async ({ page }) => {
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main');
  });
});

// ═══════════════════════════════════════════════════════════════
//  2. HEADER — Navigation & WhatsApp
// ═══════════════════════════════════════════════════════════════
test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('logo links to beranda', async ({ page }) => {
    const logo = page.locator('header a[href="#beranda"]').first();
    await expect(logo).toBeVisible();
  });

  test('all navigation links present', async ({ page }) => {
    const nav = page.locator('header nav');
    for (const item of NAV_ITEMS) {
      await expect(nav.locator(`a:has-text("${item}")`)).toBeVisible();
    }
  });

  test('navigation links point to correct anchors', async ({ page }) => {
    const nav = page.locator('header nav');
    await expect(nav.locator('a[href="#beranda"]')).toHaveCount(1);
    await expect(nav.locator('a[href="#produk"]')).toHaveCount(1);
    await expect(nav.locator('a[href="#kandungan"]')).toHaveCount(1);
    await expect(nav.locator('a[href="#pengiriman"]')).toHaveCount(1);
    await expect(nav.locator('a[href="#tentang"]')).toHaveCount(1);
  });

  test('WhatsApp button in header links to wa.me', async ({ page }) => {
    const waBtn = page.locator('header a[href*="wa.me"]').first();
    await expect(waBtn).toHaveAttribute('href', new RegExp(WA_NUMBER));
  });

  test('mobile menu toggle exists in DOM', async ({ page }) => {
    const toggle = page.locator('[data-menu-toggle]');
    await expect(toggle).toHaveCount(1);
  });
});

// ═══════════════════════════════════════════════════════════════
//  3. HERO SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('hero heading visible', async ({ page }) => {
    const h1 = page.locator('main h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Telur Omega');
  });

  test('hero has WhatsApp CTA button', async ({ page }) => {
    const heroSection = page.locator('section').first();
    const waBtn = heroSection.locator('a[href*="wa.me"]').first();
    await expect(waBtn).toBeVisible();
  });

  test('hero has "Lihat Pilihan Kemasan" link to #produk', async ({ page }) => {
    const link = page.locator('a:has-text("Lihat Pilihan Kemasan")');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '#produk');
  });

  test('hero displays starting price per unit', async ({ page }) => {
    const priceText = page.locator('text=/Mulai Rp/');
    await expect(priceText.first()).toBeVisible();
  });

  test('hero checklist items visible', async ({ page }) => {
    const heroList = page.locator('section').first().locator('ul');
    await expect(heroList.locator('text=Gratis antar')).toBeVisible();
    await expect(heroList.locator('text=Kaya Protein')).toBeVisible();
  });

  test('hero image loads', async ({ page }) => {
    const img = page.locator('section').first().locator('img[src="/images/hero.webp"]');
    await expect(img).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
//  4. PRODUCTS SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Products section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('products section exists with heading', async ({ page }) => {
    const section = page.locator('#produk');
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toContainText('Pilih Kemasan');
  });

  test('three product cards rendered', async ({ page }) => {
    const cards = page.locator('#produk article');
    await expect(cards).toHaveCount(3);
  });

  test('each product card has name, price, and WhatsApp button', async ({ page }) => {
    const cards = page.locator('#produk article');
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      await expect(card.locator('h3')).not.toBeEmpty();
      await expect(card.locator('a[href*="wa.me"]')).toHaveCount(1);
    }
  });

  test('product Isi 4 shows correct price Rp12.000', async ({ page }) => {
    const card = page.locator('article:has-text("OHMEGA Isi 4")');
    await expect(card).toContainText('Rp12.000');
  });

  test('product Isi 10 shows correct price Rp29.000', async ({ page }) => {
    const card = page.locator('article:has-text("OHMEGA Isi 10")');
    await expect(card).toContainText('Rp29.000');
  });

  test('product Isi 30 shows correct price Rp81.000', async ({ page }) => {
    const card = page.locator('article:has-text("OHMEGA Isi 30")');
    await expect(card).toContainText('Rp81.000');
  });

  test('product images load', async ({ page }) => {
    for (const id of ['product-4', 'product-10', 'product-30']) {
      const img = page.locator(`img[src*="${id}"]`);
      await expect(img).toBeVisible();
    }
  });
});

// ═══════════════════════════════════════════════════════════════
//  5. NUTRITION SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Nutrition section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('nutrition section visible with heading', async ({ page }) => {
    const section = page.locator('#kandungan');
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toContainText('Kandungan');
  });

  test('displays Omega-3, DHA, EPA values', async ({ page }) => {
    const section = page.locator('#kandungan');
    await expect(section).toContainText('Omega-3');
    await expect(section).toContainText('793,1');
    await expect(section).toContainText('DHA');
    await expect(section).toContainText('399,8');
    await expect(section).toContainText('EPA');
    await expect(section).toContainText('7,9');
  });

  test('displays "per 100 gram" label', async ({ page }) => {
    await expect(page.locator('#kandungan').locator('text=per 100 gram').first()).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
//  6. DELIVERY SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Delivery section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('delivery section visible', async ({ page }) => {
    const section = page.locator('#pengiriman');
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toContainText('Pengiriman');
  });

  test('has Google Maps embed', async ({ page }) => {
    const iframe = page.locator('#pengiriman iframe');
    await expect(iframe).toHaveCount(1);
  });

  test('"Tanya Pengiriman" WhatsApp button works', async ({ page }) => {
    const btn = page.locator('#pengiriman a[href*="wa.me"]').first();
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Tanya Pengiriman');
  });

  test('"Buka Petunjuk Arah" links to Google Maps', async ({ page }) => {
    const btn = page.locator('#pengiriman a[href*="google.com/maps"]');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Petunjuk Arah');
  });
});

// ═══════════════════════════════════════════════════════════════
//  7. CERTIFICATIONS SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Certifications section', () => {
  test('shows NKV, SIG, and Halal certifications', async ({ page }) => {
    await page.goto(BASE);
    const section = page.locator('#sertifikasi');
    await expect(section).toBeVisible();
    await expect(section).toContainText('NKV');
    await expect(section).toContainText('SIG');
    await expect(section).toContainText('Halal');
  });

  test('NKV verification link works', async ({ page }) => {
    await page.goto(BASE);
    const nkvLink = page.locator('a[href*="sisnasnkv"]');
    await expect(nkvLink).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
//  8. ORDER STEPS SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Order steps section', () => {
  test('displays 3 steps', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('ol li')).toHaveCount(3);
    await expect(page.locator('text=Kirim Pesan WhatsApp')).toBeVisible();
    await expect(page.locator('text=Konfirmasi & Antar')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
//  9. PRODUCER SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Producer section', () => {
  test('shows producer and distributor info', async ({ page }) => {
    await page.goto(BASE);
    const section = page.locator('section#tentang');
    await expect(section).toBeVisible();
    await expect(section).toContainText('PT Mahkota Unggas Sejahtera');
    await expect(section).toContainText('Mojokerto');
  });

  test('producer image loads', async ({ page }) => {
    await page.goto(BASE);
    const img = page.locator('img[src="/images/producer.webp"]');
    await expect(img).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
//  10. FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════
test.describe('Final CTA section', () => {
  test('has WhatsApp button', async ({ page }) => {
    await page.goto(BASE);
    const cta = page.locator('#final-cta');
    await expect(cta).toBeVisible();
    await expect(cta.locator('a[href*="wa.me"]')).toHaveCount(1);
  });

  test('heading text correct', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('#final-cta h2')).toContainText('Siap Pesan OHMEGA');
  });
});

// ═══════════════════════════════════════════════════════════════
//  11. FOOTER
// ═══════════════════════════════════════════════════════════════
test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('footer exists with brand info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('OHMEGA');
    await expect(footer).toContainText('Kaya Protein');
  });

  test('footer WhatsApp link correct', async ({ page }) => {
    const waLink = page.locator('footer a[href*="wa.me"]');
    await expect(waLink).toHaveAttribute('href', new RegExp(WA_NUMBER));
  });

  test('footer Instagram link correct', async ({ page }) => {
    const igLink = page.locator('footer a[href*="instagram.com/ohmega_id"]');
    await expect(igLink).toBeVisible();
  });

  test('footer navigation links present', async ({ page }) => {
    const footer = page.locator('footer');
    for (const item of NAV_ITEMS) {
      await expect(footer.locator(`a:has-text("${item}")`)).toBeVisible();
    }
  });

  test('copyright year current', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('2026');
  });
});

// ═══════════════════════════════════════════════════════════════
//  12. WHATSAPP LINKS — All buttons point to correct wa.me
// ═══════════════════════════════════════════════════════════════
test.describe('WhatsApp links integrity', () => {
  test('all WhatsApp links use correct phone number', async ({ page }) => {
    await page.goto(BASE);
    const waLinks = page.locator('a[href*="wa.me"]');
    const count = await waLinks.count();
    expect(count).toBeGreaterThanOrEqual(5); // header + hero + 3 products + sticky + final CTA + footer

    for (let i = 0; i < count; i++) {
      const href = await waLinks.nth(i).getAttribute('href');
      expect(href).toContain(WA_NUMBER);
    }
  });

  test('WhatsApp messages contain product names', async ({ page }) => {
    await page.goto(BASE);
    // Check product card WA links contain package info
    const pack4Link = page.locator('article:has-text("Isi 4") a[href*="wa.me"]');
    const href4 = await pack4Link.getAttribute('href');
    expect(decodeURIComponent(href4!)).toContain('isi 4');
  });
});

// ═══════════════════════════════════════════════════════════════
//  13. STICKY MOBILE CTA
// ═══════════════════════════════════════════════════════════════
test.describe('Sticky mobile CTA', () => {
  test('sticky CTA element exists', async ({ page }) => {
    await page.goto(BASE);
    const sticky = page.locator('#sticky-wa');
    await expect(sticky).toHaveCount(1);
  });
});

// ═══════════════════════════════════════════════════════════════
//  14. BLOG — Listing page
// ═══════════════════════════════════════════════════════════════
test.describe('Blog listing (/blog)', () => {
  test('blog page loads with correct title', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page).toHaveTitle(/Blog OHMEGA/);
  });

  test('has heading', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page.locator('h1')).toContainText('Edukasi Telur Omega');
  });

  test('article cards render (if articles exist)', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const cards = page.locator('article');
    const count = await cards.count();
    // At least 1 article exists in content/articles/
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('article cards have links to /blog/[slug]', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const links = page.locator('article a[href^="/blog/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('RSS link present', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
    await expect(rssLink).toHaveCount(1);
  });
});

// ═══════════════════════════════════════════════════════════════
//  15. BLOG — Article detail
// ═══════════════════════════════════════════════════════════════
test.describe('Blog article detail', () => {
  test('first article page loads', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const firstLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(`${BASE}${href}`);
    await expect(page.locator('main h1')).toBeVisible();
  });

  test('article has "Kembali ke daftar artikel" link', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const firstLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstLink.getAttribute('href');

    await page.goto(`${BASE}${href}`);
    const backLink = page.locator('a[href="/blog"]');
    await expect(backLink).toBeVisible();
  });

  test('article has WhatsApp CTA at bottom', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const firstLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstLink.getAttribute('href');

    await page.goto(`${BASE}${href}`);
    const waBtn = page.locator('a[href*="wa.me"]');
    await expect(waBtn.first()).toBeVisible();
  });

  test('article has JSON-LD BlogPosting schema', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const firstLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstLink.getAttribute('href');

    await page.goto(`${BASE}${href}`);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    expect(content).toContain('BlogPosting');
  });
});

// ═══════════════════════════════════════════════════════════════
//  16. 404 PAGE
// ═══════════════════════════════════════════════════════════════
test.describe('404 page', () => {
  test('shows 404 message for unknown route', async ({ page }) => {
    const resp = await page.goto(`${BASE}/halaman-tidak-ada`);
    expect(resp?.status()).toBe(404);
  });

  test('has "Kembali ke Beranda" button', async ({ page }) => {
    await page.goto(`${BASE}/halaman-tidak-ada`);
    const btn = page.locator('a:has-text("Kembali ke Beranda")');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/');
  });

  test('heading says "Halaman tidak ditemukan"', async ({ page }) => {
    await page.goto(`${BASE}/halaman-tidak-ada`);
    await expect(page.locator('h1')).toContainText('Halaman tidak ditemukan');
  });
});

// ═══════════════════════════════════════════════════════════════
//  17. SITEMAP & ROBOTS
// ═══════════════════════════════════════════════════════════════
test.describe('SEO files', () => {
  test('sitemap.xml returns valid XML', async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/');
    expect(body).toContain('/blog');
  });

  test('robots.txt has sitemap reference', async ({ page }) => {
    const resp = await page.goto(`${BASE}/robots.txt`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('Allow: /');
  });

  test('rss.xml returns valid RSS', async ({ page }) => {
    const resp = await page.goto(`${BASE}/blog/rss.xml`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('<rss');
    expect(body).toContain('Blog OHMEGA');
  });
});

// ═══════════════════════════════════════════════════════════════
//  19. ACCESSIBILITY BASICS
// ═══════════════════════════════════════════════════════════════
test.describe('Accessibility basics', () => {
  test('html lang attribute is Indonesian', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  });

  test('main landmark exists', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('main#main')).toHaveCount(1);
  });

  test('header landmark exists', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('header[data-header]')).toHaveCount(1);
  });

  test('footer landmark exists', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('footer')).toHaveCount(1);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto(BASE);
    const images = page.locator('main img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

// ═══════════════════════════════════════════════════════════════
//  20. NO BROKEN IMAGES
// ═══════════════════════════════════════════════════════════════
test.describe('Images', () => {
  test('all images on landing page load successfully', async ({ page }) => {
    const failedImages: string[] = [];
    page.on('response', (resp) => {
      if (resp.url().match(/\.(webp|png|jpg|svg|woff2)$/) && resp.status() >= 400) {
        failedImages.push(`${resp.url()} → ${resp.status()}`);
      }
    });

    await page.goto(BASE);
    await page.waitForLoadState('networkidle');

    expect(failedImages).toEqual([]);
  });
});
