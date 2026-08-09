import {
  sumMonthlyFees,
  sumOneTimeFees,
  sumAnnualFees,
  findDuplicateOrMissingTuitionCodes,
  type PrivateSchoolTuition,
} from '@/lib/private-school-tuition';
import { PRIVATE_SCHOOL_TUITION_TOTTORI } from '@/data/private-school-tuition/tottori';
import { PRIVATE_SCHOOL_TUITION_TOKUSHIMA } from '@/data/private-school-tuition/tokushima';
import { PRIVATE_SCHOOL_TUITION_AKITA } from '@/data/private-school-tuition/akita';
import { PRIVATE_SCHOOL_TUITION_FUKUI } from '@/data/private-school-tuition/fukui';
import { PRIVATE_SCHOOL_TUITION_KOCHI } from '@/data/private-school-tuition/kochi';
import { PRIVATE_SCHOOL_TUITION_SAGA } from '@/data/private-school-tuition/saga';
import { PRIVATE_SCHOOL_TUITION_BY_PREFECTURE, PRIVATE_SCHOOL_TUITION_FILES } from '@/data/private-school-tuition';
import { SCHOOLS_PRIVATE_TOTTORI } from '@/data/schools-private/tottori';
import { SCHOOLS_PRIVATE_TOKUSHIMA } from '@/data/schools-private/tokushima';
import { SCHOOLS_PRIVATE_AKITA } from '@/data/schools-private/akita';
import { SCHOOLS_PRIVATE_FUKUI } from '@/data/schools-private/fukui';
import { SCHOOLS_PRIVATE_KOCHI } from '@/data/schools-private/kochi';
import { SCHOOLS_PRIVATE_SAGA } from '@/data/schools-private/saga';

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

describe('PRIVATE_SCHOOL_TUITION_AKITA(掛-3横展開3県目・入学金内訳のみ収録し授業料額は未確認と明示)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_AKITA.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('schools-private/akita.tsの全5校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_AKITA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_AKITA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録1校+スキップ4校', () => {
    expect(PRIVATE_SCHOOL_TUITION_AKITA.schools.length).toBe(1);
    expect(PRIVATE_SCHOOL_TUITION_AKITA.skipped.length).toBe(4);
  });

  it('秋田令和高等学校: 入学手続き納付金内訳合計(220,000円)が募集要項PDFの記載と一致し、授業料額は未確認のためhasUnspecifiedAdditionalFees=true', () => {
    const reiwa = PRIVATE_SCHOOL_TUITION_AKITA.schools.find((s) => s.schoolName === '秋田令和高等学校')!;
    expect(sumOneTimeFees(reiwa)).toBe(220000);
    expect(sumMonthlyFees(reiwa)).toBe(0);
    expect(reiwa.hasUnspecifiedAdditionalFees).toBe(true);
  });
});

describe('PRIVATE_SCHOOL_TUITION_FUKUI(掛-3横展開4県目・1校4コースのコース別レコード)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_FUKUI.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('schools-private/fukui.tsの全8校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_FUKUI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録4レコード(1校・4コース)+スキップ7校', () => {
    expect(PRIVATE_SCHOOL_TUITION_FUKUI.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_TUITION_FUKUI.skipped.length).toBe(7);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_TUITION_FUKUI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(1);
  });

  it('仁愛女子高等学校: 商業／進学コースの月額合計(58,400円)と特別進学コースの月額合計(70,650円)が原資料の①+④欄と一致する', () => {
    const shogyo = PRIVATE_SCHOOL_TUITION_FUKUI.schools.find((s) => s.courseName === '商業／進学コース')!;
    const tokushin = PRIVATE_SCHOOL_TUITION_FUKUI.schools.find((s) => s.courseName === '特別進学コース')!;
    expect(sumMonthlyFees(shogyo)).toBe(58400);
    expect(sumMonthlyFees(tokushin)).toBe(70650);
    expect(sumOneTimeFees(shogyo)).toBe(5650);
    expect(sumOneTimeFees(tokushin)).toBe(5650);
  });

  it('4コースとも入学金5,650円は共通', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_FUKUI.schools) {
      expect(sumOneTimeFees(school)).toBe(5650);
    }
  });
});

