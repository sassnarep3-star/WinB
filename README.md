# WinB — COUNTER (Amazon Associates affiliate platform)

**COUNTER** is a polished, publication-style Amazon Associates affiliate site for
kitchen products — **air fryers** and **meat thermometers**. It reads like a
shop, not an audit: a buyer-facing front page with verified product listings,
no-hype question-shaped buying guides, a campaign dashboard, a decision board
(suggestions + open questions), and a flagged-for-review page.

Tracking ID: **shopnow047c-20**

## What's here

- `docs/` — the published static site (GitHub Pages source)
  - `index.html` — publication front page
  - `products.html` — verified product register + product-intent confirmation record
  - `buying-guides.html` / `articles.html` — question-shaped guides & explainers
  - `analysis.html` — analysis & findings (every row source-linked)
  - `dashboard.html` — campaign dashboard, events, privacy-preserving click counter, empty campaign ledger
  - `suggestions.html` — decision board: suggestions + open questions
  - `flagged.html` — irregularities & unverified items with source links
  - `compliance.html` — disclosure & official policy sources
  - `about.html` — executive summary
  - `css/`, `js/`, `img/`, `sitemap.xml`, `robots.txt`, `site.webmanifest`
- `.github/workflows/deploy.yml` — deploys `docs/` to GitHub Pages on push to `main`
- `COORDINATION.md` — shared task board, sources, verification record

## Verification-first

Every product row links to its official Amazon listing. The five submitted
`link.amazon` short links were resolved live (2026-11-20); the resolved ASIN,
title, brand and category were read from the official listing. Price, rating
and review count are **left blank and flagged** rather than inferred. Intent
and observation are kept in **separate fields** that are never merged.

## Compliance

The required Associates statement appears in a disclosure strip under the
masthead on every page and in the footer. Every outbound Amazon link is marked
as sponsored (`rel="sponsored"`). See `docs/compliance.html` for official sources.

## Local preview

```bash
# serve the docs/ folder
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000
