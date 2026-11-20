#!/usr/bin/env python3
"""Fail-closed checks for the generated Counterwise publication.

Run after `python3 scripts/build.py`; CI also runs `build.py --check` so the
committed pages, feed, sitemap and robots.txt must match their source data.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "site"
errors: list[str] = []

OFFICIAL_HOSTS = {
    "amazon.com",
    "link.amazon",
    "affiliate-program.amazon.com",
    "chefman.com",
    "chefiq.com",
    "ftc.gov",
    "ecfr.gov",
    "cpsc.gov",
    "fsis.usda.gov",
    "usda.gov",
    "developers.google.com",
    "search.google.com",
    "docs.github.com",
    "github.com",
    "sassnarep3-star.github.io",
    "sitemaps.org",
    "validator.w3.org",
}


def fail(message: str) -> None:
    errors.append(message)


def read_json(path: pathlib.Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"cannot read JSON {path.relative_to(ROOT)}: {exc}")
        return {}


site = read_json(SRC / "data/site.json")
products_doc = read_json(SRC / "data/products.json")
guides_doc = read_json(SRC / "content/guides.json")
questions_doc = read_json(SRC / "data/questions.json")
flags_doc = read_json(SRC / "data/flags.json")
products = products_doc.get("products", [])
guides = guides_doc.get("guides", [])
questions = questions_doc.get("questions", [])
flags = flags_doc.get("flags", [])
DISCLOSURE = site.get("disclosure_text", "")


class Page(HTMLParser):
    def __init__(self, path: pathlib.Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.hrefs: list[tuple[str, dict[str, str]]] = []
        self.assets: list[str] = []
        self.ids: set[str] = set()
        self.text = ""
        self.tables: list[dict] = []
        self.table_stack: list[dict] = []
        self.row_stack: list[dict] = []
        self.current_cells: list[dict] | None = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            self.hrefs.append((a["href"], a))
        if tag in {"img", "script", "link", "source"}:
            key = "src" if tag in {"img", "script", "source"} else "href"
            if a.get(key):
                self.assets.append(a[key])
        if tag == "table":
            t = {"attrs": a, "rows": []}
            self.tables.append(t)
            self.table_stack.append(t)
        elif tag == "tr" and self.table_stack:
            row = {"cells": [], "links": 0, "header": False}
            self.table_stack[-1]["rows"].append(row)
            self.row_stack.append(row)
        elif tag in {"td", "th"} and self.row_stack:
            if tag == "th":
                self.row_stack[-1]["header"] = True
            self.current_cells = []
        elif tag == "a" and self.row_stack:
            self.row_stack[-1]["links"] += 1

    def handle_endtag(self, tag):
        if tag == "tr" and self.row_stack:
            self.row_stack.pop()
        if tag == "table" and self.table_stack:
            self.table_stack.pop()
        if tag in {"td", "th"}:
            self.current_cells = None

    def handle_data(self, data):
        self.text += data


# All generated HTML files are checked, not just those known today.
html_files = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "site" not in p.parts)
pages: dict[pathlib.Path, Page] = {}
for path in html_files:
    parser = Page(path)
    try:
        parser.feed(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"HTML parse error in {path.relative_to(ROOT)}: {exc}")
        continue
    pages[path.resolve()] = parser
    rel = path.relative_to(ROOT).as_posix()
    if DISCLOSURE and DISCLOSURE not in parser.text:
        fail(f"disclosure missing from {rel}")
    if "{{" in parser.text or "{{" in path.read_text(encoding="utf-8"):
        fail(f"unexpanded template placeholder in {rel}")
    for ref in parser.hrefs:
        href, attrs = ref
        parsed = urllib.parse.urlsplit(href)
        if parsed.scheme in {"http", "https"}:
            host = (parsed.hostname or "").lower()
            is_ok = any(host == allowed or host.endswith("." + allowed) for allowed in OFFICIAL_HOSTS)
            if not is_ok:
                fail(f"unapproved external host in {rel}: {host or href}")
            if host == "link.amazon" or host.endswith("amazon.com"):
                rels = set((attrs.get("rel") or "").lower().split())
                if "sponsored" not in rels:
                    fail(f"Amazon outbound missing rel=sponsored in {rel}: {href}")
        elif parsed.scheme or href.startswith("//"):
            continue
        else:
            target_path = urllib.parse.unquote(parsed.path)
            if target_path:
                target = (path.parent / target_path).resolve()
                if target.is_dir():
                    target = target / "index.html"
                if not target.exists():
                    fail(f"broken internal link in {rel}: {href} -> {target.relative_to(ROOT) if target.is_relative_to(ROOT) else target}")
                elif parsed.fragment and target.suffix.lower() == ".html":
                    target_parser = pages.get(target)
                    if target_parser is None:
                        target_parser = Page(target)
                        try:
                            target_parser.feed(target.read_text(encoding="utf-8"))
                        except Exception:
                            pass
                    if parsed.fragment not in target_parser.ids:
                        fail(f"broken fragment in {rel}: {href}")
            elif parsed.fragment and parsed.fragment not in parser.ids:
                fail(f"broken local fragment in {rel}: {href}")
    for asset in parser.assets:
        parsed = urllib.parse.urlsplit(asset)
        if parsed.scheme in {"http", "https", "data"} or asset.startswith("//"):
            continue
        if not parsed.path:
            continue
        target = (path.parent / urllib.parse.unquote(parsed.path)).resolve()
        if not target.exists():
            fail(f"missing page asset in {rel}: {asset}")
    # Source/evidence tables: every body row must point to a source or an
    # explicit evidence record. Empty-state rows are not findings/data rows.
    for table in parser.tables:
        classes = set((table["attrs"].get("class") or "").split())
        if "matrix" in classes or "t-src" in classes:
            for row in table["rows"]:
                if not row["header"] and row["links"] == 0:
                    fail(f"table row without a source link in {rel}")

if not (ROOT / "assets/js/site.js").exists():
    fail("missing click-measurement client script")
if not (ROOT / "scripts/build.py").exists():
    fail("missing deterministic build script")

# The product register keeps intention and observation in separate fields.
seen_ids = set()
for p in products:
    pid = p.get("id", "<missing id>")
    if pid in seen_ids:
        fail(f"duplicate product id: {pid}")
    seen_ids.add(pid)
    intended = p.get("intended_asin", "")
    intended_fields = [p.get("official_listing_url", ""), p.get("confirmed_on", ""), p.get("confirmed_source", ""), p.get("special_link_from_central", "")]
    if not intended and any(intended_fields):
        fail(f"{pid}: intended ASIN blank but intended-confirmation fields are populated")
    if not intended and p.get("status") != "observed-not-confirmed":
        fail(f"{pid}: blank intended ASIN must have observed-not-confirmed status")
    if intended and not all(intended_fields[:3]):
        fail(f"{pid}: intended ASIN requires listing URL, confirmation date and source")
    if intended and p.get("status") == "observed-not-confirmed":
        fail(f"{pid}: confirmed intended ASIN cannot retain observed-not-confirmed status")
    target = p.get("observed_redirect_target", "")
    obs_asin = p.get("observed_asin", "")
    if target:
        match = re.search(r"/dp/([A-Z0-9]{10})(?:[/?#]|$)", urllib.parse.urlsplit(target).path + ("?" if urllib.parse.urlsplit(target).query else ""))
        if not match or match.group(1) != obs_asin:
            fail(f"{pid}: observed ASIN does not match separately stored observed target")
    if p.get("submitted_token_length") != len(p.get("submitted_token", "")):
        fail(f"{pid}: submitted token length is inaccurate")
    if target and p.get("observed_asin_length") != len(obs_asin):
        fail(f"{pid}: observed ASIN length is inaccurate")
    if not p.get("observed_on") or not p.get("observed_via"):
        fail(f"{pid}: observed destination needs date and provenance")
    for key in ("price", "rating"):
        if p.get(key) and not p.get(key + "_source"):
            fail(f"{pid}: populated {key} requires a source")

# Question and flagged-review rows always carry a public source URL.
for q in questions:
    if not q.get("known_source"):
        fail(f"{q.get('id')}: question row has no source link")
    if q.get("status") not in {"open", "partially-answered", "answered"}:
        fail(f"{q.get('id')}: unknown question status")
for f in flags:
    if not f.get("source_links"):
        fail(f"{f.get('id')}: flagged row has no source link")

# Every guide has a body and at least one first-party/official reference; the
# links are shown on its generated page so readers can inspect provenance.
for g in guides:
    slug = g.get("slug", "")
    body = SRC / "content/guides" / (slug + ".html")
    if not body.exists():
        fail(f"guide {slug}: missing body")
    if not g.get("sources"):
        fail(f"guide {slug}: no official source is attached")
    for url in g.get("sources", []):
        host = (urllib.parse.urlsplit(url).hostname or "").lower()
        if not any(host == allowed or host.endswith("." + allowed) for allowed in OFFICIAL_HOSTS):
            fail(f"guide {slug}: non-allowlisted source {url}")

# Sitemap and feed parse, cover every generated guide, and carry dates.
ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
try:
    tree = ET.parse(ROOT / "sitemap.xml")
    sitemap_locs = {el.text for el in tree.findall(".//sm:loc", ns)}
    sitemap_lastmods = [el.text for el in tree.findall(".//sm:lastmod", ns)]
    base = site.get("brand", {}).get("base_url", "").rstrip("/")
    for g in guides:
        url = base + "/guides/" + g["slug"] + ".html"
        if url not in sitemap_locs:
            fail(f"guide {g['slug']} missing from sitemap")
    if not sitemap_lastmods or any(not x for x in sitemap_lastmods):
        fail("sitemap has missing lastmod values")
except Exception as exc:
    fail(f"sitemap.xml failed XML validation: {exc}")

try:
    feed = ET.parse(ROOT / "feed.xml")
    channel = feed.getroot().find("channel")
    items = channel.findall("item") if channel is not None else []
    feed_links = {x.findtext("link") for x in items}
    for g in guides:
        url = site["brand"]["base_url"].rstrip("/") + "/guides/" + g["slug"] + ".html"
        if url not in feed_links:
            fail(f"guide {g['slug']} missing from RSS feed")
    for item in items:
        if not item.findtext("pubDate"):
            fail("RSS item missing pubDate")
except Exception as exc:
    fail(f"feed.xml failed XML validation: {exc}")

robots = ROOT / "robots.txt"
if not robots.exists() or "Sitemap:" not in robots.read_text(encoding="utf-8"):
    fail("robots.txt is missing its sitemap declaration")

if errors:
    print("SITE VALIDATION FAILED")
    for e in errors:
        print(" - " + e)
    sys.exit(1)
print(f"site validation passed: {len(html_files)} HTML pages, {len(products)} separated product records, {len(guides)} sourced guides")
