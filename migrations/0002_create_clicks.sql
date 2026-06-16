-- アフィリエイトクリックの一次ログ（堀A／勝者判定の精度）＝Cloudflare D1。
-- 名簿（0001）と同じ DB に同居させる（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0002_create_clicks.sql
-- 設計: /go の 302 をくぐった一次クリックを記録。GA4 affiliate_click の欠測（ITP/広告ブロッカー）を補完する。

CREATE TABLE IF NOT EXISTS clicks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id  TEXT NOT NULL,   -- affiliates.ts の AffiliateId
  prefecture    TEXT,            -- 県別の効きを分解
  placement     TEXT,            -- 面別の効きを分解（result / hiyou / hensachi …）
  referer       TEXT,            -- 流入元（どのページから押されたか）
  created_at    TEXT NOT NULL    -- ISO 文字列（datetime('now')）
);

-- 集計（program × 県 × 面 × 期間）を速くする。
CREATE INDEX IF NOT EXISTS idx_clicks_aff ON clicks (affiliate_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created ON clicks (created_at);
CREATE INDEX IF NOT EXISTS idx_clicks_placement ON clicks (placement);
