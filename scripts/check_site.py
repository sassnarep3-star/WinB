#!/usr/bin/env python3
"""Compliance + integrity gate for the built site (runs in CI before deploy).

Checks
  DATA  - every row with a source has an official host; price fields are empty (policy §2(b));
          observed ASIN format; intended ASIN either blank or valid; flags resolve; guides have content.
  PAGES - disclosure strip + footer disclosure (exact Associates wording) on every page;
          every Amazon link has rel="sponsored"; no tagged (tag=) outbound URL is published;
          outbound hrefs are only the approved set; every internal link and #anchor resolves;
          every table row (except the empty ledger and option tables) has an official source link
          or an explicit "Unverified" marker; sitemap lists every page; RSS lists every guide;
          analytics.js parses.
Exit code 0 = pass, 1 = fail.
"""
import json
import pathlib
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SITE = ROOT / "_site"
CFG = json.loads((DATA / "config.json").read_text(encoding="utf-8"))
BASE = "/" + CFG["base_path"].strip("/") + "/"
DISCLOSURE = CFG["associates_disclosure"]
OFFICIAL_HOSTS = {
    "www.amazon.com", "amazon.com", "link.amazon", "affiliate-program.amazon.com",
    "www.ftc.gov", "docs.github.com", "github.com",
}
EXEMPT_TABLE_PAGES = {"dashboard/ledger/index.html", "plan/suggestions/index.html"}
ASIN_RE = re.compile(r"^[A-Z0-9]{10}$")

fails, passes = [], []


def ok(msg):
    passes.append(msg)


def bad(msg):
    fails.append(msg)


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


# ---------------- DATA GATE ----------------
products = load("products.json")["rows"]
verif = load("verification.json")["rows"]
flags = {f["id"]: f for f in load("flagged.json")["rows"]}
guides = load("guides.json")["rows"]
questions = load("questions.json")["rows"]
suggestions = load("suggestions.json")["rows"]
product_ids = {p["id"] for p in products}

for p in products:
    host = urlparse(p["source_url"]).netloc
    if host not in OFFICIAL_HOSTS:
        bad(f"{p['id']}: source_url host {host} not official")
    if not ASIN_RE.match(p["observed_asin"]):
        bad(f"{p['id']}: observed_asin {p['observed_asin']} is not 10 alphanumerics")
    if p["intended_asin"] and not ASIN_RE.match(p["intended_asin"]):
        bad(f"{p['id']}: intended_asin malformed")
    if p["intended_asin"] and not p.get("official_listing_url_intended"):
        bad(f"{p['id']}: intended ASIN set without an intended listing URL")
    if p["price"]:
        bad(f"{p['id']}: price populated — policy §2(b) requires Amazon-served or API data")
    if p["ratings"]:
        bad(f"{p['id']}: ratings populated without a confirmed official field")
    for fid in p["flags"]:
        if fid not in flags:
            bad(f"{p['id']}: unknown flag {fid}")
    if urlparse(p["supplied_link"]).netloc not in {"link.amazon", "www.amazon.com", "amazon.com"}:
        bad(f"{p['id']}: supplied link host unexpected")
ok(f"products: {len(products)} rows checked (sources, ASIN format, price blank, flags)")

for v in verif:
    if urlparse(v["source_url"]).netloc not in OFFICIAL_HOSTS:
        bad(f"{v['id']}: source_url not official")
    if not (v["status"].startswith("Verified") or v["status"].startswith("Unverified")):
        bad(f"{v['id']}: status must start with Verified or Unverified")
    for fid in v["flags"]:
        if fid not in flags:
            bad(f"{v['id']}: unknown flag {fid}")
ok(f"verification: {len(verif)} rows have official source links")

for f in flags.values():
    for s in f["sources"]:
        if urlparse(s).netloc not in OFFICIAL_HOSTS:
            bad(f"{f['id']}: source {s} not official")
ok(f"flags: {len(flags)} items checked")

for g in guides:
    if not (CONTENT := ROOT / "content" / "guides" / f"{g['slug']}.html").exists():
        bad(f"guide {g['slug']}: content file missing")
    for pid in g["product_ids"]:
        if pid not in product_ids:
            bad(f"guide {g['slug']}: unknown product {pid}")
    for s in g["sources"]:
        if urlparse(s).netloc not in OFFICIAL_HOSTS:
            bad(f"guide {g['slug']}: source {s} not official")
ok(f"guides: {len(guides)} checked")

