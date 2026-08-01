/**
 * Λ-21（留守番モード・第1層）実装項目3: デプロイ後スモークチェック。
 *
 * push→Cloudflare Workers自動デプロイ後、本番URLが実際に200を返しているかを確認する。
 * ここでは「判定ロジック」と「実行（fetch）」を分離し、判定側を外部I/O無しの純関数として
 * テスト可能にする（[[fable5-loop-protocol]]の既存パターンを踏襲）。
 */

export interface SmokeCheckTarget {
  /** 表示用の名前（例: "ホームページ" "/api/status"）。 */
  name: string;
  url: string;
}

export interface SmokeCheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
}

/** 既定のチェック対象。ページ層(SSR/静的生成)とAPI層の両方が生きているかを1回で確認する。 */
export const DEFAULT_SMOKE_CHECK_TARGETS: SmokeCheckTarget[] = [
  { name: 'ホームページ', url: 'https://my-naishin.com/' },
  { name: 'API稼働ステータス', url: 'https://my-naishin.com/api/status' },
];

/** 1件のfetch結果をSmokeCheckResultへ変換する純関数（例外は呼び出し側でcatchしてこの形にする）。 */
export function toSmokeCheckResult(
  target: SmokeCheckTarget,
  outcome: { status: number } | { error: string }
): SmokeCheckResult {
  if ('error' in outcome) {
    return { name: target.name, url: target.url, ok: false, error: outcome.error };
  }
  return { name: target.name, url: target.url, ok: outcome.status >= 200 && outcome.status < 300, status: outcome.status };
}

export interface SmokeCheckSummary {
  allOk: boolean;
  results: SmokeCheckResult[];
  failures: SmokeCheckResult[];
}

/** 結果一覧から全体判定を出す純関数。1件でも失敗があれば全体を失敗とする（安全側）。 */
export function evaluateSmokeCheck(results: SmokeCheckResult[]): SmokeCheckSummary {
  const failures = results.filter((r) => !r.ok);
  return { allOk: failures.length === 0, results, failures };
}

/** Discord通知/コンソール出力向けの短いメッセージを組み立てる純関数。 */
export function buildSmokeCheckMessage(summary: SmokeCheckSummary, timestampLabel: string): string {
  if (summary.allOk) {
    return `🟢 デプロイ後スモークチェック正常（${timestampLabel}）: 全${summary.results.length}件が200を返した`;
  }
  const failureLines = summary.failures.map(
    (f) => `- ${f.name} (${f.url}): ${f.error ? `エラー: ${f.error}` : `HTTP ${f.status}`}`
  );
  return [
    `🔴 デプロイ後スモークチェック異常（${timestampLabel}）: ${summary.failures.length}/${summary.results.length}件が失敗`,
    ...failureLines,
  ].join('\n');
}
