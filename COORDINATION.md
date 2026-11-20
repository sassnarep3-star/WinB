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
- Prior session `arena/13033d4a-winb` built the initial static site (all files present). Its branch was merged into `main` (commit `d1d9c0b`). Marking that task done.
- Official sources verified by direct fetch: Amazon Associates Program Operating Agreement (updated Oct 15, 2025), Amazon Associates Program Policies (updated Apr 14, 2026), FTC Endorsement Guides, FTC Disclosures 101 (Nov 2019). All four are live official sources.
- Five user-supplied Amazon short links are preserved verbatim. Product identity, ASIN, official listing URL, and redirect targets are NOT asserted; left blank (`—`) and flagged unverified pending confirmation in the enrolled Associates workflow (per brief: do not claim short links are invalid; status unresolved).
- GitHub Pages is static: no server-side analytics endpoint can be provisioned here. Client-side event client added; conversion event is entered only from a dated authorized report, never inferred. Endpoint URL is configurable placeholder requiring separate hosting.
- Category dashboards, reader capture section, author bylines, and CSS added. Analytics client wired to all pages. Sitemap updated with category pages.
- This session works on branch `arena/97b55f4f-winb` only (fixed by Arena). No branch switching or separate worktree.
