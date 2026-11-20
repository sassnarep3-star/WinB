#!/usr/bin/env python3
"""Static site generator for Counterwise.

Standard library only. Run `python3 build.py` to write the site to ./site.
GitHub Pages serves the repository root from `main`; the build copies the
generated tree to the root paths Pages needs, so nothing has to change in
repository settings.
"""

import html
import json
import os
import re
import shutil
import sys
from datetime import date, datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from content import data as D  # noqa: E402

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "_build")

# Paths regenerated on every build. GitHub Pages serves the repository root of
# the default branch, so generated pages are published there after a build.
PUBLISHED = [
    "index.html", "404.html", "sitemap.xml", "feed.xml", "robots.txt",
    "air-fryers", "thermometers", "guides", "reviews", "dashboard",
    "suggestions", "about", "disclosures", "privacy",
]

NAV = [
    ("Air fryers", "/air-fryers/"),
    ("Thermometers", "/thermometers/"),
    ("Guides", "/guides/"),
    ("Reviews", "/reviews/"),
    ("About", "/about/"),
]

FOOTER_GROUPS = [
    ("Read", [
        ("Front page", "/"),
        ("Air fryers", "/air-fryers/"),
        ("Thermometers", "/thermometers/"),
        ("Guides", "/guides/"),
        ("Reviews", "/reviews/"),
    ]),
    ("The register", [
        ("Product register", "/dashboard/"),
        ("Source register", "/dashboard/sources.html"),
        ("Open questions", "/dashboard/questions.html"),
        ("Suggestions", "/suggestions/"),
        ("Flagged for review", "/dashboard/flags.html"),
    ]),
    ("About", [
        ("How this site works", "/about/"),
        ("Affiliate disclosure", "/disclosures/"),
        ("Privacy notice", "/privacy/"),
        ("Measurement", "/dashboard/analytics.html"),
        ("RSS feed", "/feed.xml"),
    ]),
]

PAGES = []  # (path, title, description, body, extra_head)


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def esc(s):
    return html.escape(str(s), quote=True)


def url(path):
    return D.BASE_URL + path


def rel_to_root(path):
    """Relative prefix from a page path back to the site root.

    Page paths are either "/" , a directory ("/guides/"), or a file inside one
    directory ("/guides/x.html"). The prefix therefore depends on the depth of
    the containing directory, not on whether the path ends in a slash.
    """
    if path.endswith("/"):
        directory = path
    else:
        directory = path.rsplit("/", 1)[0] + "/"
    depth = len([seg for seg in directory.split("/") if seg])
    return "../" * depth


def href(path, here):
    """Root-relative-to-page link, so the site works on a project Pages URL."""
    prefix = rel_to_root(here)
    tail = path.lstrip("/")
    if not tail:
        return prefix or "./"
    return prefix + tail


def pill(text, kind="open"):
    return f'<span class="pill pill--{kind}">{esc(text)}</span>'


def src_link(key, here):
    s = D.SOURCES.get(key)
    if not s:
        return '<span class="unverified">source missing</span>'
    return (
        f'<a class="src" href="{esc(s["url"])}" rel="nofollow noopener" target="_blank" '
        f'title="{esc(s["title"])} — {esc(s["publisher"])}">source</a>'
    )


def src_name(key):
    s = D.SOURCES.get(key)
    return s["publisher"] if s else "missing"


def product_by_slug(slug):
    for p in D.PRODUCTS:
        if p["slug"] == slug:
            return p
    raise KeyError(slug)


def sponsored_cta(p, here, label=None):
    """Every outbound product link is marked as sponsored, visibly."""
    label = label or "View the listing on Amazon"
    return (
        f'<a class="cta-sponsored" href="{esc(p["supplied_url"])}" '
        f'rel="sponsored noopener nofollow" target="_blank" '
        f'data-outbound="amazon" data-asin="{esc(p["asin_intended"])}" '
        f'data-product="{esc(p["slug"])}">{esc(label)} '
        f'<span class="tag">Sponsored</span></a>'
    )


