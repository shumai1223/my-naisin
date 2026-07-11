/**
 * juku-shindan（塾診断）推薦のオファーマッチング精緻化＝Q-5。
 *
 * matchJuku()（juku-match.ts）の既定順位付けは affiliate-economics.ts の仮定CVR/CPA
 * （ev-engine.tsのコメント通り「未実測の仮定」）を従属キーに使っている。
 * ここは、実際にjuku-shindan面（placement='shindan'）から生まれた実クリック件数の分布から
 * 「観測ランク」を計算する純関数と、EV仮定ランクとの乖離を検出する純関数を提供する
 * （月次で scripts/juku-offer-ranking-report.ts から呼ばれる）。
 *
 * matchJuku()自体はwindow/DB非依存の純関数のまま変更しない＝ここは分析・報告レイヤーに留め、
 * 診断の推薦ロジック自体にDB依存を持ち込まない設計を維持する。
 */
import type { AffiliateId } from '@/lib/affiliates';

/**
 * k-匿名性と同じ思想（stats-aggregation.tsのSTATS_MIN_SAMPLE_SIZEと同じ閾値30）：
 * 合計サンプルがこの件数未満なら観測ランクを信頼しない（反証ゲート思想＝データが無いものを
 * 在るかのように見せない）。
 */
export const JUKU_OFFER_MIN_SAMPLE = 30;

export interface ObservedOfferClicks {
  id: AffiliateId;
  clicks: number;
}

export interface ObservedOfferRank {
  id: AffiliateId;
  clicks: number;
  /** 観測クリックシェアでの順位（1が最良）。同数はid昇順で安定ソート。 */
  rank: number;
  /** 全体に占めるクリックシェア（0-1）。 */
  share: number;
}

/**
 * 実クリック件数配列から観測ランクを計算する。合計クリックがminSample未満ならnull
 * （サンプル不足で判定を保留＝反証ゲート思想を踏襲）。
 */
export function computeObservedOfferRank(
  clicks: ObservedOfferClicks[],
  minSample: number = JUKU_OFFER_MIN_SAMPLE
): ObservedOfferRank[] | null {
  const total = clicks.reduce((s, c) => s + c.clicks, 0);
  if (total < minSample) return null;
  return [...clicks]
    .sort((a, b) => b.clicks - a.clicks || a.id.localeCompare(b.id))
    .map((c, i) => ({ id: c.id, clicks: c.clicks, rank: i + 1, share: c.clicks / total }));
}

export interface RankDivergence {
  id: AffiliateId;
  assumedRank: number;
  observedRank: number;
  /** assumedRank - observedRank。正なら実測の方が仮定より良い（EVモデルが過小評価）・負なら過大評価。 */
  delta: number;
}

/**
 * EV仮定順位（assumedIds＝rankLiveOffersByEVの順のID配列）と観測順位を突き合わせ、
 * 乖離が閾値以上の案件を検出する（「仮定と実測のズレ」自体がaffiliate-economics.tsの
 * EV表更新の判断材料になる）。乖離の絶対値が大きい順に返す。
 */
export function findRankDivergence(
  assumedIds: AffiliateId[],
  observed: ObservedOfferRank[],
  thresholdDelta: number = 2
): RankDivergence[] {
  const assumedRankById = new Map(assumedIds.map((id, i) => [id, i + 1]));
  const divergences: RankDivergence[] = [];
  for (const o of observed) {
    const assumedRank = assumedRankById.get(o.id);
    if (assumedRank === undefined) continue;
    const delta = assumedRank - o.rank;
    if (Math.abs(delta) >= thresholdDelta) {
      divergences.push({ id: o.id, assumedRank, observedRank: o.rank, delta });
    }
  }
  return divergences.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}
