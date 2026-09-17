/**
 * T-Y13: 都道府県独自「上乗せ」制度の県別チャンクを集約するindex。
 * `src/data/schools/index.ts`と同じ設計（県ごとの静的importでedge runtime対応）。
 * 未登録の県は`getShienUwanose()`が`undefined`を返す（＝'unknown'扱い）。
 */
import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';
import { TOKYO_SHIEN_UWANOSE } from './tokyo';
import { OSAKA_SHIEN_UWANOSE } from './osaka';
import { MIE_SHIEN_UWANOSE } from './mie';
import { YAMANASHI_SHIEN_UWANOSE } from './yamanashi';
import { NAGASAKI_SHIEN_UWANOSE } from './nagasaki';
import { HYOGO_SHIEN_UWANOSE } from './hyogo';
import { KYOTO_SHIEN_UWANOSE } from './kyoto';
import { KANAGAWA_SHIEN_UWANOSE } from './kanagawa';
import { AICHI_SHIEN_UWANOSE } from './aichi';
import { OITA_SHIEN_UWANOSE } from './oita';
import { HIROSHIMA_SHIEN_UWANOSE } from './hiroshima';
import { TOTTORI_SHIEN_UWANOSE } from './tottori';
import { YAMAGUCHI_SHIEN_UWANOSE } from './yamaguchi';
import { NARA_SHIEN_UWANOSE } from './nara';
import { GUNMA_SHIEN_UWANOSE } from './gunma';
import { TOCHIGI_SHIEN_UWANOSE } from './tochigi';
import { IBARAKI_SHIEN_UWANOSE } from './ibaraki';
import { FUKUI_SHIEN_UWANOSE } from './fukui';
import { OKAYAMA_SHIEN_UWANOSE } from './okayama';
import { HOKKAIDO_SHIEN_UWANOSE } from './hokkaido';
import { SAITAMA_SHIEN_UWANOSE } from './saitama';

export const SHIEN_UWANOSE_BY_PREFECTURE: Partial<Record<string, PrefectureShienUwanose>> = {
  tokyo: TOKYO_SHIEN_UWANOSE,
  osaka: OSAKA_SHIEN_UWANOSE,
  mie: MIE_SHIEN_UWANOSE,
  yamanashi: YAMANASHI_SHIEN_UWANOSE,
  nagasaki: NAGASAKI_SHIEN_UWANOSE,
  hyogo: HYOGO_SHIEN_UWANOSE,
  kyoto: KYOTO_SHIEN_UWANOSE,
  kanagawa: KANAGAWA_SHIEN_UWANOSE,
  aichi: AICHI_SHIEN_UWANOSE,
  oita: OITA_SHIEN_UWANOSE,
  hiroshima: HIROSHIMA_SHIEN_UWANOSE,
  tottori: TOTTORI_SHIEN_UWANOSE,
  yamaguchi: YAMAGUCHI_SHIEN_UWANOSE,
  nara: NARA_SHIEN_UWANOSE,
  gunma: GUNMA_SHIEN_UWANOSE,
  tochigi: TOCHIGI_SHIEN_UWANOSE,
  ibaraki: IBARAKI_SHIEN_UWANOSE,
  fukui: FUKUI_SHIEN_UWANOSE,
  okayama: OKAYAMA_SHIEN_UWANOSE,
  hokkaido: HOKKAIDO_SHIEN_UWANOSE,
  saitama: SAITAMA_SHIEN_UWANOSE,
};
