#!/usr/bin/env -S npx tsx
/**
 * T-PV2 A-4: 承認コマンド。新年度（令和9年度）の倍率を「取り込み → 検算(A-3) → jest・tsc → commit」まで
 * 1コマンドで通し、「このコミットをpushしてよいか」の要約を出して止まる。**pushは絶対にしない**（👤が承認してから）。
 *
 * 使い方:
 *   npx tsx scripts/bairitsu-ingest/approve-new-year.ts <県コード> <PDFパス> <ページ,...> \
 *     --source-url <PDFのURL> --doc-title <資料名> --published <YYYY-MM-DD> [--dry-run] [--skip-tsc] [--year-label <ラベル>]
 *   --dry-run : 最後に全て巻き戻す（予行）。コミットしない。
 *   --skip-tsc: tscを飛ばす（予行専用。本番の承認では使わない）。
 *
 * 流れ（どこで落ちても何も残さない＝書いたファイルを巻き戻す）:
 *   0 事前確認(作業ツリー・未登録)  1 PDF→パース  2 検算(verify-new-year)  3 新年度ファイル生成+登録
 *   4 形式チェック(validateNextYearFile)  5 jest  6 tsc  7 commit(または巻き戻し)
 *
 * 新年度のデータは src/data/competition-rates-next/<県>.ts に置く（旧ファイルは書き換えない）。
 * 登録を外せば元に戻る。合成の仕組みは src/lib/competition-rate-overlay.ts。
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { getPrefectureParser } from '@/lib/bairitsu-ingest/registry';
import type { ParsedCompetitionRow } from '@/lib/bairitsu-ingest/parse-table-pdf';
import { validateNextYearFile } from '@/lib/competition-rate-overlay';

import { ROOT, extractPageGeometry, loadBaseFile, printVerification, runNewYearVerification } from './lib/new-year-io';

const DEFAULT_YEAR_LABEL = '令和9年度（2027年度）';
// jest は「公開用マップ(competition-rates/index.ts)・登録簿・合成関数に（推移的にでも）依存する全テスト」を回す。
const JEST_SCOPE_LABEL = '公開用マップに依存する全テスト(--findRelatedTests)';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(name);

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function q(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function nowJstDate(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

interface StepLog {
  name: string;
  sec: number;
}
const steps: StepLog[] = [];
function timed<T>(name: string, fn: () => T): T {
  const t0 = Date.now();
  try {
    return fn();
  } finally {
    steps.push({ name, sec: Math.round((Date.now() - t0) / 100) / 10 });
  }
}

function buildNextFileSource(p: {
  prefectureCode: string;
  rows: ParsedCompetitionRow[];
  sums: { quota: number; finalApplicants: number };
  matchedLine: string;
  sourceUrl: string;
  docTitle: string;
  published: string;
  yearLabel: string;
  sha256: string;
  coverage: { status: 'partial' | 'complete'; includedDepartments: string[]; pendingDepartments: string[]; note: string };
  summaryComment: string;
}): string {
  const label = p.matchedLine.split(/[\d０-９]/)[0].replace(/\s+/g, ' ').trim() || '資料の合計行';
  const lines: string[] = [];
  lines.push('/**');
  lines.push(` * ${p.prefectureCode} ${p.yearLabel} 倍率（新年度オーバーレイ・T-PV2 A-4で自動生成）。`);
  lines.push(' *');
  lines.push(` * 一次ソース: ${p.docTitle}`);
  lines.push(` * ${p.sourceUrl}`);
  lines.push(` * 公表日: ${p.published}（取得日 ${nowJstDate()}・PDF SHA-256 ${p.sha256}）`);
  lines.push(` * 検算: 機械集計(募集${p.sums.quota}/志願${p.sums.finalApplicants})が資料の合計行「${p.matchedLine.replace(/\*\//g, '* /')}」に一致。`);
  lines.push(` * ${p.summaryComment}`);
  lines.push(' * 倍率は資料の転記（計算しない・Y-0）。このファイルを登録簿から外せば令和8年度表示に戻る。');
  lines.push(' */');
  lines.push("import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';");
  lines.push('');
  lines.push(`export const ${p.prefectureCode.toUpperCase()}_COMPETITION_RATES_NEXT: PrefectureCompetitionRateFile = {`);
  lines.push(`  prefectureCode: ${q(p.prefectureCode)},`);
  lines.push('  sources: [');
  lines.push('    {');
  lines.push(`      url: ${q(p.sourceUrl)},`);
  lines.push(`      docTitle: ${q(p.docTitle)},`);
  lines.push(`      fiscalYear: ${q(p.yearLabel)},`);
  lines.push(`      fetchedAt: ${q(nowJstDate())},`);
  lines.push(`      pdfSha256: ${q(p.sha256)},`);
  lines.push('    },');
  lines.push('  ],');
  lines.push('  coverage: {');
  lines.push(`    status: ${q(p.coverage.status)},`);
  lines.push(`    includedDepartments: [${p.coverage.includedDepartments.map(q).join(', ')}],`);
  lines.push(`    pendingDepartments: [${p.coverage.pendingDepartments.map(q).join(', ')}],`);
  lines.push(`    note: ${q(p.coverage.note)},`);
  lines.push('  },');
  lines.push('  officialSubtotals: [');
  lines.push(`    { label: ${q(label)}, quota: ${p.sums.quota}, finalApplicants: ${p.sums.finalApplicants} },`);
  lines.push('  ],');
  lines.push('  records: [');
  for (const r of p.rows) {
    const loc = r.page !== undefined && r.rowIndex !== undefined ? `, page: ${r.page}, rowIndex: ${r.rowIndex}` : '';
    lines.push(
      `    { schoolName: ${q(r.schoolName)}, department: ${q(r.department)}, quota: ${r.quota}, finalApplicants: ${r.finalApplicants}, finalRate: ${r.finalRate}${loc} },`
    );
  }
  lines.push('  ],');
  lines.push('};');
  lines.push('');
  return lines.join('\n');
}

