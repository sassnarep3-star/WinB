# Coordination board

Repository: `sassnarep3-star/WinB` · Status values: `unclaimed` · `in progress` · `done` · `needs review` (published on the Flagged for Review page; does not block anything).

## Task board (publication site — sessions 13033d4a and 97b55f4f)

| Task | Status | Owner session | Scope |
|---|---|---|---|
| Publication-style static site, evidence/decision pages, SEO artifacts, Pages workflow | done | `arena/13033d4a-winb` | `index.html`, `styles.css`, `guides/`, `review/`, `feed.xml`, `sitemap.xml`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Category subpages (air fryers, kitchen appliances) as publication dashboards | done | `arena/97b55f4f-winb` | `guides/category/air-fryers.html`, `guides/category/kitchen-appliances.html` |
| Privacy-preserving outbound-click counter + self-hosted analytics client (5 events) | done | `arena/97b55f4f-winb` | `assets/counterwise.js`, wired into `index.html`, guides, category pages, review page |
| Verification hardening: source links on every table row, unverified flags, executive summary | done | `arena/97b55f4f-winb` | `review/index.html`, `sitemap.xml`, `feed.xml`, `README.md` |
| Integration: commit, push, PR to main, merge, confirm GitHub Pages deploy, record result | superseded — performed by `arena/7feafaa3-winb` (see L10) | `arena/97b55f4f-winb` (handed over) | all files |

## Task board (register and verification — session 7feafaa3)

Branch `arena/7feafaa3-winb`. Scopes are kept disjoint: the register writes only to `register/`, `data/`, `scripts/`, and the workflow `site.yml`.

| ID | Task | Status | Owner (session) | Files touched | Notes |
|---|---|---|---|---|---|
| T1 | Repo review + irregularity log | done | 7feafaa3 | `COORDINATION.md`, `data/flags.json` | See log entries L2–L4 |
| T2 | Product intent confirmation record (5 products) | done | 7feafaa3 | `data/products.json` | Intended ASIN left blank; redirect target kept separate |
| T3 | Compliance gate: disclosure, Special Links, policy checks | done | 7feafaa3 | `data/compliance.json`, `scripts/check_site.py` | Primary sources only |
| T4 | Verification register (sources) | done | 7feafaa3 | `data/sources.json` | Every source fetched 2026-11-20 |
| T5 | Findings, questions, suggestions (decision board) | done | 7feafaa3 | `data/findings.json`, `data/questions.json`, `data/suggestions.json` | Nothing implemented without a choice |
| T6 | Campaign ledger (empty, schema only) | done | 7feafaa3 | `data/ledger.json` | No conversion score, no forecast |
| T7 | Static site generator + checks | done | 7feafaa3 | `scripts/build_site.py`, `scripts/check_site.py`, `.github/workflows/site.yml` | |
| T8 | Site output (landing, categories, dashboards, Flagged page) | done | 7feafaa3 | `docs/` (generated) | Built from `data/` only |
| T9 | Integration: re-verify combined data, build, links, publish | in progress | 7feafaa3 | `docs/`, `README.md`, this file | Final integration session |
| T10 | Click counter, self-hosted analytics, Search Console, reader capture (SG-27..SG-30) | needs review | 7feafaa3 | none | Not implemented: needs a hosting/analytics decision (see Suggestions D3) |

## Session log

