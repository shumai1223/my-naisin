/**
 * 香川県公立高等学校入学者選抜「学力検査の概評について」（Λ-12・全教科受検者平均）。
 * 香川県教育委員会が毎年公表するPDFの「教科別平均点等」表に当年度＋直近3年度分の
 * 比較列が併記されており、令和5年度版(令和2〜5年度の4年分)と令和8年度版
 * (令和5〜8年度の4年分)の2本を突合すると令和2〜8年度の7年度分を収録できた
 * （令和5年度分は両PDFに独立して現れ、数値(30.5/25.3/31.2/29.0/27.6/143.6)が
 * 完全一致することを確認済み・クロスチェック2重）。各教科50点満点・5教科合計250点満点。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_KAGAWA: ExamScoreStatisticsFile = {
  prefectureCode: 'kagawa',
  source: {
    url: 'https://www.pref.kagawa.lg.jp/documents/15088/gaihyou_8.pdf',
    docTitle: '令和8年度香川県公立高等学校入学者選抜学力検査の概評について（香川県教育委員会・令和5〜7年度分の比較列を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.1, maxScore: 50 },
        { subject: '数学', averageScore: 28.4, maxScore: 50 },
        { subject: '社会', averageScore: 29.6, maxScore: 50 },
        { subject: '英語', averageScore: 28.4, maxScore: 50 },
        { subject: '理科', averageScore: 28.4, maxScore: 50 },
      ],
      totalAverage: 143.9,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.kagawa.lg.jp/documents/40102/sonota2.pdf',
        docTitle: '令和5年度香川県公立高等学校入学者選抜学力検査の概評について（香川県教育委員会・令和2〜4年度分の比較列を含む）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.9, maxScore: 50 },
        { subject: '数学', averageScore: 22.9, maxScore: 50 },
        { subject: '社会', averageScore: 30.6, maxScore: 50 },
        { subject: '英語', averageScore: 28.6, maxScore: 50 },
        { subject: '理科', averageScore: 29.4, maxScore: 50 },
      ],
      totalAverage: 141.5,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.kagawa.lg.jp/documents/40102/sonota2.pdf',
        docTitle: '令和5年度香川県公立高等学校入学者選抜学力検査の概評について（香川県教育委員会・令和2〜4年度分の比較列を含む）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.0, maxScore: 50 },
        { subject: '数学', averageScore: 26.8, maxScore: 50 },
        { subject: '社会', averageScore: 30.6, maxScore: 50 },
        { subject: '英語', averageScore: 29.1, maxScore: 50 },
        { subject: '理科', averageScore: 29.1, maxScore: 50 },
      ],
      totalAverage: 144.7,
      totalMaxScore: 250,
      testTakerCount: 5370,
      source: {
        url: 'https://www.pref.kagawa.lg.jp/documents/40102/sonota2.pdf',
        docTitle: '令和5年度香川県公立高等学校入学者選抜学力検査の概評について（香川県教育委員会・令和2〜4年度分の比較列を含む）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 30.5, maxScore: 50 },
        { subject: '数学', averageScore: 25.3, maxScore: 50 },
        { subject: '社会', averageScore: 31.2, maxScore: 50 },
        { subject: '英語', averageScore: 29.0, maxScore: 50 },
        { subject: '理科', averageScore: 27.6, maxScore: 50 },
      ],
      totalAverage: 143.6,
      totalMaxScore: 250,
      testTakerCount: 5191,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 31.5, maxScore: 50 },
        { subject: '数学', averageScore: 23.6, maxScore: 50 },
        { subject: '社会', averageScore: 29.2, maxScore: 50 },
        { subject: '英語', averageScore: 28.3, maxScore: 50 },
        { subject: '理科', averageScore: 29.3, maxScore: 50 },
      ],
      totalAverage: 141.9,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 31.6, maxScore: 50 },
        { subject: '数学', averageScore: 26.1, maxScore: 50 },
        { subject: '社会', averageScore: 31.2, maxScore: 50 },
        { subject: '英語', averageScore: 29.5, maxScore: 50 },
        { subject: '理科', averageScore: 25.1, maxScore: 50 },
      ],
      totalAverage: 143.4,
      totalMaxScore: 250,
      testTakerCount: 4741,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 36.8, maxScore: 50 },
        { subject: '数学', averageScore: 28.9, maxScore: 50 },
        { subject: '社会', averageScore: 30.4, maxScore: 50 },
        { subject: '英語', averageScore: 28.9, maxScore: 50 },
        { subject: '理科', averageScore: 26.6, maxScore: 50 },
      ],
      totalAverage: 151.6,
      totalMaxScore: 250,
      testTakerCount: 4311,
    },
  ],
};
