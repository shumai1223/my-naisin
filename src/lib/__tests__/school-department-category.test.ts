import { resolveCategoryLabel, TOKYO_DEPARTMENT_TO_CATEGORY_LABEL } from '../school-department-category';
import { TOKYO_COMPETITION_RATES } from '@/data/competition-rates/tokyo';
import { TOKYO_COMPETITION_RATE_HISTORY } from '@/data/competition-rate-history/tokyo';

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
