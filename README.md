# WinB — Crisp & Done (Amazon Associates buyer's guide)

A static, GitHub Pages site with five supplied Amazon product links (air fryers and meat thermometers),
question-led guides, a dashboard, a verification register, and a flagged-for-review page.

**Live site (after deploy):** https://sassnarep3-star.github.io/WinB/

## Start here

- Executive summary: `/plan/executive-summary/` on the live site (source: `build/build.py`)
- Flagged for review (irregularities, unverified items, source links): `/flagged-for-review/`
- Coordination log: [COORDINATION.md](COORDINATION.md)

## Build and check locally

```bash
python3 build/build.py                 # writes _site/ (BASE_PATH defaults to /WinB/)
BASE_PATH=/ python3 build/build.py     # root-relative build for a local preview
python3 scripts/check_site.py          # compliance + link gate; exit 1 on failure
```

Requires Python 3.11+ (standard library only) and Node 22+ for the `node --check` of the analytics script.

## What the gate checks (`scripts/check_site.py`)

- Associates disclosure ("As an Amazon Associate I earn from qualifying purchases.") in the strip under the masthead **and** in the footer, on every page.
- Every Amazon link has `rel="sponsored"`. No tagged (`tag=`) URL is published until the Special Link test passes (FLG-003).
- Only approved outbound URLs appear (supplied links, observed listing pages, cited policy pages).
- Internal links and `#anchors` resolve; sitemap lists every page; RSS lists every guide.
- Every data table row has an official source link or an explicit "Unverified" marker.
- Data: no prices or ratings are populated (Associates policy §2(b)); observed ASINs are 10 characters; intended ASINs stay blank unless confirmed with a listing URL.

## Data (single source of truth)

| File | What it holds |
|---|---|
| `data/products.json` | Five product rows: supplied link, intended ASIN (blank), observed redirect target, observed ASIN, source |
| `data/verification.json` | Policy and source register (each row has an official link) |
| `data/flagged.json` | Irregularities and unverified items (FLG-001 …) with source links |
| `data/questions.json` | Open questions: what we know, what is missing, how to discover it |
| `data/suggestions.json` | Options for each decision. Nothing is implemented until a path is chosen |
| `data/guides.json` | Guide metadata; bodies live in `content/guides/*.html` |
| `data/campaign_ledger.csv` | Campaign ledger. Header only, by design |
| `data/config.json` | Site name, base path, tracking ID, analytics endpoint (blank), proposed events |

## Deployment

`.github/workflows/pages.yml` builds, runs the gate, and deploys to GitHub Pages on `main`. A failing gate stops the deploy.
Pages uses the GitHub Actions source (`actions/deploy-pages@v4`; see the verification register, V-14/V-15).

## Not in this repo

- No analytics server (GitHub Pages is static). The analytics hook is inert until an endpoint is configured (FLG-007).
- No Associates account data, no conversion or revenue data (see the empty ledger).
- Search Console verification is an owner step (FLG-008).
