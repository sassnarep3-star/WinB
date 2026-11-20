# content_guides.py — the five question-shaped buying guides (publication content).
from content_data import SITE
from theme import BASE

BUILT = SITE["built"]


def meta_row(cluster, reading="7 min"):
    return """<div class="meta-row">
    <span>By the Counter &amp; Crisp Desk</span>
    <span>Published %s</span>
    <span>Cluster: %s</span>
    <span>~%s read</span>
    <span><a href="%s/guides.html">All guides</a></span>
  </div>""" % (BUILT, cluster, reading, BASE)


def sources_block(items):
    lis = "".join('<li>%s</li>' % it for it in items)
    return ('<h2>Sources</h2><ul>%s</ul>' % lis)


SRC_USDA = ('USDA FSIS, <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/'
            'food-safety-basics/safe-temperature-chart">Safe Minimum Internal Temperature Chart</a> (retrieved 2026-11-20)')
SRC_CPSC = ('U.S. CPSC, <a href="https://www.cpsc.gov/Recalls">Recalls &amp; Product Safety Warnings</a> '
            '(searchable; includes an Air Fryer category — retrieved 2026-11-20)')
SRC_FTC = ('FTC, <a href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking">'
           'Endorsement Guides: What People Are Asking</a> (retrieved 2026-11-20)')


def p_inline(pid, line):
    from content_pages import sponsored_link
    return ('<div class="prod-inline"><span class="prod-name">%s</span><span>%s</span>%s</div>'
            % (pid, line, sponsored_link("P-0" + pid[-1] if pid.startswith("P-0") else pid)))


def prod_inline(pname, line, link_html):
    return ('<div class="prod-inline"><span class="prod-name">%s</span><span>%s</span>%s</div>'
            % (pname, line, link_html))