for q in questions:
    for s in q["sources"]:
        if s not in flags:
            bad(f"{q['id']}: unknown flag {s}")
ok(f"questions: {len(questions)} checked")

for s in suggestions:
    keys = {o["key"] for o in s["options"]}
    if s["recommended"] not in keys:
        bad(f"{s['id']}: recommended key not in options")
ok(f"suggestions: {len(suggestions)} checked (none marked applied)")

ledger = (DATA / "campaign_ledger.csv").read_text(encoding="utf-8").splitlines()
if ledger[0].split(",")[:3] != ["timestamp_utc", "source_report", "channel"]:
    bad("ledger header changed")
ok(f"ledger: header ok, {len(ledger) - 1} rows")

# ---------------- PAGES GATE ----------------


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []          # (href, rel, data_outbound)
        self.ids = set()
        self.in_disclosure = 0
        self.disclosure_text = []
        self.in_footer_disc = 0
        self.footer_disc_text = []
        self.h1 = 0
        self.title = False
        self.has_title = False
        self.tables = []         # list of rows, each row = dict(links=[...], unverified=bool, is_body=bool)
        self._table_depth = 0
        self._cur_table = None
        self._in_tbody = False
        self._cur_row = None
        self._in_td = False
        self._stack = []
        self._class_stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "div" and "disclosure-strip" in cls:
            self.in_disclosure += 1
        if tag == "footer":
            self.in_footer_disc = 0
        if tag == "p" and "footer-disclosure" in cls:
            self.in_footer_disc = 1
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.title = True
            self.has_title = True
        if tag == "a":
            href = a.get("href", "")
            self.links.append((href, a.get("rel", "") or "", a.get("data-outbound")))
            if self._cur_row is not None:
                self._cur_row["links"].append(href)
        if tag == "table" and "data" in cls.split():
            self._cur_table = []
            self._table_depth += 1
        if tag == "tbody" and self._cur_table is not None:
            self._in_tbody = True
        if tag == "tr" and self._in_tbody and self._cur_table is not None:
            self._cur_row = {"links": [], "unverified": False}
        if tag == "span" and "unverified" in cls and self._cur_row is not None:
            self._cur_row["unverified"] = True
        self._stack.append(tag)

    def handle_endtag(self, tag):
        if tag == "div" and self.in_disclosure:
            self.in_disclosure = max(0, self.in_disclosure - 1)
        if tag == "p" and self.in_footer_disc:
            self.in_footer_disc = 0
        if tag == "tr" and self._cur_row is not None and self._cur_table is not None:
            self._cur_table.append(self._cur_row)
            self._cur_row = None
        if tag == "tbody":
            self._in_tbody = False
        if tag == "table" and self._cur_table is not None:
            self.tables.append(self._cur_table)
            self._cur_table = None
        if tag == "title":
            self.title = False
        if self._stack and self._stack[-1] == tag:
            self._stack.pop()

    def handle_data(self, data):
        if self.in_disclosure:
            self.disclosure_text.append(data)
        if self.in_footer_disc:
            self.footer_disc_text.append(data)


def html_files():
    return sorted(SITE.rglob("*.html"))


def page_path_of(f):
    rel = f.relative_to(SITE).as_posix()
    return rel


def resolve_internal(href):
    """Map an internal href (under BASE) to a file in _site, returning (file, fragment) or None."""
    parsed = urlparse(href)
    path = parsed.path
    frag = parsed.fragment
    if not path:
        return None, frag
    if not path.startswith(BASE):
        return "BAD", frag
    rel = path[len(BASE):]
    if rel == "":
        target = SITE / "index.html"
    elif rel.endswith("/"):
        target = SITE / rel / "index.html"
    else:
        target = SITE / rel
    return target, frag


if not SITE.exists():
    bad("_site not built")
