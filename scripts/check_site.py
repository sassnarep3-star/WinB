#!/usr/bin/env python3
"""Checks for the whole site (Counterwise pages + the verification register). Exit 1 on failure.

Checks:
  * data rules (intended ASIN blank, prices blank, ledger empty, ids resolve)
  * observed ASIN in each listing/redirect URL matches the ASIN field
  * every HTML page in the repository:
      - the disclosure statement appears before the first <nav> and again inside <footer>
      - every Amazon product link carries rel="sponsored"
      - every external link points to an allow-listed official host
      - every internal link resolves to a file; every #fragment resolves to an id
      - the only script allowed is the local analytics client (assets/counterwise.js)
      - every table marked data-source-required has an official source link on each row
  * sitemap.xml lists every page; feed.xml and sitemap.xml parse
"""
import html.parser
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, unquote

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
EXCLUDE = {"data", "scripts", ".github", ".git", "node_modules", "docs"}

ALLOWED_HOSTS = {
    "amazon.com", "www.amazon.com", "link.amazon", "affiliate-program.amazon.com",
    "ftc.gov", "www.ftc.gov", "ecfr.gov", "www.ecfr.gov",
    "developers.google.com", "www.sitemaps.org", "sitemaps.org",
    "www.rssboard.org", "docs.github.com", "github.com", "sassnarep3-star.github.io",
}
PRODUCT_HOSTS = ("amazon.com", "link.amazon")
DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases."
ALLOWED_SCRIPT_RE = re.compile(r"^(\.\./)*assets/counterwise\.js$")

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
    if load("ledger.json")["rows"]:
        warnings.append("ledger.json has rows: each must cite an authorized first-party report")
    for f in load("flags.json")["flags"]:
        if f["status"] not in ("Needs review", "Logged"):
            err(f"{f['id']}: unexpected status {f['status']}")


class PageParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []          # (href, rel)
        self.ids = set()
        self.scripts = []        # src values (or "inline")
        self.tables = []         # dicts: attrs, rows (list of list of hrefs)
        self._table_stack = []
        self._row = None
        self._tbody = 0
        self.in_footer = False
        self.footer_text = ""
        self.pre_nav_text = ""
        self.nav_seen = False
        self._script_inline = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "script":
            if "src" in a:
                self.scripts.append(a["src"])
            else:
                self.scripts.append("inline")
                self._script_inline = True
        if tag == "footer":
            self.in_footer = True
        if tag == "nav":
            self.nav_seen = True
        if tag == "a" and "href" in a:
            self.links.append((a["href"], a.get("rel", "") or ""))
            if self._row is not None:
                self._row.append(a["href"])
        if tag == "table":
            self._table_stack.append({"attrs": a, "rows": []})
        if tag == "tbody" and self._table_stack:
            self._tbody += 1
        if tag == "tr" and self._table_stack and self._tbody:
            self._row = []

    def handle_endtag(self, tag):
        if tag == "footer":
            self.in_footer = False
        if tag == "tr" and self._row is not None and self._table_stack:
            self._table_stack[-1]["rows"].append(self._row)
            self._row = None
        if tag == "tbody" and self._tbody:
            self._tbody -= 1
        if tag == "table" and self._table_stack:
            self.tables.append(self._table_stack.pop())
        if tag == "script":
            self._script_inline = False

    def handle_data(self, data):
        if self.in_footer:
            self.footer_text += data
        elif not self.nav_seen:
            self.pre_nav_text += data


