-- DW-1（2026-08-10）: 匿名統計の投稿に「出所の信頼度」を持たせる。
--
-- 事故: /api/stats/submit にボットUA検査もオリジン検査も無く（レート制限もアイソレート内Mapで
--   分散IPに貫通する）、自動投稿が混入した。結果、本番が「偏差値の全国平均 = 63.16」を配信していた
--   （偏差値は定義上、母集団平均が50）。
--   実測: hensachi 263件中243件(92%)が 07-16/07-22/07-27/08-01/08-07 の5日に集中。
--         同期間のGA4 stats_optin_grant は28日で10件。実トラフィックは148〜172クリック/日。
--
-- 方針: 汚染行を削除しない。列を足して隔離する（Y-0「データを壊さず、確認できないものは空にして理由を書く」）。
--   既存の全行は trusted=0（DEFAULT）になり、集計から自動的に外れる。復旧は「消す」ではなく
--   「信頼できる行が貯まるのを待つ」で行う。事故の規模も後から検証できる状態で残す。
--
--   trusted       1 = 送信元の真正性検査を通過（ブラウザUA かつ 自サイトからの遷移）
--                 0 = 未検証 / 検査に落ちた（既存行はすべてこちら）
--   trust_class   bot-filter.ts の ClickTrust をそのまま保存（human/suspect/bot/unknown）。
--                 なぜ trusted=0 なのかを後から分解できるようにするため。
--
-- 適用（本番）: wrangler d1 execute my-naishin-leads --remote --file=migrations/0019_add_provenance_to_stats_submissions.sql
-- 適用（ステージング）: wrangler d1 execute my-naishin-staging-leads --remote --file=migrations/0019_add_provenance_to_stats_submissions.sql
-- ⚠️ 適用前に stats_submissions のバックアップを取得すること（backups/ 配下）。

ALTER TABLE stats_submissions ADD COLUMN trusted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE stats_submissions ADD COLUMN trust_class TEXT;
