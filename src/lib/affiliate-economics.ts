/**
 * 送客の「推定経済性」＝クリック実数から 推定リード数／推定額 を概算するための係数（H5）。
 *
 * ⚠ 重要（[[monetization-reality-2026-06]] / [[no-revenue-projections-guideline]]）：
 *   ここの CPA・転換率は **すべて未実測の「仮定」** です（ASPの公開報酬・一般的な相場から置いた推定値）。
 *   実際の確定報酬は ASP 管理画面が正。これは「営業資料・KPIの当たりをつける」ための概算であって、
 *   予測の断定ではありません。実測値が出たら必ずこの表を実数で置き換える運用（捏造ゼロの原則）。
 *
 * 【2026-06-19 三層化】「盛れすぎ」を是正。楽観だけでなく保守を主役に：
 *   - convRate    … 楽観転換率（理想上限＝営業の天井）。従来値。
 *   - convRateLow … 保守転換率（権限ズレ＝生徒面で保護者案件は完結しづらい、を織り込んだ現実線）。**主役**。
 *   - CONFIRM_RATE… 「発生→確定（着金）」の歩留まり。ASP却下（無効/重複/条件未達）を控除する係数。
 *   推定発生額（楽観）= clicks × convRate    × cpaYen
 *   推定確定額（保守）= clicks × convRateLow × cpaYen × CONFIRM_RATE   ← ダッシュボードの主役
 *
 * 使い手：
 *  - /admin/report（認証付き・送客アナリティクスの金額換算）
 *  - scripts/generate-sales-report.ts（月次の営業/振り返りレポート Markdown 生成）
 */

import type { AffiliateId } from '@/lib/affiliates';

export type OfferKind = 'free-lead' | 'doc-request' | 'paid';

export interface AffiliateEconomics {
  /** 1成果あたりの想定報酬（円・推定）。 */
  cpaYen: number;
  /** クリック→成果 の楽観転換率（理想上限・未実測の仮定）。 */
  convRate: number;
  /** クリック→成果 の保守転換率（権限ズレ・生徒面前提を織り込んだ現実線）。主役。 */
  convRateLow: number;
  /** 種別（無料体験・資料請求＝溶けにくい／有料＝CVR低くEPCで溶ける）。 */
  kind: OfferKind;
}

/**
 * 「発生」→「確定（着金）」の歩留まり。ASPは無効・重複・条件未達のリードを 3〜4割却下するため、
 * 保守側の確定額にこの控除を掛ける。発生≠着金を数式に織り込むための単一係数。
 */
export const CONFIRM_RATE = 0.6;

/**
 * 種別ごとの既定（個別指定が無いプログラムのフォールバック）。
 * 無料リードは CVR が高くCPA中、有料は CVR が低くEPCで溶ける、という北極星の経験則を反映。
 */
