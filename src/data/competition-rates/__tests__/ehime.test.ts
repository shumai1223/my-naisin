import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { EHIME_COMPETITION_RATES } from '../ehime';

/**
 * Y-6 DoD検証（愛媛県・16県目・全日制完全達成）。
 */
describe('愛媛県 倍率パイプラインα（Y-6・全日制43校99レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = EHIME_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「合計」行（quota8,370・applicants7,468・倍率0.89）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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
    expect(EHIME_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('99レコード・43校が収録されている', () => {
    expect(r8.length).toBe(99);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
  });

  it('注記で明記済みのくくり募集（今治西・宇和島東）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '今治西')).toEqual({
      schoolName: '今治西',
      department: '国・普（くくり募集）',
      quota: 280,
      finalApplicants: 265,
      finalRate: 0.95,
    });
    expect(records.find((r) => r.schoolName === '宇和島東' && r.department.includes('くくり募集'))).toEqual({
      schoolName: '宇和島東',
      department: '理・普（くくり募集）',
      quota: 160,
      finalApplicants: 144,
      finalRate: 0.9,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが102件収録され、「合計」(quota8,590・applicants7,898・倍率0.92)と完全一致する。今治西高校伯方分校・今治北高校大三島分校はR7時点は在籍していたが、令和8年3月末の閉校(しまなみ高校への継承)によりR8には存在しない実在の変化を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(102);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(8590);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(7898);

    expect(r7.some((r) => r.schoolName === '今治西（伯方）')).toBe(true);
    expect(r7.some((r) => r.schoolName === '今治北（大三島）')).toBe(true);
    expect(r8.some((r) => r.schoolName.includes('伯方'))).toBe(false);
    expect(r8.some((r) => r.schoolName.includes('大三島'))).toBe(false);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(49);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが103件収録され、「合計」(quota8,765・applicants7,619・倍率0.87)と完全一致する。R7(102件)との差分1件は、新居浜東がR6は「普通」単独240人枠だったがR7で「普通」200+「健康スポーツ」40の2学科に分割(-1)、宇和島東(津島)「普通」と北宇和(三間)「農・普」がR7に存在しない(+2)という3つの実在差分が相殺した結果', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(103);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(8765);
    expect(sumApplicants).toBe(7619);

    expect(r6.some((r) => r.schoolName === '宇和島東（津島）')).toBe(true);
    expect(r6.some((r) => r.schoolName === '北宇和（三間）')).toBe(true);
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.some((r) => r.schoolName.includes('津島'))).toBe(false);
    expect(r7.some((r) => r.schoolName.includes('三間'))).toBe(false);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of EHIME_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/ehime-(kyoiku|c)\.esnet\.ed\.jp\//);
    }
  });
});