- 2026-11-20 — Session `arena/97b55f4f-winb` started on branch `arena/97b55f4f-winb` (branched from `d1d9c0b`). Working tree clean.
- Prior session `arena/13033d4a-winb` built the initial static site (all files present). Its branch was merged into `main` (commit `d1d9c0b`, PR #1). GitHub Pages deployment run 44681379093 succeeded. Marking that task done.
- Official sources verified by direct fetch: Amazon Associates Program Operating Agreement (updated Oct 15, 2025), Amazon Associates Program Policies (updated Apr 14, 2026), FTC Endorsement Guides, FTC Disclosures 101 (Nov 2019). All four are live official sources.
- Five user-supplied Amazon short links are preserved verbatim. Product identity, ASIN, official listing URL, and redirect targets are NOT asserted; left blank (`—`) and flagged unverified pending confirmation in the enrolled Associates workflow (per brief: do not claim short links are invalid; status unresolved).
- GitHub Pages is static: no server-side analytics endpoint can be provisioned here. Client-side event client added; conversion event is entered only from a dated authorized report, never inferred. Endpoint URL is configurable placeholder requiring separate hosting.
- Category dashboards, reader capture section, author bylines, and CSS added. Analytics client wired to all pages. Sitemap updated with category pages.
- This session works on branch `arena/97b55f4f-winb` only (fixed by Arena). No branch switching or separate worktree.

### 7feafaa3 (register and integration)

- **L1 · 2026-11-20 · 7feafaa3 · claim.** Claimed T1–T10 on branch `arena/7feafaa3-winb`. Repo at claim time contained only `README.md` (`# WinB`) and no `COORDINATION.md`; this file was created.
- **L2 · 2026-11-20 · T1 repo review.** `git log --all` shows one commit (`5f65079 Initial commit`). No build system, no data, no tests. Only one remote branch (`main`). Irregularity: the brief references IDs (FLG-003, S01, S02, S07, S24, SG-27..SG-30, Priority 4/5) and a "source register" that are not in this repository. They cannot be traced here and were not reproduced. See Flagged for Review, FLG-07.
- **L3 · 2026-11-20 · T2 product pages.** Resolved the five supplied `link.amazon` short links with the page fetcher. Each resolved to an Amazon product page whose URL carries a 10-character ASIN that differs from the 9-character code in the short link. See `data/products.json` and FLG-01, FLG-02.
- **L4 · 2026-11-20 · T3/T4 policy sources.** Fetched primary sources: Associates Operating Agreement (§5, §6), Associates Program Policies (§2(a)(b), §3, §4, §6(g)(q)(s)(t)(v)(w)(y)), FTC *Disclosures 101 for Social Media Influencers*, eCFR 16 CFR Part 255 (table of contents only), Google Search Central "Qualify your outbound links", sitemaps.org protocol, RSS 2.0 specification, GitHub Docs (Pages publishing source). The Amazon ASIN help page did not load and is **not** cited. See FLG-16.
- **L5 · 2026-11-20 · T1–T9 completed on this branch.** Pending: integration build, link check, PR to `main`, merge, GitHub Pages deploy check. Results will be recorded below.
- **L6 · 2026-11-20 · T10 deferred.** A self-hosted click counter and analytics endpoint cannot run on GitHub Pages (static hosting). Search Console needs a Google account owned by the user. Logged as `needs review`; options are on the Suggestions page (D3).
- **L7 · 2026-11-20 · T2–T8 verification performed.** (a) Each product row was checked against its own Amazon /dp/ page: the ASIN in the URL, the listing title and the breadcrumb (Air Fryers / Thermometers & Timers > Meat). Prices and ratings were not recorded (Policies §2(b), §6(t)). (b) Each policy rule in `data/compliance.json` was taken from the primary text listed in `data/sources.json`; the eCFR entry covers only the §255.5 title (FLG-18). (c) `scripts/check_site.py` verifies: intended ASIN blank; observed ASIN consistent across fields; price/rating blank; every table row with an official source; every Amazon link `rel="sponsored"`; disclosure above the navigation and in the footer; no broken internal link; no script tag; sitemap and RSS parse. Negative test: an injected unlisted host and a missing `rel="sponsored"` were both reported.
- **L8 · 2026-11-20 · working name.** Renamed the working site name from "Countertop Picks" to "Kitchen Picks", because one of the products is a thermometer. Not a final brand (FLG-12, Q9).
- **L9 · 2026-11-20 · T9 integration.** Pending: rebuild check (CI workflow `site-check`), PR to `main`, merge, GitHub Pages enablement and live-URL check. Results to follow in L10.
- **L10 · 2026-11-20 · integration with `main`.** PR #4 was reported `CONFLICTING` because `main` had moved (PRs #2 and #3 from sessions `13033d4a` and `97b55f4f`). Merged `origin/main` (`63667cc`) into `arena/7feafaa3-winb`. Conflicts were only in `COORDINATION.md` and `README.md`; both were resolved by keeping both sessions' rows, logs and sections. No file from another session was deleted or rewritten, except the links listed below.
  - Handover: the integration row owned by `97b55f4f` was still `in progress` with no commit since PR #3. This session performed the integration on this branch so the site could be merged and published. The row is marked `superseded` with a pointer here, and its owner can object in the log.
  - Pages publishes the repository root via `.github/workflows/pages.yml`, so the register is written to `register/` (not `docs/`). The Pages source does not need to change.
  - Edits to other sessions' files, all additive: a "Verification register" link added to the navigation group and footer of 8 pages (`index.html`, `guides/*`, `guides/category/*`, `review/index.html`). `sitemap.xml` regenerated to list every HTML page (21). `feed.xml` (the guides feed) left unchanged.
  - Checked, not changed: the short links on `review/index.html` already carry `rel="sponsored noopener"` (FLG-22, logged). The newsletter form has no backend (FLG-20). The analytics client names five events not listed in the brief (FLG-21). The earlier "no product matched" framing differs from this register's observed listing pages (FLG-19).
- **L11 · 2026-11-20 · checks after integration.** `scripts/check_site.py` now checks all 21 HTML pages in the repository (not only the register): disclosure above the navigation and in the footer; `rel="sponsored"` on every Amazon product link; allow-listed external hosts; internal links and anchors; only `assets/counterwise.js` is an allowed script; source link on every data-table row; every page links to the register; sitemap lists every page; `feed.xml` and `sitemap.xml` parse. Result: OK.
