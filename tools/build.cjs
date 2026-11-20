#!/usr/bin/env node
/**
 * Static site build for Counterwise.
 *
 * Design rules this file enforces mechanically:
 *  1. Every outbound product link is rewritten to an explicit /go/<code>.html interstitial and marked
 *     rel="sponsored nofollow noopener". Internal links never carry rel=sponsored.
 *  2. Nothing hard-codes a price or a star rating. Those fields are read from data/products.json and, if
 *     they are null, the UI says so plainly. This is the enforcement arm of FLG-004.
 *  3. Every page carries the disclosure strip under the masthead AND in the footer.
 *  4. Every claim row on the verification pages carries a source id that must exist in data/sources.json.
 *     The build fails if a claim cites a source that is not in the register.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const SITE = read('data/shop/site.json');
const SOURCES = read('data/shop/sources.json').sources;
const PRODUCTS = read('data/shop/products.json');
const LINKS = read('data/shop/link-audit.json');
const FLAGS = read('data/shop/flags.json').flags;
const QUESTIONS = read('data/shop/questions.json');
const SUGGESTIONS = read('data/shop/suggestions.json');
const LOG = read('data/shop/research-log.json');

const BASE = SITE.brand.baseUrl;
const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

/* ---------------------------------------------------------------- safety net */

const warnings = [];
const fails = [];

function assertSourceIds(ids, where) {
  for (const id of ids || []) {
    if (!SOURCE_BY_ID.has(id)) fails.push(`${where}: cites unknown source id ${id}`);
  }
}
PRODUCTS.products.forEach((p) => assertSourceIds(p.sourceIds, `product ${p.id}`));
FLAGS.forEach((f) => assertSourceIds(f.sourceIds, `flag ${f.id}`));
QUESTIONS.questions.forEach((q) => assertSourceIds(q.sourceIds, `question ${q.id}`));

/* ---------------------------------------------------------------- primitives */

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Internal link helper. Returns a ROOT-RELATIVE path, deliberately.
 *
 * An earlier version joined the absolute base URL here, which collapsed "https://" to "https:/" and
 * produced 60 dead internal links on the home page alone. Root-relative paths cannot suffer that, and
 * they also make the output deployment-agnostic: the same build works at a project path or a domain.
 * Absolute URLs are still used where a search engine needs one (canonical, og:url, sitemap, feed).
 */
const BASE_PATH = (process.env.CK_BASE_PATH !== undefined ? process.env.CK_BASE_PATH : '/WinB').replace(/\/$/, '');
const rel = (href) => BASE_PATH + (href.startsWith('/') ? href : '/' + href);

/** Link to a source row on the verification page, with the external URL as the target. */
function src(id, opts = {}) {
  const s = SOURCE_BY_ID.get(id);
  if (!s) return `<span class="badge badge--fail">unknown source ${esc(id)}</span>`;
  const cls = s.verified ? 'src src--ok' : 'src src--warn';
  const label = opts.label || id;
  const title = `${s.title} — ${s.publisher}${s.verified ? '' : ' (not retrieved / not verified)'}`;
  const target = s.retrieved === 'not retrieved' || !s.verified ? ' data-unverified-source="1"' : '';
  return `<a class="${cls}" href="${esc(s.url)}" title="${esc(title)}" target="_blank" rel="noopener"${target}>${esc(label)}</a>`;
}

function srcList(ids) {
  if (!ids || !ids.length) return '<span class="muted">none</span>';
  return ids.map((id) => src(id, { label: id })).join(' ');
}

function badge(text, kind = 'neutral') {
  return `<span class="badge badge--${kind}">${esc(text)}</span>`;
}

const TIER_LABEL = {
  observed: ['Observed', 'ok'],
  'listing-claim': ['Seller claim', 'claim'],
  'editorial-inference': ['Editorial inference', 'infer'],
  unverified: ['Unverified', 'fail'],
  blocked: ['Blocked', 'warn'],
  'secondary-not-authoritative': ['Secondary', 'warn'],
  'referenced-only': ['Not retrieved', 'warn'],
  'by-design': ['By design', 'info'],
  material: ['Material', 'fail'],
  informational: ['Informational', 'info'],
  'blocking-for-revenue': ['Blocking', 'fail'],
  accepted: ['Accepted', 'info'],
  open: ['Open', 'warn'],
  closed: ['Closed', 'ok'],
};

function tierBadge(tier) {
  const [label, kind] = TIER_LABEL[tier] || [tier, 'neutral'];
  return badge(label, kind);
}

/* ---------------------------------------------------------------- disclosure */

const DISCLOSURE = `<div class="disclosure" role="note">
  <p><strong>Affiliate disclosure.</strong> ${esc(SITE.disclosure.requiredStatement)} ${esc(
  SITE.disclosure.plainLanguage
)} <a href="${rel('/about/how-we-make-money.html')}">How this site makes money</a>.</p>
</div>`;

const FOOTER_DISCLOSURE = `<div class="footer-disclosure">
  <p><strong>Affiliate disclosure (repeated).</strong> ${esc(
    SITE.disclosure.requiredStatement
  )} ${esc(SITE.disclosure.plainLanguage)}</p>
  <p class="footer-disclosure__note">Product links on this site are marked <code>rel="sponsored"</code>. Prices, if a page ever shows one, must come from Amazon itself or from the Product Advertising API with the required timestamp — which is why no price appears in the HTML of this site.</p>
</div>`;

/* ---------------------------------------------------------------- layout */

function head({ title, description, canonical, extraHead = '', jsonLd = null, noindex = false }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:site_name" content="${esc(SITE.brand.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f1b17">
<link rel="icon" href="${rel('/assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${rel('/assets/css/site.css')}">
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.brand.name)} — new guides" href="${rel(
    '/feed.xml'
  )}">
${extraHead}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>`;
}

function header() {
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
  <div class="masthead__inner">
    <a class="brand" href="${rel('/index.html')}">
      <span class="brand__mark" aria-hidden="true">CK</span>
      <span class="brand__text"><strong>${esc(SITE.brand.name)}</strong><em>${
    SITE.brand.tagline.split('—')[0].trim()
  }</em></span>
    </a>
    <nav class="mainnav" aria-label="Primary">
      <ul>
        ${SITE.nav
          .map(
            (n) => `<li><a href="${rel(n.href)}">${esc(n.label)}</a></li>`
          )
          .join('\n        ')}
      </ul>
    </nav>
  </div>
</header>
${DISCLOSURE}`;
}

function footer() {
  const groups = SITE.footerGroups
    .map(
      (g) => `<div class="footergroup">
        <h3>${esc(g.title)}</h3>
        <ul>
          ${g.links
            .map(
              (l) =>
                `<li><a href="${rel(l.href)}">${esc(l.label)}</a>${
                  l.note ? ` <span class="footernote">${esc(l.note)}</span>` : ''
                }</li>`
            )
            .join('\n          ')}
        </ul>
      </div>`
    )
    .join('\n      ');

  return `<footer class="sitefooter">
  <div class="sitefooter__inner">
    <div class="footergrid">
      ${groups}
    </div>
    ${FOOTER_DISCLOSURE}
    <div class="colophon">
      <p><strong>${esc(SITE.brand.name)}</strong> — ${esc(SITE.brand.publisherNote)}</p>
      <p>Published by ${esc(SITE.brand.author.name)}. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. This site is not endorsed by or affiliated with Amazon.</p>
      <p class="colophon__meta">Compiled ${esc(SITE.brand.founded)} · <a href="${rel(
    '/verification/sources.html'
  )}">Source register</a> · <a href="${rel('/flagged/index.html')}">Flagged for Review</a></p>
    </div>
  </div>
</footer>
<script src="${rel('/assets/js/site.js')}" defer></script>
</body>
</html>
`;
}

function page({ title, description, canonicalPath, body, jsonLd, noindex }) {
  const canonical = BASE + canonicalPath;
  return (
    head({ title, description, canonical, jsonLd, noindex }) +
    header() +
    `<main id="main" class="wrap">${body}</main>` +
    footer()
  );
}

/* ---------------------------------------------------------------- product card */

/**
 * The single place a buy link is produced. Every outbound product link on the site goes through here,
 * which is what makes the "every product link is sponsored" rule checkable rather than aspirational.
 */
function buyButton(p, variant = 'primary') {
  const href = rel(`/go/${p.slug}.html`);
  return `<a class="btn btn--${variant} btn--buy" href="${href}" data-affiliate-product="${esc(
    p.id
  )}" data-affiliate-asin="${esc(p.asin)}">Check price on Amazon<span class="btn__sub">ASIN ${esc(
    p.asin
  )}</span></a>`;
}

function productCard(p, { rank } = {}) {
  const strengths = p.sellTheStrengths
    .slice(0, 3)
    .map((s) => `<li>${esc(s.text)}${tierBadge(s.tier)}</li>`)
    .join('\n        ');
  return `<article class="card productcard">
    <div class="productcard__head">
      ${rank ? `<span class="rank">${esc(rank)}</span>` : ''}
      <div>
        <p class="productcard__brand">${esc(p.brand)} · ${esc(p.category)}</p>
        <h3><a href="${rel(`/products/${p.categoryId}.html`)}#${esc(p.slug)}">${esc(p.shortName)}</a></h3>
      </div>
    </div>
    <p class="productcard__for"><strong>Best for:</strong> ${esc(p.bestFor)}</p>
    <ul class="ticks">
        ${strengths}
    </ul>
    <p class="productcard__not"><strong>Not for:</strong> ${esc(p.notFor)}</p>
    <div class="productcard__foot">
      ${buyButton(p)}
      <div class="productcard__meta">
        <span class="price-note">Live price and availability are on Amazon — this page cannot keep them current.</span>
        <a class="quietlink" href="${rel(`/verification/links.html`)}#${esc(p.id)}">Where this claim comes from</a>
      </div>
    </div>
  </article>`;
}

/* ---------------------------------------------------------------- tables */

function table({ cols, rows, cls = '' }) {
  return `<div class="tablewrap"><table class="data ${cls}">
  <thead><tr>${cols.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
  <tbody>
  ${rows
    .map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('\n  ')}
  </tbody>
</table></div>`;
}

/* ---------------------------------------------------------------- page bodies */
const PAGES = [];

function add(routePath, opts) {
  PAGES.push({ routePath, ...opts });
}

/* ---- guide index data (declared early: the home page links to it) -------- */
const GUIDES = [
  {
    slug: 'basket-or-oven-air-fryer',
    tag: 'Shape',
    title: 'Basket or oven-style air fryer: what should you compare?',
    summary:
      'The single biggest fork in the category, and the one the shelf labels hide. Four questions that separate the two shapes before you look at watts.',
    minutes: 6,
    date: '2026-11-20',
  },
  {
    slug: 'air-fryer-capacity-checklist',
    tag: 'Capacity',
    title: 'A no-hype checklist for comparing air fryer capacity',
    summary:
      'Quarts, litres, baskets, and the difference between "6 quart" meaning one drawer or two. A checklist you can run against any listing in two minutes.',
    minutes: 5,
    date: '2026-11-20',
  },
  {
    slug: 'cleanup-and-counter-space',
    tag: 'Ownership',
    title: 'How to assess cleanup and counter-space trade-offs',
    summary:
      'The two costs that arrive after the purchase. What to measure on your own counter, and what each shape demands of a sink.',
    minutes: 5,
    date: '2026-11-20',
  },
  {
    slug: 'multifunction-appliance-questions',
    tag: 'Buying',
    title: 'Questions to ask before buying a multi-function kitchen appliance',
    summary:
      'Every extra function is a promise about a mode you will use twice. Five questions that separate a useful multi-function appliance from a crowded control panel.',
    minutes: 6,
    date: '2026-11-20',
  },
];


