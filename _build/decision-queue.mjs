// decision-queue.mjs — the reviewable suggestion queue.
//
// PURPOSE. Somebody has to choose between these before anything is built. This
// file exists so that choice is a table, not a conversation: every proposal
// states what changes, what it costs, whether it can be undone, what it depends
// on, and what it would cost to be WRONG. The point of the risk column is that a
// reversible change can be made today and a one-way one cannot.
//
// GROUNDING. Nothing here invents a fact. Where an item depends on something
// unmeasured (traffic, conversion, whether a link credits the account) it says so
// and points at the question that would settle it. Recommendations are opinions;
// they are labelled as opinions and separated from the facts.
//
// Nothing in this file is implemented. /suggestions/ renders it as a board.

export const DECISION_QUEUE = [
  {
    id: 'DQ-01',
    title: 'Confirm the five supplied short links credit the account',
    lane: 'Revenue integrity',
    ownerOnly: true,
    whatChanges:
      'Nothing on the site. Five links get regenerated inside Associates Central with the tag attached, and the /go/ exit pages are repointed at the confirmed targets.',
    why:
      'Every resolved destination currently carries no tag parameter. If clicks are not being credited, every visitor between now and the fix is worth zero.',
    cost: 'Under an hour, once, by the account owner',
    reversible: 'Yes — old links keep working either way',
    riskLow: true,
    risk:
      'None. It is a read-and-compare exercise. The only failure is not doing it.',
    dependsOn: ['Q-01'],
    recommendation: 'Do this first. It gates the entire revenue case.',
    chooseIf: 'Always. There is no version of this that should wait.',
    notIf: 'You no longer intend to run the Associates account.',
  },
  {
    id: 'DQ-02',
    title: 'Deploy the collector and run a 30-day baseline',
    lane: 'Measurement',
    ownerOnly: true,
    whatChanges:
      'One hosted endpoint (Cloudflare Worker, supplied in /analytics/), one line of config in assets/js/site.js, and real numbers in the Data Room instead of an empty ledger.',
    why:
      'Until an endpoint exists, every topic decision is instinct. Thirty days of page_view and outbound_click is enough to rank the five existing guides honestly.',
    cost: 'Half a day, then nothing',
    reversible: 'Yes — remove the endpoint and events stop',
    riskLow: true,
    risk:
      'Small samples mislead. Thirty days will not support a conversion rate, and the Data Room must keep saying so.',
    dependsOn: ['Q-04'],
    recommendation: 'Do it in the same week as DQ-01. Measurement is cheap now and impossible to backfill later.',
    chooseIf: 'You want the next content decision to be based on anything at all.',
    notIf: 'You would rather not run any infrastructure; in that case delete the promise from the Data Room rather than leaving it aspirational.',
  },
  {
    id: 'DQ-03',
    title: 'Buy one unit and publish a disclosed first-hand review',
    lane: 'Editorial authority',
    ownerOnly: true,
    whatChanges:
      'One product page changes from "specification judgement" to a real review with photographs, a stated purchase date, and a receipt. The other four stay as they are.',
    why:
      'It is the only durable defence against the thin-affiliate problem, and the only content a competitor cannot regenerate. It is also the one thing this site currently cannot claim at all.',
    cost: 'The price of one unit, plus 2–3 days',
    reversible: 'Yes, but the money is spent either way',
    riskLow: false,
    risk:
      'One unit does not generalise. The template must not drift from "we tested this one" to "we tested this category".',
    dependsOn: ['Q-03', 'Q-05'],
    recommendation: 'Pick the cheapest of the five first. A documented cheap purchase beats an undelivered expensive one.',
    chooseIf: 'You can absorb the cost of one returned-or-kept appliance.',
    notIf: 'You cannot publish a photograph of the actual unit — then it is not a first-hand review and must not be labelled one.',
  },
  {
    id: 'DQ-04',
    title: 'Ship the comparison table as the primary landing surface',
    lane: 'Conversion',
    ownerOnly: false,
    whatChanges:
      'Already partly done in this build: the front page now opens with five situations, and /compare/ carries wattage, heat range and the weakest review theme per product.',
    why:
      'Most buying traffic in a five-product category arrives with a shortlist already in mind. A decision table answers that faster than five separate essays.',
    cost: 'Done',
    reversible: 'Yes',
    riskLow: true,
    risk: 'Tables do not rank on their own; they need the question-shaped guides behind them.',
    dependsOn: [],
    recommendation: 'Shipped. Review it before adding more products to it.',
    chooseIf: 'n/a — already in the build.',
    notIf: 'n/a',
    implemented: true,
  },
  {
    id: 'DQ-05',
    title: 'Publish on a fixed fortnightly cadence, chosen from measured queries',
    lane: 'Growth',
    ownerOnly: false,
    whatChanges:
      'One new guide every two weeks, added to the sitemap and the RSS feed by the existing build. Topic chosen from Search Console queries once property verification is done.',
    why:
      'A steady original cadence reads as a publication. A burst of near-identical pages reads as a content farm, and Google treats the two differently.',
    cost: 'Writing time, ongoing',
    reversible: 'Yes',
    riskLow: false,
    risk:
      'Two missed cycles and the site looks abandoned. Fortnightly is achievable; daily is not, and pretending otherwise produces thin pages.',
    dependsOn: ['Q-06', 'Q-08'],
    recommendation: 'Commit to four guides, then decide whether to continue. Do not commit to a cadence you have not tested.',
    chooseIf: 'You can write one honest guide in a fortnight.',
    notIf: 'You would rather publish only when a product changes. Then remove the feed promise instead of missing it.',
  },
  {
    id: 'DQ-06',
    title: 'Add a second category before deepening the first',
    lane: 'Catalogue',
    ownerOnly: true,
    whatChanges:
      'A sixth to tenth product in an adjacent category (the obvious candidate is air-fryer accessories, which convert to the same buyer).',
    why:
      'Five products is a coherent shop but a very small surface. The risk is that wider becomes thinner.',
    cost: 'Link supply from the owner; no editorial cost to a build that already takes data files',
    reversible: 'Yes',
    riskLow: false,
    risk:
      'Twelve scattered categories is a directory, not a publication. Topical depth in two adjacent categories is the cheaper authority.',
    dependsOn: ['Q-09'],
    recommendation: 'Do not do this until DQ-05 has produced four guides. Depth first.',
    chooseIf: 'The five products have measurable click-through and you have the links in hand.',
    notIf: 'You are adding products to feel busier.',
  },
  {
    id: 'DQ-07',
    title: 'State the "no hands-on test" position less often',
    lane: 'Reader experience',
    ownerOnly: false,
    whatChanges:
      'The disclosure strip keeps the legally required sentence. The repeated "nothing here is a test" framing drops to one clear statement per product page and one on /methods/.',
    why:
      'The current repetition is honest but it front-loads the site\'s limitations over its usefulness, which is a conversion tax paid on every page.',
    cost: 'An afternoon of copy editing',
    reversible: 'Yes — a copy change',
    riskLow: false,
    risk:
      'The disclosure must not get quieter in the process. Removal of the affiliate statement is a compliance failure; removal of repeated self-deprecation is not. These must not be edited in the same pass.',
    dependsOn: [],
    recommendation: 'Worth doing, carefully, and only after DQ-03. If a first-hand review lands, the disclaimer stops being the most interesting thing on the page.',
    chooseIf: 'You agree the site currently reads as an audit rather than a shop.',
    notIf: 'You are editing near the disclosure strip. That is the one line that does not move.',
  },
  {
    id: 'DQ-08',
    title: 'Ask Amazon directly about link.amazon short links',
    lane: 'Compliance',
    ownerOnly: true,
    whatChanges:
      'Closes FLG-003 in one direction or the other. If approved, the short links become a legitimate option; if not, the tagged canonical links stay.',
    why:
      'The status is currently recorded as unresolved in both directions, which is correct but not permanent. One email to Associates support settles it, and the site can then state a fact instead of a caveat.',
    cost: 'One support ticket',
    reversible: 'n/a — information only',
    riskLow: true,
    risk: 'None, provided the answer is recorded with its date and the responder is identified.',
    dependsOn: [],
    recommendation: 'Low effort, removes a caveat from five pages. Do it alongside DQ-01.',
    chooseIf: 'You have Associates Central access.',
    notIf: 'n/a',
  },
  {
    id: 'DQ-09',
    title: 'Wire the email list, or remove the promise entirely',
    lane: 'Reader capture',
    ownerOnly: true,
    whatChanges:
      'Either a provider is named and the address is actually stored, or the capture box disappears and the RSS feed is the only follow path — which is what this build now does.',
    why:
      'A form that collects an address and discards it is worse than no form. This build took the second path: no form, a real feed, no promise.',
    cost: 'Decision only; the build already reflects the "no list" branch',
    reversible: 'Yes',
    riskLow: true,
    risk: 'If a provider is added later, a privacy notice update is mandatory before the first address is stored.',
    dependsOn: ['Q-07'],
    recommendation: 'Resolved in this build by removing the form. Revisit only when a provider and a privacy notice both exist.',
    chooseIf: 'You want a list badly enough to run a provider.',
    notIf: 'You would rather ship a feed and no obligation. Current state.',
    implemented: true,
  },
  {
    id: 'DQ-10',
    title: 'Add a visible "last checked" date per product and a change log',
    lane: 'Trust',
    ownerOnly: false,
    whatChanges:
      'Each product page shows the date its listing was last read, and a short changelog of what changed in the data since the previous read.',
    why:
      'Prices and specifications move. A dated claim is checkable; an undated one is not. It also makes the maintenance obligation visible instead of optional.',
    cost: 'Small build change; ongoing re-checks',
    reversible: 'Yes',
    riskLow: true,
    risk: 'It creates a promise to re-check. An old date on a page is honest but does show neglect.',
    dependsOn: [],
    recommendation: 'Partially present already — pages carry "read 2026-11-20". The changelog is the missing half.',
    chooseIf: 'You will actually re-check quarterly.',
    notIf: 'You will not. An undated page is less embarrassing than a stale date.',
  },
];