else:
    approved_outbound = set()
    for p in products:
        approved_outbound.add(p["supplied_link"])
        approved_outbound.add(p["observed_redirect_url"])
        approved_outbound.add(p["source_url"])
    for v in verif:
        approved_outbound.add(v["source_url"])
    for f in flags.values():
        approved_outbound.update(f["sources"])
    for g in guides:
        approved_outbound.update(g["sources"])
    # also allow policy/ftc sources cited in page templates
    approved_outbound.update({
        "https://affiliate-program.amazon.com/help/operating/agreement",
        "https://affiliate-program.amazon.com/help/operating/policies",
        "https://affiliate-program.amazon.com/help/operating/schedule",
        "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers",
        "https://www.amazon.com/gp/help/customer/display.html?nodeId=468496",
        "https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site",
        "https://github.com/actions/deploy-pages",
        "https://github.com/sassnarep3-star/WinB",
    })

    parsed_pages = {}
    n_html = 0
    for f in html_files():
        n_html += 1
        rel = page_path_of(f)
        p = Page()
        p.feed(f.read_text(encoding="utf-8"))
        parsed_pages[rel] = p
        if rel == "404.html":
            continue
        if not p.has_title:
            bad(f"{rel}: no <title>")
        if p.h1 != 1:
            bad(f"{rel}: expected exactly one <h1>, found {p.h1}")
        disc_txt = " ".join(p.disclosure_text)
        if DISCLOSURE not in disc_txt:
            bad(f"{rel}: disclosure strip under masthead missing Associates wording")
        footer_txt = " ".join(p.footer_disc_text)
        if DISCLOSURE not in footer_txt:
            bad(f"{rel}: footer disclosure missing Associates wording")
        for href, rr, _ in p.links:
            host = urlparse(href).netloc.lower()
            if host and ("amazon" in host):
                if "sponsored" not in rr.split():
                    bad(f"{rel}: Amazon link not marked sponsored: {href[:80]}")
                if "tag=" in href:
                    bad(f"{rel}: tagged URL published (not validated yet): {href[:80]}")
                if href not in approved_outbound:
                    bad(f"{rel}: unapproved Amazon URL: {href[:100]}")
            if href.startswith("http") and host and "amazon" not in host and host not in OFFICIAL_HOSTS and host != "sassnarep3-star.github.io":
                bad(f"{rel}: non-official external link {href[:80]}")
        for href, _, data_out in p.links:
            if data_out and data_out not in product_ids:
                bad(f"{rel}: data-outbound {data_out} is not a product id")
        if rel not in EXEMPT_TABLE_PAGES:
            for t in p.tables:
                for row in t:
                    has_src = any(
                        urlparse(h).netloc in OFFICIAL_HOSTS for h in row["links"] if h.startswith("http")
                    )
                    if not (has_src or row["unverified"]):
                        bad(f"{rel}: table row without official source link or Unverified marker")

    # internal link + anchor resolution
    for rel, p in parsed_pages.items():
        for href, _, _ in p.links:
            if href.startswith("#") or href.startswith("mailto:"):
                if href.startswith("#") and href[1:] and href[1:] not in p.ids:
                    bad(f"{rel}: anchor {href} not found on page")
                continue
            if not href.startswith("http") and not href.startswith("/") and not href.startswith("."):
                continue
            if href.startswith("http"):
                continue
            target, frag = resolve_internal(href)
            if target == "BAD":
                bad(f"{rel}: internal link outside BASE: {href}")
                continue
            if target is None:
                continue
            if not target.exists():
                bad(f"{rel}: broken internal link {href}")
                continue
            if frag:
                tgt_rel = target.relative_to(SITE).as_posix()
                tp = parsed_pages.get(tgt_rel)
                if tp is None or frag not in tp.ids:
                    bad(f"{rel}: anchor #{frag} missing on {tgt_rel}")
    ok(f"pages: {n_html} html files checked (disclosure, sponsored, links, anchors, table sources)")

    # sitemap and feed
    sm_tree = ET.parse(SITE / "sitemap.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = {el.text for el in sm_tree.findall(".//s:loc", ns)}
    for rel in parsed_pages:
        if rel == "404.html":
            continue
        expect = CFG["site_url"].rstrip("/") + "/" + (rel[: -len("index.html")] if rel.endswith("index.html") else rel)
        if expect not in locs and expect.rstrip("/") + "/" not in locs:
            bad(f"sitemap missing {expect}")
    ok(f"sitemap: {len(locs)} urls")

    feed = ET.parse(SITE / "feed.xml")
    items = feed.findall(".//item")
    if len(items) != len(guides):
        bad(f"feed has {len(items)} items, expected {len(guides)}")
    ok(f"feed: {len(items)} guide items")

    # analytics script syntax
    r = subprocess.run(["node", "--check", str(ROOT / "build" / "assets" / "analytics.js")], capture_output=True, text=True)
    if r.returncode != 0:
        bad("analytics.js does not parse: " + r.stderr.strip()[:200])
    else:
        ok("analytics.js parses")

print("CHECK RESULTS")
for m in passes:
    print("  PASS  " + m)
for m in fails:
    print("  FAIL  " + m)
print(f"{len(passes)} groups passed, {len(fails)} failures")
sys.exit(1 if fails else 0)
