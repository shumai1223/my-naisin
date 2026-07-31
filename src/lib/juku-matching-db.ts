/**
 * 直接マッチング市場バックエンド試作（Λ-7・Ω-6実行層・build-not-launch）のD1層。
 *
 * なぜ：アフィリエイト経由送客（juku-match.ts・第三者ASP）はEPCが構造的に低い。
 * 直接提携塾への送客なら自社でtake-rateを設定でき、非線形に収益効率を上げられる
 * （[[fable5-fullaccel-backlog-2026-07]]のΩ-6参照）。本ファイルはその第一歩＝
 * スキーマとCRUD・成果計上ロジックのみ。塾管理画面・招待フロー・実際の送客ボタンは
 * 後続タスクで積む（build-not-launch・フラグoffで本番投入しない）。
 *
 * 安全設計（juku-saas-db.tsと同方針）：
 *  - 名簿と同じ `LEADS_DB` バインディングを共用。バインディングが無ければ全no-op。
 *  - 個人情報は一切持たない（studentRefは匿名の参照キーのみ）。
 *  - 例外は握りつぶし、呼び出し側の可用性に影響させない。
 *
 * 点火手順（本人操作・👤専用・build-not-launchのため現時点では未実行）：
 *  wrangler d1 execute my-naishin-leads --remote --file=migrations/0013_create_juku_matching.sql
 *  wrangler d1 execute my-naishin-leads --remote --file=migrations/0015_add_juku_partner_invite_token.sql
 */
import { hashInviteToken, generateInviteTokenPlaintext } from '@/lib/juku-saas-db';

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

async function getDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

export type JukuPartnerStatus = 'pending' | 'active' | 'suspended';
export type JukuReferralStatus = 'sent' | 'contacted' | 'converted' | 'declined';
export type JukuCommissionStatus = 'pending' | 'invoiced' | 'paid';

/** take-rateの妥当域（0〜100%）。呼び出し側のミスでbpsの桁を間違えた場合の防波堤。 */
export function isValidCommissionRateBps(bps: number): boolean {
  return Number.isInteger(bps) && bps >= 0 && bps <= 10000;
}

/**
 * 成約金額(円)とtake-rate(bps)から取り分(円)を計算する（純粋関数・四捨五入）。
 * 例: computeCommissionYen(50000, 1000) === 5000（50,000円の10%）。
 */
export function computeCommissionYen(grossAmountYen: number, commissionRateBps: number): number {
  if (!Number.isFinite(grossAmountYen) || grossAmountYen < 0) return 0;
  if (!isValidCommissionRateBps(commissionRateBps)) return 0;
  return Math.round((grossAmountYen * commissionRateBps) / 10000);
}

/** 'YYYY-MM'形式の請求月ラベルを妥当性チェックする（純粋関数）。 */
export function isValidBillingPeriod(period: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(period);
}

export interface JukuPartnerRecord {
  id: number;
  name: string;
  commissionRateBps: number;
  status: JukuPartnerStatus;
}

