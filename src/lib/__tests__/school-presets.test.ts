/**
 * 人気県の高校別プリセットデータ(SCHOOL_PRESETS)の不変条件テスト。
 * presets.test.tsと同型: 計算ロジックの無い静的データファイルだが、各校のratio
 * (naishin/gakuryoku)は「合計10」という暗黙の前提で手書きされており、examMaxは
 * 満点として正の値であるべき、という前提が崩れても検知する仕組みが無かった。
 */
import { SCHOOL_PRESETS, type SchoolPreset } from '../school-presets';

describe('SCHOOL_PRESETS 不変条件', () => {
  const allSchools: Array<{ prefecture: string; school: SchoolPreset }> = Object.entries(SCHOOL_PRESETS).flatMap(
    ([prefecture, schools]) => schools.map((school) => ({ prefecture, school }))
  );

  it('少なくとも1都道府県以上のデータを持つ', () => {
    expect(Object.keys(SCHOOL_PRESETS).length).toBeGreaterThan(0);
  });

  it.each(allSchools.map(({ prefecture, school }) => [`${prefecture}: ${school.name}`, school] as const))(
    '%s の比率(naishin+gakuryoku)は合計10になる',
    (_label, school) => {
      expect(school.ratio.naishin + school.ratio.gakuryoku).toBe(10);
    }
  );

  it.each(allSchools.map(({ prefecture, school }) => [`${prefecture}: ${school.name}`, school] as const))(
    '%s の比率成分は全て非負の数値', (_label, school) => {
      expect(school.ratio.naishin).toBeGreaterThanOrEqual(0);
      expect(school.ratio.gakuryoku).toBeGreaterThanOrEqual(0);
    }
  );

  it.each(allSchools.map(({ prefecture, school }) => [`${prefecture}: ${school.name}`, school] as const))(
    '%s のexamMaxは正の数値(入試の満点として意味を持つ範囲)', (_label, school) => {
      expect(school.examMax).toBeGreaterThan(0);
    }
  );

  it.each(allSchools.map(({ prefecture, school }) => [`${prefecture}: ${school.name}`, school] as const))(
    '%s は name/type/description が全て空文字でなく、featuresは空配列でない', (_label, school) => {
      expect(school.name.trim().length).toBeGreaterThan(0);
      expect(school.type.trim().length).toBeGreaterThan(0);
      expect(school.description.trim().length).toBeGreaterThan(0);
      expect(school.features.length).toBeGreaterThan(0);
    }
  );

  it('都道府県ごとに学校名の重複が無い(同名2件を上書きミスで見落とさない)', () => {
    for (const schools of Object.values(SCHOOL_PRESETS)) {
      const names = schools.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});
