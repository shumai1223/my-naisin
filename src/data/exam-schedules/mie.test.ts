import { MIE_EXAM_SCHEDULE } from './mie';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('MIE_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(MIE_EXAM_SCHEDULE.prefectureCode).toBe('mie');
    expect(MIE_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of MIE_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.mie\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of MIE_EXAM_SCHEDULE.years) {
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

  it('finds the main (後期選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(MIE_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期選抜 検査');
    expect(exam?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(MIE_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(result?.startDate).toBe('2026-03-17');
  });

  it('covers 前期選抜等・後期選抜・追検査再募集 tracks', () => {
    const labels = MIE_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('前期選抜等'))).toBe(true);
    expect(labels.some((l) => l.startsWith('後期選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('追検査・再募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(MIE_EXAM_SCHEDULE, '令和99年度', '後期選抜 検査')).toBeUndefined();
    expect(findScheduleEvent(MIE_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
