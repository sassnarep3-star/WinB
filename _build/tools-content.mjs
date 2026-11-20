// tools-content.mjs — S15 additions: decision tools, trendy guides, FAQ matrix.
//
// This file is deliberately separate from data.mjs (owned by parallel sessions
// in PRs #37/#34/#25) so this session does not edit the shared register.
// Everything here follows the same rules as data.mjs:
//   * no price, no star rating, no sales rank, no popularity/search-volume claim
//   * no hands-on testing claim (F1: "You can't talk about your experience...")
//   * every factual claim attributed to a listing, to USDA FSIS (U1), or shown
//     as arithmetic; anything else is left blank / labelled unverified
//   * guide titles are question-shaped hypotheses, not claims about demand
//
// Last verified: 2026-11-20 (UTC) — sources re-fetched live this session:
// A1, A2, F1, U1, G1, G2, G4 (see COORDINATION.md S15 appendix).

export const NEW_GUIDES = [
  {
    slug: 'holiday-roast-thermometer',
    path: 'guides/holiday-roast-thermometer.html',
    kicker: 'Seasonal · Winter',
    title: 'Holiday roast thermometer: instant-read or leave-in?',
    summary:
      'A whole bird, a rest, and a safe leftover — which thermometer job is this? The USDA minimums and the rest time decide which tool earns its drawer.',
    readingTime: '5 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'Start with the number that matters',
        p: [
          'All poultry, including a whole bird, giblets and stuffing, has a USDA safe minimum internal temperature of 165°F (73.9°C), measured with a food thermometer before the food leaves the heat source. That number, not the clock and not the colour of the juices, is the definition of done.',
          'A holiday roast is the worst case for guessing: it is large, it is uneven, and it sits in the oven longer than your attention does. The question is not whether to use a thermometer. It is whether you want to check a number or watch one climb.',
        ],
      },
      {
        h: 'Checking versus watching',
        p: [
          'An instant-read is for checking: insert, read in about a second on the ThermoMaven listing claim, remove, rinse. It lives in a drawer, needs no app, and is the right tool when you are standing at the oven anyway.',
          'A leave-in probe is for watching: it stays in the meat, reads continuously, and lets you see the climb without opening the door and losing heat. The CHEF iQ Sense Gen3 listing states three probes and WiFi, so the reading arrives on a phone in another room.',
          'Neither is more accurate in the abstract. They solve different attention problems. If you cook one roast a year and stand over it, checking is enough. If you smoke, roast overnight, or leave the kitchen, watching is the point.',
        ],
      },
      {
        h: 'The rest is part of the number',
        p: [
          'For beef, pork, veal and lamb steaks, chops and roasts, the USDA figure is 145°F (62.8°C) with at least a three-minute rest. The rest is not a serving suggestion: temperature continues to equalise through the meat while it sits, and the standard assumes the full rest.',
          'A leave-in probe earns its keep here because it can stay in place through the rest. An instant-read can do the same job if you leave it inserted, but it is a handheld tool and the temptation is to remove it early. Whichever you own, do not skip the rest to save three minutes.',
        ],
      },
      {
        h: 'Leftovers are a second cook',
        p: [
          'Leftovers and casseroles have their own USDA minimum: 165°F (73.9°C). A roast that was safe at dinner is not automatically safe the next day. Reheat to the leftover number, not to “hot in the middle”.',
          'The calibration worksheet on this site walks through the ice-water check that tells you whether your thermometer can be trusted before you rely on it for either number.',
        ],
      },
    ],
    related: ['P04', 'P05', 'P02'],
    sources: ['U1', 'A2'],
  },
  {
    slug: 'game-day-wings',
    path: 'guides/game-day-wings.html',
    kicker: 'Seasonal · Sharing',
    title: 'Game-day wings: one big basket or two small ones?',
    summary:
      'One tray of wings for sharing, not two small ones — one basket or two? The answer is arithmetic on stated capacities, plus one question about sauce.',
    readingTime: '4 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'The arithmetic first',
        p: [
          'The Chefman 6 qt dual-basket states two independent 3 qt baskets: 3 + 3 = 6. The Chefman 8 qt TurboFry states one 8 qt basket. Eight quarts in one cavity is 2 qt more than the dual-basket total, held in a single place.',
          'That 2 qt difference is the whole game-day question. If your batch fills a 3 qt basket on its own, splitting it across two baskets means two batches anyway, and the second basket is a nuisance. If your batch is two different sauces at two different times, the split is the point.',
        ],
      },
      {
        h: 'Sauce decides more than capacity',
        p: [
          'Wings that are sauced in the basket need a single cavity you can toss in. Wings that are sauced after, in two flavours, need two cavities or two batches. Write down how you sauce before you compare machines.',
          'A French-door oven (the Emeril Lagasse 26 qt listing states a large interior and racks) changes the shape again: flat things on racks, not loose things in a drawer. For wings, a drawer you can shake is usually easier than a rack you must turn.',
        ],
      },
      {
        h: 'The five-minute check, with wings',
        p: [
          'Put the bag of wings you actually buy on the counter. Build a single flat layer in the footprint you expect the basket to have. Note how much of the bag that took. Multiply by the number of people you usually cook for. Compare that volume to the stated capacity, remembering the usable layer is well below the total.',
          'If your single layer needs more than about half the stated capacity, the machine will be crowded for your household and will need two batches. That is not a failure; it is a plan. The failure is expecting one batch from a machine that needs two.',
        ],
      },
    ],
    related: ['P03', 'P01', 'P02'],
    sources: ['A2'],
  },
  {
    slug: 'air-fryer-leftovers',
    path: 'guides/air-fryer-leftovers.html',
    kicker: 'Safety · Everyday',
    title: 'Air-fryer leftovers: what reheats safely?',
    summary:
      'Leftovers and casseroles have a USDA minimum of 165°F. An air fryer is a good reheater and a bad guesser — here is how to reheat to the number, not to “hot”.',
    readingTime: '4 min',
    published: '2026-11-20',
    sections: [
      {
        h: 'The number for leftovers',
        p: [
          'The USDA Food Safety and Inspection Service lists leftovers and casseroles at a minimum internal temperature of 165°F (73.9°C), measured with a food thermometer. That is higher than the 145°F minimum for steaks and fish, because leftovers have already been cooked once and the standard is stricter the second time.',
          '“Hot in the middle” is not a measurement. A thermometer is. An instant-read that reads in about a second (the ThermoMaven listing claim) makes this a ten-second check rather than a reason to skip it.',
        ],
      },
      {
        h: 'What an air fryer does well here',
        p: [
          'An air fryer reheats in a small, hot, moving-air cavity, which is why leftovers crisp instead of steaming. A dual-basket unit can reheat two different leftovers at two temperatures and finish them together; a single basket reheats one thing well.',
          'What it does not do is tell you the internal temperature. The machine’s timer is a setting, not a reading. Check the thickest part with a thermometer, especially for poultry leftovers, which share the 165°F minimum.',
        ],
      },
      {
        h: 'The three-step reheat',
        p: [
          'One: arrange leftovers in a single layer where you can, so heat reaches evenly. Two: reheat, then check the thickest part with a thermometer against 165°F for leftovers and casseroles. Three: if it is below the number, return it and check again — do not serve on the assumption that another minute would have done it.',
          'The thermometer calibration worksheet shows the ice-water check (32°F / 0°C) to run on the day a thermometer arrives, while you can still return it if it is out of tolerance.',
        ],
      },
    ],
    related: ['P04', 'P01', 'P03'],
    sources: ['U1', 'A2'],
  },
];

