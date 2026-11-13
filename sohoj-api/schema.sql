-- Sohoj Tools scam-number reports (Cloudflare D1 / SQLite)

-- One row per report. A reporter is a salted one-way hash of the connection, never a raw IP.
CREATE TABLE IF NOT EXISTS reports (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  number      TEXT    NOT NULL,              -- normalised 01XXXXXXXXX
  reporter    TEXT    NOT NULL,              -- sha256(SALT|ip), first 32 hex chars
  provider    TEXT    NOT NULL,              -- bkash | nagad | rocket | upay | other
  category    TEXT    NOT NULL,              -- officer | sms | wrong | seller | other
  amount      INTEGER,                       -- taka, optional
  note        TEXT,                          -- private, max 300 chars, never shown publicly
  status      TEXT    NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  created_at  INTEGER NOT NULL,              -- unix ms
  reviewed_at INTEGER,
  UNIQUE (number, reporter)                  -- one report per connection per number
);
CREATE INDEX IF NOT EXISTS idx_reports_number_status ON reports (number, status);
CREATE INDEX IF NOT EXISTS idx_reports_status_time   ON reports (status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_time ON reports (reporter, created_at);

-- Screenshot proof, only visible to moderators. Deleted when a report is rejected.
CREATE TABLE IF NOT EXISTS evidence (
  report_id INTEGER PRIMARY KEY REFERENCES reports (id) ON DELETE CASCADE,
  mime      TEXT NOT NULL,
  data      TEXT NOT NULL                    -- base64 JPEG, max ~400 KB
);

-- Numbers a moderator has cleared (e.g. after a successful dispute). Never shown as scams again.
CREATE TABLE IF NOT EXISTS cleared (
  number     TEXT PRIMARY KEY,
  reason     TEXT,
  cleared_at INTEGER NOT NULL
);

-- "This is my number, the listing is wrong" requests.
CREATE TABLE IF NOT EXISTS disputes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  number     TEXT    NOT NULL,
  contact    TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'open',  -- open | closed
  created_at INTEGER NOT NULL
);
