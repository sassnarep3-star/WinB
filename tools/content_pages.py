# content_pages.py — reader-facing pages: front page, shop pages, compare, guides index, about.
from content_data import SITE, PRODUCTS, SUBMISSIONS, OBSERVATIONS
from theme import BASE

BUILT = SITE["built"]


def sub(product_id):
    return next(s for s in SUBMISSIONS if s["product"] == product_id)


def obs(product_id):
    return next(o for o in OBSERVATIONS if o["product"] == product_id)


def prod(product_id):
    return next(p for p in PRODUCTS if p["id"] == product_id)


def sponsored_link(product_id, label="See it on Amazon", cls="btn btn-small"):
    p = prod(product_id)
    s = sub(product_id)
    return ('<a class="%s sponsored-link" data-product="%s" href="%s" rel="sponsored nofollow noopener" '
            'target="_blank">%s <span class="badge-sponsor">sponsored</span></a>'
            % (cls, product_id, s["submitted_url"], label))


def product_card(product_id, heading="h3"):
    p = prod(product_id)
    claims = "".join("<li>%s</li>" % c for c in p["claims"][:2])
    return """
  <article class="card" data-product="%s">
    <span class="eyebrow">%s · %s</span>
    <%s><a href="%s/products.html#%s">%s</a></%s>
    <p>%s</p>
    <ul style="margin:0;padding-left:1.1rem;font-size:0.88rem;color:var(--muted)">%s</ul>
    <div class="card-foot">
      %s
      <span class="note">Price &amp; rating: not shown — unverified in our register. Listing claims above are the seller's, not tested by us.</span>
    </div>
  </article>""" % (
        product_id, p["format"], p["group"].replace("-", " "),
        heading, BASE, product_id, p["short_name"], heading,
        p["one_liner"], claims, sponsored_link(product_id)
    )


def guide_card(href, eyebrow, title, blurb):
    return """
  <article class="card guide-card">
    <span class="eyebrow">%s</span>
    <h3><a href="%s/%s">%s</a></h3>
    <p>%s</p>
    <div class="card-foot"><a class="btn btn-ghost btn-small" href="%s/%s">Read the guide</a></div>
  </article>""" % (eyebrow, BASE, href, title, blurb, BASE, href)


GUIDES = [
    ("guide-basket-vs-oven.html", "Air fryers · Hypothesis title", "Basket or oven-style air fryer: what should you compare?",
     "Two shapes, two philosophies of countertop cooking. The comparison that actually decides it is not capacity — it is what you cook most."),
    ("guide-capacity.html", "Air fryers · Hypothesis title", "A no-hype checklist for comparing air fryer capacity",
     "Quarts on a box are not quarts on a counter. A plain checklist for judging how much actually fits — and how much you need."),
    ("guide-cleanup.html", "Air fryers · Hypothesis title", "How to assess cleanup and counter-space trade-offs",
     "The two costs of an appliance that never leaves the counter. How to weigh them before the box arrives."),
    ("guide-multifunction.html", "Buying method · Hypothesis title", "Questions to ask before buying a multi-function kitchen appliance",
     "Ten functions on the box usually means three you'll use. The questions that reveal which ones."),
    ("guide-thermometers.html", "Thermometers · Cluster guide", "Instant-read or smart wireless: which meat thermometer setup fits your kitchen?",
     "One asks a question and answers in a second; the other watches the whole cook. How to choose — with USDA's numbers."),
]


