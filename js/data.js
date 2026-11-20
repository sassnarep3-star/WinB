/**
 * WinB — verified data register (single source of truth for the site)
 *
 * Verification rule: every row links to an official Amazon listing.
 * Values that could not be cleanly confirmed from the official source are left
 * blank and flagged (see docs/flagged.html). No values are inferred.
 *
 * Product-intent confirmation record:
 *   observed_* fields  = measured (redirect followed live on 2026-11-20)
 *   intended_* fields  = owner-confirmed intent; BLANK until the owner confirms.
 *   The two groups are NEVER merged.
 *
 * ASIN note: Amazon defines an ASIN as a 10-character identifier. The submitted
 * codes are 9-character link.amazon short-link tokens, not ASINs; the 10-char
 * codes below are the observed redirect targets.
 */

window.WINB = window.WINB || {};

WINB.META = {
  siteName: "COUNTER",
  tagline: "Kitchen gear, clearly compared.",
  trackingId: "shopnow047c-20",
  verificationDate: "2026-11-20",
  disclosure:
    "COUNTER is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, COUNTER earns from qualifying purchases.",
  shortDisclosure: "As an Amazon Associate, COUNTER earns from qualifying purchases. Links to Amazon are paid affiliate links.",
};

/* ------------------------------------------------------------------ *
 * PRODUCT REGISTER — verified against official Amazon listings
 * ------------------------------------------------------------------ */
WINB.PRODUCTS = [
  {
    id: "P-01",
    submittedToken: "B04G1MEwY",
    submittedUrl: "https://link.amazon/B04G1MEwY",
    observedAsin: "B0CDY277D3",
    officialUrl: "https://www.amazon.com/dp/B0CDY277D3",
    title: "CHEFMAN 6 Quart Dual Basket Air Fryer Oven, Easy View Windows, Sync Finish, Hi-Fry, Auto Shutoff, 2 Independent 3Qt Nonstick Dishwasher-Safe Baskets, Digital Double Air Fryer",
    brand: "Chefman",
    category: "Air Fryers",
    categoryNode: "17659096011",
    status: "Verified",
    intendedAsin: "",
    intendedListingUrl: "",
    confirmationDate: "",
    intendedSource: "",
    notes: "Observed redirect target confirmed on the official listing; category read from the listing breadcrumb (Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers).",
  },
  {
    id: "P-02",
    submittedToken: "B02NbDxp3",
    submittedUrl: "https://link.amazon/B02NbDxp3",
    observedAsin: "B09B7SB46R",
    officialUrl: "https://www.amazon.com/dp/B09B7SB46R",
    title: "Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven, Countertop Convection Cooker, 24 One-Touch Presets, Extra Large Interior, Six Cooking Accessories",
    brand: "Emeril Lagasse",
    category: "Air Fryers",
    categoryNode: "17659096011",
    status: "Verified",
    intendedAsin: "",
    intendedListingUrl: "",
    confirmationDate: "",
    intendedSource: "",
    notes: "Observed redirect target confirmed on the official listing; category read from the listing breadcrumb (Air Fryers).",
  },
  {
    id: "P-03",
    submittedToken: "B00hJ57DV",
    submittedUrl: "https://link.amazon/B00hJ57DV",
    observedAsin: "B08DKYBTPH",
    officialUrl: "https://www.amazon.com/dp/B08DKYBTPH",
    title: "Chefman Air Fryer 8 Qt TurboFry 4-in-1, 450°F Hi-Fry, Bake, Dehydrate, Frozen, XL Nonstick Dishwasher-Safe Basket, Stainless Steel",
    brand: "Chefman",
    category: "Air Fryers",
    categoryNode: "17659096011",
    status: "Verified",
    intendedAsin: "",
    intendedListingUrl: "",
    confirmationDate: "",
    intendedSource: "",
    notes: "Observed redirect target confirmed on the official listing; category read from the listing breadcrumb (Air Fryers).",
  },
  {
    id: "P-04",
    submittedToken: "B0c8moW59",
    submittedUrl: "https://link.amazon/B0c8moW59",
    observedAsin: "B0DHZTCNR5",
    officialUrl: "https://www.amazon.com/dp/B0DHZTCNR5",
    title: "ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5°F Accuracy, NIST & NSF Certified, Auto-Rotate Bright LED Screen, IP67 Waterproof, Black",
    brand: "ThermoMaven",
    category: "Meat Thermometers",
    categoryNode: "289810",
    status: "Verified",
    intendedAsin: "",
    intendedListingUrl: "",
    confirmationDate: "",
    intendedSource: "",
    notes: "Observed redirect target confirmed on the official listing; category read from the listing breadcrumb (Home & Kitchen › Kitchen & Dining › Kitchen Utensils & Gadgets › Thermometers & Timers › Meat).",
  },
  {
    id: "P-05",
    submittedToken: "B0f3GKalj",
    submittedUrl: "https://link.amazon/B0f3GKalj",
    observedAsin: "B0DZFD6R9Z",
    officialUrl: "https://www.amazon.com/dp/B0DZFD6R9Z",
    title: "CHEF iQ Sense Smart Wireless Meat Thermometer, 3 Ultra-Thin Probes, WiFi Unlimited Range, 1000°F Heat Safe, 5 Sensors, BBQ/Grill/Oven/Smoker/Air Fryer, Gen3",
    brand: "CHEF iQ",
    category: "Meat Thermometers",
    categoryNode: "289810",
    status: "Verified",
    intendedAsin: "",
    intendedListingUrl: "",
    confirmationDate: "",
    intendedSource: "",
    notes: "Observed redirect target confirmed on the official listing; category read from the listing breadcrumb (… › Thermometers & Timers › Meat).",
  },
];

