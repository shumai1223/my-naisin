/**
 * 鹿児島県公立高等学校入学者選抜「学力検査結果の概要」（Λ-12・全日制+定時制合計・全受検者平均）。
 * 鹿児島県教育委員会が毎年公表するPDFの「受検者の平均点の年度別推移」表に直近6年度分の
 * 推移が併記されており、令和7年度版(令和2〜7年度)と令和8年度版(令和3〜8年度)の2本を
 * 突合すると令和2〜8年度の7年度分を収録できた。重複する令和3〜7年度の5年度分は両PDFで
 * 数値が完全一致することを確認済み(クロスチェック2重・Λ-12でこれまでで最も強固な検証)。
 * 各教科90点満点という他県に無い特有の配点(5教科合計450点満点)。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_KAGOSHIMA: ExamScoreStatisticsFile = {
  prefectureCode: 'kagoshima',
  source: {
    url: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/r5/documents/128070_20260514151617-1.pdf',
    docTitle: '令和8年度鹿児島県公立高等学校入学者選抜学力検査結果の概要（鹿児島県教育委員会・令和3〜7年度分の比較列を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 55.1, maxScore: 90 },
        { subject: '社会', averageScore: 48.4, maxScore: 90 },
        { subject: '数学', averageScore: 42.3, maxScore: 90 },
        { subject: '理科', averageScore: 43.0, maxScore: 90 },
        { subject: '英語', averageScore: 47.5, maxScore: 90 },
      ],
      totalAverage: 236.2,
      totalMaxScore: 450,
      source: {
        url: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/r5/documents/121062_20250507165915-1.pdf',
        docTitle: '令和7年度鹿児島県公立高等学校入学者選抜学力検査結果の概要（鹿児島県教育委員会・令和2〜6年度分の比較列を含む）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 50.4, maxScore: 90 },
        { subject: '社会', averageScore: 51.2, maxScore: 90 },
        { subject: '数学', averageScore: 47.3, maxScore: 90 },
        { subject: '理科', averageScore: 47.5, maxScore: 90 },
        { subject: '英語', averageScore: 52.1, maxScore: 90 },
      ],
      totalAverage: 248.5,
      totalMaxScore: 450,
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.8, maxScore: 90 },
        { subject: '社会', averageScore: 53.1, maxScore: 90 },
        { subject: '数学', averageScore: 39.0, maxScore: 90 },
        { subject: '理科', averageScore: 53.9, maxScore: 90 },
        { subject: '英語', averageScore: 39.6, maxScore: 90 },
      ],
      totalAverage: 243.5,
      totalMaxScore: 450,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 51.1, maxScore: 90 },
        { subject: '社会', averageScore: 51.5, maxScore: 90 },
        { subject: '数学', averageScore: 47.0, maxScore: 90 },
        { subject: '理科', averageScore: 50.1, maxScore: 90 },
        { subject: '英語', averageScore: 47.4, maxScore: 90 },
      ],
      totalAverage: 247.1,
      totalMaxScore: 450,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.9, maxScore: 90 },
        { subject: '社会', averageScore: 49.4, maxScore: 90 },
        { subject: '数学', averageScore: 43.8, maxScore: 90 },
        { subject: '理科', averageScore: 48.8, maxScore: 90 },
        { subject: '英語', averageScore: 43.2, maxScore: 90 },
      ],
      totalAverage: 240.0,
      totalMaxScore: 450,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.4, maxScore: 90 },
        { subject: '社会', averageScore: 50.6, maxScore: 90 },
        { subject: '数学', averageScore: 38.9, maxScore: 90 },
        { subject: '理科', averageScore: 48.7, maxScore: 90 },
        { subject: '英語', averageScore: 41.8, maxScore: 90 },
      ],
      totalAverage: 234.6,
      totalMaxScore: 450,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 45.7, maxScore: 90 },
        { subject: '社会', averageScore: 46.9, maxScore: 90 },
        { subject: '数学', averageScore: 36.7, maxScore: 90 },
        { subject: '理科', averageScore: 44.1, maxScore: 90 },
        { subject: '英語', averageScore: 42.9, maxScore: 90 },
      ],
      totalAverage: 216.3,
      totalMaxScore: 450,
    },
  ],
};
