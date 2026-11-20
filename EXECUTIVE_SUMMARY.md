# Executive summary

**Project:** an Amazon Associates publication for five kitchen products
**Tracking ID requested:** `shopnow047c-20`
**Site:** https://sassnarep3-star.github.io/WinB/
**Prepared:** 2026-11-20. All sources opened and read that day.

---

## 1. What was asked for, and what exists now

| Ask | Status | Where it lives |
| --- | --- | --- |
| Read like a shop, not an audit | Done | Front page, two category hubs, five product pages |
| Findable by search engines | Done | Canonical URLs, `sitemap.xml`, `feed.xml`, `robots.txt`, JSON-LD on guides |
| Trustworthy machinery | Done for what can be automated; everything else is gated and published | `build.py`, `verify.py`, `/dashboard/flags.html` |
| Read like a publication | Done | Masthead, disclosure strip, bylines, original illustrations, editorial type |
| Lead with products, keep the dashboard reachable | Done | Front page leads with products; all four register surfaces sit in the footer |
| Question-shaped guides, then measure | Five guides published; cadence and analytics endpoint are open decisions | `/guides/`, Q-06, Q-08 |
| Click and conversion measurement | Client built and loaded; endpoint deliberately unset; ledger empty | `assets/analytics.js`, `/dashboard/analytics.html` |
| Disclosure above the fold on every page | Done | Disclosure strip under the masthead on all 25 pages, repeated in every footer |
| Every outbound product link marked sponsored | Done, enforced by the build check | `rel="sponsored"` plus a visible label |
| Product-intent confirmation record | Done, inline | Intended ASIN and observed redirect kept in separate fields on every product row |
| Validated Special Links before scaling | Gated, not assumed | FLG-003, Q-02 |
| Human-sounding buyer questions | Done | Five guides, working titles marked as hypotheses |
| Measure before automating optimisation | Done | Empty dated ledger; no forecast, no conversion score |
| Compliance gate in the publishing workflow | Done | `verify.py` fails the build on a missing disclosure or an unmarked purchase link |
| No manual input from you | Done | Everything below was decided and built without a prompt |

---

## 2. The five products, resolved

All five supplied short links were followed on 2026-11-20. Every one returned a
live Amazon.com product detail page. Full field-by-field detail is on
`/dashboard/`.

| Supplied link | Resolved ASIN | Product | Category | Capacity |
| --- | --- | --- | --- | --- |
| `link.amazon/B04G1MEwY` | `B0CDY277D3` | CHEFMAN 6 Qt Dual Basket Air Fryer Oven | Air fryers | 6 qt total (2 × 3 qt) |
| `link.amazon/B02NbDxp3` | `B09B7SB46R` | Emeril Lagasse 26 Qt French Door Air Fryer Toaster Oven | Air fryers | 26 qt |
| `link.amazon/B00hJ57DV` | `B08DKYBTPH` | Chefman 8 Qt TurboFry | Air fryers | 8 qt |
| `link.amazon/B0c8moW59` | `B0DHZTCNR5` | ThermoMaven 1 Sec Digital Meat Thermometer | Thermometers | n/a |
| `link.amazon/B0f3GKalj` | `B0DZFD6R9Z` | CHEF iQ Sense Gen3 Wireless Meat Thermometer | Thermometers | 3 probes |

Every field above is reproduced from the product page itself, and each one is
linked to that page on the site. Nothing was inferred from the short-link
identifier.

---

## 3. The five findings that matter

**3.1 No link carried a tracking tag.**
Each supplied `link.amazon/<id>` URL resolved to a bare `amazon.com/dp/<ASIN>`
with no `tag=shopnow047c-20`. Amazon pays commission only on clicks through
Special Links that carry your Associates tag. This is the single largest open
item and it is a revenue item, not a content item. It is **not** being called a
failure: `link.amazon` is Amazon's own shortener and may add attribution
server-side. Status: unresolved. (`FLG-003`)

**3.2 No prices, ratings, or review counts are published anywhere.**
Amazon's Participation Requirements allow price and availability display only
if Amazon serves the link containing that data, or if it arrives through the
Creators API or Product Advertising API with a required date/time stamp and
disclaimer. Customer reviews and star ratings have the same restriction.
Neither condition is met, so every price cell is empty with the reason stated.
(`FLG-002`)

**3.3 Nothing on the site has been hands-on tested, and every page says so.**
FTC guidance is explicit that you cannot describe experience with a product you
have not tried. Five separate disclosures carry this: the byline, a callout on
each review page, the footer, the About page, and the flag itself. (`FLG-001`)

**3.4 The tracking ID's enrolment cannot be confirmed from outside the account.**
`shopnow047c-20` matches the documented US Store ID pattern, which ends `-20`.
Whether it is approved, in good standing, or past the qualifying-sales review
window is visible only inside Associates Central. (`FLG-005`)