# --------------------------------------------------------------------------
# layout
# --------------------------------------------------------------------------
def layout(here, title, description, body, canonical, extra_head="", body_class=""):
    nav_html = "".join(
        f'<li><a href="{href(h, here)}"'
        + (' aria-current="page"' if here.rstrip("/") == h.rstrip("/") or (here.startswith(h) and h != "/") else "")
        + f">{esc(t)}</a></li>"
        for t, h in NAV
    )

    footer_cols = ""
    for group, links in FOOTER_GROUPS:
        items = "".join(
            f'<li><a href="{esc(href(l, here))}">{esc(t)}</a></li>'
            for t, l in links
        )
        footer_cols += f"<div><h4>{esc(group)}</h4><ul>{items}</ul></div>"

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{esc(canonical)}">
<meta name="theme-color" content="#fbf7f0">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{esc(D.SITE_NAME)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:image" content="{esc(D.BASE_URL)}/assets/img/hero-countertop.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="{esc(D.SITE_NAME)}" href="{href('/feed.xml', here)}">
<link rel="stylesheet" href="{href('/assets/css/site.css', here)}">
<link rel="icon" href="{href('/assets/img/favicon.svg', here)}" type="image/svg+xml">
{extra_head}
</head>
<body class="{body_class}">
<a class="skip" href="#main">Skip to content</a>

<header class="masthead">
  <div class="wrap">
    <a class="brand" href="{href('/', here)}"><span class="mark" aria-hidden="true"></span>{esc(D.SITE_NAME)}<span>.</span></a>
    <nav class="nav" aria-label="Main">
      <ul>{nav_html}</ul>
    </nav>
  </div>
</header>

<!-- Disclosure strip: sits directly under the masthead, above the fold, on every page. -->
<div class="disclosure-strip" role="note" aria-label="Affiliate disclosure">
  <div class="wrap">
    <span><strong>{esc(D.DISCLOSURE_STATEMENT)}</strong></span>
    <span class="dot" aria-hidden="true">&middot;</span>
    <span>Product links on this page are sponsored. We do not display prices.</span>
    <span class="dot" aria-hidden="true">&middot;</span>
    <a href="{href('/disclosures/', here)}">How this works</a>
  </div>
</div>

<main id="main">
{body}
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="{href('/', here)}"><span class="mark" aria-hidden="true"></span>{esc(D.SITE_NAME)}<span>.</span></a>
        <p class="about">{esc(D.SITE_TAGLINE)} An independent kitchen-gear publication that compares published specifications and tells you what it has not verified.</p>
      </div>
      {footer_cols}
    </div>
    <div class="footer-disclosure">
      <strong>{esc(D.DISCLOSURE_STATEMENT)}</strong>
      {esc(D.SITE_NAME)} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
      Product links open Amazon listings and are marked sponsored. This site does not display prices, star ratings, or review counts.
      <a href="{href('/disclosures/', here)}">Full disclosure</a>.
    </div>
    <div class="footer-bottom">
      <span>&copy; {date.today().year} {esc(D.SITE_NAME)}. Specification comparisons only — no product on this site has been hands-on tested.</span>
      <span><a href="{href('/dashboard/flags.html', here)}">Flagged for review</a> &middot; <a href="{href('/dashboard/questions.html', here)}">Open questions</a></span>
    </div>
  </div>
</footer>
<script src="{href('/assets/analytics.js', here)}" defer></script>
</body>
</html>
"""


def add_page(path, title, description, body, extra_head="", body_class=""):
    PAGES.append({
        "path": path,
        "title": title,
        "description": description,
        "body": body,
        "extra_head": extra_head,
        "body_class": body_class,
    })


def write(path, text):
    if path.endswith("/"):
        path += "index.html"
    full = os.path.join(OUT, path.lstrip("/"))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(text)


# --------------------------------------------------------------------------
# front page
# --------------------------------------------------------------------------
def build_home():
    here = "/"
    lead = D.GUIDES[0]

    products_html = ""
    for p in D.PRODUCTS[:3]:
        products_html += f"""
        <article class="product">
          <div class="rank">No. {p['rank']} &middot; {esc(p['category'])}</div>
          <h3><a href="{href('/reviews/' + p['slug'] + '.html', here)}">{esc(p['short_name'])}</a></h3>
          <p class="brandline">{esc(p['brand'])} &middot; {esc(p['form_factor'])}{' &middot; ' + esc(p['capacity']) if p['capacity'] != 'n/a' else ''}</p>
          <p class="why">{esc(p['headline_claim'])}</p>
          <div class="foot">{sponsored_cta(p, here)}</div>
        </article>"""

    guides_html = ""
    for g in D.GUIDES[1:5]:
        guides_html += f"""
        <a class="card card--link" href="{href('/guides/' + g['slug'] + '.html', here)}">
          <p class="eyebrow">{esc(g['read'])} min read</p>
          <h3>{esc(g['title'])}</h3>
          <p>{esc(g['dek'])}</p>
          <span class="more">Read the guide &rarr;</span>
        </a>"""

    body = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="kicker">Kitchen gear, no theatre</p>
      <h1>Decide which air fryer, then stop reading.</h1>
      <p class="dek">We compare the specifications that actually change how dinner goes &mdash; basket width, door clearance, probe thinness &mdash; and tell you plainly what nobody has tested. No scores out of ten. No invented prices.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="{href('/guides/' + lead['slug'] + '.html', here)}">Start with the big question</a>
        <a class="btn btn-ghost" href="{href('/dashboard/', here)}">See everything we checked</a>
      </div>
    </div>
    <div class="hero-img">
      <img src="{href('/assets/img/hero-countertop.jpg', here)}" width="1400" height="910"
           alt="A basket air fryer and a countertop oven on a light wooden board beside a digital meat thermometer, in a warm kitchen.">
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="lead">
      <div class="copy">
        <p class="kicker">The question we hear most</p>
        <h2>{esc(lead['title'])}</h2>
        <p>{esc(lead['dek'])}</p>
        <a class="btn btn-primary" href="{href('/guides/' + lead['slug'] + '.html', here)}">Read the comparison</a>
      </div>
      <div class="tile">
        <p class="eyebrow" style="margin:0">What it settles</p>
        <ul>
          <li>Why litres on the box do not equal dinner on the plate.</li>
          <li>When two drawers beat one big basket, and what that costs.</li>
          <li>The three measurements to take before you order.</li>
          <li>Where the grease goes, and how many parts you will wash.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">Two categories, five products</p>
        <h2>Browse by what you are deciding</h2>
      </div>
      <p>Every product page lists the two or three specifications that decide the purchase, and flags anything we could not confirm from an official source.</p>
    </div>
    <div class="grid grid-2">
      <a class="card card--link cat-card" href="{href('/air-fryers/', here)}">
        <img src="{href('/assets/img/cat-air-fryers.jpg', here)}" width="1400" height="788" alt="Line illustration of a dual-basket air fryer and an oven-style air fryer side by side.">
        <div class="body">
          <p class="eyebrow">3 products</p>
          <h3>Air fryers</h3>
          <p>Dual basket, single basket, and countertop oven. The difference is the shape of the cavity, not the wattage.</p>
          <span class="more">Compare air fryers &rarr;</span>
        </div>
      </a>
      <a class="card card--link cat-card" href="{href('/thermometers/', here)}">
        <img src="{href('/assets/img/cat-thermometers.jpg', here)}" width="1400" height="788" alt="Ink illustration of an instant-read thermometer and a wireless probe thermometer with a charging base.">
        <div class="body">
          <p class="eyebrow">2 products</p>
          <h3>Thermometers</h3>
          <p>Instant-read checks a temperature. A wireless probe watches it. Buying the wrong one is the common mistake.</p>
          <span class="more">Compare thermometers &rarr;</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">The shortlist</p>
        <h2>Three air fryers, three different trade-offs</h2>
      </div>
      <p>Ranked by how often the trade-off comes up for a household of two to four &mdash; an editorial ordering, not a sales ranking.</p>
    </div>
    <div class="grid grid-3">{products_html}</div>
    <p class="link-note" style="margin-top:16px">Prices and star ratings are deliberately not shown. Amazon permits displaying them only when Amazon serves the data or it arrives through the Product Advertising API with a timestamp. <a href="{href('/dashboard/flags.html', here)}">Why we leave them out</a>.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">Guides</p>
        <h2>Read the question before the product</h2>
      </div>
      <a class="btn btn-ghost" href="{href('/guides/', here)}">All guides</a>
    </div>
    <div class="grid grid-2">{guides_html}</div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">The register</p>
        <h2>Everything we checked, in public</h2>
      </div>
      <p>Four surfaces, each dated. If a number is missing, the page says why rather than filling it in.</p>
    </div>
    <div class="grid grid-4">
      <a class="card card--link" href="{href('/dashboard/', here)}">
        <p class="eyebrow">Data</p><h3>Product register</h3>
        <p>Five products, intended ASIN, supplied link, and the target it actually resolved to. Blank cells are flagged.</p>
      </a>
      <a class="card card--link" href="{href('/dashboard/sources.html', here)}">
        <p class="eyebrow">{len(D.SOURCES)} documents</p><h3>Source register</h3>
        <p>Every policy, listing, and public guidance document used, with its publisher and the date we read it.</p>
      </a>
      <a class="card card--link" href="{href('/dashboard/flags.html', here)}">
        <p class="eyebrow">{len(D.FLAGS)} items</p><h3>Flagged for review</h3>
        <p>What is unresolved, why it matters, and what we are specifically not claiming about it.</p>
      </a>
      <a class="card card--link" href="{href('/suggestions/', here)}">
        <p class="eyebrow">{len(D.SUGGESTIONS)} proposals</p><h3>Suggestions</h3>
        <p>Proposed changes with the trade-off of each and the alternative paths open to you.</p>
      </a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="callout callout--info">
      <h3>What this site will not do</h3>
      <p>It will not tell you a machine is the best, because nobody here has cooked in one. It will not show a price it cannot keep current, or a star rating it is not licensed to reproduce. It will not rank a product higher because the commission is better &mdash; the ordering is editorial and stated as such.</p>
      <p>What it will do is put the deciding specifications in one place, name the compromise each machine makes, and publish a dated list of everything still unverified. <a href="{href('/dashboard/questions.html', here)}">There are twelve open questions</a> &mdash; they are public.</p>
    </div>
  </div>
</section>
"""
    add_page("/", f"{D.SITE_NAME} — kitchen gear, judged on the trade-offs",
             "Specification comparisons for air fryers and meat thermometers. We name the trade-off each machine makes and flag what we have not verified. Sponsored Amazon links, disclosed above the fold.",
             body)


# --------------------------------------------------------------------------
# category hubs
# --------------------------------------------------------------------------
def build_category(slug, title, dek, intro, cat_img, alt, cat_name):
    here = f"/{slug}/"
    items = [p for p in D.PRODUCTS if p["category"] == cat_name]
    cards = ""
    for p in items:
        cards += f"""
        <article class="product">
          <div class="rank">No. {p['rank']}</div>
          <h3><a href="{href('/reviews/' + p['slug'] + '.html', here)}">{esc(p['short_name'])}</a></h3>
          <p class="brandline">{esc(p['brand'])} &middot; {esc(p['form_factor'])}{' &middot; ' + esc(p['capacity']) if p['capacity'] != 'n/a' else ''}</p>
          <p class="why">{esc(p['headline_claim'])}</p>
          <ul class="specs">
            <li><b>Decides</b><span>{esc(p['compare_on'][0])}</span></li>
          </ul>
          <a class="more" href="{href('/reviews/' + p['slug'] + '.html', here)}">Full spec sheet &rarr;</a>
          <div class="foot">{sponsored_cta(p, here, 'View on Amazon')}</div>
        </article>"""

    related = "".join(
        f'<li><a href="{href("/guides/" + g["slug"] + ".html", here)}">{esc(g["title"])}</a></li>'
        for g in D.GUIDES
        if cat_name.lower().split()[0][:4] in (g["title"] + g["keywords"] + g["dek"]).lower()
    )

    body = f"""
<section class="hero" style="padding-bottom:20px">
  <div class="wrap hero-grid">
    <div>
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> &nbsp;/&nbsp; {esc(title)}</p>
      <p class="kicker">{len(items)} products compared</p>
      <h1>{esc(title)}</h1>
      <p class="dek">{esc(dek)}</p>
    </div>
    <div class="hero-img">
      <img src="{href(cat_img, here)}" width="1400" height="788" alt="{esc(alt)}">
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="prose" style="max-width:820px">{intro}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow">The shortlist</p><h2>What we compare, and why</h2></div>
      <p>Ordering is editorial. Only specifications stated on the Amazon listing are reproduced.</p>
    </div>
    <div class="grid grid-3">{cards}</div>
    <p class="link-note" style="margin-top:16px">No prices or star ratings appear here. <a href="{href('/dashboard/flags.html', here)}">Reason</a>.</p>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap narrow">
    <p class="eyebrow">Read next</p>
    <h2 style="font-family:var(--serif);letter-spacing:-.015em;margin:0 0 14px">The questions these products answer</h2>
    <ul style="font-size:16px;line-height:1.7">{related or '<li><a href="' + href('/guides/', here) + '">All guides</a></li>'}</ul>
  </div>
</section>
"""
    add_page(here, f"{title} — {D.SITE_NAME}", dek, body)


def build_categories():
    build_category(
        "air-fryers",
        "Air fryers",
        "Three machines, three shapes: two drawers, one big basket, or a door that opens like an oven.",
        """<p>An air fryer is a small, fast convection oven. Everything that differs between models follows from the shape of the cavity and how much air it moves.</p>
        <p>So that is what we compare. A dual-basket machine gives you two temperatures at once, at the cost of width per drawer. A single 8-quart basket takes wider, flatter things. A French-door oven takes a whole chicken and a tray of vegetables together, and asks for counter depth and door clearance in return.</p>
        <p>Capacity in quarts is the least useful number on the box, because it describes volume and you cook on area. Each product page below starts with the specification that decides the purchase rather than the one that reads best in a listing title.</p>""",
        "/assets/img/cat-air-fryers.jpg",
        "Line illustration of a dual-basket air fryer and an oven-style air fryer side by side.",
        "Air fryers",
    )
    build_category(
        "thermometers",
        "Thermometers",
        "An instant-read answers a question. A wireless probe watches and waits. They are not substitutes.",
        """<p>There are two jobs in a kitchen thermometer and they pull in opposite directions. Checking whether something is done needs speed and a thin probe, because you are opening a hot oven and want to close it again. Monitoring something for an hour needs range, a leave-in probe, and a battery that lasts.</p>
        <p>What neither job needs is a decimal place of precision beyond the guidance. The USDA Food Safety and Inspection Service publishes the minimum internal temperatures: poultry to 165&nbsp;&deg;F, ground meats to 160&nbsp;&deg;F, whole cuts of beef, pork, veal and lamb to 145&nbsp;&deg;F with a three-minute rest, fish and shellfish to 145&nbsp;&deg;F, and leftovers to 165&nbsp;&deg;F. Those are the numbers that matter, and they cost nothing to learn.</p>
        <p>The five minutes you save by learning them are better spent than the fifty dollars you spend upgrading a probe. Both products below are judged on how well they do the job, not on the certification phrases in their listing titles &mdash; which we have not independently confirmed.</p>""",
        "/assets/img/cat-thermometers.jpg",
        "Ink illustration of an instant-read thermometer and a wireless probe thermometer with a charging base.",
        "Thermometers",
    )


# --------------------------------------------------------------------------
# reviews
# --------------------------------------------------------------------------
def build_reviews():
    here = "/reviews/"
    cards = ""
    for p in D.PRODUCTS:
        cards += f"""
        <article class="product">
          <div class="rank">No. {p['rank']} &middot; {esc(p['category'])}</div>
          <h3><a href="{href('/reviews/' + p['slug'] + '.html', here)}">{esc(p['short_name'])}</a></h3>
          <p class="brandline">{esc(p['brand'])} &middot; {esc(p['form_factor'])}</p>
          <p class="why">{esc(p['headline_claim'])}</p>
          <div class="foot">{sponsored_cta(p, here)}</div>
        </article>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> &nbsp;/&nbsp; Reviews</p>
      <h1>Every product, side by side</h1>
      <p>Five products, each with the specification that decides the purchase and a dated list of what we could not confirm. None of these has been hands-on tested &mdash; the pages say so, and the spec sheets show their sources.</p>
    </div>
    <div class="grid grid-3">{cards}</div>
  </div>
</section>
"""
    add_page(here, f"All reviews — {D.SITE_NAME}",
             "Five air fryers and thermometers, each judged on the specification that decides the purchase, with sources and unverified fields listed.",
             body)


def build_review_page(p):
    here = f"/reviews/{p['slug']}.html"
    compare = "".join(f"<li>{esc(c)}</li>" for c in p["compare_on"])
    unver = "".join(f"<li>{esc(u)}</li>" for u in p["unverified"]) or "<li>Nothing outstanding.</li>"

    # specification table: every row carries a source or a flag
    rows = [
        ("Brand", p["brand"], p["title_source"]),
        ("Model / listing title", p["title"], p["title_source"]),
        ("Form factor", p["form_factor"], p["title_source"]),
        ("Capacity", p["capacity"] if p["capacity"] != "n/a" else None,
         p["capacity_source"]),
        ("Marketplace", p["marketplace"], p["marketplace_source"]),
        ("Category path", p["breadcrumb"], p["breadcrumb_source"]),
        ("ASIN (intended)", p["asin_intended"], p["asin_source"]),
        ("Supplied link", p["supplied_url"], "S-LINK-" + p["supplied_url"].rsplit("/", 1)[-1]),
        ("Observed redirect target", p["observed_destination"], p["observed_destination_source"]),
        ("Associates tag on observed target", None, None),
        ("Current price", None, None),
        ("Star rating / review count", None, None),
    ]
    spec_rows = ""
    for label, value, source in rows:
        if value:
            cell = f"<code>{esc(value)}</code>" if label.startswith(("ASIN", "Supplied", "Observed")) else esc(value)
            src = src_link(source, here) if source else ""
        else:
            if label == "Associates tag on observed target":
                cell = '<span class="blank">&mdash; not present</span>'
                src = src_link(p["observed_destination_source"], here)
            else:
                cell = '<span class="unverified">unverified</span>'
                src = ""
        spec_rows += f"<tr><th scope=\"row\">{esc(label)}</th><td>{cell}</td><td>{src}</td></tr>"

    others = [q for q in D.PRODUCTS if q["slug"] != p["slug"] and q["category"] == p["category"]]
    other_html = "".join(
        f'<li><a href="{href("/reviews/" + o["slug"] + ".html", here)}">{esc(o["short_name"])}</a> &mdash; {esc(o["headline_claim"])}</li>'
        for o in others
    )

    body = f"""
<section class="article">
  <div class="wrap">
    <div class="article-header">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/' + ('air-fryers' if p['category']=='Air fryers' else 'thermometers') + '/', here)}">{esc(p['category'])}</a> / {esc(p['short_name'])}</p>
      <p class="kicker">No. {p['rank']} in {esc(p['category'])}</p>
      <h1>{esc(p['short_name'])}</h1>
      <p class="dek">{esc(p['headline_claim'])}</p>
      <div class="byline">
        <span><b>Reviewed by</b> Counterwise editorial</span>
        <span><b>Basis</b> published specifications only</span>
        <span><b>Updated</b> {esc(D.RETRIEVED)}</span>
        <span><b>Hands-on testing</b> none</span>
      </div>
    </div>

    <div class="callout callout--flag">
      <h3>We have not used this product</h3>
      <p>No one at {esc(D.SITE_NAME)} has cooked with, measured, or handled this machine. Everything below comes from the product's own Amazon listing, reproduced without embellishment and linked back to the source. That is a weaker basis than testing, and saying so is the honest version.</p>
    </div>

    <div class="prose">
      <h2>What this machine decides</h2>
      <p>{esc(p['headline_claim'])}</p>
      <p>{esc(p['verdict'])}</p>

      <h2>What to compare it on</h2>
      <ol>{compare}</ol>

      <h2>Specifications, with sources</h2>
    </div>

    <div class="table-scroll" style="max-width:860px">
      <table>
        <caption>Every populated row links to the official source it came from. Blank rows are flagged, never filled in.</caption>
        <thead><tr><th scope="col">Field</th><th scope="col">Value</th><th scope="col">Source</th></tr></thead>
        <tbody>{spec_rows}</tbody>
      </table>
    </div>

    <div class="prose" style="margin-top:34px">
      <h2>What we could not confirm</h2>
      <ul>{unver}</ul>

      <h2>Get it</h2>
      <p>This link is a sponsored affiliate link. It opens the Amazon listing in a new tab. If you buy through it, this site may earn a commission at no extra cost to you.</p>
      <p>{sponsored_cta(p, here, 'View the ' + p['brand'] + ' listing')}</p>
      <p class="link-note">No price is shown because Amazon permits price display only when Amazon serves the data or it comes from the Product Advertising API with a timestamp. <a href="{href('/dashboard/flags.html', here)}">Details</a>.</p>

      {'<h2>Also in ' + esc(p['category']) + '</h2><ul>' + other_html + '</ul>' if other_html else ''}
    </div>
  </div>
</section>
"""
    add_page(here, f"{p['short_name']} — specifications and trade-offs | {D.SITE_NAME}",
             p["headline_claim"] + " Specifications, sources, and unverified fields listed. Sponsored Amazon link, disclosed.",
             body)


# --------------------------------------------------------------------------
# guides
# --------------------------------------------------------------------------
def build_guides_index():
    here = "/guides/"
    cards = ""
    for g in D.GUIDES:
        cards += f"""
        <a class="card card--link" href="{href('/guides/' + g['slug'] + '.html', here)}">
          <p class="eyebrow">{esc(g['read'])} min read &middot; Updated {esc(g['updated'])}</p>
          <h3>{esc(g['title'])}</h3>
          <p>{esc(g['dek'])}</p>
          <span class="more">Read &rarr;</span>
        </a>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> &nbsp;/&nbsp; Guides</p>
      <h1>Guides</h1>
      <p>Five articles, each built around one question a buyer gets stuck on. These are working titles written from what the specifications suggest people need to weigh &mdash; not claims about search volume, popularity, or which product is superior.</p>
    </div>
    <div class="grid grid-2">{cards}</div>
    <div class="callout callout--info" style="margin-top:34px">
      <h3>On the titles</h3>
      <p>Question-shaped titles are a guess about what will be findable, not a finding. The first Search Console report will say whether the guess was right, and the topic list will change on the evidence rather than on instinct. That plan is tracked as <a href="{href('/dashboard/analytics.html', here)}">measurement</a> and <a href="{href('/dashboard/questions.html', here)}">open question Q-05</a>.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Guides — {D.SITE_NAME}",
             "Five question-shaped guides on air fryer shape, capacity, cleanup, multi-function appliances, and thermometers.",
             body)


def build_guide_page(g):
    here = f"/guides/{g['slug']}.html"
    toc = "".join(
        f'<li><a href="#s{i+1}">{esc(t)}</a></li>' for i, (t, _) in enumerate(g["sections"])
    )
    secs = ""
    for i, (title, paras) in enumerate(g["sections"]):
        secs += f'<h2 id="s{i+1}">{esc(title)}</h2>' + "".join(f"<p>{p}</p>" for p in paras)

    prods = [product_by_slug(s) for s in g["products"]]
    prod_html = ""
    for p in prods:
        prod_html += f"""
        <article class="product">
          <div class="rank">{esc(p['category'])} &middot; No. {p['rank']}</div>
          <h3><a href="{href('/reviews/' + p['slug'] + '.html', here)}">{esc(p['short_name'])}</a></h3>
          <p class="why">{esc(p['headline_claim'])}</p>
          <div class="foot">{sponsored_cta(p, here, 'View on Amazon')}</div>
        </article>"""

    src_list = "".join(
        f'<li>{esc(D.SOURCES[k]["publisher"])} &mdash; <a href="{esc(D.SOURCES[k]["url"])}" rel="nofollow noopener" target="_blank">{esc(D.SOURCES[k]["title"])}</a></li>'
        for k in g["sources"] if k in D.SOURCES
    )

    extra = f"""<meta property="article:published_time" content="{esc(g['updated'])}">
<script type="application/ld+json">{json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": g["title"],
        "description": g["dek"],
        "datePublished": g["updated"],
        "dateModified": g["updated"],
        "author": {"@type": "Organization", "name": D.SITE_NAME},
        "publisher": {"@type": "Organization", "name": D.SITE_NAME},
        "mainEntityOfPage": url("/guides/" + g["slug"] + ".html"),
        "isAccessibleForFree": True,
    })}</script>"""

    body = f"""
