import { HOKKAIDO_EXAM_SCHEDULE } from './hokkaido';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('HOKKAIDO_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(HOKKAIDO_EXAM_SCHEDULE.prefectureCode).toBe('hokkaido');
    expect(HOKKAIDO_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of HOKKAIDO_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.dokyoi\.pref\.hokkaido\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of HOKKAIDO_EXAM_SCHEDULE.years) {
      for (const event of year.events) {
        expect(isValidDateString(event.startDate)).toBe(true);
      }
    }
  });

  it('finds the exam day, makeup exam, and result date by label (R9)', () => {
    const exam = findScheduleEvent(HOKKAIDO_EXAM_SCHEDULE, '令和9年度（2027年度）', '学力検査日');
    expect(exam?.startDate).toBe('2027-03-03');

    const makeup = findScheduleEvent(HOKKAIDO_EXAM_SCHEDULE, '令和9年度（2027年度）', '追検査日');
    expect(makeup?.startDate).toBe('2027-03-10');

    const result = findScheduleEvent(HOKKAIDO_EXAM_SCHEDULE, '令和9年度（2027年度）', '合格発表日');
    expect(result?.startDate).toBe('2027-03-16');
  });

  it('does not fabricate an application-period event that the source page never stated', () => {
    const events = HOKKAIDO_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(events).not.toContain('出願受付期間');
    expect(events).not.toContain('志願変更期間');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(HOKKAIDO_EXAM_SCHEDULE, '令和99年度', '学力検査日')).toBeUndefined();
    expect(findScheduleEvent(HOKKAIDO_EXAM_SCHEDULE, '令和9年度（2027年度）', '存在しない項目')).toBeUndefined();
  });
});
