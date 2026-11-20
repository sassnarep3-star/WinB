// data.mjs — single source of truth for the Counterwise site.
// Every factual field carries a `source` key that resolves to SOURCES.
// Rules enforced by tools/verify.mjs:
//   * no price, no star rating, no sales rank may be printed anywhere
//   * every product row must carry a source URL
//   * intended ASIN and observed redirect are stored in separate fields, never merged
// Last verified: 2026-11-20 (UTC)

export const SITE = {
  name: 'Counterwise',
  tagline: 'Kitchen gear, chosen by question rather than by hype.',
  origin: 'https://sassnarep3-star.github.io/WinB',
  basePath: '/WinB',
  associateTag: 'shopnow047c-20',
  associateStatement: 'As an Amazon Associate I earn from qualifying purchases.',
  buildDate: '2026-11-20',
  buildDateHuman: '20 November 2026',
  author: 'The Counterwise desk',
  authorBio:
    'Counterwise is written and maintained as a single-desk editorial project. The desk does not operate a test kitchen; every recommendation here is a specification and fit judgement drawn from manufacturer-published listing data, not a hands-on review.',
  contactNote:
    'Corrections and takedown requests: open an issue on the site repository. There is no published email address yet (see Decision Room, Q-07).',
};

// ---------------------------------------------------------------------------
// Official sources actually fetched during the build session.
// `checked` is the date the page was read. `updated` is the date the page
// itself displays, where it displays one.
// ---------------------------------------------------------------------------
export const SOURCES = {
  A1: {
    id: 'A1',
    title: 'Amazon Associates Program Operating Agreement',
    publisher: 'Amazon.com Associates Central',
    url: 'https://affiliate-program.amazon.com/help/operating/agreement',
    updated: 'October 15, 2025',
    checked: '2026-11-20',
    supports: [
      'Section 5 requires the statement “As an Amazon Associate I earn from qualifying purchases.” to be stated clearly and prominently on the site.',
      'Section 1 defines Special Links as links that properly use the tagged link formats Amazon provides.',
      'Section 6 sets out termination, including for material breach.',
    ],
  },
  A2: {
    id: 'A2',
    title: 'Associates Program Policies (Commission Income Statement, Participation Requirements, Trademark Guidelines, IP License)',
    publisher: 'Amazon.com Associates Central',
    url: 'https://affiliate-program.amazon.com/help/operating/policies',
    updated: 'April 14, 2026',
    checked: '2026-11-20',
    supports: [
      'Participation Requirements §1: the site must contain original content and be publicly available; unsuitable sites are ineligible.',
      'Participation Requirements §2(b): every link to an Amazon site must carry the Associate ID or “tag” as a URL parameter.',
      'Participation Requirements §2(b): prices and availability may be shown only if Amazon serves the link, or the data comes from Creators API / PA API under the licence.',
      'Participation Requirements §2(b): you must not make inaccurate, overbroad, deceptive or misleading claims about any product, price or policy.',
      'Participation Requirements §3(e): the site must disclose the use of cookies, pixels and other technologies and how visitor data is collected and used.',
      'IP License §2(c): each use of Product Advertising Content must link to, and only to, the relevant page of an Amazon Site.',
      'Participation Requirements §5 and IP License §1: Special Links and Program Content may not be used to develop or improve machine-learning models without Amazon’s written approval.',
    ],
  },
  A3: {
    id: 'A3',
    title: 'Amazon Associates — program home page',
    publisher: 'Amazon.com Associates Central',
    url: 'https://affiliate-program.amazon.com/',
    updated: null,
    checked: '2026-11-20',
    supports: [
      'The program pays “up to 10%” in associate commissions from qualifying purchases, and payment is made approximately 60 days after the month in which commission was earned.',
      'Eligibility: bloggers, publishers and content creators with a qualifying website or mobile app.',
    ],
  },
  F1: {
    id: 'F1',
    title: 'Disclosures 101 for Social Media Influencers',
    publisher: 'U.S. Federal Trade Commission',
    url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers',
    updated: 'November 2019',
    checked: '2026-11-20',
    supports: [
      'Disclose any financial, employment, personal or family relationship with a brand.',
      'Place the disclosure where it is hard to miss, with the endorsement itself — not only on an about page or at the end of a post.',
      'Use simple, clear language; “advertisement”, “ad” and “sponsored” are acceptable.',
      'You cannot talk about your experience with a product you have not tried.',
    ],
  },
  F2: {
    id: 'F2',
    title: '16 CFR 255.5 — Disclosure of material connections',
    publisher: 'U.S. Federal Trade Commission (eCFR)',
    url: 'https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.5',
    updated: 'Current as of 2026-11-18',
    checked: '2026-11-20',
    supports: [
      'A material connection that is not reasonably expected by the audience must be disclosed clearly and conspicuously.',
      'The disclosure need not give complete details, but must communicate the nature of the connection well enough for a consumer to judge its significance.',
    ],
  },
  G1: {
    id: 'G1',
    title: 'Qualify your outbound links to Google',
    publisher: 'Google Search Central',
    url: 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links',
    updated: '2025-12-10',
    checked: '2026-11-20',
    supports: [
      'Mark links that are advertisements or paid placements with rel="sponsored".',
      'Multiple rel values may be combined, space- or comma-separated.',
    ],
  },
  G2: {
    id: 'G2',
    title: 'Spam policies for Google web search',
    publisher: 'Google Search Central',
    url: 'https://developers.google.com/search/docs/essentials/spam-policies',
    updated: null,
    checked: '2026-11-20',
    supports: [
      '“Scaled content abuse” covers generating many pages primarily to manipulate rankings without helping users.',
      'Affiliate links used throughout a page are acceptable when the links are qualified appropriately.',
      'Under the site reputation policy, an unauthored affiliate article that is not integrated into the publication and carries no commercial-character disclaimer is an example of content likely to attract action.',
      'The review considers stated or implied authorship and whether identical content appears on many other sites.',
    ],
  },
  G3: {
    id: 'G3',
    title: 'Build and submit a sitemap',
    publisher: 'Google Search Central',
    url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
    updated: null,
    checked: '2026-11-20',
    supports: [
      'Google supports the sitemap formats defined by the sitemaps.org protocol, including XML and RSS.',
    ],
  },
  G4: {
    id: 'G4',
    title: 'Sitemaps XML format',
    publisher: 'sitemaps.org',
    url: 'https://www.sitemaps.org/protocol.html',
    updated: null,
    checked: '2026-11-20',
    supports: [
      'A sitemap must begin with <urlset>, declare the sitemap namespace, and include a <url> with a <loc> for each page.',
      'All URLs in a sitemap must be from a single host.',
      'The file must be UTF-8 encoded and entity-escaped.',
    ],
  },
  D1: {
    id: 'D1',
    title: 'What is GitHub Pages? (GitHub Docs)',
    publisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages',
    updated: null,
    checked: '2026-11-20',
    supports: [
      'GitHub Pages takes HTML, CSS and JavaScript files straight from a repository on GitHub and publishes them as a website.',
      'When a GitHub Pages site is visited, the visitor’s IP address is logged and stored for security purposes, whether or not the visitor has signed in to GitHub.',
    ],
  },
  U1: {
    id: 'U1',
    title: 'Safe Minimum Internal Temperature Chart',
    publisher: 'USDA Food Safety and Inspection Service',
    url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
    updated: 'April 14, 2025',
    checked: '2026-11-20',
    supports: [
      'Beef, pork, veal and lamb steaks, chops and roasts: 145°F (62.8°C) with a 3-minute rest.',
      'Ground meats: 160°F (71.1°C).',
      'All poultry, including ground poultry, stuffing and giblets: 165°F (73.9°C).',
      'Fish and shellfish: 145°F (62.8°C). Leftovers and casseroles: 165°F (73.9°C).',
    ],
  },
  // Amazon listing pages, re-read in full on 2026-11-20 (UTC) by session arena-066803dd.
  // Each row records only what the page's title / “About this item” / product-details table states.
  L1: {
    id: 'L1',
    title: 'Amazon listing B0CDY277D3 (CHEFMAN 6 Quart Dual Basket Air Fryer Oven)',
    publisher: 'Amazon.com',
    url: `https://www.amazon.com/dp/B0CDY277D3?tag=${SITE.associateTag}`,
    checked: '2026-11-20',
    supports: [
      'Title states 6 Quart, 2 Independent 3Qt baskets and “Easy View Windows”. The product-details table was not re-read this session; wattage for this listing is recorded from the earlier 2026-11-20 read (FLG-014).',
    ],
  },
  L2: {
    id: 'L2',
    title: 'Amazon listing B09B7SB46R (Emeril Lagasse 26QT French Door)',
    publisher: 'Amazon.com',
    url: `https://www.amazon.com/dp/B09B7SB46R?tag=${SITE.associateTag}`,
    checked: '2026-11-20',
    supports: [
      'Title states 26QT, “24 One-Touch Preset Options”, “Extra Large Interior” and “Six Cooking Accessories Included”.',
      'About this item states “25 COOKING PRE-SETS” and “26-QUART CAPACITY”, and that the interior light lets you “monitor food”. No viewing window is stated in the sections read.',
    ],
  },
  L3: {
    id: 'L3',
    title: 'Amazon listing B08DKYBTPH (Chefman Air Fryer 8 Qt TurboFry)',
    publisher: 'Amazon.com',
    url: `https://www.amazon.com/dp/B08DKYBTPH?tag=${SITE.associateTag}`,
    checked: '2026-11-20',
    supports: [
      'Title states 8 Qt, “450°F Hi-Fry Option”, “4-in-1” and “XL Nonstick Dishwasher-Safe Basket”.',
    ],
  },
  L4: {
    id: 'L4',
    title: 'Amazon listing B0DHZTCNR5 (ThermoMaven 1 Sec Professional Digital Meat Thermometer)',
    publisher: 'Amazon.com',
    url: `https://www.amazon.com/dp/B0DHZTCNR5?tag=${SITE.associateTag}`,
    checked: '2026-11-20',
    supports: [
      'Title states “1 Sec”, “±0.5℉ Accuracy”, “NIST&NSF Certified”, “IP67 Waterproof” and “Black”.',
      'About this item: “instant-read” thermocouple sensor, 1 second. Product-details table: Included Components “1*Meat Thermometer, 1*AAA Battery, 1*User Manual, 1*Calibration Certificate”. No probe count and no app requirement stated.',
    ],
  },
  L5: {
    id: 'L5',
    title: 'Amazon listing B0DZFD6R9Z (CHEF iQ Sense Gen3 Smart Wireless Meat Thermometer)',
    publisher: 'Amazon.com',
    url: `https://www.amazon.com/dp/B0DZFD6R9Z?tag=${SITE.associateTag}`,
    checked: '2026-11-20',
    supports: [
      'Title states “3 Ultra-Thin Probes”, “WiFi Unlimited Range”, “1000°F Heat Safe”, “5 Sensors” and “Gen3”.',
    ],
  },
  U2: {
    id: 'U2',
    title: 'Food Thermometers (factsheet, incl. Calibration: ice-water and boiling-water methods)',
    publisher: 'USDA Food Safety and Inspection Service',
    url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers',
    updated: null,
    checked: '2026-11-20',
    supports: [
      'Ice-water calibration: fill a large glass with ice cubes, add drinking water, stir well; immerse the stem at least 2 inches without touching the sides or bottom; wait at least 30 seconds and read without removing the stem. It should read 32°F.',
      'Boiling-water calibration: the thermometer should read 212°F at sea level; at high altitude water boils lower — by at least 2°F and perhaps as much as 5°F; check the local Cooperative Extension System office or health department for the exact figure.',
      'If a thermometer does not allow manual calibration, it may need to be replaced.',
      'Most food thermometers give an accurate reading within 2 to 4°F; many dial thermometers have a calibration nut under the dial.',
      'Wireless and smart thermometers: the probe stays in the food while cooking and displays on a connected device; smart thermometers can be calibrated.',
      'Thermometer care: wash with hot, soapy water; most thermometers should not be immersed in water.',
    ],
  },
};

