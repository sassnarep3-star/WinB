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
      'IP License §1 and §2(c): Program Content must link only to the relevant Amazon page, and may not be used to train machine-learning models.',
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
      'Wattage, external dimensions and temperature range are not stated on the listing as read.',
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
      'Fixed in tools/build.cjs, the generator that CI runs, so the committed /go/ pages now carry index,follow. Earlier integration recorded this fix only in tools/consolidate.mjs, which CI never runs (see FLG-015). Enforced by R10. Owner may instead choose to delete the /go/ pages entirely — they are optional. Do not restore the noindex.',
    blocks: 'Nothing now. Was a real search-policy risk.',
  },
  {
    id: 'FLG-015',
    severity: 'High',
    status: 'Fixed in this build',
    title: 'Fix recorded in a script CI does not run; two brands on the live site',
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
      'On 2026-11-20 the page at https://sassnarep3-star.github.io/WinB/index.html returned, without a query string, a page headed “The kitchen gear worth arguing about” that contains the text “1 probes” and “aFrench-door”. The same file requested with a query string (?v=ab61d616) returned the page that matches index.html in this repository at commit 9798831, headed “Counterwise — five kitchen machines worth the counter space”. Neither defect appears in the repository source or in the generated HTML on this branch. The cause is not known. It could be a cache on the retrieval path or a stale copy served for one URL form. The defects are reader-facing and appear on the front URL the site advertises.',
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
    status: 'Open',
    title: 'Two flag registers disagree, and one entry in the older register is out of date',
    detail:
      'data/shop/flags.json (FLG-001 to FLG-010) and the Flagged for Review page, which is built from FLAGS in _build/data.mjs, use the same IDs for different items. For example, FLG-003 reads “None of the five supplied short links carried a visible Associates tag” in the first and “Compliance status of link.amazon short links is unresolved” in the second. The older register also says that GitHub Actions is disabled on this repository. GitHub reports successful workflow runs on main, so that statement is out of date. The site publishes only the second register. Nothing has been merged to reconcile them.',
    evidence: [
      'data/shop/flags.json, FLG-009: “GitHub Actions is disabled on this repository, so the link resolver workflow cannot run”.',
      'GitHub Actions on this repository (2026-11-20): “Build, verify and deploy to GitHub Pages” completed with success on main.',
      '_build/data.mjs FLAGS, FLG-003: “Compliance status of link.amazon short links is unresolved”.',
    ],
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
];

// ---------------------------------------------------------------------------
// Suggestions: the reviewable decision list.
// Each has a recommendation, an effort, a payoff and a risk. Nothing is
// marked "implemented" unless it is in this build.
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
    status: 'Framing implemented; guides not yet published',
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
    guides: ['capacity-checklist', 'cleanup-counter'],
    products: ['P03'],
    note: 'Hypothesis: game-day and family-batch shape. Not a popularity claim.',
  },
  {
    id: 'holiday-roast',
    season: 'Winter',
    title: 'Holiday roasts and leftovers',
    question: 'A whole bird, a rest, and a safe leftover — which thermometer job is this?',
    body: 'The long-cook question. A leave-in probe watches the climb and the rest; an instant-read checks the number. The USDA minimums and the rest time decide which tool earns its drawer.',
    guides: ['temperature-safety', 'multifunction'],
    products: ['P02', 'P05'],
    note: 'Hypothesis: winter roast shape. Not a popularity claim.',
  },
  {
    id: 'summer-grilling',
    season: 'Summer',
    title: 'Summer grilling and smoking',
    question: 'Steaks, chicken and a long smoke — checking or watching?',
    body: 'The outdoor question. Instant-read for a fast number at the grill, leave-in for a smoke you do not want to stand over. Both jobs, two tools.',
    guides: ['temperature-safety'],
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
    gate: 'Publish only after 30 days of page_view data ranks capacity-checklist above the other guides.',
    status: 'Hypothesis — do not publish yet',
  },
  {
    title: 'Holiday roast thermometer: instant-read or leave-in?',
    cluster: 'Thermometers',
    gate: 'Publish only after temperature-safety shows guide_complete above 25% of its readers.',
    status: 'Hypothesis — do not publish yet',
  },
  {
    title: 'Air-fryer leftovers: what reheats safely?',
    cluster: 'Air fryers + safety',
    gate: 'Publish only after the USDA table is the most-read section of temperature-safety.',
    status: 'Hypothesis — do not publish yet',
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
];

// ---------------------------------------------------------------------------
// Three coherent paths. The owner chooses one before anything is implemented.
// ---------------------------------------------------------------------------
export const PATHS = [
  {
    id: 'A',
    name: 'Path A — Compliance-first shop',
    promise: 'The safest shop. Products first, guides second, measurement last.',
    steps: 'Close FLG-001 (tagging), keep the no-price rule, publish on the fortnightly cadence, defer seasonal guides until measured.',
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
// Guides. `path` keeps the already-published URL for the four live guides.
// ---------------------------------------------------------------------------
export const GUIDES = [
  {
    slug: 'basket-or-oven',
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
];
