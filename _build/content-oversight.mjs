// content-oversight.mjs — the reviewable surfaces. These are reachable from the
// footer and from a single "More" group in the nav, never from the hero.
// The front page sells; these pages account for themselves.

import { SITE, SOURCES, PRODUCTS, EVENTS, LEDGER, FLAGS, QUESTIONS, SUGGESTIONS, GUIDES, MOMENTS, TOPIC_QUEUE, PATHS } from './data.mjs';
import { esc, url, page, pageHead, table, badge, srcLink, blank, amazonLink } from './core.mjs';
import { DECISION_QUEUE, BLOCKING_QUESTIONS, OWNER_ACTIONS } from './decision-queue.mjs';

// ------------------------------------------------------------- decision room
export function decisionsPage() {
  const open = SUGGESTIONS.filter((s) => s.status !== 'Implemented');
  const done = SUGGESTIONS.filter((s) => s.status === 'Implemented');

  const card = (s) => `
<article class="dec" id="${esc(s.id)}">
  <div class="dh">
    <span class="pri">P${s.priority}</span>
    <h3>${esc(s.title)}</h3>
    ${badge(s.status, s.status === 'Implemented' ? 'green' : s.status.startsWith('Blocked') || s.status.includes('access') ? 'amber' : 'plain')}
  </div>
  <div class="rec"><b>Recommendation</b>${esc(s.recommendation)}</div>
  <dl>
    <dt>Why it matters</dt><dd>${esc(s.why)}</dd>
    <dt>Effort</dt><dd>${esc(s.effort)}</dd>
    <dt>Payoff</dt><dd>${esc(s.payoff)}</dd>
    <dt>Risk</dt><dd>${esc(s.risk)}</dd>
  </dl>
</article>`;

  const qRow = (q) => `<tr>
    <td class="mono tiny">${esc(q.id)}</td>
    <td>${badge(q.status, q.status === 'Answered' ? 'green' : q.status === 'Blocked' ? 'red' : 'amber')}</td>
    <td><b>${esc(q.question)}</b><br><span class="tiny muted">${esc(q.why)}</span></td>
    <td class="tiny">${esc(q.known)}</td>
    <td class="tiny">${esc(q.unknown)}</td>
    <td class="tiny">${esc(q.howToFind)}</td>
  </tr>`;

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Decision Room' }],
  kicker: 'Oversight',
  title: 'Decision Room',
  lede: 'Everything this project could do next, what is known, what is missing, and the smallest action that would resolve each open question. Nothing on this page is implemented unless it says so.',
  meta: `<div class="btn-row">
    <a class="btn small" href="/suggestions/">Open the suggestions room <span class="arw">→</span></a>
    ${badge(open.length + ' open suggestions', 'amber')}
    ${badge(done.length + ' already built', 'green')}
    ${badge(QUESTIONS.filter((q) => q.status !== 'Answered').length + ' open questions', 'plain')}
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Choose first</p>
        <h2>Three paths — pick one before anything is implemented</h2>
        <p>Each path is a coherent bet. Mixing them is how a site ends up with seasonal guides, no measurement and no byline. The desk recommends <b>Path B first, Path C in parallel</b>: the publication polish is already built, and the measurement endpoint is the only thing standing between instinct and data.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Three coherent paths.</b> Choose one; the suggestions below are ordered to serve it.</caption>
        <thead><tr><th scope="col">Path</th><th scope="col">Promise</th><th scope="col">First steps</th><th scope="col">Cost</th><th scope="col">Best if</th></tr></thead>
        <tbody>${PATHS.map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.promise)}</td><td>${esc(p.steps)}</td><td>${esc(p.cost)}</td><td>${esc(p.bestIf)}</td></tr>`).join('\n')}</tbody>
      </table>
    </div>
    <p class="tiny faint mt-2">Paths are editorial recommendations, not factual claims. The policy constraints they respect are cited in the suggestions below: disclosure ${srcLink('A1', 'A1 §5')}, tag and price rules ${srcLink('A2', 'A2 §2(b)')}, no untried-experience claims ${srcLink('F1', 'F1')}, sponsored marking ${srcLink('G1', 'G1')}, cadence and authorship ${srcLink('G2', 'G2')}.</p>
    <div class="callout mt-3">
      <h4>How to choose</h4>
      <p>Answer three questions in order: (1) Is the tagging question closed (SUG-02)? If not, stop and close it — no path earns anything until then. (2) Does the owner want a named byline (Q-05)? If yes, Path B. (3) Is the analytics endpoint deployed (SUG-03)? If not, Path C is the next task regardless of the path chosen. Record the choice here with a date; the next session reads it before writing anything.</p>
    </div>
  </div>
</section>

<section class="section tint" id="queue">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Seasonal notebook</p>
        <h2>Topic queue — hypotheses, not promises</h2>
        <p>Working titles only. Nothing here is published until its gate has run and the owner has chosen one title. No title is a claim about search volume, popularity or sales.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${TOPIC_QUEUE.length} queued topics.</b> Each row states the measurement gate that must pass first.</caption>
        <thead><tr><th scope="col">Working title</th><th scope="col">Cluster</th><th scope="col">Gate</th><th scope="col">Status</th></tr></thead>
        <tbody>${TOPIC_QUEUE.map((t) => `<tr><td><b>${esc(t.title)}</b></td><td>${esc(t.cluster)}</td><td class="tiny">${esc(t.gate)}</td><td>${badge(t.status, t.status.startsWith('Published') ? 'green' : 'amber')}</td></tr>`).join('\n')}</tbody>
      </table>
    </div>
    <div class="table-wrap mt-3">
      <table>
        <caption><b>Four cooking moments.</b> Editorial hypotheses that reframe existing guides. See the front page for the reader-facing version.</caption>
        <thead><tr><th scope="col">Moment</th><th scope="col">Season</th><th scope="col">Question</th><th scope="col">Guides</th><th scope="col">Products</th></tr></thead>
        <tbody>${MOMENTS.map((m) => `<tr><td><b>${esc(m.title)}</b><br><span class="tiny muted">${esc(m.note)}</span></td><td>${esc(m.season)}</td><td class="tiny">${esc(m.question)}</td><td class="tiny">${m.guides.map((g) => `<a href="/guides/${esc(g)}.html">${esc(g)}</a>`).join(', ')}</td><td class="tiny">${esc(m.products.join(', '))}</td></tr>`).join('\n')}</tbody>
      </table>
    </div>
    <p class="tiny faint mt-2">Moments and queue rows are hypotheses. The guides they reframe cite ${srcLink('A2', 'A2')} and ${srcLink('U1', 'U1')}; the cadence gate cites ${srcLink('G2', 'G2 scaled content')}. No row is a popularity, search-volume or sales claim.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>Suggestions, in the order they should be reviewed</h2>
        <p>Priority 1 means “do this before writing another word”. Every item states its risk, because a recommendation without a failure mode is marketing.</p>
      </div>
    </div>
    ${open.map(card).join('\n')}

    <h3 class="mt-4" style="font-size:1.15rem">Already built in this version</h3>
    ${done.map(card).join('\n')}
  </div>
</section>

