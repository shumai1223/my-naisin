import { OSAKA_EXAM_SCHEDULE } from './osaka';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('OSAKA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(OSAKA_EXAM_SCHEDULE.prefectureCode).toBe('osaka');
    expect(OSAKA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of OSAKA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.osaka\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of OSAKA_EXAM_SCHEDULE.years) {
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

  it('finds the exam day and announcement date by label', () => {
    const exam = findScheduleEvent(OSAKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査');
    expect(exam?.startDate).toBe('2026-03-11');

    const announce = findScheduleEvent(OSAKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格発表');
    expect(announce?.startDate).toBe('2026-03-19');
  });

  it('the application registration window starts in the prior calendar year (Dec)', () => {
    const registration = findScheduleEvent(
      OSAKA_EXAM_SCHEDULE,
      '令和8年度（2026年度）',
      '志願者による出願登録期間（志願者情報等の入力）'
    );
    expect(registration?.startDate).toBe('2025-12-08');
    expect(registration?.endDate).toBe('2026-03-06');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(OSAKA_EXAM_SCHEDULE, '令和99年度', '学力検査')).toBeUndefined();
    expect(findScheduleEvent(OSAKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
