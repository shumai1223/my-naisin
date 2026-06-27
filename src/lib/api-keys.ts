/**
 * APIキーの発行・照合・利用計測（堀B／課金ゲートのデータ層）＝Cloudflare D1。
 *
 * DDレポート §H：「データの堀を主張するならまず蛇口（課金ゲート）が要る」。
 * これは その蛇口の最小実装。Stripe接続前でも、キー発行・ティア・月次クォータ・
 * 利用計測まで動く（＝承認待ちの外部要因に依存しない、自力で進む数少ない領域）。
 *
 * 安全設計（[[leads-db]] と同方針・push=本番なので壊さない）：
 *  - D1 バインディング `LEADS_DB` が無ければ全 no-op（発行は失敗 false、照合は null）。
 *  - 平文キーは保存しない（SHA-256 ハッシュのみ）。発行時に一度だけ平文を返す。
 *  - 例外は握りつぶし、APIの可用性に影響させない（照合不能時は匿名扱いにフォールバック）。
 */

import { normalizeTier, periodKey, type ApiTier } from './api-tiers';

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

const KEY_PREFIX = 'mnsk_live_';

/** crypto.getRandomValues から16進トークンを作る（Workers/Node18+ 共通）。 */
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256(平文) の16進。保存・照合はこのハッシュのみで行う。 */
export async function hashApiKey(plaintext: string): Promise<string> {
  const data = new TextEncoder().encode(plaintext);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 平文キーを生成する（mnsk_live_<40hex>）。保存はしない＝呼び出し側がハッシュ化する。 */
export function generateApiKeyPlaintext(): string {
  return KEY_PREFIX + randomHex(20);
}

/** 照合などで使う頭出し識別子（例: mnsk_live_a1b2c3d4）。本人がダッシュボードで自分のキーを見分ける用途。 */
export function keyPrefixOf(plaintext: string): string {
  return plaintext.slice(0, KEY_PREFIX.length + 8);
}

export interface IssueKeyInput {
  tier?: ApiTier;
  label?: string;
  email?: string;
}

export interface IssuedKey {
  /** 平文キー（この一度きりしか取得できない）。 */
  apiKey: string;
  prefix: string;
  tier: Exclude<ApiTier, 'anonymous'>;
}

/**
 * 新規キーを発行して D1 に保存する。バインディング未設定なら null（点火前は休眠）。
 * 既定ティアは free。pro/scale は運営者が手動 or Stripe Webhook 経由で発行する想定。
 */
export async function issueApiKey(input: IssueKeyInput = {}): Promise<IssuedKey | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const tier = normalizeTier(input.tier);
    const apiKey = generateApiKeyPlaintext();
    const hash = await hashApiKey(apiKey);
    const prefix = keyPrefixOf(apiKey);
    await db
      .prepare(
        `INSERT INTO api_keys (key_hash, key_prefix, tier, label, email, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))`
      )
      .bind(hash, prefix, tier, input.label?.slice(0, 80) || null, input.email?.slice(0, 254) || null)
      .run();
    return { apiKey, prefix, tier };
  } catch (err) {
    console.error('issueApiKey skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface KeyRecord {
  id: number;
  tier: Exclude<ApiTier, 'anonymous'>;
  status: 'active' | 'revoked';
  prefix: string;
}

/** ハッシュからキーを引く。見つからない／失効は null。 */
export async function lookupApiKey(hash: string): Promise<KeyRecord | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const q = await db
      .prepare(`SELECT id, tier, status, key_prefix FROM api_keys WHERE key_hash = ? LIMIT 1`)
      .bind(hash)
      .all<{ id: number; tier: string; status: string; key_prefix: string }>();
    const row = q.results?.[0];
    if (!row) return null;
    return {
      id: row.id,
      tier: normalizeTier(row.tier),
      status: row.status === 'revoked' ? 'revoked' : 'active',
      prefix: row.key_prefix,
    };
  } catch (err) {
    console.error('lookupApiKey skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * 当月の利用回数を +1 して新しい合計を返す（クォータ判定用）。
 * api_keys 側の累計と last_used_at も更新する。失敗時は null（＝クォータ判定をスキップ＝可用性優先）。
 */
export async function recordApiUsage(keyId: number, now: Date = new Date()): Promise<number | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const period = periodKey(now);
    const q = await db
      .prepare(
        `INSERT INTO api_usage (key_id, period, count) VALUES (?, ?, 1)
         ON CONFLICT(key_id, period) DO UPDATE SET count = count + 1
         RETURNING count`
      )
      .bind(keyId, period)
      .all<{ count: number }>();
    // 累計と最終利用時刻（可視化用・失敗は無視）。
    try {
      await db
        .prepare(`UPDATE api_keys SET request_count = request_count + 1, last_used_at = datetime('now') WHERE id = ?`)
        .bind(keyId)
        .run();
    } catch {
      /* 可視化更新の失敗はクォータ判定に影響させない */
    }
    return q.results?.[0]?.count ?? null;
  } catch (err) {
    console.error('recordApiUsage skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface ApiKeyStat {
  prefix: string;
  tier: string;
  status: string;
  request_count: number;
  created_at: string;
  last_used_at: string | null;
  this_month: number;
}

/** 管理ダッシュボード用：発行済みキーと当月利用の一覧。未バインドなら空。 */
export async function getApiKeyStats(limit = 50): Promise<ApiKeyStat[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const period = periodKey();
    const n = Math.max(1, Math.min(200, Math.round(limit)));
    const q = await db
      .prepare(
        `SELECT k.key_prefix AS prefix, k.tier, k.status, k.request_count, k.created_at, k.last_used_at,
                COALESCE(u.count, 0) AS this_month
         FROM api_keys k
         LEFT JOIN api_usage u ON u.key_id = k.id AND u.period = ?
         ORDER BY k.id DESC LIMIT ?`
      )
      .bind(period, n)
      .all<ApiKeyStat>();
    return q.results ?? [];
  } catch (err) {
    console.error('getApiKeyStats skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
