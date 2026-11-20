# Executive summary — Counterwise

**Project:** a working Amazon Associates shop front for five supplied kitchen products
**Site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20 (UTC, publication-polish iteration)
**Associate tag supplied:** `shopnow047c-20` — **status unconfirmed** (see §3, FLG-001)
**Pages:** 30 canonical pages + 5 affiliate exit pages, 33 sitemap routes, 9 feed items
**Sources:** 10 official sources on the register, all fetched and read twice (see §6–§7)

**Scope boundary:** this repository delivers a static affiliate publication with automated page
generation and compliance checks; it is **not yet an AI-powered research or campaign-optimization
platform**. There is no deployed AI agent, live trend/commission feed, live analytics endpoint,
Search Console data, or verified conversion reporting. Those capabilities need authorized data
access, deployment credentials and human approval gates before they can be claimed or switched on.

> This document is the merged, current summary. Earlier generations of the site (The Crisp Kitchen
> register at `data/shop/` + `/register/`, `/docs/`, `/alt-site/`, `/legacy-docs-site/`,
> `archive/`) are preserved and marked noindex; their summaries and registers remain readable in
> the repository.

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo line by line against official sources | **Done, twice** — every register value carries a source link; every source re-read live on 2026-11-20 (second pass, §7) | `/data-room/#sources`, `COORDINATION.md` §4 |
| Marketing for the five supplied links | **Done** — all five resolved, re-verified, and written up as a shop | `/`, `/reviews/` |
| Clean landing page + subpages by category | **Done** — front page, 2 category hubs, 5 product pages, comparison table | `/index.html`, `/air-fryers/`, `/thermometers/`, `/compare/` |
| Dashboard-style tables of all findings | **Done** — product-intent record, source register, automation pipeline, events, ledger | `/data-room/` |
| Every row sourced; blanks where unconfirmed | **Done** — intended ASIN blank for all five; unverifiable fields blank and flagged | `/data-room/#products`, `/flagged/` |
| Read like a shop, not an audit | **Done** — products first, seasonal entry points, registers in the footer | `/index.html` |
| Catchy, trendy, question-shaped articles | **Done** — 7 guides incl. hosting-season and gifting clusters | `/guides/` |
| Publication feel (authorship, brand, imagery, seasons, clusters) | **Done** — bylines, Counterwise brand, labelled generated illustrations, seasonal notebook, 2 clusters | `/`, `/methods/`, `/about/` |
| Suggestions section: choose a path before implementing | **Done** — 10 queued proposals with cost/reversibility/failure mode, 3 paths, plus the Path A/B/C design-and-content board | `/suggestions/` |
| Questions / information / answers + discovery plan | **Done** — 14 questions (known / missing / how to find) + 8 decision inputs with have/missing/discover | `/decisions/#questions`, `/decisions/inputs.html` |
| Findable (one site to index) | **Done** — sitemap, RSS, robots, canonicals, OG, JSON-LD; superseded trees noindex + disallowed | `/sitemap.xml`, `/feed.xml`, `/robots.txt` |
| Trustworthy machinery (automate + gate) | **Done** — R1–R14 gates fail the build on breach; product facts, prose, topics and ledger rows stay human-gated | `/data-room/#automation` |
| Disclosure above the fold on every page + footer | **Done** — enforced by R1 on every canonical page | every page |
| Every outbound product link tagged and sponsored | **Done** — `rel="sponsored nofollow noopener"` + `tag=shopnow047c-20`, enforced by R2/R10 | every page |
| Product-intent confirmation record (separate fields) | **Done** — intended ASIN and observed redirect never merged | `/data-room/#products` |
| Click/conversion measurement (5 events) | **Code shipped, not deployed** — no endpoint, no traffic claimed | `/data-room/#events`, FLG-007 |
| Empty campaign ledger with provenance rule | **Done** — 0 rows, schema + column rules published | `/data-room/#ledger` |
| Live GitHub Pages site + merged PRs | **Done** — PR record in `COORDINATION.md` | https://sassnarep3-star.github.io/WinB/ |

## 2. The five products, as resolved and re-verified

Every supplied link was opened on 2026-11-20 and **re-verified the same day** (second pass). In all
five cases the short code did **not** match the ASIN the link resolved to — the codes look like
ASINs but are not. The re-verification found **no drift**: same targets, same listing titles.

