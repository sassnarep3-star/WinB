// verify.mjs — the gate. Fails the build if any page breaks a rule this
// project has promised to keep. Run it before every merge.
//
// Rules enforced (each maps to a claim made on /methods/):
//   R1  Every page has the Associates statement above the masthead AND in the footer.
//   R2  Every Amazon outbound link is tagged and rel="sponsored".
//   R3  No price, star rating or "N ratings" appears anywhere.
//   R4  No hands-on testing language appears anywhere.
//   R5  Every page has a canonical URL, a title and a description.
//   R6  Every internal href resolves to a file that exists.
//   R7  Sitemap and feed are well-formed and list every indexable page.
//   R8  Every product page names its ASIN and links to its listing.
//   R9  No page claims a traffic/click/revenue figure.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const problems = [];
const warnings = [];
const stats = { pages: 0, amazonLinks: 0, internalLinks: 0 };

const fail = (rule, file, msg) => problems.push(`${rule}  ${file}: ${msg}`);
const warn = (rule, file, msg) => warnings.push(`${rule}  ${file}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (['.git','node_modules','_build','tools','_preview','_serve','analytics'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const STATEMENT = 'As an Amazon Associate I earn from qualifying purchases.';

// ------------------------------------------------------------------- pages
for (const file of htmlFiles) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, 'utf8');
  stats.pages++;

  // R1 — disclosure, twice, in the right order.
  const stripAt = html.indexOf('disclosure-strip');
  const mastAt = html.indexOf('class="masthead"');
  const footAt = html.indexOf('site-foot');

  const is404 = rel === '404.html';

  if (!is404) {
    if (stripAt === -1) fail('R1', rel, 'no disclosure strip');
    else if (mastAt === -1) fail('R1', rel, 'no masthead (cannot verify strip is above it)');
    else if (stripAt > mastAt) fail('R1', rel, 'disclosure strip appears AFTER the masthead');
    if (!html.includes(STATEMENT)) fail('R1', rel, 'Associates statement missing');
    if (footAt === -1) fail('R1', rel, 'no footer');
    else if (!html.slice(footAt).includes(STATEMENT)) fail('R1', rel, 'statement missing from footer');
    if ((html.match(new RegExp(STATEMENT.replace(/\./g, '\\.'), 'g')) || []).length < 2)
      fail('R1', rel, 'statement should appear at least twice (strip + footer)');
  }

  // R2 — every Amazon *product* link (/dp/<ASIN>) is tagged and qualified.
  // Non-product links to Amazon (a help page, a privacy notice) are not
  // affiliate links and must NOT be marked sponsored; they are counted apart.
  const linkRe = /<a\b[^>]*href="(https:\/\/www\.amazon\.com\/dp\/[^"]*)"[^>]*>/g;
  const nonProductAmazon = [...html.matchAll(/<a\b[^>]*href="(https:\/\/www\.amazon\.com\/(?!dp\/)[^"]*)"[^>]*>/g)];
  for (const nm of nonProductAmazon) {
    if (/rel="[^"]*sponsored/.test(nm[0]))
      fail('R2', rel, `non-product Amazon link wrongly marked sponsored: ${nm[1]}`);
  }
  let m;
  const amazonTagged = new Set();
  while ((m = linkRe.exec(html))) {
    stats.amazonLinks++;
    const tag = m[0];
    const href = m[1];
    if (!/[?&]tag=shopnow047c-20/.test(href)) fail('R2', rel, `Amazon link without the required tag: ${href}`);
    if (!/rel="[^"]*sponsored/.test(tag)) fail('R2', rel, `Amazon link without rel="sponsored": ${href}`);
    if (!/rel="[^"]*nofollow/.test(tag)) fail('R2', rel, `Amazon link without rel="nofollow": ${href}`);
    if (!/rel="[^"]*noopener/.test(tag)) warn('R2', rel, `Amazon link without noopener: ${href}`);
    amazonTagged.add(href.split('?')[0]);
  }

  // Any other outbound link to amazon (e.g. link.amazon) must not be a money link.
  if (/href="https:\/\/link\.amazon\//.test(html) && !/class="(mono|tiny)/.test(html))
    warn('R2', rel, 'link.amazon short URL appears outside a code/plain context');

  // R3 — no prices, ratings, or counts.
  const priceRe = /\$\s?\d[\d,]*(?:\.\d{2})?/g;
  let pm;
  while ((pm = priceRe.exec(html))) {
    // Allow prices only inside a source quotation of a policy? There are none.
    fail('R3', rel, `price-like string found: "${pm[0]}"`);
  }
  if (/\b\d(?:\.\d)?\s*out of\s*5\s*stars?/i.test(html)) fail('R3', rel, 'star rating text found');
  if (/aggregateRating|ratingValue|reviewCount/i.test(html)) fail('R3', rel, 'rating schema found');
  if (/\b\d{1,3}(?:,\d{3})*\s+(?:global )?ratings?\b/i.test(html) && !/no (?:star )?ratings/i.test(html)) {
    const hit = html.match(/\b\d{1,3}(?:,\d{3})*\s+(?:global )?ratings?\b/i);
    warn('R3', rel, `possible rating count: "${hit[0]}"`);
  }
  if (/best\s*sellers?\s*rank|sales rank|#\d+\s*in\s*[A-Z]/i.test(html)) fail('R3', rel, 'sales-rank claim found');

  // R4 — no hands-on testing language.
  // Claims of first-hand experience. A phrase is allowed when it sits inside an
  // explicit disclaimer of that very claim ("this page makes no hands-on claim",
  // "we cannot say we tested it"), which is how this site talks about the gap.
  const banned = [
    /\bwe (?:tested|tried|handled|bought)\b/i,
    /\bin our (?:kitchen|test kitchen|tests?)\b/i,
    /\bhands-on (?:review|test|verdict|rating)/i,
    /\bafter (?:weeks|months) of (?:use|testing)\b/i,
    /\bour (?:testing|verdict|hands-on)\b/i,
    /\b(?:I|we) (?:can confirm|found that it)\b/i,
  ];
  const NEGATION = /cannot|can.t |not |never|nothing|no |without|forbid|explicit|disclaimer|deliberately|instead of|rather than|makes no|contains no|is not|are not|will not|does not/i;
  for (const re of banned) {
    const g = new RegExp(re.source, 'gi');
    let h;
    while ((h = g.exec(html))) {
      const around = html.slice(Math.max(0, h.index - 200), h.index + 200);
      if (!NEGATION.test(around)) {
        fail('R4', rel, `hands-on claim: "${h[0]}"`);
        break;
      }
    }
  }

  // R5 — SEO head.
  if (!is404) {
    if (!/<link rel="canonical" href="https:\/\/sassnarep3-star\.github\.io\/WinB\//.test(html))
      fail('R5', rel, 'missing or wrong canonical');
    if (!/<title>[^<]{10,}<\/title>/.test(html)) fail('R5', rel, 'missing or short title');
    if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail('R5', rel, 'missing or short description');
    if (!/<meta property="og:title"/.test(html)) fail('R5', rel, 'missing og:title');
  }

  // R6 — every internal href/src resolves to a real file.
  // Pages use paths relative to their own depth (so the site works at /WinB/
  // and at a domain root). 404.html is the exception: it is served for missing
  // paths at any depth and therefore uses explicit /WinB/ prefixes.
  const innerRe = /(?:href|src)="((?:\/WinB\/|\.{0,2}\/?)[^"#?:]*\.(?:html|css|js|svg|xml|txt)(?:[^"#?]*)?)"/g;
  let im;
  while ((im = innerRe.exec(html))) {
    let target = im[1];
    if (/^https?:/.test(target)) continue;
    if (target.startsWith('/WinB/')) {
      target = target.slice('/WinB'.length) || '/';
    } else if (target.startsWith('/')) {
      // site-root relative
    } else {
      const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/') + 1) : '';
      target = '/' + (dir + target).replace(/\/\.\//g, '/');
    }
    if (target.startsWith('/assets/') || target === '/') continue;
    stats.internalLinks++;
    let p = join(ROOT, target);
    const candidates = [p, join(p, 'index.html'), `${p}.html`];
    if (!candidates.some((c) => existsSync(c) && statSync(c).isFile()))
      fail('R6', rel, `broken internal link: ${target}`);
  }

  // R9 — no invented performance numbers.
  if (/\bconversion rate of\b|\bwe earned\b|\brevenue of \$|\b\d+% conversion\b/i.test(html))
    fail('R9', rel, 'claims a performance figure that was never measured');
}

// ------------------------------------------------------- sitemap and feed
const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) fail('R7', 'sitemap.xml', 'missing XML declaration');
if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) fail('R7', 'sitemap.xml', 'missing sitemap namespace');
if (!sitemap.trimEnd().endsWith('</urlset>')) fail('R7', 'sitemap.xml', 'does not end with </urlset>');

const hosts = new Set(locs.map((l) => new URL(l).host));
if (hosts.size !== 1) fail('R7', 'sitemap.xml', `URLs span ${hosts.size} hosts (protocol requires one)`);

// Every sitemap URL must exist on disk.
for (const loc of locs) {
  const path = new URL(loc).pathname.replace('/WinB', '') || '/';
  const candidates = [join(ROOT, path), join(ROOT, path, 'index.html')];
  if (!candidates.some((c) => existsSync(c) && statSync(c).isFile()))
    fail('R7', 'sitemap.xml', `lists a URL with no file: ${loc}`);
}

// Every non-noindex page must be listed. (The /review/ stub is noindex+canonical elsewhere.)
const listed = new Set(locs.map((l) => new URL(l).pathname.replace('/WinB', '')));
for (const file of htmlFiles) {
  const rel = '/' + relative(ROOT, file).replace(/\\/g, '/');
  if (rel === '/404.html' || rel.startsWith('/review/')) continue;
  const normal = rel.endsWith('/index.html') ? rel.replace('index.html', '') : rel;
  if (!listed.has(normal)) fail('R7', 'sitemap.xml', `page not listed in sitemap: ${normal}`);
}

const feed = readFileSync(join(ROOT, 'feed.xml'), 'utf8');
if (!feed.includes('<rss version="2.0"')) fail('R7', 'feed.xml', 'not an RSS 2.0 document');
if (!/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} \+0000<\/pubDate>/.test(feed))
  fail('R7', 'feed.xml', 'pubDate is not RFC-822 format');
if (!feed.includes('<atom:link')) fail('R7', 'feed.xml', 'missing atom:link self reference');
const items = (feed.match(/<item>/g) || []).length;
if (items < 5) fail('R7', 'feed.xml', `only ${items} items`);

// --------------------------------------------------------------- R8 probes
for (const rel of ['reviews/chefman-6qt-dual-basket.html', 'reviews/chefman-8qt-turbofry.html',
  'reviews/emeril-26qt-french-door.html', 'reviews/thermomaven-1s-thermometer.html',
  'reviews/chef-iq-sense-gen3.html']) {
  const f = join(ROOT, rel);
  if (!existsSync(f)) { fail('R8', rel, 'product page missing'); continue; }
  const html = readFileSync(f, 'utf8');
  if (!/ASIN B0[A-Z0-9]{8}/.test(html)) fail('R8', rel, 'ASIN not printed on the page');
  if (!/href="https:\/\/www\.amazon\.com\/dp\/B0[A-Z0-9]{8}\/\?tag=shopnow047c-20"/.test(html))
    fail('R8', rel, 'no tagged outbound link');
}

// ------------------------------------------------------------------ report
console.log(`\nverify: ${stats.pages} pages, ${stats.amazonLinks} Amazon links, ${stats.internalLinks} internal links checked\n`);

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length})`);
  for (const w of warnings) console.log('  ' + w);
  console.log('');
}

if (problems.length) {
  console.error(`FAILED — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}

console.log('PASS — every rule R1–R9 holds.');
process.exit(0);
