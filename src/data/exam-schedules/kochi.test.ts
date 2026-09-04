import { KOCHI_EXAM_SCHEDULE } from './kochi';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('KOCHI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(KOCHI_EXAM_SCHEDULE.prefectureCode).toBe('kochi');
    expect(KOCHI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of KOCHI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.kochi\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of KOCHI_EXAM_SCHEDULE.years) {
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

  it('finds the main (B日程) exam day and result date by label', () => {
    const exam = findScheduleEvent(KOCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', 'B日程 検査実施日');
    expect(exam?.startDate).toBe('2026-03-18');

    const result = findScheduleEvent(KOCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', 'B日程 合格発表');
    expect(result?.startDate).toBe('2026-03-23');
  });

  it('covers all four tracks (フロンティア/A日程/B日程/C日程)', () => {
    const labels = KOCHI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('こうちフロンティア募集'))).toBe(true);
    expect(labels.some((l) => l.startsWith('A日程'))).toBe(true);
    expect(labels.some((l) => l.startsWith('B日程'))).toBe(true);
    expect(labels.some((l) => l.startsWith('C日程'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(KOCHI_EXAM_SCHEDULE, '令和99年度', 'B日程 検査実施日')).toBeUndefined();
    expect(findScheduleEvent(KOCHI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
