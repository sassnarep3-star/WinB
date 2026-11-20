# WinB — COUNTER (Amazon Associates affiliate platform)

**COUNTER** is a polished, publication-style Amazon Associates affiliate site for
kitchen products — **air fryers** and **meat thermometers**. It reads like a
shop, not an audit: a buyer-facing front page with verified product listings,
no-hype question-shaped buying guides, a campaign dashboard, a decision board
(suggestions + open questions), and a flagged-for-review page.

Tracking ID: **shopnow047c-20**

## What's here

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
- `.nojekyll` — served as plain static files (no Jekyll processing)
- `COORDINATION.md` — shared task board, sources, verification record

The site is published to GitHub Pages from the repository root (branch `main`,
path `/`). GitHub Pages is configured to deploy from the `main` branch, so a
push to `main` publishes the site automatically.

## Local preview

```bash
# serve the repo root (the site files live at the root)
python3 -m http.server 8000
```

Then open http://localhost:8000