// ---------------------------------------------------------------------------
// Products.
//
// FIELD SEPARATION IS DELIBERATE.
//   intendedAsin   — supplied/confirmed by the owner. BLANK until confirmed.
//                    Never inferred from a short-link code, and never copied
//                    from observedRedirect.
//   observedRedirect — what the supplied short link actually resolved to on
//                    the check date. Stored exactly. Kept in its own field.
//
// `outboundUrl` is the tagged Special Link this site actually publishes. It is
// constructed from the observed ASIN plus the owner's tag, and is the only
// Amazon URL the visitor is sent to. The untagged short link is *not* used as
// a money link (see flag FLG-003).
// ---------------------------------------------------------------------------
export const PRODUCTS = [
  {
    id: 'P01',
    slug: 'chefman-6qt-dual-basket',
    category: 'air-fryers',
    brand: 'CHEFMAN',
    shortName: 'Chefman 6 qt dual basket',
    editorialName: 'The two-basket workhorse',
    listingTitle:
      'CHEFMAN 6 Quart Dual Basket Air Fryer Oven with Easy View Windows, Sync Finish, Hi-Fry, Auto Shutoff, 2 Independent 3Qt Nonstick Dishwasher Safe Frying Baskets, Digital Double Air Fryer - Black',
    asin: 'B0CDY277D3',
    recheck: {
      date: '2026-11-20',
      method: 'Listing URL fetched live and read (platform page reader), session arena-b36a7b54.',
      result: 'Live. Page title as served matches the recorded listing title word for word. Category path as served: Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers. No spec, price or rating value was copied into this site from the re-check.',
    },
    suppliedLink: 'https://link.amazon/B04G1MEwY',
    observedRedirect:
      'https://www.amazon.com/dp/B0CDY277D3?lv=shuf&btn_type=ss&gaOptInStatus=true&btn_ref=srctok-0710b7a4f0d14338&channelId=704&plpRedirect=mhFallback',
    intendedAsin: '',
    confirmationDate: '2026-11-20',
    // DQ-10: dated reads + change log. Both reads happened on 2026-11-20, by different
    // sessions — the date matters as much as the diff, and a stale date is a visible failure.
    lastRead: '2026-11-20',
    reads: [
      {
        date: '2026-11-20',
        by: 'register build (session arena-afa610ec)',
        finding:
          'First register read of the live listing: title, stated figures and the category path recorded exactly as served.',
      },
      {
        date: '2026-11-20',
        by: 're-verification (session ac3d816c)',
        finding:
          'Title, capacity figures and category path re-read; unchanged from the register record. The listing still states two independent 3 qt baskets and 120 Volts / 1700 Watts.',
      },
    ],
    source: 'A2',
    listingSourceUrl: 'https://www.amazon.com/dp/B0CDY277D3',
    directory: 'Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers',
    directorySource: 'https://www.amazon.com/dp/B0CDY277D3',
    // Claimed by the listing itself. Nothing here is a measured result.
    specClaims: [
      { label: 'Total stated capacity', value: '6 qt', basis: 'listing title' },
      { label: 'Baskets', value: '2 independent baskets', basis: 'listing title' },
      { label: 'Stated capacity per basket', value: '3 qt', basis: 'listing title' },
      { label: 'Style', value: 'Dual basket, digital touchscreen', basis: 'listing title' },
      { label: 'Window', value: 'Easy View windows', basis: 'listing title' },
      { label: 'Finish', value: 'Nonstick, dishwasher-safe baskets', basis: 'listing title' },
      { label: 'Colour', value: 'Black', basis: 'listing title' },
    ],
    arithmetic: [
      {
        statement: 'Two 3 qt baskets add to the 6 qt total the listing states.',
        working: '3 + 3 = 6',
        note: 'Arithmetic on the listing’s own numbers. This is not a measurement of usable capacity — see the capacity guide.',
      },
    ],
    unverifiedClaims: [
      '“Sync Finish”, “Hi-Fry” and “Auto Shutoff” are listed as features; the timing behaviour of these modes is not documented in the data available to this desk.',
      'Actual usable basket volume, external dimensions and oven-safe accessory limits are not stated on the listing as read.',
    ],
    bestFor:
      'A household that regularly cooks two different things at once — protein in one basket, vegetables in the other — and wants to finish them together.',
    thinkTwiceIf:
      'You mostly cook one large item, or you want the appliance to still be working in three years. Two smaller baskets split a single batch, and durability is the single worst-rated theme on its own listing.',
    verdict:
      'Buy it for the two-basket idea. Check the warranty and the return window before you rely on it, because the reviews are unusually blunt about failure.',
    compare: { format: 'basket', capacityQt: 6, baskets: 2, window: true, style: 'Dual basket' },
  },
  {
    id: 'P02',
    slug: 'emeril-26qt-french-door',
    category: 'air-fryers',
    brand: 'Emeril Lagasse',
    shortName: 'Emeril Lagasse 26 qt French door',
    editorialName: 'The countertop oven that air-fries',
    listingTitle:
      'Emeril Lagasse 26QT French Door Multi-Function Air Fryer Toaster Oven | Countertop Convection Cooker, 24 One-Touch Preset Options, Extra Large Interior, Six Cooking Accessories Included',
    asin: 'B09B7SB46R',
    recheck: {
      date: '2026-11-20',
      method: 'Listing URL fetched live and read (platform page reader), session arena-b36a7b54.',
      result: 'Live. Page title as served matches the recorded listing title word for word. Category path as served: Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers. No spec, price or rating value was copied into this site from the re-check.',
    },
    suppliedLink: 'https://link.amazon/B02NbDxp3',
    observedRedirect:
      'https://www.amazon.com/dp/B09B7SB46R?lv=shuf&btn_type=ss&gaOptInStatus=true&btn_ref=srctok-77f54b7c4a256532&channelId=704&plpRedirect=mhFallback',
    intendedAsin: '',
    confirmationDate: '2026-11-20',
    // DQ-10: dated reads + change log. Both reads happened on 2026-11-20, by different
    // sessions — the date matters as much as the diff, and a stale date is a visible failure.
    lastRead: '2026-11-20',
    reads: [
      {
        date: '2026-11-20',
        by: 'register build (session arena-afa610ec)',
        finding:
          'First register read of the live listing: title, stated figures and the category path recorded exactly as served.',
      },
      {
        date: '2026-11-20',
        by: 're-verification (session ac3d816c)',
        finding:
          'Title and 26 QT / 24-preset statements re-read; unchanged from the register record. Preset count is still stated as 24 in the title while the review-theme panel refers to 25 — see FLG-013.',
      },
    ],
    source: 'A2',
    listingSourceUrl: 'https://www.amazon.com/dp/B09B7SB46R',
    directory: 'Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers',
    directorySource: 'https://www.amazon.com/dp/B09B7SB46R',
    specClaims: [
      { label: 'Total stated capacity', value: '26 qt', basis: 'listing title' },
      { label: 'Format', value: 'French-door countertop oven', basis: 'listing title' },
      { label: 'Presets', value: '24 one-touch presets', basis: 'listing title' },
      { label: 'Convection', value: 'Countertop convection cooking', basis: 'listing title' },
      { label: 'Included accessories', value: 'Six cooking accessories', basis: 'listing title' },
      { label: 'Baskets', value: 'Not a dual-basket appliance', basis: 'listing title' },
    ],
    arithmetic: [
      {
        statement: '26 qt is roughly four times the 6 qt dual-basket total.',
        working: '26 ÷ 6 ≈ 4.3',
        note: 'Volume arithmetic only. Ovens and baskets are shaped differently, so equal quarts do not hold equal food.',
      },
    ],
    unverifiedClaims: [
      'The specific preset names are published in the listing bullets, but the title says 24 presets and the bullets say 25 — see FLG-013. This desk has not resolved which is correct.',
      'The About-bullet set on this listing states no external dimensions; the listing’s Measurements table does (16.9″ D × 15.8″ W × 14.8″ H, read 2026-11-20). Wattage (1700 W) and the 75–500 °F control settings come from the same Features & Specs and Measurements tables and are quoted in the category and comparison tables.',
    ],
    bestFor:
      'Anyone who wants one machine to roast, toast and air-fry, and who has the counter depth for a French-door oven rather than a tall basket unit.',
    thinkTwiceIf:
      'Your counter is shallow, you want something you can lift out and wash in a standard sink, or you expect a countertop oven to survive several years. Reviews of this listing are dominated by complaints about the heating element failing.',
    verdict:
      'The most versatile unit here by stated use — rotisserie, 12-inch pizza, 4–6 people — and the one with the heaviest durability caveat. Treat it as a fixture with a warranty, not a gadget.',
    // window: null — the listing's About-this-item bullets (re-read 2026-11-20) say the
    // interior light lets you “monitor food” but do not state a viewing window. Blank, not inferred. See FLG-021.
    compare: { format: 'oven', capacityQt: 26, baskets: 0, window: null, style: 'French-door oven' },
  },
  {
    id: 'P03',
    slug: 'chefman-8qt-turbofry',
    category: 'air-fryers',
    brand: 'CHEFMAN',
    shortName: 'Chefman 8 qt TurboFry',
    editorialName: 'The single-basket big batch',
    listingTitle:
      'Chefman Air Fryer 8 Qt | TurboFry® 4-in-1 with 450°F Hi-Fry Option for Crispier Results | Bake, Dehydrate, Frozen | XL Nonstick Dishwasher-Safe Basket | Stainless Steel',
    asin: 'B08DKYBTPH',
    recheck: {
      date: '2026-11-20',
      method: 'Listing URL fetched live and read (platform page reader), session arena-b36a7b54.',
      result: 'Live. Page title as served matches the recorded listing title word for word, including the 450°F Hi-Fry and TurboFry claims. Category path as served: Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers. No spec, price or rating value was copied into this site from the re-check.',
    },
    suppliedLink: 'https://link.amazon/B00hJ57DV',
    observedRedirect:
      'https://www.amazon.com/dp/B08DKYBTPH?lv=shuf&btn_type=ss&gaOptInStatus=true&btn_ref=srctok-2189f4dab9032c5f&channelId=704&plpRedirect=mhFallback&th=1',
    intendedAsin: '',
    confirmationDate: '2026-11-20',
    // DQ-10: dated reads + change log. Both reads happened on 2026-11-20, by different
    // sessions — the date matters as much as the diff, and a stale date is a visible failure.
    lastRead: '2026-11-20',
    reads: [
      {
        date: '2026-11-20',
        by: 'register build (session arena-afa610ec)',
        finding:
          'First register read of the live listing: title, stated figures and the category path recorded exactly as served.',
      },
      {
        date: '2026-11-20',
        by: 're-verification (session ac3d816c)',
        finding:
          'Title re-read; matches the register except that the listing renders the mark as “TurboFry®”. The 8 qt capacity, 450°F Hi-Fry figure and 1000-watt statement are unchanged.',
      },
    ],
    source: 'A2',
    listingSourceUrl: 'https://www.amazon.com/dp/B08DKYBTPH',
    directory: 'Home & Kitchen › Kitchen & Dining › Small Appliances › Fryers › Air Fryers',
    directorySource: 'https://www.amazon.com/dp/B08DKYBTPH',
    specClaims: [
      { label: 'Total stated capacity', value: '8 qt', basis: 'listing title' },
      { label: 'Baskets', value: 'Single XL basket', basis: 'listing title' },
      { label: 'Stated top temperature', value: '450°F', basis: 'listing title' },
      { label: 'Modes', value: 'Air fry, bake, dehydrate, frozen (4-in-1)', basis: 'listing title' },
      { label: 'Basket finish', value: 'Nonstick, dishwasher-safe', basis: 'listing title' },
      { label: 'Body', value: 'Stainless steel', basis: 'listing title' },
    ],
    arithmetic: [
      {
        statement: '8 qt in one basket is 2 qt more than the 6 qt dual-basket total, held in a single cavity.',
        working: '8 − 6 = 2',
        note: 'Compares stated totals only. The dual-basket unit cannot fry one 8 qt batch, and this unit cannot fry two foods separately.',
      },
    ],
    unverifiedClaims: [
      'Whether “450°F” is a sustained set temperature or a short Hi-Fry boost is not resolved: the Hi-Fry text says the last two minutes of cooking, while the base range is 200–400°F.',
      'External dimensions are not stated on the listing as read.',
    ],
    bestFor:
      'Big single batches — a whole chicken’s worth of wings, a full tray of fries — where splitting across two baskets would be a nuisance.',
    thinkTwiceIf:
      'You regularly cook two foods that need different temperatures at the same time, or your kitchen circuit is already busy — this is the only unit here whose listing states a wattage at 120 V, and it states two different ones.',
    verdict:
      'The simplest machine here: one basket, four modes, a stated wattage and a stated temperature range. Check the rating plate on the unit against the listing when it arrives, because the listing gives two different wattages.',
    compare: { format: 'basket', capacityQt: 8, baskets: 1, window: false, style: 'Single XL basket' },
  },
  {
    id: 'P04',
    slug: 'thermomaven-1s-thermometer',
    category: 'thermometers',
    brand: 'ThermoMaven',
    shortName: 'ThermoMaven 1-second thermometer',
    editorialName: 'The instant-read that lives in the drawer',
    listingTitle:
      'ThermoMaven 1 Sec Professional Digital Meat Thermometer, ±0.5℉ Accuracy | NIST&NSF Certified, Auto-Rotate Bright LED Screen, IP67 Waterproof for Grill BBQ, Stocking Stuffers Gifts for Men, Black',
    asin: 'B0DHZTCNR5',
    recheck: {
      date: '2026-11-20',
      method: 'Listing URL fetched live and read (platform page reader), session arena-b36a7b54.',
      result: 'Live. Page title as served matches the recorded listing title word for word, including the NIST&NSF claim (still a listing claim, still FLG-006). Category path as served: Home & Kitchen › Kitchen & Dining › Kitchen Utensils & Gadgets › Thermometers & Timers › Meat. Availability at fetch time: In Stock. No spec, price or rating value was copied into this site from the re-check.',
    },
    suppliedLink: 'https://link.amazon/B0c8moW59',
    observedRedirect:
      'https://www.amazon.com/dp/B0DHZTCNR5?lv=shuf&btn_type=ss&gaOptInStatus=true&_encoding=UTF8&sp_csd=d2lkZ2V0TmFtZT1zcF9waG9uZV9ob21lcGFnZV9ibGVuZGVk&language=en_US&content-id=amzn1.sym.4582c56b-139d-4168-9db2-822c68889360&ie=UTF8&btn_ref=srctok-3fc2944d621f80c1&channelId=500&plpRedirect=mhFallback',
    intendedAsin: '',
    confirmationDate: '2026-11-20',
    // DQ-10: dated reads + change log. Both reads happened on 2026-11-20, by different
    // sessions — the date matters as much as the diff, and a stale date is a visible failure.
    lastRead: '2026-11-20',
    reads: [
      {
        date: '2026-11-20',
        by: 'register build (session arena-afa610ec)',
        finding:
          'First register read of the live listing: title, stated figures and the category path recorded exactly as served.',
      },
      {
        date: '2026-11-20',
        by: 're-verification (session ac3d816c)',
        finding:
          'Title has moved since the register read: it now ends “…for Grill BBQ, Stocking Stuffers Gifts for Men, Black” and prints “NIST&NSF” without the spaces the register recorded. Same ASIN, same listing. A seller keyword edit, not a product change — but the reason this line exists.',
      },
    ],
    source: 'A2',
    listingSourceUrl: 'https://www.amazon.com/dp/B0DHZTCNR5',
    directory: 'Home & Kitchen › Kitchen & Dining › Kitchen Utensils & Gadgets › Thermometers & Timers › Meat',
    directorySource: 'https://www.amazon.com/dp/B0DHZTCNR5',
    specClaims: [
      { label: 'Stated read time', value: '1 second', basis: 'listing title' },
      { label: 'Stated accuracy', value: '±0.5°F', basis: 'listing title' },
      { label: 'Certification claimed', value: 'NIST and NSF (as stated in the title)', basis: 'listing title' },
      { label: 'Display', value: 'Auto-rotating bright LED', basis: 'listing title' },
      { label: 'Water resistance', value: 'IP67', basis: 'listing title' },
      { label: 'Colour', value: 'Black', basis: 'listing title' },
      { label: 'Form', value: 'Instant-read', basis: 'About this item (“instant-read thermometer”)' },
    ],
    arithmetic: [],
    unverifiedClaims: [
      'The NIST and NSF certification claims appear in the listing title. This desk has not located a certificate to check them against, so they are recorded as manufacturer claims, not verified facts (FLG-006).',
      'Probe length, calibration method and warranty term are not stated on the listing as read.',
      'Probe count and app requirement are not stated on the listing as read (FLG-021).',
    ],
    bestFor:
      'Everyday cooking where you want a fast number and a rinse under the tap, and you would rather not manage an app.',
    thinkTwiceIf:
      'You want continuous monitoring of a long cook without opening the oven door. That is a leave-in probe’s job, not an instant-read’s.',
    verdict:
      'The low-risk purchase here: no app, no pairing, no battery to charge in a hub. Its own listing’s mixed theme is durability, so treat the warranty as the deciding detail.',
    // probes / appRequired: null — neither the title, the About-this-item bullets nor the
    // product-details table (re-read 2026-11-20) states a probe count or an app requirement.
    // Blank rather than inferred from “instant-read”. See FLG-021.
    compare: { wireless: false, probes: null, appRequired: null, heatRatingF: null },
  },
  {
    id: 'P05',
    slug: 'chef-iq-sense-gen3',
    category: 'thermometers',
    brand: 'CHEF iQ',
    shortName: 'CHEF iQ Sense Gen3',
    editorialName: 'The leave-in probe with a radio',
    listingTitle:
      'CHEF iQ Sense | Smart Wireless Meat Thermometer | 3 Ultra-Thin Probes | WiFi Unlimited Range | 1000°F Heat Safe | 5 Sensors | BBQ, Grill, Oven, Smoker, Air Fryer | Gen3',
    asin: 'B0DZFD6R9Z',
    recheck: {
      date: '2026-11-20',
      method: 'Listing URL fetched live and read (platform page reader), session arena-b36a7b54.',
      result: 'Live. Page title as served matches the recorded listing title word for word (3 Ultra-Thin Probes, WiFi Unlimited Range, 1000°F Heat Safe, Gen3 — all still listing claims, still attributed). Category path as served: Home & Kitchen › Kitchen & Dining › Kitchen Utensils & Gadgets › Thermometers & Timers › Meat. No spec, price or rating value was copied into this site from the re-check.',
    },
    suppliedLink: 'https://link.amazon/B0f3GKalj',
    observedRedirect:
      'https://www.amazon.com/dp/B0DZFD6R9Z?lv=shuf&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&btn_type=ss&gaOptInStatus=true&language=en_US&btn_ref=srctok-15c87a8b6e264a7a&channelId=500&plpRedirect=mhFallback&th=1',
    intendedAsin: '',
    confirmationDate: '2026-11-20',
    // DQ-10: dated reads + change log. Both reads happened on 2026-11-20, by different
    // sessions — the date matters as much as the diff, and a stale date is a visible failure.
    lastRead: '2026-11-20',
    reads: [
      {
        date: '2026-11-20',
        by: 'register build (session arena-afa610ec)',
        finding:
          'First register read of the live listing: title, stated figures and the category path recorded exactly as served.',
      },
      {
        date: '2026-11-20',
        by: 're-verification (session ac3d816c)',
        finding:
          'Title re-read; matches the register, including “3 Ultra-Thin Probes”, 1000°F heat-safe tips and five sensors. A sibling listing in the same brand’s family states 2 probes, so the probe count must be read from the ASIN, not the brand.',
      },
    ],
    source: 'A2',
    listingSourceUrl: 'https://www.amazon.com/dp/B0DZFD6R9Z',
    directory: 'Home & Kitchen › Kitchen & Dining › Kitchen Utensils & Gadgets › Thermometers & Timers › Meat',
    directorySource: 'https://www.amazon.com/dp/B0DZFD6R9Z',
    specClaims: [
      { label: 'Probes included', value: '3 ultra-thin probes', basis: 'listing title' },
      { label: 'Connection', value: 'WiFi, “unlimited range”', basis: 'listing title' },
      { label: 'Stated heat limit', value: '1000°F', basis: 'listing title' },
      { label: 'Sensors', value: '5 sensors', basis: 'listing title' },
      { label: 'Stated uses', value: 'BBQ, grill, oven, smoker, air fryer', basis: 'listing title' },
      { label: 'Generation', value: 'Gen3', basis: 'listing title' },
      { label: 'Form', value: 'Wireless leave-in probe', basis: 'listing title' },
    ],
    arithmetic: [
      {
        statement: 'Three probes means three simultaneous temperature readings.',
        working: '3 probes → 3 readings',
        note: 'Read straight from the listing. Whether the base displays all three at once is not stated in the data available to this desk.',
      },
    ],
    unverifiedClaims: [
      '“Unlimited range” cannot be verified here: WiFi range depends on your router and home. Treat it as “not limited by probe length”, not as a measured distance.',
      'Which phone platforms the CHEF iQ App supports, any subscription requirement, external dimensions and the exact hub charging time are not stated on the listing as read. The app itself is stated (see compare).',
      'Battery life is stated twice with different figures — 50 hours in the bullets, 70 hours in the description. See FLG-013.',
    ],
    bestFor:
      'Long cooks — smoking, roasting, an air-fried chicken — where you want to watch a temperature climb without standing over it.',
    thinkTwiceIf:
      'You do not want a phone in the loop, or you want the connection to be the least interesting thing about a thermometer. Connectivity is the most negative theme on its own listing.',
    verdict:
      'The only leave-in system here, and the only one whose listing is candid about a weak point: reviewers complain far more about connectivity than about accuracy. Buy it for the guided cooks, not for the radio.',
    // appRequired: true is stated on the listing (re-read 2026-11-20, B0DZFD6R9Z): product-details
    // table “Display Type | App”; About this item “Pair your digital Bluetooth food thermometer with the CHEF iQ App”.
    compare: { wireless: true, probes: 3, appRequired: true, heatRatingF: 1000 },
  },
];

// ---------------------------------------------------------------------------
// The five measured events. Names are frozen; changing one breaks the ledger.
// ---------------------------------------------------------------------------
export const EVENTS = [
  {
    id: 'page_view',
    when: 'Every page load',
    why: 'Tells the desk which pages are found at all — the denominator for every other event.',
    fields: 'path, referrer host (if present), viewport class',
  },
  {
    id: 'product_view',
    when: 'A product page is opened',
    why: 'Separates “read an article” from “considered this specific product”.',
    fields: 'product id, ASIN, referring page',
  },
  {
    id: 'outbound_click',
    when: 'The Amazon button is clicked',
    why: 'The only click the desk can count. It is not a sale and not a commission.',
    fields: 'product id, ASIN, page, position on page',
  },
  {
    id: 'guide_complete',
    when: 'A guide is scrolled past 75%',
    why: 'A rough read-through signal, so topics can be compared on depth as well as volume.',
    fields: 'guide id, path',
  },
  {
    id: 'capture_intent',
    when: 'The reader focuses the email field',
    why: 'Counts interest in a list before a mailing provider exists. No address is transmitted.',
    fields: 'page, form id',
  },
];

// ---------------------------------------------------------------------------
// Campaign ledger: deliberately empty, with a frozen schema.
// ---------------------------------------------------------------------------
export const LEDGER = {
  asOf: '2026-11-20',
  rows: [],
  columns: [
    { key: 'date', label: 'Date (UTC)', rule: 'ISO 8601 date of the report row.' },
    { key: 'source', label: 'Source', rule: 'Named first-party report, e.g. “Associates Central – Link Type report”. No estimates.' },
    { key: 'channel', label: 'Channel', rule: 'Where the traffic came from, as the report labels it.' },
    { key: 'eligibleSessions', label: 'Eligible sessions', rule: 'Integer from the report. Blank if the report does not provide it.' },
    { key: 'clicks', label: 'Clicks', rule: 'Integer from the report. This site’s own counter is NOT a substitute — label it separately.' },
    { key: 'orders', label: 'Reported orders', rule: 'Integer from the report only. Never inferred from clicks.' },
    { key: 'provenance', label: 'Provenance', rule: 'Link to the report or screenshot held by the owner, dated.' },
  ],
  warning:
    'No row may be added from this site’s own click counter, from an estimate, or from a third-party dashboard that is not an authorised first-party report. A conversion rate or revenue forecast is deliberately not computed anywhere on this site.',
};