# ---------------------------------------------------------------------------
GUIDE_BASKET_VS_OVEN = """
<section class="standalone">
  <div class="narrow">
    <p class="kicker">Guide · Air fryers</p>
    <h1>Basket or oven-style air fryer: what should you compare?</h1>
    %s
    <p class="lede">This is the first fork in the road, and the spec sheet is the wrong place to
    settle it. The two shapes cook differently, clean differently, and live on your counter
    differently. Compare those three things and the choice usually makes itself.</p>
  </div>
</section>

<section class="section">
  <article class="article">
    <div class="callout">
      <h3>The short version</h3>
      <p><strong>Basket style</strong> wins on preheat speed, crisping power per square foot, and
      simplicity: load, shake, eat. <strong>Oven style</strong> wins on formats — racks, trays,
      toast, a small roast — at the cost of a bigger footprint and slower preheat. A
      <strong>dual basket</strong> splits the difference when two foods must finish together.
      Decide with the meals you cooked last week, not the functions on the box.</p>
    </div>

    <h2>What is actually different between the shapes?</h2>
    <p>Both move hot air fast. What differs is geometry. A basket concentrates airflow around one
    deep, narrow load — great for a pile of fries, less great for anything that needs to lie flat.
    An oven spreads the same air across racks: more surface area in a single layer, more formats
    (a tray of vegetables, a pizza, a reheat that isn't a microwave), and a window to watch it
    happen.</p>
    <p>That geometry decides the practical stuff:</p>
    <ul class="checklist">
      <li><strong>Loading.</strong> Basket = drop in and shake. Oven = arrange on a rack or tray.
      If you cook for one or two, the basket's simplicity compounds daily.</li>
      <li><strong>Preheat.</strong> Small, dense chambers come to temperature faster. If "dinner in
      20 minutes" is the whole point, this matters more than quart counts.</li>
      <li><strong>Visibility.</strong> Oven doors let you check without losing heat; baskets make
      you pull the drawer. Neither is wrong; one matches how you cook.</li>
      <li><strong>The second meal.</strong> Oven styles quietly replace a toaster and sometimes a
      full-size oven for small jobs. Basket styles replace frying. These are different promises.</li>
    </ul>

    <h2>The meals test — the only comparison that matters</h2>
    <p>Before you compare anything else, list five dinners you actually made in the last month.
    For each one, ask where it would land in each shape:</p>
    <div class="table-scroll">
      <table class="data">
        <caption>Decision aid — no product data required. Fill this in from your own kitchen.</caption>
        <thead><tr><th>Your meal</th><th>One big pile (basket)?</th><th>Flat layers / racks (oven)?</th><th>Two foods at once (dual)?</th></tr></thead>
        <tbody>
          <tr><td>Fries, wings, nuggets</td><td>Excellent fit</td><td>Works, spread out</td><td>Excellent fit</td></tr>
          <tr><td>Sheet-pan vegetables</td><td>Needs shaking</td><td>Excellent fit</td><td>Good fit</td></tr>
          <tr><td>Toast, bagels, reheat</td><td>Not the point</td><td>Excellent fit</td><td>Not the point</td></tr>
          <tr><td>Protein + side, same time</td><td>Two batches</td><td>One load if there's room</td><td>Excellent fit</td></tr>
          <tr><td>Small roast or whole bird</td><td>Rarely fits</td><td>Depends on interior</td><td>Rarely fits</td></tr>
        </tbody>
      </table>
    </div>
    <p class="fn">Whichever column wins on your real meals is your shape. Everything after this is
    refinement.</p>

    <h2>The honest trade-offs</h2>
    <div class="two-col">
      <div class="callout">
        <h3>Basket style gives up</h3>
        <p>Flat formats and visibility. Tall capacity is deceptive: an 8 qt drawer that holds a
        heaped pile cooks unevenly if you skip the shake. And nothing toasts.</p>
      </div>
      <div class="callout">
        <h3>Oven style gives up</h3>
        <p>Counter space and speed. French doors and drop-down doors both need clearance you should
        measure before the box arrives — not after.</p>
      </div>
    </div>

    <h2>Where the three on our desk land</h2>
    %s
    %s
    %s
    <p class="fn">Each shape on the desk, in order: dual basket, oven style, big single drawer.
    Listing-title claims are the seller's statements — see the <a href="%s/register.html">register</a>
    for what is and isn't verified. Links are sponsored; we earn from qualifying purchases.</p>

    <h2>Questions to ask before checkout</h2>
    <ul class="checklist">
      <li>Where will it live, and can its door or drawer fully open there?</li>
      <li>Which of last week's five meals does it handle without a workaround?</li>
      <li>What's the largest thing I'd ever cook in it — and does that actually fit?</li>
      <li>Which parts touch food, and are they dishwasherable (the listing's claim — confirm which parts)?</li>
      <li>Has this model been recalled? Check <a href="https://www.cpsc.gov/Recalls">CPSC's database</a> before buying.</li>
    </ul>
    %s
  </article>
</section>
""" % (
    meta_row("Air fryers"),
    prod_inline("Dual basket — Chefman 6 qt", "Two independent 3 qt sides with a sync-finish option, per the listing title. The 'two foods at once' column, personified.", __import__("content_pages").sponsored_link("P-01")),
    prod_inline("Oven style — Emeril Lagasse 26 qt", "French-door countertop oven; 24 presets claimed in the listing title. The rack-and-tray column.", __import__("content_pages").sponsored_link("P-02")),
    prod_inline("Big drawer — Chefman TurboFry 8 qt", "One deep basket with a 450 °F Hi-Fry finish step claimed in the title. The pile-of-fries column.", __import__("content_pages").sponsored_link("P-03")),
    BASE,
    sources_block([SRC_CPSC, SRC_FTC]),
)

