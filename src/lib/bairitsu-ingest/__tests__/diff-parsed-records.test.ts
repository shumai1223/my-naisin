import { diffParsedRecords, formatDiffReport } from '../diff-parsed-records';
import type { ParsedCompetitionRow } from '../parse-table-pdf';

function record(overrides: Partial<ParsedCompetitionRow>): ParsedCompetitionRow {
  return { schoolName: '長野', department: '普通', quota: 100, finalApplicants: 105, finalRate: 1.05, ...overrides };
}

describe('diffParsedRecords', () => {
  it('reports no differences when previous and current are identical', () => {
    const records = [record({}), record({ schoolName: '松本' })];
    const diff = diffParsedRecords(records, records.map((r) => ({ ...r })));
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.unchangedCount).toBe(2);
  });

  it('classifies a record present only in current as added', () => {
    const previous = [record({})];
    const current = [record({}), record({ schoolName: '松本' })];
    const diff = diffParsedRecords(previous, current);
    expect(diff.added).toEqual([record({ schoolName: '松本' })]);
    expect(diff.removed).toEqual([]);
    expect(diff.unchangedCount).toBe(1);
  });

  it('classifies a record present only in previous as removed', () => {
    const previous = [record({}), record({ schoolName: '松本' })];
    const current = [record({})];
    const diff = diffParsedRecords(previous, current);
    expect(diff.removed).toEqual([record({ schoolName: '松本' })]);
    expect(diff.added).toEqual([]);
    expect(diff.unchangedCount).toBe(1);
  });

  it('classifies a record present in both with a numeric field difference as changed, listing each changed field', () => {
    const previous = [record({ quota: 100, finalApplicants: 105, finalRate: 1.05 })];
    const current = [record({ quota: 100, finalApplicants: 110, finalRate: 1.1 })];
    const diff = diffParsedRecords(previous, current);
    expect(diff.changed).toHaveLength(1);
    expect(diff.changed[0].key).toBe('長野/普通');
    expect(diff.changed[0].changes).toEqual([
      { field: 'finalApplicants', from: 105, to: 110 },
      { field: 'finalRate', from: 1.05, to: 1.1 },
    ]);
    expect(diff.unchangedCount).toBe(0);
  });

  it('matches records by schoolName+department, not array order', () => {
    const previous = [record({ schoolName: 'A' }), record({ schoolName: 'B', finalApplicants: 50 })];
    const current = [record({ schoolName: 'B', finalApplicants: 50 }), record({ schoolName: 'A' })];
    const diff = diffParsedRecords(previous, current);
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.unchangedCount).toBe(2);
  });

  it('treats same schoolName with a different department as a distinct record (multi-department schools)', () => {
    const previous = [record({ department: '普通' })];
    const current = [record({ department: '普通' }), record({ department: '理数', quota: 40, finalApplicants: 30, finalRate: 0.75 })];
    const diff = diffParsedRecords(previous, current);
    expect(diff.added).toEqual([record({ department: '理数', quota: 40, finalApplicants: 30, finalRate: 0.75 })]);
    expect(diff.unchangedCount).toBe(1);
  });
});

describe('formatDiffReport', () => {
  it('produces a readable report enumerating added/removed/changed sections only when non-empty', () => {
    const diff = diffParsedRecords(
      [record({ schoolName: '廃校予定' }), record({ schoolName: '変化校', quota: 100, finalApplicants: 100, finalRate: 1.0 })],
      [record({ schoolName: '新設校' }), record({ schoolName: '変化校', quota: 100, finalApplicants: 120, finalRate: 1.2 })],
    );
    const report = formatDiffReport('nagano', diff);
    expect(report).toContain('# nagano 前年度差分');
    expect(report).toContain('新設: 1件 / 廃止: 1件 / 数値変化: 1件 / 変化なし: 0件');
    expect(report).toContain('## 新設');
    expect(report).toContain('新設校');
    expect(report).toContain('## 廃止');
    expect(report).toContain('廃校予定');
    expect(report).toContain('## 数値変化');
    expect(report).toContain('finalApplicants: 100→120');
  });

  it('omits empty sections entirely (no dangling "## 新設" heading with nothing under it)', () => {
    const diff = diffParsedRecords([record({})], [record({})]);
    const report = formatDiffReport('nagano', diff);
    expect(report).not.toContain('## 新設');
    expect(report).not.toContain('## 廃止');
    expect(report).not.toContain('## 数値変化');
    expect(report).toContain('変化なし: 1件');
  });
});
