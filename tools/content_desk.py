# content_desk.py — dashboard surfaces: register, workflow, measurement, flagged,
# suggestions, questions, executive summary, 404.
from content_data import (SITE, PRODUCTS, SUBMISSIONS, OBSERVATIONS, SOURCES,
                          FINDINGS, FLAGS, SUGGESTIONS, QUESTIONS, EVENTS, LEDGER_COLUMNS)
from theme import BASE

BUILT = SITE["built"]


def sub(pid):
    return next(s for s in SUBMISSIONS if s["product"] == pid)


def obs(pid):
    return next(o for o in OBSERVATIONS if o["product"] == pid)


BLANK = '<span class="blank">blank</span> <span class="badge-unverified">unverified</span>'


# ---------------------------------------------------------------------------
def executive_summary_body():
    rows = []
    for p in PRODUCTS:
        o = obs(p["id"])
        rows.append("<tr><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td></tr>"
                    % (p["id"], p["short_name"], o["observed_category"], o["observed_asin"]))
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">Executive summary</p>
    <h1>The project in one page.</h1>
    <p class="lede">Counter &amp; Crisp is a live, source-first Amazon affiliate site for five
    submitted products — three air fryers and two meat thermometers — published with disclosure
    above the fold on every page, sponsored marks on every product link, and an evidence trail
    behind every claim. Built 2026-11-20.</p>
    <div class="stat-row">
      <div class="stat"><div class="stat-num">5 / 5</div><div class="stat-label">submitted links observed resolving to amazon.com listings</div></div>
      <div class="stat"><div class="stat-num">12</div><div class="stat-label">official sources verified and linked</div></div>
      <div class="stat"><div class="stat-num">0</div><div class="stat-label">unverified numbers published — blanks are deliberate</div></div>
      <div class="stat"><div class="stat-num">8</div><div class="stat-label">flagged items awaiting your decision</div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    <div>
      <h2 style="margin-top:0">What exists now</h2>
      <ul>
        <li><strong>A shop, not an audit.</strong> The landing page leads with products and
        question-shaped guides; every dashboard surface sits one click away in the footer.</li>
        <li><strong>Five products, honestly labelled.</strong> Seller claims from listing titles are
        recorded as claims. Price and rating are blank everywhere — they could not be verified from
        an official source, and we don't guess.</li>
        <li><strong>Compliance built in.</strong> The exact Associates-required statement appears
        under the masthead and in the footer of every page; product links carry
        <span class="badge-sponsor">sponsored</span> marks and <code>rel="sponsored"</code>.</li>
        <li><strong>Measurement ready.</strong> A privacy-preserving click counter with a defined
        five-event taxonomy ships live in local-only mode; the self-hosted endpoint contract is
        documented, deployment pending (FLG-006).</li>
        <li><strong>Findable.</strong> One canonical site URL, sitemap.xml, RSS feed, per-page
        metadata and structured data.</li>
      </ul>
      <h2>The five products</h2>
      <div class="table-scroll">
        <table class="data">
          <thead><tr><th>ID</th><th>Product</th><th>Observed category</th><th>Observed target ASIN</th></tr></thead>
          <tbody>%s</tbody>
        </table>
      </div>
      <p class="fn">"Observed" = what each submitted link resolved to on 2026-11-20. It is logged
      separately from the submitted identifiers and is not yet a confirmed mapping (FLG-001).</p>
    </div>
    <div>
      <h2 style="margin-top:0">What you must decide</h2>
      <ol>
        <li><strong>Run the one-link test (FLG-003).</strong> Per product: click the submitted link
        in the enrolled Associates workflow, confirm destination and tracking report. The short
        links' compliance status is unresolved — we make no claim that they are invalid.</li>
        <li><strong>Confirm the mappings (FLG-001).</strong> Browser-check each redirect and record
        the official listing URL + confirmation date in the intent record.</li>
        <li><strong>Confirm the tracking ID (FLG-008)</strong> — shopnow047c-20 — inside Associates
        Central.</li>
        <li><strong>Choose the analytics host (FLG-006)</strong> so the campaign ledger can start
        filling from first-party reports.</li>
        <li><strong>Review the suggestion queue</strong> — 12 proposals with impact/effort/risk, all
        deliberately unimplemented until you pick.</li>
      </ol>
      <h2>What we refused to do</h2>
      <ul>
        <li>No inferred prices, ratings, or dimensions.</li>
        <li>No claim that the submitted links are valid <em>or</em> invalid — only a dated
        observation log and a validation gate.</li>
        <li>No fabricated author, no fabricated test results, no revenue forecasts.</li>
      </ul>
      <div class="button-row">
        <a class="btn" href="%s/flagged.html">Open Flagged for Review</a>
        <a class="btn btn-ghost" href="%s/suggestions.html">Review suggestions</a>
        <a class="btn btn-ghost" href="%s/questions.html">Open questions</a>
      </div>
    </div>
  </div>
