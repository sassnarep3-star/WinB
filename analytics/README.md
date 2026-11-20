# Self-hosted analytics

This folder is the measurement layer. It is **source only — nothing here is running.**

## The point

Amazon Associates reports tell you what *sold*. They do not tell you which page earned
the click, which guide was read to the end, or which topic nobody opens. Without that,
the next article is chosen by instinct — the exact failure this project set out to avoid.

A third-party analytics vendor would answer the question and add a tracker, a cookie
banner and a data-sharing relationship this site does not need. A tiny first-party
collector answers it without any of that.

## What it records

Five events, frozen names: `page_view`, `product_view`, `compare_view`,
`outbound_click`, `guide_complete`.

They describe one funnel, in order: a page is opened, a product is considered, a
comparison is reached, an outbound link is clicked, a guide is read to the end.
There is no "capture" event: the email form was removed (FLG-008), and an event
that can never fire is a contract that only lies.

| Stored | Not stored |
| --- | --- |
| Event name | IP address |
| ISO timestamp | User agent |
| Page path | Referrer |
| Product / ASIN / guide id | Cookies or any persistent id |
| Viewport size class (`s`/`m`/`l`) | Country, city, device fingerprint |
| A random per-page-load nonce | Anything that links two page loads |

The nonce exists only so the database can drop a duplicate row. It is generated in
memory, never written to `localStorage`, and dies with the tab.

## Deploy

```bash
npm i -g wrangler
wrangler d1 create counterwise
# paste the returned database_id into wrangler.toml
wrangler d1 execute counterwise --file=./schema.sql
wrangler secret put READ_KEY          # protects /summary and /prune
wrangler deploy
```

Then set one line in `/assets/js/site.js`:

```js
var ENDPOINT = 'https://counterwise-events.<your-subdomain>.workers.dev/e';
```

Rebuild and deploy the site. Confirm a single event arrives before trusting any number:

```bash
curl -s "https://counterwise-events.<you>.workers.dev/summary?key=$READ_KEY"
```

## What the output is allowed to say

`/summary` returns counts. Those counts may support statements like *"the capacity guide
was opened more often than the cleanup guide last month"*.

They may **not** support a conversion rate, a revenue figure, an earnings estimate, or a
claim that a click became a sale. Only Associates Central reports can back those, which is
why the campaign ledger on `/data-room/#ledger` accepts rows from first-party reports only.

## Retention

90 days, pruned nightly by a cron trigger. Change the window in `collector-worker.js`
and in `schema.sql` together, and update `/privacy/` in the same commit.
