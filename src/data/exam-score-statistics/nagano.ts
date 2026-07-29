/**
 * 長野県公立高等学校入学者選抜 学力検査の結果（Λ-12・後期選抜・全受検者平均）。
 *
 * 長野県教育委員会「学びの改革支援課」が年度ごとに公表する「学力検査の結果について」PDFは
 * 当年度の平均点と前年度の平均点を併記する形式（東京都の総括表と同型）のため、令和6年度版
 * 資料から令和6・令和5年度分を、令和7年度版（速報）資料から令和7年度分を収録した。
 * 令和6年度の数値は両資料に独立して現れ（R6資料本体の54.9等 と R7速報の前年度比較欄54.85等）、
 * 丸め誤差の範囲で完全に一致することを確認済み（クロスチェック2重）。
 *
 * 【前期選抜は収録対象外】令和7年度から新設された前期選抜は、検査Ⅰ（国語・社会・英語合計
 * 120点満点）・検査Ⅱ（数学・理科合計80点満点）という教科横断の複合試験形式で、他県・後期選抜
 * と同じ「教科別100点満点」の枠組みで比較できないため、本ファイルは後期選抜（従来型5教科）の
 * みを収録する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_NAGANO: ExamScoreStatisticsFile = {
  prefectureCode: 'nagano',
  source: {
    url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r6/documents/r6kouki_kekka.pdf',
    docTitle: '令和6年度長野県公立高等学校入学者選抜学力検査の結果について（学びの改革支援課）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 55.7, maxScore: 100 },
        { subject: '社会', averageScore: 56.9, maxScore: 100 },
        { subject: '数学', averageScore: 51.1, maxScore: 100 },
        { subject: '理科', averageScore: 54.3, maxScore: 100 },
        { subject: '英語', averageScore: 45.0, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.9, maxScore: 100 },
        { subject: '社会', averageScore: 61.7, maxScore: 100 },
        { subject: '数学', averageScore: 49.0, maxScore: 100 },
        { subject: '理科', averageScore: 49.2, maxScore: 100 },
        { subject: '英語', averageScore: 59.1, maxScore: 100 },
      ],
      testTakerCount: 9505,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 59.54, maxScore: 100 },
        { subject: '社会', averageScore: 70.04, maxScore: 100 },
        { subject: '数学', averageScore: 58.45, maxScore: 100 },
        { subject: '理科', averageScore: 54.36, maxScore: 100 },
        { subject: '英語', averageScore: 59.23, maxScore: 100 },
      ],
      testTakerCount: 8402,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r7/documents/r7kekkasokuho.pdf',
        docTitle: '令和7年度長野県公立高等学校入学者選抜学力検査の結果について（速報）（学びの改革支援課）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
