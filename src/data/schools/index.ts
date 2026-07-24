/**
 * Y-1 学校マスター基盤: 47都道府県分のチャンクを集約するindex（生成物・手編集禁止）。
 * 生成: scripts/build-school-master.ts。再生成すると内容は上書きされる。
 */
import type { SchoolMasterFile } from '@/lib/school-master';

import { SCHOOLS_HOKKAIDO } from './hokkaido';
import { SCHOOLS_AOMORI } from './aomori';
import { SCHOOLS_IWATE } from './iwate';
import { SCHOOLS_MIYAGI } from './miyagi';
import { SCHOOLS_AKITA } from './akita';
import { SCHOOLS_YAMAGATA } from './yamagata';
import { SCHOOLS_FUKUSHIMA } from './fukushima';
import { SCHOOLS_IBARAKI } from './ibaraki';
import { SCHOOLS_TOCHIGI } from './tochigi';
import { SCHOOLS_GUNMA } from './gunma';
import { SCHOOLS_SAITAMA } from './saitama';
import { SCHOOLS_CHIBA } from './chiba';
import { SCHOOLS_TOKYO } from './tokyo';
import { SCHOOLS_KANAGAWA } from './kanagawa';
import { SCHOOLS_NIIGATA } from './niigata';
import { SCHOOLS_TOYAMA } from './toyama';
import { SCHOOLS_ISHIKAWA } from './ishikawa';
import { SCHOOLS_FUKUI } from './fukui';
import { SCHOOLS_YAMANASHI } from './yamanashi';
import { SCHOOLS_NAGANO } from './nagano';
import { SCHOOLS_GIFU } from './gifu';
import { SCHOOLS_SHIZUOKA } from './shizuoka';
import { SCHOOLS_AICHI } from './aichi';
import { SCHOOLS_MIE } from './mie';
import { SCHOOLS_SHIGA } from './shiga';
import { SCHOOLS_KYOTO } from './kyoto';
import { SCHOOLS_OSAKA } from './osaka';
import { SCHOOLS_HYOGO } from './hyogo';
import { SCHOOLS_NARA } from './nara';
import { SCHOOLS_WAKAYAMA } from './wakayama';
import { SCHOOLS_TOTTORI } from './tottori';
import { SCHOOLS_SHIMANE } from './shimane';
import { SCHOOLS_OKAYAMA } from './okayama';
import { SCHOOLS_HIROSHIMA } from './hiroshima';
import { SCHOOLS_YAMAGUCHI } from './yamaguchi';
import { SCHOOLS_TOKUSHIMA } from './tokushima';
import { SCHOOLS_KAGAWA } from './kagawa';
import { SCHOOLS_EHIME } from './ehime';
import { SCHOOLS_KOCHI } from './kochi';
import { SCHOOLS_FUKUOKA } from './fukuoka';
import { SCHOOLS_SAGA } from './saga';
import { SCHOOLS_NAGASAKI } from './nagasaki';
import { SCHOOLS_KUMAMOTO } from './kumamoto';
import { SCHOOLS_OITA } from './oita';
import { SCHOOLS_MIYAZAKI } from './miyazaki';
import { SCHOOLS_KAGOSHIMA } from './kagoshima';
import { SCHOOLS_OKINAWA } from './okinawa';

export const SCHOOL_MASTER_BY_PREFECTURE: Record<string, SchoolMasterFile> = {
  hokkaido: SCHOOLS_HOKKAIDO,
  aomori: SCHOOLS_AOMORI,
  iwate: SCHOOLS_IWATE,
  miyagi: SCHOOLS_MIYAGI,
  akita: SCHOOLS_AKITA,
  yamagata: SCHOOLS_YAMAGATA,
  fukushima: SCHOOLS_FUKUSHIMA,
  ibaraki: SCHOOLS_IBARAKI,
  tochigi: SCHOOLS_TOCHIGI,
  gunma: SCHOOLS_GUNMA,
  saitama: SCHOOLS_SAITAMA,
  chiba: SCHOOLS_CHIBA,
  tokyo: SCHOOLS_TOKYO,
  kanagawa: SCHOOLS_KANAGAWA,
  niigata: SCHOOLS_NIIGATA,
  toyama: SCHOOLS_TOYAMA,
  ishikawa: SCHOOLS_ISHIKAWA,
  fukui: SCHOOLS_FUKUI,
  yamanashi: SCHOOLS_YAMANASHI,
  nagano: SCHOOLS_NAGANO,
  gifu: SCHOOLS_GIFU,
  shizuoka: SCHOOLS_SHIZUOKA,
  aichi: SCHOOLS_AICHI,
  mie: SCHOOLS_MIE,
  shiga: SCHOOLS_SHIGA,
  kyoto: SCHOOLS_KYOTO,
  osaka: SCHOOLS_OSAKA,
  hyogo: SCHOOLS_HYOGO,
  nara: SCHOOLS_NARA,
  wakayama: SCHOOLS_WAKAYAMA,
  tottori: SCHOOLS_TOTTORI,
  shimane: SCHOOLS_SHIMANE,
  okayama: SCHOOLS_OKAYAMA,
  hiroshima: SCHOOLS_HIROSHIMA,
  yamaguchi: SCHOOLS_YAMAGUCHI,
  tokushima: SCHOOLS_TOKUSHIMA,
  kagawa: SCHOOLS_KAGAWA,
  ehime: SCHOOLS_EHIME,
  kochi: SCHOOLS_KOCHI,
  fukuoka: SCHOOLS_FUKUOKA,
  saga: SCHOOLS_SAGA,
  nagasaki: SCHOOLS_NAGASAKI,
  kumamoto: SCHOOLS_KUMAMOTO,
  oita: SCHOOLS_OITA,
  miyazaki: SCHOOLS_MIYAZAKI,
  kagoshima: SCHOOLS_KAGOSHIMA,
  okinawa: SCHOOLS_OKINAWA,
};

export const SCHOOL_MASTER_FILES: SchoolMasterFile[] = Object.values(SCHOOL_MASTER_BY_PREFECTURE);
