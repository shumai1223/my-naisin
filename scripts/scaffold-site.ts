/**
 * site-in-a-box CLIスキャフォールド（R-4・PLAYBOOKテンプレ化。ZZ-7aで1コマンド新規サイト骨格生成に拡張）。
 *
 * F-7（2026-07-09設計・2026-07-10承認・全5ステップ実行完了）で切り出した
 * 「サイト非依存の核（core）」ファイル群を、新規サイト（3サイト目以降）のリポジトリへ
 * コピーする作業を自動化する。目的＝第3サイトの着工コストを1/10に下げる。
 *
 *   npx tsx scripts/scaffold-site.ts                       # dry-run: コピー対象と要作業を表示するだけ（既定・安全）
 *   npx tsx scripts/scaffold-site.ts --target=../my-newsite # 既存プロジェクトへcoreファイルをコピー（既存ファイルは既定でスキップ）
 *   npx tsx scripts/scaffold-site.ts --target=../my-newsite --init # ゼロから新規プロジェクト骨格を1コマンド生成
 *   npx tsx scripts/scaffold-site.ts --target=../my-newsite --init --force # 既存ファイルも上書き
 *
 * --init（ZZ-7a新設）：package.json/tsconfig.json/tsconfig.jest.json/next-env.d.ts/next.config.mjs/
 * src/app/layout.tsx・page.tsx・globals.css/.gitignore を新規生成し、`npm install`後に
 * `npx tsc --noEmit`・`npx jest` がそのまま通る最小の動くNext.jsプロジェクトを作る
 * （DoD＝生成物がtsc/jest green）。既存プロジェクトへcoreファイルだけ追加したい場合は
 * --init を付けなければ従来通りMANIFESTのコピーのみ行う。
 *
 * MANIFEST・buildSkeletonFiles の実体は src/lib/scaffold-site-manifest.ts にある
 * （このファイルはESM専用の`import.meta.url`ベース__dirname解決を使うため、CommonJS変換の
 * ts-jestから直接importすると構文エラーになる＝テスト対象のロジックは純データ層へ分離済み）。
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

import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';

import { MANIFEST, buildSkeletonFiles } from '@/lib/scaffold-site-manifest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function main() {
  const target = arg('target');
  const force = process.argv.includes('--force');
  const init = process.argv.includes('--init');

  console.log('=== site-in-a-box スキャフォールド（R-4・ZZ-7a） ===\n');
  console.log(`コピー対象: ${MANIFEST.length}ファイル（F-7で切り出したサイト非依存の核）\n`);

  if (!target) {
    console.log('--target 未指定のため dry-run（一覧表示のみ・書き込みなし）:\n');
    for (const e of MANIFEST) {
      console.log(`  [${e.genericAsIs ? 'そのまま可' : '要テンプレ化'}] ${e.path}`);
      console.log(`      → ${e.todo}`);
    }
    if (init) {
      console.log(`\n--init 新規生成ファイル: ${buildSkeletonFiles('your-site-name').length}件`);
      for (const f of buildSkeletonFiles('your-site-name')) {
        console.log(`  [新規生成] ${f.path}`);
      }
    }
    console.log('\n実際に生成するには --target=<新規サイトのパス> を指定してください（--initでゼロから骨格生成）。');
    return;
  }

  const targetAbs = resolve(target);
  if (targetAbs === REPO_ROOT) {
    console.error('✗ --target が自分自身（my-naisin）を指しています。誤操作防止のため中止しました。');
    process.exit(1);
  }

  let generated = 0;
  let copied = 0;
  let skipped = 0;
  const todos: string[] = [];

  if (init) {
    const siteName = basename(targetAbs);
    for (const f of buildSkeletonFiles(siteName)) {
      const destPath = join(targetAbs, f.path);
      if (existsSync(destPath) && !force) {
        console.log(`- skip（既存ファイルを保持・--forceで上書き可）: ${f.path}`);
        skipped++;
        continue;
      }
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, f.content, 'utf8');
      console.log(`✓ generated: ${f.path}`);
      generated++;
    }
  }

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

  console.log(`\n完了: ${generated}件生成・${copied}件コピー・${skipped}件スキップ（既存保持）。`);
  if (init) {
    console.log('\n次にやること: cd ' + target + ' && npm install && npm run typecheck && npm test');
  }
  if (todos.length > 0) {
    console.log('\n■ コピー後にやること（対象サイト固有の内容を埋める）:');
    for (const t of todos) console.log(t);
  }
}

main();
