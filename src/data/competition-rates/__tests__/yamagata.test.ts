import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { YAMAGATA_COMPETITION_RATES } from '../yamagata';

/**
 * Y-6 DoD検証（山形県・35県目・全日制完全達成）。
 */
describe('山形県 倍率パイプラインα（Y-6・全日制42校90レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = YAMAGATA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制公立合計」行（quota4,404・applicants2,973）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制公立合計')!;
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
    expect(YAMAGATA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('90レコード・42校が収録されている', () => {
    expect(r8.length).toBe(90);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(42);
  });

  it('理数探究科・国際探究科をあわせた「探究科」が単一レコードとして正しく収録されている（山形東）', () => {
    expect(r8.find((r) => r.schoolName === '山形東' && r.department.includes('探究'))).toEqual({
      schoolName: '山形東',
      department: '探究(理数探究,国際探究)',
      quota: 76,
      finalApplicants: 169,
      finalRate: 2.22,
    });
  });

  it('applicants=0の学科（村山産業・流通ビジネス/小国・普通）も正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '小国')).toEqual({
      schoolName: '小国',
      department: '普通',
      quota: 25,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが91件・43校収録され、公式「全日制公立合計」5,609/4,505と完全一致する。新庄北+新庄南は令和8年4月の実在の統合(WebSearchで山形県公式発表を確認)により「新庄志誠館」に再編され、新庄神室産業金山校もR8で新設されているため、これらの学校再編差分を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(91);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5609);
    expect(sumApplicants).toBe(4505);

    const r7OnlySchools = new Set(['新庄北', '新庄北最上校', '新庄南', '新庄南金山校']);
    const r8OnlySchools = new Set(['新庄志誠館', '新庄志誠館最上校', '新庄神室産業金山校']);
    const r8Keys = new Set(r8.filter((r) => !r8OnlySchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.filter((r) => !r7OnlySchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが91件・44校収録され、公式「全日制公立合計」5,729/4,518と完全一致する。R6時点は「米沢工業」(3学科)と「米沢商業」(1学科)が別々の学校だったが、R7で両校が統合され「米沢鶴城」(4学科)として開校していたことを学科数・学科名の対応関係から確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(91);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(44);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5729);
    expect(sumApplicants).toBe(4518);

    expect(r6.some((r) => r.schoolName === '米沢工業')).toBe(true);
    expect(r6.some((r) => r.schoolName === '米沢商業')).toBe(true);
    expect(r6.some((r) => r.schoolName === '米沢鶴城')).toBe(false);
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.filter((r) => r.schoolName === '米沢鶴城')).toHaveLength(4);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが92件・45校収録され、公式「全日制公立合計」5,948/4,869と完全一致する（内訳: 全日制県立合計6,480/750/5,730/4,593＋全日制市立合計280/62/218/276）。R5時点は「鶴岡南」(普通・理数)と「鶴岡北」(普通)が別々の学校だったが、2024年4月に両校統合し中高一貫校「致道館」として開校していたことをWebSearchで確認した(旧鶴岡南校舎を高校が、旧鶴岡北校舎を中学校が使用)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(92);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(45);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5948);
    expect(sumApplicants).toBe(4869);

    expect(r5.some((r) => r.schoolName === '鶴岡南')).toBe(true);
    expect(r5.some((r) => r.schoolName === '鶴岡北')).toBe(true);
    expect(r5.some((r) => r.schoolName === '致道館')).toBe(false);
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.some((r) => r.schoolName === '致道館')).toBe(true);
    expect(r6.some((r) => r.schoolName === '鶴岡南')).toBe(false);
    expect(r6.some((r) => r.schoolName === '鶴岡北')).toBe(false);
  });

  it('掛-1(学校別×多年度): R5の「鶴岡南」は普通・理数の入学定員が別だが一般選抜の募集人員・志願者数・志願倍率がPDF上で両学科合算の単一値として印字されているため、department:「普通・理数」の単一レコードとして収録されている', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.find((r) => r.schoolName === '鶴岡南')).toEqual({
      schoolName: '鶴岡南',
      department: '普通・理数',
      quota: 200,
      finalApplicants: 188,
      finalRate: 0.94,
      fiscalYear: '令和5年度（2023年度）',
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of YAMAGATA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.yamagata\.jp\//);
    }
  });
});
