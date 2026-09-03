import { OKAYAMA_EXAM_SCHEDULE } from './okayama';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('OKAYAMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(OKAYAMA_EXAM_SCHEDULE.prefectureCode).toBe('okayama');
    expect(OKAYAMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of OKAYAMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.okayama\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of OKAYAMA_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(OKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜（全日制・定時制） 学力検査');
    expect(exam?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(OKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜（全日制・定時制） 合格者の発表');
    expect(result?.startDate).toBe('2026-03-18');
  });

  it('special-selection results are announced on the same day as the general track', () => {
    const special = findScheduleEvent(OKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '特別入学者選抜 合格者の発表');
    expect(special?.startDate).toBe('2026-03-18');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(OKAYAMA_EXAM_SCHEDULE, '令和99年度', '一般入学者選抜（全日制・定時制） 学力検査')).toBeUndefined();
    expect(findScheduleEvent(OKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
