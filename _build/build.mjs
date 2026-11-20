// build.mjs — writes every page, then the sitemap, feed, robots and 404.
// The sitemap and feed are generated from the same data the pages come from,
// so a page cannot ship without being listed in both.

import { writeFileSync, readFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SITE, PRODUCTS, GUIDES } from './data.mjs';
import { esc, url, page } from './core.mjs';
import {
  frontPage, categoryPage, productPage, comparePage,
  guidePage, guidesIndex, reviewsIndex, toolsIndex, worksheetPage, ALL_GUIDES,
} from './editorial.mjs';
import { WORKSHEETS } from './tools-content.mjs';
import {
  decisionsPage, dataRoom, flaggedPage, methodsPage,
  aboutPage, privacyPage, execPage, suggestionsPage,
} from './content-oversight.mjs';
import { directionPage } from './content-direction.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const written = [];

function write(rel, html) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, 'utf8');
  written.push(rel);
}

// --------------------------------------------------------------- the pages
const routes = [];

write('index.html', frontPage());
routes.push({ loc: '/', pri: '1.0', freq: 'weekly' });

for (const slug of ['air-fryers', 'thermometers']) {
  write(`${slug}/index.html`, categoryPage(slug));
  routes.push({ loc: `/${slug}/`, pri: '0.9', freq: 'weekly' });
}

write('reviews/index.html', reviewsIndex());
routes.push({ loc: '/reviews/', pri: '0.9', freq: 'weekly' });

for (const p of PRODUCTS) {
  write(`reviews/${p.slug}.html`, productPage(p));
  routes.push({ loc: `/reviews/${p.slug}.html`, pri: '0.8', freq: 'monthly' });
}

write('compare/index.html', comparePage());
routes.push({ loc: '/compare/', pri: '0.8', freq: 'monthly' });

write('guides/index.html', guidesIndex());
routes.push({ loc: '/guides/', pri: '0.8', freq: 'weekly' });

for (const g of ALL_GUIDES) {
  write(g.path, guidePage(g));
  routes.push({ loc: `/${g.path}`, pri: '0.7', freq: 'monthly', lastmod: g.published });
}

write('tools/index.html', toolsIndex());
routes.push({ loc: '/tools/', pri: '0.7', freq: 'monthly' });

for (const w of WORKSHEETS) {
  write(w.path, worksheetPage(w));
  routes.push({ loc: `/${w.path}`, pri: '0.6', freq: 'monthly' });
}

write('decisions/index.html', decisionsPage());
routes.push({ loc: '/decisions/', pri: '0.6', freq: 'weekly' });


write('suggestions/index.html', suggestionsPage());
routes.push({ loc: '/suggestions/', pri: '0.6', freq: 'weekly' });

write('direction/index.html', directionPage());
routes.push({ loc: '/direction/', pri: '0.6', freq: 'weekly' });

write('data-room/index.html', dataRoom());
routes.push({ loc: '/data-room/', pri: '0.6', freq: 'weekly' });

write('flagged/index.html', flaggedPage());
routes.push({ loc: '/flagged/', pri: '0.6', freq: 'weekly' });

write('methods/index.html', methodsPage());
routes.push({ loc: '/methods/', pri: '0.6', freq: 'monthly' });

// The register hub is written by tools/build.cjs (the parallel, independently gated audit
// trail). It is listed here, not generated here, so the shared sitemap stays the single index.
routes.push({ loc: '/register/', pri: '0.5', freq: 'monthly' });

write('about/index.html', aboutPage());
routes.push({ loc: '/about/', pri: '0.5', freq: 'yearly' });

write('privacy/index.html', privacyPage());
routes.push({ loc: '/privacy/', pri: '0.5', freq: 'yearly' });

write('executive-summary/index.html', execPage());
routes.push({ loc: '/executive-summary/', pri: '0.5', freq: 'monthly' });

