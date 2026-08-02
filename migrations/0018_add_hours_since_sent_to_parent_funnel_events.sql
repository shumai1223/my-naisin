-- 保護者ファネル(TIER Σ-5)の遅延着地捕捉。生徒が送信した時刻(sentAt)から
-- 保護者が実際に着地するまでの経過時間(時間単位・整数)を記録する列を追加する。
-- 「親はあとで見る」を前提に、即時CVだけでなく24-72時間後等の遅延着地も可視化する。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0018_add_hours_since_sent_to_parent_funnel_events.sql

ALTER TABLE parent_funnel_events ADD COLUMN hours_since_sent INTEGER;
