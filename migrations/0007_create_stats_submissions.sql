-- 匿名統計（TIER N-2・A-12の一次データ堀）＝Cloudflare D1。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0007_create_stats_submissions.sql
-- ⚠️ 2026-07-09時点で未適用（👤監督付き適用待ち）。適用前提の送信元API（N-3）も未実装。
--
-- 設計方針:
--  - PII（メール・氏名・IP・ユーザー識別子等）は一切保存しない列構成。個人を特定できる情報を
--    持たないことが「匿名で統計に協力する」（StatsOptIn・stats-consent.ts）という同意文言の前提。
--  - 保存するのは計算結果の数値と、集計軸となる都道府県・学年・指標種別・期間のみ。
--  - 集計・公開時のk-匿名性（n<30は非表示）はクエリ側（N-3/N-4）の責務。このテーブル自体は
--    生の提出行を持つが、公開APIは常に閾値未満のセルを返さない設計にする
--    （閾値定数はsrc/lib/stats-aggregation.tsのSTATS_MIN_SAMPLE_SIZEに単一ソース化）。

CREATE TABLE IF NOT EXISTS stats_submissions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  metric          TEXT NOT NULL,   -- 指標種別: 'naishin' | 'hensachi' | 'total-score' 等（stats-aggregation.tsのSTATS_METRICSと対応）
  prefecture_code TEXT,            -- 都道府県コード（任意・prefectures.tsのcodeと対応）
  grade           TEXT,            -- 学年（'g1'|'g2'|'g3'等・任意）
  value           REAL NOT NULL,   -- 計算結果の数値（内申点・偏差値等）
  max_value       REAL,            -- 満点（内申点45点等。偏差値のように満点概念が無い指標はNULL）
  created_at      TEXT NOT NULL    -- ISO文字列（datetime('now')。個人の操作時刻でなく集計用の期間軸）
);

-- 集計（指標 × 都道府県 × 期間）を速くする。
CREATE INDEX IF NOT EXISTS idx_stats_metric ON stats_submissions (metric);
CREATE INDEX IF NOT EXISTS idx_stats_pref ON stats_submissions (prefecture_code);
CREATE INDEX IF NOT EXISTS idx_stats_created ON stats_submissions (created_at);
