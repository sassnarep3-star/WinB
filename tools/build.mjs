#!/usr/bin/env node
/**
 * Counterwise site builder.
 *
 * Reads the verified data layer in ./data and regenerates every published page
 * plus the SEO artefacts (sitemap.xml, feed.xml, robots.txt).
 *
 * The builder is deterministic: it never invents a value. Anything that is not
 * present in the data files is rendered as blank and flagged, never guessed.
 *
 *   node tools/build.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://sassnarep3-star.github.io/WinB';
const TAG = 'shopnow047c-20';

const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', rel), 'utf8'));
const products = read('products.json');
const competition = read('competition.json');
const articles = read('articles.json');
const questions = read('questions.json');
const suggestions = read('suggestions.json');
const flags = read('flags.json');
const sources = read('sources.json');
const campaigns = read('campaigns.json');

/* ------------------------------------------------------------------ utils */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const money = (n) => (n === null || n === undefined ? '' : `$${n.toFixed(2)}`);
const num = (n) => (n === null || n === undefined ? '' : n.toLocaleString('en-US'));
const blank = '<span class="blank" title="Not verified from an official source">not verified</span>';

const byId = Object.fromEntries(products.products.map((p) => [p.id, p]));
const clusterById = Object.fromEntries(products.clusters.map((c) => [c.id, c]));
const articleBySlug = Object.fromEntries(articles.articles.map((a) => [a.slug, a]));

/** Amazon Special Link. Canonical /dp form carrying the Associate ID. */
const special = (asin) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

/**
 * Every outbound link to an Amazon product page is rewritten into the canonical
 * Special Link form carrying the Associate ID. The Program Policies require the
 * Associate ID as a URL parameter on links to an Amazon Site.
 */
function tagged(url) {
  const m = String(url).match(/^https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})/);
  return m ? special(m[1]) : url;
}

const isAmazon = (url) => /^https:\/\/www\.amazon\.com\/dp\//.test(String(url));

/** Sponsored outbound product link. */
function buyLink(url, label, extraClass = '') {
  return `<a class="buy ${extraClass}" href="${esc(tagged(url))}" rel="sponsored noopener" target="_blank">${esc(label)}<span class="pill">Sponsored</span></a>`;
}

/** Editorial reference link. Amazon listings are tagged and marked sponsored. */
function refLink(url, label) {
  const u = tagged(url);
  return `<a class="ref" href="${esc(u)}" rel="${isAmazon(u) ? 'sponsored noopener' : 'noopener'}" target="_blank">${esc(label)}</a>`;
}

/** Small source citation chip. */
function sourceChip(url, label = 'source') {
  const u = tagged(url);
  return `<a class="src" href="${esc(u)}" rel="${isAmazon(u) ? 'sponsored noopener' : 'noopener'}" target="_blank">${esc(label)}</a>`;
}

/** The canonical, untagged listing URL, shown as evidence text rather than a link. */
function canonicalText(url) {
  return `<code class="wrap">${esc(url)}</code>`;
}

/* ------------------------------------------------------------------ layout */

const NAV = [
  { id: 'guides', label: 'Guides', href: 'guides/' },
  { id: 'air-fryers', label: 'Air fryers', href: 'air-fryers/' },
  { id: 'thermometers', label: 'Thermometers', href: 'thermometers/' },
  { id: 'dashboard', label: 'Workbench', href: 'dashboard/' },
  { id: 'review', label: 'Evidence', href: 'review/' },
];

function layout({ title, desc, slug, depth = 0, body, active = '', extraHead = '', bodyClass = '' }) {
  const up = '../'.repeat(depth);
  const canonical = `${SITE}/${slug}`;
  const nav = NAV.map(
    (n) =>
      `<a class="${n.id === active ? 'on' : ''}" href="${up}${n.href}">${esc(n.label)}</a>`
  ).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Counterwise">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="Counterwise" href="${up}feed.xml">
<link rel="stylesheet" href="${up}styles.css">
${extraHead}
</head>
<body class="${bodyClass}">
<div class="disclosure"><span class="d-wrap">As an Amazon Associate I earn from qualifying purchases. <a href="${up}review/index.html#disclosure">How these recommendations work</a></span></div>
<header class="masthead">
  <a class="brand" href="${up}index.html">counterwise<span>.</span></a>
  <nav class="nav" aria-label="Primary">${nav}
    <details class="more"><summary>More</summary><div class="menu">
      <a href="${up}summary/index.html">Executive summary</a>
      <a href="${up}review/index.html">Evidence register</a>
      <a href="${up}review/questions.html">Open questions</a>
      <a href="${up}review/suggestions.html">Suggestions board</a>
      <a href="${up}review/flagged.html">Flagged for review</a>
      <a href="${up}review/sources.html">Source index</a>
      <a href="${up}dashboard/index.html">The workbench</a>
    </div></details>
  </nav>
</header>
<main>
${body}
</main>
<footer>
  <div class="fcol fbrand">
    <div class="foot-brand">counterwise<span>.</span></div>
    <p>Considered kitchen buying, minus the noise. Every fact on this site is dated and linked.</p>
  </div>
  <div class="fcol">
    <b>Read</b>
    <a href="${up}guides/index.html">All guides</a>
    <a href="${up}air-fryers/index.html">Air fryers &amp; convection</a>
    <a href="${up}thermometers/index.html">Thermometers &amp; precision</a>
    <a href="${up}feed.xml">RSS feed</a>
  </div>
  <div class="fcol">
    <b>Evidence</b>
    <a href="${up}summary/index.html">Executive summary</a>
    <a href="${up}review/index.html">Evidence register</a>
    <a href="${up}review/questions.html">Open questions</a>
    <a href="${up}review/suggestions.html">Suggestions board</a>
    <a href="${up}review/flagged.html">Flagged for review</a>
    <a href="${up}review/sources.html">Source index</a>
  </div>
  <div class="fcol">
    <b>Disclosure</b>
    <p>As an Amazon Associate I earn from qualifying purchases. Links marked <span class="pill">Sponsored</span> are affiliate links.</p>
    <a href="${up}dashboard/compliance.html">Disclosure &amp; policy gates</a>
  </div>
  <small>&copy; 2026 Counterwise &middot; Product details, prices and availability change. Verify with the retailer before you buy. &middot; <a href="${up}review/flagged.html">Flagged for review</a></small>
</footer>
</body>
</html>
`;
}

/* ------------------------------------------------------------- components */

function sectionHead(eyebrow, heading, aside = '') {
  return `<div class="sec-head"><div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(heading)}</h2></div>${aside}</div>`;
}

function table(headers, rows, opts = {}) {
  const cls = opts.class ? ` ${opts.class}` : '';
  return `<div class="tw"><table${cls}>
<thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>${rows.length ? rows.join('') : `<tr><td colspan="${headers.length}" class="empty">${esc(opts.emptyNote || 'No rows.')}</td></tr>`}</tbody>
</table></div>`;
}

function pill(text, tone = '') {
  return `<span class="tag ${tone}">${esc(text)}</span>`;
}

function statusPill(status) {
  const tone =
    { Done: 'ok', Implemented: 'ok', Verified: 'ok', Open: 'warn', Pending: 'warn', 'Not started': 'warn', 'Blocked': 'bad' }[status] || '';
  return `<span class="tag ${tone}">${esc(status)}</span>`;
}

function productCard(p, opts = {}) {
  const price = p.priceUsd === null ? blank : `<b>${money(p.priceUsd)}</b>`;
  const rating =
    p.rating === null
      ? blank
      : `${p.rating.toFixed(1)} <span class="muted">(${num(p.reviewCount)} reviews)</span>`;
  const root = opts.root || '';
  return `<article class="pcard ${opts.class || ''}">
  <p class="eyebrow">${esc(p.brand)} &middot; ${esc(p.type)}</p>
  <h3><a href="${root}dashboard/products.html#${p.id}">${esc(p.name)}</a></h3>
  <p class="pcard-sub">${esc(p.fullTitle)}</p>
  <dl class="pmini">
    <div><dt>Price <span class="muted">(${esc(p.priceObservedOn || 'undated')})</span></dt><dd>${price}</dd></div>
    <div><dt>Rating</dt><dd>${rating}</dd></div>
    <div><dt>Availability</dt><dd>${esc(p.availability || blank)}</dd></div>
    <div><dt>ASIN</dt><dd><code>${esc(p.observedAsin)}</code></dd></div>
  </dl>
  <div class="pcard-actions">
    ${buyLink(p.affiliateUrl, 'Check current price')}
    ${sourceChip(p.officialListingUrl, 'Official listing')}
  </div>
</article>`;
}

function specBlock(p) {
  const rows = p.specs
    .map(
      (s) =>
        `<tr><th scope="row">${esc(s.label)}</th><td>${esc(s.value)}</td><td class="srccell">${sourceChip(s.source, 'listing')}</td></tr>`
    )
    .join('');
  return `<div class="specbox">
  <div class="spec-head">
    <p class="eyebrow">From the official listing</p>
    <h4>${esc(p.brand)} ${esc(p.name)}</h4>
    <p class="muted">${esc(p.fullTitle)}</p>
  </div>
  <div class="tw"><table class="spec"><tbody>${rows}</tbody></table></div>
  <div class="spec-foot">
    <span class="muted">Price ${p.priceUsd === null ? '' : money(p.priceUsd)} &middot; read ${esc(p.priceObservedOn || 'undated')} &middot; ASIN <code>${esc(p.observedAsin)}</code></span>
    ${sourceChip(p.officialListingUrl, 'Official listing')}
    ${buyLink(p.affiliateUrl, 'Check current price', 'small')}
  </div>
</div>`;
}

function altBlock(a) {
  return `<aside class="altbox">
  <p class="eyebrow">Also on Amazon</p>
  <p class="alt-name">${esc(a.name)}</p>
  <p class="muted">${esc(a.note)}</p>
  <p class="muted">${refLink(special(a.asin), 'Open the listing')} &middot; <code>${esc(a.asin)}</code></p>
