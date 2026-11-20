// design.mjs — the Design Room.
//
// WHY THIS PAGE EXISTS. The brief asks for suggestions that feed the prompt
// to design the site, and for a place where a person can review suggestions
// and choose a path before anything is implemented. The Decision Room does
// that for the site's operations. This page does it for the site's *design*:
// what the thing should look like, what it should say, and how it should earn
// a reader who arrived from a search.
//
// Nothing on this page is a promise. Each row states what changes, what it
// costs, whether it can be undone, and what would have to be true first. The
// prompt in Part two is a starting point to be edited, not a specification to
// be obeyed — and it carries the same rule as the rest of the site: if a
// value cannot be confirmed from an official source, it stays blank.
//
// Last verified: 2026-11-20 (UTC)

import { SITE, SOURCES, PRODUCTS, GUIDES } from './data.mjs';
import { esc, url, page, table, badge, srcLink, listingMark, deskMark, crumbs } from './core.mjs';

// ---------------------------------------------------------------------------
// Part one — the design directions.
//
// Each row is a change a person could approve or reject. `goal` names the
// brief goal it serves, so the choice is made against an objective rather
// than against taste.
// ---------------------------------------------------------------------------
const DIRECTIONS = [
  {
    id: 'D-01',
    change: 'Keep the editorial photography, and give every page a full-bleed image instead of a stock thumbnail.',
    goal: 'Read like a publication, not like an affiliate directory',
    cost: 'Done — 11 generated photographs are already in the build',
    reversible: 'Yes — a CSS change swaps the treatment',
    needs: 'Nothing. This is already live.',
    source: 'G2',
  },
  {
    id: 'D-02',
    change: 'Open the front page with a three-way chooser — “two foods at once”, “one big thing”, “checking or watching” — that routes a reader to the right category in one click.',
    goal: 'Turn a browse into a decision',
    cost: 'Half a day of build work; no new writing',
    reversible: 'Yes',
    needs: 'Nothing. The three questions already exist on the comparison page.',
    source: 'G2',
  },
  {
    id: 'D-03',
    change: 'Make the comparison table the landing surface for every guide: each guide ends with the same table, filtered to its cluster.',
    goal: 'One page that converts, linked from every page that describes',
    cost: 'Done — the table is built; the per-guide filter is a small change',
    reversible: 'Yes',
    needs: 'Nothing.',
    source: 'G2',
  },
  {
    id: 'D-04',
    change: 'Publish a one-page printable worksheet per guide (a capacity checklist, a cleanup checklist, a safe-temperature card) as plain HTML that prints cleanly.',
    goal: 'Earn links and saves without collecting a single personal detail',
    cost: 'Two days of writing; no tools, no accounts, no form',
    reversible: 'Yes',
    needs: 'A decision that the site stays free of mailing-list capture (DQ-09).',
    source: 'A2',
  },
  {
    id: 'D-05',
    change: 'Put a “the short answer” box at the top of every guide: three sentences and one number, before the argument.',
    goal: 'Match the intent a searcher actually typed',
    cost: 'An afternoon across five guides',
    reversible: 'Yes',
    needs: 'Nothing. The answer already exists in each guide.',
    source: 'G2',
  },
  {
    id: 'D-06',
    change: 'Give each cooking moment its own seasonal landing page, and date-stamp it, so a reader arriving in November sees something that was published in November.',
    goal: 'Look alive, and match a seasonal query',
    cost: 'One page per moment; the moments are already written down',
    reversible: 'Yes — seasonal pages can be retired like any other',
    needs: 'The measurement endpoint, so the choice is data-led (DQ-02).',
    source: 'G2',
  },
  {
    id: 'D-07',
    change: 'Show a “last checked” date on every product page and publish a change log, so a reader can see when the specification was last confirmed.',
    goal: 'Trust, and the defence against a stale spec',
    cost: 'Small build change; a re-check per product per cycle',
    reversible: 'Yes',
    needs: 'A decision on the re-check interval (DQ-10).',
    source: 'G2',
  },
  {
    id: 'D-08',
    change: 'Replace the category photographs with photographs of the actual units, once one has been bought.',
    goal: 'Move from specification shop to review shop',
    cost: 'The price of one unit and a photo shoot',
    reversible: 'No — money is spent either way',
    needs: 'Approval of the spend (DQ-03) and the brand’s permission (Q-14).',
    source: 'F1',
  },
  {
    id: 'D-09',
    change: 'Add a visible “what changed” note to the top of each guide when it is edited, and keep the edit date on the page.',
    goal: 'Make the site look maintained rather than generated',
    cost: 'An afternoon',
    reversible: 'Yes',
    needs: 'Nothing.',
    source: 'G2',
  },
  {
    id: 'D-10',
    change: 'Stop the site asking for an email address anywhere, and put the RSS feed where the sign-up box used to be.',
    goal: 'Keep the promise the site can actually keep',
    cost: 'Done',
    reversible: 'Yes',
    needs: 'Nothing. The forms are already removed (FLG-008).',
    source: 'A2',
  },
];

