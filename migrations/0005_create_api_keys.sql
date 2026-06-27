-- 0005_create_api_keys.sql
-- 公開データAPI（堀B）の課金ゲート＝B2Bの「蛇口」。
-- DDレポート §H「課金実装：ゼロ／まず蛇口（課金ゲート）が要る」への着手。
--
-- 設計方針：
--  * APIキーは平文では保存しない（key_hash = SHA-256 hex）。発行時に一度だけ平文を返す。
--  * tier（無料/pro/scale）でレート・月次クォータを分ける（実値は src/lib/api-tiers.ts が正準）。
--  * 既存の /api/naishin は「キー無し＝匿名freeティア」で後方互換を保つ（破壊しない）。
--  * 月次クォータは api_usage（年月×キー）でカウント。瞬間バーストはアプリ側のスライディング窓で緩衝。

CREATE TABLE IF NOT EXISTS api_keys (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  key_hash      TEXT NOT NULL UNIQUE,        -- SHA-256(平文キー) の16進
  key_prefix    TEXT NOT NULL,              -- 先頭の識別子（例: mnsk_live_a1b2 ＝本人が照合できる頭出し）
  tier          TEXT NOT NULL DEFAULT 'free', -- free | pro | scale
  label         TEXT,                       -- 用途メモ（任意）
  email         TEXT,                       -- 連絡先（任意・PII最小）
  status        TEXT NOT NULL DEFAULT 'active', -- active | revoked
  request_count INTEGER NOT NULL DEFAULT 0, -- 累計呼び出し（運用可視化）
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_email ON api_keys(email);

-- 月次クォータ用カウンタ（key_id × 'YYYY-MM'）。
CREATE TABLE IF NOT EXISTS api_usage (
  key_id    INTEGER NOT NULL,
  period    TEXT NOT NULL,     -- 'YYYY-MM'
  count     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key_id, period)
);
