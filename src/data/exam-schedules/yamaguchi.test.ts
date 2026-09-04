import { YAMAGUCHI_EXAM_SCHEDULE } from './yamaguchi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('YAMAGUCHI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(YAMAGUCHI_EXAM_SCHEDULE.prefectureCode).toBe('yamaguchi');
    expect(YAMAGUCHI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of YAMAGUCHI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.yamaguchi\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of YAMAGUCHI_EXAM_SCHEDULE.years) {
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

  it('finds the main (第一次募集) exam day and result date by label', () => {
    const exam = findScheduleEvent(YAMAGUCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '第一次募集 学力検査，面接等');
    expect(exam?.startDate).toBe('2026-03-05');

    const result = findScheduleEvent(YAMAGUCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '第一次募集 合格者発表及び通知');
    expect(result?.startDate).toBe('2026-03-12');
  });

  it('covers all three tracks (特色選抜/第一次募集/第二次募集)', () => {
    const labels = YAMAGUCHI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('特色選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第一次募集'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第二次募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(YAMAGUCHI_EXAM_SCHEDULE, '令和99年度', '第一次募集 学力検査，面接等')).toBeUndefined();
    expect(findScheduleEvent(YAMAGUCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
