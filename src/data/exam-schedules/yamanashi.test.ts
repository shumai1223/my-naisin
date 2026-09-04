import { YAMANASHI_EXAM_SCHEDULE } from './yamanashi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('YAMANASHI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(YAMANASHI_EXAM_SCHEDULE.prefectureCode).toBe('yamanashi');
    expect(YAMANASHI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of YAMANASHI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.yamanashi\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of YAMANASHI_EXAM_SCHEDULE.years) {
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

  it('finds the main (後期募集) exam day and result date by label', () => {
    const exam = findScheduleEvent(YAMANASHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '後期募集 学力検査（全日制）');
    expect(exam?.startDate).toBe('2026-03-04');
    expect(exam?.endDate).toBe('2026-03-05');

    const result = findScheduleEvent(YAMANASHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '入学許可予定者発表');
    expect(result?.startDate).toBe('2026-03-12');
  });

  it('covers both 前期募集 and 後期募集 tracks', () => {
    const labels = YAMANASHI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('前期募集'))).toBe(true);
    expect(labels.some((l) => l.startsWith('後期募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(YAMANASHI_EXAM_SCHEDULE, '令和99年度', '入学許可予定者発表')).toBeUndefined();
    expect(findScheduleEvent(YAMANASHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
