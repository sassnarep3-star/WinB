# Executive summary

**Project:** a working Amazon Associates shop front for five supplied products
**Canonical site:** Counterwise — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20 (publication-polish iteration)
**Tracking ID supplied:** `shopnow047c-20` — **status unconfirmed** (see §4)

> This document was refreshed in the 2026-11-20 polish iteration. Earlier generations of the
> site (The Crisp Kitchen register at `data/shop/` + `/register/`, `/docs/`, `/alt-site/`,
> `/legacy-docs-site/`, `archive/`) are preserved and marked noindex; their own summaries and
> registers remain in the repository and are not overwritten.

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo, line by line, against official sources | **Done, twice** — every register value carries a source link; every source was re-read live on 2026-11-20 (§6) | `/data-room/`, `/register/` |
| Marketing for the five supplied links | **Done** — all five resolved, re-verified, and written up as a shop | `/`, `/reviews/`, `/air-fryers/`, `/thermometers/` |
| Clean landing page + subpages by category, tables with source links | **Done** — 33 sitemap routes; register tables every row sourced | `/index.html`, sitemap |
| Read like a shop, not an audit | **Done in this iteration** — products lead the front page; seasonal entry points; the verification process lives in the oversight pages | `/`, `/suggestions/` |
| Catchy, trendy, question-shaped articles | **Done in this iteration** — 7 guides including hosting-season and gifting clusters | `/guides/` |
| Suggestions section: review and choose a path before anything changes | **Done in this iteration** — 9 suggestions as named Path A/B/C forks with effort, risk, status | `/suggestions/` |
| Clear list of questions, known information, and missing information, with discovery suggestions | **Done in this iteration** — 8 decision inputs, each with have/missing/discover | `/decisions/inputs.html` |
| Disclosure above the fold on every page + footer | **Done** — enforced by build rule R1 on all 30 canonical pages | every page |
| Sponsored, tagged outbound links | **Done** — 35 Amazon links, all `rel="sponsored nofollow noopener"` + `tag=shopnow047c-20`, enforced by R2 | every product page |
| Product-intent record: intended ASIN separate from observed redirect | **Done** — intended fields deliberately blank (FLG-002) | `/data-room/` |
| Measurement: privacy-preserving click counter, five events, empty ledger | **Shipped, not deployed** — no endpoint exists yet (FLG-007) | `/data-room/`, `/analytics/` |
| Compliance gate in the publishing workflow | **Done** — rules R1–R10 run on every build and fail it if broken | `tools/verify.mjs` |
| Live GitHub Pages site + merged PR | **Done** — PR record in `COORDINATION.md` | https://sassnarep3-star.github.io/WinB/ |

## 2. The five products, as resolved and re-verified

Every supplied link was opened on 2026-11-20 and **re-verified the same day** (second pass).
In all five cases the short code did **not** match the ASIN the link resolved to — the codes look
like ASINs but are not. The re-verification found **no drift**: same targets, same listing titles.

| # | Supplied link | Resolved ASIN | Product (listing title, abridged) | Listing source |
|---|---|---|---|---|
| 1 | `https://link.amazon/B04G1MEwY` | `B0CDY277D3` | CHEFMAN 6 Quart Dual Basket Air Fryer Oven | https://www.amazon.com/dp/B0CDY277D3 |
| 2 | `https://link.amazon/B02NbDxp3` | `B09B7SB46R` | Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven | https://www.amazon.com/dp/B09B7SB46R |
| 3 | `https://link.amazon/B00hJ57DV` | `B08DKYBTPH` | Chefman Air Fryer 8 Qt TurboFry 4-in-1 | https://www.amazon.com/dp/B08DKYBTPH |
| 4 | `https://link.amazon/B0c8moW59` | `B0DHZTCNR5` | ThermoMaven 1 Sec Professional Digital Meat Thermometer | https://www.amazon.com/dp/B0DHZTCNR5 |
| 5 | `https://link.amazon/B0f3GKalj` | `B0DZFD6R9Z` | CHEF iQ Sense Smart Wireless Meat Thermometer, Gen3 | https://www.amazon.com/dp/B0DZFD6R9Z |

**None of the five resolved URLs carried a visible `tag=` parameter**, on either pass (FLG-001).
The exact compliance status of the `link.amazon` short links is **unresolved** (FLG-003) — no
claim is made in either direction. The site publishes tagged canonical listing links instead.

