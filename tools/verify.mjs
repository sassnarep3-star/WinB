#!/usr/bin/env node
/**
 * Counterwise release gate.
 *
 * Runs against the generated site and fails loudly on anything that would put
 * an unsourced claim, an unmarked affiliate link, a missing disclosure or a
 * broken link in front of a reader.
 *
 *   node tools/verify.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://sassnarep3-star.github.io/WinB';
const TAG = 'shopnow047c-20';

const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

/* ------------------------------------------------------- collect the site */

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'data' || entry.name === 'tools') continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, acc);
    else if (entry.name.endsWith('.html')) acc.push(abs);
  }
  return acc;
}

const htmlFiles = walk(ROOT).sort();
const relOf = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');

/* ------------------------------------------------- 1. disclosure presence */

for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  const bodyIdx = html.indexOf('<body');
  const head = html.slice(bodyIdx, bodyIdx + 900);
  if (!/class="disclosure"/.test(head)) {
    fail(`[disclosure] ${rel}: the disclosure strip is not the first element after <body>`);
  }
  if (!/As an Amazon Associate I earn from qualifying purchases/.test(html)) {
    fail(`[disclosure] ${rel}: the disclosure wording is missing`);
  }
  if (!/class="pill">Sponsored/.test(html)) {
    // pages with no product link still need the marker in the footer note
    if (!/Sponsored<\/span> are affiliate links/.test(html)) {
      fail(`[disclosure] ${rel}: no sponsored marker found in the page or the footer note`);
    }
  }
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) {
    fail(`[meta] ${rel}: missing or too-short meta description`);
  }
  if (!/<link rel="canonical" href="https:\/\/sassnarep3-star\.github\.io\/WinB\//.test(html)) {
    fail(`[meta] ${rel}: canonical URL missing or pointing at the wrong host`);
  }
  if (!/rel="alternate" type="application\/rss\+xml"/.test(html)) {
    fail(`[meta] ${rel}: no RSS alternate link`);
  }
}

/* --------------------------------------------- 2. outbound link discipline */

const ALLOWED_HOSTS = new Set([
  'www.amazon.com',
  'amazon.com',
  'link.amazon',
  'affiliate-program.amazon.com',
  'webservices.amazon.com',
  'www.ftc.gov',
  'ftc.gov',
  'www.ecfr.gov',
  'api.github.com',
  'github.com',
  'sassnarep3-star.github.io',
]);

for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  const anchors = [...html.matchAll(/<a\b([^>]*)>/g)];
  for (const [, attrs] of anchors) {
    const href = (attrs.match(/href="([^"]*)"/) || [])[1];
    if (!href || !/^https?:/i.test(href)) continue;
    let host;
    try {
      host = new URL(href).hostname.toLowerCase();
    } catch {
      fail(`[link] ${rel}: unparseable href ${href}`);
      continue;
    }
    if (!ALLOWED_HOSTS.has(host)) {
      fail(`[link] ${rel}: outbound host ${host} is not on the allowlist (${href})`);
      continue;
    }
    const rel_ = (attrs.match(/rel="([^"]*)"/) || [])[1] || '';
    const isSponsored = rel_.includes('sponsored');

    if (host === 'www.amazon.com' || host === 'amazon.com') {
      if (!isSponsored) {
        fail(`[link] ${rel}: Amazon link is not marked sponsored -> ${href}`);
      }
      if (!href.includes(`tag=${TAG}`)) {
        fail(`[link] ${rel}: Amazon link is missing the Associate ID parameter -> ${href}`);
      }
      if (!/amazon\.com\/dp\/[A-Z0-9]{10}\?/.test(href)) {
        fail(`[link] ${rel}: Amazon link is not in the canonical /dp/<ASIN> Special Link form -> ${href}`);
      }
    }
    if (host === 'link.amazon') {
      if (isSponsored) {
        fail(`[link] ${rel}: a supplied short link is marked sponsored -> ${href}`);
      }
      if (/class="[^"]*\bbuy\b/.test(attrs)) {
        fail(`[link] ${rel}: a supplied short link is styled as a purchase call to action -> ${href}`);
      }
    }
  }
}

/* ---------------------------------------------- 3. internal links resolve */

for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  const dir = path.dirname(abs);
  for (const [, attrs] of html.matchAll(/<a\b([^>]*)>/g)) {
    const href = (attrs.match(/href="([^"]*)"/) || [])[1];
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.endsWith('/') ? path.join(dir, 'index.html') : path.join(dir, clean);
    if (!fs.existsSync(target)) {
      fail(`[link] ${rel}: internal link target does not exist -> ${href}`);
    }
  }
  for (const [, attrs] of html.matchAll(/<(?:link|script|img)\b([^>]*)>/g)) {
    const src = (attrs.match(/(?:href|src)="([^"]*)"/) || [])[1];
    if (!src || /^(https?:|data:|\/\/)/i.test(src)) continue;
    const clean = src.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.endsWith('/') ? path.join(dir, 'index.html') : path.join(dir, clean);
    if (!fs.existsSync(target)) {
      fail(`[asset] ${rel}: referenced asset does not exist -> ${src}`);
    }
  }
}

/* -------------------------------- 4. every value-bearing table row sourced */

