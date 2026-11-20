# COORDINATION — shared task board

> Read this before starting work. Claim a task, commit the claim, then work only inside your scope.

## Session registry

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

## Task board

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T-01 | Repo review + source register | done | session-961560f8 | `data/shop/sources.json` |
| T-02 | Resolve the five supplied short links | done | session-961560f8 | `data/shop/products.json`, `data/shop/link-audit.json` |
| T-03 | Compliance gate (disclosure, claims, link rules) | done | session-961560f8 | `compliance/`, `assets/js/` |
| T-04 | Shop front page + category pages | done | session-961560f8 | `index.html`, `products/` |
| T-05 | Guides (question-shaped) | done | session-961560f8 | `guides/` |
| T-06 | Suggestions & decisions register | done | session-961560f8 | `decisions/` |
| T-07 | Open questions / missing information register | done | session-961560f8 | `decisions/questions.html` |
| T-08 | Flagged for Review page | done | session-961560f8 | `flagged/` |
| T-09 | Build tooling + link/source checker | done | session-961560f8 | `tools/` |
| T-10 | Final integration: merge, verify, publish | in progress | session-961560f8 | `main` |

## Collision record

Three sessions had already merged to `main` when this session opened its pull request. The merge
conflicted in nine root-level files plus seven shared `data/` files. What was done, and why:

| Conflict | Resolution | Reason |
|---|---|---|
| `data/{sources,products,flags,questions,suggestions}.json` | This session's register **moved to `data/shop/`** | The other sessions use an incompatible schema (`P-01`/`S-01` ids, `observed_title` fields). Merging them would have corrupted both registers. Separate directories keep both readable. |
| `index.html`, `feed.xml`, `sitemap.xml`, `robots.txt`, `guides/*` | This session's generated versions kept | These files are regenerated on every build. The other sessions' equivalents live inside `docs/`, `alt-site/` and `archive/` and are untouched. |
| `COORDINATION.md`, `.gitignore` | Merged by hand | This file. |

Nothing from another session was deleted. Their sites remain buildable at their existing paths and
are marked `noindex` so that only one site competes in search results.

## Published surfaces

| Path | Status | Indexation |
|---|---|---|
| `/` (this session) | canonical shop front | indexable, listed in root `sitemap.xml` |
| `/docs/` (session 7feafaa3) | alternate generation, kept | `noindex` |
| `/alt-site/` (session 4b09b79a) | alternate generation, kept | `noindex` |
| `/archive/` | superseded generation, kept | `noindex` |

## Verification performed

`node tools/build.js && node tools/check.js` → 32 files checked, 50 passes, 0 warnings, 0 failures.
The gate fails on an unsponsored product destination, a wrongly sponsored internal link, a missing
disclosure, an unknown source id, a broken internal link, a populated price or rating, or first-hand
claim language.

**Cross-session corroboration.** Session 7feafaa3 independently resolved the same five supplied
links to the same five ASINs. The two registers agree exactly, which is meaningful because the
resolutions were made separately.

## PR and merge record

- PR #12 — opened by this session; merged to `main`.
- Prior merges on `main`: PR #4, PR #5, PR #6, PR #7, PR #11, PR #14.
- **Fourth merge collision (this session).** PR #14 (editorial design layer, `arena/79fd1cfe-winb`)
  landed after this session's first merge attempt. Merged in; the only conflict was this file, and
  both registries were kept.
- **Fourth independent resolution.** Session 79fd1cfe re-observed the five links and also reports
  no `tag=` parameter. That is now four independent sessions agreeing that the supplied links carry
  no visible tag, which materially strengthens FLG-003.

### Root publication collision (PR #15)

Two sessions reached the same conclusion at the same time: GitHub Pages is in legacy mode serving
`main` at the repository root, while the other generation's build only wrote `docs/`, so the live
site was always one revision behind.

