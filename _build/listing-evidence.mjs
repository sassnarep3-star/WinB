// listing-evidence.mjs — evidence read directly off the five Amazon listings.
//
// WHAT THIS FILE IS. On 2026-11-20 (UTC) each of the five canonical `/dp/` listing
// pages was fetched and read in full. Everything below is transcribed from what
// those pages served: the "About this Item" bullets, the "Product Description"
// block, and the "Customers say…" review-theme summaries that Amazon itself
// publishes above the reviews.
//
// WHAT THIS FILE IS NOT. It is not a test result, not a measurement, and not an
// independent finding. Each row keeps the listing's own wording for the claim and
// records `basis` = where on the page it appeared.
//
// TWO RULES THIS FILE EXISTS TO KEEP:
//   1. A spec that the listing *does* state must not be reported as "not stated".
//      The previous build did exactly that for wattage and temperature range on
//      three products. That is the defect this file fixes (FLG-014).
//   2. Where a listing contradicts itself, BOTH values are recorded and the
//      contradiction is published. It is never silently resolved (FLG-013).
//
// PRICES AND STAR RATINGS WERE VISIBLE ON EVERY PAGE AND ARE DELIBERATELY NOT
// RECORDED. Amazon's Participation Requirements §2(b) limit how prices may be
// displayed, and rule R3 keeps ratings off the site. Their absence here is a
// policy decision, not an oversight.
//
// Re-check before republishing. Prices move; wattage and capacity rarely do.
//
// S15 PARTIAL RE-READ, 2026-11-20 (session arena-21850b97). All five /dp/ URLs were
// fetched live again and every title re-confirmed verbatim. The P02 (B09B7SB46R)
// Features & Specs and Item details tables were read and are now recorded above;
// the P01 About-bullet lines (RESOURCES wattage, 200–450 °F) were NOT re-located
// in the sampled chunks of the 27-chunk fallback render, so P01's rows stand on
// the same-day full read recorded below. Nothing else was changed.
//
// S15 SECOND PASS, 2026-11-20 (session arena-09d5d72b). A third independent fetch
// of all five /dp/ pages re-confirmed every title verbatim and these rows:
//   P01 About this Item — “200-450°F”, “120 Volts/1700 Watts”, spec table
//     “Product Dimensions 13.38″D x 11.81″W x 10.63″H”.
//   P02 About this Item — “25 COOKING PRE-SETS” against the title’s “24
//     One-Touch Preset Options” (FLG-013 confirmed live); spec table “16.9″D x
//     15.8″W x 14.8″H”, Capacity 24.6 liters.
//   P03 About this Item — “200-400°F”, “1000 Watts/120 Volts – RJ38-SQSS-8T”;
//     spec table “Product Dimensions 12.75″D x 13.5″W x 10″H”.
//   P05 About this Item — “1000°F heat”, “two-year assurance”, “up to 50 hours”,
//     4 internal + 1 ambient sensor; Item details “Model CQ60-3C-Z1-E”,
//     “Warranty Description: 3 Year”, Measurements “Item Length 4.75 inches”.
// Two defects fixed here: P05’s model was recorded as not stated (it is stated),
// and the P05 warranty self-contradiction (2-year bullet vs 3-Year Item details)
// is now recorded so it can be published with both values (S15-B / S15-C).
// Dimensions observed in each spec table are recorded in `dimensions` so no
// future pass reports them as unpublished (S15-A evidence half).

export const EVIDENCE_CHECKED = '2026-11-20';

