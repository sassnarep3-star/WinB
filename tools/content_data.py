# content_data.py — verified data layer for the Counter & Crisp site.
#
# Rules of this file:
#   * Every fact carries a source id (see SOURCES) or is explicitly marked unverified.
#   * Intended link fields and observed-redirect fields are kept in SEPARATE structures.
#   * Nothing is inferred: values we could not confirm from an official source are "" (blank).
#
# Verified 2026-11-20 by session arena/6fc7de34.

SITE = {
    "name": "Counter & Crisp",
    "tagline": "Air fryers & kitchen thermometers, compared plainly",
    "base_url": "https://sassnarep3-star.github.io/WinB",
    "tracking_id": "shopnow047c-20",
    "built": "2026-11-20",
    "disclosure": 'As an Amazon Associate I earn from qualifying purchases.',
}

# --------------------------------------------------------------------------
# SUBMITTED LINKS (intent fields — exactly as handed to us)
# --------------------------------------------------------------------------
SUBMISSIONS = [
    {"product": "P-01", "submitted_url": "https://link.amazon/B04G1MEwY", "submitted_id": "B04G1MEwY"},
    {"product": "P-02", "submitted_url": "https://link.amazon/B02NbDxp3", "submitted_id": "B02NbDxp3"},
    {"product": "P-03", "submitted_url": "https://link.amazon/B00hJ57DV", "submitted_id": "B00hJ57DV"},
    {"product": "P-04", "submitted_url": "https://link.amazon/B0c8moW59", "submitted_id": "B0c8moW59"},
    {"product": "P-05", "submitted_url": "https://link.amazon/B0f3GKalj", "submitted_id": "B0f3GKalj"},
]

# --------------------------------------------------------------------------
# OBSERVATIONS (redirect fields — what we actually saw, kept separate)
# Server-side fetch, 2026-11-20. Resolved URLs carried transient parameters
# (lv=shuf, plpRedirect=mhFallback, btn_ref=srctok-...) — mapping is OBSERVED,
# not confirmed. Browser-level confirmation is gated (FLG-001 / FLG-003).
# --------------------------------------------------------------------------
OBSERVATIONS = [
    {
        "product": "P-01", "observed_date": "2026-11-20",
        "observed_asin": "B0CDY277D3",
        "observed_url": "https://www.amazon.com/dp/B0CDY277D3",
        "observed_title": "CHEFMAN 6 Quart Dual Basket Air Fryer Oven with Easy View Windows, Sync Finish, Hi-Fry, Auto Shutoff, 2 Independent 3Qt Nonstick Dishwasher Safe Frying Baskets, Digital Double Air Fryer - Black",
        "observed_breadcrumb": "Home &amp; Kitchen › Kitchen &amp; Dining › Small Appliances › Fryers › Air Fryers",
        "observed_category": "Air fryer — dual basket",
    },
    {
        "product": "P-02", "observed_date": "2026-11-20",
        "observed_asin": "B09B7SB46R",
        "observed_url": "https://www.amazon.com/dp/B09B7SB46R",
        "observed_title": "Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven | Countertop Convection Cooker, 24 One-Touch Preset Options, Extra Large Interior, Six Cooking Accessories Included",
        "observed_breadcrumb": "Home &amp; Kitchen › Kitchen &amp; Dining › Small Appliances › Fryers › Air Fryers",
        "observed_category": "Air fryer — oven style",
    },
    {
        "product": "P-03", "observed_date": "2026-11-20",
        "observed_asin": "B08DKYBTPH",
        "observed_url": "https://www.amazon.com/dp/B08DKYBTPH",
        "observed_title": "Chefman Air Fryer 8 Qt | TurboFry 4-in-1 with 450°F Hi-Fry Option for Crispier Results | Bake, Dehydrate, Frozen | XL Nonstick Dishwasher-Safe Basket | Stainless Steel",
        "observed_breadcrumb": "Home &amp; Kitchen › Kitchen &amp; Dining › Small Appliances › Fryers › Air Fryers",
        "observed_category": "Air fryer — basket",
    },
    {
        "product": "P-04", "observed_date": "2026-11-20",
        "observed_asin": "B0DHZTCNR5",
        "observed_url": "https://www.amazon.com/dp/B0DHZTCNR5",
        "observed_title": "ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉ Accuracy | NIST&NSF Certified, Auto-Rotate Bright LED Screen, IP67 Waterproof for Grill BBQ, Stocking Stuffers Gifts for Men, Black",
        "observed_breadcrumb": "Home &amp; Kitchen › Kitchen &amp; Dining › Kitchen Utensils &amp; Gadgets › Thermometers &amp; Timers › Meat",
        "observed_category": "Thermometer — instant-read",
    },
    {
        "product": "P-05", "observed_date": "2026-11-20",
        "observed_asin": "B0DZFD6R9Z",
        "observed_url": "https://www.amazon.com/dp/B0DZFD6R9Z",
        "observed_title": "CHEF iQ Sense | Smart Wireless Meat Thermometer | 3 Ultra-Thin Probes | WiFi Unlimited Range | 1000°F Heat Safe | 5 Sensors | BBQ, Grill, Oven, Smoker, Air Fryer | Gen3",
        "observed_breadcrumb": "Home &amp; Kitchen › Kitchen &amp; Dining › Kitchen Utensils &amp; Gadgets › Thermometers &amp; Timers › Meat",
        "observed_category": "Thermometer — smart wireless",
    },
]

