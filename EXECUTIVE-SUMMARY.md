# Executive summary — Counterwise

**Project:** a working Amazon Associates shop front for five supplied kitchen products
**Site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20 (UTC) — S15 refresh (session `30073780`)
**Associate tag supplied:** `shopnow047c-20` — **status unconfirmed** (see §3, FLG-001)
**Pages:** 31 canonical pages + 5 affiliate exit pages, 37 sitemap routes, 10 feed items (8 guides + 2 shop items)
**Sources:** 11 official sources, all re-fetched live 2026-11-20 via fetch_page (see §6)

**Scope boundary — read this first.** This repository delivers a static affiliate publication with automated page generation and a compliance gate that fails the build on breach. It is **not yet an AI-powered research or campaign-optimization platform**, and this summary does not claim otherwise. There is no deployed AI agent, no live trend/commission feed, no live analytics endpoint, no Search Console data, and no verified conversion reporting. What *is* automated today: page/sitemap/feed generation from a single data file, the R1–R15 compliance gate, link crawling, and an HTTP smoke test at the real `/WinB/` path. What stays human-gated by design: every product fact, every word of guide prose, every topic choice, and every ledger row. Any future AI drafting would be treated as a suggestion until a human checks it against a source (Q-12). Those capabilities need authorized data access (Creators API / PA API, Associates Central, Search Console), deployment credentials, and human approval gates before they can be claimed or switched on.

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo line by line against trusted sources | **Done** — re-verified 2026-11-20 by fetching each official source live (A1, A2, F1, U1, G1, G2, G4) and all five Amazon listings | `/data-room/#sources`, `COORDINATION.md` S15 appendix |
| Marketing for the five supplied links | **Done** — all five resolved and written up as a shop | `/`, `/reviews/` |
| Clean landing page + subpages by category | **Done** — front page, 2 category hubs, 5 product pages, comparison table | `/index.html`, `/air-fryers/`, `/thermometers/`, `/compare/` |
| Dashboard-style tables of all findings | **Done** — product-intent record, source register, automation pipeline, organic playbook, events, ledger, inventory | `/data-room/` |
| Every row sourced; blanks where unconfirmed | **Done** — intended ASIN blank for all five, wattage/footprint blank where unstated, flags published | `/data-room/#products`, `/flagged/` |
| Live GitHub Pages site | **Done** — published from `main`, Pages `built` | `COORDINATION.md` §5–§7 |
| Executive summary | **This document** + `/executive-summary/` | `EXECUTIVE-SUMMARY.md` |
| Read like a shop, not an audit | **Done** — products first, registers in footer + one navigation group | `/index.html` |
| Polished publication feel (authorship, brand, imagery, seasons, clusters) | **Done** — bylines, Counterwise brand, generated illustrations, seasonal notebook, 2 clusters | `/`, `/methods/`, `/about/` |
| Polished marketing feel + trendy, timely topics + organic traffic | **Done (S15)** — November editorial picks, 30-second chooser, 3 printable worksheets, FAQ matrix; all timely framing is labelled hypothesis, never a demand claim | `/`, `/tools/`, `/guides/` |
| Suggestions section to choose a path before implementing | **Done** — 3 paths, decision queue with cost/reversibility/failure mode, blocking questions, owner actions | `/suggestions/`, `/decisions/` |
| Questions / information / answers + discovery plan | **Done** — 14 questions (known / missing / how to find), discovery plan, FAQ matrix | `/decisions/#questions`, `/` (FAQ) |
| Findable (one site to index) | **Done** — sitemap, RSS, robots, canonicals, OG, JSON-LD, noindex on superseded trees | `/sitemap.xml`, `/feed.xml`, `/robots.txt` |
| Trustworthy machinery (automate + gate) | **Done** — R1–R15 gate fails the build; human gates for facts, prose, topics, ledger | `/data-room/#automation` |
| Disclosure above the fold on every page | **Done** — strip under masthead + footer repeat, enforced by R1/R13 | every page |
| Every outbound product link marked sponsored | **Done** — `rel="sponsored nofollow noopener"` + tag, enforced by R2/R10 | every page |
| Product-intent confirmation record (separate fields) | **Done** — intended ASIN and observed redirect never merged | `/data-room/#products` |
| Question-shaped guides + measurement before more writing | **Done** — 8 guides published (5 original + 3 S15); next title gated on 30 days of data | `/guides/`, `/decisions/#queue` |
| Click/conversion measurement (5 events) | **Code shipped, not deployed** — no endpoint, no traffic claimed | `/data-room/#events`, FLG-007 |
| Empty campaign ledger with provenance rule | **Done** — 0 rows, schema + column rules published | `/data-room/#ledger` |
| AI platform (research, trends, pricing, reviews, competition, commissions, SEO content, optimization) | **Not built — honestly scoped.** Automation today is generation + gating. Pricing/reviews/commission data would require Creators/PA API access and are deliberately absent (FLG-005). See §4 and Q-12. | `/data-room/#automation`, `/decisions/` Q-12 |

