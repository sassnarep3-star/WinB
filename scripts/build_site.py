#!/usr/bin/env python3
"""Build the verification register in register/ from data/*.json.
The register is published inside the Counterwise site (repository root).

Only the Python standard library is used. Every page is generated from the
JSON files in data/, so the tables, sources and flags stay in one place.
Run:  python3 scripts/build_site.py  (also rewrites sitemap.xml and robots.txt at the root)
"""
import html
import json
import pathlib
import datetime
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "register"


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


SITE = load("site.json")
PRODUCTS = load("products.json")["products"]
SOURCES = {s["id"]: s for s in load("sources.json")["sources"]}
COMPLIANCE = load("compliance.json")["rules"]
FINDINGS = load("findings.json")["findings"]
FLAGS = load("flags.json")["flags"]
QUESTIONS = load("questions.json")["questions"]
SUGGESTIONS = load("suggestions.json")
GUIDES = load("guides.json")
LEDGER = load("ledger.json")
AS_OF = SITE["as_of"]
DISCLOSURE = SITE["disclosure_statement"]
DISCLOSURE_EXTRA = SITE["disclosure_extra"]

PRODUCT_HOSTS = ("amazon.com", "link.amazon")


def esc(text):
    return html.escape(str(text if text is not None else ""), quote=True)


def is_product_link(url):
    host = urlparse(url).hostname or ""
    if host == "affiliate-program.amazon.com":
        return False  # Associates policy pages are not product links
    return any(host == h or host.endswith("." + h) for h in PRODUCT_HOSTS)


def ext(url, label=None):
    """External link. Every Amazon product link is marked rel=sponsored."""
    label = label if label is not None else url
    if is_product_link(url):
        rel = "sponsored noopener"
    else:
        rel = "external noopener"
    return f'<a href="{esc(url)}" rel="{rel}" target="_blank">{esc(label)}</a>'


def src_link(source_id):
    s = SOURCES[source_id]
    return f'{ext(s["url"], s["id"])}'


def src_links(ids):
    return ", ".join(src_link(i) for i in ids) if ids else "—"


def table(headers, rows, cls="", required_source=False):
    head = "".join(f"<th scope=\"col\">{esc(h)}</th>" for h in headers)
    body_rows = []
    for r in rows:
        cells = "".join(f"<td>{c}</td>" for c in r)
        body_rows.append(f"<tr>{cells}</tr>")
    attr = ' data-source-required="1"' if required_source else ""
    return (
        f'<div class="tablewrap"><table class="{cls}"{attr}>'
        f"<thead><tr>{head}</tr></thead><tbody>{''.join(body_rows)}</tbody>"
        f"</table></div>"
    )


def badge(text):
    t = str(text)
    low = t.lower()
    if low.startswith(("needs", "open", "unresolved", "awaiting", "not published", "not validated", "unverified")):
        cls = "warn"
    elif low.startswith(("implemented", "verified", "fetched", "logged", "done")):
        cls = "ok"
    else:
        cls = "neutral"
    return f'<span class="badge {cls}">{esc(t)}</span>'


def nav_html(active):
    items = []
    for item in SITE["nav"]:
        cur = ' aria-current="page"' if item["href"] == active else ""
        items.append(f'<li><a href="{esc(item["href"])}"{cur}>{esc(item["label"])}</a></li>')
    return f'<nav class="nav" aria-label="Site sections"><ul>{"".join(items)}</ul></nav>'


def page(filename, title, description, body, active=None):
    active = active or filename
    head = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} · {esc(SITE["site_name"])}</title>
<meta name="description" content="{esc(description)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:type" content="website">
<meta name="robots" content="index,follow">
<style>{CSS}</style>
<link rel="alternate" type="application/rss+xml" title="{esc(SITE["site_name"])} feed" href="../feed.xml">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="mast"><div class="wrap">
  <a class="brand" href="index.html">{esc(SITE["site_name"])}</a>
  <p class="tag">{esc(SITE["tagline"])}</p>
</div></header>
<aside class="disclosure" role="note" aria-label="Affiliate disclosure"><div class="wrap">
  <strong>Disclosure.</strong> {esc(DISCLOSURE)} {esc(DISCLOSURE_EXTRA)}
