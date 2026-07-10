/**
 * 匿名統計の自動送信（クライアント側）＝TIER S-1・N-4相当。
 *
 * 同意済み（stats-consent.ts）の場合のみ、計算結果を /api/stats/submit へベストエフォートで
 * POSTする。PII（メール・氏名等）は一切含めない。失敗しても計算機のUXには影響させない
 * （fire-and-forget・エラーは握りつぶす）。
 */
import { hasStatsConsent } from '@/lib/stats-consent';
import { isValidStatsSubmission, type StatsSubmissionInput } from '@/lib/stats-aggregation';

/** 同意済みなら計算結果を匿名統計として送信する。未同意・不正値なら何もしない。 */
export async function submitStatsResult(input: StatsSubmissionInput): Promise<void> {
  if (!hasStatsConsent()) return;
  if (!isValidStatsSubmission(input)) return;
  if (typeof fetch !== 'function') return;
  try {
    await fetch('/api/stats/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // ベストエフォート。ネットワーク不調等で失敗しても計算機の利用には影響させない。
  }
}
