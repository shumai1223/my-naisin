import { AOMORI_EXAM_SCHEDULE } from './aomori';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('AOMORI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(AOMORI_EXAM_SCHEDULE.prefectureCode).toBe('aomori');
    expect(AOMORI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of AOMORI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.aomori\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of AOMORI_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(AOMORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査等 検査実施日');
    expect(exam?.startDate).toBe('2026-03-05');

    const result = findScheduleEvent(AOMORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者の発表');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers both the main selection and re-recruitment (再募集) tracks', () => {
    const labels = AOMORI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l === '学力検査等 検査実施日')).toBe(true);
    expect(labels.some((l) => l.startsWith('再募集'))).toBe(true);
    expect(labels.some((l) => l === '追検査実施日')).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(AOMORI_EXAM_SCHEDULE, '令和99年度', '学力検査等 検査実施日')).toBeUndefined();
    expect(findScheduleEvent(AOMORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
