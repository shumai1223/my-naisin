import snapshot from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';

describe('2026-r8 exam-system snapshot（T-N1-1 凍結スナップショットの完全性）', () => {
  test('47都道府県すべてが揃っている', () => {
    expect(snapshot.entries).toHaveLength(47);
    expect(snapshot.meta.prefectureCount).toBe(47);
  });

  test('都道府県コードに重複がなく、PREFECTURESの集合と完全一致する(捏造・欠落防止の不変条件)', () => {
    const snapshotCodes = snapshot.entries.map((e) => e.code);
    expect(new Set(snapshotCodes).size).toBe(snapshotCodes.length);
    expect(new Set(snapshotCodes)).toEqual(new Set(PREFECTURES.map((p) => p.code)));
  });

  test('各県にfiscalYearとsourceUrlが存在する(未確認を隠さない・網羅を主張する前提条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBeTruthy();
      expect(entry.sourceUrl).toBeTruthy();
    }
  });

  test('maxScoreは正の数であり、reverseCalcを持つ県はtotalMaxScoreも正の数(値域の不変条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.maxScore).toBeGreaterThan(0);
      if (entry.reverseCalc) {
        expect(entry.reverseCalc.totalMaxScore).toBeGreaterThan(0);
        expect(entry.reverseCalc.examMaxScore).toBeGreaterThan(0);
      }
    }
  });

  test('pdfHashは全件null(未収集を偽らない・N1-1の既知の未完了)', () => {
    expect(snapshot.meta.pdfHashStatus).toBe('not_yet_collected');
    for (const entry of snapshot.entries) {
      expect(entry.pdfHash).toBeNull();
    }
  });

  test('凍結メタデータに生成日・凍結ポリシーが明記されている', () => {
    expect(snapshot.meta.frozenAt).toBe('2026-08-30');
    expect(snapshot.meta.freezePolicy).toContain('書き換え禁止');
  });
});