WINB.CATEGORIES = [
  {
    id: "air-fryers",
    name: "Air Fryers",
    blurb: "Dual-basket ovens, French-door convection cookers, and compact basket fryers for everyday crisp.",
    node: "17659096011",
    page: "products.html",
  },
  {
    id: "meat-thermometers",
    name: "Meat Thermometers",
    blurb: "Instant-read probes and WiFi smart thermometers for grill, oven, smoker and air fryer.",
    node: "289810",
    page: "products.html",
  },
];

/* ------------------------------------------------------------------ *
 * SUGGESTIONS — feed into the design/decision prompt
 * Each has: id, title, what it does, why, priority, status
 * ------------------------------------------------------------------ */
WINB.SUGGESTIONS = [
  {
    id: "SG-01",
    title: "Rebuild the landing page as a publication front page",
    what: "Lead with products and guides; move the verification/registry detail into dashboard subpages reachable from the footer and one nav group.",
    why: "A buyer acts on a shop front, not an audit log. Keeps the public face commercial and the machinery behind it.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-02",
    title: "Publish question-shaped buying guides on a cadence",
    what: "Ship 2–4 question-titled guides per month; add each to the sitemap and the RSS feed; pick the next topic from measured queries.",
    why: "Question titles match how people search and give search engines new, rankable pages each cycle.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-03",
    title: "Turn on click + conversion measurement before more content",
    what: "Add a privacy-preserving outbound-click counter and a self-hosted analytics endpoint; record the five defined events.",
    why: "Data-driven iteration needs a measurement baseline first, otherwise topic choice is instinct.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-04",
    title: "Disclosure strip under the masthead on every page",
    what: "Short Associates disclosure directly under the header on every page, repeated in the footer.",
    why: "Keeps the disclosure above the fold and FTC/Associates-compliant across the whole site.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-05",
    title: "Mark every outbound product link as sponsored",
    what: "Apply rel=\"sponsored\" + an on-link 'Sponsored' tag to every Amazon outbound link.",
    why: "Clear to readers and to search engines; satisfies FTC material-connection disclosure.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-06",
    title: "Build the product-intent confirmation record",
    what: "Store intended ASIN, official listing URL, confirmation date and source in separate fields from the observed redirect target.",
    why: "A checkable ASIN is the identifier Amazon's own definition supports; keeping intent vs. observation separate prevents merging two different facts.",
    priority: "P1",
    status: "Recommended",
  },
  {
    id: "SG-07",
    title: "Validate one link per product in the enrolled Associates workflow",
    what: "Test one Special Link per product; confirm destination and the tracking report before scaling. Do not assert the supplied short links are invalid.",
    why: "Confirms tracking works end-to-end before the full rollout; the short links' exact compliance status (FLG-003) is unresolved.",
    priority: "P2",
    status: "Needs review",
  },
  {
    id: "SG-08",
    title: "Start an empty but well-defined campaign ledger",
    what: "Ledger with timestamp, source, channel, eligible sessions, clicks, reported orders — populated only from authorized first-party reports, with a dated provenance trail.",
    why: "Evidence-based iteration: measure before automating optimization. No conversion score or forecast is presented.",
    priority: "P2",
    status: "Recommended",
  },
  {
    id: "SG-09",
    title: "Put disclosures and API policy checks in the publishing workflow",
    what: "A gate that checks the Associates statement is present and reviews disclosure placement / endorsement context before publish.",
    why: "Compliance as a gate, not an afterthought.",
    priority: "P2",
    status: "Recommended",
  },
  {
    id: "SG-10",
    title: "Editorial direction: human-sounding buyer questions",
    what: "Use question-shaped working titles such as 'Basket or oven-style air fryer: what should you compare?' and 'A no-hype checklist for comparing air fryer capacity'.",
    why: "Working titles, not popularity claims — matches real buyer intent and reads like a publication.",
    priority: "P2",
    status: "Recommended",
  },
];

