/**
 * Λ-12 公表値の再構成: 教育委員会が公表している学力検査の得点統計（教科別平均点等）を
 * 一次ソースのまま再掲する。Y-0憲法を継承し、学校別ボーダー・偏差値の独自推定は一切行わない
 * （教委が県全体で公表した集計値のみを対象とする）。
 *
 * 県によって公表する平均点の算出基盤（全受検者 or 合格者のみ）が異なるため、averageType で
 * 明示し、異なる基盤の数値を同列比較しないよう呼び出し側に伝える。
 */

export interface SubjectAverage {
  subject: string;
  averageScore: number;
  maxScore: number;
}

export type ExamScoreAverageType = 'test-takers' | 'passers';

export interface ExamScoreYearEntry {
  /** 例: '令和6年度'。 */
  fiscalYearLabel: string;
  /** 'test-takers'=全受検者平均、'passers'=合格者のみ平均。県により算出基盤が異なるため必須。 */
  averageType: ExamScoreAverageType;
  subjects: SubjectAverage[];
  /** 一次ソースが合計点を明記している場合のみ設定。無い場合は独自に合算せず未設定のままにする。 */
  totalAverage?: number;
  totalMaxScore?: number;
  testTakerCount?: number;
}

export interface ExamScoreStatisticsSource {
  url: string;
  docTitle: string;
  fetchedAt: string;
}

export interface ExamScoreStatisticsFile {
  prefectureCode: string;
  years: ExamScoreYearEntry[];
  source: ExamScoreStatisticsSource;
}

/**
 * 教科別平均点の合計とtotalAverageの整合性をチェックする。
 * 教科別平均点は個々に小数第1位で四捨五入された公表値のため、合計値とtotalAverageが完全一致
 * しないことがある（丸め誤差の蓄積・高知県R6実績で0.2点差を確認済み）。そのため厳密な等価判定
 * ではなく、教科数×0.1点程度を上限とした許容誤差での妥当性チェックとする。
 */
export function isPlausibleSubjectSum(entry: ExamScoreYearEntry): boolean {
  if (entry.totalAverage === undefined) return true;
  const sum = entry.subjects.reduce((acc, s) => acc + s.averageScore, 0);
  const tolerance = Math.max(0.5, entry.subjects.length * 0.1);
  return Math.abs(sum - entry.totalAverage) <= tolerance;
}
