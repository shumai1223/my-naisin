/**
 * 塾SaaS MVP「デモできる実物」(ZZ-4a・Ω-8実行層・build-not-launch)のD1層。
 *
 * なぜ：B2Bの律速=最初の1社。ベネッセ商談で「直接の内申点計算ニーズ」は実証済み→
 * デモできる実物が次の商談の武器になる。本ファイルはその第一歩＝スキーマと招待制認証のみ。
 * 生徒別自動計算(ZZ-4c)・ダッシュボード(ZZ-4d)・CSV一括取込(ZZ-4b)は後続タスクで積む。
 *
 * 安全設計（api-keys.ts / clicks-db.tsと同方針・push=本番デプロイなので壊さない）：
 *  - 名簿と同じ `LEADS_DB` バインディングを共用。バインディングが無ければ全no-op。
 *  - 招待トークンは平文を保存しない（SHA-256ハッシュのみ）。発行時に一度だけ平文を返す。
 *  - 例外は握りつぶし、呼び出し側の可用性に影響させない。
 *
 * 点火手順（本人操作・👤専用・build-not-launchのため現時点では未実行）：
 *  wrangler d1 execute my-naishin-leads --remote --file=migrations/0012_create_juku_saas.sql
 */

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
interface MinimalD1 {
  prepare(query: string): D1PreparedStatement;
}

async function getDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

const INVITE_TOKEN_PREFIX = 'jinv_';

/** crypto.getRandomValues から16進トークンを作る（api-keys.tsのrandomHexと同型）。 */
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256(平文)の16進。保存・照合はこのハッシュのみで行う（api-keys.tsのhashApiKeyと同型）。 */
export async function hashInviteToken(plaintext: string): Promise<string> {
  const data = new TextEncoder().encode(plaintext);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 平文招待トークンを生成する（jinv_<40hex>）。保存はしない＝呼び出し側がハッシュ化する。 */
export function generateInviteTokenPlaintext(): string {
  return INVITE_TOKEN_PREFIX + randomHex(20);
}

export type JukuAccountStatus = 'active' | 'revoked';

export interface CreatedJukuAccount {
  /** 平文招待トークン（この一度きりしか取得できない）。塾担当者に渡すログインURLに埋め込む。 */
  inviteToken: string;
  jukuAccountId: number;
}

/**
 * 新規塾アカウントを発行し招待トークンを払い出す。バインディング未設定なら null（点火前は休眠）。
 * 名前だけで作成できる最小構成（メール確認・パスワードは持たない＝招待URL自体が認証情報）。
 */
export async function createJukuAccount(name: string): Promise<CreatedJukuAccount | null> {
  const trimmed = name.trim().slice(0, 120);
  if (!trimmed) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const inviteToken = generateInviteTokenPlaintext();
    const hash = await hashInviteToken(inviteToken);
    const result = await db
      .prepare(
        `INSERT INTO juku_accounts (name, invite_token_hash, status, created_at) VALUES (?, ?, 'active', datetime('now'))`
      )
      .bind(trimmed, hash)
      .run();
    const jukuAccountId = (result as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    if (typeof jukuAccountId !== 'number') return null;
    return { inviteToken, jukuAccountId };
  } catch (err) {
    console.error('createJukuAccount skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface JukuAccountRecord {
  id: number;
  name: string;
  status: JukuAccountStatus;
}

/**
 * 招待トークン（平文）から塾アカウントを引く。見つからない・失効は null。
 * 見つかった場合は last_used_at を更新する（アクセス実績の可視化用・失敗は無視）。
 */
export async function verifyInviteToken(plaintext: string): Promise<JukuAccountRecord | null> {
  if (!plaintext) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const hash = await hashInviteToken(plaintext);
    const q = await db
      .prepare(`SELECT id, name, status FROM juku_accounts WHERE invite_token_hash = ? LIMIT 1`)
      .bind(hash)
      .all<{ id: number; name: string; status: string }>();
    const row = q.results?.[0];
    if (!row || row.status === 'revoked') return null;
    try {
      await db.prepare(`UPDATE juku_accounts SET last_used_at = datetime('now') WHERE id = ?`).bind(row.id).run();
    } catch {
      /* アクセス実績更新の失敗は認証結果に影響させない */
    }
    return { id: row.id, name: row.name, status: 'active' };
  } catch (err) {
    console.error('verifyInviteToken skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface JukuStudentRecord {
  id: number;
  displayName: string;
  prefectureCode: string | null;
}

/** 生徒を追加する。バインディング未設定・入力不正はfalse。 */
export async function addJukuStudent(
  jukuAccountId: number,
  displayName: string,
  prefectureCode?: string
): Promise<number | null> {
  const trimmed = displayName.trim().slice(0, 80);
  if (!trimmed || !Number.isFinite(jukuAccountId)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const result = await db
      .prepare(
        `INSERT INTO juku_students (juku_account_id, display_name, prefecture_code, created_at) VALUES (?, ?, ?, datetime('now'))`
      )
      .bind(jukuAccountId, trimmed, prefectureCode?.trim().slice(0, 40) || null)
      .run();
    const studentId = (result as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    return typeof studentId === 'number' ? studentId : null;
  } catch (err) {
    console.error('addJukuStudent skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/** その塾アカウントに属する生徒一覧（登録順）。バインディング未設定なら空。 */
export async function listJukuStudents(jukuAccountId: number): Promise<JukuStudentRecord[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const q = await db
      .prepare(
        `SELECT id, display_name, prefecture_code FROM juku_students WHERE juku_account_id = ? ORDER BY id ASC`
      )
      .bind(jukuAccountId)
      .all<{ id: number; display_name: string; prefecture_code: string | null }>();
    return (q.results ?? []).map((r) => ({
      id: r.id,
      displayName: r.display_name,
      prefectureCode: r.prefecture_code,
    }));
  } catch (err) {
    console.error('listJukuStudents skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export type SnapshotMetric = 'naishin' | 'hensachi' | 'total-score';

/**
 * 成績スナップショットを1件追加する。value/maxValueは既存エンジン(naishin/hensachi/total-score)の
 * 計算結果をそのまま渡す想定＝本モジュール自体は独自の採点ロジックを一切持たない（捏造ゼロ）。
 */
export async function addScoreSnapshot(input: {
  studentId: number;
  metric: SnapshotMetric;
  value: number;
  maxValue?: number;
  recordedAt: string;
}): Promise<boolean> {
  if (!Number.isFinite(input.studentId) || !Number.isFinite(input.value)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO juku_score_snapshots (student_id, metric, value, max_value, recorded_at, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(input.studentId, input.metric, input.value, input.maxValue ?? null, input.recordedAt)
      .run();
    return true;
  } catch (err) {
    console.error('addScoreSnapshot skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface ScoreSnapshotRecord {
  metric: SnapshotMetric;
  value: number;
  maxValue: number | null;
  recordedAt: string;
}

/** 生徒1人の成績推移（記録時点の古い順）。バインディング未設定なら空。 */
export async function getStudentSnapshots(studentId: number): Promise<ScoreSnapshotRecord[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const q = await db
      .prepare(
        `SELECT metric, value, max_value, recorded_at FROM juku_score_snapshots
         WHERE student_id = ? ORDER BY recorded_at ASC`
      )
      .bind(studentId)
      .all<{ metric: string; value: number; max_value: number | null; recorded_at: string }>();
    return (q.results ?? []).map((r) => ({
      metric: r.metric as SnapshotMetric,
      value: r.value,
      maxValue: r.max_value,
      recordedAt: r.recorded_at,
    }));
  } catch (err) {
    console.error('getStudentSnapshots skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
