#!/usr/bin/env node
/**
 * オーファンページ検出（内部リンク・情報設計 §7）。
 *
 * src/app 配下の静的ページ（page.tsx）を列挙し、ソース内のどこからも内部リンクされていない
 * ルートを「オーファン候補」として報告する。評価（リンクジュース）が届かず埋もれている面の発見用。
 *
 * 方針:
 *  - 動的ルート（[code] など）・APIルート・グループ((group))は対象外（または除外して評価）。
 *  - 参照の検出は href="..." / href={`...`} / href={'...'} / sitemap.ts の url 文字列を広く拾う best-effort。
 *  - 誤検出を避けるため、判定はゆるめ（前方一致も許容）。CIを壊さないよう常に exit 0（報告のみ）。
 *
 * 実行: node scripts/check-orphans.mjs  /  npm run check:orphans
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const SRC_DIR = path.join(ROOT, 'src');

/** 再帰的にファイルを集める。 */
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

/** page.tsx のファイルパス → ルート（/about など）。動的/APIは null。 */
function pageFileToRoute(file) {
  let rel = path.relative(APP_DIR, file).replace(/\\/g, '/');
  rel = rel.replace(/\/?page\.tsx$/, '');
  // ルートグループ (group) はURLに出ないので除去
  rel = rel
    .split('/')
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
    .join('/');
  const route = '/' + rel;
  if (route.startsWith('/api')) return null; // APIは対象外
  if (route.includes('[')) return null; // 動的ルートは対象外
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

function main() {
  const pageFiles = walk(APP_DIR, (f) => f.endsWith(path.sep + 'page.tsx') || f.endsWith('/page.tsx'));
  const routes = [...new Set(pageFiles.map(pageFileToRoute).filter(Boolean))];

  // 全ソースの文字列を結合（参照プールを作る）
  const srcFiles = walk(SRC_DIR, (f) => /\.(tsx?|mjs|js)$/.test(f));
  const haystack = srcFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

  // 意図的に内部リンクしないルート（認証付き管理・noindex）。SEO評価を届ける必要が無いので除外。
  const orphans = [];
  for (const route of routes) {
    if (route === '/') continue; // ホームは常にリンクされている扱い
    if (route.startsWith('/admin')) continue; // 管理ページ（認証・noindex）はリンクしない設計
    // route がどこかに文字列として現れるか（href, sitemap, Link など）。
    // 前方一致も許容（/about → /about/editor-profile からの逆流は無視したいので境界をチェック）。
    const re = new RegExp(`['"\`]${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"\`/?#])`);
    if (!re.test(haystack)) orphans.push(route);
  }

  console.log('🔗 オーファンページ検出（内部リンク監査）');
  console.log(`   静的ルート: ${routes.length}件 / ソース走査: ${srcFiles.length}ファイル`);
  if (orphans.length === 0) {
    console.log('✅ オーファン候補は見つかりませんでした（全静的ページが内部リンクされています）');
  } else {
    console.log(`⚠️ オーファン候補 ${orphans.length}件（どこからも内部リンクされていない可能性）:`);
    for (const o of orphans.sort()) console.log(`   - ${o}`);
    console.log('   → 関連ページの RelatedToolsSection / フッター / パンくず から内部リンクを足すと評価が届きます。');
  }
  // 報告のみ。CIを壊さないため常に成功で終了。
  process.exit(0);
}

main();
