/**
 * 岐阜県公立高等学校入学者選抜「成績の概要」（Λ-12・第一次選抜学力検査）。
 * 岐阜県教育委員会が毎年公表するPDFに、当該年度と前年度の教科別平均点を並べた表(表5)が
 * 収録されており、令和5年度版と令和7年度版の2本から4年度分(令和4〜7年度)を取得できた。
 * 各教科100点満点・整数に四捨五入されている。
 *
 * 【重要な注意】原資料の教科別平均点は「全受検者の約20分の1の抽出」による算出値（かつ
 * 定時制課程・連携型選抜を含む）である一方、5教科の総点平均（totalAverage）は全日制課程の
 * 全受検者（抽出なし）から算出されており、算出母集団が異なる。そのため教科別平均点の単純合計
 * とtotalAverageは一致しない（令和5年度: 69+50+54+60+60=293 vs 総点299・令和7年度:
 * 77+50+56+64+63=310 vs 総点約314）。バグではなく原資料が明記する構造的差異のため、
 * isPlausibleSubjectSumは意図的にfalseを返す想定内のケースとして記録する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_GIFU: ExamScoreStatisticsFile = {
  prefectureCode: 'gifu',
  source: {
    url: 'https://www.pref.gifu.lg.jp/uploaded/attachment/457965.pdf',
    docTitle: '令和7年度公立高等学校入学者選抜の成績概要（岐阜県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 75, maxScore: 100 },
        { subject: '数学', averageScore: 54, maxScore: 100 },
        { subject: '英語', averageScore: 60, maxScore: 100 },
        { subject: '理科', averageScore: 66, maxScore: 100 },
        { subject: '社会', averageScore: 69, maxScore: 100 },
      ],
      totalAverage: 329,
      totalMaxScore: 500,
      source: {
        url: 'https://www.pref.gifu.lg.jp/uploaded/attachment/371782.pdf',
        docTitle: '令和5年度公立高等学校入学者選抜の成績概要（岐阜県教育委員会・前年度=令和4年度分を含む）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 69, maxScore: 100 },
        { subject: '数学', averageScore: 50, maxScore: 100 },
        { subject: '英語', averageScore: 54, maxScore: 100 },
        { subject: '理科', averageScore: 60, maxScore: 100 },
        { subject: '社会', averageScore: 60, maxScore: 100 },
      ],
      totalAverage: 299,
      totalMaxScore: 500,
      testTakerCount: 12574,
      source: {
        url: 'https://www.pref.gifu.lg.jp/uploaded/attachment/371782.pdf',
        docTitle: '令和5年度公立高等学校入学者選抜の成績概要（岐阜県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 76, maxScore: 100 },
        { subject: '数学', averageScore: 51, maxScore: 100 },
        { subject: '英語', averageScore: 58, maxScore: 100 },
        { subject: '理科', averageScore: 59, maxScore: 100 },
        { subject: '社会', averageScore: 58, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 77, maxScore: 100 },
        { subject: '数学', averageScore: 50, maxScore: 100 },
        { subject: '英語', averageScore: 56, maxScore: 100 },
        { subject: '理科', averageScore: 64, maxScore: 100 },
        { subject: '社会', averageScore: 63, maxScore: 100 },
      ],
      totalAverage: 314,
      totalMaxScore: 500,
      testTakerCount: 12799,
    },
  ],
};
