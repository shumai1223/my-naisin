import { SCHOOL_NAME_ALIASES_BY_PREFECTURE } from '../school-name-aliases';
import { matchSchoolNameToCode } from '../school-name-match';
import { SCHOOLS_MIYAGI } from '@/data/schools/miyagi';
import { SCHOOLS_NIIGATA } from '@/data/schools/niigata';
import { SCHOOLS_HOKKAIDO } from '@/data/schools/hokkaido';
import { SCHOOLS_KYOTO } from '@/data/schools/kyoto';
import { SCHOOLS_OSAKA } from '@/data/schools/osaka';
import { SCHOOLS_KUMAMOTO } from '@/data/schools/kumamoto';
import { SCHOOLS_NAGANO } from '@/data/schools/nagano';
import { SCHOOLS_SAGA } from '@/data/schools/saga';

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

  // T-S1 DoD①(2026-08-29追加): scripts/check-school-name-gaps.mjsで発見した29件のうち8件を
  // 1件ずつ実データと突合して追加したエイリアス（niigata3・hokkaido2・kyoto1・osaka1・kumamoto1）。
  // nagano1件は既存のnagano配下に追加。miyagiと同じ回帰防止パターンで検証する。
  const prefectureFixtures: Array<[string, { schools: Array<{ code: string; name: string }> }]> = [
    ['nagano', SCHOOLS_NAGANO],
    ['niigata', SCHOOLS_NIIGATA],
    ['hokkaido', SCHOOLS_HOKKAIDO],
    ['kyoto', SCHOOLS_KYOTO],
    ['osaka', SCHOOLS_OSAKA],
    ['kumamoto', SCHOOLS_KUMAMOTO],
    ['saga', SCHOOLS_SAGA],
  ];

  test.each(prefectureFixtures)(
    '%sのエイリアスが実データ(school-master)で一意に(matched)解決し、matchedCodeが重複しない',
    (prefCode, master) => {
      const aliases = SCHOOL_NAME_ALIASES_BY_PREFECTURE[prefCode] ?? {};
      const rawNames = Object.keys(aliases);
      expect(rawNames.length).toBeGreaterThan(0);

      const codes: (string | null)[] = [];
      for (const raw of rawNames) {
        const target = aliases[raw];
        const result = matchSchoolNameToCode(target, master.schools);
        expect({ raw, target, reason: result.reason }).toEqual({ raw, target, reason: 'matched' });
        codes.push(result.matchedCode);
      }
      expect(new Set(codes).size).toBe(codes.length);
    }
  );
});