**3.5 The register identifiers in the brief have no source document here.**
`SG-27`–`SG-30`, `S01`, `S07`, `S24`, `FLG-003`, and priorities 4 and 5 are
carried through as inherited labels. The register they belong to is not in this
repository, which before this pass held a one-line README. Reconstructing it
would have been fabrication. (`FLG-006`)

---

## 4. What was verified, and against what

Eleven primary sources were read in full on 2026-11-20. Every factual claim on
the site traces to one of them and links to it.

| Source | Used for |
| --- | --- |
| [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (updated 2025-10-15) | §5 disclosure statement wording; §1 Special Links |
| [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (updated 2026-04-14) | Participation requirements, price display rules, IP licence, trademark guidelines, commission statement |
| [Associates Central help — identifying yourself](https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE) | Link-level disclosure must be clear and conspicuous |
| [Amazon Associates FAQ](https://www.amazon.com/b?ie=UTF8&node=51812349011) | Store ID `-20` suffix; 3-qualifying-sales path; payment minimums |
| [Amazon Privacy Notice](https://www.amazon.com/gp/help/customer/display.html?nodeId=468496) (2026-06-30) | What happens after a visitor leaves this site |
| [16 CFR Part 255](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255) | Clear-and-conspicuous definition; material connection rules |
| [FTC Endorsement Guides Q&A](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Affiliate disclosure obligations |
| [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) | Placement: not on an About page, not behind a click |
| [Amazon: Understanding ASINs](https://sell.amazon.com/blog/what-is-an-asin) | ASIN is a 10-character code, visible after `/dp/` |
| [USDA FSIS safe temperature chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart) | Every temperature figure quoted in the thermometer content |
| [sitemaps.org protocol](https://www.sitemaps.org/protocol.html) · [RSS 2.0](https://www.rssboard.org/rss-specification) · [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | Sitemap, feed, and metadata construction |

---

## 5. What the site contains

25 pages, plus a sitemap, an RSS feed, and a robots file.

- **Front page** — publication layout: lead story, two category cards, three-product shortlist, four guide cards, and a register strip.
- **Two category hubs** — air fryers and thermometers, each with original framing prose.
- **Five product pages** — a written verdict, a sourced specification table, and an explicit list of what could not be confirmed.
- **Five guides** — basket vs oven, capacity, cleanup and counter space, multi-function appliances, thermometer type. Original prose; around 4,500 words in total.
- **Four register surfaces, all reachable from the footer** — product register, source register, open questions, flagged for review.
- **A suggestions section** — eight proposals, each with impact, effort, confidence, the trade-off, and the alternative paths.
- **Trust pages** — how the site works, affiliate disclosure, privacy notice.

---

## 6. Questions that must be answered before the next decision

Twelve, published on `/dashboard/questions.html` with what is known, what is
missing, what it blocks, and where the answer comes from. The five that matter
most:

1. **Q-01** Is `shopnow047c-20` enrolled and in good standing today?
2. **Q-02** Do the five supplied links actually attribute clicks to that ID?
3. **Q-03** Which commission category and rate applies to these two product groups?
4. **Q-04** Do we test products ourselves, or publish permanently as a specification comparison?
5. **Q-05** Is this the niche we commit to for a quarter, given no demand data exists yet?

Nothing on this site pretends to answer any of them.

---

## 7. Recommendations

Full reasoning, trade-offs, and alternative paths are in `/suggestions/`.
In short:

1. **Resolve FLG-003 first.** One test click per product inside an enrolled
   account, checked against the click report. Everything else is secondary to
   whether the links can earn.
2. **Keep the honesty flags public.** They are the difference between a site
   that survives a compliance read and one that does not.
3. **Publish guides before more buying guides.** Question-shaped titles are
   cheaper to rank and convert better two searches deep.
4. **Connect the analytics endpoint before writing anything else.** Without it
   the next topic is chosen on instinct, which is the thing the brief set out to
   avoid.
5. **Do not add prices** unless and until PA API access exists and the stamp and
   disclaimer are in place.

---

## 8. Honest limitations of this pass

- No product was tested. Nothing here is a review in the first-hand sense.
- No traffic, keyword, or conversion data exists, so no forecast or score is
  given. The campaign ledger is deliberately empty.
- Enrolment status, commission rates, and click attribution are unverifiable
  without account access, and are flagged rather than guessed.
- Two visual checks (rendered screenshots) could not be run in this
  environment: the headless browser available needs system libraries that this
  sandbox cannot install. The HTML, links, and generated markup were verified
  programmatically instead — every internal link resolves, every page carries
  the disclosure, and every purchase link is marked sponsored.
