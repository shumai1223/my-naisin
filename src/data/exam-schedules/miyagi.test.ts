import { MIYAGI_EXAM_SCHEDULE } from './miyagi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('MIYAGI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(MIYAGI_EXAM_SCHEDULE.prefectureCode).toBe('miyagi');
    expect(MIYAGI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of MIYAGI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.miyagi\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of MIYAGI_EXAM_SCHEDULE.years) {
      for (const event of year.events) {
        expect(isValidDateString(event.startDate)).toBe(true);
      }
    }
  });

  it('finds the exam day, makeup exam, and result date by label', () => {
    const exam = findScheduleEvent(MIYAGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '実施日');
    expect(exam?.startDate).toBe('2026-03-04');

    const makeup = findScheduleEvent(MIYAGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '追試験日');
    expect(makeup?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(MIYAGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格発表日');
    expect(result?.startDate).toBe('2026-03-16');
  });

  it('does not fabricate an application-period event that secondary sources disagreed on', () => {
    const labels = MIYAGI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels).not.toContain('出願期間');
    expect(labels).not.toContain('志願変更期間');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(MIYAGI_EXAM_SCHEDULE, '令和99年度', '実施日')).toBeUndefined();
    expect(findScheduleEvent(MIYAGI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
