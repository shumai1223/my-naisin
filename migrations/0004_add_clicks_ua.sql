-- クリック一次ログに User-Agent と IPハッシュを追加（bot/人間の確定分類・レート制限用）。
-- 背景（2026-06-20）：ブラウザ風UAでフィルタをすり抜けるbotが /go を踏み、
--   「短時間・多面・多案件・null referer」のバーストでデータを汚した。UAを保存していないと
--   挙動からの推定しかできなかった。UA+IPハッシュを記録して、以後は確定で分類する。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0004_add_clicks_ua.sql
-- 設計: IPは生で持たず SHA-256 の先頭16桁ハッシュのみ（PII最小・bot判定には十分）。

ALTER TABLE clicks ADD COLUMN user_agent TEXT;  -- 端末/botの識別（先頭を保存）
ALTER TABLE clicks ADD COLUMN ip_hash TEXT;      -- 同一送信元のバースト検出用（生IPは保存しない）

-- 同一IPの短時間バースト検出（レート制限）を速くする。
CREATE INDEX IF NOT EXISTS idx_clicks_ip ON clicks (ip_hash, created_at);
