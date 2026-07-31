/**
 * 保護者コミュニティ（Λ-14・Ω-17実行層・build-not-launch）の型・バリデーション・PII自動フィルタ。
 *
 * このモジュールは意図的に「D1永続化・API・投稿UI」を含まない第1弾（スキーマ+ロジックのみ）。
 * juku-reviews.tsと同じ設計思想を踏襲する。「器＋自動フィルタまで」がΛ-14のDoDであり、
 * 投稿の最終的なモデレーション判断・公開範囲・運営方針は👤が行う（loopは機構試作のみ）。
 *
 * 安全設計（未成年運営コミュニティの前提・[[fable5-fullaccel-backlog-2026-07]]Ω-17参照）：
 *  - 表示名・連絡先など個人を特定できる項目は最初からスキーマに持たない（匿名投稿のみ）。
 *  - PII自動フィルタは決定論的な正規表現マッチのみ（AI判定・あいまい推測はしない＝捏造ゼロと同根）。
 *    フィルタは「自動承認」や「自動却下」を一切行わない。検知したら'flagged'にして人間の目を
 *    必ず通す（フィルタが見逃しても人間が最終防波堤・フィルタが誤検知しても人間が救済できる）。
 */

export type CommunityPostCategory = 'question' | 'support';
export type CommunityPostStatus = 'pending' | 'flagged' | 'approved' | 'rejected';

export const COMMUNITY_POST_BODY_MIN_LENGTH = 10;
export const COMMUNITY_POST_BODY_MAX_LENGTH = 500;

const CATEGORIES: CommunityPostCategory[] = ['question', 'support'];

export function isCommunityPostCategory(value: unknown): value is CommunityPostCategory {
  return typeof value === 'string' && (CATEGORIES as string[]).includes(value);
}

export interface PiiRiskResult {
  flagged: boolean;
  /** 検知理由(複数可)。あいまいな推測はせず、決定論的なパターンにヒットしたものだけを列挙する。 */
  reasons: PiiRiskReason[];
}

export type PiiRiskReason = 'phone-number' | 'email-address' | 'postal-code' | 'sns-handle';

const PHONE_PATTERN = /(0\d{1,4}[-‐]\d{1,4}[-‐]\d{3,4})|(\b0\d{9,10}\b)/;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const POSTAL_CODE_PATTERN = /\b\d{3}-\d{4}\b/;
const SNS_HANDLE_PATTERN = /(line\.me|LINE\s*ID|@[a-zA-Z0-9_]{4,})/i;

/**
 * 投稿本文の個人情報リスクを判定する（純粋関数・決定論）。
 * 電話番号/メールアドレス/郵便番号/SNS・LINE等の連絡先ハンドルの4パターンのみを機械的に検査する。
 * 検知しても投稿自体は拒否しない（呼び出し側がstatus='flagged'にして人間の確認を必須にする）。
 */
export function detectPiiRisk(body: string): PiiRiskResult {
  const reasons: PiiRiskReason[] = [];
  if (PHONE_PATTERN.test(body)) reasons.push('phone-number');
  if (EMAIL_PATTERN.test(body)) reasons.push('email-address');
  if (POSTAL_CODE_PATTERN.test(body)) reasons.push('postal-code');
  if (SNS_HANDLE_PATTERN.test(body)) reasons.push('sns-handle');
  return { flagged: reasons.length > 0, reasons };
}

export interface CommunityPostSubmission {
  category: CommunityPostCategory;
  body: string;
}

export interface CommunityPostValidationResult {
  valid: boolean;
  reason?: string;
}

/** 投稿内容の構造的バリデーション(長さ・カテゴリのみ。PIIフィルタは別関数=detectPiiRisk)。 */
export function validateCommunityPostSubmission(input: unknown): CommunityPostValidationResult {
  if (!input || typeof input !== 'object') return { valid: false, reason: '入力が不正です。' };
  const obj = input as Record<string, unknown>;

  if (!isCommunityPostCategory(obj.category)) {
    return { valid: false, reason: 'カテゴリが不正です。' };
  }

  const body = obj.body;
  if (typeof body !== 'string') {
    return { valid: false, reason: '本文を入力してください。' };
  }
  const trimmed = body.trim();
  if (trimmed.length < COMMUNITY_POST_BODY_MIN_LENGTH) {
    return { valid: false, reason: `本文は${COMMUNITY_POST_BODY_MIN_LENGTH}文字以上で入力してください。` };
  }
  if (trimmed.length > COMMUNITY_POST_BODY_MAX_LENGTH) {
    return { valid: false, reason: `本文は${COMMUNITY_POST_BODY_MAX_LENGTH}文字以内で入力してください。` };
  }

  return { valid: true };
}

/**
 * モデレーション状態遷移の許可判定（単一ソース・juku-reviews.tsのcanTransitionReviewStatusと同型）。
 * pending/flagged → approved/rejected のみ許可。approved⇄rejectedは訂正として許可。
 * pending/flaggedへの逆戻りは許可しない。
 */
export function canTransitionCommunityPostStatus(from: CommunityPostStatus, to: CommunityPostStatus): boolean {
  if (from === to) return false;
  if (to === 'pending' || to === 'flagged') return false;
  if (from === 'pending' || from === 'flagged') return to === 'approved' || to === 'rejected';
  return (from === 'approved' && to === 'rejected') || (from === 'rejected' && to === 'approved');
}

/** 公開表示してよい投稿か（承認済みのみ）。 */
export function isPubliclyVisibleCommunityPost(status: CommunityPostStatus): boolean {
  return status === 'approved';
}
