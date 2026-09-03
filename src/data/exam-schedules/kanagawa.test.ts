import { KANAGAWA_EXAM_SCHEDULE } from './kanagawa';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('KANAGAWA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(KANAGAWA_EXAM_SCHEDULE.prefectureCode).toBe('kanagawa');
    expect(KANAGAWA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of KANAGAWA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.kanagawa\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of KANAGAWA_EXAM_SCHEDULE.years) {
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

  it('finds the exam day, makeup exam, and result date by label (R9)', () => {
    const exam = findScheduleEvent(KANAGAWA_EXAM_SCHEDULE, '令和9年度（2027年度）', '共通検査（学力検査等）実施');
    expect(exam?.startDate).toBe('2027-02-16');

    const makeup = findScheduleEvent(KANAGAWA_EXAM_SCHEDULE, '令和9年度（2027年度）', '追検査実施');
    expect(makeup?.startDate).toBe('2027-02-22');

    const result = findScheduleEvent(KANAGAWA_EXAM_SCHEDULE, '令和9年度（2027年度）', '合格者発表');
    expect(result?.startDate).toBe('2027-02-26');
  });

  it('this prefecture publishes the following fiscal year earlier than others (R9, not R8)', () => {
    const fiscalYears = KANAGAWA_EXAM_SCHEDULE.years.map((y) => y.fiscalYear);
    expect(fiscalYears).toContain('令和9年度（2027年度）');
    expect(fiscalYears).not.toContain('令和8年度（2026年度）');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(KANAGAWA_EXAM_SCHEDULE, '令和99年度', '合格者発表')).toBeUndefined();
    expect(findScheduleEvent(KANAGAWA_EXAM_SCHEDULE, '令和9年度（2027年度）', '存在しない項目')).toBeUndefined();
  });
});
