# Coordination board

Shared task board for parallel agent sessions working on this repository.
Claim a task by writing your session ID and file scope into the table, then
commit and push the claim immediately. Never start a task another session has
claimed. Keep scopes non-overlapping. Shared outputs (the data layer, the site
index and navigation) are changed only by the final integration session.

## Task board

| Task | Status | Owner session | Scope |
|---|---|---|---|
| Publication-style static site, evidence/decision pages, SEO artifacts, Pages workflow | done | `arena/13033d4a-winb` | `index.html`, `styles.css`, `guides/`, `review/`, `data/`, `feed.xml`, `sitemap.xml`, `.github/workflows/pages.yml`, `COORDINATION.md` |
| Data layer: verified product, competition, article, question, suggestion, flag, source and campaign records | done | `arena/5a13d04d-winb` | `data/*.json` |
| Build pipeline: deterministic generator for every page plus sitemap, feed and robots | done | `arena/5a13d04d-winb` | `tools/build.mjs` |
| Release gate: disclosure, sponsored-link, source-attribution, link and sitemap verification | done | `arena/5a13d04d-winb` | `tools/verify.mjs` |
| Workbench dashboard: overview, products, competition, content, links, campaigns, compliance | done | `arena/5a13d04d-winb` | `dashboard/*.html` (generated) |
| Review section: evidence register, open questions, suggestions board, flagged for review, source index | done | `arena/5a13d04d-winb` | `review/*.html` (generated) |
| Category hubs, guides cluster and executive summary | done | `arena/5a13d04d-winb` | `guides/`, `air-fryers/`, `thermometers/`, `summary/` (generated) |
| Editorial design system and responsive layout | done | `arena/5a13d04d-winb` | `styles.css` |
| Integration: merge, re-verify the combined data, confirm the build has no broken links, publish to GitHub Pages, open the pull request | in progress | `arena/5a13d04d-winb` | whole repository |

No other session holds a claim. The only prior claim was completed and merged
into `main` in commit `d1d9c0b`.

## Session log

- 2026-11-20 — `arena/13033d4a-winb` claimed the initial site build scope and
  published a first publication-style prototype with four question-shaped guides
  and an evidence register. Merged into `main` as `d1d9c0b`.
- 2026-11-20 — `arena/5a13d04d-winb` started from `d1d9c0b`, reviewed the whole
  repository line by line, and re-planned the scope. Claimed the data layer,
  build pipeline, release gate, dashboard, review section, category hubs,
  guides cluster, executive summary and design system. The previous session's
  claim was found to be complete and its work was merged, so no file was taken
  from it while it was still in flight.

### Verification performed in this session

Every fact was read from a primary source on 2026-11-20. Nothing was inferred.

| What | How it was verified | Result |
|---|---|---|
| The five submitted short links | HTTP redirect resolution of each `link.amazon/<token>` URL, then a direct read of the Amazon listing it resolved to | All five resolve to a live Amazon product listing. Resolved ASINs: `B0CDY277D3`, `B09B7SB46R`, `B08DKYBTPH`, `B0DHZTCNR5`, `B0DZFD6R9Z`. |
| Product title, price, rating, review count, availability, seller, stated specifications | Direct read of each Amazon listing page | Recorded per product with the date of observation. The ThermoMaven listing additionally shows an Amazon's Choice badge, a "5K+ bought in past month" badge, a $22.99 list price against $16.99, and a ClimeCo Certified sustainability feature. |
| Alternative listings | The "Customers who viewed this item also viewed" module on each subject listing | 15 rows captured with price, rating, review count and listing link. |
| Associates Program Operating Agreement | Opened directly | Live. The page states "Updated: October 15, 2025". Section 1 confirms that links must use the Special Link tagged formats. |
| Associates Program Policies | Opened directly | Live. The page states "Updated: April 14, 2026". Confirms the Associate ID parameter rule, the rule that Special Links link to Products, and the prohibition on associating a sub-tag or reporting with a specific end user. |
| Participation Requirements | Reached from the Program Policies page | Live. |
| Application FAQ | Reached from the Program Policies navigation | Live. Confirms the `XXXXX-##` Associate ID format and the site identification requirement. |
| PA-API 5 status | The Product Advertising API 5 documentation URL now resolves to the deprecation notice | PA-API 5 is deprecated, returns HTTP 403 with `AccessDeniedException`, and the Creators API is the supported successor. Recorded as FLG-011. |
| FTC endorsement guidance | Opened directly | Live. Confirms the clear-and-conspicuous disclosure principle and that an endorsement cannot carry a claim the marketer could not legally make. |
| 16 CFR Part 255 and FTC Disclosures 101 | Reached from the FTC page | Live. |
| Site host | GitHub Pages API for this repository | Status `built`, `public: true`, source branch `main`, path `/`. |

### Irregularities flagged for review

All 14 are published on the site's **Flagged for review** page with the source
and the resolution path. None blocks the merge or the deploy.

| ID | Severity | Item |
|---|---|---|
| FLG-001 | Medium | The five submitted tokens are 9 characters and do not match the 10-character ASIN format, so intent cannot be read from them. |
| FLG-002 | Medium | Disclosure wording and endorsement context have not been reviewed by a qualified reviewer. |
| FLG-003 | High | No `tag=` parameter was observed in the resolved short-link URLs. This is an observation about the redirect, not a finding that the links are invalid; their compliance status is unresolved. |
| FLG-004 | High | Eligibility and commission rate for the five ASINs are unknown; the account Commission Income Statement has not been read. |
| FLG-005 | Low | The ThermoMaven listing is sold by a third-party storefront, ThermoMaven-US, which carries an "Earns Commissions" badge. |
| FLG-006 | Medium | Full specifications, dimensions, clearance and care instructions have not been read from manufacturer documentation. |
| FLG-007 | Low | Prices, ratings and review counts are point-in-time observations with no price history behind them. |
| FLG-008 | High | No revenue, commission or conversion figure exists for this site. |
| FLG-009 | Medium | No analytics endpoint, Search Console property or reader feedback loop exists. |
| FLG-010 | Low | Working titles are editorial hypotheses, not measured demand. |
| FLG-011 | Medium | The Product Advertising API 5.0 is deprecated; the Creators API is the supported successor. |
| FLG-012 | Low | No product photography is published, and the image rules have not been read. |
| FLG-013 | Low | The canonical host is derived from the repository name and must be confirmed. |
| FLG-014 | Low | No product-specific performance claim has been made, because nothing was tested. |

### Limits of this build

- The supplied short links are recorded, not published. The site publishes the
  canonical Special Link form instead. The two are kept in separate columns and
  are never merged.
- The campaign ledger is empty by design and the verifier fails the build if it
  stops being empty before an authorised report exists.
- GitHub Pages serves static files. A durable first-party event collector
  requires separate hosting and a published privacy notice, so no analytics
  endpoint was fabricated.
- No commission rate, click count, order, earnings figure, revenue forecast,
  search volume or popularity claim appears anywhere on the site.