</div></aside>
{nav_html(active)}
<main id="main" class="wrap">
{body}
</main>
<script src="../assets/counterwise.js"></script>
<footer class="foot"><div class="wrap">
  <aside class="disclosure foot-disc" role="note"><strong>Disclosure.</strong> {esc(DISCLOSURE)} {esc(DISCLOSURE_EXTRA)}</aside>
  <div class="foot-grid">
    <div><h2>Dashboards</h2><ul>{''.join(f'<li><a href="{esc(i["href"])}">{esc(i["label"])}</a></li>' for i in SITE["nav"])}</ul></div>
    <div><h2>About this site</h2>
      <p>Author: {esc(SITE["author"])}</p>
      <p>Data as of {esc(AS_OF)} (UTC). Every value is checked against an official page or policy text listed on the <a href="sources.html">Sources</a> page. Unverified values are left blank and flagged.</p>
      <p>Not affiliated with Amazon.com, Inc. Product names are trademarks of their owners.</p>
      <p><a href="{esc(SITE["repo_url"])}" rel="external noopener" target="_blank">Source repository</a> · <a href="../feed.xml">Guides feed (RSS)</a></p>
    </div>
  </div>
</div></footer>
</body>
</html>
"""
    (OUT / filename).write_text(head, encoding="utf-8")


def h(level, text):
    return f"<h{level}>{esc(text)}</h{level}>"


def product_short_link(p):
    return ext(p["short_link_supplied"], "Amazon product link")


# ---------- pages ----------

def page_index():
    cards = []
    for p in PRODUCTS:
        cards.append(f"""<article class="card">
  <p class="kicker">{esc(p["category"])} · {esc(p["id"])}</p>
  <h3>{esc(p["listing_title"])}</h3>
  <p class="meta">Observed ASIN <code>{esc(p["observed_redirect_asin"])}</code> · Intended ASIN: <em>blank, unverified</em></p>
  <p>{product_short_link(p)}</p>
  <p>{badge(p["special_link_status"])}</p>
  <p class="small">Price and rating: not shown (Program Policies §2(b), §6(t)).</p>
</article>""")
    body = f"""
<section class="hero">
  <h1>Five kitchen products, each with its Amazon listing</h1>
  <p class="lede">Three air fryers and two meat thermometers from the links you supplied. Each card shows the product as Amazon's own page names it, the ASIN observed on that page, and the link status. Prices and ratings are not shown: Amazon's policy allows them only when Amazon serves them or through its API, and this site does not use either.</p>
  <p class="actions"><a class="btn" href="products.html">See all products and the confirmation record</a> <a class="btn ghost" href="air-fryers.html">Air fryers</a> <a class="btn ghost" href="thermometers.html">Thermometers</a></p>
</section>
<section class="grid">{''.join(cards)}</section>
<section>
  {h(2, "How the links are checked")}
  <p>Each link was resolved on {esc(AS_OF)}. The page each one reaches is listed in the <a href="products.html">confirmation record</a>. One item is still open: the supplied short links have not been validated against your Associates account (see <a href="flagged.html">Flagged for review</a>, FLG-01 to FLG-04).</p>
  <div class="stats">
    <div><strong>{len(PRODUCTS)}</strong><span>products</span></div>
    <div><strong>{len(FINDINGS)}</strong><span>findings</span></div>
    <div><strong>{len(COMPLIANCE)}</strong><span>policy checks</span></div>
    <div><strong>{len(FLAGS)}</strong><span>flags for review</span></div>
  </div>
</section>
<section>
  {h(2, "Start here")}
  <ul class="plain">
    <li><a href="executive-summary.html">Executive summary</a> — what we know, what we do not know, and what decides the next step.</li>
    <li><a href="suggestions.html">Suggestions</a> — ten decisions for you to choose from. Nothing has been changed on the site yet.</li>
    <li><a href="questions.html">Open questions</a> — what must be answered before those decisions can be made.</li>
  </ul>
