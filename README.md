# WinB — Kitchen Shortlist (working title)

A static, GitHub Pages site and data register for five Amazon listings: three air fryers and ovens, two meat thermometers.

- **Live site (after deploy):** https://sassnarep3-star.github.io/WinB/
- **Data (source of truth):** `data/` — `products.json` (register), `sources.json`, `flags.json`, `questions.json`, `suggestions.json`, `campaign_ledger.csv` (empty by design).
- **Build:** `python3 scripts/build.py` writes `docs/` and validates it. Exit code 1 means the build failed a check; do not publish.
- **Coordination:** see `COORDINATION.md` (task board, verification log, irregularities, integration log).

## Rules the build enforces

1. Every page shows the Associates statement above the fold and in the footer.
2. Every Amazon-hosted link carries `rel="sponsored"`.
3. Every blank value is marked unverified and linked to a flag. No value is inferred.
4. Internal links resolve. No script tags (no cookies or analytics are set).

## Not built yet (see Flagged for Review)

- Outbound-click counter and self-hosted analytics endpoint (needs a server; FLG-05, FLG-06).
- Special Link tests in an Associates account (FLG-04).
- Commission rates and prices (FLG-07, FLG-08).
- Search Console verification (FLG-13).

## Publishing

GitHub Pages publishes from the `main` branch, `/docs` folder. Rebuild with `python3 scripts/build.py` before committing changes to `docs/`.
