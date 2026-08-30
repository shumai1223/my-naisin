-- API/MCP利用ログ(S13-A A-5)。匿名利用の実測を残す唯一の場所。
-- logApiHit()(src/lib/api-cors.ts)はこれまでconsole.logのみで永続化先が無く、
-- 「月◯◯回使われています」という営業材料の分子が原理的に存在しなかった。
-- api_usage(api-keys.ts)はAPIキー保有者のみを記録するため、匿名アクセス(無料の/api/*・
-- MCPサーバへの直接アクセス等)は別途このテーブルで記録する。
-- PIIは取らない(UA/refererのみ・160文字に切り詰め・IPは記録しない)。
-- 日次ロールアップは集計クエリ側(GROUP BY substr(created_at,1,10))で行い、
-- テーブル自体は生ログを保持する(click_hop_completions/student_funnel_eventsと同方針)。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0022_create_api_hits.sql

CREATE TABLE IF NOT EXISTS api_hits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint   TEXT NOT NULL,   -- 例: 'mcp' / 'mcp-discovery' / 'naishin' / 'total-score'
  ua         TEXT,            -- User-Agent（160文字まで）
  referer    TEXT,            -- Referer（160文字まで・任意）
  created_at TEXT NOT NULL    -- ISO文字列（datetime('now')）
);

CREATE INDEX IF NOT EXISTS idx_api_hits_endpoint ON api_hits (endpoint);
CREATE INDEX IF NOT EXISTS idx_api_hits_created ON api_hits (created_at);
