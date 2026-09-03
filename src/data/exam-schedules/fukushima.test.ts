import { FUKUSHIMA_EXAM_SCHEDULE } from './fukushima';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('FUKUSHIMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(FUKUSHIMA_EXAM_SCHEDULE.prefectureCode).toBe('fukushima');
    expect(FUKUSHIMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of FUKUSHIMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.fukushima\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of FUKUSHIMA_EXAM_SCHEDULE.years) {
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

  it('finds the main (前期選抜) exam window and result date by label', () => {
    const exam = findScheduleEvent(FUKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '前期選抜・連携型選抜 学力検査・面接等');
    expect(exam?.startDate).toBe('2026-03-04');

    const result = findScheduleEvent(FUKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '前期選抜・連携型選抜 選抜結果発表');
    expect(result?.startDate).toBe('2026-03-16');
  });

  it('also includes the 後期選抜 (secondary recruitment for unfilled seats) track', () => {
    const secondary = findScheduleEvent(FUKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期選抜 選抜結果発表');
    expect(secondary?.startDate).toBe('2026-03-25');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(FUKUSHIMA_EXAM_SCHEDULE, '令和99年度', '前期選抜・連携型選抜 学力検査・面接等')).toBeUndefined();
    expect(findScheduleEvent(FUKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