GUIDE_CAPACITY = """
<section class="standalone">
  <div class="narrow">
    <p class="kicker">Guide · Air fryers</p>
    <h1>A no-hype checklist for comparing air fryer capacity.</h1>
    %s
    <p class="lede">Capacity numbers on boxes are like screen inches on TVs: technically true,
    practically slippery. Two "6 qt" machines can hold very different dinners. Here is how to
    compare what fits, without trusting a number we can't see measured.</p>
  </div>
</section>

<section class="section">
  <article class="article">
    <div class="callout">
      <h3>The short version</h3>
      <p>Judge capacity by <strong>what fits in one layer</strong>, not by quarts in a headline.
      Get the interior dimensions from the listing (ask the seller if absent), then map them to the
      foods you actually cook. Households don't need "more capacity" in the abstract — they need
      one less batch on the nights that matter.</p>
    </div>

    <h2>Why quart numbers mislead</h2>
    <p>Capacity figures are manufacturer statements. We have not verified how each brand measures
    them, and shapes confound comparison: a tall 8 qt drawer and a wide 6 qt chamber hold different
    shapes of food. A number you can't see measured is a number you can only use for rough sorting —
    so let's do the rough sorting honestly, then move to what fits.</p>

    <h2>The checklist</h2>
    <ul class="checklist">
      <li><strong>Get the interior, not the exterior.</strong> Ask: "What are the usable interior
      dimensions with the rack/basket in cooking position?" Sellers answer this; boxes rarely say.</li>
      <li><strong>Think in layers.</strong> Air frying depends on surface contact. Capacity that
      requires heaping means steaming, not crisping. Plan for one layer plus a shake.</li>
      <li><strong>Name your biggest night.</strong> Not the average Tuesday — the night four people
      want fries and something else needs the oven. Can one batch cover it?</li>
      <li><strong>Count the batches, not the quarts.</strong> A useful thought experiment: for your
      two most-cooked foods, how many loads would each candidate need? One load beats two almost
      every time.</li>
      <li><strong>For oven styles, count racks — and rack spacing.</strong> Two racks that fit
      simultaneously mean something only if both can hold your actual tray.</li>
      <li><strong>Whole birds and roasts:</strong> measure the food you buy, not the appliance's
      adjectives. A 4 lb chicken needs interior length and height you can verify.</li>
      <li><strong>Check the recall list.</strong> Before you buy any model, search it in
      <a href="https://www.cpsc.gov/Recalls">CPSC's recall database</a>.</li>
    </ul>

    <h2>Capacity by household — as questions, not rules</h2>
    <p>Nobody on this desk has weighed your household, so here is the decision as questions:</p>
    <div class="table-scroll">
      <table class="data">
        <caption>Capacity decision aid. No serving-size numbers are published here because we
        cannot source them; your meals are the data.</caption>
        <thead><tr><th>If your reality is…</th><th>Ask yourself…</th></tr></thead>
        <tbody>
          <tr><td>Cooking for one or two most nights</td><td>Would a compact basket that preheats in minutes beat a big chamber you half-fill?</td></tr>
          <tr><td>Family sides every night</td><td>Does one batch of the most-cooked side feed everyone, or will you run it twice — every night?</td></tr>
          <tr><td>Weekend hosting</td><td>Is the big night served by one wide load (oven style) or two synced loads (dual basket)?</td></tr>
          <tr><td>Holiday cooking</td><td>Does the appliance help with the main event, or is it relief capacity for the sides while the oven does the bird?</td></tr>
        </tbody>
      </table>
    </div>

    <h2>The two capacity claims on our desk, stated honestly</h2>
    %s
    %s
    <p class="fn">Both statements above are quoted from listing titles — the seller's claims, not
    measurements we performed. Compare them to the checklist questions, not to each other.</p>

    <h2>One test to run at home (after purchase)</h2>
    <p>Buy your most-cooked food once in its usual package and load it in a single layer the first
    time you use the machine. Whatever fits there is your real capacity. Write it on a sticky note
    inside the cabinet door. That number — yours — beats anything on the box.</p>
    %s
  </article>
</section>
""" % (
    meta_row("Air fryers", "6 min"),
    prod_inline("8 qt, claimed", "Chefman TurboFry 8 qt: '8 Qt' and a 450 °F Hi-Fry option are stated in the listing title.", __import__("content_pages").sponsored_link("P-03")),
    prod_inline("26 qt, claimed", "Emeril Lagasse 26QT: '26QT' and 'Extra Large Interior' are stated in the listing title — oven volume, not basket volume.", __import__("content_pages").sponsored_link("P-02")),
    sources_block([SRC_CPSC]),
)

