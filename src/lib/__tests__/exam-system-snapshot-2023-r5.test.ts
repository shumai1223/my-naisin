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

  test('mie: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const m2023 = snapshot.entries.find((e) => e.code === 'mie')!;
    const m2024 = snapshot2024.entries.find((e) => e.code === 'mie')!;
    const m2025 = snapshot2025.entries.find((e) => e.code === 'mie')!;
    const m2026 = snapshot2026.entries.find((e) => e.code === 'mie')!;
    expect(m2023.maxScore).toBe(45);
    expect(m2023.maxScore).toBe(m2024.maxScore);
    expect(m2023.maxScore).toBe(m2025.maxScore);
    expect(m2023.maxScore).toBe(m2026.maxScore);
    expect(m2023.targetGrades).toEqual([3]);
    expect(m2023.gradeMultipliers).toEqual(m2024.gradeMultipliers);
  });

  test('nara: 2024-r6・2025-r7と2023-r5で制度の核となる数値が一致する(R7→R8間で変更があったため2026-r8とは比較しない)', () => {
    const n2023 = snapshot.entries.find((e) => e.code === 'nara')!;
    const n2024 = snapshot2024.entries.find((e) => e.code === 'nara')!;
    const n2025 = snapshot2025.entries.find((e) => e.code === 'nara')!;
    expect(n2023.maxScore).toBe(135);
    expect(n2023.maxScore).toBe(n2024.maxScore);
    expect(n2023.maxScore).toBe(n2025.maxScore);
    expect(n2023.targetGrades).toEqual([2, 3]);
    expect(n2023.gradeMultipliers).toEqual(n2024.gradeMultipliers);
    expect(n2023.gradeMultipliers).toEqual(n2025.gradeMultipliers);
  });

  test('gunma: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const g2023 = snapshot.entries.find((e) => e.code === 'gunma')!;
    const g2024 = snapshot2024.entries.find((e) => e.code === 'gunma')!;
    const g2025 = snapshot2025.entries.find((e) => e.code === 'gunma')!;
    const g2026 = snapshot2026.entries.find((e) => e.code === 'gunma')!;
    expect(g2023.maxScore).toBe(135);
    expect(g2023.maxScore).toBe(g2024.maxScore);
    expect(g2023.maxScore).toBe(g2025.maxScore);
    expect(g2023.maxScore).toBe(g2026.maxScore);
    expect(g2023.gradeMultipliers).toEqual(g2024.gradeMultipliers);
  });

  test('kyoto: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const k2023 = snapshot.entries.find((e) => e.code === 'kyoto')!;
    const k2024 = snapshot2024.entries.find((e) => e.code === 'kyoto')!;
    const k2025 = snapshot2025.entries.find((e) => e.code === 'kyoto')!;
    const k2026 = snapshot2026.entries.find((e) => e.code === 'kyoto')!;
    expect(k2023.maxScore).toBe(195);
    expect(k2023.maxScore).toBe(k2024.maxScore);
    expect(k2023.maxScore).toBe(k2025.maxScore);
    expect(k2023.maxScore).toBe(k2026.maxScore);
    expect(k2023.practicalMultiplier).toBe(2);
    expect(k2023.gradeMultipliers).toEqual(k2024.gradeMultipliers);
  });

  test('fukushima: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const f2023 = snapshot.entries.find((e) => e.code === 'fukushima')!;
    const f2024 = snapshot2024.entries.find((e) => e.code === 'fukushima')!;
    const f2025 = snapshot2025.entries.find((e) => e.code === 'fukushima')!;
    const f2026 = snapshot2026.entries.find((e) => e.code === 'fukushima')!;
    expect(f2023.maxScore).toBe(195);
    expect(f2023.maxScore).toBe(f2024.maxScore);
    expect(f2023.maxScore).toBe(f2025.maxScore);
    expect(f2023.maxScore).toBe(f2026.maxScore);
    expect(f2023.practicalMultiplier).toBe(2);
    expect(f2023.gradeMultipliers).toEqual(f2024.gradeMultipliers);
  });

  test('okayama: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const o2023 = snapshot.entries.find((e) => e.code === 'okayama')!;
    const o2024 = snapshot2024.entries.find((e) => e.code === 'okayama')!;
    const o2025 = snapshot2025.entries.find((e) => e.code === 'okayama')!;
    const o2026 = snapshot2026.entries.find((e) => e.code === 'okayama')!;
    expect(o2023.maxScore).toBe(195);
    expect(o2023.maxScore).toBe(o2024.maxScore);
    expect(o2023.maxScore).toBe(o2025.maxScore);
    expect(o2023.maxScore).toBe(o2026.maxScore);
    expect(o2023.simplifiedCalc).toBe(true);
    expect(o2023.actualMaxScore).toBe(200);
    expect(o2023.reverseCalc?.totalMaxScore).toBe(o2026.reverseCalc?.totalMaxScore);
    expect(o2023.gradeMultipliers).toEqual(o2024.gradeMultipliers);
  });

  test('hiroshima: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const h2023 = snapshot.entries.find((e) => e.code === 'hiroshima')!;
    const h2024 = snapshot2024.entries.find((e) => e.code === 'hiroshima')!;
    const h2025 = snapshot2025.entries.find((e) => e.code === 'hiroshima')!;
    const h2026 = snapshot2026.entries.find((e) => e.code === 'hiroshima')!;
    expect(h2023.maxScore).toBe(225);
    expect(h2023.maxScore).toBe(h2024.maxScore);
    expect(h2023.maxScore).toBe(h2025.maxScore);
    expect(h2023.maxScore).toBe(h2026.maxScore);
    expect(h2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 3 });
    expect(h2023.gradeMultipliers).toEqual(h2024.gradeMultipliers);
  });

  test('kumamoto: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const km2023 = snapshot.entries.find((e) => e.code === 'kumamoto')!;
    const km2024 = snapshot2024.entries.find((e) => e.code === 'kumamoto')!;
    const km2025 = snapshot2025.entries.find((e) => e.code === 'kumamoto')!;
    const km2026 = snapshot2026.entries.find((e) => e.code === 'kumamoto')!;
    expect(km2023.maxScore).toBe(180);
    expect(km2023.maxScore).toBe(km2024.maxScore);
    expect(km2023.maxScore).toBe(km2025.maxScore);
    expect(km2023.maxScore).toBe(km2026.maxScore);
    expect(km2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 2 });
    expect(km2023.gradeMultipliers).toEqual(km2024.gradeMultipliers);
  });

  test('yamagata: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const yg2023 = snapshot.entries.find((e) => e.code === 'yamagata')!;
    const yg2024 = snapshot2024.entries.find((e) => e.code === 'yamagata')!;
    const yg2025 = snapshot2025.entries.find((e) => e.code === 'yamagata')!;
    const yg2026 = snapshot2026.entries.find((e) => e.code === 'yamagata')!;
    expect(yg2023.maxScore).toBe(45);
    expect(yg2023.maxScore).toBe(yg2024.maxScore);
    expect(yg2023.maxScore).toBe(yg2025.maxScore);
    expect(yg2023.maxScore).toBe(yg2026.maxScore);
    expect(yg2023.targetGrades).toEqual([3]);
    expect(yg2023.gradeMultipliers).toEqual(yg2024.gradeMultipliers);
  });

  test('shizuoka: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const sz2023 = snapshot.entries.find((e) => e.code === 'shizuoka')!;
    const sz2024 = snapshot2024.entries.find((e) => e.code === 'shizuoka')!;
    const sz2025 = snapshot2025.entries.find((e) => e.code === 'shizuoka')!;
    const sz2026 = snapshot2026.entries.find((e) => e.code === 'shizuoka')!;
    expect(sz2023.maxScore).toBe(45);
    expect(sz2023.maxScore).toBe(sz2024.maxScore);
    expect(sz2023.maxScore).toBe(sz2025.maxScore);
    expect(sz2023.maxScore).toBe(sz2026.maxScore);
    expect(sz2023.targetGrades).toEqual([3]);
    expect(sz2023.gradeMultipliers).toEqual(sz2024.gradeMultipliers);
  });

  test('gifu: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const gf2023 = snapshot.entries.find((e) => e.code === 'gifu')!;
    const gf2024 = snapshot2024.entries.find((e) => e.code === 'gifu')!;
    const gf2025 = snapshot2025.entries.find((e) => e.code === 'gifu')!;
    const gf2026 = snapshot2026.entries.find((e) => e.code === 'gifu')!;
    expect(gf2023.maxScore).toBe(180);
    expect(gf2023.maxScore).toBe(gf2024.maxScore);
    expect(gf2023.maxScore).toBe(gf2025.maxScore);
    expect(gf2023.maxScore).toBe(gf2026.maxScore);
    expect(gf2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 2 });
    expect(gf2023.gradeMultipliers).toEqual(gf2024.gradeMultipliers);
  });

  test('ishikawa: 2024-r6・2026-r8と2023-r5で制度の核となる数値が一致する(2025-r7は未収集のため比較対象外・caveatあり・構造一致で推定)', () => {
    const ik2023 = snapshot.entries.find((e) => e.code === 'ishikawa')!;
    const ik2024 = snapshot2024.entries.find((e) => e.code === 'ishikawa')!;
    const ik2026 = snapshot2026.entries.find((e) => e.code === 'ishikawa')!;
    expect(snapshot2025.entries.find((e) => e.code === 'ishikawa')).toBeUndefined();
    expect(ik2023.maxScore).toBe(180);
    expect(ik2023.maxScore).toBe(ik2024.maxScore);
    expect(ik2023.maxScore).toBe(ik2026.maxScore);
    expect(ik2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 2 });
    expect(ik2023.gradeMultipliers).toEqual(ik2024.gradeMultipliers);
  });

  test('kagawa: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(caveatあり・構造一致で推定)', () => {
    const kg2023 = snapshot.entries.find((e) => e.code === 'kagawa')!;
    const kg2024 = snapshot2024.entries.find((e) => e.code === 'kagawa')!;
    const kg2025 = snapshot2025.entries.find((e) => e.code === 'kagawa')!;
    const kg2026 = snapshot2026.entries.find((e) => e.code === 'kagawa')!;
    expect(kg2023.maxScore).toBe(390);
    expect(kg2023.maxScore).toBe(kg2024.maxScore);
    expect(kg2023.maxScore).toBe(kg2025.maxScore);
    expect(kg2023.maxScore).toBe(kg2026.maxScore);
    expect(kg2023.simplifiedCalc).toBe(true);
    expect(kg2023.actualMaxScore).toBe(220);
    expect(kg2023.coreMultiplier).toBe(2);
    expect(kg2023.practicalMultiplier).toBe(4);
  });

  test('hyogo: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const hy2023 = snapshot.entries.find((e) => e.code === 'hyogo')!;
    const hy2024 = snapshot2024.entries.find((e) => e.code === 'hyogo')!;
    const hy2025 = snapshot2025.entries.find((e) => e.code === 'hyogo')!;
    const hy2026 = snapshot2026.entries.find((e) => e.code === 'hyogo')!;
    expect(hy2023.maxScore).toBe(250);
    expect(hy2023.maxScore).toBe(hy2024.maxScore);
    expect(hy2023.maxScore).toBe(hy2025.maxScore);
    expect(hy2023.maxScore).toBe(hy2026.maxScore);
    expect(hy2023.targetGrades).toEqual([3]);
    expect(hy2023.coreMultiplier).toBe(4);
    expect(hy2023.practicalMultiplier).toBe(7.5);
  });

  test('fukuoka: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const fo2023 = snapshot.entries.find((e) => e.code === 'fukuoka')!;
    const fo2024 = snapshot2024.entries.find((e) => e.code === 'fukuoka')!;
    const fo2025 = snapshot2025.entries.find((e) => e.code === 'fukuoka')!;
    const fo2026 = snapshot2026.entries.find((e) => e.code === 'fukuoka')!;
    expect(fo2023.maxScore).toBe(45);
    expect(fo2023.maxScore).toBe(fo2024.maxScore);
    expect(fo2023.maxScore).toBe(fo2025.maxScore);
    expect(fo2023.maxScore).toBe(fo2026.maxScore);
    expect(fo2023.targetGrades).toEqual([3]);
    expect(fo2023.gradeMultipliers).toEqual(fo2024.gradeMultipliers);
  });

  test('yamaguchi: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(caveatあり・条文一致)', () => {
    const yg2023 = snapshot.entries.find((e) => e.code === 'yamaguchi')!;
    const yg2024 = snapshot2024.entries.find((e) => e.code === 'yamaguchi')!;
    const yg2025 = snapshot2025.entries.find((e) => e.code === 'yamaguchi')!;
    const yg2026 = snapshot2026.entries.find((e) => e.code === 'yamaguchi')!;
    expect(yg2023.maxScore).toBe(135);
    expect(yg2023.maxScore).toBe(yg2024.maxScore);
    expect(yg2023.maxScore).toBe(yg2025.maxScore);
    expect(yg2023.maxScore).toBe(yg2026.maxScore);
    expect(yg2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 1 });
    expect(yg2023.gradeMultipliers).toEqual(yg2024.gradeMultipliers);
  });

  test('shiga: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(caveatあり・間接確認)', () => {
    const sg2023 = snapshot.entries.find((e) => e.code === 'shiga')!;
    const sg2024 = snapshot2024.entries.find((e) => e.code === 'shiga')!;
    const sg2025 = snapshot2025.entries.find((e) => e.code === 'shiga')!;
    const sg2026 = snapshot2026.entries.find((e) => e.code === 'shiga')!;
    expect(sg2023.maxScore).toBe(135);
    expect(sg2023.maxScore).toBe(sg2024.maxScore);
    expect(sg2023.maxScore).toBe(sg2025.maxScore);
    expect(sg2023.maxScore).toBe(sg2026.maxScore);
    expect(sg2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 1 });
    expect(sg2023.gradeMultipliers).toEqual(sg2024.gradeMultipliers);
  });

  test('nagano: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const na2023 = snapshot.entries.find((e) => e.code === 'nagano')!;
    const na2024 = snapshot2024.entries.find((e) => e.code === 'nagano')!;
    const na2025 = snapshot2025.entries.find((e) => e.code === 'nagano')!;
    const na2026 = snapshot2026.entries.find((e) => e.code === 'nagano')!;
    expect(na2023.maxScore).toBe(45);
    expect(na2023.maxScore).toBe(na2024.maxScore);
    expect(na2023.maxScore).toBe(na2025.maxScore);
    expect(na2023.maxScore).toBe(na2026.maxScore);
    expect(na2023.targetGrades).toEqual([3]);
    expect(na2023.gradeMultipliers).toEqual(na2024.gradeMultipliers);
  });

  test('shimane: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const sm2023 = snapshot.entries.find((e) => e.code === 'shimane')!;
    const sm2024 = snapshot2024.entries.find((e) => e.code === 'shimane')!;
    const sm2025 = snapshot2025.entries.find((e) => e.code === 'shimane')!;
    const sm2026 = snapshot2026.entries.find((e) => e.code === 'shimane')!;
    expect(sm2023.maxScore).toBe(180);
    expect(sm2023.maxScore).toBe(sm2024.maxScore);
    expect(sm2023.maxScore).toBe(sm2025.maxScore);
    expect(sm2023.maxScore).toBe(sm2026.maxScore);
    expect(sm2023.targetGrades).toEqual([1, 2, 3]);
    expect(sm2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 2 });
    expect(sm2023.gradeMultipliers).toEqual(sm2024.gradeMultipliers);
    expect(sm2023.reverseCalc?.defaultRatio).toEqual(sm2024.reverseCalc?.defaultRatio);
  });

  test('saitama: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」・大市場県で初のWayback完全復旧確認)', () => {
    const st2023 = snapshot.entries.find((e) => e.code === 'saitama')!;
    const st2024 = snapshot2024.entries.find((e) => e.code === 'saitama')!;
    const st2025 = snapshot2025.entries.find((e) => e.code === 'saitama')!;
    const st2026 = snapshot2026.entries.find((e) => e.code === 'saitama')!;
    expect(st2023.maxScore).toBe(180);
    expect(st2023.maxScore).toBe(st2024.maxScore);
    expect(st2023.maxScore).toBe(st2025.maxScore);
    expect(st2023.maxScore).toBe(st2026.maxScore);
    expect(st2023.targetGrades).toEqual([1, 2, 3]);
    expect(st2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 2 });
    expect(st2023.gradeMultipliers).toEqual(st2024.gradeMultipliers);
    expect(st2023.reverseCalc?.calcType).toBe('saitama');
    expect(st2023.reverseCalc?.defaultRatio).toEqual(st2024.reverseCalc?.defaultRatio);
  });

  test('kanagawa: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」・2件目の大市場県Wayback完全復旧)', () => {
    const kn2023 = snapshot.entries.find((e) => e.code === 'kanagawa')!;
    const kn2024 = snapshot2024.entries.find((e) => e.code === 'kanagawa')!;
    const kn2025 = snapshot2025.entries.find((e) => e.code === 'kanagawa')!;
    const kn2026 = snapshot2026.entries.find((e) => e.code === 'kanagawa')!;
    expect(kn2023.maxScore).toBe(135);
    expect(kn2023.maxScore).toBe(kn2024.maxScore);
    expect(kn2023.maxScore).toBe(kn2025.maxScore);
    expect(kn2023.maxScore).toBe(kn2026.maxScore);
    expect(kn2023.targetGrades).toEqual([2, 3]);
    expect(kn2023.gradeMultipliers).toEqual({ '1': 0, '2': 1, '3': 2 });
    expect(kn2023.gradeMultipliers).toEqual(kn2024.gradeMultipliers);
    expect(kn2023.reverseCalc).toBeNull();
  });

  test('oita: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(caveatあり・学校裁量制の代表値)', () => {
    const oi2023 = snapshot.entries.find((e) => e.code === 'oita')!;
    const oi2024 = snapshot2024.entries.find((e) => e.code === 'oita')!;
    const oi2025 = snapshot2025.entries.find((e) => e.code === 'oita')!;
    const oi2026 = snapshot2026.entries.find((e) => e.code === 'oita')!;
    expect(oi2023.maxScore).toBe(520);
    expect(oi2023.maxScore).toBe(oi2024.maxScore);
    expect(oi2023.maxScore).toBe(oi2025.maxScore);
    expect(oi2023.maxScore).toBe(oi2026.maxScore);
    expect(oi2023.simplifiedCalc).toBe(true);
    expect(oi2023.actualMaxScore).toBe(260);
    expect(oi2023.coreMultiplier).toBe(2);
    expect(oi2023.practicalMultiplier).toBe(4);
    expect(oi2023.gradeMultipliers).toEqual(oi2024.gradeMultipliers);
  });

  test('miyazaki: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(caveatあり・消去法による間接確認)', () => {
    const mz2023 = snapshot.entries.find((e) => e.code === 'miyazaki')!;
    const mz2024 = snapshot2024.entries.find((e) => e.code === 'miyazaki')!;
    const mz2025 = snapshot2025.entries.find((e) => e.code === 'miyazaki')!;
    const mz2026 = snapshot2026.entries.find((e) => e.code === 'miyazaki')!;
    expect(mz2023.maxScore).toBe(135);
    expect(mz2023.maxScore).toBe(mz2024.maxScore);
    expect(mz2023.maxScore).toBe(mz2025.maxScore);
    expect(mz2023.maxScore).toBe(mz2026.maxScore);
    expect(mz2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 1 });
    expect(mz2023.gradeMultipliers).toEqual(mz2024.gradeMultipliers);
  });

  test('toyama: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const ty2023 = snapshot.entries.find((e) => e.code === 'toyama')!;
    const ty2024 = snapshot2024.entries.find((e) => e.code === 'toyama')!;
    const ty2025 = snapshot2025.entries.find((e) => e.code === 'toyama')!;
    const ty2026 = snapshot2026.entries.find((e) => e.code === 'toyama')!;
    expect(ty2023.maxScore).toBe(135);
    expect(ty2023.maxScore).toBe(ty2024.maxScore);
    expect(ty2023.maxScore).toBe(ty2025.maxScore);
    expect(ty2023.maxScore).toBe(ty2026.maxScore);
    expect(ty2023.targetGrades).toEqual([2, 3]);
    expect(ty2023.gradeMultipliers).toEqual({ '1': 0, '2': 1, '3': 2 });
    expect(ty2023.gradeMultipliers).toEqual(ty2024.gradeMultipliers);
    expect(ty2023.reverseCalc).toBeNull();
  });

  test('tokushima: 2024-r6・2025-r7・2026-r8と2023-r5で制度の核となる数値が一致する(実測で確認済みの「変更なし」)', () => {
    const tk2023 = snapshot.entries.find((e) => e.code === 'tokushima')!;
    const tk2024 = snapshot2024.entries.find((e) => e.code === 'tokushima')!;
    const tk2025 = snapshot2025.entries.find((e) => e.code === 'tokushima')!;
    const tk2026 = snapshot2026.entries.find((e) => e.code === 'tokushima')!;
    expect(tk2023.maxScore).toBe(195);
    expect(tk2023.maxScore).toBe(tk2024.maxScore);
    expect(tk2023.maxScore).toBe(tk2025.maxScore);
    expect(tk2023.maxScore).toBe(tk2026.maxScore);
    expect(tk2023.practicalMultiplier).toBe(2);
    expect(tk2023.gradeMultipliers).toEqual({ '1': 1, '2': 1, '3': 1 });
    expect(tk2023.gradeMultipliers).toEqual(tk2024.gradeMultipliers);
  });
});
