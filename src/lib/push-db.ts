/**
 * Web Push 購読の永続化（堀A＝Google非依存の再訪チャネル・H-NEW）＝Cloudflare D1。
 *
 * なぜ：SEOが揺れても、名簿＋プッシュ購読があれば「出願2週間前にリマインド→サイト再訪→合否計算→CTA」
 * という再訪ループが回る。1,000人購読すれば「1プッシュで数万円」が動く装置になる。
 *
 * 安全設計（push=本番デプロイなので壊さない）：
 *  - 名簿・クリックと同じ LEADS_DB バインディングを共用（テーブルを push_subscriptions で分離）。
 *  - バインディングが無ければ完全 no-op（現状未バインドなので何も起きない）。
 *  - 例外は握りつぶし、購読UIや他機能に影響させない。
 *
 * 点火手順（ユーザー操作）：
 *  1) migrations/0003_create_push_subscriptions.sql を適用。
 *  2) wrangler.jsonc の LEADS_DB バインディングを有効化。
 *  3) VAPID 鍵を env に設定（NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT）。
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

export interface PushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  prefecture?: string;
  audience?: string;
  userAgent?: string;
}

function s(v: string | undefined, max = 600): string | null {
  if (!v) return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

/** 購読の妥当性（最低限）。endpointはhttps、鍵は非空。 */
export function isValidSubscription(x: Partial<PushSubscriptionInput> | null | undefined): x is PushSubscriptionInput {
  return Boolean(
    x &&
      typeof x.endpoint === 'string' &&
      /^https:\/\//.test(x.endpoint) &&
      x.endpoint.length <= 1000 &&
      typeof x.p256dh === 'string' &&
      x.p256dh.length > 0 &&
      typeof x.auth === 'string' &&
      x.auth.length > 0
  );
}

/**
 * 購読を保存（同一 endpoint は upsert で更新・失効解除）。
 * バインディング未設定なら no-op（false）。失敗は握りつぶす。
 */
export async function saveSubscription(input: PushSubscriptionInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth, prefecture, audience, user_agent, created_at, revoked)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 0)
         ON CONFLICT(endpoint) DO UPDATE SET
           p256dh=excluded.p256dh,
           auth=excluded.auth,
           prefecture=COALESCE(excluded.prefecture, push_subscriptions.prefecture),
           audience=COALESCE(excluded.audience, push_subscriptions.audience),
           user_agent=excluded.user_agent,
           revoked=0`
      )
      .bind(
        s(input.endpoint, 1000),
        s(input.p256dh),
        s(input.auth),
        s(input.prefecture, 40),
        s(input.audience, 16),
        s(input.userAgent, 300)
      )
      .run();
    return true;
  } catch (err) {
    console.error('saveSubscription skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** 購読を失効（解除 or 410応答時）。endpoint一致行に revoked=1。 */
export async function revokeSubscription(endpoint: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(`UPDATE push_subscriptions SET revoked=1 WHERE endpoint = ?`)
      .bind(s(endpoint, 1000))
      .run();
    return true;
  } catch (err) {
    console.error('revokeSubscription skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface PushSubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
  prefecture: string | null;
  audience: string | null;
}

/** 有効な購読数（KPI／ダイジェスト用）。未バインドなら 0。 */
export async function countActiveSubscriptions(): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;
    const { results } = await db
      .prepare(`SELECT COUNT(*) AS n FROM push_subscriptions WHERE revoked = 0`)
      .all<{ n: number }>();
    return results?.[0]?.n ?? 0;
  } catch (err) {
    console.error('countActiveSubscriptions skipped:', err instanceof Error ? err.message : err);
    return 0;
  }
}
