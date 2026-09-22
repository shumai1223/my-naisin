import snapshot from '@/data/snapshots/2023-r5/exam-system.json';
import snapshot2024 from '@/data/snapshots/2024-r6/exam-system.json';
import snapshot2025 from '@/data/snapshots/2025-r7/exam-system.json';
import snapshot2026 from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';

describe('2023-r5 exam-system snapshot（T-Y11 Task C 収集中スナップショットの整合性）', () => {
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

  test('各エントリにfiscalYear=2023とsourceUrlが存在する(未確認を隠さない)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBe('2023');
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

  test('全てのsourceUrl/sourceUrl2はhttpsの実URL形式である(手打ちの推測URLを混入させない不変条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.sourceUrl).toMatch(/^https?:\/\//);
      if (entry.sourceUrl2) {
        expect(entry.sourceUrl2).toMatch(/^https?:\/\//);
      }
    }
  });

  test('pdfHashは全件64桁の16進数(SHA-256)を持つ', () => {
    for (const entry of snapshot.entries) {
      expect(entry.pdfHash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  test('ehime: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const e2023 = snapshot.entries.find((e) => e.code === 'ehime')!;
    const e2024 = snapshot2024.entries.find((e) => e.code === 'ehime')!;
    const e2025 = snapshot2025.entries.find((e) => e.code === 'ehime')!;
    const e2026 = snapshot2026.entries.find((e) => e.code === 'ehime')!;
    expect(e2023.maxScore).toBe(e2024.maxScore);
    expect(e2023.maxScore).toBe(e2025.maxScore);
    expect(e2023.maxScore).toBe(e2026.maxScore);
    expect(e2023.gradeMultipliers).toEqual(e2024.gradeMultipliers);
    expect(e2023.reverseCalc?.examMaxScore).toBe(e2026.reverseCalc?.examMaxScore);
  });

  test('kochi: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2023 = snapshot.entries.find((e) => e.code === 'kochi')!;
    const k2024 = snapshot2024.entries.find((e) => e.code === 'kochi')!;
    const k2025 = snapshot2025.entries.find((e) => e.code === 'kochi')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kochi')!;
    expect(k2023.maxScore).toBe(k2024.maxScore);
    expect(k2023.maxScore).toBe(k2025.maxScore);
    expect(k2023.maxScore).toBe(k2026.maxScore);
    expect(k2023.supports10PointScale).toBe(k2026.supports10PointScale);
    expect(k2023.practicalMultiplier).toBe(k2024.practicalMultiplier);
    expect(k2023.gradeMultipliers).toEqual(k2024.gradeMultipliers);
  });

  test('yamanashi: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const y2023 = snapshot.entries.find((e) => e.code === 'yamanashi')!;
    const y2024 = snapshot2024.entries.find((e) => e.code === 'yamanashi')!;
    const y2025 = snapshot2025.entries.find((e) => e.code === 'yamanashi')!;
    const y2026 = snapshot2026.entries.find((e) => e.code === 'yamanashi')!;
    expect(y2023.maxScore).toBe(330);
    expect(y2023.maxScore).toBe(y2024.maxScore);
    expect(y2023.maxScore).toBe(y2025.maxScore);
    expect(y2023.maxScore).toBe(y2026.maxScore);
    expect(y2023.coreMultiplier).toBe(y2024.coreMultiplier);
    expect(y2023.practicalMultiplier).toBe(y2024.practicalMultiplier);
    expect(y2023.gradeMultipliers).toEqual(y2024.gradeMultipliers);
  });

  test('osaka: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2023 = snapshot.entries.find((e) => e.code === 'osaka')!;
    const o2024 = snapshot2024.entries.find((e) => e.code === 'osaka')!;
    const o2025 = snapshot2025.entries.find((e) => e.code === 'osaka')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'osaka')!;
    expect(o2023.maxScore).toBe(450);
    expect(o2023.maxScore).toBe(o2024.maxScore);
    expect(o2023.maxScore).toBe(o2025.maxScore);
    expect(o2023.maxScore).toBe(o2026.maxScore);
    expect(o2023.gradeMultipliers).toEqual(o2024.gradeMultipliers);
    expect(o2023.reverseCalc?.totalMaxScore).toBe(o2026.reverseCalc?.totalMaxScore);
    expect(o2023.reverseCalc?.osakaTypeCount).toBe(o2026.reverseCalc?.osakaTypeCount);
  });

  test('chiba: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const c2023 = snapshot.entries.find((e) => e.code === 'chiba')!;
    const c2024 = snapshot2024.entries.find((e) => e.code === 'chiba')!;
    const c2025 = snapshot2025.entries.find((e) => e.code === 'chiba')!;
    const c2026 = snapshot2026.entries.find((e) => e.code === 'chiba')!;
    expect(c2023.maxScore).toBe(135);
    expect(c2023.maxScore).toBe(c2024.maxScore);
    expect(c2023.maxScore).toBe(c2025.maxScore);
    expect(c2023.maxScore).toBe(c2026.maxScore);
    expect(c2023.gradeMultipliers).toEqual(c2024.gradeMultipliers);
    expect(c2023.reverseCalc).toBeNull();
    expect(c2026.reverseCalc).toBeNull();
  });

  test('tochigi: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const t2023 = snapshot.entries.find((e) => e.code === 'tochigi')!;
    const t2024 = snapshot2024.entries.find((e) => e.code === 'tochigi')!;
    const t2025 = snapshot2025.entries.find((e) => e.code === 'tochigi')!;
    const t2026 = snapshot2026.entries.find((e) => e.code === 'tochigi')!;
    expect(t2023.maxScore).toBe(135);
    expect(t2023.maxScore).toBe(t2024.maxScore);
    expect(t2023.maxScore).toBe(t2025.maxScore);
    expect(t2023.maxScore).toBe(t2026.maxScore);
    expect(t2023.gradeMultipliers).toEqual(t2024.gradeMultipliers);
  });

  test('wakayama: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const w2023 = snapshot.entries.find((e) => e.code === 'wakayama')!;
    const w2024 = snapshot2024.entries.find((e) => e.code === 'wakayama')!;
    const w2025 = snapshot2025.entries.find((e) => e.code === 'wakayama')!;
    const w2026 = snapshot2026.entries.find((e) => e.code === 'wakayama')!;
    expect(w2023.maxScore).toBe(180);
    expect(w2023.maxScore).toBe(w2024.maxScore);
    expect(w2023.maxScore).toBe(w2025.maxScore);
    expect(w2023.maxScore).toBe(w2026.maxScore);
    expect(w2023.gradeMultipliers).toEqual(w2024.gradeMultipliers);
    expect(w2023.reverseCalc?.examMaxScore).toBe(w2026.reverseCalc?.examMaxScore);
  });

  test('ibaraki: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const i2023 = snapshot.entries.find((e) => e.code === 'ibaraki')!;
    const i2024 = snapshot2024.entries.find((e) => e.code === 'ibaraki')!;
    const i2025 = snapshot2025.entries.find((e) => e.code === 'ibaraki')!;
    const i2026 = snapshot2026.entries.find((e) => e.code === 'ibaraki')!;
    expect(i2023.maxScore).toBe(135);
    expect(i2023.maxScore).toBe(i2024.maxScore);
    expect(i2023.maxScore).toBe(i2025.maxScore);
    expect(i2023.maxScore).toBe(i2026.maxScore);
    expect(i2023.gradeMultipliers).toEqual(i2024.gradeMultipliers);
  });
});
