// content-shop.mjs — the reader-facing shop: front page, category hubs,
// product pages, comparison table, guides.

import { SITE, PRODUCTS, GUIDES, SOURCES, SUGGESTIONS, EVENTS } from './data.mjs';
import {
  esc, url, page, pageHead, table, badge, amazonLink, srcLink, blank, crumbs,
} from './core.mjs';

const P = (id) => PRODUCTS.find((p) => p.id === id);
const CATS = {
  'air-fryers': {
    name: 'Air fryers',
    kicker: 'Three machines, three honest jobs',
    blurb:
      'A dual-basket drawer, a big single basket, and a French-door oven that happens to air-fry. The useful question is not which one wins — it is which of the three jobs matches your kitchen.',
    intro:
      'Air fryers are sold on one number and bought on another. The number they are sold on is capacity in quarts. The number that decides whether you keep it is where it lives and how you get food in and out of it. All three units below do the same headline thing and are structurally different machines.',
    ids: ['P01', 'P03', 'P02'],
  },
  thermometers: {
    name: 'Thermometers',
    kicker: 'Two ways to know the number',
    blurb:
      'An instant-read that lives in a drawer, and a wireless probe that watches a long cook from across the house. One is a tool; the other is a system.',
    intro:
      'The USDA publishes safe minimum internal temperatures, and every one of them is measured with a thermometer. Which thermometer you need depends on whether you are checking a number or watching one climb. These two units sit on either side of that line.',
    ids: ['P04', 'P05'],
  },
};

// ------------------------------------------------------------------ helpers
const pickCards = (ids, { cls = 'cards c3' } = {}) => `
<div class="${cls}">
${ids.map((id) => {
  const p = P(id);
  return `<a class="card product-card" href="/reviews/${p.slug}.html">
    <div class="art">
      <img src="/assets/img/${p.slug}.svg" alt="" width="640" height="360" loading="lazy">
      <span class="tagline">${esc(p.editorialName)}</span>
    </div>
    <div class="body">
      <span class="num">${esc(p.brand)} · ${esc(p.category === 'air-fryers' ? (p.compare.baskets === 2 ? 'dual basket' : p.compare.baskets === 1 ? 'single basket' : 'oven style') : (p.compare.wireless ? 'wireless probe' : 'instant-read'))}</span>
      <h3>${esc(p.shortName)}</h3>
      <p>${esc(p.bestFor)}</p>
      <div class="foot">
        <span>${esc(p.compare.capacityQt ? p.compare.capacityQt + ' qt stated' : p.compare.probes + (p.compare.probes === 1 ? ' probe' : ' probes'))}</span>
        <span class="read">Read the pick <span class="arw">→</span></span>
      </div>
    </div>
  </a>`;
}).join('\n')}
</div>`;

const guideCards = (list, cls = 'cards c2') => `
<div class="${cls}">
${list.map((g) => `<a class="card" href="/${g.path.replace(/\.html$/, '')}.html">
  <span class="num">${esc(g.kicker)}</span>
  <h3>${esc(g.title)}</h3>
  <p>${esc(g.summary.split('. ')[0].replace(/\.$/, ''))}.</p>
  <div class="foot"><span>${esc(g.readingTime)} read</span><span class="read">Open <span class="arw">→</span></span></div>
</a>`).join('\n')}
</div>`;

