# Executive summary

**Project:** a working Amazon Associates shop front for five supplied products
**Site:** The Crisp Kitchen — https://sassnarep3-star.github.io/WinB/
**Build date:** 2026-11-20
**Tracking ID supplied:** `shopnow047c-20` — **status unconfirmed** (see §4)

---

## 1. What was asked for, and what state it is in

| Requirement in the brief | Status | Where it lives |
|---|---|---|
| Review the repo, line by line, against trusted sources | **Done** — the repo contained no application code (one 6-byte README), which is itself the finding | `FLG-008`, research log R-01 |
| Marketing for the five supplied links | **Done** — all five resolved and written up as a shop | `/`, `/products/` |
| Clean landing page + subpages by category | **Done** — 27 pages, five categories of surface, dashboard in the footer | `/index.html` |
| Simple dashboard-style table of all findings | **Done** — four verification tables plus claim, flag, and question tables | `/verification/` |
| Every row sourced to an official link; blanks where unconfirmed | **Done** — 3 fields deliberately blank, 10 flags, 20 questions | `/verification/`, `/flagged/` |
| Live GitHub Pages site | **Done** — published from `main` | PR + deploy record in `COORDINATION.md` |
| Executive summary | **This document** | `EXECUTIVE-SUMMARY.md` |
| Read like a shop, not an audit | **Done** — buyer question first, dashboards moved to the footer | `/index.html` |
| Suggestions section so a human can choose a path | **Done** — 26 suggestions, 3 coherent paths, one recommendation | `/decisions/` |
| Clear list of questions with answers and gaps | **Done** — 20 questions, each with known/missing/blocks/how-to-close | `/decisions/questions.html` |

## 2. The five products, as resolved

Every supplied link was opened once on 2026-11-20. **In all five cases the short code did not match the ASIN the link resolved to** — the codes look like ASINs but are not.

| # | Supplied link | Resolved ASIN | Product | Category |
|---|---|---|---|---|
| 1 | link.amazon/B04G1MEwY | `B0CDY277D3` | Chefman 6-Quart Dual Basket Air Fryer | Air fryers |
| 2 | link.amazon/B02NbDxp3 | `B09B7SB46R` | Emeril Lagasse 26QT French Door Air Fryer Oven | Air fryers |
| 3 | link.amazon/B00hJ57DV | `B08DKYBTPH` | Chefman 8-Quart TurboFry | Air fryers |
| 4 | link.amazon/B0c8moW59 | `B0DHZTCNR5` | ThermoMaven 1-Second Meat Thermometer | Thermometers |
| 5 | link.amazon/B0f3GKalj | `B0DZFD6R9Z` | CHEF iQ Sense Gen3 Wireless Thermometer | Thermometers |

The set is coherent: three air fryers and the two thermometers that tell you when the food is done, which both listings name air-fryer use for. That is the editorial spine the site is built on.

**None of the five links carried a visible `tag` parameter** when resolved.

## 3. The four decisions that determine whether this is a business

Everything else is optimisation in front of these. They are on `/decisions/questions.html` as Q-01, Q-02, Q-05 and Q-13.

1. **Is the Associates account real and approved?** Only the owner can check this. Nothing earns until it does. → `FLG-001`
2. **Do the links actually track?** Requires the one-link enrollment test: generate one SiteStripe link, publish it, click it once, confirm the click in the report. Then scale. → `FLG-003`
3. **Where does event data go?** The site has five defined events and no endpoint. A static host cannot receive them. → `Q-05`
4. **Can we show prices?** Only from Amazon-served data or the Product Advertising API. No static price may be published. → `FLG-004`

## 4. What is deliberately absent from the site, and why

These are the most important engineering decisions in the build. Each is a place where adding an attractive feature would have breached a rule or published an unverifiable number.

