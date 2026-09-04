import { FUKUI_EXAM_SCHEDULE } from './fukui';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('FUKUI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(FUKUI_EXAM_SCHEDULE.prefectureCode).toBe('fukui');
    expect(FUKUI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of FUKUI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.fukui\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of FUKUI_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(FUKUI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜学力検査');
    expect(exam?.startDate).toBe('2026-02-18');
    expect(exam?.endDate).toBe('2026-02-19');

    const result = findScheduleEvent(FUKUI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜合格者発表');
    expect(result?.startDate).toBe('2026-03-03');
  });

  it('covers both the main selection and 第2次募集 track', () => {
    const labels = FUKUI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l === '一般選抜学力検査')).toBe(true);
    expect(labels.some((l) => l.startsWith('第2次募集'))).toBe(true);
    expect(labels.some((l) => l === '追検査')).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(FUKUI_EXAM_SCHEDULE, '令和99年度', '一般選抜学力検査')).toBeUndefined();
    expect(findScheduleEvent(FUKUI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
