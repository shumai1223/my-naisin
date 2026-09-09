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
import { KANAGAWA_STAGE_LEDGER } from './kanagawa';
import { TOKYO_STAGE_LEDGER } from './tokyo';
import { OSAKA_STAGE_LEDGER } from './osaka';
import { SHIZUOKA_STAGE_LEDGER } from './shizuoka';
import { NIIGATA_STAGE_LEDGER } from './niigata';
import { MIE_STAGE_LEDGER } from './mie';
import { KAGOSHIMA_STAGE_LEDGER } from './kagoshima';
import { SHIGA_STAGE_LEDGER } from './shiga';
import { TOTTORI_STAGE_LEDGER } from './tottori';
import { KUMAMOTO_STAGE_LEDGER } from './kumamoto';
import { ISHIKAWA_STAGE_LEDGER } from './ishikawa';
import { TOKUSHIMA_STAGE_LEDGER } from './tokushima';
import { WAKAYAMA_STAGE_LEDGER } from './wakayama';
import { YAMAGATA_STAGE_LEDGER } from './yamagata';
import { FUKUI_STAGE_LEDGER } from './fukui';

export const STAGE_LEDGER_BY_PREFECTURE: Partial<Record<string, PrefectureStageLedgerFile>> = {
  chiba: CHIBA_STAGE_LEDGER,
  saitama: SAITAMA_STAGE_LEDGER,
  tochigi: TOCHIGI_STAGE_LEDGER,
  ibaraki: IBARAKI_STAGE_LEDGER,
  nagano: NAGANO_STAGE_LEDGER,
  kanagawa: KANAGAWA_STAGE_LEDGER,
  tokyo: TOKYO_STAGE_LEDGER,
  osaka: OSAKA_STAGE_LEDGER,
  shizuoka: SHIZUOKA_STAGE_LEDGER,
  niigata: NIIGATA_STAGE_LEDGER,
  mie: MIE_STAGE_LEDGER,
  kagoshima: KAGOSHIMA_STAGE_LEDGER,
  shiga: SHIGA_STAGE_LEDGER,
  tottori: TOTTORI_STAGE_LEDGER,
  kumamoto: KUMAMOTO_STAGE_LEDGER,
  ishikawa: ISHIKAWA_STAGE_LEDGER,
  tokushima: TOKUSHIMA_STAGE_LEDGER,
  wakayama: WAKAYAMA_STAGE_LEDGER,
  yamagata: YAMAGATA_STAGE_LEDGER,
  fukui: FUKUI_STAGE_LEDGER,
};

export const STAGE_LEDGER_FILES: PrefectureStageLedgerFile[] = Object.values(
  STAGE_LEDGER_BY_PREFECTURE
).filter((f): f is PrefectureStageLedgerFile => f !== undefined);
