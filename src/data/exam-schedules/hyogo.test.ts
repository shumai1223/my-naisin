import { HYOGO_EXAM_SCHEDULE } from './hyogo';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('HYOGO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(HYOGO_EXAM_SCHEDULE.prefectureCode).toBe('hyogo');
    expect(HYOGO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of HYOGO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www2\.hyogo-c\.ed\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of HYOGO_EXAM_SCHEDULE.years) {
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

  it('finds the exam day and result date by label (R9)', () => {
    const exam = findScheduleEvent(HYOGO_EXAM_SCHEDULE, '令和9年度（2027年度）', '学力検査');
    expect(exam?.startDate).toBe('2027-03-11');

    const result = findScheduleEvent(HYOGO_EXAM_SCHEDULE, '令和9年度（2027年度）', '学力検査 合否結果発表');
    expect(result?.startDate).toBe('2027-03-18');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(HYOGO_EXAM_SCHEDULE, '令和99年度', '学力検査')).toBeUndefined();
    expect(findScheduleEvent(HYOGO_EXAM_SCHEDULE, '令和9年度（2027年度）', '存在しない項目')).toBeUndefined();
  });
});
