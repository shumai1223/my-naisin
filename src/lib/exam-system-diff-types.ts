// T-N1-0: 年次変化レポート(N1-3差分エンジン・N1-4レポート)が共通で守るべき「正確性の設計」の型契約。
//
// このファイルは差分検出のロジックそのもの(N1-3・未実装。N1-2で前年度データが揃ってから着手)ではなく、
// 差分結果が満たすべき形と、レポート文面が守るべき制約だけを先に固定する。
// 理由: 「網羅した」は証明不可能な主張であり、Y-0憲法と同じ「持っていないものを持っていると言わない」
// 原則をこの商品にも適用するため、実装より先に型で縛る(ops/tasks/T-N1-N4-revenue-ceiling.md N1-0参照)。

// 差分は2値(あり/なし)にしてはならない。取得不能を「変更なし」に丸めるのが最大の事故。
export type DiffStatus = 'changed' | 'unchanged' | 'unverifiable';

export type DetectionMethod = 'machine' | 'manual-source-check';

export interface DiffEntry {
  prefectureCode: string;
  field: string; // 比較対象フィールド名（例: 'maxScore' / 'coreMultiplier'）
  status: DiffStatus;
  previousValue: unknown;
  currentValue: unknown;
  // 1差分1出典（N1-0 ①）。statusが'unverifiable'の場合のみnullを許容する。
  previousSourceUrl: string | null;
  currentSourceUrl: string | null;
  detectionMethod: DetectionMethod;
  // 二重確認（N1-0 ②）。機械検出(machine)のまま公開しない。
  // 別イテレーションで一次ソースを人間可読の形で開いて確認した日付を、機械検出のタイムスタンプとは別フィールドで記録する。
  manuallyVerifiedAt?: string;
  // 検出できない範囲の明記（N1-0 ④）。status==='unverifiable'の場合は必須。
  unverifiableReason?: string;
}

/**
 * DiffEntryが「網羅」を装っていないか（＝unverifiableな項目を隠していないか）を検証する不変条件。
 * - changed/unchangedはsourceUrlが両方揃っていること（1差分1出典）
 * - unverifiableはunverifiableReasonが必須（理由を書かずに握り潰さない）
 * - 手動確認が済んでいない(manuallyVerifiedAt未設定)のmachine検出は「確定した変更」として扱わない設計指針
 *   （呼び出し側で status==='changed' && detectionMethod==='machine' && !manuallyVerifiedAt の項目を
 *   「未確認の変更候補」として区別して表示することを前提にする。本関数はその区別に使う判定を提供する）
 */
export function validateDiffEntry(entry: DiffEntry): string[] {
  const problems: string[] = [];

  if (entry.status === 'unverifiable') {
    if (!entry.unverifiableReason) {
      problems.push(`${entry.prefectureCode}/${entry.field}: unverifiableなのにunverifiableReasonが無い`);
    }
  } else {
    if (!entry.previousSourceUrl) {
      problems.push(`${entry.prefectureCode}/${entry.field}: ${entry.status}なのにpreviousSourceUrlが無い`);
    }
    if (!entry.currentSourceUrl) {
      problems.push(`${entry.prefectureCode}/${entry.field}: ${entry.status}なのにcurrentSourceUrlが無い`);
    }
  }

  return problems;
}

/** 手動での一次ソース再確認が未完了の「変更あり」判定かどうか（レポートで確定扱いしてはいけない項目の判別）。 */
export function isUnconfirmedChange(entry: DiffEntry): boolean {
  return entry.status === 'changed' && entry.detectionMethod === 'machine' && !entry.manuallyVerifiedAt;
}

// レポート文面(N1-4以降)がこの語を含んではならない。「網羅」「漏れなし」等の証明不可能な主張の禁止(N1-0本文)。
export const OVERCLAIM_BANNED_PHRASES = [
  '網羅',
  '漏れなく',
  '漏れはありません',
  '漏れがありません',
  '全県すべて確認',
  '全都道府県を確認しました',
  'すべての変更を検出',
  '完全に把握',
] as const;

/** 与えられたテキストに「網羅」を主張する禁止表現が含まれていれば、その表現の一覧を返す（空配列＝安全）。 */
export function findOverclaimPhrases(text: string): string[] {
  return OVERCLAIM_BANNED_PHRASES.filter((phrase) => text.includes(phrase));
}
