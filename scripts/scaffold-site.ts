/**
 * site-in-a-box CLIスキャフォールド（R-4・PLAYBOOKテンプレ化）。
 *
 * F-7（2026-07-09設計・2026-07-10承認・全5ステップ実行完了）で切り出した
 * 「サイト非依存の核（core）」ファイル群を、新規サイト（3サイト目以降）のリポジトリへ
 * コピーする作業を自動化する。目的＝第3サイトの着工コストを1/10に下げる。
 *
 *   npx tsx scripts/scaffold-site.ts                       # dry-run: コピー対象と要作業を表示するだけ（既定・安全）
 *   npx tsx scripts/scaffold-site.ts --target=../my-newsite # 実際にコピー（既存ファイルは既定でスキップ）
 *   npx tsx scripts/scaffold-site.ts --target=../my-newsite --force # 既存ファイルも上書き
 *
 * 安全設計：
 *  - --target 未指定は常に dry-run（他ディレクトリへの誤書き込みを防ぐ）。
 *  - 既存ファイルは既定でスキップ（対象サイトが既に独自進化させたファイルを破壊しない）。
 *    my-shingakuは実際にlead-config-engine.ts等をコピーせず独自実装(leads.ts等)で進化しており
 *    （[[session-2026-07-09-f7-playbook-extraction-design]]の想定通り「コピー元として扱い、
 *    各サイトは独立に進化してよい」）、このCLIも「必要な時に使えるコピー元」を提供するだけで、
 *    既存サイトへの強制同期はしない。
 *  - --target がこのリポジトリ自身（my-naisin）を指す場合は誤操作防止のため必ず拒否する。
 */

import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

interface ScaffoldEntry {
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
const MANIFEST: ScaffoldEntry[] = [
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
];

function main() {
  const target = arg('target');
  const force = process.argv.includes('--force');

  console.log('=== site-in-a-box スキャフォールド（R-4） ===\n');
  console.log(`コピー対象: ${MANIFEST.length}ファイル（F-7で切り出したサイト非依存の核）\n`);

  if (!target) {
    console.log('--target 未指定のため dry-run（一覧表示のみ・書き込みなし）:\n');
    for (const e of MANIFEST) {
      console.log(`  [${e.genericAsIs ? 'そのまま可' : '要テンプレ化'}] ${e.path}`);
      console.log(`      → ${e.todo}`);
    }
    console.log('\n実際にコピーするには --target=<新規サイトのパス> を指定してください。');
    return;
  }

  const targetAbs = resolve(target);
  if (targetAbs === REPO_ROOT) {
    console.error('✗ --target が自分自身（my-naisin）を指しています。誤操作防止のため中止しました。');
    process.exit(1);
  }

  let copied = 0;
  let skipped = 0;
  const todos: string[] = [];

  for (const e of MANIFEST) {
    const srcPath = join(REPO_ROOT, e.path);
    const destPath = join(targetAbs, e.path);
    if (!existsSync(srcPath)) {
      console.log(`✗ コピー元が見つかりません（スキップ）: ${e.path}`);
      continue;
    }
    if (existsSync(destPath) && !force) {
      console.log(`- skip（既存ファイルを保持・--forceで上書き可）: ${e.path}`);
      skipped++;
      continue;
    }
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(srcPath, destPath);
    console.log(`✓ copied: ${e.path}`);
    copied++;
    todos.push(`  - ${e.path}: ${e.todo}`);
  }

  console.log(`\n完了: ${copied}件コピー・${skipped}件スキップ（既存保持）。`);
  if (todos.length > 0) {
    console.log('\n■ コピー後にやること（対象サイト固有の内容を埋める）:');
    for (const t of todos) console.log(t);
  }
}

main();

// テスト容易性のため主要データをexport（main()自体は副作用があるためexportしない）。
export { MANIFEST };
