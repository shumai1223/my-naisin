/**
 * Λ-5第二段: 都道府県別の私立高校詳細データ（募集定員）を集約するindex。
 */
import { PRIVATE_SCHOOL_DETAIL_TOTTORI } from './tottori';
import { PRIVATE_SCHOOL_DETAIL_FUKUI } from './fukui';
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE: Record<string, PrivateSchoolDetailFile> = {
  tottori: PRIVATE_SCHOOL_DETAIL_TOTTORI,
  fukui: PRIVATE_SCHOOL_DETAIL_FUKUI,
};

export const PRIVATE_SCHOOL_DETAIL_FILES: PrivateSchoolDetailFile[] = Object.values(
  PRIVATE_SCHOOL_DETAIL_BY_PREFECTURE
);
