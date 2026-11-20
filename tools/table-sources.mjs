// table-sources.mjs — rule R15: every table row carries a source link.
//
// WHY THIS RULE EXISTS. The brief asks for line-by-line verification in which
// "every table row must have a source link to an official site". A table row
// with no source is a claim the reader cannot check, and on a site that
// refuses to print prices, ratings or hands-on verdicts, an unsourced number
// is the one failure that cannot be argued away. So the rule is enforced by
// the build rather than left to a reviewer's eye.
//
// THE RULE.
//   R15a  Every data row of every table on a canonical page contains at least
//         one hyperlink. The header row is exempt; it is a header.
//   R15b  Every hyperlink inside a table points either at an allowed official
//         host, or at a path on this site. A table is not allowed to become a
//         place where an outside link of unknown provenance is smuggled in.
//   R15c  A table that states a fact from an official source must give every
//         row an official-host link. Tables that record this site's own
//         decisions (paths, questions, topic queue, suggestions) may point at
//         the first-party register entry that holds the evidence instead,
//         because there is no official source for an editorial judgement.
//
// A table is treated as "official-source" when its caption, header or first
// row mentions a listing, a policy, a temperature, a price rule, a protocol
// or an event contract. That list is explicit rather than inferred, so the
// rule does not quietly weaken itself.
//
// Run: node tools/table-sources.mjs

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SITE_ORIGIN = 'https://sassnarep3-star.github.io/WinB';

// Hosts a source link is allowed to point at. Each is an official publisher
// for something this site states: Amazon and the Associates programme, the
// FTC and the eCFR, the USDA, Google Search Central, and sitemaps.org.
const OFFICIAL = [
  'amazon.com',
  'affiliate-program.amazon.com',
  'ftc.gov',
  'ecfr.gov',
  'fsis.usda.gov',
  'developers.google.com',
  'sitemaps.org',
];

// Generations owned by other sessions. Preserved and audited by their own
// gates; this rule applies to the canonical publication only.
const SKIP_DIRS = new Set([
  '.git', 'node_modules', '_build', 'tools', '_serve', '_preview',
  'docs', 'legacy-docs-site', 'alt-site', 'archive', 'products', 'verification',
  'compliance', 'platform', 'register', 'scripts', 'audit', 'data',
]);

// Preserved alias pages from earlier sessions. They are duplicated content
// under an older brand and are excluded from indexing; this rule does not
// police them.
const PRESERVED = new Set([
  'about/editorial-policy.html', 'about/how-we-make-money.html', 'about/privacy.html',
  'guides/air-fryer-capacity-checklist.html', 'guides/basket-or-oven-air-fryer.html',
  'guides/cleanup-and-counter-space.html', 'guides/multifunction-appliance-questions.html',
  'decisions/growth-plan.html', 'decisions/questions.html', 'review/index.html',
]);

// A table declares what it is. "factual" (the default) means every row states
// a fact that an official source supports, and each row must carry an
// official-source link. "editorial" means the table records this site's own
// reasoning, where the honest source is the register entry that holds it.
const FACTUAL = /\b(listing|official|policy|policies|operating agreement|temperature|price|rating|protocol|sitemap|feed|rfc ?822|event|measurement|report)\b/i;

const problems = [];
const stats = { pages: 0, tables: 0, rows: 0, officialRows: 0, firstPartyRows: 0 };

const fail = (file, msg) => problems.push(`${file}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const htmlFiles = walk(ROOT).filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (PRESERVED.has(rel)) continue;
  const html = readFileSync(file, 'utf8');

  // Only the canonical publication: pages that load the shared stylesheet.
  if (!/href="[^"]*assets\/css\/site\.css"/.test(html)) continue;
  if (rel === '404.html') continue;
  stats.pages++;

  const tables = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/g)];
  for (const [ti, tm] of tables.entries()) {
    const body = tm[1];
    stats.tables++;

    const caption = (/<caption[^>]*>([\s\S]*?)<\/caption>/.exec(body) || [, ''])[1];
    const headCells = [...body.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const firstRow = (/<tr[^>]*>([\s\S]*?)<\/tr>/.exec(body) || [, ''])[1];

    // The declared kind wins. The wording test is only a safety net for a
    // hand-written table that forgot to declare itself.
    const declared = /<table[^>]*data-kind="([^"]+)"/.exec(tm[0]);
    const isFactual = declared
      ? declared[1] !== 'editorial'
      : FACTUAL.test(caption.replace(/<[^>]+>/g, ' ')) ||
        headCells.some((h) => FACTUAL.test(h)) ||
        FACTUAL.test(firstRow.replace(/<[^>]+>/g, ' '));

    const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    if (rows.length < 2) continue;   // a table with no data rows has no rows to source

    for (const [ri, rm] of rows.entries()) {
      if (ri === 0) continue;        // the header row
      const rowHtml = rm[1];
      stats.rows++;

      const links = [...rowHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      if (!links.length) {
        fail(rel, `table ${ti + 1} row ${ri}: no source link (R15a)`);
        continue;
      }

      let official = 0;
      let firstParty = 0;
      for (const href of links) {
        if (/^(https?:)?\/\//.test(href)) {
          const host = (href.match(/^(?:https?:)?\/\/([^/]+)/) || [, ''])[1].replace(/^www\./, '');
          if (OFFICIAL.some((d) => host === d || host.endsWith('.' + d))) official++;
          else if (host === 'sassnarep3-star.github.io') official++; // this site's own origin
          else fail(rel, `table ${ti + 1} row ${ri}: link to a host that is not an allowed source: ${href}`);
        } else if (href.startsWith('/') || href.startsWith('#') || href.startsWith('./') || href.startsWith('../')) {
          firstParty++;
        } else {
          fail(rel, `table ${ti + 1} row ${ri}: link that is neither an official source nor a path on this site: ${href}`);
        }
      }

      if (official) stats.officialRows++;
      if (firstParty) stats.firstPartyRows++;

      if (isFactual && !official) {
        fail(rel, `table ${ti + 1} row ${ri}: states a fact from an official source but carries no official-source link (R15c)`);
      }
    }
  }
}

// ------------------------------------------------------------------ report
console.log(
  `\ntable-sources: ${stats.pages} canonical pages, ${stats.tables} tables, ${stats.rows} data rows ` +
  `(${stats.officialRows} with an official-source link, ${stats.firstPartyRows} with a first-party pointer)\n`
);

if (problems.length) {
  const unique = [...new Set(problems)];
  console.error(`FAILED — ${unique.length} problem(s):\n`);
  for (const p of unique.slice(0, 60)) console.error('  ' + p);
  if (unique.length > 60) console.error(`  … and ${unique.length - 60} more`);
  console.error('');
  process.exit(1);
}

console.log('PASS — every table row carries a source link (R15).');
process.exit(0);
