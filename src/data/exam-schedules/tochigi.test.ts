import { TOCHIGI_EXAM_SCHEDULE } from './tochigi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('TOCHIGI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(TOCHIGI_EXAM_SCHEDULE.prefectureCode).toBe('tochigi');
    expect(TOCHIGI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of TOCHIGI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.tochigi\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of TOCHIGI_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(TOCHIGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学力検査');
    expect(exam?.startDate).toBe('2026-03-05');

    const result = findScheduleEvent(TOCHIGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 合格者発表');
    expect(result?.startDate).toBe('2026-03-11');
  });

  it('covers both 特色選抜 and 一般選抜 tracks', () => {
    const labels = TOCHIGI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('特色選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(TOCHIGI_EXAM_SCHEDULE, '令和99年度', '一般選抜 学力検査')).toBeUndefined();
    expect(findScheduleEvent(TOCHIGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
