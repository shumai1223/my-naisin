/**
 * Λ-4 多年度アーカイブ: 都道府県別チャンクを集約するindex。
 * Y-2のsrc/data/competition-rates/index.tsと同じ設計（県ごとの静的importでedge runtime対応）。
 */
import type { PrefectureRateHistoryFile } from '@/lib/competition-rate-history';
import { TOKYO_COMPETITION_RATE_HISTORY } from './tokyo';
import { KANAGAWA_COMPETITION_RATE_HISTORY } from './kanagawa';
import { CHIBA_COMPETITION_RATE_HISTORY } from './chiba';
import { FUKUOKA_COMPETITION_RATE_HISTORY } from './fukuoka';
import { HYOGO_COMPETITION_RATE_HISTORY } from './hyogo';
import { KUMAMOTO_COMPETITION_RATE_HISTORY } from './kumamoto';
import { MIYAGI_COMPETITION_RATE_HISTORY } from './miyagi';
import { GIFU_COMPETITION_RATE_HISTORY } from './gifu';
import { OKAYAMA_COMPETITION_RATE_HISTORY } from './okayama';
import { NAGANO_COMPETITION_RATE_HISTORY } from './nagano';

export const COMPETITION_RATE_HISTORY_BY_PREFECTURE: Partial<Record<string, PrefectureRateHistoryFile>> = {
  tokyo: TOKYO_COMPETITION_RATE_HISTORY,
  kanagawa: KANAGAWA_COMPETITION_RATE_HISTORY,
  chiba: CHIBA_COMPETITION_RATE_HISTORY,
  fukuoka: FUKUOKA_COMPETITION_RATE_HISTORY,
  hyogo: HYOGO_COMPETITION_RATE_HISTORY,
  kumamoto: KUMAMOTO_COMPETITION_RATE_HISTORY,
  miyagi: MIYAGI_COMPETITION_RATE_HISTORY,
  gifu: GIFU_COMPETITION_RATE_HISTORY,
  okayama: OKAYAMA_COMPETITION_RATE_HISTORY,
  nagano: NAGANO_COMPETITION_RATE_HISTORY,
};

export const COMPETITION_RATE_HISTORY_FILES: PrefectureRateHistoryFile[] = Object.values(
  COMPETITION_RATE_HISTORY_BY_PREFECTURE
).filter((f): f is PrefectureRateHistoryFile => f !== undefined);