<section class="article">
  <div class="wrap">
    <div class="article-header">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/guides/', here)}">Guides</a></p>
      <h1>{esc(g['title'])}</h1>
      <p class="dek">{esc(g['dek'])}</p>
      <div class="byline">
        <span><b>By</b> Counterwise editorial</span>
        <span><b>Updated</b> {esc(g['updated'])}</span>
        <span><b>Reading time</b> <span class="reading-time">{g['read']} min</span></span>
        <span><b>Basis</b> published specifications and public guidance</span>
      </div>
    </div>

    <div class="toc">
      <h2>In this guide</h2>
      <ol>{toc}</ol>
    </div>

    <div class="prose">
      {secs}
      <hr>
      <h2>The short version</h2>
      <p>{esc(g['closing'])}</p>
      <p><em>This guide compares published specifications and public safety guidance. No product mentioned has been hands-on tested by {esc(D.SITE_NAME)}.</em></p>

      <h2>Products this guide touches</h2>
    </div>
    <div class="grid grid-3" style="margin-bottom:34px">{prod_html}</div>

    <div class="prose">
      <h2>Sources</h2>
      <ul style="font-size:14.5px">{src_list}</ul>
      <p class="link-note">All links above open the publisher's own page. Every product link on this site is a sponsored Amazon affiliate link, marked as such.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"{g['title']} | {D.SITE_NAME}", g["dek"], body, extra_head=extra)


