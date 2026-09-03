import { KUMAMOTO_EXAM_SCHEDULE } from './kumamoto';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('KUMAMOTO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(KUMAMOTO_EXAM_SCHEDULE.prefectureCode).toBe('kumamoto');
    expect(KUMAMOTO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of KUMAMOTO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.kumamoto\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of KUMAMOTO_EXAM_SCHEDULE.years) {
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

  it('finds the two-day main exam window and result date by label', () => {
    const exam = findScheduleEvent(KUMAMOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期（一般）選抜実施日');
    expect(exam).toEqual(
      expect.objectContaining({ startDate: '2026-03-04', endDate: '2026-03-05' })
    );

    const result = findScheduleEvent(KUMAMOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期（一般）選抜 合格者発表');
    expect(result?.startDate).toBe('2026-03-12');
  });

  it('front-track (前期選抜) results are announced on the same day as the general track', () => {
    const front = findScheduleEvent(KUMAMOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '前期（特色）選抜 合格者発表');
    expect(front?.startDate).toBe('2026-03-12');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(KUMAMOTO_EXAM_SCHEDULE, '令和99年度', '後期（一般）選抜実施日')).toBeUndefined();
    expect(findScheduleEvent(KUMAMOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
