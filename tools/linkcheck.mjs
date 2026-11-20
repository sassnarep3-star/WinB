// linkcheck.mjs — crawls every generated page from the root and asserts that
// the whole site is reachable and nothing dangles. Also validates the XML.
// Deliberately local: it does not hit the network, so it can gate a deploy.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// Every entry point that must work, including pages written by earlier
// sessions that this build preserved (aliases) and the /go/ exit pages.
const SEEDS = [
  'index.html',
  'go/chef-iq-sense-gen3.html', 'go/chefman-6-quart-dual-basket.html',
  'go/chefman-8-quart-turbofry.html', 'go/emeril-lagasse-26qt-french-door.html',
  'go/thermomaven-1-second-thermometer.html',
  'guides/air-fryer-capacity-checklist.html', 'guides/basket-or-oven-air-fryer.html',
  'guides/cleanup-and-counter-space.html', 'guides/multifunction-appliance-questions.html',
  'about/editorial-policy.html', 'about/how-we-make-money.html', 'about/privacy.html',
  'decisions/growth-plan.html', 'decisions/questions.html',
];

const seen = new Set();
const queue = [...SEEDS];
const broken = [];
const external = new Set();
let checked = 0;

function resolve(fromRel, href) {
  if (/^(mailto:|tel:|javascript:|#)/.test(href)) return null;
  if (/^https?:\/\//.test(href)) {
    try {
      const u = new URL(href);
      if (u.host === 'sassnarep3-star.github.io') {
        const p = u.pathname.replace(/^\/WinB/, '') || '/';
        return p;
      }
    } catch { /* ignore */ }
    external.add(href);
    return null;
  }
  // project-path links written by earlier sessions
  if (href.startsWith('/WinB/')) return posix.normalize(href.slice('/WinB'.length) || '/');
  // relative or site-root, resolved against the page's own directory and
  // normalised so "./" and "../" never accumulate into an infinite crawl.
  if (href.startsWith('/')) return posix.normalize(href);
  const dir = fromRel.includes('/') ? fromRel.slice(0, fromRel.lastIndexOf('/') + 1) : '';
  return posix.normalize('/' + dir + href);
}

function fileFor(p) {
  let clean = p.split('#')[0].split('?')[0];
  clean = clean.replace(/^\/+/, '');
  const full = join(ROOT, clean);
  const candidates = [full, join(full, 'index.html'), `${full}.html`];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

while (queue.length) {
  const rel = queue.shift();
  if (seen.has(rel)) continue;
  seen.add(rel);

  const file = fileFor('/' + rel);
  if (!file) { broken.push({ from: '(seed)', href: rel }); continue; }
  checked++;

  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const raw of hrefs) {
    const target = resolve(rel, raw);
    if (!target) continue;
    let norm = target.replace(/^\/+/, '');
    if (norm === '' || norm.endsWith('/')) norm += 'index.html';
    const asRel = norm;
    if (!fileFor('/' + asRel)) {
      broken.push({ from: rel, href: raw });
    } else if (!seen.has(asRel) && asRel.endsWith('.html')) {
      queue.push(asRel);
    }
  }
}

// ------------------------------------------------------------------- XML
function xmlWellFormed(label, text) {
  const errs = [];
  // Balanced-tag check with a tiny stack; ignores declarations, comments, CDATA.
  const body = text
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  const re = /<\/?([A-Za-z0-9:_-]+)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  const stack = [];
  let m;
  while ((m = re.exec(body))) {
    const [whole, name, , selfClose] = m;
    if (whole.startsWith('</')) {
      const top = stack.pop();
      if (top !== name) errs.push(`close </${name}> does not match <${top}>`);
    } else if (!selfClose && !whole.startsWith('<?')) {
      stack.push(name);
    }
  }
  if (stack.length) errs.push(`unclosed: ${stack.join(', ')}`);
  const amp = (body.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g) || []).length;
  if (amp) errs.push(`${amp} unescaped ampersand(s)`);

  console.log(`${errs.length ? 'FAIL' : 'OK  '}  ${label}` + (errs.length ? `\n      ${errs.join('\n      ')}` : ''));
  return errs.length === 0;
}

console.log(`\nlinkcheck: crawled from / — ${checked} HTML files, ${external.size} distinct external URLs\n`);
for (const u of [...external].sort()) console.log(`  ext  ${u}`);

const xmlOk = [
  xmlWellFormed('sitemap.xml', readFileSync(join(ROOT, 'sitemap.xml'), 'utf8')),
  xmlWellFormed('feed.xml', readFileSync(join(ROOT, 'feed.xml'), 'utf8')),
].every(Boolean);

// Required root artefacts for GitHub Pages.
const required = [
  'index.html', '404.html', 'sitemap.xml', 'feed.xml', 'robots.txt', '.nojekyll',
  'assets/css/site.css', 'assets/js/site.js',
];
const missing = required.filter((f) => !existsSync(join(ROOT, f)));
if (missing.length) console.log(`\nMISSING required artefacts: ${missing.join(', ')}`);

if (broken.length) {
  console.log(`\nBROKEN LINKS (${broken.length}):`);
  for (const b of broken) console.log(`  ${b.from}  ->  ${b.href}`);
}

const ok = !broken.length && xmlOk && !missing.length;
console.log(`\n${ok ? 'PASS' : 'FAIL'} — ${checked} files crawled, ${broken.length} broken links, XML ${xmlOk ? 'valid' : 'invalid'}${missing.length ? `, ${missing.length} missing artefacts` : ''}.`);
process.exit(ok ? 0 : 1);
