import { YAMAGATA_EXAM_SCHEDULE } from './yamagata';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('YAMAGATA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(YAMAGATA_EXAM_SCHEDULE.prefectureCode).toBe('yamagata');
    expect(YAMAGATA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of YAMAGATA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.yamagata\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of YAMAGATA_EXAM_SCHEDULE.years) {
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

  it('finds the main (後期一般選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(YAMAGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期（一般）選抜 本検査（学力検査）');
    expect(exam?.startDate).toBe('2026-03-07');

    const result = findScheduleEvent(YAMAGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格発表');
    expect(result?.startDate).toBe('2026-03-17');
  });

  it('covers both 前期(特色)選抜 and 後期(一般)選抜 tracks', () => {
    const labels = YAMAGATA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('前期（特色）選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('後期（一般）選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(YAMAGATA_EXAM_SCHEDULE, '令和99年度', '合格発表')).toBeUndefined();
    expect(findScheduleEvent(YAMAGATA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
