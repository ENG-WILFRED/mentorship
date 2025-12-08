import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForTokens } from '@/actions/google';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  if (!code || typeof code !== 'string') return res.status(400).send('Missing code');

  try {
    const tokens = await exchangeCodeForTokens(code);

    // Render a simple HTML page so the developer can copy the refresh token easily.
    const refresh = tokens.refresh_token;
    const tokensJson = escapeHtml(JSON.stringify(tokens, null, 2));

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Google OAuth Callback</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>body{font-family:system-ui,Arial,Helvetica,sans-serif;padding:24px}textarea{width:100%;height:6rem}</style>
  </head>
  <body>
    <h1>Google OAuth Callback</h1>
    <p>Token exchange succeeded. <strong>Important:</strong> the <code>refresh_token</code> is only returned on first consent.</p>
    ${
      refresh
        ? `<p><strong>Refresh token:</strong></p>
    <textarea id="refresh">${escapeHtml(refresh)}</textarea>
    <p><button id="copy">Copy refresh token</button> — add it to <code>.env.local</code> as <code>GOOGLE_REFRESH_TOKEN=...</code> and restart the app.</p>`
        : `<p><em>No refresh token returned. This can happen if consent was previously granted. If you need a refresh token, revoke the app access in your Google account and try again with the consent screen.</em></p>`
    }

    <h2>Full token response</h2>
    <pre>${tokensJson}</pre>

    <script>
      const btn = document.getElementById('copy');
      if (btn) btn.addEventListener('click', () => {
        const t = (document.getElementById('refresh'));
        if (!t) return;
        navigator.clipboard.writeText(t.value).then(() => {
          btn.textContent = 'Copied!';
        }).catch(()=>{ btn.textContent = 'Copy failed'; });
      });
    </script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    console.error('token exchange failed', err);
    return res.status(500).json({ error: 'Token exchange failed', details: String(err) });
  }
}
