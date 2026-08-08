import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { CHIBA_COMPETITION_RATES } from '../chiba';

/**
 * Y-2 DoD検証（千葉県・先行8県6県目）: 全188レコードの合計が千葉県教育委員会公表の
 * 「県立全日制合計」「市立全日制合計」「公立全日制合計」と一致することを機械的に突合する。
 */
describe('千葉県 倍率パイプラインα（Y-2・県立+市立全日制の突合テスト）', () => {
  const { records, officialSubtotals } = CHIBA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('市立全日制の学校名（"市立"を含む6校12レコード）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('市立全日制合計'), (r) => r.schoolName.startsWith('市立') && !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('県立全日制（"市立"以外）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('県立全日制合計'), (r) => !r.schoolName.startsWith('市立') && !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全188レコードの合計が公式「公立全日制合計」28,880/32,008と完全一致する（Y-2千葉県の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('公立全日制合計'), (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(28880);
    expect(result.actualApplicants).toBe(32008);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
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

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが188件収録され(全日制が完結)、公式「公立全日制合計」29,720/33,854と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(188);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(29720);
    expect(sumApplicants).toBe(33854);

    const r8Keys = new Set(records.filter((r) => !r.fiscalYear).map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度・R6第1弾・3年度目): 令和6年度(R6)分に1頁目「県立全日制」50レコードが収録され、学校名+学科名の重複が無い。機械集計がビジョン解析転記と一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(50);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(10000);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(11993);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    expect(r6.find((r) => r.schoolName === '千葉' && r.department === '普通科')).toEqual({
      schoolName: '千葉',
      department: '普通科',
      quota: 240,
      finalApplicants: 356,
      finalRate: 1.48,
      fiscalYear: '令和6年度（2024年度）',
    });
  });

  it('coverageが完了を示している', () => {
    expect(CHIBA_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(CHIBA_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of CHIBA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.chiba\.lg\.jp\//);
    }
  });
});
