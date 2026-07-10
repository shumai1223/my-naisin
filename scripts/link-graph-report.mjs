#!/usr/bin/env node
/**
 * 内部リンクグラフ最適化レポート（S-8・internal-link-graph.tsの「検査」から「最適化」への昇格）。
 *
 * 既存の internal-link-graph.test.ts は「被リンク数 > 0 か」の二値判定（回帰テスト・CI用）のみ。
 * このスクリプトは同じ被リンクカウントロジック（page-registry.ts等の登録簿ファイルを参照プールから
 * 除外した文脈的リンクのみを数える＝internal-link-graph.tsのcountContextualInboundLinksと同一実装）を
 * 使い、全静的ページを被リンク数の昇順でレポートする（人間が読んで内部リンクを足す判断をするための
 * 優先順位付きリスト・報告専用でCIは壊さない＝check-orphans.mjsと同じ設計）。
 *
 * ⚠️ 制約: 被リンク検出は正規表現によるベストエフォート（href="/xxx" 等のリテラル文字列一致）。
 * href={`/${p.code}/naishin`} のような動的テンプレートリテラルは対象URLを静的解析できないため
 * リンク元としては数えられるが、リンク先の特定（ハブからの深さ計算等）は行わない
 * （不正確な深さ数値を報告して誤った判断を招くより、確実な指標である被リンク数のみに絞る）。
 *
 * 実行: node scripts/link-graph-report.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const SRC_DIR = path.join(ROOT, 'src');

const NON_NAVIGATIONAL_FILENAMES = ['page-registry.ts', 'sitemap.ts', 'robots.ts'];
const THIN_THRESHOLD = 1; // これ以下の被リンク数を「薄い面」として報告

function walk(dir, filterFn, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full, filterFn, acc);
    } else if (filterFn(full)) {
      acc.push(full);
    }
  }
  return acc;
}

function pageFileToRoute(file) {
  let rel = path.relative(APP_DIR, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  rel = rel
    .split('/')
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
    .join('/');
  const route = '/' + rel;
  if (route.startsWith('/api')) return null;
  if (route.includes('[')) return null; // 動的ルートはpage-registry対象外＝このレポートも対象外
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

function countInboundLinks(route, selfFile, candidateFiles, fileContents) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`['"\`]${escaped}(['"\`/?#])`, 'g');
  let count = 0;
  for (const file of candidateFiles) {
    if (file === selfFile) continue;
    const matches = fileContents.get(file).match(re);
    if (matches) count += matches.length;
  }
  return count;
}

function main() {
  const pageFiles = walk(APP_DIR, (f) => f.endsWith('page.tsx'));
  const routeEntries = pageFiles
    .map((file) => ({ file, route: pageFileToRoute(file) }))
    .filter((e) => e.route !== null);

  const candidateFiles = walk(SRC_DIR, (f) => /\.(tsx?|mjs|js)$/.test(f) && !NON_NAVIGATIONAL_FILENAMES.includes(path.basename(f)));
  const fileContents = new Map(candidateFiles.map((f) => [f, fs.readFileSync(f, 'utf8')]));

  const results = routeEntries.map(({ file, route }) => ({
    route,
    inbound: route === '/' ? Infinity : countInboundLinks(route, file, candidateFiles, fileContents),
  }));

  results.sort((a, b) => a.inbound - b.inbound);

  const thin = results.filter((r) => r.inbound <= THIN_THRESHOLD && r.route !== '/' && !r.route.startsWith('/admin'));
  const distribution = { 0: 0, 1: 0, '2-4': 0, '5-9': 0, '10+': 0 };
  for (const r of results) {
    if (r.route === '/') continue;
    if (r.inbound === 0) distribution[0]++;
    else if (r.inbound === 1) distribution[1]++;
    else if (r.inbound <= 4) distribution['2-4']++;
    else if (r.inbound <= 9) distribution['5-9']++;
    else distribution['10+']++;
  }

  console.log('🔗 内部リンクグラフ最適化レポート（S-8）');
  console.log(`   静的ルート: ${results.length}件 / ソース走査: ${candidateFiles.length}ファイル\n`);
  console.log('📊 被リンク数の分布（/admin除く）:');
  console.log(`   0件: ${distribution[0]} / 1件: ${distribution[1]} / 2-4件: ${distribution['2-4']} / 5-9件: ${distribution['5-9']} / 10件以上: ${distribution['10+']}\n`);

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

  process.exit(0);
}

main();
