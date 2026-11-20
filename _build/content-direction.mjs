// content-direction.mjs — the design-direction and trend-topic surface.
//
// PURPOSE. The brief asks for a site that reads like a polished marketing
// affiliate publication rather than an audit, and for catchy, trendy,
// question-shaped topics that can pull organic traffic. Those are decisions,
// not facts, so they belong on a page a reader can review and choose from —
// not buried in a generator.
//
// WHAT THIS PAGE IS. A review queue of design and content suggestions, a
// topic engine of catchy-but-compliant working titles, and the three paths
// the owner can choose before any of it is built. Every item states what it
// changes, what it costs, how it fails, and what must be known before it is
// chosen. Nothing here is implemented; the page says which of the existing
// suggestions were already built elsewhere on the site.
//
// WHAT THIS PAGE IS NOT. It does not claim popularity, search volume, or
// product superiority for any topic. Titles are working hypotheses. It does
// not show a price, a rating, a sales figure, or a measured result, because
// none of those exist yet.

import { esc, page, pageHead, table, badge, blank } from './core.mjs';
import { PATHS } from './data.mjs';
import { BLOCKING_QUESTIONS } from './decision-queue.mjs';

// ---------------------------------------------------------------------------
// Design suggestions. Each is a unit that can feed a design brief: what to
// change, why it reads as published rather than generated, and the cost of
// being wrong. `status` reflects what the site already does; the rest waits
// for a decision.
// ---------------------------------------------------------------------------
export const DESIGN_SUGGESTIONS = [
  {
    id: 'DES-01',
    category: 'Structure',
    title: 'One promise per page, one primary action',
    recommendation:
      'Each page leads with a single specific promise and a single primary action. Not a grid of equal options, not a dashboard of metrics.',
    why:
      'A shop page that opens with five equal choices asks the reader to do the selling. One promise and one button is what a reader acts on, and what a search result snippet can carry.',
    effort: 'Template work, already partly done',
    payoff: 'Immediate, on every page',
    risk: 'Over-simplifying a comparison page. Keep the detail one scroll down.',
    status: 'Partly implemented',
    needs: 'A decision on how the comparison page keeps its depth without leading with it.',
  },
  {
    id: 'DES-02',
    category: 'Voice',
    title: 'A declared editorial voice and a named byline',
    recommendation:
      'Write in a consistent first-person desk voice, sign every page with a name, a date and a reading time, and give that name a two-line biography.',
    why:
      'An unauthored affiliate page is the example Google gives of content likely to attract action under its site-reputation policy. A byline is the cheapest credibility signal available and it is what separates a publication from generated text.',
    effort: 'One owner decision, then template work',
    payoff: 'Trust and policy posture',
    risk: 'A name without accountability is decoration. The biography must state the non-testing position plainly.',
    status: 'Template exists; name pending',
    needs: 'Q-05 — whether the owner wants to publish a real byline and take editorial responsibility.',
  },
  {
    id: 'DES-03',
    category: 'Visual',
    title: 'Photographic category art, honestly captioned',
    recommendation:
      'Use real photographs of the category, always captioned as representative rather than as the reviewed unit. Ask the brands for licensed imagery before scraping anything.',
    why:
      'Generic illustration is the fastest way to read as generated. Photography of a kitchen, a counter, a basket of food makes the page feel like a shop. The IP licence forbids storing listing images, so the images must be licensed or made.',
    effort: 'One email per brand, plus generation work',
    payoff: 'The single largest lift in perceived quality',
    risk: 'Imagery that implies a test it did not do. Caption every image as editorial, never as the reviewed unit.',
    status: 'Generated art in place; licensing open',
    needs: 'Q-14 — whether any brand will license its own photography.',
  },
  {
    id: 'DES-04',
    category: 'Structure',
    title: 'A “who it is for” verdict above the specifications',
    recommendation:
      'Open every product page with a short verdict panel: buy it if, skip it if, and also consider. Put the specifications underneath.',
    why:
      'A buyer arrives with a job in mind. Answering “is this for me” before listing wattages is the difference between a shop and a spec sheet, and it is the part a reader acts on.',
    effort: 'Template work, implemented',
    payoff: 'Immediate',
    risk: 'A verdict must not become a hands-on claim. Keep it a specification and fit judgement, labelled as such.',
    status: 'Implemented',
    needs: 'None. Maintain the rule that verdicts are specification judgements, not test results.',
  },
  {
    id: 'DES-05',
    category: 'Structure',
    title: 'Turn the comparison table into a decision table',
    recommendation:
      'Group the comparison by the job a reader is deciding, not by feature. Lead with format and capacity, keep the fields that are stable, and leave the rest blank with a reason.',
    why:
      'A feature-by-feature grid is a data sheet. A table organised around a decision is a buying guide, and a table that explains why a column is blank builds more trust than a stale number.',
    effort: 'Template work, implemented',
    payoff: 'Immediate',
    risk: 'Fewer columns can look thinner. The blanks must carry a sentence, not just an empty cell.',
    status: 'Implemented',
    needs: 'DQ-Q8 — external dimensions, the one decision-relevant blank still missing.',
  },
  {
    id: 'DES-06',
    category: 'Content',
    title: 'A trend-led topic engine, gated on measurement',
    recommendation:
      'Maintain a list of catchy, question-shaped working titles tied to the two product clusters. Publish one only after the measurement baseline has run and the owner has chosen it.',
    why:
      'Catchy titles are how a new site gets found at all: they match the question a person actually types. But publishing a burst of them without measurement is the scaled-content pattern search engines name as abuse, so each one waits for the gate.',
    effort: 'Ongoing, one title per fortnight',
    payoff: 'The main organic-traffic lever',
    risk: 'A title that promises a comparison the page cannot deliver. Every published title must be answerable from sourced data.',
    status: 'Engine published; topics gated',
    needs: 'DQ-02 — the 30-day baseline, and the owner picking one title at a time.',
  },
  {
    id: 'DES-07',
    category: 'Content',
    title: 'A seasonal and occasion calendar, one guide at a time',
    recommendation:
      'Keep a short list of occasions tied to the products and publish at most one seasonal guide per cycle, dated, and retired when the season passes.',
    why:
      'A seasonal frame matches the meal a reader is cooking tonight, which is timely without chasing a popularity claim. Publishing the whole calendar at once is the opposite of a publication.',
    effort: 'Ongoing',
    payoff: 'Timely without being thin',
    risk: 'Seasonal copy goes stale. Date everything and retire it deliberately.',
    status: 'Framing in place; guides gated',
    needs: 'Q-11 — which occasion to cover first, and where the site is read.',
  },
  {
    id: 'DES-08',
    category: 'Content',
    title: 'A reader question → answer loop, answered in public',
    recommendation:
      'Capture the best reader question each week and answer it as a short post, crediting the asker.',
    why:
      'Reader questions are free and uncompetable topic research, and answering in public proves a human is here. It also converts a visitor into a reason to return.',
    effort: 'Low, ongoing',
    payoff: 'Compounding',
    risk: 'Needs a real contact route. A form that discards input is worse than no form.',
    status: 'Blocked',
    needs: 'Q-07 — a published contact route for corrections and questions.',
  },
  {
    id: 'DES-09',
    category: 'Discovery',
    title: 'Question-shaped titles that match real intent',
    recommendation:
      'Write every headline as the question a person would search, then answer it in the first paragraph.',
    why:
      'A question headline is both more clickable and more likely to match a real query than a product-name headline. It also keeps the page honest about what it answers.',
    effort: 'Editorial discipline',
    payoff: 'Direct',
    risk: 'Questions that over-promise. The page must actually answer the question it poses.',
    status: 'Editorial rule',
    needs: 'DQ-Q6 — Search Console, to confirm which questions are actually asked.',
  },
  {
    id: 'DES-10',
    category: 'Trust',
    title: 'Credibility signals on every surface',
    recommendation:
      'Show the source, the method, the last-checked date and the disclosure on every page that makes a claim. Never let a claim appear without the page it came from.',
    why:
      'This is the machinery of trust: a reader can check the claim, and a crawler can see the sourcing. It is also the difference between an affiliate site and a content farm.',
    effort: 'Implemented; ongoing discipline',
    payoff: 'Compounding',
    risk: 'Signalling without substance. The sources must be real and re-checked, not decorative.',
    status: 'Implemented',
    needs: 'A standing re-verification cadence, and the FLG items resolved.',
  },
  {
    id: 'DES-11',
    category: 'Visual',
    title: 'Social cards that resolve to a real image',
    recommendation:
      'Every page carries an og:image and twitter:image that points at a real, correctly sized file.',
    why:
      'A social card that points at a missing file renders blank on every share. It is invisible in a link check and invisible in the build until someone looks at the share dialog.',
    effort: 'Implemented; guarded in the build',
    payoff: 'Immediate',
    risk: 'Images that are too small or mislabelled. The build now fails if the file is missing.',
    status: 'Implemented',
    needs: 'None. The gate re-checks on every build.',
  },
  {
    id: 'DES-12',
    category: 'Discovery',
    title: 'Topic clusters and a hub page per category',
    recommendation:
      'Give each category a hub, link every guide in that category to it, and link the hubs to each other and to the comparison.',
    why:
      'Clusters tell a search engine what the site is about and tell a reader where to go next. They are the cheapest authority a new site can build, and they keep the site coherent as it grows.',
    effort: 'Implemented; ongoing discipline',
    payoff: 'Compounding',
    risk: 'Over-linking reads as SEO. Link where a reader would actually click.',
    status: 'Implemented',
    needs: 'None beyond the topic engine that adds to the clusters.',
  },
  {
    id: 'DES-13',
    category: 'Conversion',
    title: 'A working follow path, never a dead form',
    recommendation:
      'Offer the RSS feed now, because it works today. Add an email form only once a provider, a consent notice and a delivery path all exist.',
    why:
      'A capture form that collects an address it cannot deliver to is worse than no form: it promises a relationship the site cannot honour. RSS is a real path that costs nothing to offer.',
    effort: 'Half a day once a provider is chosen',
    payoff: 'Audience building',
    risk: 'Collecting addresses without a lawful basis. The notice must precede the first address.',
    status: 'RSS live; email blocked',
    needs: 'Q-04 — provider, consent language, and lawful basis.',
  },
  {
    id: 'DES-14',
    category: 'Conversion',
    title: '“Why this link” microcopy on outbound buttons',
    recommendation:
      'Label each outbound action with the reason for it, and repeat the affiliate disclosure beside it.',
    why:
      'A bare “Buy on Amazon” is fine, but “See it on Amazon — affiliate link” tells the reader exactly what the click is. Clarity converts better than a button that hides its purpose, and it is the honest form.',
    effort: 'Small, per page',
    payoff: 'Trust and clarity',
    risk: 'Clutter. Keep the microcopy to one line and keep the disclosure where it belongs.',
    status: 'Proposed',
    needs: 'A decision on wording, and confirmation that disclosure stays above the fold.',
  },
  {
    id: 'DES-15',
    category: 'Structure',
    title: 'Keep the oversight machinery out of the reader’s way',
    recommendation:
      'One reader navigation group. Every audit, register, flag and dashboard surface lives in the footer, reachable but not leading.',
    why:
      'A shop that opens with its own audit trail reads as a dashboard, not a shop. The oversight surfaces are necessary; they should not be the front page.',
    effort: 'Implemented',
    payoff: 'Immediate',
    risk: 'Oversight surfaces must still be reachable. The footer is the single index of them.',
    status: 'Implemented',
    needs: 'None.',
  },
];

