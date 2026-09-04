import { TOTTORI_EXAM_SCHEDULE } from './tottori';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('TOTTORI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(TOTTORI_EXAM_SCHEDULE.prefectureCode).toBe('tottori');
    expect(TOTTORI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of TOTTORI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.tottori\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of TOTTORI_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般入学者選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(TOTTORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜 検査');
    expect(exam?.startDate).toBe('2026-03-05');
    expect(exam?.endDate).toBe('2026-03-06');

    const result = findScheduleEvent(TOTTORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜 合格発表');
    expect(result?.startDate).toBe('2026-03-16');
  });

  it('covers 特色入学者選抜・一般入学者選抜・再募集入学者選抜 tracks', () => {
    const labels = TOTTORI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('特色入学者選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般入学者選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('再募集入学者選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(TOTTORI_EXAM_SCHEDULE, '令和99年度', '一般入学者選抜 検査')).toBeUndefined();
    expect(findScheduleEvent(TOTTORI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