// -------------------------------------------------------------- front page
export function frontPage() {
  const top = ['P01', 'P04'];
  const body = `
<section class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <p class="eyebrow">Five products · two categories · no invented tests</p>
        <h1>The kitchen gear worth arguing about.</h1>
        <p class="lede">Three air fryers and two thermometers, compared on the things that survive contact with a real kitchen: where the machine lives, how you get food out of it, and what it costs you in washing up.</p>
        <div class="btn-row">
          <a class="btn" href="/reviews/">See the five picks <span class="arw">→</span></a>
          <a class="btn ghost" href="/guides/">Read the guides</a>
        </div>
      </div>
      <aside class="pick-panel" aria-labelledby="picks-h">
        <div class="ph">
          <h2 id="picks-h">The shortlist</h2>
          <span class="cnt">5 products</span>
        </div>
        ${PRODUCTS.map(
          (p, i) => `<a class="pick" href="/reviews/${p.slug}.html">
          <span class="n">0${i + 1}</span>
          <span><span class="t">${esc(p.shortName)}</span><span class="s">${esc(p.editorialName)}</span></span>
          <span class="go" aria-hidden="true">→</span>
        </a>`
        ).join('')}
      </aside>
    </div>
    <div class="hero-meta">
      <div><b>3</b>air fryers, structurally different</div>
      <div><b>2</b>thermometers, different jobs</div>
      <div><b>0</b>prices printed, ratings borrowed, or test results invented</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Start here</p>
        <h2>What are you actually trying to cook?</h2>
        <p>If the answer involves two things at different temperatures, you want a different machine than if it involves one big thing. These two openings cover most kitchens.</p>
      </div>
    </div>
    <div class="cards c2">
      <a class="card" href="/air-fryers/">
        <span class="num">Category · 3 picks</span>
        <h3>Air fryers</h3>
        <p>Dual basket, single basket, or a countertop oven with a French door. Capacity is the number they print; access and footprint are the numbers that matter.</p>
        <div class="foot"><span>Chefman · Emeril Lagasse</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>
      <a class="card" href="/thermometers/">
        <span class="num">Category · 2 picks</span>
        <h3>Thermometers</h3>
        <p>An instant-read for a number, a wireless probe for a climb. The USDA minimum temperatures are here too, because they are why you own one.</p>
        <div class="foot"><span>ThermoMaven · CHEF iQ</span><span class="read">Open <span class="arw">→</span></span></div>
      </a>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">The five</p>
        <h2>Picked by specification, described without pretending</h2>
        <p>Each page states what the listing claims, what the arithmetic says, and what this desk cannot tell you. Nothing here is a hands-on review, because nothing here has been handled.</p>
      </div>
      <a class="more" href="/compare/">Full comparison table →</a>
    </div>
    ${pickCards(['P01', 'P03', 'P02'])}
    <div class="mt-2">${pickCards(['P04', 'P05'], { cls: 'cards c2' })}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">The notebook</p>
        <h2>Question-shaped guides</h2>
        <p>Written to answer the thing you typed into a search bar, not to rank for a product name.</p>
      </div>
      <a class="more" href="/guides/">All guides →</a>
    </div>
    ${guideCards(GUIDES.slice(0, 4))}
  </div>
</section>

<section class="section ink">
  <div class="wrap">
    <div class="split">
      <div>
        <p class="eyebrow">The honest part</p>
        <h2>Everything on this site is a specification judgement, and it says so.</h2>
        <p>This desk has not used any of these five products. The manufacturer's listing is the source, the arithmetic is shown, and where a number is missing the page says it is missing rather than filling it in.</p>
        <p>That costs us the word “tested”. It buys a page you can check.</p>
        <div class="btn-row mt-3">
          <a class="btn ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" href="/methods/">How we choose →</a>
          <a class="btn ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" href="/flagged/">What is still unverified →</a>
        </div>
      </div>
      <div class="capture" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);box-shadow:none">
        <h3 style="color:#fff;font-size:1.15rem;margin-bottom:.3rem">One guide a fortnight</h3>
        <p style="font-size:.86rem;margin:0 0 .2rem">No list exists yet, and this form will not pretend one does. When a provider is chosen it will say who holds the address before it asks for it.</p>
        <form data-capture="front">
          <input type="email" placeholder="you@example.com" aria-label="Email address" autocomplete="email">
          <button class="btn amber" type="submit">Notify me</button>
          <p class="status" role="status"></p>
        </form>
        <p class="fine">Nothing is transmitted. See <a href="/data-room/#events" style="color:#cfe0d6">the five measured events</a>.</p>
      </div>
    </div>
  </div>
</section>
`;
  return page({
    path: '/',
    title: 'Counterwise — kitchen gear chosen by question, not by hype',
    description:
      'Three air fryers and two thermometers, compared on access, footprint and cleanup rather than on quart counts. Specification-led buying guides with every unverified claim labelled.',
    body,
    active: '/',
  });
}

