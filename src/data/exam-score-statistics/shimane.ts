/**
 * 島根県公立高等学校入学者選抜（一般選抜）学力検査の得点状況（Λ-12・受検者平均点）。
 * 島根県教育委員会「令和7年度島根県公立高等学校入学者選抜の結果と分析」PDF(表7)に
 * 令和7年度・令和6年度の2年度分(当年度+前年度併記)が収録されている。
 * 各教科50点満点・5教科合計250点満点(本文に明記)。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_SHIMANE: ExamScoreStatisticsFile = {
  prefectureCode: 'shimane',
  source: {
    url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/R7_koukounyuushikekkatobunnseki.pdf',
    docTitle: '令和7年度島根県公立高等学校入学者選抜の結果と分析（島根県教育委員会・令和6年度分の比較列を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 28.5, maxScore: 50 },
        { subject: '社会', averageScore: 27.4, maxScore: 50 },
        { subject: '数学', averageScore: 26.8, maxScore: 50 },
        { subject: '理科', averageScore: 25.2, maxScore: 50 },
        { subject: '英語', averageScore: 27.3, maxScore: 50 },
      ],
      totalAverage: 135.1,
      totalMaxScore: 250,
      testTakerCount: 3459,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 25.4, maxScore: 50 },
        { subject: '社会', averageScore: 26.9, maxScore: 50 },
        { subject: '数学', averageScore: 22.1, maxScore: 50 },
        { subject: '理科', averageScore: 25.2, maxScore: 50 },
        { subject: '英語', averageScore: 25.8, maxScore: 50 },
      ],
      totalAverage: 125.0,
      totalMaxScore: 250,
      testTakerCount: 2591,
    },
  ],
};
