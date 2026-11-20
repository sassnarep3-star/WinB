# COORDINATION — shared task board

> Read this file before starting work. Claim a task, commit the claim, then work only inside your scope.

## Session registry

| Session ID | Branch | Status | Scope |
|---|---|---|---|
| `session-961560f8` | `arena/961560f8-winb` | active | all paths (sole session) |

**Note on branch naming.** The Arena environment tracks this conversation by a single fixed branch,
`arena/961560f8-winb`, and does not permit creating or pushing `session-<id>/<task>` branches. That
branch is therefore the session branch. Scopes below are recorded as path scopes so that a future
parallel session can still avoid overlap.

**Parallel-session check (2026-11-20).** No other session exists in this repository at claim time:
`git log` shows a single initial commit (`5f65079`) and no other branches besides `main`. No task was
claimed by anyone else. No merge conflict has occurred.

## Task board

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T-01 | Repo review + source register | in progress | session-961560f8 | `data/sources.json`, `data/repo-review.json`, `evidence/` |
| T-02 | Resolve the five supplied short links | in progress | session-961560f8 | `data/products.json`, `data/link-audit.json` |
| T-03 | Compliance gate (disclosure, claims, link rules) | unclaimed | — | `compliance/`, `assets/js/analytics.js` |
| T-04 | Shop front page + category pages | unclaimed | — | `index.html`, `products/` |
| T-05 | Guides (question-shaped) | unclaimed | — | `guides/` |
| T-06 | Suggestions & decisions register | unclaimed | — | `decisions/` |
| T-07 | Open questions / missing information register | unclaimed | — | `decisions/questions.html` |
| T-08 | Flagged for Review page | unclaimed | — | `flagged/` |
| T-09 | Build tooling + link/source checker | unclaimed | — | `tools/` |
| T-10 | Final integration: merge, verify, publish | unclaimed | — | `main` |
