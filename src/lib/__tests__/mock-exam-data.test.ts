/**
 * 地域模試の一般公開情報(MOCK_EXAMS)の不変条件テスト。
 * 純粋な静的データファイルだが、key重複や日付形式の崩れは
 * /hensachi/moshi/ichiran・/hensachi/moshi/nittei の表示崩れに直結するため検知する。
 */
import { MOCK_EXAMS } from '../mock-exam-data';
import { PREFECTURES } from '../prefectures';

describe('MOCK_EXAMS 不変条件', () => {
  const prefectureNames = new Set(PREFECTURES.map((p) => p.name));

  it('少なくとも1件以上のデータを持つ', () => {
    expect(MOCK_EXAMS.length).toBeGreaterThan(0);
  });

  it('keyは全件ユニーク', () => {
    const keys = MOCK_EXAMS.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s は name/operator/summary/scheduleSourceUrl/scheduleVerifiedDateが全て空文字でない',
    (_key, exam) => {
      expect(exam.name.trim().length).toBeGreaterThan(0);
      expect(exam.operator.trim().length).toBeGreaterThan(0);
      expect(exam.summary.trim().length).toBeGreaterThan(0);
      expect(exam.scheduleSourceUrl.trim().length).toBeGreaterThan(0);
      expect(exam.scheduleVerifiedDate.trim().length).toBeGreaterThan(0);
    }
  );

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s のscheduleSourceUrlはhttps URL',
    (_key, exam) => {
      expect(exam.scheduleSourceUrl).toMatch(/^https:\/\//);
    }
  );

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s のscheduleVerifiedDateはYYYY-MM-DD形式の実在する日付',
    (_key, exam) => {
      expect(exam.scheduleVerifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const d = new Date(exam.scheduleVerifiedDate + 'T00:00:00Z');
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  );

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s のregionsは非空配列で全て実在する都道府県名',
    (_key, exam) => {
      expect(exam.regions.length).toBeGreaterThan(0);
      for (const region of exam.regions) {
        expect(prefectureNames.has(region)).toBe(true);
      }
    }
  );

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s はgradeが空文字でない',
    (_key, exam) => {
      expect(exam.grade.trim().length).toBeGreaterThan(0);
    }
  );

  it.each(MOCK_EXAMS.map((e) => [e.key, e] as const))(
    '%s はscheduleRounds(実在日程)かscheduleNote(未確認の理由説明)のどちらか一方は必ず持つ(日付の断定禁止という設計方針の直接検証)',
    (_key, exam) => {
      const hasRounds = !!exam.scheduleRounds && exam.scheduleRounds.length > 0;
      const hasNote = !!exam.scheduleNote && exam.scheduleNote.trim().length > 0;
      expect(hasRounds || hasNote).toBe(true);
    }
  );

  it('scheduleRoundsを持つ全エントリで、各roundのround/dateが空文字でない', () => {
    for (const exam of MOCK_EXAMS) {
      if (!exam.scheduleRounds) continue;
      for (const round of exam.scheduleRounds) {
        expect(round.round.trim().length).toBeGreaterThan(0);
        expect(round.date.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
