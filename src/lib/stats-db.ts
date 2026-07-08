/**
 * 匿名統計（stats_submissions）のD1永続化＝TIER N-3。leads-db.tsと同じ安全設計を踏襲する。
 *
 * 安全設計：
 *  - D1バインディング `LEADS_DB`（既存・稼働中。leads/clicks等と同じDBにテーブルを同居させる設計）
 *    が無ければ完全no-op。
 *  - stats_submissionsテーブル自体は migrations/0007_create_stats_submissions.sql が定義するが
 *    2026-07-09時点で未適用（👤監督付き適用待ち）。テーブルが無い状態でクエリすればD1側が
 *    エラーを返すが、ここでは例外を握りつぶしてno-op（[]/false）にするため、適用前でも
 *    APIやビルドを壊さない。
 *  - 個人を特定できる情報（メール・IP・ユーザー識別子）は一切扱わない。stats-consent.ts /
 *    StatsOptInコンポーネントは意図的に未マウントのため、適用後もこのモジュールを実際に
 *    呼び出すクライアントコードはまだ存在しない（配線は次周以降）。
 */
import { isValidStatsSubmission, type StatsMetric, type StatsSubmissionInput } from '@/lib/stats-aggregation';

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

async function getStatsDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

/** 匿名の計算結果を1件保存する。バインディング未設定・テーブル未作成なら no-op（false）。 */
export async function insertStatsSubmission(input: StatsSubmissionInput): Promise<boolean> {
  if (!isValidStatsSubmission(input)) return false;
  try {
    const db = await getStatsDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO stats_submissions (metric, prefecture_code, value, max_value, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .bind(input.metric, input.prefectureCode ?? null, input.value, input.maxValue ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('insertStatsSubmission skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * 指定した指標（＋任意で都道府県）の生の数値配列を取得する。
 * k-匿名性の判定・集計自体は呼び出し側（stats-aggregation.ts）の責務とし、ここは生データ取得のみ。
 * バインディング未設定・テーブル未作成なら空配列。
 */
export async function getStatsValues(metric: StatsMetric, prefectureCode?: string): Promise<number[]> {
  try {
    const db = await getStatsDb();
    if (!db) return [];
    const stmt = prefectureCode
      ? db.prepare('SELECT value FROM stats_submissions WHERE metric = ? AND prefecture_code = ?').bind(metric, prefectureCode)
      : db.prepare('SELECT value FROM stats_submissions WHERE metric = ?').bind(metric);
    const { results } = await stmt.all<{ value: number }>();
    return (results ?? []).map((r) => r.value).filter((v) => typeof v === 'number' && Number.isFinite(v));
  } catch (err) {
    console.error('getStatsValues skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
