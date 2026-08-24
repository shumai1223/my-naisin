import { buildSchoolFaqItems } from '../school-page-faq';
import type { SchoolPageData } from '../school-page-data';

function schoolData(overrides: Partial<SchoolPageData> & { schoolCode: string }): SchoolPageData {
  return {
    schoolName: `${overrides.schoolCode}高等学校`,
    address: '',
    departmentRates: [],
    totalQuota: 0,
    totalApplicants: 0,
    overallRate: 0,
    history: [],
    ...overrides,
  };
}

describe('buildSchoolFaqItems', () => {
  test('倍率の実数のみを埋め込み、偏差値・口コミには一切触れない', () => {
    const school = schoolData({
      schoolCode: 'T1',
      schoolName: '東京都立日比谷高等学校',
      totalQuota: 253,
      totalApplicants: 520,
      overallRate: 2.06,
    });

    const items = buildSchoolFaqItems(school, '東京都');

    expect(items[0].question).toContain('東京都立日比谷高等学校');
    expect(items[0].answer).toBe(
      '2.06倍です（募集人員253名に対し応募者数520名。東京都教育委員会が公表した一次データに基づく数値です）。',
    );
    // 偏差値・合格最低点・口コミ評価の「数値」を一切捏造しないこと（捏造ゼロ・Y-0憲法）。
    // 「掲載していません」と明示するFAQ自体はあってよいが、それ以外に数値付きで言及してはならない。
    const allText = items.map((i) => `${i.question}${i.answer}`).join('');
    expect(allText).not.toMatch(/偏差値[^。]*\d|合格最低点[^。]*\d|口コミ評価は\d/);
  });

  test('偏差値非掲載の明示的なFAQが必ず含まれる', () => {
    const school = schoolData({ schoolCode: 'T2' });
    const items = buildSchoolFaqItems(school, '東京都');
    const hensachiFaq = items.find((i) => i.question.includes('偏差値'));
    expect(hensachiFaq).toBeDefined();
    expect(hensachiFaq!.answer).toContain('掲載していません');
  });

  test('多年度推移データが無い学校には推移に関するFAQを追加しない（捏造回避）', () => {
    const school = schoolData({ schoolCode: 'T3', history: [] });
    const items = buildSchoolFaqItems(school, '東京都');
    expect(items.some((i) => i.question.includes('推移'))).toBe(false);
  });

  test('多年度推移データがある学校には推移に関するFAQを追加する', () => {
    const school = schoolData({
      schoolCode: 'T4',
      history: [{ fiscalYear: '令和7年度（2025年度）', department: '普通科', quota: 200, applicants: 300, rate: 1.5, source: null }],
    });
    const items = buildSchoolFaqItems(school, '東京都');
    expect(items.some((i) => i.question.includes('推移'))).toBe(true);
  });
});