// ---------------------------------------------------------------------------
// Trend and topic engine. Working titles only. Each is a hypothesis about a
// question a reader might ask, tied to one of the two clusters. None is a
// claim about popularity, search volume or product superiority. Each carries
// the gate that must be satisfied before it is published.
// ---------------------------------------------------------------------------
export const TREND_TOPICS = [
  {
    id: 'T-01',
    title: 'Air fryer or countertop oven: which one actually fits your kitchen?',
    cluster: 'Air fryers',
    question: 'A basket you pull out, or a door you slide a tray into?',
    angle:
      'The two formats are both called air fryers and do different jobs. A decision guide that starts from the kitchen, not the product.',
    gate: 'Publish after the comparison table shows which format readers compare most, and with external dimensions sourced (DQ-Q8).',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-02',
    title: 'Two foods, one dinner: the dual-basket question',
    cluster: 'Air fryers',
    question: 'When protein and a side must finish together, which machine?',
    angle:
      'The everyday shape that the dual-basket unit exists for. Frames the format choice around a real dinner rather than a spec.',
    gate: 'Publish after the format guide is the most-read guide for a full 30-day cycle.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-03',
    title: 'How big is a “6-quart” air fryer, really?',
    cluster: 'Air fryers',
    question: 'Quarts are a marketing unit; your shelf is a physical object.',
    angle:
      'A tape-measure guide to usable capacity, with a worksheet the reader can print. The one place a specification desk can beat a product page.',
    gate: 'Publish with a printable measurement worksheet (SUG-04). External dimensions must be sourced first.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-04',
    title: 'The air-fryer cleanup question: baskets you can wash in the sink',
    cluster: 'Air fryers',
    question: 'What does washing it actually cost after the cook?',
    angle:
      'Cleanup is the most common objection to air fryers and the least written about. A guide to nonstick and dishwasher-safe claims, honestly.',
    gate: 'Publish after the cleanup guide is the most-read section of its page for a full cycle.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-05',
    title: 'Instant-read or leave-in: the thermometer you actually need',
    cluster: 'Thermometers',
    question: 'Checking a number, or watching a cook?',
    angle:
      'Two different jobs, two different tools. A guide that refuses to say “buy both” until the reader has said what they cook.',
    gate: 'Publish after the temperature-safety guide shows guide_complete above a quarter of its readers.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-06',
    title: 'When is a wireless meat thermometer worth the app?',
    cluster: 'Thermometers',
    question: 'The connectivity is the most-complained-about part — is the guided cook worth it?',
    angle:
      'A candid guide to the one product whose listing itself flags connectivity as the weak point. The honest answer is more useful than a boost.',
    gate: 'Publish only with the app platform and subscription facts sourced from the manufacturer, not inferred.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-07',
    title: 'Weeknight, no waiting: two foods, one finish time',
    cluster: 'Air fryers',
    question: 'How do you cook protein and a side together without a second timer?',
    angle:
      'The timing question behind the dual-basket promise, framed as an ordinary weeknight rather than a product feature.',
    gate: 'Publish after T-02 is the most-read guide for a full cycle.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-08',
    title: 'Game-day wings: one big basket or two small ones?',
    cluster: 'Air fryers',
    question: 'A single full batch, or two halves at once?',
    angle:
      'A timely, occasion-led frame for the capacity question. Answerable from the listing arithmetic already on the site.',
    gate: 'Publish only when the measurement baseline ranks the capacity guide above the others (SUG-03).',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-09',
    title: 'The holiday roast: checking a number or watching the cook?',
    cluster: 'Thermometers',
    question: 'A whole bird needs a rest and a safe leftover — which tool does which?',
    angle:
      'The seasonal frame for the leave-in versus instant-read question, grounded in the USDA safe-minimum table already sourced.',
    gate: 'Publish in season, after the temperature-safety guide is the most-read section for a full cycle.',
    status: 'Hypothesis — gated',
  },
  {
    id: 'T-10',
    title: 'Before you buy any kitchen appliance: five questions to answer first',
    cluster: 'Both',
    question: 'What do you actually cook, and how much counter do you have?',
    angle:
      'A general, evergreen entry point that pulls in readers who have not yet chosen a category, and links to both hubs.',
    gate: 'Publish as the widest top-of-funnel topic, after at least one other guide has a full 30-day read history.',
    status: 'Hypothesis — gated',
  },
];