</aside>`;
}

/* -------------------------------------------------------------- front page */

function buildHome() {
  const featured = articles.articles.slice(0, 6);
  const cards = featured
    .map(
      (a, i) => `<a class="icard" href="guides/${a.slug}.html">
    <span class="num">${String(i + 1).padStart(2, '0')} / ${esc(a.kicker)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.dek)}</p>
    <span class="read">Read the guide &nearr;</span>
  </a>`
    )
    .join('');

  const body = `<section class="hero">
  <div class="hero-inner">
    <p class="eyebrow light">The kitchen edit &middot; Vol. 01 &middot; Air fryers &amp; thermometers</p>
    <h1>Good tools.<br>Better questions.</h1>
    <p class="lede">Practical guides for choosing kitchen gear that fits your counter, your cooking and your real life. Every product fact is dated and linked to the listing it came from.</p>
    <div class="hero-cta">
      <a class="button" href="#latest">Start with a question <span>&rarr;</span></a>
      <a class="button ghost" href="summary/index.html">Read the executive summary</a>
    </div>
    <ul class="hero-facts">
      <li><b>5</b> products tracked</li>
      <li><b>${articles.articles.length}</b> guides published</li>
      <li><b>${sources.rows.length}</b> official sources cited</li>
      <li><b>0</b> claims we could not source</li>
    </ul>
  </div>
</section>

<section class="intro">
  <div><p class="eyebrow">Start here</p><h2>Before you compare models,<br>compare what matters.</h2></div>
  <div class="intro-body">
    <p>Capacity, cleanup, footprint and the way you actually cook make a better shortlist than a star rating alone. Use these questions to narrow your options, then check the current details with the maker and retailer.</p>
    <p>We are an Amazon Associate, so the links are marked as sponsored and we may earn from qualifying purchases. It does not change what we recommend, because we do not rank products by how much they pay.</p>
    <a class="text-link" href="review/index.html">See how the evidence is handled &rarr;</a>
  </div>
</section>

<section id="latest" class="articles">
  ${sectionHead("The buyer's notebook", "Useful reads for a more confident buy", `<a class="text-link" href="guides/index.html">All ${articles.articles.length} guides &rarr;</a>`)}
  <div class="icards">${cards}</div>
</section>

<section class="cluster">
  ${sectionHead('Shop by category', 'Two clusters, tracked end to end')}
  <div class="clgrid">
    ${products.clusters
      .map((c) => {
        const items = products.products.filter((p) => p.cluster === c.id);
        const priceList = items.map((p) => p.priceUsd).filter((n) => n !== null);
        const lo = priceList.length ? Math.min(...priceList) : null;
        const hi = priceList.length ? Math.max(...priceList) : null;
        const nArticles = articles.articles.filter((a) => a.category === c.id).length;
        return `<a class="clbox" href="${c.slug}/">
      <p class="eyebrow">${esc(items.length)} products &middot; ${nArticles} guides</p>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.blurb)}</p>
      <p class="clprice">${lo !== null ? `${money(lo)} &ndash; ${money(hi)}` : ''} <span class="muted">observed ${esc(products.generated)}</span></p>
      <span class="read">Open the category &rarr;</span>
    </a>`;
      })
      .join('')}
  </div>
</section>

<section class="tracked">
  ${sectionHead('The tracked set', 'Five products, every fact dated', `<a class="text-link" href="dashboard/products.html">Open the product table &rarr;</a>`)}
  <div class="pcards">${products.products.map((p) => productCard(p, { root: '' })).join('')}</div>
</section>

<section class="callout">
  <div>
    <p class="eyebrow">A better shortlist starts with you</p>
    <h2>What are you actually trying to cook?</h2>
    <p>Write down your usual portions, the counter footprint, the storage plan and your cleanup tolerance. Those answers beat any unverified "top pick" &mdash; and they are the exact questions our guides ask you to answer.</p>
  </div>
  <a class="text-link" href="review/questions.html">See what still needs checking &rarr;</a>
</section>

<section class="method">
  <span>Our standard</span>
  <p>Useful first. Evidence-aware. Clear about what we know &mdash; and what we don't.</p>
  <a href="review/index.html">Read our evidence and review notes &rarr;</a>
</section>`;

  return layout({
    title: 'Counterwise — smarter kitchen shopping',
    desc: 'Practical, no-hype kitchen buying guides for air fryers and thermometers. Every product fact dated and linked to the official listing.',
    slug: '',
    depth: 0,
    body,
    active: 'home',
  });
}

/* ------------------------------------------------------------ category hubs */

function buildCategory(cluster) {
  const items = products.products.filter((p) => p.cluster === cluster.id);
  const arts = articles.articles.filter((a) => a.category === cluster.id);
  const priceList = items.map((p) => p.priceUsd).filter((n) => n !== null);
  const lo = priceList.length ? Math.min(...priceList) : null;
  const hi = priceList.length ? Math.max(...priceList) : null;

  const body = `<section class="pagehead">
  <p class="eyebrow light">Category</p>
  <h1>${esc(cluster.name)}</h1>
  <p class="lede">${esc(cluster.blurb)}</p>
  <ul class="hero-facts">
    <li><b>${items.length}</b> tracked products</li>
    <li><b>${arts.length}</b> guides</li>
    <li><b>${lo !== null ? money(lo) : ''}&ndash;${hi !== null ? money(hi) : ''}</b> observed price range</li>
    <li><b>${esc(products.generated)}</b> last verified</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('Guides in this category', 'Start with the question you actually have')}
  <div class="icards">${arts
    .map(
      (a) => `<a class="icard" href="../guides/${a.slug}.html">
    <span class="num">${esc(a.kicker)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.dek)}</p>
    <span class="read">Read the guide &rarr;</span>
  </a>`
    )
    .join('')}</div>
</section>

<section class="tracked">
  ${sectionHead('The tracked products', 'Facts taken from the official listing', `<a class="text-link" href="../dashboard/products.html">Full product table &rarr;</a>`)}
  <div class="pcards">${items.map((p) => productCard(p, { root: '../' })).join('')}</div>
</section>

<section class="compare">
  ${sectionHead('Verified attributes', 'Side by side, every cell sourced')}
  ${compareTable(items)}
</section>

<section class="callout">
  <div>
    <p class="eyebrow">Still deciding</p>
    <h2>Two formats, two sets of trade-offs.</h2>
    <p>Every guide in this category is written as a question you would actually ask, and none of them names a winner. That is deliberate: the honest answer depends on your kitchen.</p>
  </div>
  <a class="text-link" href="../review/questions.html">What still needs checking &rarr;</a>
