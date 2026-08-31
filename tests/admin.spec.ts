import { test, expect, type Page } from '@playwright/test';

/**
 * Verifikasi halaman admin OHMEGA (/admin) ter-load dengan benar.
 *
 * Tidak melakukan login (butuh OAuth GitHub + worker live).
 * Hanya memastikan:
 *   1. Halaman /admin bisa diakses (200)
 *   2. Script Decap CMS dari CDN ter-load
 *   3. Tombol "Login with GitHub" muncul (atau UI Decap mount)
 *   4. config.yml bisa di-fetch
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const ADMIN = `${BASE_URL}/admin/index.html`;

test.describe('OHMEGA Admin /admin', () => {
  test('halaman admin ter-load', async ({ page }) => {
    const resp = await page.goto(ADMIN, { waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('script Decap CMS ter-load dari CDN', async ({ page }) => {
    const resp = await page.goto(ADMIN, { waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);

    // Cek ada script tag yang mengarah ke unpkg decap-cms
    const scriptSrc = await page.getAttribute('script[src*="decap-cms"]', 'src');
    expect(scriptSrc).toContain('decap-cms');
  });

  test('config.yml bisa di-fetch', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/admin/config.yml`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('backend:');
    expect(body).toContain('collections:');
  });

  test('UI Decap mount setelah script load', async ({ page }) => {
    await page.goto(ADMIN, { waitUntil: 'networkidle' });

    // Beri waktu script load & mount
    await page.waitForTimeout(3000);

    // Cek bahwa elemen Decap muncul (header dengan class nc-app atau elemen login)
    const decapMounted = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      const hasLoginButton =
        !!Array.from(document.querySelectorAll('button, a')).find((el) =>
          /login with github/i.test(el.textContent || '')
        );
      const hasDecapElement =
        !!document.querySelector('.nc-app, [class*="nc-"], #nc-root, .decap-cms');
      return { hasLoginButton, hasDecapElement, bodyTextSnippet: bodyText.slice(0, 200) };
    });

    // Setidaknya satu dari dua indikator harus ada (UI sedang load atau sudah mount)
    expect(
      decapMounted.hasLoginButton || decapMounted.hasDecapElement
    ).toBeTruthy();

    console.log('Decap mount check:', JSON.stringify(decapMounted, null, 2));
  });
});

test.describe('OHMEGA Admin theme', () => {
  test('theme.css & branding.js ter-load', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => requests.push(req.url()));

    await page.goto(ADMIN, { waitUntil: 'networkidle' });

    expect(requests.some((u) => u.endsWith('/admin/theme.css'))).toBeTruthy();
    expect(requests.some((u) => u.endsWith('/admin/branding.js'))).toBeTruthy();
  });

  test('favicon pakai brand', async ({ page }) => {
    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    const faviconHref = await page.getAttribute('link[rel="icon"]', 'href');
    expect(faviconHref).toBe('/favicon.svg');
  });

  test('title halaman admin = "OHMEGA Admin"', async ({ page }) => {
    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    expect(await page.title()).toBe('OHMEGA Admin');
  });

  test('theme.css di-serve dengan HTTP 200 + ukuran > 1KB', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/admin/theme.css`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body?.length).toBeGreaterThan(1000);
    expect(body).toContain('--color-primary');
    expect(body).toContain('Nunito Sans');
  });

  test('branding.js di-serve dengan HTTP 200 + ada MutationObserver', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/admin/branding.js`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('MutationObserver');
    expect(body).toContain('OHMEGA_LOGO');
  });
});