</section>"""
    page("index.html", "Five kitchen products, each with its Amazon listing",
         "Air fryers and meat thermometers from supplied Amazon links, with each ASIN, listing title and link status checked against Amazon's own pages.",
         body)


def page_products():
    rows = []
    for p in PRODUCTS:
        rows.append([
            esc(p["id"]),
            esc(p["listing_title"]),
            esc(p["category"]),
            f'<code>{esc(p["observed_redirect_asin"])}</code>',
            ext(p["official_listing_url"], "Amazon listing"),
            esc(p["price"]) or "<em>not shown</em>",
            badge(p["special_link_status"]),
            ext(p["source_url"], "Source"),
        ])
    main_table = table(
        ["ID", "Product (listing title)", "Category", "Observed ASIN", "Official listing", "Price", "Special Link status", "Source"],
        rows, required_source=True)
    rec_rows = []
    for p in PRODUCTS:
        rec_rows.append([
            esc(p["id"]),
            ext(p["short_link_supplied"], p["short_link_code"]) + f'<br><span class="small">{p["short_link_code_length"]} characters</span>',
            f'<em>{esc(p["intended_asin_status"])}</em>',
            ext(p["official_listing_url"]),
            esc(p["confirmation_date"]),
            ext(p["source_url"], "Source"),
            f'<code class="wrapcode">{esc(p["observed_redirect_target"])}</code>',
        ])
    rec_table = table(
        ["ID", "Short link as supplied", "Intended ASIN", "Official listing URL", "Confirmation date", "Source", "Observed redirect target (kept separate)"],
        rec_rows, required_source=True)
    body = f"""
<h1>All products</h1>
<p class="lede">Listing details as shown on Amazon's product pages on {esc(AS_OF)}. Price is not shown. Amazon's policy (§2(b)) allows prices only when Amazon serves them or via its API, and this site does not use the API yet.</p>
{h(2, "Product table")}
{main_table}
{h(2, "Product-intent confirmation record")}
<p>The intended ASIN and the observed redirect target are separate fields and are never merged. The intended ASIN stays blank until the owner confirms it.</p>
{rec_table}
<p class="small">Field rules: intended ASIN = what the owner intends (blank until confirmed). Observed redirect target = the final URL seen when the supplied short link was resolved. Neither field is inferred from the other.</p>
"""
    page("products.html", "All products", "All five products with listing title, observed ASIN, source link and link status.", body)


def page_category(filename, title, category, intro):
    items = [p for p in PRODUCTS if p["category"] == category]
    rows = []
    for p in items:
        rows.append([
            esc(p["id"]),
            esc(p["listing_title"]),
            f'<code>{esc(p["observed_redirect_asin"])}</code>',
            ext(p["official_listing_url"], "Amazon listing"),
            badge(p["special_link_status"]),
            "<em>not shown</em>",
            ext(p["source_url"], "Source"),
        ])
    t = table(["ID", "Product (listing title)", "Observed ASIN", "Official listing", "Special Link status", "Price", "Source"], rows, required_source=True)
    guide_items = "".join(f'<li>{esc(g["working_title"])} <span class="small">({esc(g["status"])})</span></li>' for g in GUIDES["titles"] if any(pid in g["related_products"] for pid in [p["id"] for p in items]))
    body = f"""
<h1>{esc(title)}</h1>
<p class="lede">{esc(intro)}</p>
{t}
{h(2, "Guide ideas linked to this category")}
<p class="small">These are working titles only. They are not published and make no claims about popularity or superiority (see <a href="guides.html">Guide ideas</a>).</p>
<ul class="plain">{guide_items or "<li>None yet.</li>"}</ul>
"""
    page(filename, title, intro, body)


def page_findings():
    rows = []
    for f in FINDINGS:
        rows.append([esc(f["id"]), esc(f["finding"]), esc(f["evidence"]), src_links(f["source_ids"]), badge(f["confidence"])])
    body = f"""
