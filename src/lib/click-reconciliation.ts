/**
 * ASP確定⇔GA4⇔D1 三面照合（I-4）。
 *
 * 3つのクリック計測はそれぞれ性質が違う：
 *  - D1（/go の302ログ）＝ファーストパーティ・サーバー側の一次データ。原則これが天井（欠測しない設計）。
 *  - GA4 affiliate_click＝クライアント側。Consent Mode/広告ブロッカーで一部欠測する（D1以下が正常）。
 *  - ASP確定＝外部の一次情報（最も遅れて届く）。クリックしてから発生に至った件数なので、
 *    定義上 D1クリック以下のはず（クリックゼロで発生だけ増えることは起こり得ない）。
 *
 * この不等式（ASP確定 ≤ D1 ≥ GA4）が崩れたら、実態変化ではなく計測側の事故
 * （/goの実装バグ・GA4タグ抜け・ASP側の集計期間ズレ等）を疑う合図にする。
 * ¥は扱わない（件数の整合性のみ・[[no-revenue-projections-guideline]]）。
 */

export interface ReconciliationRow {
  affiliateId: string;
  /** D1（/goログ）の月間クリック数。ファーストパーティの一次データ＝原則これが天井。 */
  d1Clicks: number;
  /** GA4 affiliate_click の月間件数（Consent Mode下で過少計測されうる）。 */
  ga4Clicks: number;
  /** ASP管理画面の確定件数（外部の一次情報）。 */
  aspConfirmed: number;
}

export interface ReconciliationFlag {
  affiliateId: string;
  severity: 'error' | 'warning';
  issue: string;
}

/**
 * 3面のクリック数を突合し、不等式が崩れている行にフラグを立てる（純粋関数・テスト可能）。
 *  - error: ASP確定 > D1クリック（クリックなしで発生は起こらないはずのため、原理的に矛盾）
 *  - error: GA4クリック > D1クリック（D1は欠測しない一次データのはずのため、原理的に矛盾）
 *  - warning: D1クリックがあるのにGA4が0件（GA4タグ抜け・Consent同意率0の疑い）
 */
export function reconcileClickSources(rows: ReconciliationRow[]): ReconciliationFlag[] {
  const flags: ReconciliationFlag[] = [];
  for (const r of rows) {
    if (r.aspConfirmed > r.d1Clicks) {
      flags.push({
        affiliateId: r.affiliateId,
        severity: 'error',
        issue: `ASP確定(${r.aspConfirmed})がD1クリック(${r.d1Clicks})を超過＝計測漏れ or 集計期間ズレの疑い`,
      });
    }
    if (r.ga4Clicks > r.d1Clicks) {
      flags.push({
        affiliateId: r.affiliateId,
        severity: 'error',
        issue: `GA4クリック(${r.ga4Clicks})がD1クリック(${r.d1Clicks})を超過＝D1側の計測漏れ or /goの実装バグの疑い（D1は欠測しない設計）`,
      });
    }
    if (r.d1Clicks > 0 && r.ga4Clicks === 0) {
      flags.push({
        affiliateId: r.affiliateId,
        severity: 'warning',
        issue: `D1クリックは${r.d1Clicks}件あるがGA4は0件＝GA4タグ抜け・Consent同意率0の疑い`,
      });
    }
  }
  return flags;
}

export interface ReconciliationSummary {
  rows: ReconciliationRow[];
  flags: ReconciliationFlag[];
  totalD1: number;
  totalGa4: number;
  totalAspConfirmed: number;
  /** GA4がD1の何%を捕捉できているか（Consent捕捉率の送客版）。totalD1が0はnull。 */
  ga4CaptureRatePercent: number | null;
}

/** 月次レポート化用のサマリ（合計・GA4捕捉率込み）。 */
export function summarizeReconciliation(rows: ReconciliationRow[]): ReconciliationSummary {
  const totalD1 = rows.reduce((s, r) => s + r.d1Clicks, 0);
  const totalGa4 = rows.reduce((s, r) => s + r.ga4Clicks, 0);
  const totalAspConfirmed = rows.reduce((s, r) => s + r.aspConfirmed, 0);
  return {
    rows,
    flags: reconcileClickSources(rows),
    totalD1,
    totalGa4,
    totalAspConfirmed,
    ga4CaptureRatePercent: totalD1 > 0 ? (totalGa4 / totalD1) * 100 : null,
  };
}