</section>
""" % ("".join(rows), BASE, BASE, BASE)


# ---------------------------------------------------------------------------
def register_body():
    src_rows = []
    for s in SOURCES:
        src_rows.append("""<tr id="%s">
  <td><strong>%s</strong></td><td>%s</td>
  <td><a href="%s" rel="noopener">%s</a></td>
  <td>%s</td><td>%s</td>
</tr>""" % (s["id"].lower(), s["id"], s["org"], s["url"], s["title"], s["supports"], s["how"]))

    intent_rows = []
    obs_rows = []
    for p in PRODUCTS:
        s = sub(p["id"])
        o = obs(p["id"])
        intent_rows.append("""<tr>
  <td><strong>%s</strong> — %s</td>
  <td><a class="sponsored-link" data-product="%s" href="%s" rel="sponsored nofollow noopener" target="_blank">%s</a>
      <span class="badge-sponsor">sponsored</span></td>
  <td><code>%s</code> <span class="badge-open">format: 9 chars</span></td>
  <td>%s</td>
  <td>%s</td>
  <td>Project brief to this session, 2026-11-20</td>
</tr>""" % (p["id"], p["short_name"], p["id"], s["submitted_url"], s["submitted_url"],
            s["submitted_id"], BLANK, BLANK))
        obs_rows.append("""<tr>
  <td><strong>%s</strong></td>
  <td><a href="%s" rel="noopener">%s</a></td>
  <td>%s</td>
  <td>%s</td>
  <td>Server-side fetch, %s</td>
  <td>Resolved URL carried transient params (<code>lv=shuf</code>, <code>plpRedirect=mhFallback</code>,
      <code>btn_ref</code>) — mapping observed, not confirmed</td>
</tr>""" % (p["id"], o["observed_url"], o["observed_url"], o["observed_title"],
            o["observed_breadcrumb"], o["observed_date"]))

    prod_rows = []
    for p in PRODUCTS:
        o = obs(p["id"])
        prod_rows.append("""<tr id="reg-%s">
  <td><strong>%s</strong></td>
  <td>%s<br><span class="src">%s</span></td>
  <td>%s</td>
  <td>%s</td>
  <td>%s</td>
  <td>%s</td>
  <td><a href="%s" rel="noopener">%s</a></td>
