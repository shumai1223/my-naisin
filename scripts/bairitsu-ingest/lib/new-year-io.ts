/**
 * T-PV2 A-3/A-4 共通のI/O（verify-new-year.ts と approve-new-year.ts が使う）。判定ロジックは
 * src/lib/bairitsu-ingest/verify-new-year.ts（純関数）にあり、ここはファイル・外部コマンドだけを扱う。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { diffParsedRecords, type RecordDiffResult } from '@/lib/bairitsu-ingest/diff-parsed-records';
import type { ParsedCompetitionRow, PdfPageGeometry } from '@/lib/bairitsu-ingest/parse-table-pdf';
import { validateParsedRecords } from '@/lib/bairitsu-ingest/validate-parsed-records';
import { verifyNewYear, type VerifyNewYearResult } from '@/lib/bairitsu-ingest/verify-new-year';
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { PACK_SALES_APPROVED } from '@/lib/nendomatsu-pack';
import { isPublicationRefused } from '@/lib/publication-refused-prefectures';
import { COMPETITION_RATE_NEXT_BY_PREFECTURE } from '@/data/competition-rates-next';

export const ROOT = resolve(__dirname, '..', '..', '..');
const NEW_YEAR_LABEL = '令和9年度';
// 「令和9年度」を書いてよい公開面のファイル（制度・日程の説明であり、倍率データの年度表示ではないもの）。
// 追加するときは、県ごとに出し分けされていることを確認してからにする。
const NEW_YEAR_LABEL_ALLOWLIST: ReadonlySet<string> = new Set([]);

export function extractPageGeometry(pdfPath: string, pageNo: number): PdfPageGeometry {
  const stdout = execFileSync('python', [join(ROOT, 'scripts', 'bairitsu-ingest', 'extract-pdf-geometry.py'), pdfPath, String(pageNo)], {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(stdout) as PdfPageGeometry;
}

export function pdfLayoutText(pdfPath: string): string {
  return execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === '__tests__' || name === 'node_modules') continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

/** 県ページ・学校ページ系の公開面で「令和9年度」を書いているファイル（許可リストを除く）。 */
export function filesWithNewYearLabel(): string[] {
  const targets = [
    ...walk(join(ROOT, 'src', 'app', 'pref')),
    ...readdirSync(join(ROOT, 'src', 'lib'))
      .filter((n) => /^school-page.*\.ts$/.test(n))
      .map((n) => join(ROOT, 'src', 'lib', n)),
  ];
  return targets
    .filter((p) => readFileSync(p, 'utf8').includes(NEW_YEAR_LABEL))
    .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
    .filter((p) => !NEW_YEAR_LABEL_ALLOWLIST.has(p));
}

/** 旧ファイル（令和8年度）。無印レコード＝前年度の比較対象。 */
export function loadBaseFile(prefectureCode: string): PrefectureCompetitionRateFile | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../../../src/data/competition-rates/${prefectureCode}`);
    return mod[`${prefectureCode.toUpperCase()}_COMPETITION_RATES`] ?? null;
  } catch {
    return null;
  }
}

export interface NewYearVerification {
  result: VerifyNewYearResult;
  diff: RecordDiffResult | null;
  previousCount: number | null;
}

export function runNewYearVerification(prefectureCode: string, pdfPath: string, rows: ParsedCompetitionRow[]): NewYearVerification {
  const pdfText = pdfLayoutText(pdfPath);
  const rateIssue = validateParsedRecords(rows, []).issues.find((i) => i.check === 'finalrate-convention');
  let deliveryFileNames: string[] = [];
  try {
    deliveryFileNames = readdirSync(join(ROOT, 'ops', 'deliverables', 'nendomatsu-pack-deliveries'));
  } catch {
    // 納品ディレクトリが無ければ納品ファイル無しとして扱う
  }
  const base = loadBaseFile(prefectureCode);
  const previous = base ? base.records.filter((r) => r.fiscalYear === undefined) : null;
  const result = verifyNewYear({
    prefectureCode,
    rows,
    pdfText,
    isRefused: isPublicationRefused,
    deliveryFileNames,
    deliveryYearPrefix: 'R9',
    packSalesApproved: PACK_SALES_APPROVED,
    filesWithNewYearLabel: filesWithNewYearLabel(),
    prefecturesWithNewYearData: new Set(Object.keys(COMPETITION_RATE_NEXT_BY_PREFECTURE)),
    rateConventionIssue: rateIssue?.message ?? null,
    previousRecordCount: previous?.length,
  });
  return { result, diff: previous ? diffParsedRecords(previous, rows) : null, previousCount: previous?.length ?? null };
}

export function printVerification(prefectureCode: string, rowsLength: number, v: NewYearVerification): void {
  const { result, diff } = v;
  console.log(`# ${prefectureCode} 新年度の検算: ${result.ok ? '✅ 合格' : '❌ 不合格'}`);
  for (const c of result.checks) console.log(`  ${c.ok ? '✅' : '❌'} [${c.name}] ${c.detail}`);
  for (const w of result.warnings) console.log(`  ⚠️ ${w}`);
  console.log(`  抽出 ${rowsLength}件 / 募集${result.sums.quota} / 志願${result.sums.finalApplicants}`);
  if (diff) {
    console.log(`  前年差分: 新設${diff.added.length} / 消滅${diff.removed.length} / 数値変化${diff.changed.length} / 変化なし${diff.unchangedCount}`);
    for (const r of diff.added.slice(0, 5)) console.log(`    新設: ${r.schoolName}/${r.department}`);
    for (const r of diff.removed.slice(0, 5)) console.log(`    消滅: ${r.schoolName}/${r.department}`);
  }
}
