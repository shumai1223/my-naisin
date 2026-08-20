/**
 * click-fraud-detector.mjs — clicksテーブルの日別バーストがボット(referer/UA偽装)由来か
 * 統計的シグネチャで判定する共有ロジック。ops/THREATS.md 脅威13(TH-13・2026-08-20発見)の
 * 実測(08-13〜15・distinct ip比率0.98〜1・distinct user_agent8種類)を基準に設計。
 *
 * scripts/check-click-fraud-burst.mjs（手動/週次実行）と
 * src/scripts/daily-brief-health.ts（毎朝の自動ブリーフィング）の両方から使う単一の実装。
 *
 * ⚠️このファイルはjestのユニットテスト対象外（scripts/__tests__/scaffold-site.test.tsの
 * 冒頭コメントと同型の制約: ts-jestのCommonJS変換は素の.mjsのexport構文を直接importできない）。
 * 動作確認は①`node scripts/check-click-fraud-burst.mjs --days 30`を実行しTH-13実測(08-13/14/15の
 * 3日間のみ検知・distinct IP比率0.99〜1・distinct UA8)と一致することを確認する方法、②消費側
 * (`src/lib/daily-brief-health.ts`の`ClickFraudCheck`型を使うロジック)は`daily-brief-health.test.ts`
 * でカバーする方法、の2通りで代替している。
 */

// TH-13の実測を余裕を持って捕捉できる水準。誤検知ゼロを過去30日で確認済み(2026-08-20)。
export const CLICK_FRAUD_THRESHOLDS = {
  minDailyClicks: 50, // これ未満は偶然のばらつきが支配的なので対象外
  minIpRatio: 0.85, // distinct_ip / total がこれ以上ならIPローテーション型を疑う
  maxDistinctUa: 12, // distinct_user_agent がこれ以下なら偽装UAの使い回しを疑う
};

/**
 * @param {{ d: string, ip_hash: string, user_agent: string }[]} rows
 * @returns {{ date: string, total: number, distinctIp: number, distinctUa: number, ipRatio: number, flagged: boolean }[]}
 *   日付昇順。flagged=trueの日がTH-13と同型のシグネチャに合致する疑わしい日。
 */
export function analyzeClickFraudByDay(rows) {
  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.d)) byDate.set(r.d, { total: 0, ips: new Set(), uas: new Set() });
    const bucket = byDate.get(r.d);
    bucket.total++;
    bucket.ips.add(r.ip_hash);
    bucket.uas.add(r.user_agent);
  }

  const { minDailyClicks, minIpRatio, maxDistinctUa } = CLICK_FRAUD_THRESHOLDS;
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, b]) => {
      const ipRatio = b.total > 0 ? b.ips.size / b.total : 0;
      const flagged = b.total >= minDailyClicks && ipRatio >= minIpRatio && b.uas.size <= maxDistinctUa;
      return { date, total: b.total, distinctIp: b.ips.size, distinctUa: b.uas.size, ipRatio, flagged };
    });
}
