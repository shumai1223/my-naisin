import { NIIGATA_EXAM_SCHEDULE } from './niigata';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('NIIGATA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(NIIGATA_EXAM_SCHEDULE.prefectureCode).toBe('niigata');
    expect(NIIGATA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of NIIGATA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.niigata\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of NIIGATA_EXAM_SCHEDULE.years) {
      for (const event of year.events) {
        expect(isValidDateString(event.startDate)).toBe(true);
        if (event.endDate) {
          expect(isValidDateString(event.endDate)).toBe(true);
          expect(new Date(event.endDate).getTime()).toBeGreaterThanOrEqual(
            new Date(event.startDate).getTime()
          );
        }
      }
    }
  });

  it('finds the two consecutive exam days and result date by label', () => {
    const exam = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学力検査等（本検査）');
    expect(exam?.startDate).toBe('2026-03-04');

    const independent = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学校独自検査（本検査）');
    expect(independent?.startDate).toBe('2026-03-05');

    const result = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 合格者の発表');
    expect(result?.startDate).toBe('2026-03-12');
  });

  it('also includes the tokushokuka-senbatsu (特色化選抜) track', () => {
    const notice = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '特色化選抜 結果通知');
    expect(notice?.startDate).toBe('2026-02-12');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和99年度', '一般選抜 学力検査等（本検査）')).toBeUndefined();
    expect(findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });

  it('令和9年度 reflects the abolition of 特色化選抜 (unified into 一般選抜, not fabricated)', () => {
    const labels = NIIGATA_EXAM_SCHEDULE.years[1].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('一般選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('特色化選抜'))).toBe(false);

    const exam = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和9年度（2027年度）', '一般選抜 本検査1日目');
    expect(exam?.startDate).toBe('2027-02-25');

    const result = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和9年度（2027年度）', '一般選抜 合格発表');
    expect(result?.startDate).toBe('2027-03-08');

    const secondRound = findScheduleEvent(NIIGATA_EXAM_SCHEDULE, '令和9年度（2027年度）', '欠員補充のための2次募集 合格発表');
    expect(secondRound?.startDate).toBe('2027-03-16');
  });
});
