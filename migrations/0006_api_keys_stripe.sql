-- 0006_api_keys_stripe.sql
-- Stripe Billing 連携（課金ループの本丸）：購読IDとキーを紐づけ、解約時に自動失効できるようにする。
-- 0005 適用後に実行する。SQLite は ADD COLUMN を1文ずつ。

ALTER TABLE api_keys ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE api_keys ADD COLUMN stripe_subscription_id TEXT;

CREATE INDEX IF NOT EXISTS idx_api_keys_subscription ON api_keys(stripe_subscription_id);