| # | Supplied link | Resolved ASIN (observed) | Product (listing title, abridged) | Listing source |
|---|---|---|---|---|
| 1 | `https://link.amazon/B04G1MEwY` | `B0CDY277D3` | CHEFMAN 6 Quart Dual Basket Air Fryer Oven | https://www.amazon.com/dp/B0CDY277D3 |
| 2 | `https://link.amazon/B02NbDxp3` | `B09B7SB46R` | Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven | https://www.amazon.com/dp/B09B7SB46R |
| 3 | `https://link.amazon/B00hJ57DV` | `B08DKYBTPH` | Chefman Air Fryer 8 Qt TurboFry 4-in-1 | https://www.amazon.com/dp/B08DKYBTPH |
| 4 | `https://link.amazon/B0c8moW59` | `B0DHZTCNR5` | ThermoMaven 1 Sec Professional Digital Meat Thermometer | https://www.amazon.com/dp/B0DHZTCNR5 |
| 5 | `https://link.amazon/B0f3GKalj` | `B0DZFD6R9Z` | CHEF iQ Sense Smart Wireless Meat Thermometer, Gen3 | https://www.amazon.com/dp/B0DZFD6R9Z |

The set is coherent: three structurally different air fryers, and the two thermometers that tell
you when the food is done. That is the editorial spine the site is built on.

**None of the five resolved URLs carried a visible `tag=` parameter**, on either pass (FLG-001).
The compliance status of the `link.amazon` short links is **unresolved** (FLG-003) — no claim is
made in either direction. The site publishes tagged canonical listing links instead.

**Intended ASIN is blank for all five** (FLG-002). The ASINs above are *observed* redirect targets,
stored in their own field and never merged into the intended field.

## 3. The decisions that determine whether this is a business

Ordered by downside if left open. Full reasoning at `/decisions/inputs.html` (have / missing /
discover) and `/suggestions/` (cost / reversibility / failure mode).

1. **Do the supplied short links credit the account?** (Q-01, DI-01, FLG-001) — Mint one link in
   Associates Central, compare parameters, click one per product, read the tracking report. Under
   an hour. Nothing earns until this is closed.
2. **Buy and document one review unit** (SUG-01, DI-03, FLG-004) — The only durable answer to
   thin-affiliation risk and reader distrust. Pick the cheapest of the five, buy it, publish the receipt.
3. **Deploy the analytics endpoint** (SUG-03, DI-04, FLG-007) — Until it exists, the next topic is
   chosen by instinct. Deploy the supplied worker, set one line in the JS, run 30 days.
4. **Decide who the site belongs to** (Q-05, DI-06) — Google's site-reputation policy weighs
   stated authorship; a named byline and a two-line biography is half a day of work.

## 4. What is deliberately absent, and why

