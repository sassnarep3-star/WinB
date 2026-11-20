// editorial.mjs — the reader-facing publication.
//
// Design intent, in one paragraph: this is a buyer's guide you would pick up in
// a shop, not a compliance report you would be handed by a lawyer. Photography
// leads, the recommendation comes before the evidence, and the evidence is
// still there — under the recommendation, in plain sight, with its source. The
// compliance machinery is real but it lives at the bottom of the page and in
// the footer, where it belongs.
//
// Every factual claim on every page:
//   * comes from the manufacturer's own listing, attributed as a claim, or
//   * is arithmetic shown in full, or
//   * is a USDA safe-temperature figure quoted from FSIS, or
//   * is left blank and labelled unverified.
// Nothing is inferred. No price and no rating is printed anywhere: Amazon's
// Program Policies only permit those when Amazon serves them (A2 §2(b)).
//
// Last verified: 2026-11-20 (UTC)

import { SITE, PRODUCTS, GUIDES, SOURCES } from './data.mjs';
import { esc, url, page, table, badge, amazonLink, srcLink, blank, crumbs } from './core.mjs';
import { NEW_GUIDES, WORKSHEETS, CHOOSER, FAQ, NOVEMBER_PICKS } from './tools-content.mjs';

export const ALL_GUIDES = [...GUIDES, ...NEW_GUIDES];

import { LISTING_EVIDENCE, wattageLabel } from './listing-evidence.mjs';

// Evidence-driven cells for the hub and comparison tables. A listing-stated value
// is printed and labelled; a silent listing prints a labelled blank. Nothing is
// estimated. (The pre-S15 build hardcoded these cells as "not stated", which
// reported published specifications as unpublished — the FLG-014 defect class.)
function wattageCell(p) {
  const e = LISTING_EVIDENCE[p.asin] || {};
  const w = wattageLabel(p.asin);
  if (w && e.wattageContradiction) {
    return `${e.wattageContradiction.first.value} W in the bullets, ${e.wattageContradiction.second.value} W in the description — unresolved`;
  }
  return w ? `${esc(w)} <span class="faint tiny">(listing claim)</span>` : blank('not stated');
}
function topTempCell(p) {
  const e = LISTING_EVIDENCE[p.asin] || {};
  const top = (e.hiFryF && e.hiFryF.value) || (e.tempRangeF && e.tempRangeF.max != null ? e.tempRangeF.max : null);
  return top ? `${top}°F <span class="faint tiny">(listing claim)</span>` : blank('not stated');
}
function footprintCell(p) {
  const e = LISTING_EVIDENCE[p.asin] || {};
  return e.dimensions && e.dimensions.value
    ? `${esc(e.dimensions.value)} <span class="faint tiny">(listing spec table)</span>`
    : blank('not stated');
}

// ------------------------------------------------------------------- imagery
// Every photograph is generated for this site and is deliberately
// non-representational: it shows the *category*, lit like an editorial
// still life. No image is a photograph of the specific unit on the listing,
// because presenting one would imply this desk had the product in hand.
export const ART = {
  P01: '/assets/img/p-dual-basket.jpg',
  P02: '/assets/img/p-french-door.jpg',
  P03: '/assets/img/p-single-basket.jpg',
  P04: '/assets/img/p-instant-read.jpg',
  P05: '/assets/img/p-wireless-probe.jpg',
  airFryers: '/assets/img/cat-airfryers-new.jpg',
  thermometers: '/assets/img/cat-thermometers-new.jpg',
  hero: '/assets/img/hero-new.jpg',
  guides: '/assets/img/guides-new.jpg',
};

// Alt text for the two category-hero photographs. Both are generated editorial
// still lifes, not photographs of the reviewed units, and the alt says so.
const CAT_IMG_ALT = {
  'Air fryers': 'Generated editorial photograph of two air-fryer formats side by side — a tall basket unit and a wide French-door countertop oven — representative of the category, not of a specific reviewed listing',
  Thermometers: 'Generated editorial photograph of an instant-read thermometer resting on a cloth beside a prepared dish — representative of the category, not of a specific reviewed listing',
};

const P = (id) => PRODUCTS.find((p) => p.id === id);

export const CATS = {
  'air-fryers': {
    name: 'Air fryers',
    kicker: 'Three machines, three different jobs',
    headline: 'Three air fryers, and the one question that picks between them',
    blurb:
      'A dual-basket drawer, a big single basket, and a French-door oven that happens to air-fry. They are not competitors, and any page that ranks them 1–2–3 is ranking three different jobs.',
    intro:
      'Air fryers are sold on capacity in quarts and chosen on something else entirely: whether you cook two things at once, one big thing, or a tray of flat things. All three units here do the same headline task and are built completely differently to do it.',
    img: ART.airFryers,
    ids: ['P01', 'P03', 'P02'],
  },
  thermometers: {
    name: 'Thermometers',
    kicker: 'Two ways to know the number',
    headline: 'An instant-read, or something that watches while you walk away',
    blurb:
      'One is a tool you keep in a drawer. The other is a small system you leave in the meat. The choice is not about accuracy — it is about whether you are checking a number or watching one climb.',
    intro:
      'The USDA publishes the safe minimum internal temperature for every meat you are likely to cook, and every one of them is measured with a thermometer. Which thermometer you need depends on a single question: are you standing at the oven, or are you doing something else?',
    img: ART.thermometers,
    ids: ['P04', 'P05'],
  },
};

const catOf = (p) => (p.category === 'air-fryers' ? 'Air fryer' : 'Thermometer');
const formatOf = (p) => {
  if (p.category === 'thermometers') return p.compare.wireless ? 'Wireless leave-in probe' : 'Instant-read';
  return p.compare.style || 'Basket';
};

// The probe count is printed only when a listing states it (FLG-021). Never inferred.
const probeWord = (p) =>
  p.compare.probes ? `${p.compare.probes} ${p.compare.probes === 1 ? 'probe' : 'probes'}` : 'probe count not stated';

// Short "what it is" label used on cards. One phrase, no adjectives stacked.
const ROLE = {
  P01: 'Two baskets, two temperatures, one finish time',
  P02: 'One big cavity, a door instead of a drawer',
  P03: 'One deep basket for big single batches',
  P04: 'A number in one second, rinsed under the tap',
  P05: 'Three probes, watched from another room',
};

