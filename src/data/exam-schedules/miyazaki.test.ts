import { MIYAZAKI_EXAM_SCHEDULE } from './miyazaki';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('MIYAZAKI_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(MIYAZAKI_EXAM_SCHEDULE.prefectureCode).toBe('miyazaki');
    expect(MIYAZAKI_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of MIYAZAKI_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.miyazaki\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of MIYAZAKI_EXAM_SCHEDULE.years) {
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
    const exam = findScheduleEvent(MIYAZAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜 学力検査');
    expect(exam?.startDate).toBe('2026-03-04');

    const result = findScheduleEvent(MIYAZAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '合格者発表');
    expect(result?.startDate).toBe('2026-03-17');
  });

  it('covers 推薦連携型等・一般入学者選抜・二次募集 tracks', () => {
    const labels = MIYAZAKI_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('推薦・連携型等'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般入学者選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('二次募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(MIYAZAKI_EXAM_SCHEDULE, '令和99年度', '一般入学者選抜 学力検査')).toBeUndefined();
    expect(findScheduleEvent(MIYAZAKI_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
