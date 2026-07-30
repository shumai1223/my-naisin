/**
 * 熊本県公立高等学校入学者選抜結果（概要版）「受検者の教科別平均点」（Λ-12・全受検者平均）。
 * 熊本県教育委員会公式PDF(令和6年度・2024年度)を直接確認。
 *
 * 【重要な注意】熊本県は数学・英語について難易度の異なる問題A/問題Bを学校が選択する制度で、
 * 原資料はA/B別の平均点に加えて両者を統合した「総計」の平均点(数学23.5点・英語24.6点)も
 * 明記しているため、その統合値を採用した(A/Bどちらかの数値のみを使うことも、自前で加重平均を
 * 算出することもしていない)。令和7年度分は報道記事(熊本県教育委員会HP引用)でA/B別の平均点
 * (数学A15.6/B26.0・英語A18.8/B30.0)は確認できたが、統合後の平均点が記載されておらず、
 * A/B別受検者数も不明のため自前で加重平均を算出せず今回は見送った(捏造ゼロ優先)。
 * 各教科50点満点・5教科合計250点満点。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_KUMAMOTO: ExamScoreStatisticsFile = {
  prefectureCode: 'kumamoto',
  source: {
    url: 'https://www.pref.kumamoto.jp/uploaded/life/208232_552442_misc.pdf',
    docTitle: '令和6年度（2024年度）熊本県公立高等学校入学者選抜結果（概要版）（熊本県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.2, maxScore: 50 },
        { subject: '社会', averageScore: 28.6, maxScore: 50 },
        { subject: '数学', averageScore: 23.5, maxScore: 50 },
        { subject: '理科', averageScore: 18.3, maxScore: 50 },
        { subject: '英語', averageScore: 24.6, maxScore: 50 },
      ],
      totalAverage: 122.1,
      totalMaxScore: 250,
    },
  ],
};