// ------------------------------------------------------------------- pieces
const productCard = (p, { cls = '' } = {}) => `
<a class="card product-card ${cls}" href="/reviews/${p.slug}.html">
  <div class="art">
    <img src="${ART[p.id]}" alt="${esc(p.shortName)} — editorial illustration of a ${esc(catOf(p).toLowerCase())}" width="1200" height="900" loading="lazy" decoding="async">
    <span class="badge-float">${esc(p.brand)}</span>
  </div>
  <div class="body">
    <span class="eyebrow-sm">${esc(catOf(p))} · ${esc(formatOf(p))}</span>
    <h3>${esc(p.shortName)}</h3>
    <p>${esc(ROLE[p.id] || p.editorialName)}.</p>
    <div class="foot">
      <span>${p.compare.capacityQt ? esc(p.compare.capacityQt + ' qt stated') : esc(probeWord(p))}</span>
      <span class="read">Read the pick <span class="arw">→</span></span>
    </div>
  </div>
</a>`;

const pickCards = (ids, cls = 'cards c3') => `
<div class="${cls}">
${ids.map((id) => productCard(P(id))).join('\n')}
</div>`;

const guideCard = (g) => `
<a class="card" href="/${g.path.replace(/\.html$/, '')}.html">
  <span class="num">${esc(g.kicker)} · ${esc(g.readingTime)} read</span>
  <h3>${esc(g.title)}</h3>
  <p>${esc(g.card || g.summary)}</p>
  <div class="foot"><span>Guide</span><span class="read">Open <span class="arw">→</span></span></div>
</a>`;

const guideCards = (list, cls = 'cards c2') => `
<div class="${cls}">
${list.map(guideCard).join('\n')}
</div>`;

// The subscription call-to-action. There is no mailing list yet and this block
// does not pretend otherwise: RSS is the one channel that actually works today,
// so it is the one that gets the button. FLG-008 tracks the missing provider.
const subscribe = ({ dark = false } = {}) => `
<div class="capture"${dark ? ' style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18)"' : ''}>
  <h4${dark ? ' style="color:#fff"' : ''}>Follow the next guide</h4>
  <p class="small${dark ? '' : ' muted'}" style="margin:.2rem 0 0${dark ? ';color:#bccfc5' : ''}">One substantial guide every two weeks. The feed is live today — no address, no account, nothing to unsubscribe from.</p>
  <div class="btn-row" style="margin-top:.8rem">
    <a class="btn small${dark ? ' amber' : ''}" href="/feed.xml">Subscribe by RSS <span class="arw">→</span></a>
    <a class="btn small ghost"${dark ? ' style="color:#dbe9e2;border-color:rgba(255,255,255,.3)"' : ''} href="/guides/">Browse the archive</a>
  </div>
  <p class="fine${dark ? '' : ''}"${dark ? ' style="color:#9db5aa"' : ''}>An email list is not open yet, and this site will not show a form that collects an address it cannot yet deliver to. <a href="/suggestions/#SUG-07"${dark ? ' style="color:#dbe9e2"' : ''}>That decision is pending</a>.</p>
</div>`;

// ------------------------------------------------- S15 decision tools
// Chooser: three questions, answered in the browser. No network, no cookie,
// no score. The result names a starting point and the page to read first.
const chooserSection = () => `
<section class="section chooser-sec" id="chooser">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">30-second chooser</p>
        <h2>Which one fits your kitchen?</h2>
        <p>Three questions. No account, no tracking, nothing leaves this page. The answer is a starting point — read the pick page before you decide.</p>
      </div>
    </div>
    <div class="chooser" id="cw-chooser">
      ${CHOOSER.questions.map((q, qi) => `
      <fieldset class="chooser-q" data-q="${esc(q.id)}">
        <legend>${qi + 1}. ${esc(q.q)}</legend>
        <div class="chooser-opts">
          ${q.options.map((o) => `<label class="chooser-opt"><input type="radio" name="cw-${esc(q.id)}" value="${esc(o.v)}"> <span>${esc(o.label)}</span></label>`).join('')}
        </div>
      </fieldset>`).join('')}
      <div class="btn-row">
        <button class="btn" type="button" id="cw-chooser-go">Show my starting point <span class="arw">→</span></button>
        <button class="btn ghost" type="button" id="cw-chooser-reset">Start again</button>
      </div>
      <div class="chooser-result" id="cw-chooser-result" hidden></div>
      <p class="tiny faint mt-1">This chooser uses editorial fit (what you cook, where it lives, app tolerance), not price, ratings or sales data — none of which this site publishes. See <a href="/compare/">the comparison table</a> for the underlying claims.</p>
    </div>
  </div>
</section>`;

const novemberSection = () => `
<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">November editorial picks</p>
        <h2>What to cook this month, and the question it asks</h2>
        <p>Timely framing of guides you can use tonight. These are editorial picks for November — not a popularity or demand claim. No such claim is made anywhere on this site.</p>
      </div>
      <a class="more" href="/guides/">All guides →</a>
    </div>
    <div class="cards c2">
      ${NOVEMBER_PICKS.map((t) => `
      <a class="card" href="${esc(t.href)}">
        <span class="num">${esc(t.kicker)}</span>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.note)}</p>
        <div class="foot"><span>Guide</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>`).join('')}
    </div>
  </div>
</section>`;

const faqSection = (cat = 'all') => {
  const list = cat === 'all' ? FAQ : FAQ.filter((f) => f.cat === cat || f.cat === 'all');
  return `
<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Buyer questions</p>
        <h2>Questions buyers ask, answered from the listing</h2>
        <p>Every answer is attributed to the manufacturer listing, to USDA FSIS, or to Amazon policy. Where the listing does not state a value, the answer says so.</p>
      </div>
    </div>
    <div class="faq-list">
      ${list.map((f) => `
      <details class="faq-item">
        <summary><span>${esc(f.q)}</span><span class="faq-chev" aria-hidden="true">+</span></summary>
        <div class="faq-body">
          <p>${esc(f.a)}</p>
          <p class="tiny faint">Source: ${srcLink(f.src)}</p>
        </div>
      </details>`).join('')}
    </div>
  </div>
</section>`;
};

