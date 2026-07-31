/**
 * 保護者コミュニティ（Λ-14・build-not-launch）の型・バリデーション・PII自動フィルタ・
 * モデレーション状態遷移の契約テスト。
 */
import {
  isCommunityPostCategory,
  validateCommunityPostSubmission,
  detectPiiRisk,
  canTransitionCommunityPostStatus,
  isPubliclyVisibleCommunityPost,
  COMMUNITY_POST_BODY_MIN_LENGTH,
  COMMUNITY_POST_BODY_MAX_LENGTH,
} from '../community-posts';

describe('isCommunityPostCategory', () => {
  it('question/supportはtrue', () => {
    expect(isCommunityPostCategory('question')).toBe(true);
    expect(isCommunityPostCategory('support')).toBe(true);
  });

  it('未登録の値・型不正はfalse', () => {
    expect(isCommunityPostCategory('chat')).toBe(false);
    expect(isCommunityPostCategory(123)).toBe(false);
    expect(isCommunityPostCategory(undefined)).toBe(false);
  });
});

describe('detectPiiRisk', () => {
  it('電話番号を検知する', () => {
    expect(detectPiiRisk('連絡先は090-1234-5678です').reasons).toContain('phone-number');
    expect(detectPiiRisk('09012345678に電話してください').reasons).toContain('phone-number');
  });

  it('メールアドレスを検知する', () => {
    expect(detectPiiRisk('test@example.comまで連絡ください').reasons).toContain('email-address');
  });

  it('郵便番号を検知する', () => {
    expect(detectPiiRisk('郵便番号は100-0001です').reasons).toContain('postal-code');
  });

  it('SNS/LINEハンドルを検知する', () => {
    expect(detectPiiRisk('LINE IDはxxxです').reasons).toContain('sns-handle');
    expect(detectPiiRisk('line.meで友だち追加してください').reasons).toContain('sns-handle');
    expect(detectPiiRisk('@myhandle123までどうぞ').reasons).toContain('sns-handle');
  });

  it('何も含まない本文はflagged:falseかつreasons空', () => {
    const result = detectPiiRisk('内申点の上げ方について相談したいです。中3の評定が伸び悩んでいます。');
    expect(result.flagged).toBe(false);
    expect(result.reasons).toEqual([]);
  });

  it('複数パターンを同時に検知できる', () => {
    const result = detectPiiRisk('090-1234-5678かtest@example.comまでご連絡ください');
    expect(result.flagged).toBe(true);
    expect(result.reasons).toEqual(expect.arrayContaining(['phone-number', 'email-address']));
  });
});

describe('validateCommunityPostSubmission', () => {
  it('妥当な投稿はvalid:true', () => {
    const result = validateCommunityPostSubmission({
      category: 'question',
      body: '内申点の計算方法について教えてください。実技教科の扱いがよくわかりません。',
    });
    expect(result.valid).toBe(true);
  });

  it('カテゴリが不正はvalid:false', () => {
    expect(validateCommunityPostSubmission({ category: 'chat', body: '1234567890' }).valid).toBe(false);
  });

  it('本文が短すぎ・長すぎはvalid:false', () => {
    expect(validateCommunityPostSubmission({ category: 'question', body: '短い' }).valid).toBe(false);
    expect(
      validateCommunityPostSubmission({ category: 'question', body: 'あ'.repeat(COMMUNITY_POST_BODY_MAX_LENGTH + 1) }).valid
    ).toBe(false);
    expect(
      validateCommunityPostSubmission({ category: 'question', body: 'あ'.repeat(COMMUNITY_POST_BODY_MIN_LENGTH) }).valid
    ).toBe(true);
  });

  it('objectでない入力はvalid:false', () => {
    expect(validateCommunityPostSubmission(null).valid).toBe(false);
    expect(validateCommunityPostSubmission('string').valid).toBe(false);
  });
});

describe('canTransitionCommunityPostStatus（モデレーション状態遷移）', () => {
  it('pending/flagged→approved/rejectedは許可', () => {
    expect(canTransitionCommunityPostStatus('pending', 'approved')).toBe(true);
    expect(canTransitionCommunityPostStatus('pending', 'rejected')).toBe(true);
    expect(canTransitionCommunityPostStatus('flagged', 'approved')).toBe(true);
    expect(canTransitionCommunityPostStatus('flagged', 'rejected')).toBe(true);
  });

  it('approved⇄rejectedの訂正は許可', () => {
    expect(canTransitionCommunityPostStatus('approved', 'rejected')).toBe(true);
    expect(canTransitionCommunityPostStatus('rejected', 'approved')).toBe(true);
  });

  it('pending/flaggedへの逆戻りは禁止', () => {
    expect(canTransitionCommunityPostStatus('approved', 'pending')).toBe(false);
    expect(canTransitionCommunityPostStatus('approved', 'flagged')).toBe(false);
    expect(canTransitionCommunityPostStatus('rejected', 'flagged')).toBe(false);
  });

  it('同一状態への遷移は禁止', () => {
    expect(canTransitionCommunityPostStatus('pending', 'pending')).toBe(false);
    expect(canTransitionCommunityPostStatus('flagged', 'flagged')).toBe(false);
    expect(canTransitionCommunityPostStatus('approved', 'approved')).toBe(false);
  });
});

describe('isPubliclyVisibleCommunityPost', () => {
  it('approvedのみtrue', () => {
    expect(isPubliclyVisibleCommunityPost('approved')).toBe(true);
    expect(isPubliclyVisibleCommunityPost('pending')).toBe(false);
    expect(isPubliclyVisibleCommunityPost('flagged')).toBe(false);
    expect(isPubliclyVisibleCommunityPost('rejected')).toBe(false);
  });
});
