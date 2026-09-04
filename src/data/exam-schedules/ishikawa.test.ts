import { ISHIKAWA_EXAM_SCHEDULE } from './ishikawa';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('ISHIKAWA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(ISHIKAWA_EXAM_SCHEDULE.prefectureCode).toBe('ishikawa');
    expect(ISHIKAWA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of ISHIKAWA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.ishikawa\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of ISHIKAWA_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般入学) exam day and result date by label', () => {
    const exam = findScheduleEvent(ISHIKAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学 学力検査等');
    expect(exam?.startDate).toBe('2026-03-10');
    expect(exam?.endDate).toBe('2026-03-11');

    const result = findScheduleEvent(ISHIKAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者の発表');
    expect(result?.startDate).toBe('2026-03-18');
  });

  it('covers both 一般入学 and 推薦入学 tracks', () => {
    const labels = ISHIKAWA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('一般入学'))).toBe(true);
    expect(labels.some((l) => l.startsWith('推薦入学'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(ISHIKAWA_EXAM_SCHEDULE, '令和99年度', '一般入学 学力検査等')).toBeUndefined();
    expect(findScheduleEvent(ISHIKAWA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
