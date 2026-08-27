/**
 * OHMEGA CMS Auth Bridge — Cloudflare Worker
 *
 * OAuth bridge antara Decap CMS dan GitHub.
 * Decap CMS (di /admin) akan redirect ke worker ini untuk login.
 *
 * Setup:
 *   1. Buat GitHub OAuth App di https://github.com/settings/developers
 *      - Homepage URL: https://ohmega.web.id
 *      - Authorization callback URL: <WORKER_URL>/callback
 *   2. Set secrets di Cloudflare Worker (dashboard atau wrangler):
 *      - GITHUB_CLIENT_ID
 *      - GITHUB_CLIENT_SECRET
 *   3. (Opsional) set di wrangler.toml atau env:
 *      - REPO = "eiaiproject/Ohmega"
 *      - ALLOWED_ORIGIN = "https://ohmega.web.id"
 *
 * Endpoints:
 *   GET /         → status JSON (untuk verifikasi)
 *   GET /auth     → redirect ke GitHub OAuth
 *   GET /callback → tukar code jadi access_token, kirim ke Decap
 */

const OAUTH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const OAUTH_TOKEN = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://ohmega.web.id';
    const base = `${url.protocol}//${url.host}`;

    // CORS preflight (beberapa versi Decap mengirim OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (url.pathname === '/' || url.pathname === '') {
      return jsonResponse(
        {
          ok: true,
          service: 'ohmega-cms-auth',
          endpoints: ['/auth', '/callback'],
          repo: env.REPO || 'eiaiproject/Ohmega',
        },
        200,
        allowedOrigin
      );
    }

    // ── Step 1: redirect user ke GitHub OAuth ──
    if (url.pathname === '/auth') {
      if (!clientId) {
        return jsonResponse({ error: 'missing_GITHUB_CLIENT_ID' }, 500, allowedOrigin);
      }
      const redirectUri = `${base}/callback`;
      const scope = 'public_repo,repo';
      const ghUrl =
        `${OAUTH_AUTHORIZE}?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${encodeURIComponent(allowedOrigin)}`;
      return Response.redirect(ghUrl, 302);
    }

    // ── Step 2: GitHub redirect balik dengan ?code=… ──
    if (url.pathname === '/callback') {
      if (!clientId || !clientSecret) {
        return jsonResponse(
          { error: 'missing_client_credentials' },
          500,
          allowedOrigin
        );
      }
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state') || allowedOrigin;
      if (!code) {
        return jsonResponse({ error: 'missing_code' }, 400, allowedOrigin);
      }

      // Tukar code dengan access_token
      const tokenResp = await fetch(OAUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: `${base}/callback`,
        }),
      });
      const tokenData = await tokenResp.json();

      if (tokenData.error) {
        return jsonResponse(
          { error: tokenData.error, description: tokenData.error_description },
          400,
          allowedOrigin
        );
      }
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return jsonResponse({ error: 'no_access_token', raw: tokenData }, 500, allowedOrigin);
      }

      // Render HTML yang mengirim token ke Decap CMS via postMessage
      // Decap membuka worker di popup, lalu menerima token di window.opener
      const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>OHMEGA CMS Auth</title>
  <style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#F1F8F3;color:#183126}</style>
</head>
<body>
  <p>Menghubungkan ke OHMEGA CMS…</p>
  <script>
    (function () {
      var payload = {
        api: "token",
        token: ${JSON.stringify(accessToken)},
        provider: "github"
      };
      // Decode 'state' (allowedOrigin) dari query param
      var params = new URLSearchParams(location.search);
      var targetOrigin = ${JSON.stringify(state)};
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, targetOrigin);
          window.close();
          return;
        }
      } catch (e) {
        // fallthrough ke redirect
      }
      // Fallback: redirect ke admin dengan token di hash
      var hash = "#access_token=" + encodeURIComponent(payload.token)
        + "&token_type=bearer"
        + "&provider=github"
        + "&state=" + encodeURIComponent(targetOrigin);
      window.location.replace(targetOrigin.replace(/\\/$/, "") + "/admin/" + hash);
    })();
  </script>
  <noscript>
    <p>JavaScript dibutuhkan. Salin token ini ke <a href="${allowedOrigin}/admin/">${allowedOrigin}/admin/</a>:</p>
    <code>${accessToken}</code>
  </noscript>
</body>
</html>`;
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders(allowedOrigin),
        },
      });
    }

    return jsonResponse({ error: 'not_found', path: url.pathname }, 404, allowedOrigin);
  },
};

function jsonResponse(obj, status, origin) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