# --------------------------------------------------------------------------
# PRODUCTS — shop-facing facts. "claims" are seller statements taken verbatim
# from the observed listing title; they are not independently tested.
# price/rating/availability/wattage/dimensions: BLANK (unverified, FLG-002).
# --------------------------------------------------------------------------
PRODUCTS = [
    {
        "id": "P-01",
        "short_name": "Chefman 6 qt Dual Basket Air Fryer Oven",
        "brand": "Chefman",
        "format": "Dual-basket air fryer",
        "group": "air-fryers",
        "one_liner": "Two independent 3 qt baskets with a sync-finish option — cook two foods at once without sharing space.",
        "claims": [
            "6 qt total capacity (2 × 3 qt baskets) — per listing title",
            "Hi-Fry option and auto shutoff — per listing title",
            "Nonstick, dishwasher-safe baskets — per listing title",
        ],
        "price": "",
        "rating": "",
        "good_for": "Weeknight meals where a protein and a side need to finish together.",
        "check_first": "Counter width (two-basket footprint) and whether 3 qt per side fits your largest batch.",
    },
    {
        "id": "P-02",
        "short_name": "Emeril Lagasse 26 qt French Door Air Fryer Toaster Oven",
        "brand": "Emeril Lagasse",
        "format": "Oven-style air fryer",
        "group": "air-fryers",
        "one_liner": "A french-door countertop oven with 24 preset modes and room for bigger formats — the toaster-oven-killer shape.",
        "claims": [
            "26 qt interior — per listing title",
            "24 one-touch preset options — per listing title",
            "Six cooking accessories included — per listing title",
        ],
        "price": "",
        "rating": "",
        "good_for": "Households that want one appliance to absorb toast, bake, roast, and air-fry duty.",
        "check_first": "Height clearance under cabinets (french doors swing up) and the true interior rack dimensions.",
    },
    {
        "id": "P-03",
        "short_name": "Chefman TurboFry 8 qt Air Fryer",
        "brand": "Chefman",
        "format": "Basket air fryer",
        "group": "air-fryers",
        "one_liner": "A big single-basket drawer with a 450 °F Hi-Fry finish step — the simplest shape for one big batch.",
        "claims": [
            "8 qt basket — per listing title",
            "4-in-1: air fry, bake, dehydrate, frozen — per listing title",
            "450 °F Hi-Fry option — per listing title",
        ],
        "price": "",
        "rating": "",
        "good_for": "Crispy single-batch cooking with the least fuss — fries, wings, roasted vegetables.",
        "check_first": "Basket footprint against your counter, and whether the drawer is comfortable to load when hot.",
    },
    {
        "id": "P-04",
        "short_name": "ThermoMaven 1-Second Digital Meat Thermometer",
        "brand": "ThermoMaven",
        "format": "Instant-read probe thermometer",
        "group": "thermometers",
        "one_liner": "A fast-reading folding probe for spot-checking doneness — the tool that replaces the guesswork.",
        "claims": [
            "1-second readout — per listing title",
            "±0.5 °F claimed accuracy — per listing title",
            "NIST &amp; NSF certification claimed in title — documentation not independently checked (FLG-002)",
            "IP67 waterproof — per listing title",
        ],
        "price": "",
        "rating": "",
        "good_for": "Spot-checking steaks, chops, and roasts quickly at the pan or grill.",
        "check_first": "Ask the seller what certification documents back the accuracy claim; compare probe length to your usual cuts.",
    },
    {
        "id": "P-05",
        "short_name": "CHEF iQ Sense Smart Wireless Meat Thermometer (Gen 3)",
        "brand": "CHEF iQ",
        "format": "Wireless smart thermometer",
        "group": "thermometers",
        "one_liner": "Leave-in wireless probes with app monitoring — cook a whole bird without opening the oven door.",
        "claims": [
            "3 ultra-thin probes — per listing title",
            "WiFi monitoring — per listing title",
            "1000 °F heat-safe probes — per listing title",
            "5 sensors — per listing title",
        ],
        "price": "",
        "rating": "",
        "good_for": "Long cooks and holiday birds where you want temperature history without lifting a lid.",
        "check_first": "Whether the app works on your phone's OS version, and what the warranty covers on the probes.",
    },
]