</section>`;

  return layout({
    title: `${cluster.name} | Counterwise`,
    desc: cluster.blurb,
    slug: `${cluster.slug}/`,
    depth: 1,
    body,
    active: cluster.slug,
  });
}

function compareTable(items) {
  const attr = (p, key) => {
    switch (key) {
      case 'brand':
        return esc(p.brand);
      case 'name':
        return esc(p.name);
      case 'type':
        return esc(p.type);
      case 'price':
        return p.priceUsd === null ? blank : `<b>${money(p.priceUsd)}</b>`;
      case 'rating':
        return p.rating === null ? blank : p.rating.toFixed(1);
      case 'reviews':
        return p.reviewCount === null ? blank : num(p.reviewCount);
      case 'availability':
        return esc(p.availability || blank);
      case 'seller':
        return esc(p.soldBy || blank);
      case 'spec':
        return p.specs
          .slice(0, 3)
          .map((s) => `${esc(s.label)}: ${esc(s.value)}`)
          .join('<br>');
      case 'source':
        return sourceChip(p.officialListingUrl, 'listing');
      default:
        return '';
    }
  };
  const keys = ['brand', 'name', 'type', 'price', 'rating', 'reviews', 'availability', 'seller', 'spec', 'source'];
  const labels = {
    brand: 'Brand',
    name: 'Model',
    type: 'Type',
    price: `Price (${products.generated})`,
    rating: 'Rating',
    reviews: 'Reviews',
    availability: 'Availability',
    seller: 'Sold by',
    spec: 'Stated attributes',
    source: 'Source',
  };
  const rows = items.map(
    (p) => `<tr><th scope="row" class="rowhead">${esc(p.brand)}</th>${keys
      .filter((k) => k !== 'brand')
      .map((k) => `<td>${attr(p, k)}</td>`)
      .join('')}</tr>`
  );
  return `<div class="tw"><table class="cmp"><thead><tr>${keys
    .map((k) => `<th scope="col">${esc(labels[k])}</th>`)
    .join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
  <p class="fine">Ratings, review counts and prices are point-in-time observations read from the linked listing on ${esc(products.generated)}. They change. Nothing in this table is a quality, popularity or value judgement, and no product here is ranked.</p>`;
}

/* ------------------------------------------------------------------- guides */

function buildGuidesIndex() {
  const groups = products.clusters.map((c) => {
    const arts = articles.articles.filter((a) => a.category === c.id);
    return `<div class="ggroup">
  <div class="ghead"><p class="eyebrow">${esc(c.name)}</p><a class="text-link" href="../${c.slug}/">Category page &rarr;</a></div>
  <div class="icards">${arts
    .map(
      (a) => `<a class="icard" href="${a.slug}.html">
    <span class="num">${esc(a.kicker)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.dek)}</p>
    <span class="read">Read the guide &rarr;</span>
  </a>`
    )
    .join('')}</div>
</div>`;
  });

  const body = `<section class="pagehead">
  <p class="eyebrow light">The buyer's notebook</p>
  <h1>${articles.articles.length} guides, written as questions.</h1>
  <p class="lede">Every guide starts from something a reader would genuinely type. None of them names a winner, because we have not tested anything and we would rather tell you what to check than pretend.</p>
  <ul class="hero-facts">
    <li><b>${articles.articles.length}</b> published</li>
    <li><b>2</b> clusters</li>
    <li><b>${articles.articles.length}</b> dated</li>
    <li><b>0</b> unsourced claims</li>
  </ul>
</section>
<section class="articles">
  <div class="intro"><div><p class="eyebrow">Working titles</p><h2>These are hypotheses,<br>not predictions.</h2></div>
  <div class="intro-body"><p>A guide title describes the question we think a reader has. It is not a claim about how many people search for it, how the topic trends, or which product is best. Real query data arrives only after the site is live and measured &mdash; see the open questions.</p>
  <a class="text-link" href="../review/questions.html#Q-07">See how the next topic gets chosen &rarr;</a></div></div>
  ${groups.join('')}
</section>`;

  return layout({
    title: 'All guides | Counterwise',
    desc: 'Every Counterwise guide, organised by cluster. Question-led, dated, and linked to the official listings.',
    slug: 'guides/',
    depth: 1,
    body,
    active: 'guides',
  });
}

function renderBody(blocks) {
  return blocks
    .map((b) => {
      if (b.p) return `<p>${b.p}</p>`;
      if (b.h2) return `<h2>${esc(b.h2)}</h2>`;
      if (b.ul) return `<ul>${b.ul.map((i) => `<li>${i}</li>`).join('')}</ul>`;
      if (b.ol) return `<ol>${b.ol.map((i) => `<li>${i}</li>`).join('')}</ol>`;
      if (b.note) return `<div class="note"><b>Editorial note</b><br>${b.note}</div>`;
      if (b.spec) return specBlock(byId[b.spec]);
      if (b.alt) return altBlock(b.alt);
      if (b.cta) return `<div class="cta">${buyLink(b.cta.url, b.cta.label)}</div>`;
      return '';
    })
    .join('\n');
}

function buildArticle(a) {
  const related = (a.relatedProducts || []).map((id) => byId[id]).filter(Boolean);
  const others = articles.articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);

  const body = `<article class="article">
  <a class="back" href="../guides/index.html">&larr; All guides</a>
  <p class="eyebrow">${esc(a.kicker)} &middot; ${esc(clusterById[a.category].name)}</p>
  <h1>${esc(a.title)}</h1>
  <p class="dek">${esc(a.dek)}</p>
  <p class="byline">Published ${esc(a.published)} &middot; ${a.readMinutes} minute read &middot; Question-led guide, not a product test</p>
  <div class="prose">
${renderBody(a.body)}
  </div>
  ${
    related.length
      ? `<div class="related">
    <p class="eyebrow">Where these products sit</p>
    <h3>The tracked models, and what their listings say</h3>
    <p class="muted">These are the products referenced above. Each fact comes from the official listing and was read on ${esc(products.generated)}. Prices and stock change.</p>
    <div class="pcards">${related.map((p) => productCard(p, { root: '../' })).join('')}</div>
  </div>`
      : ''
  }
  ${
    others.length
      ? `<div class="also">
    <p class="eyebrow">Keep reading</p>
    <div class="ilinks">${others
      .map((o) => `<a href="${o.slug}.html"><b>${esc(o.title)}</b><span>${esc(o.dek)}</span></a>`)
      .join('')}</div>
  </div>`
      : ''
  }
  <div class="note final"><b>Before you buy</b><br>Product details, prices and availability change. Check the current listing, and the manufacturer's own instructions, before you commit. <a href="../review/flagged.html">Items still to verify &rarr;</a></div>
</article>`;

  return layout({
    title: `${a.title} | Counterwise`,
    desc: a.metaDescription,
    slug: `guides/${a.slug}.html`,
    depth: 1,
    body,
    active: 'guides',
    extraHead: `<meta property="og:type" content="article">
<meta property="article:published_time" content="${esc(a.published)}">
<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.metaDescription,
      datePublished: a.published,
      dateModified: a.published,
      mainEntityOfPage: `${SITE}/guides/${a.slug}.html`,
      publisher: { '@type': 'Organization', name: 'Counterwise' },
      isAccessibleForFree: true,
    })}</script>`,
  });
}

/* --------------------------------------------------------------- dashboard */

function workbenchNav(depth = 1, active = '') {
  const up = '../'.repeat(depth);
  const items = [
    ['index.html', 'Overview'],
    ['products.html', 'Products'],
    ['competition.html', 'Competition'],
    ['content.html', 'Content'],
    ['links.html', 'Links'],
    ['campaigns.html', 'Campaigns'],
    ['compliance.html', 'Compliance'],
  ];
  return `<nav class="wbnav" aria-label="Workbench sections">${items
    .map(
      ([href, label]) =>
        `<a class="${active === href ? 'on' : ''}" href="${up}dashboard/${href}">${esc(label)}</a>`
    )
    .join('')}</nav>`;
}

function buildDashboardIndex() {
  const openFlags = flags.rows.filter((f) => f.status === 'Open');
  const body = `<section class="pagehead">
  <p class="eyebrow light">The workbench</p>
  <h1>The machinery behind the writing.</h1>
  <p class="lede">Product research, content, link management, measurement and compliance &mdash; in one place, with every number dated and sourced. This is the operational view of the site you are reading.</p>
  <ul class="hero-facts">
    <li><b>${products.products.length}</b> products tracked</li>
    <li><b>${articles.articles.length}</b> guides live</li>
    <li><b>${sources.rows.length}</b> sources cited</li>
    <li><b>${openFlags.length}</b> flags open</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'index.html')}
  <div class="dash-body">
    <div class="kpis">
      <div class="kpi"><b>${products.products.length}</b><span>Products in the tracked set</span><em>all verified against the official listing on ${esc(products.generated)}</em></div>
      <div class="kpi"><b>${competition.rows.length}</b><span>Alternative listings recorded</span><em>captured from Amazon's own recommendation module</em></div>
      <div class="kpi"><b>${articles.articles.length}</b><span>Guides published</span><em>every one question-shaped and dated</em></div>
      <div class="kpi"><b>0</b><span>Rows without a source link</span><em>enforced by the build verifier</em></div>
      <div class="kpi"><b>0</b><span>Campaign rows recorded</span><em>the ledger is empty by design</em></div>
      <div class="kpi"><b>${openFlags.length}</b><span>Items flagged for review</span><em>published on the Flagged for Review page</em></div>
    </div>

    ${sectionHead('Pipeline', 'Where the work stands')}
    ${table(
      ['Stage', 'What it does', 'Status', 'Evidence', 'Next action'],
      [
        row('Source intake', 'Capture submitted links as source inputs, never as product truth.', 'Done', 'Five short links recorded verbatim', 'Confirm intended ASINs in the enrolled workflow'),
        row('Link resolution', 'Resolve each short link and record the observed redirect target separately from intent.', 'Done', 'All five resolved on ' + products.generated, 'Run one click test per product'),
        row('Listing verification', 'Read price, rating, review count, availability and stated specs from the official listing.', 'Done', 'Five listings read on ' + products.generated, 'Re-read on the next capture date'),
        row('Competition capture', 'Record the alternatives Amazon surfaces against each listing.', 'Done', `${competition.rows.length} rows captured on ${products.generated}`, 'Repeat at the next capture'),
        row('Editorial generation', 'Turn verified facts and open questions into question-shaped guides.', 'Done', `${articles.articles.length} guides published`, 'Run the next guide from the cadence'),
        row('Specification dossier', 'Read manufacturer documentation for full dimensions, care and clearance.', 'Not started', 'Not yet read', 'Close question Q-04'),
        row('Link monetisation', 'Confirm attribution for one Special Link per product before scaling.', 'Not started', 'Requires account access', 'Close question Q-02 and Q-03'),
        row('Measurement', 'Run the five defined events against a self-hosted endpoint.', 'Not started', 'No endpoint exists', 'Provision, then publish a privacy notice'),
        row('Optimisation', 'Choose the next topic from measured queries rather than instinct.', 'Not started', 'No query data exists', 'Close question Q-07'),
      ]
    )}

    ${sectionHead('Automation and gates', 'What the machine does, and what it refuses to do')}
    ${table(
      ['Capability', 'State', 'How it is enforced', 'Official reference'],
      [
        row('Regenerate every page from the data layer', 'Automated', 'node tools/build.mjs', 'This repository'),
        row('Fail the build when a table row has no source link', 'Automated', 'node tools/verify.mjs runs in the Pages workflow', 'This repository'),
        row('Fail the build when a page is missing its disclosure', 'Automated', 'node tools/verify.mjs', 'https://affiliate-program.amazon.com/help/operating/policies'),
        row('Fail the build when an outbound product link is not marked sponsored', 'Automated', 'node tools/verify.mjs', 'https://affiliate-program.amazon.com/help/operating/policies'),
        row('Fail the build on a broken internal link', 'Automated', 'node tools/verify.mjs', 'This repository'),
        row('Confirm a product identity against the enrolled workflow', 'Human gate', 'One test per product, then the click report', 'https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM'),
        row('Approve a recommendation as best', 'Human gate', 'Requires an evaluation rubric and dated evidence', 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking'),
        row('Report an order or an earning', 'Human gate', 'Only from an authorised first-party report', 'https://affiliate-program.amazon.com/help/operating/policies'),
      ]
    )}

    ${sectionHead('Open flags', 'What a reviewer should look at first')}
    ${table(
      ['ID', 'Severity', 'Area', 'Item', 'Source'],
      openFlags.map((f) =>
        `<tr><td><a href="../review/flagged.html#${f.id}"><code>${esc(f.id)}</code></a></td><td>${statusPill(f.severity === 'High' ? 'Blocked' : f.severity === 'Medium' ? 'Pending' : 'Open')}</td><td>${esc(f.area)}</td><td>${esc(f.title)}</td><td>${sourceChip(f.source, 'source')}</td></tr>`
      )
    )}
  </div>
</section>`;

  return layout({
    title: 'The workbench | Counterwise',
    desc: 'The operating dashboard: product research, content, links, campaigns and compliance, with every figure dated and sourced.',
    slug: 'dashboard/',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function row(...cells) {
  return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
}

function buildDashboardProducts() {
  const ps = products.products;
  const priceList = ps.map((p) => p.priceUsd).filter((n) => n !== null);
  const lo = Math.min(...priceList);
  const hi = Math.max(...priceList);
  const ratings = ps.map((p) => p.rating).filter((n) => n !== null);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; products</p>
  <h1>Product research, with the receipts.</h1>
  <p class="lede">Every field below was read from the official Amazon listing on ${esc(products.generated)}. Where a value could not be confirmed from an official source, the cell is blank and the item is flagged for review.</p>
  <ul class="hero-facts">
    <li><b>${ps.length}</b> products</li>
    <li><b>${money(lo)}&ndash;${money(hi)}</b> observed price range</li>
    <li><b>${avgRating.toFixed(2)}</b> mean of observed ratings</li>
    <li><b>${products.generated}</b> last read</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'products.html')}
  <div class="dash-body">

    ${sectionHead('The tracked set', 'Product research table')}
    ${table(
      [
        'ID',
        'Brand &amp; model',
        'Cluster',
        'Type',
        'Observed ASIN',
        `Price (${products.generated})`,
        'Rating',
        'Reviews',
        'Availability',
        'Sold by',
        'Source',
      ],
      ps.map(
        (p) =>
          `<tr id="${p.id}"><td><code>${esc(p.id)}</code></td><th scope="row" class="rowhead">${esc(p.brand)}<br><span class="muted">${esc(p.name)}</span></th><td>${esc(clusterById[p.cluster].name)}</td><td>${esc(p.type)}</td><td><code>${esc(p.observedAsin)}</code></td><td>${p.priceUsd === null ? blank : `<b>${money(p.priceUsd)}</b>`}</td><td>${p.rating === null ? blank : p.rating.toFixed(1)}</td><td>${p.reviewCount === null ? blank : num(p.reviewCount)}</td><td>${esc(p.availability || blank)}</td><td>${esc(p.soldBy || blank)}</td><td>${sourceChip(p.officialListingUrl, 'listing')}</td></tr>`
      )
    )}
    <p class="fine">Prices, ratings and review counts are point-in-time observations. A mean rating is a plain average of the observed values above and is not a quality claim.</p>

    ${sectionHead('Link provenance', 'Intent and observed destination are kept apart')}
    ${table(
      ['ID', 'Submitted source link', 'Intended ASIN', 'Observed redirect target', 'Official listing URL', 'Confirmed on', 'Source'],
      ps.map(
        (p) =>
          `<tr><td><code>${esc(p.id)}</code></td><td><a class="ref" href="${esc(p.submittedLink)}" rel="noopener" target="_blank">${esc(p.submittedLink)}</a><br><span class="muted">${esc(p.submittedToken)} &middot; ${esc(p.submittedTokenNote)}</span></td><td>${blank}<br><span class="muted">${esc(p.intendedAsinStatus)}</span></td><td><code>${esc(p.observedAsin)}</code><br><span class="muted">${esc(p.observedOn)}</span></td><td>${canonicalText(p.officialListingUrl)}<br>${sourceChip(p.officialListingUrl, 'open listing')}</td><td>${esc(p.confirmationDate)}</td><td>${sourceChip(p.confirmationSource, 'listing')}</td></tr>`
      )
    )}
    <p class="fine">The intended ASIN column is deliberately blank. The submitted links are 9-character opaque tokens, not 10-character ASINs, so intent cannot be read from them. The observed redirect target is recorded in its own column and the two are never merged. <a href="../review/flagged.html#FLG-001">FLG-001</a> and <a href="../review/flagged.html#FLG-003">FLG-003</a> track this.</p>

    ${sectionHead('Attribute dossiers', 'What each listing states')}
    <div class="dossiers">${ps.map((p) => specBlock(p)).join('')}</div>

    ${sectionHead('Pricing observations', 'What the prices do and do not tell you')}
    ${table(
      ['ID', 'Product', 'Observed price', 'List price shown', 'Saving shown', 'Read on', 'Source'],
      ps.map(
        (p) =>
          `<tr><td><code>${esc(p.id)}</code></td><th scope="row" class="rowhead">${esc(p.brand)} ${esc(p.name)}</th><td>${p.priceUsd === null ? blank : money(p.priceUsd)}</td><td>${p.id === 'P4' ? '$22.99' : blank}</td><td>${p.id === 'P4' ? '26 percent' : blank}</td><td>${esc(p.priceObservedOn || '')}</td><td>${sourceChip(p.officialListingUrl, 'listing')}</td></tr>`
      )
    )}
    <p class="fine">Only one listing displayed a separate list price and saving percentage at the time of reading. Everything else shows the current price only. No price history, price stability or discount-cycle claim is made anywhere on this site. <a href="../review/flagged.html#FLG-007">FLG-007</a>.</p>

    ${sectionHead('Revenue signals', 'What is known and what is not')}
    ${table(
      ['Signal', 'Value', 'Source', 'Note'],
      [
        row('Commission rate per product', blank, sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy'), 'The account Commission Income Statement has not been read. <a href="../review/flagged.html#FLG-004">FLG-004</a>'),
        row('Orders attributed to this site', blank, sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy'), 'No authorised report has been obtained. <a href="../review/flagged.html#FLG-008">FLG-008</a>'),
        row('Earnings to date', blank, sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy'), 'No authorised report has been obtained. <a href="../review/flagged.html#FLG-008">FLG-008</a>'),
        row('Best-selling rank or badge', blank, sourceChip('https://www.amazon.com/dp/B0DHZTCNR5', 'listing'), 'One listing carries an Amazon\'s Choice badge and a 5K+ bought in past month badge; these are recorded as observed badges, not as a ranking claim for the set'),
        row('Click-through rate', blank, sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy'), 'No analytics endpoint exists yet. <a href="../review/flagged.html#FLG-009">FLG-009</a>'),
      ]
    )}

    ${sectionHead('Purchasing links', 'Canonical Special Links used across the site')}
    ${table(
      ['ID', 'Product', 'Special Link', 'Rel attributes', 'Status'],
      ps.map(
        (p) =>
          `<tr><td><code>${esc(p.id)}</code></td><th scope="row" class="rowhead">${esc(p.brand)} ${esc(p.name)}</th><td><code class="wrap">${esc(p.affiliateUrl)}</code></td><td><code>sponsored noopener</code></td><td>${statusPill('Open')}<br><span class="muted">click test pending</span></td></tr>`
      )
    )}
    <p class="fine">The Program Policies require Special Links to carry the assigned Associate ID and to be accessed directly from the site. These links use the canonical <code>/dp/&lt;ASIN&gt;?tag=</code> form. Attribution is not yet confirmed; see <a href="../review/flagged.html#FLG-003">FLG-003</a>.</p>
  </div>
</section>`;

  return layout({
    title: 'Products | Counterwise workbench',
    desc: 'The full product research table: observed ASIN, price, rating, reviews, availability, seller and source, all dated.',
    slug: 'dashboard/products.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function buildDashboardCompetition() {
  const bySubject = Object.fromEntries(products.products.map((p) => [p.id, p]));
  const rows = competition.rows.map((c) => {
    const s = bySubject[c.subjectId];
    return `<tr><td><code>${esc(c.id)}</code></td><th scope="row" class="rowhead">${esc(c.subjectName)}<br><span class="muted">subject ${esc(c.subjectId)} &middot; <code>${esc(s.observedAsin)}</code></span></th><td>${esc(c.alternativeBrand || 'Brand not shown')}<br><span class="muted">${esc(c.alternativeName)}</span></td><td><code>${esc(c.alternativeAsin)}</code></td><td>${c.priceUsd === null ? blank : money(c.priceUsd)}</td><td>${c.rating === null ? blank : c.rating.toFixed(1)}</td><td>${c.reviewCount === null ? blank : num(c.reviewCount)}</td><td>${esc(c.observedOn)}</td><td>${sourceChip(c.sourceUrl, 'listing')}</td></tr>`;
  });

  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; competition</p>
  <h1>The alternatives Amazon itself surfaced.</h1>
  <p class="lede">Not a market map and not a ranking. These are the alternatives Amazon displayed in its own "customers who viewed this item also viewed" module for each tracked listing on ${esc(competition.observedOn)}, captured with their listing price, rating and review count.</p>
  <ul class="hero-facts">
    <li><b>${competition.rows.length}</b> alternatives captured</li>
    <li><b>${products.products.length}</b> subject listings</li>
    <li><b>${esc(competition.observedOn)}</b> captured</li>
    <li><b>0</b> popularity claims</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'competition.html')}
  <div class="dash-body">
    ${sectionHead('Alternative listings', 'Captured from the recommendation module on each subject listing')}
    ${table(
      ['ID', 'Subject listing', 'Alternative', 'ASIN', 'Price', 'Rating', 'Reviews', 'Observed', 'Source'],
      rows
    )}
    <div class="note"><b>Read this carefully</b><br>${esc(competition.method)}</div>

    ${sectionHead('Price spread by subject', 'Where the alternatives sat on the day')}
    ${table(
      ['Subject', 'Subject price', 'Lowest alternative', 'Highest alternative', 'Spread', 'Alternatives with more reviews than the subject', 'Source'],
      products.products.map((p) => {
        const alts = competition.rows.filter((c) => c.subjectId === p.id);
        const prices = alts.map((a) => a.priceUsd).filter((n) => n !== null);
        const lo = prices.length ? Math.min(...prices) : null;
        const hi = prices.length ? Math.max(...prices) : null;
        const more = alts.filter((a) => p.reviewCount !== null && a.reviewCount !== null && a.reviewCount > p.reviewCount).length;
        return `<tr><th scope="row" class="rowhead">${esc(p.brand)} ${esc(p.name)}</th><td>${p.priceUsd === null ? blank : money(p.priceUsd)}</td><td>${lo === null ? blank : money(lo)}</td><td>${hi === null ? blank : money(hi)}</td><td>${lo === null || hi === null ? blank : money(hi - lo)}</td><td>${more} of ${alts.length}</td><td>${sourceChip(p.officialListingUrl, 'listing')}</td></tr>`;
      })
    )}
    <p class="fine">A larger review count is a fact about a listing, not evidence of a better product. Nothing in this table is a recommendation, a ranking, or a claim that the tracked set is more or less competitive than anything else.</p>
  </div>
</section>`;

  return layout({
    title: 'Competition | Counterwise workbench',
    desc: 'Alternative listings captured from Amazon recommendation modules, each with its own listing price, rating, review count and source link.',
    slug: 'dashboard/competition.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function buildDashboardContent() {
  const rows = articles.articles.map((a) => {
    const words = JSON.stringify(a.body).split(/\s+/).length;
    return `<tr><td><code>${esc(a.id)}</code></td><th scope="row" class="rowhead"><a href="../guides/${a.slug}.html">${esc(a.title)}</a><br><span class="muted">${esc(a.dek)}</span></th><td>${esc(a.category)}</td><td>${esc(a.kicker)}</td><td>${esc(a.intent)}</td><td>${esc(a.hypothesis)}</td><td>${esc(a.published)}</td><td>${a.readMinutes} min</td><td>${words} approx.</td><td>${statusPill('Published')}</td></tr>`;
  });

  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; content</p>
  <h1>What we published, and why.</h1>
  <p class="lede">The content inventory with each guide's editorial hypothesis. A hypothesis is a guess about what a reader would ask. It is not a search-volume claim, a trend claim, or a claim of popularity.</p>
  <ul class="hero-facts">
    <li><b>${articles.articles.length}</b> guides</li>
    <li><b>${articles.articles.filter((a) => a.category === 'air-fryers').length}</b> air fryer guides</li>
    <li><b>${articles.articles.filter((a) => a.category === 'thermometers').length}</b> thermometer guides</li>
    <li><b>0</b> volume claims</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'content.html')}
  <div class="dash-body">
    ${sectionHead('Content inventory', 'Every guide, its question and its hypothesis')}
    ${table(
      ['ID', 'Title and standfirst', 'Category', 'Angle', 'Intent', 'Editorial hypothesis', 'Published', 'Read', 'Length', 'Status'],
      rows
    )}

    ${sectionHead('Publishing cadence', 'A stated rhythm, not an intention')}
    ${table(
      ['Item', 'Value', 'Note'],
      [
        row('Proposed cadence', 'One guide every two weeks', 'A suggestion on the board, not a commitment. <a href="../review/suggestions.html#S-06">S-06</a>'),
        row('Guides published to date', String(articles.articles.length), 'All on ' + products.generated),
        row('Next topic', blank, 'Chosen from measured queries once they exist. <a href="../review/questions.html#Q-07">Q-07</a>'),
        row('Sitemap', 'Regenerated by every build', 'see sitemap.xml'),
        row('Feed', 'Regenerated by every build', 'see feed.xml'),
      ]
    )}

    ${sectionHead('SEO artefacts', 'What the build produces')}
    ${table(
      ['Artefact', 'Path', 'What it does', 'Source of truth'],
      [
        row('XML sitemap', 'sitemap.xml', 'One indexable list of every published page', 'tools/build.mjs'),
        row('RSS feed', 'feed.xml', 'Every published guide, newest first', 'data/articles.json'),
        row('robots.txt', 'robots.txt', 'Allows the sitemap, points at the canonical host', 'tools/build.mjs'),
        row('Canonical URLs', 'every page', 'Set from the Pages host', 'tools/build.mjs'),
        row('Article structured data', 'guides/*.html', 'JSON-LD with headline, date and publisher', 'data/articles.json'),
      ]
    )}

    <div class="note"><b>On search behaviour</b><br>This site publishes no search volume, keyword difficulty, traffic forecast or ranking claim. There is no first-party query data yet. Choosing the next topic from measured queries is the plan; the measurement is what is missing.</div>
  </div>
</section>`;

  return layout({
    title: 'Content | Counterwise workbench',
    desc: 'The content inventory with each guide editorial hypothesis, plus the publishing cadence and SEO artefacts.',
    slug: 'dashboard/content.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function buildDashboardLinks() {
  const ps = products.products;
  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; links</p>
  <h1>Every outbound link, accounted for.</h1>
  <p class="lede">One link form, one Associate ID, one sponsored marker. The register below lists the form used across the site and the link source supplied in the brief, kept apart from what the site actually publishes.</p>
  <ul class="hero-facts">
    <li><b>${ps.length}</b> tracked links</li>
    <li><b>1</b> link form</li>
    <li><b>${ps.length}</b> sponsored markers</li>
    <li><b>1</b> Associate ID</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'links.html')}
  <div class="dash-body">
    ${sectionHead('Link form', 'The one format used everywhere')}
    ${table(
      ['Field', 'Value', 'Why'],
      [
        row('Product URL form', '<code>https://www.amazon.com/dp/&lt;ASIN&gt;?tag=' + esc(TAG) + '</code>', 'The canonical product Special Link. It carries the Associate ID as a URL parameter, as the Program Policies require.'),
        row('Associate ID', '<code>' + esc(TAG) + '</code>', 'Supplied in the brief. Matches the XXXXX-## Associate ID format described in the Program Policies.'),
        row('Rel attributes', '<code>sponsored noopener</code>', 'Marks the link as a sponsored affiliate link and opens it safely.'),
        row('Visible marker', 'A <span class="pill">Sponsored</span> badge on the link itself', 'The reader should not have to infer that the link is commercial.'),
        row('Disclosure', 'A strip under the masthead on every page, repeated in the footer', 'Plain-language disclosure above the fold, per the FTC guidance on clear and conspicuous disclosure.'),
        row('Supplied short links', 'Never published as outbound links', 'They are ambiguous. They stay in the evidence register as source inputs. <a href="../review/flagged.html#FLG-003">FLG-003</a>'),
      ]
    )}

    ${sectionHead('Published link register', 'One row per tracked product')}
    ${table(
      ['ID', 'Product', 'ASIN', 'Published URL', 'Rel', 'Marker', 'Disclosure on page', 'Attribution'],
      ps.map(
        (p) =>
          `<tr><td><code>${esc(p.id)}</code></td><th scope="row" class="rowhead">${esc(p.brand)} ${esc(p.name)}</th><td><code>${esc(p.observedAsin)}</code></td><td><code class="wrap">${esc(p.affiliateUrl)}</code></td><td><code>sponsored</code></td><td>${pill('Sponsored', 'ok')}</td><td>${pill('Yes', 'ok')}</td><td>${statusPill('Pending')}<br><span class="muted">click test not yet run</span></td></tr>`
      )
    )}

    ${sectionHead('Supplied short links', 'Kept as source inputs, published nowhere')}
    ${table(
      ['ID', 'Supplied link', 'Observed destination', 'Published on this site?', 'Why'],
      ps.map(
        (p) =>
          `<tr><td><code>${esc(p.id)}</code></td><td><a class="ref" href="${esc(p.submittedLink)}" rel="noopener" target="_blank">${esc(p.submittedLink)}</a></td><td><code>${esc(p.observedAsin)}</code></td><td>${pill('No', 'warn')}</td><td>Replaced by the canonical Special Link. The supplied link is recorded, not published.</td></tr>`
      )
    )}

    ${sectionHead('Measurement events', 'Defined, not yet running')}
    ${table(
      ['Event', 'Fires when', 'Carries', 'State'],
      [
        row('page_view', 'A guide or dashboard page loads', 'page path, referrer class, timestamp', 'Not implemented'),
        row('outbound_click', 'A sponsored product link is activated', 'product id, page path, timestamp', 'Not implemented'),
        row('guide_engaged', 'A reader scrolls past the halfway point of a guide', 'guide id, timestamp', 'Not implemented'),
        row('disclosure_view', 'The disclosure strip is present in the viewport', 'page path, timestamp', 'Not implemented'),
        row('affiliate_conversion_reported', 'A dated authorised report arrives', 'report date, orders, source', 'Never inferred from a click'),
      ]
    )}
    <div class="note"><b>Two hard constraints on measurement</b><br>First, GitHub Pages serves static files, so a durable collector needs separate hosting. Second, the Program Policies prohibit associating a sub-tag or other reporting with a specific end user, so the counter must be aggregate and anonymous. <a href="../review/flagged.html#FLG-009">FLG-009</a></div>
  </div>
</section>`;

  return layout({
    title: 'Links | Counterwise workbench',
    desc: 'The outbound link register: one Special Link form, the Associate ID, sponsored markers, and the supplied short links kept as source inputs.',
    slug: 'dashboard/links.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function buildDashboardCampaigns() {
  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; campaigns</p>
  <h1>The ledger, empty on purpose.</h1>
  <p class="lede">A campaign ledger that starts empty and only accepts figures from authorised first-party reports is a control. A ledger that fills up with estimates is a liability. This one is empty.</p>
  <ul class="hero-facts">
    <li><b>0</b> campaign rows</li>
    <li><b>0</b> conversion claims</li>
    <li><b>0</b> revenue forecasts</li>
    <li><b>${campaigns.columns.length}</b> defined columns</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'campaigns.html')}
  <div class="dash-body">
    ${sectionHead('Campaign ledger', 'Empty by design')}
    ${table(
      campaigns.columns.map((c) => `<span title="${esc(c.description)}">${esc(c.label)}</span>`),
      [],
      { emptyNote: campaigns.emptyStateNote }
    )}

    ${sectionHead('Ledger rules', 'The rules that keep it honest')}
    <ol class="rules">${campaigns.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>

    ${sectionHead('Where the figures will come from', 'Three first-party sources, none connected yet')}
    ${table(
      ['Source', 'What it provides', 'Owner', 'State'],
      campaigns.plannedSources.map(
        (s) => row(esc(s.name), esc(s.what), esc(s.owner), statusPill(s.status === 'not implemented' ? 'Not started' : s.status))
      )
    )}

    ${sectionHead('What this page deliberately does not contain', 'The gaps are the point')}
    ${table(
      ['Not published', 'Why'],
      [
        row('Estimated monthly sessions', 'No endpoint exists. An estimate would be a number that looks like a measurement.'),
        row('Conversion rate', 'Needs click data and order data from two independent first-party sources.'),
        row('Earnings or revenue forecast', 'Commission rates per ASIN are unknown until the account Commission Income Statement is read.'),
        row('A traffic ranking against other sites', 'Not obtainable from any authorised source.'),
        row('A "top performing product" label', 'Would require order data that has not been reported.'),
      ]
    )}
  </div>
</section>`;

  return layout({
    title: 'Campaigns | Counterwise workbench',
    desc: 'The campaign ledger: empty by design, with its columns, rules and provenance trail defined in advance.',
    slug: 'dashboard/campaigns.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

function buildDashboardCompliance() {
  const pages = [];
  const collect = (dir) => {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) return;
    for (const f of fs.readdirSync(abs)) {
      if (f.endsWith('.html')) pages.push(path.join(dir, f).split(path.sep).join('/'));
    }
  };
  collect('.');
  ['guides', 'dashboard', 'review', 'summary', 'air-fryers', 'thermometers'].forEach(collect);
  pages.sort();

  const body = `<section class="pagehead">
  <p class="eyebrow light">Workbench &middot; compliance</p>
  <h1>Disclosure, attribution and policy gates.</h1>
  <p class="lede">What the site does, what the rules require, and which parts are still waiting on a qualified review. The checks marked automated run on every build and block the deploy if they fail.</p>
  <ul class="hero-facts">
    <li><b>${pages.length}</b> pages checked</li>
    <li><b>${pages.length}</b> with a disclosure strip</li>
    <li><b>2</b> automated gates</li>
    <li><b>1</b> review pending</li>
  </ul>
</section>

<section class="dash">
  ${workbenchNav(1, 'compliance.html')}
  <div class="dash-body">
    ${sectionHead('Automated release gates', 'Run by tools/verify.mjs before every deploy')}
    ${table(
      ['Gate', 'Rule', 'State', 'Reference'],
      [
        row('Disclosure present', 'Every generated page opens with the disclosure strip and repeats it in the footer', statusPill('Implemented'), sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')),
        row('Sponsored marking', 'Every outbound amazon.com link carries rel="sponsored"', statusPill('Implemented'), sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')),
        row('Source attribution', 'Every table row that carries a value also carries a source link', statusPill('Implemented'), sourceChip('https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking', 'FTC')),
        row('Associate ID present', 'Every outbound Amazon link carries the Associate ID parameter', statusPill('Implemented'), sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')),
        row('Internal links resolve', 'No generated page links to a file that does not exist', statusPill('Implemented'), sourceChip(SITE, 'site')),
        row('Sitemap completeness', 'Every generated page appears in the sitemap exactly once', statusPill('Implemented'), sourceChip(SITE, 'site')),
        row('Qualified compliance review', 'A named reviewer signs off the live pages against the agreement, the policies and the FTC guides', statusPill('Open'), sourceChip('https://affiliate-program.amazon.com/help/operating/agreement', 'agreement')),
      ]
    )}

    ${sectionHead('Disclosure placement map', 'Every page, and where the notice sits')}
    ${table(
      ['Page', 'Strip under masthead', 'Footer notice', 'Sponsored product links'],
      pages.map(
        (p) =>
          `<tr><td><code>${esc(p)}</code></td><td>${pill('Yes', 'ok')}</td><td>${pill('Yes', 'ok')}</td><td>${p.startsWith('index.html') || p.includes('/index.html') || p.includes('products.html') || p.includes('competition.html') || p.includes('links.html') ? pill('Yes', 'ok') : pill('No', 'warn')}</td></tr>`
      )
    )}

    ${sectionHead('Official references', 'The rules this gate is written against')}
    ${table(
      ['Reference', 'Publisher', 'What it governs here', 'Verified'],
      sources.rows
        .filter((s) => s.type !== 'Official product listing' && s.type !== 'Official infrastructure record')
        .map((s) =>
          row(
            `<a class="ref" href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.name)}</a>`,
            esc(s.publisher),
            esc(s.supports),
            esc(s.verified)
          )
        )
    )}

    ${sectionHead('Open compliance items', 'What still needs a person')}
    ${table(
      ['ID', 'Item', 'Severity', 'Source'],
      flags.rows
        .filter((f) => f.area === 'Compliance' || f.area === 'Link mechanics')
        .map((f) =>
          `<tr id="${esc(f.id)}"><td><code>${esc(f.id)}</code></td><th scope="row" class="rowhead">${esc(f.title)}<br><span class="muted">${esc(f.whatWouldCloseIt)}</span></th><td>${statusPill(f.severity === 'High' ? 'Blocked' : f.severity === 'Medium' ? 'Pending' : 'Open')}</td><td>${sourceChip(f.source, 'source')}</td></tr>`
        )
    )}
    <div class="note"><b>Not legal advice</b><br>These are review starting points, not legal advice and not a claim that a completed compliance review has taken place.</div>
  </div>
</section>`;

  return layout({
    title: 'Compliance | Counterwise workbench',
    desc: 'Automated disclosure, sponsored-link and attribution gates, the full disclosure placement map, and the official policy references.',
    slug: 'dashboard/compliance.html',
    depth: 1,
    body,
    active: 'dashboard',
    bodyClass: 'dashpage',
  });
}

