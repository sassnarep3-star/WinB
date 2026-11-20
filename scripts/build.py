#!/usr/bin/env python3
"""Counterwise static build.

Deterministically renders the public site from `site/data` + `site/content`.
Everything the reader sees (nav, disclosure strip, rel=sponsored on product
links, sitemap, RSS, JSON-LD) is structural here, so per-page authoring
mistakes become impossible and `scripts/validate_site.py` can gate them.

Usage:
  python3 scripts/build.py            # build into repo root
  python3 scripts/build.py --check    # rebuild to temp dir, diff vs committed; exit 1 if stale
"""
import datetime as dt
import html
import json
import pathlib
import re
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "site"
TEMPLATES = SRC / "templates"
BUILD_DATE = "2026-11-20"

CHECK = "--check" in sys.argv
OUT = pathlib.Path(tempfile.mkdtemp(prefix="cwbuild-")) if CHECK else ROOT

esc = html.escape


def load(rel):
    return json.loads((SRC / rel).read_text(encoding="utf-8"))


site = load("data/site.json")
products = load("data/products.json")["products"]
guides = load("content/guides.json")["guides"]
questions = load("data/questions.json")["questions"]
suggestions = load("data/suggestions.json")["suggestions"]
flags = load("data/flags.json")["flags"]

BASE = site["brand"]["base_url"].rstrip("/")
BRAND = site["brand"]["name"]
MARK = site["brand"]["mark"]
DISCLOSURE = site["disclosure_text"]
TAGLINE = site["brand"]["tagline"]
SEASON = site["brand"]["season_label"]
BYLINE = site["brand"]["byline"]
ENDPOINT = site["analytics_endpoint"]
by_product = {p["id"]: p for p in products}
by_slug = {g["slug"]: g for g in guides}

OFFICIAL = {
    "amazon.com": "Amazon",
    "link.amazon": "submitted short link",
    "chefman.com": "Chefman (maker)",
    "chefiq.com": "CHEF iQ (maker)",
    "ftc.gov": "FTC",
    "usda.gov": "USDA FSIS",
    "cpsc.gov": "CPSC",
    "developers.google.com": "Google Search Central",
    "sitemaps.org": "Sitemap protocol",
    "github.com": "GitHub",
    "docs.github.com": "GitHub Docs",
}


def word_count(s):
    return max(1, len(re.sub(r"<[^>]+>", " ", s).split()))


def ext(url, label, sponsored=False):
    """External source link with a host attribution chip."""
    host = re.sub(r"^https?://", "", url).split("/")[0].split(":")[0].lower()
    sponsored = sponsored or host.endswith("amazon.com") or host == "link.amazon"
    rel = "sponsored noopener noreferrer" if sponsored else "noopener noreferrer"
    chip = OFFICIAL.get(host, host)
    cls = ' class="ext ext-sponsored"' if sponsored else ' class="ext"'
    return (
        '<a href="' + esc(url) + '" rel="' + rel + '" target="_blank"' + cls + ">"
        + label + "</a> <span class='src-host'>" + esc(chip) + "</span>"
    )


def product_cta(p, label=None):
    """The only outbound *monetized* link shape allowed: sponsored+noopener."""
    text = label or "See it on Amazon →"
    return (
        '<a class="cta" href="' + esc(p["submitted_url"]) + '" rel="sponsored noopener noreferrer"'
        ' data-cw-slot="' + p["id"] + '">' + text + "</a>"
    )


# ---------------------------------------------------------------- components
def product_tile(p, r, compact=False):
    shop = p["shop"]
    pending = p["status"] == "observed-not-confirmed"
    badge = (
        '<span class="badge pending">listing check in progress</span>'
        if pending
        else '<span class="badge ok">confirmed in Associates flow</span>'
    )
    hl = "".join("<li>" + esc(h) + "</li>" for h in shop["highlights"])
    listing = ext(p["observed_redirect_target"], "observed listing")
    note = (
        '<p class="tile-note">Bullets quote the retailer listing as observed '
        + esc(p["observed_on"]) + " — " + listing + " " + badge + "</p>"
    )
    img = (
        '<img src="' + r + shop["image"].replace(".jpg", ".svg") + '" alt="Editorial illustration — not a product photo" loading="lazy">'
    )
    if compact:
        return (
            '<article class="tile compact"><div class="tile-img">' + img + "</div><div class=\"tile-body\">"
            '<span class="eyebrow">' + esc(shop["short_name"]) + "</span>"
            "<h3>" + esc(shop["name"]) + "</h3>"
            "<p>" + esc(shop["role"]) + "</p>"
            + note + "</div></article>"
        )
    gl = "".join(
        '<a href="' + r + "guides/" + slug + '.html">' + esc(by_slug[slug]["title"]) + "</a>"
        for slug in shop["guides"]
        if slug in by_slug
    )
    return (
        '<article class="tile" id="' + p["id"] + '"><div class="tile-img">' + img + "</div>"
        '<div class="tile-body">'
        '<span class="eyebrow">' + esc(shop["cluster"]) + " · " + p["id"] + "</span>"
        '<h3><a class="tile-title" href="' + r + 'shop/' + p["id"] + '.html">' + esc(shop["name"]) + "</a></h3>"
        "<p>" + esc(shop["blurb"]) + "</p>"
        '<ul class="bullets">' + hl + "</ul>"
        '<div class="tile-cta-row">' + product_cta(p)
        + '<span class="price-note">price &amp; stock shown at the retailer</span></div>'
        + note
        + '<div class="tile-guides"><b>Read before you buy:</b>' + gl + "</div>"
        + "</div></article>"
    )


