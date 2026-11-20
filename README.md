# Counterwise (working name)

A publication-style kitchen buying guide site for five Amazon listings (three air fryers and ovens, two meat thermometers), with an evidence register, an Associates disclosure above the fold on every page, open decision questions, and a Flagged for Review page.

- **Live site (expected URL, confirm after deploy):** https://sassnarep3-star.github.io/WinB/ (served from the repository root on `main`; Pages source is legacy `main` `/`)
- **Data (source of truth):** `data/` — `products.json` (register), `sources.json` (S-01…S-10), `flags.json` (FLG-01…FLG-19), `questions.json`, `suggestions.json`, `campaign_ledger.csv` (empty by design).
- **Build:** `python3 scripts/build.py` regenerates the site at the repository root (`index.html`, `guides/`, `assets/`, `feed.xml`, `sitemap.xml`, `robots.txt`) and validates it. It removes only the files it generates. Exit code 1 means a rule failed; do not publish. CI (`.github/workflows/pages.yml`) runs the same check and fails if committed output differs from the build.
- **Analytics client:** `scripts/assets/counterwise.js` (copied to `assets/counterwise.js`). Review mode: no endpoint is configured, so it logs to the console and sends nothing.
- **Archive:** `archive/counterwise-root-site/` holds the superseded root-level site from earlier sessions (kept, not served). See FLG-18.
- **Coordination:** `COORDINATION.md` — the shared task board, claims, verification log, irregularities, and integration log.

## What the build enforces

1. The Associates statement, verbatim from Operating Agreement s.5, sits above the fold and in the footer on every page.
2. Every Amazon-hosted link carries `rel="sponsored noopener"`.
3. Every blank value is marked unverified and linked to a flag. Nothing is inferred.
4. Internal links resolve. The only script allowed is `assets/counterwise.js`. The client must not write cookies or browser storage, and no analytics endpoint may be configured in a page.

## Not built or not verified (see Flagged for Review)

- Analytics endpoint and hosting (FLG-06). Five events to be confirmed (FLG-05).
- Special Link test in an Associates account (FLG-04). Scaling is blocked until it passes.
- Commission rates and prices (FLG-07, FLG-08).
- Intended ASINs and tracking-ID validity (FLG-01, FLG-03). Redirect compliance (FLG-02).
- Search Console verification (FLG-13).

## Official sources (accessed 2026-11-20)

- Amazon Associates Program Operating Agreement: https://affiliate-program.amazon.com/help/operating/agreement (updated Oct 15, 2025)
- Amazon Associates Program Policies: https://affiliate-program.amazon.com/help/operating/policies (updated Apr 14, 2026)
- FTC Disclosures 101 for Social Media Influencers: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers (Nov 2019)
- 16 CFR 255.0 (Endorsement Guides): https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.0
- Google, qualify outbound links (rel="sponsored"): https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- GitHub Docs, publishing sources for GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Publishing

Pages serves `main` `/` (legacy). Pushes to `main` run `.github/workflows/pages.yml`, which rebuilds and validates the site. To change content, edit `data/` or `scripts/`, run `python3 scripts/build.py`, and commit the generated files with the change.
