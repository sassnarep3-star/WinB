#!/usr/bin/env python3
"""Build the static site at the repository root from data/*.json, then validate it.

Usage:  python3 scripts/build.py
Exit code 1 if any validation check fails (the site must not be published broken).

Only the Python standard library is used. The output is plain static HTML/CSS
for GitHub Pages (publishing source: main branch, / root).
"""
import csv
import datetime
import email.utils
import html
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT  # served by GitHub Pages (legacy source: main, path /)
SITE_URL = "https://sassnarep3-star.github.io/WinB/"
BUILD_DATE = "2026-11-20"
DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases."
SPONSORED_REL = "sponsored noopener"

TOP_NAV = [
    ("Air fryers & ovens", "air-fryers-ovens.html"),
    ("Meat thermometers", "meat-thermometers.html"),
    ("Guides", "guides/index.html"),
    ("Register", "register.html"),
    ("Analysis", "analysis.html"),
    ("Questions", "questions.html"),
    ("Suggestions", "suggestions.html"),
    ("Flagged", "flagged.html"),
    ("Summary", "executive-summary.html"),
]
FOOTER_EXTRA = [
    ("Campaign ledger", "ledger.html"),
    ("Sources", "sources.html"),
    ("Disclosure & privacy", "disclosure.html"),
    ("RSS feed", "feed.xml"),
    ("Sitemap", "sitemap.xml"),
]

# Display names must be verbatim substrings of the observed listing title (checked below).
SHORT_NAMES = {
    "P-01": "CHEFMAN 6 Quart Dual Basket Air Fryer",
    "P-02": "Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven",
    "P-03": "Chefman Air Fryer 8 Qt | TurboFry® 4-in-1",
    "P-04": "ThermoMaven 1 Sec Professional Digital Meat Thermometer",
    "P-05": "CHEF iQ Sense | Smart Wireless Meat Thermometer",
}

GUIDES = [
    {
        "slug": "basket-or-oven-style-air-fryer",
        "title": "Basket or oven-style air fryer: what should you compare?",
        "deck": "Working title. The two formats differ in shape, not in promise. Start with how you cook, then read what each listing says.",
        "products": ["P-01", "P-02", "P-03"],
        "sections": [
            ("Which listings are basket-style and which are oven-style?", [
                "Titles in our register describe P-01 as a 'Dual Basket Air Fryer Oven' and P-03 as an 'Air Fryer' with an 'XL Nonstick Dishwasher-Safe Basket'. P-02 is titled a 'French Door Multi-Function Air Fryer Toaster Oven'.",
                "Titles are seller claims. Open each listing and read its product description before you decide which format fits.",
            ]),
            ("Which questions decide it?", [
                ("ul", [
                    "What is the largest single item you cook most weeks?",
                    "Do you bake, roast, or broil whole dishes, or mainly fry in batches?",
                    "How much counter space can you give up, with the door or lid open?",
                    "Which functions will you use every week, and which are only listed?",
                ]),
            ]),
            ("What do the listing titles claim?", [
                ("ul", [
                    "P-01: '2 Independent 3Qt Nonstick Dishwasher Safe Frying Baskets', 'Hi-Fry', 'Sync Finish'.",
                    "P-02: '24 One-Touch Preset Options', 'Six Cooking Accessories Included'.",
                    "P-03: '450°F Hi-Fry Option', 'Bake, Dehydrate, Frozen'.",
                ]),
                "None of these claims was tested. Verify them on the listing before relying on one.",
            ]),
        ],
    },
    {
        "slug": "air-fryer-capacity-checklist",
        "title": "A no-hype checklist for comparing air fryer capacity",
        "deck": "Capacity is easy to misread. This checklist keeps you on the figures the listings state.",
        "products": ["P-01", "P-02", "P-03"],
        "sections": [
            ("What do the capacity figures in the titles mean?", [
                "Titles state capacity in quarts: P-01 '6 Quart', P-02 '26QT', P-03 '8 Qt'. P-01's title also lists '2 Independent 3Qt' baskets, so one figure is for the whole unit and one is per basket.",
                "This register did not capture interior or basket volumes from spec tables. Check them on each listing.",
            ]),
            ("A short checklist", [
                ("ul", [
                    "Write down the largest item you cook. Include the dish, not just the protein.",
                    "Find the capacity in the title and again in the specification table. Note whether each figure is for the whole unit or a basket.",
                    "Compare like with like. A whole-unit figure and a per-basket figure are not comparable.",
                    "Check cook-time and preheat claims in the product description, not in the title.",
                    "Read the warranty section of the listing before you decide.",
                ]),
            ]),
            ("What this checklist does not do", [
                "It does not rank capacity against cooking performance. No cooking test was run for this site.",
            ]),
        ],
    },
    {
        "slug": "cleanup-and-counter-space",
        "title": "How to assess cleanup and counter-space trade-offs",
        "deck": "Cleanup and counter space decide whether a kitchen appliance gets used. Both are easy to check before you buy.",
        "products": ["P-01", "P-02", "P-03"],
        "sections": [
            ("What do the listings say about cleanup?", [
                "The titles of P-01 ('Dishwasher Safe Frying Baskets') and P-03 ('XL Nonstick Dishwasher-Safe Basket') state that the baskets are dishwasher-safe. These are listing claims.",
                "Check the care section of the listing for the parts that must be washed by hand.",
            ]),
            ("How do you measure counter space?", [
                ("ul", [
                    "Measure the footprint you have, including room for the door, lid, or drawer to open.",
                    "Compare with the dimensions in the listing's specification table. This register did not capture dimensions, so they are not shown here.",
                    "Remember the height: a tall unit may not fit under a cabinet.",
                ]),
            ]),
            ("What are the trade-offs?", [
                "A larger unit may take more counter space but cook more food per run. A basket model may need more batches. These are questions to test at home, not findings from this site.",
            ]),
        ],
    },
    {
        "slug": "questions-before-multi-function-appliance",
        "title": "Questions to ask before buying a multi-function kitchen appliance",
        "deck": "Multi-function appliances promise many jobs. Ask which jobs you will do every week, and what each one costs in space and cleaning.",
        "products": ["P-02", "P-03", "P-01"],
        "sections": [
            ("Which functions will you use every week?", [
                "P-02's title lists '24 One-Touch Preset Options'. P-03's title lists 'Bake, Dehydrate, Frozen'. Open each listing's function list and count only the functions you will use weekly; the rest are a bonus.",
            ]),
            ("What comes in the box?", [
                "P-02's title says 'Six Cooking Accessories Included'. Check the list of accessories and whether you need extras for the jobs you plan.",
            ]),
            ("What should you check before you click?", [
                ("ul", [
                    "Warranty and support terms on the listing.",
                    "Which parts are dishwasher-safe, as stated in the listing.",
                    "Whether the figures you are comparing are for the same unit size.",
                    "Whether a cooking-food thermometer would help you check doneness. Compare meat thermometers in our meat thermometer section.",
                ]),
            ]),
        ],
    },
]

