# Executive summary — Counterwise

**Project:** a working Amazon Associates shop front for five supplied kitchen products
**Site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20 (UTC) — S15 refresh (session `30073780`)
**Associate tag supplied:** `shopnow047c-20` — **status unconfirmed** (see §3, FLG-001)
**Pages:** 29 canonical pages + 5 affiliate exit pages, 31 sitemap routes, 7 feed items
**Sources:** 10 official sources, all fetched and read (see §6)
**Flags:** 15 published, none blocking (see §7)

**Scope boundary:** this repository delivers a static affiliate publication with automated page
generation and a compliance gate that fails the build. It is **not** a live AI research or
campaign-optimisation platform. There is no deployed AI agent, no live trend or commission feed,
no live analytics endpoint, no Search Console data and no verified conversion reporting. Those
need authorised data access, deployment credentials and human approval gates before they can be
claimed or switched on.

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo line by line against trusted sources | **Done** — re-verified 2026-11-20 by fetching each official source live (A1, A2, F1, U1, G1, G2, G4) and all five Amazon listings | `/data-room/#sources`, `COORDINATION.md` S15 appendix |
| Marketing for the five supplied links | **Done** — all five resolved and written up as a shop | `/`, `/reviews/` |
| Clean landing page + subpages by category | **Done** — front page, 2 category hubs, 5 product pages, comparison table | `/`, `/air-fryers/`, `/thermometers/`, `/compare/` |
| Dashboard-style tables of all findings | **Done** — product-intent record, source register, automation pipeline, organic playbook, events, ledger, inventory | `/data-room/` |
| **Every table row carries a source link; blanks where unconfirmed** | **Done** — 208 data rows, 204 with an official-domain link; enforced by build rule R15 | every table on the site; `/methods/` rule six |
| Live GitHub Pages site | **Done** — published from `main`, Pages `built` | `COORDINATION.md` §5–§7 |
| Executive summary | **This document** + `/executive-summary/` | `EXECUTIVE-SUMMARY.md` |
| Read like a shop, not an audit | **Done** — products first; every register behind the footer | `/` |
| Polished publication feel (authorship, brand, imagery, seasons, clusters) | **Done** — bylines, one brand (Counterwise), generated photography, seasonal notebook, 2 clusters | `/`, `/methods/`, `/about/` |
| Suggestions section to choose a path before implementing | **Done** — 10 proposals, 9 blocking questions, 5 owner actions | `/suggestions/` |
| Questions / information / answers + discovery plan | **Done** — 14 questions (known / missing / how to find), discovery plan | `/decisions/#questions` |
| **Suggestions that feed the prompt to design the site** | **Done** — 10 design directions with cost and reversibility, the copy-ready prompt, 8 traffic levers, 8 design questions | `/design/` |
| Findable (one site to index) | **Done** — sitemap, RSS, robots, canonicals, OG, JSON-LD; superseded trees and nine superseded pages retired | `/sitemap.xml`, `/feed.xml`, `/robots.txt` |
| Trustworthy machinery (automate + gate) | **Done** — R1–R15 gate fails the build; human gates for facts, prose, topics, ledger | `/data-room/#automation` |
| Disclosure above the fold on every page | **Done** — strip under the masthead + footer repeat, enforced by R1 and R13 | every page |
| Every outbound product link marked sponsored | **Done** — `rel="sponsored nofollow noopener"` + tag, enforced by R2/R10 | every page |
| Product-intent confirmation record (separate fields) | **Done** — intended ASIN and observed redirect are never merged | `/data-room/#products` |
| Question-shaped guides + measurement before more writing | **Done** — 5 guides published; next title gated on 30 days of data | `/guides/`, `/decisions/#queue` |
| Click/conversion measurement (5 events) | **Code shipped, not deployed** — no endpoint, no traffic claimed | `/data-room/#events`, FLG-007 |
| Empty campaign ledger with provenance rule | **Done** — 0 rows, schema + column rules published | `/data-room/#ledger` |
| AI platform (research, trends, pricing, reviews, competition, commissions, SEO content, optimization) | **Not built — honestly scoped.** Automation today is generation + gating. Pricing/reviews/commission data would require Creators/PA API access and are deliberately absent (FLG-005). See §4 and Q-12. | `/data-room/#automation`, `/decisions/` Q-12 |

## 2. The five products, as resolved

Every supplied link was opened once on 2026-11-20. **In all five cases the short code did not
match the ASIN the link resolved to** — the codes look like ASINs but are not.

