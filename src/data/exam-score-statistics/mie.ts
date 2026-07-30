/**
 * 三重県立高等学校入学者選抜 後期選抜学力検査得点の平均（Λ-12・合格者平均）。
 * 三重県教育委員会の年度別ページ（学力検査問題等）に、後期選抜学力検査(全日制課程)
 * 合格者の教科別平均点が直接掲載されている（PDFではなくページ本文に表がある）。
 * 各教科50点満点・5教科合計250点満点が原則（四日市南高校数理科学コース・飯野高校
 * 英語コミュニケーション科・宇治山田商業高校国際科など一部学科は特定教科100点満点の
 * 傾斜配点だが、県教委公表の平均点表はその区別を明記していないため原資料のまま収録する）。
 * 満点・受検者数は原資料に記載が無いためtotalMaxScore=250は一般則からの補記、
 * testTakerCountは未設定。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_MIE: ExamScoreStatisticsFile = {
  prefectureCode: 'mie',
  source: {
    url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00074.htm',
    docTitle: '令和7年度三重県立高等学校入学者選抜学力検査問題等（三重県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 36.3, maxScore: 50 },
        { subject: '数学', averageScore: 27.2, maxScore: 50 },
        { subject: '社会', averageScore: 29.8, maxScore: 50 },
        { subject: '英語', averageScore: 27.6, maxScore: 50 },
        { subject: '理科', averageScore: 29.9, maxScore: 50 },
      ],
      totalAverage: 150.8,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00062.htm',
        docTitle: '令和5年度三重県立高等学校入学者選抜学力検査問題等（三重県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 37.4, maxScore: 50 },
        { subject: '数学', averageScore: 26.3, maxScore: 50 },
        { subject: '社会', averageScore: 32.4, maxScore: 50 },
        { subject: '英語', averageScore: 26.5, maxScore: 50 },
        { subject: '理科', averageScore: 32.2, maxScore: 50 },
      ],
      totalAverage: 154.8,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00067.htm',
        docTitle: '令和6年度三重県立高等学校入学者選抜学力検査問題等（三重県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 34.9, maxScore: 50 },
        { subject: '数学', averageScore: 28.2, maxScore: 50 },
        { subject: '社会', averageScore: 32.0, maxScore: 50 },
        { subject: '英語', averageScore: 27.9, maxScore: 50 },
        { subject: '理科', averageScore: 31.4, maxScore: 50 },
      ],
      totalAverage: 154.4,
      totalMaxScore: 250,
    },
  ],
};