CSS = """
:root{--ink:#1d1b18;--muted:#6b645b;--paper:#faf7f2;--card:#ffffff;--line:#e4ddd2;--accent:#b4532a;--accent-ink:#8c3e1d;--ok:#2f6b3a;--warn:#8a5a00;--bad:#8c2b2b;--disc:#fff4d6;--disc-line:#e9c46a;}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font:16px/1.6 "Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent-ink)}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
.masthead{border-bottom:1px solid var(--line);background:var(--card)}
.masthead .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-top:18px;padding-bottom:12px}
.brand{font-family:Georgia,"Times New Roman",serif;font-size:26px;color:var(--ink);text-decoration:none;letter-spacing:.2px}
.brand small{display:block;font:12px/1.2 system-ui,sans-serif;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
.nav{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px}
.nav a{color:var(--ink);text-decoration:none;padding:4px 2px;border-bottom:2px solid transparent}
.nav a:hover,.nav a[aria-current="page"]{border-bottom-color:var(--accent)}
.disclosure{background:var(--disc);border-top:1px solid var(--disc-line);border-bottom:1px solid var(--disc-line);font-size:14px}
.disclosure .wrap{padding-top:8px;padding-bottom:8px}
main{padding:32px 0 48px}
h1{font-family:Georgia,"Times New Roman",serif;font-size:36px;line-height:1.2;margin:0 0 10px}
h2{font-family:Georgia,"Times New Roman",serif;font-size:24px;margin:36px 0 10px;border-top:1px solid var(--line);padding-top:22px}
h3{font-size:18px;margin:8px 0 6px}
.deck{font-size:18px;color:var(--muted);max-width:720px;margin:0 0 18px}
.kicker{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-ink);font-weight:600}
.grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:6px}
.card p{margin:0}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;padding:9px 14px;border-radius:6px;font-weight:600;margin-top:6px;align-self:flex-start}
.btn:hover{background:var(--accent-ink)}
.note{font-size:13px;color:var(--muted)}
.badge{display:inline-block;font-size:12px;padding:2px 8px;border-radius:999px;border:1px solid var(--line);background:#f4f1ec;color:var(--muted);margin-right:4px}
.badge.ok{color:var(--ok);border-color:#b9d8bf;background:#eef7f0}
.badge.warn{color:var(--warn);border-color:#e7cf93;background:#fdf7e6}
.badge.bad{color:var(--bad);border-color:#e0b4b4;background:#fbeeee}
.unv{color:var(--warn);font-style:italic}
.table-wrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:#f4f1ec;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
tr:last-child td{border-bottom:none}
.hero{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:28px;margin-bottom:8px}
.hero p{max-width:680px;margin:8px 0 0;color:var(--muted)}
.callout{background:var(--card);border-left:4px solid var(--accent);padding:14px 18px;border-radius:6px;margin:14px 0}
.callout.flag{border-left-color:var(--warn)}
.guide-list{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));padding:0;list-style:none}
.guide-list li{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px}
.guide-list a{font-weight:600;text-decoration:none;color:var(--ink)}
.guide-list a:hover{color:var(--accent-ink)}
article p,article li{max-width:720px}
.meta{font-size:14px;color:var(--muted);margin-bottom:12px}
footer{border-top:1px solid var(--line);background:var(--card);padding:26px 0 40px;font-size:14px;color:var(--muted)}
footer ul{list-style:none;padding:0;margin:8px 0 14px;display:flex;flex-wrap:wrap;gap:6px 16px}
footer a{color:var(--ink)}
.choice{border:1px dashed var(--line);border-radius:8px;padding:10px 12px;margin-top:10px;font-size:14px}
.opts{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));margin:8px 0 0;padding:0;list-style:none}
.opts li{background:#fbfaf7;border:1px solid var(--line);border-radius:8px;padding:10px}
@media (max-width:640px){h1{font-size:28px}.brand{font-size:22px}}
"""


# ---------------------------------------------------------------- helpers
def esc(value):
    return html.escape(str(value), quote=True)


def load(name):
    with open(DATA / name, encoding="utf-8") as fh:
        return json.load(fh)


