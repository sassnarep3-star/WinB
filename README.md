# Counterwise — kitchen gear, chosen by question

A static Amazon Associates publication for five kitchen products: three air fryers and
two thermometers. Built for the WinB repository and published with GitHub Pages.

**Live site:** https://sassnarep3-star.github.io/WinB/
**Associate tag:** `shopnow047c-20`

---

## What this is

A shop, not an audit. Five product pages, two category hubs, a comparison table, five
question-shaped guides, and one RSS feed. The compliance machinery is real but it lives
under the floor — the front page leads with products, and every register is one click
away in the footer.

The editorial position is narrow and deliberate: **this desk has not handled any of these
products.** Every page therefore describes what the manufacturer's listing states, shows
its arithmetic, and lists what it cannot tell you. No page contains a fabricated test
result, a borrowed star rating, or a price.

## The rules the build enforces

`node tools/verify.mjs` fails the build unless all ten hold:

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

## Commands

```bash
npm run build    # generate HTML, sitemap, feed, 404, artwork
npm run verify   # content rules R1-R10
npm run links    # crawl the built site, validate XML
npm run smoke    # fetch every URL at /WinB/ over HTTP (needs a local server on :3001)
npm run check    # build + verify + links
```

## Layout

```
_build/            generators (data.mjs is the single source of truth)
  data.mjs         products, flags, questions, suggestions, sources, events, ledger
  core.mjs         page shell, disclosure strip, masthead, footer
  content-shop.mjs front page, categories, product pages, comparison, guides
  content-oversight.mjs  decision room, data room, flagged, methods, about, privacy
tools/             verify.mjs · linkcheck.mjs · smoke.mjs
assets/            css/site.css · js/site.js · generated SVG artwork
analytics/         deployable collected-worker.js + schema (NOT running)
reviews/           five product pages (generated)
guides/            five guides (generated)
air-fryers/ thermometers/ compare/    category and comparison hubs
decisions/ data-room/ flagged/        oversight surfaces
methods/ about/ privacy/ executive-summary/
```

Generated files are committed so GitHub Pages serves them directly. CI regenerates and
fails if the committed HTML drifts from `_build/`.

## Read these before changing anything

- `COORDINATION.md` — the shared task board and the verification log
- `/flagged/` — the nine items that could not be confirmed, with what would close each
- `/decisions/` — suggestions ranked by priority, open questions, rejected options

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

## Preserved alternative build — Counter & Crisp (`alt-site/counter-and-crisp/`)

Session `arena/6fc7de34` (PR #31) contributed an independent, self-contained site build for the
same five products. It is **not** the canonical site: it ships `noindex,follow` and a disallowing
`robots.txt`, consistent with the archive convention in `tools/noindex.cjs`, so search engines keep
indexing only the canonical root build.

- Live at `https://sassnarep3-star.github.io/WinB/alt-site/counter-and-crisp/` (for review, not ranking).
- Distinctive pieces worth mining: the product-intent confirmation record with strict
  intent-vs-observation field separation, the suggestion review queue format (SUG-001..012 with
  impact/effort/risk and blank decision columns), the open-questions register with discovery paths
  (Q-01..15), and the five-event privacy-preserving counter design.
- Rebuild: `python3 tools/build_site.py` · verify: `python3 tools/check_links.py`.
- Independent cross-check recorded in `COORDINATION.md` §9: this session's fetch of the five
  supplied short links produced the same five observed ASINs as §3/§8 of the board.
