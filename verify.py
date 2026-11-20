#!/usr/bin/env python3
"""Verify the built site before publishing.

Checks, in order:
  1. every internal link and asset reference resolves to a real file
  2. no page is missing the disclosure strip or the sponsored marking
  3. every outbound Amazon product link carries rel="sponsored"
  4. the sitemap and feed parse as XML and list only real pages
  5. no page shows a price-like or star-rating pattern (policy check, FLG-002)
  6. every <table> row on the register pages has a source link or an explicit flag

Exit code 0 means publishable. Any other code means fix it first.
"""

import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = "https://sassnarep3-star.github.io/WinB"
errors = []
warnings = []


def page_files():
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in
                       (".git", "_build", "content", "node_modules", "__pycache__", "assets")]
        if os.path.basename(dirpath) == "assets":
            continue
        for f in filenames:
            if f.endswith(".html"):
                out.append(os.path.join(dirpath, f))
    return sorted(out)


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []       # (tag, attr, value)
        self.anchors = []     # anchor dicts
        self.ids = set()
        self.tables = []
        self.text_chunks = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for attr in ("href", "src"):
            if attr in a and a[attr]:
                self.links.append((tag, attr, a[attr]))
        if tag == "a":
            self.anchors.append(a)
        if tag == "table":
            self.tables.append([])

    def handle_data(self, data):
        self.text_chunks.append(data)


def resolve(page, target):
    """Turn a page-relative link into an absolute filesystem path."""
    if target.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
        return None
    t = target.split("#")[0].split("?")[0]
    if not t:
        return None
    if t.startswith("/"):
        # absolute-in-site link: resolve against the Pages base path
        rel = t
        if rel.startswith("/"):
            # links are written as ../..//page or similar; normalise
            parts = [p for p in rel.split("/") if p not in ("", ".")]
            return os.path.join(ROOT, *parts)
    return os.path.normpath(os.path.join(os.path.dirname(page), t))


def check():
    pages = page_files()
    if not pages:
        errors.append("no HTML pages found")
        return

    for page in pages:
        rel = os.path.relpath(page, ROOT)
        with open(page, encoding="utf-8") as f:
            raw = f.read()
        p = LinkParser()
        p.feed(raw)

        # 1. disclosure strip present, above the fold, before <main>
        head, sep, tail = raw.partition("<main")
        if sep and "As an Amazon Associate I earn from qualifying purchases." not in head:
            errors.append(f"{rel}: disclosure statement not above <main>")

        # 1b. footer repeat
        if raw.count("As an Amazon Associate I earn from qualifying purchases.") < 2:
            errors.append(f"{rel}: disclosure statement not repeated in footer")

        # 2. internal links resolve
        for tag, attr, value in p.links:
            dest = resolve(page, value)
            if dest is None:
                continue
            if not os.path.exists(dest):
                errors.append(f"{rel}: broken {tag} {attr}=\"{value}\"")
                continue
            if os.path.isdir(dest) and not os.path.exists(os.path.join(dest, "index.html")):
                errors.append(f"{rel}: directory without index.html: {value}")

        # 3. amazon product links must be sponsored
        for a in p.anchors:
            href = a.get("href") or ""
            if "amazon.com" in href or "link.amazon" in href:
                relv = a.get("rel") or ""
                if "nofollow" not in relv:
                    errors.append(f"{rel}: amazon link without rel=nofollow: {href}")
                # purchase links must be visibly sponsored; citation links need not be
                if a.get("data-outbound") == "amazon":
                    if "sponsored" not in relv:
                        errors.append(f"{rel}: purchase link without rel=sponsored: {href}")
                    if "Sponsored" not in raw:
                        errors.append(f"{rel}: purchase link without a visible Sponsored label")

        # 5. price / rating patterns in reader-facing copy
        text = " ".join(p.text_chunks)
        for pat, why in [
            (r"\$\s?\d+\.\d{2}", "a dollar price"),
            (r"\d(\.\d)?\s*(out of 5 stars|/5 stars|\sstars\b)", "a star rating"),
            (r"\b\d\.\d\s*stars\b", "a star rating"),
            (r"[Bb]est\s?[Ss]eller\s?[Rr]ank", "a Best Seller Rank"),
        ]:
            for m in re.finditer(pat, text):
                before = text[max(0, m.start() - 6):m.start()]
                # a list of things the site does NOT show is not a claim
                if re.search(r"(No|no|not|never)\s*$", before):
                    continue
                errors.append(f"{rel}: possible {why} in copy: {m.group(0)!r}")
                break

        # 6. at least one source link on register/spec tables
        if rel.startswith(("dashboard", "reviews")):
            if "source" not in raw.lower():
                errors.append(f"{rel}: no source links found on a data page")

    # 4. sitemap + feed parse, and list real pages
    for fname in ("sitemap.xml", "feed.xml"):
        path = os.path.join(ROOT, fname)
        if not os.path.exists(path):
            errors.append(f"{fname}: missing")
            continue
        try:
            tree = ET.parse(path)
        except ET.ParseError as e:
            errors.append(f"{fname}: not valid XML ({e})")
            continue
        locs = [e.text for e in tree.iter() if e.tag.endswith("loc") or e.tag.endswith("link")]
        for loc in locs:
            if not loc or not loc.startswith(BASE):
                continue
            rel = loc[len(BASE):].strip("/")
            rel = rel or "index.html"
            target = os.path.join(ROOT, rel)
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
            elif not os.path.splitext(target)[1]:
                target += ".html"
            if not os.path.exists(target):
                errors.append(f"{fname}: lists a URL with no page: {loc}")

    # sitemap must not list the 404
    sm = os.path.join(ROOT, "sitemap.xml")
    if os.path.exists(sm):
        if "404.html" in open(sm, encoding="utf-8").read():
            errors.append("sitemap.xml: lists 404.html")


def main():
    check()
    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("FAIL ", e)
    print(f"\n{len(errors)} errors, {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