def ext_rel(url):
    """Every Amazon-hosted link is marked sponsored; other external links get noopener only."""
    return SPONSORED_REL if re.search(r"https?://(www\.)?(amazon\.com|link\.amazon)/", url) else "noopener"


def unv(text="Unverified - blank"):
    return f'<span class="unv">{esc(text)}</span>'


def rel_path(depth):
    return "../" * depth


def page_html(title, description, path, body, depth=0, active=""):
    prefix = rel_path(depth)
    nav = "".join(
        f'<a href="{prefix}{esc(href)}"'
        + (' aria-current="page"' if href == active else "")
        + f">{esc(label)}</a>"
        for label, href in TOP_NAV
    )
    footer_links = "".join(
        f'<li><a href="{prefix}{esc(href)}">{esc(label)}</a></li>'
        for label, href in TOP_NAV + FOOTER_EXTRA
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} | Counterwise</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{SITE_URL}{esc(path)}">
<link rel="alternate" type="application/rss+xml" title="Counterwise guides" href="{prefix}feed.xml">
<link rel="stylesheet" href="{prefix}assets/style.css">
</head>
<body>
<header class="masthead">
  <div class="wrap">
    <a class="brand" href="{prefix}index.html">Counterwise<small>Working name · air fryers &amp; thermometers</small></a>
  </div>
  <div class="disclosure" role="note">
    <div class="wrap"><strong>Disclosure:</strong> {esc(DISCLOSURE)} Some links on this site are paid links. <a href="{prefix}disclosure.html">How we disclose</a>.</div>
  </div>
  <div class="wrap">
    <nav class="nav" aria-label="Main">{nav}</nav>
  </div>
</header>
<main class="wrap">
{body}
</main>
<footer>
  <div class="wrap">
    <div class="disclosure" style="border-radius:6px;padding:8px 12px;margin-bottom:12px;background:var(--disc)"><strong>Disclosure:</strong> {esc(DISCLOSURE)}</div>
    <strong>Every page on this site:</strong>
    <ul>{footer_links}</ul>
    <p>Listing data observed on {esc(BUILD_DATE)}. Every value is linked to its source in the <a href="{prefix}sources.html">Sources</a> list. Blank fields are unverified, not zero. This site is not operated by or affiliated with Amazon.com, Inc. Product names and trademarks belong to their owners.</p>
    <p>Editorial team (unnamed) · Working name · Static site. No cookies. One first-party script (<code>assets/counterwise.js</code>), with no endpoint configured, so it sends nothing.</p>
  </div>
</footer>
<script src="{prefix}assets/counterwise.js" defer></script>
</body>
</html>
"""


def load_extra_guides():
    """Optional extra guides in data/counterwise/guides.json.

    Absent file means the original four guides only. Present means both batches
    publish, so editorial drafts from a parallel session go live without a
    second build system. Entries marked publish:false are skipped to avoid
    duplicate content against guides the site already carries.
    """
    path = DATA / "counterwise" / "guides.json"
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    out = []
    for g in raw.get("guides", []):
        if g.get("publish") is False:
            continue
        sections = []
        for sec in g.get("sections", []):
            blocks = list(sec.get("p", []))
            if sec.get("bullets"):
                blocks.append(("ul", list(sec["bullets"])))
            sections.append((sec["h"], blocks))
        out.append({
            "slug": g["slug"],
            "title": g["title"],
            "deck": g["dek"],
            "sections": sections,
            "products": g.get("products", []),
            "checklist": g.get("checklist", []),
        })
    return out


BASE_GUIDES = GUIDES
GUIDES = BASE_GUIDES + load_extra_guides()


def product_map(products):
    return {p["id"]: p for p in products}


def product_card(p):
    name = SHORT_NAMES[p["id"]]
    return f"""<article class="card">
  <div class="kicker">{esc(p['id'])} · {esc(p['category'])}</div>
  <h3>{esc(name)}</h3>
  <p class="note">Observed ASIN (from listing URL): <strong>{esc(p['observed_redirect_asin'])}</strong><br>Confirmed {esc(p['confirmed_on'])}</p>
  <p><span class="badge warn">Special Link test pending</span><span class="badge">Price: not captured</span></p>
  <a class="btn" href="{esc(p['supplied_short_link'])}" rel="{SPONSORED_REL}" target="_blank">View on Amazon &#8599;</a>
  <p class="note">Paid link. {esc(DISCLOSURE)}</p>
