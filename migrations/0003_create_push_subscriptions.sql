-- Web Push 購読の保存（堀A／Google非依存の再訪チャネル＝H-NEW）。
-- 名簿（0001）・クリック（0002）と同じ DB に同居（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0003_create_push_subscriptions.sql
-- 設計: ブラウザの PushSubscription（endpoint + p256dh/auth 鍵）を保存し、
--       出願締切・通知表リマインドを scripts/push-send.ts（web-push + VAPID）で配信する。

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint    TEXT NOT NULL UNIQUE,  -- プッシュサービスのエンドポイント（端末ごとに一意）
  p256dh      TEXT NOT NULL,         -- 公開鍵（payload暗号化に使用）
  auth        TEXT NOT NULL,         -- 認証シークレット
  prefecture  TEXT,                  -- 県別の出し分け（出願日程など・任意）
  audience    TEXT,                  -- student / parent（配信の出し分け・任意）
  user_agent  TEXT,                  -- 端末の参考情報（任意）
  created_at  TEXT NOT NULL,         -- ISO 文字列（datetime('now')）
  revoked     INTEGER NOT NULL DEFAULT 0  -- 失効（410/解除）でフラグ。配信対象から除外
);

CREATE INDEX IF NOT EXISTS idx_push_pref ON push_subscriptions (prefecture);
CREATE INDEX IF NOT EXISTS idx_push_audience ON push_subscriptions (audience);
CREATE INDEX IF NOT EXISTS idx_push_revoked ON push_subscriptions (revoked);
