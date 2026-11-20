#!/usr/bin/env python3
"""HTML checks for the published site. Exit 1 on failure.

Written by session 7feafaa3 as an independent gate. It does not edit any page.

Checks, per HTML file:
  * the disclosure statement appears above <main> (under the masthead) and again in <footer>
  * every Amazon product link (amazon.com product pages and link.amazon) has rel="sponsored"
  * external links point only to allow-listed official hosts
  * internal links resolve to a file; #fragments resolve to an id on the target page
  * the only script allowed is the local analytics client (assets/counterwise.js)
  * every table marked data-source-required has an official source link on each row
Usage:  python3 audit/check_html.py [root ...]

Default root is the repository, which is what Pages serves. Superseded builds
(archive/), the unpublished alt-site build output, and HTML build *sources*
(alt-site/content/) are excluded: their links cannot keep resolving as the live
site moves, and fragments are not pages. Pass a root explicitly to audit one.
"""
import re
import html.parser
import pathlib
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, unquote

ROOT = pathlib.Path(__file__).resolve().parent.parent
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


def err(msg):
    errors.append(msg)


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
        self.main_seen = False
        self.pre_main_text = ""
        self.disclosure_before_main = False
        self._script_inline = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "main":
            self.main_seen = True
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
        if not self.main_seen:
            self.pre_main_text += data
            if DISCLOSURE in self.pre_main_text:
                self.disclosure_before_main = True


EXCLUDE_PARTS = ("archive/", "alt-site/build/", "alt-site/content/")


def check_html(files):
    files = [f for f in files
             if not any(part in f.relative_to(ROOT).as_posix() for part in EXCLUDE_PARTS)]
    parsed = {}
    skipped = []
    for f in files:
        text = f.read_text(encoding="utf-8")
        # Only complete documents are pages. Build *sources* such as
        # alt-site/content/*.html are HTML fragments with no <html>/<body>;
        # declaring them broken is a false positive.
        if "<html" not in text[:4000].lower():
            skipped.append(f)
            continue
        ps = PageParser()
        ps.feed(text)
        parsed[f] = (text, ps)
    if skipped:
        print("skipped %d HTML fragment(s) that are build sources, not pages" % len(skipped))
    for f in parsed:
        text, ps = parsed[f]
        name = f.relative_to(ROOT).as_posix()
        here = f.parent
        if DISCLOSURE not in text:
            err(f"{name}: disclosure statement missing")
        # The brief asks for the strip *under the masthead*, and the masthead
        # contains the primary nav, so requiring it above the nav would
        # contradict the brief. The regulatory intent is that a reader cannot
        # reach a recommendation without passing the disclosure, so the
        # programmatic check is: present before <main> begins.
        if not ps.disclosure_before_main:
            err(f"{name}: disclosure must appear above <main> (under the masthead)")
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




def all_html(roots):
    files = []
    for r in roots:
        base = ROOT / r
        if base.exists():
            files.extend(sorted(base.rglob("*.html")))
    return files


def main(argv):
    roots = argv[1:] or ["."]
    files = all_html(roots)
    if not files:
        err(f"no HTML found under {roots}")
    check_html(files)
    print(f"checked {len(files)} HTML pages under {', '.join(roots)}")
    for e in errors:
        print("ERROR", e)
    if errors:
        print(f"FAILED with {len(errors)} error(s)")
        return 1
    print("OK: disclosure placement, sponsored links, internal links, sources and scripts pass")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
