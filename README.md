# Counterwise

A publication-style Amazon Associates site: a shop-first front page with five verified kitchen products (three air fryers, two meat thermometers), question-shaped buying guides, a transparent source register, and an explicit flag register for everything still unverified.

## Live site

`https://sassnarep3-star.github.io/WinB/` — published by `.github/workflows/pages.yml` on every push to `main`.

## Pages

| Path | Purpose |
|---|---|
| `/` | Publication front page: shortlist first, guides second, dashboards in the footer |
| `/products/` | Shop + full source register (intent vs observed vs catalog facts) |
| `/products/air-fryers/`, `/products/thermometers/` | Category pages |
| `/guides/` + four guide articles | Question-shaped buying guides (added to sitemap + feed on publish) |
| `/review/` | Verification results, campaign ledger, disclosure & policy gates |
| `/direction/` | Executive summary, suggestions register, path chooser, open questions, cadence |
| `/flags/` | Flagged for Review — every open item with sources and closing steps |
| `/analytics/` | Five defined events, endpoint status, Search Console + reader-capture steps |

## Preview locally

```bash
python3 -m http.server 8000
```

## Publishing gate

```bash
python3 scripts/check_site.py
```

Fails the build unless: the disclosure strip sits under the masthead and repeats in the footer on every page; every retail Amazon link carries `rel="sponsored"`; every `/dp/` link carries `tag=shopnow047c-20` and `data-outbound`; every page is in `sitemap.xml` and vice versa; `feed.xml` and internal links resolve; `robots.txt` points at the sitemap; the event layer is loaded. Human gates (endorsement context, intent confirmation, report attribution) stay on `/flags/`.

## Evidence boundary

- The five supplied short links were resolved live on **2026-11-20**; each landed on an official Amazon listing, recorded as an observation in the source register — never merged with the (blank) intent fields.
- Price, rating, commission, traffic, clicks, and orders are **blank by design**: no authorized, dated source exists (FLG-004/005/009). Nothing is inferred.
- The Associates tag `shopnow047c-20` is embedded in all Special Links; report attribution is untested pending the enrolled-workflow check (FLG-002).
- Official sources used: Amazon Associates Program Policies (read 2026-11-20, page: updated 2026-04-14), Amazon's ASIN definition, Google's `rel="sponsored"` guidance, FTC endorsement guidance — all linked on `/review/` and `/flags/`.
