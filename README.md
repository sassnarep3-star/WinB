# Shopnote

A static, publication-style affiliate research storefront. The five product links are user-submitted inputs, not verified recommendations. Product identities, intended ASIN/listing, redirects, prices and product claims remain unverified and are explicitly labeled. The homepage uses a product-first editorial design; research, editorial decision proposals and flagged gaps remain reachable through the navigation and footer.

## Preview

Open `index.html` directly or serve the repository root with any static web server. For example: `python3 -m http.server 8000 --bind 0.0.0.0`.

## Current capabilities and limits

- Responsive multi-page static site: `index.html`, `research.html`, `suggestions.html`, `flagged.html`.
- Associates disclosure appears beneath the masthead and in each footer. Product links carry `rel="sponsored nofollow noopener"`.
- `app.js` counts outbound clicks locally in browser `localStorage` only. It does not send analytics, identify visitors, record conversions, or persist a server-side report.
- There is no verified product research, price/review feed, API integration, campaign results, self-hosted analytics endpoint, RSS feed, sitemap, Search Console integration, or deployment configuration yet. No hosted deployment has been performed or confirmed in this repository.
- Editorial title ideas and an 8-week cadence are explicitly proposals, not claims of demand or ranking.

## Review sources

- [Amazon Associates Program Policies / Operating Agreement](https://affiliate-program.amazon.com/help/operating/)
- [Amazon Associates participation requirements](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6NLENMB8Z)
- [FTC endorsement guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)

These official references are linked for review; this project does not claim legal or policy compliance certification. Verify the current requirements and each submitted link in the enrolled Associates workflow before scaling or publishing product claims.
