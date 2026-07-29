/**
 * 高知県公立高等学校入学者選抜 学力検査の結果分析（Λ-12第一段・全受検者平均）。
 * 高知県教育委員会が毎年公表する「学力検査の結果分析」PDFに、当該年度を含む過去5年分の
 * 教科別平均点推移表が掲載されており、1つの一次ソースから5年度分を収録できた。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.kochi.lg.jp/doc/r6_bunseki/file_contents/R6_bunseki_honsatsu.pdf',
  docTitle: '令和6年度 高知県公立高等学校入学者選抜における学力検査の結果分析（高知県教育委員会・令和6年7月）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_KOCHI: ExamScoreStatisticsFile = {
  prefectureCode: 'kochi',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 20.4, maxScore: 50 },
        { subject: '社会', averageScore: 19.4, maxScore: 50 },
        { subject: '数学', averageScore: 19.0, maxScore: 50 },
        { subject: '理科', averageScore: 23.3, maxScore: 50 },
        { subject: '英語', averageScore: 24.7, maxScore: 50 },
      ],
      totalAverage: 106.8,
      totalMaxScore: 250,
      testTakerCount: 3836,
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 22.6, maxScore: 50 },
        { subject: '社会', averageScore: 24.9, maxScore: 50 },
        { subject: '数学', averageScore: 21.1, maxScore: 50 },
        { subject: '理科', averageScore: 22.0, maxScore: 50 },
        { subject: '英語', averageScore: 23.6, maxScore: 50 },
      ],
      totalAverage: 114.2,
      totalMaxScore: 250,
      testTakerCount: 3632,
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 22.4, maxScore: 50 },
        { subject: '社会', averageScore: 23.4, maxScore: 50 },
        { subject: '数学', averageScore: 16.2, maxScore: 50 },
        { subject: '理科', averageScore: 19.9, maxScore: 50 },
        { subject: '英語', averageScore: 20.6, maxScore: 50 },
      ],
      totalAverage: 102.5,
      totalMaxScore: 250,
      testTakerCount: 3696,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 21.3, maxScore: 50 },
        { subject: '社会', averageScore: 25.1, maxScore: 50 },
        { subject: '数学', averageScore: 19.2, maxScore: 50 },
        { subject: '理科', averageScore: 20.5, maxScore: 50 },
        { subject: '英語', averageScore: 24.6, maxScore: 50 },
      ],
      totalAverage: 110.7,
      totalMaxScore: 250,
      testTakerCount: 3543,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 21.7, maxScore: 50 },
        { subject: '社会', averageScore: 19.0, maxScore: 50 },
        { subject: '数学', averageScore: 18.3, maxScore: 50 },
        { subject: '理科', averageScore: 19.9, maxScore: 50 },
        { subject: '英語', averageScore: 22.9, maxScore: 50 },
      ],
      totalAverage: 101.6,
      totalMaxScore: 250,
      testTakerCount: 3673,
    },
  ],
};
