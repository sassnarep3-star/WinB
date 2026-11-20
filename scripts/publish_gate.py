#!/usr/bin/env python3
"""Register-surface publish gate (session b26a9f95).

The canonical site is gated by tools/verify.mjs (R1–R10), tools/check.cjs,
tools/linkcheck.mjs and tools/smoke.mjs — those own every generated page.
This gate owns the hand-written register surface this session added:

  products/index.html, products/air-fryers/index.html,
  products/thermometers/index.html, direction/brief.html,
  flags/index.html, analytics/index.html

Checks (per register page):
  1  disclosure strip (class="disclosure") sits under the masthead
  2  the Associates statement appears in the strip AND in a
     class="footer-disclosure" footer paragraph (at least twice)
  3  every retail Amazon / supplied short link carries rel="sponsored"
  4  every amazon.com/dp/ link carries tag=shopnow047c-20 and data-outbound
  5  every local href resolves to a file or directory index
  6  the event layer (assets/config.js + assets/analytics.js) is loaded
  7  title, meta description, canonical and og:title are present

Shared artefacts: feed.xml parses and resolves; robots.txt points at a
sitemap; sitemap.xml and sitemap-register.xml parse, list existing files,
and list every register page.

Human gates (endorsement context, intent confirmation, report attribution)
stay on /flags/ — this script never marks them ok.
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://sassnarep3-star.github.io/WinB"
STATEMENT = "As an Amazon Associate I earn from qualifying purchases."
TAG = "shopnow047c-20"
REGISTER_PAGES = [
    "products/index.html",
    "products/air-fryers/index.html",
    "products/thermometers/index.html",
    "direction/brief.html",
    "flags/index.html",
    "analytics/index.html",
]
RETAIL = re.compile(r'href="(https?://(?:www\.)?amazon\.com/[^"]*|https?://link\.amazon/[^"]*)"')
errors = []


def err(msg):
    errors.append(msg)


def local_target(href: str, page: Path):
    if href.startswith(("http://", "https://", "mailto:", "data:", "#")):
        return None
    path = href.split("#", 1)[0].split("?", 1)[0]
    if path == "":
        return page
    return (page.parent / path).resolve()


# ---------------------------------------------------------------- register pages
for rel in REGISTER_PAGES:
    page = ROOT / rel
    if not page.exists():
        err(f"{rel}: missing register page")
        continue
    text = page.read_text(encoding="utf-8")

    mast = text.find('<header class="masthead"')
    disc = text.find('class="disclosure"')
    if mast < 0:
        err(f"{rel}: missing masthead")
    elif disc < 0:
        err(f"{rel}: missing disclosure strip (class=\"disclosure\")")
    elif disc < mast:
        err(f"{rel}: disclosure strip must sit under the masthead")

    if text.count(STATEMENT) < 2:
        err(f"{rel}: Associates statement must appear at least twice (strip + footer)")
    if 'class="footer-disclosure"' not in text:
        err(f"{rel}: missing footer disclosure (class=\"footer-disclosure\")")

    for m in re.finditer(r"<a\s[^>]*>", text):
        tag = m.group(0)
        hm = RETAIL.search(tag)
        if not hm:
            continue
        rel_attr = re.search(r'rel="([^"]*)"', tag)
        if not rel_attr or "sponsored" not in rel_attr.group(1):
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

    if "assets/analytics.js" not in text or "assets/config.js" not in text:
        err(f"{rel}: event layer (config.js + analytics.js) not loaded")
    if "<title>" not in text or 'name="description"' not in text:
        err(f"{rel}: missing <title> or meta description")
    if 'rel="canonical"' not in text:
        err(f"{rel}: missing canonical")
    if 'property="og:title"' not in text:
        err(f"{rel}: missing og:title")

# ---------------------------------------------------------------- shared artefacts
try:
    feed = ET.parse(ROOT / "feed.xml")
    for item in feed.getroot().iter("item"):
        link = item.findtext("link", "").strip()
        local = ROOT / link.replace(BASE + "/", "")
        if not local.exists():
            err(f"feed.xml: item link does not resolve: {link}")
except ET.ParseError as exc:
    err(f"feed.xml: parse error: {exc}")

robots = (ROOT / "robots.txt").read_text(encoding="utf-8") if (ROOT / "robots.txt").exists() else ""
if f"Sitemap: {BASE}/sitemap.xml" not in robots:
    err("robots.txt: missing Sitemap line for " + BASE + "/sitemap.xml")

NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def check_sitemap(name: str, required_extra=()):
    path = ROOT / name
    if not path.exists():
        err(f"{name}: missing")
        return set()
    try:
        urls = [e.text.strip() for e in ET.parse(path).getroot().findall(f"{NS}url/{NS}loc")]
    except ET.ParseError as exc:
        err(f"{name}: parse error: {exc}")
        return set()
    for u in urls:
        local = ROOT / u.replace(BASE + "/", "")
        if u.startswith(BASE) and not ((local.is_dir() and (local / "index.html").exists()) or local.exists()):
            err(f"{name}: URL does not resolve to a file: {u}")
    for extra in required_extra:
        if f"{BASE}/{extra}" not in urls:
            err(f"{name}: register page not listed: {extra}")
    return set(urls)


check_sitemap("sitemap.xml")
check_sitemap("sitemap-register.xml", required_extra=REGISTER_PAGES)

# ---------------------------------------------------------------- report
if errors:
    print(f"PUBLISH GATE FAILED — {len(errors)} problem(s):")
    for e in errors:
        print("  x", e)
    sys.exit(1)
print(f"PUBLISH GATE PASSED — {len(REGISTER_PAGES)} register pages, feed/robots/sitemaps green.")
