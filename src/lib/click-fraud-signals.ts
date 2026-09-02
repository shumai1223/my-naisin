/**
 * クリック不正の日次シグネチャ（純関数・正典）。
 *
 * ★2026-09-02 新設の経緯:
 * bot 451行を削除した際、既存の日次シグネチャ（`scripts/lib/click-fraud-detector.mjs` の
 * `analyzeClickFraudByDay` = 件数10以上 × distinct IP比率0.85以上 × distinct UA 12以下）が
 * 明らかなbot日を取りこぼしていた。
 *
 *   2026-08-04  40件・モバイル 0件(0.0%)  → ipRatio 0.900 で不該当
 *   2026-08-06  36件・モバイル 1件(2.8%)  → ipRatio 0.611 で不該当
 *   2026-08-25  30件・モバイル 1件(3.3%)  → ipRatio 0.900 で不該当
 *
 * **IPの散り方に条件を置くと、プロキシの使い方が変わるだけですり抜ける。**
 * 一方モバイル比率は実トラフィックの性質（GSC実測で74〜80%がモバイル）に依存するため、
 * 攻撃側が偽装するには「モバイルUAを使う」必要があり、その時点で別の署名が立つ。
 *
 * 閾値を主観で決めないよう、**二項分布の裾確率**を併記する。
 *
 * ⚠️ 運用スクリプト側（`scripts/lib/click-fraud-detector.mjs`）は Node から直接実行される
 * ESM のため、この TS を import できず同じロジックを持っている。
 * **定数がずれると検知結果が食い違う**ので、`__tests__/click-fraud-mobile-anomaly.test.ts` が
 * .mjs のソーステキストを読んで閾値の一致を機械的に検査している。片方だけ変えるとテストが落ちる。
 */

/** UA がモバイルかどうか。`.mjs` 側の MOBILE_UA_RE と同じ定義を保つこと。 */
export const MOBILE_UA_PATTERN = /Mobile|iPhone|Android/i;

export const MOBILE_ANOMALY_THRESHOLDS = {
  /** これ未満の日はサンプルが少なくブレが支配的なので判定しない（オオカミ少年化を防ぐ）。 */
  minDailyClicks: 10,
  /**
   * これ未満のモバイル比率を異常とみなす。
   * `analyzeMobileRatioByDay` の警告閾値（0.5）より厳しいのは、こちらが
   * **削除候補の抽出**に使われうるため、グレーな日を巻き込まないことを優先するから。
   */
  maxMobileRatio: 0.15,
  /** 実トラフィックのモバイル比率（GSC実測 74〜80% の下寄せ）。裾確率の計算にのみ使う。 */
  assumedMobileRatio: 0.75,
} as const;

export interface MobileAnomalyDay {
  date: string;
  total: number;
  mobile: number;
  mobileRatio: number;
  /** 実モバイル率 assumedMobileRatio のとき、偶然これ以下になる確率。小さいほどbot濃厚。 */
  chanceProbability: number;
  flagged: boolean;
}

/**
 * 二項分布の下側累積 P(X ≤ k), X ~ B(n, p)。
 * n が大きいと階乗が溢れるため対数空間で計算する。
 */
export function binomialAtMost(n: number, k: number, p: number): number {
  if (n <= 0) return 1;
  if (k >= n) return 1;
  if (k < 0) return 0;
  let logChoose = 0;
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    if (i > 0) logChoose += Math.log(n - i + 1) - Math.log(i);
    sum += Math.exp(logChoose + i * Math.log(p) + (n - i) * Math.log(1 - p));
  }
  return Math.min(1, sum);
}

/**
 * 日ごとにモバイル比率を集計し、実トラフィックの水準から極端に外れた日を抽出する。
 *
 * @param rows クリック行（`d` は 'YYYY-MM-DD'）
 * @returns 日付昇順。`flagged` の日の**非モバイル行**が削除候補になる
 *   （削除の実行は C7 ゲート＝👤承認＋事前バックアップ）。
 */
export function analyzeMobileAnomalyByDay(
  rows: readonly { d: string; user_agent?: string | null }[],
  opts: Partial<typeof MOBILE_ANOMALY_THRESHOLDS> = {}
): MobileAnomalyDay[] {
  const minDailyClicks = opts.minDailyClicks ?? MOBILE_ANOMALY_THRESHOLDS.minDailyClicks;
  const maxMobileRatio = opts.maxMobileRatio ?? MOBILE_ANOMALY_THRESHOLDS.maxMobileRatio;
  const p = opts.assumedMobileRatio ?? MOBILE_ANOMALY_THRESHOLDS.assumedMobileRatio;

  const byDate = new Map<string, { total: number; mobile: number }>();
  for (const r of rows) {
    let bucket = byDate.get(r.d);
    if (!bucket) {
      bucket = { total: 0, mobile: 0 };
      byDate.set(r.d, bucket);
    }
    bucket.total++;
    if (MOBILE_UA_PATTERN.test(r.user_agent ?? '')) bucket.mobile++;
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, b]) => {
      const mobileRatio = b.total > 0 ? b.mobile / b.total : 0;
      return {
        date,
        total: b.total,
        mobile: b.mobile,
        mobileRatio,
        chanceProbability: binomialAtMost(b.total, b.mobile, p),
        flagged: b.total >= minDailyClicks && mobileRatio < maxMobileRatio,
      };
    });
}
