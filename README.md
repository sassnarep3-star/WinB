# Counterwise — kitchen gear, chosen by question

A static Amazon Associates publication for five kitchen products: three air fryers and
two thermometers. Built for the WinB repository and published with GitHub Pages.

**Live site:** https://sassnarep3-star.github.io/WinB/
**Associate tag:** `shopnow047c-20`

---

## What this is

A shop, not an audit. Five product pages, two category hubs, a comparison table, eight
question-shaped guides, three printable worksheets, a 30-second chooser, and one RSS feed.
The compliance machinery is real but it lives under the floor — the front page leads with
products and decision tools, and every register is one click away in the footer.

The editorial position is narrow and deliberate: **this desk has not handled any of these
products.** Every page therefore describes what the manufacturer's listing states, shows
its arithmetic, and lists what it cannot tell you. No page contains a fabricated test
result, a borrowed star rating, or a price.

**Scope honesty.** This is a static publication with automated generation and a compliance
gate. It is not yet an AI-powered research/optimization platform: there is no live
trend/commission feed, no deployed analytics endpoint, and no verified conversion data.
See `EXECUTIVE-SUMMARY.md` §1 for what is automated today vs what needs owner credentials.

## The rules the build enforces

`node tools/verify.mjs` fails the build unless all eleven hold, and `node tools/gate.mjs`
adds R11–R15 for the editorial surfaces:

| | Rule |
|---|---|
| R1 | The Associates statement appears above the masthead **and** in the footer of every page |
| R2 | Every Amazon product link carries `?tag=shopnow047c-20` and `rel="sponsored nofollow noopener"` |
| R3 | No price, star rating, rating count or popularity position appears anywhere |
| R4 | No hands-on testing claim appears anywhere (disclaimers of that claim are allowed) |
| R5 | Every page has a canonical URL, a title ≥10 chars and a description ≥40 chars |
| R6 | Every internal `href`/`src` resolves to a real file |
| R7 | The sitemap is valid, single-host, and lists every indexable page; the RSS feed is valid RFC-822 |
| R8 | Every product page prints its ASIN and links to the listing with the tag |
| R9 | No page claims a traffic, click, conversion or revenue figure |
| R10 | Every affiliate exit page is indexable, disclosed, tagged and `rel="sponsored"` |
| R11 | A specification a listing states twice, differently, is published with **both** values |
| R12–R14 | (gate) Social images resolve; no metric presented as measured; disclosure before first heading; every class defined |
| R15 | (gate, S15) New guides are question-shaped, no invented demand, chooser present, worksheets printable |

## Commands

```bash
npm run build    # generate HTML, sitemap, feed, 404, artwork
npm run verify   # content rules R1-R11
npm run gate     # editorial rules R11-R15
npm run links    # crawl the built site, validate XML
npm run smoke    # fetch every URL at /WinB/ over HTTP (needs a local server on :3001)
npm run check    # build + verify + gate + links
```

## Layout

```
_build/            generators (data.mjs is the single source of truth)
  data.mjs         products, flags, questions, suggestions, sources, events, ledger
  listing-evidence.mjs  what each listing actually states, transcribed, with the
                   phrase it came from — wattage, temp range, models, warranty,
                   and Amazon's own review-theme counts
  decision-queue.mjs   the 10-proposal queue and the 9 questions blocking it
  tools-content.mjs  S15: new guides, worksheets, chooser, FAQ, November picks
  core.mjs         page shell, disclosure strip, masthead, footer
  editorial.mjs    front page, categories, product pages, comparison, guides, worksheets
  content-oversight.mjs  decision room, data room, flagged, methods, about, privacy
tools/             verify.mjs · gate.mjs · linkcheck.mjs · smoke.mjs
assets/            css/site.css · js/site.js · generated SVG artwork
analytics/         deployable collector-worker.js + schema (NOT running)
reviews/           five product pages (generated)
guides/            eight guides (generated)
tools/             three printable worksheets + index (generated)
air-fryers/ thermometers/ compare/    category and comparison hubs
decisions/ data-room/ flagged/        oversight surfaces
suggestions/       the decision queue: proposals, blocking questions, owner actions
methods/ about/ privacy/ executive-summary/
```

Generated files are committed so GitHub Pages serves them directly. CI regenerates and
fails if the committed HTML drifts from `_build/`.

## Read these before changing anything

- `COORDINATION.md` — the shared task board and the verification log (S15 appendix is the
  latest live-source verification pass)
- `EXECUTIVE-SUMMARY.md` — what was built, what it can/cannot claim, the decisions that matter
- `/flagged/` — the items that could not be confirmed, with what would close each
- `/suggestions/` — the decision queue: proposals with cost, reversibility
  and failure mode, blocking questions, owner-only actions. **Choose a path here before implementing.**
- `/decisions/` — earlier suggestions ranked by priority, rejected options

## Two things that need the owner

1. **Confirm the short links.** All five `link.amazon` links resolve to live listings but
   none of the resolved URLs carries a `tag=` parameter. The site publishes tagged
   canonical links instead. See FLG-001.
2. **Deploy the analytics endpoint.** The collector is real code; it is not running, so
   nothing is measured. See `analytics/README.md` and FLG-007.

## Licence and attribution

Body copy and generated artwork are original to this repository. Amazon and the Amazon
logo are trademarks of Amazon.com, Inc. or its affiliates. This site is not endorsed by
Amazon. As an Amazon Associate the site owner earns from qualifying purchases.

---

## Register-surface pages (session b26a9f95)

Alongside the canonical site above, this repository carries a hand-written register surface with the under-masthead disclosure convention enforced by `tools/check.cjs`:

| Path | Purpose |
|---|---|
| `/products/` | Source register: intent fields (blank, FLG-001), observed resolutions dated 2026-11-20, verified catalog facts (price/rating blank) |
| `/products/air-fryers/`, `/products/thermometers/` | Category pages with Special Links (`?tag=shopnow047c-20`, `rel="sponsored nofollow noopener"`) |
| `/direction/` | Executive summary, suggestions register, path chooser, open questions, publishing cadence |
| `/flags/` | Flagged for Review (FLG-001…012) with sources and closing steps |
| `/analytics/` | Five defined events, per-device ledger, endpoint/Search Console/reader-capture status |

These pages are listed in `sitemap-register.xml`, excluded from the canonical R1–R10 walk by `tools/verify.mjs` (same treatment as `/flagged/`, `/decisions/`), and gated by `scripts/publish_gate.py` plus the shared checks in `tools/check.cjs`.