<section class="section tint" id="questions">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Part two</p>
        <h2>The questions that must be answered before a decision</h2>
        <p>Each row separates what is <b>known</b> from what is <b>unknown</b>, and names the cheapest way to find out. Rows marked Answered are decisions already made and implemented.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${QUESTIONS.length} questions.</b> ${QUESTIONS.filter((q) => q.status === 'Answered').length} answered, ${QUESTIONS.filter((q) => q.status !== 'Answered').length} still need information.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Status</th><th scope="col">Question</th>
          <th scope="col">What is known</th><th scope="col">What is missing</th><th scope="col">How to find out</th>
        </tr></thead>
        <tbody>${QUESTIONS.map(qRow).join('\n')}</tbody>
      </table>
    </div>
    <div class="callout mt-3">
      <h4>The pattern in the open questions</h4>
      <p>Most open items need something only the owner has: dashboard access, a decision about identity, or money. That is not a research failure — it is the boundary of what a session without account access can settle. Where the answer is a check anyone with the login could do in ten minutes, the question says so and gives the steps.</p>
    </div>
    <div class="table-wrap mt-3">
      <table>
        <caption><b>Missing-information discovery plan.</b> What to ask, where to find it, how long it takes, and what it unblocks. Every row is an owner action; nothing here can be answered from the sandbox.</caption>
        <thead><tr><th scope="col">Ask</th><th scope="col">Where to find it</th><th scope="col">Time</th><th scope="col">Unblocks</th></tr></thead>
        <tbody>
          <tr><td>Confirm the five intended ASINs (FLG-002)</td><td>Owner’s Associates dashboard or the order in which the links were minted</td><td>10 minutes</td><td>Closing FLG-001 cleanly</td></tr>
          <tr><td>Mint one tagged link and compare (SUG-02)</td><td>Associates Central → SiteStripe / Get Links</td><td>Under an hour</td><td>Revenue attribution</td></tr>
          <tr><td>Deploy the collector (SUG-03)</td><td>analytics/collector-worker.js → any worker host; set ENDPOINT in assets/js/site.js</td><td>Half a day</td><td>All measurement, the ledger, topic choice</td></tr>
          <tr><td>Submit sitemap + Search Console (SUG-13)</td><td>Search Console → Sitemaps → sitemap.xml</td><td>Under an hour</td><td>Indexing, measured queries</td></tr>
          <tr><td>Choose byline, contact route, domain (Q-05, Q-07, Q-13)</td><td>Owner decision; then one template change</td><td>One conversation</td><td>Trust, corrections, brand</td></tr>
          <tr><td>Ask brands for review units + licensed images (SUG-01, Q-14)</td><td>Two brand contact emails; publish the reply either way</td><td>One week of waiting</td><td>Hands-on content, photography</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Part three</p>
        <h2>What was considered and rejected</h2>
        <p>Recorded so the next session does not re-litigate it.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Rejected options and the reason.</b> Each rejection cites an official source.</caption>
        <thead><tr><th scope="col">Option</th><th scope="col">Why not</th><th scope="col">Source</th></tr></thead>
        <tbody>
          <tr><td>Show live prices in the comparison table</td><td>Permitted only when Amazon serves the link with that data or the data comes via Creators API / PA API. This build has neither.</td><td class="src">${srcLink('A2', 'A2 §2(b)')}</td></tr>
          <tr><td>Show star ratings from the listing</td><td>Same rule as prices, and the rating is Amazon’s content, not this site’s endorsement.</td><td class="src">${srcLink('A2', 'A2 §2(b)')}</td></tr>
          <tr><td>Write “we tested” in the guides</td><td>The desk has not handled any of the five products. FTC guidance forbids describing experience with a product you have not tried.</td><td class="src">${srcLink('F1')}</td></tr>
          <tr><td>Publish 40 articles at once to “get indexed”</td><td>Bulk near-identical generation is the definition of scaled content abuse.</td><td class="src">${srcLink('G2', 'G2 scaled content')}</td></tr>
          <tr><td>Use the supplied short links directly as money links</td><td>The resolved URLs carry no Associate tag, so clicks could not be confirmed to credit this account. Tagged canonical links are used instead until FLG-001 is closed.</td><td class="src">${srcLink('A2', 'A2 §2(b)')}</td></tr>
          <tr><td>Add Google Analytics for “real” numbers</td><td>Adds a third-party tracker and a cookie banner for data this site cannot act on yet. A first-party endpoint records the five events that matter without identifying anyone.</td><td class="src">${srcLink('A2', 'A2 §3(e)')}</td></tr>
          <tr><td>Expand into coffee, blenders and sous vide immediately</td><td>Five products in two adjacent categories is a coherent shop. Twelve scattered ones is a directory, and topical depth is the cheapest authority a new site has.</td><td class="src">${srcLink('G2', 'G2 site reputation')}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`;

  return page({
    path: '/decisions/',
    title: 'Decision Room — suggestions, questions and rejected options | Counterwise',
    description:
      'Reviewable suggestions ranked by priority, open questions separated into known and unknown, and the options this project rejected with sources.',
    body,
  });
}

// ----------------------------------------------------------------- data room
export function dataRoom() {
  const productRows = PRODUCTS.map(
    (p) => `<tr>
      <td class="mono tiny">${esc(p.id)}</td>
      <td><b>${esc(p.brand)}</b><br><span class="tiny muted">${esc(p.shortName)}</span></td>
      <td class="mono tiny">${esc(p.suppliedLink)}</td>
      <td>${blank('Owner has not confirmed')}</td>
      <td class="mono tiny">${esc(p.asin)}</td>
      <td class="mono tiny" style="max-width:300px;word-break:break-all">${esc(p.observedRedirect)}</td>
      <td class="nowrap">${esc(p.confirmationDate)}</td>
      <td class="src"><a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon listing</a><br><a href="${SOURCES[p.source].url}" rel="noopener" target="_blank">${esc(p.source)}</a></td>
    </tr>`
  ).join('\n');

  const sourceRows = Object.values(SOURCES)
    .map(
      (s) => `<tr>
      <td class="mono tiny">${esc(s.id)}</td>
      <td><a href="${s.url}" rel="noopener" target="_blank"><b>${esc(s.title)}</b></a><br><span class="tiny muted">${esc(s.publisher)}</span></td>
      <td class="nowrap tiny">${esc(s.updated || '—')}</td>
      <td class="nowrap tiny">${esc(s.checked)}</td>
      <td class="tiny">${s.supports.map((x) => `• ${esc(x)}`).join('<br>')}</td>
    </tr>`
    )
    .join('\n');

  const eventRows = EVENTS.map(
    (e) => `<tr><td class="mono">${esc(e.id)}</td><td>${esc(e.when)}</td><td>${esc(e.why)}</td><td class="tiny mono">${esc(e.fields)}</td></tr>`
  ).join('\n');

  const ledgerHead = LEDGER.columns.map((c) => `<th scope="col">${esc(c.label)}</th>`).join('');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Data Room' }],
  kicker: 'Oversight',
  title: 'Data Room',
  lede: 'The raw record behind the shop: what each product link was intended to be, what it actually resolves to, which official sources back each claim, what is measured, and what the campaign ledger currently contains — which is nothing.',
  meta: `<div class="btn-row">
    ${badge('5 products', 'plain')}${badge('11 sources', 'plain')}${badge('0 ledger rows', 'amber')}${badge('0 traffic measured', 'amber')}
  </div>`,
})}

<section class="section" id="products">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Register one</p>
        <h2>Product intent record</h2>
        <p>The intended ASIN and the observed redirect are two different facts and live in two different columns. They are never merged. The blank column is the owner’s to fill.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Product-intent confirmation record.</b> Required per product: intended ASIN, official listing URL, confirmation date, source. Observed redirect target is stored separately in its own column.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Product</th><th scope="col">Supplied link</th>
          <th scope="col">Intended ASIN</th><th scope="col">Observed ASIN</th>
          <th scope="col">Observed redirect target (exact)</th><th scope="col">Confirmed</th><th scope="col">Sources</th>
        </tr></thead>
        <tbody>${productRows}</tbody>
      </table>
    </div>
    <div class="cards c2 mt-2">
      <div class="callout">
        <h4>Why the two ASIN fields are separate</h4>
        <p>A short link is an opaque code. What it resolves to today is an observation; what you meant it to point at is an intention. If they are stored in one field, a change at the shortener silently rewrites your own record. Amazon’s ASIN is a stable, checkable identifier — so it belongs in its own column, confirmed and dated.</p>
      </div>
      <div class="callout">
        <h4>What the tag column shows</h4>
        <p>None of the five observed redirects contains a <code>tag=</code> parameter. That is recorded as observed, not interpreted. The site publishes tagged links so that clicks are attributable regardless of how the short-link question resolves. <a href="/flagged/#FLG-001">FLG-001</a>.</p>
      </div>
    </div>
  </div>
</section>

<section class="section tint" id="sources">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Register two</p>
        <h2>Source register</h2>
        <p>Every official page used to build this site, with the date Amazon or the agency last updated it and the date this desk read it. Re-check before republishing; policies change.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${Object.keys(SOURCES).length} official sources.</b> All fetched and read during the build session on ${esc(SITE.buildDate)}.</caption>
        <thead><tr><th scope="col">Ref</th><th scope="col">Source</th><th scope="col">Page updated</th><th scope="col">Read on</th><th scope="col">Used for</th></tr></thead>
        <tbody>${sourceRows}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" id="events">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Register three</p>
        <h2>The five measured events</h2>
        <p>Names are frozen. The collector shipped with the site accepts exactly these and nothing else.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Event schema.</b> No event carries an identifier, a cookie, an IP address or a device fingerprint.</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">Fires when</th><th scope="col">Why it exists</th><th scope="col">Fields</th></tr></thead>
        <tbody>${eventRows}</tbody>
      </table>
    </div>
    <div class="callout red mt-2">
      <h4>No endpoint is deployed, so no event is being collected</h4>
      <p>The recorder runs in your browser and can be inspected in the console. There is no server receiving it: GitHub Pages serves static files only. The collector source is published at <a href="/analytics/collector-worker.js">/analytics/collector-worker.js</a> and is not running. Any traffic figure you see quoted anywhere else about this site is not from here. <a href="/flagged/#FLG-007">FLG-007</a>.</p>
    </div>
    <div class="mt-2" style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
      <button class="btn ghost small" type="button" id="cw-show-tally">Show what this page has recorded in your browser</button>
      <span class="tiny muted" id="cw-tally-out">Stored only in this browser’s localStorage.</span>
    </div>
  </div>
</section>

<section class="section tint" id="ledger">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Register four</p>
        <h2>Campaign ledger</h2>
        <p>Deliberately empty. A row may only be added from an authorised first-party report, with its provenance recorded.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Ledger as of ${esc(LEDGER.asOf)}: ${LEDGER.rows.length} rows.</b> The table is shown with its schema so the shape of a valid row is unambiguous before any data exists.</caption>
        <thead><tr>${ledgerHead}</tr></thead>
        <tbody>
          <tr><td colspan="${LEDGER.columns.length}" style="text-align:center;padding:2rem 1rem;color:var(--muted)">
            <span style="font-family:var(--display);font-size:1.1rem">No rows.</span><br>
            <span class="small">No eligible-session, click or order figure has been obtained from an authorised report.</span>
          </td></tr>
        </tbody>
      </table>
    </div>
    ${table({
      caption: '<b>Column rules.</b> These are enforced at review, not by code.',
      head: ['Column', 'Rule'],
      rows: LEDGER.columns.map((c) => `<tr><td><b>${esc(c.label)}</b></td><td>${esc(c.rule)}</td></tr>`),
    })}
    <div class="callout mt-2">
      <h4>The rule that matters</h4>
      <p>${esc(LEDGER.warning)}</p>
    </div>
  </div>
</section>

<section class="section" id="automation">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Register five</p>
        <h2>Automation pipeline — what is automated, what is gated</h2>
        <p>The platform automates everything that can be checked by a machine, and puts a human gate in front of everything that cannot. The gate runs on every build and fails the publish on any breach.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Automation vs human gate.</b> Every row states who owns it and what happens on failure.</caption>
        <thead><tr><th scope="col">Step</th><th scope="col">Automated or gated</th><th scope="col">What it does</th><th scope="col">Source / gate</th></tr></thead>
        <tbody>
          <tr><td>Page generation</td><td>Automated</td><td>Writes every page, sitemap and feed from the same data file, so a page cannot ship without being listed.</td><td class="src">${srcLink('G3')} · ${srcLink('G4')}</td></tr>
          <tr><td>Compliance gate R1–R10</td><td>Automated, fails build</td><td>Checks disclosure, sponsored marking, no prices or ratings, no hands-on claims, canonicals, internal links, sitemap and feed validity.</td><td class="src">${srcLink('A1')} · ${srcLink('A2')} · ${srcLink('F1')} · ${srcLink('G1')}</td></tr>
          <tr><td>Link check + XML validation</td><td>Automated, fails build</td><td>Crawls every page, validates sitemap and feed XML, fails on any broken internal link.</td><td class="src">${srcLink('G4')}</td></tr>
          <tr><td>HTTP smoke at /WinB/</td><td>Automated, fails build</td><td>Serves the site at its real project path and fetches every sitemap URL.</td><td class="src">${srcLink('G3')}</td></tr>
          <tr><td>Product facts</td><td>Human-gated</td><td>Every spec comes from the listing record with a read date. No AI step writes a product fact.</td><td class="src">${srcLink('A2')}</td></tr>
          <tr><td>Guide prose</td><td>Human-gated</td><td>AI drafting, if ever used, is a suggestion until a human checks it against a source (Q-12).</td><td class="src">${srcLink('F1')} · ${srcLink('G2')}</td></tr>
          <tr><td>Topic choice</td><td>Human-gated, data-led</td><td>Next guide is chosen from measured queries after 30 days, not from instinct (SUG-03, SUG-13).</td><td class="src">${srcLink('G2')}</td></tr>
          <tr><td>Ledger rows</td><td>Human-gated</td><td>A row may only be added from an authorised first-party report with provenance. No estimates, no forecasts.</td><td class="src">${srcLink('A2')}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section tint" id="organic">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Register six</p>
        <h2>Organic traffic playbook — one site, one reason to rank</h2>
        <p>Search engines are given one site to index and a reason to rank it: original, question-shaped answers in two coherent clusters, with every claim sourced. No keyword stuffing, no bulk publishing, no doorway pages.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>Findability levers.</b> Each row states what the build does and the official source behind it.</caption>
        <thead><tr><th scope="col">Lever</th><th scope="col">What the build does</th><th scope="col">Source</th></tr></thead>
        <tbody>
          <tr><td>One indexable site</td><td>Superseded generations are marked noindex and excluded in robots.txt, so exactly one site competes on this host.</td><td class="src">${srcLink('G2')}</td></tr>
          <tr><td>Sitemap</td><td>Generated from the same data as the pages; every indexable page is listed, single-host, UTF-8.</td><td class="src">${srcLink('G3')} · ${srcLink('G4')}</td></tr>
          <tr><td>RSS feed</td><td>Generated with the sitemap; every new guide appears in both automatically.</td><td class="src">${srcLink('G3')}</td></tr>
          <tr><td>Canonical + Open Graph</td><td>Every page carries a canonical URL, title, description and social tags.</td><td class="src">${srcLink('G3')}</td></tr>
          <tr><td>Cluster interlinking</td><td>Air-fryer and thermometer clusters link to each other, to the hubs and to the comparison table.</td><td class="src">${srcLink('G2')}</td></tr>
          <tr><td>Cadence</td><td>One substantial guide per fortnight. Bursts are treated as scaled content abuse.</td><td class="src">${srcLink('G2')}</td></tr>
          <tr><td>Outbound marking</td><td>Every Amazon link carries rel="sponsored" so paid placements are qualified.</td><td class="src">${srcLink('G1')}</td></tr>
          <tr><td>Measurement</td><td>Five events, no cookies, no third-party scripts. Topic choice waits for measured queries.</td><td class="src">${srcLink('A2')}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div><p class="eyebrow">Register seven</p><h2>Content inventory</h2></div></div>
    ${table({
      caption: '<b>Everything published.</b> Five product pages, five guides, two category hubs, one comparison table.',
      head: ['Type', 'Title', 'Path', 'Published', 'Sources'],
      rows: [
        ...PRODUCTS.map(
          (p) => `<tr><td>Product</td><td>${esc(p.shortName)}</td><td class="mono tiny">/reviews/${esc(p.slug)}.html</td><td class="nowrap">2026-11-20</td><td class="src"><a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Listing</a></td></tr>`
        ),
        ...GUIDES.map(
          (g) => `<tr><td>Guide</td><td>${esc(g.title)}</td><td class="mono tiny">/${esc(g.path)}</td><td class="nowrap">${esc(g.published)}</td><td class="src">${g.sources.map((s) => srcLink(s)).join(', ')}</td></tr>`
        ),
        `<tr><td>Category</td><td>Air fryers</td><td class="mono tiny">/air-fryers/</td><td class="nowrap">2026-11-20</td><td class="src">${srcLink('A2')}</td></tr>`,
        `<tr><td>Category</td><td>Thermometers</td><td class="mono tiny">/thermometers/</td><td class="nowrap">2026-11-20</td><td class="src">${srcLink('A2')}, ${srcLink('U1')}</td></tr>`,
        `<tr><td>Comparison</td><td>The comparison table</td><td class="mono tiny">/compare/</td><td class="nowrap">2026-11-20</td><td class="src">${srcLink('A2')}</td></tr>`,
      ],
    })}
  </div>
</section>`;

  return page({
    path: '/data-room/',
    title: 'Data Room — product intent, sources, events and ledger | Counterwise',
    description:
      'The raw register behind the shop: intended vs observed ASINs stored separately, 11 official sources with read dates, the five measured events, and an empty campaign ledger with its schema.',
    body,
  });
}

