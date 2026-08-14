// internal-link-graph.ts: 内部リンクグラフ監査(TIER L-6→S-8)の共通ヘルパー。
// src/app/__tests__/internal-link-graph.test.tsは実アプリ全体に対してこれらの関数を
// 間接的に使っているが、pageFileToRoute(ルートグループ剥離・動的ルート除外・/api除外・
// 末尾スラッシュ処理)やcountContextualInboundLinks(正規表現エスケープ・自ファイル除外)自体の
// 純粋なロジックを制御された小さな入力で固定するテストが無かった。
// rich-results-audit.test.tsと同型のmkdtempSyncパターンを踏襲する。

import fs from 'fs';
import path from 'path';
import os from 'os';
import { walkSourceFiles, walkPageFiles, pageFileToRoute, countContextualInboundLinks } from '../internal-link-graph';

describe('pageFileToRoute', () => {
  it('appディレクトリ直下のpage.tsxはルート"/"になる', () => {
    expect(pageFileToRoute('/app', '/app/page.tsx')).toBe('/');
  });

  it('ネストしたディレクトリはそのパスがルートになる', () => {
    expect(pageFileToRoute('/app', '/app/hensachi/page.tsx')).toBe('/hensachi');
  });

  it('ルートグループ(括弧付きディレクトリ)はパスから除外される(URLに現れないため)', () => {
    expect(pageFileToRoute('/app', '/app/(marketing)/hensachi/page.tsx')).toBe('/hensachi');
  });

  it('動的ルート([code]等)を含むファイルはnullを返す(静的な内部リンクグラフの対象外)', () => {
    expect(pageFileToRoute('/app', '/app/naishin/[code]/page.tsx')).toBeNull();
  });

  it('/api配下はnullを返す', () => {
    expect(pageFileToRoute('/app', '/app/api/lead/page.tsx')).toBeNull();
  });

  it('Windowsのバックスラッシュ区切りをスラッシュへ正規化する', () => {
    expect(pageFileToRoute('C:\\app', 'C:\\app\\hensachi\\page.tsx')).toBe('/hensachi');
  });
});

describe('countContextualInboundLinks', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'internal-link-graph-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeFile(name: string, content: string): string {
    const file = path.join(tmpDir, name);
    fs.writeFileSync(file, content);
    return file;
  }

  it('href="/route"形式のリンクを1件としてカウントする', () => {
    const self = writeFile('self.tsx', 'export default function Self() {}');
    const other = writeFile('other.tsx', '<Link href="/hensachi">偏差値</Link>');
    const count = countContextualInboundLinks('/hensachi', self, [self, other]);
    expect(count).toBe(1);
  });

  it('自ファイル(selfFile)自身のリンクはカウントしない(自己参照は内部リンクと見なさない)', () => {
    const self = writeFile('self.tsx', '<Link href="/hensachi">自分自身へのリンク</Link>');
    const count = countContextualInboundLinks('/hensachi', self, [self]);
    expect(count).toBe(0);
  });

  it('href={`/route...`}やhref={\'/route\'}のようなテンプレート/シングルクォート形式も拾う', () => {
    const self = writeFile('self.tsx', '');
    const a = writeFile('a.tsx', "<Link href={'/hensachi'}>A</Link>");
    const b = writeFile('b.tsx', '<Link href={`/hensachi?ref=b`}>B</Link>');
    const count = countContextualInboundLinks('/hensachi', self, [self, a, b]);
    expect(count).toBe(2);
  });

  it('前方一致するだけの別ルート(/hensachi-koukou等)は誤検知しない', () => {
    const self = writeFile('self.tsx', '');
    const other = writeFile('other.tsx', '<Link href="/hensachi-koukou-ichiran">別ページ</Link>');
    const count = countContextualInboundLinks('/hensachi', self, [self, other]);
    expect(count).toBe(0);
  });

  it('動的URLパラメータを含む形(/hensachi/tokyo等)は境界文字があれば正しくカウントする', () => {
    const self = writeFile('self.tsx', '');
    const other = writeFile('other.tsx', '<Link href="/hensachi/tokyo">東京都</Link>');
    const count = countContextualInboundLinks('/hensachi', self, [self, other]);
    expect(count).toBe(1);
  });

  it('候補ファイルに全く出現しない場合は0を返す', () => {
    const self = writeFile('self.tsx', '');
    const other = writeFile('other.tsx', '関係ない文章');
    expect(countContextualInboundLinks('/hensachi', self, [self, other])).toBe(0);
  });
});

describe('walkSourceFiles / walkPageFiles (実ファイルシステム越しの契約)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'internal-link-graph-walk-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('walkSourceFilesはpage-registry.ts/sitemap.ts/robots.tsを参照プールから除外する(2026-07-08の準孤児事故の再発防止)', () => {
    fs.writeFileSync(path.join(tmpDir, 'normal.tsx'), 'x');
    fs.writeFileSync(path.join(tmpDir, 'page-registry.ts'), 'x');
    fs.writeFileSync(path.join(tmpDir, 'sitemap.ts'), 'x');
    fs.writeFileSync(path.join(tmpDir, 'robots.ts'), 'x');

    const found = walkSourceFiles(tmpDir);
    expect(found.some((f) => f.endsWith('normal.tsx'))).toBe(true);
    expect(found.some((f) => f.endsWith('page-registry.ts'))).toBe(false);
    expect(found.some((f) => f.endsWith('sitemap.ts'))).toBe(false);
    expect(found.some((f) => f.endsWith('robots.ts'))).toBe(false);
  });

  it('walkSourceFilesはnode_modules/.nextを除外する', () => {
    fs.mkdirSync(path.join(tmpDir, 'node_modules'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, '.next'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'node_modules', 'dep.tsx'), 'x');
    fs.writeFileSync(path.join(tmpDir, '.next', 'built.tsx'), 'x');

    const found = walkSourceFiles(tmpDir);
    expect(found.some((f) => f.includes('node_modules'))).toBe(false);
    expect(found.some((f) => f.includes('.next'))).toBe(false);
  });

  it('walkPageFilesはpage.tsxのみを再帰的に収集する', () => {
    fs.mkdirSync(path.join(tmpDir, 'foo'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'page.tsx'), 'x');
    fs.writeFileSync(path.join(tmpDir, 'foo', 'page.tsx'), 'x');
    fs.writeFileSync(path.join(tmpDir, 'foo', 'Client.tsx'), 'x');

    const found = walkPageFiles(tmpDir);
    expect(found).toHaveLength(2);
  });
});
