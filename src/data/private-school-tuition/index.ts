/**
 * 掛-3第一段: 都道府県別の私立高校学費データを集約するindex。
 * パイロット県（tottori）から開始し、以後の周回で横展開する。
 */
import { PRIVATE_SCHOOL_TUITION_TOTTORI } from './tottori';
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_BY_PREFECTURE: Record<string, PrivateSchoolTuitionFile> = {
  tottori: PRIVATE_SCHOOL_TUITION_TOTTORI,
};

export const PRIVATE_SCHOOL_TUITION_FILES: PrivateSchoolTuitionFile[] = Object.values(
  PRIVATE_SCHOOL_TUITION_BY_PREFECTURE
);
