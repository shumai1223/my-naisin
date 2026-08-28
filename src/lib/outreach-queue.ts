/**
 * X'-1 送信キュー（👤が実際に送信ボタンを押すための統合キュー）。
 *
 * 背景（[[fable5-fullaccel-backlog-2026-07]] TIER X 全面再設計）: 被リンク獲得のボトルネックは
 * 「下書きが足りない」ことではなく「135件がdocs各所に散在し👤が拾いにくい」こと。このモジュールは
 * `data/outreach-queue.json` を読み、1件30秒で送れる形に整形して表示するための純関数のみを提供する。
 * loopは1件も送信しない（[[gate-decisions-2026-07-28]]の2段階レビューを維持）。
 *
 * 送信済みになった項目は `data/outreach-ledger.json`（src/lib/outreach-ledger.ts）側へ移し、
 * このキューからは除外する（このファイルは「まだ送っていない」もののみを扱う）。
 */
import type { OutreachLane, ReviewTier } from './outreach-ledger';
import { LANE_DEFAULT_REVIEW_TIER } from './outreach-ledger';

export type QueueChannel = 'line' | 'email' | 'form';
/** 'candidate' = T-C1連絡経路判別済みだが件名・本文の下書きが未作成(まだ送信キューに乗らない)。 */
export type QueueStatus = 'queued' | 'excluded' | 'candidate';
/** T-C1連絡経路判別ルールの結果。'unknown'は送信対象外(推測でb2b/consumerを付けない)。 */
export type ContactClass = 'b2b' | 'consumer' | 'unknown';
/**
 * form channelの窓口が事業提携・データ利用等の相談を受け付けるか(Cowork第1弾実測・2026-08-14)。
 * `contactClass='b2b'`は「法人向け窓口が存在する」ことしか保証せず、「教科書見本請求専用」「取材のみ」
 * のような目的限定窓口も同じくb2bに分類されうる。この2軸は独立(contactClassより細かい判定)。
 * 'unknown'は未判定(送信可否の判断には使わない・Cowork側の目視判定に委ねる)。
 */
export type FormPurpose = 'accepts-b2b' | 'purpose-restricted' | 'unknown';

export interface QueueEntry {
  id: string;
  org: string;
  lane: OutreachLane;
  channel: QueueChannel;
  /** メールアドレス、フォームURL、またはLINE友だち追加URL。除外エントリでは未確認のことがある。 */
  contact?: string;
  subject?: string;
  body?: string;
  reviewTier?: ReviewTier;
  status: QueueStatus;
  /** status==='excluded' の場合の理由（例: '電話のみで送れない'）。 */
  excludeReason?: string;
  /** 出典間の食い違い等、補足が必要な場合の任意メモ。 */
  note?: string;
  sourceDoc: string;
  addedAt: string;
  /** Gmail下書きを作成済みの場合のdraftId(gmail_create_draftの戻り値)。二重下書き作成を防ぐための目印。 */
  draftId?: string;
  /** 下書き作成日時(ISO)。draftId同様、二重作成防止用。 */
  draftedAt?: string;
  /** T-C1: 実際にサイトを開いて判別した連絡経路の性質。'unknown'は送信対象外。 */
  contactClass?: ContactClass;
  /** contactClassの判定根拠(ページ内の文言・フォーム必須項目名等)。空のまま「検証済み」に数えない。 */
  evidence?: string;
  /** contactClassを確認した日付(YYYY-MM-DD)。 */
  verifiedAt?: string;
  /**
   * channel==='form'の場合のみ有効: この窓口が事業提携・データ利用等の相談を受け付けるか。
   * evidenceを書く際に同時に判定して記録する(Cowork第1弾実測: スキップ11社中6社がこの型の
   * 判定漏れだった。事前判定でCoworkの試行を約37%節約できる見込み)。
   */
  formPurpose?: FormPurpose;
}

/** チャンネルの優先順位（👤の手間が小さい順）。X'-1本文の実測に基づく: line最優先→email→form。 */
const CHANNEL_PRIORITY: Record<QueueChannel, number> = { line: 0, email: 1, form: 2 };

/** レーンの優先順位（リンク価値の目安）。X'-3の簡易版：.lg.jp(kyoiku-i)を最優先とする。 */
const LANE_PRIORITY: Record<OutreachLane, number> = {
  'kyoiku-i': 0,
  'b2b-saas': 1,
  chihoshi: 2,
  media: 2, // chihoshi(地方紙)と同格の対外発信メディア枠
  npo: 3,
  'mutual-link': 4,
};

/** キュー済み(status='queued')のみを、チャンネル優先→レーン優先の順で並べる(X'-3の暫定版・本格スコアリングは別途)。 */
export function sortQueueByPriority(entries: QueueEntry[]): QueueEntry[] {
  return entries
    .filter((e) => e.status === 'queued')
    .slice()
    .sort((a, b) => {
      const c = CHANNEL_PRIORITY[a.channel] - CHANNEL_PRIORITY[b.channel];
      if (c !== 0) return c;
      return LANE_PRIORITY[a.lane] - LANE_PRIORITY[b.lane];
    });
}

/** レーン×チャンネルの件数集計(レポート表示用)。 */
export function summarizeQueue(entries: QueueEntry[]): {
  queuedByChannel: Record<QueueChannel, number>;
  queuedByLane: Partial<Record<OutreachLane, number>>;
  excludedCount: number;
  /** status==='candidate'(判別済み・下書き未作成)の件数。queuedByChannel/queuedByLaneには含めない。 */
  candidateCount: number;
  total: number;
} {
  const queuedByChannel: Record<QueueChannel, number> = { line: 0, email: 0, form: 0 };
  const queuedByLane: Partial<Record<OutreachLane, number>> = {};
  let excludedCount = 0;
  let candidateCount = 0;
  for (const e of entries) {
    if (e.status === 'excluded') {
      excludedCount += 1;
      continue;
    }
    if (e.status === 'candidate') {
      candidateCount += 1;
      continue;
    }
    queuedByChannel[e.channel] += 1;
    queuedByLane[e.lane] = (queuedByLane[e.lane] ?? 0) + 1;
  }
  return { queuedByChannel, queuedByLane, excludedCount, candidateCount, total: entries.length };
}

/** エントリのレビュー区分(個別指定 > レーン既定値)。outreach-ledgerのreviewTierOfと同じ規約。 */
export function queueReviewTierOf(entry: Pick<QueueEntry, 'lane' | 'reviewTier'>): ReviewTier {
  return entry.reviewTier ?? LANE_DEFAULT_REVIEW_TIER[entry.lane];
}