GUIDE_CLEANUP = """
<section class="standalone">
  <div class="narrow">
    <p class="kicker">Guide · Air fryers</p>
    <h1>How to assess cleanup and counter-space trade-offs.</h1>
    %s
    <p class="lede">An air fryer that lives on the counter costs you square inches every day and
    minutes after every meal. Those are the two bills nobody puts on the box. Here's how to total
    them before you buy.</p>
  </div>
</section>

<section class="section">
  <article class="article">
    <div class="callout">
      <h3>The short version</h3>
      <p>Count the <strong>parts that touch food</strong> and ask which are dishwasherable (get it in
      writing — "dishwasher-safe" in a title is a claim about parts, and sellers mean different
      things). Then measure the counter <em>and the swing space</em>. If the machine is annoying to
      clean or impossible to place, its other virtues stop mattering by week three.</p>
    </div>

    <h2>The cleanup audit — seven questions</h2>
    <ul class="checklist">
      <li>Which parts touch food? (basket, tray, rack, crisper plate, drip pan, door glass…)</li>
      <li>For each, does the listing say dishwasher-safe — and is that the whole part, or just the
      removable insert?</li>
      <li>Is the coating nonstick, and what does the listing say about utensils and abrasives?
      (Nonstick durability is a common complaint across the category — check reviews <em>on the
      listing</em>, where you can see what's verified.)</li>
      <li>Where does grease go? A well-placed drip tray is the difference between a wipe and a
      project.</li>
      <li>How many separate pieces must dry before reassembly? Drying racks have limits too.</li>
      <li>Can the door glass come clean without contortions? Oven styles earn their keep here — or
      lose it.</li>
      <li>What did the seller say when you asked? (Sellers answer cleanup questions remarkably
      candidly — it's a good use of the "questions" box on any listing.)</li>
    </ul>

    <h2>The counter audit</h2>
    <ul class="checklist">
      <li>Measure the spot: width × depth. Then measure the <em>opening</em> — basket drawers pull
      toward you; french doors swing up; drop-downs fold down.</li>
      <li>Check overhead clearance. A french-door oven under low cabinets may not open fully.</li>
      <li>Leave the rear gap the manual will demand. Heat needs an exit; the listing or manual
      states the requirement.</li>
      <li>Weigh the move: heavy machines become permanent furniture. If you'll store it in a
      cabinet, can you lift it there?</li>
      <li>Cord length and outlet position decide placement more often than design does.</li>
    </ul>

    <h2>How the trade-off usually lands</h2>
    <div class="two-col">
      <div class="callout">
        <h3>Small households</h3>
        <p>Compact baskets win: minimal parts, fast cleanup, modest footprint. The trade-off — no
        toast duty, smaller flat formats — often doesn't bite.</p>
      </div>
      <div class="callout">
        <h3>Frequent hosts</h3>
        <p>Oven styles earn their footprint through rack formats and batch surface area — if, and
        only if, the counter can host them permanently.</p>
      </div>
    </div>

    <h2>On the desk</h2>
    %s
    %s
    %s
    <p class="fn">Cleanup claims above (dishwasher-safe baskets, nonstick parts, accessory counts)
    are listing-title statements — the seller's words. The register keeps them labelled as claims.</p>

    <h2>Before you buy</h2>
    <ul class="checklist">
      <li>Run the seven cleanup questions against the listing; note which are unanswered.</li>
      <li>Tape out the footprint on the counter tonight, including door swing.</li>
      <li>Search the model in <a href="https://www.cpsc.gov/Recalls">CPSC recalls</a> — the database
      has an Air Fryer category for exactly this reason.</li>
    </ul>
    %s
  </article>
</section>
""" % (
    meta_row("Air fryers", "6 min"),
    prod_inline("Chefman 6 qt dual basket", "Listing title states nonstick, dishwasher-safe baskets — confirm whether that covers both baskets and any crisper trays.", __import__("content_pages").sponsored_link("P-01")),
    prod_inline("Chefman TurboFry 8 qt", "Listing title states an XL nonstick dishwasher-safe basket and stainless finish.", __import__("content_pages").sponsored_link("P-03")),
    prod_inline("Emeril Lagasse 26 qt oven", "Listing title states six included accessories — ask which are dishwasher-safe; door glass is the usual cleanup question on oven styles.", __import__("content_pages").sponsored_link("P-02")),
    sources_block([SRC_CPSC]),
)