// ---------------------------------------------------------- category pages
export function categoryPage(slug) {
  const c = CATS[slug];
  const list = c.ids.map(P);
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: c.name }],
  kicker: c.kicker,
  title: c.name,
  lede: c.blurb,
})}
<section class="section">
  <div class="wrap">
    <div class="prose" style="max-width:70ch">
      <p>${esc(c.intro)}</p>
    </div>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap">
    ${pickCards(c.ids, { cls: 'cards c3' })}
  </div>
</section>
<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="eyebrow">Side by side</p><h2>What actually differs</h2></div>
    </div>
    ${slug === 'air-fryers' ? airFryerTable() : thermometerTable()}
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="eyebrow">Read before you choose</p><h2>Guides for this category</h2></div>
      <a class="more" href="/guides/">All guides →</a>
    </div>
    ${guideCards(
      slug === 'air-fryers'
        ? GUIDES.filter((g) => ['basket-or-oven', 'capacity-checklist', 'cleanup-counter'].includes(g.slug))
        : GUIDES.filter((g) => ['temperature-safety', 'multifunction'].includes(g.slug))
    )}
  </div>
</section>`;
  return page({
    path: `/${slug}/`,
    title: `${c.name} — Counterwise`,
    description: c.blurb,
    body,
    active: `/${slug}/`,
  });
}

function airFryerTable() {
  const ids = ['P01', 'P03', 'P02'];
  const row = (label, fn) =>
    `<tr><th scope="row" style="font-weight:600;font-size:.8rem;color:var(--muted)">${esc(label)}</th>${ids
      .map((id) => `<td>${fn(P(id))}</td>`)
      .join('')}</tr>`;
  return table({
    caption:
      '<b>Air fryers, compared on the listing’s own claims.</b> No price column: prices change hourly and cannot be printed here under Amazon’s price rule. Follow the listing link for the current price.',
    head: ['', ...ids.map((id) => `${esc(P(id).shortName)}<br><span class="faint" style="font-weight:400">ASIN ${P(id).asin}</span>`)],
    rows: [
      row('Format', (p) => esc(p.compare.style)),
      row('Stated total capacity', (p) => `${p.compare.capacityQt} qt`),
      row('Baskets', (p) => (p.compare.baskets === 2 ? '2 independent' : p.compare.baskets === 1 ? '1 XL' : 'Oven cavity')),
      row('Viewing window', (p) => (p.compare.window ? 'Yes' : 'Not stated')),
      row('Presets stated', (p) => (p.id === 'P02' ? '24' : 'Not stated in title')),
      row('Counter footprint', () => blank('not stated') ),
      row('Wattage', () => blank('not stated')),
      row('What it is for', (p) => esc(p.bestFor)),
      row('When to skip it', (p) => esc(p.thinkTwiceIf)),
      row('Page', (p) => `<a href="/reviews/${p.slug}.html">Read the pick →</a>`),
      row('Listing', (p) => `<a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon · ${p.asin}</a>`),
    ],
    note:
      'Footprint and wattage are the two numbers most likely to change a decision and the two numbers the listings do not state in the data this desk could read. They are left blank on purpose rather than estimated. Verify them in the product manual before ordering.',
  });
}

function thermometerTable() {
  const ids = ['P04', 'P05'];
  const row = (label, fn) =>
    `<tr><th scope="row" style="font-weight:600;font-size:.8rem;color:var(--muted)">${esc(label)}</th>${ids
      .map((id) => `<td>${fn(P(id))}</td>`)
      .join('')}</tr>`;
  return table({
    caption: '<b>Thermometers.</b> Manufacturer claims are attributed, not adopted. No price column, for the same reason as above.',
    head: ['', ...ids.map((id) => `${esc(P(id).shortName)}<br><span class="faint" style="font-weight:400">ASIN ${P(id).asin}</span>`)],
    rows: [
      row('Form', (p) => (p.compare.wireless ? 'Wireless leave-in probe' : 'Handheld instant-read')),
      row('Probes', (p) => String(p.compare.probes)),
      row('Requires an app', (p) => (p.compare.appRequired ? 'Yes (as a smart device)' : 'No')),
      row('Stated read time', (p) => (p.id === 'P04' ? '1 second (listing claim)' : 'Continuous')),
      row('Stated heat limit', (p) => (p.compare.heatRatingF ? `${p.compare.heatRatingF}°F (listing claim)` : blank('not stated'))),
      row('Stated accuracy', (p) => (p.id === 'P04' ? '±0.5°F (listing claim)' : blank('not stated'))),
      row('Water resistance', (p) => (p.id === 'P04' ? 'IP67 (listing claim)' : blank('not stated'))),
      row('Best for', (p) => esc(p.bestFor)),
      row('Skip it if', (p) => esc(p.thinkTwiceIf)),
      row('Page', (p) => `<a href="/reviews/${p.slug}.html">Read the pick →</a>`),
      row('Listing', (p) => `<a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon · ${p.asin}</a>`),
    ],
    note:
      '“Listing claim” means the manufacturer says so in the listing and this desk has not been able to check it against a certificate or a test report. See FLG-006 on the Flagged for Review page.',
  });
}

// ------------------------------------------------------------ product page
export function productPage(p) {
  const cat = CATS[p.category];
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const specRows = p.specClaims
    .map(
      (s) => `<div>${esc(s.label)}</div><div>${esc(s.value)} <span class="faint tiny">— ${esc(s.basis)}</span></div>`
    )
    .join('\n');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { href: `/${p.category}/`, label: cat.name }, { label: p.shortName }],
  kicker: `${p.brand} · ${p.category === 'air-fryers' ? 'air fryer' : 'thermometer'}`,
  title: p.editorialName,
  lede: p.bestFor,
  meta: `<div class="btn-row" style="margin-top:.4rem">
    ${badge(p.category === 'air-fryers' ? 'Air fryer' : 'Thermometer', 'plain')}
    ${badge('ASIN ' + p.asin, 'plain')}
    ${badge('Specification judgement — not tested', 'amber')}
  </div>`,
})}
<section class="section">
  <div class="wrap">
    <div class="split">
      <div>
        <div class="prose">
          <h2>When to skip it</h2>
          <p>${esc(p.thinkTwiceIf)}</p>
          <p>That is the whole recommendation, honestly stated. Everything below it is the evidence for it — and the things it cannot tell you.</p>

          <h2>What the listing claims</h2>
          <p>Every figure below is the manufacturer’s, taken from the product listing on ${esc(SITE.buildDateHuman)}. None of it is a measurement made by this desk.</p>
        </div>
        <div class="spec-grid mt-2">
          ${specRows}
        </div>
        <p class="tiny faint mt-1">Source: <a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Amazon listing for ASIN ${esc(p.asin)}</a>, read ${esc(p.confirmationDate)}. Category path observed: ${esc(p.directory)}.</p>

        ${p.arithmetic.length ? `<div class="prose mt-4"><h2>The arithmetic, shown</h2>${p.arithmetic
          .map(
            (a) => `<div class="callout green"><h4>${esc(a.statement)}</h4><p class="mono" style="font-size:.85rem;margin:.3rem 0">${esc(a.working)}</p><p class="small muted" style="margin:0">${esc(a.note)}</p></div>`
          )
          .join('')}</div>` : ''}

        <div class="prose mt-4">
          <h2>What this page cannot tell you</h2>
          <p>This is the part most buying pages leave out. It is the part that decides whether you are satisfied in a month.</p>
          <ul>
            ${p.unverifiedClaims.map((c) => `<li>${esc(c)}</li>`).join('\n')}
          </ul>
          <div class="callout red">
            <h4>No hands-on claim is made here</h4>
            <p>This desk has not used this product. FTC guidance is explicit that you cannot describe your experience with a product you have not tried, so this page does not. It compares published specifications and fit. See <a href="/methods/">how we choose</a> and <a href="/flagged/">FLG-004</a>.</p>
          </div>
        </div>

        <div class="prose mt-4">
          <h2>Where it sits among the others</h2>
          <p>${related.map((r) => `<a href="/reviews/${r.slug}.html">${esc(r.shortName)}</a> — ${esc(r.bestFor)}`).join('</p><p>')}</p>
          <p><a href="/compare/">The full comparison table →</a></p>
        </div>
      </div>

      <aside class="stack">
        <div class="buy-box">
          <p class="eyebrow plain" style="margin-bottom:.5rem">Check it on Amazon</p>
          <h3 style="font-size:1.05rem;margin-bottom:.9rem">${esc(p.shortName)}</h3>
          ${amazonLink({
            asin: p.asin,
            productId: p.id,
            pos: 'primary',
            cls: 'btn',
            text: `See current price on Amazon <span class="arw">→</span>`,
          })}
          <p class="price-note">Price and availability are set by Amazon and change. They are not reproduced here — Amazon requires that prices be served by Amazon or come through its API, and this static page has neither. <a href="/methods/#price">Why</a></p>
          <p class="price-note" style="margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--line)">
            Prefer not to use an affiliate link? The ASIN is printed on this page. Search it on Amazon directly — <span class="mono">${esc(p.asin)}</span> — and you will reach the same listing without this site earning anything.
          </p>
        </div>

        <div class="callout">
          <h4>Link provenance</h4>
          <p class="tiny" style="line-height:1.6">
            Supplied link: <code>${esc(p.suppliedLink)}</code><br>
            Resolved to ASIN <code>${esc(p.asin)}</code> on ${esc(p.confirmationDate)}.<br>
            Outbound link above carries the tag <code>${esc(SITE.associateTag)}</code>.<br>
            See <a href="/flagged/#FLG-001">FLG-001</a>.
          </p>
        </div>

        <div class="capture">
          <h4 style="font-family:var(--display);font-size:1.05rem">One guide a fortnight</h4>
          <p class="small muted" style="margin:.2rem 0 0">No list exists yet. This form counts intent and says so.</p>
          <form data-capture="${esc(p.slug)}">
            <input type="email" placeholder="you@example.com" aria-label="Email address" autocomplete="email">
            <button class="btn small" type="submit">Notify me</button>
            <p class="status" role="status"></p>
          </form>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="sec-head"><div><p class="eyebrow">Keep reading</p><h2>The rest of ${esc(cat.name.toLowerCase())}</h2></div></div>
    ${pickCards(related.map((r) => r.id), { cls: related.length > 2 ? 'cards c3' : 'cards c2' })}
  </div>
</section>`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${p.editorialName} — ${p.shortName}`,
    description: p.bestFor,
    url: url(`/reviews/${p.slug}.html`),
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: url('/') },
    publisher: { '@type': 'Organization', name: SITE.name },
    about: {
      '@type': 'Product',
      name: p.listingTitle,
      brand: { '@type': 'Brand', name: p.brand },
    },
    // Deliberately no aggregateRating and no offers: this page has neither a
    // rating it can substantiate nor a price it is permitted to show.
  };

  return page({
    path: `/reviews/${p.slug}.html`,
    title: `${p.editorialName} — ${p.shortName} review notes | Counterwise`,
    description: p.bestFor,
    body,
    bodyAttrs: `data-product="${p.id}" data-asin="${p.asin}" data-category="${p.category}"`,
    active: `/${p.category}/`,
    isProduct: true,
    ogImage: `/assets/img/${p.slug}.svg`,
    schema,
  });
}

// ---------------------------------------------------------- comparison page
export function comparePage() {
  const rows = PRODUCTS.map(
    (p) => `<tr>
      <td><a href="/reviews/${p.slug}.html"><b>${esc(p.shortName)}</b></a><br><span class="faint tiny">${esc(p.brand)}</span></td>
      <td>${esc(p.category === 'air-fryers' ? 'Air fryer' : 'Thermometer')}</td>
      <td>${esc(p.compare.style || (p.compare.wireless ? 'Wireless probe' : 'Instant-read'))}</td>
      <td class="num">${p.compare.capacityQt ? p.compare.capacityQt + ' qt' : p.compare.probes + (p.compare.probes === 1 ? ' probe' : ' probes')}</td>
      <td>${esc(p.bestFor.split('.')[0])}</td>
      <td>${blank('not stated')}</td>
      <td>${blank('not shown')}</td>
      <td class="src"><a href="${p.listingSourceUrl}/?tag=${SITE.associateTag}" rel="sponsored nofollow noopener" target="_blank">Listing</a></td>
    </tr>`
  ).join('\n');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Compare' }],
  kicker: 'All five, one table',
  title: 'The comparison table',
  lede: 'Five products, compared on the fields that are stable enough to print. Two columns are deliberately empty, and the reason is written underneath.',
})}
<section class="section">
  <div class="wrap">
    ${table({
      caption:
        '<b>Five products.</b> Every value is either the manufacturer’s stated claim or a blank. Nothing is estimated.',
      head: ['Product', 'Category', 'Format', 'Capacity / probes', 'Best for', 'Wattage', 'Price', 'Source'],
      rows: [rows],
    })}
    <div class="cards c2 mt-3">
      <div class="callout">
        <h4>Why there is no price column</h4>
        <p>Amazon’s Program Policies permit a site to show prices only when Amazon serves the link carrying that data, or when the data comes from Creators API / PA API under the licence. This is a static page with no API credentials, so a price printed here would be both stale and out of policy. Use the listing link. <a href="/methods/#price">Full explanation</a>.</p>
      </div>
      <div class="callout">
        <h4>Why wattage is blank</h4>
        <p>It is the number that decides whether the machine will trip a circuit alongside a kettle, and none of the five listings states it in the data this desk could read. Rather than guess a range, the cell is empty. Check the manual before ordering. <a href="/flagged/">Flagged for review</a>.</p>
      </div>
    </div>
  </div>
</section>
<section class="section tint">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="eyebrow">The decision underneath</p><h2>Three questions that split these five</h2></div>
    </div>
    <div class="cards c3">
      <div class="card"><span class="num">Question 1</span><h3>Two foods at once?</h3><p>If yes, the dual-basket Chefman is the only unit here built for it. If no, it splits a batch you wanted whole.</p></div>
      <div class="card"><span class="num">Question 2</span><h3>One big thing, often?</h3><p>Then the 8 qt single basket or the 26 qt oven, depending on whether you want a drawer or a door.</p></div>
      <div class="card"><span class="num">Question 3</span><h3>Checking, or watching?</h3><p>Checking a number is an instant-read. Watching one climb is a wireless probe. Both, honestly, is two tools.</p></div>
    </div>
  </div>
</section>`;
  return page({
    path: '/compare/',
    title: 'Compare all five products — Counterwise',
    description:
      'A five-product comparison table with deliberate blanks: no prices, no invented wattages, no star ratings. Every value attributed or left empty.',
    body,
  });
}