# --------------------------------------------------------------------------
# dashboard / registers
# --------------------------------------------------------------------------
def build_dashboard():
    here = "/dashboard/"
    rows = ""
    for p in D.PRODUCTS:
        unver = len(p["unverified"])
        rows += f"""
        <tr>
          <td>{p['rank']}</td>
          <td><a href="{href('/reviews/' + p['slug'] + '.html', here)}">{esc(p['short_name'])}</a><br><span class="link-note">{esc(p['brand'])}</span></td>
          <td>{esc(p['category'])}<br><span class="link-note">{esc(p['form_factor'])}</span></td>
          <td><code>{esc(p['asin_intended'])}</code><br>{src_link(p['asin_source'], here)}</td>
          <td><code>{esc(p['supplied_url'])}</code><br>{src_link("S-LINK-" + p['supplied_url'].rsplit('/',1)[-1], here)}</td>
          <td><code>{esc(p['observed_destination'].replace('https://www.amazon.com',''))}</code><br>{src_link(p['observed_destination_source'], here)}</td>
          <td>{pill('none found', 'flag')}</td>
          <td>{pill('unverified', 'flag')}</td>
          <td>{pill('unverified', 'flag')}</td>
          <td>{'<span class="unverified">' + str(unver) + ' open</span>' if unver else '—'}</td>
        </tr>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> &nbsp;/&nbsp; Register</p>
      <h1>Product register</h1>
      <p>The same five products as the shop pages, laid out as data. Each row separates what the link was supposed to point to from what it actually pointed to on the retrieval date, and leaves a value blank rather than guessing when an official source does not state it.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="n">5</div><div class="l">Products</div><div class="note">All links resolved</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Links with a tag</div><div class="note">Attribution unresolved</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Prices published</div><div class="note">Policy-driven</div></div>
      <div class="stat"><div class="n">{len(D.FLAGS)}</div><div class="l">Open flags</div><div class="note">Non-blocking</div></div>
    </div>

    <div class="callout callout--flag">
      <h3>Read the tag column before anything else</h3>
      <p>All five supplied short links resolve to the correct product pages, and none of the resolved URLs carried an Associates tag. Amazon pays commission only on clicks through tagged Special Links. We are not calling the supplied links invalid &mdash; the shortener is Amazon's own, and its behaviour may add attribution that a URL does not show. The status is recorded as unresolved, not as a finding of failure. This is <a href="{href('/dashboard/flags.html#FLG-003', here)}">FLG-003</a>.</p>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:30px 0 12px">Products</h2>
    <div class="table-scroll">
      <table>
        <caption>Retrieved {esc(D.RETRIEVED)}. All product sources are Amazon.com listing pages; all link sources are the supplied redirect URLs.</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col">ASIN intended</th>
            <th scope="col">Supplied link</th>
            <th scope="col">Observed target</th>
            <th scope="col">Tag on target</th>
            <th scope="col">Price</th>
            <th scope="col">Rating</th>
            <th scope="col">Unverified</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:40px 0 12px">Detailed fields</h2>
    <div class="table-scroll">
      <table>
        <caption>Values reproduced only where the listing states them. Capacity is listed where the product page states it; thermometers use capacity "n/a" rather than a made-up figure.</caption>
        <thead><tr><th scope="col">Product</th><th scope="col">Form</th><th scope="col">Capacity</th><th scope="col">Capacity source</th><th scope="col">Marketplace</th><th scope="col">Category path</th></tr></thead>
        <tbody>
        {''.join(f'''
          <tr>
            <td>{esc(p['short_name'])}</td>
            <td>{esc(p['form_factor'])}</td>
            <td>{esc(p['capacity']) if p['capacity'] != 'n/a' else '<span class="blank">n/a</span>'}</td>
            <td>{src_link(p['capacity_source'], here) if p['capacity_source'] else '<span class="blank">n/a</span>'}</td>
            <td>{esc(p['marketplace'])}</td>
            <td>{esc(p['breadcrumb'])}</td>
          </tr>''' for p in D.PRODUCTS)}
        </tbody>
      </table>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:40px 0 12px">What the register does not contain</h2>
    <div class="prose">
      <ul>
        <li><b>No prices.</b> Amazon permits price display only when Amazon serves the link containing the data, or when it arrives through the Product Advertising API with a required date/time stamp and disclaimer. Neither applies, so every price cell is empty rather than stale. <a href="{href('/dashboard/flags.html#FLG-002', here)}">FLG-002</a></li>
        <li><b>No star ratings or review counts.</b> Same rule: customer reviews and ratings may be displayed only when obtained through the Creators API or PA API.</li>
        <li><b>No Best Seller Rank, sales volume, or conversion rate.</b> None of these appear on a product page, and none may be invented.</li>
        <li><b>No keyword volumes.</b> No search-volume source has been consulted in this pass, so no demand figure appears anywhere.</li>
        <li><b>No conversion or revenue forecast.</b> Only Amazon's own reports can supply orders. The campaign ledger starts empty and stays empty until a first-party report fills it.</li>
      </ul>
      <p><a href="{href('/dashboard/sources.html', here)}">See the full source register &rarr;</a></p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Product register — {D.SITE_NAME}",
             "Every product with its intended ASIN, supplied link, observed redirect target, and unverified fields. Blank rather than inferred.",
             body)


def build_sources():
    here = "/dashboard/sources.html"
    rows = ""
    for key, s in D.SOURCES.items():
        rows += f"""
        <tr>
          <td><code>{esc(key)}</code></td>
          <td><a href="{esc(s['url'])}" rel="nofollow noopener" target="_blank">{esc(s['title'])}</a></td>
          <td>{esc(s['publisher'])}</td>
          <td>{esc(s['updated']) if s.get('updated') else '<span class="blank">not stated</span>'}</td>
          <td>{esc(s['retrieved'])}</td>
          <td>{esc(s['used_for'])}</td>
        </tr>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/dashboard/', here)}">Register</a></p>
      <h1>Source register</h1>
      <p>{len(D.SOURCES)} sources. Every factual claim on this site traces to one of them. Each was opened and read on {esc(D.RETRIEVED)}; nothing is cited from memory or from a secondary summary.</p>
    </div>

    <div class="callout callout--ok">
      <h3>How a row earns a source</h3>
      <p>A source is listed only if the exact sentence or number used appears on the page it links to. Where a publisher states an update date, it is recorded. Where a page carries no visible update date, the cell says so rather than leaving a blank that looks like an oversight.</p>
    </div>

    <div class="table-scroll">
      <table>
        <caption>Retrieved {esc(D.RETRIEVED)}. Product and link sources are grouped at the end.</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Document</th><th scope="col">Publisher</th><th scope="col">Updated</th><th scope="col">Retrieved</th><th scope="col">Used for</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>

    <div class="prose" style="margin-top:34px">
      <h2>Sources deliberately not used</h2>
      <ul>
        <li><b>Affiliate blogs and how-to sites.</b> Several rank well and restate Amazon's commission rules. Restating a rule is not the rule; only Associates Central was used for programme policy.</li>
        <li><b>Keyword and commission calculators.</b> No search-volume or rate figure from a third-party tool is reproduced, because none can be verified against a first-party source here.</li>
        <li><b>Cached or archived copies.</b> Policies change. Only live publisher pages were read.</li>
      </ul>
      <h2>Re-verification</h2>
      <p>Amazon's Operating Agreement and Program Policies both carry update dates, and the rate schedule can change without notice. Re-open each policy link and the five product links on the first of each month, then update the "Retrieved" column. A stale register is more dangerous than an empty one.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Source register — {D.SITE_NAME}",
             "Every source used on this site with publisher, update date, retrieval date, and what it supports.",
             body)


