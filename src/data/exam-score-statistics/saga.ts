/**
 * 佐賀県公立高等学校入学者選抜（一般）学力検査 教科別平均点（Λ-12・受験者平均点）。
 * 佐賀県教育委員会公表値を集約する学習塾サイト(katacoto.com)が8年分(平成28〜令和6年度・
 * 令和3年度と令和7年度は掲載無し)をまとめて掲載しているのを発見。
 *
 * 【重要な検証】令和6年度分は独立記事(英進館・入試結果総評)の「受験者平均点」表(国語35.1/
 * 社会26.7/数学19.6/理科27.8/英語27.9・各50点満点250点満点と明記)と完全一致。同記事は
 * 前年度比較の本文記述から令和5年度分(国語34.3/数学22.4/社会28.0/理科25.1/英語27.0)も
 * 逆算でき、katacoto.comの令和5年度分と5教科全て一致した(2年度分が二重に検証済み)。
 * 各教科50点満点・5教科合計250点満点。合計点は原資料に明記が無く自前で合算しないため
 * totalAverageは全年度未設定。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_SAGA: ExamScoreStatisticsFile = {
  prefectureCode: 'saga',
  source: {
    url: 'https://fukuoka.katacoto.com/saga-heikin/',
    docTitle: '佐賀県公立高校入試（一般）平均点推移（katacoto.com・佐賀県教育委員会公表値の集約）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '平成28年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 28.9, maxScore: 50 },
        { subject: '社会', averageScore: 26.8, maxScore: 50 },
        { subject: '数学', averageScore: 25.2, maxScore: 50 },
        { subject: '理科', averageScore: 28.6, maxScore: 50 },
        { subject: '英語', averageScore: 25.9, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成29年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.3, maxScore: 50 },
        { subject: '社会', averageScore: 30.2, maxScore: 50 },
        { subject: '数学', averageScore: 26.8, maxScore: 50 },
        { subject: '理科', averageScore: 24.9, maxScore: 50 },
        { subject: '英語', averageScore: 26.6, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 30.9, maxScore: 50 },
        { subject: '社会', averageScore: 33.0, maxScore: 50 },
        { subject: '数学', averageScore: 27.4, maxScore: 50 },
        { subject: '理科', averageScore: 25.2, maxScore: 50 },
        { subject: '英語', averageScore: 26.2, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.8, maxScore: 50 },
        { subject: '社会', averageScore: 27.9, maxScore: 50 },
        { subject: '数学', averageScore: 26.9, maxScore: 50 },
        { subject: '理科', averageScore: 26.5, maxScore: 50 },
        { subject: '英語', averageScore: 28.0, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 31.7, maxScore: 50 },
        { subject: '社会', averageScore: 30.2, maxScore: 50 },
        { subject: '数学', averageScore: 23.3, maxScore: 50 },
        { subject: '理科', averageScore: 27.8, maxScore: 50 },
        { subject: '英語', averageScore: 25.3, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 25.3, maxScore: 50 },
        { subject: '社会', averageScore: 25.7, maxScore: 50 },
        { subject: '数学', averageScore: 22.6, maxScore: 50 },
        { subject: '理科', averageScore: 27.9, maxScore: 50 },
        { subject: '英語', averageScore: 22.6, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 34.3, maxScore: 50 },
        { subject: '社会', averageScore: 28.0, maxScore: 50 },
        { subject: '数学', averageScore: 22.4, maxScore: 50 },
        { subject: '理科', averageScore: 25.1, maxScore: 50 },
        { subject: '英語', averageScore: 27.0, maxScore: 50 },
      ],
      source: {
        url: 'https://www.eishinkan.net/entrance/wp-content/uploads/2024/07/30410d798bf9feb9b692fa1d6e88770d.pdf',
        docTitle: '2024年度入試結果総評―佐賀県―（英進館・本文の前年度比較記述からの逆算値がkatacoto.comと完全一致しクロス検証済み）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 35.1, maxScore: 50 },
        { subject: '社会', averageScore: 26.7, maxScore: 50 },
        { subject: '数学', averageScore: 19.6, maxScore: 50 },
        { subject: '理科', averageScore: 27.8, maxScore: 50 },
        { subject: '英語', averageScore: 27.9, maxScore: 50 },
      ],
      source: {
        url: 'https://www.eishinkan.net/entrance/wp-content/uploads/2024/07/30410d798bf9feb9b692fa1d6e88770d.pdf',
        docTitle: '2024年度入試結果総評―佐賀県―（英進館・受験者平均点表がkatacoto.comと完全一致しクロス検証済み）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
