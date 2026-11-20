#!/usr/bin/env python3
# build_site.py — generates every HTML page, sitemap.xml, feed.xml, robots.txt, and the
# JSON data exports. Single source of truth: tools/content_*.py + tools/theme.py.
#
# Usage:  python3 tools/build_site.py
# Then:   python3 tools/check_links.py

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from content_data import SITE, PRODUCTS, OBSERVATIONS, SOURCES
from content_pages import GUIDES as GUIDES_FEED
from theme import render, jsonld_webpage, jsonld_article, BASE
import content_pages as shop
import content_desk as desk
import content_guides as guides

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILT = SITE["built"]
RSS_DATE = "Fri, 20 Nov 2026 12:00:00 GMT"

# ---------------------------------------------------------------------------
# Page registry: file, <title>, meta description, nav key, body fn, page type, og type
# ---------------------------------------------------------------------------
PAGES = [
    ("index.html",
     "Counter & Crisp — Air fryers & kitchen thermometers, compared plainly",
     "Five countertop cooking tools compared by the questions that decide the purchase: three air fryers, two meat thermometers, sourced facts, and no hype.",
     "index.html", shop.index_body, "home", "website"),
    ("products.html",
     "The lineup — five countertop picks | Counter & Crisp",
     "All five products on the Counter & Crisp desk: three air fryers and two thermometers, with verified register data, seller claims labelled, and sponsored links.",
     "products.html", shop.products_body, "page", "website"),
    ("air-fryers.html",
     "Air fryers: three shapes, one decision | Counter & Crisp",
     "Dual basket, oven style, or one big drawer — what to compare before buying an air fryer, with checklists, capacity and cleanup questions, and sourced facts.",
     "air-fryers.html", shop.air_fryers_body, "page", "website"),
    ("thermometers.html",
     "Meat thermometers: end the guesswork | Counter & Crisp",
     "Instant-read vs wireless leave-in thermometers: what to compare, which accuracy claims to interrogate, and the USDA temperatures worth cooking to.",
     "thermometers.html", shop.thermometers_body, "page", "website"),
    ("compare.html",
     "Compare the five picks side by side | Counter & Crisp",
     "A decision-first comparison of the Counter & Crisp lineup: what each tool is good for, what to check first, and the four questions that choose for you.",
     "compare.html", shop.compare_body, "page", "website"),
    ("guides.html",
     "Buying guides — start with the question | Counter & Crisp",
     "Question-shaped buying guides for air fryers and meat thermometers: shape, capacity, cleanup, multi-function questions, and thermometer setup.",
     "guides.html", shop.guides_body, "page", "website"),
    ("guide-basket-vs-oven.html",
     "Basket or oven-style air fryer: what should you compare?",
     "The decision that actually separates basket and oven-style air fryers: meals test, honest trade-offs, and the questions to ask before checkout.",
     "guides.html", lambda: guides.GUIDE_BASKET_VS_OVEN, "guide", "article"),
    ("guide-capacity.html",
     "A no-hype checklist for comparing air fryer capacity",
     "Why quart numbers mislead, and a practical checklist for judging what actually fits in an air fryer — by layers, batches, and your biggest night.",
     "guides.html", lambda: guides.GUIDE_CAPACITY, "guide", "article"),
    ("guide-cleanup.html",
     "How to assess cleanup and counter-space trade-offs",
     "The two recurring costs of an air fryer: the minutes after dinner and the square inches on the counter. A seven-question cleanup audit and a counter audit.",
     "guides.html", lambda: guides.GUIDE_CLEANUP, "guide", "article"),
    ("guide-multifunction.html",
     "Questions to ask before buying a multi-function kitchen appliance",
     "Ten functions on the box usually means three you'll use. Ten questions and a swap test that reveal which ones — before the appliance becomes a toast rack.",
     "guides.html", lambda: guides.GUIDE_MULTIFUNCTION, "guide", "article"),
    ("guide-thermometers.html",
     "Instant-read or smart wireless: which meat thermometer setup fits?",
     "How to choose between instant-read and wireless leave-in thermometers — with USDA's safe minimum internal temperatures and the claims worth interrogating.",
     "guides.html", lambda: guides.GUIDE_THERMOMETERS, "guide", "article"),
    ("about.html",
     "About & method — sources or silence | Counter & Crisp",
     "Who writes Counter & Crisp, the editorial and verification policy, imagery rules, and why blank cells are a feature.",
     "about.html", shop.about_body, "page", "website"),
    ("executive-summary.html",
     "Executive summary | Counter & Crisp",
     "The project in one page: what exists, what is verified, what is deliberately blank, and the decisions waiting for the owner.",
     "index.html", desk.executive_summary_body, "page", "website"),
    ("register.html",
     "Source & product register | Counter & Crisp",
     "Every entry and finding with its evidence: official source register, product-intent confirmation record, working product register, and dated observations.",
     "index.html", desk.register_body, "page", "website"),
    ("workflow.html",
     "Publishing workflow & compliance gate | Counter & Crisp",
     "How each page is drafted, sourced, disclosure-checked, link-gated, published, and measured — automated where possible, gated where not.",
     "index.html", desk.workflow_body, "page", "website"),
    ("measurement.html",
     "Measurement & campaign ledger | Counter & Crisp",
     "The five defined events, the privacy-preserving click counter, the self-hosted endpoint contract, and an empty but well-defined campaign ledger.",
     "index.html", desk.measurement_body, "page", "website"),
    ("flagged.html",
     "Flagged for review | Counter & Crisp",
     "Irregularities, gaps, and unresolved items found during line-by-line verification — published with evidence so they can be reviewed after launch.",
     "index.html", desk.flagged_body, "page", "website"),
    ("suggestions.html",
     "Suggestion review queue | Counter & Crisp",
     "Twelve proposals to improve decision quality and organic reach — collected for review, with impact, effort, and risk, and nothing implemented without a decision.",
     "index.html", desk.suggestions_body, "page", "website"),
    ("questions.html",
     "Open questions & answers | Counter & Crisp",
     "What we know with sources, what we don't with a discovery path for each, and which decisions every open item blocks.",
     "index.html", desk.questions_body, "page", "website"),
    ("404.html",
     "Page not found | Counter & Crisp",
     "This page didn't make it onto the counter.",
     "index.html", desk.notfound_body, "page", "website"),
]


