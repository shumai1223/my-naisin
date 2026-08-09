/**
 * 掛-3第一段: 都道府県別の私立高校学費データを集約するindex。
 * パイロット県（tottori）から開始し、以後の周回で横展開する。
 */
import { PRIVATE_SCHOOL_TUITION_TOTTORI } from './tottori';
import { PRIVATE_SCHOOL_TUITION_TOKUSHIMA } from './tokushima';
import { PRIVATE_SCHOOL_TUITION_AKITA } from './akita';
import { PRIVATE_SCHOOL_TUITION_FUKUI } from './fukui';
import { PRIVATE_SCHOOL_TUITION_KOCHI } from './kochi';
import { PRIVATE_SCHOOL_TUITION_SAGA } from './saga';
import { PRIVATE_SCHOOL_TUITION_TOYAMA } from './toyama';
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_BY_PREFECTURE: Record<string, PrivateSchoolTuitionFile> = {
  tottori: PRIVATE_SCHOOL_TUITION_TOTTORI,
  tokushima: PRIVATE_SCHOOL_TUITION_TOKUSHIMA,
  akita: PRIVATE_SCHOOL_TUITION_AKITA,
  fukui: PRIVATE_SCHOOL_TUITION_FUKUI,
  kochi: PRIVATE_SCHOOL_TUITION_KOCHI,
  saga: PRIVATE_SCHOOL_TUITION_SAGA,
  toyama: PRIVATE_SCHOOL_TUITION_TOYAMA,
};

export const PRIVATE_SCHOOL_TUITION_FILES: PrivateSchoolTuitionFile[] = Object.values(
  PRIVATE_SCHOOL_TUITION_BY_PREFECTURE
);