// ---------------------------------------------------------------------------
// Part three — the organic-traffic playbook.
//
// Every lever states what the build already does and the official rule that
// justifies it. A lever with no official rule behind it is an opinion, and it
// is listed as one.
// ---------------------------------------------------------------------------
const LEVERS = [
  {
    lever: 'Question-shaped titles',
    does: 'Every guide title is the question a buyer would type, not a product name.',
    source: 'G2',
  },
  {
    lever: 'One site, one brand',
    does: 'Superseded generations are retired with noindex and a banner, so only one site competes in search on this host.',
    source: 'G2',
  },
  {
    lever: 'Sitemap and feed generated from the same data as the pages',
    does: 'A page cannot ship without being listed in sitemap.xml and feed.xml; the build fails if the two disagree.',
    source: 'G3',
  },
  {
    lever: 'A real author and a real contact route',
    does: 'Every article carries a byline and a date; the contact route is still open (Q-07).',
    source: 'G2',
  },
  {
    lever: 'A fixed, slow publishing cadence',
    does: 'Fortnightly, chosen from measured queries once the endpoint is live (DQ-05).',
    source: 'G2',
  },
  {
    lever: 'Original images with alt text',
    does: 'Nine generated editorial photographs, each captioned as representative of the category rather than as the reviewed unit.',
    source: 'G2',
  },
  {
    lever: 'Outbound links marked',
    does: 'Every product link carries rel="sponsored nofollow noopener" and the Associate tag.',
    source: 'G1',
  },
  {
    lever: 'A table of contents on long guides',
    does: 'Each guide opens with an in-this-guide list so a reader can jump to the question they arrived with.',
    source: 'G2',
  },
];

// ---------------------------------------------------------------------------
// Part four — the questions that must be answered before a design decision is
// reasonable. Each row says what is known, what is missing, and the cheapest
// way to find the missing part.
// ---------------------------------------------------------------------------
const DESIGN_QUESTIONS = [
  {
    id: 'DQ-A',
    question: 'Who is the reader, in one sentence?',
    known: 'Someone with a specific kitchen job to do who is choosing between three shapes of machine and does not trust a list.',
    missing: 'Whether the reader cooks for one or for a household, and whether they have counter space to spare.',
    how: 'Five conversations, or one analytics report once the endpoint exists. There is no way to infer it from the page.',
    who: 'The owner',
    source: 'G2',
  },
  {
    id: 'DQ-B',
    question: 'Should the site look like a magazine, or like a reference manual?',
    known: 'The brief says polished marketing site; the current build is a hybrid — a magazine front page over a reference back end.',
    missing: 'Whether the owner wants a voice (a byline with opinions) or a voice-less spec manual.',
    how: 'Answer DQ-C first; the voice follows the answer.',
    who: 'The owner',
    source: 'G2',
  },
  {
    id: 'DQ-C',
    question: 'Who signs the work, and what is the contact route for corrections?',
    known: 'The site currently signs itself “The Counterwise desk” and gives no address.',
    missing: 'A name and an inbox a reader can actually write to.',
    how: 'Owner decision. Ten minutes, and it changes the footer of every page.',
    who: 'The owner',
    source: 'G2',
  },
  {
    id: 'DQ-D',
    question: 'Should the site ever ask for an email address?',
    known: 'The forms were removed because a submit button that discards an address is worse than no form. The RSS feed is the follow path.',
    missing: 'Whether a mailing provider will ever be chosen, and on what lawful basis.',
    how: 'Owner decision. Do not re-add a form before this is answered.',
    who: 'The owner',
    source: 'A2',
  },
  {
    id: 'DQ-E',
    question: 'How many categories, and when?',
    known: 'Five products in two adjacent categories is a coherent shop. The build takes a new category as a data file.',
    missing: 'Whether the owner has a second set of links, and whether the first category has been exhausted.',
    how: 'Look at the link supply, and at the measured queries once they exist.',
    who: 'The owner',
    source: 'G2',
  },
  {
    id: 'DQ-F',
    question: 'What may the site never show, whatever it is worth?',
    known: 'No price, no star rating, no Amazon popularity position, no hands-on verdict — because the build cannot keep them current, and the policy and the FTC both forbid the last one.',
    missing: 'Nothing. This is settled and enforced by the build.',
    how: 'Already answered. Enforced by rules R2, R3 and R4.',
    who: 'Settled',
    source: 'A2',
  },
  {
    id: 'DQ-G',
    question: 'How long until a new guide is worth writing?',
    known: 'The site publishes five guides, on a fortnightly cadence proposal, with no measurement behind it yet.',
    missing: 'Which topics readers actually arrive on, and how far they read.',
    how: 'Deploy the collector, run 30 days, then choose from measured queries rather than from the queue.',
    who: 'The desk, once the endpoint is live',
    source: 'G2',
  },
  {
    id: 'DQ-H',
    question: 'Does the site need its own domain?',
    known: 'A github.io project path works and is already indexed; it is a weak brand home and the canonical URL carries the repository name.',
    missing: 'Whether the owner wants a domain, and whether it is worth the cost and the migration.',
    how: 'Owner decision; a migration changes every canonical, the sitemap and the feed.',
    who: 'The owner',
    source: 'G3',
  },
];

