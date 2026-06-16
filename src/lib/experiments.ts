/**
 * 実験レジストリ＋勝者判定（A/Bの一元管理・P6-3）。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：勝者を「勘」でなく「データ」で lead-config に昇格させる。
 * ab-test.ts は割当の“仕組み”（assignVariant / experiment_impression）だが、実験そのものは
 * 各コンポーネントに散っていた。ここに「いま走っている実験・仮説・バリアント・状態・勝者」を
 * 単一ソース化し、週次レビュー（GA4の experiment_impression × cta_view/affiliate_click/lead_submit）で
 * judgeWinner に集計値を渡せば、有意差つきで「どのアームを採用すべきか」が機械的に出る。
 *
 * judgeWinner は純粋関数（window非依存・テスト可能）。二項比率のz検定で control 比のリフトと有意性を出す。
 */

import type { LeadPlacement } from '@/lib/lead-config';

export type ExperimentStatus = 'running' | 'paused' | 'decided';

export interface ExperimentArm {
  id: string;
  /** 人間向けの説明（何を変えたアームか）。 */
  label: string;
  /** 割当の重み（既定1）。 */
  weight?: number;
}

export interface ExperimentDef {
  id: string;
  /** 検証する仮説（1文）。 */
  hypothesis: string;
  status: ExperimentStatus;
  /** arms[0] を対照群（control）とみなす。 */
  arms: ExperimentArm[];
  /** 効きを突合する主要指標（GA4イベント）。 */
  primaryMetric: 'cta_view' | 'affiliate_click' | 'lead_submit';
  /** 関係する設置面（勝者を lead-config に昇格させる際の対象）。 */
  placement?: LeadPlacement;
  /** decided のとき採用したアーム。 */
  winner?: string;
  /** 判定日 YYYY-MM-DD。 */
  decidedAt?: string;
  /** 運用メモ。 */
  note?: string;
}

/**
 * 実験レジストリ（単一ソース）。新しいA/Bはここに1オブジェクト足す。
 * 実装側（useExperiment / ParentLeadCTAExperiment）は同じ id / arms を参照する。
 */
export const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 'hogosha-cta-text-2026',
    hypothesis: 'CTA文言に「今すぐ」で緊急性を足すと、保護者リードのクリック率（affiliate_click）が上がる。',
    status: 'running',
    arms: [
      { id: 'control', label: '出し分けエンジンの既定文言' },
      { id: 'urgent', label: '「今すぐ＋（既定文言）」で緊急性を付与' },
    ],
    primaryMetric: 'affiliate_click',
    placement: 'parent-lp',
    note: '送客先（affiliateId）は固定し、純粋にコピーの効きだけを測る。最大流入の県別47面に設置して母数を稼ぐ。',
  },
];

/** id から実験定義を引く。 */
export function getExperiment(id: string): ExperimentDef | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/** 走っている実験だけ。 */
export function runningExperiments(): ExperimentDef[] {
  return EXPERIMENTS.filter((e) => e.status === 'running');
}

/* ────────────────────────────────────────────────────────────────────────
 * 勝者判定（二項比率のz検定）
 *
 * GA4 から各アームの「分母（impression / cta_view）」と「分子（conversion）」を取り、
 * control（arms[0]）に対する最良アームのリフトと統計的有意性を返す。
 * これにより「勝った文言を lead-config へ昇格」する意思決定を機械化する。
 * ──────────────────────────────────────────────────────────────────────── */

export interface ArmResult {
  id: string;
  /** 分母（露出 or cta_view など、primaryMetric の母数）。 */
  impressions: number;
  /** 分子（コンバージョン件数）。 */
  conversions: number;
}

export interface WinnerVerdict {
  /** 対照群のアームID。 */
  control: string;
  controlRate: number;
  /** 最もCVRが高かったアーム。 */
  bestArm: string;
  bestRate: number;
  /** control 比の相対リフト（例 0.18 = +18%）。control が0なら NaN を避け 0。 */
  lift: number;
  /** 二標本z統計量（bestArm vs control）。 */
  z: number;
  /** 両側p値の近似。 */
  pValue: number;
  /** 95%（|z|>=1.96）かつ最小サンプル充足で有意。 */
  significant: boolean;
  /** 日本語の一言（運用にそのまま出せる）。 */
  recommendation: string;
}

/** 標準正規分布の両側p値の近似（Abramowitz & Stegun 7.1.26 ベース）。 */
function twoSidedP(z: number): number {
  const az = Math.abs(z);
  // 1 - Φ(az) の近似
  const t = 1 / (1 + 0.2316419 * az);
  const d = 0.3989422804014327 * Math.exp((-az * az) / 2);
  const upper = d * (0.319381530 * t - 0.356563782 * t * t + 1.781477937 * t ** 3 - 1.821255978 * t ** 4 + 1.330274429 * t ** 5);
  return Math.min(1, Math.max(0, 2 * upper));
}

/**
 * 勝者判定。arms[0] を control とする。十分なサンプルが無い／有意差が無いときは significant:false。
 * @param minSample 各アームに必要な最小分母（既定 100）。
 */
export function judgeWinner(arms: ArmResult[], minSample = 100): WinnerVerdict | null {
  if (arms.length < 2) return null;
  const control = arms[0];
  const rate = (a: ArmResult) => (a.impressions > 0 ? a.conversions / a.impressions : 0);
  const controlRate = rate(control);

  // control を除く中で最良、ただし control 自身が最良なら control を best にする。
  let best = control;
  for (const a of arms) {
    if (rate(a) > rate(best)) best = a;
  }
  const bestRate = rate(best);
  const lift = controlRate > 0 ? (bestRate - controlRate) / controlRate : 0;

  // 二項比率のプール分散でz検定（best vs control）。
  const n1 = best.impressions;
  const n2 = control.impressions;
  let z = 0;
  if (best.id !== control.id && n1 > 0 && n2 > 0) {
    const pPool = (best.conversions + control.conversions) / (n1 + n2);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
    z = se > 0 ? (bestRate - controlRate) / se : 0;
  }
  const pValue = twoSidedP(z);
  const enoughSample = n1 >= minSample && n2 >= minSample;
  const significant = best.id !== control.id && enoughSample && Math.abs(z) >= 1.96;

  let recommendation: string;
  if (best.id === control.id) {
    recommendation = enoughSample
      ? `対照群（${control.id}）が最良。現状維持を推奨。`
      : `サンプル不足（各アーム${minSample}件未満）。判定保留。`;
  } else if (!enoughSample) {
    recommendation = `${best.id} がリード（+${(lift * 100).toFixed(1)}%）だがサンプル不足。継続して母数を貯める。`;
  } else if (significant) {
    recommendation = `${best.id} を採用推奨：control比 +${(lift * 100).toFixed(1)}%・有意（p≈${pValue.toFixed(3)}）。lead-config / コピーを ${best.id} に昇格。`;
  } else {
    recommendation = `${best.id} がやや優勢（+${(lift * 100).toFixed(1)}%）だが有意差なし（p≈${pValue.toFixed(3)}）。継続。`;
  }

  return { control: control.id, controlRate, bestArm: best.id, bestRate, lift, z, pValue, significant, recommendation };
}
