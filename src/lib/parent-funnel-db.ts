/**
 * 保護者ファネル(TIER Σ-3)の一次ログ＝Cloudflare D1。
 *
 * なぜ（[[ga4-undercounts-conversions]]）：GA4は転換を大幅に取りこぼす下限値でしかない
 * （D1実測25件に対しGA4は0〜数件という乖離が既に複数回観測済み）。
 * `share_to_parent`（生徒が保護者へ送る）→`parent_landing_view`（保護者が着地）→
 * `affiliate_click`（保護者面での送客クリック）という橋②ファネルの到達率を、
 * GA4に頼らずファーストパーティのD1一次記録で追跡できるようにする。
 *
 * affiliate_clickは既存の`clicks`テーブル（clicks-db.ts・placement='parent-lp'）をそのまま使う
 * ＝新しいイベント記録は増やさず、このファイルのgetParentFunnelReach()でJOIN相当の集計をする。
 *
 * 安全設計（school-page-clicks-db.tsと同方針）：
 *  - 名簿/クリックと同じ `LEADS_DB` バインディングを共用（DBは1つ・テーブルを分ける）。
 *    バインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）。
 *  - 例外は握りつぶし、呼び出し側（APIレスポンス）に一切影響させない。
 *
 * 点火手順: migrations/0017_create_parent_funnel_events.sql を LEADS_DB に適用するだけ。
 */

import { getClickSummary } from '@/lib/clicks-db';

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

export type ParentFunnelEvent = 'share_to_parent' | 'parent_landing_view';
export type ParentFunnelMedium = 'native' | 'copy' | 'line' | 'x';

export interface ParentFunnelEventInput {
  event: ParentFunnelEvent;
  /** share_to_parentのみ意味を持つ。省略可。 */
  medium?: ParentFunnelMedium;
  prefectureCode?: string;
}

function s(v: string | undefined, max: number): string | undefined {
  const t = v?.trim();
  return t ? t.slice(0, max) : undefined;
}

/**
 * 保護者ファネルイベントをD1に記録する。バインディング未設定なら no-op（false）。
 * 返り値：記録できたか。失敗してもAPIレスポンスは止めない（呼び出し側で握りつぶす）。
 */
export async function persistParentFunnelEvent(input: ParentFunnelEventInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO parent_funnel_events (event, medium, prefecture_code, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      )
      .bind(input.event, s(input.medium, 20) ?? null, s(input.prefectureCode, 40) ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('persistParentFunnelEvent skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** 直近N日のイベント別件数。バインディング未設定なら全て0。 */
export async function getParentFunnelEventCounts(
  days = 30
): Promise<Record<ParentFunnelEvent, number>> {
  const counts: Record<ParentFunnelEvent, number> = { share_to_parent: 0, parent_landing_view: 0 };
  try {
    const db = await getDb();
    if (!db) return counts;
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT event, COUNT(*) AS n
         FROM parent_funnel_events
         WHERE created_at >= datetime('now', ?)
         GROUP BY event`
      )
      .bind(`-${since} days`)
      .all<{ event: ParentFunnelEvent; n: number }>();
    for (const row of results ?? []) {
      if (row.event in counts) counts[row.event] = row.n;
    }
    return counts;
  } catch (err) {
    console.error('getParentFunnelEventCounts skipped:', err instanceof Error ? err.message : err);
    return counts;
  }
}

/** 直近N日のshare_to_parent件数を送信手段(medium)別に分解する。 */
export async function getParentFunnelShareByMedium(
  days = 30
): Promise<{ medium: string; count: number }[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT COALESCE(medium, '(unknown)') AS medium, COUNT(*) AS count
         FROM parent_funnel_events
         WHERE event = 'share_to_parent' AND created_at >= datetime('now', ?)
         GROUP BY medium
         ORDER BY count DESC`
      )
      .bind(`-${since} days`)
      .all<{ medium: string; count: number }>();
    return results ?? [];
  } catch (err) {
    console.error('getParentFunnelShareByMedium skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface ParentFunnelReach {
  shareToParent: number;
  parentLandingView: number;
  /** 保護者面(placement='parent-lp')でのaffiliate_click。既存clicksテーブルを流用。 */
  affiliateClick: number;
  /** share→landing の到達率（%・小数1桁）。分母0ならnull。 */
  shareToLandingRate: number | null;
  /** landing→affiliate_click の到達率（%・小数1桁）。分母0ならnull。 */
  landingToClickRate: number | null;
}

function rate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

/** 純粋関数：3つのカウントから到達率を計算する（テスト容易性のためD1呼び出しと分離）。 */
export function computeParentFunnelReach(
  shareToParent: number,
  parentLandingView: number,
  affiliateClick: number
): ParentFunnelReach {
  return {
    shareToParent,
    parentLandingView,
    affiliateClick,
    shareToLandingRate: rate(parentLandingView, shareToParent),
    landingToClickRate: rate(affiliateClick, parentLandingView),
  };
}

/**
 * 直近N日の橋②ファネル到達率（D1実測・GA4非依存）。
 * affiliate_clickは既存clicksテーブルのplacement='parent-lp'集計を合算して使う
 * （/hogoshaのParentLeadCTAが`placement="parent-lp"`で送客するため）。
 */
export async function getParentFunnelReach(days = 30): Promise<ParentFunnelReach> {
  const [counts, clickRows] = await Promise.all([getParentFunnelEventCounts(days), getClickSummary(days)]);
  const affiliateClick = clickRows
    .filter((row) => row.placement === 'parent-lp')
    .reduce((sum, row) => sum + row.clicks, 0);
  return computeParentFunnelReach(counts.share_to_parent, counts.parent_landing_view, affiliateClick);
}