| Absent | Reason | Source |
|---|---|---|
| **Prices** | Permitted only when Amazon serves the link or data comes via Creators API / PA API. A static page has neither. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Star ratings / sales rank** | Same rule; ratings are Amazon's content, not this site's judgement. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Product photography** | The IP licence limits storing/reusing Program Content images; a static site is a cache. Generated illustrations are used and labelled as such. | [A2 IP License](https://affiliate-program.amazon.com/help/operating/policies) |
| **Any traffic / conversion / revenue figure** | No authorised report exists. The ledger ships with schema and zero rows. | FLG-007 |
| **"We tested this"** | Nothing has been handled. FTC: "You can't talk about your experience with a product you haven't tried." | [F1](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) |
| **Commission rates / "high-converting" scores** | None verified. Products are presented by cooking decision, not by payout. | [A3](https://affiliate-program.amazon.com/) |
| **Certification claims as fact** | "NIST&NSF", "±0.5°F", "1000°F" appear as attributed listing claims only. | FLG-006 |

## 5. How it reads as a shop (and how it ranks)

- **Shop first:** the front page leads with the five picks and the two category hubs, then the guides. Dashboards live in the footer and one navigation group.
- **Clusters:** the air-fryer cluster (format, capacity, cleanup) and the thermometer cluster (safe temperatures, checking vs watching) link to each other and to the comparison table.
- **Seasons:** a seasonal entry band (hosting season, gifting, weeknights, small kitchens) plus two seasonal guides published this cycle: "Hosting season: which machine cooks what on the big day?" and "Five gifts for the cook who already has an oven".
- **Publication polish:** byline (author, date, reading time) on guides and product pages; Counterwise brand; generated editorial illustrations labelled as such.
- **Findability:** one indexable site (superseded trees noindex + disallowed), sitemap + RSS generated from the same data as the pages, canonicals + Open Graph + JSON-LD, `rel="sponsored"` on every Amazon link, fortnightly cadence (bursts are scaled-content abuse).
- **Automation + gate:** generation, sitemap, feed, R1–R14 compliance gates, link crawl and HTTP smoke run on every build and fail the publish on breach. Product facts, prose, topic choice and ledger rows stay human-gated.

## 6. Compliance posture

| Requirement | Implementation | Source |
|---|---|---|
| "As an Amazon Associate I earn from qualifying purchases." above the fold on every page and in the footer | Structural: one strip + one footer function used by every page; R1 fails otherwise | [Operating Agreement §5](https://affiliate-program.amazon.com/help/operating/agreement) |
| Associate tag on every Amazon link | `tag=shopnow047c-20` on every product link; R2 | [Policies §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| Paid links qualified for Google | `rel="sponsored nofollow noopener"` on every outbound product link | [Google: qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) |
| Material-connection disclosure, clear and conspicuous | Disclosure strip directly under the top of the page, before the masthead | [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) |
| Cookie / measurement disclosure | Privacy page documents the five events and the counter; opt-out link in the footer | [Policies §3(e)](https://affiliate-program.amazon.com/help/operating/policies) |
| Exit pages indexable and disclosed | `/go/` pages carry `index,follow`, the disclosure and tagged sponsored links (FLG-010, fixed) | [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) |

## 7. Verification record (2026-11-20, second pass)

Every source on the register was re-read line by line on 2026-11-20. All quotes printed on the site
were compared against the fetched text. Results:

| Source | Check | Result |
|---|---|---|
| [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) | §5 wording verbatim; Special Links definition; §6 termination | **Confirmed** (updated Oct 15, 2025, as recorded) |
| [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) | §2(b) tag rule, price rule, claims rule; §3(e); IP License §2(c); ML clauses; 60-day payment | **Confirmed** (updated Apr 14, 2026, as recorded) |
| [Program home](https://affiliate-program.amazon.com/) | "up to 10%", eligibility, ~60-day payment | **Confirmed** |
| [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) | All four quoted claims incl. the untried-products line | **Confirmed** (November 2019, as recorded) |
| [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) | (a) clear-and-conspicuous + sufficiency wording | **Confirmed** (current as of 2026-11-18, as recorded) |
| [Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | `rel="sponsored"`; multi-value rel | **Confirmed** (updated 2025-12-10, as recorded) |
| [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | Scaled-content, thin-affiliation, site-reputation, authorship factors | **Confirmed** |
| [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) / [sitemaps.org](https://www.sitemaps.org/protocol.html) | Supported formats; urlset/loc/single-host/UTF-8 rules | **Confirmed** |
| [USDA temperature chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) | Every temperature row and rest time in the guides | **Confirmed** (Last Updated Apr 14, 2025, as recorded) |
| Five Amazon listings | ASIN, listing title, directory vs. the register | **Confirmed, no drift** (re-resolved live in this session) |

**Irregularity found and fixed in this build:** the source register attributed the
machine-learning clause to "IP License §1 and §2(c)"; the clause actually sits in Participation
Requirements §5 **and** IP License §1. The citation now names both. Substance unchanged.

## 8. Flagged items (published at `/flagged/`, none block publication)

| ID | Item | Status |
|---|---|---|
| FLG-001 | Supplied short links redirect without an Associates tag | Open |
| FLG-002 | Intended ASIN unconfirmed for all five | Open |
| FLG-003 | Compliance status of link.amazon short links unresolved | Open |
| FLG-004 | No product has been handled by this desk | Open |
| FLG-005 | Prices and ratings deliberately not displayed | Open |
| FLG-006 | Certification/performance claims are manufacturer claims only | Open |
| FLG-007 | No analytics endpoint deployed; no traffic figures exist | Open |
| FLG-008 | No mailing provider, Search Console token, or custom domain | Open |
| FLG-009 | Earlier sessions published competing versions | Needs review |
| FLG-010 | Affiliate exit pages were noindex/nofollow while forwarding | **Fixed** (now index,follow; enforced by R10) |
| FLG-011 | Six competing site generations on one host | Needs review (retired via noindex + banner) |
| FLG-012 | Two fixes carry the same ID in the merged register | **Duplicate ID** — renumber to FLG-015 is in flight on PR #37 |
| FLG-013 | (register entry — see `/flagged/`) | Needs review |
| FLG-014 | og:image pointed at a file that did not exist | **Fixed** |

All entries are published with evidence and source links at `/flagged/`.

## 9. Owner checklist

1. **Path B first, Path C in parallel:** close the tagging question (SUG-02 / DI-01). Nothing else earns until then.
2. Deploy the collector and submit the sitemap in Search Console (SUG-03 / DI-04). Run 30 days; choose the next topic from measured queries.
3. Name the byline (Q-05 / DI-06) and publish the capacity worksheet (SUG-04).
4. Buy one review unit (SUG-01 / DI-03) when the owner approves the spend.
5. Pick one path per card on `/suggestions/` — DS-04–DS-08 need input.

Do not publish the topic queue until its gates pass. Do not add categories until one converts (SUG-08).

## 10. Honest limitations

- No price, rating, sales, traffic, conversion or revenue figure appears anywhere. There are none, on purpose.
- No search-volume or popularity claim is made. Seasonal moments and queued topics are labelled hypotheses.
- The site's economics are currently unproven and possibly zero: if the supplied links do not carry a tag at click time, nothing is tracked.
- Nothing was tested by hand, so authority rests on documentation and reasoning, not on measurement.
- Compliance conclusions describe how the build responds to quoted policy text. They are not legal advice.

*The disclosure applies to this document too: **As an Amazon Associate I earn from qualifying
purchases.*** Every claim above links to the official source it rests on; nothing is filled in
from memory.
