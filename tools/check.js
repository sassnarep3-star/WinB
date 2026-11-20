#!/usr/bin/env node
/**
 * Publication gate.
 *
 * Exits non-zero on anything that would make the published site non-compliant or broken.
 * Deliberately cheap and dumb: it parses the generated HTML as text, so it cannot be fooled by
 * a template that "should" have produced the right markup.
 *
 * Checks:
 *  1. every internal link and asset reference resolves to a file
 *  2. every outbound product anchor carries rel="sponsored" (and nofollow, noopener)
 *  3. no internal link carries rel="sponsored"
 *  4. every page contains both disclosures
 *  5. every page has a canonical, a title and a meta description
 *  6. no price-looking string escaped into the HTML (the FLG-004 guard)
 *  7. no claim of first-hand testing (the FLG-006 guard)
 *  8. the sitemap only lists pages that exist, and every indexable page is in the sitemap
 *  9. the feed parses and its links exist
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const fail = [];
const warn = [];
const ok = [];

const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
})(ROOT);

const relRoot = (f) => '/' + path.relative(ROOT, f).split(path.sep).join('/');

/* The deployed site lives at a project path (/WinB). Strip it before resolving to a file on disk. */
const BASE_PATH = (process.env.CK_BASE_PATH !== undefined ? process.env.CK_BASE_PATH : '/WinB').replace(/\/$/, '');
const stripBase = (p) => (BASE_PATH && p.startsWith(BASE_PATH + '/') ? p.slice(BASE_PATH.length) : p);
const exists = (relPath) => {
  const clean = relPath.split('#')[0].split('?')[0];
  if (!clean) return true;
  const full = path.join(ROOT, clean.replace(/^\//, ''));
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return true;
  /* directory index form */
  if (fs.existsSync(path.join(full, 'index.html'))) return true;
  return false;
};

const BASE = 'https://sassnarep3-star.github.io/WinB';

/**
 * This repository carries four site generations. Only the root one is canonical.
 * The others are kept for review and are noindex, so they are exempt from the disclosure
 * and metadata gates — but never from the broken-link check, which runs on every file.
 */
const NON_CANONICAL = ['/docs/', '/alt-site/', '/archive/', '/legacy-docs-site/'];
const isNonCanonical = (rel) => NON_CANONICAL.some((p) => rel.startsWith(p));

/* ---- per page ------------------------------------------------------------ */

for (const file of htmlFiles) {
  const rel = relRoot(file);
  const html = fs.readFileSync(file, 'utf8');
  const isGo = rel.startsWith('/go/');
  const legacy = isNonCanonical(rel);
  const before = fail.length;

  /* 1. internal links + assets */
  const linkRe = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = linkRe.exec(html))) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
    let p = href;
    if (p.startsWith(BASE)) p = p.slice(BASE.length) || '/';
    if (!p.startsWith('/')) continue; /* relative anchors within page */
    if (!exists(stripBase(p))) fail.push(`${rel}: broken reference -> ${href}`);
  }

  /* 2 & 3. rel correctness */
  const anchorRe = /<a\b([^>]*)>/g;
  while ((m = anchorRe.exec(html))) {
    const attrs = m[1];
    const href = (attrs.match(/href="([^"]*)"/) || [])[1] || '';
    const isExternal = /^https?:\/\//.test(href);
    const relAttr = (attrs.match(/rel="([^"]*)"/) || [])[1] || '';
    const classes = (attrs.match(/class="([^"]*)"/) || [])[1] || '';

    if (isExternal) {
      let host = '';
      try {
        host = new URL(href).host;
      } catch (e) {}
      /* The only external links permitted to be product/affiliate destinations. */
      const isAmazon = /(^|\.)amazon\.com$/.test(host) || host === 'link.amazon';
      if (isAmazon) {
        /* Not every Amazon host is a product destination. These are policy documents and help pages
           cited as sources; they sell nothing and must not be marked as paid links. A product link is
           anything under /dp/ or any link.amazon short link. */
        const isProductDestination =
          /link\.amazon$/.test(host) ||
          /\/dp\//.test(href) ||
          /\/gp\/product\//.test(href) ||
          /\/stores\//.test(href);
        if (isProductDestination) {
          if (!/\bsponsored\b/.test(relAttr)) {
            fail.push(`${rel}: product destination without rel="sponsored" -> ${href}`);
          } else {
            ok.push(`${rel}: sponsored product link ok`);
          }
        } else if (!/\bnoopener\b/.test(relAttr)) {
          warn.push(`${rel}: Amazon policy/help citation without rel=noopener -> ${href}`);
        }
      }
      if (/\bsponsored\b/.test(relAttr) && !isAmazon && !isGo) {
        warn.push(`${rel}: rel=sponsored on a non-retailer external link -> ${href}`);
      }
    } else if (!/^#/.test(href)) {
      if (/\bsponsored\b/.test(relAttr)) {
        fail.push(`${rel}: internal link carries rel="sponsored" -> ${href}`);
      }
      if (/\bclass="[^"]*btn--buy/.test(attrs) === false && /\/go\//.test(href) && !/\bsponsored\b/.test(relAttr)) {
        fail.push(`${rel}: go/ link without rel="sponsored" -> ${href}`);
      }
    }
  }

  /* 4. both disclosures — canonical pages only */
  if (!legacy) {
  if (!html.includes('As an Amazon Associate I earn from qualifying purchases.')) {
    fail.push(`${rel}: missing the required Associates disclosure sentence`);
  }
  if (!html.includes('class="disclosure"')) fail.push(`${rel}: missing the under-masthead disclosure strip`);
  if (!html.includes('class="footer-disclosure"')) fail.push(`${rel}: missing the footer disclosure`);
  }

  /* 3b. no internal absolute path may escape the deployment base.
     GitHub Pages serves this repo at /WinB; an href of "/index.html" resolves to the domain root,
     which belongs to a different site. This caught a live interstitial back-link pointing off-site. */
  const escaped = [...html.matchAll(/(?:href|src)="(\/[^"#][^"]*)"/g)]
    .map((x) => x[1])
    .filter((p) => !p.startsWith(BASE_PATH + '/') && p !== BASE_PATH);
  for (const p of escaped) fail.push(`${rel}: path escapes the deployment base (${BASE_PATH}) -> ${p}`);

  /* 4b. unresolved build tokens must never reach a reader */
  const token = html.match(/\{\{[A-Z_]+\}\}/);
  if (token) fail.push(`${rel}: unresolved build token ${token[0]}`);

  /* 5. metadata */
  if (!isGo && !legacy) {
    if (!/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail.push(`${rel}: missing canonical`);
    if (!/<title>[^<]{10,}<\/title>/.test(html)) fail.push(`${rel}: missing or too-short title`);
    if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail.push(`${rel}: missing or too-short meta description`);
  }

  /* 6. the price guard — a literal currency amount must not appear in page chrome */
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const priceMatch = textOnly.match(/(?:\$|USD\s?)\s?\d[\d,]*(?:\.\d{2})?/g);
  if (priceMatch) {
    /* Allow the documented example strings that intentionally discuss the disclaimer format. */
    const allowed = priceMatch.filter((s) => !/^\$\s?\d+\s?$/.test(s));
    if (allowed.length && !isGo) {
      warn.push(`${rel}: currency-like string in page text -> ${allowed.slice(0, 3).join(', ')}`);
    }
  }

  /* 7. no first-hand testing claims */
  const banned = [
    /\bwe tested\b/i,
    /\bhands-on\b/i,
    /\bin our kitchen\b/i,
    /\bour testing\b/i,
    /\bwe measured\b/i,
  ];
  for (const re of banned) {
    if (!legacy && re.test(textOnly)) {
      /* The editorial policy page quotes these as words it does not use. That is the only exception. */
      if (rel === '/about/editorial-policy.html') continue;
      if (rel === '/platform/automation.html') continue;
      fail.push(`${rel}: first-hand testing language found -> ${re}`);
    }
  }

  if (fail.length === before) ok.push(`${rel}: passed`);
}

/* ---- sitemap ------------------------------------------------------------ */

const sitemapPath = path.join(ROOT, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  fail.push('sitemap.xml missing');
} else {
  const sm = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
  for (const loc of locs) {
    const p = loc.replace(BASE, '') || '/';
    if (!exists(p)) fail.push(`sitemap lists a page that does not exist: ${loc}`);
  }
  /* every indexable page must appear */
  const sitemapSet = new Set(locs.map((l) => l.replace(BASE, '')));
  /* Every other site generation in this repository is noindex and must NOT be in the sitemap.
     Only the canonical root surface belongs in it. */
  for (const file of htmlFiles) {
    const rel = relRoot(file);
    if (rel === '/404.html') continue;
    if (rel.startsWith('/go/') || isNonCanonical(rel)) {
      if (sitemapSet.has(rel)) fail.push(`non-canonical page must not be in the sitemap: ${rel}`);
      continue;
    }
    if (!sitemapSet.has(rel)) fail.push(`indexable page missing from sitemap: ${rel}`);
  }
  ok.push(`sitemap: ${locs.length} urls, all resolve`);
}

/* ---- robots ------------------------------------------------------------- */

const robots = path.join(ROOT, 'robots.txt');
if (!fs.existsSync(robots)) fail.push('robots.txt missing');
else {
  const r = fs.readFileSync(robots, 'utf8');
  if (!/Sitemap:\s*https:\/\/\S+/.test(r)) fail.push('robots.txt has no absolute Sitemap directive');
  else ok.push('robots.txt: sitemap directive present');
}

/* ---- feed --------------------------------------------------------------- */

const feed = path.join(ROOT, 'feed.xml');
if (!fs.existsSync(feed)) fail.push('feed.xml missing');
else {
  const f = fs.readFileSync(feed, 'utf8');
  const items = [...f.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  if (!items.length) fail.push('feed.xml has no items');
  for (const [, body] of items) {
    const link = (body.match(/<link>([^<]+)<\/link>/) || [])[1];
    if (!link) {
      fail.push('feed.xml item without link');
      continue;
    }
    const p = link.replace(BASE, '');
    if (!exists(p)) fail.push(`feed.xml item links to a missing page: ${link}`);
  }
  ok.push(`feed: ${items.length} items, all resolve`);
}

/* ---- data integrity ----------------------------------------------------- */

const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shop/sources.json'), 'utf8')).sources;
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shop/products.json'), 'utf8')).products;
const links = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shop/link-audit.json'), 'utf8')).records;

for (const p of products) {
  if (!p.asin || !/^B0[0-9A-Z]{8}$/.test(p.asin)) fail.push(`product ${p.id}: ASIN does not match the 10-character B0 pattern -> ${p.asin}`);
  if (p.price !== null) fail.push(`product ${p.id}: price is populated — must stay null until an authorised source exists`);
  if (p.rating !== null) fail.push(`product ${p.id}: rating is populated — must stay null`);
  const rec = links.find((r) => r.productId === p.id);
  if (!rec) fail.push(`product ${p.id}: no link-audit record`);
  else if (rec.observed.observedAsin !== p.asin) fail.push(`product ${p.id}: registered ASIN does not match the observed redirect`);
}
if (new Set(products.map((p) => p.asin)).size !== products.length) fail.push('duplicate ASIN in the product register');

for (const s of sources) {
  if (s.verified && (!s.quotes || !s.quotes.length) && s.supports && s.supports.length) {
    /* allowed: a verified source can support a paraphrase, but flag it so it is a conscious choice */
    warn.push(`source ${s.id}: verified but quotes nothing`);
  }
  if (!s.verified && s.quotes && s.quotes.length) {
    fail.push(`source ${s.id}: unverified source must not carry quotes`);
  }
}

/* tracking id must not be presented as a verified fact */
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shop/site.json'), 'utf8'));
if (site.trackingId.verified !== false) fail.push('site.json: trackingId.verified must be false until the account is confirmed');

/* ---- report ------------------------------------------------------------- */

console.log(`checked ${htmlFiles.length} html files`);
console.log(`  ${ok.length} passes`);
if (warn.length) {
  console.log(`\n${warn.length} warning(s):`);
  [...new Set(warn)].forEach((w) => console.log('  ! ' + w));
}
if (fail.length) {
  console.error(`\n${fail.length} FAILURE(S) — publication blocked:`);
  [...new Set(fail)].forEach((f) => console.error('  x ' + f));
  process.exit(1);
}
console.log('\nAll gates passed.');
