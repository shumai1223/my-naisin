import {
  sumMonthlyFees,
  sumOneTimeFees,
  sumAnnualFees,
  findDuplicateOrMissingTuitionCodes,
  type PrivateSchoolTuition,
} from '@/lib/private-school-tuition';
import { PRIVATE_SCHOOL_TUITION_TOTTORI } from '@/data/private-school-tuition/tottori';
import { PRIVATE_SCHOOL_TUITION_TOKUSHIMA } from '@/data/private-school-tuition/tokushima';
import { PRIVATE_SCHOOL_TUITION_BY_PREFECTURE, PRIVATE_SCHOOL_TUITION_FILES } from '@/data/private-school-tuition';
import { SCHOOLS_PRIVATE_TOTTORI } from '@/data/schools-private/tottori';
import { SCHOOLS_PRIVATE_TOKUSHIMA } from '@/data/schools-private/tokushima';

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

  it('同一schoolCodeがschools内に複数回出現しても重複扱いしない(入試区分等の正当な複数プラン)', () => {
    const file = {
      prefectureCode: 'x',
      schools: [{ schoolCode: 'A' } as PrivateSchoolTuition, { schoolCode: 'A' } as PrivateSchoolTuition],
      skipped: [],
    };
    const result = findDuplicateOrMissingTuitionCodes(file, ['A']);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
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

describe('PRIVATE_SCHOOL_TUITION_TOKUSHIMA(掛-3横展開2県目・入試区分で複数レコードを持つ学校を含む)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('schools-private/tokushima.tsの全5校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOKUSHIMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_TOKUSHIMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録4レコード(3校・うち生光学園は前期/後期の2レコード)+スキップ2校', () => {
    expect(PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_TUITION_TOKUSHIMA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(3);
  });

  it('徳島文理高等学校: 月額費目の内訳合計(58,000円)が公式サイトの合計表記と一致し、入学金200,000円+保護者会入会金3,000円を収録', () => {
    const bunri = PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools.find((s) => s.schoolName === '徳島文理高等学校')!;
    expect(sumOneTimeFees(bunri)).toBe(203000);
    expect(sumMonthlyFees(bunri)).toBe(58000);
  });

  it('生光学園高等学校: 前期(入学金250,000円)/後期(入学金350,000円)の2レコードとも月額47,500円は共通', () => {
    const seiko = PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools.filter((s) => s.schoolCode === 'D136320100037');
    expect(seiko.length).toBe(2);
    const zenki = seiko.find((s) => s.courseName === '前期入試合格者')!;
    const kouki = seiko.find((s) => s.courseName === '後期入試合格者')!;
    expect(sumOneTimeFees(zenki)).toBe(250000);
    expect(sumOneTimeFees(kouki)).toBe(350000);
    expect(sumMonthlyFees(zenki)).toBe(47500);
    expect(sumMonthlyFees(kouki)).toBe(47500);
  });

  it('みのり高等学校(通信制): 入学金不要のため一時金費目は入学検定料のみ・単位制授業料はhasUnspecifiedAdditionalFeesで明示', () => {
    const minori = PRIVATE_SCHOOL_TUITION_TOKUSHIMA.schools.find((s) => s.schoolName === 'みのり高等学校')!;
    expect(sumOneTimeFees(minori)).toBe(10000);
    expect(sumAnnualFees(minori)).toBe(86000);
    expect(minori.hasUnspecifiedAdditionalFees).toBe(true);
    expect(minori.fees.some((f) => f.label === '入学金')).toBe(false);
  });
});

describe('PRIVATE_SCHOOL_TUITION_BY_PREFECTURE / PRIVATE_SCHOOL_TUITION_FILES', () => {
  it('tottori・tokushimaが登録されている', () => {
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.tottori).toBe(PRIVATE_SCHOOL_TUITION_TOTTORI);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.tokushima).toBe(PRIVATE_SCHOOL_TUITION_TOKUSHIMA);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_TOTTORI);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_TOKUSHIMA);
  });
});
