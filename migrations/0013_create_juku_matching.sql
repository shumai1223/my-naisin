-- 直接マッチング市場バックエンド試作（Λ-7・Ω-6実行層・build-not-launch）のD1スキーマ。
-- 名簿と同じ DB に同居させる（テーブルで分離）。フラグoffで本番投入しない＝データ層のみ先行整備。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0013_create_juku_matching.sql
-- (build-not-launchのためステージング(my-naishin-staging-leads)への適用を優先し、
--  本番適用は👤判断を待つ)
--
-- 設計: 既存のjuku_saas（招待制SaaS・ZZ-4a）とは別のテーブル群にする。SaaS利用塾と
-- 直接マッチング提携塾は別概念（同じ塾が両方を使うことはあり得るが、片方だけの塾も想定される
-- ため結合しない）。take-rate型の直接送客は、既存のアフィリエイト経由送客（juku-match.ts・
-- AFFILIATES）とも独立（アフィリ経由は第三者ASP、直接マッチングは自社請求・自社成果計上）。
-- 個人情報は持たない（studentRefは匿名の参照キーのみ・氏名/連絡先は保存しない）。

CREATE TABLE IF NOT EXISTS juku_partners (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  name                  TEXT NOT NULL,          -- 提携塾名（表示用）
  commission_rate_bps   INTEGER NOT NULL,       -- take-rate（ベーシスポイント。例:1000=10%）
  status                TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'suspended'
  created_at            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS juku_referrals (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  juku_partner_id       INTEGER NOT NULL REFERENCES juku_partners(id),
  student_ref           TEXT NOT NULL,          -- 匿名の参照キー（PIIではない・氏名/連絡先を含まない）
  prefecture_code       TEXT,                    -- prefectures.ts の code（任意）
  format                TEXT,                    -- 'online' | 'in-person'（任意）
  status                TEXT NOT NULL DEFAULT 'sent', -- 'sent' | 'contacted' | 'converted' | 'declined'
  sent_at               TEXT NOT NULL,
  status_updated_at     TEXT
);

CREATE TABLE IF NOT EXISTS juku_commission_entries (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_id           INTEGER NOT NULL REFERENCES juku_referrals(id),
  gross_amount_yen      INTEGER NOT NULL,       -- 塾側の成約金額（税込・円）。生徒からの請求額そのもの
  commission_amount_yen INTEGER NOT NULL,       -- gross_amount_yen × commission_rate_bps / 10000（呼び出し側で計算済みの値を保存）
  billing_period        TEXT NOT NULL,          -- 'YYYY-MM'
  status                TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'invoiced' | 'paid'
  created_at            TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_juku_referrals_partner ON juku_referrals (juku_partner_id);
CREATE INDEX IF NOT EXISTS idx_juku_referrals_sent_at ON juku_referrals (sent_at);
CREATE INDEX IF NOT EXISTS idx_juku_commission_referral ON juku_commission_entries (referral_id);
CREATE INDEX IF NOT EXISTS idx_juku_commission_period ON juku_commission_entries (billing_period);
