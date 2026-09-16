import type { PrefectureSchoolDistrict } from '@/lib/school-district';
import { TOKYO_SCHOOL_DISTRICT } from './tokyo';
import { OSAKA_SCHOOL_DISTRICT } from './osaka';
import { SAITAMA_SCHOOL_DISTRICT } from './saitama';
import { HYOGO_SCHOOL_DISTRICT } from './hyogo';
import { AICHI_SCHOOL_DISTRICT } from './aichi';

export const SCHOOL_DISTRICT_BY_PREFECTURE: Partial<Record<string, PrefectureSchoolDistrict>> = {
  tokyo: TOKYO_SCHOOL_DISTRICT,
  osaka: OSAKA_SCHOOL_DISTRICT,
  saitama: SAITAMA_SCHOOL_DISTRICT,
  hyogo: HYOGO_SCHOOL_DISTRICT,
  aichi: AICHI_SCHOOL_DISTRICT,
};