</tr>""" % (p["id"].lower(), p["id"], p["short_name"], p["format"], p["one_liner"],
            "; ".join(p["claims"]), BLANK, BLANK, o["observed_url"], o["observed_url"]))

    find_rows = "".join(
        "<tr><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td></tr>"
        % (fid, text, srcname, ('<a href="#%s">%s</a>' % (anchor.lower(), anchor)) if anchor else "—")
        for fid, text, srcname, anchor in FINDINGS)

    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Register</p>
    <h1>Source &amp; product register.</h1>
    <p class="lede">Every entry on this site, its evidence, and its gaps. Blank cells are
    deliberate: if a value could not be confirmed from an official source, it is left blank and
    flagged — never inferred. This page is the machine-readable conscience of the project.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="sources">1. Source register — official sites only</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Verification date for all rows: 2026-11-20 (session arena/6fc7de34).</caption>
        <thead><tr><th>ID</th><th>Organization</th><th>Document</th><th>What it supports</th><th>Verification performed</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2 id="intent">2. Product-intent confirmation record</h2>
    <div class="callout callout-amber">
      <h4>Design rule</h4>
      <p>Intent fields (what was submitted) and observation fields (what we saw) are kept in
      <strong>separate tables and never merged</strong>. Amazon's ASIN gives a checkable identifier
      for the intended listing; a redirect observation is evidence about a link, not a confirmation
      of intent. Confirmation requires a human browser check (FLG-001).</p>
    </div>

    <h3>Table A — Intent fields (as submitted)</h3>
    <div class="table-scroll">
      <table class="data">
        <caption>Intended identifiers exactly as supplied. Official listing URL and confirmation
        date stay blank until confirmed in a browser.</caption>
        <thead><tr><th>Product</th><th>Submitted link</th><th>Intended ASIN (as submitted)</th><th>Official listing URL</th><th>Confirmation date</th><th>Source of record</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h3>Table B — Observation fields (as observed, kept separate)</h3>
    <div class="table-scroll">
      <table class="data">
        <caption>What each submitted link resolved to when fetched on 2026-11-20. Observations are
        logged evidence, not confirmations.</caption>
        <thead><tr><th>Product</th><th>Observed redirect target</th><th>Observed listing title</th><th>Observed category breadcrumb</th><th>Method &amp; date</th><th>Notes</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2 id="products">3. Working product register</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Claims = seller statements copied verbatim from observed listing titles, untested
        by us. Price/rating blank (FLG-002 / FLG-007).</caption>
        <thead><tr><th>ID</th><th>Product</th><th>What it's for</th><th>Listing-title claims</th><th>Price</th><th>Rating</th><th>Source (observed listing)</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2 id="findings">4. Findings &amp; analysis</h2>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>ID</th><th>Finding</th><th>Evidence</th><th>Source anchor</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <p class="fn">Irregularities raised by these findings are published on
    <a href="%s/flagged.html">Flagged for Review</a> and do not block publication.</p>
  </div>
</section>
""" % ("".join(src_rows), "".join(intent_rows), "".join(obs_rows), "".join(prod_rows), find_rows, BASE)


# ---------------------------------------------------------------------------
def workflow_body():
    steps = [
        ("1", "Draft", "Question-shaped draft written against the cluster plan; claims collected with candidate sources.", "Manual (editor)"),
        ("2", "Source check", "Every factual claim matched to an official source URL; unmatched claims deleted, not softened.", "Automatable: link checker (tools/check_links.py) verifies every cited URL is present; judgment stays manual"),
        ("3", "Disclosure &amp; endorsement check", "Disclosure strip present above the fold; product links marked sponsored; no unverifiable claims; endorsement context reviewed against the Operating Agreement and FTC guidance.", "Gated — human review (S01 · S07 · S24)"),
        ("4", "Link validation gate", "One link per product tested in the enrolled Associates workflow: destination and tracking report confirmed. Ambiguous links are not scaled (FLG-003).", "Gated — human, Associates Central"),
        ("5", "Publish", "Page added; sitemap.xml and feed.xml regenerate automatically from the build script; canonical URL set.", "Automated (tools/build_site.py)"),
        ("6", "Measure", "Five defined events counted (privacy-preserving); campaign ledger rows added only from authorized first-party reports, with provenance.", "Automated counter; gated ledger entry"),
        ("7", "Iterate", "Next topic chosen from measured queries (Search Console), not instinct. Optimization changes go through the suggestion queue first.", "Measure before automating optimization"),
    ]
    step_rows = "".join(
        "<tr><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td></tr>" % s for s in steps)
    checks = [
        ("Required statement verbatim under masthead + footer on every page",
         "Associates Operating Agreement / help (SRC-05, SRC-06)", "Automated — build template", "Pass"),
        ("Every product link marked sponsored (visible badge + rel=\"sponsored\")",
         "FTC Endorsement Guides (SRC-01, SRC-02, SRC-12)", "Automated — build template", "Pass"),
        ("No unverified values published (blank-and-flag policy)",
         "Project verification rules", "Automated — check_links.py + register review", "Pass"),
        ("Seller claims labelled as claims wherever quoted",
         "FTC honesty principle (SRC-01)", "Manual review", "Pass"),
        ("One-link destination + tracking test per product before scaling links",
         "Associates Program Policies (SRC-04)", "Manual — Associates Central", "Blocked by FLG-003 — not yet run"),
        ("Endorsement context / disclosure placement reviewed against OA + FTC guidance",
         "SRC-01, SRC-02, SRC-05", "Manual — reviewer checklist", "Scheduled each publish (S01 · S07 · S24)"),
        ("API policy checks (pricing/spec data only from authorized sources)",
         "Associates Program Policies (SRC-04)", "Gated — PA-API enrollment pending (SUG-010)", "Pending"),
    ]
    check_rows = "".join(
        '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>' % c for c in checks)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Workflow</p>
    <h1>Publishing workflow &amp; compliance gate.</h1>
    <p class="lede">Automate what can be automated; put a gate in front of what cannot. This is the
    pipeline every page passes through — including the checks the brief calls S01, S07, and S24
    (disclosure placement and endorsement context, reviewed against the Associates Operating
    Agreement and FTC guidance).</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>The pipeline</h2>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>Step</th><th>Stage</th><th>What happens</th><th>Automated or gated</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2 id="compliance">The compliance gate</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>Status as of %s. Sources are linked in the <a href="%s/register.html#sources">source register</a>.</caption>
        <thead><tr><th>Check</th><th>Authority</th><th>How enforced</th><th>Status</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <div class="callout">
      <h3>The one-link test (before any link scales)</h3>
      <p>Per the brief and Amazon's own guidance: for each product, use the enrolled Associates
      workflow to test one link, confirm it lands on the intended destination, and confirm the
      click appears in the tracking report. Results go in the
      <a href="%s/register.html#intent">intent record</a>. Until then, the submitted short links
      remain exactly as supplied, marked sponsored, with their compliance status recorded as
      <strong>unresolved</strong> — we do not claim they are invalid (FLG-003).</p>
    </div>
  </div>
