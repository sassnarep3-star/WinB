#!/usr/bin/env python3
"""Checks for the generated site and its data. Exit code 1 on any failure.

Checks:
  * data rules (intended ASIN blank, prices blank, ledger empty, ids resolve)
  * observed ASIN in each redirect/listing URL matches the ASIN field
  * every page: disclosure above the navigation AND in the footer
  * every Amazon product link carries rel="sponsored"
  * every external link points to an allow-listed official host
  * every internal link and #fragment resolves
  * every row of a table marked data-source-required has an official source link
  * sitemap lists every page; rss.xml parses
  * no <script> tags (no tracking code was added)
"""
import html.parser
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
DOCS = ROOT / "docs"

ALLOWED_HOSTS = {
    "amazon.com", "www.amazon.com", "link.amazon", "affiliate-program.amazon.com",
    "ftc.gov", "www.ftc.gov", "ecfr.gov", "www.ecfr.gov",
    "developers.google.com", "www.sitemaps.org", "sitemaps.org",
    "www.rssboard.org", "docs.github.com", "github.com",
}
PRODUCT_HOSTS = ("amazon.com", "link.amazon")
DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases."

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def check_data():
    products = load("products.json")["products"]
    if len(products) != 5:
        err(f"products.json: expected 5 products, found {len(products)}")
    for p in products:
        pid = p["id"]
        if p["intended_asin"] != "":
            err(f"{pid}: intended_asin must stay blank until the owner confirms it")
        if p["price"] != "" or p["rating"] != "":
            err(f"{pid}: price/rating must not be published (Program Policies §2(b), §6(t))")
        m = re.search(r"/dp/([A-Z0-9]{10})", p["official_listing_url"])
        if not m or m.group(1) != p["observed_redirect_asin"]:
            err(f"{pid}: official_listing_url ASIN does not match observed_redirect_asin")
        m2 = re.search(r"/dp/([A-Z0-9]{10})", p["observed_redirect_target"])
        if not m2 or m2.group(1) != p["observed_redirect_asin"]:
            err(f"{pid}: observed_redirect_target ASIN does not match observed_redirect_asin")
        code = p["short_link_code"]
        if len(code) != p["short_link_code_length"]:
            err(f"{pid}: short_link_code_length does not match the code")
        if p["short_link_supplied"] != f"https://link.amazon/{code}":
            err(f"{pid}: short_link_supplied does not match its code")
        if p["tag_parameter_in_observed_target"]:
            warnings.append(f"{pid}: observed target now contains a tag parameter; re-check FLG-02")
    sources = load("sources.json")["sources"]
    ids = {s["id"] for s in sources}
    for s in sources:
        host = urlparse(s["url"]).hostname or ""
        if s["official"] and host not in ALLOWED_HOSTS:
            err(f"{s['id']}: official source host {host} is not on the allow-list")
    for rule in load("compliance.json")["rules"]:
        if rule["source_id"] not in ids:
            err(f"{rule['id']}: unknown source {rule['source_id']}")
    for f in load("findings.json")["findings"]:
        for sid in f["source_ids"]:
            if sid not in ids:
                err(f"{f['id']}: unknown source {sid}")
    for d in load("suggestions.json")["decisions"]:
        for sid in d["sources"]:
            if sid not in ids:
                err(f"{d['id']}: unknown source {sid}")
    ledger = load("ledger.json")
    if ledger["rows"]:
        warnings.append("ledger.json has rows: each must cite an authorized first-party report")
    flags = load("flags.json")["flags"]
    if len(flags) < 1:
        err("flags.json: Flagged for Review must not be empty while flags exist")
    for f in flags:
        if f["status"] not in ("Needs review", "Logged"):
            err(f"{f['id']}: unexpected status {f['status']}")


class PageParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []          # (href, rel)
        self.ids = set()
        self.scripts = 0
        self.nav_seen_at = None
        self.disclosure_before_nav = False
        self.disclosure_in_footer = False
        self.in_footer = False
        self.in_disclosure = 0
        self.disclosure_text = ""
        self.tables = []         # list of dicts: attrs, rows(list of list of hrefs)
        self._table_stack = []
        self._row = None
        self._in_tbody = 0
        self._text_stack = []
        self.pos = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "script":
            self.scripts += 1
        if tag == "footer":
            self.in_footer = True
        if tag == "nav" and self.nav_seen_at is None:
            self.nav_seen_at = self.pos
        if tag == "aside" and "disclosure" in a.get("class", ""):
            self.in_disclosure += 1
            if self.in_footer:
                self.disclosure_in_footer = True
            elif self.nav_seen_at is None:
                self.disclosure_before_nav = True
        if tag == "a" and "href" in a:
            self.links.append((a["href"], a.get("rel", "") or ""))
            if self._row is not None:
                self._row.append(a["href"])
        if tag == "table":
            self._table_stack.append({"attrs": a, "rows": []})
        if tag == "tbody" and self._table_stack:
            self._in_tbody += 1
        if tag == "tr" and self._table_stack and self._in_tbody:
            self._row = []
        self.pos += 1

    def handle_endtag(self, tag):
        if tag == "footer":
            self.in_footer = False
        if tag == "aside" and self.in_disclosure:
            self.in_disclosure -= 1
        if tag == "tr" and self._row is not None and self._table_stack:
            self._table_stack[-1]["rows"].append(self._row)
            self._row = None
        if tag == "tbody" and self._in_tbody:
            self._in_tbody -= 1
        if tag == "table" and self._table_stack:
            self.tables.append(self._table_stack.pop())

    def handle_data(self, data):
        if self.in_disclosure:
            self.disclosure_text += data


def check_html():
    pages = sorted(DOCS.glob("*.html"))
    names = {p.name for p in pages}
    anchors_by_page = {}
    parsed = {}
    for p in pages:
        text = p.read_text(encoding="utf-8")
        ps = PageParser()
        ps.feed(text)
        parsed[p.name] = (text, ps)
        anchors_by_page[p.name] = ps.ids
    for p in pages:
        text, ps = parsed[p.name]
        name = p.name
        if DISCLOSURE not in text:
            err(f"{name}: disclosure statement missing")
        if not ps.disclosure_before_nav:
            err(f"{name}: disclosure strip must sit above the navigation (above the fold)")
        if not ps.disclosure_in_footer:
            err(f"{name}: disclosure must be repeated in the footer")
        if ps.scripts:
            err(f"{name}: contains {ps.scripts} <script> tag(s); no tracking code was approved")
        for href, rel in ps.links:
            if href.startswith("#"):
                if href[1:] and href[1:] not in ps.ids:
                    err(f"{name}: broken fragment {href}")
                continue
            if href.startswith(("mailto:", "tel:")):
                continue
            parsed_url = urlparse(href)
            if parsed_url.scheme in ("http", "https"):
                host = parsed_url.hostname or ""
                if host not in ALLOWED_HOSTS:
                    err(f"{name}: external host not allow-listed: {host} ({href})")
                if any(host == h or host.endswith("." + h) for h in PRODUCT_HOSTS):
                    if "sponsored" not in rel.split():
                        err(f"{name}: Amazon link lacks rel=sponsored: {href}")
                continue
            # internal
            target, _, frag = href.partition("#")
            if target == "":
                target = name
            if not (DOCS / target).is_file():
                err(f"{name}: broken internal link {href}")
                continue
            if frag and target in anchors_by_page and frag not in anchors_by_page[target]:
                err(f"{name}: missing anchor #{frag} in {target}")
        for t in ps.tables:
            if t["attrs"].get("data-source-required") == "1":
                for row in t["rows"]:
                    ok = any(
                        (urlparse(h).hostname or "") in ALLOWED_HOSTS and urlparse(h).scheme == "https"
                        for h in row
                    )
                    if not ok:
                        err(f"{name}: a table row without an official source link: {row[:1]}")
    return pages


def check_feeds(pages):
    sm = (DOCS / "sitemap.xml").read_text(encoding="utf-8")
    for p in pages:
        if p.name == "sitemap.xml":
            continue
        if p.name.endswith(".html") and p.name not in sm:
            err(f"sitemap.xml does not list {p.name}")
    try:
        ET.parse(DOCS / "rss.xml")
    except ET.ParseError as e:
        err(f"rss.xml does not parse: {e}")
    try:
        ET.parse(DOCS / "sitemap.xml")
    except ET.ParseError as e:
        err(f"sitemap.xml does not parse: {e}")


def main():
    check_data()
    if not DOCS.exists():
        err("docs/ missing: run scripts/build_site.py first")
    else:
        pages = check_html()
        check_feeds(pages)
        print(f"checked {len(pages)} pages")
    for w in warnings:
        print("WARN", w)
    for e in errors:
        print("ERROR", e)
    if errors:
        print(f"FAILED with {len(errors)} error(s)")
        return 1
    print("OK: data rules, disclosure placement, sponsored links, internal links and sources all pass")
    return 0


if __name__ == "__main__":
    sys.exit(main())
