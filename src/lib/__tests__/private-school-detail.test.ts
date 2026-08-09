import { checkCourseCapacitySum, findDuplicateOrMissingCodes, type PrivateSchoolDetail } from '@/lib/private-school-detail';
import { PRIVATE_SCHOOL_DETAIL_FUKUSHIMA } from '@/data/private-school-detail/fukushima';
import { SCHOOLS_PRIVATE_FUKUSHIMA } from '@/data/schools-private/fukushima';
import { PRIVATE_SCHOOL_DETAIL_TOTTORI } from '@/data/private-school-detail/tottori';
import { PRIVATE_SCHOOL_DETAIL_FUKUI } from '@/data/private-school-detail/fukui';
import { PRIVATE_SCHOOL_DETAIL_YAMANASHI } from '@/data/private-school-detail/yamanashi';
import { PRIVATE_SCHOOL_DETAIL_KOCHI } from '@/data/private-school-detail/kochi';
import { PRIVATE_SCHOOL_DETAIL_SAGA } from '@/data/private-school-detail/saga';
import { PRIVATE_SCHOOL_DETAIL_TOKUSHIMA } from '@/data/private-school-detail/tokushima';
import { PRIVATE_SCHOOL_DETAIL_NAGASAKI } from '@/data/private-school-detail/nagasaki';
import { PRIVATE_SCHOOL_DETAIL_AKITA } from '@/data/private-school-detail/akita';
import { PRIVATE_SCHOOL_DETAIL_SHIMANE } from '@/data/private-school-detail/shimane';
import { PRIVATE_SCHOOL_DETAIL_TOYAMA } from '@/data/private-school-detail/toyama';
import { PRIVATE_SCHOOL_DETAIL_WAKAYAMA } from '@/data/private-school-detail/wakayama';
import { PRIVATE_SCHOOL_DETAIL_SHIGA } from '@/data/private-school-detail/shiga';
import { PRIVATE_SCHOOL_DETAIL_OKINAWA } from '@/data/private-school-detail/okinawa';
import { PRIVATE_SCHOOL_DETAIL_ISHIKAWA } from '@/data/private-school-detail/ishikawa';
import { PRIVATE_SCHOOL_DETAIL_KAGAWA } from '@/data/private-school-detail/kagawa';
import { PRIVATE_SCHOOL_DETAIL_MIYAZAKI } from '@/data/private-school-detail/miyazaki';
import { PRIVATE_SCHOOL_DETAIL_TOCHIGI } from '@/data/private-school-detail/tochigi';
import { PRIVATE_SCHOOL_DETAIL_IWATE } from '@/data/private-school-detail/iwate';
import { PRIVATE_SCHOOL_DETAIL_CHIBA } from '@/data/private-school-detail/chiba';
import { PRIVATE_SCHOOL_DETAIL_OKAYAMA } from '@/data/private-school-detail/okayama';
import { PRIVATE_SCHOOL_DETAIL_SHIZUOKA } from '@/data/private-school-detail/shizuoka';
import { PRIVATE_SCHOOL_DETAIL_SAITAMA } from '@/data/private-school-detail/saitama';
import { PRIVATE_SCHOOL_DETAIL_FUKUOKA } from '@/data/private-school-detail/fukuoka';
import { PRIVATE_SCHOOL_DETAIL_HYOGO } from '@/data/private-school-detail/hyogo';
import { PRIVATE_SCHOOL_DETAIL_NAGANO } from '@/data/private-school-detail/nagano';
import { PRIVATE_SCHOOL_DETAIL_GIFU } from '@/data/private-school-detail/gifu';
import { PRIVATE_SCHOOL_DETAIL_MIE } from '@/data/private-school-detail/mie';
import { PRIVATE_SCHOOL_DETAIL_AOMORI } from '@/data/private-school-detail/aomori';
import { PRIVATE_SCHOOL_DETAIL_MIYAGI } from '@/data/private-school-detail/miyagi';
import { PRIVATE_SCHOOL_DETAIL_NIIGATA } from '@/data/private-school-detail/niigata';
import { PRIVATE_SCHOOL_DETAIL_KUMAMOTO } from '@/data/private-school-detail/kumamoto';
import { PRIVATE_SCHOOL_DETAIL_OITA } from '@/data/private-school-detail/oita';
import { PRIVATE_SCHOOL_DETAIL_KAGOSHIMA } from '@/data/private-school-detail/kagoshima';
import { PRIVATE_SCHOOL_DETAIL_YAMAGATA } from '@/data/private-school-detail/yamagata';
import { PRIVATE_SCHOOL_DETAIL_GUNMA } from '@/data/private-school-detail/gunma';
import { PRIVATE_SCHOOL_DETAIL_IBARAKI } from '@/data/private-school-detail/ibaraki';
import { PRIVATE_SCHOOL_DETAIL_YAMAGUCHI } from '@/data/private-school-detail/yamaguchi';
import { PRIVATE_SCHOOL_DETAIL_HIROSHIMA } from '@/data/private-school-detail/hiroshima';
import { PRIVATE_SCHOOL_DETAIL_NARA } from '@/data/private-school-detail/nara';
import { PRIVATE_SCHOOL_DETAIL_KYOTO } from '@/data/private-school-detail/kyoto';
import { PRIVATE_SCHOOL_DETAIL_KANAGAWA } from '@/data/private-school-detail/kanagawa';
import { PRIVATE_SCHOOL_DETAIL_OSAKA } from '@/data/private-school-detail/osaka';
import { PRIVATE_SCHOOL_DETAIL_AICHI } from '@/data/private-school-detail/aichi';
import { PRIVATE_SCHOOL_DETAIL_TOKYO } from '@/data/private-school-detail/tokyo';
import { PRIVATE_SCHOOL_DETAIL_EHIME } from '@/data/private-school-detail/ehime';
import { PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE, PRIVATE_SCHOOL_DETAIL_FILES } from '@/data/private-school-detail';
import { SCHOOLS_PRIVATE_TOTTORI } from '@/data/schools-private/tottori';
import { SCHOOLS_PRIVATE_FUKUI } from '@/data/schools-private/fukui';
import { SCHOOLS_PRIVATE_YAMANASHI } from '@/data/schools-private/yamanashi';
import { SCHOOLS_PRIVATE_KOCHI } from '@/data/schools-private/kochi';
import { SCHOOLS_PRIVATE_SAGA } from '@/data/schools-private/saga';
import { SCHOOLS_PRIVATE_TOKUSHIMA } from '@/data/schools-private/tokushima';
import { SCHOOLS_PRIVATE_NAGASAKI } from '@/data/schools-private/nagasaki';
import { SCHOOLS_PRIVATE_AKITA } from '@/data/schools-private/akita';
import { SCHOOLS_PRIVATE_SHIMANE } from '@/data/schools-private/shimane';
import { SCHOOLS_PRIVATE_TOYAMA } from '@/data/schools-private/toyama';
import { SCHOOLS_PRIVATE_WAKAYAMA } from '@/data/schools-private/wakayama';
import { SCHOOLS_PRIVATE_SHIGA } from '@/data/schools-private/shiga';
import { SCHOOLS_PRIVATE_OKINAWA } from '@/data/schools-private/okinawa';
import { SCHOOLS_PRIVATE_ISHIKAWA } from '@/data/schools-private/ishikawa';
import { SCHOOLS_PRIVATE_KAGAWA } from '@/data/schools-private/kagawa';
import { SCHOOLS_PRIVATE_MIYAZAKI } from '@/data/schools-private/miyazaki';
import { SCHOOLS_PRIVATE_TOCHIGI } from '@/data/schools-private/tochigi';
import { SCHOOLS_PRIVATE_IWATE } from '@/data/schools-private/iwate';
import { SCHOOLS_PRIVATE_CHIBA } from '@/data/schools-private/chiba';
import { SCHOOLS_PRIVATE_OKAYAMA } from '@/data/schools-private/okayama';
import { SCHOOLS_PRIVATE_SHIZUOKA } from '@/data/schools-private/shizuoka';
import { SCHOOLS_PRIVATE_SAITAMA } from '@/data/schools-private/saitama';
import { SCHOOLS_PRIVATE_FUKUOKA } from '@/data/schools-private/fukuoka';
import { SCHOOLS_PRIVATE_HYOGO } from '@/data/schools-private/hyogo';
import { SCHOOLS_PRIVATE_NAGANO } from '@/data/schools-private/nagano';
import { SCHOOLS_PRIVATE_GIFU } from '@/data/schools-private/gifu';
import { SCHOOLS_PRIVATE_MIE } from '@/data/schools-private/mie';
import { SCHOOLS_PRIVATE_AOMORI } from '@/data/schools-private/aomori';
import { SCHOOLS_PRIVATE_MIYAGI } from '@/data/schools-private/miyagi';
import { SCHOOLS_PRIVATE_NIIGATA } from '@/data/schools-private/niigata';
import { SCHOOLS_PRIVATE_KUMAMOTO } from '@/data/schools-private/kumamoto';
import { SCHOOLS_PRIVATE_OITA } from '@/data/schools-private/oita';
import { SCHOOLS_PRIVATE_KAGOSHIMA } from '@/data/schools-private/kagoshima';
import { SCHOOLS_PRIVATE_YAMAGATA } from '@/data/schools-private/yamagata';
import { SCHOOLS_PRIVATE_GUNMA } from '@/data/schools-private/gunma';
import { SCHOOLS_PRIVATE_IBARAKI } from '@/data/schools-private/ibaraki';
import { SCHOOLS_PRIVATE_YAMAGUCHI } from '@/data/schools-private/yamaguchi';
import { SCHOOLS_PRIVATE_HIROSHIMA } from '@/data/schools-private/hiroshima';
import { SCHOOLS_PRIVATE_NARA } from '@/data/schools-private/nara';
import { SCHOOLS_PRIVATE_KYOTO } from '@/data/schools-private/kyoto';
import { SCHOOLS_PRIVATE_KANAGAWA } from '@/data/schools-private/kanagawa';
import { SCHOOLS_PRIVATE_OSAKA } from '@/data/schools-private/osaka';
import { SCHOOLS_PRIVATE_AICHI } from '@/data/schools-private/aichi';
import { SCHOOLS_PRIVATE_TOKYO } from '@/data/schools-private/tokyo';
import { SCHOOLS_PRIVATE_EHIME } from '@/data/schools-private/ehime';

