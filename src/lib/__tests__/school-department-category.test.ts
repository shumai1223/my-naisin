import { resolveCategoryLabel, TOKYO_DEPARTMENT_TO_CATEGORY_LABEL, HIROSHIMA_DEPARTMENT_TO_CATEGORY_LABEL } from '../school-department-category';
import { TOKYO_COMPETITION_RATES } from '@/data/competition-rates/tokyo';
import { TOKYO_COMPETITION_RATE_HISTORY } from '@/data/competition-rate-history/tokyo';
import { HIROSHIMA_COMPETITION_RATES } from '@/data/competition-rates/hiroshima';
import { HIROSHIMA_COMPETITION_RATE_HISTORY } from '@/data/competition-rate-history/hiroshima';

describe('resolveCategoryLabel', () => {
  test('対応表が無い都道府県はnullを返す(あいまいな推測をしない)', () => {
    expect(resolveCategoryLabel('osaka', '普通科')).toBeNull();
  });

  test('対応表にない学科はnullを返す', () => {
    expect(resolveCategoryLabel('tokyo', '存在しない学科')).toBeNull();
  });

  test('東京都の普通科は正しいΛ-4カテゴリ名に対応する', () => {
    expect(resolveCategoryLabel('tokyo', '普通科')).toBe('普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計');
  });
});

describe('東京都の対応表クロス検証（実データ整合性）', () => {
  test('competition-ratesに現れる全departmentが対応表でカバーされている(1件ずつ手で確認済みの完全一致表であること)', () => {
    const departmentsInUse = new Set(TOKYO_COMPETITION_RATES.records.map((r) => r.department));
    const uncovered = [...departmentsInUse].filter((d) => !(d in TOKYO_DEPARTMENT_TO_CATEGORY_LABEL));
    expect(uncovered).toEqual([]);
  });

  test('対応表が指す全カテゴリラベルが、Λ-4(competition-rate-history)の直近年度に実在する', () => {
    const latestYear = TOKYO_COMPETITION_RATE_HISTORY.years[0];
    const categoryLabelsInHistory = new Set(latestYear.categories.map((c) => c.label));
    const mappedLabels = [...new Set(Object.values(TOKYO_DEPARTMENT_TO_CATEGORY_LABEL))];
    const missing = mappedLabels.filter((label) => !categoryLabelsInHistory.has(label));
    expect(missing).toEqual([]);
  });
});

describe('広島県の対応表クロス検証（実データ整合性・2026-08-02判明の意図的な部分収録）', () => {
  test('広島県の普通科は正しいΛ-4カテゴリ名に対応する', () => {
    expect(resolveCategoryLabel('hiroshima', '普通')).toBe('普通科');
  });

  test('家庭科・農業科は区分合計の算術検証で一意に定まらなかったため未収録(nullを返す)', () => {
    expect(resolveCategoryLabel('hiroshima', '家政')).toBeNull();
    expect(resolveCategoryLabel('hiroshima', '生活')).toBeNull();
    expect(resolveCategoryLabel('hiroshima', '園芸')).toBeNull();
  });

  test('対応表が指す全カテゴリラベルが、Λ-4(competition-rate-history)の直近年度に実在する', () => {
    const latestYear = HIROSHIMA_COMPETITION_RATE_HISTORY.years[0];
    const categoryLabelsInHistory = new Set(latestYear.categories.map((c) => c.label));
    const mappedLabels = [...new Set(Object.values(HIROSHIMA_DEPARTMENT_TO_CATEGORY_LABEL))];
    const missing = mappedLabels.filter((label) => !categoryLabelsInHistory.has(label));
    expect(missing).toEqual([]);
  });

  test('意図的に未収録とした学科名(家庭科・農業科の境界)は、実データのdepartmentに実在することを確認する(将来の再検証の起点)', () => {
    const departmentsInUse = new Set(HIROSHIMA_COMPETITION_RATES.records.map((r) => r.department));
    const intentionallyUnmapped = [
      '家政', '生活', '生活福祉', '生活科学', '園芸デザイン', '食デザイン', '人間福祉',
      '園芸', '畜産', '農業機械', '農業経営', '緑地土木', '生物工学', '生物生産学',
      '食品工学', '食品科学', 'アグリビジネス', '産業ビジネス',
    ];
    for (const dept of intentionallyUnmapped) {
      expect(departmentsInUse.has(dept)).toBe(true);
      expect(dept in HIROSHIMA_DEPARTMENT_TO_CATEGORY_LABEL).toBe(false);
    }
  });
});
