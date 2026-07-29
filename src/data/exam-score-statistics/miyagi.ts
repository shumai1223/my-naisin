/**
 * 宮城県公立高等学校入学者選抜 学力検査結果（Λ-12・全日制課程・第一次募集・全受検者平均）。
 *
 * 【出典についての注記】宮城県教育委員会は「公立高等学校入学者選抜 学力検査の分析結果」という
 * 74頁のPDF一次資料(https://www.pref.miyagi.jp/documents/46119/971katyo2besatu.pdf)を公表して
 * いるが、本環境ではPDFレンダリング基盤(poppler)が無く74頁を読み取れなかった(将来リトライ用に
 * URLを残す)。そのため本ファイルは同一の教委公表値を年度別に転載している受験情報サイト
 * (miyagi-koko-jyuken.com、塾選ジャーナル)を出典とする。令和8年度分は独立した2媒体
 * (塾選ジャーナルの記事と個人指導塾のブログ記事)で数値が完全一致することを確認し、さらに
 * miyagi-koko-jyuken.comのR8ページに記載された「前年度」の合計点(274.7点)がR7ページ本体の
 * 数値と一致することも確認した(クロスチェック2重)。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_MIYAGI: ExamScoreStatisticsFile = {
  prefectureCode: 'miyagi',
  source: {
    url: 'https://www.miyagi-koko-jyuken.com/result/',
    docTitle: '宮城県高校受験情報サイト「県立高校入試結果」年度別ページ集(教科別平均点等)',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.0, maxScore: 100 },
        { subject: '数学', averageScore: 58.2, maxScore: 100 },
        { subject: '社会', averageScore: 57.3, maxScore: 100 },
        { subject: '英語', averageScore: 54.7, maxScore: 100 },
        { subject: '理科', averageScore: 58.9, maxScore: 100 },
      ],
      totalAverage: 287.0,
      totalMaxScore: 500,
      source: {
        url: 'https://www.miyagi-koko-jyuken.com/result/2022/',
        docTitle: '令和4年度(2022年度)宮城県公立高等学校入学者選抜 学力検査結果(全日制課程・第一次募集)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 70.9, maxScore: 100 },
        { subject: '数学', averageScore: 45.6, maxScore: 100 },
        { subject: '社会', averageScore: 68.0, maxScore: 100 },
        { subject: '英語', averageScore: 57.1, maxScore: 100 },
        { subject: '理科', averageScore: 58.8, maxScore: 100 },
      ],
      totalAverage: 300.4,
      totalMaxScore: 500,
      source: {
        url: 'https://www.miyagi-koko-jyuken.com/result/2023/',
        docTitle: '令和5年度(2023年度)宮城県公立高等学校入学者選抜 学力検査結果(全日制課程・第一次募集)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 59.0, maxScore: 100 },
        { subject: '数学', averageScore: 49.9, maxScore: 100 },
        { subject: '社会', averageScore: 59.6, maxScore: 100 },
        { subject: '英語', averageScore: 50.4, maxScore: 100 },
        { subject: '理科', averageScore: 56.6, maxScore: 100 },
      ],
      totalAverage: 275.5,
      totalMaxScore: 500,
      source: {
        url: 'https://www.miyagi-koko-jyuken.com/result/2024/',
        docTitle: '令和6年度(2024年度)宮城県公立高等学校入学者選抜 学力検査結果(全日制課程・第一次募集)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.6, maxScore: 100 },
        { subject: '数学', averageScore: 47.0, maxScore: 100 },
        { subject: '社会', averageScore: 56.1, maxScore: 100 },
        { subject: '英語', averageScore: 55.5, maxScore: 100 },
        { subject: '理科', averageScore: 57.4, maxScore: 100 },
      ],
      totalAverage: 274.7,
      totalMaxScore: 500,
      source: {
        url: 'https://www.miyagi-koko-jyuken.com/result/2025/',
        docTitle: '令和7年度(2025年度)宮城県公立高等学校入学者選抜 学力検査結果(全日制課程・第一次募集)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 61.8, maxScore: 100 },
        { subject: '数学', averageScore: 50.2, maxScore: 100 },
        { subject: '社会', averageScore: 60.5, maxScore: 100 },
        { subject: '英語', averageScore: 48.7, maxScore: 100 },
        { subject: '理科', averageScore: 58.3, maxScore: 100 },
      ],
      totalAverage: 279.4,
      totalMaxScore: 500,
      source: {
        url: 'https://bestjuku.com/shingaku/s-article/53283/',
        docTitle: '令和8年度(2026年度)宮城県公立高等学校入学者選抜の結果を公開(塾選ジャーナル)',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