<h1>Findings</h1>
<p class="lede">{esc(SITE_FINDINGS_SCOPE())}</p>
{table(["ID", "Finding", "Evidence", "Sources", "Confidence"], rows, required_source=False)}
<p class="small">No conversion, revenue or demand estimate is made. The campaign ledger starts empty (<a href="ledger.html">see ledger</a>).</p>
"""
    page("findings.html", "Findings", "Analysis of the five supplied Amazon links and the policy limits that apply.", body)


def SITE_FINDINGS_SCOPE():
    return load("findings.json")["scope"]


def page_compliance():
    rows = []
    for r in COMPLIANCE:
        rows.append([esc(r["id"]), esc(r["rule"]), src_link(r["source_id"]) + f'<br><span class="small">{esc(r["source_detail"])}</span>', esc(r["site_implementation"]), badge(r["status"])])
    body = f"""
<h1>Compliance gate</h1>
<p class="lede">Every rule below is taken from an official Amazon, FTC, Google or GitHub document. The publishing workflow checks the rules that can be checked automatically (see the <code>check_site.py</code> script in the repository).</p>
<section class="callout"><p><strong>Required statement.</strong> {esc(DISCLOSURE)} It appears under the masthead of every page and in the footer, as Operating Agreement §5 requires.</p></section>
{table(["ID", "Rule", "Official source", "What the site does", "Status"], rows, required_source=True)}
"""
    page("compliance.html", "Compliance gate", "Amazon Associates, FTC and Google rules checked against this site, with official source links.", body)


def page_questions():
    rows = []
    for q in QUESTIONS:
        rows.append([esc(q["id"]), esc(q["question"]), esc(q["have"]), esc(q["missing"]), esc(q["how_to_answer"]), esc(q["blocks"]), badge(q["status"])])
    body = f"""
<h1>Open questions</h1>
<p class="lede">{esc(load("questions.json")["intro"])}</p>
{table(["ID", "Question", "What we have", "What is missing", "How to answer", "Blocks", "Status"], rows)}
"""
    page("questions.html", "Open questions", "Questions and missing information needed before the next decision.", body)


def page_suggestions():
    cards = []
    for d in SUGGESTIONS["decisions"]:
        opts = "".join(f"<li>{esc(o)}</li>" for o in d["options"])
        cards.append(f"""<article class="card wide" id="{esc(d["id"].lower())}">
  <p class="kicker">{esc(d["id"])}</p>
  <h3>{esc(d["decision"])}</h3>
  <ul class="plain">{opts}</ul>
  <p><strong>Recommendation:</strong> {esc(d["recommendation"])}</p>
  <p class="small"><strong>Trade-offs:</strong> {esc(d["trade_offs"])}</p>
  <p class="small"><strong>Sources:</strong> {src_links(d["sources"])}</p>
  <p>{badge(d["status"])}</p>
</article>""")
    deferred = "".join(f"<li><strong>{esc(x['id'])}</strong> {esc(x['item'])}: {esc(x['state'])}</li>" for x in SUGGESTIONS["deferred_items"])
    body = f"""
<h1>Suggestions</h1>
<p class="lede">{esc(SUGGESTIONS["intro"])}</p>
<section class="callout"><p>Reply in the chat with a choice for each ID, for example "D1 B, D2 B, D6 A, D10 A". The next session carries out only the choices you make.</p></section>
<section class="grid one">{''.join(cards)}</section>
<section>{h(2, "Deferred items")}<ul class="plain">{deferred}</ul></section>
"""
    page("suggestions.html", "Suggestions", "Ten decisions for the owner to choose from before anything changes on the site.", body)


def page_guides():
    rows = []
    for g in GUIDES["titles"]:
        rows.append([esc(g["id"]), esc(g["working_title"]), "Yes" if g["question_shape"] else "No", esc(", ".join(g["related_products"])), badge(g["status"])])
    body = f"""
<h1>Guide ideas</h1>
<p class="lede">{esc(GUIDES["note"])}</p>
{table(["ID", "Working title", "Question-shaped", "Related products", "Status"], rows)}
<p class="small">Titles are from the brief. Publishing waits for decision D6 and for the product facts each guide would need to cite.</p>
"""
    page("guides.html", "Guide ideas", "Working titles for buyer-question guides. Not published.", body)


def page_ledger():
    rows = [[esc(c["label"]) for c in LEDGER["columns"]]]
    empty = f'<tr><td colspan="{len(LEDGER["columns"])}" class="empty">No rows yet. No authorized first-party report has been supplied.</td></tr>'
    head = "".join(f'<th scope="col">{esc(c["label"])}</th>' for c in LEDGER["columns"])
    t = f'<div class="tablewrap"><table><thead><tr>{head}</tr></thead><tbody>{empty}</tbody></table></div>'
    body = f"""
