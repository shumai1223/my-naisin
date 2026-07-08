/**
 * CTR自動改善ループ（TIER L-3）の変更履歴ガード。
 *
 * バックログのガード条件を機械的に担保する：
 *  - 同一面の変更は3週間隔（canEditRoute）
 *  - 変更から3週間経ったら効果測定（findRoutesDueForMeasurement）
 *  - 悪化していたら自動リバート提案（evaluateCtrChangeEffect）
 *
 * ログ自体はJSONファイル等の永続化を呼び出し側（スクリプト）に委ねる（このモジュールは
 * 純粋関数のみ・ファイルI/O非依存でテスト可能にする）。
 */

export interface CtrChangeLogEntry {
  /** ページのパス（例: '/hensachi'）。 */
  route: string;
  /** 変更を行った日（YYYY-MM-DD）。 */
  changedAt: string;
  /** 変更前後のtitle/meta等のメモ。 */
  note?: string;
  /** 変更直前のCTR（効果測定の比較用ベースライン）。 */
  ctrBefore?: number;
  /** 効果測定を実施した日（YYYY-MM-DD）。未測定なら未設定。 */
  measuredAt?: string;
}

const DAY_MS = 86_400_000;

function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(`${iso}T00:00:00Z`).getTime()) / DAY_MS);
}

/** そのルートの直近の変更エントリ（無ければundefined）。 */
export function latestChangeForRoute(route: string, log: CtrChangeLogEntry[]): CtrChangeLogEntry | undefined {
  return log
    .filter((e) => e.route === route)
    .sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1))[0];
}

/**
 * このルートを今、title/meta改善の対象にしてよいか（3週間隔ガード）。
 * 変更履歴が無ければ常にtrue（未着手のページ）。
 */
export function canEditRoute(
  route: string,
  log: CtrChangeLogEntry[],
  now: Date = new Date(),
  minIntervalDays = 21,
): boolean {
  const last = latestChangeForRoute(route, log);
  if (!last) return true;
  return daysSince(last.changedAt, now) >= minIntervalDays;
}

/** 3週間経過し、かつまだ効果測定していない変更のルート一覧（週次レポートの「効果測定して」候補）。 */
export function findRoutesDueForMeasurement(
  log: CtrChangeLogEntry[],
  now: Date = new Date(),
  measureAfterDays = 21,
): CtrChangeLogEntry[] {
  return log.filter((e) => !e.measuredAt && daysSince(e.changedAt, now) >= measureAfterDays);
}

export type CtrChangeVerdict = 'improved' | 'worse' | 'flat';

export interface CtrChangeEffectResult {
  verdict: CtrChangeVerdict;
  deltaCtr: number;
  recommendation: string;
}

/**
 * 変更前後のCTRを比較し、悪化していれば自動リバートを提案する（純粋関数）。
 * 閾値は「誤差ノイズで一喜一憂しない」ための最小変化幅（相対10%）。
 */
export function evaluateCtrChangeEffect(ctrBefore: number, ctrAfter: number): CtrChangeEffectResult {
  const deltaCtr = ctrAfter - ctrBefore;
  const relativeChange = ctrBefore === 0 ? (ctrAfter > 0 ? Infinity : 0) : deltaCtr / ctrBefore;

  if (relativeChange <= -0.1) {
    return { verdict: 'worse', deltaCtr, recommendation: '悪化＝変更前のtitle/metaへ自動リバートを提案' };
  }
  if (relativeChange >= 0.1) {
    return { verdict: 'improved', deltaCtr, recommendation: '改善＝このtitle/metaを維持' };
  }
  return { verdict: 'flat', deltaCtr, recommendation: '誤差範囲＝もう少し様子を見る（次周も再測定）' };
}
