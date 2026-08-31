import snapshot from '@/data/snapshots/2024-r6/exam-system.json';
import snapshot2025 from '@/data/snapshots/2025-r7/exam-system.json';
import snapshot2026 from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';
import { diffExamSystemSnapshots } from '../exam-system-diff';

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

  test('chiba: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const c2024 = snapshot.entries.find((e) => e.code === 'chiba')!;
    const c2025 = snapshot2025.entries.find((e) => e.code === 'chiba')!;
    const c2026 = snapshot2026.entries.find((e) => e.code === 'chiba')!;
    expect(c2024.maxScore).toBe(c2025.maxScore);
    expect(c2024.maxScore).toBe(c2026.maxScore);
    expect(c2024.gradeMultipliers).toEqual(c2025.gradeMultipliers);
    expect(c2024.gradeMultipliers).toEqual(c2026.gradeMultipliers);
    expect(c2024.reverseCalc).toBeNull();
    expect(c2026.reverseCalc).toBeNull();
  });

  test('tochigi: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const t2024 = snapshot.entries.find((e) => e.code === 'tochigi')!;
    const t2025 = snapshot2025.entries.find((e) => e.code === 'tochigi')!;
    const t2026 = snapshot2026.entries.find((e) => e.code === 'tochigi')!;
    expect(t2024.maxScore).toBe(t2025.maxScore);
    expect(t2024.maxScore).toBe(t2026.maxScore);
    expect(t2024.gradeMultipliers).toEqual(t2025.gradeMultipliers);
    expect(t2024.gradeMultipliers).toEqual(t2026.gradeMultipliers);
  });

  test('ehime: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const e2024 = snapshot.entries.find((e) => e.code === 'ehime')!;
    const e2025 = snapshot2025.entries.find((e) => e.code === 'ehime')!;
    const e2026 = snapshot2026.entries.find((e) => e.code === 'ehime')!;
    expect(e2024.maxScore).toBe(e2025.maxScore);
    expect(e2024.maxScore).toBe(e2026.maxScore);
    expect(e2024.gradeMultipliers).toEqual(e2025.gradeMultipliers);
    expect(e2024.reverseCalc?.examMaxScore).toBe(e2026.reverseCalc?.examMaxScore);
  });

  test('kochi: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2024 = snapshot.entries.find((e) => e.code === 'kochi')!;
    const k2025 = snapshot2025.entries.find((e) => e.code === 'kochi')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kochi')!;
    expect(k2024.maxScore).toBe(k2025.maxScore);
    expect(k2024.maxScore).toBe(k2026.maxScore);
    expect(k2024.supports10PointScale).toBe(k2026.supports10PointScale);
    expect(k2024.gradeMultipliers).toEqual(k2025.gradeMultipliers);
    expect(k2024.practicalMultiplier).toBe(k2026.practicalMultiplier);
  });

  test('kagoshima: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2024 = snapshot.entries.find((e) => e.code === 'kagoshima')!;
    const k2025 = snapshot2025.entries.find((e) => e.code === 'kagoshima')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kagoshima')!;
    expect(k2024.maxScore).toBe(k2025.maxScore);
    expect(k2024.maxScore).toBe(k2026.maxScore);
    expect(k2024.coreMultiplier).toBe(k2025.coreMultiplier);
    expect(k2024.practicalMultiplier).toBe(k2025.practicalMultiplier);
    expect(k2024.gradeMultipliers).toEqual(k2026.gradeMultipliers);
  });

  test('aomori: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const a2024 = snapshot.entries.find((e) => e.code === 'aomori')!;
    const a2025 = snapshot2025.entries.find((e) => e.code === 'aomori')!;
    const a2026 = snapshot2026.entries.find((e) => e.code === 'aomori')!;
    expect(a2024.maxScore).toBe(a2025.maxScore);
    expect(a2024.maxScore).toBe(a2026.maxScore);
    expect(a2024.gradeMultipliers).toEqual(a2026.gradeMultipliers);
  });

  test('iwate: 令和6→7年度で圧縮先の点数(actualMaxScore)が実際に変わっている(N1-2/N1-3のnaraに続く2件目の実測「変更あり」ケース)', () => {
    const i2024 = snapshot.entries.find((e) => e.code === 'iwate')!;
    const i2025 = snapshot2025.entries.find((e) => e.code === 'iwate')!;
    // 生の評定の重み付け・満点(660点)自体は令和6〜8年度で不変
    expect(i2024.maxScore).toBe(660);
    expect(i2024.maxScore).toBe(i2025.maxScore);
    expect(i2024.gradeMultipliers).toEqual(i2025.gradeMultipliers);
    expect(i2024.coreMultiplier).toBe(i2025.coreMultiplier);
    expect(i2024.practicalMultiplier).toBe(i2025.practicalMultiplier);
    // 圧縮先だけが令和6年度(440点)→令和7年度(500点)で変わっている
    expect(i2024.actualMaxScore).toBe(440);
    expect(i2025.actualMaxScore).toBe(500);
    expect(i2024.actualMaxScore).not.toBe(i2025.actualMaxScore);
    // 実データでdiffExamSystemSnapshots()を実行し、actualMaxScoreがchangedと判定されることを確認
    const diffs = diffExamSystemSnapshots(snapshot, snapshot2025);
    const iwateDiffs = diffs.filter((d) => d.prefectureCode === 'iwate');
    const actualMaxScoreDiff = iwateDiffs.find((d) => d.field === 'actualMaxScore')!;
    expect(actualMaxScoreDiff.status).toBe('changed');
  });

  test('tokushima: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const t2024 = snapshot.entries.find((e) => e.code === 'tokushima')!;
    const t2025 = snapshot2025.entries.find((e) => e.code === 'tokushima')!;
    const t2026 = snapshot2026.entries.find((e) => e.code === 'tokushima')!;
    expect(t2024.maxScore).toBe(t2025.maxScore);
    expect(t2024.maxScore).toBe(t2026.maxScore);
    expect(t2024.coreMultiplier).toBe(t2025.coreMultiplier);
    expect(t2024.practicalMultiplier).toBe(t2025.practicalMultiplier);
    expect(t2024.gradeMultipliers).toEqual(t2026.gradeMultipliers);
  });

  test('hiroshima: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const h2024 = snapshot.entries.find((e) => e.code === 'hiroshima')!;
    const h2025 = snapshot2025.entries.find((e) => e.code === 'hiroshima')!;
    const h2026 = snapshot2026.entries.find((e) => e.code === 'hiroshima')!;
    expect(h2024.maxScore).toBe(h2025.maxScore);
    expect(h2024.maxScore).toBe(h2026.maxScore);
    expect(h2024.gradeMultipliers).toEqual(h2025.gradeMultipliers);
    expect(h2024.coreMultiplier).toBe(h2026.coreMultiplier);
    expect(h2024.practicalMultiplier).toBe(h2026.practicalMultiplier);
  });

  test('okayama: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2024 = snapshot.entries.find((e) => e.code === 'okayama')!;
    const o2025 = snapshot2025.entries.find((e) => e.code === 'okayama')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'okayama')!;
    expect(o2024.maxScore).toBe(o2025.maxScore);
    expect(o2024.maxScore).toBe(o2026.maxScore);
    expect(o2024.actualMaxScore).toBe(o2025.actualMaxScore);
    expect(o2024.simplifiedCalc).toBe(o2026.simplifiedCalc);
    expect(o2024.practicalMultiplier).toBe(o2026.practicalMultiplier);
  });

  test('yamagata: 2025-r7・2026-r8と2024-r6で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const y2024 = snapshot.entries.find((e) => e.code === 'yamagata')!;
    const y2025 = snapshot2025.entries.find((e) => e.code === 'yamagata')!;
    const y2026 = snapshot2026.entries.find((e) => e.code === 'yamagata')!;
    expect(y2024.maxScore).toBe(y2025.maxScore);
    expect(y2024.maxScore).toBe(y2026.maxScore);
    expect(y2024.gradeMultipliers).toEqual(y2025.gradeMultipliers);
    expect(y2024.gradeMultipliers).toEqual(y2026.gradeMultipliers);
    expect(y2024.targetGrades).toEqual([3]);
  });

  test('全てのsourceUrl/sourceUrl2はhttpsの実URL形式である(手打ちの推測URLを混入させない不変条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.sourceUrl).toMatch(/^https?:\/\//);
      if (entry.sourceUrl2) {
        expect(entry.sourceUrl2).toMatch(/^https?:\/\//);
      }
    }
  });
});