// ---------------------------------------------------------------------------
// Worksheets — printable decision tools. No data leaves the browser; the
// fields are for the reader's own measurements, printed or filled on screen.
// ---------------------------------------------------------------------------
export const WORKSHEETS = [
  {
    slug: 'capacity-worksheet',
    path: 'tools/capacity-worksheet.html',
    title: 'The five-minute capacity worksheet',
    lede: 'Measure your kitchen, not the listing. Five minutes with a tape measure and the bag of food you actually buy will tell you more than any quart figure.',
    steps: [
      { n: '1', h: 'Measure the home', p: 'Height under upper cabinets, counter depth from wall to front edge, internal sink width. Write them down before you look at any machine. An appliance that does not fit is a return, whatever its capacity.' },
      { n: '2', h: 'Build a single layer', p: 'Put the bag of frozen chips or wings you actually buy on the counter. Build one flat layer in the footprint you expect the basket to have. Note how much of the bag that took.' },
      { n: '3', h: 'Multiply by people', p: 'Multiply that layer by the number of people you usually cook for. That is your household volume.' },
      { n: '4', h: 'Compare to stated capacity', p: 'Compare your household volume to the stated quarts, remembering the usable layer is well below the total. If your single layer needs more than about half the stated capacity, expect two batches.' },
      { n: '5', h: 'Decide: split or single', p: 'Does anything you cook regularly fill a 3 qt basket on its own? If yes, a dual-basket unit will frustrate you. If you cook two foods at different temperatures at once, the split is the point.' },
    ],
    fields: ['Counter height available (cm/in):', 'Counter depth available (cm/in):', 'Sink internal width (cm/in):', 'Bag you tested with:', 'Single layer = ___ of bag · Household volume = ___', 'Stated capacity you are comparing to:', 'Verdict: one batch / two batches / does not fit'],
    related: ['P01', 'P03', 'P02'],
  },
  {
    slug: 'cleanup-worksheet',
    path: 'tools/cleanup-worksheet.html',
    title: 'Cleanup and counter-space worksheet',
    lede: 'The two costs nobody compares at purchase: how much of the sink it takes, and how much of the counter it permanently occupies.',
    steps: [
      { n: '1', h: 'Count the parts', p: 'Drawer unit: basket + crisper plate (about two parts). French-door oven: racks, basket, drip tray, often a spit — more parts, larger. List them.' },
      { n: '2', h: 'Test the fit', p: '"Dishwasher-safe" describes the coating, not the geometry. Will each part actually fit your dishwasher or sink? A safe tray that does not fit is a hand-wash item.' },
      { n: '3', h: 'Decide the home', p: 'Will it live in a cupboard or on the counter? Cord, weight and residue usually mean it stays out. Measure the counter spot it will actually occupy.' },
      { n: '4', h: 'Check clearance', p: 'Rear and top clearance requirements are in the manual, not the title. Check them before committing to a spot under a cabinet.' },
    ],
    fields: ['Parts to wash:', 'Largest part vs sink/dishwasher fit:', 'Where it will live:', 'Clearance required (manual):', 'Silicone-tipped tongs owned? (protects coating)'],
    related: ['P02', 'P01', 'P03'],
  },
  {
    slug: 'thermometer-calibration',
    path: 'tools/thermometer-calibration.html',
    title: 'Thermometer calibration worksheet',
    lede: 'Calibrate once, then trust it. The ice-water check takes thirty seconds and tells you whether the number on the screen can be believed.',
    steps: [
      { n: '1', h: 'Make ice water', p: 'Fill a glass with crushed ice and water. Stir. Let it sit a minute so the whole glass is at one temperature.' },
      { n: '2', h: 'Insert and wait', p: 'Put the probe in for thirty seconds, not touching the glass. It should read 32°F (0°C).' },
      { n: '3', h: 'Adjust or return', p: 'If it does not read 32°F, use the adjustment the manufacturer provides, or return it. Do this on the day it arrives, while you can still return it.' },
      { n: '4', h: 'Check against USDA minimums', p: 'Steaks/chops/roasts 145°F + 3-minute rest · Ground meats 160°F · All poultry 165°F · Fish 145°F · Leftovers/casseroles 165°F. Source: USDA FSIS Safe Minimum Internal Temperature Chart (U1).' },
    ],
    fields: ['Thermometer model:', 'Ice-water reading (should be 32°F):', 'Adjusted? Y/N · New reading:', 'Date calibrated:', 'USDA minimum you will check first:'],
    related: ['P04', 'P05'],
  },
];

