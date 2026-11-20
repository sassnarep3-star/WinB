/* Counter & Crisp — privacy-preserving event counter.
 *
 * What it does: counts five defined events (page_view, session, product_impression,
 * outbound_click, guide_view) and stores aggregate tallies locally in the visitor's
 * browser. If a collect endpoint is configured (via <meta name="cc-collect-endpoint">),
 * batches are also POSTed to it with navigator.sendBeacon.
 *
 * What it never does: no cookies, no cross-site identifiers, no IP capture, no user
 * agents, no referrer strings, no query strings. Payload fields are: event name, page
 * path only (no query), product id (observed ASIN) when relevant, coarse timestamp.
 *
 * Endpoint contract (self-hosted, e.g. a small worker/function):
 *   POST  <endpoint>
 *   body: {"events":[{"e":"outbound_click","p":"/products.html","a":"B0CDY277D3","t":1763600000000}]}
 *   204 No Content on success. Server must not log IP addresses or user agents.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "cc-tally-v1";
  var SESSION_KEY = "cc-session-v1";
  var MAX_QUEUE = 50;

  function endpoint() {
    var m = document.querySelector('meta[name="cc-collect-endpoint"]');
    return (m && m.content && m.content.indexOf("http") === 0) ? m.content : "";
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* private mode or disabled storage: fall through to memory-only */ }
    return { events: {}, total: 0, byPage: {}, started: new Date().toISOString() };
  }

  function save(tally) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tally));
    } catch (e) { /* memory-only mode */ }
  }

  var tally = load();

  function record(eventName, product) {
    var payload = {
      e: eventName,
      p: window.location.pathname.replace(/\/WinB/, "") || "/",
      a: product || null,
      t: Date.now()
    };
    tally.events[eventName] = (tally.events[eventName] || 0) + 1;
    tally.total = (tally.total || 0) + 1;
    var page = payload.p;
    if (!tally.byPage[page]) tally.byPage[page] = {};
    tally.byPage[page][eventName] = (tally.byPage[page][eventName] || 0) + 1;
    save(tally);
    queue(payload);
  }

  var queue = (function () {
    var buffer = [];
    function flush() {
      if (!buffer.length) return;
      var url = endpoint();
      if (url && navigator.sendBeacon) {
        try {
          navigator.sendBeacon(url, JSON.stringify({ events: buffer.splice(0, buffer.length) }));
        } catch (e) { buffer = []; }
      } else {
        // Local-only mode: tallies stay in this browser (see measurement.html).
        buffer = [];
      }
    }
    return function (payload) {
      buffer.push(payload);
      if (buffer.length >= MAX_QUEUE) flush();
      else window.setTimeout(flush, 4000);
    };
  })();

  function isFirstEventOfSession() {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return false;
      window.sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    } catch (e) {
      return true;
    }
  }

  function boot() {
    var type = document.body.getAttribute("data-page-type") || "page";
    if (isFirstEventOfSession()) record("session");
    record("page_view");
    if (type === "guide") record("guide_view");

    // product_impression: fired when a product card/row first becomes visible.
    if ("IntersectionObserver" in window) {
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          var id = el.getAttribute("data-product");
          if (!id || seen[id]) return;
          seen[id] = true;
          record("product_impression", id);
          io.unobserve(el);
        });
      }, { threshold: 0.35 });
      Array.prototype.forEach.call(document.querySelectorAll("[data-product]"), function (el) {
        io.observe(el);
      });
    }

    // outbound_click: fired on sponsored product links before navigation.
    Array.prototype.forEach.call(document.querySelectorAll("a.sponsored-link"), function (link) {
      link.addEventListener("click", function () {
        record("outbound_click", link.getAttribute("data-product") || null);
      });
    });

    // Local tally export controls (measurement.html).
    var out = document.getElementById("tally-output");
    if (out) {
      out.textContent = JSON.stringify(load(), null, 2);
    }
    var dl = document.getElementById("tally-download");
    if (dl) {
      dl.addEventListener("click", function (ev) {
        ev.preventDefault();
        var blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "counter-and-crisp-tally.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
    var rs = document.getElementById("tally-reset");
    if (rs) {
      rs.addEventListener("click", function (ev) {
        ev.preventDefault();
        try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        tally = load();
        if (out) out.textContent = JSON.stringify(tally, null, 2);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
