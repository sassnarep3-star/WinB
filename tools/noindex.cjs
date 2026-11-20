#!/usr/bin/env node
/**
 * Marks every non-canonical HTML surface as noindex.
 *
 * Rationale: the repository now contains three site generations (this one at the root, plus
 * docs/, alt-site/ and archive/). Only ONE of them should be a search result. Everything else is
 * kept for review but tells crawlers not to index it, which resolves the duplicate-content problem
 * without deleting another session's work.
 *
 * Idempotent: running it twice does not double-inject.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ROOTS = ['docs', 'alt-site', 'archive', 'legacy-docs-site'];
const ROBOTS = '<meta name="robots" content="noindex,follow">';

let touched = 0;
let skipped = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.html')) patch(full);
  }
}

function patch(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) {
    skipped++;
    return;
  }
  const headIdx = html.search(/<head[^>]*>/i);
  if (headIdx === -1) {
    skipped++;
    return;
  }
  const insertAt = html.indexOf('>', headIdx) + 1;
  html = html.slice(0, insertAt) + '\n' + ROBOTS + html.slice(insertAt);
  fs.writeFileSync(file, html);
  touched++;
}

ROOTS.forEach((r) => walk(path.join(ROOT, r)));

/* robots.txt for the archives too, as a second line of defence */
const archiveRobots = 'User-agent: *\nDisallow: /\n\n# Archived or alternate site generation. The canonical site is at https://sassnarep3-star.github.io/WinB/\n';
for (const r of ROOTS.filter((x) => x !== 'archive')) {
  const p = path.join(ROOT, r, 'robots.txt');
  if (fs.existsSync(p) && !fs.readFileSync(p, 'utf8').includes('Disallow: /')) {
    fs.writeFileSync(p, archiveRobots);
    console.log(`rewrote ${r}/robots.txt to disallow crawling`);
  }
}

console.log(`noindex: ${touched} file(s) marked, ${skipped} already marked or non-HTML`);
