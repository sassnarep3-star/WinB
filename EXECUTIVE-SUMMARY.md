# Executive summary — Counterwise

**Project:** a working Amazon Associates shop front for five supplied kitchen products
**Site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20 (UTC) — merged polish cycles (sessions `30073780`, `ab61d616`, `9c38041d`, `0beabda2`)

**Build date:** 2026-11-20 (UTC) — S17 refresh (session `ac3d816c`), following S15/S16 and the trend-topic cycle
**Associate tag supplied:** `shopnow047c-20` — **status unconfirmed** (see §3, FLG-001)
**Pages:** 37 canonical pages (incl. 5 affiliate exit pages), 47 sitemap routes, 16 feed items (recounted at each merge round)
**Sources:** 12 official policy/agency sources + 5 per-listing source rows (L1–L5), all re-fetched live 2026-11-20 (see §6, §11–§13)

**Build date:** 2026-11-20 (UTC) — re-verified same day by QA session `arena-21850b97` (S15)
**Associate tag supplied:** `shopnow047c-20` — **status unconfirmed** (see §3, FLG-001)
**Pages:** 28 canonical pages + 5 affiliate exit pages, 30 sitemap routes, 7 feed items
**Sources:** 10 documented official sources (§6) plus the five product listings, all fetched and read on 2026-11-20

**Pages:** 41 canonical pages + 5 affiliate exit pages, 51 sitemap routes, 20 feed items, 55 pages audited by the publication gate. 18 canonical guides, 3 printable worksheets, 5 product pages, 2 category hubs (counts are read from the build output at this merge, not copied from an earlier cycle)
**Sources:** 17 registered official sources, each with a retrieval date; re-fetched live on 2026-11-20 (see §6, §10–§12). No value is published that an official page has not been read for.

**Scope boundary — read this first.** This repository delivers a static affiliate publication with automated page generation and a compliance gate that fails the build on breach. It is **not yet an AI-powered research or campaign-optimization platform**, and this summary does not claim otherwise. There is no deployed AI agent, no live trend/commission feed, no live analytics endpoint, no Search Console data, and no verified conversion reporting. What *is* automated today: page/sitemap/feed generation from a single data file, the R1–R16 compliance gate (verify + publication gate + the register gate), link crawling, and an HTTP smoke test at the real `/WinB/` path. What stays human-gated by design: every product fact, every word of guide prose, every topic choice, and every ledger row. Any future AI drafting would be treated as a suggestion until a human checks it against a source (Q-12). Those capabilities need authorized data access (Creators API / PA API, Associates Central, Search Console), deployment credentials, and human approval gates before they can be claimed or switched on.

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo line by line against trusted sources | **Done** — re-verified 2026-11-20 by fetching each official source live (A1, A2, F1, U1, G1, G2, G4) and all five Amazon listings | `/data-room/#sources`, `COORDINATION.md` S15 appendix |
| Marketing for the five supplied links | **Done** — all five resolved and written up as a shop | `/`, `/reviews/` |
| Clean landing page + subpages by category | **Done** — front page, 2 category hubs, 5 product pages, comparison table | `/index.html`, `/air-fryers/`, `/thermometers/`, `/compare/` |
| Dashboard-style tables of all findings | **Done** — product-intent record, source register, automation pipeline, organic playbook, events, ledger, inventory | `/data-room/` |
| Every row sourced; blanks where unconfirmed | **Done** — intended ASIN blank for all five, stated specs printed where the listing states them (FLG-014), blanks left where it does not, 20 flags, plus a 10-row information-gaps register | `/data-room/#products`, `/flagged/` |
| Live GitHub Pages site | **Done** — published from `main`, Pages `built` | `COORDINATION.md` §5–§7 |
| Executive summary | **This document** + `/executive-summary/` | `EXECUTIVE-SUMMARY.md` |
| Read like a shop, not an audit | **Done** — products first, registers in footer + one navigation group | `/index.html` |
| Polished publication feel (authorship, brand, imagery, seasons, clusters) | **Done** — bylines, Counterwise brand, generated illustrations, seasonal notebook, 2 clusters | `/`, `/methods/`, `/about/` |
| Polished marketing feel + trendy, timely topics + organic traffic | **Done** — November editorial picks, 30-second chooser, 3 printable worksheets, FAQ matrix; all timely framing is labelled hypothesis, never a demand claim | `/`, `/tools/`, `/guides/` |
| Suggestions section to choose a path before implementing | **Done** — 3 paths, a 10-row decision board, all 14 proposals carrying named options A/B/C with a recommended option and a decision gate, a decision-record box, and a Path A/B/C design-and-content board (Part five); nothing is implemented until an option is recorded | `/suggestions/`, `/decisions/#decision-record` |
| Design suggestions feeding the build prompt, + catchy trend topic engine | **Done** — 15 design suggestions, 10 gated working titles, design brief | `/direction/` |
| Questions / information / answers + discovery plan | **Done** — 15 questions (known / missing / how to find), a 10-row information-gaps register, 9 blocking questions, 8 decision inputs with have/missing/discover, discovery plan, owner-action checklist, FAQ matrix | `/decisions/#questions`, `/decisions/#gaps`, `/decisions/inputs.html`, `/suggestions/`, `/` (FAQ) |
| Findable (one site to index) | **Done** — sitemap, RSS, robots, canonicals, OG, JSON-LD, noindex on superseded trees | `/sitemap.xml`, `/feed.xml`, `/robots.txt` |
| Trustworthy machinery (automate + gate) | **Done** — R1–R15 gate fails the build; human gates for facts, prose, topics, ledger | `/data-room/#automation` |
| Disclosure above the fold on every page | **Done** — strip under masthead + footer repeat, enforced by R1/R13 | every page |
| Every outbound product link marked sponsored | **Done** — `rel="sponsored nofollow noopener"` + tag, enforced by R2/R10 | every page |
| Product-intent confirmation record (separate fields) | **Done** — intended ASIN and observed redirect never merged | `/data-room/#products` |
| Question-shaped guides + measurement before more writing | **Done** — 12 guides published (5 evergreen + the ice-test calibration guide + 3 winter seasonal + 3 S15); every future title gated on 30 days of data | `/guides/`, `/decisions/#queue` |
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

