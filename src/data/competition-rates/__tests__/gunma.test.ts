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

const R7_SCHOOL_LEVEL_APPLICANTS: Record<string, number> = {
  前橋: 313,
  前橋南: 208,
  前橋西: 153,
  前橋女子: 335,
  前橋東: 227,
  勢多農林: 211,
  前橋工業: 244,
  前橋商業: 322,
  前橋清陵: 121,
  高崎: 368,
  高崎東: 182,
  高崎北: 283,
  榛名: 51,
  高崎女子: 325,
  吉井: 106,
  高崎工業: 281,
  高崎商業: 352,
  桐生: 358,
  桐生清桜: 236,
  桐生工業: 152,
  伊勢崎: 308,
  伊勢崎清明: 216,
  伊勢崎興陽: 226,
  伊勢崎工業: 207,
  伊勢崎商業: 236,
  太田: 289,
  太田東: 256,
  太田女子: 255,
  新田暁: 155,
  太田工業: 129,
  太田フレックス: 138,
  沼田: 223,
  利根実業: 118,
  館林: 196,
  館林女子: 187,
  渋川: 172,
  渋川女子: 190,
  渋川青翠: 115,
  渋川工業: 142,
  藤岡中央: 164,
  藤岡北: 101,
  藤岡工業: 54,
  富岡: 211,
  富岡実業: 122,
  松井田: 31,
  安中総合学園: 198,
  大間々: 104,
  下仁田: 31,
  吾妻中央: 145,
  長野原: 33,
  玉村: 55,
  板倉: 52,
  館林商工: 146,
  西邑楽: 179,
  大泉: 144,
  市立前橋: 293,
  高崎経済大学附属: 324,
  桐生市立商業: 246,
  市立太田: 161,
  利根商業: 45,
};

const R6_SCHOOL_LEVEL_APPLICANTS: Record<string, number> = {
  前橋: 337,
  前橋南: 219,
  前橋西: 172,
  前橋女子: 305,
  前橋東: 200,
  勢多農林: 237,
  前橋工業: 254,
  前橋商業: 345,
  前橋清陵: 150,
  高崎: 348,
  高崎東: 167,
  高崎北: 274,
  榛名: 65,
  高崎女子: 321,
  吉井: 124,
  高崎工業: 275,
  高崎商業: 325,
  桐生: 407,
  桐生清桜: 255,
  桐生工業: 165,
  伊勢崎: 303,
  伊勢崎清明: 218,
  伊勢崎興陽: 203,
  伊勢崎工業: 193,
  伊勢崎商業: 252,
  太田: 287,
  太田東: 213,
  太田女子: 263,
  新田暁: 170,
  太田工業: 143,
  太田フレックス: 181,
  沼田: 115,
  沼田女子: 102,
  利根実業: 101,
  館林: 179,
  館林女子: 172,
  渋川: 183,
  渋川女子: 221,
  渋川青翠: 152,
  渋川工業: 124,
  藤岡中央: 165,
  藤岡北: 118,
  藤岡工業: 74,
  富岡: 208,
  富岡実業: 123,
  松井田: 56,
  安中総合学園: 204,
  大間々: 131,
  下仁田: 13,
  吾妻中央: 141,
  長野原: 22,
  玉村: 76,
  板倉: 49,
  館林商工: 121,
  西邑楽: 190,
  大泉: 169,
  市立前橋: 240,
  高崎経済大学附属: 333,
  桐生市立商業: 297,
  市立太田: 182,
  利根商業: 73,
};

const R5_SCHOOL_LEVEL_APPLICANTS: Record<string, number> = {
  前橋: 230,
  前橋南: 129,
  前橋西: 106,
  前橋女子: 242,
  前橋東: 117,
  勢多農林: 99,
  前橋工業: 129,
  前橋商業: 141,
  前橋清陵: 79,
  高崎: 234,
  高崎東: 115,
  高崎北: 198,
  榛名: 19,
  高崎女子: 256,
  吉井: 36,
  高崎工業: 154,
  高崎商業: 102,
  桐生: 226,
  桐生清桜: 143,
  桐生工業: 73,
  伊勢崎: 177,
  伊勢崎清明: 135,
  伊勢崎興陽: 116,
  伊勢崎工業: 83,
  伊勢崎商業: 101,
  太田: 210,
  太田東: 143,
  太田女子: 151,
  新田暁: 108,
  太田工業: 71,
  太田フレックス: 52,
  沼田: 36,
  尾瀬: 0,
  沼田女子: 48,
  利根実業: 43,
  館林: 93,
  館林女子: 90,
  渋川: 93,
  渋川女子: 108,
  渋川青翠: 78,
  渋川工業: 69,
  藤岡中央: 71,
  藤岡北: 70,
  藤岡工業: 15,
  富岡: 91,
  富岡実業: 59,
  松井田: 15,
  安中総合学園: 107,
  大間々: 70,
  万場: 3,
  下仁田: 6,
  吾妻中央: 62,
  長野原: 3,
  嬬恋: 0,
  玉村: 37,
  板倉: 23,
  館林商工: 70,
  西邑楽: 77,
  大泉: 77,
  市立前橋: 137,
  高崎経済大学附属: 217,
  桐生市立商業: 123,
  市立太田: 84,
  利根商業: 26,
};