// ---------------------------------------------------------------------------
// Chooser — "Which one fits your kitchen?" Four questions, no tracking,
// no network, no score. The result is a starting point, not a ranking.
// ---------------------------------------------------------------------------
export const CHOOSER = {
  questions: [
    {
      id: 'cook',
      q: 'What do you cook most often?',
      options: [
        { v: 'two', label: 'Two foods at once, different temperatures' },
        { v: 'big', label: 'One big batch — wings, fries, a whole tray' },
        { v: 'flat', label: 'Flat things on racks — toast, fish, a tray of veg' },
        { v: 'long', label: 'Long cooks I want to walk away from' },
        { v: 'quick', label: 'Quick checks — is it done yet?' },
      ],
    },
    {
      id: 'space',
      q: 'Where will it live?',
      options: [
        { v: 'sink', label: 'I can lift it out and wash it in the sink' },
        { v: 'counter', label: 'It will stay on the counter as a fixture' },
        { v: 'drawer', label: 'In a drawer / cupboard when not in use' },
      ],
    },
    {
      id: 'app',
      q: 'How do you feel about an app?',
      options: [
        { v: 'noapp', label: 'No app — just a number on a screen' },
        { v: 'okapp', label: 'An app is fine if it watches while I am away' },
      ],
    },
  ],
  // Mapping is editorial fit, not a score. Each result names a starting
  // point and the page to read before deciding.
  results: {
    two: { id: 'P01', why: 'Two independent baskets at two temperatures, finishing together — the only unit here built for that job.' },
    big: { id: 'P03', why: 'One deep 8 qt basket for a single big batch, without splitting it across two small ones.' },
    flat: { id: 'P02', why: 'A French-door oven cavity with racks for flat things, toast and roasting — a fixture, not a drawer.' },
    long: { id: 'P05', why: 'A leave-in wireless probe that watches the climb while you walk away. Needs an app and WiFi.' },
    quick: { id: 'P04', why: 'A handheld instant-read for a fast number and a rinse under the tap. No app, lives in a drawer.' },
  },
};

