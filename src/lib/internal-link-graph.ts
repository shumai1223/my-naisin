/**
 * 内部リンクグラフ監査（TIER L-6）用の共通ヘルパー。
 *
 * 既存の check-orphans.mjs は SRC_DIR 配下の全ファイルを参照プールに含めていたため、
 * src/lib/page-registry.ts（sitemap.ts が読む全ルートの文字列リテラル配列）自体が
 * 「そのページへの内部リンク」として誤カウントされ、実際にはどのページ・コンポーネントからも
 * クリックで辿れない「準孤児」ページを検知できないという穴があった
 * （2026-07-08判明：/katei-kyoshi・/partner の2ページが該当。page-registry.tsとsitemap.xml
 * にしか存在せず、ユーザーはもちろんリンクを辿るクローラーからも実質的に発見不能だった）。
 *
 * このモジュールは page-registry.ts / sitemap.ts / robots.ts のような「登録簿・データ専用」
 * ファイルを参照プールから除外し、実際にレンダリングされるページ・コンポーネントからの
 * 文脈的な内部リンクのみをカウントする。
 */
import fs from 'fs';
import path from 'path';

/** 全ルート文字列を列挙するが実際には描画されない「登録簿・データ専用」ファイル名。 */
const NON_NAVIGATIONAL_FILENAMES = ['page-registry.ts', 'sitemap.ts', 'robots.ts'];

export function walkSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walkSourceFiles(full, acc);
    } else if (/\.(tsx?|mjs|js)$/.test(entry.name) && !NON_NAVIGATIONAL_FILENAMES.includes(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

export function walkPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walkPageFiles(full, acc);
    } else if (entry.name === 'page.tsx') {
      acc.push(full);
    }
  }
  return acc;
}

/** page.tsx のファイルパス → ルート（/about など）。動的/APIは null。 */
export function pageFileToRoute(appDir: string, file: string): string | null {
  let rel = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  rel = rel
    .split('/')
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
    .join('/');
  const route = '/' + rel;
  if (route.startsWith('/api')) return null;
  if (route.includes('[')) return null;
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

/**
 * 指定ルートへの文脈的な内部リンク数（自ページファイルは除外・登録簿ファイルは参照プール対象外済み）。
 * href="/xxx" / href={`/xxx...`} / href={'/xxx'} のいずれの形でも拾えるようゆるめに前方一致させる。
 */
export function countContextualInboundLinks(route: string, selfFile: string, candidateFiles: string[]): number {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`['"\`]${escaped}(['"\`/?#])`);
  let count = 0;
  for (const file of candidateFiles) {
    if (file === selfFile) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (re.test(content)) count++;
  }
  return count;
}
