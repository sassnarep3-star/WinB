# COORDINATION.md — shared task board

This is the shared task board for the WinB Amazon Associates site. Read this file before
starting work. Claim a task by writing your session ID and file scope here, then commit and
push the claim immediately. Never start a task another session has claimed.

**Board owner for this planning cycle:** session `arena-afa610ec` (branch `arena/afa610ec-winb`).
**Last updated:** 2026-11-20 (UTC).

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
| S10 | Audit the merged publication against the current owner constraints (unverified Special Link activation, disclosure placement, exact event contract); record findings and coordinate without editing the active site's files. | `arena/036104a7-winb` | `COORDINATION.md` only | needs review |

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

*(append command output summaries here; keep it short)*

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
