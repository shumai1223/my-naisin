import { HIROSHIMA_EXAM_SCHEDULE } from './hiroshima';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('HIROSHIMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(HIROSHIMA_EXAM_SCHEDULE.prefectureCode).toBe('hiroshima');
    expect(HIROSHIMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of HIROSHIMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.hiroshima\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of HIROSHIMA_EXAM_SCHEDULE.years) {
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

  it('finds the three-day exam window and result date by label', () => {
    const exam = findScheduleEvent(HIROSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査・自己表現等');
    expect(exam).toEqual({ label: '学力検査・自己表現等', startDate: '2026-02-25', endDate: '2026-02-27' });

    const result = findScheduleEvent(HIROSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(result?.startDate).toBe('2026-03-09');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(HIROSHIMA_EXAM_SCHEDULE, '令和99年度', '学力検査・自己表現等')).toBeUndefined();
    expect(findScheduleEvent(HIROSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