// Affiliate exit pages written by an earlier session and kept: they are legitimate
// disclosure-carrying landing pages, so they belong in the index rather than
// being hidden (a noindex affiliate redirect is a sneaky-redirect pattern).
for (const g of ['chef-iq-sense-gen3', 'chefman-6-quart-dual-basket', 'chefman-8-quart-turbofry',
  'emeril-lagasse-26qt-french-door', 'thermomaven-1-second-thermometer']) {
  if (existsSync(join(ROOT, 'go', `${g}.html`))) {
    routes.push({ loc: `/go/${g}.html`, pri: '0.4', freq: 'monthly' });
  }
}

// Legacy URL compatibility: the previously published site used /review/ (singular).
// Keep it working rather than breaking an indexed URL.
write(
  'review/index.html',
  page({
    path: '/review/',
    title: 'This page has moved — Counterwise',
    description:
      'The evidence and review page published in an earlier version of this site has been split into the Decision Room and the Data Room. This notice exists so the old URL keeps working.',
    noindex: true,
    body: `<section class="section"><div class="wrap-narrow prose">
      <p class="eyebrow">Moved</p>
      <h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">This page moved, and was split in two.</h1>
      <p>The earlier “evidence and review” page is now <a href="/decisions/">the Decision Room</a> (suggestions, open questions, rejected options) and <a href="/data-room/">the Data Room</a> (product register, sources, measurement schema, ledger).</p>
      <p>The old address is kept alive so that any existing link still lands somewhere useful. It is marked <code>noindex</code> and its canonical points at the Decision Room.</p>
      <div class="btn-row"><a class="btn" href="/decisions/">Decision Room <span class="arw">→</span></a><a class="btn ghost" href="/data-room/">Data Room</a></div>
    </div></section>`,
  })
);

// --------------------------------------------------- project-site paths
// This repo is published as a GitHub *project* page at /WinB/, not at a domain
// root. Every internal href/src is written absolute ("/reviews/...") because
// that is readable in the generator; here they are rewritten to be relative to
// the page's own depth so the site works at /WinB/ and at a domain root alike.
function relativize(html, depth) {
  const up = '../'.repeat(depth);
  return html.replace(/\b(href|src)="\/([^"]*)"/g, (_m, attr, rest) => {
    if (rest.startsWith('/')) return `${attr}="${rest}"`; // protocol-relative, leave
    const target = rest === '' ? `${up}./` : `${up}${rest}`;
    return `${attr}="${target}"`;
  });
}

// 404.html is served for *any* missing path, at any depth, so relative links
// cannot work there. It gets the explicit site prefix instead.
function prefixed(html) {
  return html.replace(/\b(href|src)="\/([^"]*)"/g, (_m, attr, rest) => {
    if (rest.startsWith('/')) return `${attr}="${rest}"`;
    return `${attr}="${SITE.basePath}/${rest}"`;
  });
}

for (const rel of written) {
  if (!rel.endsWith('.html') || rel === '404.html') continue;
  const full = join(ROOT, rel);
  let html = readFileSync(full, 'utf8');
  if (rel === '404.html') {
    html = prefixed(html);
  } else {
    const depth = rel.split('/').length - 1;      // "reviews/x.html" -> 1
    html = relativize(html, depth);
  }
  writeFileSync(full, html, 'utf8');
}

// ----------------------------------------------------------------- sitemap
const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${xmlEsc(url(r.loc))}</loc>
    <lastmod>${r.lastmod || SITE.buildDate}</lastmod>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.pri}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);

// -------------------------------------------------------------------- feed
const rfc822 = (iso) =>
  new Date(`${iso}T09:00:00Z`).toUTCString().replace('GMT', '+0000');

