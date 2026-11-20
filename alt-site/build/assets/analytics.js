/* Crisp & Done — privacy-preserving event hook.
 * - Sends nothing unless window.CD_CONFIG.analyticsEndpoint is set (currently blank).
 * - No cookies, no localStorage, no fingerprinting.
 * - Honors Do Not Track and Global Privacy Control: when either is on, nothing is sent.
 * - Payloads contain only: event name, path (no query string), and a product or guide ID.
 */
(function () {
  "use strict";
  var cfg = window.CD_CONFIG || {};
  var endpoint = cfg.analyticsEndpoint || "";
  var optedOut = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  var allowed = { page_view: 1, outbound_click: 1, guide_engaged: 1, disclosure_view: 1 };
  // affiliate_conversion_reported is never sent from the browser (ledger only).

  function send(name, id) {
    if (!endpoint || optedOut || !allowed[name]) return;
    var payload = { event: name, path: location.pathname, id: id || null, ts: new Date().toISOString().slice(0, 10) };
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        fetch(endpoint, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch (err) { /* never break the page for analytics */ }
  }

  window.cdTrack = send;
  send("page_view", null);

  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var out = t.closest("a[data-outbound]");
    if (out) { send("outbound_click", out.getAttribute("data-outbound")); return; }
    var disc = t.closest("a[href$='disclosure/']");
    if (disc) { send("disclosure_view", null); }
  }, { passive: true });

  if (document.body && document.body.classList.contains("guide-page")) {
    var fired = false;
    var slug = location.pathname.replace(/\/+$/, "").split("/").pop();
    window.addEventListener("scroll", function () {
      if (fired) return;
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      if (max > 0 && (h.scrollTop / max) >= 0.75) { fired = true; send("guide_engaged", slug); }
    }, { passive: true });
  }
})();
