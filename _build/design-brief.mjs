// design-brief.mjs — "Design brief & topic lab" surface (session arena-91306b24, S17).
//
// This is a SUGGESTION surface, not an implementation. Its job is to give the
// owner one place to review, score and choose:
//   1. design directions that can be fed straight into a design prompt, so the
//      site reads as a polished marketing publication rather than generated text;
//   2. question-shaped topic hypotheses for future guides, each with the
//      measurement that must exist before it is promoted;
//   3. the questions that must be answered, and what would close each, before a
//      decision can reasonably be made.
//
// Nothing here is implemented, and nothing here is a claim about popularity,
// demand, search volume, price, rating or hands-on performance. Every design
// rationale is tied to a source the build already verifies (A2, F1, G1, G2).
// Every topic is labelled an editorial hypothesis. The implementation queue
// lives at /suggestions/; this page feeds it.

import { SITE } from './data.mjs';
import { esc, page, pageHead, table, srcLink, badge, blank } from './core.mjs';

// --------------------------------------------------------------------------
// 1. Design directions — each is a reviewable proposal with a ready-to-paste
//    prompt fragment. `prompt` is a fragment, not a finished brief: it is meant
//    to be chosen, edited and then handed to whoever (or whatever) designs.
// --------------------------------------------------------------------------
const DESIGN_DIRECTIONS = [
  {
    id: 'D1',
    name: 'Named authorship on every surface',
    summary:
      'A named human desk with a two-line biography on the front page, guides and product pages, not “the team”.',
    what:
      'Add a consistent byline block (author, role, one or two lines of provenance) to the front page, every guide, worksheet and product page. Keep the existing “this desk has not handled any of these products” note next to it.',
    why:
      'Google’s site-reputation guidance weighs stated authorship, and an unauthored affiliate article is its own example of the problem. FTC guidance requires the material connection to be hard to miss; an accountable desk makes the disclosure credible.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'None measured. The byline must not imply hands-on testing (FTC: no experience claims for untried products).',
    prompt:
      'Design a byline block: a named author, a one-line role, and a one-line provenance note. Tone is a small editorial desk, not a brand department. It never implies hands-on testing.',
    sources: ['G2', 'F1'],
  },
  {
    id: 'D2',
    name: 'One confident visual identity, not a default template',
    summary:
      'A single restrained palette, one type pairing and one mark, carried consistently across every page and asset.',
    what:
      'Lock one palette and type stack in site.css and apply it everywhere. Replace any generic gradient/hero treatment with the existing editorial photography and the Counterwise mark. Remove decorative effects that add no information.',
    why:
      'A consistent identity is what separates a publication from a generated page. It also makes the disclosure band and the sponsored marking read as intentional design, not an appended warning.',
    effort: 'Medium',
    reversible: 'Yes',
    risk: 'Low. Imagery must stay original and labelled — the IP License forbids storing Amazon product imagery, so a static page must not reproduce listing photography.',
    prompt:
      'Design one visual identity: a single restrained palette, one serif/sans pairing, one mark. No generic gradients, no stock-looking decoration. Every page uses the same identity.',
    sources: ['A2'],
  },
  {
    id: 'D3',
    name: 'Product-first hero with one primary decision',
    summary:
      'The first screen names the job and offers one action — start with the chooser or a category — before anything about method.',
    what:
      'Keep the front page leading with the five picks and the 30-second chooser. Ensure the first screen has exactly one primary action and that the method/process copy sits below it.',
    why:
      'A buyer acts when the page answers “which one is for me” immediately. Leading with the verification process is what makes a site read like an audit rather than a shop.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'None measured. The chooser must not collect data or promise a price.',
    prompt:
      'Design a product-first hero: one headline about the job, one primary action, the five picks visible immediately. Method and process copy goes below the first screen.',
    sources: ['G2'],
  },
  {
    id: 'D4',
    name: 'Voice guardrails that kill filler',
    summary:
      'A written rule set for prose: no generic summary sentences, no “in conclusion”, no restating the spec as a sentence.',
    what:
      'Publish a short style rule set on /methods/: every paragraph must make a specific claim, a trade-off, or a source. Delete any sentence that could sit on any site. Add a check to the build that fails on known filler phrases.',
    why:
      '“AI slop” is filler plus generic summary. Concrete, opinionated, source-bound prose is the cheapest way to read as a publication, and it is fully under the owner’s control.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'Low. The rule must not force a hands-on or performance claim; it constrains form, not claims.',
    prompt:
      'Write a voice rule set: every paragraph makes a specific claim, a trade-off, or cites a source. No generic summary, no restating a spec as prose, no empty transitions.',
    sources: ['F1', 'A2'],
  },
  {
    id: 'D5',
    name: 'A visible editorial cadence',
    summary:
      'A public calendar showing the next guides and the publishing rhythm, so the site reads as ongoing rather than a one-off batch.',
    what:
      'Add a cadence panel to /guides/ or the front page: the next two planned guides as hypotheses, the rhythm (one a fortnight), and the rule that a guide ships only after the previous one is measured.',
    why:
      'Google treats mass-generated pages without user value as scaled content abuse. A slow, visible, gated cadence is the opposite signal, and it gives a reader a reason to return.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'None measured. The calendar lists hypotheses and dates, never popularity or demand claims.',
    prompt:
      'Design a compact cadence panel: the next two planned guides as labelled hypotheses, the rhythm, and the rule that each guide is measured before the next is written.',
    sources: ['G2'],
  },
  {
    id: 'D6',
    name: 'Decision-first product pages, evidence beneath',
    summary:
      'Every product page opens with a verdict panel (buy it if / skip it if / also consider), then the listing evidence.',
    what:
      'Confirm the verdict panel sits above the specification grid on all five product pages, and that the evidence below it is unchanged and sourced.',
    why:
      'Buyers decide on fit, then verify on specs. A verdict-first page answers the real question and keeps the sourced evidence available for the reader who wants it.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'None measured. The verdict is an editorial fit judgement from listing data, never a hands-on result.',
    prompt:
      'Design a product page that opens with a verdict panel: buy it if / skip it if / also consider. The sourced specification evidence sits beneath, unchanged.',
    sources: ['F1'],
  },
  {
    id: 'D7',
    name: 'Original imagery, always labelled',
    summary:
      'Generated editorial illustrations with captions stating they are representative of the category, never the reviewed unit.',
    what:
      'Keep the existing generated artwork and ensure every image carries a caption that says it is representative of the category. Never add Amazon listing photography or logos as decoration.',
    why:
      'The IP License restricts storing and caching Program Content, including images. Original, labelled artwork is both compliant and a stronger publication signal than borrowed product shots.',
    effort: 'Low',
    reversible: 'Yes',
    risk: 'Low. The caption wording is the compliance control; it must not imply the image is the reviewed unit.',
    prompt:
      'Design with original illustrations only. Every image is captioned as representative of the category, never as the reviewed product.',
    sources: ['A2'],
  },
  {
    id: 'D8',
    name: 'Cluster interlinking and structured data',
    summary:
      'Question guides cross-link within their cluster and carry Article/FAQ structured data, so search engines get one coherent site.',
    what:
      'Confirm each guide links to its cluster hub and the comparison table, and add Article (or FAQPage where a page answers recurring questions) JSON-LD to guides and the FAQ matrix.',
    why:
      'Internal clustering helps a search engine understand one site rather than many loose pages, and structured data makes the question-and-answer shape explicit.',
    effort: 'Medium',
    reversible: 'Yes',
    risk: 'Low. Structured data must match visible content; it must not add claims the page does not make.',
    prompt:
      'Add Article/FAQ JSON-LD to guides and the FAQ matrix, and ensure every guide cross-links to its cluster hub and the comparison table.',
    sources: ['G1', 'G3'],
  },
];