def check_html(files):
    parsed = {}
    for f in files:
        text = f.read_text(encoding="utf-8")
        ps = PageParser()
        ps.feed(text)
        parsed[f] = (text, ps)
    for f in files:
        text, ps = parsed[f]
        name = f.relative_to(ROOT).as_posix()
        here = f.parent
        if DISCLOSURE not in text:
            err(f"{name}: disclosure statement missing")
        if DISCLOSURE not in ps.pre_nav_text:
            err(f"{name}: disclosure must appear above the navigation (above the fold)")
        if DISCLOSURE not in ps.footer_text:
            err(f"{name}: disclosure must be repeated in the footer")
        for src in ps.scripts:
            if src == "inline" or not ALLOWED_SCRIPT_RE.match(src):
                err(f"{name}: script not allowed ({src}); only assets/counterwise.js is approved")
        for href, rel in ps.links:
            if href.startswith("#"):
                if href[1:] and href[1:] not in ps.ids:
                    err(f"{name}: broken fragment {href}")
                continue
            if href.startswith(("mailto:", "tel:")):
                continue
            pu = urlparse(href)
            if pu.scheme in ("http", "https"):
                host = pu.hostname or ""
                if host not in ALLOWED_HOSTS:
                    err(f"{name}: external host not allow-listed: {host} ({href})")
                if host != "affiliate-program.amazon.com" and any(host == h or host.endswith("." + h) for h in PRODUCT_HOSTS):
                    if "sponsored" not in rel.split():
                        err(f"{name}: Amazon link lacks rel=sponsored: {href}")
                continue
            if pu.scheme or href.startswith("//"):
                err(f"{name}: unexpected link scheme {href}")
                continue
            target_path, frag = unquote(pu.path), pu.fragment
            target = here if target_path == "" else (here / target_path)
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                err(f"{name}: broken internal link {href}")
                continue
            if frag:
                if target.suffix == ".html" and target in parsed:
                    if frag not in parsed[target][1].ids:
                        err(f"{name}: missing anchor #{frag} in {target.relative_to(ROOT).as_posix()}")
                elif target.suffix == ".html":
                    tps = PageParser()
                    tps.feed(target.read_text(encoding="utf-8"))
                    if frag not in tps.ids:
                        err(f"{name}: missing anchor #{frag} in {target.relative_to(ROOT).as_posix()}")
        for t in ps.tables:
            if t["attrs"].get("data-source-required") == "1":
                for row in t["rows"]:
                    ok = any(
                        (urlparse(h).hostname or "") in ALLOWED_HOSTS and urlparse(h).scheme == "https"
                        for h in row
                    )
                    if not ok:
                        err(f"{name}: a table row without an official source link: {row[:1]}")


def all_html():
    files = []
    for f in ROOT.rglob("*.html"):
        rel = f.relative_to(ROOT)
        if rel.parts and rel.parts[0] in EXCLUDE:
            continue
        files.append(f)
    return sorted(files)


def check_reachable(files):
    """Every page must link to the verification register (single navigation group + footer)."""
    register = (ROOT / "register" / "index.html").resolve()
    for f in files:
        if f.resolve() == register:
            continue
        ps = PageParser()
        ps.feed(f.read_text(encoding="utf-8"))
        found = False
        for href, _ in ps.links:
            pu = urlparse(href)
            if pu.scheme or not pu.path:
                continue
            tgt = (f.parent / unquote(pu.path))
            if tgt.is_dir():
                tgt = tgt / "index.html"
            if tgt.resolve() == register:
                found = True
                break
        if not found:
            err(f"{f.relative_to(ROOT).as_posix()}: no link to the verification register")


def check_feeds(files):
    try:
        sm_path = ROOT / "sitemap.xml"
        ET.parse(sm_path)
        sm = sm_path.read_text(encoding="utf-8")
    except (ET.ParseError, FileNotFoundError) as e:
        err(f"sitemap.xml missing or does not parse: {e}")
        sm = ""
    for f in files:
        rel = f.relative_to(ROOT).as_posix()
        if rel == "index.html":
            continue
        if rel not in sm and rel.replace("index.html", "") not in sm:
            err(f"sitemap.xml does not list {rel}")
    try:
        ET.parse(ROOT / "feed.xml")
    except (ET.ParseError, FileNotFoundError) as e:
        err(f"feed.xml missing or does not parse: {e}")


def main():
    check_data()
    files = all_html()
    if not (ROOT / "register" / "index.html").exists():
        err("register/ missing: run scripts/build_site.py first")
    check_html(files)
    check_feeds(files)
    check_reachable(files)
    print(f"checked {len(files)} HTML pages across the site")
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
