import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGOSHIMA_COMPETITION_RATES } from '../kagoshima';

/**
 * Y-6 DoD検証（鹿児島県・26県目・全日制完全達成）。
 */
describe('鹿児島県 倍率パイプラインα（Y-6・全日制68校156レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KAGOSHIMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制合計」行（quota10,349・applicants7,948）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
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
    expect(KAGOSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('156レコード・68校が収録されている', () => {
    expect(r8.length).toBe(156);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
  });

  it('applicants=0の学科（野田女子・衛生看護/与論・普通）も正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '野田女子' && r.department === '衛生看護')).toEqual({
      schoolName: '野田女子',
      department: '衛生看護',
      quota: 40,
      finalApplicants: 0,
      finalRate: 0,
    });
    expect(records.find((r) => r.schoolName === '与論')).toEqual({
      schoolName: '与論',
      department: '普通',
      quota: 45,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('離島の学区（熊毛・大島）の学校が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '種子島' && r.department === '普通')).toEqual({
      schoolName: '種子島',
      department: '普通',
      quota: 80,
      finalApplicants: 53,
      finalRate: 0.66,
    });
    expect(records.find((r) => r.schoolName === '沖永良部' && r.department === '商業')).toEqual({
      schoolName: '沖永良部',
      department: '商業',
      quota: 39,
      finalApplicants: 33,
      finalRate: 0.85,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが156件収録され、「全日制合計」(quota10,398・applicants8,455)と完全一致する。学校名のキー集合はR8と完全一致(統廃合なし)。楠隼・喜界(商業)もR7時点で最終出願者数0だった', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(156);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(10398);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(8455);

    expect(r7.find((r) => r.schoolName === '与論')).toMatchObject({ finalApplicants: 1 });
    expect(r7.find((r) => r.schoolName === '楠隼')).toMatchObject({ finalApplicants: 0 });
    expect(r7.find((r) => r.schoolName === '喜界' && r.department === '商業')).toMatchObject({ finalApplicants: 0 });

    const r7Schools = new Set(r7.map((r) => r.schoolName));
    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect(r7Schools.size).toBe(68);
    expect([...r7Schools].every((s) => r8Schools.has(s))).toBe(true);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが154件・68校収録され、「全日制合計」(quota10,957・applicants9,205)と完全一致する。R6の学区別詳細表は最初から全日制限定表のため定時制除外処理は不要だった。学校名のキー集合はR7/R8と完全一致(統廃合なし)。レコード数がR7/R8の156件より2件少ないのは学科構成の年度差によるもの', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(154);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(10957);
    expect(sumApplicants).toBe(9205);

    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect([...distinctSchools].every((s) => r8Schools.has(s))).toBe(true);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが153件・68校収録され、「全日制合計」(quota11,094・applicants9,025)と完全一致する。7学区すべての学区合計行(鹿児島3795/3784・南薩1107/676・北薩1569/1133・姶良伊佐1724/1455・大隅1516/1136・熊毛395/236・大島988/605)とも完全一致する。学校名のキー集合はR6/R7/R8と完全一致(統廃合なし)。喜界(商業)がR5時点で最終出願者数0だった', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(153);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(11094);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(9025);

    const districts: Record<string, string[]> = {
      鹿児島: ['鶴丸', '甲南', '鹿児島中央', '錦江湾', '武岡台', '開陽', '明桜館', '松陽', '鹿児島東', '鹿児島工業', '鹿児島南', '吹上', '伊集院', '市来農芸', '串木野', '鹿児島玉龍', '鹿児島商業', '鹿児島女子'],
      南薩: ['指宿', '山川', '頴娃', '枕崎', '鹿児島水産', '加世田', '加世田常潤', '川辺', '薩南工業', '指宿商業'],
      北薩: ['川内', '川内商工', '川薩清修館', '薩摩中央', '鶴翔', '野田女子', '出水', '出水工業', '出水商業'],
      姶良伊佐: ['大口', '伊佐農林', '霧島', '蒲生', '加治木', '加治木工業', '隼人工業', '国分', '福山', '国分中央'],
      大隅: ['曽於', '志布志', '串良商業', '楠隼', '鹿屋', '鹿屋農業', '鹿屋工業', '垂水', '南大隅', '鹿屋女子'],
      熊毛: ['種子島', '種子島中央', '屋久島'],
      大島: ['大島', '奄美', '大島北', '古仁屋', '喜界', '徳之島', '沖永良部', '与論'],
    };
    const expectedDistrictTotals: Record<string, { quota: number; applicants: number }> = {
      鹿児島: { quota: 3795, applicants: 3784 },
      南薩: { quota: 1107, applicants: 676 },
      北薩: { quota: 1569, applicants: 1133 },
      姶良伊佐: { quota: 1724, applicants: 1455 },
      大隅: { quota: 1516, applicants: 1136 },
      熊毛: { quota: 395, applicants: 236 },
      大島: { quota: 988, applicants: 605 },
    };
    for (const [district, schoolNames] of Object.entries(districts)) {
      const recs = r5.filter((r) => schoolNames.includes(r.schoolName));
      const exp = expectedDistrictTotals[district];
      expect(recs.reduce((a, r) => a + r.quota, 0)).toBe(exp.quota);
      expect(recs.reduce((a, r) => a + r.finalApplicants, 0)).toBe(exp.applicants);
    }

    expect(r5.find((r) => r.schoolName === '喜界' && r.department === '商業')).toMatchObject({ finalApplicants: 0 });
    expect(r5.find((r) => r.schoolName === '与論')).toMatchObject({ finalApplicants: 1 });

    const r5Schools = new Set(r5.map((r) => r.schoolName));
    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect([...r5Schools].every((s) => r8Schools.has(s))).toBe(true);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KAGOSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kagoshima\.jp\//);
    }
  });
});
