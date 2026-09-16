import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';
import { OSAKA_SCHOOL_SELECTION_METHOD } from './osaka';

export const SCHOOL_SELECTION_METHOD_BY_PREFECTURE: Partial<
  Record<string, PrefectureSchoolSelectionMethod>
> = {
  osaka: OSAKA_SCHOOL_SELECTION_METHOD,
};
