/**
 * クリックホップ通過率(出血6②・PHASE0_FINDINGS.md)の一次ログ＝Cloudflare D1。
 *
 * なぜ: `/go/[id]`は内部referer無しアクセス（LINE/メール経由の実ユーザー or スクレイパ）に
 * 302の代わりにJSホップページ（click-hop.ts）を返す。分母（ホップページを返した回数）は
 * 既存のclicks-db.ts（persistClick・suspect分類）で分かるが、**分子（実際にJSが実行され
 * location.replaceまで到達した回数）を計測する仕組みが無かった**。このモジュールは
 * ホップページ自身が発火するビーコンをD1に記録し、通過率(completions / suspectクリック数)を
 * 算出できるようにする。
 *
 * 安全設計（student-funnel-db.ts/parent-funnel-db.tsと同方針）:
 *  - 名簿/クリックと同じ`LEADS_DB`バインディングを共用（DBは1つ・テーブルを分ける）。
 *    バインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）。
 *  - 例外は握りつぶし、呼び出し側（APIレスポンス）に一切影響させない。
 *
 * 点火手順: migrations/0021_create_click_hop_completions.sql をLEADS_DBに適用するだけ。
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
 * クリックホップの通過(JS実行→location.replace到達)をD1に記録する。
 * バインディング未設定なら no-op（false）。失敗してもビーコン応答は止めない（呼び出し側で握りつぶす）。
 */
export async function persistClickHopCompletion(affiliateId: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    const id = affiliateId.trim().slice(0, 40);
    if (!id) return false;
    await db
      .prepare(`INSERT INTO click_hop_completions (affiliate_id, created_at) VALUES (?, datetime('now'))`)
      .bind(id)
      .run();
    return true;
  } catch (err) {
    console.error('persistClickHopCompletion skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** 直近N日のaffiliate別ホップ通過件数。バインディング未設定なら空。 */
export async function getClickHopCompletionCounts(days = 30): Promise<Record<string, number>> {
  try {
    const db = await getDb();
    if (!db) return {};
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT affiliate_id, COUNT(*) AS n
         FROM click_hop_completions
         WHERE created_at >= datetime('now', ?)
         GROUP BY affiliate_id`
      )
      .bind(`-${since} days`)
      .all<{ affiliate_id: string; n: number }>();
    const counts: Record<string, number> = {};
    for (const row of results ?? []) counts[row.affiliate_id] = row.n;
    return counts;
  } catch (err) {
    console.error('getClickHopCompletionCounts skipped:', err instanceof Error ? err.message : err);
    return {};
  }
}
