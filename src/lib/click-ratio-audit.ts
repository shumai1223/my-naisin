/**
 * clicks（D1）の人間比率・モバイル比率をゲート化する（DW-7 #10・DEADWIRE 2026-08-10監査）。
 *
 * `classifyClick`（bot-filter.ts）は存在するが、その分類結果の比率自体を異常検知に
 * 繋ぐ専用のチェックが無かった。stats-distribution-audit.ts と同じ設計方針を踏襲する：
 *  - 異常検知ロジックはここ（純関数・unit test済み）。
 *  - データ取得は scripts/check-click-ratio-anomaly.ts が d1q.mjs 経由で担当する。
 *  - 検知結果は「報告のみ」。自動でのquarantine/削除は行わない。
 *
 * ## なぜモバイル比率で見るか（ops/DEADWIRE.md DW-3の実測が根拠）
 * サイト全体のモバイル比率はGSC実測で約74%。一方DW-3では「human/suspect判定を通過した
 * クリックがdesktop 327/mobile 21＝モバイル6%」という、実ユーザー分布と真逆の構成が
 * 見つかり、これが偽装ヘッダ型ボット（Referer/UAだけでなくSec-Fetch-Site等も偽装できる
 * クライアント）の識別に使えることが判明した。**`classifyClick`が`human`と判定した
 * クリックの中身が実ユーザーのデバイス構成と乖離している＝分類ロジック自体がすり抜けられている
 * 疑いがある**、という自己矛盾検知（S9-4のroot_only×placementと同型の発想）。
 *
 * 閾値は初回導入のため保守的に設定（[[fable5-loop-protocol]]のオオカミ少年化の教訓を踏まえ、
 * サンプル不足時は判定を見送る）。実測が積み上がったら次回セッションでMIN_EXPECTED_MOBILE_RATIOを
 * 実データに合わせて調整してよい。
 */

export type ClickRatioAuditRow = {
  userAgent?: string | null;
  referer?: string | null;
  placement?: string | null;
};

export const CLICK_RATIO_THRESHOLDS = {
  /** human分類が この件数未満なら、比率のブレが支配的になるため判定を見送る。 */
  minHumanSampleForMobileCheck: 10,
  /** サイト全体はモバイル約74%（GSC実測）。人間分類クリックがこれを大きく下回るなら
   *  デバイス構成が実ユーザーと矛盾しており、偽装ヘッダ型ボットのすり抜けを疑う。
   *  初回導入のため保守的に0.30に設定（74%からは離れているが、閾値の較正不足で
   *  過検知を起こさないことを優先）。 */
  minExpectedMobileRatioAmongHuman: 0.3,
};

const MOBILE_UA_RE = /Mobile|iPhone|Android/i;

export type ClickRatioAuditReport = {
  total: number;
  human: number;
  bot: number;
  suspect: number;
  unknown: number;
  humanRatio: number;
  mobileAmongHuman: { count: number; ratio: number } | null;
  flagged: boolean;
  reasons: string[];
};

/**
 * classifyClick を1件ずつ適用し、比率とフラグをまとめる。
 * classifyClick は循環import回避のため呼び出し側（スクリプト）から注入する。
 */
export function auditClickRatios(
  rows: ClickRatioAuditRow[],
  classify: (row: ClickRatioAuditRow) => 'unknown' | 'bot' | 'human' | 'suspect'
): ClickRatioAuditReport {
  let human = 0;
  let bot = 0;
  let suspect = 0;
  let unknown = 0;
  let mobileAmongHumanCount = 0;

  for (const row of rows) {
    const trust = classify(row);
    if (trust === 'human') {
      human++;
      if (MOBILE_UA_RE.test(row.userAgent ?? '')) mobileAmongHumanCount++;
    } else if (trust === 'bot') {
      bot++;
    } else if (trust === 'suspect') {
      suspect++;
    } else {
      unknown++;
    }
  }

  const total = rows.length;
  const humanRatio = total > 0 ? human / total : 0;

  const { minHumanSampleForMobileCheck, minExpectedMobileRatioAmongHuman } = CLICK_RATIO_THRESHOLDS;
  const mobileAmongHuman =
    human > 0 ? { count: mobileAmongHumanCount, ratio: mobileAmongHumanCount / human } : null;

  const reasons: string[] = [];
  if (mobileAmongHuman && human >= minHumanSampleForMobileCheck && mobileAmongHuman.ratio < minExpectedMobileRatioAmongHuman) {
    reasons.push(
      `human分類${human}件中モバイル比率${(mobileAmongHuman.ratio * 100).toFixed(1)}%` +
        `（サイト全体のモバイル比率約74%と比べ著しく低い＝偽装ヘッダ型ボットのすり抜けを疑う）`
    );
  }

  return {
    total,
    human,
    bot,
    suspect,
    unknown,
    humanRatio,
    mobileAmongHuman,
    flagged: reasons.length > 0,
    reasons,
  };
}
