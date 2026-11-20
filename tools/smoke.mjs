// smoke.mjs — fetches every page over real HTTP from the *deployed path shape*
// (/WinB/) and asserts status + that every linked asset also returns 200.
// This is the check that catches the classic project-site failure: a page that
// renders from the filesystem but 404s every stylesheet once hosted.
//
//   BASE=http://localhost:3001 node tools/smoke.mjs

const BASE = process.env.BASE || 'http://localhost:3001/WinB';

const seen = new Set();
const broken = [];
let pages = 0, assets = 0;

function get(u) {
  return fetch(u, { redirect: 'follow' });
}

const seeds = [
  `${BASE}/`, `${BASE}/air-fryers/`, `${BASE}/thermometers/`, `${BASE}/reviews/`,
  `${BASE}/compare/`, `${BASE}/guides/`, `${BASE}/decisions/`, `${BASE}/data-room/`,
  `${BASE}/flagged/`, `${BASE}/methods/`, `${BASE}/about/`, `${BASE}/privacy/`,
  `${BASE}/executive-summary/`, `${BASE}/review/`, `${BASE}/suggestions/`,
  `${BASE}/reviews/chefman-6qt-dual-basket.html`,
  `${BASE}/reviews/chefman-8qt-turbofry.html`,
  `${BASE}/reviews/emeril-26qt-french-door.html`,
  `${BASE}/reviews/thermomaven-1s-thermometer.html`,
  `${BASE}/reviews/chef-iq-sense-gen3.html`,
  `${BASE}/guides/basket-or-oven.html`, `${BASE}/guides/capacity-checklist.html`,
  `${BASE}/guides/cleanup-counter.html`, `${BASE}/guides/multifunction.html`,
  `${BASE}/guides/temperature-safety.html`,
  /* S15 (session 30073780): new guides + worksheets */
  `${BASE}/guides/holiday-roast-thermometer.html`, `${BASE}/guides/game-day-wings.html`,
  `${BASE}/guides/air-fryer-leftovers.html`,
  `${BASE}/tools/`, `${BASE}/tools/capacity-worksheet.html`,
  `${BASE}/tools/cleanup-worksheet.html`, `${BASE}/tools/thermometer-calibration.html`,
];

for (const s of seeds) {
  const res = await get(s);
  pages++;
  if (res.status !== 200) { broken.push(`${res.status}  ${s}`); continue; }
  const html = await res.text();

  // collect internal href/src on this page and resolve them against its URL
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(raw)) continue;
    let u;
    try { u = new URL(raw, s).href; } catch { continue; }
    if (!u.startsWith(BASE)) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    const r = await get(u);
    if (r.status !== 200) broken.push(`${r.status}  ${u}   (linked from ${s})`);
  }
}

assets = seen.size;
console.log(`smoke: ${pages} pages, ${assets} linked assets/urls`);
if (broken.length) {
  console.log(`\nBROKEN (${broken.length}):`);
  for (const b of broken) console.log('  ' + b);
  process.exit(1);
}
console.log(`PASS — every page and every linked asset returned 200 under ${BASE}`);
