import { checkCourseCapacitySum, findDuplicateOrMissingCodes, type PrivateSchoolDetail } from '@/lib/private-school-detail';
import { PRIVATE_SCHOOL_DETAIL_TOTTORI } from '@/data/private-school-detail/tottori';
import { PRIVATE_SCHOOL_DETAIL_FUKUI } from '@/data/private-school-detail/fukui';
import { PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE, PRIVATE_SCHOOL_DETAIL_FILES } from '@/data/private-school-detail';
import { SCHOOLS_PRIVATE_TOTTORI } from '@/data/schools-private/tottori';
import { SCHOOLS_PRIVATE_FUKUI } from '@/data/schools-private/fukui';

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

describe('private-school-detail index', () => {
  it('tottori/fukuiの2県が集約されている', () => {
    expect(Object.keys(PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE).sort()).toEqual(['fukui', 'tottori']);
    expect(PRIVATE_SCHOOL_DETAIL_FILES).toHaveLength(2);
  });
});