# --------------------------------------------------------------------------
# SOURCES — official sites only. "how" records the verification performed.
# --------------------------------------------------------------------------
SOURCES = [
    {
        "id": "SRC-01",
        "org": "U.S. Federal Trade Commission",
        "title": "FTC's Endorsement Guides: What People Are Asking",
        "url": "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
        "supports": "Disclosure duties for affiliate recommendations; endorsements must be honest and not misleading",
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-02",
        "org": "eCFR (GovInfo)",
        "title": "16 CFR Part 255 — Guides Concerning the Use of Endorsements and Testimonials",
        "url": "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255",
        "supports": "Regulatory text of the Endorsement Guides (rev. 2023), incl. 'clearly and conspicuously'",
        "how": "Official link carried inside SRC-01 page content",
    },
    {
        "id": "SRC-03",
        "org": "USDA Food Safety and Inspection Service",
        "title": "Safe Minimum Internal Temperature Chart",
        "url": "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart",
        "supports": "Safe cooking temperatures quoted in the thermometer guides (e.g. poultry 165 °F, ground meats 160 °F, steaks 145 °F + 3 min rest)",
        "how": "Direct fetch 2026-11-20 (page last updated Apr 14, 2025)",
    },
    {
        "id": "SRC-04",
        "org": "Amazon Associates",
        "title": "Associates Program Policies",
        "url": "https://affiliate-program.amazon.com/help/operating/policies",
        "supports": "Qualifying-purchase session rules, Special Links definition, program requirements",
        "how": "Direct fetch 2026-11-20 (page states 'Updated: April 14, 2026')",
    },
    {
        "id": "SRC-05",
        "org": "Amazon Associates",
        "title": "Associates Program Operating Agreement",
        "url": "https://affiliate-program.amazon.com/help/operating/agreement",
        "supports": "Required Associate-identification statement; agreement terms behind the Program Policies",
        "how": "Official link carried inside SRC-04 policy text and nav",
    },
    {
        "id": "SRC-06",
        "org": "Amazon Associates Help",
        "title": "Why do I have to identify myself as an Associate?",
        "url": "https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE",
        "supports": 'Exact required statement: "As an Amazon Associate I earn from qualifying purchases." + link-level disclosure guidance',
        "how": "Official help-page content confirmed 2026-11-20 (search-indexed copy of affiliate-program.amazon.com; direct fetch bot-limited)",
    },
    {
        "id": "SRC-07",
        "org": "Amazon Developer Documentation",
        "title": "Glossary (VSK Fire TV) — ASIN",
        "url": "https://developer.amazon.com/docs/video-skills-fire-tv-apps/glossary",
        "supports": 'ASIN definition: "unique blocks of 10 letters and/or numbers that identify items"',
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-08",
        "org": "sitemaps.org",
        "title": "Sitemaps XML format",
        "url": "https://www.sitemaps.org/protocol.html",
        "supports": "Sitemap protocol used by sitemap.xml",
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-09",
        "org": "RSS Advisory Board",
        "title": "RSS 2.0 Specification",
        "url": "https://www.rssboard.org/rss-specification",
        "supports": "Feed format used by feed.xml",
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-10",
        "org": "GitHub Docs",
        "title": "GitHub Pages documentation",
        "url": "https://docs.github.com/en/pages",
        "supports": "Hosting/publishing behaviour of the live site",
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-11",
        "org": "U.S. Consumer Product Safety Commission",
        "title": "Recalls & Product Safety Warnings",
        "url": "https://www.cpsc.gov/Recalls",
        "supports": "Recall-check step in the buyer checklists (searchable, includes an Air Fryer category)",
        "how": "Direct fetch 2026-11-20",
    },
    {
        "id": "SRC-12",
        "org": "U.S. Federal Trade Commission",
        "title": "Disclosures 101 for Social Media Influencers",
        "url": "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers",
        "supports": "Plain-language 'clear and conspicuous' disclosure guidance",
        "how": "Official link carried inside SRC-01 page content",
    },
]

