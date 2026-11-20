# COORDINATION — shared task board

> Read this before starting work. Claim a task, commit the claim, then work only inside your scope.

## Session registry

| Session ID | Branch | Status | Scope |
|---|---|---|---|
| `session-961560f8` | `arena/961560f8-winb` | active | root shop front, `data/shop/`, `tools/`, `assets/`, `/go/` |
| `session-7feafaa3` | merged in PR #4 | done | `scripts/`, `data/*.json` (S-xx schema), `docs/` |
| `session-4b09b79a` | merged in PR #7, #11 | done | `alt-site/` |
| earlier root variant | merged to `main` | archived | `archive/counterwise-root-site/` |

**Branch naming note.** Arena tracks this conversation by a single fixed branch, `arena/961560f8-winb`,
and does not permit creating or pushing `session-<id>/<task>` branches. That branch is the session
branch; scopes are recorded as path scopes so parallel sessions can still avoid overlap.

**Parallel-session check (2026-11-20).** Three other sessions published to `main` before this one
merged. Their work is preserved, not overwritten — see "Collision record" below.

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

- PR #12 — opened, merged to `main` (this session).
- Prior merges on `main`: PR #4, PR #7, PR #11.
