import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOTTORI_COMPETITION_RATES } from '../tottori';

/**
 * Y-6 DoD検証（鳥取県・22県目・全日制完全達成）。
 *
 * 全県計に加え3地区（東部/中部/西部）ごとの小計行が明記されているため、
 * 地区別の突合と全県計の突合の両方をDoDとして検証する。
 */
describe('鳥取県 倍率パイプラインα（Y-6・全日制22校43レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOTTORI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が県計（quota2,937・applicants2,334・倍率0.79）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it.each([
    ['東部小計', '東部'],
    ['中部小計', '中部'],
    ['西部小計', '西部'],
  ])('%sが公表資料記載の地区小計と完全一致する', (label, area) => {
    const subtotal = officialSubtotals.find((s) => s.label === label)!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.area === area && !r.fiscalYear);
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
    expect(TOTTORI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('43レコード・22校が収録されている', () => {
    expect(r8.length).toBe(43);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(22);
  });

  it('くくり募集（複数学科が募集人員を共有）が正しく収録されている', () => {
    const cases: Array<{ schoolName: string; area: string; department: string; quota: number; finalApplicants: number; finalRate: number }> = [
      { schoolName: '鳥取東', area: '東部', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 294, finalRate: 1.05 },
      {
        schoolName: '鳥取工業',
        area: '東部',
        department: '工業（機械・電気・情報工学・建設工学）（くくり募集）',
        quota: 104,
        finalApplicants: 47,
        finalRate: 0.45,
      },
      { schoolName: '智頭農林', area: '東部', department: '生産科学・森林科学（くくり募集）', quota: 57, finalApplicants: 9, finalRate: 0.16 },
    ];
    for (const c of cases) {
      const rec = r8.find((r) => r.schoolName === c.schoolName && r.department === c.department);
      expect(rec).toEqual(c);
    }
  });

  it('applicants=0の学科(境港総合技術・電気電子)も正しく収録されている(quota>0のため)', () => {
    expect(r8.find((r) => r.schoolName === '境港総合技術' && r.department === '電気電子')).toEqual({
      schoolName: '境港総合技術',
      area: '西部',
      department: '電気電子',
      quota: 38,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが43件収録され、県計(quota2,936・applicants2,586)および地区別小計と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(43);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(2936);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2586);

    const sumArea = (area: string) => {
      const rs = r7.filter((r) => r.area === area);
      return { quota: rs.reduce((a, r) => a + r.quota, 0), applicants: rs.reduce((a, r) => a + r.finalApplicants, 0) };
    };
    expect(sumArea('東部')).toEqual({ quota: 1235, applicants: 1054 });
    expect(sumArea('中部')).toEqual({ quota: 498, applicants: 390 });
    expect(sumArea('西部')).toEqual({ quota: 1203, applicants: 1142 });

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(22);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが43件収録され、県計(quota3,048・applicants2,648)および地区別小計と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(43);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(3048);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2648);

    const sumArea = (area: string) => {
      const rs = r6.filter((r) => r.area === area);
      return { quota: rs.reduce((a, r) => a + r.quota, 0), applicants: rs.reduce((a, r) => a + r.finalApplicants, 0) };
    };
    expect(sumArea('東部')).toEqual({ quota: 1273, applicants: 1078 });
    expect(sumArea('中部')).toEqual({ quota: 549, applicants: 448 });
    expect(sumArea('西部')).toEqual({ quota: 1226, applicants: 1122 });

    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(22);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが46件収録され、県計(quota3,040・applicants2,757)および地区別小計と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(46);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(3040);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2757);

    const sumArea = (area: string) => {
      const rs = r5.filter((r) => r.area === area);
      return { quota: rs.reduce((a, r) => a + r.quota, 0), applicants: rs.reduce((a, r) => a + r.finalApplicants, 0) };
    };
    expect(sumArea('東部')).toEqual({ quota: 1234, applicants: 1106 });
    expect(sumArea('中部')).toEqual({ quota: 560, applicants: 450 });
    expect(sumArea('西部')).toEqual({ quota: 1246, applicants: 1201 });

    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(22);
  });

  it('掛-1(実データ差分): 令和5年度(R5)時点の鳥取工業は4学科が個別quotaで独立収録され(くくり募集ではない)、R6以降の完全統合くくり募集とは異なる', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    const tottoriKogyoR5 = r5.filter((r) => r.schoolName === '鳥取工業');
    expect(tottoriKogyoR5).toEqual([
      { schoolName: '鳥取工業', area: '東部', department: '機械', quota: 30, finalApplicants: 14, finalRate: 0.47, fiscalYear: '令和5年度（2023年度）' },
      { schoolName: '鳥取工業', area: '東部', department: '電気', quota: 23, finalApplicants: 8, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
      { schoolName: '鳥取工業', area: '東部', department: '制御・情報', quota: 25, finalApplicants: 17, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
      { schoolName: '鳥取工業', area: '東部', department: '建設工学', quota: 22, finalApplicants: 9, finalRate: 0.41, fiscalYear: '令和5年度（2023年度）' },
    ]);

    const tottoriKogyoR6 = records.find(
      (r) => r.schoolName === '鳥取工業' && r.fiscalYear === '令和6年度（2024年度）',
    );
    expect(tottoriKogyoR6?.department).toBe('工業（機械・電気・情報工学・建設工学）（くくり募集）');
  });

  it('掛-1(実データ差分): 米子南の学科名がR5→R6以降で改称されている(ビジネス情報→ITビジネス、生活文化→生活創造)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）' && r.schoolName === '米子南');
    const r5Departments = r5.map((r) => r.department).sort();
    expect(r5Departments).toEqual(['ビジネス情報', '生活文化（環境文化）', '生活文化（調理）'].sort());

    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）' && r.schoolName === '米子南');
    const r7Departments = r7.map((r) => r.department).sort();
    expect(r7Departments).toEqual(['ITビジネス', '生活創造(ライフデザイン)', '生活創造(調理)'].sort());
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of TOTTORI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.tottori\.lg\.jp\//);
    }
  });
});
