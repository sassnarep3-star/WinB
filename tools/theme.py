# theme.py — shared chrome for every page: head, masthead, disclosure strip, footer.
# Token-based templating (%%TOKEN%%) to keep HTML free of Python escaping hazards.

from content_data import SITE

BASE = SITE["base_url"].rstrip("/")
BUILT = SITE["built"]

NAV_MAIN = [
    ("index.html", "Home"),
    ("products.html", "The lineup"),
    ("air-fryers.html", "Air fryers"),
    ("thermometers.html", "Thermometers"),
    ("compare.html", "Compare"),
    ("guides.html", "Guides"),
    ("about.html", "About"),
]

NAV_FOOTER_SHOP = [
    ("products.html", "The lineup — all five picks"),
    ("air-fryers.html", "Air fryers category"),
    ("thermometers.html", "Thermometers category"),
    ("compare.html", "Side-by-side comparison"),
    ("guides.html", "Buying guides"),
]

NAV_FOOTER_DESK = [
    ("executive-summary.html", "Executive summary"),
    ("register.html", "Source &amp; product register"),
    ("workflow.html", "Publishing workflow &amp; compliance gate"),
    ("measurement.html", "Measurement &amp; campaign ledger"),
    ("flagged.html", "Flagged for review"),
    ("suggestions.html", "Suggestion review queue"),
    ("questions.html", "Open questions &amp; answers"),
]

DISCLOSURE_TEXT = (
    '<strong>Disclosure:</strong> Counter &amp; Crisp is reader-supported. If you buy through links on '
    'this site we may earn a commission, at no extra cost to you. Every product link is marked '
    '<span class="badge-sponsor">sponsored</span>. ' + SITE["disclosure"]
)

HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%%TITLE%%</title>
<meta name="description" content="%%DESCRIPTION%%">
<link rel="canonical" href="%%CANONICAL%%">
<meta property="og:site_name" content="%%SITE_NAME%%">
<meta property="og:title" content="%%TITLE%%">
<meta property="og:description" content="%%DESCRIPTION%%">
<meta property="og:type" content="%%OG_TYPE%%">
<meta property="og:url" content="%%CANONICAL%%">
<meta property="og:image" content="%%BASE%%/assets/img/hero.jpg">
<meta name="cc-collect-endpoint" content="">
<link rel="alternate" type="application/rss+xml" title="%%SITE_NAME%% feed" href="%%BASE%%/feed.xml">
<link rel="stylesheet" href="%%BASE%%/assets/css/site.css">
%%JSONLD%%
</head>
<body data-page-type="%%PAGE_TYPE%%">
<a class="skip-link" href="#main">Skip to content</a>
<header class="masthead">
  <div class="wrap">
    <div class="masthead-inner">
      <a class="brand" href="%%BASE%%/index.html">Counter <span class="amp">&amp;</span> Crisp</a>
      <span class="tagline">%%TAGLINE%%</span>
    </div>
    <nav class="nav" aria-label="Site">%%NAV%%</nav>
  </div>
</header>
<div class="disclosure-strip" role="note" aria-label="Affiliate disclosure">
  <div class="wrap">
    <span>%%DISCLOSURE%%</span>
  </div>
