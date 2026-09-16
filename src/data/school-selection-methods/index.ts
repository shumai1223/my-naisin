import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';
import { OSAKA_SCHOOL_SELECTION_METHOD } from './osaka';
import { AICHI_SCHOOL_SELECTION_METHOD } from './aichi';

export const SCHOOL_SELECTION_METHOD_BY_PREFECTURE: Partial<
  Record<string, PrefectureSchoolSelectionMethod>
> = {
  osaka: OSAKA_SCHOOL_SELECTION_METHOD,
  aichi: AICHI_SCHOOL_SELECTION_METHOD,
};
