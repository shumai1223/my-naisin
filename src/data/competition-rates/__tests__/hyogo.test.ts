import { HYOGO_COMPETITION_RATES } from '../hyogo';

/**
 * Y-2/Y-6 DoD検証（兵庫県・Y-6先行着手1県目）。
 *
 * 兵庫県は全日制127校（全10ページ）の大規模資料のうち、今回はPDF2〜3ページ目の84校107レコードを
 * 対象とした正直な部分収録。学校単位の「計」行がPDF上に存在しないため、officialSubtotalsに
 * よる突合は行わず、レコード単体の整合性（quota>0・finalApplicants>=0・finalRate概算一致）と
 * 学校名+学科名の重複が無いことのみを検証する。
 */
describe('兵庫県 倍率パイプラインα（Y-6・PDF2〜3ページ目84校107レコードの部分収録テスト）', () => {
  const { records } = HYOGO_COMPETITION_RATES;

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageが正直に部分収録を示している', () => {
    expect(HYOGO_COMPETITION_RATES.coverage.status).toBe('partial');
    expect(HYOGO_COMPETITION_RATES.coverage.pendingDepartments.length).toBeGreaterThan(0);
  });

  it('107レコード・84校が収録されている（PDF2〜3ページ目・東灘〜北条）', () => {
    expect(records.length).toBe(107);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(84);
  });

  it('学科横断の専門学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      兵庫工業: 7,
      洲本実業: 2,
      市科学技術: 4,
      氷上: 3,
      尼崎工業: 4,
      篠山産業: 4,
      市尼崎双星: 4,
      市伊丹: 2,
      有馬: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of HYOGO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www2\.hyogo-c\.ed\.jp\//);
    }
  });
});
