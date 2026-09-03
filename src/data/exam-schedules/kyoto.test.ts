import { KYOTO_EXAM_SCHEDULE } from './kyoto';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('KYOTO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(KYOTO_EXAM_SCHEDULE.prefectureCode).toBe('kyoto');
    expect(KYOTO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of KYOTO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.kyoto-be\.ne\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of KYOTO_EXAM_SCHEDULE.years) {
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

  it('finds the middle-round (中期選抜) exam day and result date, the de facto main selection', () => {
    const exam = findScheduleEvent(KYOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '中期選抜 学力検査等');
    expect(exam?.startDate).toBe('2026-03-06');

    const result = findScheduleEvent(KYOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '中期選抜 合格発表');
    expect(result?.startDate).toBe('2026-03-17');
  });

  it('covers all three selection rounds (前期/中期/後期)', () => {
    const labels = KYOTO_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('前期選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('中期選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('後期選抜'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(KYOTO_EXAM_SCHEDULE, '令和99年度', '中期選抜 学力検査等')).toBeUndefined();
    expect(findScheduleEvent(KYOTO_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
