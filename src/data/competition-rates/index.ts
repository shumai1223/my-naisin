/**
 * Y-2 倍率パイプラインα: 都道府県別チャンクを集約するindex。
 * Y-1のsrc/data/schools/index.tsと同じ設計（県ごとの静的importでedge runtime対応）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { TOKYO_COMPETITION_RATES } from './tokyo';
import { KANAGAWA_COMPETITION_RATES } from './kanagawa';
import { OSAKA_COMPETITION_RATES } from './osaka';
import { CHIBA_COMPETITION_RATES } from './chiba';
import { SAITAMA_COMPETITION_RATES } from './saitama';
import { FUKUOKA_COMPETITION_RATES } from './fukuoka';
import { HYOGO_COMPETITION_RATES } from './hyogo';
import { SHIZUOKA_COMPETITION_RATES } from './shizuoka';
import { HIROSHIMA_COMPETITION_RATES } from './hiroshima';
import { KUMAMOTO_COMPETITION_RATES } from './kumamoto';
import { MIYAGI_COMPETITION_RATES } from './miyagi';
import { GIFU_COMPETITION_RATES } from './gifu';
import { OKAYAMA_COMPETITION_RATES } from './okayama';
import { TOCHIGI_COMPETITION_RATES } from './tochigi';
import { GUNMA_COMPETITION_RATES } from './gunma';
import { NAGANO_COMPETITION_RATES } from './nagano';
import { IBARAKI_COMPETITION_RATES } from './ibaraki';
import { MIE_COMPETITION_RATES } from './mie';
import { TOYAMA_COMPETITION_RATES } from './toyama';
import { ISHIKAWA_COMPETITION_RATES } from './ishikawa';
import { FUKUI_COMPETITION_RATES } from './fukui';
import { EHIME_COMPETITION_RATES } from './ehime';
import { TOKUSHIMA_COMPETITION_RATES } from './tokushima';

export const COMPETITION_RATE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
  tokyo: TOKYO_COMPETITION_RATES,
  kanagawa: KANAGAWA_COMPETITION_RATES,
  osaka: OSAKA_COMPETITION_RATES,
  chiba: CHIBA_COMPETITION_RATES,
  saitama: SAITAMA_COMPETITION_RATES,
  fukuoka: FUKUOKA_COMPETITION_RATES,
  hyogo: HYOGO_COMPETITION_RATES,
  shizuoka: SHIZUOKA_COMPETITION_RATES,
  hiroshima: HIROSHIMA_COMPETITION_RATES,
  kumamoto: KUMAMOTO_COMPETITION_RATES,
  miyagi: MIYAGI_COMPETITION_RATES,
  gifu: GIFU_COMPETITION_RATES,
  okayama: OKAYAMA_COMPETITION_RATES,
  tochigi: TOCHIGI_COMPETITION_RATES,
  gunma: GUNMA_COMPETITION_RATES,
  nagano: NAGANO_COMPETITION_RATES,
  ibaraki: IBARAKI_COMPETITION_RATES,
  mie: MIE_COMPETITION_RATES,
  toyama: TOYAMA_COMPETITION_RATES,
  ishikawa: ISHIKAWA_COMPETITION_RATES,
  fukui: FUKUI_COMPETITION_RATES,
  ehime: EHIME_COMPETITION_RATES,
  tokushima: TOKUSHIMA_COMPETITION_RATES,
};

export const COMPETITION_RATE_FILES: PrefectureCompetitionRateFile[] = Object.values(
  COMPETITION_RATE_BY_PREFECTURE
).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
