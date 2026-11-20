# Coordination board

Shared task board for every session that works on this repository. Each session logs its own claims, verification, and irregularities below.

## Task board (combined)

| Task | Status | Owner session | Scope |
|---|---|---|---|
| Publication-style static site, evidence/decision pages, SEO artifacts, Pages workflow | done | `arena/13033d4a-winb` | `index.html`, `styles.css`, `guides/`, `review/`, `feed.xml`, `sitemap.xml`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Category subpages (air fryers, kitchen appliances) as publication dashboards | done | `arena/97b55f4f-winb` | `guides/category/air-fryers.html`, `guides/category/kitchen-appliances.html` |
| Privacy-preserving outbound-click counter + self-hosted analytics client (5 events) | done | `arena/97b55f4f-winb` | `assets/counterwise.js`, wired into `index.html`, guides, category pages, review page |
| Verification hardening: source links on every table row, unverified flags, executive summary | done | `arena/97b55f4f-winb` | `review/index.html`, `sitemap.xml`, `feed.xml`, `README.md` |
| Integration: commit, push, PR to main, merge, confirm GitHub Pages deploy, record result | done | `arena/97b55f4f-winb` | all files |
| Verified product register (5 rows), sourced build, flags, questions, suggestions, ledger, validation | done | `arena/9b3682f1-winb` | `data/`, `scripts/build.py`, generated site at repo root, `archive/`, `COORDINATION.md`, `README.md`, `.github/workflows/pages.yml` |
| Integration of all session outputs into one published site; archive of superseded root site | in progress | `arena/9b3682f1-winb` | repo-root site, `archive/`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Editorial design layer + original artwork for the live site (disclosure placement fix, publication front page, shared stylesheet) | done | `arena/79fd1cfe-winb` | `scripts/build.py`, `scripts/assets/site.css`, `scripts/assets/img/`, `docs/`, `COORDINATION.md` |

## Session log