GUIDE_MULTIFUNCTION = """
<section class="standalone">
  <div class="narrow">
    <p class="kicker">Guide · Buying method</p>
    <h1>Questions to ask before buying a multi-function kitchen appliance.</h1>
    %s
    <p class="lede">Ten functions on the box usually means three you'll use, one you'll use badly,
    and six you'll forget. That's fine — if the three are the ones you wanted. Here is how to check,
    before the appliance becomes a very expensive toast rack.</p>
  </div>
</section>

<section class="section">
  <article class="article">
    <div class="callout">
      <h3>The short version</h3>
      <p>Judge a multi-function machine by its <strong>core function</strong> — the one you're buying
      it for — and treat the rest as free extras. Then ask the ten questions below. The appliance
      passes if the core function is strong, the weekly functions are real, and the machine fits
      your kitchen's physics.</p>
    </div>

    <h2>The ten questions</h2>
    <ol>
      <li><strong>What is the core function?</strong> Name it in one word: "air-fry", "toast",
      "roast". If you can't name it, you're buying a brochure.</li>
      <li><strong>Which functions would I use weekly?</strong> Be ruthless. A dehydrator you'll use
      once is not a reason to buy anything.</li>
      <li><strong>What does it replace?</strong> Multi-function only pays off if something leaves
      the counter or the cabinet. Name the outgoing tool.</li>
      <li><strong>Does the core function get the best of the machine?</strong> An "air fryer oven"
      should air-fry well first and toast well second. Read the listing's own description of how —
      and check reviews on the listing for the core function specifically.</li>
      <li><strong>What are the real dimensions at full function?</strong> Rotisserie spits, door
      swings, and rack spacing are where "compact" claims go to die. Ask the seller for usable
      interior dimensions.</li>
      <li><strong>Where do the accessories live?</strong> Six included accessories (a common claim)
      means six things to store. If they don't fit in the machine, they need a home.</li>
      <li><strong>What's the learning curve?</strong> 24 presets sound generous and teach you
      nothing. Manual time-and-temperature control is the function that outlasts the honeymoon.</li>
      <li><strong>What's the heat-up reality?</strong> Big chambers take longer. Ask preheat times
      for the core function; sellers answer this.</li>
      <li><strong>How is cleanup divided?</strong> <a href="%s/guide-cleanup.html">The cleanup audit</a>
      scales with the number of functions: more functions, more parts.</li>
      <li><strong>Is it recalled?</strong> Search <a href="https://www.cpsc.gov/Recalls">CPSC's
      database</a> for the model before purchase. Cheap peace of mind, official source.</li>
    </ol>

    <h2>The swap test</h2>
    <p>Write the appliance's functions in one column and your current tools in the other. A
    multi-function purchase is only rational when the arrows go: function → tool it retires. Any
    row with no arrow is a marketing row.</p>
    <div class="table-scroll">
      <table class="data">
        <caption>Worked example — fill the right column yourself; we won't guess your kitchen.</caption>
        <thead><tr><th>Function on the box</th><th>What it retires in my kitchen (fill in)</th><th>Weekly? (yes/no)</th></tr></thead>
        <tbody>
          <tr><td>Air fry</td><td class="blank">your answer</td><td class="blank">your answer</td></tr>
          <tr><td>Toast / reheat</td><td class="blank">your answer</td><td class="blank">your answer</td></tr>
          <tr><td>Bake / roast</td><td class="blank">your answer</td><td class="blank">your answer</td></tr>
          <tr><td>Dehydrate / rotisserie / proof…</td><td class="blank">your answer</td><td class="blank">your answer</td></tr>
        </tbody>
      </table>
    </div>

    <h2>A multi-function example on the desk</h2>
    %s
    <p class="fn">Claims quoted from the listing title. The register records them as seller claims;
    no preset count on this site is an endorsement of preset quality.</p>

    <h2>If you only remember one thing</h2>
    <p>Buy the core function; let the extras be a pleasant surprise. The opposite — buying the
    extras and inheriting the core function's mediocrity — is how cabinets fill up.</p>
    %s
  </article>
</section>
""" % (
    meta_row("Buying method", "6 min"),
    BASE,
    prod_inline("Emeril Lagasse 26 qt French Door", "Listing title claims 24 one-touch presets, six accessories, and a large interior — run all ten questions against it before deciding.", __import__("content_pages").sponsored_link("P-02")),
    sources_block([SRC_CPSC]),
)

