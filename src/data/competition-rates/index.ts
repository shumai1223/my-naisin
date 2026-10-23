/**
 * Y-2 倍率パイプラインα: 都道府県別チャンクを集約するindex。
 * Y-1のsrc/data/schools/index.tsと同じ設計（県ごとの静的importでedge runtime対応）。
 */
import { omitPublicationRefused } from '@/lib/publication-refused-prefectures';
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { mergeNextYearOverlays } from '@/lib/competition-rate-overlay';
import { COMPETITION_RATE_NEXT_BY_PREFECTURE } from '../competition-rates-next';
import { HOKKAIDO_COMPETITION_RATES } from './hokkaido';
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
import { KAGAWA_COMPETITION_RATES } from './kagawa';
import { SAGA_COMPETITION_RATES } from './saga';
import { NAGASAKI_COMPETITION_RATES } from './nagasaki';
import { OITA_COMPETITION_RATES } from './oita';
import { TOTTORI_COMPETITION_RATES } from './tottori';
import { KOCHI_COMPETITION_RATES } from './kochi';
import { MIYAZAKI_COMPETITION_RATES } from './miyazaki';
import { YAMAGUCHI_COMPETITION_RATES } from './yamaguchi';
import { KAGOSHIMA_COMPETITION_RATES } from './kagoshima';
import { NIIGATA_COMPETITION_RATES } from './niigata';
import { OKINAWA_COMPETITION_RATES } from './okinawa';
import { YAMANASHI_COMPETITION_RATES } from './yamanashi';
import { NARA_COMPETITION_RATES } from './nara';
import { AKITA_COMPETITION_RATES } from './akita';
import { AOMORI_COMPETITION_RATES } from './aomori';
import { IWATE_COMPETITION_RATES } from './iwate';
import { KYOTO_COMPETITION_RATES } from './kyoto';
import { YAMAGATA_COMPETITION_RATES } from './yamagata';
import { AICHI_COMPETITION_RATES } from './aichi';
import { WAKAYAMA_COMPETITION_RATES } from './wakayama';
import { SHIMANE_COMPETITION_RATES } from './shimane';
import { SHIGA_COMPETITION_RATES } from './shiga';
import { FUKUSHIMA_COMPETITION_RATES } from './fukushima';

// 令和8年度の旧ファイル（書き換えない）。新年度ファイルがある県だけ、下で重ねて「新年度＝今季」にする。
const COMPETITION_RATE_BASE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
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
  kagawa: KAGAWA_COMPETITION_RATES,
  saga: SAGA_COMPETITION_RATES,
  nagasaki: NAGASAKI_COMPETITION_RATES,
  oita: OITA_COMPETITION_RATES,
  tottori: TOTTORI_COMPETITION_RATES,
  kochi: KOCHI_COMPETITION_RATES,
  miyazaki: MIYAZAKI_COMPETITION_RATES,
  yamaguchi: YAMAGUCHI_COMPETITION_RATES,
  kagoshima: KAGOSHIMA_COMPETITION_RATES,
  niigata: NIIGATA_COMPETITION_RATES,
  okinawa: OKINAWA_COMPETITION_RATES,
  yamanashi: YAMANASHI_COMPETITION_RATES,
  nara: NARA_COMPETITION_RATES,
  akita: AKITA_COMPETITION_RATES,
  aomori: AOMORI_COMPETITION_RATES,
  iwate: IWATE_COMPETITION_RATES,
  kyoto: KYOTO_COMPETITION_RATES,
  yamagata: YAMAGATA_COMPETITION_RATES,
  aichi: AICHI_COMPETITION_RATES,
  wakayama: WAKAYAMA_COMPETITION_RATES,
  shimane: SHIMANE_COMPETITION_RATES,
  shiga: SHIGA_COMPETITION_RATES,
  fukushima: FUKUSHIMA_COMPETITION_RATES,
  hokkaido: HOKKAIDO_COMPETITION_RATES,
};

// 令和8年度で固定した納品物（旺文社PoC v0等）用。新年度オーバーレイの影響を受けない。
export const COMPETITION_RATE_R8_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> =
  omitPublicationRefused<PrefectureCompetitionRateFile>(COMPETITION_RATE_BASE_BY_PREFECTURE);

// 掲載拒否県は合成の後で必ず外す（新年度ファイルがあっても公開面に出さない）。
export const COMPETITION_RATE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> =
  omitPublicationRefused<PrefectureCompetitionRateFile>(
    mergeNextYearOverlays(COMPETITION_RATE_BASE_BY_PREFECTURE, COMPETITION_RATE_NEXT_BY_PREFECTURE)
  );

export const COMPETITION_RATE_FILES: PrefectureCompetitionRateFile[] = Object.values(
  COMPETITION_RATE_BY_PREFECTURE
).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