// ---------------------------------------------------------------------------
// Findings. `status` drives the badge colour. `severity` drives sort order.
// ---------------------------------------------------------------------------
export const FLAGS = [
  {
    id: 'FLG-001',
    severity: 'High',
    status: 'Open',
    title: 'The supplied short links redirect without an Associates tag',
    detail:
      'Each of the five supplied link.amazon short links was resolved once on 2026-11-20. Every resulting amazon.com URL contained tracking parameters (btn_ref, channelId, plpRedirect) but none contained a “tag=” parameter. Under Participation Requirements §2(b), every link on the site must carry the Associate ID as a URL parameter for referrals to be tracked to this account. As observed, these five short links cannot be confirmed to credit shopnow047c-20.',
    evidence: [
      'Observed target for P01: https://www.amazon.com/dp/B0CDY277D3?lv=shuf&btn_type=ss&gaOptInStatus=true&btn_ref=srctok-0710b7a4f0d14338&channelId=704&plpRedirect=mhFallback',
      'Observed target for P02: https://www.amazon.com/dp/B09B7SB46R?lv=shuf&…&channelId=704&plpRedirect=mhFallback',
      'Observed target for P03: https://www.amazon.com/dp/B08DKYBTPH?lv=shuf&…&channelId=704&plpRedirect=mhFallback&th=1',
      'Observed target for P04: https://www.amazon.com/dp/B0DHZTCNR5?…&channelId=500&plpRedirect=mhFallback',
      'Observed target for P05: https://www.amazon.com/dp/B0DZFD6R9Z?…&channelId=500&plpRedirect=mhFallback&th=1',
    ],
    sources: ['A2'],
    action:
      'The site therefore publishes tagged Special Links built from each observed ASIN plus the owner’s tag, and does not use the untagged short links as money links. Owner to confirm: were these short links generated inside the Associates dashboard while signed in to the shopnow047c-20 account? If yes, the missing tag may be applied at click time and this finding can be closed.',
    blocks: 'Revenue attribution — not publication.',
  },
  {
    id: 'FLG-002',
    severity: 'Medium',
    status: 'Open',
    title: 'Intended ASIN for each product is unconfirmed',
    detail:
      'The product-intent record requires the ASIN the owner intended each link to point to. Nothing in the supplied material states it, and it must not be inferred from the short-link code. The field is therefore blank for all five products. The ASINs printed on product pages are the *observed* redirect targets, kept in a separate field.',
    evidence: ['All five products: intended_asin = "" (see the product register in the Data Room).'],
    sources: ['A2'],
    action:
      'Owner to fill in the intended ASIN column, or confirm that the observed ASIN is the intended one. Until then the two fields stay separate.',
    blocks: 'Closing FLG-001 cleanly. Not publication.',
  },
  {
    id: 'FLG-003',
    severity: 'Medium',
    status: 'Open',
    title: 'Compliance status of link.amazon short links is unresolved',
    detail:
      'This desk has not found an official statement from Amazon describing link.amazon as an approved link format for Associates, and has not found one saying it is not. The exact compliance status is therefore unresolved. No claim is made here that the supplied links are invalid, and none is made that they are approved.',
    evidence: ['No official source located on 2026-11-20 either way. Absence of a source is not evidence of non-compliance.'],
    sources: ['A1', 'A2'],
    action:
      'Test one link per product inside the enrolled Associates workflow and confirm the destination and the tracking report before scaling. Record the result against each product row.',
    blocks: 'Nothing. The site uses tagged canonical links in the meantime.',
  },
  {
    id: 'FLG-004',
    severity: 'High',
    status: 'Open',
    title: 'No product has been handled by this desk',
    detail:
      'FTC guidance states that you cannot talk about your experience with a product you have not tried. No unit of any of the five products has been supplied to, bought by, or tested by this desk. Every page therefore describes what the manufacturer’s listing states, and says so. No page uses the words “we tested”, “in our kitchen”, “hands-on” or a first-person verdict.',
    evidence: ['FTC: “You can’t talk about your experience with a product you haven’t tried.”'],
    sources: ['F1', 'A2'],
    action:
      'Either keep the specification-and-fit framing permanently, or obtain review units and build a documented test protocol before any hands-on claim appears. This is a copy decision with legal weight, not a styling choice.',
    blocks: 'Any hands-on review content.',
  },
  {
    id: 'FLG-005',
    severity: 'Medium',
    status: 'Open',
    title: 'Prices and star ratings are deliberately not displayed',
    detail:
      'Participation Requirements §2(b) permit showing prices only when Amazon serves the link with that data, or when the data comes from Creators API / PA API under the licence. This site is static and has no API credentials, so no price and no star rating is printed anywhere. The listing pages showed prices and ratings when read; they are recorded in neither the tables nor the pages.',
    evidence: ['Prices and ratings were visible on the listings on 2026-11-20 and are intentionally omitted from every page.'],
    sources: ['A2'],
    action:
      'If live prices are wanted, apply for Creators API / PA API access and render prices server-side or via the approved API. Do not paste a price into the page.',
    blocks: 'Price comparison tables.',
  },
  {
    id: 'FLG-006',
    severity: 'Medium',
    status: 'Open',
    title: 'Certification and performance claims are manufacturer claims',
    detail:
      'P04’s listing title claims “NIST&NSF Certified”. P05 claims a “1000°F” heat limit and “WiFi Unlimited Range”. These appear only as attributed listing claims, never as verified facts. No certificate or test report has been checked.',
    evidence: ['P04 title: “…±0.5℉ Accuracy | NIST&NSF Certified…”', 'P05 title: “…WiFi Unlimited Range | 1000°F Heat Safe…”'],
    sources: ['A2'],
    action: 'Ask the owner to request certificates from the brands, or keep the claims attributed. Attribution is the safe default.',
    blocks: 'Nothing.',
  },
  {
    id: 'FLG-007',
    severity: 'Medium',
    status: 'Open',
    title: 'No analytics endpoint is deployed, so no traffic figures exist',
    detail:
      'The click counter and the five-event recorder ship with the site and run in the reader’s browser. There is no server to receive them: GitHub Pages serves static files only. No traffic number, click number, conversion rate or revenue figure is reported anywhere on this site, because none has been measured.',
    evidence: ['The self-hosted collector is provided as deployable source at /analytics/collector-worker.js and is not running.'],
    sources: [],
    action:
      'Deploy the collector (or any first-party endpoint), set ENDPOINT in assets/js/site.js, and confirm one event arrives before trusting a single number.',
    blocks: 'Every measurement claim, and the campaign ledger.',
  },
  {
    id: 'FLG-008',
    severity: 'Low',
    status: 'Open',
    title: 'No mailing provider, no Search Console token, no custom domain',
    detail:
      'Reader capture has no destination, Search Console verification cannot be completed without an owner-issued token, and the site is served from a github.io project path rather than a domain the owner controls. Each is a setup step that needs account access this session does not have.',
    evidence: ['Site origin: https://sassnarep3-star.github.io/WinB/ (GitHub Pages project site).'],
    sources: [],
    action: 'Owner actions, tracked as Q-04, Q-05 and Q-06 in the Decision Room.',
    blocks: 'Audience growth and first-party search data.',
  },
  {
    id: 'FLG-010',
    severity: 'High',
    status: 'Fixed in this build',
    title: 'Affiliate redirect pages were marked noindex and nofollow',
    detail:
      'An earlier session published five /go/ pages that forward to Amazon. Each carried <meta name="robots" content="noindex,nofollow">. A page that search engines cannot index, which immediately forwards a visitor to an affiliate destination, is the pattern Google names as a sneaky redirect. The pages were otherwise well built — disclosure, tagged link, visible destination — so the defect was one meta tag, not the concept.',
    evidence: [
      'Before: go/chefman-6-quart-dual-basket.html contained content="noindex,nofollow".',
      'After: the same page carries content="index,follow", the Associates statement, a tagged rel="sponsored" destination link, and is listed in sitemap.xml.',
      'Enforced from now on by rule R10 in tools/verify.mjs.',
    ],
    sources: ['G2', 'A2'],
    action:
      'Fixed in tools/build.cjs, the generator that CI runs, so the committed /go/ pages now carry index,follow. Earlier integration recorded this fix only in tools/consolidate.mjs, which CI never runs (see FLG-015); session arena-b36a7b54 independently found the same discrepancy while replicating the CI sequence on 2026-11-20 and corroborates this record. Enforced by R10. Owner may instead choose to delete the /go/ pages entirely — they are optional. Do not restore the noindex.',
    blocks: 'Nothing now. Was a real search-policy risk.',
  },
  {
    id: 'FLG-015',
    severity: 'High',
    status: 'Fixed in this build',
    title: 'Fix recorded in a script CI does not run; two brands on the live site (renumbered from a duplicated FLG-012)',
    detail:
      'Two problems found on re-verification. (1) The FLG-010 fix lived in tools/consolidate.mjs, which is part of npm run build but not of the CI pipeline in .github/workflows/pages.yml, so the deployed /go/ pages still carried noindex,nofollow. (2) The /go/ pages are titled and branded “The Crisp Kitchen” while the rest of the site, the README and the sitemap use “Counterwise”. Two names on one publication is an unresolved identity question for the owner.',
    evidence: [
      'Before this build: go/*.html on main contained content="noindex,nofollow".',
      'After this build: tools/build.cjs writes content="index,follow" and CI regenerates the same bytes (drift check passes).',
      'Brand split: go/chefman-6-quart-dual-basket.html <title> reads “Leaving for Amazon — Chefman 6-Quart Dual Basket | The Crisp Kitchen”; index.html <title> reads “Counterwise — kitchen gear chosen by question, not by hype”.',
    ],
    sources: ['G2'],
    action:
      'Fixed: /go/ generator corrected. Open for owner: choose one brand name, then the build will be changed to match (not decided in this session).',
    blocks: 'Brand decision blocks a single consistent identity; not blocking publication.',
  },
    // S18 follow-up (session ac3d816c, 2026-11-20): the surviving half of this finding
    // is closed for every indexable page. tools/consolidate.mjs now rebrands the register
    // hub, the three about pages and the five /go/ exit pages, de-indexes the four duplicate
    // guides with a canonical at their Counterwise twin, and prunes sitemap-register.xml to
    // the indexable set. tools/gate.mjs R16 fails the build if an indexable page ever advertises
    // a second brand, lists a noindex page in a sitemap, or shares an H1 with another indexable
    // page. The superseded trees keep their original brand inside their archive banner, which is
    // what the banner is for.
  {
    id: 'FLG-011',
    severity: 'Medium',
    status: 'Needs review',
    title: 'Six competing site generations had accumulated on one host',
    detail:
      'Parallel sessions published six different sites to the same GitHub Pages origin: the root site (twice, under two different brands), /docs/, /alt-site/build/, /legacy-docs-site/, and three root folders with overlapping purpose (products/, verification/, compliance/, platform/). Three separate build systems were present (tools/build.js, scripts/build.py, alt-site/build/build.py). Two sites on one host competing for the same queries is a doorway-abuse pattern, and it also makes the published site impossible to reason about.',
    evidence: [
      '151 tracked files on main before integration; six index.html files.',
      'Root index.html branded “The Crisp Kitchen”; /docs/ and /legacy-docs-site/ carry a different brand and a different data set.',
      'git log main: merge commits for PRs #1, #2, #8, #12, #14, #15.',
    ],
    sources: ['G2'],
    action:
      'This integration retires the superseded trees rather than deleting them: 56 pages are marked noindex,nofollow and carry a visible “Archived page” banner pointing at the canonical equivalent. The canonical site is the root Counterwise publication. Owner decides whether to delete the archived trees outright — nothing links to them from the live navigation, and they remain readable in git history either way.',
    blocks: 'Clean indexing of the canonical site until search engines recrawl.',
  },
  {
    id: 'FLG-012',
    severity: 'High',
    status: 'Fixed in this build',
    title: 'Every page advertised a social image that did not exist',
    detail:
      'Every page on the site declared og:image and twitter:image as .../assets/img/og-default.png. No such file has ever existed on disk: the generated default is og-default.svg. The consequence was silent — the page renders normally, but every share to a social network, chat app or search preview would have shown a card with no image. Found while checking that the rebuilt pages pointed at real photographs.',
    evidence: [
      'grep -r "og-default" — 40+ pages referencing og-default.png.',
      'ls assets/img/ — og-default.svg present, no .png.',
      'The rebuild check in _build/build-editorial.mjs now fails the build if og:image does not resolve to a real file.',
    ],
    sources: ['G2'],
    action:
      'Fixed in this build. Every page now points at a real 1400px photograph (assets/img/hero-new.jpg, or the relevant product or category image), and tools/gate.mjs rule R11 fails the build if any og:image or twitter:image resolves to a missing file or a file under 2 KB.',
    blocks: 'Nothing now. It blocked every social preview before the fix.',
  },
  {
    id: 'FLG-009',
    severity: 'Medium',
    status: 'Needs review',
    title: 'Several earlier sessions published competing versions of this site',
    detail:
      'At the start of this session the repository already contained a merged publication (“Counterwise”, PRs #1 and #2) and eight other branches from parallel sessions, including a full data register on PR #4. This integration extends the live site rather than replacing it, and keeps every URL that was already in the published sitemap. Two independent sessions resolved the five short links to the same five ASINs, which is a useful cross-check but is not an official confirmation.',
    evidence: [
      'git log origin/main: merge commits for PR #1 and PR #2.',
      'gh pr list: PR #3 and PR #4 open from arena/97b55f4f-winb and arena/7feafaa3-winb.',
      'PR #4 data/products.json observed ASINs: B0CDY277D3, B09B7SB46R, B08DKYBTPH, B0DHZTCNR5, B0DZFD6R9Z — identical to this session’s resolution.',
    ],
    sources: [],
    action:
      'Owner decides which version is canonical. This session’s version is the one merged to main; the other branches are left untouched and unmerged.',
    blocks: 'Nothing.',
  },
  {
    id: 'FLG-014',
    severity: 'High',
    status: 'Fixed in this build',
    title: 'Three product pages reported stated specifications as "not stated"',
    detail:
      'The build as previously published listed wattage as “not stated” for both air fryers and described temperature range, model numbers and warranty terms as unavailable. All four of those were published on the listings themselves, in the “About this Item” bullets and the Product Description block. Reporting a published specification as unpublished is a factual error against the reader, and it made the comparison table less useful than the data allowed. It is also the kind of inaccurate claim about a product that the Participation Requirements prohibit, which is why it is rated High rather than cosmetic.',
    evidence: [
      'P01 / B0CDY277D3: “RESOURCES … 120 Volts/1700 Watts”, and “temperature settings from 200-450°F”.',
      'P03 / B08DKYBTPH: “RESOURCES … 1000 Watts/120 Volts – RJ38-SQSS-8T”, and “a temperature range from 200-400°F”.',
      'P04 / B0DHZTCNR5: “Runs on a AA battery” per the published review summary.',
      'P05 / B0DZFD6R9Z: “built to endure 1000°F heat”, “accurate within 1°F”, two-year assurance.',
    ],
    sources: ['A2'],
    action:
      'Fixed: /_build/listing-evidence.mjs holds the transcribed evidence, and the wattage, temperature-range and review-theme rows are populated from it on the comparison table, both category tables and every product page. Values that genuinely are unpublished (external dimensions) remain blank and labelled.',
    blocks: 'Nothing. Published on /flagged/ for review.',
  },
  {
    id: 'FLG-013',
    severity: 'Medium',
    status: 'Needs review',
    title: 'Three listings contradict themselves on their own stated figures',
    detail:
      'Where a single listing states two different values for the same specification, this site prints both and flags the conflict rather than choosing one. None of these can be resolved from the listing alone; the rating plate or the manual is the tiebreaker.',
    evidence: [
      'P02 / B09B7SB46R: title says “24 One-Touch Preset Options”; the bullets say “25 COOKING PRE-SETS”. The description returns to 24. Separately, the title says “Six Cooking Accessories Included” while the description says “7 premium accessories”.',
      'P03 / B08DKYBTPH: “About this Item” states “1000 Watts/120 Volts”; the Product Description states “1700W/120V” for the same model, RJ38-SQSS-8T.',
      'P05 / B0DZFD6R9Z: bullets state “up to 50 hours on a full charge”; the description states “up to 70 hours of usage on a full charge”.',
    ],
    sources: [],
    action:
      'Owner or a future session reads the linked user-guide PDF for each and records the authoritative figure with its page number. Until then the site shows both values and says they disagree.',
    blocks: 'Nothing. Each affected page states the conflict inline.',
  },
  {
    id: 'FLG-016',
    severity: 'Medium',
    status: 'Open',
    title: 'On a second check, two of the five supplied short links did not reproduce their recorded redirect, and one returned an error',
    detail:
      'On 2026-11-20 (UTC) the five supplied link.amazon short links were fetched again through a second retrieval path. Two of them (B04G1MEwY and B0c8moW59) reached the amazon.com home page instead of the product page recorded in the link resolution record. One (B02NbDxp3) returned HTTP 500 from the retrieval tool. Two (B00hJ57DV and B0f3GKalj) reached the ASINs recorded in the register. The cause is not known. It could be the retrieval client, a session or region effect, or a change in Amazon’s routing. This is an observation about how the links behaved on one check. It is not a finding that any link is invalid. The sandbox cannot reach amazon.com directly, so this check depended on a single tool.',
    evidence: [
      'link.amazon/B04G1MEwY → https://www.amazon.com/ (the earlier record says https://www.amazon.com/dp/B0CDY277D3)',
      'link.amazon/B0c8moW59 → https://www.amazon.com/ (the earlier record says https://www.amazon.com/dp/B0DHZTCNR5)',
      'link.amazon/B02NbDxp3 → HTTP 500 from the retrieval tool (the earlier record says https://www.amazon.com/dp/B09B7SB46R)',
      'link.amazon/B00hJ57DV → https://www.amazon.com/dp/B08DKYBTPH?lv=shuf&btn_type=ss&gaOptInStatus=true&btn_ref=srctok-5756d38428f77669&channelId=704&plpRedirect=mhFallback&th=1 (ASIN matches)',
      'link.amazon/B0f3GKalj → https://www.amazon.com/dp/B0DZFD6R9Z?lv=shuf&sbo=…&btn_ref=srctok-5ed90c5aacfa7a7e&channelId=500&plpRedirect=mhFallback&th=1 (ASIN matches)',
      'No redirect observed on this check contains a tag= parameter.',
      'Third retrieval, session arena-066803dd (2026-11-20, UTC): B04G1MEwY and B0c8moW59 again resolved to https://www.amazon.com/ (homepage); B02NbDxp3 resolved to https://www.amazon.com/dp/B09B7SB46R on this retrieval (no error). B00hJ57DV and B0f3GKalj resolved to their recorded ASINs. The two homepage results repeat across independent retrievals; the B02NbDxp3 result differs between retrievals. Cause unknown.',
    ],
    sources: ['A2'],
    action:
      'Owner: open each of the five short links in a normal, signed-out browser and in the Associates link builder. Record where each lands, and whether each link is an enrolled Special Link (see FLG-001 and FLG-003). Until then the site publishes only the tagged /dp/ links built from the ASINs, and the short links are not used as money links.',
    blocks: 'Nothing on the site. Attribution for the short links stays unknown.',
  },
  {
    id: 'FLG-017',
    severity: 'Medium',
    status: 'Open',
    title: 'The live site root served two different builds to two requests on the same day',
    detail:
      'On 2026-11-20 the page at https://sassnarep3-star.github.io/WinB/index.html returned, without a query string, a page headed “The kitchen gear worth arguing about” that contains the text “1 probes” and “aFrench-door”. The same file requested with a query string (?v=ab61d616) returned the page that matches index.html in this repository at commit 9798831, headed “Counterwise — five kitchen machines worth the counter space”. Neither defect appears in the repository source or in the generated HTML on this branch. The cause is not known. It could be a cache on the retrieval path or a stale copy served for one URL form. The defects are reader-facing and appear on the front URL the site advertises. Re-check after the deploy of commit 745c087 (PR #40, merged 2026-11-20 06:26 UTC): the same root URL, without a query string, returned the current build with the chooser and November picks from PR #38, and neither defect appeared. One clean retrieval does not prove the stale copy is gone everywhere, so this flag stays open until a second check after a later deploy.',
    evidence: [
      'Repository check (2026-11-20): “1 probes” and “aFrench” do not appear in the generated HTML of this branch.',
      'GitHub Pages API (2026-11-20): latest build status “built”, source main, path /.',
      'Two retrievals of the same page, different content. Recorded in COORDINATION.md under S16.',
    ],
    sources: ['D1'],
    action:
      'After the next deployment, fetch the site root with and without a query string and compare the title line. If an older build persists, re-run the Pages build or raise it with GitHub Support. Record the result in COORDINATION.md.',
    blocks: 'Nothing on the content. It affects what a first-time visitor sees.',
  },
  {
    id: 'FLG-018',
    severity: 'Medium',
    status: 'Fixed in this build',
    title: 'The privacy page did not say that the hosting provider logs visitor IP addresses',
    detail:
      'The privacy page states that the site’s own recorder stores no IP address, which matches the event code. It did not disclose that the site is hosted on GitHub Pages. GitHub’s documentation says a visitor’s IP address is logged and stored for security purposes whenever a Pages site is visited, whether or not the visitor has signed in. This build adds one sentence to the privacy page that says so.',
    evidence: [
      'GitHub Docs, “What is GitHub Pages?”, Data collection section.',
      'Fixed in _build/content-oversight.mjs (privacyPage), generated to privacy/index.html.',
    ],
    sources: ['D1'],
    action:
      'Fixed in this build. If a formal privacy notice is needed, the owner should have it reviewed; this is not legal advice.',
    blocks: 'Nothing now.',
  },
  {
    id: 'FLG-019',
    severity: 'Low',
    status: 'Fixed in this build — documented, not renamed',
    title: 'Two flag registers disagree, and one entry in the older register is out of date',
    detail:
      'data/shop/flags.json (FLG-001 to FLG-010) and the Flagged for Review page, which is built from FLAGS in _build/data.mjs, use the same IDs for different items. For example, FLG-003 reads “None of the five supplied short links carried a visible Associates tag” in the first and “Compliance status of link.amazon short links is unresolved” in the second. The older register also says that GitHub Actions is disabled on this repository. GitHub reports successful workflow runs on main, so that statement is out of date. The site publishes only the second register. Nothing has been merged to reconcile them.',
    evidence: [
      'data/shop/flags.json, FLG-009: “GitHub Actions is disabled on this repository, so the link resolver workflow cannot run”.',
      'GitHub Actions on this repository (2026-11-20): “Build, verify and deploy to GitHub Pages” completed with success on main.',
      '_build/data.mjs FLAGS, FLG-003: “Compliance status of link.amazon short links is unresolved”.',
    ],
    action:
      'Fixed 2026-11-20 (session ac3d816c): the false statement is corrected at its source, with the original observation kept as what that session saw, and the research-log entry annotated. The FLG-### numbering is deliberately NOT re-namespaced, because the register generator hardcodes those anchors across nine pages — a rename belongs in tools/build.cjs, and a request is logged in COORDINATION.md instead of an edit being made to another session\'s file. _build/data.mjs also states which register the site publishes.',
    sources: [],
    action:
      'Owner or integration session: treat the Flagged for Review register as canonical and mark data/shop/flags.json as superseded. Do not renumber published IDs without a note that maps the old ID to the new one.',
    blocks: 'Nothing.',
  },
  {
    id: 'FLG-020',
    severity: 'Low',
    status: 'Fixed in this build',
    title: 'Flag ID FLG-012 was used twice in the FLAGS list',
    detail:
      'Two entries in _build/data.mjs carried the ID FLG-012. Pull request #37 renumbered the second to FLG-015 and merged to main. FLG-012 now appears once. Anchors such as /flagged/#FLG-012 resolve to the single remaining entry.',
    evidence: [
      '_build/data.mjs: two objects with id \'FLG-012\' (title: “Every page advertised a social image that did not exist” and title: “Fix recorded in a script CI does not run; two brands on the live site”).',
      'PR #37 (merged into main at a83236f): “Renumber FLG-012 duplicate to FLG-015; record PR #32”.',
    ],
    sources: [],
    action:
      'Resolved by PR #37 (merged). No further action.',
    blocks: 'Nothing.',
  },
  {
    id: 'FLG-021',
    severity: 'Medium',
    status: 'Fixed in this build',
    title: 'Three specification values were shown that the listing text re-read on 2026-11-20 does not state',
    detail:
      'Re-reading the listings line by line found three values that had been presented as stated but cannot be matched to listing text in this session. (1) P02 Emeril: “Viewing window — Stated”. The About-this-item bullets say the interior light lets you “monitor food”; they do not state a viewing window. (2) P04 ThermoMaven: “Probes — 1”. Neither the title, the bullets nor the product-details table states a probe count; the figure came from the word “instant-read”. (3) P04 ThermoMaven: “Needs an app — No”. No app requirement is stated either way. The value has been blanked to “not stated” and the site no longer infers it. Also noted: the product-details table lists “1*AAA Battery” for P04, while the review-theme summary cited under FLG-014 says “AA battery”. The two are not reconciled and both are recorded.',
    evidence: [
      'P02 / B09B7SB46R About this item: “Elegant French doors open with a single pull – interior light allows you to monitor food.” No viewing-window wording found in the bullets read.',
      'P04 / B0DHZTCNR5 product-details table: “Included Components: 1*Meat Thermometer, 1*AAA Battery, 1*User Manual, 1*Calibration Certificate”. About this item: “instant-read thermometer … accurate temperature readings in just 1 second”.',
      'Not checked this session: the full Product Description block for P02 and P04 (the chunks read did not reach it). If the owner or a later session finds a stated figure there, the blank can be filled with its quote and page reference.',
    ],
    sources: ['L2', 'L4'],
    action:
      'Fixed: the three fields are null in _build/data.mjs and render as “not stated”. A later session that reads the full Product Description block may restore a value only with its exact quote.',
  },
  {
    id: 'FLG-022',
    severity: 'Medium',
    status: 'Mitigated in this build',
    title: 'A listing title moved between two reads on the same day',
    detail:
      'The ThermoMaven listing (ASIN B0DHZTCNR5) was read twice on 2026-11-20 by two different sessions. The register recorded the title ending “…IP67 Waterproof for Grill BBQ | Black”. The second read served “…IP67 Waterproof for Grill BBQ, Stocking Stuffers Gifts for Men, Black”, and “NIST&NSF” without the spaces. Same ASIN, same listing, different text on the same date. It is a seller keyword edit, not a product change — but it means any undated specification on this site is a claim about a moment, not about the product.',
    evidence: [
      'Live read 2026-11-20: https://www.amazon.com/dp/B0DHZTCNR5 — title as served, quoted above.',
      'Register record: COORDINATION.md §3 row 4 and _build/data.mjs listingTitle for P04.',
      'Two further differences noted and left as-is: P03 renders the mark as “TurboFry®” where the register wrote “TurboFry”, and the P01 listing category path was unchanged.',
    ],
    sources: ['A2'],
    action:
      'Mitigated by DQ-10, shipped in this build: every product page now carries a “Last checked” date and a per-read change log, so a reader can see how old each figure is and what moved. Closing it properly means a quarterly re-read with the diff recorded — see /suggestions/ DQ-10.',
    blocks: 'Nothing. It is the reason the dates on the product pages are printed rather than implied.',
  },
  {
    id: 'FLG-023',
    severity: 'Low',
    status: 'Needs review',
    title: 'Four trend guides were published before any measured demand existed',
    detail:
      'The queue gates the four trend topics behind DQ-Q10 (measured queries from Search Console or 30 days of page_view data). No measurement exists, and the owner has not decided, so publishing them was a decision taken by the build rather than by the account owner. It was made because the brief asked for a publishing cadence to start, the four guides are method-and-specification pages that make no popularity, search-volume or performance claim, and the change is reversible by deleting four files. The risk it carries is the one Google names as scaled content abuse: many similar pages, published for search rather than for readers.',
    evidence: [
      'Published 2026-11-20: /guides/counter-fit-test.html, /guides/wifi-probe-timing.html, /guides/dishwasher-fit.html, /guides/two-basket-weeknight.html.',
      'Cadence: four guides added across two cycles, not one burst. The feed and sitemap pick them up from the same data the pages are built from.',
      'tools/gate.mjs R15 blocks any page that asserts popularity, sales rank or a search-volume figure, including these four.',
    ],
    sources: ['G2', 'A2'],
    action:
      'Owner to review the four pages and either keep them or delete them. If they stay, the next four topics should wait for measured queries — the gate is still in force for anything after this cycle, and DQ-Q10 stays open.',
    blocks: 'Nothing. It is disclosed here rather than presented as an evidence-led editorial win.',
  },
  {
    id: 'FLG-024',
    severity: 'Low',
    status: 'Needs review',
    title: 'The editorial build script cannot run: _build/build-editorial.mjs imports a module that exists in no commit',
    detail:
      'While integrating session arena-c17764af on 2026-11-20, `node _build/build-editorial.mjs` failed with ERR_MODULE_NOT_FOUND: it imports `_build/suggestions.mjs`, and that file is present in no commit on any branch (checked `git ls-tree origin/main` and `git log --all`). The generated editorial pages themselves are committed and pass the editorial gate (R11–R15), and CI never runs this script, so the live site is unaffected — but the generator is currently unrunnable, meaning the editorial surfaces cannot be regenerated as-is.',
    evidence: [
      'node _build/build-editorial.mjs → Error [ERR_MODULE_NOT_FOUND]: Cannot find module \'/home/user/WinB/_build/suggestions.mjs\' imported from /home/user/WinB/_build/build-editorial.mjs',
      'git ls-tree origin/main _build/ shows 12 modules; suggestions.mjs is not among them.',
      'git log --oneline --all -- _build/suggestions.mjs returns nothing — the module was never committed.',
    ],
    sources: [],
    action:
      'The session that owns _build/build-editorial.mjs should either commit the missing module or repoint the import at the module that replaced it (the decision-queue/editorial data now lives in _build/data.mjs SUGGESTIONS and _build/decision-queue.mjs). Until then, do not edit the editorial surfaces by hand. Nothing on the live site depends on re-running this script.',
    blocks: 'Regeneration of the editorial surfaces only. Not publication.',
  },
];