def build_questions():
    here = "/dashboard/questions.html"
    groups = {}
    for q in D.QUESTIONS:
        groups.setdefault(q["group"], []).append(q)

    sections = ""
    for group, qs in groups.items():
        items = ""
        for q in qs:
            items += f"""
            <div class="qa">
              <h3><span class="qid">{esc(q['id'])}</span> {esc(q['question'])}</h3>
              <dl>
                <dt>We have</dt><dd>{esc(q['have'])}</dd>
                <dt>We do not have</dt><dd>{esc(q['missing'])}</dd>
                <dt>What it blocks</dt><dd>{esc(q['blocks'])}</dd>
                <dt>How to get it</dt><dd>{esc(q['how_to_get'])}</dd>
                <dt>Linked flag</dt><dd>{('<a href="' + href('/dashboard/flags.html#' + q['flag'], here) + '">' + esc(q['flag']) + '</a>') if q['flag'] else '<span class="blank">none</span>'}</dd>
              </dl>
            </div>"""
        sections += f"""
        <h2 style="font-family:var(--serif);font-size:23px;margin:36px 0 6px">{esc(group)}</h2>
        <div class="card" style="padding:6px 24px">{items}</div>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/dashboard/', here)}">Register</a></p>
      <h1>Open questions</h1>
      <p>Twelve things that must be answered before a decision is reasonable. Each one separates what we already know from what we do not, states what it blocks, and says where the answer comes from. None of these are rhetorical &mdash; every one of them changes what gets built next.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="n">{len(D.QUESTIONS)}</div><div class="l">Open</div><div class="note">None closed in this pass</div></div>
      <div class="stat"><div class="n">{len([q for q in D.QUESTIONS if q['group']=='Money'])}</div><div class="l">Block revenue</div><div class="note">Answer before promoting</div></div>
      <div class="stat"><div class="n">{len([q for q in D.QUESTIONS if q['flag']])}</div><div class="l">Tied to a flag</div><div class="note">See flagged page</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Answered from guesswork</div><div class="note">By design</div></div>
    </div>

    <div class="callout callout--info">
      <h3>Why this page exists rather than an answer</h3>
      <p>Several of these questions can only be answered from inside an Amazon Associates account or from a Search Console property, neither of which is reachable from here. Writing a plausible answer into the site would make it look finished and be wrong. The register keeps the gap visible so the next decision is made on evidence.</p>
    </div>

    {sections}
  </div>
</section>
"""
    add_page(here, f"Open questions — {D.SITE_NAME}",
             "Twelve unanswered questions that block reasonable decisions, each with what we know, what is missing, and where the answer comes from.",
             body)


def build_flags():
    here = "/dashboard/flags.html"
    cards = ""
    sev = {"high": ("flag", "High"), "medium": ("warn", "Medium"), "low": ("open", "Low")}
    for f in D.FLAGS:
        kind, label = sev[f["severity"]]
        srcs = "".join(
            f'<li>{esc(D.SOURCES[k]["publisher"])} &mdash; <a href="{esc(D.SOURCES[k]["url"])}" rel="nofollow noopener" target="_blank">{esc(D.SOURCES[k]["title"])}</a></li>'
            for k in f["sources"] if k in D.SOURCES
        ) or "<li>No external source — this is an observation about this repository.</li>"
        cards += f"""
        <article class="card" id="{esc(f['id'])}" style="margin-bottom:18px">
          <header style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
            {pill(f['id'], 'mono')}
            {pill(label, kind)}
            {pill(f['status'], 'open')}
          </header>
          <h3 style="margin-top:0">{esc(f['title'])}</h3>
          <div class="prose" style="max-width:none">
            <p><b>Observed.</b> {esc(f['observed'])}</p>
            <p><b>Why it matters.</b> {esc(f['why_it_matters'])}</p>
            <p><b>What is not claimed.</b> {esc(f['what_is_not_claimed'])}</p>
            <p><b>Next step.</b> {esc(f['next_step'])}</p>
            <p style="font-size:14px"><b>Sources.</b></p>
            <ul style="font-size:14px">{srcs}</ul>
          </div>
        </article>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/dashboard/', here)}">Register</a></p>
      <h1>Flagged for review</h1>
      <p>Everything on this site that is unresolved, unverified, or an active risk. Publishing these does not block anything &mdash; the site is live with them listed, which is the point. Each carries a source link so a reader can check the claim rather than trust it.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="n">{len(D.FLAGS)}</div><div class="l">Flags</div><div class="note">All published, none hidden</div></div>
      <div class="stat"><div class="n">{len([f for f in D.FLAGS if f['severity']=='high'])}</div><div class="l">High severity</div><div class="note">Affect earnings or compliance</div></div>
      <div class="stat"><div class="n">{len([f for f in D.FLAGS if f['status']=='unresolved'])}</div><div class="l">Unresolved</div><div class="note">Need account access</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Silently fixed</div><div class="note">Nothing inferred to close one</div></div>
    </div>

    <div class="callout callout--flag">
      <h3>The honest summary</h3>
      <p>Five product links resolve correctly and none of them carried a tracking tag when checked. That is the single largest open item and it is a revenue problem, not a publishing problem. It sits here, dated, rather than being quietly re-linked or quietly ignored.</p>
    </div>

    {cards}
  </div>
</section>
"""
    add_page(here, f"Flagged for review — {D.SITE_NAME}",
             "Every unresolved and unverified item on this site, with what was observed, why it matters, what is not claimed, and a source link.",
             body)


