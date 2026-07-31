/**
 * Λ-5第二段: 都道府県別の私立高校詳細データ（募集定員）を集約するindex。
 */
import { PRIVATE_SCHOOL_DETAIL_TOTTORI } from './tottori';
import { PRIVATE_SCHOOL_DETAIL_FUKUI } from './fukui';
import { PRIVATE_SCHOOL_DETAIL_YAMANASHI } from './yamanashi';
import { PRIVATE_SCHOOL_DETAIL_KOCHI } from './kochi';
import { PRIVATE_SCHOOL_DETAIL_SAGA } from './saga';
import { PRIVATE_SCHOOL_DETAIL_TOKUSHIMA } from './tokushima';
import { PRIVATE_SCHOOL_DETAIL_NAGASAKI } from './nagasaki';
import { PRIVATE_SCHOOL_DETAIL_AKITA } from './akita';
import { PRIVATE_SCHOOL_DETAIL_SHIMANE } from './shimane';
import { PRIVATE_SCHOOL_DETAIL_TOYAMA } from './toyama';
import { PRIVATE_SCHOOL_DETAIL_WAKAYAMA } from './wakayama';
import { PRIVATE_SCHOOL_DETAIL_SHIGA } from './shiga';
import { PRIVATE_SCHOOL_DETAIL_OKINAWA } from './okinawa';
import { PRIVATE_SCHOOL_DETAIL_ISHIKAWA } from './ishikawa';
import { PRIVATE_SCHOOL_DETAIL_KAGAWA } from './kagawa';
import { PRIVATE_SCHOOL_DETAIL_MIYAZAKI } from './miyazaki';
import { PRIVATE_SCHOOL_DETAIL_TOCHIGI } from './tochigi';
import { PRIVATE_SCHOOL_DETAIL_IWATE } from './iwate';
import { PRIVATE_SCHOOL_DETAIL_CHIBA } from './chiba';
import { PRIVATE_SCHOOL_DETAIL_OKAYAMA } from './okayama';
import { PRIVATE_SCHOOL_DETAIL_SHIZUOKA } from './shizuoka';
import { PRIVATE_SCHOOL_DETAIL_SAITAMA } from './saitama';
import { PRIVATE_SCHOOL_DETAIL_FUKUOKA } from './fukuoka';
import { PRIVATE_SCHOOL_DETAIL_HYOGO } from './hyogo';
import { PRIVATE_SCHOOL_DETAIL_NAGANO } from './nagano';
import { PRIVATE_SCHOOL_DETAIL_GIFU } from './gifu';
import { PRIVATE_SCHOOL_DETAIL_MIE } from './mie';
import { PRIVATE_SCHOOL_DETAIL_AOMORI } from './aomori';
import { PRIVATE_SCHOOL_DETAIL_MIYAGI } from './miyagi';
import { PRIVATE_SCHOOL_DETAIL_NIIGATA } from './niigata';
import { PRIVATE_SCHOOL_DETAIL_KUMAMOTO } from './kumamoto';
import { PRIVATE_SCHOOL_DETAIL_OITA } from './oita';
import { PRIVATE_SCHOOL_DETAIL_KAGOSHIMA } from './kagoshima';
import { PRIVATE_SCHOOL_DETAIL_YAMAGATA } from './yamagata';
import { PRIVATE_SCHOOL_DETAIL_GUNMA } from './gunma';
import { PRIVATE_SCHOOL_DETAIL_IBARAKI } from './ibaraki';
import { PRIVATE_SCHOOL_DETAIL_YAMAGUCHI } from './yamaguchi';
import { PRIVATE_SCHOOL_DETAIL_HIROSHIMA } from './hiroshima';
import { PRIVATE_SCHOOL_DETAIL_NARA } from './nara';
import { PRIVATE_SCHOOL_DETAIL_KYOTO } from './kyoto';
import { PRIVATE_SCHOOL_DETAIL_KANAGAWA } from './kanagawa';
import { PRIVATE_SCHOOL_DETAIL_OSAKA } from './osaka';
import { PRIVATE_SCHOOL_DETAIL_AICHI } from './aichi';
import { PRIVATE_SCHOOL_DETAIL_TOKYO } from './tokyo';
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE: Record<string, PrivateSchoolDetailFile> = {
  tottori: PRIVATE_SCHOOL_DETAIL_TOTTORI,
  fukui: PRIVATE_SCHOOL_DETAIL_FUKUI,
  yamanashi: PRIVATE_SCHOOL_DETAIL_YAMANASHI,
  kochi: PRIVATE_SCHOOL_DETAIL_KOCHI,
  saga: PRIVATE_SCHOOL_DETAIL_SAGA,
  tokushima: PRIVATE_SCHOOL_DETAIL_TOKUSHIMA,
  nagasaki: PRIVATE_SCHOOL_DETAIL_NAGASAKI,
  akita: PRIVATE_SCHOOL_DETAIL_AKITA,
  shimane: PRIVATE_SCHOOL_DETAIL_SHIMANE,
  toyama: PRIVATE_SCHOOL_DETAIL_TOYAMA,
  wakayama: PRIVATE_SCHOOL_DETAIL_WAKAYAMA,
  shiga: PRIVATE_SCHOOL_DETAIL_SHIGA,
  okinawa: PRIVATE_SCHOOL_DETAIL_OKINAWA,
  ishikawa: PRIVATE_SCHOOL_DETAIL_ISHIKAWA,
  kagawa: PRIVATE_SCHOOL_DETAIL_KAGAWA,
  miyazaki: PRIVATE_SCHOOL_DETAIL_MIYAZAKI,
  tochigi: PRIVATE_SCHOOL_DETAIL_TOCHIGI,
  iwate: PRIVATE_SCHOOL_DETAIL_IWATE,
  chiba: PRIVATE_SCHOOL_DETAIL_CHIBA,
  okayama: PRIVATE_SCHOOL_DETAIL_OKAYAMA,
  shizuoka: PRIVATE_SCHOOL_DETAIL_SHIZUOKA,
  saitama: PRIVATE_SCHOOL_DETAIL_SAITAMA,
  fukuoka: PRIVATE_SCHOOL_DETAIL_FUKUOKA,
  hyogo: PRIVATE_SCHOOL_DETAIL_HYOGO,
  nagano: PRIVATE_SCHOOL_DETAIL_NAGANO,
  gifu: PRIVATE_SCHOOL_DETAIL_GIFU,
  mie: PRIVATE_SCHOOL_DETAIL_MIE,
  aomori: PRIVATE_SCHOOL_DETAIL_AOMORI,
  miyagi: PRIVATE_SCHOOL_DETAIL_MIYAGI,
  niigata: PRIVATE_SCHOOL_DETAIL_NIIGATA,
  kumamoto: PRIVATE_SCHOOL_DETAIL_KUMAMOTO,
  oita: PRIVATE_SCHOOL_DETAIL_OITA,
  kagoshima: PRIVATE_SCHOOL_DETAIL_KAGOSHIMA,
  yamagata: PRIVATE_SCHOOL_DETAIL_YAMAGATA,
  gunma: PRIVATE_SCHOOL_DETAIL_GUNMA,
  ibaraki: PRIVATE_SCHOOL_DETAIL_IBARAKI,
  yamaguchi: PRIVATE_SCHOOL_DETAIL_YAMAGUCHI,
  hiroshima: PRIVATE_SCHOOL_DETAIL_HIROSHIMA,
  nara: PRIVATE_SCHOOL_DETAIL_NARA,
  kyoto: PRIVATE_SCHOOL_DETAIL_KYOTO,
  kanagawa: PRIVATE_SCHOOL_DETAIL_KANAGAWA,
  osaka: PRIVATE_SCHOOL_DETAIL_OSAKA,
  aichi: PRIVATE_SCHOOL_DETAIL_AICHI,
  tokyo: PRIVATE_SCHOOL_DETAIL_TOKYO,
};

export const PRIVATE_SCHOOL_DETAIL_FILES: PrivateSchoolDetailFile[] = Object.values(
  PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE
);
