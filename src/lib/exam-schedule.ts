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

import { escapeIcs, pad2 } from './juken-schedule';

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

/** 'YYYY-MM-DD' → 'YYYYMMDD'（ICSの終日イベント日付形式）。 */
function toIcsDateString(s: string): string {
  return s.replace(/-/g, '');
}

/** 'YYYY-MM-DD'の翌日を'YYYYMMDD'で返す（終日イベントのDTENDは排他のため+1日）。 */
function nextDayIcsDateString(s: string): string {
  const d = new Date(`${s}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
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

/**
 * T-Y12段階3: 県別入試日程のICS（VCALENDAR）を生成する純関数。
 *
 * juken-schedule.tsの`buildJukenIcs`（全国共通・月レベルの「準備リマインダー」）とは責務が異なり、
 * こちらは教育委員会が公表した確定日程（出願期間・学力検査日・合格発表日等）をそのまま終日イベント
 * として配信する。1データ点=1出典（Y-0憲法）を守るため、公表資料のdocTitle/sourceUrlを
 * DESCRIPTIONに含める。`isValidDateString`を満たさないイベントは（存在しないはずだが）安全側で
 * 除外し、検証不能な日付を配信しない。
 */
export function buildExamScheduleIcs(
  file: PrefectureExamScheduleFile,
  prefectureName: string
): string {
  const year = file.years[file.years.length - 1];
  const stamp = `${toIcsDateString(year.fetchedAt)}T000000Z`;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//My Naishin//Exam Schedule//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(`${prefectureName}公立高校 入試日程（My Naishin）`)}`,
    'X-WR-TIMEZONE:Asia/Tokyo',
  ];
  year.events.forEach((event, i) => {
    if (!isValidDateString(event.startDate)) return;
    const endSource = event.endDate && isValidDateString(event.endDate) ? event.endDate : event.startDate;
    const start = toIcsDateString(event.startDate);
    const end = nextDayIcsDateString(endSource);
    const description = [event.note, `出典: ${year.docTitle}（${year.fiscalYear}）`]
      .filter((s): s is string => Boolean(s))
      .join(' / ');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:examsched-${file.prefectureCode}-${year.fiscalYear}-${i}@my-naishin.com`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${start}`);
    lines.push(`DTEND;VALUE=DATE:${end}`);
    lines.push(`SUMMARY:${escapeIcs(`【${prefectureName}】${event.label}`)}`);
    lines.push(`DESCRIPTION:${escapeIcs(description)}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
