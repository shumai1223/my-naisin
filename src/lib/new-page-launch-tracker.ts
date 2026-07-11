/**
 * 新面インデックス監視（TIER I-7）。
 *
 * 7/6〜7/8に新設した新面（約24面・以下LAUNCH_BATCHES参照）がGoogleに発見（index）され
 * 表示回数/クリックが立ち上がっているかを、GSC週次レポート（gsc-weekly-report.ts）の
 * ページ次元データと突合して機械判定する。
 *
 * ルート一覧は `git log --since=2026-07-06 --until=2026-07-10 --diff-filter=A -- 'src/app/**\/page.tsx'`
 * で実際に新規追加されたコミットから機械抽出（admin配下のnoindex面は対象外・動的ルートは
 * page-registry.tsの展開済みURLと突合済み）。誰が見ても離陸/未発見が一目で分かる状態にし、
 * 8月のBacklog v2診断（新面の面化判断の実績データ）の入力に使う。
 */

export interface LaunchBatch {
  label: string;
  launchedAround: string;
  routes: string[];
}

export const LAUNCH_BATCHES: LaunchBatch[] = [
  {
    label: '2026-07-06〜07-08新設バッチ',
    launchedAround: '2026-07-06〜2026-07-08',
    routes: [
      '/chousasho/reibun',
      '/heigan-yuugu',
      '/hensachi/gyakusan',
      '/hensachi/mantenkan',
      '/hensachi/moshi/ichiran',
      '/hensachi/shindan',
      '/hyotei-heikin/gyakusan',
      '/katei-kyoshi',
      '/koukou-bairitsu',
      '/tarinai-taisaku',
      '/total-score/mantenkan',
      '/for-teachers',
      '/futoukou/shussekiatsukai',
      '/shutsugan-junbi',
      '/shutsugan-junbi/kounai-senkou',
      '/shutsugan-junbi/shibou-riyuusho',
      '/hensachi/kyoka-betsu/kokugo',
      '/hensachi/kyoka-betsu/sugaku',
      '/hensachi/kyoka-betsu/eigo',
      '/hensachi/kyoka-betsu/rika',
      '/hensachi/kyoka-betsu/shakai',
      '/naishin-age-kata/chu1',
      '/naishin-age-kata/chu2',
      '/naishin-age-kata/chu3',
    ],
  },
];

export interface GscPageRow {
  keys: string[];
  clicks: number;
  impressions: number;
}

export type LaunchPageStatusKind = 'indexed' | 'undiscovered';

export interface LaunchPageStatus {
  route: string;
  status: LaunchPageStatusKind;
  impressions: number;
  clicks: number;
}

/** URLをパスへ短縮（origin除去）。既に短いパスが渡された場合はそのまま返す。 */
function shortPath(urlOrPath: string): string {
  return urlOrPath.replace(/^https?:\/\/[^/]+/, '') || '/';
}

/**
 * 対象ルート群を、GSCページ次元データ（直近週）と突合し「離陸(indexed=表示回数>0)」か
 * 「未発見(undiscovered=GSCに一切現れない＝インデックス未完了の可能性)」かを判定する。
 */
export function evaluateLaunchBatchStatus(routes: string[], gscPages: GscPageRow[]): LaunchPageStatus[] {
  const byPath = new Map<string, { clicks: number; impressions: number }>();
  for (const row of gscPages) {
    const path = shortPath(row.keys[0]);
    byPath.set(path, { clicks: row.clicks, impressions: row.impressions });
  }
  return routes.map((route) => {
    const hit = byPath.get(route);
    const impressions = hit?.impressions ?? 0;
    const clicks = hit?.clicks ?? 0;
    return { route, status: impressions > 0 ? 'indexed' : 'undiscovered', impressions, clicks };
  });
}

export function formatLaunchBatchMarkdown(batch: LaunchBatch, statuses: LaunchPageStatus[]): string {
  const indexed = statuses.filter((s) => s.status === 'indexed').sort((a, b) => b.impressions - a.impressions);
  const undiscovered = statuses.filter((s) => s.status === 'undiscovered');
  const lines: string[] = [];
  lines.push(`**${batch.label}**（${batch.launchedAround}）: 離陸 ${indexed.length}/${statuses.length}面`);
  lines.push('');
  if (indexed.length) {
    lines.push('| ページ | 表示 | click |');
    lines.push('|---|--:|--:|');
    for (const s of indexed) lines.push(`| ${s.route} | ${s.impressions} | ${s.clicks} |`);
    lines.push('');
  }
  if (undiscovered.length) {
    lines.push(`**⚠️ 未発見（表示回数0＝インデックス未完了の可能性）: ${undiscovered.length}面**`);
    for (const s of undiscovered) lines.push(`- ${s.route}`);
  } else {
    lines.push('_未発見の面なし（全面がGSCに表示回数を計測済み）_');
  }
  return lines.join('\n');
}
