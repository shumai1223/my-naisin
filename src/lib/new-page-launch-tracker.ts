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
  /** GO/STOP判定の経過日数計算に使う基準日（ISO）。launchedAroundの範囲のうち最も遅い日＝
   * 最も保守的（経過日数を過大評価しない＝時期尚早のstop-investigate誤判定を避ける）。 */
  launchedAtIso: string;
  routes: string[];
}

export const LAUNCH_BATCHES: LaunchBatch[] = [
  {
    label: '2026-07-06〜07-08新設バッチ',
    launchedAround: '2026-07-06〜2026-07-08',
    launchedAtIso: '2026-07-08',
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
  {
    // O-6：git log --since=2026-07-09 --until=2026-07-12 --diff-filter=A -- 'src/app/**/page.tsx'
    // で機械抽出（batch1との重複2件=futoukou/shussekiatsukai・shutsugan-junbi/kounai-senkouは除外・
    // admin配下のnoindex面(/admin/juku-reviews)も除外）。動的ルートはGLOSSARY_TERMS/
    // SHINDAN_GRADE_CONTENTS/SHINDAN_PURPOSE_CONTENTSの実IDで展開（page-registry.ts/sitemap.tsの
    // 展開ロジックと同じデータソース）。
    label: '2026-07-09〜07-12新設バッチ',
    launchedAround: '2026-07-09〜2026-07-12',
    launchedAtIso: '2026-07-12',
    routes: [
      '/glossary/su-naishin',
      '/glossary/kansan-naishin',
      '/glossary/chousasho-ten',
      '/glossary/k-chi',
      '/glossary/kanten-hyouka',
      '/glossary/s-chi',
      '/glossary/a-chi',
      '/glossary/hyoutei',
      '/glossary/keisha-haiten',
      '/glossary/tokuiro-kensa',
      '/glossary/esat-j',
      '/goukaku-happyo',
      '/hensachi/gyakusan/hayamihyou',
      '/hensachi/shindan/chu1',
      '/hensachi/shindan/chu2',
      '/hensachi/shindan/chu3',
      '/hensachi/shindan/mokuteki/shiboukou',
      '/hensachi/shindan/mokuteki/naishin-bankai',
      '/hensachi/shindan/mokuteki/juku',
      '/jikosaiten',
      '/juken-toujitsu',
      '/koukou-bairitsu/yomikata',
      '/naishin-oru',
      '/naishin-oru/3',
      '/naishin-oru/4',
      '/naishin-oru/5',
      '/stats',
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

/**
 * バッチ公開の効果検証GO/STOP判定（O-6）。
 *
 * [[gsc-read-lag]]の知見（GSC反映は1〜3週間）を踏まえ、経過日数で判定を分岐する純粋関数：
 *  - launchedAtIsoから14日未満: 判定保留(wait)。インデックスラグの範囲内なので未発見面があっても異常ではない。
 *  - 14日以上経過かつ離陸率70%以上: go（次バッチも同じペースで公開してよい）。
 *  - 21日以上経過かつ離陸率50%未満: stop-investigate（次バッチを一旦止め、ページ品質/内部リンクを調査）。
 *  - それ以外: wait（もう少し待って再評価）。
 */
export type BatchGoStopVerdictKind = 'go' | 'wait' | 'stop-investigate';

export interface BatchGoStopVerdict {
  label: string;
  daysSinceLaunch: number;
  indexRate: number;
  indexedCount: number;
  totalCount: number;
  verdict: BatchGoStopVerdictKind;
  detail: string;
}

const LAUNCH_DAY_MS = 86_400_000;

export function evaluateBatchGoStopVerdict(
  batch: LaunchBatch,
  statuses: LaunchPageStatus[],
  now: Date = new Date()
): BatchGoStopVerdict {
  const totalCount = statuses.length;
  const indexedCount = statuses.filter((s) => s.status === 'indexed').length;
  const indexRate = totalCount > 0 ? indexedCount / totalCount : 0;
  const daysSinceLaunch = Math.max(
    0,
    Math.floor((now.getTime() - new Date(`${batch.launchedAtIso}T00:00:00Z`).getTime()) / LAUNCH_DAY_MS)
  );

  let verdict: BatchGoStopVerdictKind;
  let detail: string;
  if (daysSinceLaunch < 14) {
    verdict = 'wait';
    detail = `公開から${daysSinceLaunch}日（インデックスラグの目安1〜3週間の範囲内）。判定は14日経過後に。`;
  } else if (indexRate >= 0.7) {
    verdict = 'go';
    detail = `離陸率${Math.round(indexRate * 100)}%（${indexedCount}/${totalCount}面・${daysSinceLaunch}日経過）。次バッチも同ペースで公開してよい。`;
  } else if (daysSinceLaunch >= 21 && indexRate < 0.5) {
    verdict = 'stop-investigate';
    detail = `${daysSinceLaunch}日経過で離陸率${Math.round(indexRate * 100)}%と低い。次バッチを一旦止め、ページ品質・内部リンク・sitemap登録を調査。`;
  } else {
    verdict = 'wait';
    detail = `離陸率${Math.round(indexRate * 100)}%（${daysSinceLaunch}日経過）。もう少し様子を見る。`;
  }

  return { label: batch.label, daysSinceLaunch, indexRate, indexedCount, totalCount, verdict, detail };
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
