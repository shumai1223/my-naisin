import { SCHOOL_NAME_ALIASES_BY_PREFECTURE } from '../school-name-aliases';
import { matchSchoolNameToCode } from '../school-name-match';
import { SCHOOLS_MIYAGI } from '@/data/schools/miyagi';

describe('SCHOOL_NAME_ALIASES_BY_PREFECTURE', () => {
  test('miyagiの全18エイリアスが実データ(school-master)で一意に(matched)解決する(将来のマスター更新に対する回帰防止)', () => {
    const aliases = SCHOOL_NAME_ALIASES_BY_PREFECTURE.miyagi ?? {};
    const rawNames = Object.keys(aliases);
    expect(rawNames.length).toBe(18);

    for (const raw of rawNames) {
      const target = aliases[raw];
      const result = matchSchoolNameToCode(target, SCHOOLS_MIYAGI.schools);
      expect({ raw, target, reason: result.reason }).toEqual({ raw, target, reason: 'matched' });
    }
  });

  test('エイリアス適用後のmatchedCodeは互いに重複しない(異なる略称が同じ学校に誤って合流していない)', () => {
    const aliases = SCHOOL_NAME_ALIASES_BY_PREFECTURE.miyagi ?? {};
    const codes = Object.values(aliases).map(
      (target) => matchSchoolNameToCode(target, SCHOOLS_MIYAGI.schools).matchedCode
    );
    expect(new Set(codes).size).toBe(codes.length);
  });
});