def index_body():
    cards = "".join(product_card(p["id"]) for p in PRODUCTS)
    gcards = "".join(guide_card(*g) for g in GUIDES)
    return """
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="kicker">The countertop edit · Winter 2026</p>
      <h1>Five countertop tools worth a careful look.</h1>
      <p class="standfirst">Air fryers in three shapes, two thermometers that end the guesswork —
      compared by the questions that actually decide the purchase. Every claim on this site is
      sourced or it is not here.</p>
      <div class="button-row">
        <a class="btn" href="%s/products.html">Browse the lineup</a>
        <a class="btn btn-ghost" href="%s/guides.html">Start with a question</a>
      </div>
    </div>
    <figure class="hero-figure">
      <img src="%s/assets/img/hero.jpg" alt="A basket air fryer, an oven-style air fryer and a probe thermometer on a bright kitchen counter" width="1400" height="875">
      <figcaption>Editorial photography for Counter &amp; Crisp. Product imagery is withheld until
      licensing is settled — see SUG-004 in the <a href="%s/suggestions.html">suggestion queue</a>.</figcaption>
    </figure>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="stat-row">
      <div class="stat"><div class="stat-num">5</div><div class="stat-label">products on the desk, links marked sponsored</div></div>
      <div class="stat"><div class="stat-num">2</div><div class="stat-label">categories: air fryers &amp; thermometers</div></div>
      <div class="stat"><div class="stat-num">5</div><div class="stat-label">question-shaped buying guides</div></div>
      <div class="stat"><div class="stat-num">12</div><div class="stat-label">official sources checked and linked</div></div>
      <div class="stat"><div class="stat-num">8</div><div class="stat-label">items flagged for your review, none hidden</div></div>
    </div>
    <div class="section-head">
      <h2>The lineup</h2>
      <a class="more" href="%s/products.html">Full details &amp; register →</a>
    </div>
    <div class="card-grid">%s</div>
    <p class="fn">We don't publish prices or star ratings: we could not verify them from an official
    source in this build, and a wrong price is worse than no price. On Amazon you'll always see live
    numbers. <a href="%s/flagged.html">Why blank fields?</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Start with a question</h2>
      <a class="more" href="%s/guides.html">All guides →</a>
    </div>
    <div class="card-grid">%s</div>
    <p class="fn">These titles are our editorial hypotheses — questions we believe buyers ask — not
    measured search-popularity claims. We'll replace instinct with Search Console data as soon as
    it exists (<a href="%s/suggestions.html">SUG-002</a>).</p>
  </div>
</section>

<section class="seasonal">
  <div class="wrap seasonal-grid">
    <div>
      <p class="kicker">Seasonal edit · November 2026</p>
      <h2 style="margin-top:0">The holiday hosting edit</h2>
      <p>Thanksgiving week is when capacity, cleanup, and doneness stop being abstractions. Three
      guides we'd reread before the big cook:</p>
      <ul>
        <li><a href="%s/guide-thermometers.html">Which thermometer setup fits your kitchen</a> — because
        poultry needs to hit 165 °F and a lid-lift ruins the roast.</li>
        <li><a href="%s/guide-capacity.html">The capacity checklist</a> — for the year the whole family
        actually comes.</li>
        <li><a href="%s/guide-multifunction.html">Questions before buying multi-function</a> — before a
        french-door oven arrives with nowhere to live.</li>
      </ul>
      <a class="btn" href="%s/guides.html">Read the edit</a>
    </div>
    <img src="%s/assets/img/thermometers.jpg" alt="A digital probe thermometer checking a roasted chicken on a wooden board" width="1200" height="800">
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><h2>How this desk works</h2><a class="more" href="%s/about.html">Our method →</a></div>
    <div class="card-grid">
      <article class="card">
        <span class="eyebrow">Principle 1</span>
        <h3>Sources or silence</h3>
        <p>Every table row links to an official source. If a value can't be confirmed, the cell stays
        blank and gets a flag — we never infer, round, or "approximately" a number.</p>
      </article>
      <article class="card">
        <span class="eyebrow">Principle 2</span>
        <h3>Products before process</h3>
        <p>This is a shop, not an audit. The verification machinery is all here — in the footer —
        but the front page leads with what to buy and what to ask.</p>
      </article>
      <article class="card">
        <span class="eyebrow">Principle 3</span>
        <h3>Disclosures above the fold</h3>
        <p>The affiliate disclosure sits under the masthead of every page, repeated in the footer,
        and every product link wears a <span class="badge-sponsor">sponsored</span> mark.</p>
      </article>
    </div>
  </div>
</section>
""" % (BASE, BASE, BASE, BASE, BASE, cards, BASE, BASE, gcards, BASE, BASE, BASE, BASE, BASE, BASE, BASE)


