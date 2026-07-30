/**
 * 山口県公立高等学校入学者選抜「学力検査得点状況」（Λ-12・全教科受検者の平均点）。
 * 山口県教育委員会が毎年公表するPDF/報道発表ページに教科別平均点が直接明記されている。
 * 令和7年度版PDF(資料1)は前年度(令和6年度)の数値を括弧内に併記しており、令和6年度の
 * 報道発表ページ本体の数値(31.5/24.5/23.1/26.8/26.6・合計132.4)と完全一致することを
 * 確認済み(クロスチェック2重)。各教科50点満点・5教科合計250点満点。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_YAMAGUCHI: ExamScoreStatisticsFile = {
  prefectureCode: 'yamaguchi',
  source: {
    url: 'https://www.pref.yamaguchi.lg.jp/uploaded/life/300978_574087_misc.pdf',
    docTitle: '令和7年度山口県公立高等学校入学者選抜のための学力検査得点状況（山口県教育委員会・前年度分の比較列を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 23.6, maxScore: 50 },
        { subject: '社会', averageScore: 25.8, maxScore: 50 },
        { subject: '数学', averageScore: 24.5, maxScore: 50 },
        { subject: '理科', averageScore: 24.4, maxScore: 50 },
        { subject: '英語', averageScore: 28.5, maxScore: 50 },
      ],
      totalAverage: 126.7,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.yamaguchi.lg.jp/press/151969.html',
        docTitle: '令和4年度山口県公立高等学校入学者選抜のための学力検査得点状況について（山口県）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.1, maxScore: 50 },
        { subject: '社会', averageScore: 27.1, maxScore: 50 },
        { subject: '数学', averageScore: 21.6, maxScore: 50 },
        { subject: '理科', averageScore: 24.5, maxScore: 50 },
        { subject: '英語', averageScore: 25.6, maxScore: 50 },
      ],
      totalAverage: 125.8,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.yamaguchi.lg.jp/press/208111.html',
        docTitle: '令和5年度山口県公立高等学校入学者選抜のための学力検査得点状況について（山口県）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 31.5, maxScore: 50 },
        { subject: '社会', averageScore: 24.5, maxScore: 50 },
        { subject: '数学', averageScore: 23.1, maxScore: 50 },
        { subject: '理科', averageScore: 26.8, maxScore: 50 },
        { subject: '英語', averageScore: 26.6, maxScore: 50 },
      ],
      totalAverage: 132.4,
      totalMaxScore: 250,
      testTakerCount: 5790,
      source: {
        url: 'https://www.pref.yamaguchi.lg.jp/press/254532.html',
        docTitle: '令和6年度山口県公立高等学校入学者選抜のための学力検査実施状況について（山口県）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.3, maxScore: 50 },
        { subject: '社会', averageScore: 26.6, maxScore: 50 },
        { subject: '数学', averageScore: 24.7, maxScore: 50 },
        { subject: '理科', averageScore: 27.9, maxScore: 50 },
        { subject: '英語', averageScore: 23.9, maxScore: 50 },
      ],
      totalAverage: 132.4,
      totalMaxScore: 250,
      testTakerCount: 5618,
    },
  ],
};