export const LISTING_EVIDENCE = {
  // ---------------------------------------------------------------- P01
  B0CDY277D3: {
    checked: '2026-11-20',
    readUrl: 'https://www.amazon.com/dp/B0CDY277D3',
    model: { code: 'RJ38-SQPF-3TDB-2W', basis: 'Product Description, final line' },
    wattage: { value: 1700, unit: 'W', basis: 'About this Item → “RESOURCES … 120 Volts/1700 Watts”' },
    volt: { value: 120, unit: 'V', basis: 'same line' },
    tempRangeF: { min: 200, max: 450, basis: 'About this Item → “temperature settings from 200-450°F”' },
    dimensions: { value: '13.38″D × 11.81″W × 10.63″H', basis: 'specification table above “About this item” → Product Dimensions (re-read 2026-11-20, second pass)' },
    safetyListed: 'cETL approved (listing claim)',
    warrantyClaim: '1-year assurance provided by Chefman (listing claim)',
    sellsWith: ['Bake, dehydrate, frozen, reheat-style modes are not itemised on this listing; the four stated modes are air fry, bake, dehydrate and frozen.'],
    themes: [
      {
        theme: 'Durability',
        mentions: 162,
        positive: 11,
        negative: 151,
        summary:
          'Amazon’s summary reports “significant durability issues”, with multiple reviewers saying the unit failed within six months of light use.',
      },
      {
        theme: 'Functionality',
        mentions: 264,
        positive: 176,
        negative: 88,
        summary:
          'Mixed: works well for one or two people, but reviewers also report one basket failing or the unit refusing to power on.',
      },
      {
        theme: 'Size',
        mentions: 102,
        positive: 51,
        negative: 51,
        summary:
          'Split evenly. Reviewers calling it right-sized for two people and reviewers calling it smaller than expected are equally represented.',
      },
      {
        theme: 'Cooking time',
        mentions: 134,
        positive: 60,
        negative: 74,
        summary: 'Mixed; some reviewers report cooks taking longer than the packet timing suggests.',
      },
      {
        theme: 'Value for money',
        mentions: 213,
        positive: 111,
        negative: 102,
        summary: 'Mixed, and closely tied to whether the unit lasted.',
      },
      {
        theme: 'Dual baskets',
        mentions: 92,
        positive: 88,
        negative: 4,
        summary: 'The feature reviewers agree on: two separate baskets that finish together.',
      },
    ],
    buyerQuestionAnswered: 'Will it still be working in a year?',
  },

  // ---------------------------------------------------------------- P02
  // 2026-11-20 S15 re-read: the *Product information → Features & Specs* table and
  // the *Item details* table were read live this session (they are served in the
  // `?lv=shuf` fallback variant of the page). Wattage, voltage, temperature
  // settings and the model number below come from those tables and supersede the
  // earlier "not stated" record for those fields.
  B09B7SB46R: {
    checked: '2026-11-20',
    readUrl: 'https://www.amazon.com/dp/B09B7SB46R',
    model: { code: '4-00675-02X-VN', basis: 'Product information → Item details → “Model Number” and “Part Number”, both 4-00675-02X-VN; “Model Name” reads “Extra Large 26 QT French Door Air Fryer Oven”' },
    wattage: { value: 1700, unit: 'W', basis: 'Product information → Features & Specs → “Output Wattage | 1700 watts” and “Wattage | 1700 watts”' },
    volt: { value: 120, unit: 'V', basis: 'Product information → Features & Specs → “Voltage | 120 volts”' },
    tempRangeF: { min: 75, max: 500, basis: 'Product information → Features & Specs → “Min Temperature Setting | 75 °F”, “Max Temperature Setting | 500 °F”. These are control settings, not a stated cooking-performance range; the 75 °F floor is a keep-warm-style low setting.' },
    dimensions: { value: '16.9″D × 15.8″W × 14.8″H', basis: 'specification table above “About this item” → Product Dimensions (re-read 2026-11-20, second pass); Capacity row reads 24.6 liters' },
    safetyListed: '',
    warrantyClaim: 'not stated on the listing page as read',
    presetCountContradiction: {
      titleSays: 24,
      bulletsSay: 25,
      bulletText: '“25 COOKING PRE-SETS: … Ribs, Defrost, Bake, Toast, Chicken, Pizza, Pastry, Slow Cook, Roast, Reheat, and Keep Warm.”',
      descriptionSays: 24,
      flag: 'FLG-013',
    },
    accessoriesContradiction: {
      titleSays: 6,
      descriptionSays: 7,
      flag: 'FLG-013',
      thirdDataPoint: 'Item details → “Configuration: Air Fryer Toaster Oven Combo with 24 Functions and 7 Accessories” and the Product Description both say 7; the title and the same Item details’ “Included Components” enumerate exactly six (Rack, Bake Pan, Drip Tray, Crisper Basket, Rotisserie Spit, Fetch Tool). Recorded 2026-11-20; still unresolved, still published with both values.',
    },
    dimensions: {
      value: '16.9″ D × 15.8″ W × 14.8″ H',
      basis: 'Product information → Measurements → “Item Dimensions D x W x H | 16.9"D x 15.8"W x 14.8"H”. Outer dimensions of the oven body; recorded 2026-11-20 (S15).',
    },
    statedUses: [
      'Rotisserie a 6-lb chicken (listing claim)',
      'Bake a 12-inch pizza (listing claim)',
      'Sized for 4–6 people (listing claim)',
      'Toast function turns the oven off when the toast timer ends (listing claim)',
      'Interior light and French doors that open with a single pull (listing claim)',
    ],
    themes: [
      {
        theme: 'Durability',
        mentions: 564,
        positive: 119,
        negative: 445,
        summary:
          'Amazon’s summary reports “significant durability issues”, with reviewers describing heating-element failure between roughly 9 and 14 months.',
      },
      {
        theme: 'Size / counter footprint',
        mentions: null,
        positive: null,
        negative: null,
        summary:
          'Reviewers quoted in the summary describe it as a good size that does not take up too much counter space, and praise the French doors for access.',
      },
    ],
    buyerQuestionAnswered: 'Is a 26 qt countertop oven a fixture or a gadget?',
  },

  // ---------------------------------------------------------------- P03
  B08DKYBTPH: {
    checked: '2026-11-20',
    readUrl: 'https://www.amazon.com/dp/B08DKYBTPH',
    model: { code: 'RJ38-SQSS-8T', basis: 'About this Item → “RESOURCES … 1000 Watts/120 Volts – RJ38-SQSS-8T”' },
    wattage: { value: 1000, unit: 'W', basis: 'About this Item → “RESOURCES”' },
    volt: { value: 120, unit: 'V', basis: 'same line' },
    wattageContradiction: {
      first: { value: 1000, where: 'About this Item → RESOURCES' },
      second: { value: 1700, where: 'Product Description → final line “1700W/120V”' },
      flag: 'FLG-013',
    },
    tempRangeF: { min: 200, max: 400, basis: 'About this Item → “a temperature range from 200-400°F”' },
    hiFryF: { value: 450, basis: 'Product Description → “HI-FRY button to crank the heat up to 450°F for the last two minutes”' },
    dimensions: { value: '12.75″D × 13.5″W × 10″H', basis: 'specification table above “About this item” → Product Dimensions (re-read 2026-11-20, second pass)' },
    safetyListed: 'cETL approved (listing claim)',
    warrantyClaim: '1-year warranty provided by Chefman (listing claim)',
    statedUses: [
      'Skips preheating (listing claim)',
      'Automatic shake reminders (listing claim)',
      '98% less oil than traditional fryers (listing claim, not measured by this desk)',
      'Basket and flat frying tray are top-rack dishwasher safe (listing claim)',
    ],
    warning: 'California Proposition 65 warning for acrylamide exposure is displayed on the listing.',
    themes: [],
    themeNote:
      'Review-theme summaries were not present in the served page for this ASIN on the check date, so no theme counts are published here. That is an absence of evidence, not evidence of good reviews.',
    buyerQuestionAnswered: 'One big batch, one machine — and what does it draw?',
  },

  // ---------------------------------------------------------------- P04
  B0DHZTCNR5: {
    checked: '2026-11-20',
    readUrl: 'https://www.amazon.com/dp/B0DHZTCNR5',
    model: { code: '', basis: 'not stated on the listing page as read' },
    wattage: { value: null, unit: 'W', basis: 'not applicable — battery-powered, wattage not stated' },
    volt: { value: null, unit: 'V', basis: 'not applicable' },
    tempRangeF: { min: null, max: null, basis: 'not stated on the listing page as read' },
    safetyListed: '',
    warrantyClaim: 'not stated on the listing page as read',
    powerSourceClaim: 'Runs on a AA battery (as described by reviewers in Amazon’s published review summary)',
    statedUses: [
      'Thermocouple sensor; 1-second reading (listing claim)',
      'NIST certification claimed for ±0.5°F accuracy (listing claim; certificate not sighted — FLG-006)',
      'Motion-activated wake and auto sleep (listing claim)',
      'Auto-rotating display (listing claim)',
      'Rinse-under-water cleaning (listing claim)',
      'Magnetic body (as described in Amazon’s published review summary)',
    ],
    themes: [
      {
        theme: 'Ease of use',
        mentions: 195,
        positive: 189,
        negative: 6,
        summary: 'Overwhelmingly positive: fast, readable, usable straight out of the box.',
      },
      {
        theme: 'Value for money',
        mentions: 173,
        positive: 142,
        negative: 31,
        summary: 'Mostly positive; reviewers repeatedly call it good value.',
      },
      {
        theme: 'Magnetic',
        mentions: 69,
        positive: 67,
        negative: 2,
        summary: 'A strongly liked feature: it stores on a fridge or grill.',
      },
      {
        theme: 'Durability',
        mentions: 79,
        positive: 36,
        negative: 43,
        summary:
          'Mixed, and the one to weigh: a small but real group report failure between three and ten months.',
      },
    ],
    buyerQuestionAnswered: 'Do I want an app with my thermometer?',
  },

  // ---------------------------------------------------------------- P05
  B0DZFD6R9Z: {
    checked: '2026-11-20',
    readUrl: 'https://www.amazon.com/dp/B0DZFD6R9Z',
    model: { code: 'CQ60-3C-Z1-E', basis: 'Product information → Item details → “Model CQ60-3C-Z1-E” and “Part Number CQ60-3C-Z1-E”; “Model Name” reads “iQ Sense”; UPC 810170921148 (re-read 2026-11-20, second pass — the earlier record of “not stated” was wrong)' },
    wattage: { value: null, unit: 'W', basis: 'not applicable — rechargeable hub, wattage not stated' },
    volt: { value: null, unit: 'V', basis: 'not applicable' },
    tempRangeF: { min: null, max: null, basis: 'not stated; a 1000°F heat tolerance is stated instead' },
    heatLimitF: { value: 1000, basis: 'About this Item → “built to endure 1000°F heat”' },
    dimensions: { value: 'Item Length 4.75 inches', basis: 'Product information → Measurements → “Item Length | 4.75 inches”; Features & Specs → “Immersion Depth | 4.75 inches” (re-read 2026-11-20, second pass)' },
    warrantyContradiction: {
      first: { value: 'two-year', where: 'About this Item → “RESOURCES: Built for long-lasting durability with a two-year assurance provided by CHEF iQ.”' },
      second: { value: '3 Year', where: 'Product information → Item details → “Warranty Description | 3 Year”' },
      flag: 'proposed FLG-016 by session arena-09d5d72b (S15-C); page disclosure pending — data.mjs owned by open PRs at the time of this edit',
    },
    accuracyClaim: 'accurate within 1°F (Product Description)',
    sensorClaim: '4 internal sensors plus 1 ambient sensor (About this Item)',
    safetyListed: '',
    warrantyClaim: 'two-year assurance provided by CHEF iQ (listing claim)',
    batteryContradiction: {
      first: { value: 50, unit: 'hours', where: 'About this Item → “running for up to 50 hours on a full charge”' },
      second: { value: 70, unit: 'hours', where: 'Product Description → “up to 70 hours of usage on a full charge”' },
      flag: 'FLG-013',
    },
    statedUses: [
      'Flip reminders, rest timers, estimated cook times and guided recipes (listing claim)',
      'Unlimited range over WiFi (listing claim; connectivity is the most-criticised theme)',
      'Waterproof, dishwasher-safe probes (listing claim)',
      'Hub speaker for audio alerts (listing claim)',
      'Options available for 1, 2, 3 or 4 probes (listing states these size options)',
    ],
    themes: [
      {
        theme: 'Reliability',
        mentions: 337,
        positive: 194,
        negative: 143,
        summary: 'Mixed; hub or probe failures are a recurring complaint.',
      },
      {
        theme: 'Connectivity',
        mentions: 137,
        positive: 32,
        negative: 105,
        summary:
          'The most negative theme on the listing: frequent disconnects between hub, probes and app, including after long ownership.',
      },
      {
        theme: 'Temperature monitoring',
        mentions: 134,
        positive: 92,
        negative: 42,
        summary:
          'Mostly positive for internal readings; several reviewers report ambient readings running low, and one reports probes ineffective above 260°F.',
      },
      {
        theme: 'Ease of use',
        mentions: 143,
        positive: 125,
        negative: 18,
        summary: 'Mostly positive, with setup described as simple.',
      },
      {
        theme: 'Setup',
        mentions: 75,
        positive: 55,
        negative: 20,
        summary: 'Mostly positive, though a minority call it too complicated.',
      },
      {
        theme: 'Value for money',
        mentions: 152,
        positive: 79,
        negative: 73,
        summary: 'Split, and closely tied to whether the connection held.',
      },
    ],
    buyerQuestionAnswered: 'Is the app and radio worth managing?',
  },
};

// ---------------------------------------------------------------- helpers

/** Formats a stated wattage, or returns null when the listing is silent. */
export function wattageLabel(asin) {
  const e = LISTING_EVIDENCE[asin];
  if (!e || !e.wattage || e.wattage.value == null) return null;
  return `${e.wattage.value} W`;
}

/** Formats a stated temperature range ("200–450°F"), or null. */
export function tempRangeLabel(asin) {
  const e = LISTING_EVIDENCE[asin];
  if (!e || !e.tempRangeF || e.tempRangeF.min == null) return null;
  return `${e.tempRangeF.min}–${e.tempRangeF.max}°F`;
}

/** True when the listing publishes review-theme counts we could transcribe. */
export function hasThemes(asin) {
  const e = LISTING_EVIDENCE[asin];
  return Boolean(e && e.themes && e.themes.length);
}

/** The single theme with the worst positive:negative ratio, if any. */
export function worstTheme(asin) {
  const e = LISTING_EVIDENCE[asin];
  if (!hasThemes(asin)) return null;
  return e.themes
    .filter((t) => t.mentions && t.mentions > 0)
    .sort((a, b) => a.positive / a.mentions - b.positive / b.mentions)[0] || null;
}
