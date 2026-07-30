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
};

export const PRIVATE_SCHOOL_DETAIL_FILES: PrivateSchoolDetailFile[] = Object.values(
  PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE
);