def products_body():
    rows = []
    for p in PRODUCTS:
        s = sub(p["id"])
        o = obs(p["id"])
        claims = "; ".join(p["claims"])
        rows.append("""<tr id="%s">
  <td><strong>%s</strong><br><span class="src">%s</span></td>
  <td>%s<br><span class="src">Amazon breadcrumb: %s</span></td>
  <td>%s</td>
  <td class="blank">blank <span class="badge-unverified">unverified</span></td>
  <td>%s<br>%s</td>
</tr>""" % (p["id"], p["short_name"], p["one_liner"], o["observed_category"], o["observed_breadcrumb"],
            claims, sponsored_link(p["id"]), '<span class="src">Submitted link: %s</span>' % s["submitted_url"]))
    cards = "".join(product_card(p["id"]) for p in PRODUCTS)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The lineup</p>
    <h1>Five tools for countertop cooking.</h1>
    <p class="lede">Three air fryers in the shapes people actually argue about — dual basket, oven
    style, big single drawer — and two thermometers: the one you grab mid-cook and the one that
    watches the whole thing. Below: the details we verified, and the details we refused to guess.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="card-grid">%s</div>
    <h2>The working table</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Product register (shop view). Listing-title claims are the seller's statements,
        recorded verbatim — not independently tested. Blank cells are deliberate; see flags.</caption>
        <thead><tr>
          <th>Product</th><th>Observed category</th><th>Claims in listing title</th><th>Price / rating</th><th>Where to buy</th>
        </tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <p class="fn">Observed category and titles come from the amazon.com pages each submitted link
    resolved to on 2026-11-20. The mapping is <em>observed</em>, not confirmed — a human browser
    check is required before we treat it as final (FLG-001). Full evidence: <a href="%s/register.html">source &amp; product register</a>.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><h2>Next: choose by question</h2></div>
    <div class="button-row">
      <a class="btn" href="%s/compare.html">Compare all five side by side</a>
      <a class="btn btn-ghost" href="%s/guide-basket-vs-oven.html">Basket vs oven style?</a>
      <a class="btn btn-ghost" href="%s/guide-thermometers.html">Which thermometer?</a>
    </div>
  </div>
</section>
""" % (cards, "".join(rows), BASE, BASE, BASE, BASE)


def _category_body(group, kicker, h1, lede, img, img_alt, bullets, guide_hrefs):
    plist = [p for p in PRODUCTS if p["group"] == group]
    cards = "".join(product_card(p["id"]) for p in plist)
    bullet_html = "".join("<li>%s</li>" % b for b in bullets)
    guide_html = "".join(
        '<a class="btn btn-ghost btn-small" href="%s/%s">%s</a>' % (BASE, h, t)
        for h, t in guide_hrefs
    )
    rows = []
    for p in plist:
        o = obs(p["id"])
        rows.append("""<tr>
  <td><strong>%s</strong></td><td>%s</td><td>%s</td>
  <td class="blank">blank <span class="badge-unverified">unverified</span></td>
  <td>%s</td>
</tr>""" % (p["short_name"], o["observed_category"], "; ".join(p["claims"]), sponsored_link(p["id"])))
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">%s</p>
    <h1>%s</h1>
    <p class="lede">%s</p>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    <div>
      <h2 style="margin-top:0">What to compare in this category</h2>
      <ul>%s</ul>
      <div class="button-row">%s</div>
    </div>
    <figure class="hero-figure">
      <img src="%s/assets/img/%s" alt="%s" width="1200" height="800">
      <figcaption>Editorial photography for Counter &amp; Crisp — not product photography.</figcaption>
    </figure>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><h2>On the desk in this category</h2></div>
    <div class="card-grid">%s</div>
    <h2>Working table</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Category register. Claims are listing-title statements (seller's, untested). Price/rating intentionally blank.</caption>
        <thead><tr><th>Product</th><th>Observed category</th><th>Claims in listing title</th><th>Price / rating</th><th>Where to buy</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <p class="fn">Sources and evidence for every row: <a href="%s/register.html">source &amp; product register</a>.</p>
  </div>
</section>
""" % (kicker, h1, lede, bullet_html, guide_html, BASE, img, img_alt, cards, "".join(rows), BASE)


def air_fryers_body():
    return _category_body(
        "air-fryers",
        "Category · Air fryers",
        "Air fryers: three shapes, one decision.",
        "Dual basket, oven style, or one big drawer. Before capacity numbers and preset counts, "
        "the shape decides what your weeknights look like.",
        "air-fryers.jpg",
        "A basket air fryer and an oven-style air fryer on a pale oak kitchen counter",
        [
            "<strong>Shape first:</strong> basket drawers shine for one big crispy batch; oven styles take racks, trays and toast duty; dual baskets sync two foods.",
            "<strong>Footprint honesty:</strong> measure the counter <em>and</em> the space above — doors and drawers need clearance too.",
            "<strong>Capacity is a shape question:</strong> quarts in a tall basket are not quarts across a wide rack. <a href=\"" + BASE + "/guide-capacity.html\">Run the checklist</a>.",
            "<strong>Cleanup is the recurring cost:</strong> every part that touches food should be dishwasherable — or you'll resent it by week three.",
            "<strong>Recalls:</strong> the CPSC database has an Air Fryer category; check it before you buy (<a href=\"https://www.cpsc.gov/Recalls\">cpsc.gov/Recalls</a>).",
        ],
        [("guide-basket-vs-oven.html", "Basket vs oven style"), ("guide-capacity.html", "Capacity checklist"), ("guide-cleanup.html", "Cleanup &amp; space")],
    )


