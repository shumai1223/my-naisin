import { GUNMA_COMPETITION_RATES } from '../gunma';

/**
 * Y-6 DoD検証（群馬県・9県目・coverage='partial'）。
 *
 * 県全体のグランドトータルとは一致しない（連携型選抜実施校3校=尾瀬/万場/嬬恋が本文に
 * データを持たないため）。代わりに、各校の学科別内訳合計がPDF記載の「学校別志願者数」
 * （D列）と完全一致することを個別に検証する（内部整合性のDoD）。
 */
const SCHOOL_LEVEL_APPLICANTS: Record<string, number> = {
  前橋: 314,
  前橋南: 209,
  前橋西: 138,
  前橋女子: 294,
  前橋東: 217,
  勢多農林: 206,
  前橋工業: 227,
  前橋商業: 307,
  前橋清陵: 116,
  高崎: 354,
  高崎東: 144,
  高崎北: 251,
  榛名: 28,
  高崎女子: 298,
  吉井: 79,
  高崎工業: 284,
  高崎商業: 295,
  桐生: 384,
  桐生清桜: 232,
  桐生工業: 114,
  伊勢崎: 344,
  伊勢崎清明: 230,
  伊勢崎興陽: 212,
  伊勢崎工業: 216,
  伊勢崎商業: 196,
  太田: 247,
  太田東: 253,
  太田女子: 236,
  新田暁: 151,
  太田工業: 106,
  太田フレックス: 160,
  沼田: 192,
  利根実業: 117,
  館林: 140,
  館林女子: 189,
  渋川: 164,
  渋川女子: 196,
  渋川青翠: 103,
  渋川工業: 148,
  藤岡中央: 135,
  藤岡北: 111,
  藤岡工業: 44,
  富岡: 169,
  富岡実業: 116,
  松井田: 34,
  安中総合学園: 168,
  大間々: 94,
  下仁田: 17,
  吾妻中央: 131,
  長野原: 29,
  玉村: 43,
  板倉: 44,
  館林商工: 113,
  西邑楽: 169,
  大泉: 172,
  市立前橋: 270,
  高崎経済大学附属: 347,
  桐生市立商業: 207,
  市立太田: 158,
  利根商業: 36,
};

describe('群馬県 倍率パイプラインα（Y-6・全日制+フレックス60校106レコード・coverage=partial）', () => {
  const { records } = GUNMA_COMPETITION_RATES;

  it('各校の学科別内訳合計がPDF記載の学校別志願者数(D列)と完全一致する（60校全件）', () => {
    for (const [schoolName, expectedApplicants] of Object.entries(SCHOOL_LEVEL_APPLICANTS)) {
      const sum = records.filter((r) => r.schoolName === schoolName).reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(sum).toBe(expectedApplicants);
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

  it('coverageがpartialを示している（連携型選抜実施校3校のquota分離不能のため）', () => {
    expect(GUNMA_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('106レコード・60校が収録されている（連携型選抜実施校の尾瀬・万場・嬬恋は対象外）', () => {
    expect(records.length).toBe(106);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(60);
    for (const excluded of ['尾瀬', '万場', '嬬恋']) {
      expect(records.some((r) => r.schoolName === excluded)).toBe(false);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of GUNMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.gunma\.jp\//);
    }
  });
});
