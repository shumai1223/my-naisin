import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';
import { OSAKA_SCHOOL_SELECTION_METHOD } from './osaka';
import { AICHI_SCHOOL_SELECTION_METHOD } from './aichi';
import { IBARAKI_SCHOOL_SELECTION_METHOD } from './ibaraki';
import { YAMANASHI_SCHOOL_SELECTION_METHOD } from './yamanashi';
import { GUNMA_SCHOOL_SELECTION_METHOD } from './gunma';

export const SCHOOL_SELECTION_METHOD_BY_PREFECTURE: Partial<
  Record<string, PrefectureSchoolSelectionMethod>
> = {
  osaka: OSAKA_SCHOOL_SELECTION_METHOD,
  aichi: AICHI_SCHOOL_SELECTION_METHOD,
  ibaraki: IBARAKI_SCHOOL_SELECTION_METHOD,
  yamanashi: YAMANASHI_SCHOOL_SELECTION_METHOD,
  gunma: GUNMA_SCHOOL_SELECTION_METHOD,
};
