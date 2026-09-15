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
};