def thermometers_body():
    return _category_body(
        "thermometers",
        "Category · Thermometers",
        "Thermometers: end the guesswork.",
        "One tool answers 'is it done?' in a second; the other watches the whole cook from across "
        "the kitchen. Both beat cutting into the roast to look.",
        "thermometers.jpg",
        "A digital instant-read thermometer checking a roasted chicken, with a wireless probe nearby",
        [
            "<strong>Instant-read vs leave-in:</strong> spot-checks versus continuous monitoring. Many kitchens eventually want both.",
            "<strong>Speed &amp; probe length:</strong> thin, fast probes read without leaving a hole; long probes reach the center of big roasts.",
            "<strong>Accuracy claims need evidence:</strong> when a listing claims certification, ask for the documentation (our Q-12).",
            "<strong>The number that matters is USDA's:</strong> poultry 165 °F, ground meats 160 °F, steaks 145 °F + 3&nbsp;min rest (<a href=\"https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart\">USDA FSIS chart</a>).",
            "<strong>Heat limits:</strong> a probe rated for the grill grate is not the same as one rated for the broiler. Check the listing's stated limit.",
        ],
        [("guide-thermometers.html", "Which thermometer setup?")],
    )


def compare_body():
    rows = []
    for p in PRODUCTS:
        o = obs(p["id"])
        rows.append("""<tr>
  <td><strong>%s</strong><br><span class="src">%s</span></td>
  <td>%s</td>
  <td>%s</td>
  <td>%s</td>
  <td>%s</td>
  <td class="blank">blank <span class="badge-unverified">unverified</span></td>
  <td>%s</td>
</tr>""" % (p["short_name"], o["observed_category"], p["format"], p["good_for"], p["check_first"],
            "; ".join(p["claims"]), sponsored_link(p["id"])))
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">Compare</p>
    <h1>Side by side, on the things that decide it.</h1>
    <p class="lede">Spec sheets rank appliances by numbers. Households choose them by Tuesday night.
    This table leads with what each tool is actually good for — and the one thing to check before
    you commit.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="table-scroll">
      <table class="data">
        <caption>Comparison register, 2026-11-20. Claims = seller statements from listing titles.
        Price/rating blank (unverified — FLG-002/FLG-007).</caption>
        <thead><tr>
          <th>Product</th><th>Format</th><th>Good for</th><th>Check first</th><th>Listing-title claims</th><th>Price / rating</th><th>Link</th>
        </tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <p class="fn">Every row's evidence trail lives in the <a href="%s/register.html">source &amp; product register</a>;
    anything we could not confirm is blank and flagged on <a href="%s/flagged.html">Flagged for Review</a>.</p>

    <h2>The four questions that actually choose for you</h2>
    <div class="two-col">
      <div class="callout">
        <h3>1. What do you cook most?</h3>
        <p>Two foods finishing together → dual basket. Racks, toast, and sheet-pan dinners → oven
        style. One big crispy batch → big drawer.</p>
        <h3>2. What does your counter allow?</h3>
        <p>Measure width, depth, and <em>door clearance</em>. An oven you can't fully open is an oven
        you'll stop using. (<a href="%s/guide-cleanup.html">Cleanup &amp; space guide</a>)</p>
      </div>
      <div class="callout">
        <h3>3. How many people, how often?</h3>
        <p>Capacity checklists beat quart claims. (<a href="%s/guide-capacity.html">Capacity guide</a>)</p>
        <h3>4. Who watches the doneness?</h3>
        <p>If you cook by instinct alone, an instant-read is the upgrade. If you host, a wireless
        probe protects the whole evening. (<a href="%s/guide-thermometers.html">Thermometer guide</a>)</p>
      </div>
    </div>
    <div class="callout callout-blue">
      <h4>Coming: a guided chooser</h4>
      <p>A four-question interactive chooser is proposed in the suggestion queue (SUG-003). Nothing
      is implemented there without a decision — review it on <a href="%s/suggestions.html">suggestions</a>.</p>
    </div>
  </div>