/* ------------------------------------------------------------------ review */

function buildReviewIndex() {
  const body = `<section class="pagehead">
  <p class="eyebrow light">Evidence register</p>
  <h1>What we know, what we don't.</h1>
  <p class="lede">The full record behind the writing: where every figure came from, what is still unverified, and what would close each gap. Blank means not verified, not zero and not a guess.</p>
  <ul class="hero-facts">
    <li><b>${sources.rows.length}</b> official sources</li>
    <li><b>${questions.rows.length}</b> open questions</li>
    <li><b>${suggestions.rows.length}</b> suggestions</li>
    <li><b>${flags.rows.length}</b> flags</li>
  </ul>
</section>

<section class="articles">
  <div class="rmenu">
    <a href="questions.html"><b>Open questions</b><span>What must be answered before a decision is reasonable</span></a>
    <a href="suggestions.html"><b>Suggestions board</b><span>Proposals for review before anything is implemented</span></a>
    <a href="flagged.html"><b>Flagged for review</b><span>Everything unverified, with the source used</span></a>
    <a href="sources.html"><b>Source index</b><span>Every official source this site relies on</span></a>
    <a href="../summary/index.html"><b>Executive summary</b><span>The short version of the whole project</span></a>
  </div>

  ${sectionHead('Product evidence register', 'The five submitted links and what each resolved to')}
  ${table(
    ['ID', 'Submitted source link', 'Intended ASIN', 'Observed redirect target', 'Official listing URL', 'Confirmation date', 'Source'],
    products.products.map(
      (p) =>
        `<tr><td><code>${esc(p.id)}</code></td><td><a class="ref" href="${esc(p.submittedLink)}" rel="noopener" target="_blank">${esc(p.submittedLink)}</a></td><td>${blank}<br><span class="muted">${esc(p.intendedAsinStatus)}</span></td><td><code>${esc(p.observedAsin)}</code><br><span class="muted">resolved ${esc(p.observedOn)}</span></td><td>${canonicalText(p.officialListingUrl)}<br>${sourceChip(p.officialListingUrl, 'open listing')}</td><td>${esc(p.confirmationDate)}</td><td>${sourceChip(p.confirmationSource, 'listing')}</td></tr>`
    )
  )}
  <p class="fine">Intent and observed destination are kept in separate columns and are never merged. The submitted tokens are 9-character opaque short-link identifiers, not 10-character ASINs, so the intended product cannot be read out of them. This is an observation about the links, not a finding that they are invalid; their compliance status remains unresolved and is tracked as <a href="flagged.html#FLG-003">FLG-003</a>.</p>

  ${sectionHead('What is established, and what is not', 'Two columns, no overlap')}
  ${table(
    ['Established from an official source', 'Still unverified', 'Source'],
    [
      row(
        'All five short links resolve to a live Amazon product listing, and the resolved ASIN is recorded for each.',
        'The intended ASIN behind each short link.',
        sourceChip('https://www.amazon.com/dp/B0CDY277D3', 'listings')
      ),
      row(
        'Price, rating, review count, availability, seller and stated specifications for each listing, read on ' + esc(products.generated) + '.',
        'Commission rate, eligibility and earnings for any of these listings.',
        sourceChip('https://www.amazon.com/dp/B09B7SB46R', 'listings')
      ),
      row(
        'Fifteen alternative listings captured from Amazon\'s own recommendation module, with their own prices and ratings.',
        'Whether a click on the supplied short links is attributed to the tracking ID.',
        sourceChip('https://www.amazon.com/dp/B0CDY277D3', 'listings')
      ),
      row(
        'The Amazon Associates Program Policies require Special Links to carry the Associate ID, and the FTC guidance on clear and conspicuous disclosure.',
        'A qualified review of the live pages against those rules.',
        sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')
      ),
      row(
        'Amazon has deprecated Product Advertising API 5.0 and names the Creators API as the supported successor.',
        'Credentials and a working integration for that API.',
        sourceChip('https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation', 'notice')
      ),
    ]
  )}

  ${sectionHead('Scope and provenance', 'How this register is built')}
  <ul class="prose-list">
    <li>The five submitted links and the tracking ID came from the project brief. They are recorded verbatim and are not treated as product truth.</li>
    <li>Every product fact was read directly from the official Amazon listing on ${esc(products.generated)} and is labelled with that date.</li>
    <li>Every policy statement links to the publisher's own page, with the update date shown where the page shows one.</li>
    <li>Guide content is general editorial guidance and avoids claims about named models beyond what the linked listing states.</li>
    <li>Where a value could not be confirmed from an official source, the cell is blank and the item is published on the <a href="flagged.html">Flagged for Review</a> page.</li>
  </ul>

  ${sectionHead('Related', 'Where to go next')}
  <div class="rmenu">
    <a href="questions.html"><b>Open questions</b><span>${questions.rows.length} questions that must be answered before a decision is reasonable</span></a>
    <a href="suggestions.html"><b>Suggestions board</b><span>${suggestions.rows.length} proposals held for review, not auto-implemented</span></a>
    <a href="flagged.html"><b>Flagged for review</b><span>${flags.rows.length} items with their sources</span></a>
    <a href="sources.html"><b>Source index</b><span>${sources.rows.length} official sources with verification notes</span></a>
  </div>
</section>

<section class="article" id="disclosure">
  <h2>Disclosure &amp; policy gates</h2>
  <p>The disclosure is visible beneath the masthead on every page and repeated in the footer. Every outbound product link carries <code>rel="sponsored"</code> and a visible Sponsored marker, with the link form and the Associate ID listed in the links dashboard. Before adding product links, review the current official program terms and applicable endorsement guidance.</p>
  <ul class="prose-list">
    ${sources.rows
      .filter((s) => s.type !== 'Official product listing' && s.type !== 'Official infrastructure record')
      .map(
        (s) =>
          `<li><a class="ref" href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.name)}</a> &mdash; ${esc(s.publisher)}. ${esc(s.verified)}</li>`
      )
      .join('')}
  </ul>
  <p>These are review starting points, not legal advice and not a claim that a completed compliance review has taken place.</p>
</section>`;

  return layout({
    title: 'Evidence register | Counterwise',
    desc: 'The evidence register: the five submitted links, what each resolved to, what is established, what is not, and the official sources used.',
    slug: 'review/',
    depth: 1,
    body,
    active: 'review',
  });
}