</section>
""" % (step_rows, BUILT, BASE, check_rows, BASE)


# ---------------------------------------------------------------------------
def measurement_body():
    event_rows = "".join(
        "<tr><td><code>%s</code></td><td>%s</td><td><code>%s</code></td><td>%s</td></tr>" % e
        for e in EVENTS)
    ledger_cols = "".join("<th>%s</th>" % c for c in LEDGER_COLUMNS)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Measurement</p>
    <h1>Measurement before optimization.</h1>
    <p class="lede">The counter runs on day one so the campaign ledger has somewhere honest to come
    from. It is privacy-preserving by design, and the ledger stays empty until authorized
    first-party reports fill it — a measured zero beats a manufactured number.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>The five defined events</h2>
    <p>The brief refers to "the five defined events" without enumerating them in this session's
    copy, so the working taxonomy below is defined here and flagged for confirmation (FLG-005).
    Payload fields: <code>e</code> event, <code>p</code> page path (no query strings), <code>a</code>
    observed ASIN where relevant, <code>t</code> timestamp.</p>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>Event</th><th>Trigger</th><th>Fields</th><th>Notes</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2 id="privacy">Privacy note</h2>
    <div class="callout">
      <ul>
        <li><strong>No cookies.</strong> Nothing is written to the visitor's cookie jar; session
        continuity uses sessionStorage and clears when the tab closes.</li>
        <li><strong>No personal data, no IP capture, no fingerprints.</strong> The payload carries
        an event name, a page path, a product id, and a timestamp. Nothing else.</li>
        <li><strong>Local-only mode is live.</strong> Until an endpoint is deployed, tallies stay in
        the visitor's own browser (localStorage) and can be exported or deleted by them at any time.
        Nothing is transmitted anywhere.</li>
        <li><strong>When the endpoint goes live</strong> (FLG-006), it receives only the payload
        above via <code>navigator.sendBeacon</code>, and its operator must not log IP addresses or
        user agents. That constraint is part of the contract below.</li>
      </ul>
    </div>

    <h2>Self-hosted collect endpoint — contract</h2>
    <p>GitHub Pages serves static files only, so the endpoint must live elsewhere (a small worker,
    function, or VPS). The contract is fixed and tiny; deploy it and set
    <code>&lt;meta name="cc-collect-endpoint"&gt;</code> in the page head to activate delivery.</p>
    <pre><code>POST  &lt;endpoint&gt;
Content-Type: application/json

{"events":[
  {"e":"outbound_click","p":"/products.html","a":"B0CDY277D3","t":1763606400000}
]}

→ 204 No Content
Rules: no IP logging · no user-agent logging · no cookie · aggregate only</code></pre>

    <div class="tally-box">
      <h3>Your local tally (this browser)</h3>
      <p>This is what the counter has counted for <em>your</em> visit so far — it never left your
      browser.</p>
      <pre id="tally-output"><code>{}</code></pre>
      <div class="button-row">
        <a class="btn btn-small" href="#" id="tally-download">Download my tally (JSON)</a>
        <a class="btn btn-ghost btn-small" href="#" id="tally-reset">Reset my tally</a>
      </div>
    </div>

    <h2>Campaign ledger — empty and well-defined</h2>
    <p>Rows are added <strong>only</strong> when obtained from authorized first-party reports
    (Amazon Associates reports; the self-hosted counter once live). Each row keeps a dated
    provenance trail. No conversion score, no revenue forecast, no estimates — ever.</p>
    <div class="table-scroll">
      <table class="data">
        <caption>Campaign ledger — 0 rows. First row is expected after the one-link test (FLG-003)
        and endpoint deployment (FLG-006).</caption>
        <thead><tr>%s</tr></thead>
        <tbody>
          <tr><td colspan="7" class="blank">No rows yet — awaiting authorized first-party reports.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>Cadence &amp; iteration policy</h2>
    <ul class="checklist">
      <li><strong>Publishing cadence:</strong> two question-shaped guides per month plus seasonal
      edits; every guide joins sitemap.xml and feed.xml automatically at build time.</li>
      <li><strong>Measure before writing more:</strong> after 2–4 weeks of Search Console data
      (SUG-006), the next topics come from measured queries — the current five titles are declared
      hypotheses.</li>
      <li><strong>Measure before automating optimization:</strong> no auto-rewrites, no auto-pricing
      updates, no auto-ranking changes. Optimization proposals enter the
      <a href="%s/suggestions.html">suggestion queue</a> like everything else.</li>
      <li><strong>Reader capture (SG-30):</strong> RSS is live (<a href="%s/feed.xml">feed.xml</a>);
      email capture is a proposal (SUG-011), not a dark pattern in waiting.</li>
    </ul>
  </div>
</section>
""" % (event_rows, ledger_cols, BASE, BASE)