def guide_card(g, r, idx=None):
    num = (
        '<span class="number">' + ("%02d" % (idx + 1)) + " / " + esc(g["eyebrow"].upper()) + "</span>"
        if idx is not None
        else '<span class="number">' + esc(g["eyebrow"].upper()) + "</span>"
    )
    img = '<div class="card-img"><img src="' + r + "assets/img/t-" + g["cluster"] + '.svg" alt="" loading="lazy"></div>'
    return (
        '<a class="card" href="' + r + "guides/" + g["slug"] + '.html">' + img + num
        + "<h3>" + esc(g["title"]) + "</h3><p>" + esc(g["dek"]) + "</p>"
        + '<span class="read">Read the guide ↗</span></a>'
    )


def shelf_section(c, r, heading=True):
    tiles = "".join(product_tile(p, r) for p in products if p["shop"]["cluster"] == c["slug"])
    head = (
        '<div class="section-head"><div><div class="eyebrow">'
        + esc(c["subtitle"].upper())
        + '</div><h2>' + esc(c["name"]) + "</h2></div></div>"
        if heading
        else ""
    )
    return '<section class="shelf" id="' + c["slug"] + '">' + head + '<div class="tile-grid">' + tiles + "</div></section>"


# ---------------------------------------------------------------- shell
SHELL = (TEMPLATES / "shell.html").read_text(encoding="utf-8")

pages = []  # (path, lastmod) in publish order


def render(body, title, desc, path, depth, jsonld="", og_type="website"):
    r = "../" * depth
    if path == "index.html":
        canonical = BASE + "/"
    elif path.endswith("index.html"):
        canonical = BASE + "/" + path[: -len("index.html")]
    else:
        canonical = BASE + "/" + path
    nav = "".join('<a href="' + r + n["href"] + '">' + esc(n["label"]) + "</a>" for n in site["nav"])
    nav_more = "".join('<a href="' + r + n["href"] + '">' + esc(n["label"]) + "</a>" for n in site["nav_more"])
    out = SHELL
    for k, v in {
        "{{TITLE}}": esc(title),
        "{{META_DESC}}": esc(desc),
        "{{CANONICAL}}": canonical,
        "{{OG_TYPE}}": og_type,
        "{{OG_IMAGE}}": BASE + "/assets/img/og-cover.svg",
        "{{R}}": r,
        "{{BRAND}}": esc(BRAND),
        "{{MARK}}": MARK,
        "{{DISCLOSURE}}": esc(DISCLOSURE),
        "{{SEASON}}": esc(SEASON),
        "{{TAGLINE}}": esc(TAGLINE),
        "{{NAV}}": nav,
        "{{NAV_MORE}}": nav_more,
        "{{JSONLD}}": jsonld,
        "{{ENDPOINT}}": esc(ENDPOINT),
        "{{BODY}}": body,
    }.items():
        out = out.replace(k, v)
    return out


def emit(path, depth, page_html, lastmod=BUILD_DATE):
    out = OUT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page_html, encoding="utf-8")
    pages.append((path, lastmod))


def jld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


# ---------------------------------------------------------------- front page
rail = "".join(product_tile(p, "") for p in products)
cards4 = "".join(guide_card(g, "", i) for i, g in enumerate(guides[:4]))
cluster_cards = ""
for c in site["clusters"]:
    cluster_cards += (
        '<div class="cluster-card"><span class="eyebrow">SHELF</span><h3>' + esc(c["name"]) + "</h3><p>"
        + esc(c["lede"]) + '</p><a class="text-link" href="shop/' + c["slug"] + '.html">Browse ' + esc(c["name"]) + " →</a></div>"
    )

