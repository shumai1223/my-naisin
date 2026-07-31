-- 直接マッチング市場（Λ-7・Ω-6実行層・build-not-launch）に招待トークン認証を追加。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0015_add_juku_partner_invite_token.sql
-- (build-not-launchのためステージング(my-naishin-staging-leads)への適用を優先し、
--  本番適用は👤判断を待つ。2026-08-01時点でこのファイルはまだどちらにも未適用)
--
-- juku-saas-db.ts（juku_accounts.invite_token_hash）と同じ設計: 平文は保存せずSHA-256ハッシュのみ。
-- 発行時に一度だけ平文を返す（admin/juku-matching画面から管理者が手動で塾担当者へ伝える運用）。

ALTER TABLE juku_partners ADD COLUMN invite_token_hash TEXT;
ALTER TABLE juku_partners ADD COLUMN last_used_at TEXT;

CREATE INDEX IF NOT EXISTS idx_juku_partners_invite_token ON juku_partners (invite_token_hash);
