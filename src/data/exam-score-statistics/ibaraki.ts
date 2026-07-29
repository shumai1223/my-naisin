/**
 * 茨城県立高等学校入学者選抜 学力検査の成績概況（Λ-12・全日制課程）。
 * 茨城県教育委員会が毎年6月頃に公表する「実施状況報告書」PDFに、教科別得点分布表
 * （合計人数・得点合計・平均点・最高点・最低点）が全受検者(受検者)ベースで収録されている。
 * 各教科100点満点・5教科合計500点満点。
 *
 * 令和7年度報告書のみ「合格者」区分の教科別平均点も別掲されていたため両方収録した
 * （令和4年度・令和6年度の報告書は受検者区分のみで合格者区分の掲載が無く、独自に按分せず
 * 正直に受検者区分のみとした）。令和5年度分は実施状況報告書のPDF直接URLを特定できず見送り。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_IBARAKI: ExamScoreStatisticsFile = {
  prefectureCode: 'ibaraki',
  source: {
    url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/06/pdf20250618defbsdv.pdf',
    docTitle: '令和7年度茨城県立高等学校入学者選抜実施状況報告書（茨城県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 78.05, maxScore: 100 },
        { subject: '社会', averageScore: 61.48, maxScore: 100 },
        { subject: '数学', averageScore: 46.55, maxScore: 100 },
        { subject: '理科', averageScore: 49.86, maxScore: 100 },
        { subject: '英語', averageScore: 50.26, maxScore: 100 },
      ],
      totalAverage: 286.21,
      totalMaxScore: 500,
      testTakerCount: 17592,
      source: {
        url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2023/02/0610houkoku.pdf',
        docTitle: '令和4年度茨城県立高等学校入学者選抜実施状況報告書（茨城県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 66.71, maxScore: 100 },
        { subject: '社会', averageScore: 57.55, maxScore: 100 },
        { subject: '数学', averageScore: 57.57, maxScore: 100 },
        { subject: '理科', averageScore: 55.61, maxScore: 100 },
        { subject: '英語', averageScore: 50.08, maxScore: 100 },
      ],
      totalAverage: 287.52,
      totalMaxScore: 500,
      testTakerCount: 16395,
      source: {
        url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2024/06/ff5d06eb1c111c7f6567ce78056313be.pdf',
        docTitle: '令和6年度茨城県立高等学校入学者選抜実施状況報告書（茨城県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 55.62, maxScore: 100 },
        { subject: '社会', averageScore: 53.80, maxScore: 100 },
        { subject: '数学', averageScore: 56.09, maxScore: 100 },
        { subject: '理科', averageScore: 52.19, maxScore: 100 },
        { subject: '英語', averageScore: 42.63, maxScore: 100 },
      ],
      totalAverage: 260.33,
      totalMaxScore: 500,
      testTakerCount: 16223,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 55.82, maxScore: 100 },
        { subject: '社会', averageScore: 53.89, maxScore: 100 },
        { subject: '数学', averageScore: 56.16, maxScore: 100 },
        { subject: '理科', averageScore: 52.33, maxScore: 100 },
        { subject: '英語', averageScore: 42.69, maxScore: 100 },
      ],
      totalAverage: 260.88,
      totalMaxScore: 500,
      testTakerCount: 14701,
    },
  ],
};