// ---------------------------------------------------------------------------
// Buyer-questions FAQ matrix. Every answer is attributed; blanks stay blank.
// ---------------------------------------------------------------------------
export const FAQ = [
  {
    q: 'Basket or oven-style — what should I compare?',
    a: 'How you get food in and out, and where the machine lives. A basket is a drawer you lift, shake and wash in the sink. An oven is a door and racks in a machine that stays on the counter. Measure counter depth and sink width first. See the basket-or-oven guide.',
    src: 'A2',
    cat: 'air-fryers',
  },
  {
    q: 'How do I compare air fryer capacity without hype?',
    a: 'Ignore quarts until you have built a single flat layer of the food you actually buy, multiplied by the people you cook for, and compared that volume to the stated capacity. If your layer needs more than about half the stated capacity, expect two batches. The capacity worksheet walks through it.',
    src: 'A2',
    cat: 'air-fryers',
  },
  {
    q: 'What are the cleanup and counter-space trade-offs?',
    a: 'Count dishwasher parts, not features. A drawer has about two parts that fit a normal sink; a French-door oven has racks, a basket, a drip tray and often a spit. "Dishwasher-safe" describes the coating, not the geometry. Decide the home before you buy — most air fryers end up on the counter permanently.',
    src: 'A2',
    cat: 'air-fryers',
  },
  {
    q: 'What temperature is actually "done"?',
    a: 'USDA FSIS minimums: beef/pork/veal/lamb steaks, chops and roasts 145°F (62.8°C) with a 3-minute rest; ground meats 160°F (71.1°C); all poultry 165°F (73.9°C); fish and shellfish 145°F (62.8°C); leftovers and casseroles 165°F (73.9°C). Measured with a food thermometer before food leaves the heat source.',
    src: 'U1',
    cat: 'thermometers',
  },
  {
    q: 'Instant-read or leave-in thermometer?',
    a: 'Checking a number takes an instant-read (the ThermoMaven listing states a 1-second read). Watching a temperature climb over a long cook takes a leave-in probe (the CHEF iQ Sense Gen3 listing states three probes and WiFi). Wanting both, honestly, is owning two tools.',
    src: 'A2',
    cat: 'thermometers',
  },
  {
    q: 'Can I see the price and star rating here?',
    a: 'No — deliberately. Amazon permits price display only when Amazon serves the link or data comes via Creators API / PA API. This static site has neither, so no price and no rating is reproduced. Check the listing for today’s price. See FLG-005.',
    src: 'A2',
    cat: 'all',
  },
  {
    q: 'Has this desk tested any of these products?',
    a: 'No. FTC guidance states you cannot talk about your experience with a product you have not tried. Every page therefore describes what the manufacturer listing states, shows its arithmetic, and lists what it cannot tell you. See FLG-004.',
    src: 'F1',
    cat: 'all',
  },
  {
    q: 'Why are some cells blank in the comparison table?',
    a: 'Because the listing does not state the value in the data this desk could read, and estimating it would be an inaccurate claim about a product — which the Program Policies prohibit. Blanks are labelled "not stated" rather than filled in. See FLG-014.',
    src: 'A2',
    cat: 'all',
  },
];

// ---------------------------------------------------------------------------
// November editorial picks — timely framing of existing guides.
// Labelled as editorial hypotheses. NOT a popularity, search-volume or
// sales ranking. No "trending" claim is made about search data.
// ---------------------------------------------------------------------------
export const NOVEMBER_PICKS = [
  {
    kicker: 'November · Roasts',
    title: 'Holiday roast thermometer: instant-read or leave-in?',
    href: '/guides/holiday-roast-thermometer.html',
    note: 'The long-cook question, with the USDA rest time front and centre.',
  },
  {
    kicker: 'November · Sharing',
    title: 'Game-day wings: one big basket or two small ones?',
    href: '/guides/game-day-wings.html',
    note: 'One tray for sharing, decided by 2 qt of arithmetic and how you sauce.',
  },
  {
    kicker: 'November · Weeknights',
    title: 'Basket or oven-style air fryer: what should you compare?',
    href: '/guides/basket-or-oven.html',
    note: 'Two foods at once, or one big thing? The format question that settles most of it.',
  },
  {
    kicker: 'November · Leftovers',
    title: 'Air-fryer leftovers: what reheats safely?',
    href: '/guides/air-fryer-leftovers.html',
    note: 'Reheat to 165°F, not to "hot". A ten-second check with an instant-read.',
  },
];
