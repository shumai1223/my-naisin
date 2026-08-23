-- 生徒ファネル(S12-1)の一次ログ＝grade_self_identify / university_bridge_click。
-- HyoteiUniversityBridge.tsx（/hyotei-heikinの学年自己申告→my-shingaku導線・2026-08-03実装）は
-- 実測GA4で08-03〜08-10の8日間、両イベントとも0件・同期間のcalc_complete/result_viewすら0件だった
-- （GSCでは同ページ28日920クリックと実トラフィックは存在＝GA4の計測系統そのものが機能していない疑い）。
-- parent_funnel_events（保護者ファネル専用の意味を持つ）とは分離し、生徒起点のイベント専用テーブルとする。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0020_create_student_funnel_events.sql

CREATE TABLE IF NOT EXISTS student_funnel_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  event       TEXT NOT NULL,   -- 'grade_self_identify' | 'university_bridge_click'
  grade       TEXT,            -- 'chugaku' | 'koukou'（該当する場合のみ）
  tool        TEXT,            -- 例: 'hyotei-heikin'
  created_at  TEXT NOT NULL    -- ISO文字列（datetime('now')）
);

CREATE INDEX IF NOT EXISTS idx_student_funnel_events_event ON student_funnel_events (event);
CREATE INDEX IF NOT EXISTS idx_student_funnel_events_created ON student_funnel_events (created_at);
