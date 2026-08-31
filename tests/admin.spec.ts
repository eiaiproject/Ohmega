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
    const resp = await page.goto(ADMIN);
    expect(resp?.status()).toBe(200);
  });

  test('script Decap CMS ter-load dari CDN', async ({ page }) => {
    const resp = await page.goto(ADMIN);
    expect(resp?.status()).toBe(200);

    // Tunggu script Decap CMS muncul (web-first assertion)
    const script = page.locator('script[src*="decap-cms"]');
    await expect(script).toHaveAttribute('src', /decap-cms/);
  });

  test('config.yml bisa di-fetch', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/admin/config.yml`);
    expect(resp?.status()).toBe(200);
    const body = await resp?.text();
    expect(body).toContain('backend:');
    expect(body).toContain('collections:');
  });

  test('UI Decap mount setelah script load', async ({ page }) => {
    await page.goto(ADMIN);

    // Tunggu Decap CMS benar-benar mount — salah satu dari:
    //   - Login button muncul
    //   - nc-app / nc-root element muncul
    const decapReady = page.locator(
      'button:has-text("Login with GitHub"), .nc-app, [class*="nc-"], #nc-root, .decap-cms'
    ).first();
    await expect(decapReady).toBeVisible({ timeout: 15_000 });

    const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
    console.log('Decap mount check — body snippet:', bodyText.slice(0, 200));
  });
});

test.describe('OHMEGA Admin theme', () => {
  test('theme.css & branding.js ter-load', async ({ page }) => {
    const responses: string[] = [];
    page.on('response', (res) => responses.push(res.url()));

    await page.goto(ADMIN);
    await page.waitForLoadState('domcontentloaded');

    expect(responses.some((u) => u.endsWith('/admin/theme.css'))).toBeTruthy();
    expect(responses.some((u) => u.endsWith('/admin/branding.js'))).toBeTruthy();
  });

  test('favicon pakai brand', async ({ page }) => {
    await page.goto(ADMIN);
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });

  test('title halaman admin = "OHMEGA Admin"', async ({ page }) => {
    await page.goto(ADMIN);
    await expect(page).toHaveTitle('OHMEGA Admin');
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
