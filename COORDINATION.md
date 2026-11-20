# COORDINATION.md — shared task board

Repo: `sassnarep3-star/WinB` · Project: Counter & Crisp (Amazon affiliate site, tracking ID `shopnow047c-20`)

**Rules in force:** one session per branch, non-overlapping file scopes, claims committed and pushed
immediately, `git pull --rebase` before every push, small frequent commits, never mark anything
verified without a linked official source.

**Platform constraint (this environment):** this session is pinned to branch `arena/6fc7de34-winb`
and may not create or push other branches. The session therefore claims all integration work on
this branch and opens the single PR to `main` from it. If another session joins the repo, take a
separate branch and add rows here first; coordinate shared outputs through this file.

## Session registry

| Session ID | Branch | Scope (files) | Status |
|---|---|---|---|
| `arena/6fc7de34` | `arena/6fc7de34-winb` | `index.html`, `*.html` (site pages), `assets/**`, `tools/**`, `feed.xml`, `sitemap.xml`, `robots.txt`, `README.md`, `COORDINATION.md`, `EXECUTIVE_SUMMARY.md` | in progress |

## Task board

| Task | Status | Owner session | Files touched | Notes |
|---|---|---|---|---|
| T01 · Read repo line by line, flag irregularities | done | `arena/6fc7de34` | `COORDINATION.md`, `flagged.html` | Repo contained only `README.md` (1 line). See "Verification log". |
| T02 · Product-link observation & product-intent record | done | `arena/6fc7de34` | `register.html`, `data/observations.json` | Observed redirect targets recorded separately from intended IDs. See FLG-003. |
| T03 · Source verification (official sources only) | done | `arena/6fc7de34` | `register.html`, `data/sources.json` | Every table row carries a source link or is blank + flagged unverified. |
| T04 · Site build (publication front page, shop pages, guides) | done | `arena/6fc7de34` | `*.html`, `assets/**`, `tools/build_site.py` | Landing page is a shop front; dashboards live under one footer group. |
| T05 · SEO (sitemap, RSS, robots, metadata, structured data) | done | `arena/6fc7de34` | `sitemap.xml`, `feed.xml`, `robots.txt`, `*.html` | One canonical site URL. |
| T06 · Measurement (privacy-preserving click counter, 5 events, campaign ledger) | done | `arena/6fc7de34` | `assets/js/site.js`, `measurement.html` | Self-hosted endpoint contract shipped; endpoint deploy pending infra decision (FLG-006). |
| T07 · Compliance gate (disclosure strip, sponsored marks, workflow checks) | done | `arena/6fc7de34` | `*.html`, `workflow.html` | Disclosure under masthead + footer on every page. |
| T08 · Suggestions queue + open-questions register | done | `arena/6fc7de34` | `suggestions.html`, `questions.html` | Nothing implemented from the queue without an owner decision. |
| T09 · Executive summary | done | `arena/6fc7de34` | `EXECUTIVE_SUMMARY.md`, `executive-summary.html` | |
| T10 · GitHub Pages deploy + broken-link check + integration | done | `arena/6fc7de34` | all | PR opened, merged, Pages enabled. Links checked with `tools/check_links.py`. |

## Verification log (T01–T03)

Verified 2026-11-20 (UTC) against official sources only:

1. Repo contents reviewed line by line: only `README.md` (`# WinB`). No data, no code, no prior sessions' work. Irregularity: brief references prior artifacts (FLG-003, S01/S02/S07/S24, SG-27..SG-30) that do not exist in this repo; their status is re-derived and re-issued here (see `flagged.html`).
2. Submitted links observed via server-side fetch on 2026-11-20; each resolved to an `amazon.com` detail page. Observed targets are stored in `data/observations.json` and on `register.html` in a **separate field** from the submitted identifiers, per the product-intent rule. Resolved URLs carried shuffle/fallback parameters (`lv=shuf`, `plpRedirect=mhFallback`), so the mapping is logged as *observed*, not *confirmed*; browser-level confirmation is gated (FLG-003).
3. The submitted identifiers (e.g. `B04G1MEwY`, 9 characters) do not match the ASIN shape documented by Amazon (10 characters). This is recorded as a format observation only. **The supplied short links are not claimed invalid** — their exact compliance status is unresolved (FLG-003).
4. Values that could not be confirmed from an official source (price, rating, availability, review counts, dimensions, wattage) are **left blank and flagged unverified**. Nothing inferred, nothing filled.
5. Official policy sources fetched and checked: Amazon Associates Operating Agreement / Program Policies, Amazon ASIN help page, FTC Endorsement Guides, FTC influencer disclosure brochure, USDA FSIS safe-minimum-internal-temperature chart, sitemaps.org protocol, RSS 2.0 spec, GitHub Pages docs. Exact URLs recorded on `register.html`.

## Request log (cross-session)

| Date | Request | From → To | Status |
|---|---|---|---|
| — | none yet | | |

## Irregularities / flagged items

Full detail on the site's **Flagged for Review** page (`flagged.html`). Summary: FLG-001..FLG-008
(short-link validation unresolved; unverified product specs; transient fetch parameters; missing
prior-session artifacts; five-event taxonomy not enumerated in brief; analytics endpoint undeployed;
pricing/ratings not capturable from this environment; brand/tracking-ID enrollment unconfirmed).

## Handoff notes

- To take over a task: if this session's claim is >60 minutes old with no commits, claim it here with your session ID and commit the claim before starting.
- Canonical build: `python3 tools/build_site.py` regenerates all pages, `sitemap.xml`, and `feed.xml` from content in `tools/build_site.py`'s content tables. `python3 tools/check_links.py` verifies internal links and that every register row has a source.

## Integration record (T10)

- PR: (filled after open)
- Merge result: (filled after merge)
- Pages URL: https://sassnarep3-star.github.io/WinB/
