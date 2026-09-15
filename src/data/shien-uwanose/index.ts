/**
 * T-Y13: 都道府県独自「上乗せ」制度の県別チャンクを集約するindex。
 * `src/data/schools/index.ts`と同じ設計（県ごとの静的importでedge runtime対応）。
 * 未登録の県は`getShienUwanose()`が`undefined`を返す（＝'unknown'扱い）。
 */
import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';
import { TOKYO_SHIEN_UWANOSE } from './tokyo';
import { OSAKA_SHIEN_UWANOSE } from './osaka';

export const SHIEN_UWANOSE_BY_PREFECTURE: Partial<Record<string, PrefectureShienUwanose>> = {
  tokyo: TOKYO_SHIEN_UWANOSE,
  osaka: OSAKA_SHIEN_UWANOSE,
};