# --------------------------------------------------------------------------
# FINDINGS — analysis rows, each with a source anchor.
# --------------------------------------------------------------------------
FINDINGS = [
    ("F-01", "Each of the five submitted short links resolved to an amazon.com product detail page when fetched on 2026-11-20.", "Observation log (data/observations.json) + observed pages", "SRC-07"),
    ("F-02", "Observed listings span two categories: three Air Fryers (P-01..P-03) and two Meat Thermometers &amp; Timers (P-04..P-05), per the Amazon breadcrumb on each observed page.", "Observed page breadcrumbs", ""),
    ("F-03", "The submitted identifiers are 9 characters long; Amazon's documented ASIN shape is a block of 10 letters/numbers. Recorded as a format observation only — the short links' compliance status is unresolved (FLG-003) and they are not claimed invalid.", "SRC-07 + submission list", "SRC-07"),
    ("F-04", "All five fetches resolved through URLs carrying transient parameters (lv=shuf, plpRedirect=mhFallback, btn_ref=srctok-…). The redirect mapping is therefore logged as observed, not confirmed; browser-level confirmation is required before it is treated as final.", "Observation log", ""),
    ("F-05", "Price, star rating, review counts, availability, dimensions and wattage were not verifiable in machine-trustworthy form from official pages in this session (dynamic widgets showed carousel prices that cannot be attributed to the listed product). All such fields are left blank and flagged.", "FLG-002 / FLG-007", ""),
    ("F-06", "The disclosure statement required by the Associates Operating Agreement appears above the fold and in the footer on every shipped page.", "SRC-05 / SRC-06", "SRC-05"),
    ("F-07", "The repository contained only a one-line README before this session; no artifacts matching the brief's prior codes (S01/S02/S07/S24, SG-27..SG-30, earlier FLG numbers) exist in git history. Equivalents were re-issued as FLG-001..FLG-008 and SG rows in COORDINATION.md.", "git history of this repo", ""),
    ("F-08", "Listing-title claims (capacities, preset counts, claimed accuracies, certifications) are seller marketing statements. They are recorded verbatim as claims and are not endorsed or independently tested.", "SRC-04 (context) + observed listings", "SRC-04"),
]

