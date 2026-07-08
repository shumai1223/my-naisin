/**
 * 塾口コミ（juku_reviews）のD1永続化＝TIER R-1第2弾。leads-db.ts/stats-db.tsと同じ安全設計。
 *
 * 安全設計：
 *  - D1バインディング `LEADS_DB`（既存・稼働中）が無ければ完全no-op。
 *  - juku_reviewsテーブル自体は migrations/0008_create_juku_reviews.sql が定義するが
 *    2026-07-09時点で未適用（👤監督付き適用待ち）。テーブルが無くても例外を握り潰しno-opにする。
 *  - 公開読み出しは常に status='approved' のみ（モデレーション未処理・却下は絶対に外へ出さない）。
 *  - 投稿UI（フォームコンポーネント）・モデレーション管理UIはこの第2弾ではまだ実装しない
 *    （API単体では公開ページから呼ばれないため、適用後もdeployしただけでは実害/実投稿は発生しない）。
 */
import { validateReviewSubmission, type ReviewStatus, canTransitionReviewStatus } from '@/lib/juku-reviews';
import type { AffiliateId } from '@/lib/affiliates';

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
interface MinimalD1 {
  prepare(query: string): D1PreparedStatement;
}

async function getReviewsDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

/**
 * 口コミを投稿する（初期status='pending'固定・モデレーション必須）。
 * バリデーション不合格・バインディング未設定・テーブル未作成なら false。
 */
export async function insertJukuReview(input: unknown): Promise<boolean> {
  const result = validateReviewSubmission(input);
  if (!result.valid) return false;
  const obj = input as { jukuId: AffiliateId; rating: number; comment: string; prefectureCode?: string };

  try {
    const db = await getReviewsDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO juku_reviews (juku_id, rating, comment, prefecture_code, status, created_at)
         VALUES (?, ?, ?, ?, 'pending', datetime('now'))`
      )
      .bind(obj.jukuId, obj.rating, obj.comment.trim(), obj.prefectureCode ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('insertJukuReview skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface ApprovedReviewRow {
  id: number;
  juku_id: string;
  rating: number;
  comment: string;
  prefecture_code: string | null;
  created_at: string;
}

/**
 * 承認済み（status='approved'）の口コミのみを返す（公開読み出し）。
 * バインディング未設定・テーブル未作成・0件なら空配列。
 */
export async function getApprovedReviews(jukuId: AffiliateId, limit = 20): Promise<ApprovedReviewRow[]> {
  try {
    const db = await getReviewsDb();
    if (!db) return [];
    const cappedLimit = Math.max(1, Math.min(100, Math.round(limit)));
    const { results } = await db
      .prepare(
        `SELECT id, juku_id, rating, comment, prefecture_code, created_at
         FROM juku_reviews WHERE juku_id = ? AND status = 'approved'
         ORDER BY id DESC LIMIT ?`
      )
      .bind(jukuId, cappedLimit)
      .all<ApprovedReviewRow>();
    return results ?? [];
  } catch (err) {
    console.error('getApprovedReviews skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface ReviewRow extends ApprovedReviewRow {
  status: ReviewStatus;
  moderator_note: string | null;
}

/**
 * 指定ステータスの口コミを一覧取得する（管理画面用・全ステータス対象）。
 * バインディング未設定・テーブル未作成・0件なら空配列。
 */
export async function getReviewsByStatus(status: ReviewStatus, limit = 50): Promise<ReviewRow[]> {
  try {
    const db = await getReviewsDb();
    if (!db) return [];
    const cappedLimit = Math.max(1, Math.min(200, Math.round(limit)));
    const { results } = await db
      .prepare(
        `SELECT id, juku_id, rating, comment, prefecture_code, status, moderator_note, created_at
         FROM juku_reviews WHERE status = ?
         ORDER BY id DESC LIMIT ?`
      )
      .bind(status, cappedLimit)
      .all<ReviewRow>();
    return results ?? [];
  } catch (err) {
    console.error('getReviewsByStatus skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * モデレーション操作：状態を遷移する。canTransitionReviewStatusで許可されない遷移はfalse
 * （現在の状態を読んでから検査するため、DB未接続時はfalseになる＝安全側）。
 */
export async function moderateJukuReview(id: number, currentStatus: ReviewStatus, nextStatus: ReviewStatus, moderatorNote?: string): Promise<boolean> {
  if (!canTransitionReviewStatus(currentStatus, nextStatus)) return false;
  try {
    const db = await getReviewsDb();
    if (!db) return false;
    await db
      .prepare(`UPDATE juku_reviews SET status = ?, moderator_note = ?, moderated_at = datetime('now') WHERE id = ?`)
      .bind(nextStatus, moderatorNote ?? null, id)
      .run();
    return true;
  } catch (err) {
    console.error('moderateJukuReview skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}
