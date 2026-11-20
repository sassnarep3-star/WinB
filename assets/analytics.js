/* Counterwise privacy-preserving event layer.
   Five defined events: page_view, outbound_click, guide_engaged,
   disclosure_view, affiliate_conversion_reported.
   - Records to a capped localStorage ledger on this device (no cookies, no PII,
     no third-party pixels). Site-wide counts require the first-party endpoint
     in assets/config.js (currently null = not provisioned, FLG-006).
   - affiliate_conversion_reported is NEVER fired by client code; it is entered
     only from a dated, authorized Associates report. */
(function () {
  "use strict";
  var CFG = window.CW_CONFIG || {};
  var ENDPOINT = CFG.analyticsEndpoint || null;
  var KEY = "cw_events_v1";
  var CAP = 500;
  var EVENTS = ["page_view", "outbound_click", "guide_engaged", "disclosure_view", "affiliate_conversion_reported"];

  function record(name, label) {
    if (EVENTS.indexOf(name) < 0 || name === "affiliate_conversion_reported") return;
    var ev = { e: name, t: new Date().toISOString(), l: String(label || "").slice(0, 120), p: location.pathname };
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "[]");
      a.push(ev);
      if (a.length > CAP) a = a.slice(a.length - CAP);
      localStorage.setItem(KEY, JSON.stringify(a));
    } catch (err) { /* storage blocked: endpoint path below still applies */ }
    if (ENDPOINT) {
      try {
        var body = JSON.stringify(ev);
        if (navigator.sendBeacon) { navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=UTF-8" })); }
        else { fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: body }); }
      } catch (err2) { /* never break the page over telemetry */ }
    }
  }

  window.CW = { record: record, events: EVENTS, endpointConfigured: !!ENDPOINT };

  record("page_view", location.pathname);

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var out = t.closest("a[data-outbound]");
    if (out) { record("outbound_click", out.getAttribute("data-label") || out.hostname); return; }
    var guide = t.closest("a[data-guide]");
    if (guide) { record("guide_engaged", guide.getAttribute("data-label") || guide.pathname); }
  }, true);

  if ("IntersectionObserver" in window) {
    var disc = document.querySelector(".disclosure");
    if (disc) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (x) {
          if (x.isIntersecting) { record("disclosure_view", location.pathname); obs.disconnect(); }
        });
      }, { threshold: 0.6 });
      io.observe(disc);
    }
  }

  if (document.body && document.body.getAttribute("data-page") === "guide") {
    setTimeout(function () { record("guide_engaged", location.pathname + ":15s"); }, 15000);
  }
})();