</article>"""


def register_table(products):
    head = ("<tr><th>ID</th><th>Listing title (observed)</th><th>Category</th>"
            "<th>Supplied link (source)</th><th>Observed ASIN</th><th>Intended ASIN</th>"
            "<th>Official listing</th><th>Confirmed</th><th>Price</th><th>Commission rate</th>"
            "<th>Special Link</th><th>Flags</th></tr>")
    rows = []
    for p in products:
        rows.append(
            "<tr>"
            f"<td>{esc(p['id'])}</td>"
            f"<td>{esc(p['observed_title'])}<br><span class='note'>Source: <a href='https://www.amazon.com/dp/{esc(p['observed_redirect_asin'])}' target='_blank' rel='{SPONSORED_REL}'>amazon.com listing</a> · breadcrumb: {esc(p['amazon_breadcrumb'])}</span></td>"
            f"<td>{esc(p['category'])}</td>"
            f"<td><a href='{esc(p['source_url'])}' target='_blank' rel='{SPONSORED_REL}'>{esc(p['source_url'])}</a><br><span class='note'>{esc(p['source_label'])}</span></td>"
            f"<td><strong>{esc(p['observed_redirect_asin'])}</strong><br><span class='note'>from redirect path</span></td>"
            f"<td>{unv('Unverified - not supplied')}<br><span class='note'>{esc(p['intended_asin_status'])}</span></td>"
            f"<td><a href='{esc(p['official_listing_url'])}' target='_blank' rel='{SPONSORED_REL}'>{esc(p['official_listing_url'])}</a></td>"
            f"<td>{esc(p['confirmed_on'])}</td>"
            f"<td>{unv()}<br><span class='note'>{esc(p['price_status'])}</span></td>"
            f"<td>{unv()}<br><span class='note'>{esc(p['commission_status'])}</span></td>"
            f"<td><span class='badge warn'>Not tested</span><br><span class='note'>FLG-04</span></td>"
            f"<td>{esc(', '.join(p['flags']))}</td>"
            "</tr>"
        )
    return f"<div class='table-wrap'><table><thead>{head}</thead><tbody>{''.join(rows)}</tbody></table></div>"


def checklist_block(guide):
    items = guide.get("checklist") or []
    if not items:
        return ""
    lis = "".join("<li>%s</li>" % esc(i) for i in items)
    return ("<div class='callout checklist'><strong>The checklist.</strong>"
            "<ul>%s</ul></div>" % lis)


def guide_body(guide, pmap):
    parts = [f"<p class='kicker'>Guide · working title · published {BUILD_DATE}</p>",
             f"<h1>{esc(guide['title'])}</h1>",
             f"<p class='deck'>{esc(guide['deck'])}</p>",
             "<div class='callout flag'><strong>Paid links ahead.</strong> This guide links to Amazon listings. "
             f"{esc(DISCLOSURE)} Claims are the listing's own; none were independently tested.</div>",
             "<article>"]
    for heading, blocks in guide["sections"]:
        parts.append(f"<h2>{esc(heading)}</h2>")
        for block in blocks:
            if isinstance(block, tuple) and block[0] == "ul":
                parts.append("<ul>" + "".join(f"<li>{esc(item)}</li>" for item in block[1]) + "</ul>")
            else:
                parts.append(f"<p>{esc(block)}</p>")
    parts.append("</article>")
    parts.append(checklist_block(guide))
    parts.append("<h2>Products in this guide</h2><div class='grid'>")
    for pid in guide["products"]:
        parts.append(product_card(pmap[pid]))
    parts.append("</div>")
    parts.append("<p class='note'>Other guides: "
                 + " · ".join(f"<a href='{g['slug']}.html'>{esc(g['title'])}</a>" for g in GUIDES if g["slug"] != guide["slug"])
                 + "</p>")
    return "\n".join(parts)


# ---------------------------------------------------------------- build
def build():
    products = load("products.json")["products"]
    flags = load("flags.json")["flags"]
    sources = load("sources.json")["sources"]
    questions = load("questions.json")["questions"]
    suggestions = load("suggestions.json")
    pmap = product_map(products)

    # Remove only files this generator creates. Never remove the repo root or .git.
    for f in list(OUT.glob("*.html")) + [OUT / "feed.xml", OUT / "sitemap.xml", OUT / "robots.txt", OUT / ".nojekyll"]:
        if f.is_file():
            f.unlink()
    for d in [OUT / "guides", OUT / "assets"]:
        if d.is_dir():
            shutil.rmtree(d)
    (OUT / "assets").mkdir(parents=True)
    (OUT / "guides").mkdir()
    (OUT / "assets" / "style.css").write_text(CSS.strip() + "\n", encoding="utf-8")
    shutil.copyfile(ROOT / "scripts" / "assets" / "counterwise.js", OUT / "assets" / "counterwise.js")
    (OUT / ".nojekyll").write_text("", encoding="utf-8")

    pages = {}  # path -> (title, description, body, depth, active)

    # Front page
    cards = "".join(product_card(p) for p in products if p["category_slug"] == "air-fryers-ovens")
    thermo = "".join(product_card(p) for p in products if p["category_slug"] == "meat-thermometers")
    def guide_items_for(prefix_dir):
        return "".join(
            f"<li><a href='{prefix_dir}{g['slug']}.html'>{esc(g['title'])}</a><p class='note'>{esc(g['deck'])}</p></li>"
            for g in GUIDES)
    guide_items = guide_items_for("guides/")
    guide_items_here = guide_items_for("")
    pages["index.html"] = (
        "Air fryers and meat thermometers, shortlisted",
        "Five Amazon listings for air fryers, air fryer ovens, and meat thermometers, with buyer questions and sourced details.",
        f"""<section class="hero">
  <p class="kicker">Shortlist · updated {BUILD_DATE}</p>
  <h1>Five kitchen picks, compared on what their listings actually say</h1>
  <p>Three air fryers and ovens, two meat thermometers. Each card links to the Amazon listing. Specs are only what the listing states; prices and commission rates are not shown until they can be sourced.</p>
