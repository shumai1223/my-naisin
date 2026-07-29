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
import { ISHIKAWA_COMPETITION_RATE_HISTORY } from './ishikawa';
import { MIE_COMPETITION_RATE_HISTORY } from './mie';
import { GUNMA_COMPETITION_RATE_HISTORY } from './gunma';
import { AKITA_COMPETITION_RATE_HISTORY } from './akita';
import { AOMORI_COMPETITION_RATE_HISTORY } from './aomori';
import { EHIME_COMPETITION_RATE_HISTORY } from './ehime';
import { FUKUI_COMPETITION_RATE_HISTORY } from './fukui';
import { FUKUSHIMA_COMPETITION_RATE_HISTORY } from './fukushima';
import { IBARAKI_COMPETITION_RATE_HISTORY } from './ibaraki';

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
  ishikawa: ISHIKAWA_COMPETITION_RATE_HISTORY,
  mie: MIE_COMPETITION_RATE_HISTORY,
  gunma: GUNMA_COMPETITION_RATE_HISTORY,
  akita: AKITA_COMPETITION_RATE_HISTORY,
  aomori: AOMORI_COMPETITION_RATE_HISTORY,
  ehime: EHIME_COMPETITION_RATE_HISTORY,
  fukui: FUKUI_COMPETITION_RATE_HISTORY,
  fukushima: FUKUSHIMA_COMPETITION_RATE_HISTORY,
  ibaraki: IBARAKI_COMPETITION_RATE_HISTORY,
};

export const COMPETITION_RATE_HISTORY_FILES: PrefectureRateHistoryFile[] = Object.values(
  COMPETITION_RATE_HISTORY_BY_PREFECTURE
).filter((f): f is PrefectureRateHistoryFile => f !== undefined);
