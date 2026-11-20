# Executive summary

**Project:** an Amazon Associates shop front for five supplied products
**Canonical site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Parallel register surface:** “Crisp Kitchen” register pages at `/register/`, `/products/`, `/verification/`, `/compliance/`, `/platform/` (kept from an earlier session; the root Counterwise publication is the single indexed site)
**Build date:** 2026-11-20
**Tracking ID supplied:** `shopnow047c-20` — **status unconfirmed** (see §4)

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo line by line against official sources | **Done** — every source re-fetched and compared claim by claim on 2026-11-20 (§5) | `/data-room/#sources` |
| Marketing for the five supplied links | **Done** — all five resolved and published as five pick pages | `/reviews/` |
| Clean landing page + subpages by category | **Done** — publication front page leads with the products; category hubs, comparison table, guides | `/` |
| Findable: one site to index | **Done** — one canonical sitemap + RSS feed; superseded generations are noindex | `/sitemap.xml`, `/feed.xml` |
| Read like a shop, not an audit | **Done** — front page, picks and guides are buyer-first; registers kept behind the footer nav | `/` |
| Catchy, seasonal topics that can earn organic traffic | **Done** — 3 seasonal clusters (holiday hosting, gifting, weeknight crisping) and 8 question-shaped guides | `/guides/` |
| Disclosure above the fold on every page + footer | **Done** — enforced by rule R1 in the build gate | every page |
| Outbound links marked sponsored | **Done** — `rel="sponsored nofollow noopener"`, tagged `shopnow047c-20` | enforced by R2 |
| Product-intent record: intended ASIN separate from observed redirect | **Done** — two columns, never merged; intended ASIN blank until the owner confirms | `/data-room/#products` |
| Click/conversion measurement machinery | **Shipped, not deployed** — privacy-preserving counter, 5 defined events, self-hosted collector source, empty campaign ledger with a frozen schema | `/data-room/#events`, `/data-room/#ledger` |
| Suggestions section: review and choose a path before anything is built | **Done** — 13 suggestions, each with explicit decision paths and what is needed to choose | `/decisions/` |
| Clear list of questions: known / missing / how to find out | **Done** — 12 questions, 3 answered, 9 open with named discovery actions | `/decisions/#questions` |
| Flag irregularities for review | **Done** — 11 flags published with evidence and sources; none block | `/flagged/` |
| Live GitHub Pages site | **Done** — deployed from `main` | PR + deploy record in `COORDINATION.md` |

## 2. The five products, as resolved

Every supplied link was opened once on 2026-11-20 and the redirect target recorded exactly as served. **In all five cases the short code did not match the ASIN the link resolved to** — the codes look like ASINs but are not.

| # | Supplied link | Resolved ASIN | Product | Category |
|---|---|---|---|---|
| 1 | link.amazon/B04G1MEwY | `B0CDY277D3` | Chefman 6 qt Dual Basket Air Fryer | Air fryers |
| 2 | link.amazon/B02NbDxp3 | `B09B7SB46R` | Emeril Lagasse 26QT French Door Air Fryer Toaster Oven | Air fryers |
| 3 | link.amazon/B00hJ57DV | `B08DKYBTPH` | Chefman 8 qt TurboFry Air Fryer | Air fryers |
| 4 | link.amazon/B0c8moW59 | `B0DHZTCNR5` | ThermoMaven 1-Second Digital Meat Thermometer | Thermometers |
| 5 | link.amazon/B0f3GKalj | `B0DZFD6R9Z` | CHEF iQ Sense Gen3 Wireless Meat Thermometer | Thermometers |

The set is coherent: three structurally different air fryers, and the two thermometer types (instant-read and leave-in probe) that the USDA temperature guidance is written for. That is the editorial spine the site is built on.

**None of the five resolved URLs carried a visible `tag` parameter.** The site publishes tagged Special Links built from the observed ASINs so clicks are attributable regardless; whether the supplied short links credit the account is unresolved (FLG-001, Q-01) and is not claimed either way.

## 3. The decisions that determine whether this is a business

Everything else is optimisation in front of these. Full reasoning with decision paths is in the Decision Room.

