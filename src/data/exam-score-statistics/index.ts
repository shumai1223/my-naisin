/**
 * Λ-12 公表値の再構成: 都道府県別の学力検査結果統計を集約するindex。
 */
import { EXAM_SCORE_STATISTICS_KOCHI } from './kochi';
import { EXAM_SCORE_STATISTICS_SAITAMA } from './saitama';
import { EXAM_SCORE_STATISTICS_CHIBA } from './chiba';
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_BY_PREFECTURE: Record<string, ExamScoreStatisticsFile> = {
  kochi: EXAM_SCORE_STATISTICS_KOCHI,
  saitama: EXAM_SCORE_STATISTICS_SAITAMA,
  chiba: EXAM_SCORE_STATISTICS_CHIBA,
};

export const EXAM_SCORE_STATISTICS_FILES: ExamScoreStatisticsFile[] = Object.values(
  EXAM_SCORE_STATISTICS_BY_PREFECTURE
);