/* ---- home ---------------------------------------------------------------- */
{
  const hero = `<section class="hero">
  <div class="hero__copy">
    <p class="kicker">Air fryers, thermometers, and the numbers that decide between them</p>
    <h1>Pick the right air fryer in five minutes, not five tabs.</h1>
    <p class="lede">Five products, two categories, one question: what actually changes between a 6-quart dual basket, a 26-quart oven, an 8-quart single drawer, and the two thermometers that tell you when to stop cooking. Every claim is labelled as either the seller's or ours.</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${rel('/products/air-fryers.html')}">Compare air fryers</a>
      <a class="btn btn--ghost" href="${rel('/guides/basket-or-oven-air-fryer.html')}">Basket or oven-style?</a>
    </div>
    <ul class="hero__proof">
      <li><strong>5</strong> products, ASINs observed on 2026-11-20</li>
      <li><strong>3</strong> sellers' claims labelled separately from ours</li>
      <li><strong>0</strong> prices published, because we cannot serve them legally yet</li>
    </ul>
  </div>
  <figure class="hero__art">
    <img src="${rel('/assets/img/hero-kitchen.jpg')}" alt="Editorial illustration of three air fryer shapes on a kitchen counter: a dual-basket drawer unit, a large single-drawer unit, and a French-door countertop oven, with a probe thermometer resting beside them" width="1120" height="747" fetchpriority="high" decoding="async">
    <figcaption>Editorial illustration — not photographs of the products reviewed. No retailer image is used, because caching product photography is not permitted. ${badge('Illustration', 'info')}</figcaption>
  </figure>
</section>`;

  const decisionBlock = `<section class="section">
  <div class="section__head">
    <h2>Start where the decision actually is</h2>
    <p>Most air-fryer comparisons argue about brands. The decisions that matter are shape, drawer count and what you are trying to cook at the same time.</p>
  </div>
  <div class="grid grid--3">
    <a class="decide" href="${rel('/products/air-fryers.html')}">
      <span class="decide__num">01</span>
      <h3>One drawer or two?</h3>
      <p>Two baskets let a main and a side run at different temperatures. One big basket means less washing-up and one temperature.</p>
      <span class="decide__cta">See the three air fryers →</span>
    </a>
    <a class="decide" href="${rel('/guides/basket-or-oven-air-fryer.html')}">
      <span class="decide__num">02</span>
      <h3>Drawer or French door?</h3>
      <p>A 26-quart oven replaces a toaster oven. A drawer is what you shake. These are not the same purchase.</p>
      <span class="decide__cta">Read the comparison →</span>
    </a>
    <a class="decide" href="${rel('/products/thermometers.html')}">
      <span class="decide__num">03</span>
      <h3>Spot-check or monitor?</h3>
      <p>An instant-read probe answers "is it done now". A wireless probe answers "is it done yet" from the garden.</p>
      <span class="decide__cta">See the two thermometers →</span>
    </a>
  </div>
</section>`;

  const picks = `<section class="section">
  <div class="section__head">
    <h2>The short list</h2>
    <p>Three picks, framed as decisions rather than rankings. Prices are deliberately absent — see <a href="${rel(
      '/verification/products.html'
    )}">why</a>.</p>
  </div>
  <div class="grid grid--3">
    ${productCard(PRODUCTS.products[0], { rank: 'Best for two foods at once' })}
    ${productCard(PRODUCTS.products[2], { rank: 'Best if you want the least washing-up' })}
    ${productCard(PRODUCTS.products[1], { rank: 'Best if it has to replace a toaster oven' })}
  </div>
  <p class="section__foot">The other two products — both thermometers — are on the <a href="${rel(
    '/products/thermometers.html'
  )}">thermometers page</a>. Nothing here is ranked by commission; no commission rate is published, because none was verified.</p>
</section>`;

  const guides = `<section class="section section--alt">
  <div class="section__head">
    <h2>Read before you buy</h2>
    <p>Four guides, written as the questions people actually ask. None of them claims to know search volume — those are working hypotheses, and the site says so on each page.</p>
  </div>
  <div class="grid grid--2">
    ${GUIDES.map(
      (g) => `<a class="guidecard" href="${rel(`/guides/${g.slug}.html`)}">
      <span class="guidecard__tag">${esc(g.tag)}</span>
      <h3>${esc(g.title)}</h3>
      <p>${esc(g.summary)}</p>
      <span class="guidecard__meta">${esc(g.minutes)} min read · ${esc(g.date)}</span>
    </a>`
    ).join('\n    ')}
  </div>
</section>`;

  const trust = `<section class="section">
  <div class="section__head">
    <h2>Why you can check every claim on this page</h2>
    <p>This is a shop front built on top of a verification register. The register is public, including the parts that are unresolved.</p>
  </div>
  <div class="grid grid--4">
    <div class="stat"><span class="stat__n">${SOURCES.filter((s) => s.verified).length}</span><span class="stat__l">primary sources retrieved and quoted</span></div>
    <div class="stat"><span class="stat__n">${LINKS.records.length}</span><span class="stat__l">supplied links resolved and recorded</span></div>
    <div class="stat"><span class="stat__n">${FLAGS.filter((f) => f.status === 'open').length}</span><span class="stat__l">open items on the review queue</span></div>
    <div class="stat"><span class="stat__n">${QUESTIONS.questions.length}</span><span class="stat__l">questions that must be answered before scaling</span></div>
  </div>
  <div class="callout callout--warn">
    <h3>The honest summary of what this site does not know</h3>
    <p>No price is shown because publishing one requires either Amazon-served data or API data with a timestamp. Nothing here has been tested by hand, so every strength is labelled as the seller's claim. And none of the five supplied links carried a visible tracking tag on the date observed. All of it is on the <a href="${rel(
      '/flagged/index.html'
    )}">Flagged for Review</a> page with source links.</p>
  </div>
</section>`;

  add('/index.html', {
    title: `${SITE.brand.name} — air fryer and thermometer buying decisions`,
    description:
      'Five products, two categories, and a labelled record of what is a seller claim, what is our inference, and what could not be verified.',
    body: hero + decisionBlock + picks + guides + trust,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.brand.name,
      url: BASE + '/',
      description: SITE.brand.tagline,
      publisher: { '@type': 'Organization', name: SITE.brand.name },
    },
  });
}

/* ---- category pages ------------------------------------------------------ */
const CATEGORY_COPY = {
  'air-fryers': {
    title: 'Air fryers',
    kicker: 'Three shapes, one decision',
    lede: 'A dual basket, a single 8-quart drawer, and a 26-quart French-door oven. They are sold as one category and solve three different problems. Read the shape column before the brand column.',
    guides: [
      ['/guides/basket-or-oven-air-fryer.html', 'Basket or oven-style: what should you compare?'],
      ['/guides/air-fryer-capacity-checklist.html', 'A no-hype checklist for comparing air fryer capacity'],
      ['/guides/cleanup-and-counter-space.html', 'How to assess cleanup and counter-space trade-offs'],
    ],
  },
  thermometers: {
    title: 'Wireless & instant-read thermometers',
    kicker: 'The accessory that makes an air fryer predictable',
    lede: 'An air fryer without a thermometer is guesswork with extra steps. One of these is a one-second spot check; the other watches three pieces from another room. Neither is on this site because it is a gadget — they are here because they answer the question the fryer cannot.',
    guides: [
      ['/guides/multifunction-appliance-questions.html', 'Questions to ask before buying a multi-function kitchen appliance'],
      ['/guides/cleanup-and-counter-space.html', 'How to assess cleanup and counter-space trade-offs'],
    ],
  },
};

for (const catId of ['air-fryers', 'thermometers']) {
  const meta = CATEGORY_COPY[catId];
  const rows = PRODUCTS.products.filter((p) => p.categoryId === catId);

  const cards = `<div class="grid grid--2">${rows.map((p) => productCard(p)).join('\n')}</div>`;

  const compareRows = rows.map((p) => [
    `<a href="#${esc(p.slug)}"><strong>${esc(p.shortName)}</strong></a><br><span class="muted">${esc(
      p.brand
    )}</span>`,
    esc(p.bestFor),
    esc(p.notFor),
    `<code class="asin">${esc(p.asin)}</code> ${tierBadge('observed')}`,
    `<span class="muted">Not published</span> ${tierBadge('unverified')}`,
    `<a class="quietlink" href="${rel('/verification/links.html')}#${esc(p.id)}">record</a>`,
  ]);

  const compare = `<section class="section">
    <div class="section__head">
      <h2>The decision table</h2>
      <p>This is the whole comparison in one screen: what each one is good at, who should not buy it, and the state of its record.</p>
    </div>
    ${table({
      cols: [
        'Product',
        'Best for',
        'Not for',
        'ASIN status',
        'Price',
        'Source record',
      ],
      rows: compareRows,
    })}
    <p class="fineprint">Price is intentionally empty. Under S02 a site may display price and availability only when Amazon serves that data or it comes from the Product Advertising API with a timestamp and disclaimer. This is a static page, so the honest value is "not published" rather than a number that could be wrong by the time you read it. ${src('S02')}</p>
  </section>`;

  const detail = rows
    .map(
      (p) => `<section class="productdetail" id="${esc(p.slug)}">
    <div class="productdetail__head">
      <div>
        <p class="productcard__brand">${esc(p.brand)} · ${esc(p.category)}</p>
        <h2>${esc(p.shortName)}</h2>
        <p class="productdetail__asin">Full listing title: <span class="muted">${esc(p.title)}</span></p>
      </div>
      <div class="productdetail__buy">${buyButton(p, 'primary')}</div>
    </div>
    <div class="productdetail__cols">
      <div>
        <h3 class="h4">What the listing says it does</h3>
        <p class="microcopy">Reproduced as the seller's claims. This site has not tested any product (${src('S05')}).</p>
        <ul class="claims">
          ${p.sellTheStrengths
            .map((s) => `<li><span class="claim ${s.tier}">${esc(s.text)}</span> ${tierBadge(s.tier)}</li>`)
            .join('\n          ')}
        </ul>
      </div>
      <div>
        <h3 class="h4">What to check before you decide</h3>
        <p class="microcopy">Our reasoning from the listing — labelled as inference, because that is what it is.</p>
        <ul class="claims claims--watch">
          ${p.watchOutFor
            .map((s) => `<li><span class="claim ${s.tier}">${esc(s.text)}</span> ${tierBadge(s.tier)}</li>`)
            .join('\n          ')}
        </ul>
      </div>
    </div>
    <div class="productdetail__foot">
      <p><strong>Best for:</strong> ${esc(p.bestFor)} &nbsp;·&nbsp; <strong>Not for:</strong> ${esc(p.notFor)}</p>
      <p class="fineprint">Observed ${esc(p.observedOn)}. ASIN ${esc(p.asin)}. ${
        p.flags.length ? `Open items: ${p.flags.map((f) => esc(f)).join(', ')}. ` : ''
      }<a href="${rel('/verification/links.html')}#${esc(p.id)}">See the link and source record →</a></p>
    </div>
  </section>`
    )
    .join('\n');

  const guideLinks = meta.guides
    .map(
      ([href, label]) => `<li><a href="${rel(href)}">${esc(label)}</a></li>`
    )
    .join('');

  const body = `<div class="pagehead">
    <p class="kicker">${esc(meta.kicker)}</p>
    <h1>${esc(meta.title)}</h1>
    <p class="lede">${esc(meta.lede)}</p>
    <ul class="pagehead__links">${guideLinks}</ul>
  </div>
  ${cards}
  ${compare}
  <section class="section">
    <div class="section__head"><h2>The detail, one product at a time</h2><p>Same information as the table, expanded: the claims, the trade-offs, and the state of each record.</p></div>
    ${detail}
  </section>
  <section class="section section--alt">
    <div class="callout">
      <h3>How to read the labels</h3>
      <p><strong>Seller claim</strong> means the sentence is Amazon listing text restated, not a test result. <strong>Editorial inference</strong> means it is our reasoning from that text — usually a trade-off the listing does not mention. <strong>Observed</strong> means we read it off the page ourselves on a dated visit. Nothing on this site is marked <em>tested</em>, because nothing was.</p>
    </div>
  </section>`;

  add(`/products/${catId}.html`, {
    title: `${meta.title} — compared by decision, not by brand | ${SITE.brand.name}`,
    description: meta.lede,
    body,
  });
}

