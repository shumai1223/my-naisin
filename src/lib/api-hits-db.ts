/**
 * API/MCP利用ログ(S13-A A-5)の一次記録＝Cloudflare D1。
 *
 * なぜ: `logApiHit()`(api-cors.ts)はこれまで`console.log`のみで永続化先が無く、
 * `api_usage`(api-keys.ts)はAPIキー保有者のみを記録するため、**匿名のAPI/MCP利用は
 * 原理的に1行も記録されていなかった**。「月◯◯回使われています」という営業材料の
 * 分子を作るため、このモジュールで生ログをD1に残す。
 *
 * 安全設計（click-hop-db.ts/student-funnel-db.tsと同方針）:
 *  - 名簿/クリックと同じ`LEADS_DB`バインディングを共用（DBは1つ・テーブルを分ける）。
 *    バインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）。
 *  - 例外は握りつぶし、呼び出し側（APIレスポンス）に一切影響させない。
 *  - PIIは取らない（UA/refererのみ・160文字に切り詰め・IPは記録しない）。
 *
 * 点火手順: migrations/0022_create_api_hits.sql をLEADS_DBに適用するだけ。
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

/**
 * API/MCPへの匿名アクセスをD1に記録する。
 * バインディング未設定なら no-op（false）。失敗してもAPIレスポンスは止めない（呼び出し側で握りつぶす）。
 */
export async function persistApiHit(endpoint: string, ua?: string, referer?: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    const ep = endpoint.trim().slice(0, 80);
    if (!ep) return false;
    await db
      .prepare(`INSERT INTO api_hits (endpoint, ua, referer, created_at) VALUES (?, ?, ?, datetime('now'))`)
      .bind(ep, ua?.slice(0, 160) ?? null, referer?.slice(0, 160) ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('persistApiHit skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** 直近N日のエンドポイント別・日別の利用回数（日次ロールアップ）。バインディング未設定なら空。 */
export async function getApiHitsDailyRollup(
  days = 30
): Promise<{ day: string; endpoint: string; n: number }[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS day, endpoint, COUNT(*) AS n
         FROM api_hits
         WHERE created_at >= datetime('now', ?)
         GROUP BY day, endpoint
         ORDER BY day DESC, endpoint ASC`
      )
      .bind(`-${since} days`)
      .all<{ day: string; endpoint: string; n: number }>();
    return results ?? [];
  } catch (err) {
    console.error('getApiHitsDailyRollup skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/** 直近N日の総利用回数（エンドポイント横断）。「月◯◯回使われています」用の単一数値。 */
export async function getApiHitsTotalCount(days = 30): Promise<number> {
  const rollup = await getApiHitsDailyRollup(days);
  return rollup.reduce((sum, r) => sum + r.n, 0);
}
