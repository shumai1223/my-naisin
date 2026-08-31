import snapshot from '@/data/snapshots/2024-r6/exam-system.json';
import snapshot2025 from '@/data/snapshots/2025-r7/exam-system.json';
import snapshot2026 from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';

describe('2024-r6 exam-system snapshot（T-Y11 Task C 収集中スナップショットの整合性）', () => {
  test('収集済み件数がmeta.collectedCountと一致する(収集中でも数字の水増しを防ぐ)', () => {
    expect(snapshot.entries).toHaveLength(snapshot.meta.collectedCount);
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

  test('unavailableに記録された県はentriesに含まれない(2値化しない・重複記録防止)', () => {
    const entryCodes = new Set(snapshot.entries.map((e) => e.code));
    for (const u of snapshot.meta.unavailable) {
      expect(entryCodes.has(u.code)).toBe(false);
    }
  });

  test('各エントリにfiscalYear=2024とsourceUrlが存在する(未確認を隠さない)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBe('2024');
      expect(entry.sourceUrl).toBeTruthy();
      expect(entry.lastVerified).toBeTruthy();
    }
  });

  test('maxScoreは正の数であり、reverseCalcを持つ場合totalMaxScoreも正の数(値域の不変条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.maxScore).toBeGreaterThan(0);
      if (entry.reverseCalc) {
        expect(entry.reverseCalc.totalMaxScore).toBeGreaterThan(0);
        expect(entry.reverseCalc.examMaxScore).toBeGreaterThan(0);
      }
    }
  });

  test('entriesに含まれる県は全てunavailableと重複していない(まだ収集中でも整合性は保つ)', () => {
    const entryCodes = new Set(snapshot.entries.map((e) => e.code));
    const unavailableCodes = new Set(snapshot.meta.unavailable.map((u) => u.code));
    for (const code of entryCodes) {
      expect(unavailableCodes.has(code)).toBe(false);
    }
  });

  test('osaka: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2024 = snapshot.entries.find((e) => e.code === 'osaka')!;
    const o2025 = snapshot2025.entries.find((e) => e.code === 'osaka')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'osaka')!;
    expect(o2024.maxScore).toBe(o2025.maxScore);
    expect(o2024.maxScore).toBe(o2026.maxScore);
    expect(o2024.gradeMultipliers).toEqual(o2025.gradeMultipliers);
    expect(o2024.gradeMultipliers).toEqual(o2026.gradeMultipliers);
    expect(o2024.reverseCalc?.totalMaxScore).toBe(o2026.reverseCalc?.totalMaxScore);
    expect(o2024.reverseCalc?.osakaTypeCount).toBe(o2026.reverseCalc?.osakaTypeCount);
  });
});