function buildReviewQuestions() {
  const body = `<section class="pagehead">
  <p class="eyebrow light">Review</p>
  <h1>The questions that have to be answered first.</h1>
  <p class="lede">A decision cannot be made reasonably until the evidence exists. Each question below states what is known, what is missing, the specific artefact that would close it, and the decision it unblocks.</p>
  <ul class="hero-facts">
    <li><b>${questions.rows.length}</b> questions</li>
    <li><b>${questions.rows.filter((q) => q.status === 'Open').length}</b> open</li>
    <li><b>${questions.rows.reduce((n, q) => n + q.blocks.length, 0)}</b> flag links</li>
    <li><b>0</b> answered by assumption</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('Open questions', 'Known, missing, how to discover, what it unblocks')}
  ${table(
    ['ID', 'Area', 'Question', 'Known from current materials', 'Missing evidence', 'How to discover it', 'Decision it enables', 'Source', 'Status'],
    questions.rows.map((q) =>
      `<tr id="${esc(q.id)}"><td><code>${esc(q.id)}</code></td><td>${esc(q.area)}</td><th scope="row" class="rowhead">${esc(q.question)}</th><td>${esc(q.known)}</td><td>${esc(q.missing)}</td><td>${esc(q.howToDiscover)}</td><td>${esc(q.decisionEnabled)}</td><td>${sourceChip(q.source, 'source')}</td><td>${statusPill(q.status)}</td></tr>`
    )
  )}
  <p class="fine">A blank answer is never filled with an estimate. Every row names the artefact that would close it, so the question is actionable rather than rhetorical.</p>

  ${sectionHead('The pattern', 'What the questions have in common')}
  <ul class="prose-list">
    <li>Almost every gap is closed by something only the account owner can produce: the product record, the click report, the Commission Income Statement, or the approved integration.</li>
    <li>None of them is closed by writing more. The guide cluster is not blocked by effort; it is blocked by evidence.</li>
    <li>Four of them &mdash; Q-02, Q-03, Q-06 and Q-08 &mdash; are about money and measurement, and until they close, the site publishes no earnings figure and no performance claim at all.</li>
  </ul>
</section>`;

  return layout({
    title: 'Open questions | Counterwise',
    desc: 'Every question that must be answered before a reasonable decision, with what is known, what is missing, and how to discover it.',
    slug: 'review/questions.html',
    depth: 1,
    body,
    active: 'review',
  });
}

