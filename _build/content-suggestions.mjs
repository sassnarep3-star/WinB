// content-suggestions.mjs — the register's suggestion ledger at /suggestions/ledger.html.
//
// What this page is, and what it deliberately is not:
//   * The decision board (DQ proposals, blocking questions, owner actions) lives at
//     /suggestions/ — another session's build, untouched here.
//   * Design suggestions, the trend-topic titles and the design prompt live at /direction/.
//   * Operational priorities (SUG-01..08) live in the Decision Room.
//   * THIS page publishes what none of them carries: the register generation's proposal
//     ledger in data/shop/suggestions.json — 28 rows in seven groups (SG-01..SG-30, with
//     SG-25/SG-26 absent exactly as the source omits them), the three coherent business
//     paths, and the empty choice log. Its own generator rendered this content into
//     /decisions/index.html, a route the SHARED_INDEXES guard reserves for the Decision
//     Room, so the content was built but never written to disk (FLG-026).
//
// Rules honoured here, same as every canonical page:
//   * disclosure strip + footer statement come from the page() shell (R1, R13)
//   * no prices, no ratings, no popularity rankings (R3, R15 — A2 §2(b))
//   * no hands-on experience claims (R4, F1)
//   * no measured metrics (R9, R12)
//   * every class used is defined in site.css (R14)

import { readFileSync } from 'node:fs';
import { esc, page, pageHead, table, badge } from './core.mjs';

// The register generation's proposal ledger. Read-only: data/shop/ belongs to the
// register session, and one JSON source keeps two renders from drifting apart.
const SHOP = JSON.parse(
  readFileSync(new URL('../data/shop/suggestions.json', import.meta.url), 'utf8')
);

const SG_COUNT = SHOP.groups.reduce((n, g) => n + g.items.length, 0);

// The three coherent positions, verbatim from the register generator's own
// template (tools/build.cjs), whose copy never reached disk — see FLG-026.
const PATHS = [
  {
    name: 'Path A — The honest shop',
    tag: 'Live now',
    body: 'Publish only what is verifiable. Label every claim. Show no prices until an authorised data route exists. Small, defensible, slow to grow.',
    wins: 'it cannot be penalised for false claims, and it is the only path that can be built entirely from documents.',
    loses: 'it will not out-convert a site that shows prices and ratings, because buyers want numbers.',
  },
  {
    name: 'Path B — Open the data taps',
    tag: 'Recommended',
    body: 'Apply for Product Advertising API access and use SiteStripe. Show price and availability with the required timestamp and disclaimer. Keep every label. Add measurement.',
    wins: "it converts the site's main disadvantage into its main feature — live data with an auditable trail.",
    loses: 'depends on an approval the owner does not control yet.',
    rec: true,
  },
  {
    name: 'Path C — Become a test desk',
    tag: 'Highest ceiling',
    body: 'Buy units, test them, publish protocols and results. Hire nothing; publish the method. This is the only path that justifies the word “reviewed”.',
    wins: 'original data is the one thing a competing site cannot copy.',
    loses: 'it needs spend and time before the first publishable result.',
  },
];

export function suggestionLedgerPage() {
  const pathCards = PATHS.map(
    (p) => `<div class="card${p.rec ? ' rec' : ''}">
  <p class="eyebrow">${esc(p.tag)}</p>
  <h3>${esc(p.name)}</h3>
  <p>${esc(p.body)}</p>
  <p class="tiny"><strong>Why it wins:</strong> ${esc(p.wins)}</p>
  <p class="tiny"><strong>Why it loses:</strong> ${esc(p.loses)}</p>
</div>`
  ).join('\n');

  const sgSections = SHOP.groups
    .map(
      (g) => `<section class="section${g.id === 'G7' ? ' tint' : ''}">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">${esc(g.id)}</p>
      <h2>${esc(g.title)}</h2>
      <p>${esc(g.intro)}</p>
    </div></div>
    ${table({
      head: ['#', 'Suggestion', 'What it fixes', 'Effort', 'Evidence it works', 'Path'],
      rows: g.items.map(
        (s) => `<tr>
<td class="mono tiny">${esc(s.id)}</td>
<td><strong>${esc(s.title)}</strong><br><span class="tiny muted">${esc(s.detail)}</span>${
          s.caveat ? `<br><span class="tiny"><em>${esc(s.caveat)}</em></span>` : ''
        }${s.blockedBy ? `<br><span class="tiny muted">Blocked by: ${esc(s.blockedBy)}</span>` : ''}</td>
<td class="tiny">${esc(s.fixes)}</td>
<td class="tiny">${esc(s.effort)}</td>
<td class="tiny">${esc(s.evidence)}</td>
<td class="tiny">${esc(s.path)}</td>
</tr>`
      ),
    })}
  </div>
</section>`
    )
    .join('\n');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { href: '/suggestions/', label: 'Suggestions' }, { label: 'Ledger' }],
  kicker: 'Oversight',
  title: 'The suggestion ledger',
  lede: 'The register generation’s full proposal table — twenty-eight rows with the three coherent paths and the choice log. Nothing here is implemented until an option is chosen and the log gains a row.',
  meta: `<div class="btn-row">
    ${badge(SG_COUNT + ' register suggestions', 'plain')}
    ${badge('3 paths', 'amber')}
    ${badge('0 implemented', 'green')}
    <a class="btn ghost" href="/suggestions/">Back to the decision board</a>
  </div>`,
})}

