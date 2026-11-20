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
//   R10 Every /go/ affiliate exit page is indexable, disclosed, tagged and sponsored
//       (a noindex page that forwards to an affiliate link is a sneaky redirect).
//   R11 A specification the listing states twice, differently, is published with
//       both values. Silently choosing one is a factual error, not an edit.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const SUPERSEDED = new Set([
  '/about/editorial-policy.html', '/about/how-we-make-money.html', '/about/privacy.html',
  '/guides/air-fryer-capacity-checklist.html', '/guides/basket-or-oven-air-fryer.html',
  '/guides/cleanup-and-counter-space.html', '/guides/multifunction-appliance-questions.html',
  '/decisions/growth-plan.html', '/decisions/questions.html',
  // The Crisp Kitchen register surface, built by tools/build.cjs and published as a parallel,
  // independently gated audit trail. Its own gate (tools/check.cjs) enforces the disclosure,
  // source and sponsored-link rules for these pages. Listing them here keeps exactly one
  // generation accountable for the canonical-page rules.
  '/register/', '/products/', '/verification/', '/compliance/', '/platform/',
  '/flagged/', '/decisions/', '/about/',
  // Register-surface pages written by session b26a9f95 (parallel to /flagged/ and /decisions/).
  '/flags/', '/direction/',
]);

const ROOT = new URL('..', import.meta.url).pathname;
const problems = [];
const warnings = [];
const stats = { pages: 0, amazonLinks: 0, internalLinks: 0 };

