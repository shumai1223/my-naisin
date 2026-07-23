-- 採用レーダー（ZZ-6e）＝どのサイトが既に/embedウィジェット・無キーAPIを組み込んでいるかの検出ログ。
-- 名簿（0001）と同じ DB に同居させる（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0011_create_adoption_domains.sql
-- 設計: 生IPは一切保存しない（列自体が存在しない）。domainは常にhostnameのみ（クエリ文字列・パス無し）。

CREATE TABLE IF NOT EXISTS adoption_domains (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  domain        TEXT NOT NULL,   -- 検出元の外部ドメイン（my-naishin.com自身は除外済み）
  source        TEXT NOT NULL,   -- 'embed_naishin' | 'embed_hensachi' | 'api_anonymous'
  path          TEXT,            -- 無キーAPI呼出時のみ、叩かれたパス（例: /api/naishin/tokyo）
  created_at    TEXT NOT NULL    -- ISO 文字列（datetime('now')）
);

CREATE INDEX IF NOT EXISTS idx_adoption_domains_domain ON adoption_domains (domain);
CREATE INDEX IF NOT EXISTS idx_adoption_domains_created ON adoption_domains (created_at);