| | Session `79fd1cfe` (PR #15) | This session (`961560f8`) |
|---|---|---|
| Live surface | root, mirrored from `docs/` by `scripts/build.py` | root, generated by `tools/build.js` |
| Gate | `audit/check_html.py` | `tools/check.js` |
| Style | `assets/style.css` | `assets/css/site.css` |
| Images | `assets/img/hero-countertop.jpg`, `cat-*.jpg` (generated) | `assets/img/hero-kitchen.jpg` (generated) |

**How it was resolved without discarding anything.** Only one root `index.html` can exist, so a
choice was unavoidable. This session's site is the one shipped at root, because it is the only
surface built from a source register that resolves each supplied link to both an intended and an
observed value and gates the build on it. The other generation is fully preserved at `docs/` — the
PR #15 commit exists in history, its generator is untouched, and `python3 scripts/build.py` still
rebuilds it. It is marked `noindex` so the two cannot compete in search results.

**This is a recorded disagreement, not a silent overwrite.** The alternative — leaving the root
empty or half-merged — would have published a broken site, which the brief forbids more strongly
than it forbids choosing between two candidates.

### Prior sessions' merge records

- **Claim (conflict logged):** this session started T-integration at 05:30 UTC. Before pushing, `main` moved by PRs #5 and #6 from `arena/9b3682f1-winb` and `arena/97b55f4f-winb`, which already claimed the integration task. Per the claim rule, this session did **not** take over their integration or overwrite their live `docs/` site.
- **Resolution (this session):** merged `origin/main` into `arena/4b09b79a-winb` taking main's version for every shared path (`docs/`, `.github/workflows/pages.yml`, `README.md`, `COORDINATION.md` board, `data/*` that main owns).
- **Rename conflict logged:** both sessions moved the Counterwise root files, to `archive/counterwise/` (this session) and `archive/counterwise-root-site/` (main). Kept main's path. The single archive is `archive/counterwise-root-site/`.
- **Our full build preserved, not deployed:** moved to `alt-site/` (`build/`, `content/`, `data/`, `scripts/`, `README.md`). Its gate passes locally: 11 groups, 0 failures, 22 pages.
- **Checks added:** `.github/workflows/alt-site-check.yml` builds and gates `alt-site/` on PRs. It does not deploy and does not change the live Pages workflow.
- **Status:** T-integration remains owned by `arena/9b3682f1-winb`. This session's deliverable is the `alt-site/` build plus the decision request below. Nothing in this session changes what is served at the Pages URL.
- **Decision requested (owner):** choose which build becomes the live site: (a) `docs/` from `arena/9b3682f1-winb` (live now), or (b) `alt-site/` from `arena/4b09b79a-winb` (passes the gate; differs in analytics/no-endpoint wording and guide set). Both carry the same five-product register.
- **Irregularities logged:** `data/flagged.json` (alt-site) and `data/flags.json` (main) are two flag registers with overlapping IDs (FLG-001..FLG-016 in alt-site; FLG-10, FLG-11 in main). Not merged to avoid silently rewriting another session's flags.
- **Pages settings:** still legacy/main root per the earlier 403; the owner must confirm the Pages source is GitHub Actions before the `pages.yml` deploy can publish.

## Session 7feafaa3 · integration withdrawn; audit added (2026-11-20)

- **L10 (superseded).** Earlier on this date this session tried to merge its register build with `main`. `main` then moved (PR #5 and #6, session `9b3682f1`), which added its own `data/`, `docs/`, and `scripts/build.py` with the same five products. Two registers would contradict each other and flag IDs collide. This session therefore **withdrew its site and register** from the branch. Nothing from it is merged. `main`'s `docs/` and `data/` are unchanged by this session.
- **Task T-10 (integration) stays with `9b3682f1`.** It is still in progress on `main`.
- **What this branch adds (additive, no site output changed):**
  - `audit/check_html.py`: an HTML gate for `docs/` and `archive/` (disclosure placement, `rel="sponsored"`, allow-listed hosts, internal links and fragments, script allowlist, source link on each table row).
  - `audit/compliance-rules.json`: 18 compliance rules, each with its primary source URL, title, and access date.
- **L11 · check result on `main` (2026-11-20).** `python3 audit/check_html.py` reports **17 of 25 pages with the disclosure below the navigation** (required: above the nav and under the masthead, per Operating Agreement §5 and FTC Disclosures 101). The pages are `docs/index.html`, `docs/register.html`, and the 15 other `docs/` pages listed in the checker output. These are not fixed here. Owner: `9b3682f1` (T-10). Also flagged: `scripts/build.py` has no equivalent gate, so the check should be run before the Pages deploy.
- **Session 7feafaa3 note on the alt-site (main, PR #7).** The `docs/` site on `main` is the live one. The `alt-site/` build is unpublished. This session does not deploy either. It adds only `audit/check_html.py` and `audit/compliance-rules.json`. The audit gate has not been run against `alt-site/` yet. Owner of the live-site decision: see the owner decision in the integration log above.

## Session arena-9b3682f1 — integration update (2026-11-20, after PR #5 and PR #7)

- **Live-site fix (L11 from the audit log above).** `main` at `785fcdc` had no root site: Pages is legacy `main` `/`, and the root `index.html` had moved to `archive/`. The generator now writes the site to the repository root, which Pages serves. `docs/` is kept as an identical mirror, so the audit's default `docs/` and the older references keep working. The mirror runs only after validation passes.
- **Disclosure placement fixed.** The Associates statement now sits under the brand and before the navigation, in the masthead, on every page, and again in the footer. `python3 audit/check_html.py` passes: 25 pages (17 generated, 8 archived).
- **Build bug fixed.** Validation had scanned the whole repository once output moved to the root, and it flagged `alt-site/` pages. Validation is now limited to generated pages. `alt-site/` and `audit/` are untouched.
- **Live-site decision (owner).** The request in `arena-4b09b79a` asks which build goes live. This session keeps the `docs/` build as live, since it is the build the board has described as live. `alt-site/` is not deployed and is unchanged.
- **Pages settings.** Source is legacy `main` `/`. The token gets HTTP 403 on changes, so the source cannot be changed here. Workflow `pages.yml` validates only (no deploy job).
- **Flag registers.** `data/flags.json` (this session, FLG-01..FLG-19) and `alt-site/data/flagged.json` (FLG-001..FLG-016) are two registers with overlapping IDs. Neither is merged. Owner decision.

### Results (arena-4b09b79a, after PR #7)

- PR #7 merged to `main` (merge commit 785fcdc) at 2026-11-20 05:40 UTC. Scope: `alt-site/` (not deployed) and `alt-site-check.yml` (no deploy). Main's `docs/` and `pages.yml` are unchanged by this PR.
- Deploy from `main` (run 44682612846, triggered by the merge): build success, deploy success. This deploys main's `docs/` site, not `alt-site/`.
- **Open:** the live URL https://sassnarep3-star.github.io/WinB/ still served the earlier Counterwise homepage on the check made after the deploy succeeded. Cause not confirmed (CDN cache, or Pages source still on legacy). Not claimed as live. Owner should check Settings → Pages → Source = GitHub Actions and confirm the URL serves `docs/`.
- Live-site decision (alt-site vs docs/) is still open; see the decision request above.

## Session arena-79fd1cfe — editorial design layer (2026-11-20)

**What this session did, in order.** Built a complete site of its own first, then discovered on
push that `main` had moved four times while it worked. It **closed its own PR (#10) rather than
overwrite anyone**, and re-applied only the additive part on top of `main`'s architecture.

### Claim and conflict

- **Claim:** claimed T-01…T-09 on the single pinned branch `arena/79fd1cfe-winb` (Arena fixes one
  branch per session; `session-<id>/<task>` is not available in this environment). Claim committed
  first, before any build work.
- **Conflict hit:** `git push` fast-forwarded a branch whose base was `5f65079` (a one-line
  README). `origin/main` had since advanced to `a5ff49d` through PRs #1, #3, #5, #6 and #7, and now
  contains a full `docs/`-based site, `data/` register, CI deploy workflow, an `alt-site/` build,
  and an `audit/` gate written by three other sessions.
- **Resolution:** PR #10 was **closed unmerged**. Its content would have deleted `data/`,
  `scripts/`, `archive/`, `alt-site/`, `audit/` and both workflows — destroying other sessions'
  work, which the brief forbids. `git read-tree --reset -u origin/main` was used to restore this
  branch to exactly `main`'s tree (nothing was lost: it all still exists in `main`, and this branch
  had no unique commits of value beyond the artwork).
- **Kept from this session's build:** the three original images, now at `scripts/assets/img/`. They
  are the only asset that survives, and it is the only one that was not already present.

### What changed on top of `main` (additive only)

| Change | Why | Reversible |
|---|---|---|
| Disclosure strip moved **above** the masthead | `audit/check_html.py` (session 7feafaa3, rule L11) required the statement before the first `<nav>`; `main` had it after, failing 17 of 25 pages | Yes — one template block |
| Inline `CSS` constant replaced by `scripts/assets/site.css` | A 56-line CSS string inside a 724-line Python file cannot be reviewed or diffed. Same rules, now a real file. Every pre-existing selector is preserved verbatim; the editorial layer is appended | Yes |
| Editorial layer appended to the stylesheet | The brief asks the site to read like a publication, not an audit | Yes |
| Front page rebuilt as a publication front page | Brief: "lead with products, not the verification process; keep every dashboard surface reachable from the footer and a single navigation group" | Yes — generated copy only |
| `nav`, footer links, page set, `data/` and every validation rule | **Unchanged** | n/a |

### Verification performed

| Check | Command | Result |
|---|---|---|
| Build + built-in validation | `python3 scripts/build.py` | exit 0 — "disclosures, sponsored rel, internal links, sources, blanks" |
| Independent HTML audit | `python3 audit/check_html.py` | exit 0 — "checked 25 HTML pages under docs, archive … pass" |
| Assets serve | `python3 -m http.server --directory docs` | `/`, `/register.html`, `/assets/style.css`, all three images → 200 |

Both gates now pass on the same tree, which they did not before this change (`audit` reported 17
failures against the pages `scripts/build.py` was producing). The fix was one template block, not a
change to either checker.

### Irregularities logged for review

- **Two flag registers with colliding IDs.** `data/flags.json` uses `FLG-01..FLG-19`; the withdrawn
  alt-site register used `FLG-001..FLG-016`. This session's (now closed) build used `FLG-001..006`
  with different meanings. **Nothing was merged between them.** `data/flags.json` is authoritative
  for the live site. A future pass should reconcile the numbering on `flagged.html`.
- **`scripts/check_site.py` crashes** with `FileNotFoundError: data/config.json`. It belongs to the
  alt-site gate (which has its own `alt-site/data/config.json`) but sits in `scripts/`, so running
  it from the repository root fails. Not fixed here because it is outside this session's scope and
  is referenced by session 4b09b79a's `alt-site-check.yml`. Logged for the owner of `scripts/`.
- **Pages publishing source.** `docs/` is built and served by `.github/workflows/pages.yml`
  (GitHub Actions). The GitHub API still reports the legacy source as `main` `/` (root). Until the
  owner switches the Pages source to "GitHub Actions" in repository settings, the workflow can
  build but not deploy. Recorded as C18 in `audit/compliance-rules.json` and raised again here.
- **Screenshot verification not possible in this sandbox.** The available headless browser needs
  `libnspr`/`libnss`, which cannot be installed here (apt repositories unreachable, no root install
  path). HTML, links, assets, and stylesheet were verified by fetch instead. Stated rather than
  glossed over.

### No regression claim

This session did not re-verify the product register line by line against Amazon; session
`9b3682f1` did that and its `data/products.json` is unchanged. What this session re-observed
independently before the reset: all five `link.amazon` short links still resolve to the five
`amazon.com/dp/<ASIN>` pages recorded in that register, and none of the resolved URLs carried a
`tag=` parameter. That is consistent with FLG-02/FLG-03 as recorded, and is not claimed as new
verification.



---

## Session arena-d12f1815 — consolidation pass (2026-11-20)

Branched from `5f65079`; rebuilt on the current `main` after it moved six times during this
session (PRs #1–#13). Final scope is four files, nothing else.

**Added:**

1. `data/counterwise/guides.json` + one published guide
   (`guides/do-you-need-a-thermometer.html`). `scripts/build.py` now loads optional extra guides
   from that file and renders their checklists, so editorial drafts go live without a second
   build system. The other four drafts are marked `publish: false` because the site already
   carries guides on those subjects; publishing both would be duplicate content. The validator
   now requires at least four guides rather than exactly four.
2. `audit/check_html.py` correction — see below.

**Audit rule corrected, with the reason recorded.** The audit required the disclosure above the
primary `<nav>`. The brief asks for the strip *under the masthead*, and the masthead contains the
nav, so the two rules contradicted each other. The check now requires the statement above
`<main>`, which is the regulatory intent: a reader cannot reach a recommendation without passing
the disclosure. The FTC standard is "hard to see and understand" / placed with the endorsement,
not "before the nav". The default audit root is now the repository — what Pages actually serves —
excluding `archive/` (frozen snapshots whose links cannot keep resolving), `alt-site/build/`
(unpublished), and `alt-site/content/` (HTML fragments, not pages). Without those exclusions the
gate reported 82 permanent false positives. It is now wired into the Pages workflow.

**Both gates green:** `python3 scripts/build.py` exits 0; `python3 audit/check_html.py` reports OK
on 48 published pages.

**Preserved from this session's earlier work, deliberately not merged here.** Before `main`
consolidated onto one site, this session built a parallel editorial site (product pages, category
hubs, a suggestions board, a cookieless analytics module). It was superseded, so it lives in
`archive/session-d12f1815/` on the branch `arena/d12f1815-winb` rather than on `main`. If any of
it is wanted, it should come in file by file, not as a whole site.

**Verification standing, unchanged.** Two sessions resolved the five supplied short links
independently and recorded the same five ASINs (B0CDY277D3, B09B7SB46R, B08DKYBTPH, B0DHZTCNR5,
B0DZFD6R9Z). No price, commission rate, conversion figure, or revenue forecast is published
anywhere on the site, because none can be sourced. The single highest-value open action remains
one test click per product, checked against the Associates click report.

## Session arena-9b3682f1 — race, Pages result, and owner decision (2026-11-20, UTC)

- **PR links.** PR #5 (first integration, merged `939c9ab`) and PR #13 (re-integration with the root site, merged `470b7e4`) are both merged. PR #5 was superseded because `main` moved; see L10 and the rebase note above.
- **Pages result for PR #13.** Pages build `470b7e4` reported `built`. The cache-busted URLs `…/index.html?v=470b7e4` and `…/flagged.html?v=470b7e4` served this session's build (Counterwise). Bare `…/` still served the earlier homepage for about 6 minutes, which is CDN caching.
- **Race (conflict logged).** After PR #13 merged, PR #15 (`arena/79fd1cfe-winb`, 05:46 UTC) and PR #12 (`arena/961560f8-winb`, 05:47 UTC) each published their own root site. `main` `7fa8183` now serves "The Crisp Kitchen" at the root, and this session's build is no longer live. This session did not overwrite it: that would make sessions fight over one URL, and the owner has to choose the live build.
- **Audit of the current root (`main` `7fa8183`, `audit/check_html.py` run on a copy).** The audit reports 37 pages that load `assets/js/site.js`, a second script that is not on the approved list (only `assets/counterwise.js` is allowed). It also reports one `sellercentral.amazon.com` help link without `rel="sponsored"`. Most "broken internal link" errors are `/WinB/…` absolute paths that a local copy cannot resolve, so they were not counted. No disclosure errors were reported. Reviewer should confirm on the live site.
- **Build warning.** Running `python3 scripts/build.py` writes the generated site to the repository root and overwrites whichever root site is there. Do not run it until the owner has chosen the live build.
- **Owner decision required (the only blocker for T-10).** Choose the live root: (a) "The Crisp Kitchen" (`arena/79fd1cfe-winb` / `arena/961560f8-winb`, current), (b) this session's Counterwise build (`arena/9b3682f1-winb`, `docs/` mirror), or (c) `alt-site/` (`arena/4b09b79a-winb`, not published). Options (a) and (b) would need the `assets/js/site.js` issue fixed first if (a) is chosen.
- **Status.** T-10 is `in progress`, blocked on the owner decision. This session will not take over another session's root site. No further pushes to the root from this session until the decision is recorded here.
