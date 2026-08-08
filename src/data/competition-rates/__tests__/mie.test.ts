import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { MIE_COMPETITION_RATES } from '../mie';

/**
 * Y-6 DoD検証（三重県・12県目・全日制完全達成）。
 *
 * 三重県のPDFは各校末尾に「学校計」行が付随するため、全52校それぞれの内部整合性を検証した
 * 上で、全日制総計との完全一致も検証する（二重のDoD）。
 */
const SCHOOL_LEVEL_TOTALS: Record<string, { quota: number; applicants: number }> = {
  桑名: { quota: 280, applicants: 354 },
  桑名西: { quota: 240, applicants: 271 },
  桑名北: { quota: 107, applicants: 62 },
  桑名工業: { quota: 72, applicants: 60 },
  いなべ総合学園: { quota: 132, applicants: 148 },
  四日市: { quota: 320, applicants: 378 },
  四日市南: { quota: 320, applicants: 411 },
  四日市西: { quota: 180, applicants: 160 },
  朝明: { quota: 64, applicants: 46 },
  四日市四郷: { quota: 80, applicants: 85 },
  四日市工業: { quota: 126, applicants: 157 },
  四日市中央工業: { quota: 90, applicants: 96 },
  四日市商業: { quota: 110, applicants: 99 },
  四日市農芸: { quota: 90, applicants: 105 },
  菰野: { quota: 107, applicants: 103 },
  川越: { quota: 240, applicants: 302 },
  神戸: { quota: 240, applicants: 242 },
  飯野: { quota: 36, applicants: 49 },
  白子: { quota: 125, applicants: 108 },
  石薬師: { quota: 36, applicants: 32 },
  稲生: { quota: 80, applicants: 93 },
  亀山: { quota: 107, applicants: 99 },
  津: { quota: 320, applicants: 376 },
  津西: { quota: 280, applicants: 312 },
  津商業: { quota: 110, applicants: 106 },
  津東: { quota: 178, applicants: 201 },
  津工業: { quota: 108, applicants: 107 },
  久居: { quota: 107, applicants: 109 },
  久居農林: { quota: 108, applicants: 86 },
  白山: { quota: 41, applicants: 16 },
  上野: { quota: 152, applicants: 166 },
  あけぼの学園: { quota: 18, applicants: 16 },
  伊賀白鳳: { quota: 108, applicants: 90 },
  名張: { quota: 92, applicants: 113 },
  名張青峰: { quota: 127, applicants: 121 },
  松阪: { quota: 239, applicants: 260 },
  松阪工業: { quota: 72, applicants: 85 },
  松阪商業: { quota: 72, applicants: 71 },
  飯南: { quota: 22, applicants: 4 },
  相可: { quota: 89, applicants: 81 },
  明野: { quota: 72, applicants: 54 },
  宇治山田: { quota: 107, applicants: 110 },
  伊勢: { quota: 280, applicants: 266 },
  宇治山田商業: { quota: 72, applicants: 100 },
  伊勢工業: { quota: 72, applicants: 61 },
  '南伊勢（度会校舎）': { quota: 35, applicants: 1 },
  鳥羽: { quota: 18, applicants: 9 },
  志摩: { quota: 18, applicants: 2 },
  水産: { quota: 38, applicants: 19 },
  尾鷲: { quota: 109, applicants: 74 },
};

describe('三重県 倍率パイプラインα（Y-6・全日制52校108レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = MIE_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が全日制総計（quota6,419・applicants6,636・倍率1.03）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制総計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('各校の学科別内訳合計がPDF記載の「学校計」行と完全一致する（単独校50校全件）', () => {
    for (const [schoolName, expected] of Object.entries(SCHOOL_LEVEL_TOTALS)) {
      const schoolRecords = r8.filter((r) => r.schoolName === schoolName);
      const quotaSum = schoolRecords.reduce((acc, r) => acc + r.quota, 0);
      const applicantsSum = schoolRecords.reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(quotaSum).toBe(expected.quota);
      expect(applicantsSum).toBe(expected.applicants);
    }
  });

  it('熊野青藍（木本校舎+紀南校舎の2校舎合計）がPDF記載の「学校計」行（quota173・applicants160）と完全一致する', () => {
    const kimoto = r8.filter((r) => r.schoolName === '熊野青藍（木本校舎）');
    const kinan = r8.filter((r) => r.schoolName === '熊野青藍（紀南校舎）');
    const quotaSum = [...kimoto, ...kinan].reduce((acc, r) => acc + r.quota, 0);
    const applicantsSum = [...kimoto, ...kinan].reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(quotaSum).toBe(173);
    expect(applicantsSum).toBe(160);
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
    expect(MIE_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('108レコード・52校が収録されている', () => {
    expect(r8.length).toBe(108);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(52);
  });

  it('くくり募集（複数学科・コースが後期選抜募集人数を共有）が正しく収録されている', () => {
    const kuwanaKogyo1 = r8.find((r) => r.schoolName === '桑名工業' && r.department.includes('機械'));
    expect(kuwanaKogyo1).toEqual({
      schoolName: '桑名工業',
      department: '機械・材料技術（くくり募集）',
      quota: 36,
      finalApplicants: 37,
      finalRate: 1.03,
    });
    const igahoo1 = r8.find((r) => r.schoolName === '伊賀白鳳' && r.department.includes('機械'));
    expect(igahoo1).toEqual({
      schoolName: '伊賀白鳳',
      department: '機械・電子機械・建築デザイン（くくり募集）',
      quota: 48,
      finalApplicants: 37,
      finalRate: 0.77,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが105件収録され、全日制総計(quota6,589・applicants7,230)と完全一致する。伊賀白鳳のくくり構成がR7(7学科が単一quota110を共有)→R8(4レコードに再編)で変化していることを確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(105);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(6589);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(7230);

    const igahoR7 = r7.filter((r) => r.schoolName === '伊賀白鳳');
    expect(igahoR7).toHaveLength(1);
    expect(igahoR7[0].quota).toBe(110);
    const igahoR8 = r8.filter((r) => r.schoolName === '伊賀白鳳');
    expect(igahoR8).toHaveLength(4);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが106件・52校収録され、全日制総計(quota6,819・applicants7,360・倍率1.08)と完全一致する。伊賀白鳳のくくり構成はR6でもR7と同じ7学科が単一quota106を共有していた（4レコード化はR8から）', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(106);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(6819);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(7360);

    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(52);

    const igahoR6 = r6.filter((r) => r.schoolName === '伊賀白鳳');
    expect(igahoR6).toHaveLength(1);
    expect(igahoR6[0].quota).toBe(106);

    // R6時点は熊野青藍への統合前で「木本」「紀南」という別々の独立校名だった
    expect(r6.filter((r) => r.schoolName === '木本')).toHaveLength(2);
    expect(r6.filter((r) => r.schoolName === '紀南')).toHaveLength(1);
    expect(r6.filter((r) => r.schoolName === '熊野青藍（木本校舎）')).toHaveLength(0);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of MIE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.mie\.lg\.jp\//);
    }
  });
});