</section>
<h2>Air fryers &amp; ovens</h2>
<div class="grid">{cards}</div>
<p><a href="air-fryers-ovens.html">Compare all three &rarr;</a></p>
<h2>Meat thermometers</h2>
<div class="grid">{thermo}</div>
<p><a href="meat-thermometers.html">See both thermometers &rarr;</a></p>
<h2>Buying guides</h2>
<ul class="guide-list">{guide_items}</ul>
<div class="callout"><strong>Before you click.</strong> Paid links are marked. The Associates statement is above the fold on every page. Open <a href="register.html">the register</a> to see each row's source, and <a href="flagged.html">Flagged for Review</a> for open issues.</div>""",
        0, "index.html")

    cat_pages = {
        "air-fryers-ovens.html": ("Air fryers & ovens", "Three air fryers and air fryer ovens from their Amazon listings, with capacity and feature claims as listed.", "air-fryers-ovens", "Air fryers &amp; ovens", "Capacity figures come from listing titles. Features are the listing's own claims and were not tested."),
        "meat-thermometers.html": ("Meat thermometers", "Two meat thermometers from their Amazon listings, with claims as listed and certification claims flagged.", "meat-thermometers", "Meat thermometers", "Certification wording is a seller claim in the listing title and has not been checked against the certifying body (FLG-09)."),
    }
    for path, (title, desc, slug, heading, note) in cat_pages.items():
        items = [p for p in products if p["category_slug"] == slug]
        body = (f"<p class='kicker'>Category</p><h1>{heading}</h1>"
                f"<p class='deck'>{esc(desc)}</p>"
                f"<div class='callout flag'>{esc(note)}</div>"
                f"<div class='grid'>{''.join(product_card(p) for p in items)}</div>"
                f"<h2>Register rows for this category</h2>"
                f"{register_table(items)}")
        pages[path] = (title, desc, body, 0, path)

    # Guides
    pages["guides/index.html"] = (
        "Buying guides",
        "Question-shaped buying guides for air fryers and kitchen appliances, each tied to the listings it discusses.",
        "<p class='kicker'>Guides</p><h1>Questions to answer before you buy</h1>"
        "<p class='deck'>Each guide starts with a buyer question. Working titles only; no popularity claims.</p>"
        f"<ul class='guide-list'>{guide_items_here}</ul>"
        "<h2>Publishing cadence</h2><p>Not yet set. Options are on the <a href='../suggestions.html'>Suggestions</a> page (S-05).</p>",
        1, "guides/index.html")
    for g in GUIDES:
        pages[f"guides/{g['slug']}.html"] = (g["title"], g["deck"], guide_body(g, pmap), 1, "guides/index.html")

    # Register
    pages["register.html"] = (
        "Register",
        "Every product row with its observed listing data, source link, and verification status.",
        "<p class='kicker'>Register</p><h1>Product register</h1>"
        "<p class='deck'>One row per product. Every row links to its source. Blank cells are unverified and are not filled by inference.</p>"
        f"<div class='callout flag'>Tracking ID supplied: <strong>{esc(load('products.json')['meta']['tracking_id_supplied'])}</strong> · {esc(load('products.json')['meta']['tracking_id_status'])}</div>"
        + register_table(products),
        0, "register.html")

    # Analysis
    key_fields = [
        ("Listing title", lambda p: bool(p["observed_title"])),
        ("Observed ASIN (redirect path)", lambda p: bool(p["observed_redirect_asin"])),
        ("Official listing URL", lambda p: bool(p["official_listing_url"])),
        ("Category breadcrumb", lambda p: bool(p["amazon_breadcrumb"])),
        ("Intended ASIN", lambda p: bool(p["intended_asin"])),
        ("Price", lambda p: bool(p["price"])),
        ("Commission rate", lambda p: bool(p["commission_rate"])),
        ("Special Link validated", lambda p: False),
    ]
    cov_rows = []
    for p in products:
        verified = sum(1 for _, f in key_fields if f(p))
        cov_rows.append(f"<tr><td>{esc(p['id'])}</td><td>{esc(SHORT_NAMES[p['id']])}</td>"
                        f"<td>{verified} of {len(key_fields)}</td>"
                        f"<td>{esc(', '.join(name for name, f in key_fields if not f(p)))}</td></tr>")
    cov_table = ("<div class='table-wrap'><table><thead><tr><th>ID</th><th>Product</th><th>Verified fields</th>"
                 "<th>Unverified or missing</th></tr></thead><tbody>" + "".join(cov_rows) + "</tbody></table></div>")
    pages["analysis.html"] = (
        "Analysis",
        "Findings from the register: what is verified, what is missing, and what blocks decisions.",
        "<p class='kicker'>Analysis</p><h1>Findings from the register</h1>"
        "<p class='deck'>Descriptive findings only. No conversion score, revenue forecast, or commission estimate is presented, because none can be sourced yet.</p>"
        "<h2>1. Verification coverage</h2>"
        f"{cov_table}"
        "<h2>2. Findings</h2>"
        "<ol>"
        "<li><strong>All five supplied short links resolve to amazon.com listings.</strong> Observed 2026-11-20 (S-09, S-08).</li>"
        "<li><strong>The short-link codes are not ASINs.</strong> Each code is 9 characters; the ASINs observed in the redirect paths are 10 characters (S-08). The two fields are kept apart (FLG-01).</li>"
        "<li><strong>No intended ASIN was supplied,</strong> so no row can be checked against intent (FLG-01).</li>"
        "<li><strong>Three of five listings are air fryers or air fryer ovens; two are meat thermometers</strong> (Amazon breadcrumb, S-08).</li>"
        "<li><strong>Compliance status is open.</strong> Redirect rules in S-02 (Commission Income Statement s.2(e), s.2(g)) and the tracking-ID format (s.2(b)) are unresolved (FLG-02, FLG-03). This site does not state that any link is invalid.</li>"
        "<li><strong>No row has a verified price or commission rate</strong> (FLG-07, FLG-08).</li>"
        "<li><strong>Scaling is blocked</strong> until one Special Link per product passes the Associates test (FLG-04).</li>"
        "</ol>"
        "<h2>3. What would change these findings</h2>"
        "<p>A confirmed intended ASIN per row, a passed Special Link test, a sourced commission schedule, and first-party click data. See <a href='questions.html'>Questions</a>.</p>",
        0, "analysis.html")

    # Ledger
    ledger_rows = list(csv.reader((DATA / "campaign_ledger.csv").read_text(encoding="utf-8").splitlines()))
    header = ledger_rows[0]
    pages["ledger.html"] = (
        "Campaign ledger",
        "Empty campaign ledger with defined fields and provenance rules. Only authorized first-party reports are entered.",
        "<p class='kicker'>Ledger</p><h1>Campaign ledger</h1>"
        "<p class='deck'>Starts empty on purpose. A row is added only from an authorized first-party report, with its provenance reference. No conversion score or revenue forecast is shown.</p>"
        "<div class='table-wrap'><table><thead><tr>" + "".join(f"<th>{esc(h)}</th>" for h in header) +
        "</tr></thead><tbody><tr><td colspan='" + str(len(header)) + "' class='note'>No entries yet. No authorized first-party report has been provided.</td></tr></tbody></table></div>"
        "<h2>Rules</h2><ul><li>Timestamp (UTC), source, and channel are required on every row.</li>"
        "<li>Eligible sessions, clicks, and reported orders are entered only as reported, never estimated.</li>"
        "<li>Each row cites a provenance reference that names the report and its date.</li></ul>",
        0, "ledger.html")

    # Questions
    qrows = []
    for q in questions["questions"] if isinstance(questions, dict) else questions:
        qrows.append(
            f"<tr><td>{esc(q['id'])}</td><td>{esc(q['area'])}</td><td>{esc(q['question'])}</td>"
            f"<td><span class='badge {'ok' if q['status'].startswith('Answered') else ('warn' if q['status'].startswith('Partly') else 'bad')}'>{esc(q['status'])}</span></td>"
            f"<td>{esc(q['answer'])}</td>"
            f"<td>{' '.join(source_link(s) for s in q['sources']) or unv('No source')}</td>"
            f"<td>{esc(', '.join(q['flags']))}</td><td>{esc(q['how_to_discover'])}</td></tr>")
    pages["questions.html"] = (
        "Questions",
        "The questions that must be answered before decisions, with what is known, what is missing, and how to find out.",
        "<p class='kicker'>Questions</p><h1>What we know, what we don't, and how to find out</h1>"
        "<p class='deck'>Read this before making any decision about links, measurement, or content.</p>"
        "<div class='table-wrap'><table><thead><tr><th>ID</th><th>Area</th><th>Question</th><th>Status</th><th>Answer or gap</th><th>Sources</th><th>Flags</th><th>How to discover</th></tr></thead><tbody>"
        + "".join(qrows) + "</tbody></table></div>",
        0, "questions.html")

    # Suggestions
    sug_cards = []
    for s in suggestions["suggestions"]:
        opts = "".join(
            f"<li><strong>{esc(o['id'])}. {esc(o['label'])}</strong><br><span class='note'>Pros: {esc(o['pros'])}</span><br><span class='note'>Cons: {esc(o['cons'])}</span></li>"
            for o in s["options"])
        sug_cards.append(
            f"<article class='card'><div class='kicker'>{esc(s['id'])} · {esc(s['topic'])}</div>"
            f"<h3>{esc(s['question'])}</h3>"
            f"<ul class='opts'>{opts}</ul>"
            f"<p class='note'><strong>Advisory only:</strong> {esc(s['recommendation'])}</p>"
            f"<div class='choice'>Status: <span class='badge warn'>Awaiting your choice</span> Reply in chat with &ldquo;{esc(s['id'])}: [option letter]&rdquo;.</div></article>")
    pages["suggestions.html"] = (
        "Suggestions",
        "Options to choose from before any change is made. Nothing here has been implemented.",
        "<p class='kicker'>Suggestions</p><h1>Choose the path before anything changes</h1>"
        f"<p class='deck'>{esc(suggestions['note'])}</p>"
        "<div class='grid'>" + "".join(sug_cards) + "</div>",
        0, "suggestions.html")

    # Flagged
    frows = []
    for f in flags:
        srcs = " ".join(source_link(s) for s in f["sources"]) or unv("No external source")
        sev = {"High": "bad", "Medium": "warn", "Low": ""}[f["severity"]]
        frows.append(
            f"<tr><td>{esc(f['id'])}</td><td><span class='badge {sev}'>{esc(f['severity'])}</span></td>"
            f"<td><strong>{esc(f['title'])}</strong></td><td>{esc(f['detail'])}</td>"
            f"<td>{srcs}</td><td>{esc(f['action'])}</td></tr>")
    pages["flagged.html"] = (
        "Flagged for Review",
        "Irregularities and unverified items, with source links, for review after the site is live.",
        "<p class='kicker'>Flagged for Review</p><h1>Flagged for Review</h1>"
        "<p class='deck'>Irregularities and unverified items. They are published here so you can review and request changes. They do not block publication.</p>"
        "<div class='table-wrap'><table><thead><tr><th>ID</th><th>Severity</th><th>Issue</th><th>Detail</th><th>Sources</th><th>Action</th></tr></thead><tbody>"
        + "".join(frows) + "</tbody></table></div>",
        0, "flagged.html")

    # Sources
    srows = []
    for s in sources:
        link = f"<a href='{esc(s['url'])}' target='_blank' rel='{ext_rel(s['url'])}'>{esc(s['url'])}</a>" if s["url"] else unv("No URL")
        srows.append(f"<tr id='{esc(s['id'])}'><td>{esc(s['id'])}</td><td>{esc(s['title'])}<br><span class='note'>{esc(s['publisher'])}</span></td>"
                     f"<td>{link}</td><td>{esc(s['status'])}</td><td>{esc(s['used_for'])}</td></tr>")
    pages["sources.html"] = (
        "Sources",
        "Every source used on this site, with its verification status and what it supports.",
        "<p class='kicker'>Sources</p><h1>Sources</h1>"
        f"<p class='deck'>Accessed {esc(BUILD_DATE)}. Statuses show what was verified, not only what was found.</p>"
        "<div class='table-wrap'><table><thead><tr><th>ID</th><th>Source</th><th>Link</th><th>Status</th><th>Used for</th></tr></thead><tbody>"
        + "".join(srows) + "</tbody></table></div>",
        0, "sources.html")

    # Disclosure & privacy
    pages["disclosure.html"] = (
        "Disclosure & privacy",
        "How this site discloses paid links, what it does with visitor data, and the Associates statement.",
        "<p class='kicker'>Disclosure</p><h1>Disclosure &amp; privacy</h1>"
        f"<div class='callout'><strong>Associates statement.</strong> {esc(DISCLOSURE)} (Operating Agreement, Section 5; <a href='sources.html#S-01'>S-01</a>.)</div>"
        "<h2>Paid links</h2><p>Links to Amazon are paid links. Each is marked as sponsored for search engines (rel=\"sponsored\"; Google's documentation, <a href='sources.html#S-06'>S-06</a>) and labeled as paid next to the link for readers (FTC standard, <a href='sources.html#S-05'>S-05</a>).</p>"
        "<h2>Privacy</h2><p>This is a static site. It sets no cookies and writes nothing to browser storage. It loads one first-party script, <code>assets/counterwise.js</code>. No endpoint is configured, so the script sends nothing and logs events to the browser console only. The build fails if any other script is added.</p>"
        "<h2>Measurement events in the client</h2><p>As named in the client's header and the earlier review page (not yet confirmed by the requester; FLG-05): <code>page_view</code>, <code>outbound_click</code>, <code>guide_engaged</code>, <code>disclosure_view</code>, <code>affiliate_conversion_reported</code> (entered only from a dated, authorized Associates report, never inferred from a click). A hosted endpoint is not provisioned (FLG-06).</p>"
        "<h2>Affiliation</h2><p>This site is not operated by or affiliated with Amazon.com, Inc. Product names and trademarks belong to their owners.</p>",
        0, "disclosure.html")

    # Executive summary
    pages["executive-summary.html"] = (
        "Executive summary",
        "Executive summary: what is verified, what is blocked, and which decisions are needed.",
        "<p class='kicker'>Executive summary</p><h1>Summary for decision-making</h1>"
        "<div class='callout'><strong>Scope.</strong> Five Amazon listings: three air fryers and ovens, two meat thermometers. A register with sources, a site of buying guides, and a flagged review list.</div>"
        "<h2>Verified</h2><ul>"
        "<li>Each supplied short link resolves to an amazon.com listing (observed 2026-11-20; S-08, S-09).</li>"
        "<li>Listing titles, observed ASINs, and category breadcrumbs for all five (S-08).</li>"
        "<li>The Associates Section 5 sentence matches the Operating Agreement word for word (S-01).</li></ul>"
        "<h2>Not verified</h2><ul>"
        "<li>Intended ASINs (FLG-01), prices (FLG-08), and commission rates (FLG-07).</li>"
        "<li>Tracking ID validity (FLG-03). Redirect compliance (FLG-02).</li>"
        "<li>Click and conversion measurement (FLG-05, FLG-06) and Search Console (FLG-13).</li></ul>"
        "<h2>Blocked</h2><ul>"
        "<li><strong>Scaling</strong> waits for one passed Special Link test per product (FLG-04).</li>"
        "<li><strong>Measurement</strong> waits for the five events to be defined and a hosting choice (FLG-05, FLG-06).</li>"
        "<li><strong>Topic choice</strong> waits for measured queries (FLG-14).</li></ul>"
        "<h2>Decisions needed</h2><p>Six decisions are open on the <a href='suggestions.html'>Suggestions</a> page (S-01 to S-06). Reply with a choice to proceed.</p>"
        "<h2>Not presented</h2><p>No conversion score, revenue forecast, or commission estimate. None can be sourced yet.</p>",
        0, "executive-summary.html")

    # Write pages
    for path, (title, desc, body, depth, active) in pages.items():
        full = page_html(title, desc, path, body, depth, active)
        target = OUT / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(full, encoding="utf-8")

    write_feed()
    write_sitemap(sorted(pages.keys()))
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}sitemap.xml\n", encoding="utf-8")
    return sorted(pages.keys())


