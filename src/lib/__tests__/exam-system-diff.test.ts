// T-N1-3差分エンジンの単体テスト。
//
// ⚠️ ここで使う「前年度」スナップショットは全て架空のテスト用フィクスチャであり、
// 実在の令和7年度データではない(N1-2で実データ収集するまでsrc/data/snapshots/2025-r7/は存在しない)。
// 実データと誤認されないよう、県コードは実在コード(tokyo/osaka等)を使いつつ値は明示的にテスト専用とする。

import {
  diffExamSystemSnapshots,
  changedEntries,
  unverifiableEntries,
  type ExamSystemSnapshot,
} from '../exam-system-diff';
import { validateDiffEntry } from '../exam-system-diff-types';

function fixtureEntry(overrides: Partial<ExamSystemSnapshot['entries'][number]> = {}) {
  return {
    code: 'tokyo',
    name: '東京都(テスト用架空値)',
    fiscalYear: 2025,
    targetGrades: [3],
    gradeMultipliers: { '3': 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 1000,
    simplifiedCalc: false,
    actualMaxScore: null,
    supports10PointScale: false,
    variantCount: 0,
    reverseCalc: null,
    sourceUrl: 'https://example.jp/r7-test-fixture.pdf',
    ...overrides,
  };
}

function snapshot(entries: ReturnType<typeof fixtureEntry>[]): ExamSystemSnapshot {
  return { meta: { fiscalYearLabel: 'テスト用架空年度' }, entries };
}

describe('diffExamSystemSnapshots（T-N1-3）', () => {
  test('全フィールドが同一なら全て unchanged になる', () => {
    const prev = snapshot([fixtureEntry()]);
    const curr = snapshot([fixtureEntry()]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    expect(diffs.length).toBeGreaterThan(0);
    expect(diffs.every((d) => d.status === 'unchanged')).toBe(true);
  });

  test('maxScoreが変わっていればそのフィールドだけ changed になる（他は unchanged のまま）', () => {
    const prev = snapshot([fixtureEntry({ maxScore: 1000 })]);
    const curr = snapshot([fixtureEntry({ maxScore: 1020, sourceUrl: 'https://example.jp/r8-test-fixture.pdf' })]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    const maxScoreDiff = diffs.find((d) => d.field === 'maxScore');
    expect(maxScoreDiff?.status).toBe('changed');
    expect(maxScoreDiff?.previousValue).toBe(1000);
    expect(maxScoreDiff?.currentValue).toBe(1020);
    const others = diffs.filter((d) => d.field !== 'maxScore');
    expect(others.every((d) => d.status === 'unchanged')).toBe(true);
  });

  test('片方の年度に県のレコードが無ければ unchanged に丸めず unverifiable として返す(2値化しない)', () => {
    const prev = snapshot([fixtureEntry({ code: 'tokyo' })]);
    const curr = snapshot([fixtureEntry({ code: 'tokyo' }), fixtureEntry({ code: 'osaka' })]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    const osakaDiffs = diffs.filter((d) => d.prefectureCode === 'osaka');
    expect(osakaDiffs).toHaveLength(1);
    expect(osakaDiffs[0].status).toBe('unverifiable');
    expect(osakaDiffs[0].unverifiableReason).toBeTruthy();
  });

  test('出典URLが片方の年度で欠けているフィールドは changed/unchanged を確定させず unverifiable にする', () => {
    const prev = snapshot([fixtureEntry({ sourceUrl: null })]);
    const curr = snapshot([fixtureEntry()]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    expect(diffs.every((d) => d.status === 'unverifiable')).toBe(true);
    expect(diffs.every((d) => d.unverifiableReason)).toBe(true);
  });

  test('生成された全DiffEntryがvalidateDiffEntryの不変条件を満たす(取得不能を隠さない・1差分1出典)', () => {
    const prev = snapshot([
      fixtureEntry({ code: 'tokyo', maxScore: 1000 }),
      fixtureEntry({ code: 'osaka', sourceUrl: null }),
    ]);
    const curr = snapshot([
      fixtureEntry({ code: 'tokyo', maxScore: 1020, sourceUrl: 'https://example.jp/r8-test-fixture.pdf' }),
      fixtureEntry({ code: 'osaka' }),
      fixtureEntry({ code: 'kanagawa' }),
    ]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    for (const d of diffs) {
      expect(validateDiffEntry(d)).toEqual([]);
    }
  });

  test('detectionMethodは常にmachine（この関数は自動検出のみ・手動確認は別工程）', () => {
    const prev = snapshot([fixtureEntry()]);
    const curr = snapshot([fixtureEntry({ maxScore: 999, sourceUrl: 'https://example.jp/r8-test-fixture.pdf' })]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    expect(diffs.every((d) => d.detectionMethod === 'machine')).toBe(true);
  });

  test('changedEntries/unverifiableEntriesはstatusで正しくフィルタする', () => {
    const prev = snapshot([
      fixtureEntry({ code: 'tokyo', maxScore: 1000 }),
      fixtureEntry({ code: 'osaka' }),
    ]);
    const curr = snapshot([
      fixtureEntry({ code: 'tokyo', maxScore: 1020, sourceUrl: 'https://example.jp/r8-test-fixture.pdf' }),
      fixtureEntry({ code: 'osaka' }),
      fixtureEntry({ code: 'kanagawa' }),
    ]);
    const diffs = diffExamSystemSnapshots(prev, curr);
    expect(changedEntries(diffs).every((d) => d.status === 'changed')).toBe(true);
    expect(unverifiableEntries(diffs).every((d) => d.status === 'unverifiable')).toBe(true);
    expect(unverifiableEntries(diffs).some((d) => d.prefectureCode === 'kanagawa')).toBe(true);
  });

  test('都道府県が0件同士でも空配列を返す(異常系)', () => {
    expect(diffExamSystemSnapshots(snapshot([]), snapshot([]))).toEqual([]);
  });
});