**S15 re-read, 2026-11-20 (session `arena-21850b97`).** All five `/dp/` URLs were fetched live again and every listing title was confirmed verbatim against the register. The P02 (Emeril Lagasse) page's *Features & Specs* and *Item details* tables were read for the first time this cycle: they state **1700 W / 120 V**, model **4-00675-02X-VN**, **75–500 °F** control settings, and **16.9″ × 15.8″ × 14.8″** outer dimensions — values previously recorded as "not stated". They are now published (evidence file `_build/listing-evidence.mjs`; category and comparison tables). The same tables add a third data point to the accessories contradiction (FLG-013): the title and the *Included Components* enumeration say six, the *Configuration* row and the Product Description say seven. Still unresolved; both values still published. The P01 About-bullet lines were **not** re-located in the sampled chunks of that page's 27-chunk render, so P01's rows stand on the same-day full read recorded in the evidence file — no new fact was added for P01.

**None of the five resolved URLs carried a visible `tag` parameter.** The site therefore publishes tagged canonical Special Links built from each observed ASIN plus `shopnow047c-20`, and does not use the untagged short links as money links (FLG-001, FLG-003).

**Intended ASIN is blank for all five** (FLG-002). The ASINs above are *observed* redirect targets, stored in their own field and never merged into the intended field. Rationale: an ASIN is a 10-character Amazon Standard Identification Number, unique per listing/region — a checkable identifier, but only if the intended value is confirmed by the owner rather than inferred from a short-link code.

## 3. The decisions that determine whether this is a business

Ordered by downside if left open. Full reasoning in the Decision Room. **Nothing below is implemented until the owner chooses a path in `/suggestions/`.**

