# COORDINATION.md — shared task board

Repository: `sassnarep3-star/WinB` · Working branch: `arena/7feafaa3-winb` (base `main` @ `5f65079`)

Status values: `unclaimed` · `in progress` · `done` · `needs review` (published on the Flagged for Review page; does not block anything).

**Branch note:** the session rules in the brief ask for `session-<id>/<task>` branches. Arena fixes each session to one branch (`arena/7feafaa3-winb`), so all tasks below are claimed and completed on that single branch by session `7feafaa3`. Scopes are kept disjoint by directory (see "Files touched").

## Task board

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

## Files touched (scope map)

- `data/*.json` — source data (all tasks write only their own file)
- `scripts/*.py`, `.github/workflows/site.yml` — tooling
- `docs/` — generated output (rebuilt by `scripts/build_site.py`; do not hand-edit)
- `COORDINATION.md`, `README.md` — coordination and documentation

## Log

- **L1 · 2026-11-20 · 7feafaa3 · claim.** Claimed T1–T10 on branch `arena/7feafaa3-winb`. Repo at claim time contained only `README.md` (`# WinB`) and no `COORDINATION.md`; this file was created.
- **L2 · 2026-11-20 · T1 repo review.** `git log --all` shows one commit (`5f65079 Initial commit`). No build system, no data, no tests. Only one remote branch (`main`). Irregularity: the brief references IDs (FLG-003, S01, S02, S07, S24, SG-27..SG-30, Priority 4/5) and a "source register" that are not in this repository. They cannot be traced here and were not reproduced. See Flagged for Review, FLG-07.
- **L3 · 2026-11-20 · T2 product pages.** Resolved the five supplied `link.amazon` short links with the page fetcher. Each resolved to an Amazon product page whose URL carries a 10-character ASIN that differs from the 9-character code in the short link. See `data/products.json` and FLG-01, FLG-02.
- **L4 · 2026-11-20 · T3/T4 policy sources.** Fetched primary sources: Associates Operating Agreement (§5, §6), Associates Program Policies (§2(a)(b), §3, §4, §6(g)(q)(s)(t)(v)(w)(y)), FTC *Disclosures 101 for Social Media Influencers*, eCFR 16 CFR Part 255 (table of contents only), Google Search Central "Qualify your outbound links", sitemaps.org protocol, RSS 2.0 specification, GitHub Docs (Pages publishing source). The Amazon ASIN help page did not load and is **not** cited. See FLG-16.
- **L5 · 2026-11-20 · T1–T9 completed on this branch.** Pending: integration build, link check, PR to `main`, merge, GitHub Pages deploy check. Results will be recorded below.
- **L6 · 2026-11-20 · T10 deferred.** A self-hosted click counter and analytics endpoint cannot run on GitHub Pages (static hosting). Search Console needs a Google account owned by the user. Logged as `needs review`; options are on the Suggestions page (D3).
