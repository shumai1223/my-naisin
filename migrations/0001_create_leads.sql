-- 名簿（堀A）の永続化スキーマ＝Cloudflare D1。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0001_create_leads.sql
-- 設計: 同意済みリードのみ保存（/api/lead が consent:true を検証済み）。配信目的限定・PII最小。

CREATE TABLE IF NOT EXISTS leads (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT NOT NULL,
  source          TEXT,
  prefecture_code TEXT,
  prefecture_name TEXT,
  score           INTEGER,
  target          INTEGER,
  gap             INTEGER,
  note            TEXT,
  unsubscribed    INTEGER NOT NULL DEFAULT 0,  -- 配信停止フラグ（一斉配信の除外に使う）
  created_at      TEXT NOT NULL                 -- ISO 文字列（datetime('now')）
);

-- 重複登録の抑制（同一メールは最新で上書きしたい場合は INSERT を UPSERT に変更）。
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

-- セグメント配信用（県別・経路別の抽出）。
CREATE INDEX IF NOT EXISTS idx_leads_pref ON leads (prefecture_code);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