// ------------------------------------------------------------------ guides
export function guidePage(g) {
  const related = g.related.map(P);
  const sections = g.sections
    .map((s) => {
      let html = `<h2>${esc(s.h)}</h2>`;
      if (s.p) html += s.p.map((t) => `<p>${esc(t)}</p>`).join('\n');
      if (s.table) {
        html += table({
          head: s.table.head,
          rows: s.table.rows.map(
            (r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row" style="font-weight:600;color:var(--ink-2)">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`
          ),
          note: `Source: ${srcLink(s.table.source)} — read ${esc(SOURCES[s.table.source].checked)}.`,
        });
      }
      return html;
    })
    .join('\n');

  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { href: '/guides/', label: 'Guides' }, { label: g.kicker }],
  kicker: `${g.kicker} · ${g.readingTime} read`,
  title: esc(g.title),
  lede: esc(g.summary),
})}
<section class="section">
  <div class="wrap">
    <div class="split">
      <article class="prose">
        ${sections}
        <hr>
        <p class="small muted">Written by ${esc(SITE.author)} on ${esc(SITE.buildDateHuman)}. This guide contains no hands-on testing and makes no claim to it. Where a product is named, the source is the manufacturer’s listing; see the <a href="/reviews/">pick pages</a> for the full attribution.</p>
      </article>
      <aside class="stack">
        <div class="buy-box">
          <p class="eyebrow plain" style="margin-bottom:.4rem">The units in this guide</p>
          ${related
            .map(
              (p) => `<p style="margin:.55rem 0;font-size:.9rem"><a href="/reviews/${p.slug}.html"><b>${esc(p.shortName)}</b></a><br><span class="tiny muted">${esc(p.editorialName)}</span></p>`
            )
            .join('')}
          <a class="btn small mt-1" href="/compare/" style="width:100%;justify-content:center">Compare all five <span class="arw">→</span></a>
        </div>
        <div class="capture">
          <h4 style="font-family:var(--display);font-size:1rem">Next guide</h4>
          <p class="small muted" style="margin:.2rem 0 0">One a fortnight. No list exists yet.</p>
          <form data-capture="${esc(g.slug)}">
            <input type="email" placeholder="you@example.com" aria-label="Email address" autocomplete="email">
            <button class="btn small" type="submit">Notify me</button>
            <p class="status" role="status"></p>
          </form>
        </div>
      </aside>
    </div>
  </div>
