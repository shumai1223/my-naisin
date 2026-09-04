/**
 * 神奈川県公立高校入試S値（S1値）まわりの決定論ライブラリ。
 *
 * 出典: 神奈川県教育委員会 入学者選抜情報。/kanagawa/s-value（src/app/kanagawa/s-value/page.tsx）が
 * 公開している式と同一のものをここに切り出す。
 *
 *   a = A/135×100   A = 内申点（評定合計・135点満点）
 *   b = B/500×100   B = 学力検査の合計（500点満点）
 *   S1 = a×f + b×g  f:g は志望校ごとの比率（合計10）
 *
 * ReverseCalculator.tsx の case 'kanagawa' が2026-08-21以降、この式を一切使わず
 * 「中2の内申を中3の80%と仮定して二重計上する」「100点換算をしない」「f:gの比率を
 * 単純な乗数として扱う」の3つの欠陥を抱えたまま公開されていた不具合の修正で切り出した。
 * hensachi.ts / finalrate-convention.ts と同じ「純関数＋テスト」の流儀に揃えている。
 */

export const KANAGAWA_NAISHIN_MAX = 135;
export const KANAGAWA_EXAM_MAX = 500;

export interface KanagawaS1Input {
  /** A（評定合計）。135点満点。 */
  naishinTotal: number;
  /** 学力検査の合計点。500点満点。 */
  examTotal: number;
  /**
   * f:g（内申:学力・合計10）をパーセント表記にしたもの。例: 4:6 → 40。
   * ReverseCalculator.tsx の naishinRatio state・KANAGAWA_RATIO_PRESETSと同じ単位。
   */
  naishinRatio: number;
}

/** S1 = a×f + b×g（a=A/135×100・b=B/500×100・f=naishinRatio/10・g=(100-naishinRatio)/10）。 */
export function calcS1({ naishinTotal, examTotal, naishinRatio }: KanagawaS1Input): number {
  const f = naishinRatio / 10;
  const g = (100 - naishinRatio) / 10;
  const a = (naishinTotal / KANAGAWA_NAISHIN_MAX) * 100;
  const b = (examTotal / KANAGAWA_EXAM_MAX) * 100;
  return a * f + b * g;
}

export interface KanagawaReverseInput {
  /** 目標S1値。 */
  targetS1: number;
  /** A（評定合計）。135点満点。 */
  naishinTotal: number;
  /** f:gをパーセント表記にしたもの（calcS1と同じ単位）。 */
  naishinRatio: number;
}

export interface KanagawaReverseResult {
  /** 目標S1値に必要な学力検査の合計点（500点満点・四捨五入済み）。500超もクランプせずそのまま返す。 */
  requiredExamScore: number;
  /** requiredExamScoreが0〜500点に収まるか。 */
  isAchievable: boolean;
}

/** calcS1をBについて解く逆算。b = (S1 − a×f) / g、B = b × 5。 */
export function requiredExamForS1({ targetS1, naishinTotal, naishinRatio }: KanagawaReverseInput): KanagawaReverseResult {
  const f = naishinRatio / 10;
  const g = (100 - naishinRatio) / 10;
  const a = (naishinTotal / KANAGAWA_NAISHIN_MAX) * 100;
  const b = (targetS1 - a * f) / g;
  const requiredExamScore = Math.round(b * (KANAGAWA_EXAM_MAX / 100));
  const isAchievable = requiredExamScore >= 0 && requiredExamScore <= KANAGAWA_EXAM_MAX;
  return { requiredExamScore, isAchievable };
}
