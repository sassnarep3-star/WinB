/* ============================================================
   COUNTER — app logic
   Renders registers from js/data.js; privacy-preserving
   outbound-click counting; nav + reveal behavior.
   ============================================================ */
(function () {
  "use strict";
  var D = window.WINB || {};

  /* ---------- tiny helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.indexOf("data-") === 0 || k.indexOf("on") === 0) node.setAttribute(k, attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function icon(name) {
    var paths = {
      fryer: '<path d="M4 9h13a3 3 0 0 1 0 6H8a3 3 0 0 1-2.8-2H4z"/><path d="M2 9h2M16 12h4M17 15h3"/><path d="M7 12v3"/>',
      probe: '<path d="M12 3v8"/><path d="M9 11h6l-1 4a2 2 0 0 1-4 0z"/><path d="M8 3l4 2 4-2"/>',
      shield: '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
      flag: '<path d="M4 21V4M4 4h12l-2 4 2 4H4"/>',
      link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
      check: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M18 3v18"/>',
      bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
      eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    };
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      (paths[name] || "") +
      "</svg>"
    );
  }
  function catIcon(cat) {
    return cat === "Meat Thermometers" ? "probe" : "fryer";
  }

  /* ---------- nav: mobile toggle + active link ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () { nav.classList.toggle("is-open"); });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") nav.classList.remove("is-open");
      });
    }
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === path) a.classList.add("is-active");
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- privacy-preserving outbound click counter ----------
     Counts clicks on Amazon affiliate links locally (localStorage).
     No cookies, no PII, no external requests. Counts are aggregate and
     kept on this device only. Recorded event: evt_outbound_click.        ------------------------------------------------------------ */
  var CLICK_KEY = "winb_click_counts";
  function readClicks() {
    try { return JSON.parse(localStorage.getItem(CLICK_KEY)) || {}; } catch (e) { return {}; }
  }
  function bumpClick(asin) {
    var c = readClicks();
    c[asin] = (c[asin] || 0) + 1;
    try { localStorage.setItem(CLICK_KEY, JSON.stringify(c)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("winb:click", { detail: { asin: asin } }));
  }
  function initClickCounter() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-affiliate]");
      if (!a) return;
      var asin = a.getAttribute("data-affiliate");
      if (asin) bumpClick(asin);
    });
  }

  /* ---------- render: product cards ---------- */
  function productCard(p) {
    return el("article", { class: "card card--pad card--hover reveal" }, [
      el("div", { class: "prod__top" }, [
        el("div", { class: "prod__icon", html: icon(catIcon(p.category)) }),
        el("div", {}, [
          el("div", { class: "prod__cat" }, p.category),
          el("div", { class: "prod__title" }, p.title),
        ]),
      ]),
      el("div", { class: "prod__meta" }, [
        el("span", { class: "chip chip--accent", html: icon("link") + "<span>" + p.observedAsin + "</span>" }),
        el("span", { class: "badge badge--verified" }, "Verified ✓"),
      ]),
      el("div", { class: "prod__foot" }, [
        el("a", {
          class: "btn btn--primary btn--sm",
          href: p.officialUrl,
          target: "_blank",
          rel: "noopener sponsored",
          "data-affiliate": p.observedAsin,
          "data-event": "evt_outbound_click",
        }, [ "View on Amazon ", el("span", { html: icon("arrow") }) ]),
      ]),
    ]);
  }

  /* ---------- render: product table ---------- */
  function productTable(list) {
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", {}, "ID"),
        el("th", {}, "Submitted token"),
        el("th", {}, "Observed ASIN (redirect)"),
        el("th", {}, "Product"),
        el("th", {}, "Brand"),
        el("th", {}, "Category"),
        el("th", {}, "Price"),
        el("th", {}, "Status"),
        el("th", {}, "Source (official)"),
      ]),
    ]);
    var tbody = el("tbody", {}, list.map(function (p) {
      return el("tr", {}, [
        el("td", { class: "mono" }, p.id),
        el("td", { class: "mono" }, p.submittedToken),
        el("td", { class: "mono" }, p.observedAsin),
        el("td", {}, [ el("div", { style: "font-weight:600;color:var(--ink)" }, p.title) ]),
        el("td", {}, p.brand),
        el("td", {}, p.category),
        el("td", { class: "empty-cell flag" }, "— unverified"),
        el("td", {}, [ el("span", { class: "badge badge--verified" }, p.status) ]),
        el("td", { class: "src" }, [
          el("a", { href: p.officialUrl, target: "_blank", rel: "noopener sponsored" }, "Amazon listing ↗"),
        ]),
      ]);
    }));
    return el("div", { class: "table-wrap" }, [ el("table", { class: "data" }, [thead, tbody]) ]);
  }

  /* ---------- render: intent confirmation table ---------- */
  function intentTable(list) {
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", {}, "Product"),
        el("th", {}, "Intended ASIN"),
        el("th", {}, "Intended listing URL"),
        el("th", {}, "Confirmation date"),
        el("th", {}, "Intended source"),
        el("th", {}, "Observed redirect target (separate field)"),
      ]),
    ]);
    var tbody = el("tbody", {}, list.map(function (p) {
      return el("tr", {}, [
        el("td", { class: "mono" }, p.id + " · " + p.observedAsin),
        el("td", { class: "empty-cell flag" }, "— blank (await owner)"),
        el("td", { class: "empty-cell flag" }, "— blank"),
        el("td", { class: "empty-cell flag" }, "— blank"),
        el("td", { class: "empty-cell flag" }, "— blank"),
        el("td", { class: "mono" }, p.observedAsin),
      ]);
    }));
    return el("div", { class: "table-wrap" }, [ el("table", { class: "data" }, [thead, tbody]) ]);
  }

  /* ---------- render: articles ---------- */
  function articleCard(a) {
    return el("article", { class: "card card--pad card--hover reveal" }, [
      el("div", { class: "art__kind" }, a.kind + " · " + a.category),
      el("h3", { class: "art__title" }, [ el("a", { href: "articles.html#" + a.id }, a.title) ]),
      el("p", { class: "art__excerpt" }, a.excerpt),
      el("div", { class: "prod__meta" }, [
        el("span", { class: "badge badge--draft" }, a.status),
        el("span", { class: "chip" }, a.related.length + " products"),
      ]),
    ]);
  }

  /* ---------- render: suggestions ---------- */
  function suggestionRow(s) {
    return el("tr", {}, [
      el("td", { class: "mono" }, s.id),
      el("td", {}, [ el("div", { style: "font-weight:600;color:var(--ink)" }, s.title) ]),
      el("td", {}, s.what),
      el("td", {}, s.why),
      el("td", {}, [ el("span", { class: "chip chip--accent" }, s.priority) ]),
      el("td", {}, [
        s.status === "Needs review"
          ? el("span", { class: "badge badge--review" }, s.status)
          : el("span", { class: "badge badge--verified" }, s.status),
      ]),
    ]);
  }

  /* ---------- render: questions ---------- */
  function questionRow(q) {
    return el("tr", {}, [
      el("td", { class: "mono" }, q.id),
      el("td", {}, [ el("div", { style: "font-weight:600;color:var(--ink)" }, q.question) ]),
      el("td", {}, q.why),
      el("td", {}, q.needed),
      el("td", {}, q.blocks),
    ]);
  }

  /* ---------- render: flagged ---------- */
  function flaggedCard(f) {
    return el("article", { class: "card card--pad reveal" }, [
      el("div", { class: "prod__meta", style: "margin-bottom:10px" }, [
        el("span", { class: "chip chip--red", html: icon("flag") + "<span>" + f.id + "</span>" }),
      ]),
      el("h3", { style: "margin-bottom:.4rem" }, f.title),
      el("p", { class: "muted", style: "margin-bottom:10px" }, f.detail),
      el("p", { class: "src", style: "margin:0;font-size:.82rem" }, [
        "Source: ", el("a", { href: f.source, target: "_blank", rel: "noopener" }, f.source),
      ]),
    ]);
  }

  /* ---------- render: ledger ---------- */
  function ledgerTable() {
    var head = D.LEDGER_COLUMNS.map(function (c) { return el("th", {}, c); });
    var thead = el("thead", {}, [ el("tr", {}, head) ]);
    var tbody = el("tbody", {});
    if (!D.LEDGER_ROWS.length) {
      tbody.appendChild(el("tr", {}, [ el("td", { colspan: D.LEDGER_COLUMNS.length, class: "empty-cell center", style: "padding:26px" }, "No records yet. The ledger starts empty and is populated only from authorized first-party reports.") ]));
    } else {
      D.LEDGER_ROWS.forEach(function (r) {
        var tds = D.LEDGER_COLUMNS.map(function (c) { return el("td", {}, String(r[c] == null ? "—" : r[c])); });
        tbody.appendChild(el("tr", {}, tds));
      });
    }
    return el("div", { class: "table-wrap" }, [ el("table", { class: "data" }, [thead, tbody]) ]);
  }

  /* ---------- mount into [data-render] containers ---------- */
  function renderAll() {
    document.querySelectorAll("[data-render]").forEach(function (node) {
      var kind = node.getAttribute("data-render");
      if (kind === "products") {
        var list = D.PRODUCTS;
        var filter = (node.getAttribute("data-filter") || "").toLowerCase();
        if (filter) list = list.filter(function (p) { return p.category.toLowerCase() === filter; });
        var grid = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fill,minmax(300px,1fr))" });
        list.forEach(function (p) { grid.appendChild(productCard(p)); });
        node.appendChild(grid);
      } else if (kind === "product-table") {
        node.appendChild(productTable(D.PRODUCTS));
      } else if (kind === "intent-table") {
        node.appendChild(intentTable(D.PRODUCTS));
      } else if (kind === "articles") {
        var g = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fill,minmax(320px,1fr))" });
        D.ARTICLES.forEach(function (a) { g.appendChild(articleCard(a)); });
        node.appendChild(g);
      } else if (kind === "suggestions") {
        node.appendChild(suggestionTable());
      } else if (kind === "questions") {
        node.appendChild(questionTable());
      } else if (kind === "flagged") {
        var fg = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fill,minmax(320px,1fr))" });
        D.FLAGGED.forEach(function (f) { fg.appendChild(flaggedCard(f)); });
        node.appendChild(fg);
      } else if (kind === "ledger") {
        node.appendChild(ledgerTable());
      } else if (kind === "events") {
        var tb = el("tbody", {});
        D.EVENTS.forEach(function (e) {
          tb.appendChild(el("tr", {}, [
            el("td", { class: "mono" }, e.id),
            el("td", { style: "font-weight:600;color:var(--ink)" }, e.name),
            el("td", {}, e.definition),
            el("td", {}, [ e.required ? el("span", { class: "badge badge--verified" }, "Required") : el("span", { class: "badge badge--draft" }, "Optional") ]),
          ]));
        });
        node.appendChild(el("div", { class: "table-wrap" }, [
          el("table", { class: "data" }, [
            el("thead", {}, [ el("tr", {}, [ el("th", {}, "Event ID"), el("th", {}, "Event"), el("th", {}, "Definition"), el("th", {}, "Status") ]) ]),
            tb,
          ]),
        ]));
      } else if (kind === "compliance") {
        var list = el("ul", { class: "compliance-list", style: "list-style:none;padding:0;margin:0;display:grid;gap:12px" });
        D.COMPLIANCE.forEach(function (c) {
          list.appendChild(el("li", { class: "card card--pad" }, [
            el("div", { class: "prod__meta", style: "margin-bottom:8px" }, [ el("span", { class: "chip chip--accent" }, c.id) ]),
            el("div", { style: "font-weight:600;color:var(--ink);margin-bottom:4px" }, c.label),
            el("p", { class: "muted", style: "margin:0 0 8px;font-size:.9rem" }, c.note),
            el("a", { href: c.url, target: "_blank", rel: "noopener" }, "Open official source ↗"),
          ]));
        });
        node.appendChild(list);
      }
    });
  }

  function suggestionTable() {
    return el("div", { class: "table-wrap" }, [
      el("table", { class: "data" }, [
        el("thead", {}, [ el("tr", {}, [ el("th", {}, "ID"), el("th", {}, "Suggestion"), el("th", {}, "What it does"), el("th", {}, "Why"), el("th", {}, "Priority"), el("th", {}, "Status") ]) ]),
        el("tbody", {}, D.SUGGESTIONS.map(suggestionRow)),
      ]),
    ]);
  }
  function questionTable() {
    return el("div", { class: "table-wrap" }, [
      el("table", { class: "data" }, [
        el("thead", {}, [ el("tr", {}, [ el("th", {}, "ID"), el("th", {}, "Question"), el("th", {}, "Why it matters"), el("th", {}, "Information needed"), el("th", {}, "What it blocks") ]) ]),
        el("tbody", {}, D.QUESTIONS.map(questionRow)),
      ]),
    ]);
  }

  /* ---------- filter bar on products page ---------- */
  function initFilters() {
    var bar = document.querySelector("[data-filter-bar]");
    var target = document.querySelector("[data-render='products']");
    if (!bar || !target) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      target.innerHTML = "";
      var f = btn.getAttribute("data-filter");
      renderProductsInto(target, f);
    });
  }
  function renderProductsInto(target, filter) {
    var list = D.PRODUCTS;
    if (filter && filter !== "all") list = list.filter(function (p) { return p.category.toLowerCase() === filter; });
    var grid = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fill,minmax(300px,1fr))" });
    list.forEach(function (p) { grid.appendChild(productCard(p)); });
    target.appendChild(grid);
  }

  /* ---------- click counter display (dashboard) ---------- */
  function initClickDisplay() {
    var node = document.querySelector("[data-click-display]");
    if (!node) return;
    function refresh() {
      var c = readClicks();
      var total = Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0);
      node.innerHTML =
        '<div class="stat"><div class="stat__num">' + total + '</div><div class="stat__label">Outbound clicks (this device)</div></div>' +
        '<div class="stat"><div class="stat__num">' + Object.keys(c).length + '</div><div class="stat__label">Products clicked</div></div>' +
        '<div class="stat"><div class="stat__num">0</div><div class="stat__label">Reported orders (first-party)</div></div>' +
        '<div class="stat"><div class="stat__num">—</div><div class="stat__label">Conversion score (not presented)</div></div>';
    }
    refresh();
    document.addEventListener("winb:click", refresh);
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initClickCounter();
    renderAll();
    initFilters();
    initClickDisplay();
  });
})();