const KIND_DEFAULT: Record<OfferKind, AffiliateEconomics> = {
  'free-lead': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'doc-request': { cpaYen: 600, convRate: 0.12, convRateLow: 0.06, kind: 'doc-request' },
  paid: { cpaYen: 1500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
};

/**
 * プログラム別の推定経済性（仮定）。CPAは ASP公開値・相場の概算、convRate は未実測の仮置き。
 * convRateLow は「生徒が大半の流入で、保護者の決裁が要る案件ほど完結率が落ちる」を織り込んだ保守値：
 *   - 塾/家庭教師の無料体験（生徒に直接刺さる）= 4% 前後
 *   - FP相談/学資/不登校資料など高CPAの保護者案件（生徒面では完結しづらい）= 1.5〜2%
 *   - 資料請求 = 6%、有料 = 0.5〜1.2%
 * 実測が出たら上書きする。未掲載IDは下の economicsFor() で種別既定にフォールバック。
 */
export const AFFILIATE_ECONOMICS: Partial<Record<AffiliateId, AffiliateEconomics>> = {
  // ── 最高単価帯（保護者＝決裁者・無料相談/資料請求／生徒面では完結しづらい＝保守は厳しめ） ──
  'fp-soudan': { cpaYen: 13800, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' }, // もしも・保険トータルプロフェッショナル
  'hoken-compass': { cpaYen: 12000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'money-doctor': { cpaYen: 11000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'gakushi-hoken': { cpaYen: 8000, convRate: 0.06, convRateLow: 0.02, kind: 'doc-request' },
  // ── 不登校クラスタ（高CPA・専門性で転換しやすい仮定／資料系は保護者決裁で保守厳しめ） ──
  'moshimo-classjapan': { cpaYen: 20000, convRate: 0.04, convRateLow: 0.015, kind: 'free-lead' },
  'moshimo-tintoru': { cpaYen: 5000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  // ── 塾・家庭教師の無料体験（本線の換金口・生徒に直接刺さる＝保守4%前後） ──
  'moshimo-e-live': { cpaYen: 5000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  'moshimo-studycoach': { cpaYen: 5000, convRate: 0.06, convRateLow: 0.04, kind: 'free-lead' },
  'moshimo-rewrite': { cpaYen: 3000, convRate: 0.06, convRateLow: 0.04, kind: 'free-lead' },
  'sora-juku-text': { cpaYen: 3500, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'morijuku-text': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'campus-text': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'atama-text': { cpaYen: 4000, convRate: 0.07, convRateLow: 0.04, kind: 'free-lead' },
  // 家庭教師の高CPA（保護者決裁＝保守厳しめ）
  'gakken-katei-kyoshi': { cpaYen: 12000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'ganba-katei-kyoshi': { cpaYen: 11000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  'manalink-katei-kyoshi': { cpaYen: 8000, convRate: 0.05, convRateLow: 0.02, kind: 'free-lead' },
  'afb-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'accesstrade-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'rentracks-juku-trial': { cpaYen: 4000, convRate: 0.08, convRateLow: 0.04, kind: 'free-lead' },
  'afb-katei-kyoshi': { cpaYen: 10000, convRate: 0.05, convRateLow: 0.015, kind: 'free-lead' },
  // ── 通信教育（資料請求＝溶けにくい無料リード） ──
  'zkai-text-request': { cpaYen: 800, convRate: 0.12, convRateLow: 0.06, kind: 'doc-request' },
  'zkai-daigaku': { cpaYen: 800, convRate: 0.1, convRateLow: 0.05, kind: 'doc-request' },
  // ── 通信教育・スマホ学習（EPC型・有料寄り） ──
  'zkai-banner': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'zkai-text-middle': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'zkai-text-advanced': { cpaYen: 500, convRate: 0.01, convRateLow: 0.005, kind: 'paid' },
  'sapuri-text': { cpaYen: 1500, convRate: 0.02, convRateLow: 0.008, kind: 'paid' },
  'sapuri-banner-468': { cpaYen: 1500, convRate: 0.015, convRateLow: 0.006, kind: 'paid' },
  'sapuri-banner-300': { cpaYen: 1500, convRate: 0.015, convRateLow: 0.006, kind: 'paid' },
  'sora-juku-banner': { cpaYen: 3500, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'morijuku-banner': { cpaYen: 4000, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'campus-banner': { cpaYen: 4000, convRate: 0.06, convRateLow: 0.03, kind: 'free-lead' },
  'atama-banner': { cpaYen: 4000, convRate: 0.05, convRateLow: 0.03, kind: 'free-lead' },
  'shoin-banner': { cpaYen: 800, convRate: 0.03, convRateLow: 0.012, kind: 'paid' },
};

/** プログラムの推定経済性を返す（未掲載は free-lead 既定）。 */
export function economicsFor(id: AffiliateId): AffiliateEconomics {
  return AFFILIATE_ECONOMICS[id] ?? KIND_DEFAULT['free-lead'];
}

/** クリック数 → 推定成果（リード）数【楽観】。 */
export function estimatedLeads(id: AffiliateId, clicks: number): number {
  return clicks * economicsFor(id).convRate;
}

/** クリック数 → 推定成果（リード）数【保守】。 */
export function estimatedLeadsLow(id: AffiliateId, clicks: number): number {
  return clicks * economicsFor(id).convRateLow;
}

/** クリック数 → 推定発生額（円）【楽観】。発生≠着金（承認・確定はラグ＋却下あり）。 */
export function estimatedRevenueYen(id: AffiliateId, clicks: number): number {
  const e = economicsFor(id);
  return clicks * e.convRate * e.cpaYen;
}

/**
 * クリック数 → 推定確定額（円）【保守・主役】。
 * 保守転換率 × CPA × 却下控除（CONFIRM_RATE）で「着金見込み」に寄せた現実線。
 */
export function confirmedRevenueYen(id: AffiliateId, clicks: number): number {
  const e = economicsFor(id);
  return clicks * e.convRateLow * e.cpaYen * CONFIRM_RATE;
}

/** 円を「¥1,234」表記に。 */
export function yen(n: number): string {
  return `¥${Math.round(n).toLocaleString('ja-JP')}`;
}