// --------------------------------------------------------------------------
// 2. Topic hypotheses — question-shaped, timely, and explicitly hypotheses.
//    These are candidate guides, not claims about popularity, demand, search
//    volume, or product superiority. `gate` is what must exist before the topic
//    is promoted to a published guide.
// --------------------------------------------------------------------------
const TOPIC_HYPOTHESES = [
  {
    id: 'T1',
    question: 'Two baskets or one big basket: which actually finishes dinner first?',
    cluster: 'Air fryers',
    serves: 'CHEFMAN 6 qt dual basket · CHEFMAN 8 qt TurboFry',
    angle:
      'Frame the dual-basket vs single-basket choice as a timing question, using the stated capacities and the sync-finish claim as the comparison, with the trade-off stated as a judgement from listing data.',
    why:
      'The two air fryers in the set are structurally different answers to the same job, so a timing-framed question is a natural decision page. It is a hypothesis about what a buyer asks, not a claim about what is popular.',
    gate:
      'Confirm the comparison against the listing evidence, then measure whether readers reach the comparison table before deciding.',
  },
  {
    id: 'T2',
    question: 'Does a French-door countertop oven fit a kitchen that only has a drawer-style air fryer spot?',
    cluster: 'Air fryers',
    serves: 'Emeril Lagasse 26 qt French door',
    angle:
      'Compare form factor and counter-space trade-offs between a drawer and a French-door cavity, and state clearly what the listing does and does not say about footprint.',
    why:
      'Form-factor and counter-space are the most common objection to a larger machine. This is a fit question a buyer can act on without any hands-on claim.',
    gate:
      'Measure which product page readers reach from the category hub, and whether the counter-space worksheet is used.',
  },
  {
    id: 'T3',
    question: 'How do you clean an air fryer you actually use every day?',
    cluster: 'Air fryers',
    serves: 'All three air fryers',
    angle:
      'Turn the cleanup question into a checklist grounded in the stated dishwasher-safe and nonstick claims, and be explicit that cleaning performance is a claim, not a tested result.',
    why:
      'Cleanup is a recurring objection and a natural checklist. It reuses existing worksheet material without inventing a result.',
    gate:
      'Measure the cleanup worksheet’s usage and whether readers continue to a product page after using it.',
  },
  {
    id: 'T4',
    question: 'Smart thermometer or instant-read: which one watches your cook?',
    cluster: 'Thermometers',
    serves: 'ThermoMaven 1-second · CHEF iQ Sense Gen3',
    angle:
      'Separate “checking a number” from “watching a cook”, and map each thermometer to the job it is stated to do, without ranking them on any performance claim.',
    why:
      'The two thermometers answer different jobs, so a choosing question is the honest editorial spine. It is a hypothesis, not a popularity claim.',
    gate:
      'Measure which thermometer page readers reach from the comparison table, and the outbound-click rate once measurement is live.',
  },
  {
    id: 'T5',
    question: 'How often should you check a meat thermometer’s accuracy?',
    cluster: 'Thermometers',
    serves: 'Both thermometers',
    angle:
      'A calibration checklist that cites the safe-temperature chart as the reference, and states the accuracy figures as manufacturer claims rather than this desk’s measurements.',
    why:
      'Calibration is a practical, recurring question that ties directly to an official food-safety source. It is a hypothesis about usefulness, not demand.',
    gate:
      'Measure whether the calibration worksheet is used and whether readers follow it to a product page.',
  },
  {
    id: 'T6',
    question: 'What can one air fryer actually cook for a whole table?',
    cluster: 'Air fryers',
    serves: 'CHEFMAN 8 qt TurboFry',
    angle:
      'Use the stated capacity to work out a realistic single-batch serving question, and state the arithmetic and its limits rather than a tasted result.',
    why:
      'Capacity arithmetic is a decision a buyer can act on, and it demonstrates the site’s method without a hands-on claim. It is a hypothesis.',
    gate:
      'Measure whether the capacity worksheet and the relevant product page are reached together.',
  },
  {
    id: 'T7',
    question: 'Is a wireless probe worth it if you only grill occasionally?',
    cluster: 'Thermometers',
    serves: 'CHEF iQ Sense Gen3',
    angle:
      'Frame the wireless probe against the stated use cases (long cooks, watching from another room) and state plainly what the listing does not establish.',
    why:
      '“Is it worth it” is the exact question a buyer types, and answering it from stated use cases is a fit judgement, not a performance claim. It is a hypothesis.',
    gate:
      'Measure the guide-to-product path and the outbound click before promoting it beyond the queue.',
  },
];

