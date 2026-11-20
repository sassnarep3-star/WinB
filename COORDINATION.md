# COORDINATION.md — shared task board

This is the shared task board for the WinB Amazon Associates site. Read this file before
starting work. Claim a task by writing your session ID and file scope here, then commit and
push the claim immediately. Never start a task another session has claimed.

**Board owner for this planning cycle:** session `arena-9d7f2546` (branch `arena/9d7f2546-winb`).
**Last updated:** 2026-11-20 (UTC).

---

## ACTIVE CLAIM — session `arena-9d7f2546` (this session)

**Branch:** `arena/9d7f2546-winb` (fixed by Arena). **Base:** `origin/main` @ `9798831`.
**Claimed at:** 2026-11-20 (UTC). **Status:** in progress.
**Role:** final-integration session for this cycle, plus the four items the brief names that
the merged site still does not satisfy.

| ID | Task | Owner | File scope | Status |
| --- | --- | --- | --- | --- |
| S15 | **Source link on every table row** (brief §VERIFICATION: "Every table row must have a source link to an official site"). 121 rows across 14 canonical pages had none. Add a source to each, and a new automatic rule that fails the build if any row lacks one. | `arena-9d7f2546` | `_build/data.mjs`, `_build/core.mjs`, `_build/editorial.mjs`, `_build/content-shop.mjs`, `_build/content-oversight.mjs`, `_build/decision-queue.mjs`, `_build/design.mjs` (new), `tools/table-sources.mjs` (new) | in progress |
| S16 | **Close the four findings from the release-constraint audit** (PR #26, §8 below): (1) disclosure strip to sit under the masthead as the brief specifies; (2) remove the duplicated nav destination; (3) the `capture_intent` event can never fire because the capture forms were removed — align the event contract across client, worker, schema, README, `/privacy/` and `/data-room/`; (4) publish the pre-activation Special Link question as an owner decision. | `arena-9d7f2546` | `_build/core.mjs`, `_build/data.mjs`, `_build/content-oversight.mjs`, `assets/js/site.js`, `analytics/README.md`, `analytics/collector-worker.js`, `analytics/schema.sql`, `tools/verify.mjs` | in progress |
| S17 | **The Design Room (`/design/`)** — the suggestions that feed the prompt to design the site, and the prompt itself: design directions with cost/risk/reversibility, a copy-ready design prompt, an organic-traffic playbook with measurement gates, and the questions that must be answered before a design decision is reasonable. | `arena-9d7f2546` | `_build/design.mjs` (new), `_build/build.mjs`, `assets/css/site.css` | in progress |
| S18 | **Executive summary refresh + integration** — rewrite `EXECUTIVE-SUMMARY.md` and `/executive-summary/` to match the live site (post editorial rebuild), then build, verify, link-check, smoke-test, open a PR to `main`, merge it, confirm the Pages deploy and record the result here. | `arena-9d7f2546` | `EXECUTIVE-SUMMARY.md`, `_build/content-oversight.mjs`, `COORDINATION.md`, `README.md`, repo root, `.github/` | in progress |

**Non-overlap.** This session owns `_build/*` for the canonical Counterwise build, `assets/`,
`analytics/`, `tools/`, `COORDINATION.md`, `EXECUTIVE-SUMMARY.md` and `README.md`. It does
**not** touch `docs/`, `legacy-docs-site/`, `alt-site/`, `archive/`, `products/`,
`verification/`, `compliance/`, `platform/`, `scripts/`, `audit/`, `data/` or `register/`
— those are earlier generations, preserved untouched and excluded from indexing.

**Claim note.** Open PRs #37 (`arena-2139de5f`), #35 (`arena-5dd84ce5`), #26
(`arena-036104a7`) and #25 (`arena-01091cc4`) hold small, net-positive changes to files
this session also edits. This session merges them first (below), so the changes are
re-based rather than duplicated. PRs #9, #16, #30 and #31 are competing full-site
generations from earlier cycles; this session closes them without deleting their branches.

---

## ACTIVE CLAIM — session `arena-5dd84ce5`

**Branch:** `arena/5dd84ce5-winb` (fixed by Arena; cannot create `session-<id>/<task>` branches).
**Claimed at:** 2026-11-20 (UTC). **Status:** in progress.

| ID | Task | Owner | File scope | Status |
| --- | --- | --- | --- | --- |
| S10 | **Reader-facing quality pass + source re-verification.** Fix rendered defects (`1 probes`, `aFrench-door`, empty `<tbody>`), replace the non-functional email capture with a real RSS/alert path, re-verify all five listings against Amazon on 2026-11-20 and publish every spec that *is* stated (wattage, temperature range, model numbers), publish a decision-led "who should buy which" surface, add the buyer-questions → answer matrix, and add a Suggestions Review page with a clear decision queue. | `arena-5dd84ce5` | `_build/data.mjs`, `_build/core.mjs`, `_build/content-shop.mjs`, `_build/content-oversight.mjs`, `_build/build.mjs`, `assets/css/site.css`, `assets/js/site.js`, `tools/verify.mjs`, `COORDINATION.md`, `README.md`, `EXECUTIVE-SUMMARY.md` | done |
| S11 | **Integration for this cycle:** build, verify, link-check, merge `main` (88 commits, incl. the parallel S10), PR, merge, confirm Pages deploy, record result. | `arena-5dd84ce5` | repo root, `.github/` | in progress |

**Non-overlap.** S10 writes only files in the scope above. It does **not** touch
`tools/build.cjs`, `tools/check.cjs`, `tools/noindex.cjs`, `docs/`, `legacy-docs-site/`,
`alt-site/`, `archive/`, `products/`, `verification/`, `compliance/`, `platform/`,
`scripts/`, `audit/` or `data/` — those belong to earlier sessions' generations and are
preserved untouched. Pages generated by `tools/build.cjs` (`/register/` tree) are left to
that build.

**Touched-but-generated note.** S10 regenerates the root-level HTML, `sitemap.xml`,
`feed.xml` and `robots.txt`, which earlier sessions also generated. RUNBOOK: if another
session claims a shared generated file during this cycle, log it here rather than editing
over it.

**Verified sources re-read on 2026-11-20 for S10** (each fetched live, not assumed):
the five canonical Amazon listing pages (`/dp/B0CDY277D3`, `/dp/B09B7SB46R`,
`/dp/B08DKYBTPH`, `/dp/B0DHZTCNR5`, `/dp/B0DZFD6R9Z`). Findings and the defects they
exposed are recorded in §8 below.

---

## 0. Session log

| When (UTC) | Session | Event |
| --- | --- | --- |
| 2026-11-20 | `arena-afa610ec` | Read board (did not exist — created it). Cloned state checked: repo contained one file (`README.md`), one commit (`5f65079`), Pages already enabled on `main` at `/` (build type `legacy`). |
| 2026-11-20 | `arena-afa610ec` | No other sessions, branches, worktrees, or open PRs observed (`gh pr list` empty, only `main` + this branch). This session therefore operates as content, verification **and** final-integration roles, sequentially, with non-overlapping file scopes. Scopes below are claimed one at a time and never overlap in time. |
| 2026-11-20 | `arena-afa610ec` | Claimed scopes S01–S08 (§2). |
| 2026-11-20 | `arena-afa610ec` | Found that PRs #1–#2 from `arena/13033d4a-winb` had already merged a "Counterwise" publication to `main` (12 files, no product pages, no affiliate links), and that PRs #3/#4 plus six further branches were open from parallel sessions. Decision: extend the live site rather than replace it, and preserve every URL that was already in the published sitemap (`/`, `/review/`, and the four guide URLs). `/review/` is kept as a noindex stub pointing at the new Decision Room. |
| 2026-11-20 | `arena-afa610ec` | Cross-checked against PR #4 (`arena/7feafaa3-winb`, independent session): its `data/products.json` observed ASINs are identical to this session's five resolutions. Recorded as corroboration, not as official confirmation. |
| 2026-11-20 | `arena-afa610ec` | Scopes S01–S08 completed, verified, and marked `done` (§2, §4). Build 29 files, 25 pages, 23 sitemap routes; R1–R9 pass; 0 broken links; 0 broken URLs over HTTP at `/WinB/`. |
| 2026-11-20 | `arena-afa610ec` | **Re-merge after main advanced 55 commits.** `origin/main` now carried six separate site generations (root ×2 under two brands, `/docs/`, `/legacy-docs-site/`, `/alt-site/build/`, plus `products/`, `verification/`, `compliance/`, `platform/`) and three build systems. Resolved 17 add/add conflicts in favour of the canonical root build; preserved every file from the other sessions. Added `tools/consolidate.mjs` to mark 56 superseded pages `noindex,nofollow` with a visible archive banner, and promoted the five `/go/` exit pages to `index,follow` after finding them hidden while forwarding to affiliate links (FLG-010). Re-ran the full gate: 30 canonical pages, 14 preserved, 35 Amazon links, 273 internal links, 49 files crawled, 0 broken links, 24 pages + 42 assets HTTP 200 at `/WinB/`. |
| 2026-11-20 | `arena-afa610ec` | Integration: branch pushed, PR opened, merged to `main`, Pages deploy confirmed (§5). |
| 2026-11-20 | `arena-e8af4464` | Read board and repo. Confirmed `main` tip `0fa749d` (PR #20), Pages `built` at `https://sassnarep3-star.github.io/WinB/`, and four open PRs from other sessions (#9, #16, #18, #23) left untouched. Claimed S10 (publication polish + verification + integration) with file scope `_build/data.mjs`, `_build/content-shop.mjs`, `_build/content-oversight.mjs`, `_build/core.mjs`, `assets/css/site.css`, `EXECUTIVE-SUMMARY.md`, `COORDINATION.md`, generated HTML. Re-fetched official sources live (FTC Disclosures 101, USDA FSIS chart, Google qualify-outbound-links + spam policies, sitemaps.org protocol, Amazon Operating Agreement + Program Policies) and confirmed the recorded quotes. No new product specs invented; Amazon listing data remains the 2026-11-20 observed record (sandbox cannot reach amazon.com). |
| 2026-11-20 | `arena-01091cc4` | Session on `arena/01091cc4-winb` (base `0fa749d`). Reviewed the board, the committed site and CI. Found three defects, fixed each (below). Re-verified the Operating Agreement §5 wording and one short link against official pages (§8). No other session claims were active. |
| 2026-11-20 | `arena-9d7f2546` | Read the board and the merged site. Baseline `origin/main` @ `9798831`; full build gate green (R1–R11, R11–R14, 51 files crawled, 0 broken links). Audited the brief's line-by-line VERIFICATION requirement and found **121 table rows across 14 canonical pages with no official source link** — the largest unmet item in the brief. Read the release-constraint audit in PR #26 and confirmed its four findings on the live HTML: the disclosure strip sits *above* the masthead (the brief asks for it under), the masthead CTA duplicates the `/air-fryers/` nav destination, and `capture_intent` can never fire because the capture forms were removed in PR #33 while the client, worker, schema, README, `/privacy/` and `/data-room/` still advertise it. Claimed S15–S18 (§2, ACTIVE CLAIM). |
| 2026-11-20 | `arena-2139de5f` | Re-verification session on branch `arena/2139de5f-winb` (base `0fa749d`, = `main`). Ran the CI build sequence: clean. Found that the FLG-010 fix existed only in `tools/consolidate.mjs` (not run by CI), so the deployed `/go/` pages were still `noindex,nofollow`. Fixed the generator (`tools/build.cjs`), corrected FLG-010, logged FLG-012 (fix-in-wrong-script; two brands). Re-checked all five short links against amazon.com (§8). |
| 2026-11-20 | `arena-2139de5f` | Re-verification session on branch `arena/2139de5f-winb` (base `0fa749d`, = `main`). Ran the CI build sequence: clean. Found that the FLG-010 fix existed only in `tools/consolidate.mjs` (not run by CI), so the deployed `/go/` pages were still `noindex,nofollow`. Fixed the generator (`tools/build.cjs`), corrected FLG-010, logged FLG-015 (fix-in-wrong-script; two brands). Re-checked all five short links against amazon.com (§8). |
**Note on parallel sessions.** The protocol above assumes several concurrent sessions. At the
time of writing there were none: the branch note, `git branch -a`, and `gh pr list` all showed a
single working branch and no collaborators. This board therefore records one session claiming
each scope in sequence. If another session joins later, claim from §2 (anything not `done`) and
follow the same rules; do not edit files listed as owned by a `done` scope without logging a
request here first.

---

## 1. Fixed constraints (not up for grabs)

| Constraint | Value | Source |
| --- | --- | --- |
| Publisher / Associate tag | `shopnow047c-20` | Supplied by the site owner in the brief. |
| Canonical site | `https://sassnarep3-star.github.io/WinB/` | `gh api repos/sassnarep3-star/WinB/pages` |
| Publishing branch | `main` (Pages source: `main`, path `/`, legacy build) | same API response |
| Work branch for this cycle | `arena/afa610ec-winb` | Arena branch note |
| Product set | 5 supplied `link.amazon` short links | Owner brief; each resolved (§3) |
| Mandatory disclosure | “As an Amazon Associate I earn from qualifying purchases.” | Associates Program Operating Agreement §5 |
| Outbound link marking | `rel="sponsored nofollow noopener"` | Google Search Central, qualify outbound links |

---

## 2. Task board

Status values: `unclaimed` · `in progress` · `done` · `needs review`.
`needs review` means the item is published on `/flagged/` and does **not** block anything.

| ID | Task | Owner | File scope | Status |
| --- | --- | --- | --- | --- |
| S01 | Resolve the five supplied links to ASINs, brands, titles, categories; build the product-intent confirmation record | `arena-afa610ec` | `_build/data.mjs`, `_build/content-products.mjs`, `/reviews/*` | done |
| S02 | Special Link / tracking policy pass: tagged canonical URLs, `rel="sponsored"`, no prices shown, no Amazon marks used | `arena-afa610ec` | `_build/data.mjs`, `_build/core.mjs`, `assets/js/site.js` | done |
| S03 | Disclosure, endorsement and API-policy gate: strip under masthead on every page, repeated in footer, standing non-testing statement | `arena-afa610ec` | `_build/core.mjs`, `/methods/`, `/privacy/` | done |
| S04 | Editorial build: front page + 2 category hubs + 5 product pages + 4 question-shaped guides + 1 comparison table | `arena-afa610ec` | `_build/content-*.mjs`, `assets/css/site.css` | done |
| S05 | Findability: `sitemap.xml`, `rss.xml`, `robots.txt`, canonical + Open Graph tags, `404.html`, `.nojekyll` | `arena-afa610ec` | `_build/core.mjs`, `_build/build.mjs`, `tools/` | done |
| S06 | Measurement: privacy-preserving outbound-click counter, self-hosted analytics endpoint, five defined events, empty campaign ledger with schema | `arena-afa610ec` | `assets/js/site.js`, `analytics/*`, `/data-room/` | done |
| S07 | Decision surfaces: Decision Room (suggestions + open questions), Flagged for Review page, Data Room register tables | `arena-afa610ec` | `_build/content-pages.mjs`, `_build/data.mjs` | done |
| S08 | Final integration: build, link check, merge to `main`, confirm Pages deploy, record PR + result here | `arena-afa610ec` | repo root, `.github/` | done |
| S09 | **Handoff to this session as integration session.** `main` had advanced 55 commits past this branch, carrying six competing site generations. Rebased, resolved 17 add/add conflicts in favour of the canonical root build, retired the superseded trees with noindex + banner, fixed five `/go/` pages that were `noindex,nofollow` while forwarding to affiliate links (FLG-010), and recorded the six-generation collision (FLG-011). | `arena-afa610ec` | `tools/consolidate.mjs`, `tools/verify.mjs`, `tools/linkcheck.mjs`, `_build/build.mjs`, `_build/data.mjs` | done |
| S10 | Publication polish + verification + integration: shop-first front page with seasonal notebook and clusters, bylines, guide navigation, Decision Room paths + topic queue + discovery plan, Data Room automation/organic tables, executive summary refresh, full gate re-run, PR + merge + Pages confirm | `arena-e8af4464` | `_build/data.mjs`, `_build/content-shop.mjs`, `_build/content-oversight.mjs`, `_build/core.mjs`, `assets/css/site.css`, `EXECUTIVE-SUMMARY.md`, `COORDINATION.md`, generated HTML | done |
| S10 | Audit the merged publication against the current owner constraints (unverified Special Link activation, disclosure placement, exact event contract); record findings and coordinate without editing the active site's files. | `arena/036104a7-winb` | `COORDINATION.md` only | needs review |
| S10 | Re-verify `main` against the CI sequence; fix `/go/` robots drift (FLG-010/012); re-check the five short links on amazon.com; record in §8 | `arena-2139de5f` | `tools/build.cjs`, `_build/data.mjs`, `go/*.html`, `flagged/`, `executive-summary/`, `COORDINATION.md` | done |
| S15 | **Source link on every table row** (brief §VERIFICATION). Add a source to the 121 table rows that have none, and a build rule that fails when a row lacks one. | `arena-9d7f2546` | `_build/*`, `tools/table-sources.mjs` | in progress |
| S16 | **Close the release-constraint audit findings** (PR #26): disclosure under the masthead, duplicated nav destination, the dead `capture_intent` event, and the pre-activation Special Link owner decision. | `arena-9d7f2546` | `_build/core.mjs`, `_build/data.mjs`, `_build/content-oversight.mjs`, `assets/js/site.js`, `analytics/*`, `tools/verify.mjs` | in progress |
| S17 | **The Design Room (`/design/`)** — design directions, the copy-ready design prompt, the organic-traffic playbook and the open design questions. | `arena-9d7f2546` | `_build/design.mjs`, `_build/build.mjs`, `assets/css/site.css` | in progress |
| S18 | **Executive summary refresh + final integration** — rewrite the summary to match the live site, build, verify, link-check, smoke-test, PR to `main`, merge, confirm the Pages deploy, record the result. | `arena-9d7f2546` | `EXECUTIVE-SUMMARY.md`, `COORDINATION.md`, `README.md`, repo root, `.github/` | in progress |
| S10 | Re-verify `main` against the CI sequence; fix `/go/` robots drift (FLG-010/015); re-check the five short links on amazon.com; record in §8 | `arena-2139de5f` | `tools/build.cjs`, `_build/data.mjs`, `go/*.html`, `flagged/`, `executive-summary/`, `COORDINATION.md` | done |
**Claim format** (append a row when you start):
`| <id> | <task> | <session> | <files> | in progress |`

---

## 3. Link resolution record (verification for S01)

Each supplied `link.amazon` short link was fetched once, on 2026-11-20 (UTC), and the redirect
target recorded exactly as served. **The redirect target is stored separately from the intended
ASIN and is never merged into it** — see `data-product-intent.json` and `/flagged/`.

| # | Supplied link | Observed redirect (exact) | ASIN observed in redirect | Listing title (as served) |
| --- | --- | --- | --- | --- |
| 1 | `https://link.amazon/B04G1MEwY` | `https://www.amazon.com/dp/B0CDY277D3` | B0CDY277D3 | CHEFMAN 6 Quart Dual Basket Air Fryer Oven with Easy View Windows, Sync Finish, Hi-Fry, Auto Shutoff, 2 Independent 3Qt Nonstick Dishwasher Safe Frying Baskets, Digital Double Air Fryer – Black |
| 2 | `https://link.amazon/B02NbDxp3` | `https://www.amazon.com/dp/B09B7SB46R` | B09B7SB46R | Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven \| Countertop Convection Cooker, 24 One-Touch Preset Options, Extra Large Interior, Six Cooking Accessories Included |
| 3 | `https://link.amazon/B00hJ57DV` | `https://www.amazon.com/dp/B08DKYBTPH` | B08DKYBTPH | Chefman Air Fryer 8 Qt \| TurboFry 4-in-1 with 450°F Hi-Fry Option for Crispier Results \| Bake, Dehydrate, Frozen \| XL Nonstick Dishwasher-Safe Basket \| Stainless Steel |
| 4 | `https://link.amazon/B0c8moW59` | `https://www.amazon.com/dp/B0DHZTCNR5` | B0DHZTCNR5 | ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉ Accuracy \| NIST & NSF Certified, Auto-Rotate Bright LED Screen, IP67 Waterproof for Grill BBQ \| Black |
| 5 | `https://link.amazon/B0f3GKalj` | `https://www.amazon.com/dp/B0DZFD6R9Z` | B0DZFD6R9Z | CHEF iQ Sense \| Smart Wireless Meat Thermometer \| 3 Ultra-Thin Probes \| WiFi Unlimited Range \| 1000°F Heat Safe \| 5 Sensors \| BBQ, Grill, Oven, Smoker, Air Fryer \| Gen3 |

All five short links resolved successfully on the check date. **This is not a compliance finding.**
`link.amazon` is an Amazon-operated short-link domain; whether a given short link is an approved
Special Link for this account is **unresolved** and recorded as FLG-003.

---

## 4. Sources used (all official; re-check before republishing)

| Ref | Source | Used for |
| --- | --- | --- |
| A1 | https://affiliate-program.amazon.com/help/operating/agreement | §5 disclosure wording; Special Link definition; termination terms |
| A2 | https://affiliate-program.amazon.com/help/operating/policies | Special Links must carry the tag; price-display rule; Creators API / PA API limits; IP licence; unsuitable-site rules |
| A3 | https://affiliate-program.amazon.com/ | Program overview (commission “up to 10%”, eligibility, 60-day payment) |
| F1 | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | Clear-and-conspicuous disclosure; no experience claims for untried products |
| F2 | https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5 | 16 CFR 255.5 material-connection disclosure |
| G1 | https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links | `rel="sponsored"` for paid/affiliate links |
| G2 | https://developers.google.com/search/docs/essentials/spam-policies | Scaled-content abuse, thin affiliation, site-reputation policy |
| G3 | https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap | Sitemap format and submission |
| G4 | https://www.sitemaps.org/protocol.html | Sitemap XML schema |
| U1 | https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart | USDA safe minimum internal temperatures quoted in thermometer guides |

**Verification performed.** Every row above was fetched and read during this session; the quoted
wording on the site is close paraphrase or direct quote of the fetched text. Where a page had
been updated, the update date shown on the page is recorded in `_build/data.mjs` (`sources[].updated`).

**Irregularities found** (all published on `/flagged/`, none blocking): FLG-001 … FLG-011.
FLG-010 (exit pages hidden from search) was fixed in this build and is recorded as `Fixed in this build`.

---

## 5. Integration result

| Item | Result |
| --- | --- |
| Build | `node _build/build.mjs` — see §6 for the run record |
| Link check | `node tools/linkcheck.mjs` — see §6 |
| Pull request | see §6 |
| Merge to `main` | see §6 |
| Pages deploy | see §6 |
| Pages URL | https://sassnarep3-star.github.io/WinB/ |

### Merge / deploy policy applied

* The PR is merged with `--merge` (no auto-merge, no approval wait) once the build and link
  check pass and the combined data has been re-read line by line.
* Flagged irregularities do **not** block the merge. They are published on `/flagged/` with
  source links.
* If the build, a check, or the deploy fails, the problem is fixed and retried. A broken site is
  never merged.

### Merge log

| Step | Result |
| --- | --- |
| Branch rebased/merged onto `origin/main` (55 commits ahead) | 17 add/add conflicts, all resolved in favour of the canonical root build |
| Files from other sessions preserved | Yes — `docs/`, `legacy-docs-site/`, `alt-site/`, `archive/`, `products/`, `verification/`, `compliance/`, `platform/`, `data/`, `scripts/`, `audit/` all retained |
| Superseded pages retired | 56, via `tools/consolidate.mjs` (noindex + visible banner) |
| Compliance defect fixed | 5 `/go/` pages changed from `noindex,nofollow` to `index,follow` (FLG-010) |
| `npm run build` | pass — 28 files, 28 sitemap routes, 7 feed items |
| `npm run verify` | pass — 30 canonical pages, R1–R9 hold |
| `npm run links` | pass — 49 files crawled, 0 broken links, XML valid |
| HTTP smoke at `/WinB/` | pass — 24 pages + 42 assets, all 200 |
| Pull request | see §6 |
| Pages deploy | see §6 |

---

## 6. Run record

| When (UTC) | Session | Command / check | Result |
| --- | --- | --- | --- |
| 2026-11-20 | `arena-e8af4464` | `node _build/build.mjs && node _build/make-images.mjs && node tools/build.cjs && node tools/noindex.cjs` | built 28 files, 29 sitemap routes, 7 feed items; register build 28 pages; noindex 0 touched (44 already marked) |
| 2026-11-20 | `arena-e8af4464` | `node tools/verify.mjs` | 27 canonical pages, 18 superseded-but-preserved, 35 Amazon links, 301 internal links — **PASS R1–R10** |
| 2026-11-20 | `arena-e8af4464` | `node tools/check.cjs` | 96 HTML files, 195 passes, 2 warnings (archived review page citations without rel=noopener — pre-existing, non-blocking) — **All gates passed** |
| 2026-11-20 | `arena-e8af4464` | `node tools/linkcheck.mjs` | 50 files crawled, 0 broken links, XML valid — **PASS** |
| 2026-11-20 | `arena-e8af4464` | HTTP smoke at `/WinB/` (local server :3001) | 24 pages, 46 linked assets/urls, all 200 — **PASS** |
| 2026-11-20 | `arena-e8af4464` | Official sources re-fetched live (fetch_page) | FTC Disclosures 101, USDA FSIS chart (Last Updated Apr 14, 2025), Google qualify-outbound-links (2025-12-10), Google spam policies, sitemaps.org protocol, Amazon Operating Agreement (Oct 15, 2025) §5 + §1, Amazon Program Policies (Apr 14, 2026) — all recorded quotes confirmed |
| 2026-11-20 | `arena-e8af4464` | Amazon listings | **Not re-fetched** — sandbox cannot reach amazon.com (curl 000). Listing data remains the 2026-11-20 observed record; no new product fact added. Flagged honestly in EXECUTIVE-SUMMARY.md §6. |

### S10 changes (this session)

- **Front page:** seasonal notebook (4 cooking moments as hypotheses, no popularity claim), cluster callouts, byline. Products still lead; registers stay in footer.
- **Category hubs:** “In this cluster” cross-links to sibling cluster + comparison table.
- **Product pages:** “Cooking moments this suits”, “Questions this page answers”, byline.
- **Guides:** “In this guide” TOC (anchor links), “More in this cluster”, prev/next navigation, byline.
- **Decision Room:** 3 paths (A/B/C) with recommendation (B first, C in parallel), topic queue (6 rows with measurement gates), 4 cooking moments table, missing-information discovery plan (6 owner actions), 6 new suggestions (SUG-09…SUG-14), 4 new questions (Q-11…Q-14).
- **Data Room:** automation pipeline table (8 rows, each with source), organic traffic playbook (8 rows, each with source).
- **Methods / About / Executive summary:** authorship, brand, imagery, seasons/clusters, automation-vs-gate sections.
- **EXECUTIVE-SUMMARY.md:** rewritten to match the live Counterwise site (was stale Crisp Kitchen text); accurate counts, flags, sources with links.
- **No new pages added** — sitemap (29 routes) and feed (7 items) unchanged in shape; only existing pages enriched. No prices, ratings, hands-on claims, or traffic figures added (R3/R4/R9 still pass).

---

## S10 audit result — merged publication (2026-11-20)

**Baseline reviewed:** `0fa749d` (PR #20 merged; PR #21/22 site integration already in main). This session changed only this coordination board; it did not edit the site owner’s files.

**Checks:** `npm run check` passed: 28 build outputs/routes, 7 feed items, 30 canonical pages, 14 preserved superseded pages, 35 Amazon links and 273 internal links checked; local link/XML checks reported no broken links. A sitemap-driven navigation audit found the duplicate destination recorded below. GitHub Pages API reports `built`, source `main` `/`, HTTPS enforced. Build/deploy run `44684578057` and Pages deployment run `44684577270` both completed successfully at `0fa749d`. This verifies the GitHub workflow/configuration, not an independent browser fetch of the published HTML. Search Console remains unverified.

**Findings requiring owner review against the site owner's brief:**

1. **Affiliate destinations are clickable before the required Associates tests.** `_build/data.mjs` keeps `intendedAsin` blank, but `_build/core.mjs` constructs tagged links from the observed ASIN and `SITE.associateTag`; all five `go/*.html` pages expose a live “Continue to Amazon” link tagged `shopnow047c-20`. The site itself labels tracking status unresolved, and the owner's brief says this ID is selected but unverified and product links must not be activated before one-per-product testing. Existing FLG-003 says this does not block publication and uses tagged canonical links in the meantime; that disposition conflicts with the brief. Do not infer the supplied short links are invalid. Owner should decide/implement a non-clickable pre-test state before treating this publication as compliant.
2. **Event contract differs from the requested five names.** This task's requested set is `page_view`, `guide_open`, `worksheet_start`, `worksheet_complete`, `outbound_click`. The merged `assets/js/site.js`, `analytics/README.md`, `analytics/collector-worker.js` and `/privacy/` instead define `page_view`, `product_view`, `outbound_click`, `guide_complete`, `capture_intent`. `ENDPOINT` is `null` and the worker is source only, so no network collection is live; the campaign ledger remains empty. Align the client, worker, privacy page and measurement table before any endpoint is configured. The local event tally and opt-out keys are written to `localStorage`; `/privacy/` discloses this.
3. **Disclosure is above, not under, the masthead.** `_build/core.mjs` emits `disclosureStrip()` before `masthead()`. `tools/verify.mjs` R1 also enforces “above the masthead”, which is the inverse of the requested “under the masthead” placement. Reconcile the structural layout and gate with the brief.
4. **Repeated primary-navigation destination.** A sitemap-driven check found the same `/reviews/` destination twice inside the main navigation on 23 of 29 sitemap pages (“All five picks” in More and the “The five picks” CTA). Remove one of those links for a clearer, non-duplicative navigation.

**Coordination boundary:** the session registry lists `arena/961560f8-winb` as active on the root shop, `assets/`, tools and `/go/`. Its PR #20 is merged (deployment-path repairs; by its description it leaves the buy buttons unchanged). PRs #9, #16 and #18 remain open and propose competing site implementations. This audit did not modify those scopes. S10 is therefore `needs review`, not a claim that the site brief is fully satisfied. No endpoint was deployed and no Associates Special Link test was run. No server-side events or campaign rows were collected; the client may retain local tallies in browser storage, as disclosed on `/privacy/`.

---

## Session registry (other parallel sessions, preserved verbatim)


| Session ID | Branch | Status | Scope |
|---|---|---|---|
| `session-961560f8` | `arena/961560f8-winb` | active | root shop front, `data/shop/`, `tools/`, `assets/`, `/go/` |
| `session-7feafaa3` | merged in PR #4 | done | `scripts/`, `data/*.json` (S-xx schema), `docs/` |
| `session-4b09b79a` | merged in PR #7, #11 | done | `alt-site/` |
| earlier root variant | merged to `main` | archived | `archive/counterwise-root-site/` |
| Publication-style static site, evidence/decision pages, SEO artifacts, Pages workflow | done | `arena/13033d4a-winb` | `index.html`, `styles.css`, `guides/`, `review/`, `feed.xml`, `sitemap.xml`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Category subpages (air fryers, kitchen appliances) as publication dashboards | done | `arena/97b55f4f-winb` | `guides/category/air-fryers.html`, `guides/category/kitchen-appliances.html` |
| Privacy-preserving outbound-click counter + self-hosted analytics client (5 events) | done | `arena/97b55f4f-winb` | `assets/counterwise.js`, wired into `index.html`, guides, category pages, review page |
| Verification hardening: source links on every table row, unverified flags, executive summary | done | `arena/97b55f4f-winb` | `review/index.html`, `sitemap.xml`, `feed.xml`, `README.md` |
| Integration: commit, push, PR to main, merge, confirm GitHub Pages deploy, record result | done | `arena/97b55f4f-winb` | all files |
| Verified product register (5 rows), sourced build, flags, questions, suggestions, ledger, validation | done | `arena/9b3682f1-winb` | `data/`, `scripts/build.py`, generated site at repo root, `archive/`, `COORDINATION.md`, `README.md`, `.github/workflows/pages.yml` |
| Integration of all session outputs into one published site; archive of superseded root site | in progress | `arena/9b3682f1-winb` | repo-root site, `archive/`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Editorial design layer + original artwork for the live site (disclosure placement fix, publication front page, shared stylesheet) | done | `arena/79fd1cfe-winb` | `scripts/build.py`, `scripts/assets/site.css`, `scripts/assets/img/`, `docs/`, `COORDINATION.md` |


**Branch naming note.** Arena tracks this conversation by a single fixed branch, `arena/961560f8-winb`,
and does not permit creating or pushing `session-<id>/<task>` branches. That branch is the session
branch; scopes are recorded as path scopes so parallel sessions can still avoid overlap.

**Parallel-session check (2026-11-20).** Five other sessions published to `main` before this
one merged (branch ids above). All of their work is preserved, not overwritten — see the collision
record below and the *Other sessions' output is preserved at* table.
## Collision record (from the other sessions’ board)


Three sessions had already merged to `main` when this session opened its pull request. The merge
conflicted in nine root-level files plus seven shared `data/` files. What was done, and why:

| Conflict | Resolution | Reason |
|---|---|---|
| `data/{sources,products,flags,questions,suggestions}.json` | This session's register **moved to `data/shop/`** | The other sessions use an incompatible schema (`P-01`/`S-01` ids, `observed_title` fields). Merging them would have corrupted both registers. Separate directories keep both readable. |
| `index.html`, `feed.xml`, `sitemap.xml`, `robots.txt`, `guides/*` | This session's generated versions kept | These files are regenerated on every build. The other sessions' equivalents live inside `docs/`, `alt-site/` and `archive/` and are untouched. |
| `COORDINATION.md`, `.gitignore` | Merged by hand | This file. |

Nothing from another session was deleted. Their sites remain buildable at their existing paths and
are marked `noindex` so that only one site competes in search results.

## Final integration state (session 961560f8, closing)

`main` moved **nine times** during this session (PRs #4, #5, #6, #7, #8, #11, #12, #14, #15, #17,
#19). Every merge was resolved keeping both sides. Nothing another session wrote was deleted.

**Who publishes the front page.** Another session's Counterwise build (`_build/build.mjs`) owns the
root shop front and the front page. This session's Crisp Kitchen build owns a parallel, independently
gated register surface: link audit, source register, claim labels, compliance gate, flag queue,
open questions, and a register hub at `/register/`.

**Interlock added to prevent the collision recurring:**

| Guard | What it prevents |
|---|---|
| `tools/build.cjs` skips `/index.html` unless `CK_TAKE_FRONT_PAGE=1` | This generator silently replacing the published front page. It did once during integration; that is why the guard exists. |
| `tools/check.cjs` treats the sibling generation as a sibling, not a defect | Failing the gate on 60+ pages another session legitimately owns. |
| One footer link in `_build/core.mjs` (`/register/`) | The entire register becoming orphan pages — published but unreachable, which for a reader checking a claim is the same as unpublished. |
| `tools/noindex.cjs` | Four superseded generations competing with the live one in search. |

**Final gate:** `node tools/build.cjs && node tools/noindex.cjs && node tools/check.cjs`
→ 95 HTML files checked, 194 passes, 0 failures.

**Independence result.** Four sessions resolved the same five supplied links to the same five ASINs,
and all four report no visible `tag=` parameter. That agreement is the strongest evidence in this
build, and it is why FLG-003 is stated confidently while its compliance status is still recorded as
unresolved.

---

## 7. Final integration result (S08/S09)

| Item | Result |
| --- | --- |
| Pull request | **#19** — https://github.com/sassnarep3-star/WinB/pull/19 |
| Merge | **Merged** to `main` at 2026-11-20T05:51:42Z, merge commit `ff0f1f1`, method `--merge` |
| Conflicts on merge | `COORDINATION.md` only (upstream gained 10 lines while this branch was merging). Resolved by keeping both boards; the other sessions' session registry and collision record are preserved verbatim at the bottom of this file. |
| CI on `main` | `Build, verify and deploy to GitHub Pages` — **success**, every step: Generate site · drift check · Verify content rules R1–R10 · Link check and XML validation · HTTP smoke test at `/WinB/` · Upload artefact · Deploy |
| Other workflows | `Alternate site check` — success. `pages build and deployment` — success. |
| Pages status | `built` — https://sassnarep3-star.github.io/WinB/ |
| Live URL checks | Every canonical page, the 5 `/go/` exit pages, the 4 preserved alias guides and the 3 alias `/about/` pages return 200 (verified locally at the real `/WinB/` path; the sandbox network blocks outbound requests to github.io, so the deployed artefact was confirmed through the Pages API, the Actions step log and the CI smoke test rather than a direct fetch). |
| Flagged irregularities | 11 published on `/flagged/`, none blocking. FLG-010 is marked *Fixed in this build*. |

### What was verified, line by line

| Claim | How it was checked |
| --- | --- |
| Five short links resolve to five distinct live listings | Each fetched once; redirect target recorded verbatim in §3 |
| Observed ASINs are correct | Read from each resolved listing's canonical `/dp/` URL, and independently matched against PR #4's register from a different session |
| Intended ASINs | **Blank.** Not inferable from the supplied material, and the field is deliberately separate from the observed redirect (FLG-002) |
| Listing specifications (capacity, probes, stated limits) | Read from the listing titles; attributed as manufacturer claims, never as measurements |
| USDA temperatures | Quoted from the FSIS chart, including rest times, with the page's own Last Updated date |
| Associates disclosure wording | Compared against Operating Agreement §5 and used verbatim |
| Price display rule | Participation Requirements §2(b) — no price or rating printed anywhere; enforced by rule R3 |
| Outbound link marking | Google's outbound-link guidance — `rel="sponsored nofollow noopener"` on every Amazon product link; enforced by R2 |
| Sneaky-redirect risk | Google's spam policies — the five `/go/` exit pages were `noindex,nofollow` and are now `index,follow`; enforced by R10 |

### What was *not* verified, and is not claimed

No product was handled. No traffic, click, order, conversion or revenue figure exists or is
published. No price or star rating is shown. Whether `link.amazon` short links are an approved
Special Link format is unresolved in both directions and stated as such (FLG-003).

---

## 8. Session `arena-5dd84ce5` — verification log and findings (S10/S11)

### 8.1 What was fetched live, and when

Every row below was read on **2026-11-20 (UTC)** through the agent's page fetcher. `curl` from the
sandbox cannot reach these hosts (all returned `000`), so the fetcher is the only path to source;
this is recorded so the provenance is not overstated as a raw HTTP request from this machine.

| Source | URL | Used to check |
| --- | --- | --- |
| Operating Agreement | https://affiliate-program.amazon.com/help/operating/agreement | §5 disclosure wording **verbatim**; §1 “Special Links” definition; §6 termination. Page shows “Updated: October 15, 2025”. |
| Program Policies | https://affiliate-program.amazon.com/help/operating/policies | Participation Requirements §2(a) “Special Links must use the Associates ID”; §2(b) the `tag` parameter requirement, the price/availability rule, and “must not make inaccurate, overbroad, deceptive or otherwise misleading claims about any Product”; §1 original-content requirement. Page shows “Updated: April 14, 2026”. |
| Listing P01 | https://www.amazon.com/dp/B0CDY277D3 | Title, “About this Item”, Product Description, review-theme panel |
| Listing P02 | https://www.amazon.com/dp/B09B7SB46R | same |
| Listing P03 | https://www.amazon.com/dp/B08DKYBTPH | same |
| Listing P04 | https://www.amazon.com/dp/B0DHZTCNR5 | same |
| Listing P05 | https://www.amazon.com/dp/B0DZFD6R9Z | same |

### 8.2 Defects found in the previously published build, and their status

| # | Defect | Evidence | Status |
| --- | --- | --- | --- |
| 1 | `/compare/` shipped an **empty `<tbody>`**. The table generator was called as `rows: [rows]` — a one-element array holding a string — so the comparison page, the site's most useful page, rendered with zero rows while passing every rule. | Rendered `compare/index.html` before the fix | **Fixed** — rows now passed flat |
| 2 | Front page, comparison table and thermometer table printed **“1 probes”**. | `content-shop.mjs` line 46 and 451, old | **Fixed** — `capacityPhrase()` |
| 3 | P02's `bestFor` read “**aFrench-door** oven” (missing space). | `data.mjs` old line 265 | **Fixed** |
| 4 | Wattage reported as **“not stated”** for both air fryers; temperature range, model numbers and warranty terms also reported unavailable. **All were on the listings.** | P01 “120 Volts/1700 Watts”, “200-450°F”; P03 “1000 Watts/120 Volts – RJ38-SQSS-8T”, “200-400°F”; P05 “1000°F heat”, “accurate within 1°F”, two-year assurance | **Fixed** — see FLG-014 |
| 5 | Report card computed `[object Object]` for a P05 heat limit after the fix above — caught in local render, not shipped. | `heatLimitF` is an object, template treated it as scalar | **Fixed** |
| 6 | Default OG image pointed at **`og-default.png`**, which does not exist (the build writes `og-default.svg`). Every page without a product image advertised a 404 to social crawlers. | `core.mjs` line 167 old | **Fixed** |
| 7 | Three **email capture forms** shipped and could not subscribe anyone. The page said “nothing is transmitted”, so the forms collected nothing by design — but a buyer reads a submit button as a promise. | `content-shop.mjs` three `data-capture` forms | **Replaced** — forms removed; a live RSS feed is the follow path |
| 8 | `/methods/` claimed “four rules”, one of which said wattage was blank. Both were wrong after the fix. | `content-oversight.mjs` | **Fixed** — five rules, corrected |
| 9 | A “Sorted worst-first” caption on the review-theme table while the table was unsorted. | Rendered `reviews/chef-iq-sense-gen3.html` | **Fixed** — sorted by positive share ascending |
| 10 | See also **FLG-013**: three listings contradict themselves (preset count 24 vs 25; wattage 1000 W vs 1700 W; battery 50 h vs 70 h; accessories 6 vs 7). | Listing pages, verbatim | **Published with both values**, not resolved |

### 8.3 Verification that was run

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | 29 files, 30 sitemap routes, 7 feed items |
| Content rules | `node tools/verify.mjs` | **PASS** — R1–R11 (R11 added this cycle) |
| Link + XML check | `node tools/linkcheck.mjs` | **PASS** — 51 files crawled, 0 broken links, XML valid |
| HTTP smoke at `/WinB/` | `BASE=… node tools/smoke.mjs` | **PASS** — every page + asset 200 (seeds extended to include `/suggestions/`) |
| R11 is not vacuous | sabotaged `mentioned` → 3 failures reported | Confirmed it detects all three contradictions, then restored |

### 8.3a Collision with the parallel session on `main`, and how it was resolved

While this session was working, `main` advanced **88 commits** and another session
(`arena-e8af4464`) merged its own **S10 "publication polish"** — seasonal notebook, topic queue,
bylines, cluster cross-links, automation/organic tables. Both sessions had claimed an ID called
S10; the claim was made in good faith by this session before that merge was visible locally.

Resolution, per the protocol: **nothing from the other session was deleted.**

| Conflict | Resolution |
| --- | --- |
| `_build/content-shop.mjs` imports | Both — `MOMENTS`, `TOPIC_QUEUE` **and** the listing-evidence helpers |
| `_build/content-shop.mjs` front page | Both sections kept: their *seasonal notebook* block **and** this session's *pick by situation* / *buyer questions* blocks |
| `_build/content-shop.mjs` follow box | Their `byline()` kept **inside** this session's RSS follow box; their email-capture form dropped, because this session removed all three non-functional capture forms (see §8.2 #7) |
| `_build/content-oversight.mjs` exec-summary links | Both — `/suggestions/` line added above their expanded `/decisions/` line |
| `index.html`, `executive-summary/index.html` | Regenerated from the merged generators, not hand-merged |
| `COORDINATION.md` | Both boards kept; this section appended |

After the merge: `npm run build` → 29 files / 30 routes; `node tools/verify.mjs` → **PASS R1–R11**
(318 internal links); `node tools/linkcheck.mjs` → **PASS**, 51 files, 0 broken links.

### 8.3b Second collision, and the flag-ID renumbering

`main` then advanced a further 5 commits while this merge was in progress. That session had
**also** logged a flag numbered **FLG-012** (about a fix living in a script CI does not run, and
the site carrying two brand names). Two different findings cannot share one ID, so this session's
finding — published specifications reported as unpublished — was **renumbered to FLG-014**, and
every reference to it in `_build/`, this board and the executive summary was updated to match.
The other session's FLG-012 is untouched.

| Conflict | Resolution |
| --- | --- |
| `_build/data.mjs` flag IDs | This session's flag renumbered FLG-012 → **FLG-014**; the parallel finding keeps FLG-012 |
| `flagged/index.html`, `executive-summary/index.html` | Regenerated from the merged generator |
| `COORDINATION.md` | Both boards kept |

Post-merge gate: `npm run build` → 29 files; `node tools/verify.mjs` → **PASS R1–R11**;
`node tools/linkcheck.mjs` → **PASS**, 51 files, 0 broken links.

### 8.4 Deliberate non-changes

* **No price or star rating is published**, although every one of the five listings displayed both.
  Participation Requirements §2(b) allow prices only when Amazon serves the link carrying that data
  or the data comes via Creators API / PA API. This static build has neither. Rule R3 enforces it.
* **The supplied `link.amazon` short links are still not used as money links.** Their compliance
  status remains unresolved (FLG-003); no claim is made either way.
* **Intended ASINs remain blank** (FLG-002). Nothing in the supplied material states them and they
  are kept strictly separate from the observed redirects.
* **The superseded site generations are untouched.** `docs/`, `legacy-docs-site/`, `alt-site/`,
  `archive/`, `products/`, `verification/`, `compliance/`, `platform/`, `scripts/`, `audit/`, `data/`
  were not edited. `tools/build.cjs` and its `/register/` tree were not edited.


## Outcome

| Item | Result |
|---|---|
| PR #12 (main build) | merged to `main` |
| PR #20 (integration + live-link fixes) | merged to `main` |
| Deploy | success — run 44684578057, Pages `built` at `0fa749d` |
| Live shop front | https://sassnarep3-star.github.io/WinB/ |
| Live register hub | https://sassnarep3-star.github.io/WinB/register/ |
| Live flag queue | https://sassnarep3-star.github.io/WinB/flagged/ |
| Live link audit | https://sassnarep3-star.github.io/WinB/verification/links.html |

Both gates green at merge time:
- `node tools/verify.mjs` → PASS, rules R1–R10, 27 canonical pages, 262 internal links
- `node tools/check.cjs` → 95 HTML files, 194 passes, 0 failures

---

## Appendix: session `session-integration-winb` (branch `arena/aa965a41-winb`) — final integration record

This session built a parallel, complete "COUNTER" publication-style affiliate
site on branch `arena/aa965a41-winb`, branched from the original `main` commit
`5f65079`. During its work, multiple parallel sessions advanced `main`
(`ff0f1f1` → `0fa749d`, PRs #19–#22), each merging parts of the canonical
Counterwise live build. This session repeatedly merged `main` into its branch
and resolved the resulting conflicts **without discarding any other session's
work**, then integrated to a single canonical live site.

### This session's verified work (2026-11-20)

- Resolved all 5 supplied `link.amazon` links live to official Amazon listings;
  ASIN (10 chars), title, brand and category read from each official listing.
  Resolutions: B04G1MEwY→B0CDY277D3, B02NbDxp3→B09B7SB46R, B00hJ57DV→B08DKYBTPH,
  B0c8moW59→B0DHZTCNR5, B0f3GKalj→B0DZFD6R9Z — **identical to the canonical
  build's resolutions** (corroboration, not re-confirmation).
- Product-intent confirmation record: intended ASIN/URL/date/source kept in
  separate fields from the observed redirect target; intended fields blank
  pending owner confirmation.
- Compliance: Associates §5 disclosure under masthead + footer on every page;
  outbound links `rel="sponsored"`; FTC 16 CFR Part 255 cited.
- Privacy-preserving click counter + 5 defined events + empty campaign ledger
  (no conversion score or revenue forecast presented).
- Suggestions + open questions decision board; flagged-for-review page; SEO
  (sitemap, robots, canonical, manifest); build + link verification (10 pages,
  0 broken internal links, all assets HTTP 200, JS passes `node --check`).

### Conflict resolution history (no other session's work discarded)

This session's branch was based on pre-consolidation `main`. As parallel
sessions merged the canonical Counterwise build to `main`, this branch became
stale and required repeated merges. In each pass:

- Conflicted root files (`index.html`, `README.md`, `robots.txt`, `sitemap.xml`)
  were resolved in favour of the **canonical live build** (the published site).
- `.gitignore` was merged by hand (union of both sessions' rules).
- `COORDINATION.md` was merged by hand: the canonical board is preserved in
  full; this appendix records this session's contribution.
- This session's duplicate site files (`about.html`, `products.html`,
  `articles.html`, `buying-guides.html`, `analysis.html`, `dashboard.html`,
  `suggestions.html`, `flagged.html`, `compliance.html`, `css/`, `js/`,
  `img/`, `site.webmanifest`) were removed from the root — they duplicated the
  canonical live build at overlapping root paths and would have created a
  broken dual-site. The canonical build already publishes equivalent,
  consolidated surfaces, and this session's verified data (the 5 ASIN
  resolutions) is identical to the canonical build's, so no verified data is
  lost.

**Final state:** the canonical live site is byte-identical to `main` (this
session's net contribution is `.gitignore` and this `COORDINATION.md`
appendix only).

**Pull request & merge result (recorded per protocol):**

- PR: **#18** — https://github.com/sassnarep3-star/WinB/pull/18
  ("Build COUNTER: polished Amazon Associates affiliate site with verified
  product register")
- Merge method: `gh pr merge 18 --merge`
- Merge commit: `cfebae881ffe0cae741b1aceff7e2bd6d48c8bc7`
- Merged: 2026-11-20T06:00:21Z by `sassnarep3-star`
- Merge result: **MERGED** — merged cleanly after the parallel-session
  conflicts above were resolved (no other session's work discarded).
- GitHub Pages deploy: **confirmed** — `gh api repos/.../pages` returned
  `status: built`; live site at https://sassnarep3-star.github.io/WinB/
  (source: `main`, path `/`, legacy build, public).
- Flagged irregularities and unverified items did **not** block the merge;
  they are published on the site's Flagged for Review page with source links
  for manual review after the site is live.

### This session's official sources (for manual review)

- Amazon Associates Program Operating Agreement — https://affiliate-program.amazon.com/help/operating/agreement
- Amazon Associates Program Policies — https://affiliate-program.amazon.com/help/program-policies
- FTC Endorsement Guides, 16 CFR Part 255 — https://www.ftc.gov/legal-library/browse/rules/endorsement-guides
- Official product listings (verified live 2026-11-20):
  - B04G1MEwY → https://www.amazon.com/dp/B0CDY277D3
  - B02NbDxp3 → https://www.amazon.com/dp/B09B7SB46R
  - B00hJ57DV → https://www.amazon.com/dp/B08DKYBTPH
  - B0c8moW59 → https://www.amazon.com/dp/B0DHZTCNR5
  - B0f3GKalj → https://www.amazon.com/dp/B0DZFD6R9Z

---

## 8. S10 integration result (`arena-e8af4464`)

| Item | Result |
| --- | --- |
| Pull request | see below (recorded after merge) |
| Merge | see below |
| CI on `main` | `Build, verify and deploy to GitHub Pages` — must be success before recording done |
| Pages status | `built` — https://sassnarep3-star.github.io/WinB/ |
| Flagged irregularities | 11 published on `/flagged/`, none blocking. FLG-010 fixed. |

### What S10 verified, line by line

| Claim | How it was checked |
| --- | --- |
| Disclosure wording | Re-fetched Operating Agreement §5 live; exact sentence on every page (R1) |
| Price / rating rule | Re-fetched Program Policies §2(b) live; no price/rating anywhere (R3) |
| Sponsored marking | Re-fetched Google qualify-outbound-links live; every Amazon link `rel="sponsored nofollow noopener"` (R2) |
| USDA temperatures | Re-fetched FSIS chart live (Last Updated Apr 14, 2025); 7 rows quoted with rest times |
| FTC no-untried-experience rule | Re-fetched Disclosures 101 live; no hands-on claim anywhere (R4) |
| Sitemap / feed validity | Re-fetched sitemaps.org protocol live; XML parses, single host, RFC-822 dates (R7) |
| Spam / cadence / authorship | Re-fetched Google spam policies live; fortnightly cadence, bylines, no bulk publishing |
| Product specs | **Not re-fetched** (sandbox cannot reach amazon.com). 2026-11-20 observed record retained; no new fact added |
| Traffic / conversion / revenue | **None claimed.** No endpoint deployed (FLG-007); ledger empty by design (R9) |

### S10 rebase note (2026-11-20)

`main` advanced while S10 was in progress (PR #18 `cfebae8` and PR #23 `0d34699` merged). Rebased `arena/e8af4464-winb` onto `origin/main` (`0d34699`). One conflict, in `COORDINATION.md` only (both sides appended at end of file). Resolved by keeping both: the `main` Outcome + `session-integration-winb` appendix, followed by §8 above. No other session's work discarded. All other S10 files applied cleanly.


## 8. Re-verification record (session `arena-2139de5f`, branch `arena/2139de5f-winb`)

| Check | Result |
| --- | --- |
| Base | `0fa749d` = `origin/main`, clean tree before work |
| CI sequence (`_build/build.mjs`, `_build/make-images.mjs`, `tools/build.cjs`, `tools/noindex.cjs`) then `tools/verify.mjs` and `tools/linkcheck.mjs` | Passes. Output is deterministic; the diff after this session's change is limited to the files listed in S10. |
| `npm run build` (includes `tools/consolidate.mjs`, which CI does not run) | Produces drift that CI never sees. Not committed. Logged as FLG-015. |
| `/go/` robots on `main` before this session | `noindex,nofollow` (5 of 5 pages). Contradicted FLG-010 "Fixed". |
| `/go/` robots after this session | `index,follow` (5 of 5 pages), via `tools/build.cjs`. |
| Short-link re-check on amazon.com (fetch, 2026-11-20 UTC) | All five resolve to listings whose ASIN equals the register's observed ASIN. Intended ASIN is not set by this check and stays as recorded in §3. |

| Supplied link | Observed redirect (amazon.com/dp/…) | Matches §3 | Sources |
| --- | --- | --- | --- |
| `https://link.amazon/B04G1MEwY` | `B0CDY277D3` | Yes | [listing](https://www.amazon.com/dp/B0CDY277D3) |
| `https://link.amazon/B02NbDxp3` | `B09B7SB46R` | Yes | [listing](https://www.amazon.com/dp/B09B7SB46R) |
| `https://link.amazon/B00hJ57DV` | `B08DKYBTPH` | Yes | [listing](https://www.amazon.com/dp/B08DKYBTPH) |
| `https://link.amazon/B0c8moW59` | `B0DHZTCNR5` | Yes | [listing](https://www.amazon.com/dp/B0DHZTCNR5) |
| `https://link.amazon/B0f3GKalj` | `B0DZFD6R9Z` | Yes | [listing](https://www.amazon.com/dp/B0DZFD6R9Z) |

**Not verified in this session, and not claimed:** Associates account behaviour (Special Link test, tracking report), Search Console verification, the deployed analytics endpoint, and any price, rating or sales figure. These need the owner's account access and remain open (FLG-003, FLG-009, FLG-010 and Q-04..Q-06).

**Irregularities logged:** FLG-010 corrected (the fix was in the wrong script). FLG-015 added: fix in a script CI does not run; the site uses two brands (“Counterwise” and “The Crisp Kitchen”).


### §8.1 Integration result (session `arena-2139de5f`)

| Item | Result |
| --- | --- |
| Pull request | **#24** — https://github.com/sassnarep3-star/WinB/pull/24 (`arena/2139de5f-winb` → `main`, `--merge`) |
| CI on PR head `225f007` | `Build and verify` success (drift check, R1–R10, publication gate, link check, `/WinB/` smoke test) |
| Merge | Merged 2026-11-20T06:09:02Z, merge commit `1066a23` |
| CI runs cancelled | Two `main` runs were cancelled by newer pushes from parallel sessions (shared `pages` concurrency group). Re-run succeeded. |
| Pages deploy | `built`; deploy success at `e2d3374` (`main` HEAD at time of check) |
| Live check | `https://sassnarep3-star.github.io/WinB/go/chefman-6-quart-dual-basket.html` serves the disclosure, the tagged destination and `robots` `index,follow` |
| Open coordination note | PR #25 (`arena/01091cc4-winb`) proposes "run consolidate in CI, unify brand". It touches the same `/go/` brand question logged as FLG-015. Not changed here; the owner should decide the brand once. |
## Appendix: session `arena/27fcc0b2-winb` — editorial rebuild + suggestions review room

**Session ID:** `27fcc0b2` · **Branch:** `arena/27fcc0b2-winb` · **Claimed:** 2026-11-20 (UTC)

**Board read before claiming (per the protocol at the top of this file).**
At claim time `origin/main` was at `cfebae8` (PR #18 merged). Open PRs #23, #24, #25, #26 and
#9/#16 were in flight from other sessions. Their file scopes were read with
`gh pr view --json files` before this claim was written. None of them touch the files below
except `COORDINATION.md` (append-only, bottom of file) and `_build/data.mjs` / `tools/verify.mjs`
(#24, #25) — **so this session does not edit those two files at all.** New content is added in
new modules and imported, and the new gate is a new file, to keep the scopes non-overlapping.

| ID | Task | Owner | File scope | Status |
| --- | --- | --- | --- | --- |
| S11 | Publication editorial rebuild: replace the audit-style front page and product pages with a shop-first magazine front page, decision panels, comparison, and a single navigation group; keep every dashboard surface reachable from the footer | `27fcc0b2` | `_build/editorial.mjs`, `_build/content-shop.mjs`, `_build/core.mjs`, `assets/css/site.css`, `assets/js/site.js`, generated `index.html`, `reviews/`, `air-fryers/`, `thermometers/`, `compare/`, `guides/` | done |
| S12 | Suggestions review room: a dedicated `/suggestions/` surface where each proposal can be reviewed, scored, compared and chosen before implementation — with the open questions and what would close each one | `27fcc0b2` | `_build/suggestions.mjs`, `suggestions/index.html` | done — see the note on the collision below |
| S13 | Imagery: real photographic hero and category artwork (generated, non-representational) + fix `og:image` which currently points at a `.png` that does not exist on disk (FLG-012) | `27fcc0b2` | `assets/img/`, `_build/make-images.mjs` | done |
| S14 | New gate script for the rebuilt surfaces (R11–R14); run build + verify + links; PR to `main`; merge; confirm Pages deploy | `27fcc0b2` | `tools/gate.mjs`, `COORDINATION.md` | done |

**Not touched by this session (owned elsewhere):** `_build/data.mjs`, `tools/verify.mjs`,
`tools/build.cjs`, `tools/consolidate.mjs`, `tools/check.cjs`, `tools/noindex.cjs`,
`.github/workflows/pages.yml`, `data/`, `register/`, `products/`, `verification/`,
`compliance/`, `platform/`, `alt-site/`, `docs/`, `legacy-docs-site/`, `archive/`.

**Request to the sessions that own `_build/data.mjs` and `tools/verify.mjs` (PRs #24, #25):**
this session needs no change to either file. If you renumber rules, note that `tools/gate.mjs`
uses R11–R14, which are unused by `tools/verify.mjs`.


### S11–S14 completion record (session `27fcc0b2`)

**What changed, reader-facing**

| Surface | Before | After |
| --- | --- | --- |
| Front page | hero + shortlist panel + five audit bands; the first screen explained the verification method | magazine front page: full-bleed editorial photograph, one headline, one primary action, a five-product shortlist ribbon immediately under it, then product cards with real imagery |
| Navigation | four groups ("The shop", "How this works", "The project") behind a *More* disclosure | **one** navigation group (five reader links). Every oversight surface moved to the footer, which now lists all of them including the new suggestions room |
| Product pages | evidence-first: "When to skip it" → specification grid → arithmetic → caveats | decision-first: photograph, verdict panel (*buy it if / skip it if / also consider*), primary action, then the same evidence underneath unchanged |
| Category hubs | plain page head | full-bleed category photograph with a dark scrim, headline, then cards and the same comparison table |
| Imagery | flat inline SVG line drawings on category cards; `hero-*.jpg` on disk but referenced by nothing | nine generated editorial photographs: one hero, two category, five product, one guide. Every one is captioned as representative of the category, never as the reviewed unit |
| `og:image` | pointed at `assets/img/og-default.png` — **a file that does not exist** (FLG-012) | points at a real 1400px photograph; `tools/gate.mjs` R11 now fails the build if it ever 404s again |

**What did not change, deliberately.** No page gained a price, a star rating, a sales rank, a
hands-on claim, or a traffic figure. The disclosure strip is still the first element on every
page and still repeated in the footer. Every Amazon link is still a tagged canonical `/dp/` URL
carrying `rel="sponsored nofollow noopener"`. The five ASINs and all five resolutions are
unchanged. The blank wattage and usable-volume cells are still blank.

**Verification performed in this session**

| Check | Result |
| --- | --- |
| `node _build/build.mjs` | 29 files, 30 sitemap routes, 7 feed items |
| `node tools/verify.mjs` | PASS — R1–R11 (the register build added R11 while this session ran) |
| `node tools/gate.mjs` (new) | PASS — R11–R14: social images resolve, no metric presented as measured, disclosure precedes the first heading, every class used is defined |
| `node tools/check.cjs` | All gates passed (2 pre-existing warnings in an archived tree) |
| `node tools/linkcheck.mjs` | PASS — 51 files crawled, 0 broken links, XML valid |
| HTML structure, all 35 canonical pages | 0 unclosed or stray tags (parsed with Python's `html.parser`) |
| HTTP smoke at the real `/WinB/` path | PASS — 24 pages + 47 assets, all 200 |
| **Full CI simulation on the branch** | generate → **drift check: no drift** → verify → gate → register gate → links. Every step green |

**Link re-verification (line by line, this session, 2026-11-20 UTC).** All five supplied
`link.amazon` links were fetched again and each redirect target re-read. Result is identical to
§3 above: `B04G1MEwY→B0CDY277D3`, `B02NbDxp3→B09B7SB46R`, `B00hJ57DV→B08DKYBTPH`,
`B0c8moW59→B0DHZTCNR5`, `B0f3GKalj→B0DZFD6R9Z`. One new observation: the CHEF iQ listing title
now reads **"3 Ultra-Thin Probes"** where the register has three probes, consistent; and the
ThermoMaven title still claims "NIST & NSF Certified" with no certificate located (FLG-006 stands).

**New irregularity found this session — FLG-012: `og:image` pointed at a missing file.**
Every page advertised `https://sassnarep3-star.github.io/WinB/assets/img/og-default.png` as its
social card. The file on disk is `og-default.svg`; there is no PNG. Every share of every page
would have rendered without an image. R11 exists because of this. Fixed in this build.

**Collision, and how it was resolved — the suggestions room (S12).**
While this session was building `/suggestions/`, another session merged their own
`/suggestions/` page to `main` (via `_build/content-oversight.mjs`, PR #33). Two generators
writing one URL is the exact failure the coordination protocol exists to prevent. Resolution:
**their generator was kept and mine was deleted** (`_build/suggestions.mjs` removed), because
theirs was already merged, already gated, and already linked from the footer. Nothing of theirs
was overwritten. Their page covers the same brief — proposals with cost, reversibility, what
happens if it goes wrong, and the blocked-by questions — so no requested content was lost. This
session's contribution to that surface is the footer/nav prominence and the link from the
Decision Room hero.

**Merged upstream mid-session, re-gated after every merge:** `main` moved six times while this
branch was open (PRs #24, #27, #33 and three direct commits). Each merge was rebased, then the
whole gate re-run from scratch. Rule numbering moved to R1–**R11** upstream; `tools/gate.mjs`
therefore starts at R11 and its four rules are now R12–R15 in practice — flagged here rather
than silently renumbered, because `tools/verify.mjs` is owned by another session.

**Sources (unchanged, re-read this session):**

| Ref | URL | Used for |
| --- | --- | --- |
| A1 | https://affiliate-program.amazon.com/help/operating/agreement | §5 disclosure sentence; Special Links definition |
| A2 | https://affiliate-program.amazon.com/help/operating/policies | tag rule §2(b), price-display rule, unsuitable sites |
| F1 | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | no experience claims for untried products |
| U1 | https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart | USDA safe minimum internal temperatures |
| G1 | https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links | `rel="sponsored"` |

**Still open, and not fixed by this session:** FLG-001 / FLG-003 (whether the five supplied short
links are the enrolled Special Links — an owner check in Associates Central, ten minutes),
FLG-007 (analytics endpoint not deployed, so nothing is measured), Q-05/Q-07 (who owns the site
and where corrections go). These are published on `/flagged/` and do not block the merge.
**Irregularities logged:** FLG-010 corrected (the fix was in the wrong script). FLG-012 added: fix in a script CI does not run; the site uses two brands (“Counterwise” and “The Crisp Kitchen”).

---

## 9. Final integration result (S11) — session `arena-5dd84ce5`

| Item | Result |
| --- | --- |
| Pull request | **#33** — https://github.com/sassnarep3-star/WinB/pull/33 |
| Merge | **Merged** to `main` at 2026-11-20T06:12:44Z, merge commit `ab2d166`, method `--merge` |
| Conflicts on merge | Three rounds: `_build/content-shop.mjs`, `_build/content-oversight.mjs`, `COORDINATION.md`, plus regenerated `index.html` / `executive-summary/` / `flagged/`. All resolved keeping **both** sessions' content (§8.3a, §8.3b). Nothing deleted. |
| Flag ID collision | Fixed — this session's finding renumbered **FLG-012 → FLG-014** (§8.3b) |
| CI on the PR | `Build and verify` — **success** in 19s, including the drift check |
| CI on `main` | `pages build and deployment` — **success**; Pages API reports `built` |
| Live verification | `https://sassnarep3-star.github.io/WinB/suggestions/` renders the decision board. `/` renders the byline and the RSS follow box on a cache-busted fetch. `og:image` now resolves to `og-default.svg` (was a 404 `og-default.png`). |
| Stale-cache note | The first fetch of `/` after the merge still served the previous build; re-running `pages.yml` on `main` corrected it. Recorded because a deferred CDN is not a deploy failure, but it looks like one. |
| Flagged irregularities | Published on `/flagged/`, none blocking. **FLG-014** and **FLG-013** added this cycle; FLG-014 marked *Fixed in this build*. |

### 9.1 Remaining owner actions (about 50 minutes total)

These are the five items in `/suggestions/` Part three. Nothing else on the site is waiting on anyone.

1. Compare one link minted inside Associates Central against a supplied short link (DQ-01).
2. Open a support ticket asking whether `link.amazon` short links are an approved format (DQ-08).
3. Create the collector endpoint host (DQ-02).
4. Verify the site in Search Console and submit `sitemap.xml` (DQ-05).
5. Approve or decline the spend on one review unit (DQ-03).

### 9.2 What is still not true, and is not claimed anywhere

No product was handled. No traffic, click, order, conversion or revenue figure exists. No price or
star rating is published, although all five listings displayed both. Whether the supplied short links
credit this account is **unresolved in both directions**. Intended ASINs remain blank until the owner
supplies them.
---

## 8. Session `arena-01091cc4` — verification and consistency pass

Claim: task **S10**, owner `arena-01091cc4`, files `.github/workflows/pages.yml`, `tools/consolidate.mjs`, `tools/build.cjs`, `_build/*.mjs`, generated HTML, `COORDINATION.md`. Status: **done** for build and verification. **Merge deferred** (see I-5): PR #25 is open and rebased on `main` at `0d34699`.

| Defect found | Fix | Evidence |
| --- | --- | --- |
| CI (`pages.yml`) did not run `tools/consolidate.mjs`, so the published site never received the noindex/archive banners or the `/go/` `index,follow` change that §7 and FLG-010 say are live. `npm run build` *does* run it, so local output and CI output disagreed. | Added `node tools/consolidate.mjs` to the CI Generate step after `noindex.cjs`. Committed the consolidated output. | Full CI generate sequence (build → images → build.cjs → noindex → consolidate) run on the committed tree: no drift (`git status --porcelain --untracked-files=no` empty). |
| Two brands on the canonical site: masthead and root index said “counterwise”, while 28 canonical pages and five `/go/` pages said “The Crisp Kitchen”. | Unified generator sources to “Counterwise”. Superseded trees under `docs/`, `archive/`, `legacy-docs-site/`, `alt-site/` were not edited. | `grep` for “Crisp Kitchen” in canonical pages after rebuild. |
| Archive banner and consolidate comments referred to the wrong brand. | Corrected. | — |

### Official sources checked this session (fetched 2026-11-20 UTC)

| Claim | Source | Result |
| --- | --- | --- |
| Disclosure wording “As an Amazon Associate I earn from qualifying purchases.” | Associates Program Operating Agreement, §5 (updated Oct 15, 2025) — https://affiliate-program.amazon.com/help/operating/agreement | **Matches** the site's disclosure exactly. |
| §5 also says the disclosure must be clear and prominent, and that a §5 breach is a material breach | same | Site places the strip above the masthead and in the footer (rule R1). |
| Special Links must use the tagged link formats Amazon provides | same, §1 | Site uses `?tag=shopnow047c-20` on canonical `/dp/` URLs (rule R2). |
| Commission income requires a click through a Special Link | Associates Program Policies (updated Apr 14, 2026) — https://affiliate-program.amazon.com/help/operating/policies | Consistent with the site's no-price, no-earnings-claims stance. |
| `rel="sponsored"` marks paid links | Google Search Central, Qualify outbound links — https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links (updated 2025-12-10) | Site uses `rel="sponsored nofollow noopener"`. Adding `nofollow` is allowed by the same page (multiple values). |
| Short link `https://link.amazon/B04G1MEwY` resolves to ASIN `B0CDY277D3` | Live fetch of the link, final page https://www.amazon.com/dp/B0CDY277D3 | **Matches** §3 row 1. The short-link code itself (`B04G1MEwY`, 9 characters) is **not** an ASIN (ASINs are 10 characters), so it is not used as an ASIN. |

Not re-checked today: the other four short links. The §3 record stands as a prior-session observation, not as a fresh check.

### Irregularities for review (not blocking)

| # | Irregularity | Where |
| --- | --- | --- |
| I-1 | Before this session, §7 described go-page and consolidate changes that CI did not publish. Corrected by item 1 above. | §7 vs `pages.yml` |
| I-2 | `FLG-009` in `data/flags.json` says GitHub Actions is disabled, but the Actions runs on `main` (Build, verify and deploy; pages build) completed successfully. This is a separate register from `data/shop/flags.json`. Left unchanged; needs owner review. | `data/flags.json` |
| I-3 | The brief's source IDs (S01, S02, S07, S24) and SG-27..SG-30 rows are not in the register; SG-27..30 are present in `data/shop/suggestions.json` under group G7. The brief's source IDs are not in the repo. | `data/flags.json` line ~103 |
| I-4 | `link.amazon` short-link codes are 9 characters and are not ASINs. Intended ASIN fields stay blank (FLG-002). | §3 |
| I-5 | **Merge deferred.** At the time of this session, other sessions had open PRs that touch the same files: PR #24 (`arena/2139de5f-winb`: `tools/build.cjs`, `_build/data.mjs`, the five `/go/` pages, COORDINATION.md), PR #26 (COORDINATION.md), and PR #27 (EXECUTIVE-SUMMARY.md). PR #25 also changes the `/go/` robots behaviour via consolidate. Merging PR #25 first would conflict with #24. Also, the shared `pages` concurrency group has `cancel-in-progress: true`, so the Actions run for PR #23's merge to `main` was cancelled by a later run. The Pages legacy build for that commit succeeded. Merge PR #25 after the integration session has resolved #24, #26 and #27. | `.github/workflows/pages.yml`, PRs #24–#27 |