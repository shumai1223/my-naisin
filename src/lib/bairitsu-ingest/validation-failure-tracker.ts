/**
 * T-Y11E E-5: 「同じ県で3回連続して検算が落ちる場合、資料の構造そのものが変わった可能性が
 * 高いため質問ノートに『構造変化の疑い』として明記する」（`ops/BAIRITSU-INGEST-RUNBOOK.md`
 * 「検算が落ちたときに何を人間に上げるか」節）という運用方針を機械判定する純関数。
 *
 * 検算1回ごとの結果（OK/NG）を県コードごとの台帳に積み上げ、**同じ県で連続してNGが3回目に
 * 達した回だけ**`shouldEscalate: true`を返す（4回目以降も引き続きNGなら`shouldEscalate`は
 * 立てない＝毎回同じ内容で質問ノートを埋めない。1回でもOKになれば連続カウントは0に戻る）。
 * 台帳の永続化（JSON読み書き）はこのモジュールの責務外（呼び出し側が担う）。
 */

export interface PrefectureValidationState {
  consecutiveFailures: number;
  lastCheckedAt: string;
  lastOk: boolean;
}

export type ValidationFailureLedger = Record<string, PrefectureValidationState>;

export interface RecordOutcomeResult {
  ledger: ValidationFailureLedger;
  /** 今回の記録で「同じ県の連続失敗が3回目に達した」場合のみtrue（4回目以降は再度trueにならない）。 */
  shouldEscalate: boolean;
}

const ESCALATION_THRESHOLD = 3;

/**
 * 検算結果を1件記録し、更新後の台帳と「今回エスカレーションすべきか」を返す。
 * `ledger`は不変更新（元のオブジェクトは変更しない）。
 */
export function recordValidationOutcome(ledger: ValidationFailureLedger, prefectureCode: string, ok: boolean, checkedAt: string): RecordOutcomeResult {
  const previousFailures = ledger[prefectureCode]?.consecutiveFailures ?? 0;
  const consecutiveFailures = ok ? 0 : previousFailures + 1;
  const nextLedger: ValidationFailureLedger = {
    ...ledger,
    [prefectureCode]: { consecutiveFailures, lastCheckedAt: checkedAt, lastOk: ok },
  };
  const shouldEscalate = !ok && consecutiveFailures === ESCALATION_THRESHOLD;
  return { ledger: nextLedger, shouldEscalate };
}