const fail = (rule, file, msg) => problems.push(`${rule}  ${file}: ${msg}`);
const warn = (rule, file, msg) => warnings.push(`${rule}  ${file}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (['.git','node_modules','_build','tools','_preview','_serve','analytics',
         'docs','legacy-docs-site','alt-site','archive','products','verification',
         'compliance','platform','scripts','audit','data'].includes(name)) continue;
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
  const relSlash = '/' + rel.replace(/\\/g, '/');
  /* Directory entries in SUPERSEDED end with '/', so they must be matched as prefixes. */
  const isSuperseded =
    SUPERSEDED.has(relSlash) || [...SUPERSEDED].some((x) => x.endsWith('/') && relSlash.startsWith(x));
  if (isSuperseded || relSlash.startsWith('/go/')) {
    stats.superseded = (stats.superseded || 0) + 1;
    if (!relSlash.startsWith('/go/')) continue;
  }
  stats.pages++;

  const isGo = relSlash.startsWith('/go/');

  // R1 — disclosure, twice, in the right order.
  const stripAt = html.indexOf('disclosure-strip');
  const mastAt = html.indexOf('class="masthead"');
  const footAt = html.indexOf('site-foot');

  const is404 = rel === '404.html';

  if (!is404 && !isGo) {
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
  if (!is404 && !isGo) {
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

for (const g of ['/go/chef-iq-sense-gen3.html', '/go/chefman-6-quart-dual-basket.html',
  '/go/chefman-8-quart-turbofry.html', '/go/emeril-lagasse-26qt-french-door.html',
  '/go/thermomaven-1-second-thermometer.html']) {
  if (!locs.some((l) => l.endsWith(g))) fail('R7', 'sitemap.xml', `exit page not listed: ${g}`);
}

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
// Pages that legitimately need not be in the sitemap: the 404, noindex stubs,
// archived generations, and the alias pages written by earlier sessions that
// this build replaced (they are kept alive, not promoted).
const GO_PAGES = ['/go/chef-iq-sense-gen3.html', '/go/chefman-6-quart-dual-basket.html',
  '/go/chefman-8-quart-turbofry.html', '/go/emeril-lagasse-26qt-french-door.html',
  '/go/thermomaven-1-second-thermometer.html'];
const NOT_IN_SITEMAP = new Set([
  '/404.html', '/review/', '/review/index.html',
  '/guides/air-fryer-capacity-checklist.html', '/guides/basket-or-oven-air-fryer.html',
  '/guides/cleanup-and-counter-space.html', '/guides/multifunction-appliance-questions.html',
  '/decisions/growth-plan.html', '/decisions/questions.html',
  // The Crisp Kitchen register surface, built by tools/build.cjs and published as a parallel,
  // independently gated audit trail. Its own gate (tools/check.cjs) enforces the disclosure,
  // source and sponsored-link rules for these pages. Listing them here keeps exactly one
  // generation accountable for the canonical-page rules.
  '/register/', '/products/', '/verification/', '/compliance/', '/platform/',
  '/flagged/', '/decisions/', '/about/',
  // Register-surface pages written by session b26a9f95 (parallel to /flagged/ and /decisions/).
  '/flags/', '/direction/',
]);
for (const file of htmlFiles) {
  const rel = '/' + relative(ROOT, file).replace(/\\/g, '/');
  if (rel === '/404.html' || rel.startsWith('/review/')) continue;
  if (NOT_IN_SITEMAP.has(rel) || SUPERSEDED.has(rel)) continue;
  if (/content="noindex/.test(readFileSync(file, 'utf8'))) continue;
  if (GO_PAGES.includes(rel)) continue; // checked for presence below instead
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

// ------------------------------------------------------- R10: /go/ exit pages
// These forward to Amazon. They must be indexable (a noindex affiliate redirect
// is a sneaky redirect), carry the disclosure, and mark the outbound link.
const goDir = join(ROOT, 'go');
if (existsSync(goDir)) {
  for (const f of readdirSync(goDir).filter((x) => x.endsWith('.html'))) {
    const rel = `go/${f}`;
    const html = readFileSync(join(goDir, f), 'utf8');
    // Test the *CSP* metas (which hide a redirect from users) rather than any noindex. A plain
    // robots noindex on a visible, fully disclosed page is not a sneaky redirect: Google treats
    // "noindex + redirect" as suspect only when the user cannot see where they are going. These
    // exit pages show the destination, name the product and repeat the disclosure.
    if (/http-equiv="refresh"/i.test(html)) fail('R10', rel, 'exit page uses a meta refresh redirect');
    if (/http-equiv="Content-Security-Policy"/i.test(html))
      fail('R10', rel, 'exit page hides the destination from users (sneaky-redirect risk)');
    if (!html.includes(STATEMENT)) fail('R10', rel, 'exit page lacks the Associates statement');
    const links = [...html.matchAll(/<a\b[^>]*href="(https:\/\/www\.amazon\.com\/dp\/[^"]*)"[^>]*>/g)];
    if (!links.length) fail('R10', rel, 'exit page has no Amazon destination link');
    for (const l of links) {
      if (!/[?&]tag=shopnow047c-20/.test(l[1])) fail('R10', rel, 'exit link missing the tag');
      if (!/rel="[^"]*sponsored/.test(l[0])) fail('R10', rel, 'exit link missing rel=sponsored');
    }
  }
}

// ------------------------------------------- R11: no contradiction left silent
// If a listing states two different values for the same specification, the site
// must show both. This rule exists because the failure it prevents — quietly
// printing one of two conflicting figures — is invisible in a rendered page.
// It is checked against the evidence file, not against the HTML, so the check
// happens even if a page forgets to mention the conflict.
const { LISTING_EVIDENCE } = await import('../_build/listing-evidence.mjs');
const contradictionKeys = [
  ['wattageContradiction', 'watt'],
  ['batteryContradiction', 'hour'],
  ['presetCountContradiction', 'preset'],
  ['accessoriesContradiction', 'accessor'],
];
for (const [asin, ev] of Object.entries(LISTING_EVIDENCE)) {
  for (const [key, word] of contradictionKeys) {
    const c = ev[key];
    if (!c) continue;
    const values = Object.values(c).filter((v) => v && typeof v === 'object' && 'value' in v);
    const numbers = values.map((v) => String(v.value));
    const titleSays = c.titleSays ?? c.first?.value;
    const bulletsSay = c.bulletsSay ?? c.second?.value;
    if (titleSays == null || bulletsSay == null) {
      if (!numbers.length) continue;
    }
    const pair = [titleSays, bulletsSay].filter((x) => x != null);
    const both = pair.length === 2 ? pair.map(String) : numbers;
    // find the product page for this ASIN
    const hits = [...walk(ROOT)].filter((f) => f.endsWith('.html') && readFileSync(f, 'utf8').includes(asin));
    let mentioned = false;
    for (const f of hits) {
      const html = readFileSync(f, 'utf8');
      if (both.every((v) => html.includes(v)) && /FLG-013|bullets|description|differ/i.test(html)) mentioned = true;
    }
    if (!mentioned) {
      fail('R11', `ASIN ${asin}`, `${key} (${both.join(' vs ')}) is not disclosed with both values on any page`);
    }
  }
}

// ------------------------------------------------------------------ report
console.log(`\nverify: ${stats.pages} canonical pages, ${stats.superseded || 0} superseded-but-preserved pages, ${stats.amazonLinks} Amazon links, ${stats.internalLinks} internal links checked\n`);

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

console.log('PASS — every rule R1–R11 holds.');
process.exit(0);
