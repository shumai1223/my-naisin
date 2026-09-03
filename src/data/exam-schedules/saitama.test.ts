import { SAITAMA_EXAM_SCHEDULE } from './saitama';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('SAITAMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(SAITAMA_EXAM_SCHEDULE.prefectureCode).toBe('saitama');
    expect(SAITAMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of SAITAMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.saitama\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of SAITAMA_EXAM_SCHEDULE.years) {
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

  it('finds the exam day, makeup exam, and result date by label', () => {
    const exam = findScheduleEvent(SAITAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査');
    expect(exam?.startDate).toBe('2026-02-26');

    const makeup = findScheduleEvent(SAITAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '追検査');
    expect(makeup?.startDate).toBe('2026-03-03');

    const result = findScheduleEvent(SAITAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '入学許可候補者発表');
    expect(result?.startDate).toBe('2026-03-06');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(SAITAMA_EXAM_SCHEDULE, '令和99年度', '学力検査')).toBeUndefined();
    expect(findScheduleEvent(SAITAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
