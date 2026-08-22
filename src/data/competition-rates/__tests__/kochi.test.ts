import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KOCHI_COMPETITION_RATES } from '../kochi';

/**
 * Y-6 DoD検証（高知県・23県目）。
 */
describe('高知県 倍率パイプラインα（Y-6・Ａ日程75レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KOCHI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('県立分の全レコード合計が「県立計」行と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear && r.schoolName !== '高知商業');
    expect(result.matches).toBe(true);
  });

  it('市立（高知商業）分の全レコード合計が「市立計（高知商業）」行と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '市立計（高知商業）')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear && r.schoolName === '高知商業');
    expect(result.matches).toBe(true);
  });

  it('全レコード合計が「合計」行と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quota）と整合する', () => {
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

  it('coverageがcompleteを示している（高知国際グローバル探究・Ｂ日程・定時制等は意図的にスコープ外）', () => {
    expect(KOCHI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('75レコード・32校（県立31校+高知商業）が収録されている', () => {
    expect(r8.length).toBe(75);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('applicants=0の学科（安芸・工業(土木)/四万十・普通(自環コース)）も正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '安芸' && r.department === '工業(土木)')).toEqual({
      schoolName: '安芸',
      department: '工業(土木)',
      quota: 20,
      finalApplicants: 0,
      finalRate: 0,
    });
    expect(r8.find((r) => r.schoolName === '四万十' && r.department === '普通(自環コース)')).toEqual({
      schoolName: '四万十',
      department: '普通(自環コース)',
      quota: 25,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('高知国際「国際（グローバル）探究」学科は募集定員が非公表のため記録されていない', () => {
    expect(r8.find((r) => r.schoolName === '高知国際' && r.department.includes('グローバル'))).toBeUndefined();
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが75件・32校収録され、公式「合計」行(quota4,949)とquotaが完全一致し、applicantsは高知国際グローバル探究の9名分のみR8と同型の理由で差分がある(3,399-9=3,390)。R7でも同学科は募集定員非公表のため記録から除外。R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(75);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4949);
    expect(sumApplicants).toBe(3390);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが75件・32校収録され、node.js機械集計(quota4,924・applicants3,534)と完全一致し、公式の県立計との差分9名は高知国際グローバル探究のR6実績9名分と一致する。清水「普通(未来)」はR6時点では単に「普通」だった(実在の学科ブランディング変更)以外、R8と学校名+学科名の組み合わせが完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(75);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4924);
    expect(sumApplicants).toBe(3534);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const onlyInR6 = [...r6Keys].filter((k) => !r8Keys.has(k));
    const onlyInR8 = [...r8Keys].filter((k) => !r6Keys.has(k));
    expect(onlyInR6).toEqual(['清水|普通']);
    expect(onlyInR8).toEqual(['清水|普通(未来)']);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが76件・32校収録され(高知国際「探究(グローバル)」学科がR5では募集定員が実数(26)で公表され数値化できたため他年度より1レコード多い)、公式「合計」行(quota4,901・applicants3,442)とnode.js機械集計が完全一致する(探究(グローバル)が数値化できたため他年度のような若干名分の意図的差分は発生しない)。ＤＰコースは学科内の内数のため独立レコード化されていない。清水「普通」はR5時点ではR6と同じく括弧なし表記(R8は「普通(未来)」)。それ以外はR8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(76);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4901);
    expect(sumApplicants).toBe(3442);

    expect(
      r5.find((r) => r.schoolName === '高知国際' && r.department === '探究(グローバル)')
    ).toEqual({
      schoolName: '高知国際',
      department: '探究(グローバル)',
      quota: 26,
      finalApplicants: 15,
      finalRate: 0.58,
      fiscalYear: '令和5年度（2023年度）',
    });

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    const onlyInR5 = [...r5Keys].filter((k) => !r8Keys.has(k)).sort();
    const onlyInR8 = [...r8Keys].filter((k) => !r5Keys.has(k)).sort();
    expect(onlyInR5).toEqual(['清水|普通', '高知国際|探究(グローバル)'].sort());
    expect(onlyInR8).toEqual(['清水|普通(未来)']);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KOCHI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kochi\.lg\.jp\//);
    }
  });
});
