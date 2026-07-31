-- 保護者コミュニティ（Λ-14・Ω-17実行層・build-not-launch）のD1スキーマ。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0014_create_community_posts.sql
-- (build-not-launchのためステージング(my-naishin-staging-leads)への適用を優先し、
--  本番適用は👤判断を待つ。2026-08-01時点でこのファイルはまだどちらにも未適用)
--
-- 安全設計: 表示名・連絡先・投稿者を特定できる項目は一切持たない（完全匿名の投稿のみ）。
-- pii_risk_reasons は src/lib/community-posts.ts の detectPiiRisk() が検知した理由コードを
-- カンマ区切りで保存する（空文字列 = 検知なし）。フィルタは自動承認/自動却下を一切行わない
-- （statusは常にpending/flaggedのいずれかで作成され、承認/却下は人間の操作でのみ変わる）。

CREATE TABLE IF NOT EXISTS community_posts (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  category              TEXT NOT NULL,          -- 'question' | 'support'
  body                  TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'flagged' | 'approved' | 'rejected'
  pii_risk_reasons       TEXT NOT NULL DEFAULT '', -- カンマ区切り（例: 'phone-number,email-address'）。空文字列=検知なし
  created_at            TEXT NOT NULL,
  moderated_at          TEXT
);

CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts (status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts (created_at);
