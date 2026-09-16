import type { PrefectureSchoolDistrict } from '@/lib/school-district';
import { TOKYO_SCHOOL_DISTRICT } from './tokyo';
import { OSAKA_SCHOOL_DISTRICT } from './osaka';
import { SAITAMA_SCHOOL_DISTRICT } from './saitama';
import { HYOGO_SCHOOL_DISTRICT } from './hyogo';
import { AICHI_SCHOOL_DISTRICT } from './aichi';
import { MIYAGI_SCHOOL_DISTRICT } from './miyagi';
import { CHIBA_SCHOOL_DISTRICT } from './chiba';
import { KANAGAWA_SCHOOL_DISTRICT } from './kanagawa';
import { HOKKAIDO_SCHOOL_DISTRICT } from './hokkaido';
import { TOYAMA_SCHOOL_DISTRICT } from './toyama';
import { NAGANO_SCHOOL_DISTRICT } from './nagano';
import { OITA_SCHOOL_DISTRICT } from './oita';
import { KAGOSHIMA_SCHOOL_DISTRICT } from './kagoshima';
import { SAGA_SCHOOL_DISTRICT } from './saga';
import { OKINAWA_SCHOOL_DISTRICT } from './okinawa';
import { KOCHI_SCHOOL_DISTRICT } from './kochi';
import { OKAYAMA_SCHOOL_DISTRICT } from './okayama';
import { AOMORI_SCHOOL_DISTRICT } from './aomori';
import { TOKUSHIMA_SCHOOL_DISTRICT } from './tokushima';
import { TOCHIGI_SCHOOL_DISTRICT } from './tochigi';
import { MIE_SCHOOL_DISTRICT } from './mie';

export const SCHOOL_DISTRICT_BY_PREFECTURE: Partial<Record<string, PrefectureSchoolDistrict>> = {
  tokyo: TOKYO_SCHOOL_DISTRICT,
  osaka: OSAKA_SCHOOL_DISTRICT,
  saitama: SAITAMA_SCHOOL_DISTRICT,
  hyogo: HYOGO_SCHOOL_DISTRICT,
  aichi: AICHI_SCHOOL_DISTRICT,
  miyagi: MIYAGI_SCHOOL_DISTRICT,
  chiba: CHIBA_SCHOOL_DISTRICT,
  kanagawa: KANAGAWA_SCHOOL_DISTRICT,
  hokkaido: HOKKAIDO_SCHOOL_DISTRICT,
  toyama: TOYAMA_SCHOOL_DISTRICT,
  nagano: NAGANO_SCHOOL_DISTRICT,
  oita: OITA_SCHOOL_DISTRICT,
  kagoshima: KAGOSHIMA_SCHOOL_DISTRICT,
  saga: SAGA_SCHOOL_DISTRICT,
  okinawa: OKINAWA_SCHOOL_DISTRICT,
  kochi: KOCHI_SCHOOL_DISTRICT,
  okayama: OKAYAMA_SCHOOL_DISTRICT,
  aomori: AOMORI_SCHOOL_DISTRICT,
  tokushima: TOKUSHIMA_SCHOOL_DISTRICT,
  tochigi: TOCHIGI_SCHOOL_DISTRICT,
  mie: MIE_SCHOOL_DISTRICT,
};
