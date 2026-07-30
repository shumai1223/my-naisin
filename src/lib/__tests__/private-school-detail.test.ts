import { checkCourseCapacitySum, findDuplicateOrMissingCodes, type PrivateSchoolDetail } from '@/lib/private-school-detail';
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

describe('private-school-detail index', () => {
  it('tottori/fukui/yamanashi/kochi/saga/tokushima/nagasaki/akita/shimane/toyama/wakayama/shiga/okinawa/ishikawaの14県が集約されている', () => {
    expect(Object.keys(PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE).sort()).toEqual([
      'akita',
      'fukui',
      'ishikawa',
      'kochi',
      'nagasaki',
      'okinawa',
      'saga',
      'shiga',
      'shimane',
      'tokushima',
      'tottori',
      'toyama',
      'wakayama',
      'yamanashi',
    ]);
    expect(PRIVATE_SCHOOL_DETAIL_FILES).toHaveLength(14);
  });
});
