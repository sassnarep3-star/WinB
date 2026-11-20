#!/usr/bin/env python3
"""Counterwise pre-publish gate.

Automates what can be automated and fails the build otherwise:
  1  Disclosure strip under the masthead on every page, repeated in the footer
  2  Every retail Amazon / supplied short link carries rel="sponsored"
  3  Every amazon.com/dp/ shopping link carries tag=shopnow047c-20 and data-outbound
  4  Every HTML page is in sitemap.xml, and every sitemap URL resolves to a file
  5  feed.xml parses and every item resolves to a local file
  6  robots.txt points at the sitemap
  7  Every local href resolves to a file or directory index
  8  Every page loads the event layer (config.js + analytics.js) and has title/description

Human gates that cannot be automated (endorsement context, intent confirmation,
report attribution) stay on the flagged page — this script never marks them ok.
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://sassnarep3-star.github.io/WinB"
DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases."
TAG = "shopnow047c-20"
RETAIL = re.compile(r'href="(https?://(?:www\.)?amazon\.com/[^"]*|https?://link\.amazon/[^"]*)"')
errors = []


def err(msg):
    errors.append(msg)


def html_files():
    return sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)


def sitemap_urls():
    tree = ET.parse(ROOT / "sitemap.xml")
    return [e.text.strip() for e in tree.getroot().findall(
        "{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]


def url_for(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return BASE + "/"
    if rel.endswith("/index.html"):
        return BASE + "/" + rel[: -len("index.html")]
    return BASE + "/" + rel


def local_target(href: str, page: Path) -> Path | None:
    """Resolve a same-site href to a file, or None if not local."""
    if href.startswith(("http://", "https://", "mailto:", "data:", "#")):
        return None
    path = href.split("#", 1)[0].split("?", 1)[0]
    if path == "":
        return page
    return (page.parent / path).resolve()


# --- 1..3, 7..8: per-page checks ---------------------------------------------
pages = html_files()
for page in pages:
    rel = page.relative_to(ROOT).as_posix()
    text = page.read_text(encoding="utf-8")

    if text.count(DISCLOSURE) < 2:
        err(f"{rel}: disclosure must appear in strip AND footer ({text.count(DISCLOSURE)} found)")
    mast = text.find('<header class="masthead"')
    disc = text.find('<div class="disclosure"')
    if mast < 0:
        err(f"{rel}: missing masthead")
    elif disc < 0:
        err(f"{rel}: missing disclosure strip")
    elif disc < mast:
        err(f"{rel}: disclosure strip must sit under the masthead")

    for m in re.finditer(r"<a\s[^>]*>", text):
        tag = m.group(0)
        hm = RETAIL.search(tag)
        if not hm:
            continue
        if 'rel="' not in tag or "sponsored" not in re.search(r'rel="([^"]*)"', tag).group(1):
            err(f"{rel}: retail link without rel=sponsored -> {hm.group(1)[:80]}")
        if "amazon.com/dp/" in hm.group(1):
            if f"tag={TAG}" not in hm.group(1):
                err(f"{rel}: /dp/ link missing tag={TAG} -> {hm.group(1)[:80]}")
            if "data-outbound" not in tag:
                err(f"{rel}: tagged shopping link missing data-outbound -> {hm.group(1)[:80]}")

    for href in re.findall(r'href="([^"]+)"', text):
        target = local_target(href, page)
        if target is None:
            continue
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            err(f"{rel}: broken local link -> {href}")

    if 'assets/analytics.js' not in text:
        err(f"{rel}: missing analytics.js")
    if 'assets/config.js' not in text:
        err(f"{rel}: missing config.js")
    if "<title>" not in text or 'name="description"' not in text:
        err(f"{rel}: missing <title> or meta description")

# --- 4: sitemap coverage -------------------------------------------------------
urls = sitemap_urls()
file_urls = {url_for(p) for p in pages}
for p in pages:
    if url_for(p) not in urls:
        err(f"sitemap.xml: missing {url_for(p)}")
for u in urls:
    if u not in file_urls:
        err(f"sitemap.xml: URL does not resolve to a file: {u}")

# --- 5: feed -------------------------------------------------------------------
try:
    feed = ET.parse(ROOT / "feed.xml")
    for item in feed.getroot().iter("item"):
        link = item.findtext("link", "").strip()
        local = ROOT / link.replace(BASE + "/", "")
        if not local.exists():
            err(f"feed.xml: item link does not resolve: {link}")
except ET.ParseError as exc:
    err(f"feed.xml: parse error: {exc}")

# --- 6: robots -----------------------------------------------------------------
robots = (ROOT / "robots.txt").read_text(encoding="utf-8") if (ROOT / "robots.txt").exists() else ""
if f"Sitemap: {BASE}/sitemap.xml" not in robots:
    err("robots.txt: missing Sitemap line for " + BASE + "/sitemap.xml")

# --- report --------------------------------------------------------------------
if errors:
    print(f"GATE FAILED — {len(errors)} problem(s):")
    for e in errors:
        print("  ✗", e)
    sys.exit(1)
print(f"GATE PASSED — {len(pages)} pages, {len(urls)} sitemap URLs, "
      f"disclosure+sponsored+tag+links+feed+robots checks green.")