1. **Do the supplied short links credit the account?** (SUG-02 / Q-01) Mint one link in Associates Central, compare parameters. Under an hour, largest downside if skipped.
2. **Buy and document one review unit** (SUG-01) — the only durable answer to thin-affiliation risk and reader distrust.
3. **Deploy the analytics endpoint** (SUG-03 / FLG-007) — until it exists, the next topic is chosen by instinct. Collector source ships ready to deploy.
4. **Approve the seasonal calendar and the byline** (SUG-09 / SUG-11 / Q-05 / Q-11) — identity and seasons are editorial decisions only the owner can make.

## 4. What is deliberately absent from the site, and why

Each is a place where an attractive feature would have breached a rule or published an unverifiable number.

| Absent | Reason | Source |
|---|---|---|
| **Prices** | Amazon permits prices only when Amazon serves the data in the link, or via Creators API / PA API under the licence. A hand-copied price satisfies neither. | A2 §2(b) |
| **Star ratings / review counts** | Same rule; ratings are Amazon’s content, not this site’s endorsement. | A2 §6(t) |
| **Hands-on test claims** | Nothing was physically handled. FTC guidance is explicit that you cannot describe experience with a product you have not tried. Manufacturer claims are labelled as listing claims. | F1 |
| **Any traffic, conversion or revenue number** | No authorised report exists. The campaign ledger ships with defined columns and zero rows rather than a plausible-looking demonstration figure. | FLG-007 |
| **Stock product photography** | A photo implying handling would imply a relationship that does not exist; manufacturer imagery is licence-restricted. Editorial food scenes are used instead and labelled as illustrative. | A2 IP License |

## 5. Verification performed (2026-11-20)

All ten official sources were re-fetched and compared line by line against every claim quoted on the site. Every quoted claim matched the pages as served:

| Ref | Source | Result |
|---|---|---|
| A1 | [Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) | §5 disclosure wording exact; Special Links definition exact; page dated October 15, 2025 as recorded |
| A2 | [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) | Participation Requirements §1, §2(b) tag rule, §2(b) price rule, §3(e) cookie disclosure, §6(t) ratings rule, IP License §1/§2(c) link + no-ML-training rules — all match; page dated April 14, 2026 as recorded |
| A3 | [Associates program home](https://affiliate-program.amazon.com/) | “up to 10%” and ~60-day payment wording match |
| F1 | [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) | All four quoted bullets match; dated November 2019 as recorded |
| F2 | [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) | §255.5(a) wording matches; title current as of 2026-11-18 as recorded |
| G1 | [Qualify your outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | `rel="sponsored"` and multi-value rules match; last updated 2025-12-10 as recorded |
| G2 | [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | Scaled-content, thin-affiliation and site-reputation passages match, including the unauthored-affiliate-article example |
| G3 | [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Sitemap-format support statement matches |
| G4 | [Sitemaps.org protocol](https://www.sitemaps.org/protocol.html) | `urlset`/`loc`/single-host/UTF-8 rules match |
| U1 | [USDA safe temperature chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) | Every temperature and rest time in the guides matches the chart; page Last Updated April 14, 2025 as recorded |

**New finding from the re-check (recorded, not blocking):** Participation Requirements §6(w) forbids link shortening “in a manner that makes it unclear that you are linking to an Amazon Site”. The supplied `link.amazon` links do make the Amazon destination clear by domain, so this clause does not condemn them — but their status as approved Special Links remains unresolved in both directions (FLG-003), exactly as published.

## 6. How to read the site

1. [/](https://sassnarep3-star.github.io/WinB/) — the shop front: shortlist, seasonal clusters, the five picks, guides.
2. [/decisions/](https://sassnarep3-star.github.io/WinB/decisions/) — Decision Room: 13 suggestions with decision paths, 12 questions (known/unknown/how to find out), rejected options with sources.
3. [/flagged/](https://sassnarep3-star.github.io/WinB/flagged/) — 11 flagged irregularities with evidence and the shortest route to closing each.
4. [/data-room/](https://sassnarep3-star.github.io/WinB/data-room/) — product-intent record, source register (with read dates), the five events, the empty campaign ledger with its schema.
5. [/methods/](https://sassnarep3-star.github.io/WinB/methods/) — how picks are made and which rules the build enforces.

---
*Disclosure, on this page too: **As an Amazon Associate I earn from qualifying purchases.***
