/* ==========================================================================
   Counterwise — measurement

   Design rules, in order of importance:

   1. Nothing here talks to a third party. There is no Google Analytics, no
      pixel, no CDN script. Every event goes to ENDPOINT, which is a host the
      owner controls.
   2. Nothing here identifies a reader. No cookie is set by this file, no
      device fingerprint, no persistent id. A random per-page-load nonce is
      generated in memory and discarded when the tab closes; it exists only so
      a server can de-duplicate double-fired events.
   3. Nothing here blocks the page. If ENDPOINT is unreachable the events queue
      in memory and are dropped. A broken endpoint must never break reading.
   4. Nothing here reports a number the desk has not been given.

   Set ENDPOINT to your collector URL. While it is null the site is honest:
   events are counted in the browser only, and the Data Room says so.
   ========================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------- config
  var ENDPOINT = null; // e.g. 'https://counterwise-events.example.workers.dev/e'

  var EVENTS = {
    PAGE_VIEW: 'page_view',
    PRODUCT_VIEW: 'product_view',
    OUTBOUND_CLICK: 'outbound_click',
    GUIDE_COMPLETE: 'guide_complete',
    CAPTURE_INTENT: 'capture_intent'
  };

  // --------------------------------------------------------------- helpers
  function pageMeta() {
    var b = document.body;
    return {
      path: location.pathname,
      product: b.getAttribute('data-product') || null,
      asin: b.getAttribute('data-asin') || null,
      guide: b.getAttribute('data-guide') || null,
      category: b.getAttribute('data-category') || null,
      viewport: window.innerWidth < 640 ? 's'
        : window.innerWidth < 1024 ? 'm' : 'l'
    };
  }

  function nonce() {
    try {
      var a = new Uint8Array(8);
      (window.crypto || window.msCrypto).getRandomValues(a);
      return Array.prototype.map.call(a, function (n) {
        return ('0' + n.toString(16)).slice(-2);
      }).join('');
    } catch (e) {
      return String(Date.now()).slice(-8);
    }
  }

  var NONCE = nonce();
  var queue = [];

  function record(name, extra) {
    var payload = {
      e: name,
      n: NONCE,
      t: new Date().toISOString(),
      m: pageMeta()
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k];
      }
    }

    // Keep a local tally so a developer can inspect without a server.
    try {
      var key = 'cw_tally';
      var tally = JSON.parse(localStorage.getItem(key) || '{}');
      tally[name] = (tally[name] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(tally));
    } catch (e) { /* storage may be blocked; not our problem */ }

    if (window.console && console.debug) {
      console.debug('[counterwise] ' + name, payload);
    }

    if (!ENDPOINT) return;

    queue.push(payload);
    flush();
  }

  function flush() {
    if (!ENDPOINT || !queue.length) return;
    var batch = queue.splice(0, queue.length);
    var body;
    try {
      body = JSON.stringify({ v: 1, events: batch });
    } catch (e) { return; }

    // sendBeacon survives the page being navigated away from, which is exactly
    // the case that matters for an outbound click.
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
    } catch (e) { /* fall through to fetch */ }

    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      }).catch(function () { /* silently drop */ });
    } catch (e) { /* silently drop */ }
  }

  // Give the reader a way out. Honouring this flag is the whole privacy story.
  function optedOut() {
    try {
      return localStorage.getItem('cw_optout') === '1';
    } catch (e) { return false; }
  }

  // ------------------------------------------------------------ page view
  if (!optedOut()) record(EVENTS.PAGE_VIEW);

  // --------------------------------------------------------- product view
  if (document.body.hasAttribute('data-product') && !optedOut()) {
    record(EVENTS.PRODUCT_VIEW, {
      product: document.body.getAttribute('data-product'),
      asin: document.body.getAttribute('data-asin')
    });
  }

  // ------------------------------------------------------- outbound click
  // Delegated so it survives any future markup change. The link is already
  // marked rel="sponsored" in the HTML; this only counts the click.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a[data-outbound]') : null;
    if (!a) return;
    if (optedOut()) return;
    record(EVENTS.OUTBOUND_CLICK, {
      product: a.getAttribute('data-product') || null,
      asin: a.getAttribute('data-asin') || null,
      pos: a.getAttribute('data-pos') || 'unknown'
    });
  }, { capture: true });

  // ------------------------------------------------------- guide complete
  var guideEl = document.querySelector('[data-guide]');
  if (guideEl && !optedOut()) {
    var fired = false;
    var onScroll = function () {
      if (fired) return;
      var doc = document.documentElement;
      var seen = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (seen >= 0.75) {
        fired = true;
        record(EVENTS.GUIDE_COMPLETE, { guide: guideEl.getAttribute('data-guide') });
        window.removeEventListener('scroll', onScroll, { passive: true });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ------------------------------------------------------- capture intent
  var form = document.querySelector('[data-capture]');
  if (form) {
    var input = form.querySelector('input[type=email]');
    if (input) {
      input.addEventListener('focus', function () {
        if (optedOut()) return;
        record(EVENTS.CAPTURE_INTENT, {
          form: form.getAttribute('data-capture'),
          page: location.pathname
        });
      }, { once: true });
    }

    // No provider is wired. Say so plainly rather than pretending to subscribe.
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var s = form.querySelector('.status');
      if (s) {
        s.textContent = 'There is no list yet — no address was sent or stored. '
          + 'This form is here so the intent can be counted. See the Data Room.';
        s.classList.add('show');
      }
    });
  }

  // --------------------------------------------------------- data room tally
  var tallyBtn = document.getElementById('cw-show-tally');
  if (tallyBtn) {
    tallyBtn.addEventListener('click', function () {
      var out = document.getElementById('cw-tally-out');
      var t = window.Counterwise.tally();
      var keys = Object.keys(t);
      if (!keys.length) {
        out.textContent = 'Nothing recorded in this browser yet.';
        return;
      }
      out.textContent = keys.map(function (k) {
        return k + ': ' + t[k];
      }).join(' · ');
    });
  }

  // --------------------------------------------------------------- opt out
  var optBtn = document.getElementById('cw-optout');
  var optInline = document.getElementById('cw-optout-inline');
  [optBtn, optInline].forEach(function (btn) { if (btn) wireOptOut(btn); });

  function wireOptOut(optBtn) {
    optBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      try { localStorage.setItem('cw_optout', '1'); } catch (e) {}
      var toast = document.getElementById('cw-toast');
      if (toast) {
        toast.textContent = 'Measurement disabled in this browser.';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3500);
      }
      if (optBtn.id === 'cw-optout-inline') {
        var sib = optBtn.parentNode;
        if (sib) sib.insertAdjacentHTML('afterend',
          '<span class="badge green" style="margin-left:.5rem">Off</span>');
      }
    });
  }

  // Expose for the Data Room's live "what this page has recorded" panel.
  window.Counterwise = {
    events: EVENTS,
    tally: function () {
      try { return JSON.parse(localStorage.getItem('cw_tally') || '{}'); }
      catch (e) { return {}; }
    },
    endpointConfigured: !!ENDPOINT
  };
})();
