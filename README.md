# Counter & Crisp — WinB

A live, source-first Amazon affiliate site for five submitted products (three air fryers, two
meat thermometers), tracking ID `shopnow047c-20`. The landing page reads like a shop; every
verification surface sits one click away in the footer.

**Live site:** https://sassnarep3-star.github.io/WinB/

## What's in the box

| Path | What it is |
|---|---|
| `index.html`, `products.html`, `air-fryers.html`, `thermometers.html`, `compare.html` | The shop: front page, lineup, category pages, comparison |
| `guides.html`, `guide-*.html` | Five question-shaped buying guides (publication content) |
| `about.html` | Brand, editorial & verification policy, authorship |
| `executive-summary.html` + `EXECUTIVE_SUMMARY.md` | The project in one page |
| `register.html` | Source register, product-intent confirmation record, product register, findings |
| `workflow.html` | Publishing workflow & compliance gate (disclosure, endorsement context, link validation) |
| `measurement.html` | Five defined events, privacy-preserving click counter, endpoint contract, campaign ledger |
| `flagged.html` | Flagged for Review (FLG-001..FLG-008) |
| `suggestions.html` | Suggestion review queue (SUG-001..SUG-012) — nothing implemented without a decision |
| `questions.html` | Answered & open questions with discovery paths |
| `sitemap.xml`, `feed.xml`, `robots.txt` | Findability: one canonical site, RSS 2.0, sitemap protocol |
| `assets/` | CSS, JS (privacy-preserving counter), editorial imagery |
| `data/` | Machine-readable exports: `sources.json`, `observations.json`, `products.json` |
| `tools/build_site.py` | Regenerates every page + sitemap + feed from `tools/content_*.py` |
| `tools/check_links.py` | Verification gate: links, anchors, disclosures, sponsored marks, tokens |
| `COORDINATION.md` | Shared task board for parallel sessions (claims, scopes, verification log) |

## Building

```bash
python3 tools/build_site.py   # regenerate all HTML, sitemap.xml, feed.xml, robots.txt, data/
python3 tools/check_links.py  # must print OK before anything is published
```

Content lives in `tools/content_data.py` (verified data), `tools/content_pages.py` /
`tools/content_desk.py` / `tools/content_guides.py` (page copy), `tools/theme.py` (chrome).
To add a guide: add its entry to `GUIDES` in `tools/content_pages.py`, a page row in
`tools/build_site.py`, and its body in `tools/content_guides.py` — the sitemap and RSS feed
regenerate automatically.

## Rules the build enforces

1. Every register row has an official source link, or the cell is **blank and flagged** — never inferred.
2. Intended link fields and observed-redirect fields are kept separate (product-intent record).
3. The disclosure statement appears under the masthead and in the footer of every page.
4. Every product link is marked sponsored (badge + `rel="sponsored"`).
5. Prices/ratings are intentionally not published while unverified.

## Verification

Sources verified 2026-11-20 against official sites only (FTC, USDA FSIS, CPSC, Amazon Associates,
Amazon developer docs, sitemaps.org, RSS Advisory Board, GitHub Docs) — full list with URLs on
`register.html`. Open items are published on `flagged.html`; they do not block publication.
