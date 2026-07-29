import { isPlausibleSubjectSum, type ExamScoreYearEntry } from '@/lib/exam-score-statistics';
import { EXAM_SCORE_STATISTICS_KOCHI } from '@/data/exam-score-statistics/kochi';

describe('isPlausibleSubjectSum', () => {
  const base: ExamScoreYearEntry = {
    fiscalYearLabel: '令和6年度',
    averageType: 'test-takers',
    subjects: [
      { subject: '国語', averageScore: 20, maxScore: 50 },
      { subject: '数学', averageScore: 20, maxScore: 50 },
    ],
    totalAverage: 40,
    totalMaxScore: 100,
  };

  it('教科合計とtotalAverageが完全一致すればtrue', () => {
    expect(isPlausibleSubjectSum(base)).toBe(true);
  });

  it('丸め誤差程度の差(0.2点)は許容してtrue', () => {
    expect(isPlausibleSubjectSum({ ...base, totalAverage: 40.2 })).toBe(true);
  });

  it('明らかにかけ離れた差(10点)はfalse', () => {
    expect(isPlausibleSubjectSum({ ...base, totalAverage: 50 })).toBe(false);
  });
});

describe('EXAM_SCORE_STATISTICS_KOCHI(パイロット実データ)', () => {
  it('5年度分(令和2〜6年度)が収録されている', () => {
    expect(EXAM_SCORE_STATISTICS_KOCHI.years).toHaveLength(5);
  });

  it('全年度でaverageTypeがtest-takers(全受検者平均)に統一されている', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(year.averageType).toBe('test-takers');
    }
  });

  it('全年度で教科別平均点の合計がtotalAverageと妥当な範囲で一致する', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(isPlausibleSubjectSum(year)).toBe(true);
    }
  });

  it('全年度で5教科(国語・社会・数学・理科・英語)が揃っている', () => {
    for (const year of EXAM_SCORE_STATISTICS_KOCHI.years) {
      expect(year.subjects.map((s) => s.subject).sort()).toEqual(
        ['国語', '社会', '数学', '理科', '英語'].sort()
      );
    }
  });
});
