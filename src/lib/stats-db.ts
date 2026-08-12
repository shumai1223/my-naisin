/**
 * 匿名統計（stats_submissions）のD1永続化＝S-1（旧N-3）。leads-db.tsと同じ安全設計を踏襲する。
 *
 * 安全設計：
 *  - D1バインディング `LEADS_DB`（既存・稼働中。leads/clicks等と同じDBにテーブルを同居させる設計）
 *    が無ければ完全no-op。
 *  - stats_submissionsテーブル自体は migrations/0007_create_stats_submissions.sql が定義し、
 *    2026-07-10に本番適用済み。バインディング未設定（ローカルテスト等）でも例外を握りつぶして
 *    no-op（[]/false）にするため、常にAPIやビルドを壊さない。
 *  - 個人を特定できる情報（メール・IP・ユーザー識別子）は一切扱わない。StatsOptInコンポーネントは
 *    2026-07-11に/hensachiへ結線済み（stats-submit-client.ts経由で同意済みユーザーの結果のみ送信）。
 */
import { isValidStatsSubmission, type StatsMetric, type StatsSubmissionInput } from '@/lib/stats-aggregation';
import type { ClickTrust } from '@/lib/bot-filter';

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

/**
 * 匿名の計算結果を1件保存する。バインディング未設定・テーブル未作成なら no-op（false）。
 *
 * DW-1（2026-08-10）以降、出所の信頼度を必ず添えて書く（migration 0019）。
 * `trustClass !== 'human'` の行は保存はするが集計から外れる（trusted=0）。
 * 消さずに残すのは、攻撃の規模を後から検証できる状態を保つため（Y-0：データを壊さない）。
 */
export async function insertStatsSubmission(
  input: StatsSubmissionInput,
  provenance: { trustClass: ClickTrust }
): Promise<boolean> {
  if (!isValidStatsSubmission(input)) return false;
  try {
    const db = await getStatsDb();
    if (!db) return false;
    let trusted = provenance.trustClass === 'human' ? 1 : 0;
    let trustClass: string = provenance.trustClass;

    // ── DW-2 バックストップ（2026-08-12）──────────────────────────────
    // クライアント側の送信間引き（stats-submit-scheduler）だけでは守れない。
    // 古いJSを掴んだままのブラウザは修正後も**入力途中の値を毎回送り続ける**ため
    // （実測: 12件/秒）、受け口側でも塊を検知して隔離する。
    // DW-1で「ボット判定はサーバに置く」と学んだのと同じ理由。
    if (trusted === 1) {
      const recent = await countRecentSubmissions(db, input.metric);
      if (recent >= BURST_THRESHOLD - 1) {
        trusted = 0;
        trustClass = 'burst';
        await demoteRecentBurst(db, input.metric); // 塊の先頭側も一緒に落とす
      }
    }

    await db
      .prepare(
        `INSERT INTO stats_submissions (metric, prefecture_code, value, max_value, trusted, trust_class, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(input.metric, input.prefectureCode ?? null, input.value, input.maxValue ?? null, trusted, trustClass)
      .run();
    return true;
  } catch (err) {
    console.error('insertStatsSubmission skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * 塊とみなす閾値。**同一指標が `BURST_WINDOW_SECONDS` 内に `BURST_THRESHOLD` 件以上**なら塊。
 *
 * 数字の根拠（2026-08-12 実測）:
 *   - 壊れていたクライアント: 1セッションで 12件/秒（4秒で51件）
 *   - 正常なクライアント: 1セッション1件
 *   - サイト全体の流入は約150クリック/日。**別々の人間が10秒に3件投稿する確率は実質ゼロ**。
 * 迷ったら「取りこぼす」より「隔離する」を選ぶ（行は消さないので後から戻せる）。
 */
export const BURST_WINDOW_SECONDS = 10;
export const BURST_THRESHOLD = 3;

async function countRecentSubmissions(db: MinimalD1, metric: StatsMetric): Promise<number> {
  const res = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM stats_submissions
       WHERE metric = ? AND created_at >= datetime('now', ?)`
    )
    .bind(metric, `-${BURST_WINDOW_SECONDS} seconds`)
    .all<{ n: number }>();
  return Number(res.results?.[0]?.n ?? 0);
}

/** 塊と判定した瞬間、同じ窓に入っている先行行も trusted=0 に落とす。 */
async function demoteRecentBurst(db: MinimalD1, metric: StatsMetric): Promise<void> {
  await db
    .prepare(
      `UPDATE stats_submissions SET trusted = 0, trust_class = 'burst'
       WHERE metric = ? AND trusted = 1 AND created_at >= datetime('now', ?)`
    )
    .bind(metric, `-${BURST_WINDOW_SECONDS} seconds`)
    .run();
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
    // DW-1: 集計に入れるのは出所検査を通った行だけ（trusted=1）。
    // migration 0019 適用前の既存行はすべて trusted=0 なので自動的に除外される。
    const stmt = prefectureCode
      ? db
          .prepare('SELECT value FROM stats_submissions WHERE metric = ? AND prefecture_code = ? AND trusted = 1')
          .bind(metric, prefectureCode)
      : db.prepare('SELECT value FROM stats_submissions WHERE metric = ? AND trusted = 1').bind(metric);
    const { results } = await stmt.all<{ value: number }>();
    return (results ?? []).map((r) => r.value).filter((v) => typeof v === 'number' && Number.isFinite(v));
  } catch (err) {
    console.error('getStatsValues skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * 指定した指標の生の数値配列を都道府県コード別にまとめて取得する（ZZ-1d・/stats v2の県別分布用）。
 * 47件のgetStatsValues呼び出しに分けず、1クエリでprefecture_code IS NOT NULLの全行を取得して
 * JS側でgroup byする（D1へのラウンドトリップを指標あたり1回に抑える）。
 * k-匿名性の判定・集計はstats-aggregation.ts側の責務（ここは生データのグルーピングのみ）。
 */
export async function getStatsValuesByPrefecture(metric: StatsMetric): Promise<Record<string, number[]>> {
  const grouped: Record<string, number[]> = {};
  try {
    const db = await getStatsDb();
    if (!db) return grouped;
    const { results } = await db
      // DW-1: 全国集計と同じく trusted=1 のみ。
      .prepare('SELECT prefecture_code, value FROM stats_submissions WHERE metric = ? AND prefecture_code IS NOT NULL AND trusted = 1')
      .bind(metric)
      .all<{ prefecture_code: string; value: number }>();
    for (const row of results ?? []) {
      if (typeof row.value !== 'number' || !Number.isFinite(row.value)) continue;
      if (typeof row.prefecture_code !== 'string' || !row.prefecture_code) continue;
      (grouped[row.prefecture_code] ??= []).push(row.value);
    }
    return grouped;
  } catch (err) {
    console.error('getStatsValuesByPrefecture skipped:', err instanceof Error ? err.message : err);
    return grouped;
  }
}