def build_suggestions():
    here = "/suggestions/"
    cards = ""
    for s in D.SUGGESTIONS:
        bar = "".join(f'<i class="{"on" if i < s["impact"] else ""}"></i>' for i in range(5))
        conf = "".join(f'<i class="{"on" if i < s["confidence"] else ""}"></i>' for i in range(5))
        paths = "".join(f"<span>{esc(x)}</span>" for x in s["paths"])
        cards += f"""
        <article class="sugg" id="{esc(s['id'])}" style="margin-bottom:18px">
          <header>
            <div>
              <p class="eyebrow" style="margin:0 0 4px">{esc(s['area'])}</p>
              <h3>{esc(s['title'])}</h3>
            </div>
            {pill(s['id'], 'mono')}
          </header>
          <div class="meta">
            <span>Effort: <b>{esc(s['effort'])}</b></span>
            <span class="scorebar">{bar}<span class="lbl">Impact {s['impact']}/5</span></span>
            <span class="scorebar">{conf}<span class="lbl">Confidence {s['confidence']}/5</span></span>
          </div>
          <p>{esc(s['recommendation'])}</p>
          <div class="tradeoff"><b>The trade-off</b>{esc(s['tradeoff'])}</div>
          <p style="font-size:14px;margin-bottom:8px"><b>Paths open to you</b></p>
          <div class="paths">{paths}</div>
          <p class="link-note" style="margin-top:12px">{esc(s['owner_decision'])}</p>
        </article>"""

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / Suggestions</p>
      <h1>Suggestions for the next pass</h1>
      <p>A reviewable section, not a to-do list. Each suggestion states what it buys you, what it costs you, and the alternative paths, so a decision can be made by choosing between them rather than accepting or rejecting one option in the abstract.</p>
    </div>

    <div class="callout callout--info">
      <h3>How to read the scores</h3>
      <p>Impact and confidence are editorial judgements on a five-point scale, not measurements. No traffic, revenue, or conversion data exists yet, so any number here that looked precise would be invented. The <a href="{href('/dashboard/questions.html', here)}">open questions page</a> lists what would have to be measured before these scores could become evidence.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="n">{len(D.SUGGESTIONS)}</div><div class="l">Suggestions</div><div class="note">Each with alternatives</div></div>
      <div class="stat"><div class="n">{len([s for s in D.SUGGESTIONS if s['impact']>=4])}</div><div class="l">High impact</div><div class="note">4 or 5 out of 5</div></div>
      <div class="stat"><div class="n">{len([s for s in D.SUGGESTIONS if s['effort']=='Low'])}</div><div class="l">Low effort</div><div class="note">Ship in an afternoon</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Shipped unilaterally</div><div class="note">All reversible</div></div>
    </div>

    {cards}

    <div class="prose" style="margin-top:34px">
      <h2>What is already built, and what is waiting for you</h2>
      <table>
        <thead><tr><th>Decision</th><th>Current state</th><th>Reversible?</th></tr></thead>
        <tbody>
          <tr><td>Trade-off framing vs a single winner</td><td>Trade-off framing throughout</td><td>Yes — copy only</td></tr>
          <tr><td>Publish or hide the honesty flags</td><td>Published at <a href="{href('/dashboard/flags.html', here)}">/dashboard/flags.html</a></td><td>Yes</td></tr>
          <tr><td>Show prices or not</td><td>Not shown, with the policy reason stated</td><td>Only with PA API access</td></tr>
          <tr><td>Analytics collector</td><td>Client built, endpoint empty</td><td>Yes — one constant</td></tr>
          <tr><td>Testing products ourselves</td><td>Not done; flagged as FLG-001</td><td>Yes — budget decision</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
"""
    add_page(here, f"Suggestions — {D.SITE_NAME}",
             "Eight reviewable suggestions for improving this site, each with impact, effort, confidence, trade-off, and alternative paths.",
             body)


def build_analytics():
    here = "/dashboard/analytics.html"
    events = [
        ("page_view", "Every page load, once per page per session.", "path"),
        ("outbound_click", "Any click on a sponsored Amazon link.", "path, asin, product"),
        ("product_click", "A click on a product card, whether or not it leaves the site.", "path, product"),
        ("guide_complete", "Scroll past 90% of a guide or review page.", "path"),
        ("subscribe", "Successful RSS or newsletter signup confirmation.", "path, channel"),
    ]
    ev_html = "".join(
        f"<tr><td><code>{esc(n)}</code></td><td>{esc(d)}</td><td><code>{esc(p)}</code></td></tr>"
        for n, d, p in events
    )

    ledger_rows = "".join(
        f"""<tr>
          <td><span class="blank">—</span></td>
          <td><span class="blank">—</span></td>
          <td><span class="blank">—</span></td>
          <td><span class="blank">—</span></td>
          <td><span class="blank">—</span></td>
          <td><span class="blank">—</span></td>
          <td>{pill('awaiting first-party report', 'warn')}</td>
        </tr>""" for _ in range(3)
    )

    body = f"""
<section class="dash">
  <div class="wrap">
    <div class="dash-head">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / <a href="{href('/dashboard/', here)}">Register</a></p>
      <h1>Measurement</h1>
      <p>Five defined events, a privacy-preserving client, and a campaign ledger that starts empty. No conversion score, revenue forecast, or projected traffic figure appears here, because none of those can be produced without data this site does not have.</p>
    </div>

    <div class="callout callout--flag">
      <h3>The collector is not connected</h3>
      <p>The client below is complete and loaded on every page. Its endpoint is a single empty constant, so today it records nothing. That is deliberate: shipping a silent no-op is honest, whereas shipping a fake dashboard would not be. Setting the endpoint is <a href="{href('/dashboard/questions.html#Q-08', here)}">Q-08</a>.</p>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:32px 0 12px">The five events</h2>
    <div class="table-scroll">
      <table>
        <caption>Payloads are fixed at these fields. No identifier, cookie, fingerprint, or cross-site value is sent.</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">Fires when</th><th scope="col">Payload</th></tr></thead>
        <tbody>{ev_html}</tbody>
      </table>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:36px 0 12px">Campaign ledger</h2>
    <div class="table-scroll">
      <table>
        <caption>Empty by design. Rows are added only from authorized first-party reports, with a dated provenance note. Nothing is estimated.</caption>
        <thead><tr><th scope="col">Date</th><th scope="col">Source</th><th scope="col">Channel</th><th scope="col">Eligible sessions</th><th scope="col">Clicks</th><th scope="col">Reported orders</th><th scope="col">Provenance</th></tr></thead>
        <tbody>{ledger_rows}</tbody>
      </table>
    </div>

    <div class="prose" style="margin-top:34px">
      <h2>What the numbers can and cannot say</h2>
      <ul>
        <li><b>A click is not a sale.</b> This site can count an outbound click. Only Amazon's Associates reports can confirm that a purchase was attributed, after the 24-hour session window closes and returns are accounted for.</li>
        <li><b>No conversion rate is shown.</b> A conversion rate needs orders in the numerator. Until the ledger has a reported-orders column with real values, any rate would be a guess dressed as a metric.</li>
        <li><b>No revenue forecast.</b> Commission depends on the product category rate, on qualifying revenue after shipping and tax exclusions, and on returns. None of those are known here.</li>
        <li><b>Attribution to a specific visitor is prohibited.</b> Amazon's Participation Requirements forbid associating a sub-tag or reporting identifier with a specific end user, which is one reason this client sends no identifier at all.</li>
      </ul>

      <h2>Privacy posture of the counter</h2>
      <ul>
        <li>No cookies. No localStorage. No fingerprinting. No third-party script.</li>
        <li>The event name, the page path, and the ASIN of the product clicked. That is the whole payload.</li>
        <li>No IP address is stored by the client, and the design intent is that the collector truncates or discards it.</li>
        <li>Do Not Track and Global Privacy Control are honoured: if either is set, nothing is sent.</li>
      </ul>
      <p>See the <a href="{href('/privacy/', here)}">privacy notice</a> for the reader-facing version.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Measurement and events — {D.SITE_NAME}",
             "Five defined privacy-preserving events, an empty campaign ledger with provenance rules, and an explicit list of what the data cannot support.",
             body)


