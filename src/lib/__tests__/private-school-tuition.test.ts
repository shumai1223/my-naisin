import {
  sumMonthlyFees,
  sumOneTimeFees,
  sumAnnualFees,
  findDuplicateOrMissingTuitionCodes,
  type PrivateSchoolTuition,
} from '@/lib/private-school-tuition';
import { PRIVATE_SCHOOL_TUITION_TOTTORI } from '@/data/private-school-tuition/tottori';
import { PRIVATE_SCHOOL_TUITION_BY_PREFECTURE, PRIVATE_SCHOOL_TUITION_FILES } from '@/data/private-school-tuition';
import { SCHOOLS_PRIVATE_TOTTORI } from '@/data/schools-private/tottori';

describe('sumMonthlyFees / sumOneTimeFees / sumAnnualFees', () => {
  const base: PrivateSchoolTuition = {
    schoolCode: 'D000000000000',
    schoolName: 'テスト高等学校',
    fiscalYearLabel: '令和8年度',
    fees: [
      { label: '入学金', amount: 100000, billingCycle: 'one_time' },
      { label: '授業料', amount: 30000, billingCycle: 'monthly' },
      { label: '教育振興費', amount: 5000, billingCycle: 'monthly' },
      { label: '施設費(年額)', amount: 60000, billingCycle: 'annual' },
    ],
    hasUnspecifiedAdditionalFees: false,
    source: { url: 'https://example.com', docTitle: 'テスト', fetchedAt: '2026-08-09', sourceTier: 'primary' },
  };

  it('billingCycle別に正しく集計する', () => {
    expect(sumOneTimeFees(base)).toBe(100000);
    expect(sumMonthlyFees(base)).toBe(35000);
    expect(sumAnnualFees(base)).toBe(60000);
  });

  it('該当する費目が無ければ0を返す', () => {
    expect(sumAnnualFees({ ...base, fees: base.fees.filter((f) => f.billingCycle !== 'annual') })).toBe(0);
  });
});

describe('findDuplicateOrMissingTuitionCodes', () => {
  it('重複・欠落が無ければ両方空配列', () => {
    const file = {
      prefectureCode: 'x',
      schools: [{ schoolCode: 'A' } as PrivateSchoolTuition],
      skipped: [{ schoolCode: 'B', schoolName: '', reason: '' }],
    };
    const result = findDuplicateOrMissingTuitionCodes(file, ['A', 'B']);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('schoolsとskippedに同じコードがあれば重複検出', () => {
    const file = {
      prefectureCode: 'x',
      schools: [{ schoolCode: 'A' } as PrivateSchoolTuition],
      skipped: [{ schoolCode: 'A', schoolName: '', reason: '' }],
    };
    const result = findDuplicateOrMissingTuitionCodes(file, ['A']);
    expect(result.duplicates).toEqual(['A']);
  });

  it('参照台帳に存在するが収録もスキップもされていないコードを欠落として検出', () => {
    const file = { prefectureCode: 'x', schools: [], skipped: [] };
    const result = findDuplicateOrMissingTuitionCodes(file, ['A', 'B']);
    expect(result.missing).toEqual(['A', 'B']);
  });
});

describe('PRIVATE_SCHOOL_TUITION_TOTTORI(掛-3パイロット県・私立学費第一段)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_TOTTORI.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('private-school-detail/tottori.tsで到達済みの4校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const reachedCodes = [
      'D131310000025', // 鳥取城北
      'D131310000052', // 米子松蔭
      'D131310000070', // 湯梨浜学園
      'D131310000016', // 鳥取敬愛
    ];
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_TOTTORI, reachedCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録1校+スキップ3校', () => {
    expect(PRIVATE_SCHOOL_TUITION_TOTTORI.schools.length).toBe(1);
    expect(PRIVATE_SCHOOL_TUITION_TOTTORI.skipped.length).toBe(3);
  });

  it('鳥取城北高等学校: 月額費目の内訳合計(50,000円)が公表の月額納付金と一致し、入学金100,000円を収録', () => {
    const johoku = PRIVATE_SCHOOL_TUITION_TOTTORI.schools.find((s) => s.schoolName === '鳥取城北高等学校')!;
    expect(sumOneTimeFees(johoku)).toBe(100000);
    expect(sumMonthlyFees(johoku)).toBe(50000);
    expect(johoku.hasUnspecifiedAdditionalFees).toBe(true);
    expect(johoku.source.sourceTier).toBe('primary');
  });

  it('スキップ校はschools-private/tottori.tsに実在するschoolCodeを参照している', () => {
    const allCodes = new Set(SCHOOLS_PRIVATE_TOTTORI.schools.map((s) => s.code));
    for (const skip of PRIVATE_SCHOOL_TUITION_TOTTORI.skipped) {
      expect(allCodes.has(skip.schoolCode)).toBe(true);
    }
  });
});

describe('PRIVATE_SCHOOL_TUITION_BY_PREFECTURE / PRIVATE_SCHOOL_TUITION_FILES', () => {
  it('tottoriが登録されている', () => {
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.tottori).toBe(PRIVATE_SCHOOL_TUITION_TOTTORI);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_TOTTORI);
  });
});