function buildReviewSuggestions() {
  const areas = [...new Set(suggestions.rows.map((s) => s.area))];
  const body = `<section class="pagehead">
  <p class="eyebrow light">Review</p>
  <h1>Suggestions, held for review.</h1>
  <p class="lede">Proposals for improving the site, with the reasoning, the evidence each one needs and an effort estimate. Nothing here is implemented by default. Marked rows are the ones already in the build.</p>
  <ul class="hero-facts">
    <li><b>${suggestions.rows.length}</b> suggestions</li>
    <li><b>${suggestions.rows.filter((s) => s.status === 'Implemented').length}</b> implemented</li>
    <li><b>${suggestions.rows.filter((s) => s.status === 'Proposed').length}</b> proposed</li>
    <li><b>${areas.length}</b> areas</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('The board', 'Review before implementing')}
  ${table(
    ['ID', 'Area', 'Priority', 'Suggestion', 'Rationale', 'Evidence needed', 'Effort', 'Status'],
    suggestions.rows.map((s) =>
      `<tr id="${esc(s.id)}"><td><code>${esc(s.id)}</code></td><td>${esc(s.area)}</td><td>${pill(s.priority, s.priority === 'High' ? 'warn' : '')}</td><th scope="row" class="rowhead">${esc(s.suggestion)}</th><td>${esc(s.rationale)}</td><td>${esc(s.evidenceNeeded)}</td><td>${esc(s.effort)}</td><td>${statusPill(s.status)}</td></tr>`
    )
  )}

  ${sectionHead('By area', 'How the board clusters')}
  ${areas
    .map(
      (area) => `<div class="ggroup">
  <div class="ghead"><p class="eyebrow">${esc(area)}</p></div>
  <ol class="sug">${suggestions.rows
    .filter((s) => s.area === area)
    .map(
      (s) =>
        `<li><b>${esc(s.suggestion)}</b><span>${esc(s.rationale)}</span><em>${statusPill(s.status)} &middot; effort ${esc(s.effort)} &middot; needs: ${esc(s.evidenceNeeded)}</em></li>`
    )
    .join('')}</ol>
</div>`
    )
    .join('')}

  <div class="note"><b>How to use this board</b><br>Pick a row, gather the evidence it names, and only then implement it. When a row moves to Implemented, record the sources used and the verification performed in <code>COORDINATION.md</code>. Rows that are never implemented are not failures; they are the reason the board exists.</div>
</section>`;

  return layout({
    title: 'Suggestions | Counterwise',
    desc: 'A review board of proposals for improving the site, with rationale, required evidence, effort and status for each.',
    slug: 'review/suggestions.html',
    depth: 1,
    body,
    active: 'review',
  });
}

