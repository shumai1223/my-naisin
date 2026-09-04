import { TOKYO_EXAM_SCHEDULE } from './tokyo';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('TOKYO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(TOKYO_EXAM_SCHEDULE.prefectureCode).toBe('tokyo');
    expect(TOKYO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of TOKYO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.kyoiku\.metro\.tokyo\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of TOKYO_EXAM_SCHEDULE.years) {
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

  it('finds the main (学力検査に基づく選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(TOKYO_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査に基づく選抜（第一次募集・分割前期募集） 実施日');
    expect(exam?.startDate).toBe('2026-02-21');

    const result = findScheduleEvent(TOKYO_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査に基づく選抜（第一次募集・分割前期募集） 合格発表');
    expect(result?.startDate).toBe('2026-03-02');
  });

  it('covers 推薦に基づく選抜・学力検査に基づく選抜・第二次募集 tracks', () => {
    const labels = TOKYO_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('推薦に基づく選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('学力検査に基づく選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('定時制第二次募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(TOKYO_EXAM_SCHEDULE, '令和99年度', '推薦に基づく選抜 実施日')).toBeUndefined();
    expect(findScheduleEvent(TOKYO_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
