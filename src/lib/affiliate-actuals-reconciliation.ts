/**
 * EV表（affiliate-economics.ts）の「仮定→実測」上書き運用（D-6）。
 *
 * affiliate-economics.ts の convRate/convRateLow は全て未実測の仮定と明記されている
 * （[[monetization-reality-2026-06]]）。ASPの実績（クリック/発生/確定）が積み上がったら、
 * この表の仮定値を実測値で置き換えるのが「捏造ゼロ」運用の締めくくり。
 *
 * この純関数は「実測データ→現在の仮定との差分」を計算するだけで、ソースコード
 * （AFFILIATE_ECONOMICS）を自動で書き換えはしない。理由：
 *  - サンプル数が少ないうちに機械的に上書きすると外れ値で過学習する（1クリック1発生=100%等）。
 *  - 事業判断（このオファーを本当に基準値として採用してよいか）は人間のレビューを要する。
 * スクリプト側（scripts/reconcile-affiliate-economics.ts）が、この関数の出力を
 * 「貼るだけで済むコードスニペット」として整形し、レビュー後に手で反映する運用とする。
 */

import { AFFILIATE_ECONOMICS, CONFIRM_RATE, economicsFor, type AffiliateEconomics } from '@/lib/affiliate-economics';
import type { AffiliateId } from '@/lib/affiliates';

/** ASP管理画面から人が転記する実測1行（入力シートの1行に対応）。 */
export interface AffiliateActualRow {
  affiliateId: AffiliateId;
  /** 対象期間のクリック数。 */
  clicks: number;
  /** 発生（ASP計上・確定前）件数。 */
  conversions: number;
  /** 確定（却下/無効/重複を除いた着金見込み）件数。分からなければ conversions と同値でよい。 */
  confirmed: number;
}

export type Recommendation = 'update' | 'insufficient-sample' | 'no-data';

export interface AffiliateReconciliationRow {
  affiliateId: AffiliateId;
  assumed: AffiliateEconomics;
  actual: {
    convRate: number;
    convRateLow: number;
    /** 確定/発生の実測歩留まり（CONFIRM_RATEの実測版）。発生0ならnull。 */
    confirmRate: number | null;
  } | null;
  /** convRateLow（保守・主役）の仮定比の変化率。実測が無ければnull。 */
  deltaPercent: number | null;
  recommendation: Recommendation;
  sampleClicks: number;
}

const DEFAULT_MIN_SAMPLE_CLICKS = 30;

/**
 * 実測行と現在の仮定(AFFILIATE_ECONOMICS)を突き合わせ、差分と「上書きしてよいか」を判定する。
 * minSampleClicks 未満のクリック数は外れ値過学習を避けるため insufficient-sample とし、
 * 数値自体は参考表示のみ（recommendation='update' は出さない）。
 */
export function reconcileAffiliateEconomics(
  actuals: AffiliateActualRow[],
  minSampleClicks: number = DEFAULT_MIN_SAMPLE_CLICKS
): AffiliateReconciliationRow[] {
  return actuals.map((row) => {
    const assumed = economicsFor(row.affiliateId);
    if (row.clicks <= 0) {
      return {
        affiliateId: row.affiliateId,
        assumed,
        actual: null,
        deltaPercent: null,
        recommendation: 'no-data',
        sampleClicks: row.clicks,
      };
    }

    const convRate = row.conversions / row.clicks;
    const convRateLow = row.confirmed / row.clicks;
    const confirmRate = row.conversions > 0 ? row.confirmed / row.conversions : null;

    const deltaPercent =
      assumed.convRateLow > 0 ? ((convRateLow - assumed.convRateLow) / assumed.convRateLow) * 100 : null;

    const recommendation: Recommendation = row.clicks < minSampleClicks ? 'insufficient-sample' : 'update';

    return {
      affiliateId: row.affiliateId,
      assumed,
      actual: { convRate, convRateLow, confirmRate },
      deltaPercent,
      recommendation,
      sampleClicks: row.clicks,
    };
  });
}

/** 単一行を「貼るだけで済む」AFFILIATE_ECONOMICS のTSスニペットに整形する（recommendation='update'のみ想定）。 */
export function formatEconomicsSnippet(row: AffiliateReconciliationRow): string | null {
  if (!row.actual || row.recommendation !== 'update') return null;
  const { convRate, convRateLow } = row.actual;
  return `  '${row.affiliateId}': { cpaYen: ${row.assumed.cpaYen}, convRate: ${round4(convRate)}, convRateLow: ${round4(convRateLow)}, kind: '${row.assumed.kind}' }, // 実測: クリック${row.sampleClicks}件`;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/** 参照用：既存AFFILIATE_ECONOMICSに登録済みの全affiliateIdの一覧（入力シートの雛形生成に使う）。 */
export function knownAffiliateIds(): AffiliateId[] {
  return Object.keys(AFFILIATE_ECONOMICS) as AffiliateId[];
}

/** CONFIRM_RATE（仮定の発生→確定歩留まり）を実測の confirmRate と比較するための参考値。 */
export { CONFIRM_RATE };
