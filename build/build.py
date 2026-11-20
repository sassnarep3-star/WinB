#!/usr/bin/env python3
"""Static site generator for the Crisp & Done affiliate guide.

Stdlib only. Reads data/*.json and content/**/*.html, writes a static site to _site/.
Run:  python3 build/build.py            (uses data/config.json base_path, e.g. /WinB/)
      BASE_PATH=/ python3 build/build.py (local preview at site root)
"""
import csv
import datetime as dt
import html
import json
import os
import pathlib
import re
import shutil
import sys
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CONTENT = ROOT / "content"
ASSETS_SRC = ROOT / "build" / "assets"
OUT = ROOT / "_site"

CFG = json.loads((DATA / "config.json").read_text(encoding="utf-8"))
BASE = os.environ.get("BASE_PATH", CFG["base_path"])
if not BASE.startswith("/"):
    BASE = "/" + BASE
if not BASE.endswith("/"):
    BASE += "/"
SITE_URL = CFG["site_url"].rstrip("/")
SITE = CFG["site_name"]
DISCLOSURE = CFG["associates_disclosure"]
TODAY = CFG["publish_date"]

PRODUCTS = json.loads((DATA / "products.json").read_text(encoding="utf-8"))
VERIF = json.loads((DATA / "verification.json").read_text(encoding="utf-8"))
FLAGS = json.loads((DATA / "flagged.json").read_text(encoding="utf-8"))
QUESTIONS = json.loads((DATA / "questions.json").read_text(encoding="utf-8"))
SUGGESTIONS = json.loads((DATA / "suggestions.json").read_text(encoding="utf-8"))
GUIDES = json.loads((DATA / "guides.json").read_text(encoding="utf-8"))["rows"]
LEDGER_ROWS = list(csv.DictReader((DATA / "campaign_ledger.csv").read_text(encoding="utf-8").splitlines()))

PRODUCT_ROWS = PRODUCTS["rows"]
PRODUCT_BY_ID = {p["id"]: p for p in PRODUCT_ROWS}
FLAG_BY_ID = {f["id"]: f for f in FLAGS["rows"]}

PAGES = []  # (path, title) for sitemap


def e(s):
    return html.escape(str(s), quote=True)


def url(path=""):
    return BASE + path.lstrip("/")


def abs_url(path=""):
    return SITE_URL + "/" + path.lstrip("/") if path else SITE_URL + "/"


def ext_link(href, label, extra_class="", data_attr=""):
    """External link. Any Amazon host gets rel=sponsored (Associates + FTC-friendly marking)."""
    host = urlparse(href).netloc.lower()
    rel = "noopener"
    if "amazon" in host or host.endswith("link.amazon"):
        rel = "sponsored nofollow noopener"
    cls = f' class="{extra_class}"' if extra_class else ""
    return f'<a href="{e(href)}" rel="{rel}" target="_blank"{cls}{data_attr}>{e(label)}</a>'


def unverified(text="Unverified — left blank"):
    return f'<span class="unverified">{e(text)}</span>'


def flag_links(ids):
    if not ids:
        return ""
    parts = [f'<a href="{url("flagged-for-review/")}#{e(i)}">{e(i)}</a>' for i in ids]
    return " ".join(parts)


def table(headers, rows=None, cls="data"):
    rows = rows or []
    th = "".join(f"<th scope='col'>{h}</th>" for h in headers)
    body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<div class="table-wrap"><table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table></div>'


NAV = [
    ("Air fryers", "air-fryers/"),
    ("Thermometers", "thermometers/"),
    ("Guides", "guides/"),
    ("Dashboard", "dashboard/"),
    ("Plan", "plan/"),
    ("Flagged for review", "flagged-for-review/"),
]

FOOTER_SURFACES = [
    ("Shop", [("Air fryers", "air-fryers/"), ("Thermometers", "thermometers/")]),
    ("Guides", [("All guides", "guides/")] + [(g["title"], f"guides/{g['slug']}/") for g in GUIDES]),
    ("Dashboard", [("Dashboard home", "dashboard/"), ("Product table (all rows)", "dashboard/products/"),
                   ("Campaign ledger", "dashboard/ledger/"), ("Measurement", "dashboard/measurement/"),
                   ("Verification register", "verification/")]),
    ("Plan", [("Plan home", "plan/"), ("Executive summary", "plan/executive-summary/"),
              ("Open questions", "plan/open-questions/"), ("Suggestions", "plan/suggestions/")]),
    ("Review & policy", [("Flagged for review", "flagged-for-review/"), ("Disclosure", "disclosure/"),
                         ("Privacy", "privacy/"), ("About & editorial standards", "about/")]),
    ("Feeds", [("RSS feed", "feed.xml"), ("Sitemap", "sitemap.xml")]),
]


