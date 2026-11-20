// build-editorial.mjs — regenerate only the reader-facing pages this session owns.
//
// Why this exists instead of using build.mjs: the canonical build.mjs also
// writes sitemap.xml, feed.xml, robots.txt and 404.html, and tools/build.cjs
// regenerates the parallel register surfaces. Other sessions hold those files
// in open pull requests, so touching them here would create a merge conflict on
// files this session has no business changing.
//
// What it does write: the front page, the two category hubs, the reviews index,
// the five product pages, the comparison page, the guides index and the five
// guides, and the suggestions room. That is exactly the reader-facing site.
//
// Run with: node _build/build-editorial.mjs

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SITE, GUIDES } from './data.mjs';
import { ART, frontPage, categoryPage, productPage, comparePage, guidePage, guidesIndex, reviewsIndex } from './editorial.mjs';
// `_build/suggestions.mjs` was removed on 2026-11-20: two parallel sessions were
// generating /suggestions/ from two different modules, and the merged one
// (_build/content-oversight.mjs) was kept because it was already gated and linked
// from the footer. This script imported the deleted module, so it failed at link
// time with ERR_MODULE_NOT_FOUND — reported by session arena-c17764af while
// integrating. The import is replaced by a stub that refuses to run, because this
// file would otherwise rewrite the canonical front page, sitemap and feed from an
// older generation: neither `npm run build` nor CI calls it, and it is kept here
// for the record. Do not restore the import and do not wire this into the build.
const suggestionsPage = () => {
  throw new Error(
    '_build/build-editorial.mjs is a retired generator. /suggestions/ is built by ' +
    '_build/content-oversight.mjs and the front page by _build/editorial.mjs; running ' +
    'this script would overwrite both from a superseded generation.'
  );
};
import { PRODUCTS } from './data.mjs';

// ---------------------------------------------------------------------------
// RETIRED — this module writes pages. It is kept for the record, not run.
//
// Before this guard, executing the file rewrote three live canonical pages and
// then died with ERR_MODULE_NOT_FOUND on a deleted import, which leaves the
// repository half-overwritten by a superseded generation. Verified 2026-11-20:
// `node _build/build-editorial.mjs` modified air-fryers/index.html,
// compare/index.html and guides/basket-or-oven.html, and nothing else in the
// build references it (no `npm run build` step, no CI step).
//
// The canonical front page comes from _build/editorial.mjs via _build/build.mjs;
// /suggestions/ comes from _build/content-oversight.mjs. Opt in by name only if
// you are deliberately reviving this generation, and rebuild + re-gate after.
if (process.env.COUNTERWISE_REVIVE_EDITORIAL_BUILD !== '1') {
  console.error(
    'build-editorial: retired generator, refusing to write. This tree publishes\n' +
    'the canonical site from _build/build.mjs (front page via _build/editorial.mjs)\n' +
    'and /suggestions/ from _build/content-oversight.mjs. Set\n' +
    'COUNTERWISE_REVIVE_EDITORIAL_BUILD=1 only to revive this generation on purpose.'
  );
  process.exit(1);
}

const ROOT = new URL('..', import.meta.url).pathname;
const written = [];

function write(rel, html) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, 'utf8');
  written.push(rel);
}

// ------------------------------------------------------------------- pages
write('index.html', frontPage());
for (const slug of ['air-fryers', 'thermometers']) write(`${slug}/index.html`, categoryPage(slug));
write('reviews/index.html', reviewsIndex());
for (const p of PRODUCTS) write(`reviews/${p.slug}.html`, productPage(p));
write('compare/index.html', comparePage());
write('guides/index.html', guidesIndex());
for (const g of GUIDES) write(g.path, guidePage(g));
write('suggestions/index.html', suggestionsPage());

// ------------------------------------------------------- project-site paths
// This repository publishes as a GitHub *project* page at /WinB/, not at a
// domain root. Every internal href/src is authored absolute ("/reviews/...")
// because that is readable in the generator; here they are rewritten relative
// to each page's own depth so the site works both at /WinB/ and at a root.
function relativize(html, depth) {
  const up = '../'.repeat(depth);
  return html.replace(/\b(href|src)="\/([^"]*)"/g, (_m, attr, rest) => {
    if (rest.startsWith('/')) return `${attr}="${rest}"`; // protocol-relative
    const target = rest === '' ? `${up}./` : `${up}${rest}`;
    return `${attr}="${target}"`;
  });
}

for (const rel of written) {
  const full = join(ROOT, rel);
  const depth = rel.split('/').length - 1; // "reviews/x.html" -> 1
  writeFileSync(full, relativize(readFileSync(full, 'utf8'), depth), 'utf8');
}

// ------------------------------------------------------------------- checks
// Fail loudly rather than shipping a page that points at an image that is not
// there. Every ART path and every product image must exist on disk.
const mustExist = [
  ...Object.values(ART),
  '/assets/css/site.css',
  '/assets/js/site.js',
];
const missing = mustExist.filter((p) => !existsSync(join(ROOT, p.replace(/^\//, ''))));
if (missing.length) {
  console.error('build-editorial: missing assets referenced by the build:');
  for (const m of missing) console.error('  ' + m);
  process.exit(1);
}

// The OG image must be a real file, not a promise: og:image pointing at a
// 404 is a silent findability defect (FLG-012 in this session's log).
const homeHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
const og = homeHtml.match(/<meta property="og:image" content="([^"]+)"/);
if (og) {
  const rel = og[1].replace(SITE.origin + '/', '').replace(/^\//, '');
  if (!existsSync(join(ROOT, rel))) {
    console.error(`build-editorial: og:image points at a file that does not exist: ${og[1]}`);
    process.exit(1);
  }
}

console.log(`build-editorial: wrote ${written.length} pages`);
console.log(`  ${written.slice(0, 6).join('\n  ')}`);
console.log(`  … and ${Math.max(0, written.length - 6)} more`);
