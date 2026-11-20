# Counterwise — WinB

An Amazon Associates publication for five kitchen products (three air fryers,
two thermometers), built as a static site and published with GitHub Pages.

**Live site:** https://sassnarep3-star.github.io/WinB/

## Read this first

- [`EXECUTIVE_SUMMARY.md`](EXECUTIVE_SUMMARY.md) — what was built, what was
  verified, what is still open.
- [`COORDINATION.md`](COORDINATION.md) — the shared task board, the session
  claim, the integration log, and the deploy record.

## What it is

A static site, no runtime dependencies, no third-party scripts.

- 25 pages: front page, two category hubs, five product pages, five guides,
  four register surfaces, a suggestions section, and trust pages.
- Every page carries the Amazon Associates statement above the fold and again
  in the footer.
- Every outbound product link is marked sponsored in the markup and on the
  face of the button.
- No prices, star ratings, or review counts anywhere — those require
  Amazon-served data or Product Advertising API access.
- No product on the site has been hands-on tested, and every product page says
  so.

## Repository layout

```
content/data.py      verified source register, products, guides, flags, questions, suggestions
build.py             static generator (Python standard library only)
verify.py            pre-publish checks: links, disclosure, sponsored marking, policy
assets/              stylesheet, illustrations, analytics client (source of truth)
index.html ...       generated pages, published at the paths Pages serves
sitemap.xml          generated
feed.xml             generated
robots.txt           generated
```

Generated pages are committed because GitHub Pages serves the repository root of
the default branch. `assets/` is authored by hand; everything else with an
`.html` extension at the root is generated.

## Build

```bash
python3 build.py     # writes _build/, then publishes to the repository root
python3 verify.py    # exits non-zero if anything is broken
```

`verify.py` fails the build on a missing disclosure statement, an unmarked
purchase link, a broken internal link, a sitemap entry with no page, or a
price-like figure in reader-facing copy.

## Editing content

All copy and data live in `content/data.py`. Each product field carries the key
of the source it came from. If a value cannot be confirmed against an official
source it is set to `None`, listed in that record's `unverified` array, and
rendered as a flag rather than filled in. Do not backfill a value without adding
its source first.

## Compliance notes

- Disclosure wording is quoted from the Associates Program Operating Agreement,
  Section 5.
- Price and rating display rules come from the Associates Program Policies,
  Participation Requirements §2(b).
- The five supplied short links carry no tracking tag; their compliance status is
  recorded as unresolved rather than assumed. See `/dashboard/flags.html`.
