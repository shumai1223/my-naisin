/**
 * 保護者コミュニティ投稿（community_posts）のD1永続化＝Λ-14第2弾。juku-reviews-db.tsと同じ安全設計。
 *
 * 安全設計：
 *  - D1バインディング `LEADS_DB`（既存・稼働中）が無ければ完全no-op。
 *  - community_postsテーブル自体は migrations/0014_create_community_posts.sql が定義するが
 *    2026-08-01時点で未適用（👤監督付き適用待ち）。テーブルが無くても例外を握り潰しno-opにする。
 *  - 公開読み出しは常に status='approved' のみ（モデレーション未処理・却下は絶対に外へ出さない）。
 *  - 投稿UI（フォームコンポーネント）はこの第2弾ではまだ実装しない（運営方針・公開判断は👤・
 *    [[fable5-fullaccel-backlog-2026-07]]Ω-17参照）。モデレーション管理UIのみ第3弾で追加する。
 */
import {
  validateCommunityPostSubmission,
  detectPiiRisk,
  type CommunityPostStatus,
  canTransitionCommunityPostStatus,
} from '@/lib/community-posts';

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

async function getCommunityDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

export interface InsertCommunityPostResult {
  id: number;
  status: CommunityPostStatus;
  piiRiskReasons: string[];
}

/**
 * 投稿を作成する（初期status='pending'または'flagged'固定・モデレーション必須）。
 * detectPiiRisk()の検知結果に応じてstatusを自動で決めるが、承認/却下は一切自動化しない
 * （フィルタが検知してもしなくても、公開には必ず人間のmoderateCommunityPost()操作が要る）。
 * バリデーション不合格・バインディング未設定・テーブル未作成はnull。
 */
export async function insertCommunityPost(input: unknown): Promise<InsertCommunityPostResult | null> {
  const result = validateCommunityPostSubmission(input);
  if (!result.valid) return null;
  const obj = input as { category: 'question' | 'support'; body: string };
  const trimmedBody = obj.body.trim();
  const piiRisk = detectPiiRisk(trimmedBody);
  const status: CommunityPostStatus = piiRisk.flagged ? 'flagged' : 'pending';

  try {
    const db = await getCommunityDb();
    if (!db) return null;
    const insertResult = await db
      .prepare(
        `INSERT INTO community_posts (category, body, status, pii_risk_reasons, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .bind(obj.category, trimmedBody, status, piiRisk.reasons.join(','))
      .run();
    const id = (insertResult as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    if (typeof id !== 'number') return null;
    return { id, status, piiRiskReasons: piiRisk.reasons };
  } catch (err) {
    console.error('insertCommunityPost skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

export interface ApprovedCommunityPostRow {
  id: number;
  category: string;
  body: string;
  created_at: string;
}

/** 承認済み（status='approved'）の投稿のみを返す（公開読み出し）。 */
export async function getApprovedCommunityPosts(limit = 20): Promise<ApprovedCommunityPostRow[]> {
  try {
    const db = await getCommunityDb();
    if (!db) return [];
    const cappedLimit = Math.max(1, Math.min(100, Math.round(limit)));
    const { results } = await db
      .prepare(
        `SELECT id, category, body, created_at FROM community_posts WHERE status = 'approved'
         ORDER BY id DESC LIMIT ?`
      )
      .bind(cappedLimit)
      .all<ApprovedCommunityPostRow>();
    return results ?? [];
  } catch (err) {
    console.error('getApprovedCommunityPosts skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface CommunityPostRow extends ApprovedCommunityPostRow {
  status: CommunityPostStatus;
  pii_risk_reasons: string;
}

/** 指定ステータスの投稿を一覧取得する（管理画面用・全ステータス対象）。 */
export async function getCommunityPostsByStatus(status: CommunityPostStatus, limit = 50): Promise<CommunityPostRow[]> {
  try {
    const db = await getCommunityDb();
    if (!db) return [];
    const cappedLimit = Math.max(1, Math.min(200, Math.round(limit)));
    const { results } = await db
      .prepare(
        `SELECT id, category, body, status, pii_risk_reasons, created_at
         FROM community_posts WHERE status = ?
         ORDER BY id DESC LIMIT ?`
      )
      .bind(status, cappedLimit)
      .all<CommunityPostRow>();
    return results ?? [];
  } catch (err) {
    console.error('getCommunityPostsByStatus skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * モデレーション操作：状態を遷移する。canTransitionCommunityPostStatusで許可されない遷移はfalse。
 */
export async function moderateCommunityPost(
  id: number,
  currentStatus: CommunityPostStatus,
  nextStatus: CommunityPostStatus
): Promise<boolean> {
  if (!canTransitionCommunityPostStatus(currentStatus, nextStatus)) return false;
  try {
    const db = await getCommunityDb();
    if (!db) return false;
    await db
      .prepare(`UPDATE community_posts SET status = ?, moderated_at = datetime('now') WHERE id = ?`)
      .bind(nextStatus, id)
      .run();
    return true;
  } catch (err) {
    console.error('moderateCommunityPost skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}