# --------------------------------------------------------------------------
# FLAGS — the Flagged for Review page.
# --------------------------------------------------------------------------
FLAGS = [
    ("FLG-001", "Product-intent confirmation incomplete", "Official listing URL and confirmation date are left blank for all five products. The observed redirect targets are logged separately and need a human, browser-level confirmation before the intent record is complete.", "Open — owner decision needed", "data/observations.json; register.html"),
    ("FLG-002", "Product specifications unverified", "Price, rating, review counts, dimensions, wattage, and availability are blank throughout the site. Nothing was inferred or copied from unattributable widgets.", "Open — approve a data source (e.g. Product Advertising API after enrollment) or keep blank", "register.html"),
    ("FLG-003", "Submitted short links — compliance status UNRESOLVED", "We do not claim the supplied link.amazon short links are invalid. Their exact destination/tracking behaviour must be tested one-link-at-a-time in the enrolled Associates workflow (destination + tracking report) before scaling. Note: submitted IDs are 9 characters vs the documented 10-character ASIN shape (SRC-07) — a format observation, not a verdict.", "Open — run the one-link test per product in Associates Central", "SRC-04; SRC-07; workflow.html"),
    ("FLG-004", "Brief cites prior artifacts that do not exist in this repo", "Codes such as S01/S02/S07/S24, SG-27..SG-30 and an earlier FLG-003 are referenced in the project brief but have no corresponding files or commits in the repository. Their intended content is unknown; equivalents were re-issued from the brief text itself.", "Open — supply the original artifact set if it exists elsewhere", "COORDINATION.md"),
    ("FLG-005", "'The five defined events' were not enumerated in the brief", "A working five-event taxonomy (session, page_view, product_impression, outbound_click, guide_view) is defined and implemented, but the canonical list should be confirmed by the owner before reporting depends on it.", "Open — confirm taxonomy", "measurement.html"),
    ("FLG-006", "Self-hosted analytics endpoint not deployed", "GitHub Pages serves static files only, so the documented collect-endpoint contract cannot run on this host. The privacy-preserving counter runs in local-only mode meanwhile (tallies stay in the visitor's browser).", "Open — choose hosting (Cloudflare Worker / Netlify Function / small VPS)", "measurement.html"),
    ("FLG-007", "Prices seen at fetch time were not attributable", "Amazon's fetched pages showed prices attached to dynamic 'add to your order' and carousel widgets that cannot be reliably attributed to the listed product. No price was recorded anywhere on the site.", "Open — resolve with a dated, attributable capture (PA-API or manual dated screenshot log)", "register.html"),
    ("FLG-008", "Tracking ID enrollment unverifiable from this environment", "Whether tracking ID shopnow047c-20 is enrolled, active, and correctly attached to links can only be confirmed inside Associates Central (login-gated).", "Open — owner confirms in Associates Central", "workflow.html"),
]

