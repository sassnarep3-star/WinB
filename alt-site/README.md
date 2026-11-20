# Alternate publication build (not deployed)

This folder holds a second, complete build of the air fryer and meat thermometer site, produced by session `arena/4b09b79a-winb`. It was written in parallel with the `docs/` site from `arena/9b3682f1-winb`.

- Nothing here is published. `.github/workflows/pages.yml` deploys only `docs/` from `main`.
- `alt-site/` is checked by `.github/workflows/alt-site-check.yml` (build and compliance gate, no deploy).
- Both sites use the same data model (products with intended ASIN and observed redirect as separate fields; sources per row; unverified values blank and flagged).
- Decision on which build becomes the live site belongs to the owner. See COORDINATION.md, section "Session arena-4b09b79a".

Build: `python3 alt-site/build/build.py` (writes `alt-site/_site/`). Gate: `python3 alt-site/scripts/check_site.py`.
