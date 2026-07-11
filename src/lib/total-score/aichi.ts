/**
 * 愛知県の総合得点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝愛知県は9教科評定合計(45点満点)を2倍した評定得点(90点満点)と
 * 学力検査点(110点満点)を、志望校の評価方法Ⅰ〜Ⅴごとに異なる倍率(等倍〜2倍)で加算する独自方式のため
 * 個別実装している。AichiHyokaCalculator.tsxにインラインだった計算ロジックを切り出した単一ソースで、
 * UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export interface AichiMethodOption {
  type: string;
  naishinMul: number;
  gakuryokuMul: number;
  max: number;
  label: string;
}

/** 評価方法Ⅰ〜Ⅴ（評定得点・学力検査点それぞれの倍率と満点）。 */
export const AICHI_METHODS: AichiMethodOption[] = [
  { type: 'Ⅰ', naishinMul: 1, gakuryokuMul: 1, max: 200, label: '等倍（標準）' },
  { type: 'Ⅱ', naishinMul: 1.5, gakuryokuMul: 1, max: 245, label: 'やや内申重視' },
  { type: 'Ⅲ', naishinMul: 1, gakuryokuMul: 1.5, max: 255, label: 'やや当日点重視' },
  { type: 'Ⅳ', naishinMul: 2, gakuryokuMul: 1, max: 290, label: '内申最重視' },
  { type: 'Ⅴ', naishinMul: 1, gakuryokuMul: 2, max: 310, label: '当日点最重視' },
];

export interface AichiTotalScoreInput {
  /** 9教科評定合計（45点満点・中3のみ対象）。 */
  naishinSumRaw: number;
  /** 学力検査点（110点満点＝5教科×22点）。 */
  gakuryokuRaw: number;
  /** AICHI_METHODSのインデックス（既定0=評価方法Ⅰ 等倍標準）。 */
  methodIndex?: number;
}

export interface AichiTotalScoreResult {
  /** 評定得点＝評定合計×2（90点満点）。 */
  hyoteitokuten: number;
  total: number;
  max: number;
  method: AichiMethodOption;
}

/** 評定得点(評定合計×2)×評定倍率 + 学力検査点×学力倍率 で総合得点を計算（評価方法により満点が異なる）。 */
export function computeAichiTotalScore(input: AichiTotalScoreInput): AichiTotalScoreResult {
  const method = AICHI_METHODS[input.methodIndex ?? 0] ?? AICHI_METHODS[0];
  const hyoteitokuten = input.naishinSumRaw * 2;
  const total = Math.round((hyoteitokuten * method.naishinMul + input.gakuryokuRaw * method.gakuryokuMul) * 10) / 10;
  return { hyoteitokuten, total, max: method.max, method };
}
