// rich-results-audit.ts: リッチリザルト網羅監査(TIER L-2)の共通ヘルパー。
// rich-results-*.test.tsから実アプリ全体に対して間接的に使われているが、
// 関数自身の純粋なロジック(パス正規化・正規表現マッチング・兄弟ファイル合算)は
// 制御された小さな入力での単体テストが無かった。特にrouteFromFileのWindowsバックスラッシュ
// 正規化(このリポジトリはWindows環境)とeffectiveContentの「page.tsx+兄弟.tsx合算」は
// 2026-07-08の重複BreadcrumbSchema事故の再発防止の核心ロジックのため固定しておく価値がある。

import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  walkPageFiles,
  routeFromFile,
  effectiveContent,
  countJsxUsages,
  countSchemaUsages,
} from '../rich-results-audit';

describe('routeFromFile', () => {
  it('appディレクトリ直下のpage.tsxはルート"/"になる', () => {
    expect(routeFromFile('/app', '/app/page.tsx')).toBe('/');
  });

  it('ネストしたディレクトリはそのパスがルートになる', () => {
    expect(routeFromFile('/app', '/app/hensachi/page.tsx')).toBe('/hensachi');
  });

  it('動的ルートの角括弧セグメントもそのまま保持される', () => {
    expect(routeFromFile('/app', '/app/naishin/[code]/page.tsx')).toBe('/naishin/[code]');
  });

  it('Windowsのバックスラッシュ区切りをスラッシュへ正規化する', () => {
    expect(routeFromFile('C:\\app', 'C:\\app\\hensachi\\page.tsx')).toBe('/hensachi');
  });
});

describe('countJsxUsages', () => {
  it('対象タグの出現回数を数える', () => {
    const content = '<BreadcrumbSchema a={1} />\nsomething\n<BreadcrumbSchema b={2} />';
    expect(countJsxUsages('BreadcrumbSchema', content)).toBe(2);
  });

  it('前方一致するだけの別タグ名は誤検知しない(単語境界)', () => {
    const content = '<BreadcrumbSchemaExtra />';
    expect(countJsxUsages('BreadcrumbSchema', content)).toBe(0);
  });

  it('出現しない場合は0', () => {
    expect(countJsxUsages('FaqSchema', 'no schema here')).toBe(0);
  });
});

describe('countSchemaUsages', () => {
  it('JSXコンポーネントと生JSON-LDの@typeを合算して数える', () => {
    const content = `<HowToSchema />\nconst json = { '@type': 'HowTo' };`;
    expect(countSchemaUsages('HowToSchema', 'HowTo', content)).toBe(2);
  });

  it('どちらも無ければ0', () => {
    expect(countSchemaUsages('HowToSchema', 'HowTo', 'nothing relevant')).toBe(0);
  });

  it('JSON-LDのみ(コンポーネント未使用)でも検出する(ホームページのDatasetSchema型実装に対応)', () => {
    const content = `<script type="application/ld+json">{"@type": "Dataset"}</script>`;
    expect(countSchemaUsages('DatasetSchema', 'Dataset', content)).toBe(1);
  });
});

describe('walkPageFiles / effectiveContent (実ファイルシステム越しの契約)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rich-results-audit-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('page.tsxのみを再帰的に収集し、node_modules/.nextは除外する', () => {
    fs.mkdirSync(path.join(tmpDir, 'foo'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'node_modules', 'ignored'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, '.next', 'ignored'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'page.tsx'), 'root');
    fs.writeFileSync(path.join(tmpDir, 'foo', 'page.tsx'), 'foo');
    fs.writeFileSync(path.join(tmpDir, 'foo', 'Client.tsx'), 'client');
    fs.writeFileSync(path.join(tmpDir, 'node_modules', 'ignored', 'page.tsx'), 'should not appear');
    fs.writeFileSync(path.join(tmpDir, '.next', 'ignored', 'page.tsx'), 'should not appear');

    const found = walkPageFiles(tmpDir);
    expect(found).toHaveLength(2);
    expect(found.some((f) => f.endsWith(path.join('foo', 'page.tsx')))).toBe(true);
    expect(found.some((f) => f.includes('node_modules'))).toBe(false);
    expect(found.some((f) => f.includes('.next'))).toBe(false);
  });

  it('effectiveContentはpage.tsx本体+同ディレクトリの兄弟.tsxを結合する(2026-07-08の重複事故の再発防止ロジック)', () => {
    const dir = path.join(tmpDir, 'guide');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'page.tsx'), 'export default function Page() {}');
    fs.writeFileSync(path.join(dir, 'GuideClient.tsx'), '<BreadcrumbSchema />');
    fs.writeFileSync(path.join(dir, 'notes.txt'), '<BreadcrumbSchema />'); // .tsx以外は対象外

    const content = effectiveContent(path.join(dir, 'page.tsx'));
    expect(content).toContain('export default function Page');
    expect(countJsxUsages('BreadcrumbSchema', content)).toBe(1); // .txtは合算されない
  });
});