## 2. The five products, as resolved

Every supplied link was opened on 2026-11-20 and re-checked this session. **In all five cases the short code did not match the ASIN the link resolved to** — the codes look like ASINs but are not. Titles below were re-confirmed live this session; prices and ratings visible on the listing pages were deliberately **not** recorded (R3).

| # | Supplied link | Resolved ASIN (observed) | Product (listing title, abridged) | Category | Source |
|---|---|---|---|---|---|
| 1 | link.amazon/B04G1MEwY | `B0CDY277D3` | CHEFMAN 6 Quart Dual Basket Air Fryer Oven… | Air fryers | [Listing](https://www.amazon.com/dp/B0CDY277D3) |
| 2 | link.amazon/B02NbDxp3 | `B09B7SB46R` | Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven… | Air fryers | [Listing](https://www.amazon.com/dp/B09B7SB46R) |
| 3 | link.amazon/B00hJ57DV | `B08DKYBTPH` | Chefman Air Fryer 8 Qt \| TurboFry® 4-in-1 with 450°F Hi-Fry… | Air fryers | [Listing](https://www.amazon.com/dp/B08DKYBTPH) |
| 4 | link.amazon/B0c8moW59 | `B0DHZTCNR5` | ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉… | Thermometers | [Listing](https://www.amazon.com/dp/B0DHZTCNR5) |
| 5 | link.amazon/B0f3GKalj | `B0DZFD6R9Z` | CHEF iQ Sense \| Smart Wireless Meat Thermometer \| 3 Ultra-Thin Probes… Gen3 | Thermometers | [Listing](https://www.amazon.com/dp/B0DZFD6R9Z) |

The set is coherent: three air fryers that are structurally different machines, and the two thermometers that tell you when the food is done. That is the editorial spine the site is built on.

**None of the five resolved URLs carried a visible `tag` parameter.** The site therefore publishes tagged canonical Special Links built from each observed ASIN plus `shopnow047c-20`, and does not use the untagged short links as money links (FLG-001, FLG-003). Do not claim the supplied short links are invalid — their exact compliance status is unresolved (FLG-003).

**Intended ASIN is blank for all five** (FLG-002). The ASINs above are *observed* redirect targets, stored in their own field and never merged into the intended field. Rationale: an ASIN is a 10-character Amazon Standard Identification Number, unique per listing/region — a checkable identifier, but only if the intended value is confirmed by the owner rather than inferred from a short-link code.

## 3. The decisions that determine whether this is a business

Ordered by downside if left open. Full reasoning in the Decision Room. **Nothing below is implemented until the owner chooses a path in `/suggestions/`.**

1. **Do the supplied short links credit your account?** (Q-01, FLG-001) — Mint one link in Associates Central and compare the parameters. Under an hour. Nothing earns until this is closed. Test one link per product in the enrolled Associates workflow and confirm destination + tracking report before scaling (S02).
2. **Buy and document one review unit** (SUG-01, FLG-004) — The only durable answer to thin-affiliation risk and reader distrust. Pick the cheapest of the five, buy it, publish the receipt.
3. **Deploy the analytics endpoint** (SUG-03, FLG-007) — Until it exists, the next topic is chosen by instinct. Deploy the supplied worker (`analytics/collector-worker.js`), set one line in `assets/js/site.js` (`ENDPOINT`), run 30 days. The five events are frozen: `page_view`, `product_view`, `outbound_click`, `guide_complete`, `capture_intent`.
4. **Decide who the site belongs to** (Q-05) — Google’s site-reputation policy weighs stated authorship; an unauthored affiliate page is its own example of a problem. A named byline and a two-line biography.
5. **Choose the brand once** (FLG-012) — The canonical site is “Counterwise”; preserved `/go/` pages from an earlier generation say “The Crisp Kitchen”. One name, then one template change.
6. **Submit the sitemap + Search Console** (SUG-13, FLG-008) — Files exist; submission is the step that turns files into indexing. Needs the owner’s verification token.

## 4. What is deliberately absent, and why

| Absent | Reason | Source |
|---|---|---|
| **Prices** | Permitted only when Amazon serves the link or data comes via Creators API / PA API. Static page has neither. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Star ratings / sales position** | Same rule; ratings are Amazon’s content, not this site’s judgement. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| **Product photography** | IP License forbids storing/caching Product Advertising Content images; a static site is a cache. Generated illustrations are used and labelled. | [A2 IP License](https://affiliate-program.amazon.com/help/operating/policies) |
| **Any traffic / conversion / revenue figure** | No authorised report exists. Ledger ships with schema and zero rows. No conversion score or revenue forecast is presented. | [A2 Commission Statement](https://affiliate-program.amazon.com/help/operating/policies) |
| **“We tested this”** | Nothing has been handled. FTC: you cannot talk about your experience with a product you have not tried. | [F1](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) |
| **Commission rates / “high-converting” scores / trend data** | None verified. Products are ranked by cooking decision, not by payout. No live feed exists. | [A3](https://affiliate-program.amazon.com/) |
| **AI-generated product facts** | No AI step writes specs. Every spec comes from the listing record in `_build/listing-evidence.mjs`. AI drafting, if ever approved (Q-12), is a suggestion until human-checked. | [A2 §2(b) inaccurate-claims rule](https://affiliate-program.amazon.com/help/operating/policies) |

## 5. How it reads as a shop (and how it ranks)

- **Shop first:** front page leads with the chooser, the five picks, then the two category hubs, then the guides. Dashboards live in the footer and one navigation group. Every dashboard surface is reachable from the footer.
- **Decision tools (S15):** 30-second chooser (what you cook / where it lives / app tolerance → starting point + pick page), 3 printable worksheets (capacity, cleanup/counter-space, thermometer calibration), FAQ matrix on front page + both hubs. All run in the browser; nothing is collected.
- **Timely topics without hype:** November editorial picks (holiday roast, game-day wings, weeknight format, leftovers) reframe existing guides. They are labelled hypotheses. No popularity, search-volume or sales claim is made; R15 fails the build if one appears.
- **Clusters:** air-fryer cluster (format, capacity, cleanup, wings, leftovers) and thermometer cluster (safe temperatures, checking vs watching, holiday roast) link to each other and to the comparison table.
- **Seasonal notebook:** four cooking moments (weeknight two-food, big-batch sharing, holiday roasts, summer grilling) reframe guides as hypotheses.
- **Publication polish:** byline (author, date, reading time) on every guide, worksheet and product page; Counterwise brand; generated editorial illustrations labelled as such.
- **Findability:** one indexable site (superseded trees are noindex + disallowed), sitemap + RSS generated from the same data as the pages (new guides/worksheets cannot ship unlisted), canonicals + Open Graph + JSON-LD on every page, `rel="sponsored"` on every Amazon link, fortnightly cadence (bursts are scaled-content abuse per G2).
- **Automation + gate:** generation, sitemap, feed, R1–R15 compliance gate, link crawl and HTTP smoke at `/WinB/` all run on every build and fail the publish on breach. Product facts, prose, topic choice and ledger rows stay human-gated.

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

Amazon listing data (titles, ASINs, category paths) is the 2026-11-20 observed record, re-confirmed live this session for all five ASINs (see §2 source links). Prices and ratings visible on those pages were not recorded. ASIN definition (10-character Amazon Standard Identification Number, unique per listing/region) is corroborated by secondary sources; Amazon publishes no standalone ASIN glossary page, so it is recorded as corroboration, not official confirmation.

## 7. Flags (none blocks publication — all published at `/flagged/`)

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
| FLG-012 | Two brands on one host (“Counterwise” vs “The Crisp Kitchen” on `/go/`) | Open — owner chooses one name |
| FLG-013 | Three listings contradict themselves (presets 24 vs 25; accessories 6 vs 7; wattage 1000 vs 1700; battery 50 vs 70h) | Needs review — both values printed |
| FLG-014 | Published specs previously reported as “not stated” | **Fixed** (transcribed in `listing-evidence.mjs`) |

## 8. Recommendation — choose a path before implementing anything else

**Path B first, Path C in parallel** (see `/decisions/` and `/suggestions/` for all three paths, with cost, reversibility and failure mode per proposal):

1. Close the tagging question (SUG-02). Nothing else earns until then.
2. Deploy the collector and submit the sitemap (SUG-03, SUG-13). Run 30 days; choose the next topic from measured queries, not instinct.
3. Name the byline (Q-05), choose the brand once (FLG-012), and use the new worksheets in the next guide.
4. Buy one review unit (SUG-01) when the owner approves the spend.

Do not publish the topic queue until its gates pass. Do not add categories until one converts (SUG-08). Do not automate optimization until measurement exists (Priority 4: measure before automating).

## 9. Honest limitations

- No price, rating, sales, traffic, conversion or revenue figure appears anywhere. There are none, on purpose.
- No search-volume or popularity claim is made. Seasonal moments, November picks and queued topics are labelled hypotheses.
- The site’s economics are currently unproven and possibly zero: if the supplied links do not carry a tag, nothing is tracked.
- Nothing was tested by hand, so authority rests on documentation and reasoning, not on measurement.
- The “AI-powered platform” in the original brief is scoped honestly in §1: generation + gating are automated; research, pricing, trend and commission intelligence are not built and are not claimed.
- Compliance conclusions describe how the build responds to quoted policy text. They are not legal advice.

## 10. Re-check of 2026-11-20 (session `ab61d616`, task S16)

Added after the sections above. Sections 1–9 describe the build as it stood before this check and are not rewritten.

**What was re-checked, and how.** The five canonical listing pages (`/dp/B0CDY277D3`, `/dp/B09B7SB46R`, `/dp/B08DKYBTPH`, `/dp/B0DHZTCNR5`, `/dp/B0DZFD6R9Z`) and the five supplied `link.amazon` short links were fetched again through the `fetch_page` tool. The sandbox shell cannot reach amazon.com, so this tool was the only path. Full record: `data/shop/recheck-2026-11-20.json`.

| Item | Result on this check | Flag |
| --- | --- | --- |
| Five listing pages: ASIN in the URL and title match the register | **5 of 5 match** ([L1](https://www.amazon.com/dp/B0CDY277D3), [L2](https://www.amazon.com/dp/B09B7SB46R), [L3](https://www.amazon.com/dp/B08DKYBTPH), [L4](https://www.amazon.com/dp/B0DHZTCNR5), [L5](https://www.amazon.com/dp/B0DZFD6R9Z)) | — |
| Short links that reached the recorded ASIN | 2 of 5 (B00hJ57DV, B0f3GKalj) | FLG-016 |
| Short links that reached amazon.com's home page instead of a product | 2 of 5 (B04G1MEwY, B0c8moW59) | FLG-016 |
| Short link that returned HTTP 500 from the tool | 1 of 5 (B02NbDxp3) | FLG-016 |
| Redirect targets that contain `tag=` | 0 of 5 | FLG-001 (unchanged) |
| Live root returns two different builds to two requests | Observed; cause not known | FLG-017 |
| Privacy copy omitted the host's IP logging | Fixed: one sentence added to the privacy page | FLG-018 (fixed) |
| Two flag registers disagree on IDs; one claim out of date | Open | FLG-019 |
| `FLG-012` used twice in the flag list | Resolved: PR #37 renamed the duplicate to FLG-015 | FLG-020 (resolved) |

**What this does not show.** It does not show that any short link is invalid. A single retrieval path on one day cannot establish that. The earlier record (§3) and this check disagree for three links, and the cause is unknown. Those three links should be checked from a signed-out browser and from the Associates link builder by the account owner.

**What is still not verified, and needs the owner.** Whether the tag `shopnow047c-20` is enrolled and approved (FLG-001). Whether any supplied short link is an enrolled Special Link (FLG-003). Whether a Special Link test in the Associates workflow reports the expected destination and tracking (not run; it requires the account). Search Console, analytics endpoint and any mailing list: none is configured in this build (FLG-007, FLG-008).

**Sources added.** [D1 — GitHub Docs, What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), read 2026-11-20, for the hosting and visitor-IP statement.
