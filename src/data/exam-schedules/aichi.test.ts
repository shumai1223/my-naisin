import { AICHI_EXAM_SCHEDULE } from './aichi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('AICHI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(AICHI_EXAM_SCHEDULE.prefectureCode).toBe('aichi');
    expect(AICHI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of AICHI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.aichi\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of AICHI_EXAM_SCHEDULE.years) {
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

  it('finds the general-selection exam day and result date by label', () => {
    const exam = findScheduleEvent(AICHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 学力検査実施期日');
    expect(exam?.startDate).toBe('2026-02-25');

    const result = findScheduleEvent(AICHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜 合格発表期日');
    expect(result?.startDate).toBe('2026-03-10');
  });

  it('also includes the recommendation-selection (推薦選抜) track as a separate set of events', () => {
    const recExam = findScheduleEvent(AICHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '推薦選抜 合格発表期日');
    expect(recExam?.startDate).toBe('2026-02-09');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(AICHI_EXAM_SCHEDULE, '令和99年度', '一般選抜 学力検査実施期日')).toBeUndefined();
    expect(findScheduleEvent(AICHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