/** 直接マッチング提携塾を1件登録する。バインディング未設定・入力不正はnull。 */
export async function createJukuPartner(name: string, commissionRateBps: number): Promise<number | null> {
  const trimmed = name.trim().slice(0, 120);
  if (!trimmed || !isValidCommissionRateBps(commissionRateBps)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const result = await db
      .prepare(
        `INSERT INTO juku_partners (name, commission_rate_bps, status, created_at) VALUES (?, ?, 'pending', datetime('now'))`
      )
      .bind(trimmed, commissionRateBps)
      .run();
    const id = (result as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    return typeof id === 'number' ? id : null;
  } catch (err) {
    console.error('createJukuPartner skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/** 提携塾を1件取得する。バインディング未設定・未発見はnull。 */
export async function getJukuPartner(jukuPartnerId: number): Promise<JukuPartnerRecord | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const q = await db
      .prepare(`SELECT id, name, commission_rate_bps, status FROM juku_partners WHERE id = ? LIMIT 1`)
      .bind(jukuPartnerId)
      .all<{ id: number; name: string; commission_rate_bps: number; status: string }>();
    const row = q.results?.[0];
    if (!row) return null;
    return { id: row.id, name: row.name, commissionRateBps: row.commission_rate_bps, status: row.status as JukuPartnerStatus };
  } catch (err) {
    console.error('getJukuPartner skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * 送客ログを1件記録する（PIIは持たない・studentRefは匿名の参照キーのみ）。
 * バインディング未設定・入力不正はnull。
 */
export async function recordReferral(input: {
  jukuPartnerId: number;
  studentRef: string;
  prefectureCode?: string;
  format?: 'online' | 'in-person';
}): Promise<number | null> {
  const studentRef = input.studentRef.trim().slice(0, 80);
  if (!studentRef || !Number.isFinite(input.jukuPartnerId)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const result = await db
      .prepare(
        `INSERT INTO juku_referrals (juku_partner_id, student_ref, prefecture_code, format, status, sent_at)
         VALUES (?, ?, ?, ?, 'sent', datetime('now'))`
      )
      .bind(input.jukuPartnerId, studentRef, input.prefectureCode?.trim().slice(0, 40) || null, input.format ?? null)
      .run();
    const id = (result as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    return typeof id === 'number' ? id : null;
  } catch (err) {
    console.error('recordReferral skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/** 送客の状態を更新する（例: 塾側が成約報告をしたら'converted'へ）。バインディング未設定はfalse。 */
export async function updateReferralStatus(referralId: number, status: JukuReferralStatus): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(`UPDATE juku_referrals SET status = ?, status_updated_at = datetime('now') WHERE id = ?`)
      .bind(status, referralId)
      .run();
    return true;
  } catch (err) {
    console.error('updateReferralStatus skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface RecordCommissionResult {
  commissionEntryId: number;
  commissionAmountYen: number;
}

/**
 * 送客の成約を成果計上する。取り分(円)は該当送客の提携塾のcommission_rate_bpsから
 * このモジュール自身が計算する（呼び出し側にレートを再入力させない＝単一ソース）。
 * 送客・提携塾が見つからない、金額/請求月が不正な場合はnull。
 */
export async function recordCommissionEntry(input: {
  referralId: number;
  grossAmountYen: number;
  billingPeriod: string;
}): Promise<RecordCommissionResult | null> {
  if (!Number.isFinite(input.grossAmountYen) || input.grossAmountYen < 0) return null;
  if (!isValidBillingPeriod(input.billingPeriod)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const referralQuery = await db
      .prepare(`SELECT juku_partner_id FROM juku_referrals WHERE id = ? LIMIT 1`)
      .bind(input.referralId)
      .all<{ juku_partner_id: number }>();
    const partnerId = referralQuery.results?.[0]?.juku_partner_id;
    if (typeof partnerId !== 'number') return null;

    const partner = await getJukuPartner(partnerId);
    if (!partner) return null;

    const commissionAmountYen = computeCommissionYen(input.grossAmountYen, partner.commissionRateBps);
    const result = await db
      .prepare(
        `INSERT INTO juku_commission_entries
           (referral_id, gross_amount_yen, commission_amount_yen, billing_period, status, created_at)
         VALUES (?, ?, ?, ?, 'pending', datetime('now'))`
      )
      .bind(input.referralId, input.grossAmountYen, commissionAmountYen, input.billingPeriod)
      .run();
    const commissionEntryId = (result as { meta?: { last_row_id?: number } })?.meta?.last_row_id;
    if (typeof commissionEntryId !== 'number') return null;

    await updateReferralStatus(input.referralId, 'converted');
    return { commissionEntryId, commissionAmountYen };
  } catch (err) {
    console.error('recordCommissionEntry skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * 提携塾に招待トークンを発行する（招待フロー・Λ-7残作業）。juku-saas-db.tsのcreateJukuAccountと
 * 同じ設計＝平文は保存せずSHA-256ハッシュのみをDBに書く。発行するたびに古いトークンは無効化される
 * （1塾につき有効なトークンは常に最新の1つ）。バインディング未設定・提携塾が存在しなければnull。
 */
export async function issuePartnerInviteToken(jukuPartnerId: number): Promise<string | null> {
  if (!Number.isFinite(jukuPartnerId)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const inviteToken = generateInviteTokenPlaintext();
    const hash = await hashInviteToken(inviteToken);
    await db.prepare(`UPDATE juku_partners SET invite_token_hash = ? WHERE id = ?`).bind(hash, jukuPartnerId).run();
    return inviteToken;
  } catch (err) {
    console.error('issuePartnerInviteToken skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * 招待トークン（平文）から提携塾アカウントを引く（招待フロー・塾側ログイン）。
 * 見つからない・トークン未発行はnull。見つかった場合はlast_used_atを更新する（失敗は無視）。
 */
export async function verifyPartnerInviteToken(plaintext: string): Promise<JukuPartnerRecord | null> {
  if (!plaintext) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const hash = await hashInviteToken(plaintext);
    const q = await db
      .prepare(`SELECT id, name, commission_rate_bps, status FROM juku_partners WHERE invite_token_hash = ? LIMIT 1`)
      .bind(hash)
      .all<{ id: number; name: string; commission_rate_bps: number; status: string }>();
    const row = q.results?.[0];
    if (!row) return null;
    try {
      await db.prepare(`UPDATE juku_partners SET last_used_at = datetime('now') WHERE id = ?`).bind(row.id).run();
    } catch {
      /* アクセス実績更新の失敗は認証結果に影響させない */
    }
    return { id: row.id, name: row.name, commissionRateBps: row.commission_rate_bps, status: row.status as JukuPartnerStatus };
  } catch (err) {
    console.error('verifyPartnerInviteToken skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}

/** 提携塾の一覧（新しい順）。管理画面(admin/juku-matching)の塾一覧・作成フォーム用。 */
export async function listJukuPartners(): Promise<JukuPartnerRecord[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const q = await db
      .prepare(`SELECT id, name, commission_rate_bps, status FROM juku_partners ORDER BY id DESC`)
      .all<{ id: number; name: string; commission_rate_bps: number; status: string }>();
    return (q.results ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      commissionRateBps: r.commission_rate_bps,
      status: r.status as JukuPartnerStatus,
    }));
  } catch (err) {
    console.error('listJukuPartners skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface ReferralWithPartner {
  id: number;
  jukuPartnerId: number;
  jukuPartnerName: string;
  studentRef: string;
  prefectureCode: string | null;
  format: 'online' | 'in-person' | null;
  status: JukuReferralStatus;
  sentAt: string;
}

/**
 * 送客ログの一覧(提携塾名を結合・新しい順)。管理画面(admin/juku-matching)の
 * 「送客受信・成約報告UI」用（招待フロー未実装のため、現時点では塾側でなく管理者が代行操作する）。
 * statusを指定すればその状態のみに絞る（例: 'sent'/'contacted'=未処理分だけ表示）。
 */
export async function listReferrals(status?: JukuReferralStatus, limit = 100): Promise<ReferralWithPartner[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const base = `SELECT r.id, r.juku_partner_id, p.name AS partner_name, r.student_ref, r.prefecture_code, r.format, r.status, r.sent_at
       FROM juku_referrals r JOIN juku_partners p ON p.id = r.juku_partner_id`;
    const q = status
      ? await db
          .prepare(`${base} WHERE r.status = ? ORDER BY r.id DESC LIMIT ?`)
          .bind(status, limit)
          .all<{
            id: number;
            juku_partner_id: number;
            partner_name: string;
            student_ref: string;
            prefecture_code: string | null;
            format: string | null;
            status: string;
            sent_at: string;
          }>()
      : await db
          .prepare(`${base} ORDER BY r.id DESC LIMIT ?`)
          .bind(limit)
          .all<{
            id: number;
            juku_partner_id: number;
            partner_name: string;
            student_ref: string;
            prefecture_code: string | null;
            format: string | null;
            status: string;
            sent_at: string;
          }>();
    return (q.results ?? []).map((r) => ({
      id: r.id,
      jukuPartnerId: r.juku_partner_id,
      jukuPartnerName: r.partner_name,
      studentRef: r.student_ref,
      prefectureCode: r.prefecture_code,
      format: r.format as 'online' | 'in-person' | null,
      status: r.status as JukuReferralStatus,
      sentAt: r.sent_at,
    }));
  } catch (err) {
    console.error('listReferrals skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface PartnerOwnReferral {
  id: number;
  studentRef: string;
  prefectureCode: string | null;
  format: 'online' | 'in-person' | null;
  status: JukuReferralStatus;
  sentAt: string;
}

/**
 * 指定した提携塾自身の送客ログ一覧(新しい順)。招待トークンでログインした塾側の
 * ダッシュボード(juku/matching/dashboard)専用の読み取り専用ビュー(他塾のデータは絶対に混ざらない・
 * WHERE juku_partner_id = ?で厳格にスコープする)。ステータス更新・成約報告は
 * この画面からはできない(現時点ではadmin/juku-matchingでの代行操作のみ・Λ-7残作業)。
 */
export async function listReferralsForPartner(jukuPartnerId: number, limit = 100): Promise<PartnerOwnReferral[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const q = await db
      .prepare(
        `SELECT id, student_ref, prefecture_code, format, status, sent_at
         FROM juku_referrals WHERE juku_partner_id = ?
         ORDER BY id DESC LIMIT ?`
      )
      .bind(jukuPartnerId, limit)
      .all<{
        id: number;
        student_ref: string;
        prefecture_code: string | null;
        format: string | null;
        status: string;
        sent_at: string;
      }>();
    return (q.results ?? []).map((r) => ({
      id: r.id,
      studentRef: r.student_ref,
      prefectureCode: r.prefecture_code,
      format: r.format as 'online' | 'in-person' | null,
      status: r.status as JukuReferralStatus,
      sentAt: r.sent_at,
    }));
  } catch (err) {
    console.error('listReferralsForPartner skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}

export interface CommissionLedgerEntry {
  id: number;
  referralId: number;
  grossAmountYen: number;
  commissionAmountYen: number;
  billingPeriod: string;
  status: JukuCommissionStatus;
}

/** 指定した提携塾の成果計上台帳（新しい順）。バインディング未設定なら空。 */
export async function getPartnerLedger(jukuPartnerId: number): Promise<CommissionLedgerEntry[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const q = await db
      .prepare(
        `SELECT ce.id, ce.referral_id, ce.gross_amount_yen, ce.commission_amount_yen, ce.billing_period, ce.status
         FROM juku_commission_entries ce
         JOIN juku_referrals r ON r.id = ce.referral_id
         WHERE r.juku_partner_id = ?
         ORDER BY ce.id DESC`
      )
      .bind(jukuPartnerId)
      .all<{
        id: number;
        referral_id: number;
        gross_amount_yen: number;
        commission_amount_yen: number;
        billing_period: string;
        status: string;
      }>();
    return (q.results ?? []).map((r) => ({
      id: r.id,
      referralId: r.referral_id,
      grossAmountYen: r.gross_amount_yen,
      commissionAmountYen: r.commission_amount_yen,
      billingPeriod: r.billing_period,
      status: r.status as JukuCommissionStatus,
    }));
  } catch (err) {
    console.error('getPartnerLedger skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