const worksheetsCallout = () => `
<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Printable tools</p>
        <h2>Measure first, buy second</h2>
        <p>Three worksheets you can print or fill on screen. They ask for your measurements, not your email, and nothing you type leaves the browser.</p>
      </div>
      <a class="more" href="/tools/">All worksheets →</a>
    </div>
    <div class="cards c3">
      ${WORKSHEETS.map((w) => `
      <a class="card" href="/${esc(w.path)}">
        <span class="num">Worksheet</span>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.lede)}</p>
        <div class="foot"><span>Print / fill</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>`).join('')}
    </div>
  </div>
</section>`;

// ------------------------------------------------------------- front page
export function frontPage() {
  const body = `
<section class="lead">
  <div class="wrap" style="padding:0">
    <div class="lead-grid">
      <div class="lead-copy">
        <p class="kicker">The Counterwise shortlist · November 2026</p>
        <h1>Five <em>kitchen machines</em> worth the counter space.</h1>
        <p class="standfirst">Three air fryers and two thermometers, chosen because each one does a different job well — not because they beat each other in a list.</p>
        <div class="btn-row">
          <a class="btn" href="/reviews/">See all five picks <span class="arw">→</span></a>
          <a class="btn ghost" href="/guides/basket-or-oven.html">Start with: which air fryer?</a>
        </div>
      </div>
      <figure class="lead-art" style="margin:0">
        <img src="${ART.hero}" alt="A dual-basket air fryer, a French-door countertop oven and an instant-read thermometer on a warm oak kitchen counter" width="1400" height="775" fetchpriority="high" decoding="async">
        <figcaption>Editorial photograph. The units pictured are representative of the category, not the specific listings reviewed.</figcaption>
      </figure>
    </div>
  </div>
</section>

<nav class="ribbon" aria-label="The shortlist">
  <div class="wrap">
    <ol class="ribbon-list">
      ${PRODUCTS.map(
        (p, i) => `<li><a href="/reviews/${p.slug}.html">
          <span class="rk">0${i + 1} · ${esc(p.brand)}</span>
          <span class="rt">${esc(p.shortName)}</span>
          <span class="rs">${esc(p.editorialName)}</span>
          <span class="ra">Read the pick →</span>
        </a></li>`
      ).join('\n')}
    </ol>
  </div>
</nav>

${chooserSection()}

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">The five</p>
        <h2>Picked for a job, not for a ranking</h2>
        <p>Each page opens with the decision, then shows the listing’s own numbers underneath. Where a number does not exist, the page says so instead of inventing one.</p>
      </div>
      <a class="more" href="/compare/">Compare all five →</a>
    </div>
    ${pickCards(['P01', 'P03', 'P02'])}
    <div class="mt-2">${pickCards(['P04', 'P05'], 'cards c2')}</div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="split even">
      <div>
        <p class="kicker">Two categories</p>
        <h2>Start where your kitchen is</h2>
        <p class="muted" style="max-width:44ch">If the answer to “what are you cooking?” is two things at different temperatures, you need a different machine than if it is one big thing. These two hubs cover both.</p>
      </div>
      <div class="stack" style="gap:.9rem">
        <a class="feature" href="/air-fryers/" style="grid-template-columns:.85fr 1.15fr">
          <div class="fx" style="aspect-ratio:4/3"><img src="${ART.airFryers}" alt="Two air fryers on a kitchen counter" width="1400" height="788" loading="lazy" decoding="async"></div>
          <div class="fb" style="padding:1.1rem 1.2rem">
            <h3 style="font-size:1.12rem">Air fryers</h3>
            <p style="font-size:.83rem">Dual basket, single basket, or a countertop oven with a French door.</p>
            <span class="ft">3 picks · compare →</span>
          </div>
        </a>
        <a class="feature" href="/thermometers/" style="grid-template-columns:.85fr 1.15fr">
          <div class="fx" style="aspect-ratio:4/3"><img src="${ART.thermometers}" alt="An instant-read thermometer on a linen cloth" width="1400" height="788" loading="lazy" decoding="async"></div>
          <div class="fb" style="padding:1.1rem 1.2rem">
            <h3 style="font-size:1.12rem">Thermometers</h3>
            <p style="font-size:.83rem">A fast number for the pan, or a probe that watches a long cook.</p>
            <span class="ft">2 picks · compare →</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">The notebook</p>
        <h2>Buying guides that answer a question</h2>
        <p>Written for the thing you actually typed into a search bar — not for a product name.</p>
      </div>
      <a class="more" href="/guides/">All guides →</a>
    </div>
    <div class="split">
      <div>
        ${guideCard(GUIDES[0])}
      </div>
      <div>
        <a class="feature" href="/guides/" style="grid-template-columns:1fr">
          <div class="fx" style="aspect-ratio:16/9"><img src="${ART.guides}" alt="A notebook, a pencil and a thermometer on a kitchen worktop" width="1400" height="788" loading="lazy" decoding="async"></div>
          <div class="fb">
            <p class="kicker plain" style="margin-bottom:.5rem">One a fortnight</p>
            <h3 style="font-size:1.15rem">Eight guides, and a schedule</h3>
            <p style="font-size:.85rem">Capacity, format, cleanup, multi-function appliances, safe temperatures, holiday roasts, game-day wings and leftovers. New guides arrive on a fixed cadence rather than in a burst.</p>
            <span class="ft">Read the archive →</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Before you buy</p>
        <h2>Three questions that settle most of it</h2>
        <p>Answer these honestly and the shortlist usually answers itself.</p>
      </div>
    </div>
    <div class="band">
      <div>
        <div class="bn">01</div>
        <h3>Two foods, or one?</h3>
        <p>Cooking protein and a side to finish together? That is a dual-basket job. One big item? A single deep basket does it better and simpler.</p>
      </div>
      <div>
        <div class="bn">02</div>
        <h3>Drawer, or door?</h3>
        <p>A drawer you lift out and wash in the sink. A French door you slide a tray into, in a machine that stays on the counter. Measure your counter depth first.</p>
      </div>
      <div>
        <div class="bn">03</div>
        <h3>Checking, or watching?</h3>
        <p>Checking a number takes an instant-read. Watching a temperature climb over three hours takes a leave-in probe and an app. Both, honestly, is two tools.</p>
      </div>
    </div>
  </div>
</section>

${novemberSection()}

${worksheetsCallout()}

${faqSection('all')}

<section class="section ink">
  <div class="wrap">
    <div class="split">
      <div>
        <p class="kicker">How this is written</p>
        <h2>We describe what the listing says. We do not pretend we cooked with it.</h2>
        <p>This desk has not used any of these five products. So every page quotes the manufacturer’s stated figures, shows its arithmetic in the open, and lists what it cannot tell you — power draw, real usable volume, how it behaves on a Tuesday night.</p>
        <p>A page that admits the gap is more useful than one that fills it with invented experience. That is the whole editorial position, and it is short enough to check.</p>
        <div class="btn-row mt-2">
          <a class="btn ghost" style="color:#fff;border-color:rgba(255,255,255,.32)" href="/methods/">How we choose <span class="arw">→</span></a>
          <a class="btn ghost" style="color:#fff;border-color:rgba(255,255,255,.32)" href="/flagged/">What we could not verify</a>
        </div>
      </div>
      ${subscribe({ dark: true })}
    </div>
  </div>
</section>`;

  return page({
    path: '/',
    title: 'Counterwise — five kitchen machines worth the counter space',
    description:
      'Three air fryers and two thermometers, each picked for a different job. Specification-led buying guides with photography, comparisons and every unverified claim labelled.',
    body,
    active: '/',
    ogImage: ART.hero,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: url('/'),
      description: SITE.tagline,
      publisher: { '@type': 'Organization', name: SITE.name },
    },
  });
}

