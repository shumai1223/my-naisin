import { SHIZUOKA_EXAM_SCHEDULE } from './shizuoka';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('SHIZUOKA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(SHIZUOKA_EXAM_SCHEDULE.prefectureCode).toBe('shizuoka');
    expect(SHIZUOKA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of SHIZUOKA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.shizuoka\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of SHIZUOKA_EXAM_SCHEDULE.years) {
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

  it('finds the two-day exam and result date by label', () => {
    const exam = findScheduleEvent(SHIZUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査・面接など');
    expect(exam).toEqual({ label: '学力検査・面接など', startDate: '2026-03-04', endDate: '2026-03-05' });

    const result = findScheduleEvent(SHIZUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('also includes the secondary recruitment (再募集) track', () => {
    const secondary = findScheduleEvent(SHIZUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '再募集 面接，作文など');
    expect(secondary?.startDate).toBe('2026-03-23');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(SHIZUOKA_EXAM_SCHEDULE, '令和99年度', '学力検査・面接など')).toBeUndefined();
    expect(findScheduleEvent(SHIZUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
