# Counterwise

A publication-style buying guide for air fryers and kitchen thermometers, built on a
verified data layer: every product figure is dated, linked to the official Amazon
listing it came from, and separated from the things that still need checking.

Live site: <https://sassnarep3-star.github.io/WinB/>

---

## What is in here

| Path | What it is |
|---|---|
| `index.html` | Publication front page |
| `guides/` | 9 question-shaped buying guides |
| `air-fryers/`, `thermometers/` | Category hubs: products, guides and a sourced comparison |
| `dashboard/` | The workbench: overview, products, competition, content, links, campaigns, compliance |
| `review/` | Evidence register, open questions, suggestions board, flagged-for-review, source index |
| `summary/` | Executive summary |
| `data/` | The verified data layer (JSON) — the single source of truth |
| `tools/` | The build pipeline and the release gate |

## Build and verify

```bash
npm run build     # regenerate every page, the sitemap, the feed and robots.txt
npm run verify    # the release gate: fails the deploy on a policy or link problem
npm run check     # both
npm run serve     # local preview on http://localhost:8000
```

No dependencies. Node 18 or newer.

### What the release gate blocks

`tools/verify.mjs` runs on every deploy and fails the build when:

- a generated page is missing the disclosure strip under the masthead, the footer
  notice, the meta description, the canonical URL or the feed link;
- an outbound Amazon link is not marked `rel="sponsored"`, does not carry the
  Associate ID, or is not in the canonical `/dp/<ASIN>?tag=` Special Link form;
- a supplied short link is published as a purchase call to action;
- a table row carries a value but no source link;
- an internal link or a referenced asset does not exist;
- the sitemap and the feed drift from the pages that were generated;
- a placeholder, an unresolved value, a duplicate title or a missing `h1` appears;
- the campaign ledger stops being empty before an authorised report exists;
- the intended ASIN is ever merged with an observed redirect target;
- a URL in the data layer points at a host that is not on the allowlist.

## The data layer

Everything published comes from `data/*.json`. The builder never invents a value:
anything absent is rendered blank and flagged.

| File | Contents |
|---|---|
| `products.json` | The five tracked products: observed ASIN, official listing, dated price, rating, review count, availability, seller, stated specifications, flags |
| `competition.json` | Fifteen alternative listings captured from Amazon's own recommendation module |
| `articles.json` | Every guide: title, dek, metadata, editorial hypothesis, structured body |
| `questions.json` | Twelve open questions: known, missing, how to discover, decision enabled |
| `suggestions.json` | Twenty-four proposals for review before implementation |
| `flags.json` | Fourteen flagged items with source and resolution path |
| `sources.json` | Nineteen official sources with what each supports and how it was verified |
| `campaigns.json` | The campaign ledger: empty by design, with its schema and rules defined |

## Evidence boundary

- The five links supplied in the brief are opaque 9-character short-link tokens,
  **not** 10-character ASINs. Each was resolved against its official Amazon
  listing on **2026-11-20** and the observed redirect target is recorded in its
  own field. The intended ASIN is left blank because no enrolled-workflow
  confirmation exists, and the two fields are never merged.
- The published outbound links are **not** the supplied short links. The site
  uses the canonical `https://www.amazon.com/dp/<ASIN>?tag=shopnow047c-20` form
  with `rel="sponsored"` and a visible Sponsored marker. The short links appear
  only in the evidence register, as recorded source inputs.
- No product is called the best. No commission rate, click count, order,
  conversion rate, earnings figure or revenue forecast appears anywhere,
  because none has been obtained from an authorised first-party report.
- No search volume, keyword difficulty, trend or ranking claim is made. Every
  working title is labelled a hypothesis.
- Prices, ratings and review counts are point-in-time observations and carry the
  date they were read.
- Product photography is deliberately not published; the site uses typographic
  product cards until the image rules have been read.

## Official references used

- Associates Program Operating Agreement — <https://affiliate-program.amazon.com/help/operating/agreement> (page states: updated October 15, 2025)
- Associates Program Policies — <https://affiliate-program.amazon.com/help/operating/policies> (page states: updated April 14, 2026)
- Participation Requirements — <https://affiliate-program.amazon.com/help/operating/participation/>
- Application FAQs — <https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM>
- PA-API 5 deprecation notice — <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation>
- Creators API introduction — <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction>
- FTC Endorsement Guides FAQ — <https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking>
- 16 CFR Part 255 — <https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255>
- FTC Disclosures 101 — <https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers>

The full index with what each source supports is at
<https://sassnarep3-star.github.io/WinB/review/sources.html>.

## Publishing

`.github/workflows/pages.yml` builds, verifies and publishes the repository root
to GitHub Pages on every push to `main`. The canonical host is
`https://sassnarep3-star.github.io/WinB/` because the repository is named
`WinB`; if a custom domain is attached, rebuild with the new base URL.

## Review before launch

Everything still open is published at
<https://sassnarep3-star.github.io/WinB/review/flagged.html> with the source
used and what would close it. None of it blocks the site going live.
