/**
 * 学校別倍率ページ(Λ-2)のCTAクリック一次ログ＝Cloudflare D1（主食②-2）。
 *
 * なぜ（[[ga4-undercounts-conversions]]）：GA4は転換を大幅に取りこぼす下限値でしかない。
 * SchoolPageConvertCTA（/reverse・/juku-shindan・LINE友だち追加）が実際に押されたかを
 * ファーストパーティのD1に一次記録し、「①(換金導線)が効いたか」を学校ページ単位で見えるようにする。
 *
 * 安全設計（clicks-db.tsと同方針）：
 *  - 名簿/クリックと同じ `LEADS_DB` バインディングを共用（DBは1つ・テーブルを分ける）。
 *    バインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）。
 *  - 例外は握りつぶし、呼び出し側（APIレスポンス）に一切影響させない。
 *
 * 点火手順: migrations/0016_create_school_page_clicks.sql を LEADS_DB に適用するだけ。
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

export type SchoolPageCta = 'reverse' | 'juku-shindan' | 'line';

export interface SchoolPageClickInput {
  prefectureCode: string;
  schoolCode: string;
  cta: SchoolPageCta;
}

function s(v: string, max: number): string {
  return v.trim().slice(0, max);
}

/**
 * 学校ページCTAのクリックをD1に記録する。バインディング未設定なら no-op（false）。
 * 返り値：記録できたか。失敗してもAPIレスポンスは止めない（呼び出し側で握りつぶす）。
 */
export async function persistSchoolPageClick(input: SchoolPageClickInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO school_page_clicks (prefecture_code, school_code, cta, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      )
      .bind(s(input.prefectureCode, 40), s(input.schoolCode, 40), input.cta)
      .run();
    return true;
  } catch (err) {
    console.error('persistSchoolPageClick skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface SchoolPageClickSummaryRow {
  prefecture_code: string;
  school_code: string;
  cta: string;
  clicks: number;
}

/**
 * 直近N日の学校ページCTAクリック集計（学校×CTA別）。バインディング未設定なら空配列。
 * 「①(換金導線)が効いたか」の判定に使う（KPIダイジェスト/ダッシュボード向け）。
 */
export async function getSchoolPageClickSummary(days = 30): Promise<SchoolPageClickSummaryRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT prefecture_code, school_code, cta, COUNT(*) AS clicks
         FROM school_page_clicks
         WHERE created_at >= datetime('now', ?)
         GROUP BY prefecture_code, school_code, cta
         ORDER BY clicks DESC
         LIMIT 500`
      )
      .bind(`-${since} days`)
      .all<SchoolPageClickSummaryRow>();
    return results ?? [];
  } catch (err) {
    console.error('getSchoolPageClickSummary skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/** 直近N日の学校ページCTAクリック総数（CTA別）。全体の効き具合を見る最小集計。 */
export async function getSchoolPageClickTotalsByCta(days = 30): Promise<Record<SchoolPageCta, number>> {
  const totals: Record<SchoolPageCta, number> = { reverse: 0, 'juku-shindan': 0, line: 0 };
  try {
    const db = await getDb();
    if (!db) return totals;
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT cta, COUNT(*) AS clicks
         FROM school_page_clicks
         WHERE created_at >= datetime('now', ?)
         GROUP BY cta`
      )
      .bind(`-${since} days`)
      .all<{ cta: SchoolPageCta; clicks: number }>();
    for (const row of results ?? []) {
      if (row.cta in totals) totals[row.cta] = row.clicks;
    }
    return totals;
  } catch (err) {
    console.error('getSchoolPageClickTotalsByCta skipped:', err instanceof Error ? err.message : err);
    return totals;
  }
}
