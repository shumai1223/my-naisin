/**
 * EV（推定経済性）計算エンジン — サイト非依存の汎用部分。
 *
 * PLAYBOOK移植メモ（F-7④）: ここにあるのは型・計算式・書式のみで、他サイト（例: my-shingaku）へ
 * そのままコピー可能。実際のCPA・転換率（AFFILIATE_ECONOMICS）やCONFIRM_RATE等の仮定値は
 * ASP提携に紐づくサイト固有のデータのため、affiliate-economics.ts 側に残す（このファイルには含めない）。
 */

export type OfferKind = 'free-lead' | 'doc-request' | 'paid';

export interface AffiliateEconomics {
  /** 1成果あたりの想定報酬（円・推定）。 */
  cpaYen: number;
  /** クリック→成果 の楽観転換率（理想上限・未実測の仮定）。 */
  convRate: number;
  /** クリック→成果 の保守転換率（権限ズレ等を織り込んだ現実線）。主役。 */
  convRateLow: number;
  /** 種別（無料体験・資料請求＝溶けにくい／有料＝CVR低くEPCで溶ける）。 */
  kind: OfferKind;
}

export interface LiveOfferEV {
  id: string;
  programName: string;
  kind: OfferKind;
  cpaYen: number;
  /** クリック1,000あたりの推定確定額（保守）。EVの単一指標。 */
  confirmedPer1000: number;
}

/**
 * 申込のハードルの低い順＝コミットメント階段。資料請求(0) < 無料体験/相談(1) < 有料成約(2)。
 */
export function commitmentLevel(kind: OfferKind): 0 | 1 | 2 {
  switch (kind) {
    case 'doc-request':
      return 0;
    case 'free-lead':
      return 1;
    case 'paid':
      return 2;
  }
}

/** 円を「¥1,234」表記に。 */
export function yen(n: number): string {
  return `¥${Math.round(n).toLocaleString('ja-JP')}`;
}

/** クリック数 → 推定成果（リード）数【楽観】。 */
export function estimatedLeadsFor(e: AffiliateEconomics, clicks: number): number {
  return clicks * e.convRate;
}

/** クリック数 → 推定成果（リード）数【保守】。 */
export function estimatedLeadsLowFor(e: AffiliateEconomics, clicks: number): number {
  return clicks * e.convRateLow;
}

/** クリック数 → 推定発生額（円）【楽観】。発生≠着金（承認・確定はラグ＋却下あり）。 */
export function estimatedRevenueYenFor(e: AffiliateEconomics, clicks: number): number {
  return clicks * e.convRate * e.cpaYen;
}

/**
 * クリック数 → 推定確定額（円）【保守・主役】。
 * 保守転換率 × CPA × 却下控除（confirmRate）で「着金見込み」に寄せた現実線。
 * confirmRateはサイト側の仮定値（my-naishinのCONFIRM_RATE等）を呼び出し側から渡す。
 */
export function confirmedRevenueYenFor(e: AffiliateEconomics, clicks: number, confirmRate: number): number {
  return clicks * e.convRateLow * e.cpaYen * confirmRate;
}

/** クリック1,000あたりの推定確定額（保守）＝1オファーのEVを表す単一の指標。 */
export function confirmedPer1000For(e: AffiliateEconomics, confirmRate: number): number {
  return confirmedRevenueYenFor(e, 1000, confirmRate);
}