describe('checkCourseCapacitySum', () => {
  const base: PrivateSchoolDetail = {
    schoolCode: 'D000000000000',
    schoolName: 'テスト高等学校',
    fiscalYearLabel: '令和8年度',
    courses: [
      { courseName: 'A', capacity: 10 },
      { courseName: 'B', capacity: 20 },
    ],
    totalCapacity: 30,
    source: { url: 'https://example.com', docTitle: 'テスト', fetchedAt: '2026-07-30' },
  };

  it('courses合計とtotalCapacityが一致すればtrue', () => {
    expect(checkCourseCapacitySum(base)).toBe(true);
  });

  it('courses合計とtotalCapacityが不一致ならfalse', () => {
    expect(checkCourseCapacitySum({ ...base, totalCapacity: 31 })).toBe(false);
  });

  it('coursesが空なら常にtrue(単一定員扱い)', () => {
    expect(checkCourseCapacitySum({ ...base, courses: [], totalCapacity: 999 })).toBe(true);
  });
});

describe('findDuplicateOrMissingCodes', () => {
  it('重複・欠落が無ければ両方空配列', () => {
    const file = {
      prefectureCode: 'x',
      schools: [{ schoolCode: 'A' } as PrivateSchoolDetail],
      skipped: [{ schoolCode: 'B', schoolName: '', reason: '' }],
    };
    const result = findDuplicateOrMissingCodes(file, ['A', 'B']);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('schoolsとskippedに同じコードがあれば重複検出', () => {
    const file = {
      prefectureCode: 'x',
      schools: [{ schoolCode: 'A' } as PrivateSchoolDetail],
      skipped: [{ schoolCode: 'A', schoolName: '', reason: '' }],
    };
    const result = findDuplicateOrMissingCodes(file, ['A']);
    expect(result.duplicates).toEqual(['A']);
  });

  it('参照台帳に存在するが収録もスキップもされていないコードを欠落として検出', () => {
    const file = { prefectureCode: 'x', schools: [], skipped: [] };
    const result = findDuplicateOrMissingCodes(file, ['A', 'B']);
    expect(result.missing).toEqual(['A', 'B']);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_TOTTORI(パイロット実データ)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOTTORI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/tottori.tsの全8校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOTTORI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOTTORI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録7レコード(5校+掛-2多年度2レコード)+スキップ3校で参照台帳の8校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.length).toBe(7);
    expect(PRIVATE_SCHOOL_DETAIL_TOTTORI.skipped.length).toBe(3);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(5);
  });

  it('掛-2(私立×多年度): 米子松蔭2025年度と鳥取城北令和6年度は、令和8年度と定員・コース構成が完全に同一', () => {
    const matsukageR7 = PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.find(
      (s) => s.schoolCode === 'D131310000052' && s.fiscalYearLabel === '2025年度'
    )!;
    const matsukageR8 = PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.find(
      (s) => s.schoolCode === 'D131310000052' && s.fiscalYearLabel === '2026年度'
    )!;
    expect(matsukageR7.totalCapacity).toBe(matsukageR8.totalCapacity);
    expect(matsukageR7.courses).toEqual(matsukageR8.courses);

    const johokuR6 = PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.find(
      (s) => s.schoolCode === 'D131310000025' && s.fiscalYearLabel === '令和6年度'
    )!;
    const johokuR8 = PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.find(
      (s) => s.schoolCode === 'D131310000025' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(johokuR6.totalCapacity).toBe(johokuR8.totalCapacity);
    expect(johokuR6.courses).toEqual(johokuR8.courses);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_FUKUI', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_FUKUI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/fukui.tsの全8校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_FUKUI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録4校+スキップ4校で参照台帳の8校と一致する(旧版のpoppler未導入前提は誤りと判明しPyMuPDFで解禁)', () => {
    expect(PRIVATE_SCHOOL_DETAIL_FUKUI.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUI.skipped.length).toBe(4);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_YAMANASHI(パイロット実データ)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_YAMANASHI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/yamanashi.tsの全11校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_YAMANASHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_YAMANASHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録1校+スキップ10校で参照台帳の11校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_YAMANASHI.schools.length).toBe(1);
    expect(PRIVATE_SCHOOL_DETAIL_YAMANASHI.skipped.length).toBe(10);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KOCHI(パイロット実データ)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KOCHI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/kochi.tsの全9校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KOCHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KOCHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録8レコード(4校+掛-2多年度4レコード)+スキップ5校で参照台帳の9校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KOCHI.schools.length).toBe(8);
    expect(PRIVATE_SCHOOL_DETAIL_KOCHI.skipped.length).toBe(5);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_KOCHI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(4);
  });

  it('掛-2(私立×多年度): 太平洋学園・土佐塾・高知学芸・土佐高等学校の4校とも令和7年度と令和8年度で定員が完全に同一', () => {
    const codes = ['D139310000090', 'D139310000081', 'D139310000054', 'D139310000018'];
    for (const code of codes) {
      const r7 = PRIVATE_SCHOOL_DETAIL_KOCHI.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和7年度')!;
      const r8 = PRIVATE_SCHOOL_DETAIL_KOCHI.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度')!;
      expect(r7.totalCapacity).toBe(r8.totalCapacity);
      expect(r7.courses).toEqual(r8.courses);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_SAGA(パイロット実データ・県庁一次資料で9校全校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_SAGA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/saga.tsの全9校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SAGA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_SAGA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('9校全てを収録しスキップ0件(県庁一次資料が全校を1枚で公表していたため)＋掛-2多年度9レコード', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SAGA.schools.length).toBe(18);
    expect(PRIVATE_SCHOOL_DETAIL_SAGA.skipped.length).toBe(0);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_SAGA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(9);
  });

  it('掛-2(私立×多年度): 龍谷・佐賀女子・敬徳・東明館の4校は令和7→令和8年度で定員が完全に同一', () => {
    const unchangedCodes = ['D141390000016', 'D141390000034', 'D141390000061', 'D141390000089'];
    for (const code of unchangedCodes) {
      const r7 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和7年度')!;
      const r8 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度')!;
      expect(r7.totalCapacity).toBe(r8.totalCapacity);
    }
  });

  it('掛-2(私立×多年度): 佐賀学園(255→260)・北陵(220→215)は令和7→令和8年度で定員が実際に変化していた', () => {
    const gakuenR7 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find(
      (s) => s.schoolCode === 'D141390000043' && s.fiscalYearLabel === '令和7年度'
    )!;
    const gakuenR8 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find(
      (s) => s.schoolCode === 'D141390000043' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(gakuenR7.totalCapacity).toBe(255);
    expect(gakuenR8.totalCapacity).toBe(260);

    const hokuryoR7 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find(
      (s) => s.schoolCode === 'D141390000052' && s.fiscalYearLabel === '令和7年度'
    )!;
    const hokuryoR8 = PRIVATE_SCHOOL_DETAIL_SAGA.schools.find(
      (s) => s.schoolCode === 'D141390000052' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(hokuryoR7.totalCapacity).toBe(220);
    expect(hokuryoR8.totalCapacity).toBe(215);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_TOKUSHIMA(パイロット実データ)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/tokushima.tsの全5校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOKUSHIMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録4レコード(3校+掛-2多年度1レコード)+スキップ2校で参照台帳の5校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(3);
  });

  it('掛-2(私立×多年度): 生光学園令和7年度は令和8年度と総定員が完全に同一(200名)', () => {
    const seikoR7 = PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools.find(
      (s) => s.schoolCode === 'D136320100037' && s.fiscalYearLabel === '令和7年度'
    )!;
    const seikoR8 = PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools.find(
      (s) => s.schoolCode === 'D136320100037' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(seikoR7.totalCapacity).toBe(seikoR8.totalCapacity);
    expect(seikoR7.totalCapacity).toBe(200);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_NAGASAKI(協会一覧PDFで24校中22校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_NAGASAKI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/nagasaki.tsの全24校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_NAGASAKI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_NAGASAKI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録22校+スキップ2校(通信制2校)で参照台帳の24校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_NAGASAKI.schools.length).toBe(22);
    expect(PRIVATE_SCHOOL_DETAIL_NAGASAKI.skipped.length).toBe(2);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_AKITA(5校中2校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_AKITA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/akita.tsの全5校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_AKITA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_AKITA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録3レコード(2校+掛-2多年度1レコード)+スキップ3校で参照台帳の5校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_AKITA.schools.length).toBe(3);
    expect(PRIVATE_SCHOOL_DETAIL_AKITA.skipped.length).toBe(3);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_AKITA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(2);
  });

  it('掛-2(私立×多年度): ノースアジア大学明桜は令和7年度と令和8年度で全日制4コースの定員が完全に同一(170名)', () => {
    const r7 = PRIVATE_SCHOOL_DETAIL_AKITA.schools.find(
      (s) => s.schoolCode === 'D105320159043' && s.fiscalYearLabel === '令和7年度'
    )!;
    const r8 = PRIVATE_SCHOOL_DETAIL_AKITA.schools.find(
      (s) => s.schoolCode === 'D105320159043' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(r7.totalCapacity).toBe(r8.totalCapacity);
    expect(r7.courses).toEqual(r8.courses);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_SHIMANE(全10校スキップ台帳・学級数のみ公表され募集定員非公表と判明)', () => {
  it('schools-private/shimane.tsの全10校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SHIMANE.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_SHIMANE, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('確度の高い募集定員が確認できず全10校スキップ', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SHIMANE.schools.length).toBe(0);
    expect(PRIVATE_SCHOOL_DETAIL_SHIMANE.skipped.length).toBe(10);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_TOYAMA(協会一覧PDFで10校全てを1回で完全収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOYAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/toyama.tsの全10校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOYAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOYAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('10校全てを収録しスキップ0件(私立中学高等学校協会の一覧PDFが全校を1枚で公表していたため)＋掛-2多年度10レコード', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.length).toBe(20);
    expect(PRIVATE_SCHOOL_DETAIL_TOYAMA.skipped.length).toBe(0);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(10);
  });

  it('掛-2(私立×多年度): 富山国際大学付属は令和5→令和8年度で定員が完全に同一(250名)、他7校は変化していた(Waybackで発掘した令和5年度データ)', () => {
    const unchanged = PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.find(
      (s) => s.schoolCode === 'D116320156052' && s.fiscalYearLabel === '令和5年度'
    )!;
    const unchangedR8 = PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.find(
      (s) => s.schoolCode === 'D116320156052' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(unchanged.totalCapacity).toBe(unchangedR8.totalCapacity);

    const changedCodes: [string, number, number][] = [
      ['D116320156016', 140, 135],
      ['D116320156025', 260, 300],
      ['D116320156034', 395, 400],
      ['D116320156043', 100, 90],
      ['D116320256015', 245, 230],
      ['D116320256024', 175, 220],
      ['D116320456013', 120, 90],
    ];
    for (const [code, r5Expected, r8Expected] of changedCodes) {
      const r5 = PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和5年度')!;
      const r8 = PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度')!;
      expect(r5.totalCapacity).toBe(r5Expected);
      expect(r8.totalCapacity).toBe(r8Expected);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_WAKAYAMA(10校中2校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_WAKAYAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/wakayama.tsの全10校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_WAKAYAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_WAKAYAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録2校+スキップ8校で参照台帳の10校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_WAKAYAMA.schools.length).toBe(2);
    expect(PRIVATE_SCHOOL_DETAIL_WAKAYAMA.skipped.length).toBe(8);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_SHIGA(県の私立学校生徒募集概要PDFで12校中10校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_SHIGA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/shiga.tsの全12校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SHIGA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_SHIGA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録20レコード(10校+掛-2多年度10レコード)+スキップ2校(全日制課程を持たない通信制専門校2校)で参照台帳の12校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SHIGA.schools.length).toBe(20);
    expect(PRIVATE_SCHOOL_DETAIL_SHIGA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_SHIGA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(10);
  });

  it('掛-2(私立×多年度): 収録10校全てが令和7年度と令和8年度で定員完全に同一', () => {
    const codes = [
      'D125320100012',
      'D125320100021',
      'D125320100030',
      'D125320200011',
      'D125320200020',
      'D125320400019',
      'D125320600017',
      'D125320600026',
      'D125320700016',
      'D125321300018',
    ];
    for (const code of codes) {
      const r7 = PRIVATE_SCHOOL_DETAIL_SHIGA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和7年度')!;
      const r8 = PRIVATE_SCHOOL_DETAIL_SHIGA.schools.find((s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度')!;
      expect(r7.totalCapacity).toBe(r8.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OKINAWA(12校中1校のみ全日制外部募集の伝統校・残り11校は通信制/中高一貫)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OKINAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/okinawa.tsの全12校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OKINAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OKINAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録1校+スキップ11校で参照台帳の12校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_OKINAWA.schools.length).toBe(1);
    expect(PRIVATE_SCHOOL_DETAIL_OKINAWA.skipped.length).toBe(11);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_ISHIKAWA(民間集計PDFで12校中10校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/ishikawa.tsの全12校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_ISHIKAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_ISHIKAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録19レコード(10校+掛-2多年度9レコード)+スキップ2校(休校1校・広域通信制1校)で参照台帳の12校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.length).toBe(19);
    expect(PRIVATE_SCHOOL_DETAIL_ISHIKAWA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(10);
  });

  it('掛-2(私立×多年度): 金沢/遊学館/金沢龍谷/北陸学院/鵬学園/小松大谷/日本航空石川は2024年度と2026年度で定員完全一致', () => {
    const unchangedCodes = [
      'D117320100012',
      'D117320100030',
      'D117320100049',
      'D117320100058',
      'D117320200011',
      'D117320300010',
      'D117320400019',
    ];
    for (const code of unchangedCodes) {
      const older = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2026年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });

  it('掛-2(私立×多年度): 金沢学院大学附属は4コース全て減少・星稜はBコースのみ減少', () => {
    const gakuinOld = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
      (s) => s.schoolCode === 'D117320100021' && s.fiscalYearLabel === '2024年度'
    )!;
    const gakuinNew = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
      (s) => s.schoolCode === 'D117320100021' && s.fiscalYearLabel === '2026年度'
    )!;
    expect(gakuinOld.totalCapacity).toBe(420);
    expect(gakuinNew.totalCapacity).toBe(375);

    const seiryoOld = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
      (s) => s.schoolCode === 'D117320100067' && s.fiscalYearLabel === '2024年度'
    )!;
    const seiryoNew = PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.find(
      (s) => s.schoolCode === 'D117320100067' && s.fiscalYearLabel === '2026年度'
    )!;
    expect(seiryoOld.totalCapacity).toBe(440);
    expect(seiryoNew.totalCapacity).toBe(400);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KAGAWA(県庁公表の全日制/通信制募集要項2冊で13校中10校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KAGAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/kagawa.tsの全13校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KAGAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KAGAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録10校+スキップ3校(通信制専門校)で参照台帳の13校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KAGAWA.schools.length).toBe(10);
    expect(PRIVATE_SCHOOL_DETAIL_KAGAWA.skipped.length).toBe(3);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_MIYAZAKI(個別サイト10校+育伸社募集要項PDFで3校追加・14校中13校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/miyazaki.tsの全14校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_MIYAZAKI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_MIYAZAKI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録16レコード(13校×令和8年度+3校×2024年度)+スキップ1校(掲載なし)で参照台帳の14校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.length).toBe(16);
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.skipped.length).toBe(1);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(13);
  });

  it('掛-2(私立×多年度): 小林西(110→120)と延岡学園(240→280)で定員変化を検出、都城聖ドミニコ学園は不変', () => {
    const kobayashiOld = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320559112' && s.fiscalYearLabel === '2024年度'
    )!;
    const kobayashiNew = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320559112' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(kobayashiOld.totalCapacity).toBe(110);
    expect(kobayashiNew.totalCapacity).toBe(120);

    const nobeokaOld = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320359098' && s.fiscalYearLabel === '2024年度'
    )!;
    const nobeokaNew = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320359098' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(nobeokaOld.totalCapacity).toBe(240);
    expect(nobeokaNew.totalCapacity).toBe(280);

    const miyakonojoOld = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320259142' && s.fiscalYearLabel === '2024年度'
    )!;
    const miyakonojoNew = PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.find(
      (s) => s.schoolCode === 'D145320259142' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(miyakonojoOld.totalCapacity).toBe(miyakonojoNew.totalCapacity);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_TOCHIGI(県庁一括PDF2冊で15校全校を完全収録・佐賀9/9・富山10/10を上回る最大規模)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOCHIGI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/tochigi.tsの全15校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOCHIGI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOCHIGI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('15校全てを収録しスキップ0件(県庁公表の全日制/通信制一覧PDF2冊で完全収録)', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOCHIGI.schools.length).toBe(15);
    expect(PRIVATE_SCHOOL_DETAIL_TOCHIGI.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_IWATE(個別サイト調査2校+育伸社募集要項PDFで残り11校を追加・全13校完全収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_IWATE.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/iwate.tsの全13校がschoolsで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_IWATE.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_IWATE, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録26レコード(13校×令和8年度+13校×2024年度)でスキップ0件', () => {
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.schools.length).toBe(26);
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.skipped.length).toBe(0);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_IWATE.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(13);
  });

  it('掛-2(私立×多年度): 13校全てで総定員が2024年度と令和8年度で完全一致(岩手県は変化ゼロ)', () => {
    const codes = [
      'D103310000010',
      'D103310000029',
      'D103310000038',
      'D103310000047',
      'D103310000056',
      'D103310000065',
      'D103310000074',
      'D103310000083',
      'D103310000092',
      'D103310000109',
      'D103310000118',
      'D103310000127',
      'D103310000136',
    ];
    for (const code of codes) {
      const older = PRIVATE_SCHOOL_DETAIL_IWATE.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_IWATE.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_CHIBA(62校中52校を収録・広域通信制5校+完全中高一貫1校+掲載なし3校+外部募集内訳不明1校をスキップ台帳へ・完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_CHIBA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録98レコード(52校+掛-2多年度46レコード)・スキップ10件で参照台帳の62校と完全一致(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_CHIBA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_CHIBA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.schools.length).toBe(98);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_CHIBA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(52);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.skipped.length).toBe(10);
  });

  it('掛-2(私立×多年度・62校規模のため代表9校をサンプル検証): 千葉日本大学第一・千葉県安房西・千葉経済大学附属・千葉萌陽・千葉黎明・不二女子・横芝敬愛の7校は2024年度と令和8年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D112310000199', 120],
      ['D112310000224', 100],
      ['D112310000019', 520],
      ['D112310000313', 80],
      ['D112310000554', 276],
      ['D112310000162', 120],
      ['D112310000563', 190],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(y2026?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 千葉明徳は2024→令和8年度で進学コースHSクラス・Sクラスが130→140に増加し総定員270→280に変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000028' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000028' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(270);
    expect(y2026?.totalCapacity).toBe(280);
  });

  it('掛-2(私立×多年度): 茂原北陵は総定員200で2024→令和8年度と不変だが、3コース目が「家政」から「ライフデザイン」へ改称されていた', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000572' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000572' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(200);
    expect(y2026?.totalCapacity).toBe(200);
    expect(y2024?.courses.some((c) => c.courseName.includes('家政'))).toBe(true);
    expect(y2026?.courses.some((c) => c.courseName === 'ライフデザイン')).toBe(true);
  });

  it('掛-2(私立×多年度・第2弾): 市川・桜林・鴨川令徳・暁星国際・昭和学院秀英の5校は2024年度と令和8年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D112310000117', 120],
      ['D112310000091', 160],
      ['D112310000475', 110],
      ['D112310000242', 30],
      ['D112310000064', 80],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(y2026?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 光英VERITASは特待選抜コースが2024→令和8年度で40→30に減少し総定員140→130に変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000288' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000288' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(140);
    expect(y2026?.totalCapacity).toBe(130);
  });

  it('掛-2(データ誤り是正): 国府台女子学院は隣接する光英VERITASのブロックを誤って転記していた(特待選抜30+推薦一般100=130)。真の値=単願推薦約50/併願推薦約70のうち大きい方70(選抜クラス・美術デザインコース含む共有枠)へ是正、2024年度も同じ70で不変', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000153' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000153' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(70);
    expect(y2026?.totalCapacity).toBe(70);
    expect(y2026?.courses.some((c) => c.courseName.includes('特待選抜'))).toBe(false);
  });

  it('掛-2(データ誤り是正): 植草学園大学附属は英語コース(40)が丸ごと未収録だった。真の総定員=普通コース200+特進コース40+英語コース40=280へ是正、2024年度も同じ280で不変', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000046' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000046' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(280);
    expect(y2026?.totalCapacity).toBe(280);
    expect(y2026?.courses.some((c) => c.courseName === '英語コース')).toBe(true);
  });

  it('掛-2(私立×多年度): 千葉学芸は2024年度と令和8年度で総定員280が完全一致(普通科240+特別進学コース40)', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000331' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000331' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(280);
    expect(y2026?.totalCapacity).toBe(280);
  });

  it('掛-2(私立×多年度・第3弾): 専修大学松戸・拓殖大学紅陵・千葉英和・千葉敬愛・東海大学付属市原望洋・東海大学付属浦安・東京学館・中央学院の8校は2024年度と令和8年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D112310000279', 256],
      ['D112310000233', 360],
      ['D112310000420', 360],
      ['D112310000518', 406],
      ['D112310000402', 320],
      ['D112310000493', 250],
      ['D112310000545', 350],
      ['D112310000466', 323],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(y2026?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 西武台千葉は2024→令和8年度で特別選抜コース100+進学コース176=276から全コース計293へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000297' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000297' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(276);
    expect(y2026?.totalCapacity).toBe(293);
  });

  it('掛-2(私立×多年度・第4弾): 敬愛大学八日市場・芝浦工業大学柏・秀明大学学校教師学部附属秀明八千代・昭和学院・愛国学園大学附属四街道・我孫子二階堂・市原中央・敬愛学園の8校は2024年度と令和8年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D112310000340', 200],
      ['D112310000377', 120],
      ['D112310000448', 310],
      ['D112310000108', 176],
      ['D112310000527', 160],
      ['D112310000457', 200],
      ['D112310000411', 280],
      ['D112310000037', 320],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(y2026?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 志学館は2024→令和8年度で総定員180から200へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000251' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000251' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(180);
    expect(y2026?.totalCapacity).toBe(200);
  });

  it('掛-2(私立×多年度): 木更津総合は2024年度版(特別進学25+進学60+総合540+美術15=640)と令和8年度一次資料の600で総定員に相違がある', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000260' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000260' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(640);
    expect(y2026?.totalCapacity).toBe(600);
  });

  it('掛-2(私立×多年度・第5弾): 東京学館浦安・東京学館船橋・成田・日本体育大学柏・日本大学習志野・和洋国府台女子の6校は2024年度と令和8年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D112310000509', 400],
      ['D112310000206', 292],
      ['D112310000322', 200],
      ['D112310000386', 360],
      ['D112310000180', 190],
      ['D112310000126', 140],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(y2026?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 東葉は2024→令和8年度で2024年新設のS特進36+特進160+進学80=276から、特進・進学統合後のS特進26+特進240=266へ変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000171' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000171' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(276);
    expect(y2026?.totalCapacity).toBe(266);
  });

  it('掛-2(私立×多年度): 麗澤は2024→令和8年度で叡智スーパー特進30+叡智特選70=100からS特進35+特選85=120へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000368' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000368' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(100);
    expect(y2026?.totalCapacity).toBe(120);
  });

  it('掛-2(私立×多年度・第6弾): 千葉聖心は2024年度と令和8年度で総定員200が完全一致', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000055' && s.fiscalYearLabel === '2024年度'
    );
    const y2026 = PRIVATE_SCHOOL_DETAIL_CHIBA.schools.find(
      (s) => s.schoolCode === 'D112310000055' && s.fiscalYearLabel === '令和8年度'
    );
    expect(y2024?.totalCapacity).toBe(200);
    expect(y2026?.totalCapacity).toBe(200);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OKAYAMA(23校を収録・スキップ4件で参照台帳27校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録23校・スキップ4件で参照台帳27校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OKAYAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OKAYAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools.length).toBe(23);
    expect(PRIVATE_SCHOOL_DETAIL_OKAYAMA.skipped.length).toBe(4);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_SHIZUOKA(私学協会一括PDFで48校中40校を完全収録・単独県最大の40校)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_SHIZUOKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/shizuoka.tsの全48校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SHIZUOKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_SHIZUOKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録40校+スキップ8校(全日制一覧に掲載の無い学校)で参照台帳の48校と一致し、40校のcourses合計を積み上げた総計が原資料の全体合計11,485と完全一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SHIZUOKA.schools.length).toBe(40);
    expect(PRIVATE_SCHOOL_DETAIL_SHIZUOKA.skipped.length).toBe(8);
    const grandTotal = PRIVATE_SCHOOL_DETAIL_SHIZUOKA.schools.reduce((acc, s) => acc + s.totalCapacity, 0);
    expect(grandTotal).toBe(11485);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_SAITAMA(学事課一覧で58校中47校を完全収録・浦和明の星女子は募集なし)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_SAITAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/saitama.tsの全58校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_SAITAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_SAITAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録47校+スキップ11校(募集なし1校+通信制のみ掲載/分校/掲載なし10校)で参照台帳の58校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SAITAMA.schools.length).toBe(47);
    expect(PRIVATE_SCHOOL_DETAIL_SAITAMA.skipped.length).toBe(11);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_FUKUOKA(私学協会志願者数調で62校中57校を収録・4地区計/県合計17,340と完全一致検算済み・参照台帳62校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する(coursesが空のため常にtrue)', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_FUKUOKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録57校・スキップ5校で参照台帳62校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUOKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_FUKUOKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUOKA.schools.length).toBe(57);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUOKA.skipped.length).toBe(5);
    const grandTotal = PRIVATE_SCHOOL_DETAIL_FUKUOKA.schools.reduce((acc, s) => acc + s.totalCapacity, 0);
    expect(grandTotal).toBe(17340);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_HYOGO(55校中43校を収録・残り12校は完全中高一貫/休校/広域通信制等で理由付きスキップし完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_HYOGO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録43校・スキップ12件で参照台帳の55校と完全一致(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_HYOGO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_HYOGO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_HYOGO.schools.length).toBe(43);
    expect(PRIVATE_SCHOOL_DETAIL_HYOGO.skipped.length).toBe(12);
  });

  it('掛-2着手時に発見・是正: 神戸常盤女子のコース名誤り(ts上「特別選学コース」を「特別進学コース」に修正)', () => {
    const kobeTokiwa = PRIVATE_SCHOOL_DETAIL_HYOGO.schools.find((s) => s.schoolCode === 'D128310000146')!;
    expect(kobeTokiwa.courses.some((c) => c.courseName === '特別進学コース')).toBe(true);
    expect(kobeTokiwa.totalCapacity).toBe(285);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_NAGANO(県プレスリリースの全日制16校+天龍興譲・地球環境・コードアカデミーを追加収録・参照台帳26校を完全収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_NAGANO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録19校・スキップ7校(長野女子=2026年3月閉校/ステップ・信濃むつみ・さくら国際・緑誠蘭・つくば開成学園・ＩＤ学園=通信制で定員非公開)で26校を完全収録(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_NAGANO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_NAGANO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_NAGANO.schools.length).toBe(19);
    expect(PRIVATE_SCHOOL_DETAIL_NAGANO.skipped.length).toBe(7);
    const pressReleaseTotal = PRIVATE_SCHOOL_DETAIL_NAGANO.schools
      .filter(
        (s) =>
          s.schoolCode !== 'D120341300011' &&
          s.schoolCode !== 'D120321700028' &&
          s.schoolCode !== 'D120320300033'
      )
      .reduce((acc, s) => acc + s.totalCapacity, 0);
    expect(pressReleaseTotal).toBe(3440);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_GIFU(私学振興会一覧で全21校を完全収録・中京高等学校は全日制+通信制の両課程を1校のcoursesに統合)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_GIFU.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/gifu.tsの全21校がschoolsで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_GIFU.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_GIFU, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('21校全てを収録しスキップ0件(全日制16校+通信制専業5校)', () => {
    expect(PRIVATE_SCHOOL_DETAIL_GIFU.schools.length).toBe(21);
    expect(PRIVATE_SCHOOL_DETAIL_GIFU.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_MIE(私学協会一覧で全日制13校+通信制5校=18校を収録・参照台帳21校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_MIE.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録18校・スキップ3校で参照台帳21校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_MIE.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_MIE, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_MIE.schools.length).toBe(18);
    expect(PRIVATE_SCHOOL_DETAIL_MIE.skipped.length).toBe(3);
  });

  it('全日制13校の合計は原資料の合計欄3,760と完全一致', () => {
    const tsushinseiNames = ['大橋学園高等学校', '徳風高等学校', '一志学園高等学校', '英心高等学校', '英心高等学校桔梗が丘校'];
    const zenniciSchools = PRIVATE_SCHOOL_DETAIL_MIE.schools.filter((s) => !tsushinseiNames.includes(s.schoolName));
    const grandTotal = zenniciSchools.reduce((acc, s) => acc + s.totalCapacity, 0);
    expect(grandTotal).toBe(3760);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_AOMORI(個別学校サイト2校+育伸社募集要項PDFで残り15校を追加・全17校完全収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_AOMORI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/aomori.tsの全17校がschoolsで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_AOMORI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_AOMORI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録34レコード(17校×2026年度+17校×2024年度)でスキップ0件', () => {
    expect(PRIVATE_SCHOOL_DETAIL_AOMORI.schools.length).toBe(34);
    expect(PRIVATE_SCHOOL_DETAIL_AOMORI.skipped.length).toBe(0);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_AOMORI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(17);
  });

  it('掛-2(私立×多年度): 青森山田/五所川原第一/東奥義塾/八戸聖ウルスラ学院の4校で定員変化を検出、他13校は完全一致', () => {
    const changed = [
      { code: 'D102310000057', older: 400, newer: 360 },
      { code: 'D102310000119', older: 175, newer: 140 },
      { code: 'D102310000039', older: 320, newer: 234 },
      { code: 'D102310000084', older: 200, newer: 180 },
    ];
    for (const { code, older, newer } of changed) {
      const oldRecord = PRIVATE_SCHOOL_DETAIL_AOMORI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newRecord = PRIVATE_SCHOOL_DETAIL_AOMORI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(oldRecord.totalCapacity).toBe(older);
      expect(newRecord.totalCapacity).toBe(newer);
    }

    const unchangedCodes = [
      'D102310000011',
      'D102310000020',
      'D102310000048',
      'D102310000066',
      'D102310000075',
      'D102310000093',
      'D102310000100',
      'D102310000128',
      'D102310000137',
      'D102310000146',
      'D102310000155',
      'D102310000164',
      'D102310000173',
    ];
    for (const code of unchangedCodes) {
      const oldRecord = PRIVATE_SCHOOL_DETAIL_AOMORI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newRecord = PRIVATE_SCHOOL_DETAIL_AOMORI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(oldRecord.totalCapacity).toBe(newRecord.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_MIYAGI(個別学校サイト2校+育伸社募集要項PDFで13校追加・21校中15校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_MIYAGI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/miyagi.tsの全21校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_MIYAGI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_MIYAGI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録28レコード(15校×令和8年度+13校×2024年度)+スキップ6校(掲載なし)で参照台帳の21校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.length).toBe(28);
    expect(PRIVATE_SCHOOL_DETAIL_MIYAGI.skipped.length).toBe(6);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(15);
  });

  it('掛-2着手時に発見・是正: 東北学院榴ケ岡の誤った660(実際は東北高等学校の値)を正しい270に修正し、東北・東陵を新規収録', () => {
    const ryuugaoka = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391050036' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(ryuugaoka.totalCapacity).toBe(270);

    const tohoku = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391010053' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(tohoku.totalCapacity).toBe(660);

    const tourrying = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104392050016' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(tourrying.totalCapacity).toBe(120);
  });

  it('掛-2(私立×多年度): 仙台白百合学園(225→175)と宮城学院(170→150)で定員減少を検出', () => {
    const shirayuriOld = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391050018' && s.fiscalYearLabel === '2024年度'
    )!;
    const shirayuriNew = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391050018' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(shirayuriOld.totalCapacity).toBe(225);
    expect(shirayuriNew.totalCapacity).toBe(175);

    const miyagiGakuinOld = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391010017' && s.fiscalYearLabel === '2024年度'
    )!;
    const miyagiGakuinNew = PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.find(
      (s) => s.schoolCode === 'D104391010017' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(miyagiGakuinOld.totalCapacity).toBe(170);
    expect(miyagiGakuinNew.totalCapacity).toBe(150);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_NIIGATA(私学協会入試日程一覧の募集定員列で全20校を完全収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_NIIGATA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/niigata.tsの全20校がschoolsで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_NIIGATA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_NIIGATA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('20校全てを収録しスキップ0件', () => {
    expect(PRIVATE_SCHOOL_DETAIL_NIIGATA.schools.length).toBe(20);
    expect(PRIVATE_SCHOOL_DETAIL_NIIGATA.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KUMAMOTO(育伸社募集要項PDFで25校中20校を収録・普通科計等の共有クォータは統合)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/kumamoto.tsの全25校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KUMAMOTO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KUMAMOTO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録40レコード(20校×令和8年度+20校×2024年度)+スキップ5校(概算表記1校+広域通信制4校)で参照台帳の25校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools.length).toBe(40);
    expect(PRIVATE_SCHOOL_DETAIL_KUMAMOTO.skipped.length).toBe(5);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(20);
  });

  it('掛-2(私立×多年度): 20校全てで総定員が2024年度と令和8年度で完全一致(熊本県は変化ゼロ)', () => {
    const codes = [
      'D143310000174',
      'D143310000049',
      'D143310000192',
      'D143310000012',
      'D143310000058',
      'D143310000094',
      'D143310000129',
      'D143310000138',
      'D143310000101',
      'D143310000165',
      'D143310000076',
      'D143310000218',
      'D143310000183',
      'D143310000209',
      'D143310000021',
      'D143310000067',
      'D143310000147',
      'D143310000085',
      'D143310000156',
      'D143310000110',
    ];
    for (const code of codes) {
      const older = PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OITA(育伸社募集要項PDFで15校中13校を収録・稲葉学園/府内は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OITA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/oita.tsの全15校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OITA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OITA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録26レコード(13校×令和8年度+13校×2024年度)+スキップ2校(掲載なし)で参照台帳の15校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_OITA.schools.length).toBe(26);
    expect(PRIVATE_SCHOOL_DETAIL_OITA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_OITA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(13);
  });

  it('掛-2着手時に発見・是正: 大分東明(誤70→正440)と大分国際情報(誤70→正140)の隣接校ブロック取り違えを修正', () => {
    const toumei = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000057' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(toumei.totalCapacity).toBe(440);

    const kokusaijoho = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000066' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(kokusaijoho.totalCapacity).toBe(140);
  });

  it('掛-2(私立×多年度): 大分(440→400)と昭和学園(255→240)で定員減少を検出', () => {
    const oitaOld = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000039' && s.fiscalYearLabel === '2024年度'
    )!;
    const oitaNew = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000039' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(oitaOld.totalCapacity).toBe(440);
    expect(oitaNew.totalCapacity).toBe(400);

    const showaOld = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000093' && s.fiscalYearLabel === '2024年度'
    )!;
    const showaNew = PRIVATE_SCHOOL_DETAIL_OITA.schools.find(
      (s) => s.schoolCode === 'D144310000093' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(showaOld.totalCapacity).toBe(255);
    expect(showaNew.totalCapacity).toBe(240);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KAGOSHIMA(育伸社募集要項PDFで22校中21校を収録・屋久島おおぞらのみ掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/kagoshima.tsの全22校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KAGOSHIMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録42レコード(21校×令和8年度+21校×2024年度)+スキップ1校(掲載なし)で参照台帳の22校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.length).toBe(42);
    expect(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.skipped.length).toBe(1);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(21);
  });

  it('掛-2着手時に発見・是正: 出水中央(誤195→正235)と鹿児島第一(誤55→正155)を修正', () => {
    const izumi = PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.find(
      (s) => s.schoolCode === 'D146310000135' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(izumi.totalCapacity).toBe(235);

    const daiichi = PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.find(
      (s) => s.schoolCode === 'D146310000153' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(daiichi.totalCapacity).toBe(155);
  });

  it('掛-2(私立×多年度): 21校全てで総定員が2024年度と令和8年度で完全一致(鹿児島県は変化ゼロ)', () => {
    const codes = [
      'D146310000019',
      'D146310000028',
      'D146310000037',
      'D146310000046',
      'D146310000055',
      'D146310000064',
      'D146310000073',
      'D146310000082',
      'D146310000091',
      'D146310000108',
      'D146310000117',
      'D146310000126',
      'D146310000135',
      'D146310000144',
      'D146310000153',
      'D146310000162',
      'D146310000171',
      'D146310000180',
      'D146310000199',
      'D146310000206',
      'D146310000215',
    ];
    for (const code of codes) {
      const older = PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_YAMAGATA(育伸社募集要項PDFで15校中13校を収録・和順館/基督教独立学園は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/yamagata.tsの全15校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_YAMAGATA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_YAMAGATA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録25レコード(12校×2026年度+13校×2024年度)+スキップ2校(掲載なし)で参照台帳の15校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.length).toBe(25);
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGATA.skipped.length).toBe(2);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(13);
  });

  it('掛-2(私立×多年度): 新庄東はSコースのみ70→105に増加(総定員155→190)', () => {
    const older = PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.find(
      (s) => s.schoolCode === 'D106320551019' && s.fiscalYearLabel === '2024年度'
    )!;
    const newer = PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.find(
      (s) => s.schoolCode === 'D106320551019' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(older.totalCapacity).toBe(155);
    expect(newer.totalCapacity).toBe(190);
  });

  it('掛-2(私立×多年度): 羽黒は2024年度のみ収録(2026年度は現行PDFに数値記載なしのため未収録)', () => {
    const records = PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.filter((s) => s.schoolCode === 'D106320351011');
    expect(records.length).toBe(1);
    expect(records[0].fiscalYearLabel).toBe('2024年度');
    expect(records[0].totalCapacity).toBe(290);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_GUNMA(育伸社募集要項PDFで14校中11校を収録・白根開善学校/ぐんま国際アカデミー/R高校は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_GUNMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/gunma.tsの全14校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_GUNMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_GUNMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録22レコード(11校×2026年度+11校×2024年度)+スキップ3校(掲載なし)で参照台帳の14校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_GUNMA.schools.length).toBe(22);
    expect(PRIVATE_SCHOOL_DETAIL_GUNMA.skipped.length).toBe(3);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_GUNMA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(11);
  });

  it('掛-2(私立×多年度): 高崎商科大学附属(500→450)と東京農業大学第二(520→450)で定員減少を検出', () => {
    const takasakiOld = PRIVATE_SCHOOL_DETAIL_GUNMA.schools.find(
      (s) => s.schoolCode === 'D110310000039' && s.fiscalYearLabel === '2024年度'
    )!;
    const takasakiNew = PRIVATE_SCHOOL_DETAIL_GUNMA.schools.find(
      (s) => s.schoolCode === 'D110310000039' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(takasakiOld.totalCapacity).toBe(500);
    expect(takasakiNew.totalCapacity).toBe(450);

    const nodaiOld = PRIVATE_SCHOOL_DETAIL_GUNMA.schools.find(
      (s) => s.schoolCode === 'D110310000048' && s.fiscalYearLabel === '2024年度'
    )!;
    const nodaiNew = PRIVATE_SCHOOL_DETAIL_GUNMA.schools.find(
      (s) => s.schoolCode === 'D110310000048' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(nodaiOld.totalCapacity).toBe(520);
    expect(nodaiNew.totalCapacity).toBe(450);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_IBARAKI(育伸社募集要項PDFで36校中22校を収録・通信制系13校+茗溪学園(数値不明瞭)は見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_IBARAKI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/ibaraki.tsの全36校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_IBARAKI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_IBARAKI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録44レコード(22校×令和8年度+22校×2024年度)+スキップ14校(掲載なし13校+数値不明瞭1校)で参照台帳の36校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.length).toBe(44);
    expect(PRIVATE_SCHOOL_DETAIL_IBARAKI.skipped.length).toBe(14);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(22);
  });

  it('掛-2着手時に発見・是正: 霞ヶ浦のコース名誤り(ts上「総合選学コース」を「総合進学コース」に修正)', () => {
    const kasumigaura = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108344300011' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(kasumigaura.courses[0].courseName).toContain('総合進学コース');
    expect(kasumigaura.totalCapacity).toBe(430);
  });

  it('掛-2(私立×多年度): 霞ヶ浦(480→430)・聖徳大学附属取手聖徳女子(70→100)・明秀学園日立(360→320)で定員変化を検出', () => {
    const kasumigauraOld = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108344300011' && s.fiscalYearLabel === '2024年度'
    )!;
    const kasumigauraNew = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108344300011' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(kasumigauraOld.totalCapacity).toBe(480);
    expect(kasumigauraNew.totalCapacity).toBe(430);

    const shotokuOld = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108321700024' && s.fiscalYearLabel === '2024年度'
    )!;
    const shotokuNew = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108321700024' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(shotokuOld.totalCapacity).toBe(70);
    expect(shotokuNew.totalCapacity).toBe(100);

    const meishuOld = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108320200012' && s.fiscalYearLabel === '2024年度'
    )!;
    const meishuNew = PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.find(
      (s) => s.schoolCode === 'D108320200012' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(meishuOld.totalCapacity).toBe(360);
    expect(meishuNew.totalCapacity).toBe(320);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_YAMAGUCHI(育伸社募集要項PDFで23校中20校を収録・精華学園/松陰/萩明倫館は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/yamaguchi.tsの全23校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_YAMAGUCHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録40レコード(20校×令和8年度+20校×2024年度)+スキップ3校(掲載なし)で参照台帳の23校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.length).toBe(40);
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.skipped.length).toBe(3);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(20);
  });

  it('掛-2(私立×多年度): 高水(280→210)と野田学園(260→250)で定員減少を検出、他18校は完全一致', () => {
    const takamizuOld = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
      (s) => s.schoolCode === 'D135310000147' && s.fiscalYearLabel === '2024年度'
    )!;
    const takamizuNew = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
      (s) => s.schoolCode === 'D135310000147' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(takamizuOld.totalCapacity).toBe(280);
    expect(takamizuNew.totalCapacity).toBe(210);

    const nodaOld = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
      (s) => s.schoolCode === 'D135310000094' && s.fiscalYearLabel === '2024年度'
    )!;
    const nodaNew = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
      (s) => s.schoolCode === 'D135310000094' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(nodaOld.totalCapacity).toBe(260);
    expect(nodaNew.totalCapacity).toBe(250);

    const unchangedCodes = [
      'D135310000012',
      'D135310000021',
      'D135310000030',
      'D135310000049',
      'D135310000058',
      'D135310000067',
      'D135310000076',
      'D135310000085',
      'D135310000101',
      'D135310000110',
      'D135310000129',
      'D135310000138',
      'D135310000156',
      'D135310000165',
      'D135310000174',
      'D135310000183',
      'D135310000192',
      'D135310000209',
    ];
    for (const code of unchangedCodes) {
      const older = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_HIROSHIMA(育伸社募集要項PDFで40校中32校を収録・広島女学院/ノートルダム清心/広島学院等8校は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_HIROSHIMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/hiroshima.tsの全40校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_HIROSHIMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_HIROSHIMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録32校+スキップ8校(掲載なし)で参照台帳の40校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_HIROSHIMA.schools.length).toBe(32);
    expect(PRIVATE_SCHOOL_DETAIL_HIROSHIMA.skipped.length).toBe(8);
  });

  it('掛-2着手時に発見・是正: 尾道(誤240→正295の6コース)と近畿大学附属広島福山校(誤220の4コース→正240の1コース)を修正', () => {
    const onomichi = PRIVATE_SCHOOL_DETAIL_HIROSHIMA.schools.find((s) => s.schoolCode === 'D134310000237')!;
    expect(onomichi.courses.length).toBe(6);
    expect(onomichi.totalCapacity).toBe(295);

    const kindaiFukuyama = PRIVATE_SCHOOL_DETAIL_HIROSHIMA.schools.find((s) => s.schoolCode === 'D134310000264')!;
    expect(kindaiFukuyama.courses.length).toBe(1);
    expect(kindaiFukuyama.totalCapacity).toBe(240);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_NARA(育伸社募集要項PDFで18校中12校を収録・東大寺学園等6校は掲載なしで見送り)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_NARA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/nara.tsの全18校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_NARA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_NARA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録24レコード(12校×令和8年度+12校×2024年度)+スキップ6校(掲載なし)で参照台帳の18校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_NARA.schools.length).toBe(24);
    expect(PRIVATE_SCHOOL_DETAIL_NARA.skipped.length).toBe(6);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_NARA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(12);
  });

  it('掛-2(私立×多年度): 天理(480→440)と奈良文化(190→180)で定員減少を検出、他10校は完全一致', () => {
    const tenriOld = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
      (s) => s.schoolCode === 'D129310000145' && s.fiscalYearLabel === '2024年度'
    )!;
    const tenriNew = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
      (s) => s.schoolCode === 'D129310000145' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(tenriOld.totalCapacity).toBe(480);
    expect(tenriNew.totalCapacity).toBe(440);

    const narabunkaOld = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
      (s) => s.schoolCode === 'D129310000109' && s.fiscalYearLabel === '2024年度'
    )!;
    const narabunkaNew = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
      (s) => s.schoolCode === 'D129310000109' && s.fiscalYearLabel === '令和8年度'
    )!;
    expect(narabunkaOld.totalCapacity).toBe(190);
    expect(narabunkaNew.totalCapacity).toBe(180);

    const unchangedCodes = [
      'D129310000010',
      'D129310000029',
      'D129310000038',
      'D129310000056',
      'D129310000065',
      'D129310000092',
      'D129310000118',
      'D129310000127',
      'D129310000136',
      'D129310000154',
    ];
    for (const code of unchangedCodes) {
      const older = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      )!;
      const newer = PRIVATE_SCHOOL_DETAIL_NARA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '令和8年度'
      )!;
      expect(older.totalCapacity).toBe(newer.totalCapacity);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KYOTO(大都市圏5県の初回着手・育伸社募集要項PDF+公式サイト個別確認で44校中37校を収録)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KYOTO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/kyoto.tsの全44校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KYOTO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KYOTO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録73レコード(37校+掛-2多年度36レコード)+スキップ7校で参照台帳の44校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KYOTO.schools.length).toBe(73);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_KYOTO.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(37);
    expect(PRIVATE_SCHOOL_DETAIL_KYOTO.skipped.length).toBe(7);
  });

  it('掛-2(私立×多年度): 大谷・華頂女子・京都外大西・京都共栄学園・京都暁星・京都芸術・京都光華・京都廣学館・京都国際・京都産業大学附属の10校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D126310000139', 400],
      ['D126310000157', 120],
      ['D126310000237', 280],
      ['D126310000282', 195],
      ['D126310000317', 70],
      ['D126310000380', 175],
      ['D126310000228', 150],
      ['D126310000353', 240],
      ['D126310000399', 50],
      ['D126310000031', 280],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・続き): 京都翔英・京都精華学園・京都成章・京都聖母学院・京都先端科学大学附属・京都西山・京都文教・京都明徳・京都両洋・同志社・同志社国際の11校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D126310000371', 260],
      ['D126310000086', 200],
      ['D126310000255', 400],
      ['D126310000246', 180],
      ['D126310000200', 320],
      ['D126310000326', 250],
      ['D126310000095', 200],
      ['D126310000184', 350],
      ['D126310000111', 435],
      ['D126310000068', 80],
      ['D126310000344', 135],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 京都聖カタリナは2024→2026年度で看護60+普通35=95から看護40+普通40=80へ変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000335' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000335' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(95);
    expect(yLatest?.totalCapacity).toBe(80);
  });

  it('掛-2(私立×多年度): 京都橘は2024→2026年度で選抜類型70+総合類型200=270から選抜類型60+総合類型200=260へ変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000059' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000059' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(270);
    expect(yLatest?.totalCapacity).toBe(260);
  });

  it('掛-2(私立×多年度・確度やや低): 同志社女子は2024年版「約20」から2026年版25への変化を示唆(いずれもLAコースのみ掲載)', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000022' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000022' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(20);
    expect(yLatest?.totalCapacity).toBe(25);
  });

  it('掛-2(私立×多年度・完了): 日星・花園・東山・福知山淑徳・福知山成美・洛南・洛陽総合・立命館・立命館宇治・龍谷大学付属平安の10校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D126310000291', 160],
      ['D126310000219', 260],
      ['D126310000077', 230],
      ['D126310000273', 195],
      ['D126310000264', 350],
      ['D126310000193', 144],
      ['D126310000120', 280],
      ['D126310000415', 350],
      ['D126310000308', 225],
      ['D126310000175', 330],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 平安女学院は2024→2026年度でアグネス進学約30+幼児教育進学約30+立命館進学約10=70から各30ずつの90へ増加(立命館進学が約10→30と3倍化)', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000040' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000040' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(70);
    expect(yLatest?.totalCapacity).toBe(90);
  });

  it('掛-2(私立×多年度・確度やや低): 洛星ノートルダム女学院は2024年版「約75」から2026年版70への変化を示唆', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000451' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KYOTO.schools.find(
      (s) => s.schoolCode === 'D126310000451' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(75);
    expect(yLatest?.totalCapacity).toBe(70);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KANAGAWA(大都市圏5県・育伸社募集要項PDF1〜7ページ目+公式サイト個別確認56校を収録・スキップ27校で参照台帳83校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録103レコード(56校+掛-2多年度47レコード)・スキップ27校で参照台帳83校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KANAGAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KANAGAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.length).toBe(103);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(56);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.skipped.length).toBe(27);
  });

  it('掛-2(私立×多年度): 旭丘・麻布大学附属・アレセイア湘南・英理女子学院・柏木学園・鎌倉学園・鎌倉国際文理・函嶺白百合学園の8校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D114320600010', 473],
      ['D114315000025', 255],
      ['D114320700019', 200],
      ['D114310000231', 360],
      ['D114321300020', 240],
      ['D114320400021', 110],
      ['D114320400058', 235],
      ['D114338200016', 50],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 大西学園は2024→2026年度で普通80+家庭40=120から普通110+家庭50=160へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114313000011' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114313000011' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(120);
    expect(yLatest?.totalCapacity).toBe(160);
  });

  it('掛-2(私立×多年度): 関東学院六浦は2024→2026年度で推薦10+一般書類選考30=40から推薦10+一般書類選考15=25へ減少', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000197' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000197' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(40);
    expect(yLatest?.totalCapacity).toBe(25);
  });

  it('掛-2(私立×多年度・続き): 鵠沼・慶應義塾湘南藤沢・向上・湘南学院・相模女子大学・相模原(光明学園相模原)・聖セシリア女子・聖ヨゼフ学園・聖和学院・相洋の10校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D114320500011', 250],
      ['D114320500093', 20],
      ['D114321400010', 280],
      ['D114320100015', 445],
      ['D114315000034', 260],
      ['D114315000043', 440],
      ['D114321300011', 30],
      ['D114310000026', 40],
      ['D114320800018', 90],
      ['D114320600029', 585],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 星槎は2024→2026年度で73から49へ減少', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000295' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000295' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(73);
    expect(yLatest?.totalCapacity).toBe(49);
  });

  it('掛-2(私立×多年度): 捜真女学校は2024→2026年度で25から35へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000099' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000099' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(25);
    expect(yLatest?.totalCapacity).toBe(35);
  });

  it('掛-2(私立×多年度): 橘学苑は2024→2026年度で200から204へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000035' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000035' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(200);
    expect(yLatest?.totalCapacity).toBe(204);
  });

  it('掛-2(私立×多年度・要注記): 慶應義塾は2024年版の帰国生「若干名」除外の370と令和8年版の帰国生20名込み390は単純な定員変化ではない可能性', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000222' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000222' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(370);
    expect(yLatest?.totalCapacity).toBe(390);
  });

  it('掛-2(私立×多年度・続き2): 立花学園・鶴見大学附属・東海大学付属相模・藤嶺学園藤沢・日本女子大学附属・日本大学・日本大学藤沢・平塚学園・藤沢翔陵・法政大学第二の10校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D114336300019', 480],
      ['D114310000044', 100],
      ['D114315000052', 440],
      ['D114320500066', 105],
      ['D114313000057', 130],
      ['D114310000240', 260],
      ['D114320500057', 360],
      ['D114320300013', 500],
      ['D114320500075', 280],
      ['D114313000020', 400],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 中央大学附属横浜は2024→2026年度で100から110へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000375' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000375' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(100);
    expect(yLatest?.totalCapacity).toBe(110);
  });

  it('掛-2(私立×多年度): 桐蔭学園は2024→2026年度でプログレス190+アドバンス280+スタンダード190=660からプログレス210+アドバンス300+スタンダード210=720へ増加', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000357' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
      (s) => s.schoolCode === 'D114310000357' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(660);
    expect(yLatest?.totalCapacity).toBe(720);
  });

  it('掛-2(私立×多年度・完了): 三浦学苑・山手学院・横須賀学院・横浜・横浜学園・横浜商科大学・横浜創学館の7校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D114320100024', 394],
      ['D114310000277', 170],
      ['D114320100042', 210],
      ['D114310000204', 610],
      ['D114310000188', 320],
      ['D114310000286', 580],
      ['D114310000213', 340],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 横浜清風・横浜創英・横浜隼人・横浜富士見丘学園の4校は2024→2026年度で実際の変化を検出', () => {
    const pairs: Array<[string, number, number]> = [
      ['D114310000179', 337, 340],
      ['D114310000080', 230, 220],
      ['D114310000348', 263, 251],
      ['D114310000302', 120, 150],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OSAKA(大都市圏5県の3県目・育伸社募集要項PDF1ページ目+公式サイト個別確認で91校を収録・スキップ16校・完全網羅・参照台帳107校)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OSAKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録91校(掛-2の2024年度75校分含め166レコード)・スキップ16校で参照台帳107校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OSAKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OSAKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.schools.length).toBe(166);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.skipped.length).toBe(16);
  });

  it('掛-2(私立×多年度): アサンプション国際・アナン学園・あべの翔学・上宮太子・上宮・英真学園・追手門学院・追手門学院大手前・大阪・大阪偕星学園・大阪学院大学・大阪薫英女学院・大阪暁光・大阪学芸の14校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000478', 120],
      ['D127310000566', 70],
      ['D127310000833', 300],
      ['D127310000717', 175],
      ['D127310000094', 480],
      ['D127310000780', 300],
      ['D127310000619', 350],
      ['D127310000389', 145],
      ['D127310000156', 550],
      ['D127310000806', 320],
      ['D127310000334', 400],
      ['D127310000502', 200],
      ['D127310000432', 280],
      ['D127310000842', 600],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 大阪産業大学附属・大阪国際の2校は2024→2026年度で実際の変化を検出', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000922', 560, 680],
      ['D127310000600', 305, 295],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・3ページ目): 大阪成蹊女子・大谷・大阪青凌・開明・大阪体育大学浪商・大阪電気通信大学の6校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000165', 400],
      ['D127310000192', 80],
      ['D127310000655', 280],
      ['D127310000824', 80],
      ['D127310000897', 265],
      ['D127310000931', 320],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・3ページ目): 大阪桐蔭(前提差異あり)・大阪夕陽丘学園(コース再編)の2校は2024→2026年度で総定員が変化', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000673', 450, 400],
      ['D127310000129', 360, 380],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・4ページ目): 金蘭会・関西大学高等部・関西福祉科学大学・関西大倉・賢明学院・建国・香ヶ丘リベルテの7校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000147', 210],
      ['D127310000726', 50],
      ['D127310000487', 270],
      ['D127310000398', 315],
      ['D127310000575', 220],
      ['D127310000263', 80],
      ['D127310000281', 222],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・4ページ目): 近畿大学泉州・近畿大学附属・関西大学北陽(前提差異あり)の3校は2024→2026年度で総定員が変化', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000584', 240, 210],
      ['D127310000548', 640, 650],
      ['D127310000771', 280, 385],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・5ページ目): 樟蔭・四天王寺・興國・金光藤蔭・堺リベラル・四天王寺東・金光大阪・香里ヌヴェール学院・四條畷学園の9校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000557', 210],
      ['D127310000110', 155],
      ['D127310000753', 590],
      ['D127310000815', 280],
      ['D127310000744', 74],
      ['D127310000735', 175],
      ['D127310000628', 360],
      ['D127310000414', 180],
      ['D127310000450', 480],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・5ページ目): 好文学園女子・金光八尾の2校は2024→2026年度で総定員が変化', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000762', 300, 270],
      ['D127310000691', 205, 220],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・6ページ目): 常翔学園・常翔啓光学園・城南学園・昇陽・精華・清教学園・清風・清風南海・清明学院の9校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000913', 480],
      ['D127310000370', 320],
      ['D127310000272', 230],
      ['D127310000049', 300],
      ['D127310000664', 320],
      ['D127310000441', 200],
      ['D127310000101', 250],
      ['D127310000520', 40],
      ['D127310000245', 360],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・6ページ目): 星翔は2024→2026年度で総定員が変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
      (s) => s.schoolCode === 'D127310000977' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
      (s) => s.schoolCode === 'D127310000977' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(300);
    expect(yLatest?.totalCapacity).toBe(335);
  });

  it('掛-2(私立×多年度・7ページ目): 大商学園・相愛・太成学院大学・羽衣学園・宣真・梅花の6校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000879', 360],
      ['D127310000058', 150],
      ['D127310000959', 320],
      ['D127310000511', 340],
      ['D127310000316', 280],
      ['D127310000290', 280],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・7ページ目): 同志社香里・東海大学付属大阪仰星の2校は2024→2026年度で総定員が変化', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000423', 60, 40],
      ['D127310000646', 200, 235],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・8ページ目): ピーエル学園・阪南大学・東大阪大学柏原・東大谷・箕面自由学園の5校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000405', 120],
      ['D127310000940', 440],
      ['D127310000496', 300],
      ['D127310000209', 280],
      ['D127310000307', 560],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・8ページ目): 利晶学園大阪立命館・東大阪大学敬愛・プール学院・明浄学院の4校は2024→2026年度で総定員が変化', () => {
    const pairs: Array<[string, number, number]> = [
      ['D127310000851', 360, 400],
      ['D127310000904', 300, 360],
      ['D127310000174', 260, 210],
      ['D127310001084', 300, 320],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・9ページ目=最終頁): 明星・桃山学院の2校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D127310000085', 120],
      ['D127310000218', 400],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度・9ページ目=最終頁): 早稲田大阪(旧早稲田摂陵)は2024→2026年度で総定員が変化', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
      (s) => s.schoolCode === 'D127310000968' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_OSAKA.schools.find(
      (s) => s.schoolCode === 'D127310000968' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(240);
    expect(yLatest?.totalCapacity).toBe(284);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_AICHI(大都市圏5県の4県目・育伸社募集要項PDF全5ページを一括処理で57校中50校を収録・スキップ7校で完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_AICHI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録97レコード(50校+掛-2多年度47レコード)・スキップ7件で参照台帳57校と完全一致(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_AICHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_AICHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_AICHI.schools.length).toBe(97);
    const distinctSchoolCodes = new Set(PRIVATE_SCHOOL_DETAIL_AICHI.schools.map((s) => s.schoolCode));
    expect(distinctSchoolCodes.size).toBe(50);
    expect(PRIVATE_SCHOOL_DETAIL_AICHI.skipped.length).toBe(7);
  });

  it('掛-2(私立×多年度): 栄徳は2024年度と2026年度で総定員380が完全一致', () => {
    const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
      (s) => s.schoolCode === 'D123310000409' && s.fiscalYearLabel === '2024年度'
    );
    const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
      (s) => s.schoolCode === 'D123310000409' && s.fiscalYearLabel !== '2024年度'
    );
    expect(y2024?.totalCapacity).toBe(380);
    expect(yLatest?.totalCapacity).toBe(380);
  });

  it('掛-2(私立×多年度): 愛知・愛知工業大学名電・愛知啓成・愛知産業大学三河・愛知みずほ大学瑞穂・安城学園の6校は2024→2026年度で定員減少(愛知のみ新設コースを含み増加)', () => {
    const pairs: Array<[string, number, number]> = [
      ['D123310000007', 353, 372],
      ['D123310000016', 547, 529],
      ['D123310000356', 276, 241],
      ['D123310000472', 436, 430],
      ['D123310000196', 442, 416],
      ['D123310000454', 540, 533],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・続き): 至学館・椙山女学園・聖カピタニオ女子の3校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D123310000132', 440],
      ['D123310000034', 200],
      ['D123310000310', 200],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 岡崎城西・菊華・享栄・啓明学館・桜丘・星城・誠信の7校は2024→2026年度で定員減少、修文学院のみ情報会計コース増員で定員増', () => {
    const pairs: Array<[string, number, number]> = [
      ['D123310000445', 540, 524],
      ['D123310000258', 346, 343],
      ['D123310000221', 520, 503],
      ['D123310000089', 249, 234],
      ['D123310000524', 591, 587],
      ['D123310000365', 608, 581],
      ['D123310000374', 274, 242],
      ['D123310000294', 392, 440],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・続き2): 大同大学大同・滝・中京大学附属中京・東海・東海学園・同朋の6校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D123310000249', 480],
      ['D123310000347', 110],
      ['D123310000178', 400],
      ['D123310000052', 40],
      ['D123310000285', 400],
      ['D123310000105', 470],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 清林館・聖霊・中部大学第一・中部大学春日丘・東邦・豊川は定員減、大成・杜若は定員増', () => {
    const pairs: Array<[string, number, number]> = [
      ['D123310000338', 454, 434],
      ['D123310000301', 234, 228],
      ['D123310000114', 405, 390],
      ['D123310000329', 533, 526],
      ['D123310000267', 623, 604],
      ['D123310000551', 489, 400],
      ['D123310000418', 134, 145],
      ['D123310000463', 254, 266],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });

  it('掛-2(私立×多年度・完了): 名古屋国際・誉・豊橋中央の3校は2024年度と2026年度で総定員が完全一致', () => {
    const pairs: Array<[string, number]> = [
      ['D123310000187', 145],
      ['D123310000392', 200],
      ['D123310000542', 225],
    ];
    for (const [code, total] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(total);
      expect(yLatest?.totalCapacity).toBe(total);
    }
  });

  it('掛-2(私立×多年度): 豊田大谷・名古屋・名古屋経済大学市邨・日本福祉大学付属・光ヶ丘女子・藤ノ花女子は定員減、名古屋大谷・名古屋経済大学高蔵・名古屋工業・名古屋たちばな・人間環境大学附属岡崎・名城大学附属は定員増', () => {
    const pairs: Array<[string, number, number]> = [
      ['D123310000481', 240, 229],
      ['D123310000070', 257, 221],
      ['D123310000043', 488, 467],
      ['D123310000276', 275, 250],
      ['D123310000436', 315, 310],
      ['D123310000533', 443, 409],
      ['D123310000212', 525, 545],
      ['D123310000230', 482, 495],
      ['D123310000141', 318, 320],
      ['D123310000123', 389, 429],
      ['D123310000427', 310, 315],
      ['D123310000098', 634, 637],
    ];
    for (const [code, before, after] of pairs) {
      const y2024 = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel === '2024年度'
      );
      const yLatest = PRIVATE_SCHOOL_DETAIL_AICHI.schools.find(
        (s) => s.schoolCode === code && s.fiscalYearLabel !== '2024年度'
      );
      expect(y2024?.totalCapacity).toBe(before);
      expect(yLatest?.totalCapacity).toBe(after);
    }
  });
});

