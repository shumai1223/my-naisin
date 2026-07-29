/**
 * 兵庫県公立高等学校入学者選抜 学力検査の実施結果（Λ-12・全受検者平均・全日制）。
 * 兵庫県教育委員会の「実施結果について（詳細）」資料は、学力検査5教科(各100点満点＝
 * 合計500点満点)の合計点を100点満点に換算した平均点のみを公表しており、教科別の
 * 平均点（国語○○点等）は公表していない（あるのは各教科の小問別得点率%という別種の
 * 指標のみ）。そのため subjects は空配列とし、totalAverage は「500点満点を100点満点に
 * 換算した値」であることをdocTitleに明記した上でそのまま記録する（独自に教科別へ
 * 逆算・按分しない）。
 *
 * 【重要な検知】WebSearch要約では「国語の平均点が72.2点」等の教科別数値が示唆されて
 * いたが、本ファイルの一次ソース(公式PDF)を直接確認したところ該当する記載は一切無く、
 * 単一のWebSearch要約のみに基づく採用を避けて正解だった事例（教科別平均点は不採用）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_HYOGO: ExamScoreStatisticsFile = {
  prefectureCode: 'hyogo',
  source: {
    url: 'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2025/05/R7syousai.pdf',
    docTitle:
      '令和7年度兵庫県公立高等学校入学者選抜学力検査に関する実施結果について（詳細）（兵庫県教育委員会・全日制・500点満点を100点満点に換算した値）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [],
      totalAverage: 55.0,
      totalMaxScore: 100,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [],
      totalAverage: 60.5,
      totalMaxScore: 100,
    },
  ],
};
