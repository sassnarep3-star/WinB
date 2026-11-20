# WinB

Kitchen Picks — a static register of five Amazon product links, with each
ASIN, listing title, link status and policy check traced to an official source.

## Layout

- `data/` — the only place values are edited (products, sources, compliance rules, findings, flags, questions, suggestions, guide ideas, campaign ledger, site settings).
- `scripts/build_site.py` — generates `docs/` from `data/` (standard library only).
- `scripts/check_site.py` — checks data rules, disclosure placement, `rel="sponsored"` on Amazon links, internal links, sources on every table row, sitemap and feed.
- `docs/` — generated site, published by GitHub Pages from `main` / `/docs`.
- `COORDINATION.md` — shared task board and log.
- `.github/workflows/site.yml` — rebuilds and checks on every pull request.

## Build and check

```
python3 scripts/build_site.py
python3 scripts/check_site.py
```

Do not hand-edit `docs/`; change `data/` and rebuild.

## Status

See `data/flags.json` (Flagged for review) and the Suggestions page for decisions that are waiting on the owner.
