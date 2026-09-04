import { SHIGA_EXAM_SCHEDULE } from './shiga';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('SHIGA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(SHIGA_EXAM_SCHEDULE.prefectureCode).toBe('shiga');
    expect(SHIGA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of SHIGA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.shiga\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of SHIGA_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般型選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(SHIGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次募集 一般型選抜（学力検査）');
    expect(exam?.startDate).toBe('2026-02-25');

    const result = findScheduleEvent(SHIGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次募集 入学許可予定者の発表');
    expect(result?.startDate).toBe('2026-03-09');
  });

  it('covers both 一次募集 and 二次募集 tracks', () => {
    const labels = SHIGA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('一次募集'))).toBe(true);
    expect(labels.some((l) => l.startsWith('二次募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(SHIGA_EXAM_SCHEDULE, '令和99年度', '一次募集 一般型選抜（学力検査）')).toBeUndefined();
    expect(findScheduleEvent(SHIGA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
