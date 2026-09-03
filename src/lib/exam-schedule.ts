/**
 * 入試日程DB（T-Y12・47県×複数年度）の型・純関数群。
 *
 * `juken-schedule.ts`は全国共通の月レベルの目安のみを持つ（県別の確定日程は「検証不能」として
 * 意図的に持たなかった）。T-Y11Bで47県のR8公表資料を継続的に確認する体制ができたことで、
 * 各県教育委員会が公式サイトで公表する「入学者選抜の日程」（出願期間・学力検査日・合格発表日等）
 * を一次ソースとして収集できることが判明した（2026-09-04・ibaraki/chiba/osakaで確認済み）。
 *
 * Y-0憲法「1データ点=1出典」に従い、年度単位でsourceUrlを持つ（competition-rate.tsと同型）。
 * 学校別ボーダー等の推定は一切扱わない（この日程DBは全県共通の手続き日程のみ）。
 */

export interface ExamScheduleEvent {
  /** 公表資料の項目名をそのまま転記（例: '一般入学学力検査'）。独自の言い換えはしない。 */
  label: string;
  /** 'YYYY-MM-DD'。期間の場合は開始日。 */
  startDate: string;
  /** 期間がある場合の終了日（'YYYY-MM-DD'）。単日イベントは省略。 */
  endDate?: string;
  /** 時刻等の補足（例: '9:00'）。公表資料にある場合のみ。 */
  note?: string;
}

export interface ExamScheduleYear {
  /** '令和8年度（2026年度）'のような表記。 */
  fiscalYear: string;
  sourceUrl: string;
  docTitle: string;
  /** この年度分を確認した日（'YYYY-MM-DD'）。 */
  fetchedAt: string;
  events: ExamScheduleEvent[];
}

export interface PrefectureExamScheduleFile {
  prefectureCode: string;
  years: ExamScheduleYear[];
}

/** 'YYYY-MM-DD'形式かどうかを検証する（実在の日付かまでは見ない）。 */
export function isValidDateString(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
}

/** 指定年度・項目名のイベントを取得する（完全一致）。見つからなければundefined。 */
export function findScheduleEvent(
  file: PrefectureExamScheduleFile,
  fiscalYear: string,
  label: string
): ExamScheduleEvent | undefined {
  const year = file.years.find((y) => y.fiscalYear === fiscalYear);
  return year?.events.find((e) => e.label === label);
}