// --------------------------------------------------------------------------
// 3. Questions that must be answered before a decision can be made.
//    `know` = what is established, `unknown` = what is not, `closes` = the
//    action or source that resolves it.
// --------------------------------------------------------------------------
const OPEN_QUESTIONS = [
  {
    id: 'Q1',
    question: 'Do the five supplied short links credit this account?',
    know:
      'All five resolve to live listings; the resolved ASINs and titles match the register. None of the resolved URLs carried a visible tag parameter.',
    unknown:
      'Whether each link.amazon short link is an approved Special Link for this account, and whether it credits the shopnow047c-20 tag.',
    closes:
      'Mint one link per product in Associates Central and compare the parameters and the tracking report. This is an owner action (Associates Central login required).',
  },
  {
    id: 'Q2',
    question: 'What is the intended ASIN for each product?',
    know:
      'The observed redirect ASIN is recorded for all five and stored separately from the intended field.',
    unknown: 'The intended ASIN for each of the five; the field is deliberately blank and never inferred.',
    closes:
      'Owner confirmation against the enrollment record. Until then the field stays blank and the two fields are never merged.',
  },
  {
    id: 'Q3',
    question: 'Is the published tag format correct for this account?',
    know:
      'The site publishes tagged canonical /dp/ links carrying the supplied tag, and the tag value is taken from the owner’s brief.',
    unknown:
      'Whether shopnow047c-20 is the active Associate ID for the account that will receive commission, and whether the tag parameter matches what Associates Central generates.',
    closes:
      'Compare a generated link from Associates Central against the published format. Owner action.',
  },
  {
    id: 'Q4',
    question: 'Who is the named author and desk?',
    know:
      'The site currently presents a single-desk editorial project and states it does not operate a test kitchen.',
    unknown: 'A specific named person (or named desk) to attach to bylines and structured data.',
    closes:
      'Owner decision. Google’s site-reputation guidance weighs stated authorship; F1 requires the material connection to be clear.',
  },
  {
    id: 'Q5',
    question: 'Which brand name is canonical?',
    know:
      'The canonical publication is “Counterwise”. Preserved /go/ exit pages from an earlier generation use “The Crisp Kitchen”.',
    unknown: 'The single brand the owner wants published everywhere.',
    closes:
      'One owner decision, then one template change. Recorded as a flag until resolved.',
  },
  {
    id: 'Q6',
    question: 'Is the measurement endpoint deployed?',
    know:
      'The collector worker and schema ship in /analytics/, and the five events are frozen. No endpoint is running.',
    unknown: 'Whether an endpoint is live, and therefore whether any click, conversion or topic signal exists.',
    closes:
      'Deploy the supplied worker and set one endpoint line in site.js, then collect for a defined period. Owner action.',
  },
  {
    id: 'Q7',
    question: 'Is Search Console verified and the sitemap submitted?',
    know:
      'sitemap.xml, robots.txt and the RSS feed are generated and valid; the sitemap follows the sitemaps.org protocol.',
    unknown: 'Whether the property is verified and the sitemap has actually been submitted.',
    closes:
      'Owner verification token and submission in Search Console. Owner action.',
  },
  {
    id: 'Q8',
    question: 'Which design directions from this page should be adopted?',
    know:
      'Each direction below carries its rationale, effort, reversibility and failure mode, and is tied to a verified source.',
    unknown: 'Which ones the owner wants to fund and in what order.',
    closes:
      'Owner review and selection on this page, then implementation through the normal build. Nothing is implemented from a suggestion without this step.',
  },
  {
    id: 'Q9',
    question: 'Which topic hypotheses become the next published guides?',
    know:
      'Each topic is question-shaped, tied to a product cluster, and labelled a hypothesis with a measurement gate.',
    unknown: 'Which topics a reader actually finds useful — that is a measurement question, not an instinct question.',
    closes:
      'Once measurement is live (Q6), rank the queue by measured reader behaviour and publish the highest-signal topic first.',
  },
];