1. **Do the supplied short links credit your account?** (Q-01, DI-01, FLG-001) — Mint one link in Associates Central and compare the parameters. Under an hour. Nothing earns until this is closed. Test one link per product in the enrolled Associates workflow and confirm destination + tracking report before scaling (S02).
2. **Buy and document one review unit** (SUG-01, DI-03, FLG-004) — The only durable answer to thin-affiliation risk and reader distrust. Pick the cheapest of the five, buy it, publish the receipt.
3. **Deploy the analytics endpoint** (SUG-03, DI-04, FLG-007) — Until it exists, the next topic is chosen by instinct. Deploy the supplied worker (`analytics/collector-worker.js`), set one line in `assets/js/site.js` (`ENDPOINT`), run 30 days. The five events are frozen: `page_view`, `product_view`, `outbound_click`, `guide_complete`, `capture_intent`.
4. **Decide who the site belongs to** (Q-05, DI-06) — Google’s site-reputation policy weighs stated authorship; an unauthored affiliate page is its own example of a problem. A named byline and a two-line biography.
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
- **Clusters:** air-fryer cluster (format, capacity, cleanup, wings, leftovers) and thermometer cluster (safe temperatures, checking vs watching, the two-minute ice test, holiday roast) link to each other and to the comparison table.
- **Seasonal notebook:** four cooking moments (weeknight two-food, big-batch sharing, holiday roasts, summer grilling) reframe guides as hypotheses; a seasonal entry band on the front page routes into the same themes.
- **Seasonal guides published this cycle:** "Hosting season: which machine cooks what on the big day?" and "Five gifts for the cook who already has an oven" — both question-shaped and sourced; all timely framing labelled hypothesis.
- **Publication polish:** byline (author, date, reading time) on every guide, worksheet and product page; Counterwise brand; generated editorial illustrations labelled as such.
- **Design direction & topics:** a reviewable `/direction/` surface carries the design brief that feeds the next build (15 suggestions) and a gated trend-topic engine (10 catchy working titles) so the next article is chosen by measurement, not instinct.
- **Findability:** one indexable site (superseded trees are noindex + disallowed), sitemap + RSS generated from the same data as the pages (new guides/worksheets cannot ship unlisted), canonicals + Open Graph + JSON-LD on every page, `rel="sponsored"` on every Amazon link, fortnightly cadence (bursts are scaled-content abuse per G2).
- **Automation + gate:** generation, sitemap, feed, R1–R15 compliance gate, link crawl and HTTP smoke at `/WinB/` all run on every build and fail the publish on breach. Product facts, prose, topic choice and ledger rows stay human-gated.

## 6. Sources (all official, re-fetched live 2026-11-20)