| # | Supplied link | Resolved ASIN (observed) | Product (listing title, abridged) | Category | Source |
|---|---|---|---|---|---|
| 1 | link.amazon/B04G1MEwY | `B0CDY277D3` | CHEFMAN 6 Quart Dual Basket Air Fryer Oven… | Air fryers | [Listing](https://www.amazon.com/dp/B0CDY277D3) |
| 2 | link.amazon/B02NbDxp3 | `B09B7SB46R` | Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven… | Air fryers | [Listing](https://www.amazon.com/dp/B09B7SB46R) |
| 3 | link.amazon/B00hJ57DV | `B08DKYBTPH` | Chefman Air Fryer 8 Qt \| TurboFry® 4-in-1 with 450°F Hi-Fry… | Air fryers | [Listing](https://www.amazon.com/dp/B08DKYBTPH) |
| 4 | link.amazon/B0c8moW59 | `B0DHZTCNR5` | ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉… | Thermometers | [Listing](https://www.amazon.com/dp/B0DHZTCNR5) |
| 5 | link.amazon/B0f3GKalj | `B0DZFD6R9Z` | CHEF iQ Sense \| Smart Wireless Meat Thermometer \| 3 Ultra-Thin Probes… Gen3 | Thermometers | [Listing](https://www.amazon.com/dp/B0DZFD6R9Z) |

The set is coherent: three air fryers that are structurally different machines, and the two
thermometers that tell you when the food is done. That is the editorial spine the site is built on.

**None of the five resolved URLs carried a visible `tag` parameter.** The site therefore publishes
tagged canonical Special Links built from each observed ASIN plus `shopnow047c-20`, and does not
use the untagged short links as money links (FLG-001, FLG-003).

**Intended ASIN is blank for all five** (FLG-002). The ASINs above are *observed* redirect targets,
stored in their own field and never merged into the intended field.

## 3. The decisions that determine whether this is a business

Ordered by downside if left open. Full reasoning in the Decision Room. **Nothing below is implemented until the owner chooses a path in `/suggestions/`.**

1. **Do the supplied short links credit your account?** (Q-01, FLG-001) — Mint one link in Associates
   Central and compare the parameters. Under an hour. Nothing earns until this is closed.
2. **Buy and document one review unit** (SUG-01, FLG-004) — The only durable answer to thin-affiliation
   risk and reader distrust. Pick the cheapest of the five, buy it, publish the receipt.
3. **Deploy the analytics endpoint** (SUG-03, FLG-007) — Until it exists, the next topic is chosen by
   instinct. Deploy the supplied worker, set one line in the JS, run 30 days.
4. **Decide who the site belongs to** (Q-05) — Google’s site-reputation policy weighs stated
   authorship; an unauthored affiliate page is its own example of a problem. A named byline and a
   two-line biography.

## 4. What is deliberately absent, and why

| Absent | Reason | Source |
|---|---|---|
| **Prices** | Permitted only when Amazon serves the link or data comes via Creators API / PA API. Static page has neither. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Star ratings / Amazon popularity position** | Same rule; ratings are Amazon’s content, not this site’s judgement. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Product photography** | IP License forbids storing/caching Product Advertising Content images; a static site is a cache. Generated editorial photography is used and labelled. | [A2 IP License](https://affiliate-program.amazon.com/help/operating/policies) |
| **Any traffic / conversion / revenue figure** | No authorised report exists. Ledger ships with schema and zero rows. | [A2 Commission Statement](https://affiliate-program.amazon.com/help/operating/policies) |
| **“We tested this”** | Nothing has been handled. FTC: you cannot talk about your experience with a product you have not tried. | [F1](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) |
| **Commission rates / “high-converting” scores** | None verified. Products are ranked by cooking decision, not by payout. | [A3](https://affiliate-program.amazon.com/) |
| **An email sign-up** | A submit button that discards an address is worse than no form. The RSS feed is the follow path. | [A2 §3(e)](https://affiliate-program.amazon.com/help/operating/policies) |

## 5. How it reads as a shop (and how it ranks)

- **Shop first:** front page leads with the five picks, then the two category hubs, then the guides.
  Every register sits behind the footer, not in the hero.
- **Clusters:** air-fryer cluster (format, capacity, cleanup) and thermometer cluster (safe
  temperatures, checking vs watching) link to each other and to the comparison table.
- **Seasonal notebook:** four cooking moments (weeknight two-food, big-batch sharing, holiday roasts,
  summer grilling) reframe existing guides as hypotheses. No search-volume, popularity or sales claim
  is made.
- **Publication polish:** byline (author, date, reading time) on every guide and product page; one
  brand (Counterwise) everywhere, including the exit pages; generated editorial photography, labelled
  as representative of the category rather than as the reviewed unit.
- **Findability:** one indexable site — the superseded directory trees *and* nine superseded
  individual pages are noindex with a banner pointing at their replacement — sitemap + RSS generated
  from the same data as the pages, canonicals + Open Graph + JSON-LD on every page,
  `rel="sponsored"` on every Amazon link, fortnightly cadence (bursts are scaled-content abuse).
- **Automation + gate:** generation, sitemap, feed, the R1–R15 compliance gate, the link crawl and
  the HTTP smoke test at `/WinB/` all run on every build and fail the publish on breach. Product
  facts, prose, topic choice and ledger rows stay human-gated.
- **Every number is checkable:** 208 table rows, each carrying a source link; specifications are
  transcribed with the phrase they came from; blanks are labelled rather than filled.

## 6. Sources (all official, re-fetched live 2026-11-20)

| Ref | Source | Used for | Checked |
|---|---|---|---|
| A1 | [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (Updated Oct 15, 2025) | §5 disclosure wording; Special Link definition; §6 material breach | 2026-11-20 |
| A2 | [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (Updated Apr 14, 2026) | Tag requirement §2(b); price rule; inaccurate-claims rule; IP License; cookie disclosure; commission session (24h / 89 days) | 2026-11-20 |
| A3 | [Associates program home](https://affiliate-program.amazon.com/) | Program overview | 2026-11-20 |
| F1 | [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) (Nov 2019) | Hard-to-miss disclosure; no experience claims for untried products | 2026-11-20 |
| F2 | [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) | Material-connection disclosure | 2026-11-20 |
| G1 | [Google: Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) (2025-12-10) | `rel="sponsored"` for paid/affiliate links | 2026-11-20 |
| G2 | [Google Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | Scaled content, thin affiliation, site reputation, sneaky redirects | 2026-11-20 |
| G3 | [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Sitemap format and submission | 2026-11-20 |
| G4 | [sitemaps.org protocol](https://www.sitemaps.org/protocol.html) | Sitemap XML schema (single host, UTF-8, entity-escaped) | 2026-11-20 |
| U1 | [USDA FSIS Safe Temperature Chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) (Last Updated Apr 14, 2025) | Safe minimum internal temperatures quoted in thermometer guides | 2026-11-20 |

Amazon listing data (titles, ASINs, category paths, specifications) is the 2026-11-20 observed record
in the Data Room and in `_build/listing-evidence.mjs`. The sandbox cannot reach amazon.com from a raw
request, so listings were not re-fetched this session; no new product fact has been added.

## 7. Flags (15 — none blocks publication)

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
| FLG-009 | Several earlier sessions published competing versions of this site | Needs review |
| FLG-010 | Affiliate exit pages were noindex/nofollow while forwarding | **Fixed in this build** (now index,follow; enforced by R10) |
| FLG-011 | Six competing site generations on one host | Needs review (retired via noindex + banner) |
| FLG-012 | Every page advertised a social image that did not exist | **Fixed in this build** (R11) |
| FLG-013 | Three listings contradict themselves on their own stated figures | Needs review (both values published) |
| FLG-014 | Three product pages reported stated specifications as “not stated” | **Fixed in this build** |
| FLG-015 | Fix recorded in a script CI does not run; two brands on the live site | **Fixed in this build** (one brand, Counterwise) |

All 15 are published with evidence and source links at `/flagged/`.

**Path B first, Path C in parallel** (see `/decisions/` and `/suggestions/` for all three paths, with cost, reversibility and failure mode per proposal):

1. Close the tagging question (SUG-02). Nothing else earns until then.
2. Deploy the collector and submit the sitemap (SUG-03, SUG-13). Run 30 days; choose the next topic
   from measured queries.
3. Name the byline (Q-05) and publish the capacity worksheet (SUG-04).
4. Buy one review unit (SUG-01) when the owner approves the spend.

Do not publish the topic queue until its gates pass. Do not add categories until one converts (SUG-08). Do not automate optimization until measurement exists (Priority 4: measure before automating).

## 9. Honest limitations

- No price, rating, sales, traffic, conversion or revenue figure appears anywhere. There are none, on
  purpose.
- No search-volume or popularity claim is made. Seasonal moments, queued topics and design directions
  are labelled hypotheses.
- The site’s economics are currently unproven and possibly zero: if the supplied links do not carry a
  tag, nothing is tracked.
- Nothing was tested by hand, so authority rests on documentation and reasoning, not on measurement.
- Compliance conclusions describe how the build responds to quoted policy text. They are not legal
  advice.
- The design directions in `/design/` are proposals. Nothing on that page is a statement that a change
  has been made.