// --------------------------------------------------------------------------
// 4. Decision paths — choose one before implementing anything.
// --------------------------------------------------------------------------
const DECISION_PATHS = [
  {
    id: 'A',
    name: 'Polish what exists',
    description:
      'Adopt the low-effort, fully reversible directions first (D1, D3, D4, D5, D6). No new build work, no new claims, lowest risk.',
    tradeoff: 'Fastest to ship; gains polish without changing scope.',
  },
  {
    id: 'B',
    name: 'Strengthen identity and trust',
    description:
      'Adopt D2, D7 and D8 alongside A. This is the path that most directly moves the site from “generated” to “published” in how it reads and how it is indexed.',
    tradeoff: 'Moderate effort; needs a consistent design pass and structured-data review.',
  },
  {
    id: 'C',
    name: 'Add the topic lab and measurement first',
    description:
      'Publish this topic queue, deploy measurement (Q6), and let measured reader behaviour choose the next guide. Directions follow the winning topics.',
    tradeoff: 'Highest long-term value; depends on the analytics endpoint being deployed before any topic is promoted.',
  },
];

// --------------------------------------------------------------------------
// Rendering
// --------------------------------------------------------------------------
function directionRow(d) {
  return `<tr>
    <td><strong>${esc(d.id)}</strong></td>
    <td>${esc(d.name)}${d.summary ? `<div class="tiny faint">${esc(d.summary)}</div>` : ''}</td>
    <td>${esc(d.what)}</td>
    <td>${esc(d.why)}</td>
    <td>${esc(d.effort)}</td>
    <td>${esc(d.reversible)}</td>
    <td>${d.sources.map((s) => srcLink(s, s)).join(' · ')}</td>
  </tr>`;
}

