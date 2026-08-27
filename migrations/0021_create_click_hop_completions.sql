-- クリックホップ通過率計測(出血6②・PHASE0_FINDINGS.md)。
-- /go/[id]のJSホップページ(click-hop.ts)は、内部referer無しアクセスに302の代わりに
-- JS実行ブラウザだけがASPへ進む中間ページを返す設計だが、実際にJSが実行され
-- location.replaceまで到達した割合(通過率)を計測する仕組みがこれまで無かった
-- （分母=persistClickで記録されるsuspect分類のクリック数、分子がこのテーブル）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0021_create_click_hop_completions.sql

CREATE TABLE IF NOT EXISTS click_hop_completions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id TEXT NOT NULL,
  created_at   TEXT NOT NULL    -- ISO文字列（datetime('now')）
);

CREATE INDEX IF NOT EXISTS idx_click_hop_completions_affiliate ON click_hop_completions (affiliate_id);
CREATE INDEX IF NOT EXISTS idx_click_hop_completions_created ON click_hop_completions (created_at);
