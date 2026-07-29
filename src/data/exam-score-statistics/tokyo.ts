/**
 * 東京都立高等学校入学者選抜 学力検査結果に関する調査（Λ-12・全受検者平均）。
 * 東京都教育委員会が毎年6月に公表する報道発表資料に、当該年度の教科別平均点
 * （全数調査・受検者平均）が明記されている。各教科100点満点。
 * 報道発表は5教科合計点を明記していないため、totalAverage/totalMaxScoreは未設定。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_TOKYO: ExamScoreStatisticsFile = {
  prefectureCode: 'tokyo',
  source: {
    url: 'https://www.metro.tokyo.lg.jp/tosei/hodohappyo/press/2024/06/27/04.html',
    docTitle: '令和6年度東京都立高等学校入学者選抜学力検査結果に関する調査（東京都教育委員会・報道発表）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 75.9, maxScore: 100 },
        { subject: '数学', averageScore: 61.7, maxScore: 100 },
        { subject: '英語', averageScore: 66.9, maxScore: 100 },
        { subject: '社会', averageScore: 55.5, maxScore: 100 },
        { subject: '理科', averageScore: 66.8, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 75.0, maxScore: 100 },
        { subject: '数学', averageScore: 60.4, maxScore: 100 },
        { subject: '英語', averageScore: 63.7, maxScore: 100 },
        { subject: '社会', averageScore: 59.9, maxScore: 100 },
        { subject: '理科', averageScore: 59.2, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 74.9, maxScore: 100 },
        { subject: '数学', averageScore: 60.4, maxScore: 100 },
        { subject: '英語', averageScore: 61.2, maxScore: 100 },
        { subject: '社会', averageScore: 59.9, maxScore: 100 },
        { subject: '理科', averageScore: 66.7, maxScore: 100 },
      ],
    },
  ],
};
