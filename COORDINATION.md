# COORDINATION — shared task board

Repo: `sassnarep3-star/WinB` · Branch for this session: `arena/4b09b79a-winb` (base `5f65079` on `main`)

Session rule applied: this session works on one branch only (`arena/4b09b79a-winb`). The
`session-<id>/<task>` branch scheme in the original brief is not used because the session
instructions fix the working branch. No other session has claimed any task (this file did not
exist before this session).

Status values: `unclaimed` · `in progress` · `done` · `needs review`
(`needs review` = published on the Flagged for Review page; it does not block anything.)

## Task board

| ID | Task | Status | Owner (session) | File scope | Notes |
|----|------|--------|-----------------|------------|-------|
| T-01 | Repo review + irregularity log | done | arena/4b09b79a-winb | `COORDINATION.md`, `data/flagged.json` | See FLG-010 |
| T-02 | Product intent confirmation records (5 links) | done (flags open) | arena/4b09b79a-winb | `data/products.json` | Intended ASIN not confirmable → blank (FLG-001/002) |
| T-03 | Verification register (policy + FTC + GitHub sources) | done | arena/4b09b79a-winb | `data/verification.json` | Every row has an official source link |
| T-04 | Disclosure + compliance gate | done | arena/4b09b79a-winb | `build/`, `scripts/check_site.py`, `.github/workflows/pages.yml` | Gate runs in CI before deploy |
| T-05 | Site build: landing, category subpages, guides, dashboards | done | arena/4b09b79a-winb | `build/`, `data/`, `content/` | Static, stdlib Python, no npm deps |
| T-06 | Measurement: outbound-click + analytics endpoint (client side) | needs review | arena/4b09b79a-winb | `build/assets/analytics.js`, `data/config.json` | No endpoint deployed (FLG-007) |
| T-07 | Campaign ledger (empty, provenance trail) | done | arena/4b09b79a-winb | `data/campaign_ledger.csv` | Intentionally empty |
| T-08 | Publishing: RSS feed, sitemap, robots, Search Console prep | done (Search Console submission needs owner) | arena/4b09b79a-winb | build output | FLG-008 |
| T-09 | Suggestions, open questions, executive summary pages | done | arena/4b09b79a-winb | `data/suggestions.json`, `data/questions.json`, `content/plan/` | Suggestions are NOT implemented until a path is chosen |
| T-10 | Integration: build, link check, PR to main, merge, Pages deploy | in progress | arena/4b09b79a-winb | all | Final step |

## Claims log

- 2026-11-20 · arena/4b09b79a-winb · claimed T-01..T-10 (single-session run; no conflicts observed).

## Source-verification log (per task)

Each entry records what was checked, when, and the sources. Dates = the session date (2026-11-20, UTC).

- **T-02 product links.** Fetched each supplied `https://link.amazon/<token>` link (redirect followed).
  Final URLs were `https://www.amazon.com/dp/<ASIN>?...` pages. Titles, breadcrumbs and ASINs read from those pages.
  Sources: see `data/products.json` (`source_url` per row).
- **T-03 policy register.** Read Associates Program Operating Agreement (Updated Oct 15, 2025),
  Associates Program Policies (Updated Apr 14, 2026), FTC "Disclosures 101 for Social Media Influencers" (Nov 2019),
  GitHub Pages publishing-source docs, and `actions/deploy-pages` README (usage: `actions/deploy-pages@v4`).
- **Not verified (blocked):** commission-rate schedule (requires Associates sign-in; see FLG-005),
  Amazon's own ASIN definition page (not located; see FLG-001), Special Link tests and tracking reports (no account access; FLG-003).

## Irregularities (summary; full list in `data/flagged.json` and on the Flagged for Review page)

- FLG-001 · Link path tokens are 9 characters; observed ASINs are 10 characters. Intended ASIN left blank.
- FLG-002 · Each short link redirects to an ASIN that differs from its token.
- FLG-003 · Compliance status of the supplied short links is unresolved (FLG-003 per brief). Not claimed invalid.
- FLG-004 · Tracking ID `shopnow047c-20` does not match the `XXXXX-##` example in the policy text; enrollment unconfirmed.

## Handoffs

None.

## Integration (T-10)

- PR: _to be recorded after creation_
- Merge result: _to be recorded after merge_
- Pages deploy: _to be recorded after deploy_
