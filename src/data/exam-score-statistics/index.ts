/**
 * Λ-12 公表値の再構成: 都道府県別の学力検査結果統計を集約するindex。
 */
import { EXAM_SCORE_STATISTICS_KOCHI } from './kochi';
import { EXAM_SCORE_STATISTICS_SAITAMA } from './saitama';
import { EXAM_SCORE_STATISTICS_CHIBA } from './chiba';
import { EXAM_SCORE_STATISTICS_TOKYO } from './tokyo';
import { EXAM_SCORE_STATISTICS_NARA } from './nara';
import { EXAM_SCORE_STATISTICS_HYOGO } from './hyogo';
import { EXAM_SCORE_STATISTICS_NIIGATA } from './niigata';
import { EXAM_SCORE_STATISTICS_GUNMA } from './gunma';
import { EXAM_SCORE_STATISTICS_MIYAGI } from './miyagi';
import { EXAM_SCORE_STATISTICS_HOKKAIDO } from './hokkaido';
import { EXAM_SCORE_STATISTICS_FUKUSHIMA } from './fukushima';
import { EXAM_SCORE_STATISTICS_AOMORI } from './aomori';
import { EXAM_SCORE_STATISTICS_IWATE } from './iwate';
import { EXAM_SCORE_STATISTICS_AKITA } from './akita';
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_BY_PREFECTURE: Record<string, ExamScoreStatisticsFile> = {
  kochi: EXAM_SCORE_STATISTICS_KOCHI,
  saitama: EXAM_SCORE_STATISTICS_SAITAMA,
  chiba: EXAM_SCORE_STATISTICS_CHIBA,
  tokyo: EXAM_SCORE_STATISTICS_TOKYO,
  nara: EXAM_SCORE_STATISTICS_NARA,
  hyogo: EXAM_SCORE_STATISTICS_HYOGO,
  niigata: EXAM_SCORE_STATISTICS_NIIGATA,
  gunma: EXAM_SCORE_STATISTICS_GUNMA,
  miyagi: EXAM_SCORE_STATISTICS_MIYAGI,
  hokkaido: EXAM_SCORE_STATISTICS_HOKKAIDO,
  fukushima: EXAM_SCORE_STATISTICS_FUKUSHIMA,
  aomori: EXAM_SCORE_STATISTICS_AOMORI,
  iwate: EXAM_SCORE_STATISTICS_IWATE,
  akita: EXAM_SCORE_STATISTICS_AKITA,
};

export const EXAM_SCORE_STATISTICS_FILES: ExamScoreStatisticsFile[] = Object.values(
  EXAM_SCORE_STATISTICS_BY_PREFECTURE
);
