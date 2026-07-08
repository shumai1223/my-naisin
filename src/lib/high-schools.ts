/**
 * 高校ページDBの骨格（TIER R-3・build-not-launch）。
 *
 * このモジュールは意図的に「D1永続化・API・公開ページ」を含まない第1弾（型+バリデーションのみ）。
 * migrations/0009_create_high_schools.sql（未適用）が定義するテーブルへ、後続（R-3第2弾）で
 * D1ラッパー（leads-db.ts/stats-db.ts/juku-reviews-db.tsと同じ安全設計）とAPI・公開ページを追加する。
 *
 * 核心方針：「学校基本情報=公開データのみ」を機械的に強制する。source_url（出典）が無い、
 * または都道府県コードが検証済みレジストリ（prefectures.ts）に存在しない投入は
 * isValidHighSchoolEntry() が弾く＝捏造・未検証データがテーブルに入り得ない設計。
 */
import { getPrefectureByCode } from '@/lib/prefectures';
import { getTotalScoreSystem, isVerifiedTotalScore } from '@/lib/total-score/registry';
import type { TotalScoreSystem } from '@/lib/total-score/types';

export type SchoolType = 'public' | 'private';

export interface HighSchoolEntry {
  prefectureCode: string;
  name: string;
  schoolType: SchoolType;
  /** 出典（学校公式サイト・教育委員会等の一次情報）。公開データのみという方針を担保する必須項目。 */
  sourceUrl: string;
  /** 出典を最終確認した日付（'YYYY-MM-DD'）。任意だが将来の鮮度監査に使える。 */
  sourceCheckedAt?: string;
}

export interface HighSchoolValidationResult {
  valid: boolean;
  reason?: string;
}

const NAME_MAX_LENGTH = 100;
const URL_RE = /^https?:\/\/.+/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidSchoolType(value: unknown): value is SchoolType {
  return value === 'public' || value === 'private';
}

/**
 * 高校エントリの投入前バリデーション（構造的検査のみ・実在確認そのものは行わない）。
 * - prefectureCodeは検証済みの都道府県レジストリに存在すること。
 * - sourceUrlは必須かつhttp(s)スキームであること（公開データのみの方針を機械的に強制）。
 */
export function isValidHighSchoolEntry(input: unknown): HighSchoolValidationResult {
  if (!input || typeof input !== 'object') return { valid: false, reason: '入力が不正です。' };
  const obj = input as Record<string, unknown>;

  if (typeof obj.prefectureCode !== 'string' || !getPrefectureByCode(obj.prefectureCode)) {
    return { valid: false, reason: '都道府県コードが不正です（prefectures.tsの検証済みレジストリに存在しません）。' };
  }

  if (typeof obj.name !== 'string' || !obj.name.trim() || obj.name.trim().length > NAME_MAX_LENGTH) {
    return { valid: false, reason: `学校名は1〜${NAME_MAX_LENGTH}文字で指定してください。` };
  }

  if (!isValidSchoolType(obj.schoolType)) {
    return { valid: false, reason: 'schoolTypeは public か private を指定してください。' };
  }

  if (typeof obj.sourceUrl !== 'string' || !URL_RE.test(obj.sourceUrl)) {
    return { valid: false, reason: '出典URL（sourceUrl）は必須です（http/httpsで始まるURL）。' };
  }

  if (obj.sourceCheckedAt !== undefined && (typeof obj.sourceCheckedAt !== 'string' || !DATE_RE.test(obj.sourceCheckedAt))) {
    return { valid: false, reason: 'sourceCheckedAtはYYYY-MM-DD形式で指定してください。' };
  }

  return { valid: true };
}

/**
 * 学校の都道府県コードから、検証済みの総合得点計算方式（total-score/registry.ts）へ接続する。
 * 未検証の県はnull（解説のみで計算機が無い県。学校ページからは一般解説にリンクする運用を想定）。
 * 新規に学校別の入試データを作らず、既存の検証済み県データを再利用する（検証済み入試方式接続）。
 */
export function getVerifiedAdmissionSystemForSchool(prefectureCode: string): TotalScoreSystem | null {
  if (!isVerifiedTotalScore(prefectureCode)) return null;
  return getTotalScoreSystem(prefectureCode) ?? null;
}