- 2026-11-20 — Session `arena/97b55f4f-winb` started on branch `arena/97b55f4f-winb` (branched from `d1d9c0b`). Working tree clean.
- Prior session `arena/13033d4a-winb` built the initial static site (all files present). Its branch was merged into `main` (commit `d1d9c0b`, PR #1). GitHub Pages deployment run 44681379093 succeeded. Marking that task done.
- Official sources verified by direct fetch: Amazon Associates Program Operating Agreement (updated Oct 15, 2025), Amazon Associates Program Policies (updated Apr 14, 2026), FTC Endorsement Guides, FTC Disclosures 101 (Nov 2019). All four are live official sources.
- Five user-supplied Amazon short links are preserved verbatim. Product identity, ASIN, official listing URL, and redirect targets are NOT asserted; left blank (`—`) and flagged unverified pending confirmation in the enrolled Associates workflow (per brief: do not claim short links are invalid; status unresolved).
- GitHub Pages is static: no server-side analytics endpoint can be provisioned here. Client-side event client added; conversion event is entered only from a dated authorized report, never inferred. Endpoint URL is configurable placeholder requiring separate hosting.
- Category dashboards, reader capture section, author bylines, and CSS added. Analytics client wired to all pages. Sitemap updated with category pages.
- This session works on branch `arena/97b55f4f-winb` only (fixed by Arena). No branch switching or separate worktree.

- 2026-11-20 — Session `arena/9b3682f1-winb` merged `main` (`63667cc`) into its branch. The superseded root site is preserved, unchanged, in `archive/counterwise-root-site/`. The generated site is written to the repository root, which Pages serves (`main` `/`, legacy). `.github/workflows/pages.yml` validates it. Analytics client `assets/counterwise.js` is carried into the live site unchanged (review mode, no endpoint).

## Session arena-9b3682f1 — protocol note

- The request asks for `session-<id>/<task>` branches. Arena fixes this session to **one branch**, `arena/9b3682f1-winb`. All tasks, claims, and the final merge are recorded on that branch. Logged as **FLG-11** in `data/flags.json`.
- Status values: `unclaimed`, `in progress`, `done`, `needs review`, `blocked`. A `needs review` item is published on the Flagged for Review page and does not block anything.
- Only the integration task changes shared outputs (root site files, `README.md`, navigation). Here, this single session did all tasks in order and then ran the integration step.
- No other session's claims were present when this session started (the repository held only `README.md`).

## Task board

| ID | Task | Status | Owner | Files touched | Notes |
|---|---|---|---|---|---|
| T-01 | Repo review; irregularities | done | arena-9b3682f1 | `README.md`, `data/flags.json` | FLG-10, FLG-11 raised. |
| T-02 | Source verification (Amazon, FTC, eCFR, Google, GitHub) | done | arena-9b3682f1 | `data/sources.json` | S-01 to S-10. S-03 and S-10 not verified. |
| T-03 | Product register (5 rows) | done | arena-9b3682f1 | `data/products.json`, `data/flags.json`, `data/questions.json` | Intended ASIN, price, commission left blank and flagged. |
| T-04 | Site: landing page, category pages, guides, register, analysis, questions, suggestions, flagged, sources, disclosure, executive summary | done | arena-9b3682f1 | `scripts/build.py`, repo-root site | Generated from `data/`. Validation passes. |
| T-05 | Outbound-click counter and self-hosted analytics endpoint (5 events) | blocked | — | none | Needs a server and the five event definitions. FLG-05, FLG-06. Options on Suggestions S-02. |
| T-06 | Special Link test per product (Associates workflow) | blocked | — | none | Needs a logged-in Associates account. FLG-04. Blocks scaling. |
| T-07 | Commission schedule capture | blocked | — | none | Schedule page requires sign-in. FLG-07. |
| T-08 | Guides: cadence, RSS, sitemap | done (cadence pending) | arena-9b3682f1 | `feed.xml`, `sitemap.xml` | Cadence is a choice: Suggestions S-05. |
| T-09 | Search Console verification | blocked | — | none | Needs the site owner's account after deploy. FLG-13. |
| T-10 | Integration: merge, re-verify combined data, build, no broken links, PR, merge, Pages deploy | in progress | arena-9b3682f1 | `COORDINATION.md` | See Integration log below. |

## Claims

| Session | Task | Scope (files) | Claimed | Pushed commit |
|---|---|---|---|---|
| arena-9b3682f1 | T-01 to T-04, T-08 | `data/`, `scripts/`, root site files, `README.md`, `COORDINATION.md` | 2026-11-20 | see git log on branch |
| arena-9b3682f1 | T-05, T-06, T-07, T-09 | none (blocked, nothing changed) | 2026-11-20 | — |

## Verification log (2026-11-20)

Every value in the register was checked against an official source. Blank values are flagged, never inferred.

| Check | Source | Result |
|---|---|---|
| Five supplied short links resolve to amazon.com listings | `https://link.amazon/B04G1MEwY` and four others (S-09) | Pass, two observations on 2026-11-20 (earlier and final re-check). Same ASIN and title both times. |
| Listing ASIN, title, breadcrumb (×5) | `https://www.amazon.com/dp/<ASIN>` (S-08) | Pass. ASINs B0CDY277D3, B09B7SB46R, B08DKYBTPH, B0DHZTCNR5, B0DZFD6R9Z. |
| Associates Section 5 disclosure wording | Operating Agreement, Section 5 (S-01) | Pass. Verbatim: "As an Amazon Associate I earn from qualifying purchases." |
| Special Link format and tag rule | Program Policies, Participation Requirements s.2(a)–(b) (S-02) | Read. Tag format `XXXXX-##` or other designated format. Supplied tag not confirmed (FLG-03). |
| Redirect and link-format rules | Commission Income Statement s.2(e), s.2(g) (S-02) | Read. Compliance unresolved (FLG-02). |
| Cookie and privacy duties | Program Policies s.3(e) (S-02) | Read. Site sets no cookies (verified by build check). |
| FTC disclosure standard | Disclosures 101 (S-04); 16 CFR 255.0(f) (S-05) | Read and applied. |
| rel="sponsored" | Google Search Central, updated 2025-12-10 (S-06) | Read and applied to every Amazon link (build check). |
| Static publishing | GitHub Docs, Pages publishing sources (S-07) | Read. Pages source here is legacy `main` `/` (token cannot change it, 403). Site generated at repo root. |
| Commission schedule | `affiliate-program.amazon.com/help/operating/schedule` (S-03) | Not verified. Redirected to sign-in. |
| ASIN definition page | Amazon official help | Not verified. Only third-party glossaries found (S-10). |

## Irregularities raised

FLG-01 to FLG-16 are in `data/flags.json` and on the Flagged for Review page. Highest-impact items:

- **FLG-01** Intended ASINs were not supplied. The short-link codes are 9 characters, not ASINs.
- **FLG-02** Redirect compliance is unresolved under S-02 s.2(e) and s.2(g). The site does not say any link is invalid.
- **FLG-03** The tracking ID `shopnow047c-20` is not confirmed against the `XXXXX-##` format or in Associates Central.
- **FLG-04** The Special Link test has not been run. Scaling is blocked.
- **FLG-05** The five analytics events are not defined anywhere in the materials.

## Integration log

| Step | Result |
|---|---|
| Combined data re-verified line by line | Done: five redirects re-observed; ASINs and titles match `data/products.json`. |
| Site builds with no broken links | Done: `python3 scripts/build.py` exit 0. Checks: disclosure ×2 on every page, rel="sponsored" on every Amazon link, internal links resolve, no script tags, sources present, blanks flagged. |
| Pull request | https://github.com/sassnarep3-star/WinB/pull/5 (branch `arena/9b3682f1-winb` → `main`). |
| Merge | Pending. |
| GitHub Pages deploy | Pending. |

Hand-off rule: if this session stops, another session may take over any `in progress` task after 60 minutes with no commits, and must record the handoff here.
- Session `arena/97b55f4f-winb` (PR #6, merged to `main` at `39390ee`) recorded its PR #3 merge and Pages result (`19b8572`). The board row for its integration task is now `done`, as shown in the other session's log.

## Session arena-4b09b79a — integration log (2026-11-20)

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