function directionCard(d) {
  return `<article class="card">
    <span class="badge">${esc(d.id)}</span>
    <h3>${esc(d.name)}</h3>
    <p class="lede">${esc(d.summary)}</p>
    <div class="spec-grid">
      <div><span class="tiny faint">What changes</span><p>${esc(d.what)}</p></div>
      <div><span class="tiny faint">Why it helps a reader</span><p>${esc(d.why)}</p></div>
      <div><span class="tiny faint">Effort · reversible</span><p>${esc(d.effort)} · ${esc(d.reversible)}</p></div>
      <div><span class="tiny faint">Failure mode to watch</span><p>${esc(d.risk)}</p></div>
    </div>
    <details class="callout">
      <summary>Prompt fragment — ready to paste into a design brief</summary>
      <pre>${esc(d.prompt)}</pre>
      <p class="tiny faint">Source: ${d.sources.map((s) => srcLink(s, s)).join(' · ')}</p>
    </details>
  </article>`;
}

function topicRow(t) {
  return `<tr>
    <td><strong>${esc(t.id)}</strong></td>
    <td>${esc(t.question)}</td>
    <td>${esc(t.cluster)}</td>
    <td>${esc(t.serves)}</td>
    <td>${esc(t.gate)}</td>
  </tr>`;
}

function topicCard(t) {
  return `<article class="card">
    <span class="badge">${esc(t.id)}</span>
    <span class="tag">${esc(t.cluster)}</span>
    <h3>${esc(t.question)}</h3>
    <p class="lede">${esc(t.angle)}</p>
    <div class="spec-grid">
      <div><span class="tiny faint">Serves</span><p>${esc(t.serves)}</p></div>
      <div><span class="tiny faint">Why it could work</span><p>${esc(t.why)}</p></div>
      <div><span class="tiny faint">Promote only after</span><p>${esc(t.gate)}</p></div>
    </div>
  </article>`;
}

function questionRow(q) {
  return `<tr>
    <td><strong>${esc(q.id)}</strong></td>
    <td>${esc(q.question)}</td>
    <td>${esc(q.know)}</td>
    <td>${esc(q.unknown)}</td>
    <td>${esc(q.closes)}</td>
  </tr>`;
}

