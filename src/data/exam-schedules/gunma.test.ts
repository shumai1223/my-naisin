import { GUNMA_EXAM_SCHEDULE } from './gunma';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('GUNMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(GUNMA_EXAM_SCHEDULE.prefectureCode).toBe('gunma');
    expect(GUNMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of GUNMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.gunma\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of GUNMA_EXAM_SCHEDULE.years) {
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

  it('finds the two-day main exam window and result date by label', () => {
    const exam = findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '学力検査等実施（本検査）');
    expect(exam).toEqual({ label: '学力検査等実施（本検査）', startDate: '2026-02-19', endDate: '2026-02-20' });

    const result = findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(result?.startDate).toBe('2026-03-04');
  });

  it('has two separate application-change windows (unusual)', () => {
    const first = findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '志願先変更期間（第1回）');
    const second = findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '志願先変更期間（第2回）');
    expect(first?.startDate).toBe('2026-02-03');
    expect(second?.startDate).toBe('2026-02-06');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和99年度', '学力検査等実施（本検査）')).toBeUndefined();
    expect(findScheduleEvent(GUNMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
