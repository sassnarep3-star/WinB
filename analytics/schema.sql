-- Counterwise collector schema (Cloudflare D1 / SQLite)
-- Run once:  wrangler d1 execute counterwise --file=./schema.sql

CREATE TABLE IF NOT EXISTS events (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT    NOT NULL,          -- one of the five frozen event names
  nonce     TEXT    NOT NULL DEFAULT '',-- per-page-load random, dedupe only
  at        TEXT    NOT NULL,          -- ISO 8601 UTC, client clock
  path      TEXT    NOT NULL DEFAULT '',
  product   TEXT    NOT NULL DEFAULT '',
  asin      TEXT    NOT NULL DEFAULT '',
  guide     TEXT    NOT NULL DEFAULT '',
  viewport  TEXT    NOT NULL DEFAULT '',
  category  TEXT    NOT NULL DEFAULT '',
  pos       TEXT    NOT NULL DEFAULT '',-- where on the page the click happened
  form      TEXT    NOT NULL DEFAULT '' -- reserved: which form on the page
  compared  INTEGER NOT NULL DEFAULT 0 -- number of products in the table reached
);

-- Deliberately absent: ip, user_agent, referrer, cookie_id, session_id,
-- country, device_id. If you add one of these, you have broken the privacy
-- claim on /privacy/ and must update that page in the same change.

CREATE INDEX IF NOT EXISTS idx_events_at   ON events (at);
CREATE INDEX IF NOT EXISTS idx_events_name ON events (name, at);
CREATE INDEX IF NOT EXISTS idx_events_path ON events (path, at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_nonce_name ON events (nonce, name, path, at);

-- Retention: 90 days. The worker's cron job deletes older rows nightly.