<h1>Campaign ledger</h1>
<p class="lede">{esc(LEDGER["note"])}</p>
{t}
<p class="small">No conversion score, revenue forecast or optimization is presented. See <a href="questions.html">Q14</a> for the reports that will feed this table.</p>
"""
    page("ledger.html", "Campaign ledger", "Empty campaign ledger with the columns required for authorized reports.", body)


def page_sources():
    rows = []
    for s in SOURCES.values():
        rows.append([
            f'<span id="{esc(s["id"].lower())}">{esc(s["id"])}</span>',
            esc(s["title"]),
            esc(s["publisher"]),
            ext(s["url"]),
            esc(s["accessed"]),
            esc(s["used_for"]),
            badge(s["status"]),
        ])
    body = f"""
<h1>Sources</h1>
<p class="lede">Every source below was fetched on {esc(AS_OF)}. Only these are cited on the site. Sources marked as not official are the owner's supplied links.</p>
{table(["ID", "Title", "Publisher", "URL", "Accessed", "Used for", "Status"], rows, required_source=True)}
"""
    page("sources.html", "Sources", "Official sources used to verify every row on this site.", body)


def page_flagged():
    rows = []
    for f in FLAGS:
        srcs = ", ".join(ext(u, urlparse(u).path.strip("/") or u) for u in f["source_urls"]) or "—"
        rows.append([esc(f["id"]), esc(f["title"]), esc(f["detail"]), srcs, esc(f["owner_action"]), badge(f["status"])])
    body = f"""
<h1>Flagged for review</h1>
<p class="lede">{esc(load("flags.json")["note"])} Each item lists the source where one was found, and the action the owner can take.</p>
{table(["ID", "Item", "Detail", "Source links", "Owner action", "Status"], rows)}
"""
    page("flagged.html", "Flagged for review", "Irregularities and unverified items, with source links, for owner review.", body)


def page_exec():
    body = f"""
<h1>Executive summary</h1>
<p class="lede">As of {esc(AS_OF)}. What this site covers, what is verified, and what is not.</p>
<section>
  {h(2, "What the site is")}
  <p>A product register for five Amazon products from the links you supplied: three air fryers and two meat thermometers. It is published inside the Counterwise site under <code>/register/</code> and linked from the navigation and footer of every page. The register lists each product with its listing title, observed ASIN, link status and source, and records every policy rule that applies.</p>
</section>
<section>
  {h(2, "What is verified")}
  <ul class="plain">
    <li>Each supplied short link resolves to one Amazon product page. The five ASINs seen on those pages are B0CDY277D3, B09B7SB46R, B08DKYBTPH, B0DHZTCNR5 and B0DZFD6R9Z (<a href="products.html">confirmation record</a>).</li>
    <li>Amazon's Operating Agreement §5 requires the statement "{esc(DISCLOSURE)}". It is on every page.</li>
    <li>Amazon's Program Policies limit how prices and ratings may be shown, and bar price tracking unless Amazon agrees (<a href="compliance.html">Compliance</a>).</li>
    <li>FTC guidance and Google's rel="sponsored" guidance are applied (<a href="compliance.html">Compliance</a>).</li>
  </ul>
</section>
<section>
  {h(2, "What is not verified")}
  <ul class="plain">
    <li>The intended ASIN for each link. The short-link codes are 9 characters, so they cannot be read as ASINs. The field is left blank.</li>
    <li>Whether the supplied short links comply with Program Policies §6(w), and whether they attribute clicks to the tracking ID shopnow047c-20. A test click through the Associates account is needed.</li>
    <li>Prices and ratings. They are not shown (<a href="flagged.html">Flagged for review</a>, FLG-05).</li>
    <li>The five analytics events, the author byline, and the brand's final name.</li>
  </ul>
