/**
 * Λ-5 私立高等学校マスター: 47都道府県分のチャンクを集約するindex（生成物・手編集禁止）。
 * 生成: scripts/build-school-master.ts。再生成すると内容は上書きされる。
 */
import type { SchoolMasterFile } from '@/lib/school-master';

import { SCHOOLS_PRIVATE_HOKKAIDO } from './hokkaido';
import { SCHOOLS_PRIVATE_AOMORI } from './aomori';
import { SCHOOLS_PRIVATE_IWATE } from './iwate';
import { SCHOOLS_PRIVATE_MIYAGI } from './miyagi';
import { SCHOOLS_PRIVATE_AKITA } from './akita';
import { SCHOOLS_PRIVATE_YAMAGATA } from './yamagata';
import { SCHOOLS_PRIVATE_FUKUSHIMA } from './fukushima';
import { SCHOOLS_PRIVATE_IBARAKI } from './ibaraki';
import { SCHOOLS_PRIVATE_TOCHIGI } from './tochigi';
import { SCHOOLS_PRIVATE_GUNMA } from './gunma';
import { SCHOOLS_PRIVATE_SAITAMA } from './saitama';
import { SCHOOLS_PRIVATE_CHIBA } from './chiba';
import { SCHOOLS_PRIVATE_TOKYO } from './tokyo';
import { SCHOOLS_PRIVATE_KANAGAWA } from './kanagawa';
import { SCHOOLS_PRIVATE_NIIGATA } from './niigata';
import { SCHOOLS_PRIVATE_TOYAMA } from './toyama';
import { SCHOOLS_PRIVATE_ISHIKAWA } from './ishikawa';
import { SCHOOLS_PRIVATE_FUKUI } from './fukui';
import { SCHOOLS_PRIVATE_YAMANASHI } from './yamanashi';
import { SCHOOLS_PRIVATE_NAGANO } from './nagano';
import { SCHOOLS_PRIVATE_GIFU } from './gifu';
import { SCHOOLS_PRIVATE_SHIZUOKA } from './shizuoka';
import { SCHOOLS_PRIVATE_AICHI } from './aichi';
import { SCHOOLS_PRIVATE_MIE } from './mie';
import { SCHOOLS_PRIVATE_SHIGA } from './shiga';
import { SCHOOLS_PRIVATE_KYOTO } from './kyoto';
import { SCHOOLS_PRIVATE_OSAKA } from './osaka';
import { SCHOOLS_PRIVATE_HYOGO } from './hyogo';
import { SCHOOLS_PRIVATE_NARA } from './nara';
import { SCHOOLS_PRIVATE_WAKAYAMA } from './wakayama';
import { SCHOOLS_PRIVATE_TOTTORI } from './tottori';
import { SCHOOLS_PRIVATE_SHIMANE } from './shimane';
import { SCHOOLS_PRIVATE_OKAYAMA } from './okayama';
import { SCHOOLS_PRIVATE_HIROSHIMA } from './hiroshima';
import { SCHOOLS_PRIVATE_YAMAGUCHI } from './yamaguchi';
import { SCHOOLS_PRIVATE_TOKUSHIMA } from './tokushima';
import { SCHOOLS_PRIVATE_KAGAWA } from './kagawa';
import { SCHOOLS_PRIVATE_EHIME } from './ehime';
import { SCHOOLS_PRIVATE_KOCHI } from './kochi';
import { SCHOOLS_PRIVATE_FUKUOKA } from './fukuoka';
import { SCHOOLS_PRIVATE_SAGA } from './saga';
import { SCHOOLS_PRIVATE_NAGASAKI } from './nagasaki';
import { SCHOOLS_PRIVATE_KUMAMOTO } from './kumamoto';
import { SCHOOLS_PRIVATE_OITA } from './oita';
import { SCHOOLS_PRIVATE_MIYAZAKI } from './miyazaki';
import { SCHOOLS_PRIVATE_KAGOSHIMA } from './kagoshima';
import { SCHOOLS_PRIVATE_OKINAWA } from './okinawa';

export const SCHOOL_MASTER_BY_PREFECTURE: Record<string, SchoolMasterFile> = {
  hokkaido: SCHOOLS_PRIVATE_HOKKAIDO,
  aomori: SCHOOLS_PRIVATE_AOMORI,
  iwate: SCHOOLS_PRIVATE_IWATE,
  miyagi: SCHOOLS_PRIVATE_MIYAGI,
  akita: SCHOOLS_PRIVATE_AKITA,
  yamagata: SCHOOLS_PRIVATE_YAMAGATA,
  fukushima: SCHOOLS_PRIVATE_FUKUSHIMA,
  ibaraki: SCHOOLS_PRIVATE_IBARAKI,
  tochigi: SCHOOLS_PRIVATE_TOCHIGI,
  gunma: SCHOOLS_PRIVATE_GUNMA,
  saitama: SCHOOLS_PRIVATE_SAITAMA,
  chiba: SCHOOLS_PRIVATE_CHIBA,
  tokyo: SCHOOLS_PRIVATE_TOKYO,
  kanagawa: SCHOOLS_PRIVATE_KANAGAWA,
  niigata: SCHOOLS_PRIVATE_NIIGATA,
  toyama: SCHOOLS_PRIVATE_TOYAMA,
  ishikawa: SCHOOLS_PRIVATE_ISHIKAWA,
  fukui: SCHOOLS_PRIVATE_FUKUI,
  yamanashi: SCHOOLS_PRIVATE_YAMANASHI,
  nagano: SCHOOLS_PRIVATE_NAGANO,
  gifu: SCHOOLS_PRIVATE_GIFU,
  shizuoka: SCHOOLS_PRIVATE_SHIZUOKA,
  aichi: SCHOOLS_PRIVATE_AICHI,
  mie: SCHOOLS_PRIVATE_MIE,
  shiga: SCHOOLS_PRIVATE_SHIGA,
  kyoto: SCHOOLS_PRIVATE_KYOTO,
  osaka: SCHOOLS_PRIVATE_OSAKA,
  hyogo: SCHOOLS_PRIVATE_HYOGO,
  nara: SCHOOLS_PRIVATE_NARA,
  wakayama: SCHOOLS_PRIVATE_WAKAYAMA,
  tottori: SCHOOLS_PRIVATE_TOTTORI,
  shimane: SCHOOLS_PRIVATE_SHIMANE,
  okayama: SCHOOLS_PRIVATE_OKAYAMA,
  hiroshima: SCHOOLS_PRIVATE_HIROSHIMA,
  yamaguchi: SCHOOLS_PRIVATE_YAMAGUCHI,
  tokushima: SCHOOLS_PRIVATE_TOKUSHIMA,
  kagawa: SCHOOLS_PRIVATE_KAGAWA,
  ehime: SCHOOLS_PRIVATE_EHIME,
  kochi: SCHOOLS_PRIVATE_KOCHI,
  fukuoka: SCHOOLS_PRIVATE_FUKUOKA,
  saga: SCHOOLS_PRIVATE_SAGA,
  nagasaki: SCHOOLS_PRIVATE_NAGASAKI,
  kumamoto: SCHOOLS_PRIVATE_KUMAMOTO,
  oita: SCHOOLS_PRIVATE_OITA,
  miyazaki: SCHOOLS_PRIVATE_MIYAZAKI,
  kagoshima: SCHOOLS_PRIVATE_KAGOSHIMA,
  okinawa: SCHOOLS_PRIVATE_OKINAWA,
};

export const SCHOOL_MASTER_FILES: SchoolMasterFile[] = Object.values(SCHOOL_MASTER_BY_PREFECTURE);
