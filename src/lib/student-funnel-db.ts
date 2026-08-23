/**
 * 生徒ファネル(S12-1)の一次ログ＝Cloudflare D1。
 *
 * なぜ（[[ga4-undercounts-conversions]]）: `HyoteiUniversityBridge.tsx`
 * （/hyotei-heikinの学年自己申告→my-shingaku導線・2026-08-03実装）はGA4実測で
 * 08-03〜08-10の8日間、grade_self_identify・university_bridge_clickとも0件だった。
 * 同期間の同ページのcalc_complete/result_viewすらGA4で0件（GSCでは28日920クリックと
 * 実トラフィックは存在）＝GA4の計測系統そのものが機能していない疑いが強い。
 * parent-funnel-db.ts（保護者ファネル専用の意味を持つ）とは分離し、生徒起点イベント専用の
 * D1一次記録を追加する。GA4のtrack()呼び出しは削除せず併走させる。
 *
 * 安全設計（parent-funnel-db.ts/school-page-clicks-db.tsと同方針）:
 *  - 名簿/クリックと同じ `LEADS_DB` バインディングを共用（DBは1つ・テーブルを分ける）。
 *    バインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）。
 *  - 例外は握りつぶし、呼び出し側（APIレスポンス）に一切影響させない。
 *
 * 点火手順: migrations/0020_create_student_funnel_events.sql を LEADS_DB に適用するだけ。
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

export type StudentFunnelEvent = 'grade_self_identify' | 'university_bridge_click';
export type StudentGrade = 'chugaku' | 'koukou';

export interface StudentFunnelEventInput {
  event: StudentFunnelEvent;
  grade?: StudentGrade;
  tool?: string;
}

function s(v: string | undefined, max: number): string | undefined {
  const t = v?.trim();
  return t ? t.slice(0, max) : undefined;
}

/**
 * 生徒ファネルイベントをD1に記録する。バインディング未設定なら no-op（false）。
 * 返り値：記録できたか。失敗してもAPIレスポンスは止めない（呼び出し側で握りつぶす）。
 */
export async function persistStudentFunnelEvent(input: StudentFunnelEventInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO student_funnel_events (event, grade, tool, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      )
      .bind(input.event, s(input.grade, 20) ?? null, s(input.tool, 40) ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('persistStudentFunnelEvent skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** 直近N日のイベント別件数。バインディング未設定なら全て0。 */
export async function getStudentFunnelEventCounts(days = 30): Promise<Record<StudentFunnelEvent, number>> {
  const counts: Record<StudentFunnelEvent, number> = {
    grade_self_identify: 0,
    university_bridge_click: 0,
  };
  try {
    const db = await getDb();
    if (!db) return counts;
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT event, COUNT(*) AS n
         FROM student_funnel_events
         WHERE created_at >= datetime('now', ?)
         GROUP BY event`
      )
      .bind(`-${since} days`)
      .all<{ event: StudentFunnelEvent; n: number }>();
    for (const row of results ?? []) {
      if (row.event in counts) counts[row.event] = row.n;
    }
    return counts;
  } catch (err) {
    console.error('getStudentFunnelEventCounts skipped:', err instanceof Error ? err.message : err);
    return counts;
  }
}