front_body = f"""
<section class="hero">
  <div class="hero-copy">
    <div class="eyebrow">THE SEASON SHELF · {esc(SEASON).upper()}</div>
    <h1>Buy the right tool.<br>Skip the hype.</h1>
    <p class="lede">Counterwise is a small shop with a long memory: five kitchen picks on the shortlist, question-led guides behind every one of them, and a public register for anything we haven't verified yet.</p>
    <div class="hero-ctas"><a class="button" href="shop/index.html">Shop the shortlist <span aria-hidden="true">→</span></a><a class="button ghost" href="guides/index.html">Read the guides</a></div>
    <p class="hero-note">Disclosure first: {esc(DISCLOSURE)} — <a href="review/index.html#disclosure">plain-English version</a>.</p>
  </div>
  <div class="hero-img"><img src="assets/img/hero-counter.svg" alt="Editorial illustration of a kitchen counter with an air fryer and a probe thermometer"></div>
</section>

<section class="rail" id="picks">
  <div class="section-head"><div><div class="eyebrow">ON THE SHELF · {esc(SEASON).upper()}</div><h2>Five picks, two shelves, zero fake deals</h2></div><a class="text-link" href="shop/index.html">Full shop →</a></div>
  <div class="tile-grid">{rail}</div>
</section>

<section class="clusters">{cluster_cards}</section>

<section class="articles" id="latest">
  <div class="section-head"><div><div class="eyebrow">THE BUYER'S NOTEBOOK</div><h2>Guides written like questions, not like ads</h2></div><a class="text-link" href="guides/index.html">All {len(guides)} guides →</a></div>
  <div class="cards">{cards4}</div>
</section>

<section class="callout">
  <div><div class="eyebrow">THE FRIDAY SHORTLIST</div><h2>One useful idea a week. Today that means RSS.</h2>
  <p>Each new guide lands in the feed the day it ships. Email capture is a <a href="desk/suggestions.html">suggestion awaiting a decision</a> — a live feed beats a dead form.</p></div>
  <a class="button ghost" href="feed.xml">Subscribe via RSS →</a>
</section>

<section class="method">
  <span>OUR STANDARD</span>
  <p>Useful first. Evidence-aware. Every claim that isn't sourced says so out loud — and waits in the open.</p>
  <a href="review/index.html">Read the evidence register &amp; flagged items →</a>
</section>
"""

emit(
    "index.html",
    0,
    render(
        front_body,
        BRAND.capitalize() + " — countertop gear & doneness tech",
        "Question-led buying guides and a small, honest shortlist of air fryers and food thermometers. " + TAGLINE,
        "index.html",
        0,
        jld({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": BRAND.capitalize(),
            "url": BASE + "/",
            "description": TAGLINE,
            "publisher": {"@type": "Organization", "name": BYLINE, "url": BASE + "/"},
        }),
    ),
)

# ---------------------------------------------------------------- shop
shop_body = f"""
<section class="page-hero"><div class="eyebrow">THE SHOP · {esc(SEASON).upper()}</div>
<h1>The shortlist</h1>
<p class="lede">Five products this first season is built around — three air fryers and two ways to stop guessing when meat is done. Every bullet below quotes a dated retailer listing; anything a listing doesn't say, we leave blank. <b>{esc(DISCLOSURE)}</b>; every product link carries <code>rel="sponsored"</code>.</p></section>
{"".join(shelf_section(c, "../") for c in site["clusters"])}
<section class="callout"><div><div class="eyebrow">WHY NOTHING HERE SAYS “BEST”</div><h2>Ranked lists are the last thing we'll publish</h2><p>A ranking without testing is marketing math. So the shop shows what the listing shows, links to the maker's pages, and keeps an open register of everything still being confirmed — starting with the links themselves.</p></div><a class="text-link" href="../review/index.html">See the register ↗</a></section>
"""
emit(
    "shop/index.html",
    1,
    render(
        shop_body,
        "The Shop | " + BRAND.capitalize(),
        "The Counterwise Season 1 shortlist: three air fryers and two food thermometers, each tied to dated listing evidence and a question-led guide.",
        "shop/index.html",
        1,
        jld({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Counterwise Season 1 shortlist",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": p["shop"]["name"], "url": BASE + "/shop/index.html#" + p["id"]}
                for i, p in enumerate(products)
            ],
        }),
    ),
)

for c in site["clusters"]:
    subset = "".join(product_tile(p, "../") for p in products if p["shop"]["cluster"] == c["slug"])
    gcards = "".join(guide_card(g, "../") for g in guides if g["cluster"] == c["slug"])
    body = (
        '<section class="page-hero"><div class="eyebrow">SHELF · ' + esc(c["subtitle"].upper()) + "</div><h1>"
        + esc(c["name"]) + '</h1><p class="lede">' + esc(c["lede"])
        + " Listing bullets are quotes captured " + esc(BUILD_DATE)
        + "; verify at the retailer before you buy. " + esc(DISCLOSURE) + "</p></section>"
        + '<section class="shelf"><div class="tile-grid">' + subset + "</div></section>"
        + '<section class="articles"><div class="section-head"><div><div class="eyebrow">BEFORE YOU BUY</div><h2>Guides for this shelf</h2></div><a class="text-link" href="index.html">Back to shop →</a></div><div class="cards">'
        + gcards + "</div></section>"
    )
    emit(
        "shop/" + c["slug"] + ".html",
        1,
        render(body, c["name"] + " | " + BRAND.capitalize(), c["lede"][:150], "shop/" + c["slug"] + ".html", 1),
    )

