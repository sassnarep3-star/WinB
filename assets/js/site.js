/* Counterwise site script.
 * Two jobs, both honest:
 * 1) UI: open the More menu on tap, mobile nav.
 * 2) Events: emit the five defined events ONLY when a real ingestion
 *    endpoint is configured in <meta name="cw-analytics-endpoint">.
 *    Default state (empty) = fully inert: no storage, no fetch, no queue.
 *    No cookies, no fingerprinting, no IP beyond what the endpoint server
 *    itself would log. See /desk/ (S-04) for provisioning options.
 */
(function () {
  "use strict";

  var meta = document.querySelector('meta[name="cw-analytics-endpoint"]');
  var endpoint = meta && meta.content ? meta.content : "";

  // --- UI: mobile / details menu niceties (always on, zero data) ---
  var nav = document.querySelector(".mainnav");
  if (nav) {
    nav.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a && nav.querySelector("details[open]")) nav.querySelector("details").removeAttribute("open");
    });
  }

  if (!endpoint) return; // gate closed: nothing else runs.

  function send(name, props) {
    try {
      var payload = Object.assign({ ev: name, path: location.pathname, ts: Date.now() }, props || {});
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        var img = new Image();
        img.src = endpoint + "?p=" + encodeURIComponent(body);
      }
    } catch (e) { /* measurement must never break the page */ }
  }

  addEventListener("load", function () { send("page_view"); }, { once: true });

  var done50 = false;
  addEventListener("scroll", function () {
    if (done50) return;
    var h = document.documentElement;
    if (h.scrollTop / (h.scrollHeight - h.clientHeight) > 0.5) {
      done50 = true;
      send("guide_engaged");
    }
  }, { passive: true });

  var disc = document.getElementById("disclosure");
  if (disc && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { send("disclosure_view"); io.disconnect(); }
      });
    });
    io.observe(disc);
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if (/^https?:\/\/([\w.-]+\.)?(amazon\.com|amzn\.to|amzn\.eu|link\.amazon)(\/|$)/i.test(a.href)) {
        send("outbound_click", { href: a.href, slot: a.getAttribute("data-cw-slot") || "", rel: a.rel || "" });
      }
    },
    true
  );
})();
