import { FUKUOKA_EXAM_SCHEDULE } from './fukuoka';
import { isValidDateString, findScheduleEvent } from '@/lib/exam-schedule';

describe('FUKUOKA_EXAM_SCHEDULE', () => {
  it('has at least one fiscal year with events', () => {
    expect(FUKUOKA_EXAM_SCHEDULE.prefectureCode).toBe('fukuoka');
    expect(FUKUOKA_EXAM_SCHEDULE.years.length).toBeGreaterThan(0);
    for (const year of FUKUOKA_EXAM_SCHEDULE.years) {
      expect(year.events.length).toBeGreaterThan(0);
      expect(year.sourceUrl).toMatch(/^https:\/\/www\.pref\.fukuoka\.lg\.jp\//);
    }
  });

  it('every event has valid YYYY-MM-DD dates', () => {
    for (const year of FUKUOKA_EXAM_SCHEDULE.years) {
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

  it('finds the general-selection exam day and result date by label', () => {
    const exam = findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜 学力検査');
    expect(exam?.startDate).toBe('2026-03-10');

    const result = findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '一般入学者選抜 合格発表');
    expect(result?.startDate).toBe('2026-03-19');
  });

  it('the recommendation track has a separate 選考結果通知 before the shared 合格発表 date', () => {
    const notice = findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '推薦・特色化・連携型選抜 選考結果通知');
    expect(notice?.startDate).toBe('2026-02-09');

    const announce = findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '推薦・特色化・連携型選抜 合格発表');
    expect(announce?.startDate).toBe('2026-03-19');
  });

  it('returns undefined for unknown fiscal year or label', () => {
    expect(findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和99年度', '一般入学者選抜 学力検査')).toBeUndefined();
    expect(findScheduleEvent(FUKUOKA_EXAM_SCHEDULE, '令和8年度（2026年度）', '存在しない項目')).toBeUndefined();
  });
});