GUIDE_THERMOMETERS = """
<section class="standalone">
  <div class="narrow">
    <p class="kicker">Guide · Thermometers</p>
    <h1>Instant-read or smart wireless: which meat thermometer setup fits your kitchen?</h1>
    %s
    <p class="lede">One thermometer answers a question in a second. The other watches the whole
    cook and taps you on the shoulder. Both beat the old method — cutting into the roast to look —
    and one of them keeps the USDA number honest without any guesswork at all.</p>
  </div>
</section>

<section class="section">
  <article class="article">
    <div class="callout">
      <h3>The short version</h3>
      <p><strong>Instant-read</strong> if you cook at the stove and grill: grab, poke, read in
      seconds. <strong>Wireless leave-in</strong> if you host, smoke, or roast whole birds: the
      probe stays in, the base or app tracks the climb. Many kitchens eventually want both — start
      with the one that matches last week's cooking.</p>
    </div>

    <h2>The numbers to cook to</h2>
    <p>A thermometer is only as useful as the target you trust. These are the USDA's safe minimum
    internal temperatures — the actual reason to own this tool:</p>
    <div class="table-scroll">
      <table class="data">
        <caption>Source: USDA FSIS Safe Minimum Internal Temperature Chart, retrieved 2026-11-20.
        <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart">Official chart</a>.</caption>
        <thead><tr><th>Product</th><th>Minimum internal temperature &amp; rest time</th></tr></thead>
        <tbody>
          <tr><td>Beef, pork, veal &amp; lamb — steaks, chops, roasts</td><td>145 °F (62.8 °C) with at least 3 minutes of rest</td></tr>
          <tr><td>Ground meats</td><td>160 °F (71.1 °C)</td></tr>
          <tr><td>All poultry (breasts, whole bird, thighs, wings, ground, giblets, stuffing)</td><td>165 °F (73.9 °C)</td></tr>
          <tr><td>Ham, fresh or smoked (uncooked)</td><td>145 °F (62.8 °C) with at least 3 minutes of rest</td></tr>
          <tr><td>Fish &amp; shellfish</td><td>145 °F (62.8 °C)</td></tr>
          <tr><td>Eggs</td><td>160 °F (71.1 °C)</td></tr>
          <tr><td>Leftovers &amp; casseroles</td><td>165 °F (73.9 °C)</td></tr>
        </tbody>
      </table>
    </div>
    <p class="fn">USDA notes consumers may cook to higher temperatures for personal preference —
    never lower for safety. This table is quoted from the official chart; verify against the source
    link if you're cooking for someone vulnerable.</p>

    <h2>How the two styles differ where it counts</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Decision aid — style comparison. Product-specific specs are claims from listing
        titles where quoted.</caption>
        <thead><tr><th>Question</th><th>Instant-read</th><th>Wireless leave-in</th></tr></thead>
        <tbody>
          <tr><td>How fast do you get an answer?</td><td>Seconds (one listing on our desk claims 1-second reads)</td><td>Continuous once placed</td></tr>
          <tr><td>Where is the food?</td><td>Stove, grill, smoker — you're standing there</td><td>Oven, grill, smoker — you're across the room</td></tr>
          <tr><td>Big holiday bird?</td><td>Good for the final check</td><td>Better: the whole climb, without opening the oven</td></tr>
          <tr><td>What can go wrong?</td><td>Lost in a drawer; battery; dropped once</td><td>App and connectivity; probe care; charging</td></tr>
          <tr><td>Heat tolerance</td><td>Probe handles spot-checks; display stays in your hand</td><td>Probes live in the heat — check the stated max (one listing claims 1000 °F)</td></tr>
        </tbody>
      </table>
    </div>

    <h2>Claims worth interrogating</h2>
    <p>Thermometer listings love precision language. Two rules for reading them:</p>
    <ul class="checklist">
      <li><strong>Accuracy claims need evidence.</strong> If a listing claims ±0.5 °F or
      certification, ask the seller for documentation and record the answer. We track exactly this
      as open question <a href="%s/questions.html">Q-12</a> — and we leave our own accuracy column
      blank until evidence exists.</li>
      <li><strong>Calibrate or verify at home.</strong> An ice-water bath reads ~32 °F; boiling
      water ~212 °F at sea level. If the probe disagrees by more than its own claimed tolerance,
      that's your answer, whatever the title says.</li>
    </ul>

    <h2>The two on our desk</h2>
    %s
    %s
    <p class="fn">Listing-title claims are the seller's statements. Certification and accuracy
    claims in particular are unverified by us — see <a href="%s/flagged.html">Flagged for Review</a>.</p>

    <h2>Before you buy</h2>
    <ul class="checklist">
      <li>Match the style to last week: did you stand at the stove, or walk away from an oven?</li>
      <li>Check the probe's stated heat limit against how you actually cook (grate-level heat is brutal).</li>
      <li>For wireless: confirm the app supports your phone's OS version and ask about probe warranty.</li>
      <li>Ask the seller what backs any certification or accuracy claim; save the answer.</li>
      <li>Bookmark the <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart">USDA chart</a> — it's the whole point of the tool.</li>
    </ul>
    %s
  </article>
</section>
""" % (
    meta_row("Thermometers", "8 min"),
    BASE,
    prod_inline("ThermoMaven 1-second instant-read", "Listing title claims 1-second readout, ±0.5 °F accuracy and certification — accuracy and certification remain unverified (FLG-002).", __import__("content_pages").sponsored_link("P-04")),
    prod_inline("CHEF iQ Sense (Gen 3)", "Listing title claims three wireless probes, WiFi monitoring, and 1000 °F heat-safe probes — verify heat placement limits in the manual.", __import__("content_pages").sponsored_link("P-05")),
    BASE,
    sources_block([SRC_USDA]),
)
