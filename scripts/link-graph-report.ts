/**
 * 内部リンクグラフ最適化レポート（S-8・internal-link-graph.tsの「検査」から「最適化」への昇格）。
 *
 * src/lib/internal-link-graph.ts（internal-link-graph.test.tsが使う共通ヘルパー）を再利用し、
 * 全静的ページを被リンク数の昇順でレポートする（人間が読んで内部リンクを足す判断をするための
 * 優先順位付きリスト・報告専用でCIは壊さない＝check-orphans.mjsと同じ設計）。
 *
 * ⚠️ 制約: 被リンク検出は正規表現によるベストエフォート（href="/xxx" 等のリテラル文字列一致）。
 * href={`/${p.code}/naishin`} のような動的テンプレートリテラルは対象URLを静的解析できないため
 * リンク元としては数えられるが、リンク先の特定（ハブからの深さ計算等）は行わない
 * （不正確な深さ数値を報告して誤った判断を招くより、確実な指標である被リンク数のみに絞る）。
 *
 * 実行: npx tsx scripts/link-graph-report.ts
 */
import path from 'path';
import { walkSourceFiles, walkPageFiles, pageFileToRoute, countContextualInboundLinks } from '@/lib/internal-link-graph';

const THIN_THRESHOLD = 1; // これ以下の被リンク数を「薄い面」として報告

function main() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const srcDir = path.join(process.cwd(), 'src');

  const pageFiles = walkPageFiles(appDir);
  const candidateFiles = walkSourceFiles(srcDir);

  const results = pageFiles
    .map((file) => ({ file, route: pageFileToRoute(appDir, file) }))
    .filter((e): e is { file: string; route: string } => e.route !== null)
    .map(({ file, route }) => ({
      route,
      inbound: route === '/' ? Infinity : countContextualInboundLinks(route, file, candidateFiles),
    }));

  results.sort((a, b) => a.inbound - b.inbound);

  const thin = results.filter((r) => r.inbound <= THIN_THRESHOLD && r.route !== '/' && !r.route.startsWith('/admin'));
  const distribution: Record<string, number> = { '0': 0, '1': 0, '2-4': 0, '5-9': 0, '10+': 0 };
  for (const r of results) {
    if (r.route === '/') continue;
    if (r.inbound === 0) distribution['0']++;
    else if (r.inbound === 1) distribution['1']++;
    else if (r.inbound <= 4) distribution['2-4']++;
    else if (r.inbound <= 9) distribution['5-9']++;
    else distribution['10+']++;
  }

  console.log('🔗 内部リンクグラフ最適化レポート（S-8）');
  console.log(`   静的ルート: ${results.length}件 / ソース走査: ${candidateFiles.length}ファイル\n`);
  console.log('📊 被リンク数の分布（/admin除く）:');
  console.log(`   0件: ${distribution['0']} / 1件: ${distribution['1']} / 2-4件: ${distribution['2-4']} / 5-9件: ${distribution['5-9']} / 10件以上: ${distribution['10+']}\n`);

  if (thin.length === 0) {
    console.log('✅ 被リンク数1件以下の「薄い面」は見つかりませんでした。');
  } else {
    console.log(`⚠️ 被リンク数${THIN_THRESHOLD}件以下の「薄い面」 ${thin.length}件（優先度=被リンクが少ない順）:`);
    for (const r of thin) console.log(`   ${String(r.inbound).padStart(3)}件  ${r.route}`);
    console.log('\n   → ClusterNav・RelatedToolsSection・ハブページの文脈リンクを足すと評価が届きます。');
  }

  console.log('\n参考: 全ページ被リンク数（昇順・上位30件）:');
  for (const r of results.filter((r) => r.route !== '/').slice(0, 30)) {
    console.log(`   ${String(r.inbound).padStart(3)}件  ${r.route}`);
  }
}

main();
