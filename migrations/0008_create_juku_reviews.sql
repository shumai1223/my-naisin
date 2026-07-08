-- 塾口コミDB（TIER R-1・build-not-launch＝フィーチャーフラグ裏の完全実装）＝Cloudflare D1。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0008_create_juku_reviews.sql
-- ⚠️ 2026-07-09時点で未適用（👤監督付き適用待ち）。投稿UI・API（R-1後続）・公開判断（👤）はいずれも未着手。
--
-- 設計方針:
--  - juku_id は affiliates.ts の AffiliateId（juku-match.tsのJUKU_OFFERS等、既存の塾ユニバースの
--    id をそのまま使う）。新規の塾マスタは作らず既存レジストリを単一ソースにする。
--  - status は 'pending'（投稿直後）→ 'approved'/'rejected'（モデレーション後）の状態遷移のみ。
--    遷移ルールは src/lib/juku-reviews.ts の canTransitionReviewStatus() に単一ソース化。
--  - PII最小: 投稿者の識別情報（メール・氏名等）は保存しない設計（匿名口コミ）。

CREATE TABLE IF NOT EXISTS juku_reviews (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  juku_id         TEXT NOT NULL,                 -- affiliates.ts の AffiliateId
  rating          INTEGER NOT NULL,              -- 1-5
  comment         TEXT NOT NULL,
  prefecture_code TEXT,                          -- 任意（地域別の参考情報）
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  moderator_note  TEXT,                          -- 却下理由等（非公開・社内メモ）
  created_at      TEXT NOT NULL,                 -- ISO文字列（datetime('now')）
  moderated_at    TEXT                           -- モデレーション確定時刻（未処理はNULL）
);

CREATE INDEX IF NOT EXISTS idx_juku_reviews_juku ON juku_reviews (juku_id);
CREATE INDEX IF NOT EXISTS idx_juku_reviews_status ON juku_reviews (status);