## 3. The decisions that determine whether this is a business

The full matrix — what is known, what is missing, and how to discover the missing part — is at
`/decisions/inputs.html`. Ordered by downside if left open:

1. **Do the supplied short links credit the account?** (DI-01) Mint one link in Associates
   Central, compare parameters, click one per product, read the tracking report. Under an hour.
2. **Buy and document one review unit** (DI-03) — the only durable answer to thin-affiliation
   risk and reader distrust (Google spam policy G2; FTC F1).
3. **Deploy the analytics endpoint** (DI-04) — until it exists, the next topic is chosen by
   instinct, which is the failure mode this project set out to avoid.
4. **Decide who the site belongs to** (DI-06) — Google's site-reputation review weighs stated
   authorship; a named byline is half a day of work.

## 4. What is deliberately absent from the site, and why

| Absent | Reason | Source |
|---|---|---|
| Prices | Permitted only when Amazon serves the link data or the data comes via Creators API / PA API. A hand-copied price satisfies neither. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| Star ratings | Same rule, and a rating is Amazon's content, not this site's endorsement. | [A2 §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| "We tested this" | Nothing was physically handled. FTC guidance: "You can't talk about your experience with a product you haven't tried." | [F1](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) |
| Traffic, conversion or revenue numbers | No authorised report exists. The ledger ships with defined columns and zero rows rather than a plausible-looking figure. | FLG-007 |
| Certification claims as fact | "NIST&NSF", "±0.5°F", "1000°F" appear as attributed listing claims only. | FLG-006 |

## 5. Compliance posture

| Requirement | Implementation | Source |
|---|---|---|
| "As an Amazon Associate I earn from qualifying purchases." above the fold on every page and in the footer | Structural: one strip + one footer function used by every page; build rule R1 fails otherwise | [Operating Agreement §5](https://affiliate-program.amazon.com/help/operating/agreement) |
| Associate tag on every Amazon link | `tag=shopnow047c-20` on all 35 product links; build rule R2 | [Policies §2(b)](https://affiliate-program.amazon.com/help/operating/policies) |
| Paid links qualified for Google | `rel="sponsored nofollow noopener"` on every outbound product link | [Google: qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) |
| Material-connection disclosure, clear and conspicuous | Disclosure strip directly under the top of the page, before the masthead | [16 CFR 255.5](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5) |
| Cookie / measurement disclosure | Privacy page documents the five events and the counter; opt-out link in the footer | [Policies §3(e)](https://affiliate-program.amazon.com/help/operating/policies) |
| Exit pages indexable and disclosed | `/go/` pages carry `index,follow`, the disclosure and tagged sponsored links (FLG-010, fixed) | [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) |

## 6. Verification record (2026-11-20, second pass)

Every source on the source register was re-read line by line on 2026-11-20. All quotes on the
site were compared against the fetched text. Results:

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
| Five Amazon listings | ASIN, listing title, directory vs. the register | **Confirmed, no drift** |

**Irregularity found and fixed in this build:** the source register attributed the
machine-learning clause to "IP License §1 and §2(c)"; the clause actually sits in Participation
Requirements §5 **and** IP License §1. The citation now names both. Substance unchanged.

## 7. Flagged items (published at `/flagged/`, none block publication)

FLG-001 untagged short links · FLG-002 intended ASINs blank · FLG-003 short-link compliance
unresolved · FLG-004 no product handled · FLG-005 no prices/ratings shown · FLG-006 certification
claims are manufacturer claims · FLG-007 no analytics endpoint · FLG-008 no mailing provider /
Search Console token / custom domain · FLG-009–011 parallel-session history and site-generation
collision (010 fixed, 011 retired with noindex).

## 8. Owner checklist

1. Run the DI-01 link test in Associates Central (under an hour) — closes or confirms FLG-001/003.
2. Confirm the intended ASIN column in the Data Room (FLG-002).
3. Pick one path per card on `/suggestions/` — DS-04, DS-05, DS-06, DS-07, DS-08 need input.
4. Deploy the analytics worker and run 30 days (DI-04).
5. Decide on a review unit (DI-03) and a byline (DI-06).

*The disclosure applies to this document too: **As an Amazon Associate I earn from qualifying
purchases.*** Every claim above links to the official source it rests on; nothing is filled in
from memory.
