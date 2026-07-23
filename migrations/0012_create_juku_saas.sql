-- 塾SaaS MVP「デモできる実物」(ZZ-4a・Ω-8実行層・build-not-launch)のD1スキーマ。
-- 名簿と同じ DB に同居させる（テーブルで分離）。
-- 適用: wrangler d1 execute my-naishin-leads --remote --file=migrations/0012_create_juku_saas.sql
--
-- 設計: 招待制(招待トークンのハッシュのみ保存・平文は発行時の一度きり)。塾アカウント1件が
-- 複数の生徒を持ち、生徒1件が複数の成績スナップショット（内申点/偏差値/総合得点の記録時点値）を
-- 持つ1対多。既存エンジン(naishin/hensachi/total-score)の再計算結果を都度スナップショットとして
-- 積むだけで、独自の採点ロジックは持たない（捏造ゼロ原則＝計算は既存の検証済みエンジンに委譲）。

CREATE TABLE IF NOT EXISTS juku_accounts (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name                TEXT NOT NULL,          -- 塾名（表示用）
  invite_token_hash   TEXT NOT NULL UNIQUE,   -- SHA-256(招待トークン平文)。平文はDBに残さない
  status              TEXT NOT NULL DEFAULT 'active',  -- 'active' | 'revoked'
  created_at          TEXT NOT NULL,          -- ISO文字列(datetime('now'))
  last_used_at        TEXT
);

CREATE TABLE IF NOT EXISTS juku_students (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  juku_account_id     INTEGER NOT NULL REFERENCES juku_accounts(id),
  display_name        TEXT NOT NULL,          -- 塾側が管理用に付ける表示名(実名でなくてよい・イニシャル等推奨)
  prefecture_code     TEXT,                    -- prefectures.ts の code（任意・県別方式の計算に使う）
  created_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS juku_score_snapshots (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id          INTEGER NOT NULL REFERENCES juku_students(id),
  metric              TEXT NOT NULL,          -- 'naishin' | 'hensachi' | 'total-score'
  value               REAL NOT NULL,
  max_value            REAL,                   -- naishin/total-scoreのみ(満点。hensachiはNULL)
  recorded_at         TEXT NOT NULL,          -- 記録対象時点(例: 中3・7月時点)。塾側入力
  created_at          TEXT NOT NULL           -- このレコード自体の作成日時
);

CREATE INDEX IF NOT EXISTS idx_juku_students_account ON juku_students (juku_account_id);
CREATE INDEX IF NOT EXISTS idx_juku_snapshots_student ON juku_score_snapshots (student_id);
CREATE INDEX IF NOT EXISTS idx_juku_snapshots_created ON juku_score_snapshots (created_at);
