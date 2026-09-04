/**
 * T-Y12 入試日程DB: 都道府県別チャンクを集約するindex。
 * src/data/competition-rates/index.tsと同じ設計（県ごとの静的importでedge runtime対応）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';
import { HOKKAIDO_EXAM_SCHEDULE } from './hokkaido';
import { AOMORI_EXAM_SCHEDULE } from './aomori';
import { IWATE_EXAM_SCHEDULE } from './iwate';
import { MIYAGI_EXAM_SCHEDULE } from './miyagi';
import { AKITA_EXAM_SCHEDULE } from './akita';
import { YAMAGATA_EXAM_SCHEDULE } from './yamagata';
import { FUKUSHIMA_EXAM_SCHEDULE } from './fukushima';
import { IBARAKI_EXAM_SCHEDULE } from './ibaraki';
import { TOCHIGI_EXAM_SCHEDULE } from './tochigi';
import { GUNMA_EXAM_SCHEDULE } from './gunma';
import { SAITAMA_EXAM_SCHEDULE } from './saitama';
import { CHIBA_EXAM_SCHEDULE } from './chiba';
import { TOKYO_EXAM_SCHEDULE } from './tokyo';
import { KANAGAWA_EXAM_SCHEDULE } from './kanagawa';
import { NIIGATA_EXAM_SCHEDULE } from './niigata';
import { TOYAMA_EXAM_SCHEDULE } from './toyama';
import { ISHIKAWA_EXAM_SCHEDULE } from './ishikawa';
import { FUKUI_EXAM_SCHEDULE } from './fukui';
import { YAMANASHI_EXAM_SCHEDULE } from './yamanashi';
import { NAGANO_EXAM_SCHEDULE } from './nagano';
import { GIFU_EXAM_SCHEDULE } from './gifu';
import { SHIZUOKA_EXAM_SCHEDULE } from './shizuoka';
import { AICHI_EXAM_SCHEDULE } from './aichi';
import { MIE_EXAM_SCHEDULE } from './mie';
import { SHIGA_EXAM_SCHEDULE } from './shiga';
import { KYOTO_EXAM_SCHEDULE } from './kyoto';
import { OSAKA_EXAM_SCHEDULE } from './osaka';
import { HYOGO_EXAM_SCHEDULE } from './hyogo';
import { NARA_EXAM_SCHEDULE } from './nara';
import { WAKAYAMA_EXAM_SCHEDULE } from './wakayama';
import { TOTTORI_EXAM_SCHEDULE } from './tottori';
import { SHIMANE_EXAM_SCHEDULE } from './shimane';
import { OKAYAMA_EXAM_SCHEDULE } from './okayama';
import { HIROSHIMA_EXAM_SCHEDULE } from './hiroshima';
import { YAMAGUCHI_EXAM_SCHEDULE } from './yamaguchi';
import { TOKUSHIMA_EXAM_SCHEDULE } from './tokushima';
import { KAGAWA_EXAM_SCHEDULE } from './kagawa';
import { EHIME_EXAM_SCHEDULE } from './ehime';
import { KOCHI_EXAM_SCHEDULE } from './kochi';
import { FUKUOKA_EXAM_SCHEDULE } from './fukuoka';
import { SAGA_EXAM_SCHEDULE } from './saga';
import { NAGASAKI_EXAM_SCHEDULE } from './nagasaki';
import { KUMAMOTO_EXAM_SCHEDULE } from './kumamoto';
import { OITA_EXAM_SCHEDULE } from './oita';
import { MIYAZAKI_EXAM_SCHEDULE } from './miyazaki';
import { KAGOSHIMA_EXAM_SCHEDULE } from './kagoshima';
import { OKINAWA_EXAM_SCHEDULE } from './okinawa';

export const EXAM_SCHEDULE_BY_PREFECTURE: Partial<Record<string, PrefectureExamScheduleFile>> = {
  hokkaido: HOKKAIDO_EXAM_SCHEDULE,
  aomori: AOMORI_EXAM_SCHEDULE,
  iwate: IWATE_EXAM_SCHEDULE,
  miyagi: MIYAGI_EXAM_SCHEDULE,
  akita: AKITA_EXAM_SCHEDULE,
  yamagata: YAMAGATA_EXAM_SCHEDULE,
  fukushima: FUKUSHIMA_EXAM_SCHEDULE,
  ibaraki: IBARAKI_EXAM_SCHEDULE,
  tochigi: TOCHIGI_EXAM_SCHEDULE,
  gunma: GUNMA_EXAM_SCHEDULE,
  saitama: SAITAMA_EXAM_SCHEDULE,
  chiba: CHIBA_EXAM_SCHEDULE,
  tokyo: TOKYO_EXAM_SCHEDULE,
  kanagawa: KANAGAWA_EXAM_SCHEDULE,
  niigata: NIIGATA_EXAM_SCHEDULE,
  toyama: TOYAMA_EXAM_SCHEDULE,
  ishikawa: ISHIKAWA_EXAM_SCHEDULE,
  fukui: FUKUI_EXAM_SCHEDULE,
  yamanashi: YAMANASHI_EXAM_SCHEDULE,
  nagano: NAGANO_EXAM_SCHEDULE,
  gifu: GIFU_EXAM_SCHEDULE,
  shizuoka: SHIZUOKA_EXAM_SCHEDULE,
  aichi: AICHI_EXAM_SCHEDULE,
  mie: MIE_EXAM_SCHEDULE,
  shiga: SHIGA_EXAM_SCHEDULE,
  kyoto: KYOTO_EXAM_SCHEDULE,
  osaka: OSAKA_EXAM_SCHEDULE,
  hyogo: HYOGO_EXAM_SCHEDULE,
  nara: NARA_EXAM_SCHEDULE,
  wakayama: WAKAYAMA_EXAM_SCHEDULE,
  tottori: TOTTORI_EXAM_SCHEDULE,
  shimane: SHIMANE_EXAM_SCHEDULE,
  okayama: OKAYAMA_EXAM_SCHEDULE,
  hiroshima: HIROSHIMA_EXAM_SCHEDULE,
  yamaguchi: YAMAGUCHI_EXAM_SCHEDULE,
  tokushima: TOKUSHIMA_EXAM_SCHEDULE,
  kagawa: KAGAWA_EXAM_SCHEDULE,
  ehime: EHIME_EXAM_SCHEDULE,
  kochi: KOCHI_EXAM_SCHEDULE,
  fukuoka: FUKUOKA_EXAM_SCHEDULE,
  saga: SAGA_EXAM_SCHEDULE,
  nagasaki: NAGASAKI_EXAM_SCHEDULE,
  kumamoto: KUMAMOTO_EXAM_SCHEDULE,
  oita: OITA_EXAM_SCHEDULE,
  miyazaki: MIYAZAKI_EXAM_SCHEDULE,
  kagoshima: KAGOSHIMA_EXAM_SCHEDULE,
  okinawa: OKINAWA_EXAM_SCHEDULE,
};

/** 登録済み都道府県コードの一覧（47県）。generateStaticParams等で使う。 */
export const EXAM_SCHEDULE_PREFECTURE_CODES: string[] = Object.keys(EXAM_SCHEDULE_BY_PREFECTURE);