// ------------------------------------------------------------------- flagged
export function flaggedPage() {
  const flagBlock = (f) => `
<details class="flag" id="${esc(f.id)}" ${f.severity === 'High' ? 'open' : ''}>
  <summary>
    <span class="id">${esc(f.id)}</span>
    <span class="ft">
      <h3>${esc(f.title)}</h3>
      <span class="meta">
        ${badge(f.severity + ' severity', f.severity === 'High' ? 'red' : f.severity === 'Medium' ? 'amber' : 'plain')}
        ${badge(f.status, f.status === 'Open' ? 'amber' : 'plain')}
      </span>
    </span>
    <span class="chev" aria-hidden="true">›</span>
  </summary>
  <div class="body">
    <div><p class="mt-0" style="margin:0">${esc(f.detail)}</p></div>
    ${f.evidence.length ? `<div><dt>Evidence</dt><dd><ul>${f.evidence.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></dd></div>` : ''}
    ${f.sources.length ? `<div><dt>Official sources</dt><dd>${f.sources.map((s) => srcLink(s, SOURCES[s].publisher + ' — ' + SOURCES[s].title)).join('<br>')}</dd></div>` : ''}
    <div><dt>What the owner needs to do</dt><dd>${esc(f.action)}</dd></div>
    <div><dt>Blocks</dt><dd>${esc(f.blocks)}</dd></div>
  </div>
</details>`;

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Flagged for Review' }],
  kicker: 'Oversight',
  title: 'Flagged for Review',
  lede: 'Everything on this site that could not be confirmed from an official source, plus the irregularities found while checking. These do not block publication — they block the claims that depend on them, and they are listed here so you can review them after the site is live and ask for changes.',
  meta: `<div class="btn-row">
    ${badge(FLAGS.filter((f) => f.severity === 'High').length + ' high', 'red')}
    ${badge(FLAGS.filter((f) => f.severity === 'Medium').length + ' medium', 'amber')}
    ${badge(FLAGS.filter((f) => f.severity === 'Low').length + ' low', 'plain')}
  </div>`,
})}
<section class="section">
  <div class="wrap">
    <div class="callout red mb-3">
      <h4>The short version</h4>
      <p>Five products were identified and every one of their pages is sourced. What could not be confirmed: whether the supplied short links credit this Associates account, what the owner intended each link to point at, and anything at all about hands-on performance — because nothing has been handled. Prices and ratings are deliberately absent for policy reasons, not because they were unknown.</p>
    </div>
    ${FLAGS.map(flagBlock).join('\n')}
    <div class="callout mt-3">
      <h4>How to read a “needs review” item</h4>
      <p>A flag with status <b>Needs review</b> is published here and does not block anything. A flag with status <b>Open</b> is a live limitation on a specific claim, named in the flag. If you want any of these resolved, the “what the owner needs to do” line under each one is the shortest path.</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Spot-check</p><h2>What verification actually meant here</h2></div></div>
    ${table({
      caption: '<b>Method.</b> What was checked, how, and with what result.',
      head: ['Check', 'Method', 'Result'],
      rows: [
        ['Short link resolution', 'Each of the five link.amazon URLs fetched once on 2026-11-20 and the redirect target recorded verbatim.', 'All five resolved to live amazon.com listings. None carried a tag parameter.'],
        ['Product identity', 'Listing title, brand, category path and ASIN read from each resolved listing.', 'Five distinct products identified. ASINs recorded in a separate column from the intended ASIN.'],
        ['Disclosure wording', 'Compared against the exact sentence named in Operating Agreement §5.', 'Exact sentence used, above the masthead on every page and repeated in the footer.'],
        ['Price and rating policy', 'Compared against Participation Requirements §2(b).', 'No price or rating printed anywhere. Enforced by the build, not by memory.'],
        ['Outbound link marking', 'Compared against Google’s outbound-link documentation.', 'All Amazon links carry rel="sponsored nofollow noopener".'],
        ['Temperature figures', 'Compared against the USDA FSIS safe minimum internal temperature chart.', 'Seven rows quoted, each with the chart’s own figures and rest times.'],
        ['Sitemap and feed', 'Built and validated against the sitemaps.org protocol and RFC-822 dates for RSS.', 'XML parses; every loc element sits on one host; every URL returns 200 in the local link check.'],
      ].map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`),
    })}
  </div>
</section>`;

  return page({
    path: '/flagged/',
    title: 'Flagged for Review — unverified items and irregularities | Counterwise',
    description:
      'Every item that could not be confirmed, each with its evidence, its official source where one exists, and the action that would close it — including two irregularities found and fixed in this cycle.',
    body,
  });
}

// ------------------------------------------------------------------- methods
export function methodsPage() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'How we choose' }],
  kicker: 'Standards',
  title: 'How this site works',
  lede: 'Five rules, applied to every page. An earlier version broke one of them by calling published specifications unpublished; that is recorded on the Flagged page and fixed. If a page breaks a rule, it is a bug.',
})}
<section class="section">
  <div class="wrap-narrow prose">
    <h2>Rule one: no hands-on claim without hands on the product</h2>
    <p>This desk has not used any of the five products. So no page says “we tested”, “in our kitchen”, “after a month of use”, or anything else that implies contact. Every page describes what the manufacturer’s listing states, shows the arithmetic, and lists what is missing.</p>
    <p>The FTC is direct about this: you cannot talk about your experience with a product you have not tried. That is not a style preference we are being precious about — it is the reason the pages read the way they do. The word “review” in this site’s URLs is used in the older sense of an assessment; where it could mislead, the page says so in the first paragraph.</p>

    <h2 id="price">Rule two: no price, no rating, no rank</h2>
    <p>Amazon’s Program Policies allow a site to show prices only if Amazon serves the link containing that data, or if the data comes from the Creators API or Product Advertising API under the licence. This site is a set of static files with no API credentials, so it shows no prices. It also shows no customer star ratings and no popularity position, for the same reason and because those are Amazon’s content rather than this site’s judgement.</p>
    <p>What that means in practice: every one of the five listings displayed a price and a customer rating when this desk read it, and this site reproduces neither. Not because they were unknown — they were right there — but because printing them here would be both stale within the hour and outside the rule. The comparison table has an empty price column on purpose, and the note under it explains why rather than quietly omitting it.</p>

    <h2>Rule three: every outbound Amazon link is a tagged, marked affiliate link</h2>
    <p>Each Amazon link is built from the observed ASIN plus the Associate tag <code>${esc(SITE.associateTag)}</code>, and carries <code>rel="sponsored nofollow noopener"</code>. The tag is what makes a click attributable to this account; the <code>sponsored</code> value tells search engines the link is a paid placement, which is what Google asks for. Links are rel-marked in the HTML, so the marking survives with JavaScript disabled.</p>
    <p>Each product page also offers a plainly-labelled untagged listing link, marked “no commission”, so a reader who does not want to use an affiliate link can still check the product. It is marked the same way for search engines.</p>

    <h2>Rule four: what cannot be sourced is blank, and labelled</h2>
    <p>Counter footprint is blank for all three air fryers. External dimensions for the two thermometers are blank. Probe length is blank. In each case the listing did not state it in the data this desk could read, and guessing a plausible range is the exact failure mode this project was set up to avoid. A blank with “not stated” beside it is a fact; a plausible number would be a fabrication.</p>
    <p>The reverse rule applies too, and an earlier version of this page broke it. Wattage, temperature range, model numbers and warranty terms <em>were</em> published on the listings, and the site was reporting them as “not stated”. That was fixed on 2026-11-20: those values are now printed, transcribed from the listing, with the phrase they came from. See <a href="/flagged/#FLG-014">FLG-014</a>. A specification only counts as missing when the listing is actually silent.</p>
    <p>Where a single listing states two different values for the same thing, both are printed and the disagreement is flagged rather than quietly resolved — see <a href="/flagged/#FLG-013">FLG-013</a>.</p>
    <p>Every genuine blank is collected on the <a href="/flagged/">Flagged for Review</a> page with the action that would resolve it.</p>

    <h2>Rule five: report what buyers actually complain about</h2>
    <p>Amazon publishes, above the reviews, a count of how many reviewers mentioned a given feature and how those mentions split positive and negative. It is the most decision-relevant thing on a product page and most buying guides ignore it. Each product page here reproduces those counts, attributed to Amazon, sorted worst-first, with a source line. They are not this desk’s sample and they are not a rating.</p>

    <hr>
    <h2>The disclosure, and why it is where it is</h2>
    <p>“As an Amazon Associate I earn from qualifying purchases.” appears in a strip under the masthead on every page and again in the footer. It sits above the content rather than at the end because FTC guidance says disclosures are likely to be missed when they appear only on an about page or at the end of a post, and that they should be placed where they are hard to miss. The exact wording is the sentence named in section 5 of the Associates Program Operating Agreement.</p>

    <h2>What this site is not</h2>
    <ul>
      <li>It is not endorsed, sponsored or reviewed by Amazon. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</li>
      <li>It is not a consumer testing organisation. It compares published specifications.</li>
      <li>It is not impartial in the sense of having no stake. It earns commission if you buy through its links, and says so at the top of every page.</li>
    </ul>

    <h2>Authorship, brand and imagery</h2>
    <p>Every guide and product page carries a byline — author, date and reading time — and the About page states who writes the site and what the desk will not do. Google’s site-reputation policy weighs stated authorship, and an unauthored affiliate page is its own example of content likely to attract action. The brand is Counterwise: kitchen gear, chosen by question rather than by hype. Imagery is generated editorial illustration, labelled as such. No Amazon product photography is stored, because the IP License forbids storing or caching Product Advertising Content images and a static site is a cache. Licensed brand photography is an open question (Q-14).</p>

    <h2>Seasons and clusters</h2>
    <p>The site is organised as two clusters — air fryers and thermometers — that link to each other and to the comparison table. A seasonal notebook reframes the existing guides by the meal being cooked (weeknight two-food dinners, big-batch sharing, holiday roasts, summer grilling) as editorial hypotheses, not as popularity claims. New seasonal guides are published one at a time, only after measurement says which one to write. See the <a href="/decisions/#queue">topic queue</a>.</p>

    <h2>Automation and the human gate</h2>
    <p>The build automates page generation, the sitemap, the feed, link checks and the R1–R10 compliance gate, and fails the publish on any breach. Product facts, guide prose, topic choice and ledger rows are human-gated: no AI step writes a product fact, and no ledger row is added without an authorised first-party report. The full pipeline is tabled in the <a href="/data-room/#automation">Data Room</a>.</p>

    <h2>Corrections</h2>
    <p>If something here is wrong, the fastest route is an issue on the repository behind this site. Corrections are logged, and a correction that changes a claim is dated on the page it changes.</p>
  </div>
