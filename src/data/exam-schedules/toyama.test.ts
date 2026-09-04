import { TOYAMA_EXAM_SCHEDULE } from './toyama';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('TOYAMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(TOYAMA_EXAM_SCHEDULE.prefectureCode).toBe('toyama');
    expect(TOYAMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of TOYAMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.toyama\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of TOYAMA_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般) exam day and result date by label', () => {
    const exam = findScheduleEvent(TOYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般 学力検査実施期日');
    expect(exam?.startDate).toBe('2026-03-05');
    expect(exam?.endDate).toBe('2026-03-06');

    const result = findScheduleEvent(TOYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般 合格者の発表');
    expect(result?.startDate).toBe('2026-03-13');
  });

  it('covers 推薦・一般・第2次 tracks', () => {
    const labels = TOYAMA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('推薦'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般'))).toBe(true);
    expect(labels.some((l) => l.startsWith('第2次'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(TOYAMA_EXAM_SCHEDULE, '令和99年度', '一般 学力検査実施期日')).toBeUndefined();
    expect(findScheduleEvent(TOYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
