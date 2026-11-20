# Counterwise

A publication-style kitchen buying guide site, with question-led editorial content, prominent Amazon Associates disclosure, an evidence register, open decision questions, and explicit review gates.

## What’s on the site

- **Front page** (`index.html`) — publication-style landing page: buyer’s notebook guides, category navigation (air fryers, kitchen appliances), reader capture, disclosure strip above the fold and in the footer.
- **Guides** (`guides/`) — four question-shaped buying guides: basket vs oven air fryer, capacity checklist, cleanup and counter space, multi-function appliances. Each carries an author byline and editorial note.
- **Category dashboards** (`guides/category/`) — air fryers and kitchen appliances category pages organizing the guides by topic.
- **Evidence & review** (`review/index.html`) — executive summary, product evidence register (intended ASIN / official listing URL / confirmation date / observed redirect target, intent and destination kept as separate fields), questions-answers-missing-evidence table, suggestions for review (not automatic changes), empty campaign ledger, measurement status, disclosure & policy gates, sources, and a flagged-for-review list.
- **SEO artifacts** — `sitemap.xml` and `feed.xml` (RSS).
- **Analytics** — `assets/counterwise.js`, a privacy-preserving, self-hosted first-party event client implementing the five defined events (`page_view`, `outbound_click`, `guide_engaged`, `disclosure_view`, `affiliate_conversion_reported`). The last is entered only from a dated authorized Associates report, never inferred. Endpoint URL is configurable; in review mode (no endpoint) events log to console only.

## Preview locally

Open `index.html` directly, or run a static server from the repository root, for example `python3 -m http.server 8000`.

## Publish with GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the repository root when pushed to `main`. Enable GitHub Pages in repository settings using GitHub Actions. The checked-in canonical and sitemap URLs assume `https://sassnarep3-star.github.io/WinB/`; confirm that value against the actual Pages configuration before launch.

## Evidence and safety boundary

The five submitted Amazon short links and tracking ID `shopnow047c-20` are recorded in `review/index.html`. The short links have not been resolved or validated; blank product fields are intentionally blank and flagged unverified. Product identities, specifications, prices, reviews, commissions, demand, and sales are not claimed. No live analytics or conversion integration is configured. See the review page for official policy references, missing-information discovery steps, and flagged items.

## Official sources referenced (verified live)

- Amazon Associates Program Operating Agreement: https://affiliate-program.amazon.com/help/operating/agreement (updated Oct 15, 2025)
- Amazon Associates Program Policies: https://affiliate-program.amazon.com/help/operating/policies (updated Apr 14, 2026)
- FTC Endorsement Guides: What People Are Asking: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- FTC Disclosures 101 for Social Media Influencers: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers (Nov 2019)

## Verification register (added by session 7feafaa3)

The five supplied Amazon links are also documented in a generated register at
[`register/`](register/index.html): products with observed ASINs, a product-intent
confirmation record, a policy compliance gate, findings, open questions,
ten decisions for the owner (Suggestions, none implemented), guide ideas, an empty
campaign ledger, sources, and the Flagged for Review page.

- Source data lives in `data/*.json`. Edit only those files.
- `python3 scripts/build_site.py` regenerates `register/` and `sitemap.xml` (every HTML page in the repository).
- `python3 scripts/check_site.py` checks data rules, the disclosure above the navigation and in the footer, `rel="sponsored"` on Amazon links, allow-listed external hosts, internal links and anchors, a source link on every table row, and the sitemap.
- `.github/workflows/site.yml` runs both on every pull request and fails if `register/` or `sitemap.xml` is stale.

Do not hand-edit `register/` or `sitemap.xml`.