# ---------------------------------------------------------------------------
def flagged_body():
    rows = "".join(
        '<tr id="%s"><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
        % (fid.lower(), fid, title, detail, status, refs)
        for fid, title, detail, status, refs in FLAGS)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Review room</p>
    <h1>Flagged for review.</h1>
    <p class="lede">Nothing here blocks the site. These are the irregularities, gaps, and unresolved
    questions we found while verifying the project line by line — published with their evidence so
    you can review them after launch and request changes.</p>
    <div class="callout callout-amber">
      <h4>How to use this page</h4>
      <p>Each row names what is unresolved, why, and what decision or action would close it. When
      you decide, tell us the decision and it moves to the register with a dated note. Items may
      stay open indefinitely — silence is acceptable; silent guessing is not.</p>
    </div>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>ID</th><th>Item</th><th>Why it's flagged</th><th>Status / decision needed</th><th>References</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>
    <h2>The standing promises</h2>
    <ul class="checklist">
      <li>We do not claim the submitted short links are invalid. Their compliance status is
      <strong>unresolved</strong> and tested one link at a time (FLG-003).</li>
      <li>We never merge observed redirect targets into intended-ASIN fields.</li>
      <li>We never publish a number we couldn't source — the blank cells stay blank until an
      authorized source fills them.</li>
    </ul>
  </div>
</section>
""" % rows


# ---------------------------------------------------------------------------
def suggestions_body():
    rows = "".join(
        '<tr id="%s"><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td class="blank">awaiting decision</td></tr>'
        % (sid.lower(), sid, area, title, what, impact, effort, risk, status)
        for sid, area, title, what, impact, effort, risk, status, _decision in SUGGESTIONS)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Review room</p>
    <h1>Suggestion review queue.</h1>
    <p class="lede">Improvements to decision quality, findability, and operations — collected here
    instead of implemented, so you can pick the best path before anything changes. Every row states
    its expected impact qualitatively; we don't forecast numbers we can't measure.</p>
    <div class="callout callout-blue">
      <h4>How to use this queue</h4>
      <p>Scan the table; pick what you want; reply with the SUG ids (or ask for a ranked shortlist
      against a goal, e.g. "best three for organic traffic"). Nothing is implemented from this
      queue without an explicit decision — that is the whole point of the queue.</p>
    </div>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>ID</th><th>Area</th><th>Suggestion</th><th>What &amp; why</th><th>Expected impact</th><th>Effort</th><th>Risk</th><th>Status</th><th>Decision</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2>Design-brief digest (feeds the next design prompt)</h2>
    <p>If all proposals were approved, the next design prompt could read:</p>
    <div class="callout">
      <p><em>"Evolve Counter &amp; Crisp into a seasonal, measured publication: quarterly seasonal
      edits and a question-cluster content calendar driven by Search Console data; an interactive
      chooser on the compare page; compliant licensed product imagery; named editorial authorship;
      a deployed privacy-preserving analytics endpoint feeding a first-party campaign ledger; and
      PA-API-backed dated price/spec sync — with the disclosure strip above the fold everywhere and
      the blank-field policy intact."</em></p>
    </div>
    <p class="fn">Blocked-by flags: SUG-005 → FLG-006 · SUG-007 &amp; SUG-012 → FLG-002 ·
    SUG-010 → API enrollment. See <a href="%s/flagged.html">Flagged for Review</a>.</p>
  </div>
</section>
""" % (rows, BASE)


