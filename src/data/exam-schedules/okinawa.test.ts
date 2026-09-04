import { OKINAWA_EXAM_SCHEDULE } from './okinawa';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('OKINAWA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(OKINAWA_EXAM_SCHEDULE.prefectureCode).toBe('okinawa');
    expect(OKINAWA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of OKINAWA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.okinawa\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of OKINAWA_EXAM_SCHEDULE.years) {
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

  it('finds the main exam day and result date by label', () => {
    const exam = findScheduleEvent(OKINAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査');
    expect(exam?.startDate).toBe('2026-03-04');
    expect(exam?.endDate).toBe('2026-03-05');

    const result = findScheduleEvent(OKINAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格発表');
    expect(result?.startDate).toBe('2026-03-17');
  });

  it('covers both the main selection and 2次募集 track', () => {
    const labels = OKINAWA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l === '学力検査')).toBe(true);
    expect(labels.some((l) => l.startsWith('2次募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(OKINAWA_EXAM_SCHEDULE, '令和99年度', '学力検査')).toBeUndefined();
    expect(findScheduleEvent(OKINAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
