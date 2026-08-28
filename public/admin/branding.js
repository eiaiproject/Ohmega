/* global CMS */
/**
 * OHMEGA Admin — branding injection.
 * Decap CMS v3 tidak expose cara ganti logo & title via config, jadi kita inject via DOM
 * setelah mount. Pakai MutationObserver untuk handle late-render.
 */
(function () {
  if (typeof CMS === 'undefined') return;

  const OHMEGA_LOGO = '/logo/ohmega-logo.svg';
  const OHMEGA_TITLE = 'OHMEGA Admin';

  function applyBranding() {
    // 1. Ganti title di header
    const titleEl = document.querySelector('.nc-appHeader-name, [class*="appHeader-name"]');
    if (titleEl && titleEl.textContent !== OHMEGA_TITLE) {
      titleEl.textContent = OHMEGA_TITLE;
    }

    // 2. Ganti logo di header dengan brand logo OHMEGA
    const headerLogo = document.querySelector('.nc-appHeader-logo, [class*="appHeader-logo"]');
    if (headerLogo) {
      // Hapus SVG default Decap
      const svg = headerLogo.querySelector('svg');
      if (svg) svg.remove();
      // Tambah img logo brand kalau belum ada
      if (!headerLogo.querySelector('img.ohmega-logo')) {
        const img = document.createElement('img');
        img.src = OHMEGA_LOGO;
        img.alt = 'OHMEGA';
        img.className = 'ohmega-logo';
        img.style.cssText = 'height: 32px; width: auto; background: #FFFDF6; padding: 4px 10px; border-radius: 4px;';
        headerLogo.prepend(img);
      }
    }
  }

  // Run setelah DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }

  // Observe DOM untuk handle late-render
  const observer = new MutationObserver(() => applyBranding());
  observer.observe(document.body, { childList: true, subtree: true });

  // Stop observe setelah 30 detik (Decap sudah stabil)
  setTimeout(() => observer.disconnect(), 30000);
})();