# --------------------------------------------------------------------------
# trust pages
# --------------------------------------------------------------------------
def build_about():
    here = "/about/"
    body = f"""
<section class="article">
  <div class="wrap">
    <div class="article-header">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / About</p>
      <h1>How this site works</h1>
      <p class="dek">A short, specific account of where the information on these pages comes from, and what it cannot tell you.</p>
    </div>
    <div class="prose">
      <h2>What we do</h2>
      <p>{esc(D.SITE_NAME)} compares kitchen appliances using the specifications their manufacturers publish, plus public guidance from the USDA and the FTC. We put the deciding specification at the top of each page, name the trade-off the machine makes, and link every fact back to the page it came from.</p>

      <h2>What we do not do</h2>
      <p>We have not cooked with, measured, or handled any product on this site. No page claims otherwise, and each review page repeats the point above its specification table. That makes these pages a specification comparison, not a test report, and the difference matters.</p>
      <p>We do not show prices, star ratings, or review counts. Amazon permits them only when Amazon serves the data or it arrives through the Product Advertising API with a timestamp and disclaimer. Showing a price we cannot keep current would be both a policy breach and a disservice.</p>

      <h2>How products are ordered</h2>
      <p>The ordering is editorial and based on how often a given trade-off comes up for a household of two to four people. It is not a sales ranking, not a commission ranking, and not a quality ranking. If two products are close, the page says so rather than manufacturing a winner.</p>

      <h2>How the money works</h2>
      <p>Product links are Amazon Associates links. If you click one and buy, Amazon may pay this site a commission at no extra cost to you. That does not change the ordering, and it does not change which products are included. The full statement is on the <a href="{href('/disclosures/', here)}">disclosure page</a> and at the top of every page on this site.</p>

      <h2>What is still open</h2>
      <p>Quite a lot, and it is all written down:</p>
      <ul>
        <li><a href="{href('/dashboard/flags.html', here)}">{len(D.FLAGS)} flagged items</a> &mdash; unresolved observations, each with a source.</li>
        <li><a href="{href('/dashboard/questions.html', here)}">{len(D.QUESTIONS)} open questions</a> &mdash; what must be answered before the next decision.</li>
        <li><a href="{href('/dashboard/sources.html', here)}">{len(D.SOURCES)} sources</a> &mdash; every document used, with retrieval dates.</li>
        <li><a href="{href('/suggestions/', here)}">{len(D.SUGGESTIONS)} suggestions</a> &mdash; proposed changes with their trade-offs.</li>
      </ul>

      <h2>Corrections</h2>
      <p>If a specification is wrong, it came from a listing that has since changed or from a reading error. The source link on each row is there so you can check it yourself. Corrections are welcome and will be reflected on the source register with a new retrieval date.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"How this site works — {D.SITE_NAME}",
             "Where the information comes from, what this site does not do, how products are ordered, and everything still open.",
             body)


def build_disclosures():
    here = "/disclosures/"
    body = f"""
<section class="article">
  <div class="wrap">
    <div class="article-header">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / Disclosure</p>
      <h1>Affiliate disclosure</h1>
      <p class="dek">The full statement, the placement, and the rules it is written against.</p>
    </div>

    <div class="callout callout--ok">
      <h3>The required statement</h3>
      <p style="font-size:19px;font-family:var(--serif);margin:8px 0"><strong>{esc(D.DISCLOSURE_STATEMENT)}</strong></p>
      <p>This exact wording appears in the strip directly below the masthead at the top of every page on this site, and again in the footer. Amazon's Operating Agreement requires this statement, or a substantially similar one previously allowed, to be stated clearly and prominently wherever Program Content is displayed.</p>
    </div>

    <div class="prose">
      <h2>What the links are</h2>
      <p>{esc(D.SITE_NAME)} participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link on this site and buy something, Amazon may pay this site a commission. The price you pay is the same either way.</p>

      <h2>How the links are marked</h2>
      <p>Every link that leaves this site for Amazon carries three marks:</p>
      <ul>
        <li>A visible <strong>&ldquo;Sponsored&rdquo;</strong> label inside the button, so the nature of the link is clear before it is clicked.</li>
        <li>A <code>rel="sponsored"</code> value on the anchor, per search-engine link-attribute conventions.</li>
        <li>A <code>rel="nofollow"</code> value and a new-tab target, so the click is explicit rather than accidental.</li>
      </ul>
      <p>The FTC's guidance is that a disclosure should be difficult to miss and placed near the thing it qualifies, not only on a separate page a reader has to hunt for. That is why the disclosure is on every page rather than only here.</p>

      <h2>What we do not show, and why</h2>
      <p>No prices, star ratings, or review counts. Amazon's Program Policies allow a site to display price and availability only if Amazon serves the link containing that data, or if the data is obtained through the Creators API or Product Advertising API with a required date and time stamp and a disclaimer. Customer reviews and star ratings may be displayed only when obtained through those APIs. Neither condition is met on this site.</p>

      <h2>What we are not claiming</h2>
      <ul>
        <li>We are not claiming these products were tested. They were not.</li>
        <li>We are not claiming a certification is valid because a listing title says so. Manufacturer certification claims are attributed to the listing and flagged where unconfirmed.</li>
        <li>We are not claiming any product is the best. The pages compare trade-offs and stop there.</li>
        <li>We are not affiliated with, endorsed by, or sponsored by any of the brands named on this site.</li>
      </ul>

      <h2>The rules this is written against</h2>
      <ul>
        <li><a href="{esc(D.SOURCES['S-AGREEMENT']['url'])}" rel="nofollow noopener" target="_blank">Associates Program Operating Agreement</a> &mdash; Section 5, identifying yourself as an Associate.</li>
        <li><a href="{esc(D.SOURCES['S-POLICIES']['url'])}" rel="nofollow noopener" target="_blank">Associates Program Policies</a> &mdash; Participation Requirements, price display, IP licence, trademark guidelines.</li>
        <li><a href="{esc(D.SOURCES['S-FTC-255']['url'])}" rel="nofollow noopener" target="_blank">16 CFR Part 255</a> &mdash; the FTC Endorsement Guides, including the definition of clear and conspicuous.</li>
        <li><a href="{esc(D.SOURCES['S-FTC-101']['url'])}" rel="nofollow noopener" target="_blank">Disclosures 101 for Social Media Influencers</a> &mdash; FTC staff guidance on placement.</li>
        <li><a href="{esc(D.SOURCES['S-HELP-IDENTIFY']['url'])}" rel="nofollow noopener" target="_blank">Associates Central help</a> &mdash; link-level disclosure must be clear and conspicuous.</li>
      </ul>

      <h2>The honest summary</h2>
      <p>The site earns money from these links, says so at the top of every page, marks every link, and shows no numbers it cannot source. Where it can check something against an official document it does, links the document, and dates the check. Where it cannot, it says so on the <a href="{href('/dashboard/flags.html', here)}">flagged page</a> instead of filling the gap.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Affiliate disclosure — {D.SITE_NAME}",
             "The Amazon Associates statement, how every sponsored link is marked, what is not displayed and why, and the rules this page is written against.",
             body)


def build_privacy():
    here = "/privacy/"
    body = f"""
<section class="article">
  <div class="wrap">
    <div class="article-header">
      <p class="breadcrumb"><a href="{href('/', here)}">Home</a> / Privacy</p>
      <h1>Privacy notice</h1>
      <p class="dek">What this site stores, which is close to nothing, and what happens after you click a product link.</p>
      <div class="byline"><span><b>Updated</b> {esc(D.RETRIEVED)}</span><span><b>Applies to</b> every page on this site</span></div>
    </div>
    <div class="prose">
      <h2>The short version</h2>
      <p>This site sets no cookies. It runs no third-party scripts, no advertising pixels, and no social embeds. It does not build a profile of you and it does not try to identify you.</p>

      <h2>Measurement</h2>
      <p>The site includes a small first-party script that counts five events: a page view, a click on an Amazon link, a click on a product card, completion of a guide, and a subscription. Each event carries the event name, the page path, and for product clicks the product identifier. Nothing else.</p>
      <ul>
        <li>No cookies and no local storage.</li>
        <li>No identifiers, hashes, or fingerprints of any kind.</li>
        <li>No cross-site tracking, and no sharing with any advertiser network.</li>
        <li>If your browser sends Do Not Track or Global Privacy Control, the script sends nothing at all.</li>
      </ul>
      <p>As of this notice, the collector endpoint is not configured, so no measurement data is being recorded. The <a href="{href('/dashboard/analytics.html', here)}">measurement page</a> states the same thing, and it will be updated on the same day the endpoint goes live.</p>

      <h2>When you click a product link</h2>
      <p>Product links open Amazon.com in a new tab. From that moment you are on Amazon's site under <a href="{esc(D.SOURCES['S-PRIVACY']['url'])}" rel="nofollow noopener" target="_blank">Amazon's Privacy Notice</a>, not this one. Amazon sets its own cookies to attribute the visit to this site's Associates tag, which is how a commission is recorded. This site does not receive your identity, your order, or your payment details from Amazon. It receives aggregate reports: clicks, and orders if any, by day and by product.</p>

      <h2>Legal basis and your choices</h2>
      <p>Because no personal data is collected, there is nothing to delete, export, or correct. If a collector is configured later and a lawful basis becomes necessary, this notice will state it before the collector is switched on. You can block the script entirely with a content blocker and the site will work identically.</p>

      <h2>Children</h2>
      <p>This site is not directed at children and does not knowingly collect information from anyone under 13.</p>

      <h2>Changes</h2>
      <p>Any material change to this notice gets a new date at the top and a note on the <a href="{href('/dashboard/flags.html', here)}">flagged page</a>.</p>

      <h2>Contact</h2>
      <p>This is a static site with no contact form, precisely so that it collects nothing. Corrections and questions are handled through the repository that publishes it.</p>
    </div>
  </div>
</section>
"""
    add_page(here, f"Privacy notice — {D.SITE_NAME}",
             "No cookies, no third-party scripts, no identifiers. What the five measured events contain and what happens after a sponsored click.",
             body)