function registerInIndex(indexPath: string, prefectureCode: string): void {
  const raw = readFileSync(indexPath, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const importLine = `import { ${prefectureCode.toUpperCase()}_COMPETITION_RATES_NEXT } from './${prefectureCode}';`;
  const entryLine = `  ${prefectureCode}: ${prefectureCode.toUpperCase()}_COMPETITION_RATES_NEXT,`;
  if (raw.includes(importLine)) throw new Error(`${prefectureCode} は登録簿に既にある`);
  if (!raw.includes('// @next-imports') || !raw.includes('  // @next-entries')) throw new Error('登録簿のマーカーが見つからない');
  const out = raw
    .replace('// @next-imports', `${importLine}${eol}// @next-imports`)
    .replace('  // @next-entries', `${entryLine}${eol}  // @next-entries`);
  writeFileSync(indexPath, out, 'utf8');
}

function main(): number {
  const [prefectureCode, pdfPath, pageArg] = process.argv.slice(2);
  const sourceUrl = arg('--source-url');
  const docTitle = arg('--doc-title');
  const published = arg('--published');
  const yearLabel = arg('--year-label') ?? DEFAULT_YEAR_LABEL;
  const dryRun = flag('--dry-run');
  const skipTsc = flag('--skip-tsc');
  if (!prefectureCode || !pdfPath || !pageArg || !sourceUrl || !docTitle || !published) {
    console.error('使い方: npx tsx scripts/bairitsu-ingest/approve-new-year.ts <県コード> <PDFパス> <ページ,...> --source-url <URL> --doc-title <資料名> --published <YYYY-MM-DD> [--dry-run] [--skip-tsc]');
    return 1;
  }
  if (skipTsc && !dryRun) {
    console.error('❌ --skip-tsc は --dry-run（予行）でのみ使える');
    return 1;
  }
  const pages = pageArg.split(',').map((s) => Number.parseInt(s.trim(), 10));
  if (pages.some((n) => Number.isNaN(n))) {
    console.error(`❌ ページ番号を読めない: ${pageArg}`);
    return 1;
  }

  const nextDir = join(ROOT, 'src', 'data', 'competition-rates-next');
  const nextFile = join(nextDir, `${prefectureCode}.ts`);
  const indexFile = join(nextDir, 'index.ts');
  const relNext = `src/data/competition-rates-next/${prefectureCode}.ts`;
  const relIndex = 'src/data/competition-rates-next/index.ts';
  let wroteNext = false;
  let wroteIndex = false;

  const rollback = () => {
    if (wroteIndex) git('checkout', '--', relIndex);
    if (wroteNext && existsSync(nextFile)) rmSync(nextFile);
  };
  const fail = (msg: string): number => {
    rollback();
    console.error(`❌ ${msg}`);
    console.error('   → 書いたファイルは巻き戻した（何も残っていない）。pushしない。');
    return 1;
  };

  // 0 事前確認
  const dirty = git('status', '--porcelain', '--', relNext, relIndex);
  if (dirty) return fail(`事前確認: 登録簿か ${prefectureCode}.ts に未コミットの変更がある:\n${dirty}`);
  if (existsSync(nextFile)) return fail(`事前確認: ${relNext} が既にある（再取り込みは登録を外してから）`);
  const base = loadBaseFile(prefectureCode);
  if (!base) return fail(`事前確認: 旧ファイル(${prefectureCode}.ts)を読めない`);
  const parser = getPrefectureParser(prefectureCode);
  if (!parser) return fail(`事前確認: ${prefectureCode} はパーサ未登録（別方式の県。手作業の取り込みになる）`);

  // 1 PDF→パース
  const sha256 = createHash('sha256').update(readFileSync(pdfPath)).digest('hex');
  const rows = timed('1 PDF→パース', () => parser(pages.map((p) => extractPageGeometry(pdfPath, p))));

  // 2 検算
  const v = timed('2 検算(A-3)', () => runNewYearVerification(prefectureCode, pdfPath, rows));
  printVerification(prefectureCode, rows.length, v);
  if (!v.result.ok) return fail('検算が不合格。数字を合わせにいかない（原因が特定できなければ、その県は載せない）');

  // 3 新年度ファイル生成+登録
  const summaryComment = v.diff
    ? `前年差分: 新設${v.diff.added.length}/消滅${v.diff.removed.length}/数値変化${v.diff.changed.length}/変化なし${v.diff.unchangedCount}。`
    : '前年データなし。';
  timed('3 生成+登録', () => {
    if (!existsSync(nextDir)) mkdirSync(nextDir, { recursive: true });
    writeFileSync(
      nextFile,
      buildNextFileSource({
        prefectureCode,
        rows,
        sums: v.result.sums,
        matchedLine: v.result.matchedLine!.line,
        sourceUrl,
        docTitle,
        published,
        yearLabel,
        sha256,
        coverage: { ...base.coverage, note: `${base.coverage.note}（${yearLabel}もこの範囲）` },
        summaryComment,
      }),
      'utf8'
    );
    wroteNext = true;
    registerInIndex(indexFile, prefectureCode);
    wroteIndex = true;
  });

  // 4 形式チェック
  const problems = timed('4 形式チェック', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(nextFile);
    return validateNextYearFile(mod[`${prefectureCode.toUpperCase()}_COMPETITION_RATES_NEXT`]);
  });
  if (problems.length > 0) return fail(`新年度ファイルの形式チェックNG:\n  - ${problems.join('\n  - ')}`);

  // 5 jest
  const logDir = join(ROOT, 'ops', 'raw', 'bairitsu-pdf-archive');
  mkdirSync(logDir, { recursive: true });
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const runLogged = (name: string, cmd: string, args: string[], logName: string): boolean => {
    try {
      const out = execFileSync(cmd, args, {
        cwd: ROOT,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        maxBuffer: 256 * 1024 * 1024,
        timeout: 20 * 60 * 1000,
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
      });
      writeFileSync(join(logDir, logName), out, 'utf8');
      return true;
    } catch (e) {
      const err = e as { stdout?: string; stderr?: string };
      writeFileSync(join(logDir, logName), `${err.stdout ?? ''}\n${err.stderr ?? ''}`, 'utf8');
      console.error(`   ${name} 失敗。ログ: ops/raw/bairitsu-pdf-archive/${logName}`);
      return false;
    }
  };
  const jestOk = timed('5 jest', () => runLogged('jest', npx, ['jest', '--findRelatedTests', 'src/data/competition-rates/index.ts', 'src/data/competition-rates-next/index.ts', 'src/lib/competition-rate-overlay.ts', '--silent'],`approve-${prefectureCode}-jest.log`));
  if (!jestOk) return fail('jestが不合格');

  // 6 tsc
  if (!skipTsc) {
    const tscOk = timed('6 tsc', () => runLogged('tsc', npx, ['tsc', '--noEmit'], `approve-${prefectureCode}-tsc.log`));
    if (!tscOk) return fail('tscが不合格');
  }

  // 7 commit または巻き戻し
  const summary = [
    '',
    `## 承認用の要約（${prefectureCode} ${yearLabel}）`,
    `- 件数: ${rows.length}件 / 募集${v.result.sums.quota} / 志願${v.result.sums.finalApplicants}`,
    `- 合計行の一致: ${v.result.matchedLine?.line}`,
    `- ${summaryComment}`,
    `- 検算: 4確認+倍率の丸め 全て合格 / jest(${JEST_SCOPE_LABEL}) 緑 / tsc ${skipTsc ? '省略(予行)' : '実exit0'}`,
    `- 出典: ${sourceUrl}（公表日 ${published}・SHA-256 ${sha256.slice(0, 12)}…）`,
  ].join('\n');

  if (dryRun) {
    rollback();
    console.log(summary);
    console.log('\n（--dry-run: 書いたファイルを巻き戻した。コミットなし）');
  } else {
    git('add', relNext, relIndex);
    git(
      'commit',
      '-m',
      `feat(bairitsu): ${prefectureCode} ${yearLabel}の倍率を新年度オーバーレイに登録(承認コマンド・検算合格)`,
      '-m',
      'Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>'
    );
    console.log(summary);
    console.log(`\n✅ commit 済み: ${git('log', '--oneline', '-1')}`);
    console.log('👉 pushしてよいか、👤が承認してください（承認されるまでpushしない）。');
  }
  console.log('\n## 所要時間');
  for (const s of steps) console.log(`  ${s.name}: ${s.sec}秒`);
  console.log(`  合計: ${Math.round(steps.reduce((a, s) => a + s.sec, 0))}秒`);
  return 0;
}

process.exit(main());