// --------------------------------------------------------- category pages
export function categoryPage(slug) {
  const c = CATS[slug];
  return page({
    path: `/${slug}/`,
    title: `${c.name} — three picks, three jobs | Counterwise`,
    description: c.blurb,
    active: `/${slug}/`,
    ogImage: c.img,
    body: `
<section class="cat-hero">
  <img class="cat-img" src="${c.img}" alt="${esc(CAT_IMG_ALT[c.name] || `${c.name} — editorial photograph, representative of the category`)}" width="1400" height="788" fetchpriority="high" decoding="async">
  <div class="wrap">
    <div class="inner">
      ${crumbs([{ href: '/', label: 'Home' }, { label: c.name }])}
      <p class="kicker">${esc(c.kicker)}</p>
      <h1>${esc(c.headline)}</h1>
      <p class="lede">${esc(c.blurb)}</p>
      <p class="intro" style="margin:0">${esc(c.intro)}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">The picks</p>
        <h2>What each one is actually for</h2>
      </div>
      <a class="more" href="/compare/">Comparison table →</a>
    </div>
    ${pickCards(c.ids, c.ids.length > 2 ? 'cards c3' : 'cards c2')}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Side by side</p>
        <h2>What actually differs</h2>
        <p>Every value is the manufacturer’s stated claim, or a deliberate blank.</p>
      </div>
    </div>
    <div class="compare-scroll">${slug === 'air-fryers' ? airFryerTable() : thermometerTable()}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="kicker">Read before you choose</p>
        <h2>Guides for this category</h2>
      </div>
      <a class="more" href="/guides/">All guides →</a>
    </div>
    ${guideCards(
      slug === 'air-fryers'
        ? ALL_GUIDES.filter((g) => ['basket-or-oven', 'capacity-checklist', 'cleanup-counter', 'game-day-wings', 'air-fryer-leftovers'].includes(g.slug))
        : ALL_GUIDES.filter((g) => ['temperature-safety', 'multifunction', 'ice-test-thermometer', 'holiday-roast-thermometer', 'air-fryer-leftovers'].includes(g.slug))
    )}
  </div>
</section>

${faqSection(slug)}

${worksheetsCallout()}`,
  });
}

function airFryerTable() {
  const ids = ['P01', 'P03', 'P02'];
  const row = (label, fn) =>
    `<tr><th scope="row" style="font-weight:600;font-size:.8rem;color:var(--muted);white-space:nowrap">${esc(label)}</th>${ids
      .map((id) => `<td>${fn(P(id))}</td>`)
      .join('')}</tr>`;
  return table({
    caption:
      '<b>Air fryers, on the listings’ own claims.</b> No price column: Amazon permits price display only when Amazon serves it itself (Program Policies §2(b)), and this static page does not. Follow the listing for today’s price.',
    head: ['', ...ids.map((id) => `<b>${esc(P(id).shortName)}</b><br><span class="faint" style="font-weight:400">ASIN ${esc(P(id).asin)}</span>`)],
    rows: [
      row('Format', (p) => esc(formatOf(p))),
      row('Stated capacity', (p) => `${p.compare.capacityQt} qt`),
      row('Baskets', (p) => (p.compare.baskets === 2 ? '2 independent, 3 qt each' : p.compare.baskets === 1 ? '1 XL basket' : 'One oven cavity')),
      row('Viewing window', (p) => (p.compare.window ? 'Stated' : blank('not stated'))),
      row('Presets stated', (p) => (p.id === 'P02' ? '24 one-touch' : blank('not stated'))),
      row('Stated top temperature', (p) => topTempCell(p)),
      row('Counter footprint', (p) => footprintCell(p)),
      row('Wattage', (p) => wattageCell(p)),
      row('Best for', (p) => esc(p.bestFor)),
      row('Skip it if', (p) => esc(p.thinkTwiceIf)),
      row('Full page', (p) => `<a href="/reviews/${p.slug}.html">Read the pick →</a>`),
      row('Listing', (p) => `<a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon · ${esc(p.asin)}</a>`),
    ],
    note:
      'Top temperature, footprint and wattage quote the listing wherever the listing states a value; where it states two different wattages (Chefman 8 qt), both are shown rather than averaged. Cells marked “not stated” are listings that are genuinely silent — blank on purpose, never estimated. Check the product manual before ordering.',
  });
}