def build_404():
    here = "/404.html"
    body = f"""
<section class="dash">
  <div class="wrap" style="text-align:center;padding:60px 0">
    <p class="eyebrow">404</p>
    <h1 style="font-family:var(--serif);font-size:clamp(30px,5vw,46px);margin:0 0 14px">That page has moved or never existed.</h1>
    <p style="color:var(--ink-2);max-width:52ch;margin:0 auto 26px">Nothing has been deleted that you would miss. The five products and five guides are all reachable from the front page.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn-primary" href="{href('/', here)}">Front page</a>
      <a class="btn btn-ghost" href="{href('/guides/', here)}">Guides</a>
    </div>
  </div>
</section>
"""
    add_page(here, f"Page not found — {D.SITE_NAME}",
             "That page could not be found. Everything on this site is reachable from the front page.",
             body)


# --------------------------------------------------------------------------
# machine-readable outputs
# --------------------------------------------------------------------------
def build_sitemap():
    urls = []
    for p in PAGES:
        if p["path"] == "/404.html":
            continue
        urls.append(
            f"  <url><loc>{esc(url(p['path']))}</loc>"
            f"<lastmod>{D.RETRIEVED}</lastmod></url>"
        )
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(urls) + "\n</urlset>\n")
    write("/sitemap.xml", xml)


def build_feed():
    now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    items = []
    for g in D.GUIDES:
        items.append(
            "    <item>\n"
            f"      <title>{esc(g['title'])}</title>\n"
            f"      <link>{esc(url('/guides/' + g['slug'] + '.html'))}</link>\n"
            f"      <guid isPermaLink=\"true\">{esc(url('/guides/' + g['slug'] + '.html'))}</guid>\n"
            f"      <description>{esc(g['dek'])}</description>\n"
            f"      <category>Guides</category>\n"
            "    </item>"
        )
    for p in D.PRODUCTS:
        items.append(
            "    <item>\n"
            f"      <title>{esc(p['short_name'] + ' — specifications and trade-offs')}</title>\n"
            f"      <link>{esc(url('/reviews/' + p['slug'] + '.html'))}</link>\n"
            f"      <guid isPermaLink=\"true\">{esc(url('/reviews/' + p['slug'] + '.html'))}</guid>\n"
            f"      <description>{esc(p['headline_claim'])}</description>\n"
            f"      <category>{esc(p['category'])}</category>\n"
            "    </item>"
        )
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{esc(D.SITE_NAME)}</title>
    <link>{esc(D.BASE_URL)}/</link>
    <description>{esc(D.SITE_TAGLINE)} Specification comparisons for air fryers and meat thermometers, with sources and open questions published.</description>
    <language>en-us</language>
    <lastBuildDate>{now}</lastBuildDate>
    <atom:link href="{esc(url('/feed.xml'))}" rel="self" type="application/rss+xml"/>
{chr(10).join(items)}
  </channel>
</rss>
"""
    write("/feed.xml", xml)


def build_robots():
    write("/robots.txt", f"""User-agent: *
Allow: /
Disallow: /404.html

Sitemap: {D.BASE_URL}/sitemap.xml
""")


def build_favicon():
    for base in (OUT, ROOT):
        os.makedirs(os.path.join(base, "assets/img"), exist_ok=True)
    with open(os.path.join(ROOT, "assets/img/favicon.svg"), "w", encoding="utf-8") as f:
        f.write("""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<rect width="40" height="40" rx="9" fill="#1b1a17"/>
<circle cx="20" cy="20" r="7.5" fill="#b8522f"/>
<circle cx="20" cy="9.5" r="2.1" fill="#fbf7f0"/>
</svg>""")
    shutil.copy(os.path.join(ROOT, "assets/img/favicon.svg"), os.path.join(OUT, "assets/img/favicon.svg"))


# --------------------------------------------------------------------------
# static assets
# --------------------------------------------------------------------------
ANALYTICS_JS = r"""/* Counterwise — privacy-preserving event counter.
 *
 * Design rules, all enforced here rather than by policy:
 *   - no cookies, no localStorage, no identifiers, no fingerprint values
 *   - payload is exactly {event, path} plus {asin, product} for product clicks
 *   - Do Not Track and Global Privacy Control are honoured
 *   - if ENDPOINT is empty nothing is sent, and nothing breaks
 *
 * To turn it on: set ENDPOINT to your collector URL. That is the only change.
 * Endpoint choice is open question Q-08.
 */
(function () {
  "use strict";

  var ENDPOINT = "";               // <-- deliberately empty; see /dashboard/analytics.html
  var EVENTS = ["page_view", "outbound_click", "product_click", "guide_complete", "subscribe"];

  function optedOut() {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return true;
    if (navigator.msDoNotTrack === "1") return true;
    if (navigator.globalPrivacyControl === true) return true;
    return false;
  }

  function path() {
    return location.pathname.replace(/\/index\.html$/, "/");
  }

  function send(event, extra) {
    if (EVENTS.indexOf(event) === -1) return;   // only the five defined events
    if (optedOut()) return;
    if (!ENDPOINT) return;                       // no endpoint, no data, no error
    var body = { event: event, path: path() };
    if (extra) {
      if (extra.asin) body.asin = String(extra.asin).slice(0, 20);
      if (extra.product) body.product = String(extra.product).slice(0, 80);
      if (extra.channel) body.channel = String(extra.channel).slice(0, 20);
    }
    try {
      var payload = JSON.stringify(body);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
          credentials: "omit"
        }).catch(function () {});
      }
    } catch (e) { /* measurement must never break the page */ }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js-on");

    if (sessionStorage.getItem && !sessionStorage.getItem("cw_seen")) {
      try { sessionStorage.setItem("cw_seen", "1"); } catch (e) {}
      send("page_view");
    } else {
      send("page_view");
    }

    document.addEventListener("click", function (ev) {
      var a = ev.target.closest ? ev.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var isStorefront = a.hasAttribute("data-outbound");
      var isProductCard = a.getAttribute("href") && /\/reviews\//.test(a.getAttribute("href"));

      if (isStorefront) {
        send("outbound_click", { asin: a.getAttribute("data-asin"), product: a.getAttribute("data-product") });
      } else if (isProductCard) {
        send("product_click", { product: (href.split("/").pop() || "").replace(".html", "") });
      } else if (a.hasAttribute("data-subscribe")) {
        send("subscribe", { channel: a.getAttribute("data-subscribe") });
      }
    }, true);

    // guide_complete: passed 90% of a long article.
    if (/\/guides\//.test(location.pathname) || /\/reviews\//.test(location.pathname)) {
      var fired = false;
      var onScroll = function () {
        if (fired) return;
        var doc = document.documentElement;
        var seen = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (seen >= 0.9) {
          fired = true;
          send("guide_complete");
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  });
})();
"""


def build_assets():
    os.makedirs(os.path.join(OUT, "assets/css"), exist_ok=True)
    shutil.copy(os.path.join(ROOT, "assets/css/site.css"), os.path.join(OUT, "assets/css/site.css"))
    os.makedirs(os.path.join(OUT, "assets/img"), exist_ok=True)
    for name in os.listdir(os.path.join(ROOT, "assets/img")):
        if name.startswith("."):
            continue
        shutil.copy(os.path.join(ROOT, "assets/img", name), os.path.join(OUT, "assets/img", name))
    with open(os.path.join(ROOT, "assets/analytics.js"), "w", encoding="utf-8") as f:
        f.write(ANALYTICS_JS)
    write("/assets/analytics.js", ANALYTICS_JS)


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------
def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT, exist_ok=True)

    build_home()
    build_categories()
    build_reviews()
    for p in D.PRODUCTS:
        build_review_page(p)
    build_guides_index()
    for g in D.GUIDES:
        build_guide_page(g)
    build_dashboard()
    build_sources()
    build_questions()
    build_flags()
    build_suggestions()
    build_analytics()
    build_about()
    build_disclosures()
    build_privacy()
    build_404()

    for p in PAGES:
        write(p["path"], layout(
            p["path"], p["title"], p["description"], p["body"],
            url(p["path"]), p["extra_head"], p["body_class"],
        ))

    build_sitemap()
    build_feed()
    build_robots()
    build_favicon()
    build_assets()

    publish()
    print(f"built {len(PAGES)} pages, published to repository root")
    return 0


def publish():
    """Copy the build tree to the repository root paths Pages serves."""
    for name in PUBLISHED:
        src = os.path.join(OUT, name)
        dst = os.path.join(ROOT, name)
        if os.path.isdir(src):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            shutil.copy(src, dst)
    # assets/ is source and already sits at the published root path


if __name__ == "__main__":
    sys.exit(main())