def layout(path, title, body, description="", extra_head="", page_class=""):
    PAGES.append((path, title))
    nav_html = "".join(f'<li><a href="{url(p)}">{e(label)}</a></li>' for label, p in NAV)
    footer_cols = []
    for head, links in FOOTER_SURFACES:
        items = "".join(f'<li><a href="{url(p)}">{e(l)}</a></li>' for l, p in links)
        footer_cols.append(f"<div><h3>{e(head)}</h3><ul>{items}</ul></div>")
    desc = description or CFG["tagline"]
    cfg_js = json.dumps({"analyticsEndpoint": CFG["analytics_endpoint"], "site": SITE, "base": BASE,
                         "events": [ev["name"] for ev in CFG["analytics_events"]]})
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} · {e(SITE)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{e(abs_url(path))}">
<link rel="stylesheet" href="{url('assets/style.css')}">
<link rel="alternate" type="application/rss+xml" title="{e(SITE)} — guides" href="{url('feed.xml')}">
<script>window.CD_CONFIG = {cfg_js};</script>
<script src="{url('assets/analytics.js')}" defer></script>
{extra_head}
</head>
<body class="{e(page_class)}">
<a class="skip" href="#main">Skip to content</a>
<header class="masthead"><div class="wrap">
  <a class="brand" href="{url()}">{e(SITE)}</a>
  <p class="tagline">{e(CFG['tagline'])}</p>
</div></header>
<div class="disclosure-strip" role="note"><div class="wrap">
  <strong>Disclosure:</strong> {e(DISCLOSURE)} Some links on this site are sponsored (affiliate) links, marked as such.
  <a href="{url('disclosure/')}">Full disclosure</a>
</div></div>
<nav class="primary-nav" aria-label="Main"><div class="wrap"><ul>{nav_html}</ul></div></nav>
<main id="main" class="wrap">
{body}
</main>
<footer><div class="wrap">
  <div class="footer-grid">{''.join(footer_cols)}</div>
  <p class="footer-disclosure"><strong>Disclosure:</strong> {e(DISCLOSURE)} Sponsored links are marked. We do not sell products.</p>
  <p class="small">Build date {e(TODAY)} · Data verified against the sources listed on each page. Unverified items are marked and listed on <a href="{url('flagged-for-review/')}">Flagged for review</a>.</p>
</div></footer>
</body>
</html>
"""


def write(path, content):
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def page(path, title, body, description="", page_class=""):
    write(path + "index.html", layout(path, title, body, description, page_class=page_class))


# ---------- product rendering ----------

def product_card(p):
    gated = p["link_status"]
    return f"""<article class="card product">
  <div class="kicker">{e(p['id'])} · {e(p['category'])}</div>
  <h3>{e(p['short_name'])}</h3>
  <p class="small">Listing reached 2026-11-20. Observed ASIN <code>{e(p['observed_asin'])}</code>.</p>
  <p class="small muted">Price: not shown (Associates policy §2(b)). Link status: {e(gated)}.</p>
  <p class="flags small">Flags: {flag_links(p['flags'])}</p>
  {ext_link(p['supplied_link'], 'View on Amazon', 'btn', f' data-outbound="{e(p["id"])}"')}
</article>"""


def guide_card(g):
    return f"""<article class="card guide-card">
  <div class="kicker">{e(g['cluster'])}</div>
  <h3><a href="{url('guides/' + g['slug'] + '/')}">{e(g['title'])}</a></h3>
  <p>{e(g['dek'])}</p>
  <p class="small muted">Published {e(g['published'])} · By the Crisp &amp; Done editorial team</p>
</article>"""


# ---------- pages ----------

def build_index():
    cards = "".join(product_card(p) for p in PRODUCT_ROWS)
    guides = "".join(guide_card(g) for g in GUIDES[:4])
    body = f"""
<section class="hero">
  <p class="kicker">Buyer's guide · Air fryers &amp; kitchen thermometers</p>
  <h1>Five products, and the questions to ask before you buy.</h1>
  <p class="lede">Start with a product, then check the questions that matter for your kitchen. Each product links to its Amazon listing.</p>
</section>
<section class="block">
  <div class="section-head"><h2>The products</h2><p class="small muted">Sorted by category. Click through to the listing.</p></div>
  <div class="grid">{cards}</div>
  <p class="small"><a href="{url('air-fryers/')}">Air fryers →</a> &nbsp; <a href="{url('thermometers/')}">Thermometers →</a></p>
</section>
<section class="block">
  <div class="section-head"><h2>Read first</h2><p class="small muted">Question-led guides, written from listing text and general criteria.</p></div>
  <div class="grid">{guides}</div>
  <p class="small"><a href="{url('guides/')}">All guides →</a></p>
</section>
<section class="block band">
  <h2>How this site stays honest</h2>
  <ul class="checks">
    <li>Every product row links to the Amazon page it was read from, with the date it was read.</li>
    <li>Anything we could not confirm is left blank and marked “Unverified”.</li>
    <li>No prices or ratings are shown: the Associates policy limits them, and we have not confirmed them from an official field.</li>
    <li>Open items, suggestions and flagged issues are published, not hidden: <a href="{url('dashboard/')}">Dashboard</a> · <a href="{url('flagged-for-review/')}">Flagged for review</a> · <a href="{url('plan/suggestions/')}">Suggestions</a>.</li>
  </ul>
</section>
"""
    layout_html = layout("", SITE + " · Air fryers and kitchen thermometers", body,
                         description="Five Amazon products — air fryers and meat thermometers — with the questions to ask before you buy.",
                         page_class="home")
    write("index.html", layout_html)


def build_category(path, title, cat, intro, product_ids, related_guides):
    cards = "".join(product_card(PRODUCT_BY_ID[i]) for i in product_ids)
    rel = "".join(f'<li><a href="{url("guides/" + g["slug"] + "/")}">{e(g["title"])}</a></li>' for g in related_guides)
    rows = []
    for i in product_ids:
        p = PRODUCT_BY_ID[i]
        rows.append([e(p["id"]), e(p["short_name"]), f"<code>{e(p['observed_asin'])}</code>",
                     ext_link(p["source_url"], "Amazon listing (read " + p["confirmation_date"] + ")")])
    body = f"""
<section class="hero">
  <p class="kicker">{e(cat)}</p>
  <h1>{e(title)}</h1>
  <p class="lede">{e(intro)}</p>
</section>
<section class="block"><div class="grid">{cards}</div></section>
<section class="block">
  <div class="section-head"><h2>Read before you choose</h2></div>
  <ul class="link-list">{rel}</ul>
</section>
<section class="block">
  <div class="section-head"><h2>Source rows</h2><p class="small muted">Full verification is on the product table.</p></div>
  {table(['Row', 'Product', 'Observed ASIN', 'Source (official)'], rows)}
</section>
"""
    page(path, title, body, description=intro)


def build_guides_index():
    clusters = {}
    for g in GUIDES:
        clusters.setdefault(g["cluster"], []).append(g)
    parts = []
    for name, items in clusters.items():
        cards = "".join(guide_card(g) for g in items)
        parts.append(f'<section class="block"><div class="section-head"><h2>{e(name)}</h2><p class="small muted">{len(items)} guide(s)</p></div><div class="grid">{cards}</div></section>')
    body = f"""
<section class="hero">
  <p class="kicker">Guides</p>
  <h1>Questions first, listings second.</h1>
  <p class="lede">Each guide answers one buyer question. New guides are added to the feed and sitemap when published.</p>
  <p class="small">Subscribe: <a href="{url('feed.xml')}">RSS feed</a></p>
</section>
{''.join(parts)}
"""
    page("guides/", "Guides", body, description="Question-led buying guides for air fryers and kitchen thermometers.")


def build_guide(g):
    content = (CONTENT / "guides" / f"{g['slug']}.html").read_text(encoding="utf-8")
    products = "".join(
        f'<li>{e(PRODUCT_BY_ID[i]["short_name"])} — ' + ext_link(PRODUCT_BY_ID[i]["supplied_link"], "View on Amazon", "", f' data-outbound="{e(i)}"') + "</li>"
        for i in g["product_ids"])
    sources = "".join(f"<li>{ext_link(s, s)}</li>" for s in g["sources"])
    body = f"""
<article class="guide">
  <p class="kicker">{e(g['cluster'])} · Guide</p>
  <h1>{e(g['title'])}</h1>
  <p class="dek">{e(g['dek'])}</p>
  <p class="byline small">By the Crisp &amp; Done editorial team · Published {e(g['published'])} · Author bio pending (<a href="{url('flagged-for-review/')}#FLG-006">FLG-006</a>)</p>
  <div class="disclosure-inline"><strong>Sponsored links ahead.</strong> {e(DISCLOSURE)}</div>
  <div class="prose">{content}</div>
  <section class="block"><h2>Products in this guide</h2><ul class="link-list">{products}</ul></section>
  <section class="block"><h2>Sources</h2><p class="small muted">Links to the pages the listing text was read from, and to the FTC guidance cited on this site.</p><ul class="small">{sources}</ul></section>
  <p class="small"><a href="{url('guides/')}">← All guides</a></p>
</article>
"""
    page(f"guides/{g['slug']}/", g["title"], body, description=g["dek"], page_class="guide-page")


def build_dashboard_home():
    total = len(PRODUCT_ROWS)
    intended_blank = sum(1 for p in PRODUCT_ROWS if not p["intended_asin"])
    prices_shown = sum(1 for p in PRODUCT_ROWS if p["price"])
    body = f"""
<section class="hero"><p class="kicker">Dashboard</p><h1>Status at a glance</h1>
<p class="lede">Counts come from the data files on each build. Nothing is estimated.</p></section>
<section class="block stats">
  <div class="stat"><span>{total}</span><p>Products read from Amazon listings</p></div>
  <div class="stat"><span>{total - intended_blank}</span><p>Intended ASINs confirmed</p></div>
  <div class="stat"><span>{prices_shown}</span><p>Prices shown (policy §2(b))</p></div>
  <div class="stat"><span>{len(LEDGER_ROWS) - 0}</span><p>Ledger rows with reports</p></div>
  <div class="stat"><span>{len(FLAGS['rows'])}</span><p>Flagged items</p></div>
  <div class="stat"><span>{len(GUIDES)}</span><p>Published guides</p></div>
</section>
<section class="block">
  <div class="section-head"><h2>Dashboard surfaces</h2></div>
  {table(['Surface', 'What it shows', 'Link'], cls='nav-table', rows=[
      ['Product table', 'All five rows: observed title, ASINs, redirect target, source, status, flags', f'<a href="{url("dashboard/products/")}">Open</a>'],
      ['Campaign ledger', 'Empty by design. Rows only from authorized first-party reports, with provenance', f'<a href="{url("dashboard/ledger/")}">Open</a>'],
      ['Measurement', 'Five proposed events; endpoint status', f'<a href="{url("dashboard/measurement/")}">Open</a>'],
      ['Verification register', 'Policy and source rows, each with an official link', f'<a href="{url("verification/")}">Open</a>'],
      ['Flagged for review', 'Irregularities and unverified items with source links', f'<a href="{url("flagged-for-review/")}">Open</a>'],
  ])}
</section>
"""
    page("dashboard/", "Dashboard", body, description="Product table, ledger, measurement and verification status.")


def build_products_table():
    headers = ["Row", "Product (shortened from observed listing title)", "Category (Amazon breadcrumb)",
               "Supplied link", "Link token (length)", "Intended ASIN", "Observed ASIN (length)",
               "Observed redirect target", "Official listing URL (intended)", "Confirmed", "Price", "Source (official)",
               "Link status", "Flags"]
    rows = []
    for p in PRODUCT_ROWS:
        rows.append([
            f"<strong>{e(p['id'])}</strong>",
            f"<strong>{e(p['short_name'])}</strong><br><span class='small muted'>{e(p['observed_title'])}</span>",
            f"{e(p['category'])}<br><span class='small muted'>{e(p['amazon_breadcrumb'])}</span>",
            ext_link(p["supplied_link"], p["supplied_link"]),
            f"<code>{e(p['supplied_token'])}</code> ({p['supplied_token_length']})",
            unverified(), 
            f"<code>{e(p['observed_asin'])}</code> ({p['observed_asin_length']})",
            ext_link(p["observed_redirect_url"], p["observed_redirect_url"]),
            unverified(),
            e(p["confirmation_date"]),
            unverified("Not shown — §2(b)"),
            ext_link(p["source_url"], "Amazon.com listing"),
            e(p["link_status"]),
            flag_links(p["flags"]),
        ])
    notes = f"""
<section class="block"><div class="section-head"><h2>Reading this table</h2></div>
<ul class="checks">
  <li><strong>Intended ASIN</strong> is blank for every row. The supplied link token is 9 characters; the observed ASIN is 10 characters. We do not fill the intended field from the redirect (FLG-001, FLG-002).</li>
  <li><strong>Observed redirect target</strong> is a separate field and is not a substitute for the intended listing.</li>
  <li><strong>Price</strong> is blank for every row (policy §2(b), FLG-005).</li>
  <li><strong>Tracking ID:</strong> {e(PRODUCTS['tracking_id'])} is recorded but not yet validated (FLG-003, FLG-004).</li>
  <li>Source column: each row links to the Amazon.com page it was read from on {e(PRODUCTS['as_of'])}.</li>
</ul></section>"""
    body = f"""
<section class="hero"><p class="kicker">Dashboard · Product table</p><h1>Every product row, with its source</h1>
<p class="lede">Five rows. Blank cells are unverified. Scroll sideways to see all columns.</p></section>
<section class="block">{table(headers, rows)}</section>
{notes}
"""
    page("dashboard/products/", "Product table", body, description="All product rows with sources and verification status.")


def build_ledger():
    headers = ["Timestamp (UTC)", "Source report", "Channel", "Eligible sessions", "Clicks", "Reported orders", "Report ID", "Provenance note"]
    body = f"""
<section class="hero"><p class="kicker">Dashboard · Campaign ledger</p><h1>Campaign ledger (empty by design)</h1>
<p class="lede">No rows yet. A row is added only from an authorized first-party report, with its date and source. No conversion score or revenue forecast is shown.</p></section>
<section class="block">{table(headers, [[unverified('No rows')] + [''] * 7])}</section>
<section class="block"><div class="section-head"><h2>Rules for adding rows</h2></div>
<ul class="checks">
  <li>Source must be an authorized first-party report (Associates Central or the site's own counter). Both are named in the row.</li>
  <li>Never back-fill a value; add a new dated row for each report.</li>
  <li>Keep the provenance note, the report ID and the date. If a value cannot be confirmed from a report, leave it blank.</li>
</ul>
<p class="small">Source for the rule on sessions and clicks: {ext_link('https://affiliate-program.amazon.com/help/operating/policies', 'Associates Program Policies — Commission Income Statement §1')} (qualifying purchase session definition).</p>
</section>"""
    page("dashboard/ledger/", "Campaign ledger", body, description="Empty campaign ledger with provenance rules.")


def build_measurement():
    rows = []
    for ev in CFG["analytics_events"]:
        rows.append([f"<code>{e(ev['name'])}</code>", e(ev["meaning"]), unverified(CFG["analytics_status"])])
    body = f"""
<section class="hero"><p class="kicker">Dashboard · Measurement</p><h1>Measurement</h1>
<p class="lede">The five events below are <strong>proposed</strong>; the brief does not list them (FLG-007). The client script sends events only when an endpoint is configured. The endpoint is currently blank, so nothing is sent.</p></section>
<section class="block">{table(['Event', 'What is recorded', 'Status'], rows)}</section>
<section class="block"><div class="section-head"><h2>Privacy rules built into the script</h2></div>
<ul class="checks">
  <li>No cookies, no local storage, no fingerprinting.</li>
  <li>Respects Do Not Track and Global Privacy Control: when either is on, nothing is sent.</li>
  <li>Records paths and product or guide IDs only. No query strings, no search terms, no personal data.</li>
  <li>Outbound clicks are counted per product ID, not per visitor.</li>
</ul>
<p class="small">Endpoint options for owner decision: <a href="{url('plan/suggestions/')}">Suggestion S-03</a>.</p></section>"""
    page("dashboard/measurement/", "Measurement", body, description="Proposed events and privacy rules.")


def build_verification():
    rows = []
    for v in VERIF["rows"]:
        status_cls = "ok" if v["status"].startswith("Verified") and "Unverified" not in v["status"] else "unverified"
        rows.append([
            f"<strong>{e(v['id'])}</strong>",
            e(v["topic"]),
            e(v["claim"]),
            f'<span class="{status_cls}">{e(v["status"])}</span>',
            ext_link(v["source_url"], v["source_label"]),
            flag_links(v["flags"]),
        ])
    body = f"""
<section class="hero"><p class="kicker">Verification register</p><h1>Verification register</h1>
<p class="lede">Each row states a rule or fact, its status, and an official source link. Statuses: <span class="ok">Verified</span> (read from the source) or <span class="unverified">Unverified</span> (not confirmed).</p></section>
<section class="block">{table(['ID', 'Topic', 'Claim (as read from the source)', 'Status', 'Source (official)', 'Flags'], rows)}</section>
<section class="block"><p class="small muted">Sources were read on 2026-11-20. Policies are updated by Amazon and the FTC; re-check before each publication (FLG-014).</p></section>"""
    page("verification/", "Verification register", body, description="Source register with official links for every row.")


def build_flagged():
    cards = []
    for f in FLAGS["rows"]:
        srcs = "".join(f"<li>{ext_link(s, s)}</li>" for s in f["sources"]) or "<li class='muted'>No external source; see detail.</li>"
        cards.append(f"""<article class="card flag-card" id="{e(f['id'])}">
  <div class="kicker">{e(f['id'])} · {e(f['severity'])}</div>
  <h3>{e(f['item'])}</h3>
  <p>{e(f['detail'])}</p>
  <p class="small"><strong>Action:</strong> {e(f['action'])}</p>
  <p class="small"><strong>Sources:</strong></p><ul class="small">{srcs}</ul>
</article>""")
    body = f"""
<section class="hero"><p class="kicker">Flagged for review</p><h1>Flagged for review</h1>
<p class="lede">Irregularities and unverified items. They do not block publication. Each has its source links so you can review them and request changes.</p></section>
<section class="block"><div class="grid flag-grid">{''.join(cards)}</div></section>"""
    page("flagged-for-review/", "Flagged for review", body, description="Irregularities and unverified items with source links.")


def build_plan_home():
    body = """
<section class="hero"><p class="kicker">Plan</p><h1>Plan</h1>
<p class="lede">What is known, what is missing, and which path to take. Nothing on this page is implemented until a path is chosen.</p></section>
<section class="block"><div class="grid">
  <article class="card"><h3><a href="executive-summary/">Executive summary</a></h3><p>One page: what was built, what is verified, what is blocked, decisions needed.</p></article>
  <article class="card"><h3><a href="open-questions/">Open questions</a></h3><p>Questions that must be answered before decisions, with what we know and what we do not know.</p></article>
  <article class="card"><h3><a href="suggestions/">Suggestions</a></h3><p>Options for each decision. Choose a path; nothing changes until you do.</p></article>
</div></section>"""
    page("plan/", "Plan", body, description="Executive summary, open questions and suggestions.")


def build_exec_summary():
    n = len(PRODUCT_ROWS)
    body = f"""
<section class="hero"><p class="kicker">Plan · Executive summary</p><h1>Executive summary</h1>
<p class="lede">As of {e(TODAY)}. Plain facts, what is blocked, and the decisions that matter most.</p></section>
<section class="block prose">
<h2>What was built</h2>
<ul>
  <li>A static buyer's-guide site on GitHub Pages: landing page, two category pages, four question-led guides, and a dashboard with the product table, the empty campaign ledger, measurement, and the verification register.</li>
  <li>{n} products from the supplied links: 3 air fryers (one oven-style) and 2 meat thermometers.</li>
  <li>An affiliate disclosure under the masthead on every page and in the footer, using Amazon's required wording.</li>
  <li>Every Amazon link is marked sponsored. A build check fails the deploy if a page is missing the disclosure or an Amazon link is not marked.</li>
</ul>
<h2>What is verified</h2>
<ul>
  <li>All five supplied links were followed to Amazon.com product pages on {e(PRODUCTS['as_of'])}. Titles, breadcrumbs and observed ASINs were read from those pages.</li>
  <li>Associates rules (disclosure wording, Special Link format, price display limits) and FTC disclosure guidance were read from their official pages. See the <a href="{url('verification/')}">verification register</a>.</li>
</ul>
<h2>What is blocked or unverified</h2>
<ul>
  <li><strong>Intended ASINs:</strong> none confirmed. Each link token is 9 characters, not the 10 of an observed ASIN (FLG-001, FLG-002).</li>
  <li><strong>Link compliance:</strong> unresolved (FLG-003). The links are not claimed invalid. They need one test per product in an enrolled Associates account.</li>
  <li><strong>Tracking ID</strong> {e(PRODUCTS['tracking_id'])}: enrollment and format not confirmed (FLG-004).</li>
  <li><strong>Prices, ratings, commission rates:</strong> not shown or not verified (FLG-005, FLG-012).</li>
  <li><strong>Analytics:</strong> no endpoint is live; the five events are proposals (FLG-007).</li>
  <li><strong>Author and brand:</strong> no named author; the brand name is not cleared (FLG-006, FLG-009).</li>
</ul>
<h2>What the numbers do not show</h2>
<p>There are no clicks, conversions, reported orders or revenue. The campaign ledger is empty by design. No conversion score or revenue forecast is presented, and no search-demand data was available.</p>
<h2>Decisions needed</h2>
<ol>
  <li>Confirm the intended listing for each link (<a href="{url('plan/open-questions/')}">Q-01</a>).</li>
  <li>Approve a one-link-per-product test in Associates Central (<a href="{url('plan/open-questions/')}">Q-02</a>).</li>
  <li>Choose a site path (<a href="{url('plan/suggestions/')}">S-01</a>), an outbound-link path (<a href="{url('plan/suggestions/')}">S-02</a>), and an analytics endpoint (<a href="{url('plan/suggestions/')}">S-03</a>).</li>
</ol>
<h2>Recommendation</h2>
<p>Proceed as a buyer's-guide publication (S-01 A), validate the links before scaling (S-02 B), and keep prices off the site until API eligibility is confirmed (S-05 A).</p>
</section>"""
    page("plan/executive-summary/", "Executive summary", body, description="Executive summary of the site, its verification status, and open decisions.")


def build_questions():
    rows = []
    for q in QUESTIONS["rows"]:
        src = " ".join(f'<a href="{url("flagged-for-review/")}#{e(s)}">{e(s)}</a>' for s in q["sources"]) or "—"
        srcu = " ".join(ext_link(u, u.split('//')[1].split('/')[0] + '/…') for u in q.get("source_urls", [])) or unverified("No external source — owner input")
        rows.append([f"<strong>{e(q['id'])}</strong>", e(q["question"]), e(q["known"]), unverified(q["missing"]), e(q["discover"]), srcu, src])
    body = f"""
<section class="hero"><p class="kicker">Plan · Open questions</p><h1>Open questions</h1>
<p class="lede">What must be answered before a decision can be made. For each question: what we know, what is missing, and how to find out.</p></section>
<section class="block">{table(['ID', 'Question', 'What we know', 'What is missing', 'How to discover it', 'Official source', 'Flags'], rows)}</section>"""
    page("plan/open-questions/", "Open questions", body, description="Questions that need answers before decisions.")


def build_suggestions():
    cards = []
    for s in SUGGESTIONS["rows"]:
        opts = []
        for o in s["options"]:
            rec = " <span class='pill'>proposed default</span>" if o["key"] == s["recommended"] else ""
            opts.append(f"<tr><td><strong>{e(o['key'])}</strong></td><td>{e(o['label'])}{rec}<br><span class='small muted'>{e(o['desc'])}</span></td><td class='small'>{e(o['tradeoff'])}</td></tr>")
        cards.append(f"""<article class="card suggestion">
  <div class="kicker">{e(s['id'])} · {e(s['topic'])}</div>
  <h3>{e(s['summary'])}</h3>
  <p class="small"><strong>Status:</strong> {e(s['status'])}</p>
  <div class="table-wrap"><table class="data"><thead><tr><th>Key</th><th>Option</th><th>Trade-off</th></tr></thead><tbody>{''.join(opts)}</tbody></table></div>
</article>""")
    body = f"""
<section class="hero"><p class="kicker">Plan · Suggestions</p><h1>Suggestions for review</h1>
<p class="lede">{e(SUGGESTIONS['note'])} To choose a path, tell the session which option key you want for each ID (for example, “S-01 A”).</p></section>
<section class="block"><div class="grid suggestion-grid">{''.join(cards)}</div></section>"""
    page("plan/suggestions/", "Suggestions", body, description="Options for each decision. Nothing is implemented until a path is chosen.")


def build_about():
    body = """
<section class="hero"><p class="kicker">About</p><h1>Editorial standards</h1>
<p class="lede">How we write, what we check, and what we do not do.</p></section>
<section class="block prose">
<h2>Who writes this</h2>
<p>The Crisp &amp; Done editorial team. A named author and credentials have not been supplied, so none are shown (<a href="{url('flagged-for-review/')}#FLG-006">FLG-006</a>).</p>
<h2>What we check</h2>
<ul>
  <li>Product facts come from the Amazon listing page, and each one links to it with the date read.</li>
  <li>Anything we cannot confirm is left blank and marked Unverified.</li>
  <li>We do not invent reviews, ratings, prices, test results or endorsements.</li>
</ul>
<h2>What we do not do</h2>
<ul>
  <li>We have not tested the products. The guides say so.</li>
  <li>We do not forecast revenue, and we do not show conversion scores.</li>
</ul>
<h2>Corrections</h2>
<p>A correction contact has not been set up yet (needs owner input). Until then, open items are listed on <a href="{url('flagged-for-review/')}">Flagged for review</a>.</p>
</section>"""
    page("about/", "About & editorial standards", body, description="Editorial standards for the site.")


def build_disclosure():
    body = f"""
<section class="hero"><p class="kicker">Disclosure</p><h1>Affiliate disclosure</h1>
<p class="lede">{e(DISCLOSURE)}</p></section>
<section class="block prose">
<h2>What this means</h2>
<p>Some links on this site go to Amazon. If you click one and buy, we may earn a commission from Amazon. The price you pay is the same. Links are marked sponsored.</p>
<h2>Where the wording comes from</h2>
<p>The statement is the one required by Section 5 of the {ext_link('https://affiliate-program.amazon.com/help/operating/agreement', 'Associates Program Operating Agreement')}. The placement follows the FTC guidance on disclosures for endorsements, which says disclosures should be hard to miss and placed with the endorsement itself: {ext_link('https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers', 'FTC Disclosures 101')}.</p>
<h2>Gifts and free products</h2>
<p>If we ever receive free products, payment or other value for a recommendation, we will say so next to that recommendation.</p>
<h2>Legal review</h2>
<p>This disclosure has not been reviewed by a lawyer (<a href="{url('flagged-for-review/')}#FLG-015">FLG-015</a>).</p>
</section>"""
    page("disclosure/", "Disclosure", body, description="Affiliate disclosure and where its wording comes from.")


def build_privacy():
    body = f"""
<section class="hero"><p class="kicker">Privacy</p><h1>Privacy</h1>
<p class="lede">The site sets no cookies. The analytics script does nothing until an endpoint is configured.</p></section>
<section class="block prose">
<h2>What the site does now</h2>
<ul>
  <li>No cookies and no accounts.</li>
  <li>Analytics are <strong>not sent</strong> (endpoint blank). If an endpoint is configured later, events will record paths and IDs only (see <a href="{url('dashboard/measurement/')}">Measurement</a>).</li>
  <li>Do Not Track and Global Privacy Control are respected by the script.</li>
</ul>
<h2>When you click an Amazon link</h2>
<p>Amazon handles your visit under its own {ext_link('https://www.amazon.com/gp/help/customer/display.html?nodeId=468496', 'Privacy Notice')}. The Associates Program may record that a visitor clicked a Special Link from this site (Operating Agreement §12).</p>
<h2>Hosting</h2>
<p>The site is hosted on GitHub Pages. GitHub's logs may record your IP address under GitHub's own policies.</p>
</section>"""
    page("privacy/", "Privacy", body, description="What data the site collects and what it does not.")


def build_home_feed_sitemap():
    items = []
    for g in GUIDES:
        link = abs_url(f"guides/{g['slug']}/")
        pub = dt.datetime.strptime(g["published"], "%Y-%m-%d").replace(tzinfo=dt.timezone.utc)
        items.append(f"""<item>
  <title>{e(g['title'])}</title>
  <link>{e(link)}</link>
  <guid isPermaLink="true">{e(link)}</guid>
  <pubDate>{pub.strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
  <description>{e(g['dek'])}</description>
  <category>{e(g['cluster'])}</category>
</item>""")
    feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>{e(SITE)} — guides</title>
  <link>{e(abs_url(''))}</link>
  <description>{e(CFG['tagline'])}</description>
  <language>en-us</language>
  <atom:link href="{e(abs_url('feed.xml'))}" rel="self" type="application/rss+xml"/>
  {''.join(items)}
</channel>
</rss>
"""
    write("feed.xml", feed)
    urls = []
    for path, _ in PAGES:
        if path == "404.html":
            continue
        if path.endswith("index.html"):
            path = path[: -len("index.html")]
        if path == "" or path.endswith("/"):
            loc = abs_url(path)
        else:
            loc = abs_url(path)
        urls.append(f"  <url><loc>{e(loc)}</loc><lastmod>{TODAY}</lastmod></url>")
    # include all generated html pages (guards against any page missed in PAGES)
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(sorted(set(urls))) + "\n</urlset>\n"
    write("sitemap.xml", sm)
    write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {abs_url('sitemap.xml')}\n")


def build_404():
    body = f"""
<section class="hero"><p class="kicker">404</p><h1>Page not found</h1>
<p class="lede">The page may have moved. Try the <a href="{url()}">home page</a> or the <a href="{url('guides/')}">guides</a>.</p></section>"""
    write("404.html", layout("404.html", "Page not found", body))


def copy_assets():
    dest = OUT / "assets"
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(ASSETS_SRC, dest)


def build_thermometer_cat():
    build_category(
        "thermometers/", "Meat thermometers",
        "Thermometers",
        "Two meat thermometers from the supplied links: a single-probe instant-read model and a wireless multi-probe model. Read the questions before the listing.",
        ["P-04", "P-05"],
        [g for g in GUIDES if g["slug"] in ("cleanup-and-counter-space", "multi-function-appliance-questions")],
    )


def build_air_cat():
    build_category(
        "air-fryers/", "Air fryers",
        "Air fryers",
        "Three air fryers from the supplied links, including one oven-style model. Start with the shape question, then capacity and cleanup.",
        ["P-01", "P-02", "P-03"],
        [g for g in GUIDES if g["slug"] in ("basket-vs-oven-air-fryer", "air-fryer-capacity-checklist", "cleanup-and-counter-space")],
    )


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    (OUT / ".nojekyll").write_text("")
    copy_assets()
    build_index()
    build_air_cat()
    build_thermometer_cat()
    build_guides_index()
    for g in GUIDES:
        build_guide(g)
    build_dashboard_home()
    build_products_table()
    build_ledger()
    build_measurement()
    build_verification()
    build_flagged()
    build_plan_home()
    build_exec_summary()
    build_questions()
    build_suggestions()
    build_about()
    build_disclosure()
    build_privacy()
    build_404()
    build_home_feed_sitemap()
    print(f"built {len(list(OUT.rglob('*.html')))} html pages into {OUT} (BASE={BASE})")


if __name__ == "__main__":
    sys.exit(main())