function thermometerTable() {
  const ids = ['P04', 'P05'];
  const row = (label, fn) =>
    `<tr><th scope="row" style="font-weight:600;font-size:.8rem;color:var(--muted);white-space:nowrap">${esc(label)}</th>${ids
      .map((id) => `<td>${fn(P(id))}</td>`)
      .join('')}</tr>`;
  return table({
    caption: '<b>Thermometers.</b> Manufacturer claims are attributed, never adopted as this site’s own measurement.',
    head: ['', ...ids.map((id) => `<b>${esc(P(id).shortName)}</b><br><span class="faint" style="font-weight:400">ASIN ${esc(P(id).asin)}</span>`)],
    rows: [
      row('Form', (p) => esc(formatOf(p))),
      row('Probes', (p) => (p.compare.probes ? String(p.compare.probes) : blank('not stated'))),
      row('Needs an app', (p) => (p.compare.appRequired === null ? blank('not stated') : p.compare.appRequired ? 'Yes' : 'No')),
      row('Stated read time', (p) => (p.id === 'P04' ? '1 second (listing claim)' : 'Continuous')),
      row('Stated heat limit', (p) => (p.compare.heatRatingF ? `${p.compare.heatRatingF}°F (listing claim)` : blank('not stated'))),
      row('Stated accuracy', (p) => (p.id === 'P04' ? '±0.5°F (listing claim)' : blank('not stated'))),
      row('Water resistance', (p) => (p.id === 'P04' ? 'IP67 (listing claim)' : blank('not stated'))),
      row('Best for', (p) => esc(p.bestFor)),
      row('Skip it if', (p) => esc(p.thinkTwiceIf)),
      row('Full page', (p) => `<a href="/reviews/${p.slug}.html">Read the pick →</a>`),
      row('Listing', (p) => `<a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon · ${esc(p.asin)}</a>`),
    ],
    note:
      '“Listing claim” means the manufacturer states it in the product title and this desk has not checked it against a certificate or a test report. See FLG-006.',
  });
}

