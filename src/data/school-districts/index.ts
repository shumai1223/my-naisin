import type { PrefectureSchoolDistrict } from '@/lib/school-district';
import { TOKYO_SCHOOL_DISTRICT } from './tokyo';
import { OSAKA_SCHOOL_DISTRICT } from './osaka';
import { SAITAMA_SCHOOL_DISTRICT } from './saitama';

export const SCHOOL_DISTRICT_BY_PREFECTURE: Partial<Record<string, PrefectureSchoolDistrict>> = {
  tokyo: TOKYO_SCHOOL_DISTRICT,
  osaka: OSAKA_SCHOOL_DISTRICT,
  saitama: SAITAMA_SCHOOL_DISTRICT,
};
