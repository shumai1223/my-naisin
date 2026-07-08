/**
 * リッチリザルト網羅監査（TIER L-2）用の共通ヘルパー。
 *
 * このリポジトリは `app/xxx/page.tsx` が同じディレクトリの `XxxClient.tsx` 等に
 * 描画を委譲するパターンが多い。page.tsx単体だけを見ると実装済みのschemaを
 * 「無い」と誤検知し、重複追加してしまう事故が実際に発生した
 * （2026-07-08・comparison/glossary/guide/reverseの4面でBreadcrumbSchema重複）。
 * そのため判定は必ず page.tsx + 同ディレクトリの兄弟.tsxファイルを合算した内容で行うこと。
 */
import fs from 'fs';
import path from 'path';

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

export function routeFromFile(appDir: string, file: string): string {
  const rel = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  return '/' + rel;
}

/** page.tsxが委譲する同ディレクトリの兄弟.tsxファイルも含めた実質的な描画内容を返す。 */
export function effectiveContent(file: string): string {
  const dir = path.dirname(file);
  const pageContent = fs.readFileSync(file, 'utf8');
  const siblingContents = fs
    .readdirSync(dir)
    .filter((f) => f !== 'page.tsx' && f.endsWith('.tsx'))
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'));
  return [pageContent, ...siblingContents].join('\n');
}

export function countJsxUsages(tagName: string, content: string): number {
  const re = new RegExp(`<${tagName}\\b`, 'g');
  const matches = content.match(re);
  return matches ? matches.length : 0;
}

/**
 * JSXコンポーネント使用 + 生JSON-LD（`'@type': 'HowTo'`等）の両方を数える。
 * ホームページのDatasetSchemaのように、専用コンポーネントを使わず<script>で
 * 直接JSON-LDを埋め込む実装が実在するため（component検索だけだと偽陰性になる）。
 */
export function countSchemaUsages(componentTag: string, atType: string, content: string): number {
  const componentCount = countJsxUsages(componentTag, content);
  const inlineRe = new RegExp(`@type['"]?\\s*:\\s*['"]${atType}['"]`, 'g');
  const inlineMatches = content.match(inlineRe);
  const inlineCount = inlineMatches ? inlineMatches.length : 0;
  return componentCount + inlineCount;
}