const VALUE_BEARING = /(\$\s?\d)|\b\d+\.\d{1,2}\b|\b\d{1,3},\d{3}\b/;
for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
  rows.forEach(([, rowHtml], i) => {
    if (/<th\b/i.test(rowHtml) && !/<td\b/i.test(rowHtml)) return; // header row
    if (!VALUE_BEARING.test(rowHtml)) return;
    const hasExternal = /href="https:\/\//.test(rowHtml);
    const markedLocal = /data-source="local"/.test(rowHtml);
    if (!hasExternal && !markedLocal) {
      const text = rowHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110);
      fail(`[source] ${rel}: table row ${i + 1} carries a value but no source link -> "${text}"`);
    }
  });
}

/* --------------------------------------- 5. no placeholders, no stray text */

const PLACEHOLDER = /\b(TODO|FIXME|Lorem ipsum|TBD|XXX+|PLACEHOLDER|\[insert)\b/i;
for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  // the documented Associate ID format "XXXXX-##" is a legitimate quotation
  const scrubbed = html.replace(/XXXXX-##/g, 'id-format');
  const m = scrubbed.match(PLACEHOLDER);
  if (m) fail(`[content] ${rel}: placeholder text "${m[0]}" found`);
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(scrubbed)) {
    fail(`[content] ${rel}: an unresolved value was rendered`);
  }
}

/* -------------------------------------------- 6. titles and descriptions */

const titles = new Map();
for (const abs of htmlFiles) {
  const html = fs.readFileSync(abs, 'utf8');
  const rel = relOf(abs);
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!t) fail(`[meta] ${rel}: no title`);
  else {
    if (titles.has(t)) fail(`[meta] ${rel}: duplicate title, also used by ${titles.get(t)}`);
    titles.set(t, rel);
  }
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) fail(`[seo] ${rel}: expected exactly one h1, found ${h1}`);
}

/* ------------------------------------------------- 7. sitemap and feed */

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = htmlFiles.map((abs) => {
  const rel = relOf(abs);
  if (rel === 'index.html') return `${SITE}/`;
  if (rel.endsWith('/index.html')) return `${SITE}/${rel.slice(0, -'index.html'.length)}`;
  return `${SITE}/${rel}`;
});
for (const u of expected) {
  if (!locs.includes(u)) fail(`[sitemap] missing URL for a generated page -> ${u}`);
}
for (const u of locs) {
  if (!expected.includes(u)) fail(`[sitemap] URL does not map to a generated page -> ${u}`);
}
if (new Set(locs).size !== locs.length) fail('[sitemap] duplicate URLs');

const feed = fs.readFileSync(path.join(ROOT, 'feed.xml'), 'utf8');
const items = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
const articles = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'articles.json'), 'utf8')).articles;
for (const a of articles) {
  const u = `${SITE}/guides/${a.slug}.html`;
  if (!items.includes(u)) fail(`[feed] article missing from the feed -> ${u}`);
}

const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
if (!robots.includes(`${SITE}/sitemap.xml`)) fail('[robots] the sitemap is not advertised in robots.txt');

/* ------------------------------------------- 8. data layer host allowlist */

const dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter((f) => f.endsWith('.json'));
for (const f of dataFiles) {
  const raw = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8');
  for (const m of raw.matchAll(/https?:\/\/[^\s"']+/g)) {
    const url = m[0].replace(/[",;)]+$/, '');
    let host;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      fail(`[data] ${f}: unparseable URL ${url}`);
      continue;
    }
    if (!ALLOWED_HOSTS.has(host)) fail(`[data] ${f}: URL host ${host} is not on the allowlist -> ${url}`);
  }
}

const productsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8'));
for (const p of productsData.products) {
  if (!/^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/.test(p.officialListingUrl)) {
    fail(`[data] ${p.id}: officialListingUrl is not a canonical Amazon listing -> ${p.officialListingUrl}`);
  }
  if (!/^https:\/\/link\.amazon\/[A-Za-z0-9]+$/.test(p.submittedLink)) {
    fail(`[data] ${p.id}: submittedLink is not a link.amazon short link -> ${p.submittedLink}`);
  }
  if (!p.confirmationDate) fail(`[data] ${p.id}: no confirmation date`);
  if (!p.confirmationSource) fail(`[data] ${p.id}: no confirmation source`);
  if (p.intendedAsin !== null && p.intendedAsin !== undefined) {
    if (p.intendedAsin === p.observedAsin) {
      fail(`[data] ${p.id}: the intended ASIN has been merged with the observed redirect target`);
    }
  }
  if (p.observedAsin.length !== 10) fail(`[data] ${p.id}: observed ASIN is not 10 characters`);
  if (!p.priceObservedOn) fail(`[data] ${p.id}: a price is present with no observation date`);
}

const questionsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'questions.json'), 'utf8'));
for (const q of questionsData.rows) {
  for (const k of ['known', 'missing', 'howToDiscover', 'decisionEnabled']) {
    if (!q[k] || !String(q[k]).trim()) fail(`[data] ${q.id}: "${k}" is empty`);
  }
}

const campaignsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'campaigns.json'), 'utf8'));
if (campaignsData.rows.length !== 0) {
  fail('[data] the campaign ledger must be empty until an authorised first-party report exists');
}

/* ----------------------------------------------------------------- report */

notes.push(`${htmlFiles.length} pages checked`);
notes.push(`${locs.length} sitemap URLs`);
notes.push(`${articles.length} feed items`);
notes.push(`${dataFiles.length} data files`);

if (failures.length) {
  console.error(`\nVERIFY FAILED — ${failures.length} problem(s)\n`);
  failures.forEach((f) => console.error('  x ' + f));
  console.error('');
  process.exit(1);
}
console.log(`VERIFY OK — ${notes.join(', ')}`);