# One page per observed product slot; observed destinations are never presented
# as intended/confirmed identities, and every listing claim cites the retailer.
for p in products:
    shop = p["shop"]
    observed = ext(p["observed_redirect_target"], "Open observed retailer listing")
    maker = ext(p["maker_resources"], "Maker resource page") if p["maker_resources"] else "<span class=\"nosrc\">Maker source not identified; see flagged record.</span>"
    facts = "".join(
        '<li>' + esc(h) + ' — ' + ext(p["observed_redirect_target"], "retailer listing") + "</li>"
        for h in shop["highlights"]
    )
    guides_html = "".join(
        '<li><a href="../guides/' + slug + '.html">' + esc(by_slug[slug]["title"]) + "</a></li>"
        for slug in shop["guides"] if slug in by_slug
    )
    maker_facts = ""
    if p["maker_site"]:
        maker_facts = '<p>Maker source available for comparison: ' + maker + "</p>"
    else:
        maker_facts = '<p>Maker site: <span class="nosrc">not confirmed</span>. This is flagged; no maker-level specifications are asserted.</p>'
    detail_body = (
        '<section class="page-hero"><div class="eyebrow">SHOP SLOT · ' + esc(p["id"].upper()) + " · " + esc(shop["cluster"].upper()) + "</div>"
        '<h1>' + esc(shop["name"]) + "</h1>"
        '<p class="lede">An observed listing, not a product endorsement. The supplied short link resolved to the page below during an anonymous fetch on '
        + esc(p["observed_on"]) + "; the fallback-redirect signature means its identity and Special Link status remain unconfirmed.</p>"
        '<div class="detail-cta">' + product_cta(p) + " <span class=\"badge pending\">not confirmed in Associates workflow</span></div></section>"
        '<section class="detail-sheet"><h2>What the observed listing says</h2>'
        '<p><b>Observed title:</b> “' + esc(p["observed_listing_title"]) + '” — ' + observed + "</p>"
        '<p><b>Observed category:</b> ' + esc(p["observed_category"]) + "</p>"
        '<ul class="bullets">' + facts + "</ul>"
        '<h2>What still needs checking</h2><ul><li>Intended ASIN: <span class="blank">not confirmed</span></li>'
        '<li>Price, rating, availability: <span class="blank">not recorded</span>; check the live retailer listing.</li>'
        '<li>Destination and tracking attribution: confirm one Special Link inside the enrolled Associates workflow before scaling.</li></ul>'
        + maker_facts
        + '<h2>Questions to take into the listing</h2><ul>' + guides_html + "</ul>"
        '<p class="footnote">The title and bullets above are retailer-listing observations captured on ' + esc(p["observed_on"])
        + '. They are not an intended-ASIN confirmation, test result, verified specification, price, rating, or recommendation. ' + ext("../review/index.html#products", "Open the full register") + "</p></section>"
    )
    emit(
        "shop/" + p["id"] + ".html",
        1,
        render(detail_body, shop["name"] + " | " + BRAND.capitalize(), "Observed listing record and open buying questions for " + shop["name"] + ".", "shop/" + p["id"] + ".html", 1),
    )

# ---------------------------------------------------------------- guides hub
hub_shelves = ""
for c in site["clusters"]:
    gcards = "".join(guide_card(g, "../", i) for i, g in enumerate(x for x in guides if x["cluster"] == c["slug"]))
    hub_shelves += (
        '<section class="shelf"><div class="section-head"><div><div class="eyebrow">CLUSTER · '
        + esc(c["name"].upper()) + '</div><h2>' + esc(c["subtitle"]) + "</h2></div></div><div class=\"cards\">"
        + gcards + "</div></section>"
    )
hub_body = (
    "<section class=\"page-hero\"><div class=\"eyebrow\">THE BUYER'S NOTEBOOK · " + str(len(guides))
    + """ GUIDES</div><h1>Questions first, checkouts second</h1><p class="lede">Every guide answers the question you'd ask a friend — with method and sources, not a “top 10” someone else guessed at. New guides appear in the <a href="../feed.xml">RSS feed</a> the day they ship.</p></section>"""
    + hub_shelves
)
emit(
    "guides/index.html",
    1,
    render(
        hub_body,
        "The Buyer's Notebook | " + BRAND.capitalize(),
        "Question-led buying guides for air fryers and food thermometers: sizing, cleanup, formats, safe temperatures, and pre-purchase checks.",
        "guides/index.html",
        1,
    ),
)