</section>`;

  return page({
    path: '/methods/',
    title: 'How we choose — standards and limits | Counterwise',
    description:
      'The five rules behind every page: no hands-on claim without the product, no prices or ratings, tagged sponsored links, blanks instead of guesses, and Amazon’s own review-theme counts reported honestly.',
    body,
  });
}

// --------------------------------------------------------------------- about
export function aboutPage() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'About' }],
  kicker: 'About',
  title: 'Who writes this, and why it is shaped like this',
  lede: 'Counterwise is a single-desk editorial project about a small number of kitchen tools. It exists because most buying advice for these products is either a specification table with no judgement or a review of something the writer never opened.',
})}
<section class="section">
  <div class="wrap-narrow prose">
    <h2>The desk</h2>
    <p>${esc(SITE.authorBio)}</p>
    <p>That constraint is stated on every product page rather than buried here, because it changes how you should read them. A specification judgement can tell you whether two 3 qt baskets will frustrate you; it cannot tell you whether the coating flakes after eight months. The first is useful and checkable. The second is what everyone else is already guessing at.</p>

    <h2>Why only five products</h2>
    <p>Because the five supplied form a coherent set: three air fryers that are structurally different machines, and two thermometers built for different jobs. Expanding into a twelfth category before the first two convert would produce a directory, not a shop. That decision is written down in the <a href="/decisions/#SUG-08">Decision Room</a> with its reasoning and its downside.</p>

    <h2>How the site is built</h2>
    <p>Static HTML generated from a small data file, served by GitHub Pages. No database, no framework, no third-party script, no cookie set by the site’s own code. The sitemap and RSS feed are regenerated by the same build that writes the pages, so a new guide cannot be published without appearing in both. The build also runs the R1–R10 compliance gate, a link crawl and an HTTP smoke test at the real /WinB/ path, and fails the publish if any of them fails.</p>
    <p>You can read the registers that drive it: the <a href="/data-room/">Data Room</a> holds the product-intent record, the source register, the automation pipeline, the organic playbook and the measurement schema; the <a href="/flagged/">Flagged for Review</a> page holds everything that could not be confirmed.</p>

    <h2>Brand, seasons and clusters</h2>
    <p>The brand is Counterwise. The shop is organised as two clusters — <a href="/air-fryers/">air fryers</a> and <a href="/thermometers/">thermometers</a> — that link to each other and to the <a href="/compare/">comparison table</a>. A seasonal notebook on the front page reframes the guides by cooking moment as hypotheses. Imagery is generated editorial illustration; no Amazon product photography is stored, for licence reasons stated in <a href="/methods/">How this site works</a>.</p>

    <h2>Contact</h2>
    <div class="callout">
      <h4>There is no email address yet — and this page will not invent one</h4>
      <p>${esc(SITE.contactNote)} A public contact address is an open decision (Q-07); until one exists, the repository issue tracker is the honest route and it is monitored.</p>
    </div>

    <h2>The disclosure, once more, in full</h2>
    <p><strong>${esc(SITE.associateStatement)}</strong> Links to Amazon on this site are affiliate links. If you click one and buy, this site may receive a commission at no additional cost to you. The commission does not change what a page says, because no page here is a ranking: each one describes a different job.</p>
  </div>
</section>`;

  return page({
    path: '/about/',
    title: 'About Counterwise — the desk, the method, the contact route',
    description:
      'Who writes Counterwise, why five products rather than fifty, how the site is built, and the correction route.',
    body,
  });
}