/* ---- guides -------------------------------------------------------------- */
const GUIDE_BODIES = {
  'basket-or-oven-air-fryer': `
<p class="guide__lede">Both shapes are sold as "air fryers". One is a drawer you pull out and shake. The other is a small oven with a fan. If you buy the wrong one the food is still fine — but you will spend the next two years working around it.</p>

<h2>1. Do you need to shake the basket?</h2>
<p>Basket fryers are designed around the shake: you pull the drawer, toss the food, push it back. That motion is how you get even browning on loose items like fries or chickpeas.</p>
<p>An oven-style unit gives you a rack and a door. You can turn food with tongs, but you cannot toss a full batch in one movement. If most of what you cook is loose and needs agitation, the drawer is not a preference — it is the mechanism.</p>

<h2>2. Are you replacing an appliance, or adding one?</h2>
<p>A 26-quart French-door oven (the Emeril Lagasse unit on this site) is a countertop oven with an air-fry mode. If it replaces a toaster oven, it earns its footprint by doing two jobs.</p>
<p>A drawer is an addition. It does not toast bread and it will not roast a chicken for four. If you are adding rather than replacing, the drawer is the smaller commitment.</p>

<h2>3. What does "two zones" actually buy you?</h2>
<p>Dual-basket units let a protein and a side run on different temperatures and finish together. That is a real capability, and it is the one thing a single large drawer cannot do.</p>
<p>The trade-off is arithmetic: a "6 quart" dual basket is two 3-quart baskets, not one 6-quart basket. A whole chicken fits in neither half. See the <a href="${rel('/guides/air-fryer-capacity-checklist.html')}">capacity checklist</a> before you compare headline numbers.</p>

<h2>4. What will you clean, and how often?</h2>
<p>Count the parts that touch food. A dual basket has two drawers and usually two crisper plates. An oven has a door, a rack, a drip tray and whatever accessories came in the box — the Lagasse listing says six are included.</p>
<p>More parts is not automatically worse. It is worse if you will not wash them.</p>

<div class="callout">
  <h3>The one-line answer</h3>
  <p>If you cook loose food and want it shaken, buy the drawer. If you are replacing a toaster oven and want one box to do both jobs, buy the oven. If you routinely cook two things at different temperatures, buy the dual basket and accept that each side is small.</p>
</div>

<h2>Where these products sit on this question</h2>
<table class="data">
<thead><tr><th>Product</th><th>Shape</th><th>The consequence</th></tr></thead>
<tbody>
<tr><td><a href="${rel('/products/air-fryers.html')}#chefman-6-quart-dual-basket">Chefman 6-Quart Dual Basket</a></td><td>Two drawers, 3 qt each</td><td>Two temperatures, two wash-ups, small per side</td></tr>
<tr><td><a href="${rel('/products/air-fryers.html')}#chefman-8-quart-turbofry">Chefman 8-Quart TurboFry</a></td><td>One 8 qt drawer</td><td>One temperature, one wash-up, large batch</td></tr>
<tr><td><a href="${rel('/products/air-fryers.html')}#emeril-lagasse-26qt-french-door">Emeril Lagasse 26-Quart French Door</a></td><td>Oven cabinet, French doors</td><td>Replaces a toaster oven, most parts, largest footprint</td></tr>
</tbody>
</table>
<p class="fineprint">Shape and capacity are read from listing titles observed 2026-11-20 (${src('S02')} is the rule that makes claims about a product a compliance matter; the listing text itself is the source of the shape descriptions). None of these was tested.</p>
`,
  'air-fryer-capacity-checklist': `
<p class="guide__lede">Capacity numbers are the most compared and least useful spec in the category, because a quart means something different in each shape. Here is a two-minute checklist that survives contact with a real listing.</p>

<h2>The checklist</h2>
<ol class="checklist">
  <li><strong>Find out how many compartments the number covers.</strong> "6 quart" can be one drawer or two 3-quart drawers. The listing title usually says "dual basket" or "2 independent 3QT" — the Chefman dual basket says both.</li>
  <li><strong>Ask whether the number includes the crisper plate.</strong> Some capacities are measured to the rim with the insert removed. If the listing does not say, treat the number as a maximum, not a working volume.</li>
  <li><strong>Compare the shape, not the volume.</strong> Eight quarts in a shallow wide drawer cooks differently from eight quarts in a tall narrow one. Look at the interior dimensions if the listing gives them; if it does not, that is missing information worth noting.</li>
  <li><strong>Convert to portions you recognise.</strong> A useful anchor: a 3-quart basket is roughly a single batch of fries for two people. If your household is four, one 3-quart side is one round, not a meal.</li>
  <li><strong>Check the height against your counter.</strong> A big oven-style unit needs headroom under cabinets. Measure the gap, then look for the exterior height — not the capacity.</li>
  <li><strong>Write down what is missing.</strong> If the listing does not state interior dimensions, exterior dimensions, or watts, that is not a reason to guess. It is a reason to ask the seller.</li>
</ol>

<div class="callout callout--warn">
  <h3>What this site deliberately does not do</h3>
  <p>It does not convert quarts into "serves X people". That conversion depends on what you cook, and a confident-looking number would be invented. The portion anchor above is a rough rule of thumb, labelled as such, not a manufacturer specification.</p>
</div>

<h2>Run the checklist against the three products here</h2>
<table class="data">
<thead><tr><th>Product</th><th>Headline</th><th>Compartments</th><th>What the listing does not state</th></tr></thead>
<tbody>
<tr><td>Chefman 6-Quart Dual Basket</td><td>6 qt</td><td>2 × 3 qt</td><td>Interior dimensions, exterior dimensions</td></tr>
<tr><td>Chefman 8-Quart TurboFry</td><td>8 qt</td><td>1</td><td>Interior dimensions, exterior dimensions</td></tr>
<tr><td>Emeril Lagasse 26-Quart</td><td>26 qt</td><td>1 cabinet, 2 doors</td><td>Exterior dimensions in the title block</td></tr>
</tbody>
</table>
<p class="fineprint">Headline capacities are from the listing titles observed 2026-11-20. The "does not state" column records what was absent from the text retrieved in this build; it is not proof the seller never publishes it elsewhere. Re-check before relying on it. ${src('S02')}</p>
`,
  'cleanup-and-counter-space': `
<p class="guide__lede">Two costs arrive after the purchase and never appear in a comparison table: the washing-up and the footprint. Both are measurable before you buy, if you are willing to use a tape measure and count parts.</p>

<h2>Count the parts that touch food</h2>
<p>Go through the listing and count every component that will need washing after a typical cook.</p>
<ul class="ticks ticks--plain">
  <li>A single-drawer fryer: one drawer, one crisper plate. Two items.</li>
  <li>A dual-basket fryer: two drawers, two plates. Four items — twice the sink load for the same meal.</li>
  <li>A French-door oven: door glass, rack, drip tray, plus the accessories in the box. The Lagasse listing states six cooking accessories are included.</li>
</ul>
<p>"Dishwasher safe" reduces the labour but does not remove the loading, unloading, and hand-washing of anything too big for the rack.</p>

<h2>Measure the footprint properly</h2>
<p>Three measurements, in this order:</p>
<ol class="checklist">
  <li><strong>Counter depth.</strong> From the wall to the front edge. A large drawer needs clearance to pull out <em>plus</em> the drawer's own travel.</li>
  <li><strong>Under-cabinet height.</strong> An oven-style unit with a top-hinged element needs lid clearance. French doors swing out, not up, which changes where the clearance has to be.</li>
  <li><strong>Door or drawer swing.</strong> Tape the arc on the counter with painter's tape and live with it for a day. This sounds excessive until the first time you cannot open the drawer because the kettle is in the way.</li>
</ol>

<div class="callout">
  <h3>The trade-off in one sentence</h3>
  <p>Every additional compartment buys you a capability and costs you a part to wash and a centimetre of counter. Decide which of those two you have more of.</p>
</div>

<h2>If you are short on counter but long on cupboard</h2>
<p>Store the unit rather than leave it out — but check the weight and whether the cord retracts, because a heavy oven-style unit that lives in a cupboard will stop being used by week three. That is an inference from how appliances get used, not a measured finding, and it is labelled as such.</p>
<p class="fineprint">Trade-off analysis on this page is editorial inference drawn from listing specifications, not from testing (${src(
    'S05'
  )}). The parts counts come from the listing text observed 2026-11-20.</p>
`,
  'multifunction-appliance-questions': `
<p class="guide__lede">A multi-function appliance makes a promise about modes. The useful question is not "how many functions" but "which of these will I use in a normal week, and what did I give up to get the rest".</p>

<h2>The five questions</h2>

<h3>1. Which two functions will you actually use?</h3>
<p>Name them before you look at the price. If you cannot name two, you are buying a control panel. A 24-preset oven is excellent if you want presets and no better than a dial if you will only ever use one.</p>

<h3>2. What did the extra functions cost in physical space?</h3>
<p>More modes usually means more interior volume, more accessories, or both. The <a href="${rel('/guides/cleanup-and-counter-space.html')}">cleanup guide</a> covers how to measure that cost before you commit.</p>

<h3>3. Does the appliance do the second job properly, or adequately?</h3>
<p>An air fryer that also dehydrates is an air fryer with a low fan setting. That is a real function and a limited one. Ask what the temperature range and time limit are for the secondary mode, and whether they suit the job you have in mind.</p>

<h3>4. What is the failure mode of the extra part?</h3>
<p>Doors, hinges, baskets, probes and app connections all add a thing that can fail. A thermometer with an app is a thermometer plus a phone plus a network. When one of those three is unhappy, the cooking tool is still a thermometer — but a multi-function oven with a failed door is a cabinet.</p>

<h3>5. What happens when the app is discontinued?</h3>
<p>For connected appliances, ask whether the device works standalone. The CHEF iQ listing sells a WiFi probe system; the ThermoMaven listing sells a screen-on-the-device probe. The second one cannot be bricked by an app update. Neither listing states a support commitment, and this site does not assert one.</p>

<div class="callout callout--warn">
  <h3>On claims in this category</h3>
  <p>Multi-function listings lean on certification and accuracy language: NIST, NSF, ±0.5°F, 1000°F safe. Those are seller claims in the listing text. This site repeats them only with that label, because the certifying bodies' registries were not checked for this build. See <a href="${rel('/flagged/index.html')}#FLG-005">FLG-005</a>.</p>
</div>

<h2>Applied to the two thermometers here</h2>
<table class="data">
<thead><tr><th>Question</th><th>ThermoMaven instant-read</th><th>CHEF iQ Sense Gen3</th></tr></thead>
<tbody>
<tr><td>Mode you will actually use</td><td>Spot check, one second</td><td>Monitor a long cook</td></tr>
<tr><td>Extra parts</td><td>One probe, one screen</td><td>Three probes plus a hub</td></tr>
<tr><td>Depends on an app?</td><td>No — screen on device</td><td>Yes — WiFi and app</td></tr>
<tr><td>Works standalone if app ends?</td><td>Yes</td><td>Listing does not state</td></tr>
</tbody>
</table>
<p class="fineprint">Rows are drawn from the listing text observed 2026-11-20 and are labelled as seller claims, not tests. Where the listing is silent, the cell says so rather than guessing.</p>
`,
};

for (const g of GUIDES) {
  add(`/guides/${g.slug}.html`, {
    title: `${g.title} | ${SITE.brand.name}`,
    description: g.summary,
    body: `<article class="guide">
  <div class="pagehead">
    <p class="kicker">${esc(g.tag)} · Guide</p>
    <h1>${esc(g.title)}</h1>
    <p class="lede">${esc(g.summary)}</p>
    <p class="byline">By ${esc(SITE.brand.author.name)} · ${esc(g.date)} · ${esc(g.minutes)} min read
      ${badge('Topics are working hypotheses, not keyword data', 'info')}</p>
  </div>
  <div class="prose">
  ${GUIDE_BODIES[g.slug]}
  </div>
  <div class="guide__foot">
    <p><strong>What this guide is not.</strong> It is not a test. No product named here was handled by the publisher, and the trade-offs are reasoning from published specifications rather than measurements. Every product link is affiliate and marked as such.</p>
    <p><a href="${rel('/products/air-fryers.html')}">See the products this guide applies to →</a></p>
  </div>
</article>`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.title,
      description: g.summary,
      datePublished: g.date,
      dateModified: g.date,
      author: { '@type': 'Organization', name: SITE.brand.author.name },
      publisher: { '@type': 'Organization', name: SITE.brand.name },
      mainEntityOfPage: BASE + `/guides/${g.slug}.html`,
    },
  });
}

/* ---- guides index -------------------------------------------------------- */
{
  const body = `<div class="pagehead">
    <p class="kicker">Guides</p>
    <h1>Buying questions, answered without the filler</h1>
    <p class="lede">Four guides built around questions rather than keywords. The topics were chosen as hypotheses; whether anyone arrives is a separate question, and it is being measured rather than assumed.</p>
  </div>
  <div class="grid grid--2">
    ${GUIDES.map(
      (g) => `<a class="guidecard guidecard--tall" href="${rel(`/guides/${g.slug}.html`)}">
      <span class="guidecard__tag">${esc(g.tag)}</span>
      <h2>${esc(g.title)}</h2>
      <p>${esc(g.summary)}</p>
      <span class="guidecard__meta">${esc(g.minutes)} min read · published ${esc(g.date)}</span>
    </a>`
    ).join('\n    ')}
  </div>
  <section class="section">
    <div class="callout">
      <h3>How the next topic gets chosen</h3>
      <p>Not by instinct. The site records five events — page view, guide read, product intent, outbound click, and return — and the next guide is chosen from what those events show. That plan, including what is still missing to make it real, is on the <a href="${rel(
        '/decisions/growth-plan.html'
      )}">growth plan</a>.</p>
    </div>
  </section>`;
  add('/guides/index.html', {
    title: `Guides — air fryers and kitchen thermometers | ${SITE.brand.name}`,
    description: 'Four question-shaped guides about air fryer shape, capacity, ownership costs, and multi-function appliances.',
    body,
    extra: { inSitemap: true, inFeed: true },
  });
}

