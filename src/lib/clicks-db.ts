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
  /** 端末/bot識別用の User-Agent（先頭を保存）。 */
  userAgent?: string;
  /** 同一送信元バースト検出用の IPハッシュ（生IPは保存しない）。 */
  ipHash?: string;
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
        `INSERT INTO clicks (affiliate_id, prefecture, placement, referer, user_agent, ip_hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(
        s(input.affiliateId),
        s(input.prefecture),
        s(input.placement),
        s(input.referer),
        s(input.userAgent),
        s(input.ipHash)
      )
      .run();
    return true;
  } catch (err) {
    console.error('persistClick skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * 同一 IPハッシュの直近 N 秒のクリック数（レート制限＝バースト検出用）。
 * バインディング未設定・エラー時は 0（フェイルオープン＝送客を止めない）。
 */
export async function countRecentClicksByIp(ipHash: string, seconds = 120): Promise<number> {
  try {
    const db = await getDb();
    if (!db || !ipHash) return 0;
    const sec = Math.max(1, Math.min(3600, Math.round(seconds)));
    const { results } = await db
      .prepare(
        `SELECT COUNT(*) AS n FROM clicks WHERE ip_hash = ? AND created_at >= datetime('now', ?)`
      )
      .bind(ipHash, `-${sec} seconds`)
      .all<{ n: number }>();
    return results?.[0]?.n ?? 0;
  } catch {
    return 0; // フェイルオープン
  }
}

export interface ClickRecentRow {
  created_at: string;
  affiliate_id: string;
  placement: string | null;
  prefecture: string | null;
  referer: string | null;
  user_agent: string | null;
}

/** 直近 N 件のクリック明細（UA付き・ダッシュボードの自己検証用）。未バインドなら空。 */
export async function getRecentClicks(limit = 25): Promise<ClickRecentRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const n = Math.max(1, Math.min(100, Math.round(limit)));
    const { results } = await db
      .prepare(
        `SELECT created_at, affiliate_id, placement, prefecture, referer, user_agent
         FROM clicks ORDER BY id DESC LIMIT ?`
      )
      .bind(n)
      .all<ClickRecentRow>();
    return results ?? [];
  } catch (err) {
    console.error('getRecentClicks skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * 「信頼できるクリック」= 自サイト（my-naishin.com）の面から押された＝内部referer付き。
 * 実ブラウザのCTAクリックは必ず内部refererを伴う（[[bot-filter]] の classifyClick と同じ前提）ため、
 * これを満たさない /go 直叩き（ブラウザUAのスクレイパ）を集計から除外する軸になる。
 * 取り込み時点で bot-UA・空UA・IPバーストは既に除外済みなので、ここはさらに「内部referer」で絞る。
 */
const TRUSTED_CLAUSE = "referer LIKE 'https://my-naishin.com%'";

/** trustedOnly=true なら内部referer条件を AND 連結する（固定文字列＝SQLインジェクションにならない）。 */
function trustFilter(trustedOnly?: boolean): string {
  return trustedOnly ? ` AND ${TRUSTED_CLAUSE}` : '';
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
export async function getClickSummary(days = 7, opts: { trustedOnly?: boolean } = {}): Promise<ClickAggRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT affiliate_id, prefecture, placement, COUNT(*) AS clicks
         FROM clicks
         WHERE created_at >= datetime('now', ?)${trustFilter(opts.trustedOnly)}
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

export type TrendGranularity = 'day' | 'hour';

export interface ClickTrendRow {
  /** 日別は 'YYYY-MM-DD'、時間別は 'YYYY-MM-DD HH'（UTC）。 */
  bucket: string;
  clicks: number;
}

/**
 * 直近 N 日のクリックを 日別 or 時間別 に集計（ダッシュボードの推移グラフ/表用）。
 * granularity='hour' は粒度が細かいので呼び出し側で日数を絞ること。バインディング未設定なら空配列。
 */
export async function getClickTrend(
  days = 30,
  granularity: TrendGranularity = 'day',
  opts: { trustedOnly?: boolean } = {}
): Promise<ClickTrendRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    // 固定文字列のみ（ユーザー入力ではない）＝SQLインジェクションにならない。
    const sel = granularity === 'hour' ? "substr(created_at, 1, 13)" : 'date(created_at)';
    const { results } = await db
      .prepare(
        `SELECT ${sel} AS bucket, COUNT(*) AS clicks
         FROM clicks
         WHERE created_at >= datetime('now', ?)${trustFilter(opts.trustedOnly)}
         GROUP BY bucket
         ORDER BY bucket ASC`
      )
      .bind(`-${since} days`)
      .all<ClickTrendRow>();
    return results ?? [];
  } catch (err) {
    console.error('getClickTrend skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface ClickRefRow {
  referer: string | null;
  affiliate_id: string;
  clicks: number;
}

/**
 * 直近 N 日のクリックを「流入元ページ（referer）× プログラム」で集計（送客元の可視化）。
 * placement が未付与（素のバナー等）でも referer は全クリックで記録されるので、
 * 「どのページが送客しているか」を取りこぼさず追える。
 */
export async function getRefererSummary(days = 30): Promise<ClickRefRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT referer, affiliate_id, COUNT(*) AS clicks
         FROM clicks
         WHERE created_at >= datetime('now', ?)
         GROUP BY referer, affiliate_id
         ORDER BY clicks DESC
         LIMIT 300`
      )
      .bind(`-${since} days`)
      .all<ClickRefRow>();
    return results ?? [];
  } catch (err) {
    console.error('getRefererSummary skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface PeriodCompare {
  current: number;
  previous: number;
}

/**
 * 直近 N 日 と その前 N 日 のクリック総数を返す（前期間比のKPI用）。
 * バインディング未設定なら 0/0。
 */
export async function getClickPeriodComparison(days = 30, opts: { trustedOnly?: boolean } = {}): Promise<PeriodCompare> {
  try {
    const db = await getDb();
    if (!db) return { current: 0, previous: 0 };
    const n = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT
           SUM(CASE WHEN created_at >= datetime('now', ?) THEN 1 ELSE 0 END) AS current,
           SUM(CASE WHEN created_at >= datetime('now', ?) AND created_at < datetime('now', ?) THEN 1 ELSE 0 END) AS previous
         FROM clicks
         WHERE 1=1${trustFilter(opts.trustedOnly)}`
      )
      .bind(`-${n} days`, `-${2 * n} days`, `-${n} days`)
      .all<{ current: number | null; previous: number | null }>();
    const r = results?.[0];
    return { current: r?.current ?? 0, previous: r?.previous ?? 0 };
  } catch (err) {
    console.error('getClickPeriodComparison skipped:', err instanceof Error ? err.message : err);
    return { current: 0, previous: 0 };
  }
}

export interface ClickTrustCounts {
  /** 全記録クリック（取り込み時に bot-UA/空UA/IPバーストは既に除外済み）。 */
  total: number;
  /** 信頼＝自サイト面から押された（内部refererあり）。 */
  trusted: number;
  /** 疑わしい＝ブラウザUAだが内部referer無し（/go直叩きスクレイパが大半）。 */
  suspect: number;
}

/**
 * 直近 N 日のクリックを「信頼 / 疑わしい」で分解（ダッシュボードの清浄度バナー用）。
 * trusted = 内部referer、suspect = total - trusted。バインディング未設定なら全ゼロ。
 */
export async function getClickTrustCounts(days = 30): Promise<ClickTrustCounts> {
  try {
    const db = await getDb();
    if (!db) return { total: 0, trusted: 0, suspect: 0 };
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN ${TRUSTED_CLAUSE} THEN 1 ELSE 0 END) AS trusted
         FROM clicks
         WHERE created_at >= datetime('now', ?)`
      )
      .bind(`-${since} days`)
      .all<{ total: number | null; trusted: number | null }>();
    const r = results?.[0];
    const total = r?.total ?? 0;
    const trusted = r?.trusted ?? 0;
    return { total, trusted, suspect: Math.max(0, total - trusted) };
  } catch (err) {
    console.error('getClickTrustCounts skipped:', err instanceof Error ? err.message : err);
    return { total: 0, trusted: 0, suspect: 0 };
  }
}
