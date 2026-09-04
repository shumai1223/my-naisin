import { TOKUSHIMA_EXAM_SCHEDULE } from './tokushima';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('TOKUSHIMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(TOKUSHIMA_EXAM_SCHEDULE.prefectureCode).toBe('tokushima');
    expect(TOKUSHIMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of TOKUSHIMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/nyuushi\.tokushima-ec\.ed\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of TOKUSHIMA_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(TOKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学力検査');
    expect(exam?.startDate).toBe('2026-03-03');

    const result = findScheduleEvent(TOKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 結果通知');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers 育成型選抜・一般選抜・第2次募集選抜 tracks', () => {
    const labels = TOKUSHIMA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('育成型選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第2次募集選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(TOKUSHIMA_EXAM_SCHEDULE, '令和99年度', '一般選抜 学力検査')).toBeUndefined();
    expect(findScheduleEvent(TOKUSHIMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
