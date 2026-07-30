/**
 * 山梨県公立高等学校入学者選抜「学力検査結果活用ガイド」（Λ-12・全受検者平均）。
 * 山梨県教育委員会が毎年公表するPDF(令和4〜8年度の5本)の「Ⅱ総合得点及び教科別平均点」
 * 表に、調査対象(受検者数)・教科別平均点・最高点・最低点が明記されている。
 * 各教科100点満点・5教科合計500点満点。全年度で教科別平均点の合計が公表総合得点と
 * 妥当な範囲で一致(最大差0.2点)。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_YAMANASHI: ExamScoreStatisticsFile = {
  prefectureCode: 'yamanashi',
  source: {
    url: 'https://www.pref.yamanashi.jp/documents/7061/r8gakuryokukensagaido.pdf',
    docTitle: '令和8年度山梨県公立高等学校入学者選抜学力検査結果活用ガイド（山梨県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 51.5, maxScore: 100 },
        { subject: '社会', averageScore: 48.7, maxScore: 100 },
        { subject: '数学', averageScore: 54.8, maxScore: 100 },
        { subject: '理科', averageScore: 51.8, maxScore: 100 },
        { subject: '英語', averageScore: 57.9, maxScore: 100 },
      ],
      totalAverage: 264.7,
      totalMaxScore: 500,
      testTakerCount: 3489,
      source: {
        url: 'https://www.pref.yamanashi.jp/documents/7061/r04kensakkkakatuyouguide.pdf',
        docTitle: '令和4年度山梨県公立高等学校入学者選抜学力検査結果活用ガイド（山梨県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 56.0, maxScore: 100 },
        { subject: '社会', averageScore: 51.5, maxScore: 100 },
        { subject: '数学', averageScore: 52.8, maxScore: 100 },
        { subject: '理科', averageScore: 55.1, maxScore: 100 },
        { subject: '英語', averageScore: 48.0, maxScore: 100 },
      ],
      totalAverage: 263.4,
      totalMaxScore: 500,
      testTakerCount: 3438,
      source: {
        url: 'https://www.pref.yamanashi.jp/documents/7061/r05kensakkkakatuyouguide.pdf',
        docTitle: '令和5年度山梨県公立高等学校入学者選抜学力検査結果活用ガイド（山梨県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 55.0, maxScore: 100 },
        { subject: '社会', averageScore: 50.7, maxScore: 100 },
        { subject: '数学', averageScore: 47.2, maxScore: 100 },
        { subject: '理科', averageScore: 56.6, maxScore: 100 },
        { subject: '英語', averageScore: 51.7, maxScore: 100 },
      ],
      totalAverage: 261.2,
      totalMaxScore: 500,
      testTakerCount: 3341,
      source: {
        url: 'https://www.pref.yamanashi.jp/documents/7061/r06kensakkkakatuyouguide.pdf',
        docTitle: '令和6年度山梨県公立高等学校入学者選抜学力検査結果活用ガイド（山梨県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.3, maxScore: 100 },
        { subject: '社会', averageScore: 50.8, maxScore: 100 },
        { subject: '数学', averageScore: 48.3, maxScore: 100 },
        { subject: '理科', averageScore: 54.5, maxScore: 100 },
        { subject: '英語', averageScore: 55.8, maxScore: 100 },
      ],
      totalAverage: 266.6,
      totalMaxScore: 500,
      testTakerCount: 3191,
      source: {
        url: 'https://www.pref.yamanashi.jp/documents/7061/r7gakuryokukennsakekka.pdf',
        docTitle: '令和7年度山梨県公立高等学校入学者選抜学力検査結果活用ガイド（山梨県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 53.8, maxScore: 100 },
        { subject: '社会', averageScore: 52.9, maxScore: 100 },
        { subject: '数学', averageScore: 53.8, maxScore: 100 },
        { subject: '理科', averageScore: 55.6, maxScore: 100 },
        { subject: '英語', averageScore: 40.0, maxScore: 100 },
      ],
      totalAverage: 255.9,
      totalMaxScore: 500,
      testTakerCount: 3009,
    },
  ],
};
