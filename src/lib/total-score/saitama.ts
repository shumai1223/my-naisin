/**
 * 埼玉県の総合得点計算（S-5②・S-3①の残タスク）。
 *
 * 埼玉県は調査書点の満点・学力検査との比率が高校・学科ごとに異なり県内一律の換算式が無いため、
 * 他の12県のような固定式は作れない（捏造ゼロ方針）。よって「調査書点」はユーザー自身が
 * 志望校の募集要項に沿って把握している換算後の点数をそのまま入力してもらい、合計は
 * 自己申告値の単純合算＝目安として扱う。SaitamaTotalScoreCalculator.tsxにインラインだった
 * ロジックを切り出した単一ソースで、UIとAPI/MCPで計算結果がズレないようにする。
 */

export const SAITAMA_MAX_GAKURYOKU = 500;
/**
 * 調査書点の満点は高校・学科ごとに設定が異なり県内一律の値が無いため、目安として
 * 「合計は900点前後（高校により異なる）」という一般的な目安の一部として400を仮定する
 * （新たな断定はしない・SaitamaTotalScoreCalculator.tsxの既存コメントを踏襲）。
 */
export const SAITAMA_ASSUMED_CHOSASHO_CEILING = 400;
export const SAITAMA_ASSUMED_TOTAL_CEILING = SAITAMA_MAX_GAKURYOKU + SAITAMA_ASSUMED_CHOSASHO_CEILING;

export interface SaitamaTotalScoreInput {
  /** 学力検査点（500点満点＝5教科×100点）。 */
  gakuryokuRaw: number;
  /** 調査書点（換算後・ユーザー自身が募集要項に沿って把握している自己申告値）。 */
  chosashoRaw: number;
}

export interface SaitamaTotalScoreResult {
  total: number;
  /** 目安の満点（学力検査500点＋調査書点仮定400点）。学校別の実際の満点ではない。 */
  max: number;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/** 総合得点（目安）＝学力検査点＋調査書点（自己申告値）の単純合算。学校別ボーダー断定なし。 */
export function computeSaitamaTotalScore(input: SaitamaTotalScoreInput): SaitamaTotalScoreResult {
  const gakuryokuRaw = clamp(input.gakuryokuRaw, 0, SAITAMA_MAX_GAKURYOKU);
  // 調査書点は高校ごとに満点が異なる自己申告値のため断定の上限は持たない。異常入力による表示破綻だけを防ぐ防御的な上限。
  const chosashoRaw = clamp(input.chosashoRaw, 0, 1000);
  return {
    total: gakuryokuRaw + chosashoRaw,
    max: SAITAMA_ASSUMED_TOTAL_CEILING,
  };
}
