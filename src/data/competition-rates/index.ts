/**
 * Y-2 倍率パイプラインα: 都道府県別チャンクを集約するindex。
 * Y-1のsrc/data/schools/index.tsと同じ設計（県ごとの静的importでedge runtime対応）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { TOKYO_COMPETITION_RATES } from './tokyo';
import { KANAGAWA_COMPETITION_RATES } from './kanagawa';

export const COMPETITION_RATE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
  tokyo: TOKYO_COMPETITION_RATES,
  kanagawa: KANAGAWA_COMPETITION_RATES,
};

export const COMPETITION_RATE_FILES: PrefectureCompetitionRateFile[] = Object.values(
  COMPETITION_RATE_BY_PREFECTURE
).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