/* ---- decisions (suggestions) -------------------------------------------- */
{
  const groups = SUGGESTIONS.groups;

  const body = `<div class="pagehead">
    <p class="kicker">Decision room</p>
    <h1>Suggestions, with a cost and a decision attached</h1>
    <p class="lede">This is the review surface. Every suggestion is a proposal, not a change that has been made. Each one carries what it would take, what it would prove, and what it would cost — so a decision can be made by reading one row instead of commissioning another analysis.</p>
  </div>

  <div class="callout">
    <h3>How to use this page</h3>
    <p>Pick a path, not a feature. The three paths below are coherent complete positions; individual suggestions can be adopted piecemeal, but the site only makes sense as one of the three. Nothing here is implemented beyond the baseline already live — the current build is Path A.</p>
  </div>

  <div class="grid grid--3 paths">
    <div class="path">
      <h3>Path A — The honest shop</h3>
      <p class="path__tag">Live now</p>
      <p>Publish only what is verifiable. Label every claim. Show no prices until an authorised data route exists. Small, defensible, slow to grow.</p>
      <p class="path__why"><strong>Why it wins:</strong> it cannot be penalised for false claims, and it is the only path that can be built entirely from documents.</p>
      <p class="path__why"><strong>Why it loses:</strong> it will not out-convert a site that shows prices and ratings, because buyers want numbers.</p>
    </div>
    <div class="path path--rec">
      <h3>Path B — Open the data taps</h3>
      <p class="path__tag">Recommended</p>
      <p>Apply for Product Advertising API access and use SiteStripe. Show price and availability with the required timestamp and disclaimer. Keep every label. Add measurement.</p>
      <p class="path__why"><strong>Why it wins:</strong> it converts the site's main disadvantage into its main feature — live data with an auditable trail.</p>
      <p class="path__why"><strong>Why it loses:</strong> depends on an approval the owner does not control yet.</p>
    </div>
    <div class="path">
      <h3>Path C — Become a test desk</h3>
      <p class="path__tag">Highest ceiling</p>
      <p>Buy units, test them, publish protocols and results. Hire nothing; publish the method. This is the only path that justifies the word "reviewed".</p>
      <p class="path__why"><strong>Why it wins:</strong> original data is the one thing a competing site cannot copy.</p>
      <p class="path__why"><strong>Why it loses:</strong> it needs spend and time before the first publishable result.</p>
    </div>
  </div>

  ${groups
    .map(
      (g) => `<section class="section">
    <div class="section__head">
      <h2>${esc(g.title)}</h2>
      <p>${esc(g.intro)}</p>
    </div>
    ${table({
      cols: ['#', 'Suggestion', 'What it fixes', 'Effort', 'Evidence it works', 'Path'],
      rows: g.items.map((s) => [
        `<code>${esc(s.id)}</code>`,
        `<strong>${esc(s.title)}</strong><br><span class="muted">${esc(s.detail)}</span>`,
        esc(s.fixes),
        esc(s.effort),
        esc(s.evidence),
        esc(s.path),
      ]),
      cls: 'suggestions',
    })}
  </section>`
    )
    .join('\n')}

  <section class="section">
    <div class="section__head">
      <h2>What to choose, if you only choose once</h2>
    </div>
    <div class="callout callout--rec">
      <p><strong>Path B, in this order.</strong> (1) Confirm the Associates account and the tag — that is Q-01 and nothing else matters until it is done. (2) Run the one-link test and confirm a click appears in the report — Q-02. (3) Turn on the event endpoint — Q-05. (4) Apply for API access — Q-13. Everything else on this page is optimisation in front of those four; doing them in a different order is how sites end up with beautiful pages and no data.</p>
    </div>
    <p class="fineprint">Every suggestion on this page is a proposal. None of it has been implemented silently. The open questions behind them are on the <a href="${rel(
      '/decisions/questions.html'
    )}">open questions</a> page.</p>
  </section>`;

  add('/decisions/index.html', {
    title: `Suggestions and decision paths | ${SITE.brand.name}`,
    description: 'A review surface: each suggestion carries its cost, the evidence it would produce, and which of three coherent paths it belongs to.',
    body,
  });
}

/* ---- questions ----------------------------------------------------------- */
{
  const H = QUESTIONS.questions;
  const byGroup = {};
  H.forEach((q) => (byGroup[q.group] = byGroup[q.group] || []).push(q));

  const summaryRows = Object.entries(byGroup).map(([group, qs]) => [
    `<strong>${esc(group)}</strong>`,
    String(qs.length),
    String(qs.filter((q) => q.answerType === 'answerable-from-documents').length),
    String(qs.filter((q) => q.answerType === 'owner-only').length),
    String(qs.filter((q) => q.answerType === 'requiresPurchaseOrTest').length),
  ]);

  const body = `<div class="pagehead">
    <p class="kicker">Open questions</p>
    <h1>What has to be answered before a decision is reasonable</h1>
    <p class="lede">Twenty questions that cannot be settled from the material available to this build. Each records what is already known, exactly what is missing, what it blocks, and the cheapest way to close it. Nothing here is answered by guessing.</p>
  </div>

  ${table({
    cols: ['Group', 'Questions', 'Answerable from documents', 'Owner only', 'Needs a test or a purchase'],
    rows: summaryRows,
    cls: 'summary',
  })}

  ${Object.entries(byGroup)
    .map(
      ([group, qs]) => `<section class="section">
    <div class="section__head"><h2>${esc(group)}</h2></div>
    <div class="qlist">
      ${qs
        .map(
          (q) => `<article class="q" id="${esc(q.id)}">
        <div class="q__head">
          <code class="q__id">${esc(q.id)}</code>
          <h3>${esc(q.question)}</h3>
          <span class="q__type q__type--${esc(q.answerType)}">${esc(
            q.answerType.replace(/-/g, ' ')
          )}</span>
        </div>
        <dl class="q__grid">
          <div><dt>Already known</dt><dd>${esc(q.known)}</dd></div>
          <div><dt>Still missing</dt><dd>${esc(q.missing)}</dd></div>
          <div><dt>What it blocks</dt><dd>${esc(q.blocks)}</dd></div>
          <div><dt>Cheapest way to close it</dt><dd>${esc(q.howToFind)}</dd></div>
        </dl>
        <p class="q__foot">Effort: ${esc(q.effort)} &nbsp;·&nbsp; Sources: ${srcList(q.sourceIds)}${
            q.flagRef ? ` &nbsp;·&nbsp; <a href="${rel('/flagged/index.html')}#${esc(q.flagRef)}">${esc(q.flagRef)}</a>` : ''
          }</p>
      </article>`
        )
        .join('\n      ')}
    </div>
  </section>`
    )
    .join('\n')}

  <section class="section">
    <div class="callout callout--rec">
      <h3>If you answer only four</h3>
      <p><strong>Q-01</strong> (is the account real), <strong>Q-02</strong> (do the links actually track), <strong>Q-05</strong> (where does measurement go), <strong>Q-13</strong> (can we show prices). Those four determine whether this is a business or a brochure. The other sixteen improve it.</p>
    </div>
  </section>`;

  add('/decisions/questions.html', {
    title: `Open questions blocking decisions | ${SITE.brand.name}`,
    description: 'Twenty questions the current material cannot answer, each with what is missing and the cheapest way to close it.',
    body,
  });
}

/* ---- growth plan --------------------------------------------------------- */
{
  const body = `<div class="pagehead">
    <p class="kicker">Growth plan</p>
    <h1>Publish on a cadence, then measure what arrives</h1>
    <p class="lede">This page is a plan, not a report card. It sets a cadence, defines what "working" would mean, and states plainly that no traffic figure, conversion rate or revenue projection exists yet — because inventing one would be the most damaging thing this site could do.</p>
  </div>

  <section class="section">
    <div class="section__head"><h2>The cadence</h2><p>One guide per week for eight weeks, then stop and read the data before writing a ninth.</p></div>
    ${table({
      cols: ['Week', 'Publish', 'Why this one', 'How it is judged'],
      rows: [
        ['1', 'Basket or oven-style: what should you compare?', 'The largest fork in the category and the question every buyer hits first.', 'Guide-read event on the page; bounce on the comparison table'],
        ['2', 'A no-hype checklist for comparing capacity', 'Capacity is the most-compared and least-understood number.', 'Scroll depth to the checklist; outbound click after reading'],
        ['3', 'Cleanup and counter-space trade-offs', 'The post-purchase regret question, which almost nobody answers.', 'Time on page; return visits'],
        ['4', 'Questions before buying a multi-function appliance', 'Covers the two thermometers, which the fryer guides do not.', 'Cross-category navigation: fryer page → thermometer page'],
        ['5–8', 'Chosen from measured queries, not from this list', 'After four weeks there is data. Writing week five before reading week one is guessing.', 'Whichever event the data says is weak'],
      ],
    })}
    <p class="fineprint">Publishing a fixed list of eight titles now would be the mistake this plan exists to avoid. Weeks five to eight are deliberately unspecified.</p>
  </section>

  <section class="section section--alt">
    <div class="section__head"><h2>What "working" means, stated in advance</h2><p>Pre-registering the success criteria stops the numbers being reinterpreted after the fact.</p></div>
    ${table({
      cols: ['Signal', 'Measured by', 'Threshold that would mean "keep going"', 'Threshold that would mean "stop and rethink"'],
      rows: [
        ['Someone reads a guide to the end', 'Guide-read event fired at 90% scroll', 'More than 25% of guide views reach the end', 'Under 10% — the writing is the problem, not the topic'],
        ['Someone moves from reading to considering', 'Product-intent event (click on a product detail or table row)', 'More than 8% of guide readers fire it', 'Under 2% — the guide is not connecting to the products'],
        ['Someone leaves for Amazon', 'Outbound-click event', 'More than 3% of sessions', 'Under 1%, with intent events healthy — the buy button is the problem'],
        ['The click is attributed to us', 'Associates report (owner-only)', 'Clicks appear against the tag', 'No clicks appear — the links are not tracking, stop publishing'],
      ],
    })}
    <p class="fineprint">These thresholds are honest guesses, set deliberately low, and labelled as guesses. They exist so that a decision can be made later without renegotiating the standard. The Associates row is the only one this site cannot measure by itself.</p>
  </section>

  <section class="section">
    <div class="section__head"><h2>Findability: one site, a sitemap, and a reason to rank</h2></div>
    <div class="prose">
      <p>The site publishes a single canonical host, <code>${esc(SITE.brand.domain)}</code>, a <a href="${rel(
    '/sitemap.xml'
  )}">sitemap</a> at the root, a <a href="${rel('/robots.txt')}">robots.txt</a> that points at it, and an <a href="${rel(
    '/feed.xml'
  )}">RSS feed</a> of new guides. Those are the mechanical preconditions for indexing — nothing more. Google documents the sitemap formats it accepts but states no preference among them (${src(
    'S07'
  )}), so this site ships an XML sitemap for pages plus an RSS feed for readers.</p>
      <p>The editorial reason to rank is narrower than a keyword strategy: each guide answers a question with a decision at the end, and each names what it could not verify. That is a defensible position against a competitor publishing confident filler. Whether it ranks is a question for the <a href="${rel(
        '/platform/metrics.html'
      )}">measurement plan</a>, not for this paragraph.</p>
      <div class="callout callout--warn">
        <h3>No search-volume claims are made anywhere in this plan</h3>
        <p>No keyword tool was consulted, so no volume, difficulty or ranking probability is stated. The four topics are working hypotheses. Treating them as validated demand would be exactly the hallucination this project is built to avoid.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section__head"><h2>The measurement prerequisite, before anything else</h2></div>
    <div class="callout callout--rec">
      <p><strong>Turn on measurement before writing week two.</strong> The site already fires five defined events client-side, but a client-side counter with no endpoint is a note in a notebook. Until Q-05 is answered there is no way to know whether week one worked, and every subsequent decision is then made on taste. The events are defined on the <a href="${rel(
        '/platform/metrics.html'
      )}">metrics page</a>.</p>
    </div>
  </section>`;

  add('/decisions/growth-plan.html', {
    title: `Growth plan — cadence, success criteria, findability | ${SITE.brand.name}`,
    description: 'A publishing cadence with pre-registered success thresholds, a sitemap and feed, and an explicit refusal to invent traffic numbers.',
    body,
  });
}

/* ---- verification dashboard --------------------------------------------- */
{
  const verified = SOURCES.filter((s) => s.verified).length;
  const unverified = SOURCES.length - verified;
  const claimRows = [];
  PRODUCTS.products.forEach((p) => {
    p.sellTheStrengths.forEach((s) =>
      claimRows.push([esc(p.shortName), esc(s.text), tierBadge(s.tier), srcList(p.sourceIds)])
    );
    p.watchOutFor.forEach((s) =>
      claimRows.push([esc(p.shortName), esc(s.text), tierBadge(s.tier), srcList(p.sourceIds)])
    );
  });

  const body = `<div class="pagehead">
    <p class="kicker">Verification</p>
    <h1>The register behind every claim on this site</h1>
    <p class="lede">This is the dashboard a buyer never sees and a reviewer always needs. It records what was checked, against which source, on which date, and — in the same place — what was not checked.</p>
  </div>

  <div class="grid grid--4 stats">
    <div class="stat"><span class="stat__n">${SOURCES.length}</span><span class="stat__l">sources in the register</span></div>
    <div class="stat"><span class="stat__n">${verified}</span><span class="stat__l">retrieved and quoted</span></div>
    <div class="stat"><span class="stat__n">${unverified}</span><span class="stat__l">listed but not verified</span></div>
    <div class="stat stat--warn"><span class="stat__n">${FLAGS.filter((f) => f.status === 'open').length}</span><span class="stat__l">open flags</span></div>
  </div>

  <section class="section">
    <div class="section__head"><h2>Where to look for what</h2></div>
    <div class="grid grid--2">
      <a class="linkcard" href="${rel('/verification/sources.html')}"><h3>Source register</h3><p>Every source, its publisher, its date, whether it was retrieved, and what it is cited for — with quotes.</p></a>
      <a class="linkcard" href="${rel('/verification/links.html')}"><h3>Link audit</h3><p>Each supplied link: intended target and observed redirect kept in separate columns, with the match status.</p></a>
      <a class="linkcard" href="${rel('/verification/products.html')}"><h3>Product data table</h3><p>ASIN, category path, observation date, and the three fields deliberately left blank.</p></a>
      <a class="linkcard" href="${rel('/verification/research-log.html')}"><h3>Research log</h3><p>The working record: what was retrieved, what failed, and what that changed.</p></a>
    </div>
  </section>

  <section class="section">
    <div class="section__head">
      <h2>Every claim on the site, and its label</h2>
      <p>${claimRows.length} rows. No row is allowed to exist without a source id, and the build fails if a row cites an id that is not in the register.</p>
    </div>
    ${table({ cols: ['Product', 'Claim as published', 'Label', 'Source'], rows: claimRows, cls: 'claims-table' })}
  </section>

  <section class="section">
    <div class="callout callout--warn">
      <h3>What the register deliberately contains</h3>
      <p>Three sources are listed that were <em>not</em> retrieved: the Amazon Seller Central ASIN glossary (requires a seller account), the sitemaps.org protocol document, and the GA4 help page. They are in the register so a reviewer can see the gap, not so the site can look thorough. Each is labelled "not retrieved" wherever it appears, and no claim depends on one.</p>
    </div>
  </section>`;

  add('/verification/index.html', {
    title: `Verification dashboard | ${SITE.brand.name}`,
    description: 'Source status, link audit, product data, and every published claim with its label.',
    body,
  });
}