# ---------------------------------------------------------------------------
def questions_body():
    answered = [q for q in QUESTIONS if q[3] == "answered"]
    open_q = [q for q in QUESTIONS if q[3] == "open"]
    a_rows = "".join(
        '<tr id="%s"><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td></tr>'
        % (qid.lower(), qid, q, a, refs)
        for qid, q, a, _st, refs, _path in answered)
    o_rows = "".join(
        '<tr id="%s"><td><strong>%s</strong></td><td>%s</td><td>%s</td><td><span class="badge-open">open</span> %s</td><td>%s</td></tr>'
        % (qid.lower(), qid, q, a, refs, path)
        for qid, q, a, _st, refs, path in open_q)
    return """
<section class="standalone">
  <div class="wrap">
    <p class="kicker">The desk · Review room</p>
    <h1>Questions, answers, and what's missing.</h1>
    <p class="lede">A decision is only as good as the information behind it. This register lists
    what we know (with sources), what we don't (with a discovery path), and which decisions each
    open item blocks. It exists so nobody has to guess what's missing — including us.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Answered — with official sources</h2>
    <div class="table-scroll">
      <table class="data">
        <thead><tr><th>ID</th><th>Question</th><th>Answer</th><th>Source</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2>Open — with a discovery path for each</h2>
    <div class="table-scroll">
      <table class="data">
        <caption>No open question here is answered by inference. Each carries the concrete step
        that would answer it.</caption>
        <thead><tr><th>ID</th><th>Question</th><th>What we know so far</th><th>Flag / anchor</th><th>How to discover the missing information</th></tr></thead>
        <tbody>%s</tbody>
      </table>
    </div>

    <h2>What each open item blocks</h2>
    <div class="two-col">
      <div class="callout">
        <h3>Blocks link scaling</h3>
        <p>Q-06 (link compliance) · Q-09 (tracking ID enrollment) — until the one-link test passes,
        submitted links stay as supplied and unscaled.</p>
        <h3>Blocks the data layer</h3>
        <p>Q-08 (prices) · Q-12 (claim documentation) — price/rating/spec cells stay blank.</p>
      </div>
      <div class="callout">
        <h3>Blocks measurement maturity</h3>
        <p>Q-10 (event taxonomy) · Q-11 (endpoint host) · Q-13 (query data) — the ledger and the
        measured editorial backlog depend on these.</p>
        <h3>Blocks trust upgrades</h3>
        <p>Q-15 (named editor) — E-E-A-T improvements wait for a real person.</p>
      </div>
    </div>
  </div>
</section>
""" % (a_rows, o_rows)


# ---------------------------------------------------------------------------
def notfound_body():
    return """
<section class="standalone">
  <div class="narrow" style="text-align:center">
    <p class="kicker">404</p>
    <h1>This page didn't make it onto the counter.</h1>
    <p class="lede">The link you followed doesn't exist here. The lineup and the guides are one
    click away.</p>
    <div class="button-row" style="justify-content:center">
      <a class="btn" href="%s/index.html">Back to the front page</a>
      <a class="btn btn-ghost" href="%s/products.html">Browse the lineup</a>
      <a class="btn btn-ghost" href="%s/guides.html">Read the guides</a>
    </div>
  </div>
</section>
""" % (BASE, BASE, BASE)
