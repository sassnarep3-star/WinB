# COORDINATION.md — Shared Task Board

This is the shared task board for the **WinB Amazon Affiliate platform** build.
Multiple agent sessions may work in this repo; each claims a task here before
starting, works only within its claimed file scope, and records sources and
verification when done.

**Current session:** `session-integration-winb` (branch `arena/aa965a41-winb`)
This session is the **integration session**: it performs the full build, verifies
the combined data line by line, confirms the site builds with no broken links,
and publishes to GitHub Pages. No other session is active in this checkout, so
no conflicts are expected; this board is maintained to satisfy the coordination
protocol and to record provenance.

**Status legend:** `unclaimed` · `in progress` · `needs review` · `done`
A `needs review` item is published on the Flagged for Review page and does not
block anything.

## Task board

| # | Task | Status | Session | File scope | Sources / verification |
|---|------|--------|---------|------------|------------------------|
| T01 | Coordination board + repo scaffold | done | session-integration-winb | `COORDINATION.md`, `.gitignore`, `.nojekyll`, `.github/workflows/*` | — |
| T02 | Verify the 5 submitted affiliate links against official Amazon listings | done | session-integration-winb | `docs/js/data.js` | Each `link.amazon/<token>` resolved live on 2026-11-20 by following the redirect to the official `amazon.com/dp/<ASIN>` page; ASIN, title, brand and category read from the official listing title/breadcrumb. Source links recorded per row. |
| T03 | Executive summary | done | session-integration-winb | `docs/about.html` | Synthesis of verified product register + compliance sources. |
| T04 | Product register (verified table, by category) | done | session-integration-winb | `docs/products.html`, `docs/js/data.js` | Every row links to the official Amazon listing. Price/rating left blank + flagged (not cleanly isolated in automated fetch). |
| T05 | Analysis & findings (pricing, competition, commission, category) | done | session-integration-winb | `docs/analysis.html` | Category structure from official Amazon breadcrumbs; commission basis per Associates Operating Agreement (cited, not quoted from memory). |
| T06 | Articles & buying guides (publication content) | done | session-integration-winb | `docs/articles.html`, `docs/buying-guides.html` | Question-shaped guides; product links marked sponsored. |
| T07 | Campaign dashboard + event ledger | done | session-integration-winb | `docs/dashboard.html` | Empty-but-defined ledger; no conversion score or revenue forecast presented. |
| T08 | Suggestions + open questions (decision framework) | done | session-integration-winb | `docs/suggestions.html` | Suggestions feed into the design prompt; questions/info/answers listed. |
| T09 | Flagged for Review page | done | session-integration-winb | `docs/flagged.html` | Irregularities + unverified items, with source links. |
| T10 | Compliance & disclosures | done | session-integration-winb | `docs/compliance.html` | Associates Operating Agreement §5 disclosure; FTC 16 CFR Part 255. Official URLs provided for manual review. |
| T11 | Landing page (publication front page) | done | session-integration-winb | `docs/index.html` | Leads with products/content, not the verification process. |
| T12 | Design system (CSS/JS, nav, footer, disclosure strip) | done | session-integration-winb | `docs/css/style.css`, `docs/js/app.js` | Disclosure strip under masthead + in footer on every page. |
| T13 | SEO: sitemap, robots, manifest, canonical | done | session-integration-winb | `docs/sitemap.xml`, `docs/robots.txt`, `docs/site.webmanifest` | One site to index. |
| T14 | Final integration: verify build + broken links, PR, merge, Pages deploy | in progress | session-integration-winb | whole repo | See "Integration record" below. |

## Product-intent confirmation record

Per the brief, intent and observation are **not** the same fact and are kept in
**separate fields that are never merged**.

- `observed_redirect_target` — measured by following each submitted link on
  2026-11-20. Populated.
- `intended_asin`, `intended_listing_url`, `confirmation_date`,
  `intended_source` — **blank** for all five. A 9-character `link.amazon`
  token is not itself an ASIN (Amazon defines an ASIN as 10 characters), and
  nothing public binds a short token to a product without the redirect. These
  fields are filled only when the owner confirms the intended product.

> Note (FLG-003): The supplied short links are **not** claimed invalid. Their
> exact compliance status as Amazon "Special Links" is unresolved and is flagged
> for review rather than asserted.

## Sources (official, for manual review)

- Amazon Associates Program Operating Agreement — https://affiliate-program.amazon.com/help/operating/agreement (§5 Identifying Yourself as an Associate; §2 Compliance Requirements)
- Amazon Associates Program Policies — https://affiliate-program.amazon.com/help/program-policies
- Amazon Associates Central — https://affiliate-program.amazon.com/
- FTC Endorsement Guides, 16 CFR Part 255 — https://www.ftc.gov/legal-library/browse/rules/endorsement-guides
- Official product listings (verified live 2026-11-20):
  - B04G1MEwY → https://www.amazon.com/dp/B0CDY277D3
  - B02NbDxp3 → https://www.amazon.com/dp/B09B7SB46R
  - B00hJ57DV → https://www.amazon.com/dp/B08DKYBTPH
  - B0c8moW59 → https://www.amazon.com/dp/B0DHZTCNR5
  - B0f3GKalj → https://www.amazon.com/dp/B0DZFD6R9Z

## Integration record

- Branch: `arena/aa965a41-winb` (base `5f6507970773a933d616aed64ea4b150c7db9f7a` of `main`)
- Build gate: static site, no build step; `/docs` is the GitHub Pages source (`.nojekyll` present so files are served as-is).
- JS syntax: `data.js` and `app.js` pass `node --check`.
- Link check: all 10 HTML pages checked — every internal `href`/`src` resolves to an existing file (0 broken); every page has the disclosure strip, footer disclosure and the Associates statement; 3 JPEGs validated; sitemap covers all 10 pages; robots.txt references the sitemap.
- Local serve smoke test: all 10 pages + CSS/JS/images/sitemap/robots/manifest return HTTP 200.
- Product verification: each `link.amazon/<token>` resolved live on 2026-11-20 to the official `amazon.com/dp/<ASIN>` page; ASIN is 10 chars, official URL ends with the observed ASIN, submitted token is 9 chars.
- PR: recorded here after creation.
- Merge result + Pages deploy: recorded here after merge.
