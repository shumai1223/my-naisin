import { WAKAYAMA_EXAM_SCHEDULE } from './wakayama';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('WAKAYAMA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(WAKAYAMA_EXAM_SCHEDULE.prefectureCode).toBe('wakayama');
    expect(WAKAYAMA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of WAKAYAMA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.wakayama\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of WAKAYAMA_EXAM_SCHEDULE.years) {
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

  it('finds the main (一般選抜) exam day and result date by label', () => {
    const exam = findScheduleEvent(WAKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜・スポーツ推薦 学力検査');
    expect(exam?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(WAKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般選抜・スポーツ推薦 合格発表');
    expect(result?.startDate).toBe('2026-03-18');
  });

  it('covers 特色化選抜・一般選抜・追募集 tracks', () => {
    const labels = WAKAYAMA_EXAM_SCHEDULE.years[0].events.map((e) => e.label);
    expect(labels.some((l) => l.startsWith('特色化選抜'))).toBe(true);
    expect(labels.some((l) => l.startsWith('一般選抜・スポーツ推薦'))).toBe(true);
    expect(labels.some((l) => l.startsWith('追募集'))).toBe(true);
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(WAKAYAMA_EXAM_SCHEDULE, '令和99年度', '一般選抜・スポーツ推薦 学力検査')).toBeUndefined();
    expect(findScheduleEvent(WAKAYAMA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