/* ------------------------------------------------------------------ *
 * OPEN QUESTIONS — what must be known before a decision is reasonable
 * ------------------------------------------------------------------ */
WINB.QUESTIONS = [
  {
    id: "Q-01",
    question: "Are the five supplied link.amazon short links valid Amazon Associates 'Special Links' for this account?",
    why: "Determines whether to use them directly or generate account-bound Special Links. Their exact compliance status is unresolved (FLG-003); we do not claim they are invalid.",
    needed: "Account-side confirmation from the Associates dashboard.",
    blocks: "Link-validation decision (SG-07).",
  },
  {
    id: "Q-02",
    question: "What is the intended ASIN for each submitted link, confirmed by the owner?",
    why: "The observed redirect target is a measurement; the intended product is a fact only the owner can confirm. The two fields must not merge.",
    needed: "Owner confirmation recorded in intended_asin / confirmation_date / intended_source.",
    blocks: "Finalizing the product-intent confirmation record (SG-06).",
  },
  {
    id: "Q-03",
    question: "Which Amazon marketplace/region are these listings on, and is that the intended market?",
    why: "ASINs are region-scoped; the same product has different ASINs on amazon.com vs other marketplaces.",
    needed: "Confirm amazon.com (US) is the target market.",
    blocks: "Geographic targeting and content localization.",
  },
  {
    id: "Q-04",
    question: "Which Associates commission rate applies to these kitchen categories?",
    why: "Commission is category-based and set by Amazon; it must be read from the current rate schedule, not assumed.",
    needed: "Current Associates commission schedule from the official Associates Central.",
    blocks: "Commission-potential analysis.",
  },
  {
    id: "Q-05",
    question: "What are the current price, rating and review count for each listing?",
    why: "Pricing and social-proof fields could not be cleanly isolated during automated fetch; they must be confirmed on the live listing.",
    needed: "Manual read of each official listing (links provided on the Products page).",
    blocks: "Filling the price/rating columns (currently flagged blank).",
  },
  {
    id: "Q-06",
    question: "Who is the target buyer and what decision are they trying to make?",
    why: "Determines guide angle, comparison structure and which questions to answer first.",
    needed: "A defined audience + the purchase decision being made.",
    blocks: "Editorial prioritization (SG-10).",
  },
  {
    id: "Q-07",
    question: "Which analytics endpoint and consent approach will be used for click/conversion tracking?",
    why: "Privacy-preserving measurement needs a chosen endpoint and a consent policy before events are recorded.",
    needed: "Decision on self-hosted analytics + consent mechanism.",
    blocks: "Measurement rollout (SG-03).",
  },
  {
    id: "Q-08",
    question: "What is the publishing cadence and who reviews content before it ships?",
    why: "A cadence plus a review gate turns the site into a publication and keeps the compliance gate meaningful.",
    needed: "Cadence + named reviewer/approval step.",
    blocks: "Publishing workflow (SG-02, SG-09).",
  },
];

