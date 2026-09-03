import { NAGANO_EXAM_SCHEDULE } from './nagano';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('NAGANO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(NAGANO_EXAM_SCHEDULE.prefectureCode).toBe('nagano');
    expect(NAGANO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of NAGANO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.nagano\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of NAGANO_EXAM_SCHEDULE.years) {
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

  it('finds the main (後期選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(NAGANO_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期選抜 選抜実施日');
    expect(exam?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(NAGANO_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期選抜 入学予定者の発表');
    expect(result?.startDate).toBe('2026-03-19');
  });

  it('also includes the early (前期選抜) track', () => {
    const early = findScheduleEvent(NAGANO_EXAM_SCHEDULE, '令和8年度（2026年度）', '前期選抜 選抜実施日');
    expect(early?.startDate).toBe('2026-02-09');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(NAGANO_EXAM_SCHEDULE, '令和99年度', '後期選抜 選抜実施日')).toBeUndefined();
    expect(findScheduleEvent(NAGANO_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