def guide_jsonld(page, title, desc):
    return jsonld_article(title, desc, page, "Buying guides")


def build():
    written = []
    for page, title, desc, nav, body_fn, ptype, og in PAGES:
        if ptype == "guide":
            extra = guide_jsonld(page, title, desc)
        else:
            extra = jsonld_webpage(title, desc, page)
        html = render(title, desc, page, body_fn(), page_type=ptype, og_type=og, jsonld=extra)
        with open(os.path.join(ROOT, page), "w", encoding="utf-8") as f:
            f.write(html)
        written.append(page)

    # ---- sitemap.xml (Sitemaps protocol, SRC-08) ----
    urls = ["index.html"] + [p for p in written if p != "index.html" and p != "404.html"]
    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in sorted(urls):
        parts.append("  <url>")
        parts.append("    <loc>%s/%s</loc>" % (BASE, u))
        parts.append("    <lastmod>%s</lastmod>" % BUILT)
        parts.append("  </url>")
    parts.append("</urlset>")
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(parts) + "\n")

    # ---- feed.xml (RSS 2.0, SRC-09) ----
    items = []
    for href, eyebrow, gt, blurb in GUIDES_FEED:
        items.append("""    <item>
      <title>%s</title>
      <link>%s/%s</link>
      <guid isPermaLink="true">%s/%s</guid>
      <description>%s</description>
      <category>Buying guides</category>
      <pubDate>%s</pubDate>
    </item>""" % (gt, BASE, href, BASE, href, blurb, RSS_DATE))
    feed = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Counter &amp; Crisp — buying guides</title>
    <link>%s/</link>
    <description>Question-shaped buying guides for countertop cooking gear: air fryers and thermometers, compared with sources attached.</description>
    <language>en-us</language>
    <lastBuildDate>%s</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <copyright>2026 Counter &amp; Crisp</copyright>
%s
  </channel>
</rss>
""" % (BASE, RSS_DATE, "\n".join(items))
    with open(os.path.join(ROOT, "feed.xml"), "w", encoding="utf-8") as f:
        f.write(feed)

    # ---- robots.txt ----
    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % BASE)

    # ---- JSON data exports (machine-readable register) ----
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    with open(os.path.join(ROOT, "data", "observations.json"), "w", encoding="utf-8") as f:
        json.dump({"schema": "counter-and-crisp/observations-v1",
                   "note": "Observed redirect targets, kept separate from intended identifiers. Observed 2026-11-20 via server-side fetch; mapping not confirmed.",
                   "observations": OBSERVATIONS}, f, indent=2)
    with open(os.path.join(ROOT, "data", "sources.json"), "w", encoding="utf-8") as f:
        json.dump({"schema": "counter-and-crisp/sources-v1",
                   "verified_on": "2026-11-20",
                   "sources": SOURCES}, f, indent=2)
    with open(os.path.join(ROOT, "data", "products.json"), "w", encoding="utf-8") as f:
        json.dump({"schema": "counter-and-crisp/products-v1",
                   "policy": "price/rating are null by design (unverified); 'claims' are seller statements from listing titles",
                   "products": PRODUCTS}, f, indent=2)

    print("built %d pages + sitemap + feed + robots + data exports" % len(written))
    for w in written:
        print("  ", w)


if __name__ == "__main__":
    build()