<section class="section">
  <div class="wrap-narrow">
    <div class="callout">
      <h4>How this page fits the review surfaces</h4>
      <p>Three suggestion surfaces exist, and each holds a different kind of decision. The <a href="/suggestions/">decision board</a> holds the queued proposals with cost, reversibility and failure mode. <a href="/direction/">Design &amp; trends</a> holds the design suggestions, the topic titles and the design prompt. The <a href="/decisions/">Decision Room</a> holds the operational priorities. This page holds the register generation’s original ledger: what each suggestion fixes, what evidence would show it worked, and which of three coherent business paths it belongs to. Reply anywhere with an ID and an option letter — for example <code>SG-02: B</code> — and the choice is written into the log at the bottom of this page. Until a row appears there, nothing here has been changed.</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Part one</p>
      <h2>Choose a path, not a feature</h2>
      <p>These three are business positions — what the site is willing to show and where its evidence comes from. They differ from the three build-order paths on <a href="/direction/">Design &amp; trends</a>, which decide what gets built first; a site picks one of each. The current build is Path A.</p>
    </div></div>
    <div class="cards c3">${pathCards}</div>
    <div class="callout mt-3">
      <h4>If you only choose once</h4>
      <p><strong>Path B, in this order.</strong> (1) Confirm the Associates account and the tag — nothing else matters until it is done. (2) Run the one-link test and confirm a click appears in the report. (3) Turn on the event endpoint. (4) Apply for API access. Everything else is optimisation in front of those four; doing them in a different order is how sites end up with beautiful pages and no data.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Part two</p>
      <h2>The ledger — ${SG_COUNT} rows in seven groups</h2>
      <p>Rendered from <code>data/shop/suggestions.json</code>, unchanged. Its own generator wrote this content to <code>/decisions/index.html</code>, a route the shared-index guard reserves for the Decision Room, so until this page it was built but never published (FLG-026). Status labels such as “Live” or “Done in this build” describe the register build; its artifacts live under <a href="/register/">/register/</a>, <a href="/verification/">/verification/</a>, <a href="/compliance/">/compliance/</a> and <a href="/platform/">/platform/</a>. Register IDs SG-25 and SG-26 do not exist in the source file — the gap is left visible rather than filled with invented content (FLG-027).</p>
    </div></div>
    <div class="callout">
      <h4>The parallel passes — SG-27 to SG-30</h4>
      <p>The brief’s four parallel rows are group G7 below: navigation labels written in the reader’s words (SG-27), the shipped RSS feed (SG-28), Search Console verification prepared for the owner (SG-29), and reader capture deliberately deferred (SG-30).</p>
    </div>
  </div>
  ${sgSections}
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Choice log</p>
      <h2>Recorded decisions</h2>
      <p>Filled only when an option is chosen. Empty by design until then — an empty log is the evidence that nothing here has been implemented quietly.</p>
    </div></div>
    ${table({
      head: ['Suggestion', 'Option chosen', 'Date (UTC)', 'Expected evidence', 'Review by'],
      rows: [
        '<tr><td colspan="5" class="tiny muted" style="text-align:center">No choices recorded yet. Reply with an ID and an option letter to add the first row.</td></tr>',
      ],
      note: 'When a row is added here, the corresponding change ships in the same pull request — never before.',
    })}
    <div class="callout mt-3">
      <h4>Standing rules for anything chosen from this page</h4>
      <p>Every implementation must keep the disclosure strip above the masthead on every page; keep <code>rel="sponsored nofollow noopener"</code> and the tag on every Amazon link; show no price, rating or popularity ranking; state what it could not verify; and pass every build gate (verify, editorial rules, register check, link check, smoke) before it merges. A suggestion that cannot keep those is rejected here, in writing, with its source.</p>
    </div>
    <p class="tiny faint mt-3">No search-volume, popularity or superiority claim is made anywhere on this page: no keyword tool was consulted, and every row is a proposal, not a measurement. Sources for the rules above: <a href="https://affiliate-program.amazon.com/help/operating/policies" rel="noopener" target="_blank">Associates Program Policies</a> · <a href="https://affiliate-program.amazon.com/help/operating/agreement" rel="noopener" target="_blank">Operating Agreement</a> · <a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" rel="noopener" target="_blank">FTC Disclosures 101</a> · <a href="https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links" rel="noopener" target="_blank">Google: qualify outbound links</a>.</p>
  </div>
</section>`;

  return page({
    path: '/suggestions/ledger.html',
    title: 'The suggestion ledger — 28 register proposals, three paths, one empty log | Counterwise',
    description:
      'The register generation’s full suggestion ledger: twenty-eight rows in seven groups including the SG-27 to SG-30 parallel passes, the three coherent business paths, and a choice log that stays empty until something is chosen.',
    body,
  });
}