// ---------------------------------------------------------------------------
// Open questions. `status` is Answered / Open / Blocked.
// ---------------------------------------------------------------------------
export const QUESTIONS = [
  {
    id: 'Q-01',
    status: 'Blocked',
    question: 'Did the five supplied short links come out of the shopnow047c-20 Associates account?',
    why: 'It decides whether referrals are credited at all. The observed targets carry no tag parameter.',
    known: 'All five resolve to live listings. None of the resolved URLs carries tag=shopnow047c-20.',
    unknown: 'Whether Amazon applies the account tag at click time for links minted inside the dashboard.',
    howToFind: 'Generate one short link inside Associates Central while signed in, resolve it, and compare its parameters with the supplied set. Five minutes in the dashboard settles it.',
    owner: 'Site owner',
    blocks: 'FLG-001',
  },
  {
    id: 'Q-02',
    status: 'Open',
    question: 'Which channel is expected to produce the first 100 sessions?',
    why: 'A new project site with no domain authority will not rank for competitive head terms in its first month. The first-traction plan should name a realistic channel rather than assuming search.',
    known: 'No analytics are live, so current traffic is unmeasured (FLG-007).',
    unknown: 'Any existing audience the owner already has: a list, a social following, a community.',
    howToFind: 'Owner inventories channels they can reach today. If the answer is “none”, the plan should be paid-or-pinned distribution and long-tail queries, not a head-term bet.',
    owner: 'Site owner',
    blocks: 'Publishing cadence',
  },
  {
    id: 'Q-03',
    status: 'Open',
    question: 'Is a review unit obtainable for any of the five products?',
    why: 'Hands-on content is the single biggest differentiator available, and the current pages are legally barred from pretending to it (FLG-004).',
    known: 'No unit is held. The listing data is thorough enough for specification content only.',
    unknown: 'Whether any brand will supply a unit to a project with no traffic history.',
    howToFind: 'Ask the two brands directly. If the answer is no, buy the cheapest unit and document the purchase — a disclosed bought-and-tested unit is still a test.',
    owner: 'Site owner',
    blocks: 'Differentiation',
  },
  {
    id: 'Q-04',
    status: 'Open',
    question: 'Which mailing provider will receive captured addresses?',
    why: 'The capture form currently collects nothing usable (FLG-008). A form that silently discards input is worse than no form.',
    known: 'The form fires a capture_intent event and does not transmit an address.',
    unknown: 'Provider, consent language, and the lawful basis for storage.',
    howToFind: 'Pick a provider with a documented EU/US data story, then wire ENDPOINT and consent copy in one change.',
    owner: 'Site owner',
    blocks: 'Audience building',
  },
  {
    id: 'Q-05',
    status: 'Open',
    question: 'Who owns the site — a person or a desk?',
    why: 'Google’s site-reputation policy explicitly weighs “stated or implied authorship”, and an unauthored affiliate page with no commercial disclaimer is the example it gives of content likely to attract action.',
    known: 'Pages currently sign as “The Counterwise desk” with a stated non-testing policy.',
    unknown: 'Whether the owner wants to publish a real byline and take editorial responsibility publicly.',
    howToFind: 'Owner decision. A named author with a two-line biography is cheap and materially improves both trust and policy posture.',
    owner: 'Site owner',
    blocks: 'Editorial identity',
  },
  {
    id: 'Q-06',
    status: 'Open',
    question: 'Will the site move to a custom domain?',
    why: 'A github.io subpath is a fine host but a weak brand home; it also makes Search Console property setup and cookie scope awkward.',
    known: 'Current origin is a GitHub Pages project path.',
    unknown: 'Whether a domain will be bought, and who controls DNS.',
    howToFind: 'Owner decision, then a CNAME file and a Search Console domain property.',
    owner: 'Site owner',
    blocks: 'Search Console, brand',
  },
  {
    id: 'Q-07',
    status: 'Open',
    question: 'What is the contact route for corrections?',
    why: 'A publication without a contact route cannot be corrected, and reviewers notice.',
    known: 'No email address is published. The repository issue tracker is the only route.',
    unknown: 'Whether the owner wants a public address.',
    howToFind: 'Create one and publish it, or formalise the issue tracker as the route.',
    owner: 'Site owner',
    blocks: 'Trust',
  },
  {
    id: 'Q-08',
    status: 'Answered',
    question: 'Can prices and star ratings be displayed on a static affiliate page?',
    why: 'It determines whether comparison tables can carry prices at all.',
    known: 'No — not without Amazon serving the link or Creators API / PA API data. The site therefore shows no prices or ratings.',
    unknown: '—',
    howToFind: 'Answered from Participation Requirements §2(b).',
    owner: '—',
    blocks: 'Nothing. Decided and implemented.',
    sources: ['A2'],
  },
  {
    id: 'Q-09',
    status: 'Answered',
    question: 'What disclosure wording must appear?',
    why: 'It is a material-breach risk, not a courtesy.',
    known:
      'Operating Agreement §5 specifies “As an Amazon Associate I earn from qualifying purchases.” The site carries it under the masthead on every page and again in the footer.',
    unknown: '—',
    howToFind: 'Answered from the Operating Agreement.',
    owner: '—',
    blocks: 'Nothing. Implemented.',
    sources: ['A1'],
  },
  {
    id: 'Q-10',
    status: 'Answered',
    question: 'How should outbound product links be marked for search engines?',
    why: 'Unqualified paid links breach Google’s link-spam policy; the fix is a one-attribute change.',
    known: 'rel="sponsored" for advertisements and paid placements. This site uses rel="sponsored nofollow noopener" on every Amazon link.',
    unknown: '—',
    howToFind: 'Answered from Google Search Central.',
    owner: '—',
    blocks: 'Nothing. Implemented.',
    sources: ['G1'],
  },
  {
    id: 'Q-11',
    status: 'Open',
    question: 'Which seasonal moments should the notebook cover first?',
    why: 'Seasonal framing helps a reader find the guide that matches the meal in front of them, but picking the wrong season first wastes the cadence.',
    known: 'Four cooking moments are drafted as editorial hypotheses (weeknight two-food dinners, big-batch sharing, holiday roasts and leftovers, summer grilling). None is a claim about search volume or popularity.',
    unknown: 'Which moment the owner’s audience actually cooks, and in which hemisphere the site is read.',
    howToFind: 'Owner picks one moment for the next guide, or waits for 30 days of page_view data (SUG-03) and lets measured queries choose. Do not publish all four at once.',
    owner: 'Site owner',
    blocks: 'Seasonal publishing order',
  },
  {
    id: 'Q-12',
    status: 'Open',
    question: 'What may the AI pipeline do, and what must a human approve?',
    why: 'The brief asks for an AI-powered platform that automates research, content and optimisation. Automation without a gate is how a site publishes an unverified price or a hands-on claim it cannot support.',
    known: 'The build already automates sitemap, feed, link checks and the R1–R10 compliance gate. No AI step writes product facts; every spec comes from the listing record.',
    unknown: 'Whether the owner wants AI drafting of guide prose, and under what review rule.',
    howToFind: 'Owner approves the automation table in the Data Room: automated steps stay automated, editorial and compliance steps stay human-gated. Any AI draft is treated as a suggestion until a human checks it against a source.',
    owner: 'Site owner',
    blocks: 'AI scope',
  },
  {
    id: 'Q-13',
    status: 'Open',
    question: 'Stay on github.io or move to a custom domain?',
    why: 'A project path is a fine host but a weak brand home, and Search Console domain properties are awkward on a subpath.',
    known: 'Current origin is https://sassnarep3-star.github.io/WinB/ (Pages legacy build, main branch, path /).',
    unknown: 'Domain budget, DNS control, and whether brand matters enough to pay for it.',
    howToFind: 'Owner decision. If yes, add a CNAME file, set up a domain property in Search Console, and keep the github.io URLs as redirects.',
    owner: 'Site owner',
    blocks: 'Brand, Search Console',
  },
  {
    id: 'Q-14',
    status: 'Open',
    question: 'Which product images may be shown?',
    why: 'Readers expect photography, but Amazon’s IP License forbids storing or caching Product Advertising Content images. A static site is a cache.',
    known: 'The site uses generated editorial illustrations and states so. No Amazon product photography is stored.',
    unknown: 'Whether any brand will license its own photography for this site.',
    howToFind: 'Ask the two brands for licensed images. Until then, keep generated illustrations and label them. Do not scrape listing images.',
    owner: 'Site owner',
    blocks: 'Imagery',
  },
  {
    id: 'Q-15',
    status: 'Blocked',
    question: 'Are the five defined events actually reaching an endpoint?',
    why: 'The click counter and event recorder run in the reader’s browser and store nothing server-side. An unmeasured event is indistinguishable from a broken one.',
    known: 'The five events (page_view, outbound_click, comparison_open, guide_read, capture_intent) are defined and fire locally. The campaign ledger is empty by design and has a schema (Data Room).',
    unknown: 'Whether any event has ever arrived anywhere. No endpoint is deployed (FLG-007).',
    howToFind: 'Deploy the collector (SUG-03), send one deliberate test event of each type, and confirm five rows arrive before trusting any number. Then let the first 30 days run as a baseline.',
    owner: 'Site owner',
    blocks: 'The campaign ledger; every future measurement claim',
  },
];