// ---------------------------------------------------------------------------
// The prompt itself. This is the artefact the brief asks for: a single block
// that can be handed to a designer or to a build agent, carrying the goals,
// the house style, the anti-slop rules and the hard constraints.
// ---------------------------------------------------------------------------
const PROMPT = `You are designing and building a small, honest Amazon Associates
publication for five kitchen products: three air fryers and two meat
thermometers. It is a shop that reads like a magazine, not a link directory.

WHAT THIS SITE IS
- Five products, each chosen for a different job. No product beats another.
- Every factual claim comes from the manufacturer's own Amazon listing, is
  labelled as the manufacturer's claim, and carries a link to that listing.
- No price, no star rating and no Amazon popularity position is shown anywhere: the policy only
  permits a price when Amazon serves the link carrying it, or when the data
  comes from the Creators API under its licence, and this is a static site.
- Nothing is described as "we tested it" unless a unit was actually bought and
  handled. If nothing was handled, say so in plain words.
- Where a value cannot be confirmed from an official source, leave the cell
  empty and label it unverified. Never infer, average or estimate.

THE READER
Someone with a specific kitchen job who is choosing between three shapes of
machine and does not trust a list. They arrive from a search with a question.
Answer it in the first three sentences.

VOICE AND LAYOUT
- Warm, plain, specific. Confident without adjectives. No superlatives.
- Serif display type for headings, a neutral sans for text, one warm accent
  colour, generous white space, real margins.
- Editorial photography, captioned as representative of the category and
  never as the reviewed unit.
- One navigation group. Everything else lives in the footer.
- The required affiliate disclosure sits directly under the masthead on every
  page and is repeated in the footer, and every outbound product link is
  marked rel="sponsored nofollow noopener" and carries the Associate tag.

WHAT MAKES A PAGE
1. The decision first: buy it if / skip it if / also consider.
2. Then the evidence: the specification grid, every cell with its source.
3. Then the limits: what this page cannot tell you, and why.
4. Then the next click: the comparison table or the category hub.

ANTI-SLOP RULES
- No "Top 10", no "Ultimate Guide", no "Game-Changing", no "Hidden Gem".
- No page that exists only because a keyword existed.
- No AI-generated review language. No listicle of forty thin sections.
- No uncited statistics, and no "studies show".
- Publish on a fixed cadence chosen from measured queries, not from instinct.
- Every table row carries a source link. Every claim can be checked.

WHAT TO BUILD FIRST
A front page that leads with the five picks, two category hubs, five product
pages, five question-shaped guides, one comparison table, and a reviewable
suggestions room that a person can use to choose what happens next.`;

