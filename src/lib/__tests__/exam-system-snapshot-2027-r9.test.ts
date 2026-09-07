import snapshot from '@/data/snapshots/2027-r9/exam-system.json';
import snapshot2026 from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';
import { diffExamSystemSnapshots } from '../exam-system-diff';

describe('2027-r9 exam-system snapshot（T-Y11F §5順序#1 収集中スナップショットの整合性）', () => {
  test('収集済み件数がmeta.collectedCountと一致する(収集中でも数字の水増しを防ぐ)', () => {
    expect(snapshot.entries).toHaveLength(snapshot.meta.collectedCount);
    // R9実施要項はまだ一部県しか公表されていないため、47件に届かなくて正常
    expect(snapshot.entries.length).toBeLessThanOrEqual(47);
  });

  test('都道府県コードに重複がなく、全てPREFECTURESの集合の部分集合(捏造防止の不変条件)', () => {
    const codes = snapshot.entries.map((e) => e.code);
    expect(new Set(codes).size).toBe(codes.length);
    const validCodes = new Set(PREFECTURES.map((p) => p.code));
    for (const code of codes) {
      expect(validCodes.has(code)).toBe(true);
    }
  });

  test('各エントリにfiscalYear=2027とsourceUrlが存在する(未確認を隠さない)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBe('2027');
      expect(entry.sourceUrl).toBeTruthy();
      expect(entry.lastVerified).toBeTruthy();
      expect(entry.diffFromCurrentYear).toBeTruthy();
    }
  });

  test('saitama: 2026-r8と2027-r9で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const s2027 = snapshot.entries.find((e) => e.code === 'saitama')!;
    const s2026 = snapshot2026.entries.find((e) => e.code === 'saitama')!;
    expect(s2027.maxScore).toBe(s2026.maxScore);
    expect(s2027.gradeMultipliers).toEqual(s2026.gradeMultipliers);
    expect(s2027.coreMultiplier).toBe(s2026.coreMultiplier);
    expect(s2027.practicalMultiplier).toBe(s2026.practicalMultiplier);
    expect(s2027.reverseCalc).toEqual(s2026.reverseCalc);

    // 実データでdiffExamSystemSnapshots()を実行し、比較対象フィールドが全てunchangedと判定されることを確認
    const diffs = diffExamSystemSnapshots(snapshot2026, snapshot);
    const saitamaDiffs = diffs.filter((d) => d.prefectureCode === 'saitama');
    expect(saitamaDiffs.length).toBeGreaterThan(0);
    for (const d of saitamaDiffs) {
      expect(d.status).toBe('unchanged');
    }
  });

  test('osaka: 2026-r8と2027-r9で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2027 = snapshot.entries.find((e) => e.code === 'osaka')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'osaka')!;
    expect(o2027.maxScore).toBe(o2026.maxScore);
    expect(o2027.gradeMultipliers).toEqual(o2026.gradeMultipliers);
    expect(o2027.coreMultiplier).toBe(o2026.coreMultiplier);
    expect(o2027.practicalMultiplier).toBe(o2026.practicalMultiplier);
    expect(o2027.reverseCalc).toEqual(o2026.reverseCalc);

    const diffs = diffExamSystemSnapshots(snapshot2026, snapshot);
    const osakaDiffs = diffs.filter((d) => d.prefectureCode === 'osaka');
    expect(osakaDiffs.length).toBeGreaterThan(0);
    for (const d of osakaDiffs) {
      expect(d.status).toBe('unchanged');
    }
  });

  test('kanagawa: 2026-r8と2027-r9で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2027 = snapshot.entries.find((e) => e.code === 'kanagawa')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kanagawa')!;
    expect(k2027.maxScore).toBe(k2026.maxScore);
    expect(k2027.gradeMultipliers).toEqual(k2026.gradeMultipliers);
    expect(k2027.coreMultiplier).toBe(k2026.coreMultiplier);
    expect(k2027.practicalMultiplier).toBe(k2026.practicalMultiplier);
    expect(k2027.reverseCalc).toBeNull();

    const diffs = diffExamSystemSnapshots(snapshot2026, snapshot);
    const kanagawaDiffs = diffs.filter((d) => d.prefectureCode === 'kanagawa');
    expect(kanagawaDiffs.length).toBeGreaterThan(0);
    for (const d of kanagawaDiffs) {
      expect(d.status).toBe('unchanged');
    }
  });

  test('nagano: 2026-r8と2027-r9で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const n2027 = snapshot.entries.find((e) => e.code === 'nagano')!;
    const n2026 = snapshot2026.entries.find((e) => e.code === 'nagano')!;
    expect(n2027.maxScore).toBe(n2026.maxScore);
    expect(n2027.gradeMultipliers).toEqual(n2026.gradeMultipliers);
    expect(n2027.coreMultiplier).toBe(n2026.coreMultiplier);
    expect(n2027.practicalMultiplier).toBe(n2026.practicalMultiplier);
    expect(n2027.reverseCalc).toBeNull();

    const diffs = diffExamSystemSnapshots(snapshot2026, snapshot);
    const naganoDiffs = diffs.filter((d) => d.prefectureCode === 'nagano');
    expect(naganoDiffs.length).toBeGreaterThan(0);
    for (const d of naganoDiffs) {
      expect(d.status).toBe('unchanged');
    }
  });

  test('47県未満のためmeta.notYetPublishedNoteが「まだ公表されていない」旨を明記している(取得不能との2値化防止)', () => {
    expect(snapshot.meta.notYetPublishedNote).toContain('まだ公表されていない');
  });
});