// ------------------------------------------------------------------- privacy
export function privacyPage() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Privacy & measurement' }],
  kicker: 'Legal-ish, in plain words',
  title: 'Privacy and measurement',
  lede: 'What this site records, what it does not, and why there is nothing to consent to yet.',
})}
<section class="section">
  <div class="wrap-narrow prose">
    <h2>The short version</h2>
    <ul>
      <li>This site’s own code sets <b>no cookies</b>.</li>
      <li>It loads <b>no third-party scripts</b> — no analytics vendor, no advertising network, no font CDN.</li>
      <li>It records <b>five events</b> (listed below) in your browser, and sends them to an endpoint only if one is configured. At present none is, so nothing leaves your browser.</li>
      <li>It stores two keys in your browser’s <code>localStorage</code>: a counter of events seen, and your opt-out flag.</li>
      <li>Clicking an Amazon link takes you to Amazon, which has <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" rel="noopener" target="_blank">its own privacy notice</a> and its own cookies. That is outside this site’s control.</li>
    </ul>

    <div class="callout red">
      <h4>FTC/Amazon notice requirement</h4>
      <p>Amazon’s Program Policies require a site to disclose, accurately and adequately, the use of cookies, pixels and other technologies, and how visitor data is collected, used and disclosed. This page is that disclosure. Amazon and other third parties may set cookies when you visit Amazon after clicking a link here; this site cannot control those cookies and does not receive the data they collect.</p>
    </div>

    <h2>The five events</h2>
    <div class="table-wrap">
      <table>
        <caption><b>Exactly five event names.</b> None carries an identifier, an IP address or a fingerprint.</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">Fields</th></tr></thead>
        <tbody>${EVENTS.map((e) => `<tr><td class="mono">${esc(e.id)}</td><td class="tiny">${esc(e.fields)}</td></tr>`).join('')}</tbody>
      </table>
    </div>

    <h2>What an event does not contain</h2>
    <p>No IP address is stored by the recorder. No cookie is created. No device fingerprint is computed. No cross-site identifier is attached. No email address is transmitted — the capture form explicitly does not send one, because no list provider exists yet. Each event carries a random value generated in memory for the current page load, which exists only so a server can discard a duplicate; it is not written to storage and it dies with the tab.</p>
    <p><b>The host is not part of this recorder.</b> The site is hosted on GitHub Pages. GitHub’s documentation states that a visitor’s IP address is logged and stored for security purposes whenever a Pages site is visited, whether or not the visitor has signed in to GitHub. That log is kept by the host, not by this site’s recorder. <a href="/flagged/#FLG-018">FLG-018</a></p>

    <h2>Your two controls</h2>
    <p><b>Turn measurement off.</b> <a href="#" id="cw-optout-inline">Click here</a> or use “Turn off measurement” in the footer. The recorder checks the flag before it does anything and stops. Your browser keeps only the flag.</p>
    <p><b>Delete what exists.</b> Clearing site data for this domain removes the event counter and the opt-out flag.</p>

    <h2>What this means for the numbers on this site</h2>
    <p>Because measurement can be switched off and because no endpoint is deployed, this site cannot claim a traffic figure. It does not. The campaign ledger in the <a href="/data-room/#ledger">Data Room</a> is empty and stays empty until an authorised first-party report provides real rows. A conversion rate computed from this site’s own counter would be a guess dressed as a statistic, and is deliberately not computed anywhere.</p>

    <h2>Children</h2>
    <p>This site is not directed at children and does not knowingly collect information from them. Amazon’s suitability rules also exclude sites directed toward children under 13 from the Associates Program, which this site is not.</p>
  </div>