| Ref | Source | Used for |
|---|---|---|
| A1 | [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (Updated Oct 15, 2025) | §5 disclosure wording; Special Link definition; §6 material breach |
| A2 | [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (Updated Apr 14, 2026) | Tag requirement; price rule; IP License; cookie disclosure; commission session (24h / 89 days) |
| A3 | [Associates program home](https://affiliate-program.amazon.com/) | Program overview |
| F1 | [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) (Nov 2019) | Hard-to-miss disclosure; no experience claims for untried products |
| F2 | [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) | Material-connection disclosure |
| G1 | [Google: Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | `rel="sponsored"` for paid/affiliate links |
| G2 | [Google Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | Scaled content, thin affiliation, site reputation, sneaky redirects |
| G3 | [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Sitemap format and submission |
| G4 | [sitemaps.org protocol](https://www.sitemaps.org/protocol.html) | Sitemap XML schema (single host, UTF-8, entity-escaped) |
| U1 | [USDA FSIS Safe Temperature Chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) (Last Updated Apr 14, 2025) | Safe minimum internal temperatures quoted in thermometer guides |
| U2 | [USDA FSIS Food Thermometers factsheet](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers) | Ice-water and boiling-water calibration methods quoted on the ice-test guide |

Amazon listing data (titles, ASINs, category paths) is the 2026-11-20 observed record in the Data Room — and was **independently re-verified the same day by session `arena-b36a7b54`** (first re-check since the original resolution): all five listings fetched live, titles matching word for word, category paths matching. Prices and ratings visible during those fetches were deliberately not copied (R3). The dated log sits in the Data Room (`/data-room/#verification-log`).

The P02 (Emeril Lagasse) page's *Features & Specs*, *Measurements* and *Item details* tables were read live during the S15 QA pass and are now recorded in `_build/listing-evidence.mjs`: 1700 W / 120 V, model 4-00675-02X-VN, 75–500 °F control settings, 16.9″ × 15.8″ × 14.8″ outer dimensions. The same tables add a third data point to the accessories contradiction (FLG-013): the title and the *Included Components* enumeration say six, the *Configuration* row and the Product Description say seven. Both values are published; nothing was resolved by inference. The P01 About-bullet spec lines were not re-located in the sampled chunks of that page's 27-chunk render, so P01's rows stand on the same-day full read recorded in the evidence file.

## 7. Flags (21 — none blocks publication)

| ID | Item | Status |
|---|---|---|
| FLG-001 | Supplied short links redirect without an Associates tag | Open |
| FLG-002 | Intended ASIN unconfirmed for all five | Open |
| FLG-003 | Compliance status of link.amazon short links unresolved | Open |
| FLG-004 | No product has been handled by this desk | Open |
| FLG-005 | Prices and ratings deliberately not displayed | Open |
| FLG-006 | Certification and performance claims are manufacturer claims | Open |
| FLG-007 | No analytics endpoint deployed; no traffic figures exist | Open |
| FLG-008 | No mailing provider, Search Console token, or custom domain | Open |
| FLG-001 | The supplied short links redirect without an Associates tag | Open |
| FLG-002 | Intended ASIN for each product is unconfirmed | Open |
| FLG-003 | Compliance status of link.amazon short links is unresolved | Open |
| FLG-004 | No product has been handled by this desk | Open |
| FLG-005 | Prices and star ratings are deliberately not displayed | Open |
| FLG-006 | Certification and performance claims are manufacturer claims | Open |
| FLG-007 | No analytics endpoint is deployed, so no traffic figures exist | Open |
| FLG-008 | No mailing provider, no Search Console token, no custom domain | Open |
| FLG-010 | Affiliate redirect pages were marked noindex and nofollow | **Fixed in this build** (generator now emits index,follow; enforced by R10) |
| FLG-015 | Fix recorded in a script CI does not run; two brands on the live site (renumbered from a duplicated FLG-012) | **Fixed in this build** (CI generator corrected). ID note: recorded as FLG-012 by session 2139de5f; renumbered to FLG-015 (og:image occupied FLG-012; FLG-014 was taken). |
| FLG-011 | Six competing site generations had accumulated on one host | Needs review |
| FLG-012 | Every page advertised a social image that did not exist | **Fixed in this build** (real image; gate R11 now guards it) |
| FLG-009 | Several earlier sessions published competing versions of this site | Needs review |
| FLG-014 | Three product pages reported stated specifications as "not stated" | **Fixed** — and re-found in the editorial hub/compare tables during S15, where wattage was hardcoded "not stated" despite three listings stating it; fixed in the same pass |
| FLG-013 | Three listings contradict themselves on their own stated figures | Needs review — both values printed; P02 accessories contradiction gained a third data point on 2026-11-20 (S15) |
| FLG-016 | On a second check, two of the five supplied short links did not reproduce their recorded redirect, and one returned an error | Open |
| FLG-017 | The live site root served two different builds to two requests on the same day | Open |
| FLG-018 | The privacy page did not say that the hosting provider logs visitor IP addresses | Fixed in this build |
| FLG-019 | Two flag registers disagree, and one entry in the older register is out of date | Open |
| FLG-020 | Flag ID FLG-012 was used twice in the FLAGS list | **Fixed** (duplicate renumbered to FLG-015) |
| FLG-021 | Three specification values were shown that the listing text re-read on 2026-11-20 does not state | **Fixed in this build** (blanked, not inferred) |

All 21 are published with evidence and source links at `/flagged/`.

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

## 11. This cycle — verification record (session arena-9c38041d, 2026-11-20)

Every source below was read live during this session; nothing was inferred.

| # | Source | URL | Confirmed |
|---|--------|-----|-----------|
| S-1 | Amazon Associates Program Operating Agreement §5 | https://affiliate-program.amazon.com/help/operating/agreement | Disclosure sentence "As an Amazon Associate I earn from qualifying purchases." must be clear and prominent; the site uses it verbatim above the masthead and in the footer on every page (rule R1). |
| S-2 | Amazon Associates Program Policies, Participation Requirements §2(b) | https://affiliate-program.amazon.com/help/operating/policies | Every Amazon link must carry the Associate ID "tag" as a URL parameter; prices/availability only when Amazon serves the link or via Creators API / PA API; no inaccurate or misleading product claims. The tag `shopnow047c-20` is on every product link; its account validity is unconfirmed (FLG-003). |
| S-3 | Google Search Central — Qualify your outbound links | https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links | `rel="sponsored"` for paid/affiliate links; every Amazon product link on the site carries `rel="sponsored nofollow noopener"` (rule R2). |
| S-4 | Google Search Central — Spam policies | https://developers.google.com/search/docs/essentials/spam-policies | Thin affiliation, scaled content abuse, site reputation and sneaky redirects named; the site's fortnightly cadence, single canonical site and disclosed exit pages answer these (rules R7, R10). |
| S-5 | sitemaps.org — Sitemaps XML protocol | https://www.sitemaps.org/protocol.html | Single host, UTF-8, entity-escaped `<urlset>` with `<loc>` per page; sitemap.xml validates and lists every indexable page (rule R7). |
| S-6 | USDA FSIS — Safe Minimum Internal Temperature Chart | https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart | 145°F (+3 min rest) steaks/chops/roasts; 160°F ground meats and eggs; 165°F poultry and leftovers/casseroles; 145°F fish — matches `/guides/temperature-safety.html` row for row (source U1). |
| S-7 | FTC — Disclosures 101 | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | Disclose where hard to miss; simple language acceptable; no experience claims for untried products; no made-up claims needing proof — the site's no-hands-on framing follows this (rule R4). |
| S-8 | Amazon listings, all five, fetched live 2026-11-20 | https://www.amazon.com/dp/B0CDY277D3 · /dp/B09B7SB46R · /dp/B08DKYBTPH · /dp/B0DHZTCNR5 · /dp/B0DZFD6R9Z | Each supplied short link resolves to its registered ASIN; titles, brands and breadcrumbs match the product register exactly; none of the resolved short links carries a `tag` parameter (FLG-001). |

**Note on divergence with §10 (S16 re-check).** §10 reports that a second same-day re-check of the five supplied short links did not reproduce all five redirect targets (2 reached the recorded ASIN, 2 reached amazon.com's home page, 1 returned HTTP 500; flagged FLG-016, cause unknown, not asserted invalid). This cycle's S-8 records the earlier 2026-11-20 observation (all five reached their registered ASINs). Both records are kept; neither is presented as proof of compliance or non-compliance. The account owner should settle it with the one-link Special Link test in Associates Central (FLG-001/FLG-003).

**Added this cycle (reviewable before implementing — `/suggestions/`):**
- DQ-11 "Air fryer or oven? The five-minute counter test that picks before you buy"
- DQ-12 "Instant-read or leave-in? Which thermometer Thanksgiving actually needs"
- DQ-13 "Dishwasher-safe does not mean dishwasher-sized: the air-fryer cleanup test"
- DQ-14 "Two baskets or one: the weeknight meal that makes a dual-basket worth it"

Each is an editorial hypothesis, not a popularity claim; each is gated on the measurement baseline (DQ-02 / DQ-Q10) and none is published until someone chooses it from the queue.

## 12. Second-pass verification record (session `0beabda2`, 2026-11-20)

An independent second pass over the same ground as §11, run later the same day.

| Item | Result on this pass |
|---|---|
| All five supplied short links re-resolved live | **All five reproduced the registered targets** (B0CDY277D3, B09B7SB46R, B08DKYBTPH, B0DHZTCNR5, B0DZFD6R9Z), listing titles unchanged; again no `tag=` parameter in any resolved URL |
| All ten register sources (A1–A3, F1–F2, G1–G4, U1) re-read line by line | Every quote printed on the site compared against the fetched text: **all confirmed, no drift** |
| Citation irregularity found and fixed | The register attributed the machine-learning clause to "IP License §1 and §2(c)"; it sits in Participation Requirements §5 **and** IP License §1. The citation now names both. Substance unchanged |

**On the FLG-016 divergence.** Three retrieval records now exist for the short links, all dated
2026-11-20: two passes in this session that reproduced all five targets (and S-8 in §11), and the
S16 pass in §10 that reproduced only two, with two landing on the amazon.com home page and one
HTTP 500. The records are kept side by side; none of them establishes that any supplied short link
is valid or invalid. The cause of the divergence is unknown and the compliance status stays
unresolved (FLG-003). The owner settles it with the one-link Special Link test in Associates
Central (DI-01).

## 13. Independent re-verification of the PR #44 state (session `69bfe2b0`, 2026-11-20)

This session started from `745c087` (PR #40), merged `origin/main` through PR #41 and PRs
#43/#44 (`1772ab8`), and re-ran every gate on the merged state. Nothing was inferred; every
source below was fetched live by this session's own retrieval.

**Official sources re-read live, 2026-11-20 (this session's own fetches):**

| Ref | Source | Confirmed this pass |
|---|---|---|
| A1 | [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) | Page shows "Updated: October 15, 2025". §1 Special Links definition ("tagged link formats"); §5 disclosure sentence **verbatim**: "As an Amazon Associate I earn from qualifying purchases."; §6 "any violation of Section 5 … deemed a material breach". |
| A2 | [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) | Page shows "Updated: April 14, 2026". §1 original-content requirement; §2(a) "Special Links must use the Associates ID we have assigned to you"; §2(b) tag "appearing as XXXXX-##, or such other format as we may designate"; price/availability only via Amazon-served link or Creators API / PA API; "must not make inaccurate, overbroad, deceptive or otherwise misleading claims about any Product". |
| F1 | [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) | "Place it so it's hard to miss"; simple language; "You can't talk about your experience with a product you haven't tried." (November 2019). |
| U1 | [USDA FSIS Safe Temperature Chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) | All rows re-read: 145°F + 3 min rest (steaks/chops/roasts; ham uncooked), 160°F ground meats, 165°F ground poultry, 140°F reheated USDA-inspected ham, 165°F all poultry, 160°F eggs, 145°F fish & shellfish, 165°F leftovers/casseroles. "Last Updated: Apr 14, 2025". |
| G1 | [Google — Qualify your outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | `rel="sponsored"` = "advertisements or paid placements". "Last updated 2025-12-10 UTC". |

**The five listings, re-fetched live 2026-11-20 (canonical `/dp/` pages):**

| Register ID | ASIN | Title match |
|---|---|---|
| P01 | [B0CDY277D3](https://www.amazon.com/dp/B0CDY277D3) | Yes — "CHEFMAN 6 Quart Dual Basket Air Fryer Oven with Easy View Windows…" |
| P02 | [B09B7SB46R](https://www.amazon.com/dp/B09B7SB46R) | Yes — "Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven… 24 One-Touch Preset Options… Six Cooking Accessories" |
| P03 | [B08DKYBTPH](https://www.amazon.com/dp/B08DKYBTPH) | Yes — "Chefman Air Fryer 8 Qt \| TurboFry® 4-in-1 with 450°F Hi-Fry Option…" |
| P04 | [B0DHZTCNR5](https://www.amazon.com/dp/B0DHZTCNR5) | Yes — "ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉ Accuracy \| NIST&NSF Certified…" |
| P05 | [B0DZFD6R9Z](https://www.amazon.com/dp/B0DZFD6R9Z) | Yes — "CHEF iQ Sense \| Smart Wireless Meat Thermometer \| 3 Ultra-Thin Probes… Gen3" |

5 of 5 ASINs and titles match the product register exactly. Prices and ratings were visible
on the listings and were deliberately **not** recorded (Participation Requirements §2(b); rule R3).

**New data point for FLG-016 (short-link consistency).** In this retrieval,
`https://link.amazon/B04G1MEwY` landed on **amazon.com's home page** (final URL
`https://www.amazon.com/`, title "Amazon.com. Spend less. Smile more."), not the CHEFMAN
listing. This matches the S16 observation for the same link. As before: this is recorded as
an observed redirect, is **not** a claim that any supplied link is invalid, and the resolution
path remains the one-link Special Link test in Associates Central (FLG-001 / FLG-003). The
site's own outbound links are unaffected: they are tagged canonical `/dp/` URLs, and rule R2
verified all 40 of them this pass.

**Build and gate results on the merged state (line by line):**

| Check | Command | Result |
|---|---|---|
| Full CI generation sequence | `node _build/build.mjs && node _build/make-images.mjs && node tools/build.cjs && node tools/noindex.cjs && node tools/consolidate.mjs` | 36 files / 28 register pages / 5 go pages; **zero drift** against the committed tree |
| Content rules | `node tools/verify.mjs` | **PASS** R1–R11 — 31 canonical pages, 18 superseded-but-preserved, 40 Amazon links, 334 internal links |
| Editorial rules | `node tools/gate.mjs` | **PASS** R11–R15 — 43 canonical pages, 56 social images, 3,739 class usages |
| Register publication gate | `node tools/check.cjs` | **All gates passed** (2 pre-existing warnings in the archived tree, unchanged) |
| Link + XML check | `node tools/linkcheck.mjs` | **PASS** — 58 files crawled, 0 broken links, sitemap and feed valid |
| HTTP smoke at `/WinB/` | `BASE=… node tools/smoke.mjs` | **PASS** — 32 pages, 60 linked assets, all 200 |

**Rendered-defect sweep.** All canonical pages were grepped for `[object Object]`,
`undefined`, `NaN`, empty `<tbody>`, and the known historical spacing defects (`1 probes`,
`aFrench`): none present. All five product pages print the correct ASIN. `/compare/` renders
rows. Sitemap lists 37 routes; the feed carries 10 items; robots.txt allows the canonical site
and disallows the superseded trees.

**Still open after this pass (unchanged, all published on `/flagged/`):** FLG-001/FLG-003
(tag enrolled and short links as Special Links — owner check in Associates Central),
FLG-002 (intended ASINs blank by design), FLG-006 (manufacturer certification claims
uncorroborated), FLG-007/FLG-008 (analytics endpoint and Search Console need owner
accounts), FLG-012/FLG-015 (two brands on one site — generator-owned; unifying is
PR #25's proposal), FLG-016 (short-link inconsistency, new data point above),
FLG-017 (CDN edge-cache staleness after deploy), FLG-019 (duplicate flag registers).


## 12. This cycle — published editorial, dated provenance, and one identity (session `ac3d816c`, 2026-11-20)

Four things changed. None of them added a fact about a product that was not already read from a listing.

**1. The four queued trend topics are now guides.** DQ-11…DQ-14 were sitting in the review queue awaiting a decision; they are published and the queue rows now say **Built** with an *Outcome* line:

| From the queue | Published as | What it does |
|---|---|---|
| DQ-11 counter test | `/guides/counter-fit-test.html` | Depth, clear height under the cabinet, sink width — then the vent clearance in the manual. Says out loud that **external dimensions are not stated on any of the three listings**, so the site does not invent them. |
| DQ-12 thermometer | `/guides/wifi-probe-timing.html` | Reframed on purpose: the original wording duplicated the live holiday-roast guide, so this one answers the attention question (watching vs sampling, what “unlimited range” has to survive in a real house) against the two listings’ own statements and the USDA 165 °F figure. |
| DQ-13 cleanup | `/guides/dishwasher-fit.html` | Separates “dishwasher-safe” (a coating claim the listing makes) from “dishwasher-sized” (a rack measurement nobody publishes), and counts the parts that touch food. |
| DQ-14 dual basket | `/guides/two-basket-weeknight.html` | 3 + 3 = 6 against one 8 qt, decided from the reader’s own weeknight rather than from a ranking. |

Titles are questions, every product figure is attributed to the listing, and `tools/gate.mjs` R15 still fails the build on any popularity, sales-rank or search-volume assertion. Publishing them **before** measured demand existed was a decision taken by the build rather than by the owner; it is recorded as **FLG-022 (Needs review)** with the reasoning, and DQ-Q10 (choose the next topics from measured queries) stays open and still gates the next cycle.

**2. Every product page now dates itself.** DQ-10 shipped: a “Last checked” stamp plus a per-read change log. The first entry earned its place immediately — the ThermoMaven listing (`B0DHZTCNR5`) was read twice on 2026-11-20 by two different sessions and served two different titles: the register recorded “…IP67 Waterproof for Grill BBQ \| Black”, the re-read served “…for Grill BBQ, Stocking Stuffers Gifts for Men, Black” and “NIST&NSF” without the spaces. Same ASIN, same listing, same day. Logged as **FLG-021 (Mitigated in this build)**: a seller keyword edit, not a product change, and exactly why an undated specification is a claim about a moment.

**3. One site, one name, one indexable copy of every topic.** Eleven indexable pages still carried a second brand and four of them were near-duplicates of published guides. `tools/consolidate.mjs` now: rebrands the register hub, the three about pages and the five `/go/` exit pages to the single publication identity; gives the four duplicate guides and three duplicate oversight pages `noindex,follow` with a `rel=canonical` at their canonical twin plus a visible pointer for any reader who arrives from an old link; and prunes `sitemap-register.xml` so no sitemap lists a page that asks not to be indexed. `tools/check.cjs` was changed to assert that invariant from the page itself rather than from a hand-maintained path list, and `tools/gate.mjs` gained **R16**: fail if an indexable page advertises a second brand, if a sitemap lists a noindex page, or if two indexable pages share an H1. R16 caught a real regression the hour it was written (the `/go/` pages regenerated with the old brand). Closes the surviving half of FLG-015; FLG-019’s factual half is corrected at source (see below) with the ID-namespace rename left as a logged request, because those anchors are hardcoded through the register generator.

**4. A decision queue that remembers.** `/suggestions/` gained Part five — *Already decided, and what happened* — rendering the built items with their outcome, so a reviewer can see what the last choice shipped and what it cost, not only what is pending.

### Verification run for this cycle (all fetched live, 2026-11-20 UTC)

| Check | Result | Source |
|---|---|---|
| Five listing pages re-read: ASIN in URL, title, category path | 4 of 5 identical to the register; P04 title drifted as above; P03 renders “TurboFry®” | [L1](https://www.amazon.com/dp/B0CDY277D3) · [L2](https://www.amazon.com/dp/B09B7SB46R) · [L3](https://www.amazon.com/dp/B08DKYBTPH) · [L4](https://www.amazon.com/dp/B0DHZTCNR5) · [L5](https://www.amazon.com/dp/B0DZFD6R9Z) |
| USDA safe minimums quoted in the new guide (165 °F all poultry; 145 °F + 3 min rest for steaks/roasts; 165 °F leftovers and casseroles) | Matches the chart exactly; page states “Last Updated: Apr 14, 2025” | [USDA FSIS](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) |
| Older register claim “GitHub Actions is disabled on this repository” | **False as of this check** — four active workflows, and Pages deploys from `main`. Corrected at source in `data/shop/flags.json` with the original observation kept; `verification/research-log` entry annotated. Closes the factual half of FLG-019 | [Actions on this repository](https://github.com/sassnarep3-star/WinB/actions) |
| Prices, ratings, sales ranks read from listings and published | **None.** Every one of the five pages served a price and a star rating; neither is recorded anywhere (rule R3, Program Policies §2(b)) | [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) |
| `tag=` on the resolved destinations | Still none observed on the resolved URLs — FLG-001 unchanged, still the owner’s ten-minute check | [Associates Central](https://affiliate-program.amazon.com/) |

**Still not verified, and not claimed:** the account behind `shopnow047c-20`; whether the supplied short links are enrolled Special Links; anything at all about hands-on performance; any traffic, click, order, conversion or revenue figure (no collector is deployed, the ledger has 0 rows); and whether any of the twelve guides has been read by anyone. No number in this document is a forecast.
