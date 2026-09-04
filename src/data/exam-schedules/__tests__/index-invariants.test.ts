import { EXAM_SCHEDULE_BY_PREFECTURE, EXAM_SCHEDULE_PREFECTURE_CODES } from '../index';
import { isValidDateString } from '@/lib/exam-schedule';
import { PREFECTURES } from '@/lib/prefectures';

/**
 * T-Y12（入試日程DB）の横断不変条件テスト。個別県ファイルのテストは各県固有の固定値を
 * 検証するが、47都道府県すべてに共通する構造的な整合性を機械的にチェックする横断テストが
 * 無ければ、新県追加時にテスト自体を書き忘れても無検査で通ってしまう
 * （competition-rates/index-invariants.test.tsと同じ設計思想）。
 */
describe('入試日程DB index 横断不変条件', () => {
  it('マップのキーとprefectureCodeが一致する', () => {
    for (const [code, file] of Object.entries(EXAM_SCHEDULE_BY_PREFECTURE)) {
      expect(file?.prefectureCode).toBe(code);
    }
  });

  it('全47都道府県コードがPREFECTURESに実在するコードである', () => {
    const validCodes = new Set(PREFECTURES.map((p) => p.code));
    for (const code of EXAM_SCHEDULE_PREFECTURE_CODES) {
      expect(validCodes.has(code)).toBe(true);
    }
  });

  it('47都道府県すべてが収録されている（段階1の完了状態を固定するリグレッションガード）', () => {
    expect(EXAM_SCHEDULE_PREFECTURE_CODES.length).toBe(47);
  });

  it('全ファイルで少なくとも1つの年度・1件以上のイベントを収録している', () => {
    for (const file of Object.values(EXAM_SCHEDULE_BY_PREFECTURE)) {
      expect(file!.years.length).toBeGreaterThan(0);
      for (const year of file!.years) {
        expect(year.events.length).toBeGreaterThan(0);
      }
    }
  });

  it('全イベントのstartDate/endDateがYYYY-MM-DD形式で、endDateがある場合はstartDate以降である', () => {
    for (const file of Object.values(EXAM_SCHEDULE_BY_PREFECTURE)) {
      for (const year of file!.years) {
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
    }
  });

  it('sourceUrl/docTitle/fiscalYear/fetchedAtが全ファイル全年度で空文字でない(1データ点1出典の機械的担保)', () => {
    for (const file of Object.values(EXAM_SCHEDULE_BY_PREFECTURE)) {
      for (const year of file!.years) {
        expect(year.sourceUrl.length).toBeGreaterThan(0);
        expect(year.docTitle.length).toBeGreaterThan(0);
        expect(year.fiscalYear.length).toBeGreaterThan(0);
        expect(year.fetchedAt.length).toBeGreaterThan(0);
        expect(year.sourceUrl.startsWith('https://')).toBe(true);
      }
    }
  });

  it('同一年度内でlabelの重複が無い(全県横断)', () => {
    for (const file of Object.values(EXAM_SCHEDULE_BY_PREFECTURE)) {
      for (const year of file!.years) {
        const seen = new Set<string>();
        const dupes: string[] = [];
        for (const event of year.events) {
          if (seen.has(event.label)) dupes.push(event.label);
          seen.add(event.label);
        }
        expect(dupes).toEqual([]);
      }
    }
  });

  it('収録合計を記録する', () => {
    const totalEvents = Object.values(EXAM_SCHEDULE_BY_PREFECTURE).reduce(
      (sum, f) => sum + f!.years.reduce((s, y) => s + y.events.length, 0),
      0
    );
    // eslint-disable-next-line no-console
    console.log(`入試日程DB 収録合計: ${EXAM_SCHEDULE_PREFECTURE_CODES.length}県 / ${totalEvents}イベント`);
    expect(totalEvents).toBeGreaterThan(0);
  });
});