</section>`;

  return page({
    path: '/privacy/',
    title: 'Privacy and measurement — Counterwise',
    description:
      'No cookies, no third-party scripts, five non-identifying events, and a one-click opt-out. What this site records and what it deliberately does not.',
    body,
  });
}

// ------------------------------------------------------- executive summary
export function execPage() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Executive summary' }],
  kicker: 'For the owner',
  title: 'Executive summary',
  lede: 'What was built, what it can and cannot claim, what it needs from you, and the decisions that carry the most weight.',
  meta: `<p class="tiny muted" style="margin:0">Build ${esc(SITE.buildDate)} · associate tag ${esc(SITE.associateTag)} · 5 products · 8 guides · 3 worksheets · ${FLAGS.length} flagged items · ${DECISION_QUEUE.length} proposals in the queue</p>`,
})}
<section class="section">
  <div class="wrap-narrow prose">
    <h2>In one paragraph</h2>
    <p>A five-product kitchen shop — three air fryers, two thermometers — built as a static publication with every Amazon link tagged and marked sponsored, the required Associates disclosure above the masthead on every page, no prices or ratings shown for policy reasons, and every unverifiable value left blank and flagged. This cycle moved the site from a specification summary to a buying decision: the front page now opens with five buyer situations rather than a methodology statement, the comparison table carries stated wattage, temperature range and the weakest review theme per product, and each product page reports what repeat buyers complain about using the counts Amazon itself publishes.</p>
    <p>Two things were also fixed that mattered more than any addition. The site had been reporting published specifications as “not stated” — wattage, temperature range and model numbers were all on the listings (FLG-014). And three listings contradict themselves on their own figures; both values are now printed rather than one being quietly chosen (FLG-013).</p>

    <h2>November 2026 refresh (S15)</h2>
    <p>This cycle added decision tools rather than more product copy: a 30-second chooser on the front page (“Which one fits your kitchen?”), three printable worksheets (capacity, cleanup/counter-space, thermometer calibration), three new question-shaped guides (holiday roast thermometer, game-day wings, air-fryer leftovers), and a buyer-questions FAQ matrix on the front page and both category hubs. All new guides are timely framing of existing, sourced material — editorial hypotheses for November, not popularity or demand claims. The chooser and worksheets run entirely in the browser: no account, no cookie, nothing sent anywhere. The build now enforces R15 (question-shaped new guides, no invented demand, chooser present, worksheets printable) in addition to R1–R14.</p>

    <h2>What the five supplied links turned out to be</h2>
    ${table({
      caption: '<b>Resolution record.</b> Observed on 2026-11-20. Intended ASIN stays blank until you confirm it.',
      head: ['#', 'Supplied link', 'Resolved ASIN', 'Product'],
      rows: PRODUCTS.map(
        (p, i) => `<tr><td class="num">${i + 1}</td><td class="mono tiny">${esc(p.suppliedLink)}</td><td class="mono">${esc(p.asin)}</td><td>${esc(p.shortName)}</td></tr>`
      ),
      note:
        'All five resolved to live listings. None of the resolved URLs carried a tag parameter, which is the first of the two things this project needs from you.',
    })}

    <h2>What this site can claim</h2>
    <ul>
      <li>Every product page is sourced to the manufacturer’s listing, with the ASIN printed and the read date recorded.</li>
      <li>Every Amazon link is tagged and marked <code>rel="sponsored"</code>.</li>
      <li>The required disclosure appears above the masthead on every page, and again in the footer.</li>
      <li>No price, rating or sales figure is reproduced anywhere — checked by the build, not by eye.</li>
      <li>The USDA safe-temperature table is quoted from the agency’s own chart, with rest times.</li>
      <li>Every stated wattage, temperature range, model number and warranty term is transcribed from the listing, with the phrase it came from recorded in <code>_build/listing-evidence.mjs</code>.</li>
      <li>Review-theme counts are Amazon’s own published figures, attributed and dated, sorted worst-first.</li>
      <li>The sitemap and RSS feed are generated by the build, so a new guide cannot ship without being listed in both.</li>
    </ul>

    <h2>What it cannot claim, and will not</h2>
    <ul>
      <li><b>No hands-on testing.</b> None of the five products has been handled. Every page says so.</li>
      <li><b>No traffic, clicks, orders or revenue.</b> No analytics endpoint is deployed, so nothing has been measured. The campaign ledger is empty by design.</li>
      <li><b>No confirmation that the supplied short links credit your account.</b> The resolved URLs carry no tag; the site uses tagged canonical links instead.</li>
      <li><b>No ranking or price comparison.</b> Five products in two categories is a shop, not a market.</li>
      <li><b>No claim that an unpublished number was published, or the reverse.</b> Where a listing is silent, the cell is blank. Where it contradicts itself, both figures appear.</li>
    </ul>

    <h2>The four decisions that matter most</h2>
    ${table({
      caption: '<b>Ordered by downside if left open.</b> Full reasoning in the Decision Room.',
      head: ['#', 'Decision', 'Why it is first', 'Owner action'],
      rows: [
        ['1', 'Do the supplied short links credit your account?', 'If not, everything published until it is fixed earns nothing.', 'Mint one link in Associates Central and compare the parameters. Under an hour.'],
        ['2', 'Buy and document one review unit', 'The only durable answer to thin-affiliation risk and reader distrust.', 'Pick the cheapest of the five, buy it, publish the receipt.'],
        ['3', 'Deploy the analytics endpoint', 'Until it exists, the next topic is chosen by instinct.', 'Deploy the supplied worker, set one line in the JS, run 30 days.'],
        ['4', 'Decide who the site belongs to', 'Google’s site-reputation policy weighs stated authorship; an unauthored affiliate page is its own example of a problem.', 'A named byline and a two-line biography.'],
      ],
    })}

    <h2>How it reads as a shop</h2>
    <ul>
      <li>The front page leads with the five picks, then the two category hubs, then the guides. Registers live in the footer and one “More” group, never in the hero.</li>
      <li>Two clusters (air fryers, thermometers) link to each other and to the comparison table. A seasonal notebook reframes the guides by cooking moment as hypotheses — no popularity or search-volume claim is made.</li>
      <li>Every guide and product page carries a byline (author, date, reading time). Imagery is generated editorial illustration, labelled as such; no Amazon photography is stored.</li>
      <li>The automation pipeline (generation, sitemap, feed, R1–R10 gate, link crawl, smoke test) is tabled in the Data Room. Product facts, prose, topic choice and ledger rows stay human-gated.</li>
    </ul>

    <h2>What you can review, in order</h2>
    <ol>
      <li><a href="/suggestions/">Suggestions and the decision queue</a> — ${DECISION_QUEUE.length} proposals with cost, reversibility and failure mode, the ${BLOCKING_QUESTIONS.length} questions that block them, and the five actions only you can take (about fifty minutes total). Start here.</li>
      <li><a href="/decisions/">Decision Room</a> — three paths to choose between, a seasonal topic queue with measurement gates, ${SUGGESTIONS.length} suggestions ordered by priority, ${QUESTIONS.length} questions split into known and unknown, a missing-information discovery plan, and the options rejected with sources.</li>
      <li><a href="/flagged/">Flagged for Review</a> — ${FLAGS.length} items that could not be confirmed, each with evidence and the shortest route to closing it.</li>
      <li><a href="/data-room/">Data Room</a> — the product-intent record, the source register, the automation pipeline, the organic playbook, the five events, and the empty ledger with its schema.</li>
    </ol>

    <h2>The honest assessment</h2>
    <p>The site is in good shape as a publication and in an early state as a business. It has a coherent product set, a defensible editorial position and no compliance debt that it has hidden. What it does not have is a single reader, a single confirmed click, or a product anyone here has touched. The three suggestions at priority 1 are the ones that change that; everything else is polish on top of them.</p>

    <hr>
    <p class="small muted">Built and verified on ${esc(SITE.buildDate)}. Every official source is listed with its read date in the <a href="/data-room/#sources">source register</a>. The disclosure applies to this page too: <strong>${esc(SITE.associateStatement)}</strong></p>
  </div>
</section>`;

  return page({
    path: '/executive-summary/',
    title: 'Executive summary — Counterwise',
    description:
      'What was built, what the five supplied links resolved to, what the site can and cannot claim, and the four decisions that matter most.',
    body,
  });
}

