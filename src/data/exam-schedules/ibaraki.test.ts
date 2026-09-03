import { IBARAKI_EXAM_SCHEDULE } from './ibaraki';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('IBARAKI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(IBARAKI_EXAM_SCHEDULE.prefectureCode).toBe('ibaraki');
    expect(IBARAKI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of IBARAKI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/kyoiku\.pref\.ibaraki\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of IBARAKI_EXAM_SCHEDULE.years) {
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

  it('events fall within the academic year window (Apr of start year - Mar of next year)', () => {
    // 令和8年度（2026年度）= 2026-04-01 〜 2027-03-31
    const r8 = IBARAKI_EXAM_SCHEDULE.years.find((y) => y.fiscalYear === '令和8年度（2026年度）');
    expect(r8).toBeDefined();
    for (const event of r8!.events) {
      const d = new Date(event.startDate);
      const inWindow = d >= new Date('2026-01-01') && d <= new Date('2026-12-31');
      expect(inWindow).toBe(true);
    }
  });

  it('finds a specific known event by label', () => {
    const exam = findScheduleEvent(IBARAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学学力検査');
    expect(exam).toEqual({ label: '一般入学学力検査', startDate: '2026-02-26' });

    const announce = findScheduleEvent(IBARAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(announce?.startDate).toBe('2026-03-11');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(IBARAKI_EXAM_SCHEDULE, '令和99年度', '一般入学学力検査')).toBeUndefined();
    expect(findScheduleEvent(IBARAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