const feedItems = [
  ...ALL_GUIDES.map((g) => ({
    title: g.title,
    link: url(`/${g.path}`),
    desc: g.summary,
    date: g.published,
    cat: g.kicker,
  })),
  {
    title: 'Five products, and what each one is for',
    link: url('/reviews/'),
    desc: 'Three air fryers and two thermometers that solve different problems, each with the same page structure.',
    date: SITE.buildDate,
    cat: 'Shop',
  },
  {
    title: 'The comparison table, with deliberate blanks',
    link: url('/compare/'),
    desc: 'Five products compared on the fields stable enough to print. Two columns are empty and the reason is written underneath.',
    date: SITE.buildDate,
    cat: 'Shop',
  },
].sort((a, b) => (a.date < b.date ? 1 : -1));

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — new guides and picks</title>
    <link>${url('/')}</link>
    <description>${esc(SITE.tagline)}</description>
    <language>en-us</language>
    <copyright>© ${new Date(SITE.buildDate).getUTCFullYear()} ${esc(SITE.name)}</copyright>
    <lastBuildDate>${rfc822(SITE.buildDate)}</lastBuildDate>
    <atom:link href="${url('/feed.xml')}" rel="self" type="application/rss+xml"/>
${feedItems
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <pubDate>${rfc822(i.date)}</pubDate>
      <category>${esc(i.cat)}</category>
      <description>${esc(i.desc)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
write('feed.xml', rss);

// ------------------------------------------------------------------- robots
write(
  'robots.txt',
  `# Counterwise — https://sassnarep3-star.github.io/WinB/
User-agent: *
Allow: /

# The legacy redirect stub is noindexed; it is listed so crawlers need not fetch it.
Disallow: /review/index.html

# Superseded generations from parallel sessions. Kept and still reachable, but
# excluded from indexing so that exactly one site is indexable on this host.
Disallow: /WinB/docs/
Disallow: /WinB/legacy-docs-site/
Disallow: /WinB/alt-site/
Disallow: /WinB/archive/
Disallow: /WinB/products/
Disallow: /WinB/verification/
Disallow: /WinB/compliance/
Disallow: /WinB/platform/

Sitemap: ${url('/sitemap.xml')}
`
);

// --------------------------------------------------------------------- 404
// Written directly, prefixed with the project path: 404 is served for any
// missing path at any depth, so relative links cannot work there.
writeFileSync(
  join(ROOT, '404.html'),
  prefixed(  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — Counterwise</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="/assets/css/site.css">
</head><body>
<div class="disclosure-strip"><div class="wrap"><strong>${esc(SITE.associateStatement)}</strong></div></div>
<header class="masthead"><div class="wrap"><a class="brand" href="/">counterwise<span>.</span></a></div></header>
<main class="wrap" style="padding:5rem 0;max-width:640px">
  <p class="kicker plain">404</p>
  <h1 style="font-size:clamp(2rem,5vw,3rem)">That page is not here.</h1>
  <p class="lede">It may have moved, or the link may be wrong. The shop, the guides and the registers are all one click away.</p>
  <div class="btn-row">
    <a class="btn" href="/">Front page <span class="arw">→</span></a>
    <a class="btn ghost" href="/reviews/">The five picks</a>
    <a class="btn ghost" href="/guides/">Guides</a>
  </div>
</main>
</body></html>
`)
);

// ----------------------------------------------------------------- favicon
write(
  'assets/img/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1e4034"/>
  <text x="32" y="45" font-family="Georgia, serif" font-size="38" font-weight="600"
    text-anchor="middle" fill="#fbf8f3">c</text>
  <circle cx="46" cy="44" r="4" fill="#b0501e"/>
</svg>
`
);

// -------------------------------------------------------------------- done
writeFileSync(
  join(ROOT, '_build', 'manifest.json'),
  JSON.stringify({ builtAt: new Date().toISOString(), buildDate: SITE.buildDate, files: written, routes }, null, 2),
  'utf8'
);

console.log(`built ${written.length} files`);
console.log(`routes in sitemap: ${routes.length}`);
console.log(`feed items: ${feedItems.length}`);
