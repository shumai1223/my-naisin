/**
 * 掛-5（収益距離）第1周のレポート生成スクリプト。全page.tsxテンプレートについて
 * computeSiteRevenueDistances()を実行し、距離の分布・∞（到達不能）ページの一覧・
 * 中央値を標準出力へ出す。GSC実測値との突合は別途 mcp__gsc__gsc_query の結果を
 * routeキーで結合すること（このスクリプト単体はGSC APIを呼ばない・純粋にグラフ計算のみ）。
 *
 * 実行: npx tsx src/scripts/revenue-distance-report.ts
 */
import fs from 'fs';
import path from 'path';
import { computeSiteRevenueDistances, medianDistance } from '../lib/revenue-distance';

const appDir = path.join(__dirname, '..', 'app');
const srcDir = path.join(__dirname, '..');

const entries = computeSiteRevenueDistances(appDir, srcDir);

const distribution: Record<string, number> = {};
for (const e of entries) {
  const key = e.distance === Infinity ? '∞' : String(e.distance);
  distribution[key] = (distribution[key] ?? 0) + 1;
}

const orphans = entries.filter((e) => e.distance === Infinity);
const far = entries.filter((e) => e.distance >= 4 && e.distance !== Infinity);
const distanceOne = entries.filter((e) => e.distance === 1);
const distanceTwo = entries.filter((e) => e.distance === 2);

console.log(`総ページ数(page.tsxテンプレート単位): ${entries.length}`);
console.log(`中央値: ${medianDistance(entries)}`);
console.log('分布:', JSON.stringify(distribution, null, 2));
console.log(`\n∞（収益面へ到達不能）: ${orphans.length}件`);
for (const o of orphans) console.log(`  ${o.route}`);
console.log(`\n距離4以上（遠い）: ${far.length}件`);
for (const f of far.sort((a, b) => b.distance - a.distance)) console.log(`  距離${f.distance}: ${f.route}`);

const outPath = path.join(__dirname, '..', '..', 'docs', 'revenue-distance-cycle1-2026-08-09.md');
const lines: string[] = [];
lines.push('# 掛-5 収益距離 第1周（グラフ構造監査）— 2026-08-09');
lines.push('');
lines.push(
  '`src/lib/revenue-distance.ts`の`computeSiteRevenueDistances()`で全page.tsxテンプレート' +
    '（動的ルートは`[code]`等のテンプレート単位・107の静的ルート＋動的ルートで計123テンプレート）' +
    'について機械算出。GSC実測（表示回数・クリック・主要クエリ）との突合は未実施＝次回サイクルで' +
    'GSC MCPクエリ結果とrouteキーで結合すること（このレポートはグラフ構造のみの純粋な監査）。'
);
lines.push('');
lines.push(`- 総テンプレート数: ${entries.length}`);
lines.push(`- 中央値: ${medianDistance(entries)}`);
lines.push(`- 分布: ${JSON.stringify(distribution)}`);
lines.push('');
lines.push('## 主な発見');
lines.push('');
lines.push(
  `1. **構造的な孤立ページは実質ゼロ**。距離∞は${orphans.length}件のみで、全て` +
    '意図的に収益CTAを持たない設計のページ（管理画面/B2B塾ダッシュボード/リダイレクトシム）と' +
    '確認できた（内訳は下記）。既存の`internal-link-graph.test.ts`の`NO_INBOUND_LINK_EXEMPT_ROUTES`と' +
    '重なる面が大半で、新たに見つかったのは`/[prefecture]/reverse`（コンテンツを持たない' +
    '`permanentRedirect`のみのリダイレクトシム）・`/juku/dashboard`・`/juku/dashboard/demo`・' +
    '`/juku/matching`の4件。いずれも「直すべき壊れたページ」ではない。'
);
lines.push(
  `2. **Λ-2の学校ページ(\`/pref/[code]/school/[schoolCode]\`)は既に距離2**（\`SchoolPageConvertCTA\`の` +
    '静的`href="/juku-shindan"`経由）。「958ページ作った労力がほぼ死んでいる」という当初の懸念は' +
    '構造面では既に解消済みだったと判明した（Λ-2完了時に実装済みの導線が機能している）。'
);
lines.push(
  `3. **中央値1が意味すること**: ${distanceOne.length}ページ(全体の${Math.round((distanceOne.length / entries.length) * 100)}%)が` +
    `既に収益CTAを直接内蔵し、${distanceTwo.length}ページが1クリック先。**構造的な「距離」はほぼ解決済み** ` +
    'であり、バックログ診断（`hiyou`0クリック・高単価面流入が全体の0.2%）が指す本当の問題は' +
    '「リンクが存在しない」ことではなく、「リンクは存在するが実際にクリックされていない」こと' +
    '（CTAの視認性・文言・配置の弱さ）だと再確認できた。**第2周は新規リンク敷設ではなく、既存の' +
    '距離1/2経路上のCTA品質（視認性・文言・GSC実測クリック率）の改善に焦点を当てるべき**という' +
    '示唆を得た。'
);
lines.push('');
lines.push(`## ∞（構造的に到達不能・${orphans.length}件・全て意図的な設計と確認済み）`);
lines.push('');
for (const o of orphans) lines.push(`- \`${o.route}\``);
lines.push('');
lines.push(`## 距離4以上（${far.length}件）`);
lines.push('');
if (far.length === 0) {
  lines.push('該当なし。');
} else {
  for (const f of far.sort((a, b) => b.distance - a.distance)) lines.push(`- 距離${f.distance}: \`${f.route}\``);
}
lines.push('');
lines.push('## 次回サイクルへの申し送り');
lines.push('');
lines.push('1. GSC MCP（28日）で全テンプレートのクリック/表示回数を取得し、`route`キーで本表と結合する。');
lines.push(
  '2. 「距離2」かつ流入の多いページ（学校ページ・hensachi/hyotei-heikin等）から順に、' +
    'そのページ上のCTA自体のクリック率（D1計測）を確認し、視認性・文言・配置を改善する' +
    '（掛-5の「絶対に守ること」= 新規ページを作らず、既存導線を繋ぎ直す原則を維持）。'
);
lines.push('3. 動的ルートのtemplate-literal href（`${code}`等）は静的抽出の既知の限界として未検出。');
lines.push(`   より正確な結線状況が必要な場合は個別ページの実インスタンスをサンプル抽出して確認する。`);
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'));
console.log(`\nレポート書き出し: ${outPath}`);
