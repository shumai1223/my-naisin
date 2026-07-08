/**
 * 動的ルート（[param]）の発見可能性監査（TIER L・P-1で発見した/pref/[code]級の見落とし対策）。
 *
 * 背景: /pref/[code]（47県）がsitemap.tsに一切登録されておらず、サイト内のどこからも
 * リンクされていない完全な孤立ページ群だった（2026-07-09発覚）。既存のcheck-orphans.mjsや
 * internal-link-graph.test.tsは静的page.tsx（route.includes('[')を除外）のみを対象にしており、
 * 動的ルートはそもそも監査対象外という盲点があった。
 *
 * このモジュールは動的ルートの「静的な経路セグメント」（例: /pref/[code] なら 'pref'）が
 * sitemap.tsのソーステキストと、他の実コンポーネントファイルの両方に文字列として現れるかを
 * 確認する（internal-link-graph.tsと同じ「テキスト走査」方式）。完全な数学的検証ではなく、
 * 「明らかな見落とし」を検知する網としての位置づけ（false negativeよりfalse positiveを避ける
 * 設計＝厳密性より運用しやすさを優先）。
 */
import fs from 'fs';
import path from 'path';

function walkAllPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walkAllPageFiles(full, acc);
    } else if (entry.name === 'page.tsx') {
      acc.push(full);
    }
  }
  return acc;
}

/** 動的ルート（パスに [param] を含む）の page.tsx のみを返す。 */
export function walkDynamicPageFiles(dir: string): string[] {
  return walkAllPageFiles(dir).filter((f) => f.includes('['));
}

export function routeFromDynamicFile(appDir: string, file: string): string {
  const rel = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  return '/' + rel;
}

/** ルートの「静的セグメント」（[param]部分を除いたパス片）を '/' 区切りで返す。 */
export function staticSegmentsOf(route: string): string[] {
  return route.split('/').filter((seg) => seg !== '' && !seg.startsWith('['));
}

/**
 * 静的セグメントの結合文字列が、単一のソーステキスト（sitemap.ts等）に
 * 「文字列リテラルの一部として」現れるか（segmentsAppearInと同じ精度パターン）。
 */
export function segmentsAppearInText(segments: string[], content: string): boolean {
  if (segments.length === 0) return true;
  const needle = segments.join('/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`['"\`/]${needle}(['"\`/?#]|$)`);
  return re.test(content);
}

/**
 * 静的セグメントを含むURLが、sitemap()の実際の出力（生成方式に依らない＝
 * STATIC_PAGES個別列挙・PREFECTURES.map()動的生成のどちらでも検知できる）に存在するか。
 */
export function segmentsCoveredBySitemapUrls(segments: string[], urls: string[]): boolean {
  if (segments.length === 0) return true;
  const needle = '/' + segments.join('/');
  return urls.some((u) => u.includes(needle));
}

/**
 * 静的セグメントの結合文字列（例: 'pref' や 'hensachi/kyoka-betsu'）が、指定したファイル群の
 * いずれかのソーステキストに「文字列リテラルの一部として」現れるか。
 * 単純な部分一致だと 'pref' が 'prefecture' のような無関係な単語にも誤マッチするため、
 * 直前に引用符・バッククォート・スラッシュのいずれかが来ることを要求する
 * （internal-link-graph.tsのcountContextualInboundLinksと同じ精度パターン）。
 */
export function segmentsAppearIn(segments: string[], files: { path: string; content: string }[], excludeFiles: string[] = []): boolean {
  if (segments.length === 0) return true; // 静的セグメントが無いルート（例: /[prefecture]単体）は対象外
  const needle = segments.join('/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`['"\`/]${needle}(['"\`/?#]|$)`);
  return files.some(({ path: p, content }) => !excludeFiles.some((ex) => p.endsWith(ex)) && re.test(content));
}
