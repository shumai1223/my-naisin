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

describe('PRIVATE_SCHOOL_DETAIL_MIYAZAKI(14校中9校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録9校・スキップ0件(残り5校は未着手・schools-private/miyazaki.tsの全14校のうち5校が未網羅)', () => {
    const allCodes = SCHOOLS_PRIVATE_MIYAZAKI.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_MIYAZAKI, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing.sort()).toEqual(
      [
        'D145320159018',
        'D145320259142',
        'D145320359098',
        'D145320559112',
        'D145320959163',
      ].sort()
    );
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.schools.length).toBe(9);
    expect(PRIVATE_SCHOOL_DETAIL_MIYAZAKI.skipped.length).toBe(0);
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

describe('PRIVATE_SCHOOL_DETAIL_IWATE(13校中2校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する(coursesが空のため常にtrue)', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_IWATE.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録2校・スキップ0件(残り11校は未着手・schools-private/iwate.tsの全13校のうち11校が未網羅)', () => {
    const allCodes = SCHOOLS_PRIVATE_IWATE.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_IWATE, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing.sort()).toEqual(
      [
        'D103310000010',
        'D103310000029',
        'D103310000038',
        'D103310000047',
        'D103310000056',
        'D103310000074',
        'D103310000083',
        'D103310000109',
        'D103310000118',
        'D103310000127',
        'D103310000136',
      ].sort()
    );
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.schools.length).toBe(2);
    expect(PRIVATE_SCHOOL_DETAIL_IWATE.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_CHIBA(62校中9校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_CHIBA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録9校・スキップ0件で残り53校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_CHIBA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_CHIBA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(53);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.schools.length).toBe(9);
    expect(PRIVATE_SCHOOL_DETAIL_CHIBA.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_OKAYAMA(27校中3校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する(coursesが空のため常にtrue)', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録3校・スキップ0件で残り24校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_OKAYAMA.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_OKAYAMA, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(24);
    expect(PRIVATE_SCHOOL_DETAIL_OKAYAMA.schools.length).toBe(3);
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

describe('PRIVATE_SCHOOL_DETAIL_HYOGO(55校中6校を収録・進行中)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_HYOGO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録6校・スキップ0件で残り49校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_HYOGO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_HYOGO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(49);
    expect(PRIVATE_SCHOOL_DETAIL_HYOGO.schools.length).toBe(6);
    expect(PRIVATE_SCHOOL_DETAIL_HYOGO.skipped.length).toBe(0);
  });
});

describe('PRIVATE_SCHOOL_DETAIL_NAGANO(県プレスリリースで26校中16校を完全収録・合計3,440と完全一致検算済み)', () => {
  it('収録した学校は全てcourses合計とtotalCapacityが一致する', () => {
    for (const school of PRIVATE_SCHOOL_DETAIL_NAGANO.schools) {
      expect(checkCourseCapacitySum(school)).toBe(true);
    }
  });

  it('収録16校・スキップ0件で残り10校は未着手(重複なし)', () => {
    const allCodes = SCHOOLS_PRIVATE_NAGANO.schools.map((s) => s.code);
    const result = findDuplicateOrMissingCodes(PRIVATE_SCHOOL_DETAIL_NAGANO, allCodes);
    expect(result.duplicates).toEqual([]);
    expect(result.missing).toHaveLength(10);
    expect(PRIVATE_SCHOOL_DETAIL_NAGANO.schools.length).toBe(16);
    expect(PRIVATE_SCHOOL_DETAIL_NAGANO.skipped.length).toBe(0);
    const grandTotal = PRIVATE_SCHOOL_DETAIL_NAGANO.schools.reduce((acc, s) => acc + s.totalCapacity, 0);
    expect(grandTotal).toBe(3440);
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

describe('private-school-detail index', () => {
  it('tottori/fukui/yamanashi/kochi/saga/tokushima/nagasaki/akita/shimane/toyama/wakayama/shiga/okinawa/ishikawa/kagawa/miyazaki/tochigi/iwate/chiba/okayama/shizuoka/saitama/fukuoka/hyogo/nagano/gifuの26県が集約されている', () => {
    expect(Object.keys(PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE).sort()).toEqual([
      'akita',
      'chiba',
      'fukui',
      'fukuoka',
      'gifu',
      'hyogo',
      'ishikawa',
      'iwate',
      'kagawa',
      'kochi',
      'miyazaki',
      'nagano',
      'nagasaki',
      'okayama',
      'okinawa',
      'saga',
      'saitama',
      'shiga',
      'shimane',
      'shizuoka',
      'tochigi',
      'tokushima',
      'tottori',
      'toyama',
      'wakayama',
      'yamanashi',
    ]);
    expect(PRIVATE_SCHOOL_DETAIL_FILES).toHaveLength(26);
  });
});
