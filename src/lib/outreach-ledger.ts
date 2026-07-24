/**
 * アウトリーチ追撃（フォローアップ）システムの純関数群（AA-1）。
 *
 * 背景（[[fable5-fullaccel-backlog-2026-07]] TIER AA-1）：コールドアウトリーチの期待値の大半は
 * 2-3通目にある（1通目無反応→丁寧な追撃で返信率はおおむね倍増）。台帳自体はこのモジュールでは
 * 構築しない（Gmail MCPは対話ターン内でしか叩けないため、loopが `gmail_search q="in:sent"` 等で
 * 実測し、その結果を data/outreach-ledger.json に人手 or loop手動で反映する運用＝
 * scripts/weekly-kpi-report.ts と同じ「手動入力＋純関数で判定」パターンを踏襲）。
 * ここは「その台帳から誰に追撃すべきかを決定論で判定する」部分のみを担う（サーバー/CI/スクリプト共通）。
 */

/** 追撃システムが扱うアウトリーチのレーン（送信先の性質）。 */
export type OutreachLane = 'b2b-saas' | 'chihoshi' | 'npo' | 'mutual-link' | 'kyoiku-i';

/** 台帳エントリの状態。人間の判断（👤が読んで分類）で更新される。 */
export type OutreachStatus =
  | 'awaiting' // 送信済み・人間の返信なし（自動返信のみ含む）
  | 'replied' // 人間からの返信あり（電話取次等を含む）
  | 'meeting' // 商談化・会話が進行中（追撃対象から除外）
  | 'declined' // 明示的な お断り／不要の返信（追撃対象から除外）
  | 'closed'; // その他の理由で追撃を打ち切り済み

export interface OutreachEntry {
  id: string;
  org: string;
  lane: OutreachLane;
  /** どのバックログタスクで送信したか（例: 'W-1', 'X-2'）。任意。 */
  sourceTaskId?: string;
  /** 初回送信日（ISO 'YYYY-MM-DD'）。 */
  sentDate: string;
  /** 直近のアクション日（初回送信 or 直近の追撃送信のうち新しい方）。未指定なら sentDate を使う。 */
  lastContactDate?: string;
  status: OutreachStatus;
  /** これまでに送った追撃の回数（0=まだ追撃していない）。 */
  followupCount: number;
  /** Gmail threadId（任意・追跡用）。 */
  threadId?: string;
  note?: string;
}

export interface FollowupCandidate {
  entry: OutreachEntry;
  daysSinceLastContact: number;
}

export interface FollowupOptions {
  /** 最短で追撃してよい経過日数（既定7日＝AA-1仕様の下限）。 */
  minDays?: number;
  /** これ以上の追撃は行わない最大回数（既定1＝しつこくしない）。 */
  maxFollowups?: number;
}

const DAY_MS = 86_400_000;

/** 'YYYY-MM-DD' 同士の経過日数（後者-前者・小数切り捨て）。不正な日付は NaN。 */
export function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00Z`).getTime();
  const to = new Date(`${toISO}T00:00:00Z`).getTime();
  if (Number.isNaN(from) || Number.isNaN(to)) return NaN;
  return Math.floor((to - from) / DAY_MS);
}

/**
 * 台帳から「今、追撃すべき」候補を決定論で抽出する。
 * 条件: status==='awaiting' かつ 直近アクションからの経過日数が minDays 以上 かつ
 *       追撃回数が maxFollowups 未満。経過日数が長い順（最も待たせている相手が先頭）。
 */
export function computeFollowupCandidates(
  entries: OutreachEntry[],
  todayISO: string,
  options: FollowupOptions = {}
): FollowupCandidate[] {
  const minDays = options.minDays ?? 7;
  const maxFollowups = options.maxFollowups ?? 1;

  const candidates: FollowupCandidate[] = [];
  for (const entry of entries) {
    if (entry.status !== 'awaiting') continue;
    if (entry.followupCount >= maxFollowups) continue;
    const anchor = entry.lastContactDate ?? entry.sentDate;
    const days = daysBetween(anchor, todayISO);
    if (!Number.isFinite(days) || days < minDays) continue;
    candidates.push({ entry, daysSinceLastContact: days });
  }

  return candidates.sort((a, b) => b.daysSinceLastContact - a.daysSinceLastContact);
}

/** レーン別の1行サマリ（レポート表示用・件数のみの集計）。 */
export function summarizeByLane(entries: OutreachEntry[]): Record<OutreachLane, number> {
  const base: Record<OutreachLane, number> = {
    'b2b-saas': 0,
    chihoshi: 0,
    npo: 0,
    'mutual-link': 0,
    'kyoiku-i': 0,
  };
  for (const e of entries) base[e.lane] += 1;
  return base;
}
