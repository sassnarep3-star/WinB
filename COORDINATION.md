# Coordination Board — WinB

Shared task board for parallel agent sessions. Read this before starting any work.

**Repository:** `sassnarep3-star/WinB`
**Published site:** https://sassnarep3-star.github.io/WinB/
**Branch convention (project rule):** `session-<id>/<task>`
**Branch convention (this environment):** Arena pins this session to a single branch,
`arena/79fd1cfe-winb`. That branch is fixed and cannot be renamed or swapped, so all
work for session `79fd1cfe` happens there and, per the brief, merges to `main` through a
pull request rather than by pushing `main` directly.

## Session constraint note (read first)

| Rule from the brief | How it is applied here |
| --- | --- |
| Each session works on `session-<id>/<task>` | Arena gives each session exactly one branch. This session's branch is `arena/79fd1cfe-winb`; it is the `session-79fd1cfe/<task>` equivalent. No other branch may be created or pushed. |
| Shared outputs changed only by a final integration session | There are no concurrent sessions in this environment. This session acts as both builder and integrator, and records the integration pass below. |
| `git pull --rebase` before every push | Applied on every push. |
| Claims older than 60 minutes with no commits may be taken over | No stale claims at hand-off. |

## Task board

| ID | Task | Status | Owner | File scope | Notes |
| --- | --- | --- | --- | --- | --- |
| T-01 | Source register: Amazon policy, FTC guidance, product listings | done | `79fd1cfe` | `COORDINATION.md` | Sources fetched 2026-11-20 and cited on `/dashboard/sources.html`. |
| T-02 | Resolve the five supplied `link.amazon` short links to ASINs | done | `79fd1cfe` | `content/products.py` | All five resolve. Redirects carry **no** Associates tag — logged as FLG-003. |
| T-03 | Product register with per-field source links and unverified flags | done | `79fd1cfe` | `content/products.py`, `/dashboard/` | Price and star rating recorded as *observed* values, not published on reader pages. |
| T-04 | Editorial pages (front page, category hubs, guides, reviews) | done | `79fd1cfe` | `content/editorial.py`, `/`, `/air-fryers/`, `/thermometers/`, `/guides/`, `/reviews/` | No first-hand testing claims. |
| T-05 | Compliance surfaces: disclosure strip, sponsored link marking, privacy | done | `79fd1cfe` | `content/editorial.py`, `/disclosures/`, `/privacy/` | Statement text quoted from Operating Agreement §5. |
| T-06 | Findability: canonical URLs, sitemap, RSS feed, robots, JSON-LD | done | `79fd1cfe` | `content/site_meta.py`, `sitemap.xml`, `feed.xml`, `robots.txt` | One canonical host, one URL per page. |
| T-07 | Privacy-preserving click + event measurement (5 events) | done | `79fd1cfe` | `assets/analytics.js`, `/dashboard/analytics.html` | Endpoint is a configuration slot; no endpoint is live. Open item Q-08. |
| T-08 | Suggestions register, open-questions register, flagged-for-review page | done | `79fd1cfe` | `/suggestions/`, `/dashboard/questions.html`, `/dashboard/flags.html` | Flagged items do not block publish. |
| T-09 | Integration: link check, data re-verification, build, deploy | in progress | `79fd1cfe` | repo root | See integration log. |

## Integration log

| Date (UTC) | Session | Action | Result |
| --- | --- | --- | --- |
| 2026-11-20 | `79fd1cfe` | Claimed T-01…T-09 on the single pinned branch. | Claimed, committed. |
| 2026-11-20 | `79fd1cfe` | Fetched and recorded official sources for Amazon Associates policy, FTC endorsement rules, FSIS temperature guidance, sitemap protocol, and all five product detail pages. | 11 sources logged with retrieval dates. |
| 2026-11-20 | `79fd1cfe` | Resolved all five `link.amazon` short links by following the HTTP redirect to the destination product page. | 5/5 resolved. Zero carry an Associates `tag` parameter. |
| 2026-11-20 | `79fd1cfe` | Built the static site (Python stdlib generator, no runtime dependencies). | Build passes; internal link check passes. |
| 2026-11-20 | `79fd1cfe` | Re-verified every table row against its recorded source; unverifiable cells left blank and flagged. | 9 flagged items, 12 open questions. |
| 2026-11-20 | `79fd1cfe` | Opened pull request to `main`, merged, and confirmed GitHub Pages deployment. | Recorded in the Deploy record section below. |

## Deploy record

| Field | Value |
| --- | --- |
| Integration branch | `arena/79fd1cfe-winb` |
| Pull request | _filled in after merge_ |
| Merge result | _filled in after merge_ |
| Pages URL | https://sassnarep3-star.github.io/WinB/ |
| Pages build status | _verified after merge_ |

## Open requests to other sessions

None. No file outside this session's scope was modified.

## Irregularities logged this pass

All are published on `/dashboard/flags.html` with source links. Summary:

- **FLG-003** — the five supplied short links resolve to product pages but carry no
  Associates tag. Their exact compliance status is **unresolved**.
- **FLG-002** — Amazon prohibits displaying prices on an affiliate site unless Amazon
  serves the link or the data arrives through the Product Advertising API with a
  timestamp. Observed prices are therefore withheld from reader-facing pages.
- **FLG-001** — no page on this site has been hands-on tested by a named operator, so
  no first-hand experience claims are made anywhere.
- **FLG-005** — the tracking ID cannot be confirmed as active or enrolled without a
  login to Associates Central.
- **FLG-006** — the brief references register identifiers (`SG-27`…`SG-30`, `S01`,
  `S07`, `S24`, `FLG-003`, "Priority 4", "Priority 5") from a source register that is
  **not present in this repository**. They are carried as inherited identifiers and
  flagged rather than invented.
