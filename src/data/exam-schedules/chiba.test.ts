import { CHIBA_EXAM_SCHEDULE } from './chiba';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('CHIBA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(CHIBA_EXAM_SCHEDULE.prefectureCode).toBe('chiba');
    expect(CHIBA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of CHIBA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.chiba\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of CHIBA_EXAM_SCHEDULE.years) {
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

  it('finds the exam day range and announcement date by label', () => {
    const exam = findScheduleEvent(CHIBA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査（本検査）実施日');
    expect(exam).toEqual({ label: '学力検査（本検査）実施日', startDate: '2026-02-17', endDate: '2026-02-18' });

    const announce = findScheduleEvent(CHIBA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格発表');
    expect(announce?.startDate).toBe('2026-03-03');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(CHIBA_EXAM_SCHEDULE, '令和99年度', '合格発表')).toBeUndefined();
    expect(findScheduleEvent(CHIBA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
