/**
 * site-in-a-box CLI（R-4・ZZ-7a）の契約テスト。
 *
 * テスト対象はsrc/lib/scaffold-site-manifest.tsの純データ・純関数（scripts/scaffold-site.ts
 * 本体は`import.meta.url`ベースのESM専用__dirname解決を使っており、ts-jestのCommonJS変換で
 * 直接importすると`Identifier '__dirname' has already been declared`で構文エラーになるため、
 * テスト可能なロジックはあらかじめ純データ層へ分離してある）。
 *
 * DoD「生成物がtsc/jest green」の検証は、実際のnpm installを伴う別プロセスのtsc/jest実行を
 * このテスト環境（ネットワーク/実行時間が不確実）では行わず、代わりにTypeScriptコンパイラAPIの
 * transpileModule（型解決を伴わない単一ファイルの構文チェック）で生成コードの構文的正しさを
 * 機械的に検証する。
 */
import ts from 'typescript';
import { MANIFEST, buildSkeletonFiles } from '@/lib/scaffold-site-manifest';

describe('MANIFEST（既存プロジェクトへコピーするcoreファイル一覧）', () => {
  test('tsconfig.json・tsconfig.jest.jsonが含まれる(ZZ-7aで追加：無いと@/*エイリアスが解決できずtsc/jestが通らなかった穴)', () => {
    const paths = MANIFEST.map((e) => e.path);
    expect(paths).toContain('tsconfig.json');
    expect(paths).toContain('tsconfig.jest.json');
  });

  test('track/seasonal/page-registry/ev-engine/lead-configがDoD通り同梱されている', () => {
    const paths = MANIFEST.map((e) => e.path);
    expect(paths).toContain('src/lib/track.ts');
    expect(paths).toContain('src/lib/seasonal.ts');
    expect(paths).toContain('src/lib/page-registry.ts');
    expect(paths).toContain('src/lib/ev-engine.ts');
    expect(paths).toContain('src/lib/lead-config-engine.ts');
  });
});

describe('buildSkeletonFiles（--initで新規生成する骨格ファイル）', () => {
  const files = buildSkeletonFiles('my-new-site');

  test('package.json/next-env.d.ts/next.config.mjs/layout.tsx/page.tsx/globals.css/.gitignoreの7件を生成する', () => {
    const paths = files.map((f) => f.path);
    expect(paths).toEqual([
      'package.json',
      'next-env.d.ts',
      'next.config.mjs',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      '.gitignore',
    ]);
  });

  test('package.jsonは有効なJSONで、tsc/jestに必要な依存が揃っている', () => {
    const pkgFile = files.find((f) => f.path === 'package.json')!;
    const pkg = JSON.parse(pkgFile.content);
    expect(pkg.name).toBe('my-new-site');
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
    expect(pkg.devDependencies.jest).toBeDefined();
    expect(pkg.devDependencies['ts-jest']).toBeDefined();
    expect(pkg.devDependencies['jest-environment-jsdom']).toBeDefined();
    expect(pkg.scripts.typecheck).toBe('tsc --noEmit');
    expect(pkg.scripts.test).toBe('jest');
  });

  test('next-env.d.tsはビルド前の状態(存在しない.next/types/routes.d.tsを参照しない)', () => {
    const content = files.find((f) => f.path === 'next-env.d.ts')!.content;
    expect(content).not.toContain('routes.d.ts');
    expect(content).toContain('reference types="next"');
  });

  test('サイト名がlayout.tsx(title)とpage.tsx(見出し)の両方に反映される', () => {
    const layout = files.find((f) => f.path === 'src/app/layout.tsx')!.content;
    const page = files.find((f) => f.path === 'src/app/page.tsx')!.content;
    expect(layout).toContain('my-new-site');
    expect(page).toContain('my-new-site');
  });

  test('生成した.ts/.tsxファイルはTypeScript(JSX込み)として構文的に正しい(transpileModuleでエラー0件)', () => {
    for (const f of files) {
      if (!f.path.endsWith('.ts') && !f.path.endsWith('.tsx')) continue;
      const result = ts.transpileModule(f.content, {
        reportDiagnostics: true,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      });
      const syntaxErrors = (result.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
      expect({ path: f.path, errors: syntaxErrors.map((e) => e.messageText) }).toEqual({ path: f.path, errors: [] });
    }
  });
});