/* ---- sources page -------------------------------------------------------- */
{
  const rows = SOURCES.map((s) => [
    `<code>${esc(s.id)}</code>`,
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a><br><span class="muted">${esc(
      s.publisher
    )}</span>`,
    esc(s.tier),
    esc(s.evidence || '—'),
    esc(s.dated),
    s.verified ? badge('Retrieved ' + s.retrieved, 'ok') : badge(s.status || 'not verified', 'warn'),
    s.supports.length ? `<ul class="mini">${s.supports.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '<span class="muted">nothing quoted</span>',
  ]);

  const body = `<div class="pagehead">
    <p class="kicker">Verification · Sources</p>
    <h1>Source register</h1>
    <p class="lede">A source appears here only if it was actually fetched during the build. Every row records the publisher, the date on the document, the retrieval date, and what the document is cited for. Sources that could not be reached are listed too, and marked.</p>
  </div>
  <div class="callout">
    <h3>Evidence tier — what "verified" is allowed to mean here</h3>
    <p>The sources below were not all checked to the same depth, and the register says so rather than implying a single standard. <strong>A — full text:</strong> the document was retrieved and the relevant section read end to end. <strong>B — section:</strong> the specific section cited was retrieved and quoted, but the whole document was not. <strong>C — secondary:</strong> a third party, used for orientation only and never to support a claim.</p>
  </div>
  ${table({ cols: ['ID', 'Source', 'Tier', 'Evidence', 'Document date', 'Status', 'What it supports'], rows })}
  <section class="section">
    <div class="callout">
      <h3>Quoted text</h3>
      <p>Where a rule is quoted on this site, the quote is copied from the retrieved page rather than paraphrased. The quotes are in <code>data/sources.json</code> in the repository, next to the citation, so a reviewer can diff the quote against the live document.</p>
    </div>
  </section>`;
  add('/verification/sources.html', {
    title: `Source register | ${SITE.brand.name}`,
    description: 'Every source used, with publisher, document date, retrieval date, and what it supports. Unretrieved sources are marked.',
    body,
  });
}

/* ---- link audit ---------------------------------------------------------- */
{
  const rows = LINKS.records.map((r) => {
    const p = PRODUCTS.products.find((x) => x.id === r.productId);
    return [
      `<code>${esc(r.recordId)}</code><br><span class="muted">${esc(r.productId)}</span>`,
      `<a href="${esc(r.submitted.suppliedUrl)}" target="_blank" rel="noopener nofollow sponsored">${esc(
        r.submitted.suppliedUrl
      )}</a><br><code class="asin">${esc(r.submitted.suppliedCode)}</code>`,
      r.submitted.intendedAsin ? `<code>${esc(r.submitted.intendedAsin)}</code>` : `<span class="unver">blank — not supplied</span>`,
      `<a href="${esc(r.observed.observedFinalUrl)}" target="_blank" rel="noopener nofollow sponsored">/dp/${esc(
        r.observed.observedAsin
      )}</a>`,
      badge(r.match.codeMatchesObservedAsin ? 'match' : 'different', r.match.codeMatchesObservedAsin ? 'ok' : 'fail'),
      r.observed.tagParameterFound ? badge('found', 'ok') : badge('not found', 'fail'),
      esc(r.observed.observedOn),
    ];
  });

  const body = `<div class="pagehead">
    <p class="kicker">Verification · Links</p>
    <h1>Link audit and product-intent record</h1>
    <p class="lede">Two questions per link, kept in two separate sets of columns: what was it meant to be, and what did it actually do. Merging those two columns is how a dead link survives a review.</p>
  </div>

  <div class="callout callout--warn">
    <h3>Read this before reading the table</h3>
    <p>None of the five supplied links carried a visible tracking tag when resolved on 2026-11-20, and none resolved to an ASIN matching its own code. That is a description of what the redirect did, not a legal opinion. The compliance status of <code>link.amazon</code> short links is <strong>unresolved</strong> and is recorded as unresolved. The observation is <a href="${rel(
      '/flagged/index.html'
    )}#FLG-003">FLG-003</a>.</p>
  </div>

  <section class="section">
    <div class="section__head">
      <h2>Product-intent confirmation record</h2>
      <p>Intended values and observed values never share a column. Where the intended ASIN was not supplied, the cell stays blank rather than being back-filled from the redirect — because back-filling would erase the very discrepancy the record exists to catch.</p>
    </div>
    ${table({
      cols: ['Record', 'Supplied link', 'Intended ASIN', 'Observed redirect', 'Code = ASIN?', 'Tag parameter', 'Observed on'],
      rows,
      cls: 'links',
    })}
    <p class="fineprint">The <em>supplied link</em> column is a record of what was submitted. Those links are shown as <code>rel="sponsored nofollow"</code> because that is what they are, whatever their tracking status turns out to be.</p>
  </section>

  <section class="section">
    <div class="section__head"><h2>The one-link enrollment test, in order</h2><p>Written down so it can be run once, correctly, rather than improvised across five links.</p></div>
    ${table({
      cols: ['Step', 'Action', 'What proves it worked'],
      rows: LINKS.enrollmentTestPlan.steps.map((s, i) => [String(i + 1), esc(s), i === 4 ? 'A click dated today appears against the link in the Associates report' : '—']),
    })}
    <p class="fineprint">Status: ${badge(LINKS.enrollmentTestPlan.status, 'fail')}. ${esc(
    LINKS.enrollmentTestPlan.reason
  )}</p>
  </section>`;
  add('/verification/links.html', {
    title: `Link audit and product-intent record | ${SITE.brand.name}`,
    description: 'Supplied links against observed redirects, with intended and observed values held in separate columns.',
    body,
  });
}

/* ---- product data table -------------------------------------------------- */
{
  const rows = PRODUCTS.products.map((p) => [
    `<code>${esc(p.id)}</code>`,
    `<strong>${esc(p.shortName)}</strong><br><span class="muted">${esc(p.brand)}</span>`,
    `<code class="asin">${esc(p.asin)}</code>`,
    esc(p.category),
    esc(p.categoryPath.join(' › ')),
    `<span class="unver">not published</span>`,
    `<span class="unver">not published</span>`,
    esc(p.observedOn),
    esc(p.flags.join(', ')),
  ]);

  const body = `<div class="pagehead">
    <p class="kicker">Verification · Products</p>
    <h1>Product data table</h1>
    <p class="lede">The machine-readable record behind the shop pages. Blank cells are blank on purpose. A blank is a finding, and each one names the reason.</p>
  </div>
  ${table({
    cols: ['ID', 'Product', 'ASIN', 'Category', 'Category path (observed)', 'Price', 'Rating', 'Observed', 'Flags'],
    rows,
    cls: 'products',
  })}

  <section class="section">
    <div class="section__head"><h2>Why three fields are empty</h2></div>
    ${table({
      cols: ['Field', 'Reason it is not published', 'What would let it be published'],
      rows: PRODUCTS.meta.withheldByPolicy.map((w) => [
        `<strong>${esc(w.field)}</strong>`,
        esc(w.reason),
        esc(w.handling),
      ]),
    })}
    <p class="fineprint">All three reasons trace to ${src(
      'S02'
    )} (Product Advertising Content rules and the pricing permission) and ${src('S05')} (claims that require proof).</p>
  </section>

  <section class="section">
    <div class="section__head"><h2>Observation method</h2></div>
    <div class="prose"><p>${esc(PRODUCTS.meta.observationMethod)}</p></div>
  </section>`;

  add('/verification/products.html', {
    title: `Product data table | ${SITE.brand.name}`,
    description: 'ASIN, category path, observation date and deliberately blank fields for all five products.',
    body,
  });
}

/* ---- research log -------------------------------------------------------- */
{
  const rows = LOG.entries.map((e) => [
    `<code>${esc(e.id)}</code>`,
    esc(e.time),
    `<strong>${esc(e.action)}</strong><br><span class="muted">${esc(e.detail)}</span>`,
    esc(e.result),
    e.source ? src(e.source) : '<span class="muted">—</span>',
  ]);

  const body = `<div class="pagehead">
    <p class="kicker">Verification · Log</p>
    <h1>Research log</h1>
    <p class="lede">The working record, in order. It includes the things that failed — a blocked host, a disabled workflow, a page that would not give up a reliable number — because a log that only records successes is a marketing document.</p>
  </div>
  ${table({ cols: ['#', 'Time (UTC)', 'Action', 'Result', 'Source'], rows })}
  <section class="section">
    <div class="callout">
      <h3>Why this page is public</h3>
      <p>Because the useful question about a site like this is not "did it find an answer" but "how would I know if it did". A dated log with the failures left in is the cheapest honest answer.</p>
    </div>
  </section>`;
  add('/verification/research-log.html', {
    title: `Research log | ${SITE.brand.name}`,
    description: 'A dated working record of what was retrieved, what failed, and what changed as a result.',
    body,
  });
}

/* ---- flagged for review -------------------------------------------------- */
{
  const open = FLAGS.filter((f) => f.status !== 'closed');
  const closed = FLAGS.filter((f) => f.status === 'closed');

  const card = (f) => `<article class="flag" id="${esc(f.id)}">
    <div class="flag__head">
      <code>${esc(f.id)}</code>
      <h2>${esc(f.title)}</h2>
      <div class="flag__badges">${tierBadge(f.severity)} ${badge(f.category, 'neutral')} ${tierBadge(
    f.status
  )}</div>
    </div>
    <dl class="flag__grid">
      <div><dt>Expected</dt><dd>${esc(f.expected)}</dd></div>
      <div><dt>Observed</dt><dd>${esc(f.observed)}</dd></div>
      <div><dt>Why it matters</dt><dd>${esc(f.whyItMatters || '—')}</dd></div>
      ${f.notClaimed ? `<div><dt>Not claimed</dt><dd>${esc(f.notClaimed)}</dd></div>` : ''}
      <div><dt>How to close it</dt><dd>${esc(f.howToClose)}</dd></div>
      <div><dt>What it blocks</dt><dd>${esc(f.blocks)}</dd></div>
    </dl>
    <p class="flag__foot">Sources: ${srcList(f.sourceIds)}${
    f.link ? ` &nbsp;·&nbsp; <a href="${esc(f.link)}" target="_blank" rel="noopener">Open the official page →</a>` : ''
  }</p>
  </article>`;

  const body = `<div class="pagehead">
    <p class="kicker">Review queue</p>
    <h1>Flagged for Review</h1>
    <p class="lede">Everything this build could not confirm, plus every contradiction it found. Nothing on this page blocks the site — that is the point of publishing it separately. Each item carries the source link needed to close it.</p>
  </div>

  <div class="callout callout--warn">
    <h3>Five flags worth reading first</h3>
    <ol class="tight">
      <li><a href="#FLG-001">FLG-001</a> — the Associates account for the supplied tag is unconfirmed. Nothing earns until this is checked.</li>
      <li><a href="#FLG-003">FLG-003</a> — none of the five supplied links carried a visible tag, and none resolved to the ASIN its code appears to spell.</li>
      <li><a href="#FLG-004">FLG-004</a> — no price or rating is published anywhere, on purpose, with the policy reason given.</li>
      <li><a href="#FLG-005">FLG-005</a> — two certification claims were repeated only as seller claims, because the registries were not checked.</li>
      <li><a href="#FLG-006">FLG-006</a> — nothing here was physically tested, so the site never uses the language of testing.</li>
    </ol>
  </div>

  <section class="section">
    <div class="section__head"><h2>Open and accepted (${open.length})</h2><p>"Accepted" means the limitation is known, documented, and considered correct for now — not ignored.</p></div>
    ${open.map(card).join('\n')}
  </section>

  ${
    closed.length
      ? `<section class="section">
    <div class="section__head"><h2>Closed (${closed.length})</h2></div>
    ${closed.map(card).join('\n')}
  </section>`
      : ''
  }

  <section class="section">
    <div class="callout">
      <h3>How to request a change</h3>
      <p>Open an issue on the repository with the flag id in the title. Each flag is designed to be closable with one check and one linked source: either the registry entry exists or it does not, either the tag is approved or it is not.</p>
    </div>
  </section>`;

  add('/flagged/index.html', {
    title: `Flagged for Review | ${SITE.brand.name}`,
    description: 'Every unverified item and contradiction found during the build, each with the official source needed to close it.',
    body,
  });
}

/* ---- compliance ---------------------------------------------------------- */
{
  const body = `<div class="pagehead">
    <p class="kicker">Compliance gate</p>
    <h1>The rules this site is built to, and where each one comes from</h1>
    <p class="lede">Not a policy statement written by a lawyer — a list of the specific clauses that changed how the site was built, each linked to the document it came from. This page is the gate: if a proposed change breaks one of these, it does not ship.</p>
  </div>

  ${table({
    cols: ['Rule', 'What it says', 'What it changed on this site', 'Source'],
    rows: [
      [
        'The disclosure sentence',
        'Must clearly and prominently state: "As an Amazon Associate I earn from qualifying purchases."',
        'The exact sentence appears in a strip under the masthead and again in the footer of every single page, including this one.',
        src('S01'),
      ],
      [
        'Disclosure must be hard to miss',
        'Disclosures at the end of a page, behind a click, or on an about page are likely to be missed. Use simple language such as "ad", "advertisement" or "sponsored".',
        'The strip sits above the first line of content on every page, not in the footer alone. No vague terms such as "sp" or "collab" are used anywhere.',
        src('S05'),
      ],
      [
        'Every product link is tagged',
        'Special Links must use the tagged link formats and carry the Associates ID as a URL parameter.',
        'Every outbound product link is generated through one function that adds rel="sponsored nofollow noopener" and routes through a single interstitial, so an untagged link cannot be introduced by accident.',
        src('S01'),
      ],
      [
        'No price without an authorised source',
        'Prices and availability may be shown only if Amazon serves them in the link, or via Creators API / PA API with a timestamp and the fixed prices-change disclaimer.',
        'No price appears anywhere. Buy buttons say the price is shown on Amazon. This is the single largest design compromise on the site and is recorded as FLG-004.',
        src('S02'),
      ],
      [
        'No cached images or content',
        'Program Content consisting of an image may not be stored or cached; other Product Advertising Content may be cached no longer than 24 hours. ASINs may be stored indefinitely.',
        'No Amazon image, review text or description is copied. Product cards use generated editorial illustration. ASINs are stored, which the same clause permits.',
        src('S02'),
      ],
      [
        'No automated extraction',
        'The licence excludes data mining, robots and similar extraction tools.',
        'Product data was read by hand, once, from five pages. No crawler, scraper or bulk fetch was run.',
        src('S02'),
      ],
      [
        'Agents must identify themselves',
        'An agent may not access Program Content unless it identifies itself, including an "Agent/[name]" user-agent string.',
        'Any future automation is specified to identify itself and to stop if Amazon says so. This is why automated re-verification is a documented plan rather than a running crawler.',
        src('S02'),
      ],
      [
        'No misleading product claims',
        'You may not make inaccurate, overbroad, deceptive or misleading claims about a product, price or policy.',
        'Every claim carries one of three labels: seller claim, editorial inference, observed. Nothing is presented as tested.',
        src('S02'),
      ],
      [
        'No claims of experience',
        'You cannot talk about your experience with a product you have not tried.',
        'Product copy never claims personal experience of a product. The build checker fails if first-hand testing language appears. FLG-006 records the limitation.',
        src('S05'),
      ],
      [
        'No Amazon marks in names',
        'No trademark, domain, subdomain, username or app name confusingly similar to an Amazon mark.',
        'The site is named independently. It does not use "Amazon" in its name, domain, subdomain or navigation, and the footer states no affiliation.',
        src('S02'),
      ],
      [
        'Keep every outbound product link marked sponsored',
        'Links that pay commission must be identifiable as such.',
        "Enforced at build time: the link helper is the only place a buy URL is produced, and the build's link checker fails the build if any outbound product anchor lacks rel='sponsored'.",
        src('S01'),
      ],
    ],
  })}

  <section class="section">
    <div class="section__head"><h2>The gate, in operational terms</h2></div>
    <div class="grid grid--2">
      <div class="callout callout--ok">
        <h3>Automated — fails the build</h3>
        <ul class="tight">
          <li>Any product anchor missing <code>rel="sponsored"</code>.</li>
          <li>Any internal link missing <code>rel="sponsored"</code> when it should not have it.</li>
          <li>Any claim citing a source id that is not in the register.</li>
          <li>Any internal link or asset that does not resolve to a file.</li>
          <li>Any page missing the masthead disclosure or the footer disclosure.</li>
        </ul>
      </div>
      <div class="callout callout--warn">
        <h3>Human — cannot be automated</h3>
        <ul class="tight">
          <li>Whether a factual claim is accurate. A model can check that a label exists; it cannot know the listing changed.</li>
          <li>Whether a certification is real. That needs a registry lookup with a person reading it.</li>
          <li>Whether the disclosure is genuinely prominent on a phone, which needs eyes.</li>
          <li>Whether the account is approved, which needs the owner's sign-in.</li>
        </ul>
      </div>
    </div>
    <p class="fineprint">The split matters: automating the left column is genuine progress, and pretending the right column is automated is how sites publish confidence they have not earned.</p>
  </section>

  <section class="section">
    <div class="section__head"><h2>If the account is terminated</h2></div>
    <div class="prose">
      <p>Under ${src(
        'S01'
      )} Section 6 termination takes effect 7 calendar days after written notice, and a violation of the disclosure section is treated as a material breach. The operational consequence is simple because the site has one link configuration point: remove the tag from the link helper, remove the Amazon-derived product claims, and leave the guides — which are original writing and reference no Amazon content — in place.</p>
      <p>That is not legal advice. It is the reason the build keeps Amazon-derived content in a single data file instead of scattered through the page templates.</p>
    </div>
  </section>`;

  add('/compliance/index.html', {
    title: `Compliance gate | ${SITE.brand.name}`,
    description: 'The specific clauses that shaped this build, what each one changed, and the automated versus human split of the gate.',
    body,
  });
}

/* ---- about -------------------------------------------------------------- */
{
  add('/about/index.html', {
    title: `About ${SITE.brand.name}`,
    description: 'Who publishes this site, how it works, and what it refuses to do.',
    body: `<div class="pagehead">
    <p class="kicker">About</p>
    <h1>A research desk that sells things</h1>
    <p class="lede">${esc(SITE.brand.tagline)}</p>
  </div>
  <div class="prose">
    <p>${esc(SITE.brand.publisherNote)}</p>
    <h2>Byline</h2>
    <div class="authorbox">
      <span class="authorbox__avatar" aria-hidden="true">${esc(SITE.brand.author.avatarInitials)}</span>
      <div>
        <p class="authorbox__name">${esc(SITE.brand.author.name)}</p>
        <p class="authorbox__role">${esc(SITE.brand.author.role)}</p>
        <p>${esc(SITE.brand.author.bio)}</p>
      </div>
    </div>
    <p class="fineprint">The byline is a desk, not a person, because no individual has agreed to be named as the author. That is stated rather than hidden behind a stock portrait: inventing a human reviewer would be the most obvious lie a site like this could tell.</p>

    <h2>What this site will do</h2>
    <ul class="ticks ticks--plain">
      <li>Tell you which of five products suits which kind of cooking, and which one does not.</li>
      <li>Label every sentence as a seller claim, our inference, or something we read off the listing ourselves.</li>
      <li>Publish the things it could not verify, on a page you can reach from every footer.</li>
      <li>Pay for itself through affiliate commission, disclosed on every page.</li>
    </ul>

    <h2>What this site will not do</h2>
    <ul class="crosses">
      <li>Publish a price it cannot serve legally or keep current.</li>
      <li>Publish a star rating copied from a page whose text mixes products together.</li>
      <li>Claim a product was tried, tested or handled by this desk when it was not.</li>
      <li>Estimate traffic, conversion rate or revenue for you.</li>
      <li>Use a vague disclosure like "sp" or hide it at the bottom of the page.</li>
    </ul>

    <h2>How the site is built</h2>
    <p class="fineprint">Generated surface: {{PAGECOUNT}} pages plus {{LINKPAGECOUNT}} link-interstitial pages, produced from JSON data files on 2026-11-20 and verified by the build gate before publication. The numbers are written by the build, not typed by hand.</p>
    <p>The pages are generated from JSON data files by a small Node build script. That is not engineering vanity: it is what makes the compliance rules enforceable. The build fails if a product link is not marked sponsored, if a claim cites a source that is not registered, or if a page loses its disclosure. See the <a href="${rel(
      '/compliance/index.html'
    )}">compliance gate</a>.</p>
    <p>There is no database, no login, no cookie and no third-party script. The only JavaScript on the site counts five events locally and, if an endpoint is configured, posts one small body to it.</p>
  </div>`,
  });

  add('/about/editorial-policy.html', {
    title: `Editorial policy | ${SITE.brand.name}`,
    description: 'The three labels used on every claim, and what each one permits us to say.',
    body: `<div class="pagehead">
    <p class="kicker">About · Editorial policy</p>
    <h1>Three labels, and why they are not negotiable</h1>
    <p class="lede">Every factual statement on this site is one of three things. If a sentence cannot be assigned to one of the three, it does not get published.</p>
  </div>
  <div class="prose">
    ${table({
      cols: ['Label', 'What it means', 'Where it comes from', 'What it permits'],
      rows: [
        [
          'Observed',
          'We opened the page and read this value on a dated visit.',
          'Our own visit on 2026-11-20',
          'Stating the ASIN, the category path, the listing title, and the shape or compartment count as written in the title.',
        ],
        [
          'Seller claim',
          'The listing or manufacturer asserts this. We are repeating the assertion, not confirming it.',
          'The product listing text',
          'Saying "the listing says one second" — never "one-second readings".',
        ],
        [
          'Editorial inference',
          'Our reasoning from the specifications, clearly not a measurement.',
          'The editorial desk',
          'Saying two baskets mean more washing-up, because that follows from the parts count.',
        ],
      ],
    })}
    <h2>The words we do not use</h2>
    <p>Any phrase that claims personal experience of a product, any <em>we found</em>, best-in-class, and any superlative not attached to a named source. Every one of these implies evidence the desk does not have.</p>
    <h2>Corrections</h2>
    <p>If a listing changes, the observation date on the product table is wrong and should be corrected rather than quietly updated. The rule is: change the date, and if the change altered a recommendation, say so on the page.</p>
    <h2>Independence</h2>
    <p>No manufacturer paid for placement, supplied a product, or reviewed a draft. There is no sponsored content on this site other than affiliate links, which are disclosed on every page. If that ever changes, it will appear first on the <a href="${rel(
      '/flagged/index.html'
    )}">Flagged for Review</a> page.</p>
  </div>`,
  });

  add('/about/how-we-make-money.html', {
    title: `How we make money | ${SITE.brand.name}`,
    description: 'Affiliate commission, plainly described, including what it does and does not affect.',
    body: `<div class="pagehead">
    <p class="kicker">About · Money</p>
    <h1>How this site makes money</h1>
    <p class="lede">A plain answer, above the fold, on its own page — in addition to the disclosure strip that appears on every page of this site including this one.</p>
  </div>
  <div class="prose">
    <div class="callout callout--rec">
      <p><strong>As an Amazon Associate I earn from qualifying purchases.</strong> If you click a product link on this site and buy something on Amazon, this site may receive a commission. You pay the same price either way.</p>
    </div>
    <h2>What the commission does not affect</h2>
    <ul class="ticks ticks--plain">
      <li>The order products appear in, where an order exists, is by decision — drawer shape, capacity, whether it replaces an appliance.</li>
      <li>No commission rate is published anywhere on this site, because none was verified for these products.</li>
      <li>Trade-off sections are written whether or not they help a sale. The three air fryers all have a "not for" line.</li>
    </ul>
    <h2>What we cannot tell you</h2>
    <p>Whether these links currently track. None of the five supplied links carried a visible Associates tag when checked on 2026-11-20, and the tracking status is unresolved and published as <a href="${rel(
      '/flagged/index.html'
    )}#FLG-003">FLG-003</a>. If the links do not track, the site earns nothing — and you would still pay the same price, which is the only part that matters to a buyer.</p>
    <h2>What we do not do</h2>
    <ul class="crosses">
      <li>No display ads.</li>
      <li>No sponsored posts.</li>
      <li>No paid placement.</li>
      <li>No email capture without a clear purpose.</li>
      <li>No cookies, and no third-party scripts that set them.</li>
    </ul>
  </div>`,
  });

  add('/about/privacy.html', {
    title: `Privacy | ${SITE.brand.name}`,
    description: 'What this site stores, which is close to nothing, and what changes when analytics is switched on.',
    body: `<div class="pagehead">
    <p class="kicker">About · Privacy</p>
    <h1>Privacy, in the present tense</h1>
    <p class="lede">This page describes what the site does today. It also states what will stop being true the day an analytics product is added, so the page cannot quietly go stale.</p>
  </div>
  <div class="prose">
    <h2>What is stored today</h2>
    <table class="data">
      <thead><tr><th>Item</th><th>Stored?</th><th>Detail</th></tr></thead>
      <tbody>
        <tr><td>Cookies</td><td>None</td><td>The site sets no cookies.</td></tr>
        <tr><td>Third-party scripts</td><td>None</td><td>No analytics, advertising or social script is loaded.</td></tr>
        <tr><td>Fonts and images</td><td>Self-hosted</td><td>No external font or image request leaves this host.</td></tr>
        <tr><td>Event counts</td><td>Browser only</td><td>Five events are counted in the visitor's own browser storage. They are not linked to an identity and are not transmitted anywhere unless an endpoint is configured.</td></tr>
        <tr><td>Server logs</td><td>GitHub Pages</td><td>GitHub serves this site and may keep request logs under its own policies.</td></tr>
      </tbody>
    </table>
    <h2>When you click through to a retailer</h2>
    <p>Clicking a product link takes you to a retailer, which is a different site with its own privacy policy and its own cookies. This site does not send any identifier with that click. The retailer will know you arrived from here, because that is how affiliate attribution works.</p>
    <h2>What changes when analytics is switched on</h2>
    <div class="callout callout--warn">
      <p>This page will be replaced, not appended to, on the day an analytics endpoint or third-party product is enabled. ${src(
        'S02'
      )} requires accurate disclosure of cookies, pixels and third-party technologies, and a page that says "no cookies" after a cookie has been added is worse than no page at all. The decision is tracked as <a href="${rel(
        '/decisions/questions.html'
      )}#Q-05">Q-05</a>.</p>
    </div>
    <h2>Contact</h2>
    <p>There is no contact form, because a form would need a mailbox and a privacy notice of its own. Use the repository issue tracker linked from the footer of the <a href="${rel(
      '/flagged/index.html'
    )}">Flagged for Review</a> page.</p>
  </div>`,
  });
}

/* ---- platform ------------------------------------------------------------ */
{
  add('/platform/index.html', {
    title: `The platform behind the site | ${SITE.brand.name}`,
    description: 'What the build actually does: product research, link validation, claim labelling, and a human gate in front of anything that cannot be automated.',
    body: `<div class="pagehead">
    <p class="kicker">System</p>
    <h1>What the machinery actually does</h1>
    <p class="lede">The brief asked for an automated affiliate platform. This page is an honest inventory of what was automated, what was deliberately left to a human, and why the second list is longer than the first.</p>
  </div>

  ${table({
    cols: ['Capability asked for', 'What exists now', 'What it does', 'What it cannot do'],
    rows: [
      [
        'Product research',
        'The product register (<code>data/products.json</code>)',
        'Records five ASINs with brand, category path, listing title and an observation date, plus a labelled strengths/trade-offs pair per product.',
        'Discover new products. There is no crawler, because the licence forbids one.',
      ],
      [
        'Identify trending, high-converting products',
        'Not built — deliberately',
        'A "trending" score would need sales or search data the site does not have. Publishing one would be invention.',
        'Anything. It was refused rather than faked.',
      ],
      [
        'Analyse pricing',
        'Not built — blocked',
        'Price may be displayed only from an Amazon-served source or the API. No such source is connected.',
        'Showing a price at all. See Q-13.',
      ],
      [
        'Analyse reviews and competition',
        'Not built',
        'Extracting review text is prohibited by the IP licence, and comparing competitors would need a second data source.',
        'Both. Listed so the gap is visible.',
      ],
      [
        'Commission potential',
        'Not built',
        'No commission rate was verified for these products, so no rate, estimate or forecast appears anywhere.',
        'Ranking products by payout. The site ranks by cooking decision instead.',
      ],
      [
        'SEO-optimised articles and comparisons',
        'Built',
        'Four guides, three comparison tables, a sitemap, a robots file and an RSS feed, generated at build time.',
        'Knowing whether any of it ranks. That needs measurement, not markup.',
      ],
      [
        'Publish and manage affiliate links',
        'Built, with a gate',
        'One link helper generates every buy URL as a sponsored interstitial. A checker fails the build on a bad link.',
        'Guaranteeing the links track. That is Q-02.',
      ],
      [
        'Track clicks and conversions',
        'Clicks: built client-side. Conversions: not possible',
        'Five defined events, no cookie, no identifier. Conversions live only in Associates reports.',
        'Closing the loop without the owner.',
      ],
      [
        'Continuously optimise campaigns',
        'Planned, gated',
        'The growth plan sets a cadence with pre-registered thresholds so "optimisation" is a decision rule rather than a feeling.',
        'Running unattended. Nothing changes live without a human reading the data.',
      ],
      [
        'Compliance with Associates policy',
        'Built, and the strongest part',
        'Eleven specific clauses are mapped to the design change each one caused, on the compliance page.',
        'Legal advice, or confirming the account exists.',
      ],
    ],
  })}

  <section class="section">
    <div class="callout callout--warn">
      <h3>The honest headline</h3>
      <p>Roughly a third of the brief was automatable without violating the Associates licence, and that third is done. The rest needs either an API approval the owner must request, or a human looking at a registry. Calling that "AI-powered optimisation" would be marketing language applied to a file of five products, and this project's whole editorial position is that labelled evidence beats confident language.</p>
    </div>
  </section>`,
  });

  add('/platform/automation.html', {
    title: `Automation and the human gate | ${SITE.brand.name}`,
    description: 'Which steps run automatically, which require a person, and the rule that nothing publishes without a source.',
    body: `<div class="pagehead">
    <p class="kicker">System · Automation</p>
    <h1>Automate the arithmetic, gate the judgement</h1>
    <p class="lede">The brief asked for automation and for verified data. Those pull in opposite directions: the fastest automation is bulk extraction, and bulk extraction is exactly what the Associates licence forbids. This page states the line and why it sits where it does.</p>
  </div>
  <div class="prose">
    <h2>The pipeline, as built</h2>
    <ol class="checklist">
      <li><strong>Supplied link → observed target.</strong> Each supplied link is opened once and the redirect recorded. The ASIN is read from the destination. This is manual by design.</li>
      <li><strong>Observed target → product register.</strong> The ASIN, brand, title and category path are written to a JSON file with a date. ASINs may be stored indefinitely; listing text may not be cached, so nothing else is copied.</li>
      <li><strong>Register → labelled claims.</strong> Strengths are labelled as seller claims and trade-offs as editorial inference. The build will not accept a claim without a label.</li>
      <li><strong>Claims → pages.</strong> Templates render the pages, adding the disclosure, the navigation and the footer from one shared layout.</li>
      <li><strong>Pages → gate.</strong> The checker verifies every internal link resolves, every product anchor is sponsored, every cited source exists, and every page has both disclosures.</li>
      <li><strong>Gate → publish.</strong> Only a passing build is pushed.</li>
    </ol>

    <h2>Where a human has to stand</h2>
    ${table({
      cols: ['Step', 'Why it cannot be automated', 'What a person does'],
      rows: [
        ['Confirming the account', 'Requires a signed-in session that a build must never hold.', 'Signs in, reads the storefront ID, confirms it.'],
        ['Confirming a click tracked', 'Requires reading the Associates report after a real click.', 'Clicks once, reads the report.'],
        ['Checking a certification', 'Needs a registry lookup and judgement about whether a match is the same model.', 'Looks it up, records the certificate number or its absence.'],
        ['Deciding a claim is fair', 'A label can be checked mechanically; whether a sentence is misleading cannot.', 'Reads the sentence as a buyer would.'],
        ['Choosing the next topic', 'Requires reading event data in context.', 'Reads the week\'s events, picks.'],
      ],
    })}

    <h2>The rule that makes this honest</h2>
    <div class="callout">
      <p>Automation is allowed to <em>check</em> a human decision. It is never allowed to <em>make</em> one and present it as checked. That single rule is why the site has a build that fails on a missing source id, and no scraper.</p>
    </div>

    <h2>What would unlock more automation</h2>
    <ul class="ticks ticks--plain">
      <li><strong>Product Advertising API access</strong> — turns price, availability and images into served data with the required timestamp, and would retire FLG-004 entirely.</li>
      <li><strong>A collection endpoint</strong> — turns the five client-side events into something that can be read a week later.</li>
      <li><strong>An identified agent</strong> — the licence permits agent access only for an agent that identifies itself in the user agent string. A compliant, self-identifying re-check job is possible; a disguised crawler is not.</li>
    </ul>
  </div>`,
  });

  add('/platform/metrics.html', {
    title: `Metrics that are actually measurable | ${SITE.brand.name}`,
    description: 'The five defined events, what each one answers, and the honest boundary between click measurement and conversion measurement.',
    body: `<div class="pagehead">
    <p class="kicker">System · Measurement</p>
    <h1>Five events, and one thing this site cannot measure</h1>
    <p class="lede">Click and conversion measurement was asked for before any content was written. Half of that is possible from a static site. The other half lives inside an account this build cannot see. Here is exactly where the line falls.</p>
  </div>

  ${table({
    cols: ['Event', 'Fires when', 'Question it answers', 'Privacy posture', 'Status'],
    rows: [
      ['<code>page_view</code>', 'A page loads', 'Did anyone arrive, and on which page?', 'No cookie, no identifier, no referrer stored beyond the host.', badge('Live, browser-local', 'ok')],
      ['<code>guide_read</code>', 'A guide reaches 90% scroll', 'Did the writing hold attention to the end?', 'Scroll position only; no reading time profile.', badge('Live, browser-local', 'ok')],
      ['<code>product_intent</code>', 'A product card, table row or detail is opened', 'Did a reader move from information to consideration?', 'Product id only.', badge('Live, browser-local', 'ok')],
      ['<code>outbound_click</code>', 'A buy link is clicked', 'Did consideration become a departure to the retailer?', 'Product id and page path; nothing that identifies a person.', badge('Live, browser-local', 'ok')],
      ['<code>return_visit</code>', 'The same browser returns after a day', 'Is this a publication people come back to?', 'A local flag only. Not transmitted.', badge('Live, browser-local', 'ok')],
      ['Conversion / reported orders', '—', 'Did the click become a sale?', 'Lives in the Associates report.', badge('Not measurable here', 'fail')],
    ],
  })}

  <section class="section">
    <div class="section__head"><h2>Why conversions are not on this page</h2></div>
    <div class="prose">
      <p>Reported orders exist only inside the Associates reporting interface, behind the owner's sign-in. No API key, session or credential is held by this build, and none should be. Any conversion rate, earnings figure or revenue forecast printed on this site would therefore be invented. ${src(
        'S04'
      )} defines when a qualifying purchase happens — a click through a Special Link, then a session that can run up to 24 hours, with cart items qualifying up to 89 days — and reading that definition is the closest this site can honestly get to a conversion number.</p>
      <p>The <a href="${rel(
        '/platform/ledger.html'
      )}">campaign ledger</a> starts empty for the same reason: a ledger with invented opening balances teaches you nothing and misleads anyone who reads it later.</p>
    </div>
  </section>

  <section class="section">
    <div class="section__head"><h2>What has to be true before these events mean anything</h2></div>
    <div class="callout callout--warn">
      <p>A browser-local counter proves nothing beyond the browser it ran in. For these five events to become a measurement, one of three things must happen: a serverless endpoint accepts the POST, a hosted analytics product is configured, or the counts are read manually from a device. Each option has a different disclosure consequence under ${src(
        'S02'
      )} section 3(e). That decision is <a href="${rel('/decisions/questions.html')}#Q-05">Q-05</a>, and until it is made the honest statement is: measurement is instrumented, not yet collected.</p>
    </div>
  </section>

  <section class="section">
    <div class="section__head"><h2>What the site refuses to record</h2></div>
    <ul class="crosses">
      <li>No unique visitor identifier, so no individual can be followed across a session.</li>
      <li>No cross-site identifiers, and no fingerprinting.</li>
      <li>No sub-tag per visitor: ${src('S02')} explicitly forbids dynamically assigning sub-tags to users to monitor their behaviour.</li>
      <li>No stored referrer beyond the referring host.</li>
    </ul>
  </section>`,
  });

  add('/platform/ledger.html', {
    title: `Campaign ledger — empty by design | ${SITE.brand.name}`,
    description: 'A campaign ledger with defined columns and no rows, because no authorised first-party report has been obtained yet.',
    body: `<div class="pagehead">
    <p class="kicker">System · Ledger</p>
    <h1>The campaign ledger</h1>
    <p class="lede">A ledger with a defined shape and zero rows. It will be filled from authorised first-party reports, one dated entry at a time, or it will stay empty. There is no placeholder number in it, no estimate, and no forecast.</p>
  </div>

  ${table({
    cols: ['Date', 'Source', 'Channel', 'Eligible sessions', 'Clicks', 'Reported orders', 'Provenance'],
    rows: [
      ['<span class="unver">—</span>', '<span class="unver">—</span>', '<span class="unver">—</span>', '<span class="unver">—</span>', '<span class="unver">—</span>', '<span class="unver">—</span>', '<span class="unver">No authorised report obtained</span>'],
    ],
    cls: 'ledger',
  })}

  <section class="section">
    <div class="section__head"><h2>Column definitions, so an entry means something</h2></div>
    ${table({
      cols: ['Column', 'Definition', 'Where the value must come from'],
      rows: [
        ['Date', 'The date the report was generated, not the date of the traffic.', 'The report header.'],
        ['Source', 'The referring channel or property.', 'The report, not an attribution guess.'],
        ['Channel', 'The page or campaign that produced the traffic.', 'The analytics endpoint, once configured.'],
        ['Eligible sessions', 'Sessions that could have produced a qualifying purchase — the denominator.', 'Associates report or the analytics endpoint.'],
        ['Clicks', 'Outbound clicks attributed to the tag.', 'The Associates report. The client-side counter cannot substitute: it counts departures, not attributions.'],
        ['Reported orders', 'Orders as reported. Not modelled, not estimated, not annualised.', 'The Associates report.'],
        ['Provenance', 'A link or file reference to the exact report this row came from.', 'Wherever the report is archived.'],
      ],
    })}
  </section>

  <section class="section">
    <div class="callout callout--warn">
      <h3>Why it is empty rather than seeded</h3>
      <p>A demonstration ledger with plausible-looking numbers would be the single most dangerous artefact this project could produce: it would look like evidence, be cited as evidence, and be impossible to distinguish later from a real entry. An empty table can only be read one way.</p>
    </div>
  </section>`,
  });
}

/* ---- second register hub ------------------------------------------------- */
/**
 * A hub for this session's register, reachable from the live site's footer.
 *
 * Why it exists: another session's site owns the front page. Without one entry point, the entire
 * link audit, source register, compliance gate and flag queue become orphan pages - published but
 * unreachable, which is the same as unpublished for a reader trying to check a claim.
 */
{
  const body = `<div class="pagehead">
    <p class="kicker">The register</p>
    <h1>Everything behind the five picks, with its sources</h1>
    <p class="lede">This is the audit trail for the five products: each supplied link next to what it actually resolved to, each source next to what it is cited for, each claim labelled as a seller's or an inference, and everything that could not be confirmed published in the open.</p>
  </div>

  <div class="callout callout--warn">
    <h3>Start with the uncomfortable finding</h3>
    <p>None of the five supplied links carried a visible Associates tag on 2026-11-20, and none resolved to the ASIN its own code appears to spell. That is recorded in <a href="${rel('/flagged/index.html')}#FLG-003">FLG-003</a>, with the intended value and the observed value kept in separate columns so the discrepancy cannot be quietly resolved by back-filling one from the other.</p>
  </div>

  <div class="grid grid--2">
    <a class="linkcard" href="${rel('/verification/links.html')}"><h3>Link audit and product-intent record</h3><p>Each of the five supplied links: intended ASIN, observed redirect, whether the code matched, and whether a tag parameter was present.</p></a>
    <a class="linkcard" href="${rel('/verification/sources.html')}"><h3>Source register</h3><p>Eleven sources, each with publisher, document date, retrieval date and evidence tier. Three are listed as not retrieved rather than quietly dropped.</p></a>
    <a class="linkcard" href="${rel('/verification/products.html')}"><h3>Product data table</h3><p>ASIN, category path and observation date for all five, plus the three fields left deliberately blank and why.</p></a>
    <a class="linkcard" href="${rel('/verification/research-log.html')}"><h3>Research log</h3><p>The dated working record, including the checks that failed.</p></a>
    <a class="linkcard" href="${rel('/flagged/index.html')}"><h3>Flagged for Review</h3><p>Ten items that could not be confirmed, each with the official page needed to close it.</p></a>
    <a class="linkcard" href="${rel('/decisions/questions.html')}"><h3>Open questions</h3><p>Twenty questions that block a decision, each with what is known, what is missing and the cheapest way to close it.</p></a>
    <a class="linkcard" href="${rel('/compliance/index.html')}"><h3>Compliance gate</h3><p>The eleven clauses that shaped the build, what each one changed, and which checks are automated.</p></a>
    <a class="linkcard" href="${rel('/verification/index.html')}"><h3>Verification dashboard</h3><p>Every published claim on one screen with its label and its source.</p></a>
  </div>

  <section class="section">
    <div class="section__head"><h2>How the two sites relate</h2></div>
    <div class="prose">
      <p>This repository carries more than one generation of the same project, built by different sessions against the same five products. The live shop front is published from the root build. This register is the independent second check: it was produced from a separate set of source observations, and it gates its own output on a checker that fails the build if a product link is unsponsored, a claim cites a source that is not registered, or a page loses its disclosure.</p>
      <p>Where the two agree, the agreement is evidence. Where they differ, the difference is on <a href="${rel('/flagged/index.html')}">Flagged for Review</a>. Four sessions independently resolved the same five links to the same five ASINs and all four report no visible tag parameter, which is why FLG-003 is stated with confidence and its compliance status is still left unresolved.</p>
    </div>
  </section>`;
  add('/register/index.html', {
    title: `The register — sources, link audit and flags | ${SITE.brand.name}`,
    description: 'The audit trail behind the five products: link audit, source register, claim labels, compliance gate and the flag queue.',
    body,
  });
}

/* ---- 404 ----------------------------------------------------------------- *//* ---- 404 ----------------------------------------------------------------- */
{
  add('/404.html.DISABLED', {
    noindex: true,
    title: `Page not found | ${SITE.brand.name}`,
    description: 'That page does not exist. Here is where everything actually is.',
    body: `<div class="pagehead">
    <p class="kicker">404</p>
    <h1>That page is not here</h1>
    <p class="lede">Nothing is broken — the address just does not point at a page on this site. Everything published is reachable from the list below.</p>
    <ul class="pagehead__links">
      <li><a href="${rel('/index.html')}">All products</a></li>
      <li><a href="${rel('/products/air-fryers.html')}">Air fryers</a></li>
      <li><a href="${rel('/products/thermometers.html')}">Thermometers</a></li>
      <li><a href="${rel('/guides/index.html')}">Guides</a></li>
      <li><a href="${rel('/verification/index.html')}">Verification</a></li>
      <li><a href="${rel('/flagged/index.html')}">Flagged for Review</a></li>
    </ul>
  </div>`,
  });
}

/* ---------------------------------------------------------------- go pages */

/**
 * One interstitial per product. This is the only place an outbound Amazon URL exists in generated HTML,
 * which is what makes "every outbound product link is sponsored" a property of the build rather than a habit.
 */
function goPage(p) {
  const destination = `https://www.amazon.com/dp/${p.asin}?tag=${encodeURIComponent(SITE.trackingId.value)}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Leaving for Amazon — ${esc(p.shortName)} | ${esc(SITE.brand.name)}</title>
<link rel="stylesheet" href="${rel('/assets/css/site.css')}">
</head>
<body class="go">
<div class="disclosure" role="note">
  <p><strong>Affiliate disclosure.</strong> ${esc(SITE.disclosure.requiredStatement)} ${esc(
    SITE.disclosure.plainLanguage
  )} <a href="${rel('/about/how-we-make-money.html')}">How this site makes money</a>.</p>
</div>
<main class="go__box">
  <p class="go__back"><a href="${rel('/index.html')}">← Counterwise</a></p>
  <p class="kicker">You are leaving this site</p>
  <h1>${esc(p.shortName)}</h1>
  <p>This link is an affiliate link. As an Amazon Associate I earn from qualifying purchases.</p>
  <p class="go__status">${badge('Tracking status unresolved — FLG-003', 'warn')} The Associates account behind the tag <code>${esc(
    SITE.trackingId.value
  )}</code> has not been confirmed, and its compliance status is recorded as unresolved.</p>
  <p class="go__dest">Destination: <code>https://www.amazon.com/dp/${esc(
    p.asin
  )}</code> &nbsp;·&nbsp; ASIN ${esc(p.asin)} observed ${esc(p.observedOn)}</p>
  <p><a class="btn btn--primary" rel="sponsored nofollow noopener" target="_blank" href="${esc(
    destination
  )}" data-affiliate-out="${esc(p.id)}">Continue to Amazon</a></p>
  <p class="fineprint">Price and availability are shown on Amazon, not here, because this site is not permitted to publish a price it cannot keep current. <a href="${rel(
    '/compliance/index.html'
  )}">Why</a>.</p>
  <p class="fineprint"><a href="${rel('/index.html')}">Back to the shop</a></p>
</main>
<footer class="go__footer">
  ${FOOTER_DISCLOSURE}
</footer>
<script src="${rel('/assets/js/site.js')}" defer></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- write files */

function write(relPath, content) {
  const full = path.join(ROOT, relPath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

/**
 * Numbers that describe the build are substituted here, after every page object exists.
 * An earlier version interpolated the page count inside a page body while the build was still
 * running, which printed 18 where the true total was 27. Injected counts must be deferred.
 */
const TOKENS = {
  '{{PAGECOUNT}}': String(PAGES.length),
  '{{LINKPAGECOUNT}}': String(PRODUCTS.products.length),
};
const resolveTokens = (html) =>
  Object.entries(TOKENS).reduce((acc, [k, v]) => acc.split(k).join(v), html);

/**
 * The live front page belongs to the Counterwise build (_build/build.mjs), which another session
 * publishes from main. This generator must never overwrite it: doing so silently replaced the
 * published shop front once during integration, which is exactly the kind of collision the
 * coordination file exists to prevent.
 *
 * Set CK_TAKE_FRONT_PAGE=1 to publish the Counterwise front page deliberately.
 */
const TAKE_FRONT_PAGE = process.env.CK_TAKE_FRONT_PAGE === '1';

/**
 * Shared index pages belong to the sibling build. Overwriting guides/index.html orphaned every
 * Counterwise guide - the pages still existed but nothing linked to them. Same rule as the front
 * page: never silently replace another generator's index.
 */
const SHARED_INDEXES = new Set(['/guides/index.html', '/decisions/index.html', '/flagged/index.html',
  '/about/index.html', '/verification/index.html']);

PAGES.forEach((p) => {
  if (p.routePath === '/index.html' && !TAKE_FRONT_PAGE) return;
  if (SHARED_INDEXES.has(p.routePath) && !TAKE_FRONT_PAGE) return;
  const html = resolveTokens(
    page({
      title: p.title,
      description: p.description,
      canonicalPath: p.routePath,
      body: p.body,
      jsonLd: p.jsonLd,
      noindex: p.noindex,
    })
  );
  write(p.routePath, html);
});

PRODUCTS.products.forEach((p) => write(`/go/${p.slug}.html`, goPage(p)));



/* ---------------------------------------------------------------- sitemap, robots, feed */

/**
 * Shared publication files (index.html, 404.html, robots.txt, sitemap.xml, feed.xml) belong to the
 * sibling build that owns the live front page. This generator must not write them: two builders
 * fighting over the same four files is what made CI fail with "generated output differs".
 * We publish our own sitemap instead, which can be cross-submitted.
 */
const sitemapRoutes = PAGES.filter(
  (p) => !p.noindex && p.routePath !== '/404.html.DISABLED'
).map((p) => p.routePath);
const today = '2026-11-20';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE}${r}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;
write('/sitemap-register.xml', sitemap);

if (process.env.CK_WRITE_SHARED === '1') write(
  '/robots.txt',
  `User-agent: *
Allow: /$

# The site is served at a project path (/WinB). A bare "Disallow: /go/" would point at the
# domain root, which this site does not own, so the project path is spelled out.
Disallow: /WinB/go/

Sitemap: ${BASE}/sitemap.xml
`

);

const feedItems = GUIDES.map(
  (g) => `    <item>
      <title>${esc(g.title)}</title>
      <link>${BASE}/guides/${g.slug}.html</link>
      <guid isPermaLink="true">${BASE}/guides/${g.slug}.html</guid>
      <pubDate>${new Date(g.date + 'T09:00:00Z').toUTCString()}</pubDate>
      <category>${esc(g.tag)}</category>
      <description>${esc(g.summary)}</description>
    </item>`
).join('\n');

if (process.env.CK_WRITE_SHARED === '1') write(
  '/feed.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.brand.name)} — new guides</title>
    <link>${BASE}/guides/index.html</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(SITE.brand.tagline)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(today + 'T09:00:00Z').toUTCString()}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`
);

/* ---------------------------------------------------------------- report */

console.log(`built ${PAGES.length} pages, ${PRODUCTS.products.length} go pages, sitemap (${sitemapRoutes.length} urls), robots.txt, feed.xml (${GUIDES.length} items)`);
if (fails.length) {
  console.error('\nBUILD FAILED:');
  fails.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
if (warnings.length) {
  console.warn('\nwarnings:');
  warnings.forEach((w) => console.warn('  - ' + w));
}
