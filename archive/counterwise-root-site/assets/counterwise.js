/*
 * Counterwise — privacy-preserving first-party analytics client.
 * Self-hosted, no third-party cookies, no fingerprinting.
 *
 * Defined events (per review/index.html measurement plan):
 *   1. page_view            — fired on every page load
 *   2. outbound_click       — fired when a visitor clicks an outbound product link
 *   3. guide_engaged        — fired when a visitor reads a guide past a scroll threshold
 *   4. disclosure_view      — fired when the affiliate disclosure is visible on load
 *   5. affiliate_conversion_reported
 *                           — entered ONLY from a dated, authorized first-party
 *                           Associates report; NEVER inferred from a click.
 *
 * Delivery: beacon-style POST to a configurable self-hosted endpoint.
 * GitHub Pages serves static files only, so the endpoint must be provisioned
 * separately (separate hosting, retention policy, privacy notice). Until an
 * endpoint is configured, events are buffered in memory and logged to the
 * console so the instrumentation can be reviewed without sending data anywhere.
 *
 * Configuration: set window.COUNTERWISE before this script loads, e.g.
 *   window.COUNTERWISE = { endpoint: 'https://analytics.example.com/collect', siteId: 'counterwise' };
 */

(function () {
  'use strict';

  var config = window.COUNTERWISE || {};
  var endpoint = config.endpoint || ''; // empty = no network send (review mode)
  var siteId = config.siteId || 'counterwise';
  var sessionId = config.sessionId || (crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36));
  var enabled = config.enabled !== false; // enabled by default when endpoint set
  var queue = [];
  var sent = false;

  // --- helpers -------------------------------------------------------------

  function isoNow() {
    return new Date().toISOString();
  }

  function isSameOrigin(url) {
    try {
      var a = document.createElement('a');
      a.href = url;
      return a.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function send(event) {
    var payload = {
      event: event.name,
      site: siteId,
      session: sessionId,
      ts: isoNow(),
      page: window.location.pathname,
      referrer: document.referrer || '',
      data: event.data || {}
    };
    queue.push(payload);

    // Review mode: no endpoint configured -> log only, never send.
    if (!enabled || !endpoint) {
      if (window.console && console.log) {
        console.log('[counterwise] event (review mode, not sent):', payload);
      }
      return;
    }

    flush();
  }

  function flush() {
    if (sent || queue.length === 0 || !endpoint) {
      return;
    }
    sent = true;
    var batch = queue.splice(0, queue.length);
    try {
      navigator.sendBeacon(endpoint, JSON.stringify({ events: batch }));
    } catch (e) {
      // sendBeacon unavailable; fall back to fetch (fire-and-forget).
      try {
        fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({ events: batch }),
          credentials: 'omit',
          keepalive: true
        });
      } catch (ferr) {
        if (window.console && console.log) {
          console.log('[counterwise] delivery failed:', ferr);
        }
      }
    }
    sent = false;
  }

  function track(name, data) {
    if (!enabled) { return; }
    send({ name: name, data: data });
  }

  // --- page_view -----------------------------------------------------------
  track('page_view');

  // --- disclosure_view -----------------------------------------------------
  // Fires when the affiliate disclosure strip is present on the page.
  if (document.querySelector('.disclosure')) {
    track('disclosure_view', { location: 'masthead' });
  }

  // --- outbound_click ------------------------------------------------------
  // Intercepts clicks on outbound product links (rel="sponsored").
  // Records destination without altering the link; no personal data is sent.
  function attachClickListeners() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        var href = link.getAttribute('href') || '';
        if (!href || isSameOrigin(href)) { return; }
        var sponsored = (link.getAttribute('rel') || '').indexOf('sponsored') !== -1;
        if (!sponsored) { return; }
        link.addEventListener('click', function () {
          track('outbound_click', {
            destination: href,
            text: (link.textContent || '').trim().slice(0, 120),
            source: 'product-link'
          });
        });
      })(links[i]);
    }
  }
  attachClickListeners();

  // --- guide_engaged -------------------------------------------------------
  // Fires once per page when a visitor scrolls past 50% of an article.
  var engaged = false;
  function onScroll() {
    if (engaged) { return; }
    var body = document.body;
    var html = document.documentElement;
    var scrollTop = window.pageYOffset || html.scrollTop || body.scrollTop || 0;
    var scrollHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    var clientHeight = window.innerHeight || html.clientHeight || 0;
    if (scrollHeight > 0 && scrollTop + clientHeight >= scrollHeight * 0.5) {
      engaged = true;
      track('guide_engaged', { scroll: 50, section: 'guide' });
      window.removeEventListener('scroll', onScroll);
    }
  }
  if (document.querySelector('main .article, main .articles, main .hero')) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- pagehide / visibilitychange flush -----------------------------------
  function flushOnExit() {
    flush();
  }
  window.addEventListener('pagehide', flushOnExit);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { flushOnExit(); }
  });

  // --- public API ----------------------------------------------------------
  window.counterwise = {
    track: track,
    flush: flush,
    config: { sessionId: sessionId, endpoint: endpoint }
  };

})();