/* ------------------------------------------------------------------ *
 * FLAGGED — irregularities & unverified items (do not block merge)
 * ------------------------------------------------------------------ */
WINB.FLAGGED = [
  {
    id: "FLG-001",
    title: "Submitted codes are 9-character short-link tokens, not ASINs",
    detail: "Amazon defines an ASIN as a 10-character identifier. Each submitted code (e.g. B04G1MEwY) is 9 characters and is a link.amazon short-link token, not an ASIN. The 10-character codes on this site are the observed redirect targets.",
    source: "https://affiliate-program.amazon.com/help/operating/agreement (context) · official listings linked per product",
  },
  {
    id: "FLG-002",
    title: "Price, rating and review-count fields left blank",
    detail: "These values were observed on the official listings but could not be cleanly isolated/attributed during automated fetch (Amazon's 'customers who viewed' module mixes related-product prices). Per policy, left blank and flagged rather than inferred.",
    source: "Official listings: see Products page source links.",
  },
  {
    id: "FLG-003",
    title: "Exact compliance status of the supplied short links unresolved",
    detail: "It is not asserted that the supplied link.amazon short links are invalid. Whether they are account-bound Amazon Associates 'Special Links' is unresolved and requires account-side confirmation. Flagged, not blocked.",
    source: "https://affiliate-program.amazon.com/help/operating/agreement",
  },
  {
    id: "FLG-004",
    title: "Intent vs. observation kept separate",
    detail: "intended_asin / intended_listing_url / confirmation_date / intended_source are blank for all five products until the owner confirms. They are stored in separate fields from observed_redirect_target and are never merged.",
    source: "Product-intent confirmation record — see Products page.",
  },
  {
    id: "FLG-005",
    title: "Commission rate not quoted",
    detail: "No commission percentage is stated on this site because the current rate schedule was not fetched from an official source in this session. The commission basis is cited to the Operating Agreement; the exact rate is left for confirmation from Associates Central.",
    source: "https://affiliate-program.amazon.com/help/operating/agreement",
  },
];

/* ------------------------------------------------------------------ *
 * CAMPAIGN LEDGER — empty but well-defined (no forecast presented)
 * ------------------------------------------------------------------ */
WINB.LEDGER_COLUMNS = [
  "timestamp",
  "source",
  "channel",
  "eligible_sessions",
  "clicks",
  "reported_orders",
  "provenance",
];

WINB.LEDGER_ROWS = [];

WINB.EVENTS = [
  { id: "evt_outbound_click", name: "Outbound click", definition: "A reader clicks an Amazon affiliate link.", required: true },
  { id: "evt_guide_view", name: "Guide view", definition: "A reader opens a buying-guide article.", required: true },
  { id: "evt_product_view", name: "Product view", definition: "A reader opens a product detail/category view.", required: true },
  { id: "evt_search_use", name: "On-site search", definition: "A reader uses the on-site search box.", required: true },
  { id: "evt_conversion", name: "Reported conversion", definition: "A qualifying purchase is reported by Amazon (first-party only).", required: true },
];