# ---------------------------------------------------------------- guide pages
for i, g in enumerate(guides):
    body_html = (SRC / "content" / "guides" / (g["slug"] + ".html")).read_text(encoding="utf-8")
    minutes = max(3, round(word_count(body_html) / 220))
    cluster = next(c for c in site["clusters"] if c["slug"] == g["cluster"])
    related = "".join(product_tile(by_product[s], "../", compact=True) for s in g["products"] if s in by_product)
    if g["sources"]:
        srclinks = " · ".join(ext(u, u.replace("https://", "")) for u in g["sources"])
        evidence = '<div class="evidence-row"><b>Sources used in this guide</b><br>' + srclinks + " <span class=\"cap\">(captured " + BUILD_DATE + ")</span></div>"
    else:
        evidence = ""
    pn = []
    if i > 0:
        pn.append('<a class="prev" href="' + guides[i - 1]["slug"] + '.html">← ' + esc(guides[i - 1]["title"]) + "</a>")
    if i + 1 < len(guides):
        pn.append('<a class="next" href="' + guides[i + 1]["slug"] + '.html">' + esc(guides[i + 1]["title"]) + " →</a>")
    related_sec = ""
    if related:
        related_sec = (
            "<section class=\"related\"><div class=\"section-head\"><div><div class=\"eyebrow\">THIS GUIDE'S SHELF</div><h2>On the shortlist</h2></div>"
            '<a class="text-link" href="../shop/' + cluster["slug"] + '.html">Whole shelf →</a></div><div class="tile-grid">' + related + "</div></section>"
        )
    body = (
        '<article class="article"><a class="back" href="../#latest">← All guides</a>'
        "<div class=\"eyebrow\">THE BUYER'S NOTEBOOK · " + esc(cluster["name"].upper()) + " · " + esc(g["eyebrow"].upper()) + "</div>"
        "<h1>" + esc(g["title"]) + "</h1>"
        '<p class="dek">' + esc(g["dek"]) + "</p>"
        '<p class="byline">By the ' + esc(BYLINE) + " · " + esc(g["date"]) + " · " + str(minutes) + " min read</p>"
        '<div class="guide-body">' + body_html + "</div>"
        + evidence
        + '<div class="disclosure-inline"><b>Shopping disclosure</b><br>' + esc(DISCLOSURE)
        + " Nothing on this page is priced by us; every product link goes straight to the retailer and is marked <code>rel=\"sponsored\"</code>.</div>"
        + related_sec
        + '<div class="pn">' + "".join(pn) + "</div></article>"
    )
    emit(
        "guides/" + g["slug"] + ".html",
        1,
        render(
            body,
            g["title"] + " | " + BRAND.capitalize(),
            g["meta_desc"],
            "guides/" + g["slug"] + ".html",
            1,
            jld({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": g["title"],
                "description": g["dek"],
                "datePublished": g["date"],
                "dateModified": g["date"],
                "author": {"@type": "Organization", "name": BYLINE},
                "publisher": {"@type": "Organization", "name": BRAND.capitalize()},
                "mainEntityOfPage": BASE + "/guides/" + g["slug"] + ".html",
            }),
            og_type="article",
        ),
        lastmod=g["date"],
    )

# ---------------------------------------------------------------- desk
desk_body = f"""
<section class="page-hero"><div class="eyebrow">THE DESK · WHERE THE PROJECT STANDS</div><h1>Executive summary</h1><p class="lede">One page for the whole operation: what exists, what was verified today, what is blocked, and which decisions move it forward. Reader-facing pages live upstairs; this is the machine room.</p></section>
<div class="desk-grid">
  <a class="desk-card" href="questions.html"><b>Open questions</b><span>Twelve questions — what we know, what's missing, how to find out</span></a>
  <a class="desk-card" href="suggestions.html"><b>Suggestion board</b><span>Twelve paths with options, risk notes, and ready-to-run prompts</span></a>
  <a class="desk-card" href="../review/index.html"><b>Flagged for review</b><span>Open irregularities, each with sources and an action gate</span></a>
</div>
<h2>Status as of {BUILD_DATE}</h2>
<ol class="exec-list">
<li><b>The site is a shop now, not an audit.</b> The front page and shop lead with the five products; verification lives one click away in <a href="../review/index.html">the register</a>. Every page carries the disclosure strip above the content and again in the footer — the exact Operating Agreement §5 sentence.</li>
<li><b>All five submitted links were resolved the same day</b> (anonymous fetch). Destinations: three air fryers (Chefman dual-basket 6 qt, Emeril Lagasse French-door 26 qt, Chefman 8 qt XL) and two thermometers (ThermoMaven instant-read, CHEF iQ Sense Gen 3 probe set). Loud caveat: every redirect carried a fallback signature (<code>plpRedirect=mhFallback</code>) and matched none of the tokens embedded in the submitted links.</li>
<li><b>No numbers we didn't see are published.</b> Zero prices, ratings, traffic, or commission figures on the site. Maker pages corroborate two of five product families (chefman.com, chefiq.com); the Emeril and ThermoMaven manufacturer domains remain unidentified and are flagged.</li>
<li><b>Automation is real but gated.</b> <code>scripts/build.py</code> + <code>scripts/validate_site.py</code> run in CI as the publish gate; the click-event emitter ships <i>inert</i> until an ingestion endpoint exists; and per Amazon's official deprecation notice, product-data automation is planned against the <b>Creators API, not the retired PA-API 5</b>.</li>
<li><b>The compliance spine is structural.</b> Sponsored rels are emitted by the builder (not hand-added), external domains are whitelisted by the validator, and the build-check itself fails if committed HTML ever diverges from sources — “blank means unverified” is enforced against the site, not just promised by it.</li>
</ol>
<h2>Campaign ledger</h2>
<p>Empty by design. Rows enter only from dated, authorized first-party reports. Nothing here is modeled, forecast, or synthetic — the schema exists so the first real row has an honest home.</p>
<div class="table-wrap"><table class="ledger"><thead><tr><th>Timestamp</th><th>Source / provenance</th><th>Channel</th><th>Eligible sessions</th><th>Clicks</th><th>Reported orders</th></tr></thead><tbody><tr><td class="blank" colspan="6">No entries yet — awaiting first authorized report. <a href="../review/index.html#scope">Why this row exists →</a></td></tr></tbody></table></div>
<h2>Measurement &amp; automation status</h2>
<p><b>Defined events:</b> {", ".join("<code>" + e + "</code>" for e in site["events"])}. The client emitter (<code>assets/js/site.js</code>) is inert while the endpoint meta tag is blank — no cookies, no fingerprinting, no silent buffering. Provisioning ingestion is <a href="suggestions.html">S-04</a>; conversions only ever arrive from program reports, never inferred from clicks.</p>
<p><b>Publishing cadence:</b> one guide per week; the build regenerates sitemap + feed, so a new guide is one JSON row, one HTML body, and <code>python3 scripts/build.py</code>.</p>
<h2>The five decisions that unblock everything</h2>
<ol>
<li>Confirm link destinations &amp; rebuild them as Special Links (S-01) — gates monetization.</li>
<li>Confirm Associates account standing + this domain registered (Q-03) — gates attribution.</li>
<li>Pick the price/ratings data path (S-02: dated capture or Creators API) — gates comparison tables.</li>
<li>Provision the analytics endpoint (S-04) — gates measurement; the emitter waits, inert and honest.</li>
<li>Decide the authorship stance (S-09: desk bylines vs named human) — gates any “we tested” language, permanently.</li>
</ol>
"""
emit(
    "desk/index.html",
    1,
    render(
        desk_body,
        "Executive Summary | " + BRAND.capitalize(),
        "Where the Counterwise affiliate project stands: verification outcomes, the empty-by-design campaign ledger, and the five blocking decisions.",
        "desk/index.html",
        1,
    ),
)

