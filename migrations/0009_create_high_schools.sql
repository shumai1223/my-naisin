-- 高校ページDBの骨格（TIER R-3・build-not-launch）＝Cloudflare D1。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0009_create_high_schools.sql
-- ⚠️ 2026-07-09時点で未適用（👤監督付き適用待ち）。実在校データの投入・API・公開ページはいずれも未着手。
--
-- 設計方針:
--  - 学校基本情報は「公開データのみ」を大前提とし、source_url（出典）を必須列にする。
--    出典の無い行は src/lib/high-schools.ts の isValidHighSchoolEntry() が投入前に弾く設計
--    （捏造・未検証データの混入をスキーマ+バリデーション両面で防ぐ）。
--  - prefecture_code は prefectures.ts の検証済み入試方式データ（PREFECTURES配列）のcodeと
--    対応させる。これにより各校のページから「その都道府県の検証済み総合得点計算方式」へ
--    自動的に接続できる（新規に学校別入試データを作らない＝検証済み入試方式接続）。
--  - 口コミ将来枠：juku_reviews（migrations/0008）と同型の高校版テーブルを別途用意する
--    （high_school_idを外部キーにするため、high_schoolsが先に存在する必要がある。今回は
--    high_schoolsの骨格のみを作り、口コミテーブル自体はhigh_schoolsに実データが入ってから
--    R-3第2弾で追加する＝存在しない親テーブルへの参照を避ける安全側の順序）。

CREATE TABLE IF NOT EXISTS high_schools (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  prefecture_code TEXT NOT NULL,              -- prefectures.ts の PREFECTURES[].code と対応
  name            TEXT NOT NULL,              -- 学校名（公開データのみ）
  school_type     TEXT NOT NULL,              -- 'public' | 'private'
  source_url      TEXT NOT NULL,              -- 出典（学校公式サイト・教育委員会等の一次情報）
  source_checked_at TEXT,                     -- 出典を最終確認した日付（'YYYY-MM-DD'）
  created_at      TEXT NOT NULL,              -- ISO文字列（datetime('now')）
  updated_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_high_schools_pref ON high_schools (prefecture_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_high_schools_pref_name ON high_schools (prefecture_code, name);