</section>`;

  const schema = {
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
  };

  return page({
    path: `/${g.path}`,
    title: `${g.title} — Counterwise`,
    description: g.summary,
    body,
    isGuide: true,
    schema,
  });
}

export function guidesIndex() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'Guides' }],
  kicker: 'The notebook',
  title: 'Guides',
  lede: 'Five pieces written to answer a question, not to rank for a product name. Two are about choosing a machine; three are about using one safely and sanely.',
})}
<section class="section">
  <div class="wrap">
    ${guideCards(GUIDES, 'cards c2')}
    <div class="callout mt-3">
      <h4>How the cadence works</h4>
      <p>One substantial guide every two weeks, added to the <a href="/sitemap.xml">sitemap</a> and the <a href="/feed.xml">feed</a> automatically by the build. Bursts of near-identical pages are treated by Google as scaled content abuse; a slow, original cadence is both safer and more persuasive. <a href="/decisions/#SUG-06">The decision behind this</a>.</p>
    </div>
  </div>
</section>`;
  return page({
    path: '/guides/',
    title: 'Guides — Counterwise',
    description:
      'Question-shaped kitchen buying guides: air fryer format, capacity, cleanup, multi-function appliances and USDA safe temperatures.',
    body,
    active: '/guides/',
  });
}

