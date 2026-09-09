/**
 * T-Y11F §5順序#7: 段階台帳の都道府県別チャンクを集約するindex。
 * `src/data/competition-rates/index.ts`と同じ設計（県ごとの静的importでedge runtime対応）。
 * パイロット県（chiba・saitama）から順次追加する。
 */
import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';
import { CHIBA_STAGE_LEDGER } from './chiba';
import { SAITAMA_STAGE_LEDGER } from './saitama';
import { TOCHIGI_STAGE_LEDGER } from './tochigi';
import { IBARAKI_STAGE_LEDGER } from './ibaraki';
import { NAGANO_STAGE_LEDGER } from './nagano';

export const STAGE_LEDGER_BY_PREFECTURE: Partial<Record<string, PrefectureStageLedgerFile>> = {
  chiba: CHIBA_STAGE_LEDGER,
  saitama: SAITAMA_STAGE_LEDGER,
  tochigi: TOCHIGI_STAGE_LEDGER,
  ibaraki: IBARAKI_STAGE_LEDGER,
  nagano: NAGANO_STAGE_LEDGER,
};

export const STAGE_LEDGER_FILES: PrefectureStageLedgerFile[] = Object.values(
  STAGE_LEDGER_BY_PREFECTURE
).filter((f): f is PrefectureStageLedgerFile => f !== undefined);