# --------------------------------------------------------------------------
# SUGGESTIONS — review queue. Nothing here is implemented; each row is a
# proposal with a blank decision column for the owner.
# --------------------------------------------------------------------------
SUGGESTIONS = [
    ("SUG-001", "Publishing &amp; content", "Ship the seasonal rotation calendar", "Turn the Holiday 2026 edit into a quarterly rotation (Holiday hosting → New-year reset → Spring hosting → Back-to-routine). Keeps the front page fresh and gives search engines a reason to recrawl.", "High for repeat traffic", "Low", "Low", "Proposed", ""),
    ("SUG-002", "Publishing &amp; content", "Question-cluster backlog from Search Console", "Once 2–4 weeks of Search Console data exists, choose the next guides from measured queries instead of instinct. The five current titles are declared hypotheses, not popularity claims.", "High for SEO focus", "Low", "Low", "Proposed — needs FLG-005/SG-29 data", ""),
    ("SUG-003", "Merchandising", "Interactive 'which shape is for you' chooser", "A 4-question decision widget on the compare page (household size, batch habits, counter space, cleanup tolerance) that routes to basket vs oven style. Improves decision quality over static tables.", "High for conversion quality", "Medium", "Low", "Proposed", ""),
    ("SUG-004", "Merchandising", "Replace typographic product cards with compliant imagery", "Commission neutral product photography or use Product Advertising API images once enrolled (within Amazon's IP license). Current cards are typographic by policy choice, not neglect.", "Medium for engagement", "Medium", "Medium — IP-licence constraints", "Proposed", ""),
    ("SUG-005", "Measurement", "Deploy the collect endpoint, then automate the campaign ledger", "Host the documented endpoint contract (measurement.html) on a small worker, flip on beacon delivery, and populate the campaign ledger weekly from first-party reports only.", "High for evidence-based iteration", "Medium", "Low", "Proposed — blocked by FLG-006", ""),
    ("SUG-006", "Measurement", "Register the site with Google Search Console + Bing Webmaster", "Submit sitemap.xml, confirm canonical host, and monitor queries. This is the discovery path for most open content questions.", "High for findability", "Low", "Low", "Proposed", ""),
    ("SUG-007", "Merchandising", "Add 'who it's for' persona column after specs verify", "Once FLG-002 resolves, extend the comparison table with verified dims/wattage and a persona fit column (small household, family batch, holiday hosting).", "Medium for decision quality", "Medium", "Low", "Proposed — blocked by FLG-002", ""),
    ("SUG-008", "Trust &amp; E-E-A-T", "Named editorial author with real credentials", "Replace 'the Desk' with a named, real editor and a credentials page. Do not fabricate a persona — this only ships when a real person is attached.", "High for trust", "Low", "Medium — requires a real person", "Proposed", ""),
    ("SUG-009", "Trust &amp; compliance", "A/B test disclosure-strip phrasing", "Test two compliant phrasings of the disclosure strip for clarity (comprehension) without weakening conspicuousness. Never move it below the fold.", "Medium for compliance quality", "Low", "Low", "Proposed", ""),
    ("SUG-010", "Operations", "Enroll PA-API and automate dated spec/price sync", "With API access, sync price/spec fields nightly with a provenance stamp (source + timestamp), keeping the blank-field policy for anything the API does not return.", "High for freshness", "High", "Medium — API access + policy care", "Proposed", ""),
    ("SUG-011", "Publishing &amp; content", "Reader capture: RSS-first, email second", "Add a 'get the next guide' RSS prompt now; consider email capture only with a clear privacy note and after analytics are on. No dark patterns.", "Medium for return visits", "Low", "Low", "Proposed", ""),
    ("SUG-012", "Merchandising", "Kitchen-math tools from verified dimensions", "Small calculators (capacity from verified interior dims; batch-size estimator) — build only after FLG-002 resolves so the inputs are sourced.", "Medium for links &amp; SEO", "Medium", "Low", "Proposed — blocked by FLG-002", ""),
]

