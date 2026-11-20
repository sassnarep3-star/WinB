# Executive Summary — Counter & Crisp (WinB)

**Date:** 2026-11-20 · **Session:** arena/6fc7de34 · **Tracking ID:** shopnow047c-20
**Live site:** https://sassnarep3-star.github.io/WinB/

## What this project is

A live GitHub Pages affiliate site ("Counter & Crisp") built around five submitted product links:
three air fryers and two meat thermometers. The site leads with the products and question-shaped
buying guides; the verification machinery (registers, workflow, measurement, flags, suggestions,
open questions) is reachable from a single footer group. Every page carries the affiliate
disclosure above the fold and in the footer; every product link is marked sponsored.

## The five products (observed 2026-11-20)

| ID | Submitted link | Product (observed listing title, abridged) | Observed category | Observed target ASIN |
|---|---|---|---|---|
| P-01 | link.amazon/B04G1MEwY | Chefman 6 qt Dual Basket Air Fryer Oven | Air Fryers | B0CDY277D3 |
| P-02 | link.amazon/B02NbDxp3 | Emeril Lagasse 26QT French Door Air Fryer Toaster Oven | Air Fryers | B09B7SB46R |
| P-03 | link.amazon/B00hJ57DV | Chefman TurboFry 8 qt Air Fryer | Air Fryers | B08DKYBTPH |
| P-04 | link.amazon/B0c8moW59 | ThermoMaven 1-Second Digital Meat Thermometer | Meat Thermometers | B0DHZTCNR5 |
| P-05 | link.amazon/B0f3GKalj | CHEF iQ Sense Smart Wireless Thermometer (Gen 3) | Meat Thermometers | B0DZFD6R9Z |

**Important:** these are *observed* redirect targets, recorded in a separate field from the
submitted identifiers per the product-intent rule. They are not confirmed mappings. We do **not**
claim the submitted short links are invalid — their compliance status is **unresolved** (FLG-003).

## What is verified

- 12 official sources fetched and linked (FTC Endorsement Guides + 16 CFR 255, FTC Disclosures 101,
  USDA FSIS temperature chart, Amazon Associates Program Policies + Operating Agreement + help
  statement, Amazon ASIN definition, sitemaps.org, RSS 2.0, GitHub Pages docs, CPSC recalls).
- The exact Associates-required statement ("As an Amazon Associate I earn from qualifying purchases.")
  appears above the fold and in the footer on every page.
- Listing titles and Amazon category breadcrumbs for all five products (as observed).
- Every table row on the site carries a source link or is blank + flagged.

## What is deliberately blank

Prices, star ratings, review counts, availability, dimensions, wattage — nothing could be confirmed
from an official source in machine-trustworthy form (dynamic widgets showed unattributable prices),
so every such cell is blank and flagged (FLG-002 / FLG-007). Nothing was inferred or estimated.

## Decisions waiting for the owner

1. **One-link test per product** in the enrolled Associates workflow (destination + tracking report)
   before scaling links — FLG-003.
2. **Confirm redirect mappings** in a browser; complete the intent record (official listing URL +
   confirmation date) — FLG-001.
3. **Confirm tracking ID enrollment** (shopnow047c-20) in Associates Central — FLG-008.
4. **Choose analytics endpoint hosting** (GitHub Pages is static) — FLG-006; contract documented.
5. **Confirm the five-event taxonomy** — FLG-005.
6. **Review the 12-item suggestion queue** and the 10 open questions (each with a discovery path).

## Machinery shipped

- Privacy-preserving outbound-click counter (no cookies/IP/PII), five defined events, local-only
  mode live; self-hosted endpoint contract documented.
- Empty, well-defined campaign ledger (timestamp, source, channel, eligible sessions, clicks,
  reported orders, provenance) — rows only from authorized first-party reports. No forecasts.
- Publishing workflow with automated checks (disclosure, sponsored marks, blank-field policy,
  link/token checks) and human gates (disclosure/endorsement review vs OA + FTC; link validation).
- Findability: one canonical site URL, sitemap.xml, RSS 2.0 feed, per-page metadata + JSON-LD,
  question-shaped guide titles as declared hypotheses until Search Console data exists.

## Risks / irregularities

All eight flagged items (FLG-001..FLG-008) are published on the site's "Flagged for Review" page
with evidence and decision paths. None block the launch; none were silently resolved.
