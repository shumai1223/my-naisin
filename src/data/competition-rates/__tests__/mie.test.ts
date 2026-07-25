import { MIE_COMPETITION_RATES } from '../mie';

/**
 * Y-6 DoD検証（三重県・12県目・部分収録=PDF1ページ目のみ）。
 *
 * 三重県のPDFは各校末尾に「学校計」行が付随するため、その値を個別に突合する（内部整合性の
 * DoD）。全日制総計との完全一致は残り4ページ収録後に達成する。
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
};

describe('三重県 倍率パイプラインα（Y-6・部分収録=PDF1ページ目17校37レコード）', () => {
  const { records } = MIE_COMPETITION_RATES;

  it('各校の学科別内訳合計がPDF記載の「学校計」行と完全一致する（17校全件）', () => {
    for (const [schoolName, expected] of Object.entries(SCHOOL_LEVEL_TOTALS)) {
      const schoolRecords = records.filter((r) => r.schoolName === schoolName);
      const quotaSum = schoolRecords.reduce((acc, r) => acc + r.quota, 0);
      const applicantsSum = schoolRecords.reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(quotaSum).toBe(expected.quota);
      expect(applicantsSum).toBe(expected.applicants);
    }
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
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

  it('coverageがpartialを示している（PDF1ページ目のみ・残り4ページは次回以降）', () => {
    expect(MIE_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('37レコード・17校が収録されている', () => {
    expect(records.length).toBe(37);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(17);
  });

  it('くくり募集（複数学科・コースが後期選抜募集人数を共有）が正しく収録されている', () => {
    const kuwanaKogyo1 = records.find((r) => r.schoolName === '桑名工業' && r.department.includes('機械'));
    expect(kuwanaKogyo1).toEqual({
      schoolName: '桑名工業',
      department: '機械・材料技術（くくり募集）',
      quota: 36,
      finalApplicants: 37,
      finalRate: 1.03,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of MIE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.mie\.lg\.jp\//);
    }
  });
});