</div>
<main id="main">
"""

FOOTER_TEMPLATE = """</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-disclosure">
      <strong>Disclosure (repeated):</strong> %%DISCLOSURE%%
    </div>
    <div class="footer-cols">
      <div>
        <h4>Counter &amp; Crisp</h4>
        <p>A small, source-first buying desk for countertop cooking gear: air fryers and the
        thermometers that make them useful. We publish the questions to ask, the checklist to run,
        and exactly what we could and could not verify.</p>
        <p><a href="%%BASE%%/feed.xml">RSS feed</a> · <a href="%%BASE%%/sitemap.xml">Sitemap</a> · <a href="%%BASE%%/robots.txt">Robots</a></p>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>%%FOOTER_SHOP%%</ul>
      </div>
      <div>
        <h4>The desk</h4>
        <ul>%%FOOTER_DESK%%</ul>
      </div>
      <div>
        <h4>Standards</h4>
        <ul>
          <li><a href="%%BASE%%/about.html#policy">Editorial &amp; verification policy</a></li>
          <li><a href="%%BASE%%/workflow.html#compliance">Compliance gate</a></li>
          <li><a href="%%BASE%%/measurement.html#privacy">Privacy note</a></li>
          <li><a href="%%BASE%%/register.html#intent">Link intent record</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <span>© 2026 Counter &amp; Crisp · Built %%BUILT%% · Canonical site: <a href="%%BASE%%/">%%BASE%%/</a></span>
      <span>Prices and ratings are intentionally not shown — see <a href="%%BASE%%/flagged.html">Flagged for Review</a>.</span>
    </div>
  </div>
</footer>
<script src="%%BASE%%/assets/js/site.js" defer></script>
</body>
</html>
"""


def nav_html(active):
    parts = []
    for href, label in NAV_MAIN:
        cur = ' aria-current="page"' if href == active else ""
        parts.append('<a href="%s/%s"%s>%s</a>' % (BASE, href, cur, label))
    return "\n      ".join(parts)


def footer_list(items):
    return "\n          ".join(
        '<li><a href="%s/%s">%s</a></li>' % (BASE, href, label) for href, label in items
    )


def render(title, description, page, body, page_type="page", og_type="website", jsonld=""):
    """Render a full page. `page` is the active nav file name."""
    esc_title = title.replace("&", "&amp;")
    esc_desc = description.replace("&", "&amp;")
    html = HEAD_TEMPLATE
    html = html.replace("%%TITLE%%", esc_title)
    html = html.replace("%%DESCRIPTION%%", esc_desc)
    html = html.replace("%%CANONICAL%%", "%s/%s" % (BASE, page))
    html = html.replace("%%SITE_NAME%%", SITE["name"])
    html = html.replace("%%OG_TYPE%%", og_type)
    html = html.replace("%%BASE%%", BASE)
    html = html.replace("%%JSONLD%%", jsonld)
    html = html.replace("%%PAGE_TYPE%%", page_type)
    html = html.replace("%%TAGLINE%%", SITE["tagline"].replace("&", "&amp;"))
    html = html.replace("%%NAV%%", nav_html(page))
    html = html.replace("%%DISCLOSURE%%", DISCLOSURE_TEXT)
    html += body
    foot = FOOTER_TEMPLATE
    foot = foot.replace("%%DISCLOSURE%%", DISCLOSURE_TEXT)
    foot = foot.replace("%%FOOTER_SHOP%%", footer_list(NAV_FOOTER_SHOP))
    foot = foot.replace("%%FOOTER_DESK%%", footer_list(NAV_FOOTER_DESK))
    foot = foot.replace("%%BASE%%", BASE)
    foot = foot.replace("%%BUILT%%", BUILT)
    return html + foot


def jsonld_webpage(name, description, page, extra=""):
    return (
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage",'
        '"name":"%s","description":"%s","url":"%s/%s","isPartOf":{"@type":"WebSite",'
        '"name":"%s","url":"%s/"},"dateModified":"%s"%s}</script>'
        % (name, description, BASE, page, SITE["name"], BASE, BUILT, extra)
    )


def jsonld_article(title, description, page, section):
    return (
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article",'
        '"headline":"%s","description":"%s","url":"%s/%s","datePublished":"%s","dateModified":"%s",'
        '"author":{"@type":"Organization","name":"Counter & Crisp Desk"},'
        '"publisher":{"@type":"Organization","name":"Counter & Crisp"},'
        '"articleSection":"%s","image":"%s/assets/img/hero.jpg"}</script>'
        % (title, description, BASE, page, BUILT, BUILT, section, BASE)
    )