q_rows = ""
for q in questions:
    if q["known_source"]:
        src = ext(q["known_source"], esc(q["known_source_label"]))
    else:
        src = '<span class="nosrc">no source exists yet — recorded as a gap</span>'
    q_rows += (
        "<tr><td class='qid'>" + q["id"] + "</td>"
        "<td class='qq'><b>" + esc(q["question"]) + "</b><span class='qmiss'>Missing: " + esc(q["missing"]) + "</span></td>"
        "<td>" + esc(q["known"]) + "<span class='qlink'>Checked against: " + src + "</span></td>"
        "<td>" + esc(q["how_to_find_out"]) + "</td>"
        "<td>" + esc(q["blocks"]) + "</td>"
        "<td><span class='status " + q["status"] + "'>" + q["status"].replace("-", " ") + "</span></td></tr>"
    )
q_body = (
    '<section class="page-hero"><div class="eyebrow">THE DESK · DECISION READINESS</div><h1>The questions register</h1>'
    '<p class="lede">Twelve questions stand between “a page that looks like a shop” and “decisions that survive a regulator.” '
    "Each row says what is known today (with the source that was actually checked), what is missing, and the concrete step that would fill it. "
    'Blanks are blanks — not zero, not guessed.</p></section>'
    '<div class="table-wrap"><table class="matrix t-src"><thead><tr><th>#</th><th>Question &amp; what’s missing</th><th>Known today (source-checked)</th><th>How to find out</th><th>What it blocks</th><th>Status</th></tr></thead><tbody>'
    + q_rows
    + "</tbody></table></div>"
    '<p class="footnote">Row standard: <i>partially-answered</i> means a dated observation exists but the authorized confirmation step (Associates account check, maker model match, CPSC search) has not run. <i>answered</i> is reserved for rows with a dated confirmation on record.</p>'
)
emit(
    "desk/questions.html",
    1,
    render(
        q_body,
        "Open Questions | " + BRAND.capitalize(),
        "The decision-readiness register: twelve questions, known facts with sources, discovery steps, and what each answer unlocks.",
        "desk/questions.html",
        1,
    ),
)

s_cards = ""
for s in suggestions:
    opts = "".join("<li>" + esc(o) + "</li>" for o in s["options"])
    rec = (
        '<p class="rec"><b>Recommended path:</b> ' + esc(s["recommended"]) + "</p>"
        if s.get("recommended")
        else ""
    )
    s_cards += f"""
<details class="sugg" id="{s["id"]}"{" open" if s["id"] in ("S-01", "S-05") else ""}>
<summary><span class="sugg-head"><b>{s["id"]} · {esc(s["title"])}</b><span class="status s{esc(s["status"])}">{esc(s["status"])}</span></span></summary>
<div class="sugg-body">
<div class="sugg-grid">
<p><b>Why</b><br>{esc(s["problem"])}</p>
<p><b>Impact</b><br>{esc(s["impact"])}</p>
<p><b>Effort</b><br>{esc(s["effort"])}</p>
<p><b>Risk</b><br>{esc(s["risk"])}</p>
</div>
<p class="opts"><b>Options</b></p><ul>{opts}</ul>
{rec}
<p class="prompt"><b>Feed-this-in prompt</b> — paste into the next design/build session to execute this path:<br><code>{esc(s["prompt"])}</code></p>
</div>
</details>"""
s_body = (
    '<section class="page-hero"><div class="eyebrow">THE DESK · PATHS, NOT VERDICTS</div><h1>The suggestion board</h1>'
    "<p class=\"lede\">Twelve proposals for where to take the site next — each states the problem, the options, the risk, "
    "and a copy-pasteable prompt that turns the chosen path into the next build. Nothing here is implemented unless its status says so; "
    "picking is how the site improves without becoming anyone's guesswork.</p></section>" + s_cards
    + '<p class="footnote">Statuses: <i>proposed</i> = awaiting a pick · <i>shipped-as-plan</i> = documented, not executed · <i>shipped</i> = live in this build. '
    "New suggestions are one JSON row in <code>site/data/suggestions.json</code>; the board rebuilds itself.</p>"
)
emit(
    "desk/suggestions.html",
    1,
    render(
        s_body,
        "Suggestion Board | " + BRAND.capitalize(),
        "Twelve reviewed paths for growing the Counterwise affiliate site — each with options, risk, and a ready-to-run implementation prompt.",
        "desk/suggestions.html",
        1,
    ),
)

