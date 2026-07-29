/**
 * 秋田県公立高等学校入学者選抜 学力検査結果（Λ-12・全日制課程一般選抜受検者の抽出調査・各教科100点満点）。
 *
 * 秋田県教育委員会は受検者答案の8%を抽出して教科別平均点を分析・公表している（新潟県の抽出調査と
 * 同型の方式）。報道記事(リセマム/ReseEd)を出典とし、令和7・8年度分は同一記事内で当年度・前年度の
 * 実測値が両方明記されているため、5教科・合計とも独立記事間の整合を相互確認済み
 * （令和7年度の値は令和8年度記事の前年度列と令和6年度記事双方には現れないため単独出典）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_R6 = {
  url: 'https://reseed.resemom.jp/article/2024/05/29/8840.html',
  docTitle: '【高校受験2024】秋田県公立高の学力検査…5教科平均8.8点減の277.6点(教育業界ニュースReseEd)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R8 = {
  url: 'https://resemom.jp/article/2026/06/01/86254.html',
  docTitle: '【高校受験2026】秋田県公立高の学力検査…5教科平均10点減(リセマム)',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_AKITA: ExamScoreStatisticsFile = {
  prefectureCode: 'akita',
  source: SOURCE_R8,
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 67.8, maxScore: 100 },
        { subject: '社会', averageScore: 59.3, maxScore: 100 },
        { subject: '数学', averageScore: 48.7, maxScore: 100 },
        { subject: '理科', averageScore: 51.9, maxScore: 100 },
        { subject: '英語', averageScore: 49.9, maxScore: 100 },
      ],
      totalAverage: 277.6,
      totalMaxScore: 500,
      source: SOURCE_R6,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 66.3, maxScore: 100 },
        { subject: '社会', averageScore: 53.7, maxScore: 100 },
        { subject: '数学', averageScore: 47.6, maxScore: 100 },
        { subject: '理科', averageScore: 56.8, maxScore: 100 },
        { subject: '英語', averageScore: 49.8, maxScore: 100 },
      ],
      totalAverage: 274.2,
      totalMaxScore: 500,
      source: SOURCE_R8,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 65.2, maxScore: 100 },
        { subject: '社会', averageScore: 56.4, maxScore: 100 },
        { subject: '数学', averageScore: 40.4, maxScore: 100 },
        { subject: '理科', averageScore: 52.0, maxScore: 100 },
        { subject: '英語', averageScore: 50.0, maxScore: 100 },
      ],
      totalAverage: 264.0,
      totalMaxScore: 500,
      testTakerCount: 4220,
      source: SOURCE_R8,
    },
  ],
};
