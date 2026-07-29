/**
 * 広島県公立高等学校入学者選抜 一般学力検査結果（Λ-12・全受検者平均）。
 *
 * 広島県教育委員会が公表する「一般学力検査の結果について」PDFは東京都・長野県・静岡県と
 * 同型の当年度+前年度併記形式のため、令和8年度版PDF(令和8・7年度分)+令和7年度版PDF
 * (令和7・6年度分)の2資料から令和6〜8年度の3年分を収録できた。令和7年度の数値は両PDFに
 * 独立して現れ完全一致することを確認済み（クロスチェック2重）。
 *
 * 【重要】原資料が明記する「5教科平均」は5教科合計点ではなく5教科の平均点の相加平均
 * （令和7年度: (21.4+24.4+19.6+26.2+21.4)/5=22.6と検算で確認・新潟県と同型の様式）。
 * 他県のtotalAverage（5教科合計そのもの）とスケールが異なるため、意図的にtotalAverageへは
 * 格納せず教科別平均点のみ記録する（Y-0憲法: 一次ソースをそのまま再掲・独自集計はしない）。
 *
 * 広島県の学力検査は各教科50点満点（5教科合計250点満点体系）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_HIROSHIMA: ExamScoreStatisticsFile = {
  prefectureCode: 'hiroshima',
  source: {
    url: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/629855.pdf',
    docTitle: '令和7年度広島県公立高等学校入学者選抜一般学力検査の結果について（広島県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.5, maxScore: 50 },
        { subject: '社会', averageScore: 26.9, maxScore: 50 },
        { subject: '数学', averageScore: 23.7, maxScore: 50 },
        { subject: '理科', averageScore: 26.1, maxScore: 50 },
        { subject: '英語', averageScore: 24.1, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 21.4, maxScore: 50 },
        { subject: '社会', averageScore: 24.4, maxScore: 50 },
        { subject: '数学', averageScore: 19.6, maxScore: 50 },
        { subject: '理科', averageScore: 26.2, maxScore: 50 },
        { subject: '英語', averageScore: 21.4, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 26.0, maxScore: 50 },
        { subject: '社会', averageScore: 21.8, maxScore: 50 },
        { subject: '数学', averageScore: 20.7, maxScore: 50 },
        { subject: '理科', averageScore: 25.8, maxScore: 50 },
        { subject: '英語', averageScore: 20.2, maxScore: 50 },
      ],
      source: {
        url: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/670968.pdf',
        docTitle: '令和8年度広島県公立高等学校入学者選抜一般学力検査の結果',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