# ---------------------------------------------------------------- review
prod_rows = ""
for p in products:
    blanks = "<td class='blank'></td><td class='blank'></td><td class='blank'></td><td class='blank'></td>"
    tok = (
        "<code>" + p["submitted_token"] + "</code><span class='tiny'>"
        + str(p["submitted_token_length"]) + " chars — see F-02</span>"
    )
    obs = (
        "<a href='" + esc(p["observed_redirect_target"]) + "' rel='sponsored noopener noreferrer' target='_blank'>"
        + p["observed_asin"] + "</a><span class='tiny'>observed " + esc(p["observed_on"])
        + " · anonymous fetch · fallback signature noted</span>"
    )
    maker = (
        ext(p["maker_site"], "maker site")
        if p["maker_site"]
        else "<span class='nosrc'>unidentified — flagged (F-04)</span>"
    )
    prod_rows += (
        "<tr><td>" + ext(p["submitted_url"], "submitted", sponsored=True) + "</td>"
        "<td>" + tok + "</td>" + blanks + "<td>" + obs + "</td>"
        "<td>" + maker + "</td>"
        "<td><span class='status open'>unverified — test in enrolled workflow</span></td></tr>"
    )

flag_rows = ""
for f in flags:
    if f["source_links"]:
        links = "".join(ext(sl["url"], esc(sl["label"])) + "<br>" for sl in f["source_links"])
    else:
        links = "<span class='nosrc'>observation recorded on this page</span>"
    sev = f["severity"].replace("-", " ")
    flag_rows += (
        "<tr><td class='qid'>" + f["id"] + "</td>"
        "<td class='qq'><b>" + esc(f["title"]) + "</b><p>" + esc(f["detail"]) + "</p>"
        "<p class='act'><b>Action:</b> " + esc(f["action_needed"]) + "</p></td>"
        "<td>" + links + "</td>"
        "<td><span class='status " + re.sub("[^a-z-]", "", f["severity"]) + "'>" + esc(sev) + "</span></td></tr>"
    )

policy_links = "".join(
    "<li>" + ext(url, label) + " — " + note + "</li>"
    for url, label, note in [
        ("https://affiliate-program.amazon.com/help/operating/agreement", "Amazon Associates Program Operating Agreement", "§5 fixes the disclosure sentence shown on every page; §12 incorporates the Program Policies."),
        ("https://affiliate-program.amazon.com/help/operating/policies", "Amazon Associates Program Policies", "linking and content rules to re-check before scaling any outbound link."),
        ("https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking", "FTC Endorsement Guides — What People Are Asking", "the “clear and conspicuous” standard for material connections; 2023 revision defines the term."),
        ("https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers", "FTC Disclosures 101 for Social Media Influencers", "practical placement guidance we follow for any future social republishing."),
        ("https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links", "Google — qualify your outbound links", "rel=\"sponsored\" is the documented value for paid/affiliate links; emitted structurally by our builder."),
        ("https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation", "PA-API 5 deprecation notice (official)", "the reason automation plans here target the Creators API — see F-05."),
        ("https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction", "Creators API introduction (official)", "entry point for the authorized product-data path in S-02."),
        ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers", "USDA FSIS — Food Thermometers", "source for every temperature stated in the probe guides."),
        ("https://www.cpsc.gov/Recalls", "CPSC — Recalls & Product Safety Warnings", "the pre-purchase and quarterly safety check the guides instruct."),
        ("https://validator.w3.org/feed/", "W3C Feed Validator", "the RSS output is checked with the canonical validator."),
        ("https://www.sitemaps.org/protocol.html", "Sitemap protocol (sitemaps.org)", "generated sitemap conforms to the protocol schema."),
    ]
)