describe('PRIVATE_SCHOOL_DETAIL_TOKYO(大都市圏5県の最後・育伸社募集要項PDF全20ページ処理完了+個別公式サイト調査11弾(廃校・募集停止校4校含む)+東京文華の公式PDF再訪で解決・241校を完全網羅達成・176校収録+スキップ65校)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOKYO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録176校・スキップ65校で参照台帳241校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOKYO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOKYO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_TOKYO.schools.length).toBe(176);
    expect(PRIVATE_SCHOOL_DETAIL_TOKYO.skipped.length).toBe(65);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_FUKUSHIMA(福島県庁「私立学校名簿」1PDFで全19校を一括処理・学科別入学定員=1学年募集定員を採用)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_FUKUSHIMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('schools-private/fukushima.tsの全19校がschoolsまたはskippedのいずれかで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUSHIMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_FUKUSHIMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('収録17校+スキップ2校(定員欄空白1校+通信制のみ1校)で参照台帳の19校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_FUKUSHIMA.schools.length).toBe(17);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUSHIMA.skipped.length).toBe(2);
  });
});

describe('private-school-detail index', () => {
  it('aichi/akita/aomori/chiba/ehime/fukui/fukuoka/fukushima/gifu/gunma/hiroshima/hyogo/ibaraki/ishikawa/iwate/kagawa/kagoshima/kanagawa/kochi/kumamoto/kyoto/mie/miyagi/miyazaki/nagano/nagasaki/nara/niigata/oita/okayama/okinawa/osaka/saga/saitama/shiga/shimane/shizuoka/tochigi/tokushima/tokyo/tottori/toyama/wakayama/yamagata/yamaguchi/yamanashiの46都県が集約されている', () => {
    expect(Object.keys(PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE).sort()).toEqual([
      'aichi',
      'akita',
      'aomori',
      'chiba',
      'ehime',
      'fukui',
      'fukuoka',
      'fukushima',
      'gifu',
      'gunma',
      'hiroshima',
      'hyogo',
      'ibaraki',
      'ishikawa',
      'iwate',
      'kagawa',
      'kagoshima',
      'kanagawa',
      'kochi',
      'kumamoto',
      'kyoto',
      'mie',
      'miyagi',
      'miyazaki',
      'nagano',
      'nagasaki',
      'nara',
      'niigata',
      'oita',
      'okayama',
      'okinawa',
      'osaka',
      'saga',
      'saitama',
      'shiga',
      'shimane',
      'shizuoka',
      'tochigi',
      'tokushima',
      'tokyo',
      'tottori',
      'toyama',
      'wakayama',
      'yamagata',
      'yamaguchi',
      'yamanashi',
    ]);
    expect(PRIVATE_SCHOOL_DETAIL_FILES).toHaveLength(46);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_EHIME(愛光高等学校+聖カタリナ学園高等学校+帝京第五高等学校+今治精華高等学校+松山学院高等学校+松山東雲高等学校+ＦＣ今治高等学校里山校+済美高等学校の8校を収録・参照台帳14校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_EHIME.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録7校・スキップ7校で参照台帳14校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_EHIME.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_EHIME, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_EHIME.schools.length).toBe(8);
    expect(PRIVATE_SCHOOL_DETAIL_EHIME.skipped.length).toBe(6);
  });
});
