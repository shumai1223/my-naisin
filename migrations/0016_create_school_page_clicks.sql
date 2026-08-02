-- 学校別倍率ページ(Λ-2)のCTAクリック一次ログ＝主食②-2。
-- GA4は転換を大幅に取りこぼす下限値のため使わず、D1で実数を記録する。
-- 名簿(0001)/クリック(0002)と同じDBに同居させる（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0016_create_school_page_clicks.sql

CREATE TABLE IF NOT EXISTS school_page_clicks (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  prefecture_code  TEXT NOT NULL,
  school_code      TEXT NOT NULL,
  cta              TEXT NOT NULL,   -- 'reverse' | 'juku-shindan' | 'line'
  created_at       TEXT NOT NULL    -- ISO文字列（datetime('now')）
);

-- 集計（学校×CTA×期間）を速くする。
CREATE INDEX IF NOT EXISTS idx_school_page_clicks_school ON school_page_clicks (prefecture_code, school_code);
CREATE INDEX IF NOT EXISTS idx_school_page_clicks_cta ON school_page_clicks (cta);
CREATE INDEX IF NOT EXISTS idx_school_page_clicks_created ON school_page_clicks (created_at);