// ---------------------------------------------------------------------------
// The paths. Reused from the single source of truth so the recommendation
// here and the Decision Room cannot disagree.
// ---------------------------------------------------------------------------
const pathCard = (p) => `
<article class="opt">
  <div class="on">${esc(p.id)} · ${esc(p.promise)}</div>
  <h3>${esc(p.name)}</h3>
  <p>${esc(p.steps)}</p>
  <div class="meta">
    <span>${badge('Cost: ' + p.cost, 'plain')}</span>
  </div>
  <div class="meta">
    <span>${badge('Best if: ' + p.bestIf, 'amber')}</span>
  </div>
</article>`;

// ---------------------------------------------------------------------------
// The page.
// ---------------------------------------------------------------------------
export function directionPage() {
  const NEWLINE = '\n';

  const desCard = (d) => `
<article class="dec" id="${esc(d.id)}">
  <div class="dh">
    <span class="pri">${esc(d.id)}</span>
    <h3>${esc(d.title)}</h3>
    ${badge(d.category, 'plain')}
    ${d.status === 'Implemented' ? badge('Built', 'green') : d.status.includes('Blocked') ? badge('Blocked', 'red') : badge('For review', 'amber')}
  </div>
  <div class="rec"><b>Recommendation</b>${esc(d.recommendation)}</div>
  <dl>
    <dt>Why it reads as published</dt><dd>${esc(d.why)}</dd>
    <dt>Effort</dt><dd>${esc(d.effort)}</dd>
    <dt>Payoff</dt><dd>${esc(d.payoff)}</dd>
    <dt>If it goes wrong</dt><dd>${esc(d.risk)}</dd>
    <dt>What we need to know</dt><dd>${d.needs}</dd>
  </dl>
</article>`;

  const trendCard = (t) => `
<a class="card" id="${esc(t.id)}" href="#${esc(t.id)}">
  <span class="num">${esc(t.id)} · ${esc(t.cluster)}</span>
  <h3>${esc(t.title)}</h3>
  <p>${esc(t.angle)}</p>
  <div class="foot"><span>${esc(t.status)}</span><span class="read">Read the gate <span class="arw">→</span></span></div>
</a>`;

  // The design brief, as a prompt-ready list.
  const brief = [
    'Lead every page with one specific promise and one primary action, not a grid of choices.',
    'Write in a consistent first-person desk voice, signed with a name, a date and a reading time.',
    'Use real, captioned category photography; never pass generated art off as the reviewed unit.',
    'Open every product page with a “who it is for” verdict before the specifications.',
    'Organise the comparison by the job being decided, and explain any blank column in a sentence.',
    'Keep a gated list of catchy, question-shaped topic titles; publish one per cycle, chosen by measurement.',
    'Run a seasonal and occasion calendar one guide at a time, dated and retired.',
    'Answer one reader question in public each cycle, crediting the asker.',
    'Write headlines as the question a reader searches, and answer it in the first paragraph.',
    'Put the source, the method and the last-checked date on every claim-bearing surface.',
    'Give every page a social card that resolves to a real, correctly sized image.',
    'Cluster content by category with hub pages and cross-links that a reader would actually click.',
    'Offer only a follow path that works today; never a form that collects an address it cannot deliver.',
    'Label outbound actions with the reason for the click and keep the disclosure beside them.',
    'Keep one reader navigation group and move every oversight surface to the footer.',
  ];

  const designRows = DESIGN_SUGGESTIONS.map(
    (d) => `<tr>
      <td class="mono tiny">${esc(d.id)}</td>
      <td><b>${esc(d.title)}</b><br><span class="tiny muted">${esc(d.category)}</span></td>
      <td class="tiny">${esc(d.effort)}</td>
      <td class="tiny">${esc(d.payoff)}</td>
      <td class="tiny">${d.status === 'Implemented' ? '<span class="badge green">Built</span>' : d.status.includes('Blocked') ? '<span class="badge red">Blocked</span>' : '<span class="badge amber">For review</span>'}</td>
      <td class="tiny"><a href="#${esc(d.id)}">Read the case →</a></td>
    </tr>`
  );

  const trendRows = TREND_TOPICS.map(
    (t) => `<tr>
      <td class="mono tiny">${esc(t.id)}</td>
      <td><b>${esc(t.title)}</b><br><span class="tiny muted">${esc(t.cluster)}</span></td>
      <td class="tiny">${esc(t.question)}</td>
      <td class="tiny">${esc(t.gate)}</td>
      <td class="tiny">${badge(t.status, 'amber')}</td>
    </tr>`
  );

  const questionRows = BLOCKING_QUESTIONS.map(
    (q) => `<tr>
      <td class="mono tiny">${esc(q.id)}</td>
      <td><b>${esc(q.question)}</b></td>
      <td class="tiny">${esc(q.known)}</td>
      <td class="tiny q-missing">${esc(q.missing)}</td>
      <td class="tiny">${esc(q.howToFind)}</td>
      <td class="tiny"><a href="/suggestions/#${esc(q.id)}">Full case →</a></td>
    </tr>`
  );

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Design & trends' }],
  kicker: 'Design direction and the topic engine',
  title: 'Design suggestions and the trend topic engine',
  lede: 'Fifteen design suggestions that feed the next build, ten catchy working titles that wait for measurement, and the three paths to choose before any of it is implemented. Every item states what it changes, what it costs, and what must be known first.',
  meta: `<div class="btn-row">
    ${badge(DESIGN_SUGGESTIONS.length + ' design suggestions', 'plain')}
    ${badge(TREND_TOPICS.length + ' working titles', 'plain')}
    ${badge(PATHS.length + ' paths to choose', 'amber')}
  </div>`,
})}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part one</p>
        <h2>The design brief for the next build</h2>
        <p>The shortest form of every suggestion, ready to feed into a design brief or a build prompt. The full argument for each is below.</p>
      </div>
    </div>
    <div class="callout green">
      <h4>Use this as the prompt</h4>
      <p>Each line is one change. Treat them as the brief for a build that should read as a polished marketing affiliate publication, not an audit and not generated text. Nothing here asserts a measured result or a product claim.</p>
    </div>
    <div class="toc">
      <ol>
        ${brief.map((b) => `<li>${esc(b)}</li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part two</p>
        <h2>The design decision board</h2>
        <p>One row per design suggestion. “Built” means it is already in this site; “For review” means it is a proposal waiting for a decision; “Blocked” means it waits on an owner answer. Decide the reversible ones quickly and the rest deliberately.</p>
      </div>
    </div>
    ${table({
      caption: '<b>Fifteen design suggestions.</b> Sorted so that structural changes come first, because they are the ones every other change sits on.',
      head: ['ID', 'Suggestion', 'Effort', 'Payoff', 'Status', ''],
      rows: designRows,
    })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part three</p>
        <h2>Read the case for each design suggestion</h2>
        <p>The board is a summary. This is the argument: why it makes the site read as published, what it costs, how it fails, and what has to be known before choosing it.</p>
      </div>
    </div>
    ${DESIGN_SUGGESTIONS.map(desCard).join(NEWLINE)}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part four</p>
        <h2>The trend topic engine</h2>
        <p>Catchy, question-shaped working titles tied to the two clusters. Each is a hypothesis about a question a reader might ask — <span class="unverified">not a claim about popularity, search volume or product superiority</span>. Every one waits for its gate before it is published.</p>
      </div>
    </div>
    ${table({
      caption: '<b>Ten working titles.</b> Titles are editorial hypotheses. The gate column is the condition that must hold before publication; none is published yet.',
      head: ['ID', 'Working title', 'The question', 'Gate', 'Status'],
      rows: trendRows,
      note: 'A burst of near-identical titles is the scaled-content pattern search engines name as abuse. Publish one per cycle, chosen from measurement.',
    })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part five</p>
        <h2>Topic cards, and the gate each one carries</h2>
        <p>The same titles as cards. Open a card to read the angle it would take and the exact condition that must hold before it is written.</p>
      </div>
    </div>
    <div class="cards c2">
      ${TREND_TOPICS.map(trendCard).join('')}
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part six</p>
        <h2>Choose a path before anything is built</h2>
        <p>These three paths are the decision the owner makes before any design suggestion or topic is implemented. They differ in what gets built first, not in the compliance rules, which are fixed.</p>
      </div>
    </div>
    <div class="choose">
      ${PATHS.map(pathCard).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Part seven</p>
        <h2>What we need to know before deciding</h2>
        <p>The questions that gate the design suggestions and the topics. Each row states what is already known, what is missing, and the cheapest way to find the missing part. The full cases, with what happens on a yes and on a no, are on the Suggestions page.</p>
      </div>
      <a class="more" href="/suggestions/">All questions →</a>
    </div>
    ${table({
      caption: '<b>Blocking questions.</b> “Missing” is flagged rather than filled: if it cannot be confirmed from an official source, it stays open.',
      head: ['ID', 'Question', 'What is known', 'What is missing', 'How to find out', ''],
      rows: questionRows,
    })}
  </div>
</section>

<section class="section">
  <div class="wrap-narrow prose">
    <h2>How to use this page</h2>
    <p>Start at Part one if you want the shortest version, or Part two if you want the decisions. A suggestion becomes real when somebody reads it, decides, and changes the build — not because it appears here. The ones already in the site are labelled “Built”.</p>
    <p>For the topics in Part four, the discipline matters more than the list. Pick one title, satisfy its gate, publish it, and let the measurement baseline decide the next. The whole engine is a hypothesis that has to earn its place.</p>
    <div class="callout">
      <h4>What this page deliberately does not do</h4>
      <p>It does not score the suggestions or predict an outcome. No measurement has run, so any figure would be invented. It also does not claim that any title is popular, that any product is better, or that any link is compliant until its tag status is confirmed.</p>
    </div>
    <p class="tiny faint">Design and topic suggestions are editorial opinions. The compliance rules they sit under — disclosure, tagged and qualified links, no prices or ratings, no hands-on claims — are not opinions and are not on the table.</p>
  </div>
</section>`;

  return page({
    path: '/direction/',
    title: 'Design suggestions and the trend topic engine | Counterwise',
    description:
      'Fifteen design suggestions that feed the next build, ten catchy but compliant working titles with a gate each, and the three paths to choose before any of it is implemented.',
    body,
  });
}
