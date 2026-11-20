/**
 * Counterwise event collector — Cloudflare Worker
 * ===============================================
 *
 * This is the "self-hosted analytics endpoint" the site needs. It is provided
 * as deployable source; it is NOT running. Until you deploy it and set
 * ENDPOINT in /assets/js/site.js, the site measures nothing and says so.
 *
 * Deploy
 * ------
 *   npm i -g wrangler
 *   wrangler d1 create counterwise           # copy the id into wrangler.toml
 *   wrangler d1 execute counterwise --file=./schema.sql
 *   wrangler deploy
 *
 *   Then in /assets/js/site.js:
 *     var ENDPOINT = 'https://counterwise-events.<you>.workers.dev/e';
 *
 * What it stores
 * --------------
 *   event name, timestamp, path, product/asin/guide, viewport class, and a
 *   per-page-load nonce used ONLY to drop duplicate rows.
 *
 * What it never stores or looks at
 * --------------------------------
 *   IP address, user agent, cookies, referrer, country, device fingerprint.
 *   The nonce is random per page load and is not linked across loads, so it
 *   cannot build a session, let alone a person.
 *
 * Retention
 * ---------
 *   90 days. Older rows are deleted by /prune below; schedule it with a Cron
 *   Trigger in wrangler.toml (`crons = ["0 4 * * *"]`).
 */

const ALLOWED = new Set([
  'page_view',
  'product_view',
  'outbound_click',
  'guide_complete',
  'compare_view',
]);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS },
  });

const clamp = (v, max = 200) =>
  typeof v === 'string' ? v.slice(0, max).replace(/[\u0000-\u001f]/g, '') : null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    // Write endpoint
    if (url.pathname === '/e') {
      if (request.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405);

      let payload;
      try {
        payload = await request.json();
      } catch {
        return json({ ok: false, error: 'invalid json' }, 400);
      }

      const events = Array.isArray(payload?.events) ? payload.events.slice(0, 25) : [];
      if (!events.length) return json({ ok: false, error: 'no events' }, 400);

      const rows = [];
      for (const ev of events) {
        const name = clamp(ev?.e, 40);
        if (!name || !ALLOWED.has(name)) continue; // strict allow-list
        const m = ev?.m && typeof ev.m === 'object' ? ev.m : {};
        rows.push([
          name,
          clamp(ev?.n, 32) || '',            // nonce, dedupe only
          new Date().toISOString(),
          clamp(m.path, 120) || '',
          clamp(m.product, 16) || '',
          clamp(m.asin, 16) || '',
          clamp(m.guide, 80) || '',
          clamp(m.viewport, 2) || '',
          clamp(m.category, 32) || '',
          clamp(ev?.pos, 24) || '',
          clamp(ev?.form, 40) || '',
        ]);
      }
      if (!rows.length) return json({ ok: false, error: 'no valid events' }, 400);

      const stmt = env.DB.prepare(
        `INSERT INTO events
           (name, nonce, at, path, product, asin, guide, viewport, category, pos, form)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      await env.DB.batch(rows.map((r) => stmt.bind(...r)));

      return json({ ok: true, accepted: rows.length });
    }

    // Read endpoint — counts only, never rows. Protect with a shared secret.
    if (url.pathname === '/summary') {
      const key = request.headers.get('x-key') || url.searchParams.get('key');
      if (!env.READ_KEY || key !== env.READ_KEY) return json({ ok: false }, 401);

      const { results } = await env.DB.prepare(
        `SELECT name, path, COUNT(*) AS total
           FROM events
          WHERE at >= datetime('now', '-30 days')
          GROUP BY name, path
          ORDER BY total DESC
          LIMIT 500`
      ).all();

      return json({
        ok: true,
        window: '30 days',
        // Explicit warning so nobody mistakes these for a business result.
        note:
          'Counts only. Clicks here are not sales, not commissions, and not a conversion rate. ' +
          'Only Associates Central reports may back an order or revenue figure.',
        results,
      });
    }

    if (url.pathname === '/prune') {
      const key = request.headers.get('x-key') || url.searchParams.get('key');
      if (!env.READ_KEY || key !== env.READ_KEY) return json({ ok: false }, 401);
      const info = await env.DB.prepare(
        `DELETE FROM events WHERE at < datetime('now', '-90 days')`
      ).run();
      return json({ ok: true, deleted: info.meta?.changes ?? null });
    }

    return json({ ok: false, error: 'not found' }, 404);
  },

  // Cron: prune old rows nightly.
  async scheduled(_event, env) {
    await env.DB.prepare(`DELETE FROM events WHERE at < datetime('now', '-90 days')`).run();
  },
};
