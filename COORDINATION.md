# Coordination board

| Task | Status | Owner session | Scope |
|---|---|---|---|
| Publication-style static site, evidence/decision pages, SEO artifacts, Pages workflow | done | `arena/13033d4a-winb` | `index.html`, `styles.css`, `guides/`, `review/`, `feed.xml`, `sitemap.xml`, `.github/workflows/pages.yml`, `COORDINATION.md`, `README.md` |
| Category subpages (air fryers, kitchen appliances) as publication dashboards | done | `arena/97b55f4f-winb` | `guides/category/air-fryers.html`, `guides/category/kitchen-appliances.html` |
| Privacy-preserving outbound-click counter + self-hosted analytics client (5 events) | done | `arena/97b55f4f-winb` | `assets/counterwise.js`, wired into `index.html`, guides, category pages, review page |
| Verification hardening: source links on every table row, unverified flags, executive summary | done | `arena/97b55f4f-winb` | `review/index.html`, `sitemap.xml`, `feed.xml`, `README.md` |
| Integration: commit, push, PR to main, merge, confirm GitHub Pages deploy, record result | in progress | `arena/97b55f4f-winb` | all files |

## Session log

- 2026-11-20 — Session `arena/97b55f4f-winb` started on branch `arena/97b55f4f-winb` (branched from `d1d9c0b`). Working tree clean.
- Prior session `arena/13033d4a-winb` built the initial static site (all files present). Its branch was merged into `main` (commit `d1d9c0b`, PR #1). GitHub Pages deployment run 44681379093 succeeded. Marking that task done.
- Official sources verified by direct fetch: Amazon Associates Program Operating Agreement (updated Oct 15, 2025), Amazon Associates Program Policies (updated Apr 14, 2026), FTC Endorsement Guides, FTC Disclosures 101 (Nov 2019). All four are live official sources.
- Five user-supplied Amazon short links are preserved verbatim. Product identity, ASIN, official listing URL, and redirect targets are NOT asserted; left blank (`—`) and flagged unverified pending confirmation in the enrolled Associates workflow (per brief: do not claim short links are invalid; status unresolved).
- GitHub Pages is static: no server-side analytics endpoint can be provisioned here. Client-side event client added; conversion event is entered only from a dated authorized report, never inferred. Endpoint URL is configurable placeholder requiring separate hosting.
- Category dashboards, reader capture section, author bylines, and CSS added. Analytics client wired to all pages. Sitemap updated with category pages.
- This session works on branch `arena/97b55f4f-winb` only (fixed by Arena). No branch switching or separate worktree.


---

## Integration session (arena/4b09b79a-winb) — added 2026-11-20

This session took over the **final integration** step (the row above is still labelled `in progress` for
`arena/97b55f4f-winb`; this session did not delete or alter that claim). Reason: the repo's only live site was the
earlier Counterwise publication, while the brief asks for one combined, verified site. Both sites' work is preserved in git.

### Integration decisions (logged for review)

| # | Decision | Why | Reversible? |
|---|----------|-----|-------------|
| I-1 | The earlier Counterwise site moved (`git mv`, history kept) to `archive/counterwise/`. It is **not** deployed. | One published site; its email form has no backend and makes privacy claims that are not verified (FLG-016). | Yes — `git mv` back. |
| I-2 | `.github/workflows/pages.yml` replaced: build → compliance gate → deploy `_site/`. Deploy runs on `main` only. | The old workflow published the repo root, which would publish the archive. | Yes. |
| I-3 | Analytics events aligned to the five names already in the repo: `page_view`, `outbound_click`, `guide_engaged`, `disclosure_view`, `affiliate_conversion_reported`. The conversion event is never sent from the browser; it comes only from a dated authorized report (ledger). | Avoid two competing event sets. | Yes. |
| I-4 | Landing page is now product-first; the five products appear before guides and verification (per brief). | Brief: lead with products. | Yes. |

### Task board (this session)

| ID | Task | Status | Owner | File scope | Notes |
|----|------|--------|-------|------------|-------|
| T-01 | Repo review + irregularity log | done | arena/4b09b79a-winb | `data/flagged.json`, this file | FLG-010 |
| T-02 | Product intent confirmation records (5 links) | done (flags open) | arena/4b09b79a-winb | `data/products.json` | Intended ASIN blank (FLG-001/002) |
| T-03 | Verification register | done | arena/4b09b79a-winb | `data/verification.json` | Each row links to an official source |
| T-04 | Disclosure + compliance gate | done | arena/4b09b79a-winb | `build/`, `scripts/check_site.py`, `.github/workflows/pages.yml` | Gate tested with planted violations |
| T-05 | Site build: landing, categories, guides, dashboards | done | arena/4b09b79a-winb | `build/`, `data/`, `content/` | Static, stdlib Python |
| T-06 | Measurement hook (5 events) | needs review | arena/4b09b79a-winb | `build/assets/analytics.js`, `data/config.json` | No endpoint deployed (FLG-007) |
| T-07 | Campaign ledger (empty) | done | arena/4b09b79a-winb | `data/campaign_ledger.csv` | Intentionally empty |
| T-08 | RSS, sitemap, robots, Search Console prep | done (Search Console needs owner) | arena/4b09b79a-winb | build output | FLG-008 |
| T-09 | Suggestions, open questions, executive summary | done | arena/4b09b79a-winb | `data/suggestions.json`, `data/questions.json`, `build/build.py` | Nothing implemented until a path is chosen |
| T-10 | Integration: merge, build, gate, PR to main, merge, Pages deploy | in progress | arena/4b09b79a-winb | all | Results recorded below |

### Source-verification log (this session)

- 2026-11-20 · Followed the five supplied `https://link.amazon/<token>` links; read titles, breadcrumbs and ASINs from the Amazon.com product pages they reach (`data/products.json`).
- 2026-11-20 · Read Associates Operating Agreement §5 (disclosure wording), Program Policies (Participation Requirements §1(g), §2(b), §2(g), §6(a); Commission Income Statement §2(c)–(e)), FTC Disclosures 101, GitHub Pages publishing docs, and actions/deploy-pages (usage `@v4`).
- Blocked, not verified: commission rates (schedule page requires sign-in, FLG-012); Special Link tests and tracking reports (no Associates account access, FLG-003).

### Irregularities (summary; full list on the Flagged for Review page)

- FLG-001 · Link tokens are 9 characters; observed ASINs are 10. Intended ASINs left blank.
- FLG-002 · Each short link reaches an ASIN that differs from its token.
- FLG-003 · Short-link compliance unresolved; not claimed invalid.
- FLG-004 · Tracking ID `shopnow047c-20` does not match the policy's `XXXXX-##` example; enrollment unconfirmed.
- FLG-016 · Archived Counterwise site has an email form (`action="#"`, no backend) and privacy claims not verified; not deployed.

### Results (recorded at merge time)

- PR: https://github.com/sassnarep3-star/WinB/pull/7 (`arena/4b09b79a-winb` → `main`), created 2026-11-20. CI on the PR: build + compliance gate **pass** (run 44682263851); deploy skipped on PR as designed.
- Merge result: _recorded below after merge_
- Pages deploy: _recorded below after deploy_
