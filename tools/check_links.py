#!/usr/bin/env python3
# check_links.py — verification gate for the generated Counter & Crisp variant.
#   1. every internal link resolves to a file that exists (incl. anchors)
#   2. every page carries the disclosure strip (above the fold) + footer disclosure
#   3. every product link is marked sponsored (class + rel)
#   4. register page carries every source id
#   5. sitemap.xml and feed.xml reference only existing pages
#   6. no stray template tokens (%%...%%) left in output
#
# Usage: python3 tools/check_links.py [dir]   (default: alt-site/counter-and-crisp)

import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from content_data import SITE

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(HERE), "alt-site", "counter-and-crisp")
BASE = SITE["base_url"].rstrip("/")

errors = []
checked = 0

html_files = sorted(glob.glob(os.path.join(ROOT, "*.html")))
pages = {os.path.basename(p) for p in html_files}

for path in html_files:
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as f:
        html = f.read()

    # 6. template tokens
    for tok in re.findall(r"%%[A-Z_]+%%", html):
        errors.append("%s: unresolved template token %s" % (name, tok))

    # 2. disclosures
    if "disclosure-strip" not in html:
        errors.append("%s: missing disclosure strip" % name)
    if "As an Amazon Associate I earn from qualifying purchases." not in html:
        errors.append("%s: missing required Associates statement" % name)
    if html.find("disclosure-strip") > html.find('<main id="main">'):
        errors.append("%s: disclosure strip is not above the fold" % name)

    # 1. internal links (relative, or absolute under the canonical base)
    for href in re.findall(r'href="([^"]+)"', html):
        if href.startswith("#") or href.startswith("mailto:"):
            continue
        target = href.split("#")[0].split("?")[0]
        if href.startswith("http"):
            if not target.startswith(BASE):
                continue  # external source link; existence checked at verification time
            target = target[len(BASE):]
        if not target:
            continue  # canonical root link
        target = target.lstrip("/")
        checked += 1
        if target and not os.path.exists(os.path.join(ROOT, target)):
            errors.append("%s: broken internal link -> %s" % (name, href))
        frag = href.split("#")[1] if "#" in href else ""
        if frag and target.endswith(".html"):
            tpath = os.path.join(ROOT, target)
            if os.path.exists(tpath):
                thead = open(tpath, encoding="utf-8").read()
                if ('id="%s"' % frag) not in thead:
                    errors.append("%s: missing anchor #%s in %s" % (name, frag, target))

    # 3. sponsored marks
    for tag in re.findall(r"<a [^>]*class=\"[^\"]*sponsored-link[^\"]*\"[^>]*>", html):
        if 'rel="sponsored' not in tag:
            errors.append("%s: sponsored link missing rel=sponsored -> %s" % (name, tag[:90]))

    # 4. register completeness
    if name == "register.html":
        for sid in ["SRC-%02d" % i for i in range(1, 13)]:
            if sid not in html:
                errors.append("register.html: missing source id %s" % sid)

for xml_name in ("sitemap.xml", "feed.xml"):
    p = os.path.join(ROOT, xml_name)
    if not os.path.exists(p):
        errors.append("%s: missing" % xml_name)
        continue
    with open(p, encoding="utf-8") as f:
        xml = f.read()
    for loc in re.findall(r"<loc>([^<]+)</loc>", xml):
        page = loc.rsplit("/", 1)[-1]
        if page and page not in pages:
            errors.append("%s: references missing page %s" % (xml_name, page))
    for link in re.findall(r"<link>([^<]+)</link>", xml):
        page = link.rsplit("/", 1)[-1]
        if page and page not in pages and page != "":
            errors.append("%s: references missing page %s" % (xml_name, page))

if errors:
    print("FAIL — %d issue(s):" % len(errors))
    for e in errors:
        print("  -", e)
    sys.exit(1)
print("OK — %d pages, %d internal links checked, disclosures present, tokens clean. (dir: %s)"
      % (len(html_files), checked, ROOT))
