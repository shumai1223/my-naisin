import snapshot from '@/data/snapshots/2025-r7/exam-system.json';
import snapshot2026 from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';

describe('2025-r7 exam-system snapshot（N1-2 収集中スナップショットの整合性）', () => {
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

  test('各エントリにfiscalYear=2025とsourceUrlが存在する(未確認を隠さない)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBe('2025');
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

  test('tokyo: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const t2025 = snapshot.entries.find((e) => e.code === 'tokyo')!;
    const t2026 = snapshot2026.entries.find((e) => e.code === 'tokyo')!;
    expect(t2025.maxScore).toBe(t2026.maxScore);
    expect(t2025.practicalMultiplier).toBe(t2026.practicalMultiplier);
    expect(t2025.coreMultiplier).toBe(t2026.coreMultiplier);
    expect(t2025.reverseCalc?.totalMaxScore).toBe(t2026.reverseCalc?.totalMaxScore);
    expect(t2025.reverseCalc?.examMaxScore).toBe(t2026.reverseCalc?.examMaxScore);
  });

  test('kanagawa: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2025 = snapshot.entries.find((e) => e.code === 'kanagawa')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kanagawa')!;
    expect(k2025.maxScore).toBe(k2026.maxScore);
    expect(k2025.gradeMultipliers).toEqual(k2026.gradeMultipliers);
    expect(k2025.coreMultiplier).toBe(k2026.coreMultiplier);
    expect(k2025.practicalMultiplier).toBe(k2026.practicalMultiplier);
  });

  test('aichi: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const a2025 = snapshot.entries.find((e) => e.code === 'aichi')!;
    const a2026 = snapshot2026.entries.find((e) => e.code === 'aichi')!;
    expect(a2025.maxScore).toBe(a2026.maxScore);
    expect(a2025.gradeMultipliers).toEqual(a2026.gradeMultipliers);
    expect(a2025.coreMultiplier).toBe(a2026.coreMultiplier);
    expect(a2025.practicalMultiplier).toBe(a2026.practicalMultiplier);
  });

  test('osaka: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2025 = snapshot.entries.find((e) => e.code === 'osaka')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'osaka')!;
    expect(o2025.maxScore).toBe(o2026.maxScore);
    expect(o2025.gradeMultipliers).toEqual(o2026.gradeMultipliers);
    expect(o2025.reverseCalc?.totalMaxScore).toBe(o2026.reverseCalc?.totalMaxScore);
    expect(o2025.reverseCalc?.osakaTypeCount).toBe(o2026.reverseCalc?.osakaTypeCount);
  });
});
