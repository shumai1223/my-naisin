-- メール開封/クリック計測（TIER Q-4・C-7の運用編）＝Cloudflare D1。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0010_create_email_events.sql
-- ⚠️ 2026-07-09時点で未適用（👤監督付き適用待ち）。Resend側のWebhook登録・
-- 送信ドメインのオープン/クリックトラッキング有効化（Resendダッシュボード設定）も👤作業。
--
-- 設計方針:
--  - Resend Webhookのイベントをほぼそのまま記録する薄いログテーブル。
--  - どの配信（保護者メール講座のどのステップ・冬窓A/B等）に対するイベントかは、
--    送信時にResendのtags機能で付与した値（例: kind=parent_course, course_step=3）が
--    webhookペイロードのdata.tagsにそのまま返ってくるため、送信時に別途DB書き込みをしなくても
--    tags_jsonから相関できる（scripts/newsletter.tsの送信時tags付与とセット）。

CREATE TABLE IF NOT EXISTS email_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type      TEXT NOT NULL,     -- 'email.opened' | 'email.clicked' | 'email.delivered' 等（Resendのtype）
  resend_email_id TEXT,              -- Resendが割り当てたメールID（data.email_id）
  recipient       TEXT,              -- 宛先メールアドレス（複数宛先の場合は先頭のみ・PII最小化のため生ログは短期保持想定）
  link            TEXT,              -- email.clickedの場合のみ、クリックされたリンクURL
  tags_json        TEXT,              -- data.tagsをそのままJSON文字列化（kind/course_step等の相関キー）
  created_at      TEXT NOT NULL      -- ISO文字列（datetime('now')。Resend側のcreated_atでなく受信時刻）
);

CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events (event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created ON email_events (created_at);