def source_link(source_id):
    return f"<a href='sources.html#{esc(source_id)}'>{esc(source_id)}</a>"


def write_feed():
    pub = email.utils.format_datetime(datetime.datetime(2026, 11, 20, 9, 0, tzinfo=datetime.timezone.utc))
    items = []
    for g in GUIDES:
        link = f"{SITE_URL}guides/{g['slug']}.html"
        items.append(
            f"<item><title>{esc(g['title'])}</title><link>{link}</link><guid isPermaLink=\"true\">{link}</guid>"
            f"<pubDate>{pub}</pubDate><description>{esc(g['deck'])}</description></item>")
    feed = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            "<rss version=\"2.0\"><channel>"
            "<title>Counterwise guides (working name)</title>"
            f"<link>{SITE_URL}</link>"
            "<description>Question-shaped buying guides for air fryers and kitchen appliances.</description>"
            "<language>en-us</language>"
            f"<lastBuildDate>{pub}</lastBuildDate>"
            + "".join(items) + "</channel></rss>\n")
    (OUT / "feed.xml").write_text(feed, encoding="utf-8")


def write_sitemap(paths):
    urls = "".join(
        f"<url><loc>{SITE_URL}{p}</loc><lastmod>{BUILD_DATE}</lastmod></url>"
        for p in paths if p.endswith(".html"))
    (OUT / "sitemap.xml").write_text(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        f"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">{urls}</urlset>\n",
        encoding="utf-8")


