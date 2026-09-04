import { GIFU_EXAM_SCHEDULE } from './gifu';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('GIFU_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(GIFU_EXAM_SCHEDULE.prefectureCode).toBe('gifu');
    expect(GIFU_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of GIFU_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.gifu\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of GIFU_EXAM_SCHEDULE.years) {
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

  it('finds the main (第一次選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(GIFU_EXAM_SCHEDULE, '令和8年度（2026年度）', '第一次選抜 検査期日');
    expect(exam?.startDate).toBe('2026-03-04');

    const result = findScheduleEvent(GIFU_EXAM_SCHEDULE, '令和8年度（2026年度）', '第一次選抜 合格発表・第二次選抜募集人員発表');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers both 第一次選抜 and 第二次選抜 tracks', () => {
    const labels = GIFU_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('第一次選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第二次選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(GIFU_EXAM_SCHEDULE, '令和99年度', '第一次選抜 検査期日')).toBeUndefined();
    expect(findScheduleEvent(GIFU_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