export function reviewsIndex() {
  const body = `
${pageHead({
  trail: [{ href: '/', label: 'Home' }, { label: 'The five picks' }],
  kicker: 'The shortlist',
  title: 'Five products, and what each one is for',
  lede: 'Not a ranked list. Three air fryers and two thermometers that solve different problems, each with the same page structure: who it suits, what the listing claims, and what nobody can tell you yet.',
})}
<section class="section">
  <div class="wrap">
    <div class="callout amber" style="border-left-color:var(--amber)">
      <h4>There is no “best” here, and that is deliberate</h4>
      <p>A dual-basket drawer, a big single basket and a French-door oven are not competitors. Naming one the winner would be a ranking of three different jobs. Read the “when to skip it” line on each page — that is the part that decides it.</p>
    </div>
    <div class="mt-3">${pickCards(['P01', 'P03', 'P02'])}</div>
    <div class="mt-2">${pickCards(['P04', 'P05'], { cls: 'cards c2' })}</div>
    <div class="mt-4">
      ${table({
        caption: '<b>At a glance.</b> Every value attributed to the listing or left blank.',
        head: ['Product', 'Category', 'The one-line reason', 'ASIN', 'Page'],
        rows: PRODUCTS.map(
          (p) => `<tr><td><b>${esc(p.shortName)}</b></td><td>${esc(p.category === 'air-fryers' ? 'Air fryer' : 'Thermometer')}</td><td>${esc(p.bestFor.split('.')[0])}</td><td class="mono tiny">${esc(p.asin)}</td><td><a href="/reviews/${p.slug}.html">Open →</a></td></tr>`
        ),
      })}
    </div>
  </div>
</section>`;

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Counterwise shortlist',
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.listingTitle,
      url: url(`/reviews/${p.slug}.html`),
    })),
  };

  return page({
    path: '/reviews/',
    title: 'The five picks — Counterwise',
    description:
      'Five products with a page each: three air fryers and two thermometers, compared on fit and access with all unverified claims labelled.',
    body,
    schema: itemList,
  });
}