/* ------------------------------------------------------------------ *
 * ARTICLES & GUIDES (question-shaped, working titles)
 * ------------------------------------------------------------------ */
WINB.ARTICLES = [
  {
    id: "A-01",
    title: "Basket or oven-style air fryer: what should you compare?",
    kind: "Guide",
    category: "Air Fryers",
    excerpt: "Two different machine shapes solve two different kitchens. Here is the short list of what actually moves the decision.",
    related: ["P-01", "P-02", "P-03"],
    status: "Draft",
  },
  {
    id: "A-02",
    title: "A no-hype checklist for comparing air fryer capacity",
    kind: "Guide",
    category: "Air Fryers",
    excerpt: "Capacity is not just the biggest number on the box. Use this checklist to match capacity to how you actually cook.",
    related: ["P-01", "P-02", "P-03"],
    status: "Draft",
  },
  {
    id: "A-03",
    title: "How to assess cleanup and counter-space trade-offs",
    kind: "Guide",
    category: "Air Fryers",
    excerpt: "The best fryer is the one that lives on your counter. A practical look at footprint, baskets and wash-up.",
    related: ["P-01", "P-02", "P-03"],
    status: "Draft",
  },
  {
    id: "A-04",
    title: "Questions to ask before buying a multi-function kitchen appliance",
    kind: "Guide",
    category: "Air Fryers",
    excerpt: "Air-fryer ovens promise to replace half your kitchen. Ask these questions first so you only buy the functions you'll use.",
    related: ["P-01", "P-02", "P-03"],
    status: "Draft",
  },
  {
    id: "A-05",
    title: "Instant-read vs. smart WiFi meat thermometer: which fits your cooking?",
    kind: "Guide",
    category: "Meat Thermometers",
    excerpt: "A fast probe and a stay-in-the-oven smart thermometer are different tools. Match the style to how you grill and roast.",
    related: ["P-04", "P-05"],
    status: "Draft",
  },
  {
    id: "A-06",
    title: "What ±0.5°F accuracy actually means on a kitchen thermometer",
    kind: "Explainer",
    category: "Meat Thermometers",
    excerpt: "A tight accuracy claim sounds technical. Here is what it means in practice and when it matters.",
    related: ["P-04"],
    status: "Draft",
  },
  {
    id: "A-07",
    title: "How many probes do you really need on a wireless meat thermometer?",
    kind: "Guide",
    category: "Meat Thermometers",
    excerpt: "One probe covers a steak; a multi-probe setup covers a Thanksgiving oven. Decide based on your cooks, not the box.",
    related: ["P-05"],
    status: "Draft",
  },
];

/* ------------------------------------------------------------------ *
 * COMPLIANCE SOURCES (official URLs for manual review)
 * ------------------------------------------------------------------ */
WINB.COMPLIANCE = [
  {
    id: "C-01",
    label: "Amazon Associates Program Operating Agreement",
    url: "https://affiliate-program.amazon.com/help/operating/agreement",
    note: "§2 Compliance Requirements; §5 Identifying Yourself as an Associate — requires the statement 'As an Amazon Associate I earn from qualifying purchases.'",
  },
  {
    id: "C-02",
    label: "Amazon Associates Program Policies",
    url: "https://affiliate-program.amazon.com/help/program-policies",
    note: "Participation requirements and program rules incorporated by the Operating Agreement.",
  },
  {
    id: "C-03",
    label: "Amazon Associates Central",
    url: "https://affiliate-program.amazon.com/",
    note: "Account, link tools and reporting (source of any commission-rate schedule).",
  },
  {
    id: "C-04",
    label: "FTC Endorsement Guides — 16 CFR Part 255",
    url: "https://www.ftc.gov/legal-library/browse/rules/endorsement-guides",
    note: "Material connections must be disclosed clearly and conspicuously where the endorsement appears (§255.5).",
  },
];
