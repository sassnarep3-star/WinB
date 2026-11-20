// content-oversight.mjs — the reviewable surfaces. These are reachable from the
// footer and from a single "More" group in the nav, never from the hero.
// The front page sells; these pages account for themselves.

import { SITE, SOURCES, PRODUCTS, EVENTS, LEDGER, FLAGS, QUESTIONS, SUGGESTIONS, GUIDES } from './data.mjs';
import { esc, url, page, pageHead, table, badge, srcLink, blank, amazonLink } from './core.mjs';

// ------------------------------------------------------------- decision room
export function decisionsPage() {
  const open = SUGGESTIONS.filter((s) => s.status !== 'Implemented');
  const done = SUGGESTIONS.filter((s) => s.status === 'Implemented');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Decision Room' }],
  kicker: 'Oversight',
  title: 'Decision Room',
  lede: 'Everything this project could do next, what is known, what is missing, and the smallest action that would resolve each open question. Nothing on this page is implemented unless it says so.',
  meta: `<div class="btn-row">
    ${badge(open.length + ' open suggestions', 'amber')}
    ${badge(done.length + ' already built', 'green')}
    ${badge(QUESTIONS.filter((q) => q.status !== 'Answered').length + ' open questions', 'plain')}
    <a class="btn small" href="/suggestions/">Open the Suggestion Board <span class="arw">→</span></a>
    <a class="btn small ghost" href="/questions/">Open the question register <span class="arw">→</span></a>
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>Suggestions — review and choose on the Suggestion Board</h2>
        <p>Every suggestion is now a proposal with named options and a decision gate: compare the paths, choose one, and only then does implementation begin. Priority 1 means “review this before writing another word”. The full option tables live on the <a href="/suggestions/">Suggestion Board</a>; this table is the index.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${SUGGESTIONS.length} proposals.</b> ${open.length} awaiting a decision, ${done.length} decided and recorded.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Priority</th><th scope="col">Proposal</th>
          <th scope="col">Recommended path</th><th scope="col">Decision state</th><th scope="col">Board</th>
        </tr></thead>
        <tbody>${SUGGESTIONS.map(
          (s) => `<tr>
          <td class="mono tiny">${esc(s.id)}</td>
          <td class="tiny">P${s.priority}</td>
          <td><b>${esc(s.title)}</b><br><span class="tiny muted">${esc(s.effort)} · payoff: ${esc(s.payoff)}</span></td>
          <td class="tiny">${esc(s.recommendedOption)} — ${esc((s.options.find((o) => o.letter === s.recommendedOption) || {}).title || '')}</td>
          <td>${badge(s.decisionState, s.decisionState.startsWith('Decided') ? 'green' : 'amber')}</td>
          <td class="tiny"><a href="/suggestions/#${esc(s.id)}">Compare options →</a></td>
        </tr>`
        ).join('\n')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section tint" id="questions">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part two</p>
        <h2>Open questions — the full register is one click away</h2>
        <p>Each question separates what is <b>known</b> from what is <b>missing</b>, and names the cheapest way to find out. The complete register, with answered items and their source links and a discovery plan for the rest, is on <a href="/questions/">the question register</a>.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${QUESTIONS.length} questions.</b> ${QUESTIONS.filter((q) => q.status === 'Answered').length} answered, ${QUESTIONS.filter((q) => q.status !== 'Answered').length} still need information.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Status</th><th scope="col">Question</th>
          <th scope="col">What is missing</th><th scope="col">Register</th>
        </tr></thead>
        <tbody>${QUESTIONS.map((q) => `<tr>
          <td class="mono tiny">${esc(q.id)}</td>
          <td>${badge(q.status, q.status === 'Answered' ? 'green' : q.status === 'Blocked' ? 'red' : 'amber')}</td>
          <td><b>${esc(q.question)}</b></td>
          <td class="tiny">${esc(q.unknown)}</td>
          <td class="tiny"><a href="/questions/#${esc(q.id)}">Full row →</a></td>
        </tr>`).join('\n')}</tbody>
      </table>
    </div>
    <div class="callout mt-3">
      <h4>The pattern in the open questions</h4>
      <p>Most open items need something only the owner has: dashboard access, a decision about identity, or money. That is not a research failure — it is the boundary of what a session without account access can settle. Where the answer is a check anyone with the login could do in ten minutes, the question says so and gives the steps.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part three</p>
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

// --------------------------------------------------------- suggestion board
// The dedicated decision section: every suggestion is a proposal with named
// options, and the rule of the board is that a path is chosen BEFORE anything
// is implemented. Nothing here ships because it is listed here.
export function suggestionsBoardPage() {
  const awaiting = SUGGESTIONS.filter((s) => s.decisionState.startsWith('Awaiting'));
  const decided = SUGGESTIONS.filter((s) => !s.decisionState.startsWith('Awaiting'));

  const optionRows = (s) =>
    s.options
      .map(
        (o) => `<tr${o.letter === s.recommendedOption ? ' class="opt-rec"' : ''}>
      <th scope="row" style="font-weight:600;color:var(--ink-2)">${esc(o.letter)}${o.letter === s.recommendedOption ? ' ' + badge('Recommended', 'green') : ''}</th>
      <td><b>${esc(o.title)}</b><br><span class="tiny muted">${esc(o.what)}</span></td>
      <td class="tiny">${esc(o.effort)}</td>
      <td class="tiny">${esc(o.payoff)}</td>
      <td class="tiny">${esc(o.risk)}</td>
    </tr>`
      )
      .join('\n');

  const proposal = (s) => `
<article class="dec" id="${esc(s.id)}">
  <div class="dh">
    <span class="pri">P${s.priority}</span>
    <h3>${esc(s.title)}</h3>
    ${badge(s.decisionState, s.decisionState.startsWith('Decided') ? 'green' : 'amber')}
  </div>
  <div class="rec"><b>Why it is on the board</b>${esc(s.why)}</div>
  <div class="table-wrap">
    <table>
      <caption><b>${esc(s.id)} — compare the paths, then choose one.</b> This proposal is not implemented until a choice is recorded.</caption>
      <thead><tr>
        <th scope="col">Option</th><th scope="col">What it involves</th>
        <th scope="col">Effort</th><th scope="col">Payoff</th><th scope="col">Risk</th>
      </tr></thead>
      <tbody>${optionRows(s)}</tbody>
    </table>
  </div>
  <div class="callout ${s.decisionState.startsWith('Decided') ? 'green' : 'amber'} gate mt-2">
    <h4>${s.decisionState.startsWith('Decided') ? 'Decision recorded' : 'Decision gate — nothing moves until you choose'}</h4>
    <p><b>Desk recommendation: ${esc(s.recommendedOption)}.</b> ${esc(s.recommendedWhy)}</p>
    <p class="small" style="margin:.35rem 0 0"><b>How to record a decision:</b> ${esc(s.decisionHow)}</p>
  </div>
</article>`;

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Suggestion Board' }],
  kicker: 'Decide before building',
  title: 'Suggestion Board',
  lede: 'Every proposed change to this project, with the realistic paths laid side by side. Review the options, choose the best one, and record the choice — implementation starts only after that. Nothing on this page has been built because it appears here.',
  meta: `<div class="btn-row">
    ${badge(awaiting.length + ' awaiting a decision', 'amber')}
    ${badge(decided.length + ' decided and recorded', 'green')}
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="callout amber">
      <h4>How this board works</h4>
      <p><b>One.</b> Read the proposal and why it is on the board. <b>Two.</b> Compare its options on effort, payoff and risk — the recommended path is marked, but it is a recommendation, not a decision. <b>Three.</b> Record a choice with the suggestion ID and option letter (for example, <code>SUG-01: A</code>) in chat or as a repository issue. <b>Four.</b> Only then is the change implemented, and the state on this page is updated in the same build that ships it.</p>
      <p class="small muted" style="margin:.4rem 0 0">The rule the board exists to enforce: <b>choose the best path before implementing any change.</b> A suggestion without a recorded choice stays a proposal, however loudly it is recommended.</p>
    </div>

    <div class="table-wrap mt-3">
      <table>
        <caption><b>All proposals at a glance.</b> ${awaiting.length} need a decision; ${decided.length} are already decided and recorded below.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Pri</th><th scope="col">Proposal</th>
          <th scope="col">Recommended</th><th scope="col">Decision state</th><th scope="col">Jump</th>
        </tr></thead>
        <tbody>${SUGGESTIONS.map(
          (s) => `<tr>
          <td class="mono tiny">${esc(s.id)}</td>
          <td class="tiny">P${s.priority}</td>
          <td><b>${esc(s.title)}</b></td>
          <td class="tiny">${esc(s.recommendedOption)}</td>
          <td>${badge(s.decisionState, s.decisionState.startsWith('Decided') ? 'green' : 'amber')}</td>
          <td class="tiny"><a href="#${esc(s.id)}">Options →</a></td>
        </tr>`
        ).join('\n')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">The queue</p>
        <h2>Proposals awaiting a decision</h2>
        <p>In review order. Priority 1 means “decide this before the next article is commissioned”.</p>
      </div>
    </div>
    ${awaiting.map(proposal).join('\n')}

    <h3 class="mt-4" style="font-size:1.15rem">Already decided</h3>
    <p class="small muted" style="margin-top:.2rem">Recorded here so the reasoning survives the decision. Implemented items say so; standing policies stay visible so nobody re-litigates them quietly.</p>
    ${decided.map(proposal).join('\n')}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="callout">
      <h4>What this board deliberately does not do</h4>
      <p>It does not rank options by revenue potential, because no revenue has been measured (the campaign ledger is empty and says why). It does not score ideas with invented weights, and it does not mark anything implemented to make the list look productive. A proposal here is cheap; a decision is the expensive part, which is why the gate sits before the build and not after it.</p>
    </div>
  </div>
</section>`;

  return page({
    path: '/suggestions/',
    title: 'Suggestion Board — choose the path before the build | Counterwise',
    description:
      'Every proposed change to this project with named options, effort, payoff and risk. Compare the paths, record a choice, and only then is anything implemented.',
    body,
  });
}

// ------------------------------------------------- open questions register
// The clear list the brief asks for: what is answered (with official sources),
// what is missing, and how the missing information would be discovered.
export function questionsRegisterPage() {
  const answered = QUESTIONS.filter((q) => q.status === 'Answered');
  const missing = QUESTIONS.filter((q) => q.status !== 'Answered');

  const answerRow = (q) => `<tr id="${esc(q.id)}">
    <td class="mono tiny">${esc(q.id)}</td>
    <td><b>${esc(q.question)}</b></td>
    <td>${esc(q.known)}</td>
    <td class="src">${(q.sources || []).map((id) => srcLink(id)).join('<br>') || blank('No source')}</td>
    <td class="tiny">${esc(q.blocks)}</td>
  </tr>`;

  const missingRow = (q) => `<tr id="${esc(q.id)}">
    <td class="mono tiny">${esc(q.id)}</td>
    <td>${badge(q.status, q.status === 'Blocked' ? 'red' : 'amber')}</td>
    <td><b>${esc(q.question)}</b><br><span class="tiny muted">${esc(q.why)}</span></td>
    <td class="tiny">${esc(q.known)}</td>
    <td class="tiny">${esc(q.unknown)} <span class="badge plain tiny">Unverified — no source exists yet</span></td>
    <td class="tiny">${esc(q.howToFind)}</td>
    <td class="tiny">${esc(q.owner)}</td>
    <td class="tiny">${esc(q.blocks)}</td>
  </tr>`;

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Question register' }],
  kicker: 'Know, unknown, find out',
  title: 'Open questions &amp; missing information',
  lede: 'The list a decision should rest on: what this project already knows and can source, what it does not know, and the cheapest suggestion for discovering each missing piece. Answered rows carry their official source. Unanswered rows are labelled unverified rather than filled in.',
  meta: `<div class="btn-row">
    ${badge(answered.length + ' answered, with sources', 'green')}
    ${badge(missing.length + ' open or blocked', 'amber')}
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>What is already known — answered, decided and sourced</h2>
        <p>Each answer is checked against an official document, and the row links that document. These are closed questions; they are kept visible so the reasoning is auditable.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${answered.length} answered questions.</b> Every row carries a link to the official source it was answered from.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Question</th><th scope="col">The answer</th>
          <th scope="col">Official source</th><th scope="col">Note</th>
        </tr></thead>
        <tbody>${answered.map(answerRow).join('\n')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part two</p>
        <h2>What is missing — open and blocked questions</h2>
        <p>The three middle columns are the point of this table: <b>what is known</b>, <b>what is missing</b>, and <b>how to find out</b>. Missing values are labelled unverified and left unfilled; nothing here is inferred.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <caption><b>${missing.length} open questions.</b> An unanswered question has no source by definition; each row states the context instead and never invents an answer.</caption>
        <thead><tr>
          <th scope="col">ID</th><th scope="col">Status</th><th scope="col">Question</th>
          <th scope="col">What is known</th><th scope="col">What is missing</th>
          <th scope="col">How to find out (discovery suggestion)</th>
          <th scope="col">Who can answer</th><th scope="col">Blocks</th>
        </tr></thead>
        <tbody>${missing.map(missingRow).join('\n')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part three</p>
        <h2>The missing-information discovery plan</h2>
        <p>Suggestions made specifically to discover the missing information, in the order they should be run. Each one names what it unlocks. None of them requires a purchase.</p>
      </div>
    </div>
    <div class="prose" style="max-width:74ch">
      <ol>
        ${missing
          .map(
            (q) => `<li style="margin-bottom:.75rem"><b>${esc(q.id)} — ${esc(q.question)}</b><br>${esc(q.howToFind)} <span class="tiny muted">(Owner: ${esc(q.owner)}. Unlocks: ${esc(q.blocks)}.)</span></li>`
          )
          .join('\n')}
      </ol>
      <div class="callout amber mt-3">
        <h4>The pattern in the open questions</h4>
        <p>Most open items need something only the owner has: dashboard access, a decision about identity, or a small budget. That is not a research failure — it is the boundary of what a session without account access can settle. Where the answer is a check anyone with the login could do in ten minutes (Q-01, Q-11, Q-12), the row gives the steps and the time it takes.</p>
      </div>
      <p class="small muted" id="missing-note">Context note: rows in the missing table describe absences. There is no official source for information that does not exist yet, so those rows carry no source link and are marked unverified instead. When a question is answered, its row moves to Part one with the source attached — it is never answered from inference.</p>
    </div>
  </div>
</section>`;

  return page({
    path: '/questions/',
    title: 'Open questions & missing information — what is known, what is not | Counterwise',
    description:
      'The decision register: answered questions with official sources, open questions separated into known and missing, and a discovery plan for every missing piece of information.',
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
        <p class="eyebrow">Register one</p>
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
        <p class="eyebrow">Register two</p>
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
        <p class="eyebrow">Register three</p>
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
        <p class="eyebrow">Register four</p>
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

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div><p class="eyebrow">Register five</p><h2>Content inventory</h2></div></div>
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
    <div class="sec-head"><div><p class="eyebrow">Spot-check</p><h2>What verification actually meant here</h2></div></div>
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
        ['Sitemap and feed', 'Built and validated against the sitemaps.org protocol and RFC-822 dates for RSS.', 'XML parses; every <loc> is on one host; every URL returns 200 in the local link check.'],
      ],
    })}
  </div>
</section>`;

  return page({
    path: '/flagged/',
    title: 'Flagged for Review — unverified items and irregularities | Counterwise',
    description:
      'Nine flagged items with evidence and official sources: untagged short links, unconfirmed intended ASINs, no hands-on testing, withheld prices, and unmeasured traffic.',
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
  lede: 'Four rules, applied to every page. If a page breaks one of them, that is a bug — tell us and it gets fixed or the page comes down.',
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
    <p>Wattage is blank. Counter footprint is blank. Probe length is blank. In each case the listing did not state it in the data this desk could read, and guessing a plausible range is the exact failure mode this project was set up to avoid. A blank with “not stated” beside it is a fact; a plausible number would be a fabrication.</p>
    <p>Every blank is also collected on the <a href="/flagged/">Flagged for Review</a> page with the action that would resolve it.</p>

    <hr>
    <h2>The disclosure, and why it is where it is</h2>
    <p>“As an Amazon Associate I earn from qualifying purchases.” appears in a strip under the masthead on every page and again in the footer. It sits above the content rather than at the end because FTC guidance says disclosures are likely to be missed when they appear only on an about page or at the end of a post, and that they should be placed where they are hard to miss. The exact wording is the sentence named in section 5 of the Associates Program Operating Agreement.</p>

    <h2>What this site is not</h2>
    <ul>
      <li>It is not endorsed, sponsored or reviewed by Amazon. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</li>
      <li>It is not a consumer testing organisation. It compares published specifications.</li>
      <li>It is not impartial in the sense of having no stake. It earns commission if you buy through its links, and says so at the top of every page.</li>
    </ul>

    <h2>Corrections</h2>
    <p>If something here is wrong, the fastest route is an issue on the repository behind this site. Corrections are logged, and a correction that changes a claim is dated on the page it changes.</p>
  </div>
</section>`;

  return page({
    path: '/methods/',
    title: 'How we choose — standards and limits | Counterwise',
    description:
      'The four rules behind every page: no hands-on claim without the product, no prices or ratings, tagged sponsored links, and blanks instead of guesses.',
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
    <p>Static HTML generated from a small data file, served by GitHub Pages. No database, no framework, no third-party script, no cookie set by the site’s own code. The sitemap and RSS feed are regenerated by the same build that writes the pages, so a new guide cannot be published without appearing in both.</p>
    <p>You can read the registers that drive it: the <a href="/data-room/">Data Room</a> holds the product-intent record, the source register and the measurement schema; the <a href="/flagged/">Flagged for Review</a> page holds everything that could not be confirmed.</p>

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
  lede: 'What was built, what it can and cannot claim, what it needs from you, and the four decisions that carry the most weight.',
  meta: `<p class="tiny muted" style="margin:0">Build ${esc(SITE.buildDate)} · associate tag ${esc(SITE.associateTag)} · 5 products · 5 guides · 11 official sources</p>`,
})}
<section class="section">
  <div class="wrap-narrow prose">
    <h2>In one paragraph</h2>
    <p>A five-product kitchen shop — three air fryers, two thermometers — built as a static publication with every Amazon link tagged and marked sponsored, the required Associates disclosure above the masthead on every page, no prices or ratings shown for policy reasons, and every unverifiable value left blank and flagged. The site reads as a buyer’s publication rather than an audit, with the registers kept in a separate Data Room and the outstanding items on a Flagged for Review page.</p>

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
      <li>The sitemap and RSS feed are generated by the build, so a new guide cannot ship without being listed in both.</li>
    </ul>

    <h2>What it cannot claim, and will not</h2>
    <ul>
      <li><b>No hands-on testing.</b> None of the five products has been handled. Every page says so.</li>
      <li><b>No traffic, clicks, orders or revenue.</b> No analytics endpoint is deployed, so nothing has been measured. The campaign ledger is empty by design.</li>
      <li><b>No confirmation that the supplied short links credit your account.</b> The resolved URLs carry no tag; the site uses tagged canonical links instead.</li>
      <li><b>No ranking or price comparison.</b> Five products in two categories is a shop, not a market.</li>
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

    <h2>What you can review, in order</h2>
    <ol>
      <li><a href="/decisions/">Decision Room</a> — ${SUGGESTIONS.length} suggestions ordered by priority, ${QUESTIONS.length} questions split into known and unknown, and the options rejected with sources.</li>
      <li><a href="/flagged/">Flagged for Review</a> — ${FLAGS.length} items that could not be confirmed, each with evidence and the shortest route to closing it.</li>
      <li><a href="/data-room/">Data Room</a> — the product-intent record, the source register, the five events, and the empty ledger with its schema.</li>
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
