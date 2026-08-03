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

  it('収録4校+スキップ4校で参照台帳の8校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOTTORI.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_DETAIL_TOTTORI.skipped.length).toBe(4);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_FUKUI(全校スキップ台帳)', () => {
  it('schools-private/fukui.tsの全8校がskippedで網羅されている(重複・欠落なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_FUKUI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('確度の高い確認が取れず全8校スキップ', () => {
    expect(PRIVATE_SCHOOL_DETAIL_FUKUI.schools.length).toBe(0);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUI.skipped.length).toBe(8);
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

  it('収録4校+スキップ5校で参照台帳の9校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_KOCHI.schools.length).toBe(4);
    expect(PRIVATE_SCHOOL_DETAIL_KOCHI.skipped.length).toBe(5);
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

  it('9校全てを収録しスキップ0件(県庁一次資料が全校を1枚で公表していたため)', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SAGA.schools.length).toBe(9);
    expect(PRIVATE_SCHOOL_DETAIL_SAGA.skipped.length).toBe(0);
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

  it('収録3校+スキップ2校で参照台帳の5校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.schools.length).toBe(3);
    expect(PRIVATE_SCHOOL_DETAIL_TOKUSHIMA.skipped.length).toBe(2);
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

  it('収録2校+スキップ3校で参照台帳の5校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_AKITA.schools.length).toBe(2);
    expect(PRIVATE_SCHOOL_DETAIL_AKITA.skipped.length).toBe(3);
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

  it('10校全てを収録しスキップ0件(私立中学高等学校協会の一覧PDFが全校を1枚で公表していたため)', () => {
    expect(PRIVATE_SCHOOL_DETAIL_TOYAMA.schools.length).toBe(10);
    expect(PRIVATE_SCHOOL_DETAIL_TOYAMA.skipped.length).toBe(0);
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

  it('収録10校+スキップ2校(全日制課程を持たない通信制専門校2校)で参照台帳の12校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_SHIGA.schools.length).toBe(10);
    expect(PRIVATE_SCHOOL_DETAIL_SHIGA.skipped.length).toBe(2);
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

  it('収録10校+スキップ2校(休校1校・広域通信制1校)で参照台帳の12校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_ISHIKAWA.schools.length).toBe(10);
    expect(PRIVATE_SCHOOL_DETAIL_ISHIKAWA.skipped.length).toBe(2);
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

  it('13校全てを収録しスキップ0件', () => {
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.schools.length).toBe(13);
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.skipped.length).toBe(0);
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

describe('PRIVATE_SCHOOL_DETAIL_OKAYAMA(27校中11校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録11校・スキップ0件で残り16校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OKAYAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OKAYAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(16);
    expect(PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools.length).toBe(11);
    expect(PRIVATE_SCHOOL_DETAIL_OKAYAMA.skipped.length).toBe(0);
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

describe('PRIVATE_SCHOOL_DETAIL_FUKUOKA(私学協会志願者数調で62校中57校を収録・4地区計/県合計17,340と完全一致検算済み)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する(coursesが空のため常にtrue)', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_FUKUOKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録57校+スキップ2校(高校入試を実施していない2校)+未着手3校(つくば開成福岡/福岡芸術/川崎特区明蓬館)で参照台帳の62校と一致する', () => {
    const allCodes = SCHOOLS_PRIVATE_FUKUOKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_FUKUOKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing.sort()).toEqual(['D140313000144', 'D140313000242', 'D140360500015'].sort());
    expect(PRIVATE_SCHOOL_DETAIL_FUKUOKA.schools.length).toBe(57);
    expect(PRIVATE_SCHOOL_DETAIL_FUKUOKA.skipped.length).toBe(2);
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

describe('PRIVATE_SCHOOL_DETAIL_MIE(私学協会一覧で21校中13校=全日制を完全収録・合計3,760と完全一致検算済み)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_MIE.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録13校・スキップ0件で残り8校(通信制)は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_MIE.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_MIE, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(8);
    expect(PRIVATE_SCHOOL_DETAIL_MIE.schools.length).toBe(13);
    expect(PRIVATE_SCHOOL_DETAIL_MIE.skipped.length).toBe(0);
    const grandTotal = PRIVATE_SCHOOL_DETAIL_MIE.schools.reduce((acc, s) => acc + s.totalCapacity, 0);
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

  it('17校全てを収録しスキップ0件', () => {
    expect(PRIVATE_SCHOOL_DETAIL_AOMORI.schools.length).toBe(17);
    expect(PRIVATE_SCHOOL_DETAIL_AOMORI.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_MIYAGI(個別学校サイト2校+育伸社募集要項PDFで11校追加・21校中13校を収録)', () => {
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

  it('収録13校+スキップ8校(掲載なし)で参照台帳の21校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_MIYAGI.schools.length).toBe(13);
    expect(PRIVATE_SCHOOL_DETAIL_MIYAGI.skipped.length).toBe(8);
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

describe('PRIVATE_SCHOOL_DETAIL_YAMAGATA(育伸社募集要項PDFで15校中12校を収録・羽黒は数値記載なし・和順館/基督教独立学園は掲載なしで見送り)', () => {
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

  it('収録12校+スキップ3校(数値記載なし1校+掲載なし2校)で参照台帳の15校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGATA.schools.length).toBe(12);
    expect(PRIVATE_SCHOOL_DETAIL_YAMAGATA.skipped.length).toBe(3);
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

  it('収録11校+スキップ3校(掲載なし)で参照台帳の14校と一致する', () => {
    expect(PRIVATE_SCHOOL_DETAIL_GUNMA.schools.length).toBe(11);
    expect(PRIVATE_SCHOOL_DETAIL_GUNMA.skipped.length).toBe(3);
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

describe('PRIVATE_SCHOOL_DETAIL_KANAGAWA(大都市圏5県・育伸社募集要項PDF1〜7ページ目+公式サイト個別確認53校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録53校・スキップ27校で参照台帳83校のうち残り3校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_KANAGAWA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_KANAGAWA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(3);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.schools.length).toBe(53);
    expect(PRIVATE_SCHOOL_DETAIL_KANAGAWA.skipped.length).toBe(27);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OSAKA(大都市圏5県の3県目・育伸社募集要項PDF1ページ目+公式サイト個別確認で41校を収録・スキップ4校・進行中・参照台帳107校)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OSAKA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録41校・スキップ4校で参照台帳107校のうち残り62校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OSAKA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OSAKA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(62);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.schools.length).toBe(41);
    expect(PRIVATE_SCHOOL_DETAIL_OSAKA.skipped.length).toBe(4);
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

describe('PRIVATE_SCHOOL_DETAIL_TOKYO(大都市圏5県の最後・育伸社募集要項PDF全20ページ処理完了+個別公式サイト調査5弾(廃校・募集停止校4校含む)+東京文華の公式PDF再訪で解決・241校中172校を収録・スキップ62校・残り7校は別チャネルで継続調査)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_TOKYO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録172校・スキップ62校で参照台帳241校のうち残り7校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_TOKYO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_TOKYO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(7);
    expect(PRIVATE_SCHOOL_DETAIL_TOKYO.schools.length).toBe(172);
    expect(PRIVATE_SCHOOL_DETAIL_TOKYO.skipped.length).toBe(62);
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

describe('PRIVATE_SCHOOL_DETAIL_EHIME(愛光高等学校+聖カタリナ学園高等学校+帝京第五高等学校+今治精華高等学校+松山学院高等学校+松山東雲高等学校の6校を収録・残り4校は未着手)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_EHIME.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録6校・スキップ4校で参照台帳14校のうち残り4校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_EHIME.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_EHIME, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(4);
    expect(PRIVATE_SCHOOL_DETAIL_EHIME.schools.length).toBe(6);
    expect(PRIVATE_SCHOOL_DETAIL_EHIME.skipped.length).toBe(4);
  });
});