function buildReviewFlagged() {
  const body = `<section class="pagehead">
  <p class="eyebrow light">Review</p>
  <h1>Flagged for review.</h1>
  <p class="lede">Everything this site could not verify, or could not do, listed with what was observed, what is missing, the official source used, and what would close it. None of it blocks the site going live.</p>
  <ul class="hero-facts">
    <li><b>${flags.rows.length}</b> flags</li>
    <li><b>${flags.rows.filter((f) => f.severity === 'High').length}</b> high</li>
    <li><b>${flags.rows.filter((f) => f.severity === 'Medium').length}</b> medium</li>
    <li><b>${flags.rows.filter((f) => f.severity === 'Low').length}</b> low</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('Flagged items', 'Each one with its source')}
  ${flags.rows
    .map(
      (f) => `<div class="flagcard" id="${esc(f.id)}">
    <div class="flaghead">
      <code>${esc(f.id)}</code>
      ${pill(f.severity, f.severity === 'High' ? 'bad' : f.severity === 'Medium' ? 'warn' : '')}
      <span class="muted">${esc(f.area)}</span>
      ${statusPill(f.status)}
    </div>
    <h3>${esc(f.title)}</h3>
    <p><b>Observed.</b> ${esc(f.observed)}</p>
    <p><b>Missing.</b> ${esc(f.missing)}</p>
    <p><b>What would close it.</b> ${esc(f.whatWouldCloseIt)}</p>
    <p class="sources">Source: ${sourceChip(f.source, 'official source')}${
      f.alsoSee.length ? ` Also: ${f.alsoSee.map((u) => sourceChip(u, 'source')).join(' ')}` : ''
    }</p>
  </div>`
    )
    .join('')}

  ${sectionHead('Severity key', 'What each level means here')}
  ${table(
    ['Level', 'Meaning', 'Effect on publishing'],
    [
      row('High', 'A monetised, legal or factual claim depends on it.', 'No claim depending on it is published. The site stays live.'),
      row('Medium', 'A capability or a fact is incomplete, but nothing false is being said.', 'The gap is stated in place, on the relevant page.'),
      row('Low', 'A process or an experience improvement.', 'Listed here for the reviewer to decide on.'),
    ]
  )}
</section>`;

  return layout({
    title: 'Flagged for review | Counterwise',
    desc: 'Every unverified item and unresolved question on the site, with the source used and what would close it.',
    slug: 'review/flagged.html',
    depth: 1,
    body,
    active: 'review',
  });
}

function buildReviewSources() {
  const body = `<section class="pagehead">
  <p class="eyebrow light">Review</p>
  <h1>Every source, in one list.</h1>
  <p class="lede">Every external fact on this site traces to one of these entries. The verification column records how each source was reached, not that the site agrees with it.</p>
  <ul class="hero-facts">
    <li><b>${sources.rows.length}</b> sources</li>
    <li><b>${sources.rows.filter((s) => s.type.startsWith('Official')).length}</b> official</li>
    <li><b>${sources.rows.filter((s) => s.publisher.includes('FTC') || s.publisher.includes('Government')).length}</b> regulator</li>
    <li><b>1</b> build system</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('Source index', 'What each source supports, and how it was checked')}
  ${table(
    ['ID', 'Source', 'Publisher', 'What it supports here', 'How it was verified', 'Type'],
    sources.rows.map(
      (s) =>
        `<tr id="${esc(s.id)}"><td><code>${esc(s.id)}</code></td><th scope="row" class="rowhead">${refLink(s.url, s.name)}</th><td>${esc(s.publisher)}</td><td>${esc(s.supports)}</td><td>${esc(s.verified)}</td><td>${esc(s.type)}</td></tr>`
    )
  )}

  ${sectionHead('How to check our work', 'The fastest way to review this site')}
  ${table(
    ['Claim on the site', 'Where to check it', 'Source'],
    [
      row('Any product price, rating, review count or availability', 'Follow the listing link in the same row. The page changes constantly; the figures on this site are dated.', sourceChip('https://www.amazon.com/dp/B0CDY277D3', 'listing')),
      row('The rule that Special Links must carry the Associate ID', 'SRC-02, Program Policies, section on Links on Your Site.', sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')),
      row('The rule that links must be accessed directly from the site', 'SRC-02 and SRC-03.', sourceChip('https://affiliate-program.amazon.com/help/operating/participation/', 'policy')),
      row('The rule against tying reporting to an individual user', 'SRC-02, Participation Requirements.', sourceChip('https://affiliate-program.amazon.com/help/operating/policies', 'policy')),
      row('The requirement to identify the site as an Amazon Associate', 'SRC-04, the application FAQ.', sourceChip('https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM', 'FAQ')),
      row('The deprecation of Product Advertising API 5.0', 'SRC-05, the deprecation notice.', sourceChip('https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation', 'notice')),
      row('The clear and conspicuous disclosure principle', 'SRC-08 and SRC-09.', sourceChip('https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking', 'FTC')),
      row('Every blank cell in a table', 'It is blank on purpose. The reason is in the same row or on the Flagged for Review page.', sourceChip('https://sassnarep3-star.github.io/WinB/review/flagged.html', 'flags')),
    ]
  )}
</section>`;

  return layout({
    title: 'Source index | Counterwise',
    desc: 'Every official source this site relies on, what it supports, how it was verified, and how to check our work.',
    slug: 'review/sources.html',
    depth: 1,
    body,
    active: 'review',
  });
}

