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

export const TEIJI_COMPETITION_RATE_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
  tokyo: TOKYO_TEIJI_COMPETITION_RATES,
  miyagi: MIYAGI_TEIJI_COMPETITION_RATES,
  tokushima: TOKUSHIMA_TEIJI_COMPETITION_RATES,
  nagano: NAGANO_TEIJI_COMPETITION_RATES,
  okinawa: OKINAWA_TEIJI_COMPETITION_RATES,
  niigata: NIIGATA_TEIJI_COMPETITION_RATES,
  shimane: SHIMANE_TEIJI_COMPETITION_RATES,
  okayama: OKAYAMA_TEIJI_COMPETITION_RATES,
};

export const TEIJI_COMPETITION_RATE_FILES: PrefectureCompetitionRateFile[] = Object.values(
  TEIJI_COMPETITION_RATE_BY_PREFECTURE
).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
