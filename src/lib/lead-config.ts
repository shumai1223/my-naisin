/**
 * 保護者リード（換金の本命）の「県 × 面」出し分けエンジン＝単一の設定ソース。
 *
 * 北極星（メモリ準拠）：稼ぐのは EPC型の有料バナーではなく「保護者 × 無料リード（資料請求/無料体験）」。
 * 有料成約は 100–330click/件、無料リードは数〜10click/件（20–50倍効率）。
 * よってここは「どの面・どの県で、どの無料リード案件を出すか」を一元管理し、
 * GA4（affiliate_click / lead_submit を program×page×placement で集計）の勝者をこの表に反映していく。
 *
 * 優先度（具体的なものが勝つ）：
 *   全体既定 < 面の既定 < 県の勝者 < 県×面の勝者
 *
 * 重要：既定（DEFAULT_LEAD_OFFER）は現行 ParentLeadCTA の表示と完全一致させてある。
 * → 勝者を設定するまで挙動は一切変わらない（安全に後から最適化していける器）。
 */

import type { AffiliateId } from '@/lib/affiliates';

export type LeadPlacement =
  | 'result' // 計算結果の直後（最高インテント）
  | 'hensachi' // 偏差値ツール
  | 'hyotei-heikin' // 評定平均ツール
  | 'prefecture' // 県別ページ
  | 'parent-lp' // 保護者LP（/hogosha）
  | 'blog' // 記事内
  | 'home'; // トップ

export interface LeadOffer {
  /** 送客先プログラム（affiliates.ts の live なIDのみ）。 */
  affiliateId: AffiliateId;
  heading: string;
  body: string;
  /** ボタン下の補足表記（PR/無料など）。送客先名に合わせる。 */
  note: string;
  /** CTAボタンの文言。 */
  ctaText: string;
}

/**
 * 全体既定＝現行 ParentLeadCTA の既定値そのまま（挙動非変更を保証）。
 * Z会の資料請求は全国対応の無料リードで、どの県・面でも破綻しない安全な土台。
 */
export const DEFAULT_LEAD_OFFER: LeadOffer = {
  affiliateId: 'zkai-text-request',
  heading: 'お子さまの成績、このままで志望校に届きますか？',
  body: '内申点・偏差値は「今からの伸ばし方」で大きく変わります。ご家庭でできる対策を、まずは無料の資料で確認してみませんか。費用はかからず、請求は数分で完了します。',
  note: 'Z会の通信教育の資料請求（PR）／無料',
  ctaText: '無料で資料をもらう',
};

/**
 * 面ごとの既定（文脈最適化）。プログラムは安全のため既定（Z会資料請求）を踏襲し、
 * コピーだけ面の文脈に寄せる。GA4で勝てる無料体験案件が見つかったら affiliateId を差し替える。
 */
export const PLACEMENT_LEAD_OVERRIDES: Partial<Record<LeadPlacement, Partial<LeadOffer>>> = {
  result: {
    heading: '結果が出た今が、対策の始めどきです',
    body: '内申点・偏差値は「今からの伸ばし方」で変わります。志望校との差を埋める家庭学習の進め方を、まずは無料の資料でご確認ください。請求は数分・費用はかかりません。',
  },
  hensachi: {
    heading: '偏差値を上げる「正しい順番」、ご存じですか？',
    body: '偏差値は学習量より「やり方」で伸びが大きく変わります。お子さまに合った伸ばし方を、まずは無料の資料で確認してみませんか。',
  },
  'hyotei-heikin': {
    heading: '評定平均（内申）は、推薦のカギを握ります',
    body: '評定平均は日々の積み重ねで決まります。今からできる対策と推薦の基準を、無料の資料でまとめて確認できます。',
  },
  prefecture: {
    heading: 'この地域の入試、お子さまの成績で届きますか？',
    body: '都道府県ごとに内申点の比重は大きく異なります。志望校との差を埋める家庭学習の進め方を、まずは無料の資料でご確認ください。',
  },
  'parent-lp': {
    heading: 'お子さまの志望校合格を、ご家庭からあと押し',
    body: '内申点・偏差値の伸ばし方はご家庭の関わりで変わります。費用をかけずに始められる対策から、無料の資料で確認してみませんか。',
  },
};

/**
 * 県の勝者（GA4の affiliate_click/lead_submit を県別に見て、効いた案件をここに固定していく）。
 * 例：塾の無料体験で校舎カバレッジの高い県は、その塾の text/banner を割り当てる。
 * 現状は空（=既定にフォールバック）。データが出たら1行ずつ埋める運用。
 */
export const PREFECTURE_LEAD_OVERRIDES: Partial<Record<string, Partial<LeadOffer>>> = {
  // 例（コメントのまま・有効化はGA4の勝者確定後）:
  // tokyo: { affiliateId: 'sora-juku-text', note: 'そら塾の無料体験（PR）／オンライン対応', ctaText: '無料体験を申し込む' },
};

/**
 * 県×面の勝者（最も具体的＝最優先）。キーは `${prefectureCode}:${placement}`。
 * 「勝ち案件 × 勝ち面」マトリクスの最終形。GA4結果をここへ反映する。
 */
export const PREFECTURE_PLACEMENT_LEAD_OVERRIDES: Record<string, Partial<LeadOffer>> = {
  // 例: 'osaka:result': { affiliateId: 'morijuku-text', note: '森塾の無料体験（PR）／無料', ctaText: '無料体験を申し込む' },
};

/**
 * 県 × 面から最適な保護者リードオファーを解決する（純粋関数・サーバー安全）。
 * 何も指定が無ければ DEFAULT_LEAD_OFFER（=現行表示）を返す。
 */
export function selectLeadOffer(opts: { prefectureCode?: string; placement?: LeadPlacement } = {}): LeadOffer {
  const { prefectureCode, placement } = opts;
  const placementOverride = placement ? PLACEMENT_LEAD_OVERRIDES[placement] : undefined;
  const prefOverride = prefectureCode ? PREFECTURE_LEAD_OVERRIDES[prefectureCode] : undefined;
  const comboOverride =
    prefectureCode && placement
      ? PREFECTURE_PLACEMENT_LEAD_OVERRIDES[`${prefectureCode}:${placement}`]
      : undefined;

  return {
    ...DEFAULT_LEAD_OFFER,
    ...placementOverride,
    ...prefOverride,
    ...comboOverride,
  };
}
