/**
 * 北海道公立高等学校入学者選抜 学力検査結果（Λ-12・全日制全体・「入学者選抜状況報告書」§2）。
 *
 * 北海道教育委員会が毎年公表する報告書で、当年度と前年度の2カ年分を並記する形式のため、
 * 令和7年度報告書(R7/R6)と令和8年度報告書(R8/R7)の2つのPDFから令和6〜8年度の3年分を
 * 取得できた。令和7年度分は両PDFに共通して現れるため、数値が完全一致することを確認済み
 * （国語56.9/社会50.0/数学49.1/理科41.1/英語49.1・受検者総合246.2、合格者側も同様に一致）。
 * 受検者(全受検者)・合格者の両区分を公式資料がそのまま併記しているため両方収録する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_R7_REPORT = {
  url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/5/0/3/1/9/_/p07-08_gakuryokukensakekka.pdf',
  docTitle: '令和7年度北海道公立高等学校入学者選抜状況報告書 §2 学力検査(本検査)結果の概要(北海道教育委員会)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R8_REPORT = {
  url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/4/9/_/04_p7-p8.pdf',
  docTitle: '令和8年度北海道公立高等学校入学者選抜状況報告書 §2 学力検査(本検査)結果の概要(北海道教育委員会)',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_HOKKAIDO: ExamScoreStatisticsFile = {
  prefectureCode: 'hokkaido',
  source: SOURCE_R8_REPORT,
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 46.3, maxScore: 100 },
        { subject: '社会', averageScore: 38.3, maxScore: 100 },
        { subject: '数学', averageScore: 49.0, maxScore: 100 },
        { subject: '理科', averageScore: 38.6, maxScore: 100 },
        { subject: '英語', averageScore: 41.1, maxScore: 100 },
      ],
      totalAverage: 213.3,
      totalMaxScore: 500,
      source: SOURCE_R7_REPORT,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 46.4, maxScore: 100 },
        { subject: '社会', averageScore: 38.2, maxScore: 100 },
        { subject: '数学', averageScore: 48.8, maxScore: 100 },
        { subject: '理科', averageScore: 38.5, maxScore: 100 },
        { subject: '英語', averageScore: 41.0, maxScore: 100 },
      ],
      totalAverage: 212.9,
      totalMaxScore: 500,
      source: SOURCE_R7_REPORT,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 56.9, maxScore: 100 },
        { subject: '社会', averageScore: 50.0, maxScore: 100 },
        { subject: '数学', averageScore: 49.1, maxScore: 100 },
        { subject: '理科', averageScore: 41.1, maxScore: 100 },
        { subject: '英語', averageScore: 49.1, maxScore: 100 },
      ],
      totalAverage: 246.2,
      totalMaxScore: 500,
      testTakerCount: 21458,
      source: SOURCE_R7_REPORT,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 56.9, maxScore: 100 },
        { subject: '社会', averageScore: 49.6, maxScore: 100 },
        { subject: '数学', averageScore: 48.8, maxScore: 100 },
        { subject: '理科', averageScore: 40.9, maxScore: 100 },
        { subject: '英語', averageScore: 48.6, maxScore: 100 },
      ],
      totalAverage: 244.8,
      totalMaxScore: 500,
      testTakerCount: 19230,
      source: SOURCE_R7_REPORT,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 50.2, maxScore: 100 },
        { subject: '社会', averageScore: 52.6, maxScore: 100 },
        { subject: '数学', averageScore: 53.7, maxScore: 100 },
        { subject: '理科', averageScore: 52.4, maxScore: 100 },
        { subject: '英語', averageScore: 50.1, maxScore: 100 },
      ],
      totalAverage: 258.9,
      totalMaxScore: 500,
      testTakerCount: 19773,
      source: SOURCE_R8_REPORT,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 49.9, maxScore: 100 },
        { subject: '社会', averageScore: 51.9, maxScore: 100 },
        { subject: '数学', averageScore: 53.1, maxScore: 100 },
        { subject: '理科', averageScore: 52.1, maxScore: 100 },
        { subject: '英語', averageScore: 49.4, maxScore: 100 },
      ],
      totalAverage: 256.4,
      totalMaxScore: 500,
      testTakerCount: 18182,
      source: SOURCE_R8_REPORT,
    },
  ],
};