</section>
<section>
  {h(2, "What we recommend deciding first")}
  <ol class="plain">
    <li>How to validate the links (<a href="suggestions.html#d1">D1</a>). Validate one per product before scaling.</li>
    <li>Whether to pursue price and rating data, which requires API access, or stay link-only (<a href="suggestions.html#d2">D2</a>).</li>
    <li>How clicks will be measured (<a href="suggestions.html#d3">D3</a>). Associates reports are the simplest start.</li>
  </ol>
  <p>Nothing has been changed on the site to act on these choices. Each one is listed in <a href="suggestions.html">Suggestions</a> with its options.</p>
</section>
<section>
  {h(2, "Irregularities and integration notes")}
  <p>The Counterwise 'Evidence &amp; review' page said no product had been matched, because the links had not been resolved. This register resolved them and recorded the Amazon product page each one reaches, with the intended ASIN still blank (FLG-19). The reader sign-up form on the front page has no backend (FLG-20), and the analytics client sends nothing until an endpoint is configured (FLG-21).</p>
  <p>{len(FLAGS)} items are on the <a href="flagged.html">Flagged for review</a> page with source links. None blocks publication, but FLG-01 to FLG-04 should be checked before the links are relied on.</p>
</section>"""
    page("executive-summary.html", "Executive summary", "What the site covers, what is verified, and what decisions come next.", body)


def write_static():
    OUT.mkdir(parents=True, exist_ok=True)


EXCLUDE_DIRS = {"data", "scripts", ".github", "register", ".git", "node_modules", "docs"}


def site_html_files():
    """Every HTML page in the repository (the register and the Counterwise pages)."""
    files = []
    for f in ROOT.rglob("*.html"):
        rel = f.relative_to(ROOT)
        if rel.parts and rel.parts[0] in EXCLUDE_DIRS - {"register"}:
            continue
        files.append(rel.as_posix())
    return sorted(files)


def write_sitemap(files):
    base = SITE["site_url"]
    urls = []
    for f in files:
        loc = base + f
        if f == "index.html":
            loc = base
        pri = "1.0" if f == "index.html" else ("0.8" if f.startswith(("guides/", "register/")) else "0.6")
        urls.append(f"  <url>\n    <loc>{esc(loc)}</loc>\n    <lastmod>{AS_OF}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{pri}</priority>\n  </url>")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n"
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")
    robots = f"User-agent: *\nAllow: /\n\nSitemap: {base}sitemap.xml\n"
    (ROOT / "robots.txt").write_text(robots, encoding="utf-8")


CSS = """
:root{--ink:#1d2330;--muted:#5b6475;--paper:#fbfaf7;--line:#e4e1d8;--accent:#8a3b12;--accent-2:#2f5d50;--warn:#8a5a00;--warnbg:#fff4dc;--okbg:#e6f2ea;--ok:#245a3a;--disc:#f3e9dc;}
*{box-sizing:border-box}
body{margin:0;font:16px/1.6 Georgia,"Times New Roman",serif;color:var(--ink);background:var(--paper)}
h1,h2,h3,.brand,.nav,.btn,.kicker,th,.badge{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
.skip{position:absolute;left:-999px}.skip:focus{left:10px;top:10px;background:#fff;padding:6px}
.mast{background:#fff;border-bottom:1px solid var(--line);padding:18px 0 10px}
.brand{font-size:28px;font-weight:700;color:var(--ink);text-decoration:none;letter-spacing:-.01em}
.tag{margin:2px 0 0;color:var(--muted);font-size:14px;font-family:system-ui,sans-serif}
.disclosure{background:var(--disc);border-bottom:1px solid #e0cdb4;font:14px/1.45 system-ui,sans-serif;padding:9px 0}
.disclosure .wrap{padding-top:0;padding-bottom:0}
.nav{background:var(--ink);font:15px system-ui,sans-serif}
.nav ul{list-style:none;margin:0 auto;padding:0 12px;max-width:1100px;display:flex;flex-wrap:wrap;gap:4px 4px}
.nav a{display:block;color:#fff;text-decoration:none;padding:10px 12px;border-radius:4px}
.nav a:hover,.nav a[aria-current=page]{background:#3c4558}
main{padding:28px 20px 40px}
h1{font-size:34px;line-height:1.15;margin:0 0 10px;letter-spacing:-.01em}
h2{font-size:21px;margin:30px 0 10px}
h3{font-size:18px;margin:4px 0 8px;line-height:1.3}
a{color:var(--accent-2)}
.lede{font-size:18px;color:#333;max-width:72ch}
.hero{padding:6px 0 10px;border-bottom:1px solid var(--line);margin-bottom:22px}
.actions{margin-top:16px}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;padding:9px 14px;border-radius:4px;font-size:15px;margin:4px 6px 4px 0}
.btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:10px}
.grid.one{grid-template-columns:1fr}
.card{background:#fff;border:1px solid var(--line);border-radius:6px;padding:16px 18px}
.card.wide{padding:20px 22px}
.kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 6px}
.meta{font:14px system-ui,sans-serif;color:var(--muted);margin:6px 0}
.small{font-size:13px;color:var(--muted);font-family:system-ui,sans-serif}
code{font:13px ui-monospace,Menlo,Consolas,monospace;background:#f0eee8;padding:1px 4px;border-radius:3px}
code.wrapcode{white-space:normal;word-break:break-all;display:inline-block;max-width:340px}
.tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:6px;background:#fff;margin:12px 0 20px}
table{border-collapse:collapse;width:100%;font:14px/1.45 system-ui,sans-serif}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:#f4f2ec;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);white-space:nowrap}
tr:last-child td{border-bottom:0}
td .small{display:block;margin-top:4px}
.empty{color:var(--muted);font-style:italic;text-align:center;padding:24px}
.badge{display:inline-block;font:12px/1.4 system-ui,sans-serif;padding:2px 8px;border-radius:999px;background:#eee;color:#333;white-space:normal}
.badge.warn{background:var(--warnbg);color:var(--warn)}
.badge.ok{background:var(--okbg);color:var(--ok)}
.stats{display:flex;flex-wrap:wrap;gap:12px;margin:14px 0}
.stats div{background:#fff;border:1px solid var(--line);border-radius:6px;padding:12px 18px;min-width:130px}
.stats strong{display:block;font:700 26px system-ui,sans-serif}
.stats span{font:13px system-ui,sans-serif;color:var(--muted)}
.callout{background:#fff;border-left:4px solid var(--accent-2);padding:10px 16px;margin:14px 0;border-radius:4px}
.plain{padding-left:20px}
.plain li{margin:4px 0}
.foot{background:var(--ink);color:#e7e9ee;padding:26px 0 30px;margin-top:20px;font:14px/1.6 system-ui,sans-serif}
.foot a{color:#fff}
.foot-disc{background:#2b3142;border:0;color:#fff;padding:12px 14px;border-radius:4px;margin-bottom:18px}
.foot-grid{display:grid;grid-template-columns:1fr 2fr;gap:24px}
.foot h2{color:#fff;font-size:15px;margin:0 0 8px}
.foot ul{list-style:none;padding:0;margin:0}
.foot li{margin:3px 0}
@media (max-width:700px){h1{font-size:26px}.foot-grid{grid-template-columns:1fr}.brand{font-size:24px}}
"""


def main():
    write_static()
    page_index()
    page_products()
    page_category("air-fryers.html", "Air fryer products", "Air fryers",
                  "Three air fryers from the supplied links: two basket-style units and one oven-style air fryer toaster oven. Each row shows the Amazon listing it resolves to.")
    page_category("thermometers.html", "Thermometer products", "Thermometers",
                  "Two meat thermometers from the supplied links. Product details are as printed on Amazon's listing; nothing is added from outside sources.")
    page_findings()
    page_compliance()
    page_questions()
    page_suggestions()
    page_guides()
    page_ledger()
    page_sources()
    page_flagged()
    page_exec()
    write_sitemap(site_html_files())
    print(f"built {len(list(OUT.glob('*.html')))} register pages into {OUT}; sitemap lists {len(site_html_files())} pages")


if __name__ == "__main__":
    main()
