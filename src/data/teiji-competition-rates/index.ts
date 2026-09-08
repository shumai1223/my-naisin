/**
 * T-P1 P1-3 定時制・通信制倍率パイプライン: 都道府県別チャンクを集約するindex。
 * `src/data/competition-rates/index.ts`と同じ設計（県ごとの静的importでedge runtime対応）。
 * S1-3で実機確認済みのA分類県から順次追加する（`ops/S1-3-teiji-availability-ledger.md`参照）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { TOKYO_TEIJI_COMPETITION_RATES } from './tokyo';
import { MIYAGI_TEIJI_COMPETITION_RATES } from './miyagi';
import { TOKUSHIMA_TEIJI_COMPETITION_RATES } from './tokushima';
import { NAGANO_TEIJI_COMPETITION_RATES } from './nagano';
import { OKINAWA_TEIJI_COMPETITION_RATES } from './okinawa';
import { NIIGATA_TEIJI_COMPETITION_RATES } from './niigata';
import { SHIMANE_TEIJI_COMPETITION_RATES } from './shimane';
import { OKAYAMA_TEIJI_COMPETITION_RATES } from './okayama';
import { SHIZUOKA_TEIJI_COMPETITION_RATES } from './shizuoka';
import { TOTTORI_TEIJI_COMPETITION_RATES } from './tottori';
import { YAMANASHI_TEIJI_COMPETITION_RATES } from './yamanashi';
import { CHIBA_TEIJI_COMPETITION_RATES } from './chiba';
import { GIFU_TEIJI_COMPETITION_RATES } from './gifu';
import { GUNMA_TEIJI_COMPETITION_RATES } from './gunma';
import { HIROSHIMA_TEIJI_COMPETITION_RATES } from './hiroshima';
import { HOKKAIDO_TEIJI_COMPETITION_RATES } from './hokkaido';
import { KANAGAWA_TEIJI_COMPETITION_RATES } from './kanagawa';
import { KUMAMOTO_TEIJI_COMPETITION_RATES } from './kumamoto';
import { KYOTO_TEIJI_COMPETITION_RATES } from './kyoto';
import { KAGOSHIMA_TEIJI_COMPETITION_RATES } from './kagoshima';
import { NAGASAKI_TEIJI_COMPETITION_RATES } from './nagasaki';
import { TOYAMA_TEIJI_COMPETITION_RATES } from './toyama';
import { SAITAMA_TEIJI_COMPETITION_RATES } from './saitama';
import { KAGAWA_TEIJI_COMPETITION_RATES } from './kagawa';
import { YAMAGATA_TEIJI_COMPETITION_RATES } from './yamagata';
import { IBARAKI_TEIJI_COMPETITION_RATES } from './ibaraki';
import { MIE_TEIJI_COMPETITION_RATES } from './mie';
import { WAKAYAMA_TEIJI_COMPETITION_RATES } from './wakayama';
import { TOCHIGI_TEIJI_COMPETITION_RATES } from './tochigi';
import { SHIGA_TEIJI_COMPETITION_RATES } from './shiga';
import { AOMORI_TEIJI_COMPETITION_RATES } from './aomori';
import { EHIME_TEIJI_COMPETITION_RATES } from './ehime';
import { FUKUOKA_TEIJI_COMPETITION_RATES } from './fukuoka';
import { FUKUSHIMA_TEIJI_COMPETITION_RATES } from './fukushima';
import { ISHIKAWA_TEIJI_COMPETITION_RATES } from './ishikawa';

export const TEIJI_COMPETITION_RATE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
  tokyo: TOKYO_TEIJI_COMPETITION_RATES,
  miyagi: MIYAGI_TEIJI_COMPETITION_RATES,
  tokushima: TOKUSHIMA_TEIJI_COMPETITION_RATES,
  nagano: NAGANO_TEIJI_COMPETITION_RATES,
  okinawa: OKINAWA_TEIJI_COMPETITION_RATES,
  niigata: NIIGATA_TEIJI_COMPETITION_RATES,
  shimane: SHIMANE_TEIJI_COMPETITION_RATES,
  okayama: OKAYAMA_TEIJI_COMPETITION_RATES,
  shizuoka: SHIZUOKA_TEIJI_COMPETITION_RATES,
  tottori: TOTTORI_TEIJI_COMPETITION_RATES,
  yamanashi: YAMANASHI_TEIJI_COMPETITION_RATES,
  chiba: CHIBA_TEIJI_COMPETITION_RATES,
  gifu: GIFU_TEIJI_COMPETITION_RATES,
  gunma: GUNMA_TEIJI_COMPETITION_RATES,
  hiroshima: HIROSHIMA_TEIJI_COMPETITION_RATES,
  hokkaido: HOKKAIDO_TEIJI_COMPETITION_RATES,
  kanagawa: KANAGAWA_TEIJI_COMPETITION_RATES,
  kumamoto: KUMAMOTO_TEIJI_COMPETITION_RATES,
  kyoto: KYOTO_TEIJI_COMPETITION_RATES,
  kagoshima: KAGOSHIMA_TEIJI_COMPETITION_RATES,
  nagasaki: NAGASAKI_TEIJI_COMPETITION_RATES,
  toyama: TOYAMA_TEIJI_COMPETITION_RATES,
  saitama: SAITAMA_TEIJI_COMPETITION_RATES,
  kagawa: KAGAWA_TEIJI_COMPETITION_RATES,
  yamagata: YAMAGATA_TEIJI_COMPETITION_RATES,
  ibaraki: IBARAKI_TEIJI_COMPETITION_RATES,
  mie: MIE_TEIJI_COMPETITION_RATES,
  wakayama: WAKAYAMA_TEIJI_COMPETITION_RATES,
  tochigi: TOCHIGI_TEIJI_COMPETITION_RATES,
  shiga: SHIGA_TEIJI_COMPETITION_RATES,
  aomori: AOMORI_TEIJI_COMPETITION_RATES,
  ehime: EHIME_TEIJI_COMPETITION_RATES,
  fukuoka: FUKUOKA_TEIJI_COMPETITION_RATES,
  fukushima: FUKUSHIMA_TEIJI_COMPETITION_RATES,
  ishikawa: ISHIKAWA_TEIJI_COMPETITION_RATES,
};

export const TEIJI_COMPETITION_RATE_FILES: PrefectureCompetitionRateFile[] = Object.values(
  TEIJI_COMPETITION_RATE_BY_PREFECTURE
).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
