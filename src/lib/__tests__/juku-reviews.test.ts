/**
 * 塾口コミDB（TIER R-1・build-not-launch）の型・バリデーション・モデレーション状態遷移の契約テスト。
 */
import {
  isReviewableJuku,
  validateReviewSubmission,
  canTransitionReviewStatus,
  isPubliclyVisible,
  REVIEW_RATING_MIN,
  REVIEW_RATING_MAX,
  REVIEW_COMMENT_MIN_LENGTH,
  REVIEW_COMMENT_MAX_LENGTH,
} from '../juku-reviews';
import { JUKU_OFFERS } from '../juku-match';

describe('isReviewableJuku', () => {
  it('既存の塾ユニバースのidはtrue', () => {
    expect(isReviewableJuku(JUKU_OFFERS[0].id)).toBe(true);
  });

  it('未登録のid・型不正はfalse', () => {
    expect(isReviewableJuku('not-a-real-juku')).toBe(false);
    expect(isReviewableJuku(123)).toBe(false);
    expect(isReviewableJuku(undefined)).toBe(false);
  });
});

describe('validateReviewSubmission', () => {
  const validJukuId = JUKU_OFFERS[0].id;

  it('妥当な投稿はvalid:true', () => {
    const result = validateReviewSubmission({
      jukuId: validJukuId,
      rating: 5,
      comment: 'とても丁寧に教えてもらえて助かりました。',
    });
    expect(result.valid).toBe(true);
  });

  it('未登録の塾idはvalid:false', () => {
    const result = validateReviewSubmission({ jukuId: 'unknown-juku', rating: 5, comment: '1234567890' });
    expect(result.valid).toBe(false);
  });

  it('評価が範囲外・非整数はvalid:false', () => {
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: 0, comment: '1234567890' }).valid).toBe(false);
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: 6, comment: '1234567890' }).valid).toBe(false);
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: 3.5, comment: '1234567890' }).valid).toBe(false);
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: REVIEW_RATING_MIN, comment: '1234567890' }).valid).toBe(true);
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: REVIEW_RATING_MAX, comment: '1234567890' }).valid).toBe(true);
  });

  it('コメントが短すぎ・長すぎはvalid:false', () => {
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: 4, comment: '短い' }).valid).toBe(false);
    expect(
      validateReviewSubmission({ jukuId: validJukuId, rating: 4, comment: 'あ'.repeat(REVIEW_COMMENT_MAX_LENGTH + 1) }).valid
    ).toBe(false);
    expect(
      validateReviewSubmission({ jukuId: validJukuId, rating: 4, comment: 'あ'.repeat(REVIEW_COMMENT_MIN_LENGTH) }).valid
    ).toBe(true);
  });

  it('prefectureCodeが文字列以外はvalid:false、省略は許可', () => {
    expect(
      validateReviewSubmission({ jukuId: validJukuId, rating: 4, comment: '1234567890', prefectureCode: 123 }).valid
    ).toBe(false);
    expect(validateReviewSubmission({ jukuId: validJukuId, rating: 4, comment: '1234567890' }).valid).toBe(true);
  });

  it('objectでない入力はvalid:false', () => {
    expect(validateReviewSubmission(null).valid).toBe(false);
    expect(validateReviewSubmission('string').valid).toBe(false);
  });
});

describe('canTransitionReviewStatus（モデレーション状態遷移）', () => {
  it('pending→approved/rejectedは許可', () => {
    expect(canTransitionReviewStatus('pending', 'approved')).toBe(true);
    expect(canTransitionReviewStatus('pending', 'rejected')).toBe(true);
  });

  it('approved⇄rejectedの訂正は許可', () => {
    expect(canTransitionReviewStatus('approved', 'rejected')).toBe(true);
    expect(canTransitionReviewStatus('rejected', 'approved')).toBe(true);
  });

  it('pendingへの逆戻りは禁止', () => {
    expect(canTransitionReviewStatus('approved', 'pending')).toBe(false);
    expect(canTransitionReviewStatus('rejected', 'pending')).toBe(false);
  });

  it('同一状態への遷移は禁止', () => {
    expect(canTransitionReviewStatus('pending', 'pending')).toBe(false);
    expect(canTransitionReviewStatus('approved', 'approved')).toBe(false);
  });
});

describe('isPubliclyVisible', () => {
  it('approvedのみtrue', () => {
    expect(isPubliclyVisible('approved')).toBe(true);
    expect(isPubliclyVisible('pending')).toBe(false);
    expect(isPubliclyVisible('rejected')).toBe(false);
  });
});
