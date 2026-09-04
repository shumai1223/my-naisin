import { OITA_EXAM_SCHEDULE } from './oita';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('OITA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(OITA_EXAM_SCHEDULE.prefectureCode).toBe('oita');
    expect(OITA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of OITA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.oita\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of OITA_EXAM_SCHEDULE.years) {
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

  it('finds the main (第一次入学者選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(OITA_EXAM_SCHEDULE, '令和8年度（2026年度）', '第一次入学者選抜 検査日');
    expect(exam?.startDate).toBe('2026-03-10');
    expect(exam?.endDate).toBe('2026-03-11');

    const result = findScheduleEvent(OITA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表日');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers 推薦入学者選抜等・第一次入学者選抜・第二次入学者選抜 tracks', () => {
    const labels = OITA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('推薦入学者選抜等'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第一次入学者選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第二次入学者選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(OITA_EXAM_SCHEDULE, '令和99年度', '第一次入学者選抜 検査日')).toBeUndefined();
    expect(findScheduleEvent(OITA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
