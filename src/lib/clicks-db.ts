/**
 * アフィリエイトクリックの一次ログ（堀A／勝者判定の精度）＝Cloudflare D1。
 *
 * なぜ（P1-1/P1-4）：GA4 の affiliate_click は ITP/広告ブロッカーで最大3割欠測する。
 * /go の 302 をくぐったクリックをここで D1 に記録すれば、欠測しないファーストパーティの
 * クリック実数（program × 県 × 面）が貯まり、lead-config の勝者をデータで固定できる。
 *
 * 安全設計（push=本番デプロイなので壊さない）：
 *  - 名簿と同じ `LEADS_DB` バインディングを共用（DBは1つ・テーブルを clicks で分ける）。
 *    バインディングが無ければ完全 no-op（現状は未バインドなので何も起きない）。
 *  - 例外は握りつぶし、/go の 302（送客）に一切影響させない。
 *
 * 点火手順（ユーザー操作）：
 *  1) 名簿用 D1 を作成済みなら同じ DB に migrations/0002_create_clicks.sql を適用するだけ。
 *     `wrangler d1 execute my-naishin-leads --remote --file=migrations/0002_create_clicks.sql`
 *  2) wrangler.jsonc の LEADS_DB バインディングが有効なら、以降クリックが自動で蓄積される。
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

export interface ClickInput {
  affiliateId: string;
  prefecture?: string;
  placement?: string;
  referer?: string;
}

function s(v: string | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return t ? t.slice(0, 300) : null;
}

/**
 * /go のクリックを D1 に記録する。バインディング未設定なら no-op（false）。
 * 返り値：記録できたか（計測補助）。失敗してもリダイレクトは止めない（呼び出し側で握りつぶす）。
 */
export async function persistClick(input: ClickInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO clicks (affiliate_id, prefecture, placement, referer, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .bind(s(input.affiliateId), s(input.prefecture), s(input.placement), s(input.referer))
      .run();
    return true;
  } catch (err) {
    console.error('persistClick skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface ClickAggRow {
  affiliate_id: string;
  prefecture: string | null;
  placement: string | null;
  clicks: number;
}

/**
 * 直近 N 日のクリック集計（KPIダイジェスト＝P6-1 用）。
 * バインディング未設定なら空配列。program × 県 × 面 のクリック実数を返す。
 */
export async function getClickSummary(days = 7): Promise<ClickAggRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT affiliate_id, prefecture, placement, COUNT(*) AS clicks
         FROM clicks
         WHERE created_at >= datetime('now', ?)
         GROUP BY affiliate_id, prefecture, placement
         ORDER BY clicks DESC`
      )
      .bind(`-${since} days`)
      .all<ClickAggRow>();
    return results ?? [];
  } catch (err) {
    console.error('getClickSummary skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