# ---------------------------------------------------------------- validation
EXCLUDED_TOP = {"alt-site", "archive", "audit", "data", "scripts", "docs", ".github", ".git"}


def generated_html():
    """HTML pages this generator wrote (excludes other sessions' folders)."""
    return [p for p in OUT.rglob("*.html") if p.relative_to(OUT).parts[0] not in EXCLUDED_TOP]


def mirror_to_docs():
    """Copy the generated site into docs/ so the audit and older references see the same pages."""
    docs = ROOT / "docs"
    if docs.exists():
        shutil.rmtree(docs)
    docs.mkdir()
    for f in generated_html():
        target = docs / f.relative_to(OUT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(f, target)
    for name in ["guides", "assets"]:
        shutil.copytree(OUT / name, docs / name, dirs_exist_ok=True)
    for name in ["feed.xml", "sitemap.xml", "robots.txt", ".nojekyll"]:
        shutil.copyfile(OUT / name, docs / name)


def validate(pages, products):
    errors = []
    html_files = generated_html()
    link_re = re.compile(r"<a\s+([^>]*)>", re.I)
    href_re = re.compile(r'href=[\'"]([^\'"]+)[\'"]', re.I)
    rel_re = re.compile(r'rel=[\'"]([^\'"]+)[\'"]', re.I)
    for f in html_files:
        text = f.read_text(encoding="utf-8")
        rel_name = f.relative_to(OUT).as_posix()
        if text.count(DISCLOSURE) < 2:
            errors.append(f"{rel_name}: disclosure must appear in the strip and in the footer")
        for src in re.findall(r"<script[^>]*src=[\'\"]([^\'\"]+)[\'\"]", text, re.I):
            if not src.endswith("assets/counterwise.js"):
                errors.append(f"{rel_name}: unexpected script {src}")
        if len(re.findall(r"<script", text, re.I)) != len(re.findall(r"<script[^>]*src=[\'\"][^\'\"]*counterwise\.js", text, re.I)):
            errors.append(f"{rel_name}: inline script found (only counterwise.js is allowed)")
        for tag_attrs in link_re.findall(text):
            href_m = href_re.search(tag_attrs)
            if not href_m:
                continue
            href = href_m.group(1)
            if href.startswith(("http://", "https://")):
                if re.search(r"https?://(www\.)?(amazon\.com|link\.amazon)/", href):
                    rel_m = rel_re.search(tag_attrs)
                    if not rel_m or "sponsored" not in rel_m.group(1).split():
                        errors.append(f"{rel_name}: Amazon link lacks rel=sponsored: {href}")
                continue
            if href.startswith(("#", "mailto:")):
                continue
            target = href.split("#")[0].split("?")[0]
            if not target:
                continue
            resolved = (f.parent / target).resolve()
            if not resolved.exists():
                errors.append(f"{rel_name}: broken internal link -> {href}")
    for p in products:
        if not p["source_url"].startswith(("https://link.amazon/", "https://www.amazon.com/")):
            errors.append(f"{p['id']}: source is not an Amazon-official URL")
        if not p["official_listing_url"].startswith("https://www.amazon.com/dp/"):
            errors.append(f"{p['id']}: official listing URL is not amazon.com/dp/")
        if p["observed_redirect_asin"] not in p["official_listing_url"]:
            errors.append(f"{p['id']}: observed ASIN does not match listing URL")
        if len(p["observed_redirect_asin"]) != 10:
            errors.append(f"{p['id']}: observed ASIN is not 10 characters")
        if SHORT_NAMES[p["id"]] not in p["observed_title"]:
            errors.append(f"{p['id']}: display name is not verbatim in observed title")
        status_for = {"intended_asin": "intended_asin_status", "price": "price_status",
                      "commission_rate": "commission_status"}
        for field, status_key in status_for.items():
            if not p[field] and "UNVERIFIED" not in p[status_key]:
                errors.append(f"{p['id']}: blank {field} without an UNVERIFIED status")
        known_flags = {f["id"] for f in load("flags.json")["flags"]}
        for flag_id in p["flags"]:
            if flag_id not in known_flags:
                errors.append(f"{p['id']}: references unknown flag {flag_id}")
    client = (OUT / "assets" / "counterwise.js").read_text(encoding="utf-8")
    if re.search(r"document\.cookie|localStorage|sessionStorage", client):
        errors.append("counterwise.js writes cookies or browser storage")
    if re.search(r"COUNTERWISE\s*=\s*\{[^}]*endpoint:\s*'https?", "".join(p.read_text(encoding='utf-8') for p in generated_html())):
        errors.append("an analytics endpoint is configured in a page; this must be a reviewed change")
    if len(GUIDES) < 4:
        errors.append("expected at least four guides, found %d" % len(GUIDES))
    return errors


def main():
    pages = build()
    products = load("products.json")["products"]
    errors = validate(pages, products)
    print(f"Built {len(pages)} pages into the repository root (served by Pages)")
    if not errors:
        mirror_to_docs()
        print("Mirrored to docs/")
    if errors:
        print("VALIDATION FAILED:")
        for e in errors:
            print("  -", e)
        return 1
    print("Validation passed: disclosures, sponsored rel, internal links, sources, blanks.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
