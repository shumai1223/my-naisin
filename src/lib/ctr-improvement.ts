/**
 * CTR自動改善ループ（TIER L-3）。
 *
 * 週次でページ別CTRを「掲載順位から期待されるCTR帯」と比較し、劣後している面を検出する。
 * query-mining.ts（新面候補の一次抽出）の量産版にあたる＝ここも一次フィルタに留め、
 * 実際のtitle/meta変更は人間または次周のループが候補を見て判断する（自動編集はしない）。
 *
 * 期待CTR帯は、複数のSERP CTR調査で広く引用される「順位帯別の一般的なCTR目安」を参照した
 * ヒューリスティックであり、本サイト固有の実測値ではない（比較用の目安・捏造ではない）。
 * ガード（バックログ原文）:
 *  - 流入上位5面は対象外（既に稼ぎ頭＝下手に触ると壊すリスクが実験メリットを上回る）
 *  - 同一面の変更は3週間隔（ctr-improvement-log.tsの変更履歴で担保）
 */

export interface GscPageRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface CtrBand {
  minPosition: number;
  maxPosition: number;
  /** この順位帯で一般的に見られるCTRの目安下限（比較用ヒューリスティック）。 */
  expectedMinCtr: number;
}

/**
 * 順位帯別の期待CTR目安（比較用ヒューリスティック・複数のSERP CTR調査を参考にした概算）。
 * 実際のCTRはクエリの検索意図・タイトルの魅力度で大きく変動するため、あくまで
 * 「この順位帯にしては明らかに低い」を検知する下限ラインとして使う。
 */
export const CTR_EXPECTATION_BANDS: CtrBand[] = [
  { minPosition: 1, maxPosition: 3, expectedMinCtr: 0.1 },
  { minPosition: 4, maxPosition: 6, expectedMinCtr: 0.04 },
  { minPosition: 7, maxPosition: 10, expectedMinCtr: 0.02 },
  { minPosition: 11, maxPosition: 20, expectedMinCtr: 0.008 },
];

/** 順位に対応する期待CTR帯を返す（対応帯が無い＝21位以下は対象外でnull）。 */
export function expectedCtrBandForPosition(position: number): CtrBand | null {
  return CTR_EXPECTATION_BANDS.find((b) => position >= b.minPosition && position <= b.maxPosition) ?? null;
}

export interface CtrUnderperformer {
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  expectedMinCtr: number;
}

export interface CtrUnderperformerOptions {
  /** ノイズ除去のための最小表示回数。 */
  minImpressions?: number;
  /** 流入上位何面を対象外にするか（バックログ原文=5）。 */
  excludeTopNByClicks?: number;
  limit?: number;
}

/**
 * 掲載順位から見て明らかにCTRが低い面を検出する（純粋関数・テスト可能）。
 * 流入上位面（excludeTopNByClicks件）は稼ぎ頭のため対象外にする。
 */
export function findCtrUnderperformers(
  pages: GscPageRow[],
  options: CtrUnderperformerOptions = {},
): CtrUnderperformer[] {
  const { minImpressions = 150, excludeTopNByClicks = 5, limit = 20 } = options;

  const topByClicks = new Set(
    pages
      .slice()
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, excludeTopNByClicks)
      .map((p) => p.keys[0]),
  );

  return pages
    .filter((p) => p.impressions >= minImpressions)
    .filter((p) => !topByClicks.has(p.keys[0]))
    .map((p) => {
      const band = expectedCtrBandForPosition(p.position);
      return band ? { p, band } : null;
    })
    .filter((x): x is { p: GscPageRow; band: CtrBand } => x !== null && x.p.ctr < x.band.expectedMinCtr)
    .map(({ p, band }) => ({
      url: p.keys[0] ?? '',
      impressions: p.impressions,
      clicks: p.clicks,
      ctr: p.ctr,
      position: p.position,
      expectedMinCtr: band.expectedMinCtr,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);
}

export function formatCtrUnderperformersMarkdown(rows: CtrUnderperformer[]): string {
  if (rows.length === 0) return '_該当なし（順位期待値に対しCTRが明らかに低い面は検出されず）_\n';
  const lines = [
    '| ページ | 表示 | CTR | 順位 | 期待CTR下限 |',
    '|---|--:|--:|--:|--:|',
    ...rows.map(
      (r) =>
        `| ${r.url} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} | ${(r.expectedMinCtr * 100).toFixed(1)}% |`,
    ),
  ];
  return lines.join('\n') + '\n';
}