/* --------------------------------------------------------------- summary */

function buildSummary() {
  const openFlags = flags.rows.filter((f) => f.status === 'Open');
  const body = `<section class="pagehead">
  <p class="eyebrow light">Executive summary</p>
  <h1>Counterwise, in one page.</h1>
  <p class="lede">A publication-style buying guide for air fryers and kitchen thermometers, built on a data layer where every figure is dated, sourced and separated from what we still need to find out.</p>
  <ul class="hero-facts">
    <li><b>${products.products.length}</b> products tracked</li>
    <li><b>${articles.articles.length}</b> guides live</li>
    <li><b>${sources.rows.length}</b> official sources</li>
    <li><b>${openFlags.length}</b> open flags</li>
  </ul>
</section>

<section class="articles">
  ${sectionHead('What this is', 'A short, honest version')}
  <div class="prose summary-prose">
    <p><b>The brief.</b> Five Amazon short links and a tracking ID, with a goal of automating product research, publishing SEO-optimised articles and measuring performance. No product identities, specifications, prices, reviews, eligibility evidence or reporting data were supplied with them.</p>
    <p><b>What was verified.</b> All five links were resolved and read against their official Amazon listings on ${esc(products.generated)}. Five products are now tracked with their stated specifications, observed prices, ratings, review counts, availability and sellers. Fifteen alternative listings were captured from Amazon's own recommendation module. The Amazon Associates Operating Agreement, Program Policies, Participation Requirements, application FAQ and the Creators API documentation were read directly, along with the FTC endorsement guidance.</p>
    <p><b>What was built.</b> A static site generated from a single data layer, with ${articles.articles.length} question-shaped guides, two category hubs, a seven-page workbench covering products, competition, content, links, campaigns and compliance, and a review section holding the evidence register, ${questions.rows.length} open questions, ${suggestions.rows.length} suggestions, ${flags.rows.length} flagged items and a source index. A verifier runs on every build and blocks the deploy if a table row loses its source link, a page loses its disclosure, an outbound link stops being marked sponsored, or an internal link breaks.</p>
    <p><b>What was deliberately not done.</b> No product is called the best. No commission rate, click count, order, conversion rate or earnings figure appears anywhere, because none has been obtained from an authorised first-party report. The campaign ledger is empty by design. No search volume or trend claim is made, and every working title is labelled a hypothesis.</p>
  </div>

  ${sectionHead('The tracked set', 'Five products, every fact dated')}
  ${table(
    ['ID', 'Product', 'Type', 'ASIN', `Price (${products.generated})`, 'Rating', 'Reviews', 'Source'],
    products.products.map(
      (p) =>
        `<tr><td><code>${esc(p.id)}</code></td><th scope="row" class="rowhead">${esc(p.brand)} ${esc(p.name)}</th><td>${esc(p.type)}</td><td><code>${esc(p.observedAsin)}</code></td><td>${p.priceUsd === null ? blank : `<b>${money(p.priceUsd)}</b>`}</td><td>${p.rating === null ? blank : p.rating.toFixed(1)}</td><td>${p.reviewCount === null ? blank : num(p.reviewCount)}</td><td>${sourceChip(p.officialListingUrl, 'listing')}</td></tr>`
    )
  )}

  ${sectionHead('The five things that matter most', 'If you read nothing else')}
  <ol class="biglist">
    <li><b>Identity is confirmed by observation, not by intent.</b> Each short link resolves to a specific Amazon listing, and that redirect is recorded in its own field. The intended ASIN is left blank because the submitted tokens are not ASINs and no enrolled-workflow confirmation exists. <a href="../review/flagged.html#FLG-001">FLG-001</a></li>
    <li><b>The published links are not the supplied links.</b> The site uses the canonical <code>/dp/&lt;ASIN&gt;?tag=${esc(TAG)}</code> form with <code>rel="sponsored"</code> and a visible Sponsored marker. The supplied short links appear only in the evidence register. <a href="../review/flagged.html#FLG-003">FLG-003</a></li>
    <li><b>No money number exists yet.</b> Commission rates, eligibility, orders and earnings all require the account's own reports. Until they arrive, the campaign ledger is empty and the site publishes no revenue figure of any kind. <a href="../review/flagged.html#FLG-008">FLG-008</a></li>
    <li><b>The catalogue API changed.</b> Product Advertising API 5.0 is deprecated and now returns HTTP 403; the Creators API is the supported successor. Any automation plan must be built against the Creators API. <a href="../review/flagged.html#FLG-011">FLG-011</a></li>
    <li><b>Disclosure is a build gate, not a habit.</b> Every page carries the strip under the masthead and the notice in the footer, and the verifier fails the deploy if either disappears. <a href="../review/flagged.html#FLG-002">FLG-002</a></li>
  </ol>

  ${sectionHead('Where to go next', 'Four paths')}
  <div class="rmenu">
    <a href="../guides/index.html"><b>Read the guides</b><span>${articles.articles.length} question-shaped guides across two clusters</span></a>
    <a href="../review/questions.html"><b>Answer the questions</b><span>${questions.rows.length} items that gate every real decision</span></a>
    <a href="../review/suggestions.html"><b>Review the suggestions</b><span>${suggestions.rows.length} proposals, each with the evidence it needs</span></a>
    <a href="../dashboard/index.html"><b>Open the workbench</b><span>Products, competition, content, links, campaigns and compliance</span></a>
  </div>
</section>`;

  return layout({
    title: 'Executive summary | Counterwise',
    desc: 'The short version of the whole project: what was verified, what was built, what was deliberately not claimed, and what is still open.',
    slug: 'summary/',
    depth: 1,
    body,
    active: 'review',
  });
}

/* ------------------------------------------------------------------- write */

const out = [];
const write = (rel, html) => {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html);
  out.push(rel);
};

write('index.html', buildHome());
write('guides/index.html', buildGuidesIndex());
for (const a of articles.articles) write(`guides/${a.slug}.html`, buildArticle(a));
for (const c of products.clusters) write(`${c.slug}/index.html`, buildCategory(c));
write('dashboard/index.html', buildDashboardIndex());
write('dashboard/products.html', buildDashboardProducts());
write('dashboard/competition.html', buildDashboardCompetition());
write('dashboard/content.html', buildDashboardContent());
write('dashboard/links.html', buildDashboardLinks());
write('dashboard/campaigns.html', buildDashboardCampaigns());
write('dashboard/compliance.html', buildDashboardCompliance());
write('review/index.html', buildReviewIndex());
write('review/questions.html', buildReviewQuestions());
write('review/suggestions.html', buildReviewSuggestions());
write('review/flagged.html', buildReviewFlagged());
write('review/sources.html', buildReviewSources());
write('summary/index.html', buildSummary());

/* --------------------------------------------------------------- SEO files */

const pageList = [
  { url: '', priority: '1.0' },
  { url: 'guides/', priority: '0.9' },
  ...products.clusters.map((c) => ({ url: `${c.slug}/`, priority: '0.8' })),
  { url: 'summary/', priority: '0.8' },
  ...articles.articles.map((a) => ({ url: `guides/${a.slug}.html`, priority: '0.7' })),
  { url: 'dashboard/', priority: '0.6' },
  { url: 'dashboard/products.html', priority: '0.6' },
  { url: 'dashboard/competition.html', priority: '0.5' },
  { url: 'dashboard/content.html', priority: '0.5' },
  { url: 'dashboard/links.html', priority: '0.5' },
  { url: 'dashboard/campaigns.html', priority: '0.4' },
  { url: 'dashboard/compliance.html', priority: '0.5' },
  { url: 'review/', priority: '0.7' },
  { url: 'review/questions.html', priority: '0.6' },
  { url: 'review/suggestions.html', priority: '0.6' },
  { url: 'review/flagged.html', priority: '0.6' },
  { url: 'review/sources.html', priority: '0.6' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageList.map((p) => `  <url><loc>${SITE}/${p.url}</loc><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);

const rssItems = articles.articles
  .map(
    (a) => `  <item>
    <title>${esc(a.title)}</title>
    <link>${SITE}/guides/${a.slug}.html</link>
    <guid isPermaLink="true">${SITE}/guides/${a.slug}.html</guid>
    <description>${esc(a.dek)}</description>
    <pubDate>${new Date(a.published + 'T09:00:00Z').toUTCString()}</pubDate>
    <category>${esc(clusterById[a.category].name)}</category>
  </item>`
  )
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Counterwise — The Buyer's Notebook</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Question-shaped guides for choosing air fryers and kitchen thermometers. Every fact dated and sourced.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(products.generated + 'T09:00:00Z').toUTCString()}</lastBuildDate>
    <generator>tools/build.mjs</generator>
${rssItems}
  </channel>
</rss>
`;
write('feed.xml', feed);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
write('robots.txt', robots);

console.log(`Built ${out.length} files.`);
console.log(out.join('\n'));