// ---------------------------------------------------------------------------
// Part five — the tells this site refuses. Each is a thing the brief calls
// "AI slop", with the rule that rules it out.
// ---------------------------------------------------------------------------
const TELLS = [
  {
    tell: 'A top-ten list of five products',
    why: 'There are five products and they do different jobs. A ranking would be a ranking of jobs.',
    source: 'G2',
  },
  {
    tell: 'Prices and star ratings copied from the listing',
    why: 'The policy permits a price only when Amazon serves it; a rating is Amazon’s content, not this site’s endorsement.',
    source: 'A2',
  },
  {
    tell: '“We tested it” on a product nobody handled',
    why: 'FTC guidance is explicit: you cannot describe your experience with a product you have not tried.',
    source: 'F1',
  },
  {
    tell: 'A wall of thin sections, one per keyword',
    why: 'Bulk near-identical generation is the definition of scaled content abuse.',
    source: 'G2',
  },
  {
    tell: 'An email form that quietly goes nowhere',
    why: 'It collects nothing, so it promises something the site cannot deliver. Removed; the RSS feed is the follow path.',
    source: 'A2',
  },
  {
    tell: 'A traffic or revenue number with no report behind it',
    why: 'Nothing has been measured, so any such number would be invented.',
    source: 'A2',
  },
];