// ----------------------------------------------------------- product page
export function productPage(p) {
  const cat = CATS[p.category];
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const specRows = p.specClaims
    .map(
      (s) => `<div>${esc(s.label)}</div><div>${esc(s.value)} <span class="faint tiny">— ${esc(s.basis)}</span></div>`
    )
    .join('\n');

  const body = `
<section class="page-head" style="background:var(--paper)">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { href: `/${p.category}/`, label: cat.name }, { label: p.shortName }])}
  </div>
</section>

<section>
  <div class="wrap">
    <div class="product-hero">
      <div class="art">
        <img src="${ART[p.id]}" alt="Editorial illustration of a ${esc(formatOf(p).toLowerCase())}" width="1200" height="900" fetchpriority="high" decoding="async">
      </div>
      <div>
        <p class="brandline">${esc(p.brand)} · ${esc(catOf(p))}</p>
        <h1>${esc(p.editorialName)}</h1>
        <p class="one-liner">${esc(ROLE[p.id] || p.editorialName)}.</p>
        <div class="verdict">
          <div class="yes"><span class="vk">Buy it if</span><span class="vv">${esc(p.bestFor)}</span></div>
          <div class="no"><span class="vk">Skip it if</span><span class="vv">${esc(p.thinkTwiceIf)}</span></div>
          <div><span class="vk">Also consider</span><span class="vv">${related
            .map((r) => `<a href="/reviews/${r.slug}.html">${esc(r.shortName)}</a>`)
            .join(' · ')}</span></div>
        </div>
        <div class="btn-row" style="margin-top:1.1rem">
          ${amazonLink({
            asin: p.asin,
            productId: p.id,
            pos: 'primary',
            cls: 'btn',
            text: 'Check price and availability on Amazon <span class="arw">→</span>',
          })}
          <a class="btn ghost" href="/compare/">Compare with the others</a>
        </div>
        <p class="tiny faint" style="margin:.75rem 0 0">Affiliate link — this site earns from qualifying purchases. Price and availability are set by Amazon and are not reproduced here. ASIN <span class="mono">${esc(p.asin)}</span>.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div>
        <div class="prose">
          <h2>What the listing claims</h2>
          <p>Every figure below is the manufacturer’s own, taken from the product listing on ${esc(SITE.buildDateHuman)}. None of it is a measurement made by this desk, and it is labelled as a claim rather than presented as a fact.</p>
        </div>
        <div class="spec-grid mt-2">${specRows}</div>
        <p class="tiny faint mt-1">Source: <a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon listing, ASIN ${esc(p.asin)}</a>, read ${esc(p.confirmationDate)}. Category path observed: ${esc(p.directory)}.</p>

        ${
          p.arithmetic.length
            ? `<div class="prose mt-4">
          <h2>Where a number needed checking</h2>
          ${p.arithmetic
            .map(
              (a) => `<div class="callout green"><h4>${esc(a.statement)}</h4><p class="mono" style="font-size:.85rem;margin:.3rem 0">${esc(a.working)}</p><p style="margin:0;font-size:.83rem">${esc(a.note)}</p></div>`
            )
            .join('')}
        </div>`
            : ''
        }

        <div class="prose mt-4">
          <h2>What this page cannot tell you</h2>
          <p>This is the part that decides whether you are still happy with it in a month, and it is the part most buying pages quietly leave out.</p>
          <ul>${p.unverifiedClaims.map((c) => `<li>${esc(c)}</li>`).join('\n')}</ul>
          <div class="callout red">
            <h4>Why there is no “we tried it” here</h4>
            <p>This desk has not used this product. FTC guidance on endorsements is explicit that you cannot describe your experience with something you have not tried, so this page does not. What it does instead is compare published specifications and fit, and name what is missing. <a href="/methods/">How we choose</a> · <a href="/flagged/">what is still unverified</a>.</p>
          </div>
        </div>

        <div class="prose mt-4">
          <h2>Where it sits among the others</h2>
          <p>${related.map((r) => `<a href="/reviews/${r.slug}.html"><b>${esc(r.shortName)}</b></a> — ${esc(ROLE[r.id] || r.editorialName)}.`).join('</p><p>')}</p>
          <p style="margin-top:1rem"><a href="/compare/">The full comparison table →</a></p>
        </div>
      </div>

      <aside class="stack">
        <div class="buy-box">
          <p class="kicker plain" style="margin-bottom:.5rem;font-size:.64rem">Check it on Amazon</p>
          <h3>${esc(p.shortName)}</h3>
          <p class="small muted" style="margin:.2rem 0 .9rem">${esc(p.brand)} · ASIN <span class="mono">${esc(p.asin)}</span></p>
          ${amazonLink({
            asin: p.asin,
            productId: p.id,
            pos: 'sidebar',
            cls: 'btn wide',
            text: 'See current price <span class="arw">→</span>',
          })}
          <p class="price-note">Price and availability are set by Amazon and change constantly. They are not reproduced here: Amazon’s Program Policies require prices to be served by Amazon or to come through its API, and this static page has neither. <a href="/methods/#price">Why</a></p>
          <p class="price-note"><b>Prefer not to use an affiliate link?</b> Search the ASIN printed above on Amazon directly — the tag is only how this site earns, not how you reach the product.</p>
          <p class="asin-line">Supplied link <code>${esc(p.suppliedLink)}</code><br>Resolved ${esc(p.confirmationDate)} → ASIN ${esc(p.asin)} · <a href="/flagged/#FLG-001">FLG-001</a></p>
        </div>
        ${subscribe()}
      </aside>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Keep reading</p><h2>The rest of ${esc(cat.name.toLowerCase())}</h2></div><a class="more" href="/${p.category}/">All ${esc(cat.name.toLowerCase())} →</a></div>
    ${pickCards(related.map((r) => r.id), related.length > 2 ? 'cards c3' : 'cards c2')}
  </div>
</section>`;

  return page({
    path: `/reviews/${p.slug}.html`,
    title: `${p.editorialName} — ${p.shortName} buying notes | Counterwise`,
    description: `${p.shortName}: what the listing claims, what the arithmetic shows, and what this desk cannot verify. ${p.bestFor}`.slice(0, 300),
    body,
    bodyAttrs: `data-product="${p.id}" data-asin="${p.asin}" data-category="${p.category}"`,
    active: `/${p.category}/`,
    isProduct: true,
    ogImage: ART[p.id],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${p.editorialName} — ${p.shortName}`,
      description: p.bestFor,
      url: url(`/reviews/${p.slug}.html`),
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: url('/') },
      publisher: { '@type': 'Organization', name: SITE.name },
      about: { '@type': 'Product', name: p.listingTitle, brand: { '@type': 'Brand', name: p.brand }, sku: p.asin },
      // Deliberately no aggregateRating and no offers: this page has neither a
      // rating it can substantiate nor a price it is permitted to display.
    },
  });
}

// ------------------------------------------------------- comparison page
export function comparePage() {
  const rows = PRODUCTS.map(
    (p) => `<tr>
      <td><a href="/reviews/${p.slug}.html"><b>${esc(p.shortName)}</b></a><br><span class="faint tiny">${esc(p.brand)}</span></td>
      <td>${esc(catOf(p))}</td>
      <td>${esc(formatOf(p))}</td>
      <td class="num">${p.compare.capacityQt ? esc(p.compare.capacityQt + ' qt') : esc(probeWord(p))}</td>
      <td>${esc(ROLE[p.id] || p.editorialName)}</td>
      <td>${wattageCell(p)}</td>
      <td>${blank('by policy')}</td>
      <td class="src"><a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Listing</a></td>
    </tr>`
  ).join('\n');

  const body = `
<section class="page-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { label: 'Compare' }])}
    <p class="kicker">All five, one table</p>
    <h1>The comparison table</h1>
    <p class="lede">Five products on the fields that are stable enough to print. One column is empty by policy, and individual cells stay empty wherever a listing is silent — every empty cell is labelled, and the reasons are written directly underneath.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="compare-scroll">
      ${table({
        caption: '<b>Five products.</b> Every value is either the manufacturer’s stated claim or a blank. Nothing is estimated and nothing is averaged.',
        head: ['Product', 'Category', 'Format', 'Capacity / probes', 'What it is for', 'Wattage', 'Price', 'Source'],
        rows: [rows],
      })}
    </div>
    <div class="cards c2 mt-3">
      <div class="callout">
        <h4>Why there is no price column</h4>
        <p>Amazon’s Program Policies permit a site to show prices only when Amazon serves the link carrying that data, or when the data comes from the Creators API under the licence. This is a static page with no API credentials, so a price printed here would be both stale and out of policy. Use the listing. <a href="/methods/#price">Full explanation</a>.</p>
      </div>
      <div class="callout">
        <h4>How the wattage column is filled</h4>
        <p>It is the number that decides whether the machine trips a circuit alongside a kettle, so it is printed only where the listing itself states one — here, for all three air fryers. The two thermometers are battery-powered and their listings state no wattage, so those cells stay empty. Where one listing states two different figures (Chefman 8 qt: 1000 W in its specification bullets, 1700 W in its description), both are shown rather than averaged. <a href="/flagged/">Flagged for review</a>.</p>
      </div>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker">The decision underneath</p><h2>Three questions that split these five</h2></div>
    </div>
    <div class="cards c3">
      <div class="card"><span class="num">Question 1</span><h3>Two foods at once?</h3><p>If yes, the dual-basket Chefman is the only unit here built for it. If no, its two baskets just split a batch you wanted whole.</p></div>
      <div class="card"><span class="num">Question 2</span><h3>One big thing, often?</h3><p>Then the 8 qt single basket or the 26 qt oven — depending on whether you would rather lift a drawer or open a door.</p></div>
      <div class="card"><span class="num">Question 3</span><h3>Checking, or watching?</h3><p>Checking a number is an instant-read. Watching one climb is a wireless probe. Wanting both, honestly, is owning two tools.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split even">
      <div>${subscribe()}</div>
      <div>
        <p class="kicker">The five</p>
        <h2 style="font-size:1.5rem">Read the full page for any of them</h2>
        <div class="cards c2 mt-2" style="gap:.6rem">
          ${PRODUCTS.map((p) => `<a class="card" href="/reviews/${p.slug}.html" style="padding:.85rem .95rem"><span class="num" style="margin-bottom:.2rem">${esc(p.brand)}</span><h3 style="font-size:.98rem;margin-bottom:.15rem">${esc(p.shortName)}</h3><span class="tiny muted">Read the pick →</span></a>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;

  return page({
    path: '/compare/',
    title: 'Compare all five — air fryers and thermometers | Counterwise',
    description:
      'A five-product comparison with deliberate blanks: no prices, no invented wattages, no borrowed star ratings. Every value attributed to the listing or left empty.',
    body,
    ogImage: ART.airFryers,
  });
}

// ---------------------------------------------------------------- guides
export function guidePage(g) {
  const related = g.related.map(P);
  const sections = g.sections
    .map((s) => {
      let html = `<h2>${esc(s.h)}</h2>`;
      if (s.p) html += s.p.map((t) => `<p>${esc(t)}</p>`).join('\n');
      if (s.table) {
        html += `<div class="compare-scroll">${table({
          head: s.table.head,
          rows: s.table.rows.map(
            (r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row" style="font-weight:600;color:var(--ink-2)">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`
          ),
          note: `Source: ${srcLink(s.table.source)} — read ${esc(SOURCES[s.table.source].checked)}.`,
        })}</div>`;
      }
      return html;
    })
    .join('\n');

  const body = `
<section class="article-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { href: '/guides/', label: 'Guides' }, { label: g.kicker }])}
    <p class="kicker">${esc(g.kicker)}</p>
    <h1>${esc(g.title)}</h1>
    <p class="lede">${esc(g.summary)}</p>
    <div class="byline">
      <span class="who">${esc(SITE.author)}</span>
      <span class="sep">·</span>
      <span>${esc(SITE.buildDateHuman)}</span>
      <span class="sep">·</span>
      <span>${esc(g.readingTime)} read</span>
      <span class="sep">·</span>
      <span>Specification-led, not hands-on</span>
    </div>
  </div>
</section>

<section class="section" style="padding-top:1.8rem">
  <div class="wrap">
    <div class="split">
      <article class="prose">
        ${sections}
        <hr>
        <p class="small muted">Written by ${esc(SITE.author)} on ${esc(SITE.buildDateHuman)}. This guide contains no hands-on testing and claims none. Where a product is named, the source is the manufacturer’s listing — see the <a href="/reviews/">pick pages</a> for the full attribution and the blanks.</p>
      </article>
      <aside class="stack">
        <div class="buy-box">
          <p class="kicker plain" style="margin-bottom:.6rem;font-size:.64rem">The units in this guide</p>
          ${related
            .map(
              (p) => `<a href="/reviews/${p.slug}.html" style="display:flex;gap:.7rem;align-items:center;text-decoration:none;color:inherit;padding:.5rem 0;border-bottom:1px solid var(--line)">
              <img src="${ART[p.id]}" alt="" width="120" height="90" loading="lazy" style="width:56px;height:44px;object-fit:cover;border-radius:5px;flex-shrink:0">
              <span><b style="font-size:.86rem;display:block;line-height:1.25">${esc(p.shortName)}</b><span class="tiny muted">${esc(p.editorialName)}</span></span>
            </a>`
            )
            .join('')}
          <a class="btn small wide" href="/compare/" style="margin-top:.9rem">Compare all five <span class="arw">→</span></a>
        </div>
        ${subscribe()}
      </aside>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Keep reading</p><h2>More guides</h2></div><a class="more" href="/guides/">All guides →</a></div>
    ${guideCards(ALL_GUIDES.filter((x) => x.slug !== g.slug).slice(0, 2))}
  </div>
</section>`;

  return page({
    path: `/${g.path}`,
    title: `${g.title} — Counterwise`,
    description: g.summary,
    body,
    isGuide: true,
    ogImage: ART.guides,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.title,
      description: g.summary,
      datePublished: g.published,
      dateModified: g.published,
      author: { '@type': 'Organization', name: SITE.author },
      publisher: { '@type': 'Organization', name: SITE.name },
      mainEntityOfPage: url(`/${g.path}`),
      isAccessibleForFree: true,
    },
  });
}

export function guidesIndex() {
  return page({
    path: '/guides/',
    title: 'Buying guides — air fryers, capacity, cleanup and safe temperatures',
    description:
      'Eight question-shaped kitchen guides: air fryer format, capacity, cleanup and counter space, multi-function appliances, USDA safe internal temperatures, holiday roasts, game-day wings and leftovers.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { label: 'Guides' }])}
    <p class="kicker">The notebook</p>
    <h1>Guides, in the order you will need them</h1>
    <p class="lede">Eight pieces written to answer a question rather than to rank for a product name. Five are about choosing a machine; three are about using one safely.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${guideCards(ALL_GUIDES, 'cards c2')}
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="split even">
      <div>
        <p class="kicker">Cadence</p>
        <h2 style="font-size:1.5rem">One substantial guide a fortnight</h2>
        <p class="muted">Every guide is added to the <a href="/sitemap.xml">sitemap</a> and the <a href="/feed.xml">RSS feed</a> by the build, so nothing ships unlisted. Bursts of near-identical pages are what Google’s spam policies call scaled content abuse; a slow, original cadence is both safer and more persuasive.</p>
        <p class="muted">The next three topics are chosen in the <a href="/suggestions/">suggestions room</a>, where each candidate carries its evidence and its cost before anything is written.</p>
      </div>
      ${subscribe()}
    </div>
  </div>
</section>`,
    active: '/guides/',
    ogImage: ART.guides,
  });
}

export function reviewsIndex() {
  return page({
    path: '/reviews/',
    title: 'The five picks — three air fryers, two thermometers | Counterwise',
    description:
      'Five products with a page each: three air fryers and two thermometers, compared on fit and access, with every unverified claim labelled and no borrowed ratings.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { label: 'The five picks' }])}
    <p class="kicker">The shortlist</p>
    <h1>Five products, and what each one is for</h1>
    <p class="lede">Not a ranked list. Three air fryers and two thermometers that solve different problems, each with the same page structure: who it suits, what the listing claims, and what nobody can tell you yet.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="callout amber" style="margin-bottom:1.9rem">
      <h4>There is no “best” here, and that is deliberate</h4>
      <p>A dual-basket drawer, a big single basket and a French-door oven are not competitors. Naming one the winner would be a ranking of three different jobs. Read the “skip it if” line on each page — that is the part that decides it.</p>
    </div>
    ${pickCards(['P01', 'P03', 'P02'])}
    <div class="mt-2">${pickCards(['P04', 'P05'], 'cards c2')}</div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">At a glance</p><h2>One line each</h2></div><a class="more" href="/compare/">Full comparison →</a></div>
    <div class="compare-scroll">
    ${table({
      head: ['Product', 'Category', 'The one-line reason', 'ASIN', 'Page'],
      rows: PRODUCTS.map(
        (p) => `<tr><td><b>${esc(p.shortName)}</b></td><td>${esc(catOf(p))}</td><td>${esc(ROLE[p.id] || p.editorialName)}</td><td class="num">${esc(p.asin)}</td><td><a href="/reviews/${p.slug}.html">Open →</a></td></tr>`
      ),
    })}
    </div>
  </div>
</section>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Counterwise shortlist',
      itemListElement: PRODUCTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.listingTitle,
        url: url(`/reviews/${p.slug}.html`),
      })),
    },
  });
}