// ---------------------------------------------------------------------------
// Suggestions: the reviewable decision list.
// Each has a recommendation, an effort, a payoff and a risk. Each is now also a
// proposal with named options: nothing is implemented until an option is chosen
// and the choice is recorded. Nothing is marked "implemented" unless it is in
// this build. Rendered on the Suggestion Board (/suggestions/).
// ---------------------------------------------------------------------------
export const SUGGESTIONS = [
  {
    id: 'SUG-01',
    priority: 1,
    title: 'Buy and document one review unit',
    recommendation: 'Start with the cheapest of the five. Buy it, photograph the unboxing, publish the receipt.',
    why: 'Every page currently says “we have not handled this”. One disclosed bought-and-tested unit converts the whole site from specification summary to review, which is the only durable defence against both Google’s thin-affiliation problem and reader distrust.',
    effort: 'Cost of one unit, 2–3 days',
    payoff: 'Highest of anything on this page',
    risk: 'A single unit does not generalise. Do not let it become “we tested everything”.',
    status: 'Not started',
    options: [
      { letter: 'A', title: 'Buy the cheapest unit outright and document it', what: 'Purchase one unit with the site’s own money, photograph the unboxing, publish the receipt, and write the first hands-on page under the existing attribution rules.', effort: 'One unit’s cost, 2–3 days', payoff: 'Converts one product page from specification summary to a disclosed bought-and-tested review', risk: 'Cost; the scope must stay one unit' },
      { letter: 'B', title: 'Request review units from the two brands first', what: 'Ask Chefman and ThermoMaven/CHEF iQ for a review unit before spending anything.', effort: 'Emails, then weeks of waiting', payoff: 'No purchase cost if granted', risk: 'A project with no traffic history will probably be refused; a supplied unit must be disclosed and can read as obligation' },
      { letter: 'C', title: 'Stay specification-only', what: 'Keep the current framing permanently and say so on every page.', effort: 'None', payoff: 'None added', risk: 'The site stays legally barred from experience claims (FLG-004) and loses its only strong differentiator' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'It is the only option entirely inside this project’s control, and a disclosed bought-and-tested unit is a test regardless of who paid.',
    decisionState: 'Awaiting owner decision',
    decisionHow: 'Choose A, B or C and record it (chat reply or repository issue, e.g. “SUG-01: A”). Until a choice is recorded, nothing here is implemented.',
  },
  {
    id: 'SUG-02',
    priority: 1,
    title: 'Close the tagging question before writing anything else',
    recommendation: 'Open Associates Central, mint one link with the tag, resolve it, and compare with the supplied short links.',
    why: 'If the supplied links do not credit the account, every article published between now and then earns nothing. This is the cheapest possible check with the largest possible downside.',
    effort: 'Under an hour',
    payoff: 'Protects all future revenue',
    risk: 'None.',
    status: 'Needs owner access',
    options: [
      { letter: 'A', title: 'Mint and compare, inside Associates Central', what: 'Generate one short link while signed in to shopnow047c-20, resolve it, and compare its parameters with the five supplied links.', effort: 'Under an hour', payoff: 'Closes FLG-001 and Q-01 with a direct check', risk: 'None' },
      { letter: 'B', title: 'Ask Amazon support whether link.amazon applies the account tag', what: 'Open a support ticket and ask for a written answer on short-link attribution.', effort: 'A ticket, then days', payoff: 'A written answer on record', risk: 'Slow; first-line support often replies with scripts' },
      { letter: 'C', title: 'Leave the question open and rely on tagged canonical links', what: 'Keep publishing only with tag=shopnow047c-20 links and stop investigating the short links.', effort: 'None', payoff: 'None', risk: 'Attribution uncertainty remains; FLG-001 stays open' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'The cheapest possible check with the largest possible downside; B is the fallback if the dashboard comparison is ambiguous.',
    decisionState: 'Awaiting owner decision (needs account access)',
    decisionHow: 'Choose A, B or C and record it (e.g. “SUG-02: A”). Option A needs five minutes of Associates Central access.',
  },
  {
    id: 'SUG-03',
    priority: 2,
    title: 'Deploy the analytics collector and let it run for 30 days',
    recommendation: 'Deploy the supplied worker, set one endpoint, and treat the first 30 days as a baseline rather than a scoreboard.',
    why: 'Without measurement the next topic is chosen by instinct — the exact failure mode this project set out to avoid. Thirty days of page_view plus outbound_click is enough to rank the existing guides honestly.',
    effort: 'Half a day, then nothing',
    payoff: 'Turns topic choice into a data question',
    risk: 'Small samples mislead. Do not compute a conversion rate from 12 clicks.',
    status: 'Source shipped, not deployed',
    options: [
      { letter: 'A', title: 'Deploy the supplied Cloudflare Worker collector', what: 'Deploy /analytics/collector-worker.js, set ENDPOINT in assets/js/site.js, and confirm one event of each of the five types arrives.', effort: 'Half a day, then nothing', payoff: 'First-party events under this project’s control; the campaign ledger can be filled from authorised reports alongside it', risk: 'Small samples mislead; the first 30 days are a baseline, not a scoreboard' },
      { letter: 'B', title: 'Use a hosted privacy-first analytics service', what: 'Add a compliant third-party snippet instead of self-hosting.', effort: 'An account and one snippet', payoff: 'Instant dashboards', risk: 'Adds a third-party processor; the disclosure and cookie policy must change (A2 §3(e))' },
      { letter: 'C', title: 'Stay unmeasured', what: 'Ship nothing until traffic exists.', effort: 'None', payoff: 'None', risk: 'Every future topic is chosen by instinct — the exact failure mode this project set out to avoid' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'It records the five defined events without identifying anyone and without a third-party processor.',
    decisionState: 'Awaiting owner decision (needs hosting account access)',
    decisionHow: 'Choose A, B or C and record it (e.g. “SUG-03: A”). Option A needs a Cloudflare account; the worker source is already in the repository.',
  },
  {
    id: 'SUG-04',
    priority: 2,
    title: 'Write the capacity guide as the flagship, with real measuring instructions',
    recommendation: 'Give readers a method for measuring their own basket, shelf and counter, rather than a table of quarts they can get from the listing.',
    why: 'It is the one topic where this desk can genuinely be more useful than a product page: arithmetic and a tape measure. Quarts are a marketing unit; food is a physical object.',
    effort: '1–2 days',
    payoff: 'Earns links; a real answer to a real query',
    risk: 'The tone must stay practical. A framework with no numbers of its own is still thin.',
    status: 'Draft published, needs a measurement worksheet',
    options: [
      { letter: 'A', title: 'Add a printable measurement worksheet to the published guide', what: 'Extend the capacity guide with a one-page worksheet: basket, shelf and counter measurements the reader takes at home.', effort: '1–2 days', payoff: 'Turns the guide into a tool readers can act on', risk: 'The tone must stay practical' },
      { letter: 'B', title: 'Publish the worksheet as a separate download', what: 'Same worksheet, offered as a PDF behind the (currently non-transmitting) capture form.', effort: 'Same, plus asset work', payoff: 'A concrete reason to hand over an address once capture works', risk: 'A PDF orphan that search engines read poorly; blocked on Q-04' },
      { letter: 'C', title: 'Leave the guide as it is', what: 'No change.', effort: 'None', payoff: 'None', risk: 'The guide stays a framework with no numbers of its own' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Inline on the page it helps every reader and every crawler; a download helps only the ones who convert first.',
    decisionState: 'Awaiting owner decision',
    decisionHow: 'Choose A, B or C and record it (e.g. “SUG-04: A”).',
  },
  {
    id: 'SUG-05',
    priority: 3,
    title: 'Add a comparison table that refuses to guess on price',
    recommendation: 'Compare on the things that are stable and knowable: baskets, format, window, stated capacity, app dependency. Send the reader to Amazon for price.',
    why: 'Price changes hourly and cannot legally be printed here. A table that explains *why* it has no price column builds more trust than one that shows a stale number.',
    effort: 'Done in this build',
    payoff: 'Immediate',
    risk: 'None, as long as the no-price rule is not quietly broken later.',
    status: 'Implemented',
    options: [
      { letter: 'A', title: 'Compare without price and explain the blanks', what: 'A table of stable, knowable fields, with the reason the price column is empty printed underneath. — CHOSEN', effort: 'Done in this build', payoff: 'Immediate; the explanation builds more trust than a stale number', risk: 'None while the no-price rule holds' },
      { letter: 'B', title: 'Show live prices through Creators API / PA API', what: 'Apply for API access and render prices server-side under the licence.', effort: 'API application plus server rendering', payoff: 'True price comparison', risk: 'Licence conditions, staleness rules, and a static site would need a rendering pipeline' },
      { letter: 'C', title: 'Price-free table with no explanation', what: 'Same table, without naming why price is missing.', effort: 'Lower', payoff: 'Weak', risk: 'Readers assume an error, not a rule' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Permitted today with no licence dependency; the deliberate blank is itself the trust signal.',
    decisionState: 'Decided · implemented in this build',
    decisionHow: 'Decision recorded 2026-11-20. Option B remains open as a future upgrade if API access is obtained (FLG-005).',
  },
  {
    id: 'SUG-06',
    priority: 3,
    title: 'Publish on a fixed cadence and stop',
    recommendation: 'One substantial guide every two weeks, announced in the feed, added to the sitemap automatically. Not daily, not whenever inspiration arrives.',
    why: 'Google treats a burst of near-identical pages as scaled content abuse. A slow, steady, original cadence reads as a publication; a 40-page month reads as a content farm. The build already regenerates the sitemap and feed, so cadence costs nothing but writing.',
    effort: 'Ongoing',
    payoff: 'Compounding',
    risk: 'Miss two cycles and the site looks abandoned. Two weeks is achievable; daily is not.',
    status: 'Proposed',
    options: [
      { letter: 'A', title: 'One substantial guide every two weeks', what: 'A fixed fortnightly cadence, announced in the feed and added to the sitemap by the build.', effort: 'Ongoing, predictable', payoff: 'Compounding; reads as a publication', risk: 'Miss two cycles and the site looks abandoned' },
      { letter: 'B', title: 'Weekly short post plus a fortnightly guide', what: 'Short items between the big pieces.', effort: 'Higher', payoff: 'More freshness signals', risk: 'Short posts read thin and invite the scaled-content pattern' },
      { letter: 'C', title: 'Publish in bursts whenever material is ready', what: 'No fixed rhythm.', effort: 'Irregular', payoff: 'None', risk: 'A burst of near-identical pages is the pattern Google names as scaled content abuse' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Two weeks is achievable and sustainable; the build already handles the sitemap and feed, so cadence costs only writing.',
    decisionState: 'Awaiting owner decision',
    decisionHow: 'Choose A, B or C and record it (e.g. “SUG-06: A”). Topic choice should follow measured queries once SUG-03 is live (Q-11).',
  },
  {
    id: 'SUG-07',
    priority: 3,
    title: 'Answer one real question per week from the contact inbox, in public',
    recommendation: 'Turn the best reader question each week into a short post, credited to the asker.',
    why: 'Reader questions are free, uncompetable keyword research. They also prove a human is here.',
    effort: 'Low',
    payoff: 'Medium, compounding',
    risk: 'Requires a real contact route (Q-07) and a reply discipline.',
    status: 'Blocked on Q-07',
    options: [
      { letter: 'A', title: 'One reader question answered in public each week', what: 'Turn the best question each week into a short post, credited to the asker with their consent.', effort: 'Low, plus reply discipline', payoff: 'Free, uncompetable keyword research and visible proof a human is here', risk: 'Blocked until Q-07 gives the site a contact route' },
      { letter: 'B', title: 'A monthly question roundup', what: 'Answer several questions in one monthly post.', effort: 'Lower', payoff: 'Slower', risk: 'Less timely; individual queries get no dedicated page' },
      { letter: 'C', title: 'Keep reader questions private', what: 'No public answers.', effort: 'None', payoff: 'None', risk: 'The cheapest content source available goes unused' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Reader questions are keyword research nobody else can copy — but only a real contact route (Q-07) can supply them.',
    decisionState: 'Awaiting owner decision (blocked on Q-07)',
    decisionHow: 'Choose A, B or C and record it (e.g. “SUG-07: A”), and settle Q-07 first.',
  },
  {
    id: 'SUG-08',
    priority: 4,
    title: 'Do not add categories until one category converts',
    recommendation: 'Resist expanding to coffee, sous vide, blenders. Five products in two closely-related categories is a coherent shop; twelve scattered products is a directory.',
    why: 'Topical coherence is the cheapest authority a new site can accumulate. Every new category halves the depth available to the existing ones.',
    effort: 'Restraint',
    payoff: 'Protects the whole site',
    risk: 'Feels slow. It is slow.',
    status: 'Standing recommendation',
    options: [
      { letter: 'A', title: 'Stay in two categories until one converts', what: 'No new categories; deepen air fryers and thermometers until the ledger shows real orders. — ADOPTED', effort: 'Restraint', payoff: 'Protects the topical coherence the site has', risk: 'Feels slow' },
      { letter: 'B', title: 'Add one adjacent category now', what: 'Expand into a neighbouring niche while keeping the register format.', effort: 'New register work and new guides', payoff: 'A wider net', risk: 'Halves the depth available to the existing categories' },
      { letter: 'C', title: 'Expand broadly', what: 'Add several categories at once.', effort: 'High', payoff: 'Uncertain', risk: 'A scattered directory is the pattern Google’s site-reputation policy weighs against' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Topical coherence is the cheapest authority a new site can accumulate. Revisit when the campaign ledger records orders, not before.',
    decisionState: 'Decided · stands as policy',
    decisionHow: 'Adopted 2026-11-20 as a standing constraint. Reopen only with ledger evidence (see the Data Room).',
  },
  {
    id: 'SUG-09',
    priority: 2,
    title: 'Run the seasonal notebook as hypotheses, not as a content burst',
    recommendation: 'Frame the four cooking moments on the front page as editorial hypotheses. Publish at most one seasonal guide per fortnight, only after 30 days of measurement (SUG-03).',
    why: 'Seasonal framing matches the meal a reader is cooking tonight, which is the cheapest way to feel current without chasing popularity claims. Publishing four seasonal guides at once would be the scaled-content pattern Google names as abuse.',
    effort: 'One guide per fortnight',
    payoff: 'Timely without being thin',
    risk: 'Seasonal copy goes stale. Date every seasonal guide and retire it when the season passes.',
    status: 'Framing implemented; first seasonal guides published 2026-11-20 (owner-instructed)',
    options: [
      { letter: 'A', title: 'One moment at a time, in measured order', what: 'Publish a seasonal guide only as its moment comes up, and let measured queries (SUG-13) choose the order afterwards.', effort: 'One guide per fortnight', payoff: 'Seasonal relevance without a content burst', risk: 'Seasonal copy goes stale; date and retire each guide' },
      { letter: 'B', title: 'Publish the whole notebook at once', what: 'Fill every seasonal slot in one build.', effort: 'One burst', payoff: 'Full coverage immediately', risk: 'Near-identical seasonal pages published together are the scaled-content pattern this proposal exists to avoid' },
      { letter: 'C', title: 'Defer all seasonal content until 30 days of measurement', what: 'Keep the notebook as framing only.', effort: 'None', payoff: 'None', risk: 'Seasonal queries peak before the data arrives' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Recorded override (2026-11-20): the owner’s brief for this cycle explicitly instructed seasonal marketing content, so the winter hosting, smart-probe and crowd-math guides were published ahead of the measurement gate, one cluster at a time rather than as a burst. The gate still governs every topic after them.',
    decisionState: 'Partly decided · override recorded 2026-11-20',
    decisionHow: 'Choose A, B or C for everything after the 2026-11-20 batch (e.g. “SUG-09: A”). The override covers only the three guides named above.',
  },
  {
    id: 'SUG-10',
    priority: 3,
    title: 'Tighten the two clusters with cross-links',
    recommendation: 'Link every air-fryer guide to the air-fryer hub and every thermometer guide to the thermometer hub, and link the two hubs to each other and to the comparison table.',
    why: 'Clusters tell search engines what the site is about and tell readers where to go next. The build now does this on every product and guide page; the remaining work is to keep it true as guides are added.',
    effort: 'Done in this build; ongoing discipline',
    payoff: 'Compounding internal authority',
    risk: 'Over-linking reads as SEO. Link where a reader would actually click.',
    status: 'Implemented',
    options: [
      { letter: 'A', title: 'Cross-links on every guide and product page', what: 'Each page names its cluster and its neighbours, and both hubs link to the comparison table. — CHOSEN', effort: 'Done in this build', payoff: 'Compounding internal authority', risk: 'Over-linking if it stops being reader-first' },
      { letter: 'B', title: 'Hub-only structure', what: 'Categories link down, pages do not link across.', effort: 'Lower', payoff: 'Weaker', risk: 'Readers dead-end; crawlers see thin relationships' },
      { letter: 'C', title: 'No explicit structure', what: 'Leave links to chance.', effort: 'None', payoff: 'None', risk: 'The site reads as scattered pages, not as two topics' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Already implemented in this build; the option is recorded so the structure is a decision, not an accident.',
    decisionState: 'Decided · implemented in this build',
    decisionHow: 'Decision recorded 2026-11-20. Keep it true as new guides are added.',
  },
  {
    id: 'SUG-11',
    priority: 3,
    title: 'Publish a named byline and a dated byline block',
    recommendation: 'Add the author, the date and the reading time to every guide and product page, and a two-line biography on the About page. Owner to supply the name (Q-05).',
    why: 'Google’s site-reputation policy weighs stated authorship, and an unauthored affiliate page is its own example of content likely to attract action. A byline costs nothing and changes the policy posture.',
    effort: 'One owner decision, then template work (done)',
    payoff: 'Trust and policy posture',
    risk: 'A byline without accountability is decoration. The biography must state the non-testing position plainly.',
    status: 'Template implemented; name pending Q-05',
    options: [
      { letter: 'A', title: 'Named byline with a two-line biography', what: 'The owner supplies a name; every page carries it with the non-testing position stated plainly. — RECOMMENDED', effort: 'One owner decision', payoff: 'Trust and policy posture', risk: 'The name must be accountable — a pseudonym with no person behind it is decoration' },
      { letter: 'B', title: 'Keep the desk byline', what: 'Publish as “The Counterwise desk” with the stated non-testing policy.', effort: 'None', payoff: 'None added', risk: 'Google’s site-reputation policy weighs stated authorship; an unauthored affiliate page is its own example of content likely to attract action' },
      { letter: 'C', title: 'No byline at all', what: 'Remove authorship from the pages.', effort: 'Template change', payoff: 'None', risk: 'Worse than B on every axis' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'A named author with a two-line biography is cheap and materially improves both trust and policy posture.',
    decisionState: 'Awaiting owner decision (blocked on Q-05)',
    decisionHow: 'Choose A, B or C (e.g. “SUG-11: A”) and, for A, supply the name.',
  },
  {
    id: 'SUG-12',
    priority: 4,
    title: 'Keep generated illustrations until licensed photography exists',
    recommendation: 'Do not scrape or cache Amazon listing images. Ask the two brands for licensed photography (Q-14); until then, keep the generated illustrations and label them as editorial art.',
    why: 'The IP License forbids storing or caching Product Advertising Content images. A static site is a cache, so listing photography cannot be used here even if it looks better.',
    effort: 'One email per brand',
    payoff: 'Better imagery without a licence breach',
    risk: 'Generated art can look generic. Caption it honestly rather than passing it off as a photograph.',
    status: 'Standing rule',
    options: [
      { letter: 'A', title: 'Generated editorial illustrations, labelled, plus brand image requests', what: 'Keep the current art, label it as editorial illustration, and ask the two brands for licensed photography (Q-14). — ADOPTED', effort: 'One email per brand', payoff: 'Compliant imagery with an upgrade path', risk: 'Generated art can look generic; caption it honestly' },
      { letter: 'B', title: 'Use Amazon listing photography', what: 'Scrape or cache listing images.', effort: 'Low', payoff: 'Familiar product shots', risk: 'The IP License forbids storing or caching Product Advertising Content; a static site is a cache. Not an option under the agreement' },
      { letter: 'C', title: 'No imagery', what: 'Text and diagrams only.', effort: 'None', payoff: 'None', risk: 'A shop without pictures does not read as a shop' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'The only compliant option that still gives a reader something to look at, with a clear upgrade path.',
    decisionState: 'Decided · stands as policy',
    decisionHow: 'Adopted 2026-11-20. Reopen only when a brand licence arrives (Q-14).',
  },
  {
    id: 'SUG-13',
    priority: 2,
    title: 'Submit the sitemap and RSS feed, then read Search Console queries',
    recommendation: 'Submit sitemap.xml in Search Console, subscribe to the feed, and after 30 days choose the next topic from measured queries instead of instinct.',
    why: 'The build already generates both files from the same data as the pages, so a new guide cannot ship without being listed. Submission is the step that turns files into indexing.',
    effort: 'Under an hour, then waiting',
    payoff: 'The next topic is a data question',
    risk: 'Search Console needs a verification token only the owner can supply (FLG-008).',
    status: 'Files shipped; submission pending owner',
    options: [
      { letter: 'A', title: 'Submit the sitemap, then read queries for 30 days', what: 'Verify the site in Search Console, submit sitemap.xml and feed.xml, and choose every next topic from measured queries after a 30-day baseline. — RECOMMENDED', effort: 'Under an hour, then waiting', payoff: 'The next topic becomes a data question', risk: 'Needs the owner’s verification token' },
      { letter: 'B', title: 'Submit and publish without reading the data', what: 'Get indexed, keep writing on instinct.', effort: 'Under an hour', payoff: 'Indexing only', risk: 'Keeps topic choice a guess; the brief explicitly wants measured topics' },
      { letter: 'C', title: 'Skip Search Console', what: 'Wait for organic discovery.', effort: 'None', payoff: 'None', risk: 'No query data at all, ever; indexing happens without visibility' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'It is the step that turns shipped files into indexing — and indexing into evidence.',
    decisionState: 'Awaiting owner decision (needs Search Console token)',
    decisionHow: 'Choose A, B or C (e.g. “SUG-13: A”). Option A needs the owner’s verification token (FLG-008, Q-06/Q-13).',
  },
  {
    id: 'SUG-14',
    priority: 4,
    title: 'Gate every AI step behind the compliance check',
    recommendation: 'Automate research, drafting and scheduling, but never automate the compliance gate. The R1–R10 check runs on every build and fails the publish on any breach.',
    why: 'Automation is what makes this site scalable; the gate is what makes it trustworthy. Removing the gate to move faster would publish the exact failures the gate exists to catch.',
    effort: 'Standing rule',
    payoff: 'Scalable without being reckless',
    risk: 'A gate that is skipped once is a gate that no longer exists. CI enforces it.',
    status: 'Standing rule',
    options: [
      { letter: 'A', title: 'Automate research and drafting; human-gate compliance', what: 'Machine handles research, drafting and scheduling; the R1–R10 compliance gate and source checks stay in the publish path and fail the build on any breach. — ADOPTED', effort: 'Standing rule, enforced by CI', payoff: 'Scalable without being reckless', risk: 'A gate skipped once is a gate that no longer exists' },
      { letter: 'B', title: 'Fully automate, including compliance', what: 'Let the pipeline self-approve.', effort: 'Lower', payoff: 'Speed', risk: 'This is how a site publishes an unverified price or a hands-on claim it cannot support (Q-12)' },
      { letter: 'C', title: 'Manual everything', what: 'No automation at all.', effort: 'High, ongoing', payoff: 'Control', risk: 'Does not scale; the brief asks for an automated platform' },
    ],
    recommendedOption: 'A',
    recommendedWhy: 'Automation is what makes this site scalable; the gate is what makes it trustworthy. Q-12 records the same split.',
    decisionState: 'Decided · stands as policy',
    decisionHow: 'Adopted 2026-11-20. Any AI-drafted copy is a suggestion until a human checks it against a source (Q-12).',
  },
];

// ---------------------------------------------------------------------------
// Seasonal notebook: editorial hypotheses, not popularity claims.
// Each moment reframes existing guides and products by the meal being cooked.
// No search-volume, popularity or sales claim is made anywhere.
// ---------------------------------------------------------------------------
export const MOMENTS = [
  {
    id: 'weeknight-two-food',
    season: 'All year',
    title: 'Weeknight, two foods at once',
    question: 'Protein in one basket, vegetables in the other — what should you compare?',
    body: 'The dual-basket question. Two foods, two temperatures, one finish time. Start with the format guide, then check whether your single layer fits in 3 qt.',
    guides: ['basket-or-oven', 'capacity-checklist'],
    products: ['P01'],
    note: 'Hypothesis: the most common weeknight shape. Not a popularity claim.',
  },
  {
    id: 'big-batch-sharing',
    season: 'All year',
    title: 'Big batch for sharing',
    question: 'One tray of fries or wings, not two small ones — one basket or two?',
    body: 'The single-basket question. When splitting a batch across two baskets is a nuisance, capacity in one cavity matters more than a second basket.',
    guides: ['capacity-checklist', 'cleanup-counter', 'crowd-capacity-math'],
    products: ['P03'],
    note: 'Hypothesis: game-day and family-batch shape. Not a popularity claim.',
  },
  {
    id: 'holiday-roast',
    season: 'Winter',
    title: 'Holiday roasts and leftovers',
    question: 'A whole bird, a rest, and a safe leftover — which thermometer job is this?',
    body: 'The long-cook question. A leave-in probe watches the climb and the rest; an instant-read checks the number. The USDA minimums and the rest time decide which tool earns its drawer.',
    guides: ['temperature-safety', 'multifunction', 'smart-probe-questions', 'holiday-format-check'],
    products: ['P02', 'P05'],
    note: 'Hypothesis: winter roast shape. Not a popularity claim.',
  },
  {
    id: 'summer-grilling',
    season: 'Summer',
    title: 'Summer grilling and smoking',
    question: 'Steaks, chicken and a long smoke — checking or watching?',
    body: 'The outdoor question. Instant-read for a fast number at the grill, leave-in for a smoke you do not want to stand over. Both jobs, two tools.',
    guides: ['temperature-safety', 'smart-probe-questions'],
    products: ['P04', 'P05'],
    note: 'Hypothesis: summer outdoor shape. Not a popularity claim.',
  },
];

// ---------------------------------------------------------------------------
// Topic queue: working titles only. Nothing here is published until the
// measurement gate (SUG-03) has run and the owner has chosen one title.
// ---------------------------------------------------------------------------
export const TOPIC_QUEUE = [
  {
    title: 'Game-day wings: one big basket or two small ones?',
    cluster: 'Air fryers',
    gate: 'Published 2026-11-20 as game-day-wings by the parallel S15 pass, ahead of this queue’s measurement gate. The override is recorded rather than reversed; the open question is now whether measured queries justify keeping it.',
    status: 'Published — gate recorded as overridden',
  },
  {
    title: 'Holiday roast thermometer: instant-read or leave-in?',
    cluster: 'Thermometers',
    gate: 'Published 2026-11-20 as holiday-roast-thermometer by the parallel S15 pass, ahead of this queue’s measurement gate. Override recorded; review against measured traffic before writing the next thermometer piece.',
    status: 'Published — gate recorded as overridden',
  },
  {
    title: 'Air-fryer leftovers: what reheats safely?',
    cluster: 'Air fryers + safety',
    gate: 'Published 2026-11-20 as air-fryer-leftovers by the parallel S15 pass, ahead of this queue’s measurement gate. Override recorded; the USDA table still needs the reader data the gate asked for.',
    status: 'Published — gate recorded as overridden',
  },
  {
    title: 'How to assess cleanup and counter-space trade-offs',
    cluster: 'Air fryers',
    gate: 'Already published as cleanup-counter. Next step is a measurement worksheet, not a second article.',
    status: 'Published — worksheet pending (SUG-04)',
  },
  {
    title: 'Questions to ask before buying a multi-function kitchen appliance',
    cluster: 'Air fryers',
    gate: 'Already published as multifunction. Next step is measured queries, not a rewrite.',
    status: 'Published — measured queries pending',
  },
  {
    title: 'A no-hype checklist for comparing air fryer capacity',
    cluster: 'Air fryers',
    gate: 'Already published as capacity-checklist. Next step is a printable worksheet with the five-minute check.',
    status: 'Published — worksheet pending (SUG-04)',
  },
  {
    title: 'Holiday hosting: does the pan fit before you plan the menu?',
    cluster: 'Air fryers',
    gate: 'Published 2026-11-20 as holiday-format-check on an owner instruction that overrode this queue’s “do not publish yet” gate. Recorded in SUG-09; the override covers the three winter guides only.',
    status: 'Published — winter batch (override recorded)',
  },
  {
    title: 'What to ask before buying a probe thermometer',
    cluster: 'Thermometers',
    gate: 'Published 2026-11-20 as smart-probe-questions in the same owner-instructed winter batch (SUG-09).',
    status: 'Published — winter batch (override recorded)',
  },
  {
    title: 'How much air fryer capacity a crowd actually needs',
    cluster: 'Air fryers',
    gate: 'Published 2026-11-20 as crowd-capacity-math in the same owner-instructed winter batch (SUG-09).',
    status: 'Published — winter batch (override recorded)',
  },
];

// ---------------------------------------------------------------------------
// Three coherent paths. The owner chooses one before anything is implemented.
// ---------------------------------------------------------------------------
export const PATHS = [
  {
    id: 'A',
    name: 'Path A — Compliance-first shop',
    promise: 'The safest shop. Products first, guides second, measurement last.',
    steps: 'Close FLG-001 (tagging), keep the no-price rule, publish on the fortnightly cadence, and defer any further seasonal guides until measured (the 2026-11-20 winter batch is the recorded exception).',
    cost: 'Slowest growth. The site stays a specification shop until a review unit is bought (SUG-01).',
    bestIf: 'The owner wants zero policy risk and is happy to grow slowly.',
  },
  {
    id: 'B',
    name: 'Path B — Publication-first authority',
    promise: 'The most readable site. Byline, clusters, seasonal notebook and worksheets first.',
    steps: 'Name the byline (Q-05), publish the capacity worksheet (SUG-04), run the seasonal notebook one guide at a time (SUG-09), keep the gate on every build.',
    cost: 'More writing before more revenue. Still needs SUG-01 for hands-on content.',
    bestIf: 'The owner wants a site that reads as a publication and earns links.',
  },
  {
    id: 'C',
    name: 'Path C — Measurement-first growth',
    promise: 'The most data-driven site. Endpoint, Search Console and ledger first.',
    steps: 'Deploy the collector (SUG-03), submit the sitemap (SUG-13), choose every next topic from measured queries, keep the ledger empty until a first-party report exists.',
    cost: 'Nothing to read until the endpoint is deployed. The shop stays as it is for 30 days.',
    bestIf: 'The owner wants every future decision to be a data question.',
  },
];

// ---------------------------------------------------------------------------
// Information gaps — what this project HAS, what it DOES NOT HAVE, and the
// cheapest way to discover each missing item. The user-facing rule: no decision
// is made on a gap. Each row names the decision it blocks.
// ---------------------------------------------------------------------------
export const GAPS = [
  {
    id: 'GAP-01',
    item: 'Whether the supplied short links credit the shopnow047c-20 account',
    have: 'No',
    detail: 'All five resolved listings carry tracking parameters but no tag= (FLG-001). Compliance status of link.amazon itself is unresolved either way (FLG-003).',
    discover: 'One check in Associates Central: mint one link while signed in, resolve it, compare parameters. Under an hour (Q-01).',
    blocks: 'Revenue attribution; the tagging question in SUG-02.',
  },
  {
    id: 'GAP-02',
    item: 'The intended ASIN for each product',
    have: 'No',
    detail: 'The owner never stated which listing each short link was meant to point at. The observed ASINs are recorded in a separate field and never merged (FLG-002).',
    discover: 'Owner confirms each row in the Data Room product-intent record, or confirms the observed ASIN is the intended one.',
    blocks: 'Closing FLG-001/FLG-002 cleanly.',
  },
  {
    id: 'GAP-03',
    item: 'Any traffic, click or conversion figure',
    have: 'No',
    detail: 'No analytics endpoint is deployed; the collector ships with the site but nothing receives it (FLG-007). The ledger is empty by design.',
    discover: 'Deploy the collector (SUG-03), confirm one event arrives, then run 30 days before ranking anything.',
    blocks: 'Topic selection, cadence gates, every measurement claim.',
  },
  {
    id: 'GAP-04',
    item: 'Current commission rates for these two categories',
    have: 'No',
    detail: 'Amazon publishes commission rates in Associates Central; they vary by category and change over time. No rate is printed on this site because none has been read from an authorised report.',
    discover: 'Owner reads the commission income statement in Associates Central and records the rate and read date in the ledger provenance column.',
    blocks: 'Revenue modelling. Deliberately absent until a dated first-party source exists.',
  },
  {
    id: 'GAP-05',
    item: 'Hands-on experience with any of the five products',
    have: 'No',
    detail: 'No unit has been handled, so FTC guidance bars experience claims (FLG-004). Every page states the specification-judgement position.',
    discover: 'Buy the cheapest unit and document the purchase, or ask the brands for a review unit (Q-03, SUG-01).',
    blocks: 'Review-style content; the single biggest differentiation available.',
  },
  {
    id: 'GAP-06',
    item: 'Footprints, wattages and other unstated specifications',
    have: 'No',
    detail: 'The five listing titles do not state external dimensions or wattage in the data this desk could read. Those cells are blank, not estimated.',
    discover: 'Read the manufacturer manuals or spec sheets; record values with a per-model source before any table cell is filled.',
    blocks: 'The blank comparison cells. They stay blank until then.',
  },
  {
    id: 'GAP-07',
    item: 'Whether the NIST/NSF certification claim (P04) is documented',
    have: 'No',
    detail: 'The claim appears in the listing title only. No certificate has been located (FLG-006).',
    discover: 'Request the certificate from the brand, or keep the claim attributed. Attribution is the safe default and is what the site does.',
    blocks: 'Upgrading the claim from attributed to verified.',
  },
  {
    id: 'GAP-08',
    item: 'Search Console data (queries, impressions)',
    have: 'No',
    detail: 'Verification needs a token only the owner can place (FLG-008). Until then, topic gates run on site-side events alone.',
    discover: 'Owner verifies the github.io property, submits sitemap.xml, and grants the desk read access or screenshots.',
    blocks: 'Measured query choice for the topic queue.',
  },
  {
    id: 'GAP-09',
    item: 'The owner’s existing audience (list, social, community)',
    have: 'No',
    detail: 'Nothing in the supplied material describes any channel the owner can already reach (Q-02).',
    discover: 'Owner inventory of reachable channels; if none, plan for long-tail search plus one distribution channel.',
    blocks: 'The first-traction plan.',
  },
  {
    id: 'GAP-10',
    item: 'A named author and a contact route',
    have: 'Partly',
    detail: 'Pages sign as “The Counterwise desk” with a stated non-testing policy, but no human byline or public email exists (Q-05, Q-07).',
    discover: 'Owner decision: publish a named byline and one public contact address, or formalise the issue tracker as the route.',
    blocks: 'Authorship trust signals; the reader-question suggestion (SUG-07).',
  },
];

// ---------------------------------------------------------------------------
// Verification log — dated record of re-verification attempts made by later
// sessions against the original records. Every row states the method used and
// what was NOT copied. Append-only; never edit a past row.
// ---------------------------------------------------------------------------
export const VERIFICATION_LOG = [
  {
    date: '2026-11-20',
    who: 'arena-b36a7b54',
    item: 'All five Amazon listings (P01–P05), canonical /dp/ URLs',
    method: 'Each listing URL fetched live and read with the platform page reader; title and category path compared against the recorded register.',
    result: 'PASS — all five live; titles match the recorded listing titles word for word; category paths match. Prices and ratings visible on the pages were deliberately not copied into this site (R3).',
    link: 'https://www.amazon.com/dp/B0CDY277D3',
  },
  {
    date: '2026-11-20',
    who: 'arena-b36a7b54',
    item: 'USDA FSIS “Food Thermometers” factsheet (new source U2)',
    method: 'Fetched live and read; the ice-water and boiling-water calibration methods quoted on the new guide are the agency’s own wording.',
    result: 'PASS — page live at the canonical food-thermometers URL; the kitchen-thermometers URL redirects there. Quoted steps: ice-water 32°F, boiling 212°F at sea level, high-altitude caveat, care instructions.',
    link: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers',
  },
  {
    date: '2026-11-20',
    who: 'arena-e8af4464',
    item: 'Official policy sources (A1, A2, F1, F2, G1, G2, G3, G4, U1)',
    method: 'Re-fetched live per the S10 record in this board.',
    result: 'PASS per S10 — recorded quotes confirmed. Amazon listings were not re-fetched in that session (recorded honestly there; re-done here, row 1).',
    link: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers',
  },
];

// ---------------------------------------------------------------------------
// Guides. `path` keeps the already-published URLs. New guides append below;
// the build adds each to the sitemap and feed automatically.
// ---------------------------------------------------------------------------
export const GUIDES = [
  {
    slug: 'basket-or-oven',
    card: "Drawer or door? The comparison that decides daily use before capacity ever matters.",
    path: 'guides/basket-or-oven.html',
    kicker: 'Format',
    title: 'Basket or oven-style air fryer: what should you compare?',
    summary:
      'Two machines, both called air fryers, doing different jobs. The comparison that matters is not capacity in quarts — it is how you get food in and out, and where the machine lives when you are not using it.',
    readingTime: '6 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Start with the motion, not the machine',
        p: [
          'A basket air fryer asks you to lift a drawer out, shake it, and put it back. An oven-style air fryer asks you to open a door, slide a rack or tray out, and put it back. That is the entire difference in daily use, and it is the difference most listings bury.',
          'If you cook loose things that need shaking — fries, chickpeas, wings — a basket is easier to shake and easier to wash. If you cook flat things that need turning — fish, toast, a tray of vegetables — a door and a rack are easier to work with.',
        ],
      },
      {
        h: 'The three measurements nobody publishes',
        p: [
          'Quarts describe the inside of a cavity in a way that rarely matches a portion of food. Before comparing any two machines, measure three things in your own kitchen: the height of the space under your upper cabinets, the depth of the counter from the wall to the front edge, and the internal width of your sink.',
          'The first two decide what you can own. The third decides what you can wash. A 26 qt oven is a fixture; a 6 qt drawer is a dish. That distinction will shape your cooking more than any preset count.',
        ],
      },
      {
        h: 'Where the two supplied units actually differ',
        p: [
          'The Chefman 6 qt is a dual-basket drawer unit: two independent 3 qt baskets with viewing windows, for cooking two foods at once and finishing them together. The Emeril Lagasse 26 qt is a French-door countertop oven: one large cavity, 24 presets, six accessories, built for roasting and toasting as much as air-frying.',
          'Neither is better. One is for two small things at different temperatures; the other is for one big thing, or several flat things on racks, in a machine that stays on the counter.',
        ],
      },
      {
        h: 'What to do if you are still undecided',
        p: [
          'Count the meals you cooked last week that would have used the machine. If most of them were two-part meals — protein plus a side — the dual basket layout is doing real work for you. If most were one tray or one whole item, a single large basket or an oven will waste less of your counter.',
          'Then go and look at the actual footprint of the model you are considering. It is the number most likely to make you return the thing.',
        ],
      },
    ],
    related: ['P01', 'P02', 'P03'],
    sources: ['A2'],
  },
  {
    slug: 'capacity-checklist',
    card: "Quarts are a marketing unit; food is a physical object. Close the gap with a tape measure and one bag of frozen chips.",
    path: 'guides/capacity-checklist.html',
    kicker: 'Fit',
    title: 'A no-hype checklist for comparing air fryer capacity',
    summary:
      'Manufacturers quote quarts. Food occupies space. This is a short method for closing the gap between the two before you buy, using a tape measure and one bag of frozen chips.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Why the number on the box is not your portion',
        p: [
          'Stated capacity is a cavity volume. It does not account for the crisper plate, the headroom you need for air to move, or the fact that food must sit in a single layer to crisp. Two machines with the same quart figure can hold noticeably different amounts of edible food.',
          'The listing figures are still worth comparing — they are the only common unit — as long as you treat them as an upper bound rather than a serving estimate.',
        ],
      },
      {
        h: 'The five-minute check',
        p: [
          'One: put the bag of frozen chips you actually buy on the counter. Two: build a single flat layer of them in the footprint you expect the basket to have. Three: note how much of the bag that took. Four: multiply by the number of people you usually cook for. Five: compare that volume to the stated capacity, remembering that the usable layer is well below the total.',
          'If your single layer needs more than about half the stated capacity, the machine will be crowded for your household and will need two batches.',
        ],
      },
      {
        h: 'Two baskets versus one big one',
        p: [
          'Six quarts split across two 3 qt baskets is not the same as eight quarts in one basket. The split unit wins when the two foods need different times or temperatures, and loses when you want one large batch.',
          'A useful test: does anything you cook regularly occupy most of a 3 qt basket on its own? If yes, a dual-basket unit will frustrate you.',
        ],
      },
      {
        h: 'The counter-space half of the question',
        p: [
          'Capacity and footprint rise together, but not evenly. Write the height, width and depth of your available space before you look at anything, then filter by that first. An appliance that does not fit is a return, whatever its capacity.',
        ],
      },
    ],
    related: ['P03', 'P01', 'P02'],
    sources: ['A2'],
  },
  {
    slug: 'cleanup-counter',
    card: "The two costs nobody compares: how much of the sink it takes, and how much of the counter it keeps forever.",
    path: 'guides/cleanup-counter.html',
    kicker: 'Daily use',
    title: 'Cleanup and counter space: the trade-offs to assess',
    summary:
      'The two costs nobody compares when they buy an air fryer: how much of the sink it takes, and how much of the counter it permanently occupies.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Count the dishwasher parts, not the features',
        p: [
          'A drawer unit has a basket and usually a crisper plate: two parts, both of which fit a normal sink. A French-door oven has racks, a basket, a drip tray and often a rotisserie spit — more parts, larger, and less likely to fit.',
          'Listings that say “dishwasher-safe” are describing the coating, not the geometry. A dishwasher-safe tray that does not fit your dishwasher is still a hand-wash item.',
        ],
      },
      {
        h: 'The residue question',
        p: [
          'Nonstick coatings are only nonstick while they are intact, and metal tongs are how they stop being intact. If you cook with tongs, buy silicone-tipped ones before the machine arrives; it is the cheapest way to make the coating last.',
          'The other residue source is the element housing above a basket. It is not removable on most units. A wipe after each use, while it is still warm, is worth more than any deep clean.',
        ],
      },
      {
        h: 'Where it lives when it is not in use',
        p: [
          'An air fryer is not a small appliance you put away. If it goes in a cupboard, the cord, the weight and the residue usually mean it stays out — on the counter, taking up space permanently.',
          'Decide the home before you buy. If the answer is “the cupboard”, expect it to end up on the counter anyway, and measure accordingly.',
        ],
      },
      {
        h: 'Ventilation and smell',
        p: [
          'These machines move a lot of hot air and they smell of what you cooked. A space under a cabinet with no clearance will be worse than an open counter, and a kitchen without extraction will hold the smell longer than a pan would.',
          'Every listing differs on rear and top clearance requirements. That number is in the manual, not the title — check it before committing to a spot.',
        ],
      },
    ],
    related: ['P02', 'P01'],
    sources: ['A2'],
  },
  {
    slug: 'multifunction',
    card: "Twenty-four presets is a menu, not a feature list. Ask what each mode replaces before it earns counter space.",
    path: 'guides/multifunction.html',
    kicker: 'Features',
    title: 'Questions to ask before buying a multi-function appliance',
    summary:
      'Twenty-four presets is not a feature list; it is a menu. The useful question is which three modes you will actually use, and what each one replaces.',
    readingTime: '6 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Subtract, do not add',
        p: [
          'A multi-function oven earns its counter space by replacing something you already own. If it replaces a toaster, a small oven and an air fryer, the maths works. If it duplicates a toaster you like and an oven you already have, it is a third thing to clean.',
          'Write down the appliances it would let you remove. If the list is empty, the preset count does not matter.',
        ],
      },
      {
        h: 'Ask what “one-touch” replaces',
        p: [
          'A preset is a temperature and a time. You can set both yourself on any machine that has a dial. Presets are a convenience for repeat cooking, not a capability.',
          'They are genuinely useful for a household that cooks the same five things; they are clutter for a household that cooks by feel.',
        ],
      },
      {
        h: 'The accessories are the tell',
        p: [
          'A machine that ships with six accessories expects you to use them, and expects you to store and wash them. That is a commitment of cupboard space as real as the appliance’s footprint.',
          'Check whether the accessories are dishwasher-safe individually, and whether replacements are sold separately. A discontinued basket ends the appliance’s life early.',
        ],
      },
      {
        h: 'When complexity is the point',
        p: [
          'If the machine is replacing an oven for a small kitchen, breadth is the point: roast, toast, dehydrate, air-fry, from one box. In that case, buy the breadth and accept the cleaning.',
          'If it is a supplement to a full kitchen, buy the single thing it does best and keep it small.',
        ],
      },
    ],
    related: ['P02', 'P03'],
    sources: ['A2'],
  },
  {
    slug: 'temperature-safety',
    card: "The USDA safe minimum temperatures in one table, with the rest time most people skip.",
    path: 'guides/temperature-safety.html',
    kicker: 'Safety',
    title: 'What temperature is actually “done”? A thermometer guide',
    summary:
      'The USDA publishes safe minimum internal temperatures. This page gathers them in one place, explains the rest time, and sets out what a thermometer has to do to be useful for them.',
    readingTime: '4 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'The official numbers',
        p: [
          'These are the USDA Food Safety and Inspection Service’s safe minimum internal temperatures, measured with a food thermometer before the food leaves the heat source. They are minimums: personal preference may take you higher.',
        ],
        table: {
          head: ['Food', 'Minimum internal temperature', 'Rest'],
          rows: [
            ['Beef, pork, veal and lamb steaks, chops and roasts', '145°F (62.8°C)', 'At least 3 minutes'],
            ['Ground meats', '160°F (71.1°C)', '—'],
            ['All poultry, including ground poultry, giblets and stuffing', '165°F (73.9°C)', '—'],
            ['Fish and shellfish', '145°F (62.8°C)', '—'],
            ['Eggs', '160°F (71.1°C)', '—'],
            ['Leftovers and casseroles', '165°F (73.9°C)', '—'],
            ['Fully cooked ham, reheated', '140°F (60°C) if packaged in a USDA-inspected plant; otherwise 165°F (73.9°C)', '—'],
          ],
          source: 'U1',
        },
      },
      {
        h: 'Why the rest time is part of the number',
        p: [
          'For steaks, chops and roasts the 145°F figure comes with a three-minute rest. The rest is not a serving suggestion: the temperature continues to equalise through the meat while it sits, and the safety standard assumes the full three minutes.',
          'This is the single most commonly skipped step in home cooking, and the one that most rewards a thermometer that can be left in place.',
        ],
      },
      {
        h: 'What this means for choosing a thermometer',
        p: [
          'Two jobs, two tools. An instant-read is for checking a number quickly and moving on — it is fast, it lives in a drawer, and it is what you want for a steak or a chicken breast.',
          'A leave-in probe is for a cook that lasts longer than your attention — a roast, a smoked shoulder, an air-fried whole bird. It stays in the food, reads continuously, and lets you watch the climb without opening the door and losing heat.',
        ],
      },
      {
        h: 'The two supplied units, against those jobs',
        p: [
          'The ThermoMaven is an instant-read thermometer: a one-second read, a stated ±0.5°F accuracy, and IP67 water resistance for washing. It is the drawer tool.',
          'The CHEF iQ Sense is a wireless leave-in system: three probes, WiFi, and a stated 1000°F heat limit. It is the long-cook tool. Review summaries on the listing mention an app; the listing text read on 2026-11-20 does not spell out its requirement.',
          'If you cook both ways, a cheap instant-read plus a leave-in is usually a better spend than one expensive compromise. Neither of these listings tells you the probe’s response time when it is cold, which is the number that matters for a fast sear.',
        ],
      },
      {
        h: 'Calibrate once, then trust it',
        p: [
          'Fill a glass with crushed ice and water, stir, and put the probe in for thirty seconds. It should read 32°F (0°C). If it does not, use the adjustment the manufacturer provides, or return it.',
          'Do this on the day it arrives, while you can still return it.',
        ],
      },
    ],
    related: ['P04', 'P05'],
    sources: ['U1', 'A2'],
  },
  {
    slug: 'hosting-season',
    path: 'guides/hosting-season.html',
    kicker: 'Season',
    title: 'Hosting season: which machine cooks what on the big day?',
    summary:
      'One oven, four side dishes and a guest list. The December problem is oven occupancy, not appliance quality: a job-by-job way to split the cooking across a countertop oven, a dual basket and a big single basket, with the safety numbers that decide when each job is done.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'The problem is oven occupancy, not appliance quality',
        p: [
          'On a hosting day the oven is the bottleneck: the bird, the roast, the tray of potatoes and the pudding all want the same cavity at different temperatures. Every machine that adds a second cooking space is worth more on that day than any preset count.',
          'That is the lens for the rest of this page. Not which of these five units is best — none of them has been handled by this desk — but which job each machine’s stated shape actually fits.',
        ],
      },
      {
        h: 'Assign by job, not by headline capacity',
        p: [
          'The rows below assign each typical job to the machine whose published format matches it. Every statement of what a machine can hold is the listing’s own claim, recorded in the product pages with its source.',
        ],
        table: {
          head: ['Job on the day', 'The machine that fits', 'Why, per the listing'],
          rows: [
            [
              'The big bird or a joint roast',
              'Emeril Lagasse 26 qt French door',
              'One large cavity with a French door and racks; the largest stated volume of the five.',
            ],
            [
              'Two side dishes at different temperatures',
              'Chefman 6 qt dual basket',
              'Two independent 3 qt baskets that can run separately and, per the listing, finish together.',
            ],
            [
              'One large batch of wings, fries or vegetables',
              'Chefman 8 qt TurboFry',
              'A single 8 qt basket — the largest stated single-batch capacity of the three air fryers.',
            ],
            [
              'Knowing when everything is done',
              'ThermoMaven 1-second thermometer',
              'Instant-read format: a number in about a stated second, per the listing title.',
            ],
            [
              'Watching a long roast without opening the door',
              'CHEF iQ Sense Gen3',
              'Leave-in wireless probes with a stated 1000°F heat limit; the format made for long cooks.',
            ],
          ],
          source: 'A2',
        },
      },
      {
        h: 'The safety numbers for the day',
        p: [
          'The USDA publishes safe minimum internal temperatures, measured with a food thermometer before the food leaves the heat source. These are minimums; personal preference may take you higher. On a multi-dish day these numbers are the schedule.',
        ],
        table: {
          head: ['Food', 'Minimum internal temperature', 'Rest'],
          rows: [
            ['All poultry, including giblets and stuffing', '165°F (73.9°C)', '—'],
            ['Beef, pork, veal and lamb roasts', '145°F (62.8°C)', 'At least 3 minutes'],
            ['Leftovers and casseroles', '165°F (73.9°C)', '—'],
            ['Fully cooked ham, reheated', '140°F (60°C) if packaged in a USDA-inspected plant; otherwise 165°F (73.9°C)', '—'],
          ],
          source: 'U1',
        },
      },
      {
        h: 'The second shift: leftovers',
        p: [
          'The day after generates its own schedule: everything comes back up to 165°F before it leaves the heat. This is the instant-read’s job, twice an evening, and it is the reason a thermometer is a hosting-season purchase rather than a gadget.',
          'The same probe that read the bird on the day reads the reheated casserole on the day after. If you own only one tool from this page, that is the argument for the handheld unit.',
        ],
      },
      {
        h: 'What this plan cannot do',
        p: [
          'Nothing on this page is a hands-on verdict. The job assignments follow each listing’s own statements about format and capacity, attributed and recorded in the product pages. Where a listing is silent — usable basket volume, real-world probe response times — the product page says so rather than guessing.',
          'Capacity figures are stated totals, not serving estimates. The capacity checklist has the method for converting either into portions.',
        ],
      },
    ],
    related: ['P02', 'P01', 'P03', 'P05'],
    sources: ['U1', 'A2'],
  },
  {
    slug: 'gifts-for-the-cook',
    path: 'guides/gifts-for-the-cook.html',
    kicker: 'Gifting',
    title: 'Five gifts for the cook who already has an oven: match the person, not the preset count',
    summary:
      'A gift guide with no prices and no star ratings — those live on the listing and change too fast to reprint. What stays stable is fit: which of these five units suits which kind of cook, and the three checks to run before wrapping any of them.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Start with the person, not the product',
        p: [
          'The fastest way to buy a kitchen gift badly is to shop by feature count. The useful question is what the person cooks, and which job in their kitchen currently has no tool. Each of the five units on this site covers one job well and one job badly; the table below maps them to people rather than to specifications.',
          'These are fit judgements drawn from what each listing states about format and use — not reports of how the machines behave in use, which this desk cannot give.',
        ],
      },
      {
        h: 'Who each unit actually suits',
        p: [
          'Read down the middle column as a question about the recipient: which sentence sounds like them?',
        ],
        table: {
          head: ['Who you are buying for', 'The match', 'Why it fits, per the listing'],
          rows: [
            [
              'The cook who makes two-part weeknight meals',
              'Chefman 6 qt dual basket',
              'Two independent 3 qt baskets for a protein and a side at the same time.',
            ],
            [
              'The one who batch-cooks for a crowd',
              'Chefman 8 qt TurboFry',
              'A single 8 qt basket — one big batch instead of two small ones.',
            ],
            [
              'The one whose kitchen runs on the oven',
              'Emeril Lagasse 26 qt French door',
              'A French-door countertop oven with racks and six stated accessories: roast, toast and air-fry in one fixture.',
            ],
            [
              'The one who asks “is it done?” out loud',
              'ThermoMaven 1-second thermometer',
              'An instant-read for a fast number, with a stated IP67 rinse-and-go build.',
            ],
            [
              'The long-cook hobbyist: smoking, roasting, Sunday birds',
              'CHEF iQ Sense Gen3',
              'Three leave-in probes over WiFi, stated 1000°F heat-safe, for watching a temperature climb from another room.',
            ],
          ],
          source: 'A2',
        },
      },
      {
        h: 'Three checks before you wrap it',
        p: [
          'One: check the price and availability on the listing itself. They change constantly, which is exactly why this site prints neither — and why any number you see quoted elsewhere may be stale.',
          'Two: measure their counter and their sink. A countertop oven is a fixture and a basket is a dish; the cleanup and counter-space guide has the method.',
          'Three: ask whether they want a phone in the loop. The wireless probe is a system with an app; the instant-read is a tool. That single question prevents more returns than any specification.',
        ],
      },
      {
        h: 'What this guide deliberately does not claim',
        p: [
          'No unit here has been handled, bought or tested by this desk, so nothing here reports durability, noise, real accuracy or how a coating wears. Certification and performance claims — the NIST and NSF wording, the ±0.5°F figure, the 1000°F limit — appear as the listings state them, not as verified facts.',
          'That is the honest size of this advice: fit and format from published claims, with the checks above left to you and the listing.',
        ],
      },
    ],
    related: ['P04', 'P01', 'P05'],
    sources: ['A2'],
  },  {
    slug: 'ice-test-thermometer',
    path: 'guides/ice-test-thermometer.html',
    card: "A thermometer that drifts lies confidently. The agency's own two-minute ice test catches it before dinner does.",
    kicker: 'Calibration',
    title: 'Is your thermometer telling the truth? The two-minute ice test',
    summary:
      'A thermometer can be fast, waterproof and beautifully made and still read wrong. The USDA food-safety agency publishes a two-minute check that catches a drifting thermometer before it ruins a roast — this page walks through it, and through what a failure means.',
    readingTime: '4 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Why a thermometer drifts, and why the number it shows is a promise',
        p: [
          'Every safe-temperature figure worth trusting — the USDA minimums, the rest times — assumes the thermometer measuring them is honest. The agency’s own factsheet notes that most food thermometers read within about 2 to 4°F of true, which is fine for safety margins, but a thermometer that has been dropped, soaked or overheated can sit further out than that and still look completely normal.',
          'There is no visible sign of drift. The screen shows a number with the same confidence as always. That is the case for checking it against a fixed physical reference — and the two most reliable references in a kitchen are the freezing point and the boiling point of water.',
        ],
      },
      {
        h: 'The ice test, as the agency describes it',
        p: [
          'Fill a large glass with ice cubes, add drinking water, and stir well. Immerse the thermometer stem at least two inches into the mixture, touching neither the sides nor the bottom of the glass. Wait at least thirty seconds and read without removing the stem from the water.',
          'It should read 32°F (0°C). If it does, the thermometer is calibrated. If it does not, adjust it according to the manufacturer’s instructions — some have a calibration nut or dial — and if it cannot be adjusted, the agency’s guidance is blunt: it may need to be replaced.',
          'The whole test costs two minutes, one glass of ice, and no equipment. Doing it the day the thermometer arrives, while it can still be returned, is the cheapest quality control there is.',
        ],
        table: {
          head: ['Method', 'Reference', 'Watch for'],
          rows: [
            ['Ice water (best for most thermometers)', 'Should read 32°F (0°C)', 'Stem must sit at least 2 inches deep, not touching the glass; wait at least 30 seconds'],
            ['Boiling water (for higher temperatures)', 'Should read 212°F at sea level', 'Water boils lower at altitude — at least 2°F lower, perhaps up to 5°F; ask the local Cooperative Extension office or health department for the exact figure'],
          ],
          source: 'U2',
        },
      },
      {
        h: 'What a failure means, and what it does not',
        p: [
          'A fail does not mean the thermometer is cheap or bad; it means it has drifted, and drift is correctable on many models and fatal on the rest. The agency’s factsheet is explicit that a thermometer which cannot be manually calibrated may need to be replaced — which is a reason to check calibration early, inside the return window.',
          'A pass does not mean the thermometer is accurate everywhere on its scale; it means it is honest at 32°F, which is the reference kitchen checks can rely on. For cooking-range confidence, the boiling check adds a second point, with the altitude caveat above.',
        ],
      },
      {
        h: 'Which of the two units on this site this applies to',
        p: [
          'Both. The ThermoMaven instant-read has a fast read and a stated ±0.5°F accuracy claim — the kind of claim worth checking on day one, because an instant-read that sits 3°F out quietly undercooks chicken. The CHEF iQ Sense is a wireless system with leave-in probes; the agency’s factsheet notes that smart thermometers can be calibrated, and this desk could not read from the listing how (or whether) the Sense exposes calibration — it is not stated in the data available here.',
          'That sentence is deliberately careful: this desk has handled neither unit. The ice test above is the reader’s action, taken from the agency’s own method. The only claim being made about the two products is about what their listings do and do not state.',
        ],
      },
      {
        h: 'The care half of accuracy',
        p: [
          'Calibration holds only if the thermometer survives. The agency’s care guidance: wash with hot, soapy water — most thermometers should not be immersed — store probes in their sheaths, and keep plastic-faced units away from heat that can melt them.',
          'An instant-read that rides in a drawer with metal tongs, or a probe that goes through the dishwasher against instructions, can lose its calibration between checks. The test is free, so the practical habit is: test on arrival, and re-test after any drop or soak.',
        ],
      },
    ],
    related: ['P04', 'P05'],
    sources: ['U2', 'U1'],
  },
  {
    slug: 'holiday-format-check',
    path: 'guides/holiday-format-check.html',
    kicker: 'Season',
    title: 'Hosting this winter: which air fryer format fits the meal you actually cook?',
    summary:
      'The oven is full, the guests are early, and the machine on the counter is either saving dinner or getting in the way. A format-first way to decide what kind of air fryer a hosting household actually needs — before the season decides for you.',
    readingTime: '6 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'The two hosting failures, and which one you actually have',
        p: [
          'Hosting meals fail in two ways. The first is arithmetic: more dishes than oven slots, everything due at the same hour. The second is timing: food that was ready early and spent the drinks reception turning into jerky.',
          'A machine that helps with the first failure is a second oven — a cavity that takes a tray or a whole item. A machine that helps with the second is a synchroniser — two smaller loads that finish at the same moment. Those are different products, and both are called air fryers.',
        ],
      },
      {
        h: 'The format decision tree',
        p: [
          'Ask what the main event looks like. One big thing — a bird, a joint, a whole side of salmon — needs a cavity tall and deep enough to take it, which points at an oven-style unit or a large single basket. Many small things — wings, roasted vegetables, potato skins, reheated canapés — need surface area and shaking, which points at baskets.',
          'Then ask the question that actually separates the households: do any two dishes need to finish at the same time? If yes, two independent baskets finishing together is a genuine feature. If your sides are all room-temperature or oven-timed anyway, one big basket wastes less of your counter.',
        ],
      },
      {
        h: 'What the quart figures do and do not tell you about a crowd',
        p: [
          'The three air fryers on this site carry stated capacities of 6 quarts split into two 3 qt baskets, 8 quarts in one basket, and 26 quarts in an oven cavity — all figures taken from the manufacturer’s listings, not measured here. For a crowd, the useful translation is not volume but layers: crisping food needs a single layer, and a single layer is a surface.',
          'The method for converting your guest list into batch counts is in the capacity guide, and the party-food version of it is in the game-day piece. Read either before you let a quart figure persuade you.',
        ],
      },
      {
        h: 'The second-oven argument',
        p: [
          'The strongest case for an oven-style unit in a hosting kitchen is not air-frying at all. It is overflow: the tray of something that does not need the big oven’s precision, kept hot in a machine that holds temperature on a rack.',
          'The cost is the same as always — counter. During a party the machine becomes the hot station: the place people stand near, put things down on, and open. Measure the gap it will live in with the door open, not closed, and decide in advance which corner of the kitchen is its territory for the day.',
        ],
      },
      {
        h: 'Five questions to answer before the guests arrive',
        p: [
          'One: how many dishes are due at the same hour, and how many of them need browning rather than reheating? Two: does anything need two temperatures at once? Three: where does the machine sit when the kitchen has four people in it? Four: what is the fallback if the thing you planned to cook in it does not actually fit — because the day you find out should not be the day you serve it? Five: what is the smoke and steam situation in a kitchen that is about to be full of coats?',
          'None of these questions is about presets. All of them are about the meal you actually cook.',
        ],
      },
    ],
    related: ['P01', 'P02', 'P03'],
    sources: ['A2'],
  },
  {
    slug: 'smart-probe-questions',
    path: 'guides/smart-probe-questions.html',
    kicker: 'Connected gear',
    title: 'Smart meat thermometers: the questions to ask before you pay for a radio',
    summary:
      'A leave-in probe buys you a temperature graph and costs you an app. Before comparing models, decide which of those two facts matters more in your kitchen — the spec sheet will not decide it for you.',
    readingTime: '6 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'What a leave-in probe does that an instant-read cannot',
        p: [
          'An instant-read thermometer answers one question — what is the temperature right now — and answers it in seconds. A leave-in probe answers the only question that matters during a long cook: what is the temperature doing?',
          'The climb is the information. Meat temperature moves unevenly, rest times are part of the safety standard (see the USDA numbers on the temperature guide), and a probe that stays in place lets you catch the target instead of repeatedly opening the heat to look for it.',
        ],
      },
      {
        h: 'How to read a range claim',
        p: [
          'One of the two thermometers on this site advertises “WiFi Unlimited Range” in its listing title. That is a manufacturer claim, quoted here as one; this desk has not tested it and does not repeat it as a fact. “Unlimited” in a spec sheet describes a topology — usually that the base talks to your home network — not the distance the probe itself transmits.',
          'The practical question is which link is the weakest. Probe to base, base to router, router to the phone in your pocket: a chain of three radio links, and the shortest one sets the real range. Ask what the stated distance is for each link. If the listing only gives one number, it is usually the most flattering one.',
        ],
      },
      {
        h: 'Probes versus cooks: how many do you actually insert?',
        p: [
          'The multi-probe system on this site ships with three probes, per its listing. Most cooks insert one probe into one piece of meat. A second probe earns its keep on a second cut, or reading the ambient temperature of the oven or smoker while the first watches the food.',
          'Before paying for a third probe, count how often you cook two things at once in the same machine. If the honest answer is twice a year, the third probe is storage, and the money is better spent on accuracy or on a good instant-read alongside it.',
        ],
      },
      {
        h: 'Heat limits as listed, and what the number leaves out',
        p: [
          'The same listing claims a 1000°F heat-safe limit. Read such limits carefully: they describe whichever component the manufacturer means — often the probe body or the connector — and the grill grate right under the fire is the harshest place in the system. Where the limit applies is a question for the manual, not the title.',
          'The other stated limits matter just as much: battery life per charge, whether the case charges the probes, and what happens to the reading when the battery is low. None of these are in the headline.',
        ],
      },
      {
        h: 'The app dependency question set',
        p: [
          'A connected thermometer is two products: a thermometer and a service. Ask before buying: does the base show a temperature without a phone? Is an account required? What notifies you — the app, the base, both? What happens to the device if the app is eventually discontinued?',
          'That last question is not pessimism; it is the standard longevity question for any connected appliance. The comforting answer is that the fallback is cheap: a drawer instant-read, used exactly as the temperature guide describes, still keeps dinner safe.',
        ],
      },
      {
        h: 'What no spec sheet tells you',
        p: [
          'Probe response time when the probe has been sitting at room temperature, calibration drift over a year, how the reading differs at the tip versus along the shaft — these decide whether a fast sear reads correctly, and none of them appear in listing titles.',
          'Until someone publishes those numbers honestly, the decision is about jobs, not badges: an instant-read for the drawer, a leave-in for the long cooks you actually do, and a refusal to pay for radios you will not use.',
        ],
      },
    ],
    related: ['P05', 'P04'],
    sources: ['A2', 'U1'],
  },
  {
    slug: 'crowd-capacity-math',
    path: 'guides/crowd-capacity-math.html',
    kicker: 'Season',
    title: 'Wings for a crowd: the capacity arithmetic to do before game day',
    summary:
      'Party food is a surface-area problem wearing a volume costume. A short method — one bag of frozen wings, a tape measure and honest counting — that tells you how many batches a crowd really takes, and when a bigger machine would not have helped.',
    readingTime: '6 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Why quarts lose to square inches for finger food',
        p: [
          'Crisping needs a single layer: air has to reach every piece. Finger food tiles a surface the way paving stones tile a path — the useful number is the area of the layer, not the volume of the box it sits in. Two machines with the same stated capacity can differ sharply in how much party food they actually finish per batch.',
          'The stated capacities quoted on this site — 6 quarts in two baskets, 8 quarts in one, 26 quarts in an oven cavity — remain the only common unit, and they come from the listings. Treat them as an upper bound on the box, not a serving count.',
        ],
      },
      {
        h: 'The batch-count method',
        p: [
          'Buy the bag of frozen wings or wedges you actually serve. Pour a single layer into the footprint your basket or tray really has — not the theoretical basket, the one with the crisper plate in it. Count what fits. That number is your pieces-per-batch, and it is the only capacity figure that has ever meant anything to your guests.',
          'The arithmetic is then one line: batches = people × pieces each ÷ pieces per batch, rounded up, plus one batch for the people who come back for seconds. Every input is a number you counted yourself, which is why the result can be trusted.',
        ],
      },
      {
        h: 'A worked example, with the assumptions in plain sight',
        p: [
          'The following numbers are hypothetical, chosen for the arithmetic, and are not measurements of anything: say a single layer holds 24 pieces and you are feeding 30 people at 4 pieces each. That is 120 pieces, so 5 batches, plus the seconds batch: 6 batches total.',
          'If each batch takes twenty minutes and needs one shake, the machine is busy for about two hours. That is the planning number. Replace every figure with your own count before it decides anything for you.',
        ],
      },
      {
        h: 'When two baskets beat one big one — and when they do not',
        p: [
          'If your layer count fills one basket with the same food, a second basket does not cook it faster; it cooks a second food alongside. That is the real party win of a dual-basket unit: wings in one, wedges in the other, finishing together instead of competing for the same slot.',
          'If you mostly serve one thing in bulk, one large basket — or an oven-style cavity taking a flat tray per rack — wastes less machine on the problem you actually have. The format guides cover that decision in more depth.',
        ],
      },
      {
        h: 'Planning the finish time backwards',
        p: [
          'Work out when the first plate has to leave the kitchen, then subtract: total batch time, plus the minutes lost to shaking, loading and the pause between batches. Whatever remains is your margin, and on a crowded day it will be spent by someone asking where the napkins are.',
          'One structural note for hosts: a machine that takes flat trays can hold finished food warm at a low setting on a rack, which buys margin back. A drawer of finished wings is a drawer you are now managing.',
        ],
      },
      {
        h: 'The honest limits of this method',
        p: [
          'This method counts food in your space. It says nothing about crisping performance, noise, smell or durability, and nothing here is a test result — this desk has not run these machines. It answers one question honestly: how many batches, and is that acceptable before you commit to the plan?',
          'If the answer is no, the fix is usually format, not capacity: more surface, or a second heat source in the house that is already built for flat trays.',
        ],
      },
    ],
    related: ['P01', 'P02', 'P03'],
    sources: ['A2'],
  },
  {
    slug: 'air-fryer-worth-it',
    path: 'guides/air-fryer-worth-it.html',
    kicker: 'Worth it?',
    title: 'Is an air fryer worth it if you already own an oven?',
    summary:
      'An air fryer is a compact convection cooker: a heating element, a fan, and a small cavity that moves air hard. Whether it earns counter space depends on four questions about your kitchen — not on anyone’s sales figures.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'What an air fryer actually is',
        p: [
          'Strip away the name and an air fryer is a small convection oven with the fan close to the food. The small cavity heats fast, the fan moves air hard, and food with dry surfaces crisps quickly. That is the entire mechanism — and it is the same mechanism inside the convection setting of a full-size oven, delivered from a much smaller box.',
          'The difference is not magic; it is scale. A small, hot, fast-moving cavity does certain jobs noticeably better than a large oven: loose crispy foods, small batches, reheating without a soggy microwave middle.',
        ],
      },
      {
        h: 'Four questions that decide it',
        p: [
          'One: how often do you cook food you want crispy — fries, wings, breaded cutlets, roasted vegetables? Weekly is a yes; twice a year is a no. Two: is there a square foot of counter it can live on permanently? These machines are heavy, corded, and used most when they are out.',
          'Three: who washes what? A basket and a crisper plate are two parts; a countertop oven brings racks and a drip tray. Four: how many people are you cooking for at once? Food crisps in a single layer, so the honest capacity of any unit is well below its stated volume.',
        ],
      },
      {
        h: 'When the oven you own is already enough',
        p: [
          'If your convection setting gets a workout and your counter is full, the answer is no — and that is a good outcome of this question. An appliance that stays in the cupboard does not crisp anything.',
          'The other honest no: if what you actually want is a second oven for big meals, do not buy a basket air fryer pretending to be one. That is the 26 qt French-door format’s job, not a drawer unit’s.',
        ],
      },
      {
        h: 'If you buy one, buy the shape that matches your food',
        p: [
          'Two-part meals — protein plus a side, at different times or temperatures — are the dual-basket format’s whole reason to exist (the Chefman 6 qt). Big single batches of one thing belong to the large single basket (the Chefman 8 qt TurboFry). Flat things on racks, and anything you would toast or roast, belong to the oven format (the Emeril Lagasse 26 qt).',
          'The shape decision is the one that decides whether you are still using it in March. The full write-ups are on the pick pages, and the comparison table lays the three formats side by side.',
        ],
      },
      {
        h: 'One measurement to take before ordering',
        p: [
          'Measure the space before the machine: the height under your upper cabinets, the depth from the wall to the counter’s front edge, and the width of your sink. The first two decide what you can own; the third decides what you can wash.',
          'It is the least glamorous paragraph in this guide and the one that prevents the most returns.',
        ],
      },
    ],
    related: ['P01', 'P03', 'P02'],
    sources: ['A2'],
  },
];

// ---------------------------------------------------------------------------
// Season clusters — the "seasons and clusters" layer. Entry points into the
// existing guides, framed by the calendar. No new claims: every card points at
// a guide that carries its own sources.
// ---------------------------------------------------------------------------
export const SEASONS = {
  kicker: 'Right now',
  title: 'Start with the season you are in',
  lede: 'The same five picks, entered from the question the calendar is asking. Each card opens a guide that shows its sources.',
  cards: [
    {
      tag: 'Hosting season',
      title: 'Which machine cooks what on the big day',
      desc: 'Oven occupancy, job assignment, and the safety numbers that schedule the meal.',
      href: '/guides/hosting-season.html',
    },
    {
      tag: 'Gifting',
      title: 'Five gifts for the cook who already has an oven',
      desc: 'Match the person, not the preset count — and three checks before you wrap.',
      href: '/guides/gifts-for-the-cook.html',
    },
    {
      tag: 'Weeknights',
      title: 'Capacity in portions, not in quarts',
      desc: 'The five-minute check that turns a stated capacity into your household’s batch count.',
      href: '/guides/capacity-checklist.html',
    },
    {
      tag: 'Small kitchens',
      title: 'The cleanup and counter-space trade-offs',
      desc: 'Sink space, dishwasher geometry, and where the machine lives when it is idle.',
      href: '/guides/cleanup-counter.html',
    },
  ],
};

// ---------------------------------------------------------------------------
// Suggestion board — the dedicated review surface at /suggestions/.
// Each suggestion is a fork between named paths. Nothing is implemented unless
// its status says so: the point of the board is to let the owner choose a path
// before anything changes.
// ---------------------------------------------------------------------------
export const SUGGESTION_BOARD = {
  how: 'Each suggestion below is a fork, not a mandate. Read the paths, pick one per card — or none — and only then does anything change. Status labels: “Shipped in this build” means the recommended path is already live and the alternative stays on the table; “Awaiting choice” means nothing has been done; “Needs owner input” means the paths cannot be compared until a question on the Decision Inputs page is answered.',
  groups: [
    {
      name: 'Reads like a shop, not like a process',
      items: [
        {
          id: 'DS-01',
          title: 'Front-page voice: lead with the products',
          problem: 'The first screen of a shop should sell the goods, not describe the audit. Verification belongs where a careful reader looks for it, not where an arriving one lands.',
          options: [
            { label: 'Path A — shop-first front page (recommended)', detail: 'Hero leads with the five picks and buyer questions; the honesty band sits below the products and links through to the methods pages. Shipped in this build.', effort: 'Done' },
            { label: 'Path B — full magazine front page', detail: 'Rotating feature story, larger imagery, issue-style sections. More editorial presence; more to maintain and more image work.', effort: '2–3 days' },
            { label: 'Path C — product grid only', detail: 'Pure catalogue. Converts the front page into a listing and loses the question-shaped entry points that earn search traffic.', effort: '1 day' },
          ],
          recommendation: 'Path A. Path B becomes worth it when there is a named author and an imagery budget (DS-04, DS-05).',
          status: 'Shipped in this build',
          needs: 'Nothing.',
        },
        {
          id: 'DS-02',
          title: 'Seasons and topic clusters',
          problem: 'A publication reads as alive when its entry points follow the calendar. Clusters also give search engines clear topical neighbourhoods instead of one flat list.',
          options: [
            { label: 'Path A — seasonal cards plus two seasonal guides (recommended)', detail: 'A “start with the season” band on the front page pointing at question-shaped guides, two of which ship now: hosting season and gifting.', effort: 'Done' },
            { label: 'Path B — a full seasonal hub per quarter', detail: 'A dedicated page per season with curated picks. More depth, more upkeep, and a risk of thin pages once the season passes.', effort: '2 days per quarter' },
          ],
          recommendation: 'Path A now; Path B only after measured interest — the ledger and the click counter will show which seasons earn readers.',
          status: 'Shipped in this build',
          needs: 'Nothing to start; measurement to choose the next season (DI-04).',
        },
        {
          id: 'DS-03',
          title: 'What to publish next: the topic engine',
          problem: 'The next topic should come from measured queries, not instinct. Until measurement exists, the safest engine is the hypothesis list the brief already names.',
          options: [
            { label: 'Path A — question-shaped long-tail guides (recommended)', detail: 'Continue the editorial hypotheses: comparison questions, checklists, trade-off guides. Each answers one searchable question and links back to the register.', effort: '1 guide per fortnight' },
            { label: 'Path B — head-to-head comparison pages', detail: 'Higher search volume, harsher competition, and a shape that tempts verdict language this site cannot support without handling the products.', effort: '2 days each' },
            { label: 'Path C — recipe-led content', detail: 'Traffic-friendly but off-register: recipes would imply use of machines this desk has not handled.', effort: 'Ongoing' },
          ],
          recommendation: 'Path A until the campaign ledger shows which topics earn clicks (SUG-06). Path C is rejected outright under the non-testing policy (FLG-004).',
          status: 'Awaiting choice',
          needs: 'Analytics live (DI-04) before measuring anything; nothing blocks starting Path A.',
        },
      ],
    },
    {
      name: 'Trust: authorship, brand, imagery',
      items: [
        {
          id: 'DS-04',
          title: 'Authorship: a desk or a person?',
          problem: 'Google’s site-reputation review weighs stated or implied authorship. A named editor with a short biography is the cheapest trust signal available to a young publication.',
          options: [
            { label: 'Path A — keep the Counterwise desk', detail: 'Current state. Consistent and honest about the non-testing policy, but anonymous.', effort: 'Done' },
            { label: 'Path B — named author and biography page (recommended when decided)', detail: 'A real byline with a two-line biography and a contact route. Materially improves trust and policy posture; requires the owner’s identity decision.', effort: 'Half a day' },
          ],
          recommendation: 'Path B as soon as the owner answers DI-06.',
          status: 'Needs owner input',
          needs: 'DI-06 (Q-05).',
        },
        {
          id: 'DS-05',
          title: 'Imagery: abstract art or product photography?',
          problem: 'Imagery is the difference between published and generated. It is also the easiest place to accidentally use Amazon’s content outside the licence.',
          options: [
            { label: 'Path A — original abstract art (recommended for now)', detail: 'Current state: consistent, light, clearly not a product photograph, and containing no third-party content.', effort: 'Done' },
            { label: 'Path B — commissioned product photography', detail: 'Requires owning or borrowing the units (ties to DI-03). The only imagery that can honestly show a machine in use.', effort: 'Unit cost plus 2–3 days' },
            { label: 'Path C — listing images taken from Amazon', detail: 'Not recommended: the IP licence limits how Program Content may be reused, and unlicensed listing images are the kind of shortcut this site exists to avoid.', effort: '—' },
          ],
          recommendation: 'Path A now, Path B after DI-03 resolves. Path C rejected.',
          status: 'Awaiting choice',
          needs: 'DI-03 for Path B.',
        },
      ],
    },
    {
      name: 'Audience: capture, distribution, findability',
      items: [
        {
          id: 'DS-06',
          title: 'Reader capture: what should the form do?',
          problem: 'A form that silently discards input is worse than no form. The current form is deliberately inert and says so on the page.',
          options: [
            { label: 'Path A — honest inert form (current)', detail: 'Fires the capture_intent event, transmits nothing, and tells the reader so.', effort: 'Done' },
            { label: 'Path B — wire a mailing provider (recommended when chosen)', detail: 'A provider with a documented data story, consent copy, and one endpoint. Then the form collects for real.', effort: 'Half a day' },
            { label: 'Path C — remove the form', detail: 'Cleanest surface, but loses the intent signal that is already being counted.', effort: '1 hour' },
          ],
          recommendation: 'Path B once DI-05 names a provider.',
          status: 'Needs owner input',
          needs: 'DI-05 (Q-04).',
        },
        {
          id: 'DS-07',
          title: 'Search Console and the domain question',
          problem: 'Query-level data needs a verified Search Console property. The github.io project path works but is a weak brand home.',
          options: [
            { label: 'Path A — verify the current URL-prefix property (recommended first)', detail: 'Owner pastes a verification token; the sitemap is already shipped and linked from robots.txt. Fifteen minutes of owner time.', effort: '15 minutes, owner' },
            { label: 'Path B — move to a custom domain', detail: 'Better brand home and cleaner cookie scope; needs a domain purchase and DNS control.', effort: 'Half a day plus the domain' },
          ],
          recommendation: 'Path A immediately; Path B as a later brand step.',
          status: 'Needs owner input',
          needs: 'Owner’s Google account (DI-06).',
        },
      ],
    },
    {
      name: 'Machinery: measurement and decisions',
      items: [
        {
          id: 'DS-08',
          title: 'Link strategy before scaling traffic',
          problem: 'The supplied short links carry no visible tag. Whether they credit the account at click time is unresolved (FLG-001, FLG-003).',
          options: [
            { label: 'Path A — tagged canonical listing links (current)', detail: 'Every money link is built from the observed ASIN plus the owner’s tag. Safe, checkable, and enforced by the build gate.', effort: 'Done' },
            { label: 'Path B — run the dashboard test, then decide (recommended before scaling)', detail: 'Mint one link per product inside the enrolled Associates workflow, click it, and confirm the tracking report. Closes or confirms FLG-001 and FLG-003.', effort: 'Under an hour, owner' },
          ],
          recommendation: 'Path A stays the default; do Path B before any paid or scaled distribution.',
          status: 'Needs owner input',
          needs: 'DI-01 (Q-01, FLG-003).',
        },
        {
          id: 'DS-09',
          title: 'How decisions get made from here',
          problem: 'The project promised evidence-based iteration. That needs a place where options are reviewed before anything ships, and a record of what was chosen.',
          options: [
            { label: 'Path A — this board plus the Decision Inputs page (recommended)', detail: 'Every change arrives as a card with named paths; every open question arrives with a discovery suggestion. Shipped in this build.', effort: 'Done' },
            { label: 'Path B — add a dated decisions log', detail: 'Each chosen path gets a dated entry with the reason and the evidence. Small overhead, permanent record.', effort: '1 hour to start' },
            { label: 'Path C — generate suggestions from measurement', detail: 'When the ledger has rows, generate review cards from it. Premature until there is data.', effort: 'Later' },
          ],
          recommendation: 'Path A now, Path B from the next decision, Path C only after the ledger has real rows.',
          status: 'Shipped in this build',
          needs: 'Nothing.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Decision inputs — what is known, what is missing, and the cheapest discovery
// for every decision on the table. Nothing here can be decided until the
// missing column is filled; every missing item carries a suggestion for how to
// discover it.
// ---------------------------------------------------------------------------
export const DECISION_INPUTS = [
  {
    id: 'DI-01',
    decision: 'Can the five supplied short links be used as money links?',
    status: 'Blocked — needs owner access',
    have: [
      'All five short links resolve to live listings (resolved again 2026-11-20; same targets and listing titles as the register).',
      'The resolved URLs carry tracking parameters but no tag= parameter (FLG-001).',
      'Policy requires the Associate ID as a parameter on every link to Amazon (A2 §2(b)).',
    ],
    missing: [
      'Whether the links were minted inside the shopnow047c-20 account with the tag applied at click time.',
      'A tracking report covering at least one click per product (FLG-003).',
    ],
    discover: [
      'Mint one short link inside Associates Central while signed in to shopnow047c-20, resolve it, and compare its parameters with the supplied set (Q-01).',
      'Click one link per product through the enrolled workflow and confirm the destination and the tracking report before scaling (the FLG-003 action).',
    ],
    blocks: 'FLG-001, FLG-003 — revenue attribution, not publication',
    owner: 'Site owner',
  },
  {
    id: 'DI-02',
    decision: 'Which channel should produce the first 100 sessions?',
    status: 'Open — needs owner inventory',
    have: [
      'No analytics are deployed, so current traffic is unmeasured (FLG-007).',
      'Search on a new project path will not answer head terms in the first month.',
    ],
    missing: [
      'An inventory of audiences the owner already has: a list, a following, a community.',
      'Any budget or intent for paid or pinned distribution.',
    ],
    discover: [
      'Owner lists every channel they can reach today, with a rough audience size (Q-02).',
      'If the answer is none, plan for long-tail queries plus one community the owner already participates in — not a head-term bet.',
    ],
    blocks: 'Publishing cadence, topic choice (DS-03)',
    owner: 'Site owner',
  },
  {
    id: 'DI-03',
    decision: 'Should the site buy a review unit to earn hands-on content?',
    status: 'Open — money decision',
    have: [
      'No unit has been handled by this desk; FTC guidance bars describing experience with untried products (FLG-004).',
      'Specification-and-fit content is fully shipped and internally consistent without it.',
    ],
    missing: [
      'Whether either brand will supply a unit to a project with no traffic history.',
      'A budget for buying the cheapest of the five and documenting the purchase.',
    ],
    discover: [
      'Ask both brands directly for a review unit and document the ask and the answer (Q-03).',
      'If the brands decline, buy the cheapest unit with a published receipt — a disclosed purchase is a legitimate basis for a test protocol.',
    ],
    blocks: 'DS-05 imagery, hands-on reviews, differentiation',
    owner: 'Site owner',
  },
  {
    id: 'DI-04',
    decision: 'When does measurement go live, and what counts as a baseline?',
    status: 'Blocked — needs an endpoint',
    have: [
      'The five-event counter and click recorder ship with the site and run in the reader’s browser.',
      'A deployable collector exists at the analytics path but is not running (FLG-007).',
      'The campaign ledger schema is frozen and deliberately empty.',
    ],
    missing: [
      'A hosted endpoint — the supplied worker or any first-party alternative.',
      'A decision on where events are stored and for how long.',
    ],
    discover: [
      'Deploy the supplied worker, set the endpoint value in the site script, and confirm one event arrives before trusting any number (SUG-03).',
      'Treat the first 30 days as a baseline, not a scoreboard; small samples mislead.',
    ],
    blocks: 'Ledger rows, topic selection from measured queries, every performance claim',
    owner: 'Site owner with the desk',
  },
  {
    id: 'DI-05',
    decision: 'Where should captured readers go, and how is contact handled?',
    status: 'Open — provider choice',
    have: [
      'The capture form is deliberately inert and says so; it counts intent only.',
      'The repository issue tracker is currently the only corrections route.',
    ],
    missing: [
      'A mailing provider with a documented data story (Q-04).',
      'A public contact address, or a formalised issue-tracker route (Q-07).',
    ],
    discover: [
      'Pick a provider, then wire the endpoint and the consent copy in one change (DS-06).',
      'Create one public address, or publish the issue tracker as the official route and say so on the About page.',
    ],
    blocks: 'DS-06, audience building, the weekly reader-question idea (SUG-07)',
    owner: 'Site owner',
  },
  {
    id: 'DI-06',
    decision: 'Who is the publication — a desk or a named editor — and on what domain?',
    status: 'Open — identity decision',
    have: [
      'Pages sign as “The Counterwise desk” with a stated non-testing policy.',
      'The site runs as a GitHub Pages project path with a full sitemap and feed.',
    ],
    missing: [
      'Whether the owner will publish a real byline (Q-05).',
      'Whether a custom domain will be bought, and who controls DNS (Q-06).',
      'A Search Console verification token from the owner’s Google account.',
    ],
    discover: [
      'Owner decision on the byline; a named author plus a two-line biography is half a day of work (DS-04).',
      'Verify the current URL-prefix property first — the sitemap and robots file are already shipped (DS-07).',
    ],
    blocks: 'DS-04, DS-07, site-reputation posture',
    owner: 'Site owner',
  },
  {
    id: 'DI-07',
    decision: 'Which front-page and imagery path should the next design iteration take?',
    status: 'Ready to decide — options drafted',
    have: [
      'Path A (shop-first front page, seasonal cards, original art) is shipped in this build.',
      'The suggestion board holds the full option sets with effort and risk (DS-01, DS-02, DS-05).',
    ],
    missing: [
      'The owner’s pick between the drafted paths.',
      'For the photography path: a unit in hand (DI-03).',
    ],
    discover: [
      'Read DS-01, DS-02 and DS-05 on the Suggestions board and mark one path per card.',
      'If unsure, keep Path A and revisit when measurement exists — the cost of waiting is zero.',
    ],
    blocks: 'The next design iteration',
    owner: 'Site owner',
  },
  {
    id: 'DI-08',
    decision: 'What is the publishing cadence, and what topic goes next?',
    status: 'Open — partially decided',
    have: [
      'A fortnightly-guide cadence is recommended and drafted (SUG-06); four editorial hypotheses are already published as guides.',
      'The build regenerates the sitemap and feed from the guide list, so every new guide is indexed automatically.',
    ],
    missing: [
      'Measured query and click data to choose topics from evidence rather than instinct.',
      'A decision on whether the gifting and hosting guides continue past the season.',
    ],
    discover: [
      'Start the cadence now from the editorial hypothesis list and record each choice in the decisions log (DS-09).',
      'After 30 days of measurement, rank guides by read-through and outbound clicks, then pick the next topic (DI-04).',
    ],
    blocks: 'The editorial calendar',
    owner: 'Desk with the owner',
  },
];
