-- 保護者ファネル(TIER Σ-3)の一次ログ＝share_to_parent / parent_landing_view。
-- GA4は約14倍undercountするため判定に使えない([[ga4-undercounts-conversions]])。
-- affiliate_clickは既存のclicksテーブル(placement='parent-lp')を流用し、このテーブルとJOINせず
-- アプリ側(parent-funnel-db.ts)で3値を突合して到達率を出す。
-- 名簿(0001)/クリック(0002)/学校ページクリック(0016)と同じDBに同居させる（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0017_create_parent_funnel_events.sql

CREATE TABLE IF NOT EXISTS parent_funnel_events (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  event            TEXT NOT NULL,   -- 'share_to_parent' | 'parent_landing_view'
  medium           TEXT,            -- share_to_parentのみ: 'native' | 'copy' | 'line' | 'x'
  prefecture_code  TEXT,
  created_at       TEXT NOT NULL    -- ISO文字列（datetime('now')）
);

CREATE INDEX IF NOT EXISTS idx_parent_funnel_events_event ON parent_funnel_events (event);
CREATE INDEX IF NOT EXISTS idx_parent_funnel_events_created ON parent_funnel_events (created_at);