describe('PRIVATE_SCHOOL_TUITION_KOCHI(掛-3横展開5県目)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_KOCHI.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('schools-private/kochi.tsの全9校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KOCHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_KOCHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録3レコード(土佐塾2コース+高知学芸1校)+スキップ7校', () => {
    expect(PRIVATE_SCHOOL_TUITION_KOCHI.schools.length).toBe(3);
    expect(PRIVATE_SCHOOL_TUITION_KOCHI.skipped.length).toBe(7);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_TUITION_KOCHI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(2);
  });

  it('高知学芸高等学校: 入学時費用合計211,300円・月額費用合計38,550円が原資料の合計表記と一致する', () => {
    const gakugei = PRIVATE_SCHOOL_TUITION_KOCHI.schools.find((s) => s.schoolName === '高知学芸高等学校')!;
    expect(sumOneTimeFees(gakugei)).toBe(211300);
    expect(sumMonthlyFees(gakugei)).toBe(38550);
  });

  it('土佐塾高等学校: まなび創造コースは普通科より月額10,000円高い', () => {
    const futsuu = PRIVATE_SCHOOL_TUITION_KOCHI.schools.find((s) => s.courseName === '普通科')!;
    const manabi = PRIVATE_SCHOOL_TUITION_KOCHI.schools.find((s) => s.courseName === 'まなび創造コース')!;
    expect(sumMonthlyFees(manabi) - sumMonthlyFees(futsuu)).toBe(10000);
    expect(sumOneTimeFees(futsuu)).toBe(350000);
  });
});

describe('PRIVATE_SCHOOL_TUITION_SAGA(掛-3横展開6県目・annual/monthly/one_timeが混在する学校を含む)', () => {
  it('収録校は全てfeesが非空でamountが正の数', () => {
    for (const school of PRIVATE_SCHOOL_TUITION_SAGA.schools) {
      expect(school.fees.length).toBeGreaterThan(0);
      for (const fee of school.fees) {
        expect(fee.amount).toBeGreaterThan(0);
      }
    }
  });

  it('schools-private/saga.tsの全9校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SAGA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingTuitionCodes(PRIVATE_SCHOOL_TUITION_SAGA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録4レコード(龍谷2コース+弘学館+早稲田佐賀)+スキップ6校', () => {
    expect(PRIVATE_SCHOOL_TUITION_SAGA.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_TUITION_SAGA.skipped.length).toBe(6);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_TUITION_SAGA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(3);
  });

  it('龍谷高等学校: 特別進学コースは基本コースより教育充実費が高く月額合計も高い', () => {
    const kihon = PRIVATE_SCHOOL_TUITION_SAGA.schools.find((s) => s.courseName === '文理進学・総合・保育コース')!;
    const tokushin = PRIVATE_SCHOOL_TUITION_SAGA.schools.find((s) => s.courseName === '特別進学コース')!;
    expect(sumMonthlyFees(kihon)).toBe(50900);
    expect(sumMonthlyFees(tokushin)).toBe(55400);
  });

  it('弘学館高等学校: 学校月納金の内訳合計(68,100円)が公式サイトの合計表記と一致する', () => {
    const kogakukan = PRIVATE_SCHOOL_TUITION_SAGA.schools.find((s) => s.schoolName === '弘学館高等学校')!;
    expect(sumMonthlyFees(kogakukan)).toBe(68100);
    expect(sumOneTimeFees(kogakukan)).toBe(250000);
    expect(sumAnnualFees(kogakukan)).toBe(110000);
  });

  it('早稲田佐賀高等学校: 年額費目合計(885,400円)が公式サイトの合計表記と一致する', () => {
    const waseda = PRIVATE_SCHOOL_TUITION_SAGA.schools.find((s) => s.schoolName === '早稲田佐賀高等学校')!;
    expect(sumAnnualFees(waseda)).toBe(885400);
    expect(sumOneTimeFees(waseda)).toBe(110000);
  });
});

describe('PRIVATE_SCHOOL_TUITION_BY_PREFECTURE / PRIVATE_SCHOOL_TUITION_FILES', () => {
  it('tottori・tokushima・akita・fukui・kochi・sagaが登録されている', () => {
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.tottori).toBe(PRIVATE_SCHOOL_TUITION_TOTTORI);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.tokushima).toBe(PRIVATE_SCHOOL_TUITION_TOKUSHIMA);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.akita).toBe(PRIVATE_SCHOOL_TUITION_AKITA);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.fukui).toBe(PRIVATE_SCHOOL_TUITION_FUKUI);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.kochi).toBe(PRIVATE_SCHOOL_TUITION_KOCHI);
    expect(PRIVATE_SCHOOL_TUITION_BY_PREFECTURE.saga).toBe(PRIVATE_SCHOOL_TUITION_SAGA);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_TOTTORI);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_TOKUSHIMA);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_AKITA);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_FUKUI);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_KOCHI);
    expect(PRIVATE_SCHOOL_TUITION_FILES).toContain(PRIVATE_SCHOOL_TUITION_SAGA);
  });
});