export function designPage() {
  const dirRow = (d) => `<tr>
    <td class="mono tiny">${esc(d.id)}</td>
    <td><b>${esc(d.change)}</b></td>
    <td class="tiny">${esc(d.goal)}</td>
    <td class="tiny">${esc(d.cost)}</td>
    <td class="tiny">${esc(d.reversible)}</td>
    <td class="tiny">${esc(d.needs)}</td>
    <td class="src">${srcLink(d.source, 'the rule behind this direction')}</td>
  </tr>`;

  const qRow = (q) => `<tr>
    <td class="mono tiny">${esc(q.id)}</td>
    <td><b>${esc(q.question)}</b></td>
    <td class="tiny">${esc(q.known)}</td>
    <td class="tiny">${esc(q.missing)}</td>
    <td class="tiny">${esc(q.how)}</td>
    <td class="tiny">${esc(q.who)}</td>
    <td class="src">${srcLink(q.source, 'the rule behind this question')}</td>
  </tr>`;

  const body = `
<section class="page-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { label: 'Design Room' }])}
    <p class="kicker">Oversight</p>
    <h1>The Design Room</h1>
    <p class="lede">${DIRECTIONS.length} design directions, the prompt they feed, the traffic playbook that goes with them, and the questions that have to be answered before any of it is reasonable. Nothing here is a promise. It is a menu with the trade-offs written down.</p>
    <div class="btn-row">
      ${badge(DIRECTIONS.length + ' directions', 'plain')}
      ${badge(LEVERS.length + ' traffic levers', 'plain')}
      ${badge(DESIGN_QUESTIONS.length + ' open questions', 'amber')}
      <a class="btn small" href="/decisions/">The Decision Room <span class="arw">→</span></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>Design directions, and what each one costs</h2>
        <p>“Reversible” means a change can be undone without loss. “Needs” names the thing that has to be true first — including the cases where the answer is already “nothing”, because a direction that is ready is worth knowing about too.</p>
      </div>
    </div>
    ${table({
      caption: '<b>The design menu.</b> Each row states the goal it serves, so the choice is made against an objective rather than against taste.',
      head: ['ID', 'What changes', 'Which brief goal it serves', 'Cost', 'Reversible?', 'What has to be true first', 'Source'],
      rows: DIRECTIONS.map(dirRow),
    })}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part two</p>
        <h2>The prompt these directions feed</h2>
        <p>This is the block to hand to a designer, or to a build agent. It carries the goals, the house style, the anti-slop rules and the hard constraints in one piece. Edit it freely — it is a starting point, and the site it describes is already partly built.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table data-kind="editorial">
        <caption><b>Copy this.</b> Everything the site has to be, in one prompt.</caption>
        <thead><tr><th scope="col">The prompt</th><th scope="col">Why it is worded this way</th></tr></thead>
        <tbody>
          <tr>
            <td><pre class="prompt">${esc(PROMPT)}</pre></td>
            <td class="tiny">Every constraint in it is enforced by the build: the disclosure placement by R1, the sponsored marking by R2, the absence of prices and ratings by R3, the absence of hands-on claims by R4, and the source on every table row by R15. A prompt that cannot be checked is a wish, and this one can. The rules themselves are written out in <a href="/methods/">How we choose</a>, and what is still unresolved is in <a href="/flagged/">Flagged for Review</a>.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part three</p>
        <h2>How this site is meant to earn a search visitor</h2>
        <p>Organic traffic comes from being the page that answers the question, not from tricks. Each lever below is something the build already does, with the official rule that justifies it. A lever with no rule behind it would be an opinion, and it is not on this list.</p>
      </div>
    </div>
    ${table({
      caption: '<b>Eight levers.</b> Each one is already implemented or already decided; none of them depends on a number this site has not measured.',
      head: ['Lever', 'What the build does', 'Source'],
      rows: LEVERS.map(
        (l) => `<tr><td><b>${esc(l.lever)}</b></td><td class="tiny">${esc(l.does)}</td><td class="src">${srcLink(l.source, 'the rule behind this lever')}</td></tr>`
      ),
    })}
    <div class="callout mt-3">
      <h4>The one lever that is still closed</h4>
      <p>Measuring which lever works. Until the collector endpoint is deployed (DQ-02), the site cannot tell which of these is earning anything, and the next guide is chosen by judgement rather than by evidence. That is the honest state of it, and it is a decision for the owner rather than a defect in the build.</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part four</p>
        <h2>The questions that must be answered before a design decision is reasonable</h2>
        <p>Each row separates what is known from what is missing, names the cheapest way to find the missing part, and says who can answer. Where an answer already exists, the row says so rather than pretending it is still open.</p>
      </div>
    </div>
    ${table({
      caption: '<b>Eight questions.</b> Six need the owner; one is settled and enforced by the build; one waits on measurement.',
      kind: 'editorial',
      head: ['ID', 'Question', 'What is known', 'What is missing', 'How to find out', 'Who can answer', 'Source'],
      rows: DESIGN_QUESTIONS.map(qRow),
    })}
    <div class="callout mt-3">
      <h4>How to read the “What is known” column</h4>
      <p>Known means it is recorded somewhere official or somewhere in this site’s own register, with a link. It never means it is generally accepted, and it never means the desk has tested anything.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part five</p>
        <h2>The tells of an AI-generated affiliate site, and what this one does instead</h2>
        <p>The brief says the site should not read like slop. “Slop” is not a matter of taste; it is a short list of specific habits, each of which breaks a rule that somebody published. Here they are, with the rule.</p>
      </div>
    </div>
    ${table({
      caption: '<b>Six tells.</b> Each one names the official rule it breaks, so the line is not drawn by preference.',
      head: ['The tell', 'Why it is not done here', 'Source'],
      rows: TELLS.map(
        (t) => `<tr><td><b>${esc(t.tell)}</b></td><td class="tiny">${esc(t.why)}</td><td class="src">${srcLink(t.source, 'the rule')}</td></tr>`
      ),
    })}
    <div class="cards c3 mt-3">
      <div class="card">
        <span class="num">What is here now</span>
        <h3>Five products, five guides, two clusters</h3>
        <p>${PRODUCTS.length} product pages, ${GUIDES.length} guides, a comparison table, and a reviewable suggestions room. Every one of them reachable from the front page in two clicks.</p>
      </div>
      <div class="card">
        <span class="num">What is not here yet</span>
        <h3>A reader, a click, and a reviewed unit</h3>
        <p>No traffic has been measured, no link has been confirmed to credit the account, and nothing has been handled. The three decisions above are what change that.</p>
      </div>
      <div class="card">
        <span class="num">What comes next</span>
        <h3>Pick one direction, then one guide</h3>
        <p>Choose a row from Part one, close the question it depends on, and the next guide is chosen from the topic queue in the <a href="/decisions/">Decision Room</a>.</p>
      </div>
    </div>
  </div>
</section>`;

  return page({
    path: '/design/',
    title: 'The Design Room — directions, the prompt, and the traffic playbook | Counterwise',
    description:
      'Ten design directions with cost and reversibility, the copy-ready prompt that feeds them, eight organic-traffic levers with their official rules, and the questions that must be answered before a design decision is reasonable.',
    body,
    ogImage: '/assets/img/guides-new.jpg',
  });
}
