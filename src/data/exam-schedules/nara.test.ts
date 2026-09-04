import { NARA_EXAM_SCHEDULE } from './nara';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('NARA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(NARA_EXAM_SCHEDULE.prefectureCode).toBe('nara');
    expect(NARA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of NARA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.nara\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of NARA_EXAM_SCHEDULE.years) {
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

  it('finds the main (一次選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(NARA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次選抜 学力検査等');
    expect(exam?.startDate).toBe('2026-03-04');

    const result = findScheduleEvent(NARA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次選抜 合格発表');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers 一次選抜・追検査・二次選抜 tracks', () => {
    const labels = NARA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('一次選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('追検査'))).toBe(true);
    expect(labels.some((l) => l.startsWith('二次選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(NARA_EXAM_SCHEDULE, '令和99年度', '一次選抜 学力検査等')).toBeUndefined();
    expect(findScheduleEvent(NARA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