| Absent | Reason |
|---|---|
| **Prices** | Amazon permits a site to show price and availability only if Amazon serves the data in the link, or it comes from the Creators API / Product Advertising API with a timestamp and a fixed disclaimer. A hand-copied price satisfies neither. |
| **Star ratings** | Same rule, plus the retrieved page text interleaves the viewed product's data with "customers also viewed" data, so attribution could not be made confidently. |
| **Product photography** | The Product Advertising Content licence forbids storing or caching images. A static site is a cache. The hero is a generated editorial illustration, labelled as such. |
| **Any traffic, conversion or revenue number** | No authorised report exists. The campaign ledger ships with defined columns and zero rows rather than a plausible-looking demonstration figure. |
| **"We tested this"** | Nothing was physically handled. Federal guidance is explicit that you cannot describe experience with a product you have not tried. Every claim is labelled *seller claim*, *editorial inference* or *observed*. |
| **Commission rates / "high-converting" scores** | None verified. Ranking products by payout would have been an invention; the site ranks by cooking decision instead. |

## 5. What the build enforces mechanically

The site is generated from JSON by `tools/build.js` and gated by `tools/check.js`, which exits non-zero on any breach. **Currently: 32 files checked, 50 passes, 0 warnings, 0 failures.**

The gate fails the build if:

- any product destination lacks `rel="sponsored"`
- any internal link wrongly carries `rel="sponsored"`
- any page loses either disclosure (under-masthead strip, footer repeat)
- any claim cites a source ID that is not in the register
- any internal link or asset fails to resolve
- a price or rating is populated in the product data
- first-hand testing language appears in product copy
- the sitemap, feed or robots file disagrees with the pages

The build caught four real defects during development, including a link helper that had silently produced 60 dead internal links on the front page.

## 6. Verification posture

**11 sources** in the register. **8 retrieved and quoted** during the build; **3 listed but not retrieved**, each marked, each linked, none used to support a claim:

- Amazon Seller Central ASIN glossary — requires a seller sign-in
- sitemaps.org protocol — host not reachable from the build sandbox
- GA4 outbound-click documentation — referenced only, no GA4 claim made

Primary sources actually read and quoted include the Associates Operating Agreement (for the exact disclosure sentence), the Associates Program Policies (price, image-cache, agent and trademark clauses), the Commission Income Statement (attribution window), the FTC's disclosures guidance, and Google's sitemap documentation.

## 7. Flags raised: 10

| ID | Item | Severity |
|---|---|---|
| FLG-001 | Associates enrollment for the supplied tag unconfirmed | blocking for revenue |
| FLG-002 | Sales-activity threshold not re-read against the account | informational |
| FLG-003 | No visible tag on any supplied link; no code matched its ASIN | material |
| FLG-004 | No price or rating published, by policy | accepted |
| FLG-005 | NIST/NSF certification claims repeated only as seller claims | material |
| FLG-006 | Nothing physically tested | material |
| FLG-007 | Listing data read once, on one date | informational |
| FLG-008 | Repo contained no code to review | closed |
| FLG-009 | GitHub Actions disabled; resolver workflow inert | informational |
| FLG-010 | No conversion measurement possible from this environment | material |

None of these blocks publication. All ten are published with source links at `/flagged/`.

## 8. Recommendation

**Path B — open the data taps.** In this order:

1. Confirm the account and the tag (**Q-01**). Nothing else matters until this is done.
2. Run the one-link enrollment test (**Q-02**).
3. Configure an event endpoint (**Q-05**).
4. Apply for Product Advertising API access (**Q-13**).

Then publish one guide a week, and stop after four weeks to read the data before writing the fifth. The growth plan pre-registers what "working" would look like so the thresholds cannot be renegotiated once the numbers exist.

## 9. Honest limitations of this document

- No price, rating or sales figure in this summary is estimated. There are none, on purpose.
- No search-volume claim is made anywhere. The four guide topics are working hypotheses.
- The site's economics are currently unproven and possibly zero: if the supplied links do not carry a tag, nothing is tracked.
- Nothing was tested by hand, so the site's authority rests on documentation and reasoning, not on measurement.
- Compliance conclusions here describe how the build responds to quoted policy text. They are not legal advice.