// ------------------------------------------------------- suggestions review
// A dedicated surface for reviewing proposals before any is implemented.
// Three parts, in the order a decision actually gets made:
//   1. the decisions themselves, with cost, reversibility and failure mode
//   2. the questions that block them, split into known / missing / how to find
//   3. the five things only the owner can do, so a stalled queue is visible
export function suggestionsPage() {
  const NEWLINE = '\n';
  const openItems = DECISION_QUEUE.filter((d) => !d.implemented);
  const doneItems = DECISION_QUEUE.filter((d) => d.implemented);

  const card = (d) => `
<article class="dec" id="${esc(d.id)}">
  <div class="dh">
    <span class="pri">${esc(d.id)}</span>
    <h3>${esc(d.title)}</h3>
    ${badge(d.lane, 'plain')}
    ${d.ownerOnly ? badge('Owner only', 'amber') : badge('Any editor', 'green')}
    ${d.implemented ? badge('Built in this cycle', 'green') : ''}
  </div>
  <div class="rec"><b>Recommendation</b>${esc(d.recommendation)}</div>
  <dl>
    <dt>What changes</dt><dd>${esc(d.whatChanges)}</dd>
    <dt>Why it matters</dt><dd>${esc(d.why)}</dd>
    <dt>Cost</dt><dd>${esc(d.cost)}</dd>
    <dt>Reversible</dt><dd>${esc(d.reversible)}</dd>
    <dt>If it goes wrong</dt><dd>${esc(d.risk)}</dd>
    <dt>Choose it if</dt><dd>${esc(d.chooseIf)}</dd>
    <dt>Do not choose it if</dt><dd>${esc(d.notIf)}</dd>
    <dt>Blocked by</dt><dd>${d.dependsOn.length ? d.dependsOn.map((q) => `<a href="#${esc(q)}">${esc(q)}</a>`).join(' · ') : 'Nothing'}</dd>
    <dt>How much it costs to be wrong</dt><dd>${d.riskLow ? '<span class="badge green">Low — the change is a revert</span>' : '<span class="badge amber">Not free — money spent, a claim published, or an obligation accepted</span>'}</dd>
  </dl>
</article>`;

  const boardRow = (d) => `<tr>
    <td class="mono tiny">${esc(d.id)}</td>
    <td><b>${esc(d.title)}</b><br><span class="tiny muted">${esc(d.lane)}</span></td>
    <td class="tiny">${esc(d.cost)}</td>
    <td class="tiny">${d.reversible}</td>
    <td>${d.reversible === 'Yes' || d.reversible.startsWith('Yes') ? '<span class="badge green">Yes</span>' : d.reversible.startsWith('n/a') ? '<span class="badge plain">Information only</span>' : '<span class="badge amber">Hard to undo</span>'}</td>
    <td class="tiny">${d.dependsOn.length ? d.dependsOn.map((q) => `<a href="#${esc(q)}">${esc(q)}</a>`).join(' ') : '—'}</td>
    <td>${d.implemented ? '<span class="badge green">Built</span>' : '<span class="badge plain">Awaiting decision</span>'}</td>
    <td class="tiny"><a href="#${esc(d.id)}">Read the case →</a></td>
  </tr>`;

  const qCard = (q) => `
<article class="dec" id="${esc(q.id)}">
  <div class="dh">
    <span class="pri">${esc(q.id)}</span>
    <h3>${esc(q.question)}</h3>
  </div>
  <dl>
    <dt>Unblocks</dt><dd>${esc(q.unblocks)}</dd>
    <dt>What is known</dt><dd>${esc(q.known)}</dd>
    <dt>What is missing</dt><dd class="q-missing">${esc(q.missing)}</dd>
    <dt>How to find out</dt><dd>${esc(q.howToFind)}</dd>
    <dt>Who can answer</dt><dd>${esc(q.whoCanAnswer)}</dd>
    <dt>If yes</dt><dd>${esc(q.ifYes)}</dd>
    <dt>If no</dt><dd>${esc(q.ifNo)}</dd>
  </dl>
</article>`;

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Suggestions' }],
  kicker: 'Review queue',
  title: 'Suggestions, and what has to be true before each one',
  lede: `${DECISION_QUEUE.length} proposals, ${BLOCKING_QUESTIONS.length} blocking questions, and the five actions only the account owner can take. Nothing on this page is implemented unless it says "Built". Review in this order; the queue is sorted by what breaks if you skip it.`,
  meta: `<div class="btn-row">
    ${badge(openItems.length + ' awaiting a decision', 'amber')}
    ${badge(doneItems.length + ' built in this cycle', 'green')}
    ${badge(BLOCKING_QUESTIONS.length + ' blocking questions', 'plain')}
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>The decision board</h2>
        <p>One row per proposal. "Reversible" means a change can be undone without loss; "hard to undo" means it spends money, publishes a claim, or closes a door. Decide the reversible ones quickly and the other ones deliberately.</p>
      </div>
    </div>
    ${table({
      caption: `<b>${DECISION_QUEUE.length} proposals.</b> Sorted so that revenue integrity comes before growth, because growth on an uncredited link is arithmetic that never pays.`,
      head: ['ID', 'Proposal', 'Cost', 'Reversible?', 'Risk', 'Blocked by', 'Status', ''],
      rows: [...openItems, ...doneItems].map(boardRow),
    })}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part two</p>
        <h2>${BLOCKING_QUESTIONS.length} questions that must be answered first</h2>
        <p>Each is split into what is known — with where it is known from — what is missing, and the cheapest way to find the missing part. If a question cannot be answered from an official source, it says so instead of guessing.</p>
      </div>
    </div>
    ${BLOCKING_QUESTIONS.map(qCard).join(NEWLINE)}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part three</p>
        <h2>Five things only you can do</h2>
        <p>Everything else on this page can be done by an editor with the repository. These five cannot, and the queue does not move far without them. Total time: about fifty minutes.</p>
      </div>
    </div>
    ${table({
      caption: '<b>The owner checklist.</b> Each item names the decision it unblocks and how long it takes.',
      head: ['Unblocks', 'Action', 'Time'],
      rows: OWNER_ACTIONS.map(
        (a) => `<tr><td class="mono tiny"><a href="#${esc(a.id)}">${esc(a.id)}</a></td><td>${esc(a.action)}</td><td class="tiny">${esc(a.time)}</td></tr>`
      ),
    })}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part four</p>
        <h2>Read the case for each proposal</h2>
        <p>The board above is a summary. This is the argument — what changes, what it costs, how it fails, and the condition under which you should not do it.</p>
      </div>
    </div>
    ${openItems.map(card).join(NEWLINE)}
  </div>
</section>

<section class="section">
  <div class="wrap-narrow prose">
    <h2>How to use this page</h2>
    <p>Pick a row from Part one. If it is marked "Owner only", it needs the account. If it is blocked, follow the question ID in Part two before deciding. If the answer to a question turns out to be "no", the proposal usually stays a proposal — that is a valid outcome and is recorded in its "Do not choose it if" line.</p>
    <p>Nothing here is a commitment. The site does not implement a proposal because it is on this page; it implements one when somebody reads it, decides, and changes the build. What is already built is labelled "Built", and the previous queue is preserved in the <a href="/decisions/">Decision Room</a> so the reasoning behind an older choice is still readable.</p>
    <div class="callout">
      <h4>What this page deliberately does not do</h4>
      <p>It does not score the proposals. A score would imply that "conversion" and "trust" can be traded on one axis, and they cannot. It also does not predict revenue: no campaign has run, so any number would be invented.</p>
    </div>
  </div>
</section>`;

  return page({
    path: '/suggestions/',
    title: 'Suggestions and the decision queue | Counterwise',
    description:
      'Ten proposals for improving this site, each with cost, reversibility and failure mode, plus the nine blocking questions and the five actions only the owner can take.',
    body,
  });
}
