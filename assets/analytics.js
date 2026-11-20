/* Counterwise — privacy-preserving event counter.
 *
 * Design rules, all enforced here rather than by policy:
 *   - no cookies, no localStorage, no identifiers, no fingerprint values
 *   - payload is exactly {event, path} plus {asin, product} for product clicks
 *   - Do Not Track and Global Privacy Control are honoured
 *   - if ENDPOINT is empty nothing is sent, and nothing breaks
 *
 * To turn it on: set ENDPOINT to your collector URL. That is the only change.
 * Endpoint choice is open question Q-08.
 */
(function () {
  "use strict";

  var ENDPOINT = "";               // <-- deliberately empty; see /dashboard/analytics.html
  var EVENTS = ["page_view", "outbound_click", "product_click", "guide_complete", "subscribe"];

  function optedOut() {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return true;
    if (navigator.msDoNotTrack === "1") return true;
    if (navigator.globalPrivacyControl === true) return true;
    return false;
  }

  function path() {
    return location.pathname.replace(/\/index\.html$/, "/");
  }

  function send(event, extra) {
    if (EVENTS.indexOf(event) === -1) return;   // only the five defined events
    if (optedOut()) return;
    if (!ENDPOINT) return;                       // no endpoint, no data, no error
    var body = { event: event, path: path() };
    if (extra) {
      if (extra.asin) body.asin = String(extra.asin).slice(0, 20);
      if (extra.product) body.product = String(extra.product).slice(0, 80);
      if (extra.channel) body.channel = String(extra.channel).slice(0, 20);
    }
    try {
      var payload = JSON.stringify(body);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
          credentials: "omit"
        }).catch(function () {});
      }
    } catch (e) { /* measurement must never break the page */ }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js-on");

    if (sessionStorage.getItem && !sessionStorage.getItem("cw_seen")) {
      try { sessionStorage.setItem("cw_seen", "1"); } catch (e) {}
      send("page_view");
    } else {
      send("page_view");
    }

    document.addEventListener("click", function (ev) {
      var a = ev.target.closest ? ev.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var isStorefront = a.hasAttribute("data-outbound");
      var isProductCard = a.getAttribute("href") && /\/reviews\//.test(a.getAttribute("href"));

      if (isStorefront) {
        send("outbound_click", { asin: a.getAttribute("data-asin"), product: a.getAttribute("data-product") });
      } else if (isProductCard) {
        send("product_click", { product: (href.split("/").pop() || "").replace(".html", "") });
      } else if (a.hasAttribute("data-subscribe")) {
        send("subscribe", { channel: a.getAttribute("data-subscribe") });
      }
    }, true);

    // guide_complete: passed 90% of a long article.
    if (/\/guides\//.test(location.pathname) || /\/reviews\//.test(location.pathname)) {
      var fired = false;
      var onScroll = function () {
        if (fired) return;
        var doc = document.documentElement;
        var seen = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (seen >= 0.9) {
          fired = true;
          send("guide_complete");
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  });
})();
