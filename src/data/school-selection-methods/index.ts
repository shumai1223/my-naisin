import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';
import { OSAKA_SCHOOL_SELECTION_METHOD } from './osaka';
import { AICHI_SCHOOL_SELECTION_METHOD } from './aichi';
import { IBARAKI_SCHOOL_SELECTION_METHOD } from './ibaraki';
import { YAMANASHI_SCHOOL_SELECTION_METHOD } from './yamanashi';
import { GUNMA_SCHOOL_SELECTION_METHOD } from './gunma';
import { NAGANO_SCHOOL_SELECTION_METHOD } from './nagano';
import { MIYAGI_SCHOOL_SELECTION_METHOD } from './miyagi';
import { KAGOSHIMA_SCHOOL_SELECTION_METHOD } from './kagoshima';
import { KOCHI_SCHOOL_SELECTION_METHOD } from './kochi';
import { OKAYAMA_SCHOOL_SELECTION_METHOD } from './okayama';
import { AOMORI_SCHOOL_SELECTION_METHOD } from './aomori';
import { GIFU_SCHOOL_SELECTION_METHOD } from './gifu';
import { TOKUSHIMA_SCHOOL_SELECTION_METHOD } from './tokushima';

export const SCHOOL_SELECTION_METHOD_BY_PREFECTURE: Partial<
  Record<string, PrefectureSchoolSelectionMethod>
> = {
  osaka: OSAKA_SCHOOL_SELECTION_METHOD,
  aichi: AICHI_SCHOOL_SELECTION_METHOD,
  ibaraki: IBARAKI_SCHOOL_SELECTION_METHOD,
  yamanashi: YAMANASHI_SCHOOL_SELECTION_METHOD,
  gunma: GUNMA_SCHOOL_SELECTION_METHOD,
  nagano: NAGANO_SCHOOL_SELECTION_METHOD,
  miyagi: MIYAGI_SCHOOL_SELECTION_METHOD,
  kagoshima: KAGOSHIMA_SCHOOL_SELECTION_METHOD,
  kochi: KOCHI_SCHOOL_SELECTION_METHOD,
  okayama: OKAYAMA_SCHOOL_SELECTION_METHOD,
  aomori: AOMORI_SCHOOL_SELECTION_METHOD,
  gifu: GIFU_SCHOOL_SELECTION_METHOD,
  tokushima: TOKUSHIMA_SCHOOL_SELECTION_METHOD,
};
