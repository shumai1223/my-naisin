/**
 * 新年度（令和9年度）の倍率ファイルの登録簿（T-PV2 A-4）。
 *
 * ここに載せた県だけ、`src/data/competition-rates/index.ts` で旧ファイル（令和8年度）に重ねて
 * 「新年度＝今季」として公開される（合成は `src/lib/competition-rate-overlay.ts`）。
 * 空のあいだは、本番の挙動は今までと完全に同じ。
 *
 * 追加は `npx tsx scripts/bairitsu-ingest/approve-new-year.ts` が行う（import 行と登録行を
 * 下のマーカーの位置へ挿入する）。手で足す場合も、検算（verify-new-year.ts）に通してから。
 * 外すだけで元に戻る（旧ファイルは書き換えていない）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
// @next-imports (approve-new-year.ts がこの行の直前に import を挿入する)

export const COMPETITION_RATE_NEXT_BY_PREFECTURE: Partial<Record<string, PrefectureCompetitionRateFile>> = {
  // @next-entries (approve-new-year.ts がこの行の直前に登録行を挿入する)
};