export function designBriefPage() {
  const body = `
<div class="page-head">
  <div class="wrap">
    <p class="kicker">Design brief · topic lab · decision input</p>
    <h1>What this site should look like, and what to write next</h1>
    <p class="lede">
      Everything on this page is a suggestion to review, not a change already made.
      The design directions below are ready to feed into a design prompt. The topic
      hypotheses are candidate guides, each with the measurement that must exist
      before it is promoted. The questions are the ones that must be answered before
      any decision can reasonably be made.
    </p>
    <p class="tiny faint">
      Read this with the
      <a href="/suggestions/">implementation queue</a> and the
      <a href="/data-room/">Data Room</a>. Nothing here is implemented without an
      owner choice. No topic below is a claim about popularity, demand, search
      volume or product superiority.
    </p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <h2>How to use this page</h2>
    <ol class="prose">
      <li><strong>Choose a design path</strong> from the three options at the bottom of this page, or pick individual directions.</li>
      <li><strong>Read the rationale and failure mode</strong> for each direction before adopting it — each is tied to a source.</li>
      <li><strong>Treat every topic as a hypothesis.</strong> Publish a topic only after its measurement gate exists and a reader signal says it is useful.</li>
      <li><strong>Answer the open questions</strong> that block the decision you want to make. Owner-only actions are marked as such.</li>
      <li><strong>Do not implement from a suggestion</strong> without choosing it here. The build gate still runs on every change.</li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Design directions — feed these into the design prompt</h2>
    <p class="lede">
      Each direction is a reviewable proposal with a ready-to-paste prompt fragment.
      “Effort” and “reversible” are the owner’s decision inputs; the failure mode is
      what the change must not break. Sources are the pages that justify the change.
    </p>
    <div class="table-wrap">
      <table>
        <caption>Design directions, at a glance</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Direction</th><th scope="col">What changes</th><th scope="col">Why it helps a reader</th><th scope="col">Effort</th><th scope="col">Reversible</th><th scope="col">Source</th></tr></thead>
        <tbody>${DESIGN_DIRECTIONS.map(directionRow).join('')}</tbody>
      </table>
    </div>
    <div class="cards c2" style="margin-top:1.5rem">
      ${DESIGN_DIRECTIONS.map(directionCard).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Topic hypotheses — what to write next</h2>
    <p class="lede">
      Question-shaped candidate guides, each tied to a product cluster and labelled an
      editorial hypothesis. They are working titles, not claims about popularity,
      search volume, demand or product superiority. Each carries the measurement that
      must exist before it is promoted to a published guide.
    </p>
    <div class="table-wrap">
      <table>
        <caption>Topic hypotheses, at a glance</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Candidate guide (question)</th><th scope="col">Cluster</th><th scope="col">Serves</th><th scope="col">Promote only after</th></tr></thead>
        <tbody>${TOPIC_HYPOTHESES.map(topicRow).join('')}</tbody>
      </table>
    </div>
    <div class="cards c2" style="margin-top:1.5rem">
      ${TOPIC_HYPOTHESES.map(topicCard).join('')}
    </div>
    <p class="tiny faint mt-1">
      Publishing rule: one guide a fortnight, each added to the existing
      <a href="/sitemap.xml">sitemap</a> and <a href="/feed.xml">feed</a> on publication,
      and the next topic chosen from measured reader behaviour once measurement is live.
    </p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Questions to answer before deciding</h2>
    <p class="lede">
      A decision is only reasonable once the blockers below are answered. “What we know”
      and “what we do not” are separated deliberately; where a value cannot be confirmed
      from an official source, it stays blank and is flagged rather than inferred.
    </p>
    <div class="table-wrap">
      <table>
        <caption>Open questions, known information, and what would close each</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Question</th><th scope="col">What we know</th><th scope="col">What is not known</th><th scope="col">What closes it</th></tr></thead>
        <tbody>${OPEN_QUESTIONS.map(questionRow).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Choose a path before implementing</h2>
    <p class="lede">
      Three paths, in increasing scope. Choose one; individual directions can be
      adopted inside any path. Nothing is built until a path is chosen here.
    </p>
    <div class="cards c3">
      ${DECISION_PATHS.map(
        (p) => `<article class="card">
        <span class="badge">Path ${esc(p.id)}</span>
        <h3>${esc(p.name)}</h3>
        <p class="lede">${esc(p.description)}</p>
        <p class="tiny faint">${esc(p.tradeoff)}</p>
        <p class="mt-1"><a class="btn ghost" href="/suggestions/">Review in the implementation queue →</a></p>
      </article>`
      ).join('')}
    </div>
    <p class="tiny faint mt-1">
      After a path is chosen, the change is implemented through the normal build, re-verified
      line by line against the official sources, and published only when the gate passes.
    </p>
  </div>
</section>
`;

  return page({
    path: '/design-brief/',
    title: 'Design brief & topic lab — Counterwise',
    description:
      'Reviewable design directions with ready-to-paste prompt fragments, question-shaped topic hypotheses, and the open questions that must be answered before any decision is made.',
    body,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${SITE.name} — Design brief & topic lab`,
      description:
        'Reviewable design directions, topic hypotheses, and open questions for the Counterwise affiliate publication.',
    },
  });
}