r_body = f"""
<section class="page-hero"><div class="eyebrow">TRANSPARENCY · THE OPEN REGISTER</div><h1>What we know.<br>What we don't. Both, with dates.</h1><p class="lede">This is the machine room the shop is built on: the product-intent register (kept separate from observed redirects, by rule), the flagged irregularities, and the official sources every change is reviewed against. Blank means not verified — never zero, never guessed.</p></section>
<h2 id="products">Product-intent register</h2>
<div class="table-wrap"><table class="matrix t-src"><thead><tr><th>Submitted link</th><th>Token in link</th><th>Intended ASIN</th><th>Official listing URL</th><th>Confirmed on</th><th>Confirmed source</th><th>Observed redirect (separate field)</th><th>Maker domain</th><th>Status</th></tr></thead><tbody>{prod_rows}</tbody></table></div>
<p class="footnote">Intended and observed are deliberately different columns and may never be merged (brief rule; schema in <code>site/data/products.json</code>). Observed destinations were captured via anonymous automated fetch on {BUILD_DATE} and show a fallback-redirect signature — treat them as leads to confirm, not confirmations. Do not scale outbound links until one product's destination <i>and</i> tracked click are confirmed in the enrolled Associates workflow.</p>
<h2 id="flagged">Flagged for review</h2>
<div class="table-wrap"><table class="matrix t-src"><thead><tr><th>#</th><th>Finding, detail, required action</th><th>Sources checked</th><th>Severity</th></tr></thead><tbody>{flag_rows}</tbody></table></div>
<h2 id="disclosure">Disclosure &amp; policy review gates</h2>
<p>The disclosure strip appears above the content on every page of this build and again in the footer, using the exact sentence required by Operating Agreement §5. Every outbound product link is generated with <code>rel="sponsored"</code> by the builder — it cannot be forgotten page-by-page. On every push, CI runs <code>scripts/validate_site.py</code> as a hard gate: disclosure on 100% of pages, sponsored-rel coverage, internal-link integrity, sitemap/feed sync, register schema (including the intended-vs-observed separation), external-domain whitelist, and a rebuild-diff check that committed HTML matches the sources byte-for-byte. A failing gate blocks deploy; that is the entire point.</p>
<h3>Official sources used for review</h3>
<ul class="policy-list">{policy_links}</ul>
<p class="footnote">These are review references, not legal advice, and no external review of this site has been performed.</p>
<h2 id="scope">Scope &amp; provenance</h2>
<ul><li>The five submitted links and the tracking ID came from the project brief; they are inputs, not verified facts.</li><li>Listing titles, categories, and redirect observations were captured via platform fetch on {BUILD_DATE} and may be session-, region-, and time-dependent.</li><li>Maker-page statements (Chefman document library, CHEF iQ iQ Sense FAQ) were captured the same day from the brands' own domains.</li><li>Guide copy is editorial method, not endorsement; no product has been tested by this site, and no “we tested” claim is made anywhere.</li><li>Nothing on this register constitutes compliance certification; it is the evidence trail a reviewer would need to certify.</li></ul>
"""
emit(
    "review/index.html",
    1,
    render(
        r_body,
        "Evidence & Flagged for Review | " + BRAND.capitalize(),
        "Counterwise public evidence register: product-intent records, observed redirects, flagged irregularities with sources, and the policy gates each release is checked against.",
        "review/index.html",
        1,
    ),
)

# ---------------------------------------------------------------- SEO assets
def loc(path):
    if path == "index.html":
        return BASE + "/"
    if path.endswith("index.html"):
        return BASE + "/" + path[: -len("index.html")]
    return BASE + "/" + path


urls = "\n".join(
    "<url><loc>" + loc(p) + "</loc><lastmod>" + lm + "</lastmod></url>" for p, lm in pages
)
(OUT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls
    + "\n</urlset>\n",
    encoding="utf-8",
)


def pubdate(iso):
    return dt.date.fromisoformat(iso).strftime("%a, %d %b %Y 09:00:00 +0000")


items = "\n".join(
    "<item><title>" + esc(g["title"]) + "</title><link>" + BASE + "/guides/" + g["slug"] + ".html</link>"
    "<guid isPermaLink=\"true\">" + BASE + "/guides/" + g["slug"] + ".html</guid>"
    "<pubDate>" + pubdate(g["date"]) + "</pubDate>"
    "<description>" + esc(g["dek"]) + "</description></item>"
    for g in guides
)
(OUT / "feed.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
    "<title>" + esc(BRAND.capitalize() + " — The Buyer's Notebook") + "</title>"
    "<link>" + BASE + "/</link>"
    "<description>" + esc("Question-led buying guides for air fryers and food thermometers.") + "</description>"
    "<language>" + site["brand"]["language"] + "</language>"
    "<lastBuildDate>" + pubdate(BUILD_DATE) + "</lastBuildDate>"
    + items
    + "</channel></rss>\n",
    encoding="utf-8",
)

(OUT / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: " + BASE + "/sitemap.xml\n", encoding="utf-8")

print("built " + str(len(pages)) + " pages into " + str(OUT))

if CHECK:
    diff = []
    for p, _ in pages:
        a, b = ROOT / p, OUT / p
        if not a.exists():
            diff.append(p)
        elif a.read_bytes() != b.read_bytes():
            diff.append(p)
    for extra in ["sitemap.xml", "feed.xml", "robots.txt"]:
        if (ROOT / extra).read_bytes() != (OUT / extra).read_bytes():
            diff.append(extra)
    if diff:
        print("STALE BUILD — regenerate with: python3 scripts/build.py")
        print("\n".join(diff))
        sys.exit(1)
    print("check passed: committed output matches sources")