// ---------------------------------------------------------------------------
// The questions that must be answered before the decisions above can be made.
// Each one is split into what is KNOWN (with where it is known from), what is
// MISSING, how to obtain the missing part, and which decision it unblocks.
// Nothing here is answered speculatively.
// ---------------------------------------------------------------------------
export const BLOCKING_QUESTIONS = [
  {
    id: 'DQ-Q1',
    question: 'Do the supplied short links credit shopnow047c-20?',
    unblocks: 'DQ-01, all revenue',
    known:
      'All five resolve to live listings. The resolved URLs carry tracking parameters but no tag= parameter (recorded in COORDINATION.md §3).',
    missing:
      'Whether Amazon attaches the account tag at click time for links minted inside the dashboard.',
    howToFind:
      'Mint one link inside Associates Central with the tag, resolve it, and compare the destination string against a supplied link.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Keep the supplied links; the /go/ pages can forward to them.',
    ifNo: 'Keep tagged canonical links only, and say so on /methods/.',
  },
  {
    id: 'DQ-Q2',
    question: 'Where will the first 100 sessions come from?',
    unblocks: 'DQ-05 (cadence and topic)',
    known:
      'No analytics are live, so current traffic is unmeasured. A new project site has no domain authority.',
    missing:
      'Any audience the owner already has: a mailing list, a social following, a community, an existing site to cross-link from.',
    howToFind: 'Ask the owner. There is no other source for this.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Rank the existing five guides against that audience first.',
    ifNo: 'Plan on search only, and expect months before any guide ranks.',
  },
  {
    id: 'DQ-Q3',
    question: 'Can a unit actually be obtained for review?',
    unblocks: 'DQ-03',
    known:
      'No unit is held. The listing data is sufficient for specification content only.',
    missing:
      'Whether any of the three brands will supply a review unit, and the owner\'s budget if they will not.',
    howToFind:
      'Contact the brand press addresses, or buy the cheapest unit outright and keep the receipt.',
    whoCanAnswer: 'Brands, plus the owner\'s budget',
    ifYes: 'Prioritise that product\'s page and add photographs and a purchase date.',
    ifNo: 'Keep every page as a specification judgement and do not soften that wording.',
  },
  {
    id: 'DQ-Q4',
    question: 'Where will the analytics collector run?',
    unblocks: 'DQ-02',
    known:
      'The worker code and schema are supplied in /analytics/. Nothing is deployed.',
    missing:
      'Whether the owner will run a Cloudflare account, and which hostname the endpoint lives on.',
    howToFind:
      'Deploy wrangler.toml.example to a Cloudflare Workers account, or choose another first-party host.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Set ENDPOINT in assets/js/site.js and start the 30-day baseline.',
    ifNo: 'Remove measured-traffic claims from the Data Room so it stops promising data it cannot have.',
  },
  {
    id: 'DQ-Q5',
    question: 'Is the affiliate tag valid and active on the account?',
    unblocks: 'DQ-01, DQ-03',
    known: 'shopnow047c-20 is the tag supplied by the owner in the brief.',
    missing:
      'Whether the account is approved and currently in good standing, which only Associates Central shows.',
    howToFind: 'Sign in to Associates Central and read the account status banner.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Proceed as built.',
    ifNo: 'Nothing on this site can earn, and the site should stop describing itself as an Associates publication.',
  },
  {
    id: 'DQ-Q6',
    question: 'Does the owner want Search Console and a sitemap ping?',
    unblocks: 'DQ-05',
    known:
      'Sitemap and RSS are generated and valid. No search property is verified.',
    missing:
      'Verification of the property, which requires the owner to add a DNS or HTML token.',
    howToFind:
      'Add the property in Search Console using the HTML file or meta tag method, then submit sitemap.xml.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Topics can be chosen from real queries instead of guesses.',
    ifNo: 'Topics must be chosen editorially, and the Decision Room should say so.',
  },
  {
    id: 'DQ-Q7',
    question: 'Is there an email provider, and a privacy notice for it?',
    unblocks: 'DQ-09',
    known:
      'No provider is wired. The previous build shipped a form that collected nothing; this build removed it.',
    missing:
      'Which provider would hold the address, its data location, and the retention policy to publish.',
    howToFind: 'Choose a provider, then write the notice BEFORE the first address is collected.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Reintroduce capture with a named processor and a linked notice.',
    ifNo: 'Keep the RSS feed as the only follow path. Current state.',
  },
  {
    id: 'DQ-Q8',
    question: 'What are the external dimensions of each air fryer?',
    unblocks: 'Counter-footprint content, DQ-05 topic choice',
    known:
      'None of the three air-fryer listings states external dimensions in the served page. Wattage and temperature range are stated and are now published.',
    missing: 'Width, depth and height for all three, plus the clearance each manual requires.',
    howToFind:
      'Read the linked user-guide PDFs on each listing, or the manufacturer\'s own specification page.',
    whoCanAnswer: 'Manufacturer documentation',
    ifYes: 'Fill the "counter footprint" row, which is the most decision-relevant blank left on the site.',
    ifNo: 'Leave it blank and keep the claim that it is unpublished.',
  },
  {
    id: 'DQ-Q9',
    question: 'Which adjacent products would the owner actually supply links for?',
    unblocks: 'DQ-06',
    known: 'The current five are supplied; no others.',
    missing: 'The owner\'s link supply for any second category.',
    howToFind: 'Ask. The build reads from one data file, so adding products is cheap once links exist.',
    whoCanAnswer: 'The account owner',
    ifYes: 'Add them behind the same gate; every rule applies unchanged.',
    ifNo: 'Do not expand. Depth is the better bet anyway.',
  },
];

// ---------------------------------------------------------------------------
// What the owner has to do versus what any editor can do. Kept explicit because
// it is the difference between a queue that moves and one that stalls.
// ---------------------------------------------------------------------------
export const OWNER_ACTIONS = [
  { id: 'DQ-01', action: 'Sign in to Associates Central and compare one minted link against a supplied one.', time: '10 minutes' },
  { id: 'DQ-08', action: 'Open a support ticket asking whether link.amazon short links are an approved format.', time: '5 minutes' },
  { id: 'DQ-02', action: 'Create a Cloudflare account (or equivalent) for the collector endpoint.', time: '20 minutes' },
  { id: 'DQ-05', action: 'Verify the site in Search Console and submit sitemap.xml.', time: '15 minutes' },
  { id: 'DQ-03', action: 'Approve the spend for one review unit, or decline it.', time: 'A decision' },
];
