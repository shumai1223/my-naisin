-- 学校ページの保護者向けリードフォーム(T-N1-N4 C10-2)で、塾への第三者提供に
-- 同意したリードを区別するためのフラグを追加する。
-- 背景: [[takerate-souyaku-internalization]]の送客内製化(Ω-6)に向けた第一歩。
-- 塾への提供は本人が明示的にオプトイン(デフォルトOFF)した場合のみ許可する設計。
-- このマイグレーションは同意フラグの保存までを行う。実際に塾へメールアドレスを
-- 渡す処理は別途👤ゲートの対象（本マイグレーションには含まれない）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0024_add_leads_juku_optin.sql

ALTER TABLE leads ADD COLUMN juku_optin INTEGER NOT NULL DEFAULT 0;  -- 0=不同意(既定) / 1=塾への提供に同意
ALTER TABLE leads ADD COLUMN optin_at TEXT;  -- 同意した時刻のISO文字列（同意していない場合はNULL）

CREATE INDEX IF NOT EXISTS idx_leads_juku_optin ON leads (juku_optin);
