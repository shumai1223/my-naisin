/**
 * 福岡県の総合得点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝福岡県は内申点(中3のみ45点満点)と学力検査点(300点満点)を
 * 単純合算するA群（学力・内申の両方の順位が合格圏）／B群（総合判断）の二段階選抜という独自方式のため
 * 個別実装している。FukuokaScoreCalculator.tsxにインラインだった計算ロジックを切り出した単一ソースで、
 * UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export const FUKUOKA_MAX_NAISHIN = 45;
export const FUKUOKA_MAX_GAKURYOKU = 300;
export const FUKUOKA_MAX_TOTAL = FUKUOKA_MAX_NAISHIN + FUKUOKA_MAX_GAKURYOKU;

export interface FukuokaScoreInput {
  /** 内申点（45点満点＝中3の9教科のみ）。 */
  naishinRaw: number;
  /** 学力検査点（300点満点＝5教科×60点）。 */
  gakuryokuRaw: number;
}

export interface FukuokaScoreResult {
  total: number;
  max: number;
  percent: number;
}

/**
 * 合計（目安）＝内申点＋学力検査点の単純合算。
 * 福岡県はA群（学力・内申の両方の順位が合格圏）／B群（総合判断）の二段階選抜のため、
 * この合計だけで合否が決まるわけではない（学校別ボーダー断定なし）。
 */
export function computeFukuokaScore(input: FukuokaScoreInput): FukuokaScoreResult {
  const total = input.naishinRaw + input.gakuryokuRaw;
  return { total, max: FUKUOKA_MAX_TOTAL, percent: (total / FUKUOKA_MAX_TOTAL) * 100 };
}
