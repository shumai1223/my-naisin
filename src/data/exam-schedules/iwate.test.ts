import { IWATE_EXAM_SCHEDULE } from './iwate';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('IWATE_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(IWATE_EXAM_SCHEDULE.prefectureCode).toBe('iwate');
    expect(IWATE_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of IWATE_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.iwate\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of IWATE_EXAM_SCHEDULE.years) {
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

  it('finds the main two-day exam window and result date by label', () => {
    const exam = findScheduleEvent(IWATE_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次募集（一般入試・特色入試） 本検査');
    expect(exam).toEqual(
      expect.objectContaining({ startDate: '2026-03-04', endDate: '2026-03-05' })
    );

    const result = findScheduleEvent(IWATE_EXAM_SCHEDULE, '令和8年度（2026年度）', '一次募集（一般入試・特色入試） 合格者発表');
    expect(result?.startDate).toBe('2026-03-16');
  });

  it('also includes the secondary recruitment (二次募集) track', () => {
    const secondary = findScheduleEvent(IWATE_EXAM_SCHEDULE, '令和8年度（2026年度）', '二次募集 検査日');
    expect(secondary?.startDate).toBe('2026-03-24');
  });

  it('does not fabricate an application-period event the source page never stated', () => {
    const labels = IWATE_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.every((l) => !l.includes('出願') && !l.includes('志願変更'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(IWATE_EXAM_SCHEDULE, '令和99年度', '一次募集（一般入試・特色入試） 本検査')).toBeUndefined();
    expect(findScheduleEvent(IWATE_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