# --------------------------------------------------------------------------
# QUESTIONS — what we know, what we don't, and how to find out.
# status: answered | open
# --------------------------------------------------------------------------
QUESTIONS = [
    ("Q-01", "What disclosure must an Amazon Associate site display?", "The Operating Agreement requires the statement “As an Amazon Associate I earn from qualifying purchases.” to appear clearly and conspicuously on the site; link-level disclosures must be clear and conspicuous as well.", "answered", "SRC-05; SRC-06", ""),
    ("Q-02", "What does the FTC require of affiliate recommendations?", "Endorsements must reflect honest opinions, and material connections (like commissions) must be disclosed clearly and conspicuously where the recommendation appears.", "answered", "SRC-01; SRC-02; SRC-12", ""),
    ("Q-03", "What is the documented shape of an Amazon ASIN?", "Amazon's developer glossary defines ASINs as unique blocks of 10 letters and/or numbers.", "answered", "SRC-07", ""),
    ("Q-04", "What internal temperatures are safe for meats?", "USDA FSIS chart: steaks/chops/roasts 145 °F + 3 min rest; ground meats 160 °F; all poultry 165 °F; fish 145 °F; leftovers 165 °F.", "answered", "SRC-03", ""),
    ("Q-05", "Where can a buyer check appliance recalls?", "CPSC's Recalls & Product Safety Warnings database is searchable and lists appliance categories including Air Fryer.", "answered", "SRC-11", ""),
    ("Q-06", "Are the five submitted short links compliant Special Links carrying tag shopnow047c-20?", "Not yet established. Do not assume validity or invalidity. Test one link per product inside the enrolled Associates workflow and confirm destination and tracking report before scaling (FLG-003).", "open", "FLG-003", "Run the one-link test in Associates Central; record results in the intent log."),
    ("Q-07", "What are the confirmed ASINs behind the submitted links?", "Five targets were observed on 2026-11-20 (see data/observations.json), but observed ≠ confirmed: each mapping needs a human browser check of the final URL and the listing's own ASIN field (FLG-001).", "open", "FLG-001", "Open each submitted link in a browser; record final URL + listing ASIN in the intent record."),
    ("Q-08", "What do the products cost right now?", "Unknown. Prices seen at fetch time were attached to unattributable dynamic widgets; no price is published anywhere (FLG-007).", "open", "FLG-007", "Dated capture via Product Advertising API, or a manual dated capture log signed by the reviewer."),
    ("Q-09", "Is tracking ID shopnow047c-20 enrolled and active?", "Unknown. Associates Central is login-gated (FLG-008).", "open", "FLG-008", "Owner logs into Associates Central and confirms the account status and tag."),
    ("Q-10", "Which five analytics events are canonical?", "The brief references 'the five defined events' without enumerating them; a working taxonomy is implemented (FLG-005).", "open", "FLG-005", "Owner confirms or replaces the taxonomy on measurement.html."),
    ("Q-11", "Where will the self-hosted analytics endpoint live?", "GitHub Pages cannot host it (FLG-006). The endpoint contract is documented and ready.", "open", "FLG-006", "Choose Cloudflare Workers / Netlify Functions / small VPS; deploy the contract from measurement.html."),
    ("Q-12", "Do the listing-title certification claims have documentation?", "Titles claim things like NIST/NSF certification and ±0.5 °F accuracy. No certificate has been seen (FLG-002).", "open", "FLG-002", "Request certificate details from the seller/brand; check public NSF listings; record in register."),
    ("Q-13", "What do real buyers search for before buying these?", "Unknown — the five guide titles are declared hypotheses. No query data yet.", "open", "SUG-006", "Register Search Console, submit sitemap.xml, collect 2–4 weeks of query data before commissioning new guides."),
    ("Q-14", "Are any of the five observed products subject to recalls?", "Not checked product-by-product. The CPSC database is the official path (SRC-11).", "open", "SRC-11", "Search cpsc.gov/Recalls per observed ASIN/brand; record the dated result in the register."),
    ("Q-15", "Who is the named editor of record?", "Currently 'the Counter & Crisp Desk' — a deliberate placeholder. A named, real author materially improves trust and should not be fabricated (SUG-008).", "open", "SUG-008", "Owner designates a real editor; add credentials page."),
]

# --------------------------------------------------------------------------
# MEASUREMENT — the five defined events (working taxonomy, FLG-005).
# --------------------------------------------------------------------------
EVENTS = [
    ("session", "First event of a browsing session (sessionStorage flag)", "e, p, t", "Fires once per browser session; no cookie, no id."),
    ("page_view", "Any page load", "e, p, t", "Path only — no query strings, no referrer."),
    ("product_impression", "A product card or row first enters the viewport (IntersectionObserver)", "e, p, a, t", "a = observed ASIN of the product shown."),
    ("outbound_click", "A sponsored product link is clicked", "e, p, a, t", "Fires before navigation; counts clicks, not outcomes."),
    ("guide_view", "A guide page loads", "e, p, t", "Lets the campaign ledger compare guide pull vs product pull."),
]

LEDGER_COLUMNS = ["Date (UTC)", "Source", "Channel", "Eligible sessions", "Clicks", "Reported orders", "Provenance (authorized first-party report)"]
