// core.mjs — shell, shared chrome, small HTML helpers.
// The disclosure strip and footer disclosure are emitted by the same two
// functions for every single page. That is what makes the "above the fold on
// every page, repeated in the footer" requirement structural rather than a
// thing someone has to remember.

import { SITE, SOURCES } from './data.mjs';

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const url = (path = '/') => {
  const clean = path.replace(/^\/+/, '');
  return `${SITE.origin}/${clean}`;
};

export const srcLink = (id, label) => {
  const s = SOURCES[id];
  if (!s) throw new Error(`Unknown source id: ${id}`);
  return `<a href="${s.url}" rel="noopener" target="_blank" title="${esc(s.title)}">${esc(label || s.publisher)}</a>`;
};

// Every Amazon outbound link goes through here. Three guarantees:
//   * tagged with the Associate ID (A2, Participation Requirements §2(b))
//   * rel="sponsored nofollow noopener" (G1)
//   * no price, no rating, no count anywhere in the markup
export const amazonLink = ({ asin, tag = SITE.associateTag, productId, pos = 'unknown', cls = 'btn', text }) => {
  if (!asin) throw new Error('amazonLink requires an ASIN');
  const href = `https://www.amazon.com/dp/${asin}/?tag=${tag}`;
  return `<a class="${cls}" href="${href}" rel="sponsored nofollow noopener" target="_blank"
    data-outbound data-product="${esc(productId || '')}" data-asin="${esc(asin)}" data-pos="${esc(pos)}">${text}</a>`;
};

const NAV = [
  { href: '/air-fryers/', label: 'Air fryers' },
  { href: '/thermometers/', label: 'Thermometers' },
  { href: '/guides/', label: 'Guides' },
];

const MORE = [
  { group: 'The shop' },
  { href: '/reviews/', label: 'All five picks' },
  { href: '/compare/', label: 'Comparison table' },
  { group: 'How this works' },
  { href: '/decisions/', label: 'Decision Room' },
  { href: '/data-room/', label: 'Data Room' },
  { href: '/flagged/', label: 'Flagged for Review' },
  { href: '/methods/', label: 'How we choose' },
  { group: 'The project' },
  { href: '/executive-summary/', label: 'Executive summary' },
  { href: '/about/', label: 'About & contact' },
  { href: '/privacy/', label: 'Privacy & measurement' },
];

export function disclosureStrip() {
  return `<div class="disclosure-strip" role="note" aria-label="Affiliate disclosure">
  <div class="wrap">
    <strong>${esc(SITE.associateStatement)}</strong>
    <span class="dot" aria-hidden="true">·</span>
    <span>Links to Amazon on this page are affiliate links and are marked <code style="background:none;border:0;color:#cfe0d6;padding:0">rel="sponsored"</code>.</span>
    <span class="dot" aria-hidden="true">·</span>
    <span>Every pick is research-led and linked to its sources.</span>
    <a href="/methods/">How we choose →</a>
  </div>
</div>`;
}

