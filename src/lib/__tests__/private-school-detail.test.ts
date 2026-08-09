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

  it('収録13校+スキップ1校(掲載なし)で参照台帳の14校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.length).toBe(13);
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.skipped.length).toBe(1);
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

  it('収録52校・スキップ10件で参照台帳の62校と完全一致(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_CHIBA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_CHIBA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.schools.length).toBe(52);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.skipped.length).toBe(10);
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

  it('収録20校+スキップ5校(概算表記1校+広域通信制4校)で参照台帳の25校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KUMAMOTO.schools.length).toBe(20);
    expect(PRIVATE_SCHOOL_DETAIL_KUMAMOTO.skipped.length).toBe(5);
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

  it('収録13校+スキップ2校(掲載なし)で参照台帳の15校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_OITA.schools.length).toBe(13);
    expect(PRIVATE_SCHOOL_DETAIL_OITA.skipped.length).toBe(2);
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

  it('収録21校+スキップ1校(掲載なし)で参照台帳の22校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.schools.length).toBe(21);
    expect(PRIVATE_SCHOOL_DETAIL_KAGOSHIMA.skipped.length).toBe(1);
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

  it('収録22校+スキップ14校(掲載なし13校+数値不明瞭1校)で参照台帳の36校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_IBARAKI.schools.length).toBe(22);
    expect(PRIVATE_SCHOOL_DETAIL_IBARAKI.skipped.length).toBe(14);
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

  it('収録20校+スキップ3校(掲載なし)で参照台帳の23校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.schools.length).toBe(20);
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGUCHI.skipped.length).toBe(3);
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

  it('収録12校+スキップ6校(掲載なし)で参照台帳の18校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_NARA.schools.length).toBe(12);
    expect(PRIVATE_SCHOOL_DETAIL_NARA.skipped.length).toBe(6);
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

  it('収録37校+スキップ7校で参照台帳の44校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KYOTO.schools.length).toBe(37);
    expect(PRIVATE_SCHOOL_DETAIL_KYOTO.skipped.length).toBe(7);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_KANAGAWA(大都市圏5県・育伸社募集要項PDF1〜7ページ目+公式サイト個別確認56校を収録・スキップ27校で参照台帳83校を完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録56校・スキップ27校で参照台帳83校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KANAGAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KANAGAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.length).toBe(56);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.skipped.length).toBe(27);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OSAKA(大都市圏5県の3県目・育伸社募集要項PDF1ページ目+公式サイト個別確認で91校を収録・スキップ16校・完全網羅・参照台帳107校)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OSAKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録91校・スキップ16校で参照台帳107校を完全網羅(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OSAKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OSAKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.schools.length).toBe(91);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.skipped.length).toBe(16);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_AICHI(大都市圏5県の4県目・育伸社募集要項PDF全5ページを一括処理で57校中50校を収録・スキップ7校で完全網羅)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_AICHI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録50校・スキップ7件で参照台帳57校と完全一致(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_AICHI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_AICHI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(0);
    expect(PRIVATE_SCHOOL_DETAIL_AICHI.schools.length).toBe(50);
    expect(PRIVATE_SCHOOL_DETAIL_AICHI.skipped.length).toBe(7);
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
