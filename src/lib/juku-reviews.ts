/**
 * 塾口コミDB（TIER R-1・build-not-launch）の型・バリデーション・モデレーション状態遷移。
 *
 * このモジュールは意図的に「D1永続化・API・投稿UI」を含まない第1弾（スキーマ+ロジックのみ）。
 * migrations/0008_create_juku_reviews.sql（未適用）が定義するテーブルへ、後続（R-1第2弾）で
 * D1ラッパー（stats-db.ts/leads-db.tsと同じ安全設計）とAPI・投稿UIを追加する想定。
 * 公開判断は👤（build-not-launch＝R群共通の思想）。
 *
 * juku_id は新規マスタを作らず、既存の塾ユニバース（juku-match.tsのJUKU_OFFERS）のidを
 * そのまま流用する＝スパム・未検証案件への投稿を構造的に防ぐ（レジストリに無いidは投稿不可）。
 */
import { JUKU_OFFERS } from '@/lib/juku-match';
import type { AffiliateId } from '@/lib/affiliates';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/** 口コミが対象にできる塾（既存の塾ユニバースのみ）。新規塾マスタを作らないための単一ソース。 */
const REVIEWABLE_JUKU_IDS = new Set<AffiliateId>(JUKU_OFFERS.map((o) => o.id));

export function isReviewableJuku(jukuId: unknown): jukuId is AffiliateId {
  return typeof jukuId === 'string' && REVIEWABLE_JUKU_IDS.has(jukuId as AffiliateId);
}

export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_COMMENT_MIN_LENGTH = 10;
export const REVIEW_COMMENT_MAX_LENGTH = 500;

export interface JukuReviewSubmission {
  jukuId: AffiliateId;
  rating: number;
  comment: string;
  prefectureCode?: string;
}

export interface JukuReviewValidationResult {
  valid: boolean;
  /** 不正な理由（valid:falseのときのみ）。複数該当してもUIで出しやすいよう先頭1件を返す。 */
  reason?: string;
}

/** 投稿内容の構造的バリデーション（プロフィルタリング・NLPは範囲外。長さ/評点/対象塾のみ検査）。 */
export function validateReviewSubmission(input: unknown): JukuReviewValidationResult {
  if (!input || typeof input !== 'object') return { valid: false, reason: '入力が不正です。' };
  const obj = input as Record<string, unknown>;

  if (!isReviewableJuku(obj.jukuId)) {
    return { valid: false, reason: '対象の塾が見つかりません。' };
  }

  const rating = obj.rating;
  if (typeof rating !== 'number' || !Number.isFinite(rating) || !Number.isInteger(rating) || rating < REVIEW_RATING_MIN || rating > REVIEW_RATING_MAX) {
    return { valid: false, reason: `評価は${REVIEW_RATING_MIN}〜${REVIEW_RATING_MAX}の整数で入力してください。` };
  }

  const comment = obj.comment;
  if (typeof comment !== 'string') {
    return { valid: false, reason: 'コメントを入力してください。' };
  }
  const trimmed = comment.trim();
  if (trimmed.length < REVIEW_COMMENT_MIN_LENGTH) {
    return { valid: false, reason: `コメントは${REVIEW_COMMENT_MIN_LENGTH}文字以上で入力してください。` };
  }
  if (trimmed.length > REVIEW_COMMENT_MAX_LENGTH) {
    return { valid: false, reason: `コメントは${REVIEW_COMMENT_MAX_LENGTH}文字以内で入力してください。` };
  }

  if (obj.prefectureCode !== undefined && typeof obj.prefectureCode !== 'string') {
    return { valid: false, reason: '都道府県の指定が不正です。' };
  }

  return { valid: true };
}

/**
 * モデレーション状態遷移の許可判定（単一ソース）。
 * pending → approved/rejected のみ許可。approved⇄rejected はモデレーターの訂正として許可。
 * pending への逆戻りは許可しない（一度判定したら再度pending化はしない運用）。
 */
export function canTransitionReviewStatus(from: ReviewStatus, to: ReviewStatus): boolean {
  if (from === to) return false;
  if (to === 'pending') return false;
  if (from === 'pending') return to === 'approved' || to === 'rejected';
  // from は approved か rejected。互いの訂正のみ許可。
  return (from === 'approved' && to === 'rejected') || (from === 'rejected' && to === 'approved');
}

/** 公開表示してよい口コミか（承認済みのみ）。 */
export function isPubliclyVisible(status: ReviewStatus): boolean {
  return status === 'approved';
}
