import { SAGA_EXAM_SCHEDULE } from './saga';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('SAGA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(SAGA_EXAM_SCHEDULE.prefectureCode).toBe('saga');
    expect(SAGA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of SAGA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.saga\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of SAGA_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(SAGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学力検査等');
    expect(exam?.startDate).toBe('2026-03-03');
    expect(exam?.endDate).toBe('2026-03-04');

    const result = findScheduleEvent(SAGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 合格者発表');
    expect(result?.startDate).toBe('2026-03-11');
  });

  it('covers 特別選抜・一般選抜・再募集 tracks', () => {
    const labels = SAGA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('特別選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('再募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(SAGA_EXAM_SCHEDULE, '令和99年度', '一般選抜 学力検査等')).toBeUndefined();
    expect(findScheduleEvent(SAGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