describe('群馬県 倍率パイプラインα（Y-6・全日制+フレックス60校106レコード・coverage=partial）', () => {
  const { records } = GUNMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('各校の学科別内訳合計がPDF記載の学校別志願者数(D列)と完全一致する（60校全件）', () => {
    for (const [schoolName, expectedApplicants] of Object.entries(SCHOOL_LEVEL_APPLICANTS)) {
      const sum = r8.filter((r) => r.schoolName === schoolName).reduce((acc, r) => acc + r.finalApplicants, 0);
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

  it('coverageがpartialを示している（連携型選抜実施校3校のquota分離不能のため）', () => {
    expect(GUNMA_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('106レコード・60校が収録されている（連携型選抜実施校の尾瀬・万場・嬬恋は対象外）', () => {
    expect(r8.length).toBe(106);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(60);
    for (const excluded of ['尾瀬', '万場', '嬬恋']) {
      expect(r8.some((r) => r.schoolName === excluded)).toBe(false);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが106件・60校収録され、各校のD列合計が完全一致する。太田工業のみ機械・電子機械がくくり募集(quota120)のため単一レコードに統合(R8では機械単独quota80で規模が異なるが誤読ではなくそのまま転記)。連携型選抜実施校3校(尾瀬・万場・嬬恋)はR7でも対象外だが、機械集計との差分(quota152・applicants42)が3校の内訳(尾瀬64/21・万場44/11・嬬恋44/10)と完全一致することを確認済み(捏造なしにquotaを分離できないためR8と同じ理由で収録を見送った)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(106);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(60);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(11283);
    expect(sumApplicants).toBe(11425);

    for (const [schoolName, expectedApplicants] of Object.entries(R7_SCHOOL_LEVEL_APPLICANTS)) {
      const sum = r7.filter((r) => r.schoolName === schoolName).reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(sum).toBe(expectedApplicants);
    }
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが107件・61校収録され(沼田女子は令和7年度4月に沼田高校と統合されたため令和6年度のみ実在する学校とWebSearchで裏取り確認済み)、各校のD列相当の合計が完全一致する。連携型選抜実施校3校(尾瀬・万場・嬬恋)はR6でも対象外で、機械集計との差分(quota192・applicants39)は3校分と整合的(R7の差分152/42・R8の差分152/47と同じ桁数)', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(107);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(61);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(11565);
    expect(sumApplicants).toBe(11705);

    for (const [schoolName, expectedApplicants] of Object.entries(R6_SCHOOL_LEVEL_APPLICANTS)) {
      const sum = r6.filter((r) => r.schoolName === schoolName).reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(sum).toBe(expectedApplicants);
    }

    for (const excluded of ['尾瀬', '万場', '嬬恋']) {
      expect(r6.some((r) => r.schoolName === excluded)).toBe(false);
    }
  });

  it('沼田女子（令和6年度のみ実在・令和7年度4月に沼田高校と統合）が正しく収録されている', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const numatajoshi = r6.filter((r) => r.schoolName === '沼田女子');
    expect(numatajoshi).toEqual([
      { schoolName: '沼田女子', department: '普通', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
      { schoolName: '沼田女子', department: '普通（英数）', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    ]);
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.some((r) => r.schoolName === '沼田女子')).toBe(false);
  });

  it('掛-1(学校別×多年度・4年度目): 令和5年度(R5)分レコードが113件・64校収録され、各校のD列相当の合計が完全一致する。R5は前期/後期選抜の二段階制度だった最後の年度で、本一次資料は後期選抜分のみ掲載(quota=印字済み学科等別倍率の分母である後期学科等別募集人員)。R6-R8と異なり尾瀬・万場・嬬恋(連携型選抜実施校)も本文に直接データが記載されていたため3校とも収録し、機械集計(quota合計・applicants合計)がPDF末尾のグランドトータル(11,838/11,838/6,344/6,344/3,481/2,795/6,276/0.99/6,276/0.99の該当列=後期学科等別募集人員6,344・学科等別志願者数計6,276)と完全一致することを確認済み', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(113);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(64);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(6344);
    expect(sumApplicants).toBe(6276);

    for (const [schoolName, expectedApplicants] of Object.entries(R5_SCHOOL_LEVEL_APPLICANTS)) {
      const sum = r5.filter((r) => r.schoolName === schoolName).reduce((acc, r) => acc + r.finalApplicants, 0);
      expect(sum).toBe(expectedApplicants);
    }

    for (const included of ['尾瀬', '万場', '嬬恋']) {
      expect(r5.some((r) => r.schoolName === included)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of GUNMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.gunma\.jp\//);
    }
  });
});