// ------------------------------------------------------- S15 worksheets
export function toolsIndex() {
  return page({
    path: '/tools/',
    title: 'Printable worksheets — measure first, buy second | Counterwise',
    description:
      'Three printable decision worksheets: air fryer capacity, cleanup and counter space, and thermometer calibration. Your measurements, your browser, nothing sent anywhere.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { label: 'Worksheets' }])}
    <p class="kicker">Printable tools</p>
    <h1>Measure first, buy second</h1>
    <p class="lede">Three worksheets that turn a listing claim into a decision you can check in your own kitchen. Print them, fill them on screen, or just read the steps. Nothing you type leaves the browser.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="cards c3">
      ${WORKSHEETS.map((w) => `
      <a class="card" href="/${esc(w.path)}">
        <span class="num">Worksheet</span>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.lede)}</p>
        <div class="foot"><span>Print / fill</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>`).join('')}
    </div>
    <div class="callout mt-3">
      <h4>Why worksheets, not scores</h4>
      <p>This site publishes no conversion score, no revenue forecast and no "best" ranking. A worksheet gives you the measurements to make the call yourself, which is both more honest and more useful than a number invented by the desk. See <a href="/data-room/">the Data Room</a> for the empty campaign ledger and its schema.</p>
    </div>
  </div>
</section>`,
    active: '/tools/',
    ogImage: ART.guides,
  });
}

export function worksheetPage(w) {
  const related = w.related.map(P);
  return page({
    path: `/${w.path}`,
    title: `${w.title} — Counterwise`,
    description: w.lede,
    body: `
<section class="article-head">
  <div class="wrap">
    ${crumbs([{ href: '/', label: 'Home' }, { href: '/tools/', label: 'Worksheets' }, { label: w.title }])}
    <p class="kicker">Worksheet · printable</p>
    <h1>${esc(w.title)}</h1>
    <p class="lede">${esc(w.lede)}</p>
    <div class="byline">
      <span class="who">${esc(SITE.author)}</span>
      <span class="sep">·</span>
      <span>${esc(SITE.buildDateHuman)}</span>
      <span class="sep">·</span>
      <span>Specification-led, not hands-on</span>
    </div>
  </div>
</section>

<section class="section" style="padding-top:1.8rem">
  <div class="wrap">
    <div class="split">
      <article class="prose worksheet">
        ${w.steps.map((s) => `<h2>${esc(s.n)}. ${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join('')}
        <hr>
        <h2>Your measurements</h2>
        <p>Fill these in on screen or print the page and write them down. They are stored only in this browser tab and are never sent anywhere.</p>
        <form class="worksheet-form" id="cw-worksheet" onsubmit="return false">
          ${w.fields.map((f, i) => `<label class="worksheet-field"><span>${esc(f)}</span><input type="text" name="f${i}" autocomplete="off"></label>`).join('')}
          <div class="btn-row mt-2">
            <button class="btn small" type="button" id="cw-print">Print this worksheet <span class="arw">→</span></button>
            <button class="btn small ghost" type="button" id="cw-clear">Clear fields</button>
          </div>
          <p class="tiny faint mt-1">No account, no email, no upload. Closing the tab discards everything.</p>
        </form>
      </article>
      <aside class="stack">
        <div class="buy-box">
          <p class="kicker plain" style="margin-bottom:.6rem;font-size:.64rem">The units this helps you choose</p>
          ${related.map((p) => `<a href="/reviews/${p.slug}.html" style="display:flex;gap:.7rem;align-items:center;text-decoration:none;color:inherit;padding:.5rem 0;border-bottom:1px solid var(--line)">
            <img src="${ART[p.id]}" alt="" width="120" height="90" loading="lazy" style="width:56px;height:44px;object-fit:cover;border-radius:5px;flex-shrink:0">
            <span><b style="font-size:.86rem;display:block;line-height:1.25">${esc(p.shortName)}</b><span class="tiny muted">${esc(p.editorialName)}</span></span>
          </a>`).join('')}
          <a class="btn small wide" href="/compare/" style="margin-top:.9rem">Compare all five <span class="arw">→</span></a>
        </div>
        ${subscribe()}
      </aside>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="kicker">Keep reading</p><h2>More worksheets and guides</h2></div><a class="more" href="/tools/">All worksheets →</a></div>
    <div class="cards c2">
      ${WORKSHEETS.filter((x) => x.slug !== w.slug).map((x) => `
      <a class="card" href="/${esc(x.path)}">
        <span class="num">Worksheet</span>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.lede)}</p>
        <div class="foot"><span>Print / fill</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>`).join('')}
    </div>
  </div>
</section>`,
    isGuide: true,
    ogImage: ART.guides,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: w.title,
      description: w.lede,
      datePublished: SITE.buildDate,
      author: { '@type': 'Organization', name: SITE.author },
      publisher: { '@type': 'Organization', name: SITE.name },
      mainEntityOfPage: url(`/${w.path}`),
      isAccessibleForFree: true,
    },
  });
}
