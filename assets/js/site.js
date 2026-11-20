/**
 * The Crisp Kitchen — reader-side instrumentation.
 *
 * Five events, defined before any content was written:
 *   page_view      a page loaded
 *   guide_read     a guide reached 90% scroll
 *   product_intent a product card, table row or detail was engaged
 *   outbound_click a buy link was clicked
 *   return_visit   this browser has been here on a previous day
 *
 * Privacy posture:
 *   - No cookie. No localStorage identifier. No fingerprint. No sessionStorage.
 *   - The only thing persisted is a single date key, used to detect a return visit.
 *   - Nothing is sent anywhere unless window.CK_CONFIG.endpoint is set to a URL.
 *     If it is set, one small JSON body is POSTed per event with keepalive.
 *
 * Why this is not a third-party analytics snippet: the site ships no external script, so the privacy
 * page can truthfully say that. See /about/privacy.html and /decisions/questions.html#Q-05.
 */
(function () {
  'use strict';

  var CONFIG = window.CK_CONFIG || {};
  var ENDPOINT = CONFIG.endpoint || null;
  var SITE = CONFIG.site || 'the-crisp-kitchen';
  var COUNTER_KEY = 'ck:events';
  var RETURN_KEY = 'ck:first-seen';

  function readCounts() {
    try {
      return JSON.parse(window.localStorage.getItem(COUNTER_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function bump(name) {
    var counts = readCounts();
    counts[name] = (counts[name] || 0) + 1;
    try {
      window.localStorage.setItem(COUNTER_KEY, JSON.stringify(counts));
    } catch (e) {
      /* storage disabled — counting is best effort and must never break the page */
    }
    return counts[name];
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function track(name, extra) {
    if (!name) return;
    var count = bump(name);
    var payload = {
      site: SITE,
      event: name,
      path: window.location.pathname,
      /* referrer host only — never the full referring URL */
      ref_host: (function () {
        try {
          return document.referrer ? new URL(document.referrer).host : '';
        } catch (e) {
          return '';
        }
      })(),
      count_today: count,
      ts: new Date().toISOString(),
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k];
      }
    }

    /* Always dispatch locally so a page can react without a network. */
    try {
      document.dispatchEvent(new CustomEvent('ck:event', { detail: payload }));
    } catch (e) {
      /* CustomEvent unsupported — irrelevant for the shipped pages */
    }

    if (!ENDPOINT) return;
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(ENDPOINT, {
          method: 'POST',
          body: body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          credentials: 'omit',
          referrerPolicy: 'origin',
        }).catch(function () {});
      }
    } catch (e) {
      /* never surface a network failure to a reader */
    }
  }

  /* ---- return_visit ------------------------------------------------------ */

  function checkReturn() {
    var firstSeen = null;
    try {
      firstSeen = window.localStorage.getItem(RETURN_KEY);
    } catch (e) {
      return;
    }
    if (!firstSeen) {
      try {
        window.localStorage.setItem(RETURN_KEY, today());
      } catch (e) {}
      return;
    }
    if (firstSeen !== today()) track('return_visit', { first_seen: firstSeen });
  }

  /* ---- page_view -------------------------------------------------------- */

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    track('page_view');
    checkReturn();

    /* ---- guide_read: 90% scroll on a guide page ---- */
    var isGuide = document.body.querySelector('.guide') !== null;
    if (isGuide) {
      var fired = false;
      var onScroll = function () {
        if (fired) return;
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        if (window.scrollY / max >= 0.9) {
          fired = true;
          track('guide_read', { guide: window.location.pathname.split('/').pop() });
          window.removeEventListener('scroll', onScroll, { passive: true });
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---- product_intent: opening a product detail or leaving the index ---- */
    var intentFired = {};
    document.addEventListener(
      'click',
      function (ev) {
        var a = ev.target.closest ? ev.target.closest('a, button') : null;
        if (!a) return;

        var affiliate = a.getAttribute('data-affiliate-product');
        if (affiliate) {
          track('outbound_click', {
            product: affiliate,
            asin: a.getAttribute('data-affiliate-asin') || '',
            dest: a.getAttribute('href') || '',
          });
          return;
        }

        var outbound = a.getAttribute('data-affiliate-out');
        if (outbound) {
          track('outbound_click', { product: outbound, stage: 'interstitial' });
          return;
        }

        /* A product card heading, or a jump to a product detail, is intent — not a departure. */
        var href = a.getAttribute('href') || '';
        var productHint = /\/products\//.test(href) || /^#/.test(href);
        if (productHint && a.closest && a.closest('.productcard, .productdetail, .decide')) {
          var key = href || a.textContent.trim().slice(0, 40);
          if (!intentFired[key]) {
            intentFired[key] = true;
            track('product_intent', { target: key.slice(0, 120) });
          }
        }
      },
      { passive: true }
    );
  });

  /* Expose for the console and for the metrics page's worked example. */
  window.CK = {
    track: track,
    counts: readCounts,
    events: ['page_view', 'guide_read', 'product_intent', 'outbound_click', 'return_visit'],
    endpointConfigured: !!ENDPOINT,
  };
})();
