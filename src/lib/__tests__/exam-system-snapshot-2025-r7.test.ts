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

  test('saitama: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const s2025 = snapshot.entries.find((e) => e.code === 'saitama')!;
    const s2026 = snapshot2026.entries.find((e) => e.code === 'saitama')!;
    expect(s2025.maxScore).toBe(s2026.maxScore);
    expect(s2025.gradeMultipliers).toEqual(s2026.gradeMultipliers);
    expect(s2025.reverseCalc?.examMaxScore).toBe(s2026.reverseCalc?.examMaxScore);
  });

  test('chiba: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const c2025 = snapshot.entries.find((e) => e.code === 'chiba')!;
    const c2026 = snapshot2026.entries.find((e) => e.code === 'chiba')!;
    expect(c2025.maxScore).toBe(c2026.maxScore);
    expect(c2025.gradeMultipliers).toEqual(c2026.gradeMultipliers);
    expect(c2025.reverseCalc).toBeNull();
    expect(c2026.reverseCalc).toBeNull();
  });

  test('hyogo: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const h2025 = snapshot.entries.find((e) => e.code === 'hyogo')!;
    const h2026 = snapshot2026.entries.find((e) => e.code === 'hyogo')!;
    expect(h2025.maxScore).toBe(h2026.maxScore);
    expect(h2025.gradeMultipliers).toEqual(h2026.gradeMultipliers);
    expect(h2025.coreMultiplier).toBe(h2026.coreMultiplier);
    expect(h2025.practicalMultiplier).toBe(h2026.practicalMultiplier);
  });

  test('fukuoka: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const f2025 = snapshot.entries.find((e) => e.code === 'fukuoka')!;
    const f2026 = snapshot2026.entries.find((e) => e.code === 'fukuoka')!;
    expect(f2025.maxScore).toBe(f2026.maxScore);
    expect(f2025.gradeMultipliers).toEqual(f2026.gradeMultipliers);
    expect(f2025.reverseCalc?.examMaxScore).toBe(f2026.reverseCalc?.examMaxScore);
  });

  test('hokkaido: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const h2025 = snapshot.entries.find((e) => e.code === 'hokkaido')!;
    const h2026 = snapshot2026.entries.find((e) => e.code === 'hokkaido')!;
    expect(h2025.maxScore).toBe(h2026.maxScore);
    expect(h2025.gradeMultipliers).toEqual(h2026.gradeMultipliers);
  });

  test('aomori: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const a2025 = snapshot.entries.find((e) => e.code === 'aomori')!;
    const a2026 = snapshot2026.entries.find((e) => e.code === 'aomori')!;
    expect(a2025.maxScore).toBe(a2026.maxScore);
    expect(a2025.gradeMultipliers).toEqual(a2026.gradeMultipliers);
  });

  test('iwate: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」・660→500圧縮方式は令和7年度が開始年)', () => {
    const i2025 = snapshot.entries.find((e) => e.code === 'iwate')!;
    const i2026 = snapshot2026.entries.find((e) => e.code === 'iwate')!;
    expect(i2025.maxScore).toBe(i2026.maxScore);
    expect(i2025.actualMaxScore).toBe(i2026.actualMaxScore);
    expect(i2025.gradeMultipliers).toEqual(i2026.gradeMultipliers);
    expect(i2025.coreMultiplier).toBe(i2026.coreMultiplier);
    expect(i2025.practicalMultiplier).toBe(i2026.practicalMultiplier);
  });

  test('miyagi: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const m2025 = snapshot.entries.find((e) => e.code === 'miyagi')!;
    const m2026 = snapshot2026.entries.find((e) => e.code === 'miyagi')!;
    expect(m2025.maxScore).toBe(m2026.maxScore);
    expect(m2025.gradeMultipliers).toEqual(m2026.gradeMultipliers);
    expect(m2025.coreMultiplier).toBe(m2026.coreMultiplier);
    expect(m2025.practicalMultiplier).toBe(m2026.practicalMultiplier);
  });

  test('akita: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const a2025 = snapshot.entries.find((e) => e.code === 'akita')!;
    const a2026 = snapshot2026.entries.find((e) => e.code === 'akita')!;
    expect(a2025.maxScore).toBe(a2026.maxScore);
    expect(a2025.gradeMultipliers).toEqual(a2026.gradeMultipliers);
    expect(a2025.coreMultiplier).toBe(a2026.coreMultiplier);
    expect(a2025.practicalMultiplier).toBe(a2026.practicalMultiplier);
  });

  test('yamagata: 2026-r8と2025-r7で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const y2025 = snapshot.entries.find((e) => e.code === 'yamagata')!;
    const y2026 = snapshot2026.entries.find((e) => e.code === 'yamagata')!;
    expect(y2025.maxScore).toBe(y2026.maxScore);
    expect(y2025.gradeMultipliers).toEqual(y2026.gradeMultipliers);
  });

  test('47県のうち大市場8県(tokyo/kanagawa/aichi/osaka/saitama/chiba/hyogo/fukuoka)が揃っている', () => {
    const majorMarketCodes = [
      'tokyo', 'kanagawa', 'aichi', 'osaka', 'saitama', 'chiba', 'hyogo', 'fukuoka',
    ];
    const collectedCodes = new Set(snapshot.entries.map((e) => e.code));
    for (const code of majorMarketCodes) {
      expect(collectedCodes.has(code)).toBe(true);
    }
  });
});
