import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIMANE_COMPETITION_RATES } from '../shimane';

/**
 * Y-6 DoD検証（島根県・保留県からの再挑戦で完全達成）。
 */
describe('島根県 倍率パイプラインα（Y-6・全日制35校64レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SHIMANE_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「合計」行（quota3,084・applicants2,493）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('県立高校のみの合計が「県立高校計」行（quota3,031・applicants2,447）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立高校計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName !== '皆美が丘女子' && !r.fiscalYear);
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

  it('coverageがcompleteを示している（定時制は意図的にスコープ外）', () => {
    expect(SHIMANE_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('64レコード・35校（県立34校+市立1校）が収録されている', () => {
    expect(r8.length).toBe(64);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('市立高校(皆美が丘女子)が県立高校と区別して収録されている', () => {
    expect(r8.find((r) => r.schoolName === '皆美が丘女子')).toEqual({
      schoolName: '皆美が丘女子',
      department: '普通',
      quota: 53,
      finalApplicants: 46,
      finalRate: 0.87,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが65件収録され、「合計」(quota3,217・applicants2,667)および「県立高校計」(quota3,133・applicants2,596)と完全一致する。皆美が丘女子はR7時点「普通」「国際コミュニケーション」の2学科構成で、国際コミュニケーション科は定員未充足のためR8で募集停止・普通科一本化された実在の学科再編を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(65);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(3217);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2667);

    const r7Kenritsu = r7.filter((r) => r.schoolName !== '皆美が丘女子');
    expect(r7Kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(3133);
    expect(r7Kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2596);

    expect(r7.some((r) => r.schoolName === '皆美が丘女子' && r.department === '国際コミュニケーション')).toBe(true);
    expect(r8.some((r) => r.schoolName === '皆美が丘女子' && r.department === '国際コミュニケーション')).toBe(false);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが65件収録され、「合計」(quota4,169・applicants3,481)および「県立高校計」(quota4,066・applicants3,416)と完全一致する。R7との差分は津和野の「普通」→「未来共創」1件のみで、令和7年度から新学科「未来共創科」を新設した実在の学科再編をWebSearchで確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(65);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(4169);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3481);

    const r6Kenritsu = r6.filter((r) => r.schoolName !== '皆美が丘女子');
    expect(r6Kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(4066);
    expect(r6Kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3416);

    expect(r6.some((r) => r.schoolName === '津和野' && r.department === '普通')).toBe(true);

    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys.size).toBe(r7Keys.size);

    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが66件収録され、「合計」(quota4,227・applicants3,873)および「県立高校計」(quota4,122・applicants3,783)と完全一致する。R6より1件多いのは松江工業がR5時点で「機械・電子機械・電気・電子・情報技術・建築都市工学」の6学科構成だったため（R6以降は電気・電子が電気電子工学へ統合、情報技術が情報クリエイター学へ改称された5学科構成）。Wikipediaで2024年3月に両改編が実施されたことを確認した', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(66);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(4227);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3873);

    const r5Kenritsu = r5.filter((r) => r.schoolName !== '皆美が丘女子');
    expect(r5Kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(4122);
    expect(r5Kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3783);

    const matsueKougyoR5 = r5.filter((r) => r.schoolName === '松江工業');
    expect(matsueKougyoR5.length).toBe(6);
    expect(new Set(matsueKougyoR5.map((r) => r.department))).toEqual(
      new Set(['機械', '電子機械', '電気', '電子', '情報技術', '建築都市工学']),
    );

    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    // 松江工業のみ学科構成が異なる（R5:6学科 vs R6:5学科）ため差分はこの1校分
    const onlyInR5 = [...r5Keys].filter((k) => !r6Keys.has(k));
    const onlyInR6 = [...r6Keys].filter((k) => !r5Keys.has(k));
    expect(onlyInR5.every((k) => k.startsWith('松江工業|'))).toBe(true);
    expect(onlyInR6.every((k) => k.startsWith('松江工業|'))).toBe(true);

    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIMANE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www1?\.pref\.shimane\.lg\.jp\//);
    }
  });
});