</section>
""" % ("".join(rows), BASE, BASE, BASE, BASE, BASE, BASE)


def guides_body():
    gcards = "".join(guide_card(*g) for g in GUIDES)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">Guides</p>
    <h1>Start with the question you'd actually ask.</h1>
    <p class="lede">Every guide here is shaped like a buyer's question, because that is how the
    decision happens. Where a guide states a fact, it links the official source; where we don't know,
    it says so.</p>
    <div class="callout callout-amber">
      <h4>A note on these titles</h4>
      <p>Four of these titles were handed to us as editorial hypotheses — working titles, explicitly
      <em>not</em> claims about search popularity or product superiority. The fifth extends the
      thermometer cluster. As soon as query data exists, this backlog gets chosen by measurement,
      not instinct (SUG-002).</p>
    </div>
    <div class="card-grid">%s</div>
    <h2>The clusters</h2>
    <div class="two-col">
      <div class="callout">
        <h3>Cluster 1 — Air fryers</h3>
        <p><a href="%s/guide-basket-vs-oven.html">Shape</a> · <a href="%s/guide-capacity.html">Capacity</a> ·
        <a href="%s/guide-cleanup.html">Cleanup &amp; space</a> ·
        <a href="%s/guide-multifunction.html">Multi-function questions</a></p>
      </div>
      <div class="callout">
        <h3>Cluster 2 — Thermometers</h3>
        <p><a href="%s/guide-thermometers.html">Instant-read vs smart wireless</a>, with USDA's safe
        internal temperatures on hand.</p>
      </div>
    </div>
  </div>
</section>
""" % (gcards, BASE, BASE, BASE, BASE, BASE)


def about_body():
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">About</p>
    <h1>A buying desk with its receipts attached.</h1>
    <p class="lede">Counter &amp; Crisp launched on 2026-11-20 with five products on the desk and one
    rule: if a number can't be tied to an official source, it doesn't go on the page.</p>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    <div>
      <h2 style="margin-top:0" id="policy">Editorial &amp; verification policy</h2>
      <ul class="checklist">
        <li><strong>Sources or silence.</strong> Every register row links an official source or is
        blank and flagged. We never infer, estimate, or round into a cell.</li>
        <li><strong>Seller claims stay claims.</strong> Capacities, certifications, and accuracies
        copied from listing titles are labelled as the seller's statements.</li>
        <li><strong>Rankings are not for sale.</strong> We earn from qualifying purchases through
        marked links; commission rates do not influence order or wording.</li>
        <li><strong>Disclosures above the fold.</strong> The disclosure strip sits under the masthead
        of every page and repeats in the footer — the statement required by the Associates
        Operating Agreement is verbatim on both.</li>
        <li><strong>Corrections.</strong> An error found later is corrected in the register with a
        dated note — not silently overwritten.</li>
      </ul>
    </div>
    <div>
      <h2 style="margin-top:0">Authorship</h2>
      <p>Posts are signed "the Counter &amp; Crisp Desk" for now. This is a deliberate placeholder:
      a named editor with real credentials materially improves trust, and we will not invent one.
      The proposal to attach a real person is open as SUG-008.</p>
      <h2>Imagery</h2>
      <p>The photography on this site is commissioned editorial work — it is not product
      photography, and it is never presented as evidence about a specific product. Product images
      will come from licensed sources only (see SUG-004).</p>
      <h2>Seasons &amp; clusters</h2>
      <p>Content ships in topical clusters (air fryers; thermometers) and seasonal edits (currently
      the Holiday 2026 edit). The rotation is proposed as a standing calendar in SUG-001.</p>
      <h2>Privacy, briefly</h2>
      <p>No cookies, no personal data, no third-party trackers. The click counter is
      privacy-preserving and documented in full on <a href="%s/measurement.html#privacy">measurement</a>.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="callout">
      <h3>The machinery is part of the product</h3>
      <p>Every dashboard surface — the <a href="%s/register.html">register</a>,
      <a href="%s/workflow.html">compliance gate</a>, <a href="%s/measurement.html">measurement</a>,
      <a href="%s/flagged.html">flags</a>, <a href="%s/suggestions.html">suggestions</a>, and
      <a href="%s/questions.html">open questions</a> — lives one click away in the footer. The shop
      leads; the evidence follows.</p>
    </div>
  </div>
</section>
""" % (BASE, BASE, BASE, BASE, BASE, BASE, BASE)
