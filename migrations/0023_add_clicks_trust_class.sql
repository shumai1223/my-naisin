-- クリック一次ログに信頼度分類(trust_class)を書き込み時点で確定させる(T-M2 M2-2)。
-- 背景(2026-08-29 👤指示): これまで信頼度(human/suspect)はダッシュボード側がSELECT時にSQLの
-- CASE式(TRUSTED_CLAUSE)で毎回計算しており、行そのものには残っていなかった。TH-13のような
-- 新しいbot手口を後から見つけた際、過去データを遡って再分類できない(D1の行を消す運用も
-- 望ましくない=分類して残す方針)。書き込み時点の判定根拠(内部referer・Sec-Fetch-Site・
-- isImplausibleReferer)をそのままtrust_classへ保存し、将来の分類ロジック変更時にも
-- 「どの時点でどう判定されたか」を追跡できるようにする。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0023_add_clicks_trust_class.sql

ALTER TABLE clicks ADD COLUMN trust_class TEXT;  -- 'human' | 'suspect'（書き込み時点の判定。botは既に手前で弾かれ記録されない）

CREATE INDEX IF NOT EXISTS idx_clicks_trust_class ON clicks (trust_class);
