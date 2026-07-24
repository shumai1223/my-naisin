/**
 * site-in-a-box（R-4・ZZ-7a）の純データ・純関数層。
 *
 * scripts/scaffold-site.ts（CLI本体）から分離した理由：CLI側は`import.meta.url`から
 * `__dirname`を作るESM専用パターンを使っており、ts-jest(CommonJS変換)でこのファイルを
 * 直接importすると`Identifier '__dirname' has already been declared`で構文エラーになる
 * （Node CJSラッパーが暗黙に__dirnameを注入するため）。fs/path非依存の純粋なデータ定義だけを
 * ここに置くことで、jestからは安全にimportでき、CLI側はここから読み込むだけにする。
 */

export interface ScaffoldEntry {
  /** リポジトリルートからの相対パス（コピー元＝コピー先も同じ相対パス）。 */
  path: string;
  /** そのままコピー可能か（false＝コピー先で中身をテンプレ化する必要あり）。 */
  genericAsIs: boolean;
  /** コピー後に対象サイト側でやるべきこと（1行）。 */
  todo: string;
}

/**
 * F-7の5系統分析結果（[[session-2026-07-09-f7-playbook-extraction-design]]）に基づくコピー対象。
 * 各ファイル自身に「PLAYBOOK移植メモ」コメントが付いている＝このリストと二重管理にならないよう
 * コメントの存在をscript側では前提とするだけで、内容の重複記載はしない。
 */
export const MANIFEST: ScaffoldEntry[] = [
  {
    path: 'src/lib/track.ts',
    genericAsIs: true,
    todo: 'EVENTS定数の指標名（result_view等の概念は流用可）を対象サイトの計算対象に合わせて見直す',
  },
  {
    path: 'src/lib/seasonal.ts',
    genericAsIs: true,
    todo: 'SEASON_COPYの文言を対象サイトの文脈（例: 大学受験なら予備校/オンライン塾/学費相談）に書き換える',
  },
  {
    path: 'src/lib/ev-engine.ts',
    genericAsIs: true,
    todo: '計算式は無修正でよい。実データ（CPA・転換率）は対象サイト固有のASP契約に紐づくため別ファイルへ',
  },
  {
    path: 'src/lib/lead-config-engine.ts',
    genericAsIs: true,
    todo: 'buildOfferFragmentパターンのみ流用。LeadPlacement列挙・実際のプリセット表は対象サイト固有',
  },
  {
    path: 'src/lib/internal-link-graph.ts',
    genericAsIs: true,
    todo: '内部リンク監査ロジックは無修正でよい（除外リスト等は呼び出し側=対象サイトのpage-registryが持つ）',
  },
  {
    path: 'src/lib/page-registry.ts',
    genericAsIs: false,
    todo: 'STATIC_PAGES配列を対象サイトの実ページ一覧で置き換える（構造・sitemap.ts連携パターンは流用）',
  },
  {
    path: 'src/app/__tests__/internal-link-graph.test.ts',
    genericAsIs: false,
    todo: '対象サイトの実ルート・被リンク期待値に合わせて書き換える（テストの型・アサーション方針は流用）',
  },
  {
    path: 'src/app/__tests__/dynamic-route-ssg.test.ts',
    genericAsIs: false,
    todo: '[[opennext-ssg-1102-gotcha]]のSSG回帰ガード。対象サイトの動的[xxx]ルートに合わせて調整',
  },
  {
    path: 'jest.config.js',
    genericAsIs: true,
    todo: '通常は無修正でよい（Next.js+TSの標準構成）。moduleNameMapper等の@/エイリアスのみ確認',
  },
  {
    // ZZ-7a：旧マニフェストにtsconfigが無く、@/*エイリアスが対象サイトで解決できず
    // 実際にはtsc/jestが通らなかった穴を発見・追加（DoD「生成物がtsc/jest green」の前提条件）。
    path: 'tsconfig.json',
    genericAsIs: true,
    todo: '無修正でよい（@/*→src/*のpathsエイリアスがcoreファイル群の前提）',
  },
  {
    path: 'tsconfig.jest.json',
    genericAsIs: true,
    todo: '無修正でよい（ts-jest用にjsxをreact-jsxへ上書きするだけの薄いoverride）',
  },
];

export interface SkeletonFile {
  path: string;
  content: string;
}

/** --init 時に新規生成するファイル（このリポジトリからのコピーではなく、対象サイト名に応じて都度生成）。 */
export function buildSkeletonFiles(siteName: string): SkeletonFile[] {
  return [
    {
      path: 'package.json',
      content:
        JSON.stringify(
          {
            name: siteName,
            version: '0.1.0',
            private: true,
            scripts: {
              dev: 'next dev',
              build: 'next build',
              start: 'next start',
              typecheck: 'tsc --noEmit',
              test: 'jest',
            },
            dependencies: {
              next: '^15.5.14',
              react: '^19.0.0',
              'react-dom': '^19.0.0',
            },
            devDependencies: {
              typescript: '^5.9.3',
              '@types/node': '^20.19.37',
              '@types/react': '^19.0.0',
              '@types/react-dom': '^19.0.0',
              jest: '^29.7.0',
              'jest-environment-jsdom': '^30.3.0',
              '@types/jest': '^29.5.14',
              'ts-jest': '^29.1.2',
            },
          },
          null,
          2
        ) + '\n',
    },
    {
      // next buildを一度も走らせていない新規プロジェクトの状態（.next/types/routes.d.tsへの
      // 参照は無し）。初回 next dev/build 時にNext.js自身がこのファイルを書き換える。
      path: 'next-env.d.ts',
      content:
        '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n' +
        '// NOTE: This file should not be edited\n// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.\n',
    },
    {
      path: 'next.config.mjs',
      content:
        '/** サイト非依存の最小構成。対象サイト固有のredirects/画像最適化等はここに追記していく。 */\n' +
        'const nextConfig = {\n  reactStrictMode: true,\n};\n\nexport default nextConfig;\n',
    },
    {
      path: 'src/app/layout.tsx',
      content:
        "import type { Metadata } from 'next';\nimport type { ReactNode } from 'react';\n\n" +
        "import './globals.css';\n\n" +
        `export const metadata: Metadata = {\n  title: '${siteName}',\n  description: 'TODO: サイトの説明文を書く',\n};\n\n` +
        'export default function RootLayout({ children }: { children: ReactNode }) {\n' +
        "  return (\n    <html lang=\"ja\">\n      <body>{children}</body>\n    </html>\n  );\n}\n",
    },
    {
      path: 'src/app/page.tsx',
      content:
        `export default function HomePage() {\n  return (\n    <main>\n      <h1>${siteName}</h1>\n      <p>site-in-a-box（ZZ-7a）で生成した骨格です。ここから実装を始めてください。</p>\n    </main>\n  );\n}\n`,
    },
    {
      path: 'src/app/globals.css',
      content: '/* TODO: Tailwind等のスタイル基盤をここに追加する（scaffold-siteはtsc/jestの土台のみ生成） */\n',
    },
    {
      path: '.gitignore',
      content: 'node_modules/\n.next/\n*.tsbuildinfo\ncoverage/\n',
    },
  ];
}