export function masthead(active = '') {
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}"${active === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');
  let menu = '';
  for (const m of MORE) {
    menu += m.group
      ? `<span class="menu-label">${esc(m.group)}</span>`
      : `<a href="${m.href}">${esc(m.label)}</a>`;
  }
  return `<header class="masthead">
  <div class="wrap">
    <a class="brand" href="/">counterwise<span>.</span><small>kitchen, chosen by question</small></a>
    <nav class="nav" aria-label="Main">
      ${links}
      <details>
        <summary aria-haspopup="true">More</summary>
        <div class="menu">${menu}</div>
      </details>
      <a class="cta" href="/reviews/">The five picks</a>
    </nav>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="/">counterwise<span>.</span></a>
        <p>Air fryers and thermometers matched to how you cook — five picks, two categories, every claim linked to its source.</p>
        <div class="foot-disclosure">
          <strong>${esc(SITE.associateStatement)}</strong><br>
          Every Amazon link on this site is an affiliate link and is marked <code style="background:none;border:0;color:#bdb5a9;padding:0">rel="sponsored"</code>. Prices and availability are set by Amazon and are not shown here — check the listing. <a href="/methods/">How this site works</a>.
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>
          <li><a href="/air-fryers/">Air fryers</a></li>
          <li><a href="/thermometers/">Thermometers</a></li>
          <li><a href="/reviews/">All five picks</a></li>
          <li><a href="/compare/">Comparison table</a></li>
        </ul>
      </div>
      <div>
        <h4>Read</h4>
        <ul>
          <li><a href="/guides/">All guides</a></li>
          <li><a href="/guides/basket-or-oven.html">Basket or oven</a></li>
          <li><a href="/guides/capacity-checklist.html">Capacity checklist</a></li>
          <li><a href="/guides/temperature-safety.html">Safe temperatures</a></li>
          <li><a href="/feed.xml">RSS feed</a></li>
        </ul>
      </div>
      <div>
        <h4>Oversight</h4>
        <ul>
          <li><a href="/decisions/">Decision Room</a></li>
          <li><a href="/data-room/">Data Room</a></li>
          <li><a href="/flagged/">Flagged for Review</a></li>
          <li><a href="/register/">Source register &amp; link audit</a></li>
          <li><a href="/methods/">How we choose</a></li>
          <li><a href="/executive-summary/">Executive summary</a></li>
          <li><a href="/about/">About &amp; contact</a></li>
          <li><a href="/privacy/">Privacy &amp; measurement</a></li>
          <li><a href="#" id="cw-optout">Turn off measurement</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-legal">
      <span>© ${new Date(SITE.buildDate).getUTCFullYear()} ${esc(SITE.name)}. Build ${esc(SITE.buildDate)}. No prices, ratings or sales figures are reproduced on this site.</span>
      <span>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. This site is not endorsed by Amazon.</span>
    </div>
  </div>
</footer>
<div class="cw-toast" id="cw-toast" role="status" aria-live="polite"></div>`;
}

export function page({
  path,
  title,
  description,
  body,
  bodyAttrs = '',
  active = '',
  isGuide = false,
  isProduct = false,
  ogImage,
  noindex = false,
  schema,
}) {
  const canonical = url(path);
  const img = ogImage ? url(ogImage) : url('/assets/img/og-default.jpg');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
<meta property="og:type" content="${isGuide ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${img}">
<meta name="theme-color" content="#1e4034">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)} — new guides" href="${url('/feed.xml')}">
<link rel="stylesheet" href="/assets/css/site.css">
${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}
</head>
<body ${isGuide ? `data-guide="${esc(path)}"` : ''} ${bodyAttrs}>
<a class="skip" href="#main">Skip to content</a>
${disclosureStrip()}
${masthead(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- snippets
export const badge = (text, kind = '') =>
  `<span class="badge ${kind}">${esc(text)}</span>`;

export const crumbs = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<span aria-current="page">${esc(t.label)}</span>`
        : `<a href="${t.href}">${esc(t.label)}</a><span class="sp">/</span>`
    )
    .join('')}</nav>`;

export const pageHead = ({ trail, kicker, title, lede, meta = '' }) => `
<div class="page-head">
  <div class="wrap">
    ${trail ? crumbs(trail) : ''}
    ${kicker ? `<p class="eyebrow">${esc(kicker)}</p>` : ''}
    <h1>${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
    ${meta}
  </div>
</div>`;

export const table = ({ caption, head, rows, note = '' }) => `
<div class="table-wrap">
  <table>
    ${caption ? `<caption>${caption}</caption>` : ''}
    <thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.join('')}</tbody>
  </table>
</div>
${note ? `<p class="tiny faint mt-1">${note}</p>` : ''}`;

export const blank = (what = 'Unverified') =>
  `<span class="unverified" title="No official source confirms this value">— ${esc(what)}</span>`;
