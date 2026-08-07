import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { OITA_COMPETITION_RATES } from '../oita';

/**
 * Y-6 DoD検証（大分県・21県目・全日制完全達成）。
 */
describe('大分県 倍率パイプラインα（Y-6・全日制39校81レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = OITA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「県立高校全日制課程合計」行（quota5,806・applicants5,969）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(OITA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('81レコード・39校が収録されている', () => {
    expect(r8.length).toBe(81);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(39);
  });

  it('くくり募集の大分舞鶴（普通・理数）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '大分舞鶴')).toEqual({
      schoolName: '大分舞鶴',
      department: '普通・理数（くくり募集）',
      quota: 264,
      finalApplicants: 376,
      finalRate: 1.42,
    });
  });

  it('くくり募集の大分東（園芸ビジネス・園芸デザイン）が正しく収録されている', () => {
    expect(records.find((r) => r.department === '園芸ビジネス・園芸デザイン（くくり募集）')).toEqual({
      schoolName: '大分東',
      department: '園芸ビジネス・園芸デザイン（くくり募集）',
      quota: 60,
      finalApplicants: 40,
      finalRate: 0.67,
    });
  });

  it('applicants=0の学科(芸術緑丘・音楽)も正しく収録されている(quota>0のため)', () => {
    expect(records.find((r) => r.schoolName === '芸術緑丘')).toEqual({
      schoolName: '芸術緑丘',
      department: '音楽',
      quota: 14,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが82件収録され、「県立高校全日制課程合計」(quota5,666・applicants5,783)と完全一致する。学校名のキー集合はR8と完全一致(統廃合なし)。大分東はR7時点は普通・園芸ビジネス・園芸デザインの3学科すべてに独立した数値が公表されておりくくり募集ではなかった(R8は園芸ビジネス・園芸デザインのみくくり募集化した実際のPDFレイアウト差で、R7が39校82レコードとR8の81レコードより1件多い理由)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(82);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(5666);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5783);

    expect(r7.some((r) => r.schoolName === '大分東' && r.department === '園芸ビジネス')).toBe(true);
    expect(r7.some((r) => r.schoolName === '大分東' && r.department === '園芸デザイン')).toBe(true);

    const r7Schools = new Set(r7.map((r) => r.schoolName));
    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect(r7Schools.size).toBe(39);
    expect([...r7Schools].every((s) => r8Schools.has(s))).toBe(true);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of OITA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.oita\.jp\//);
    }
  });
});
