#!/usr/bin/env -S npx tsx
/**
 * T-TD1 TD-9: 2月の本納品ファイル(1県ぶん)を作る。サンプルと同じ形式(src/lib/nendomatsu-pack-export.ts)。
 *
 * 前提: 県の公表PDFの取り込み(パース→検算→ src/data/competition-rates/<県>.ts に令和9年度を追加→tsc/jest green)が
 *       済んでいること（ops/BAIRITSU-INGEST-RUNBOOK.md・ops/runbooks/nendomatsu-pack-february.md の手順1〜4）。
 *
 * 使い方:
 *   npx tsx scripts/td1-build-delivery.ts <県コード> <当年度ラベル> <前年度ラベル> <公表日YYYY-MM-DD> [--stage 確定|速報]
 *   例: npx tsx scripts/td1-build-delivery.ts chiba 令和9年度 令和8年度 2027-02-13
 *   高速路(DB取り込み前): npx tsx scripts/td1-build-delivery.ts <県> 令和9年度 令和8年度 <公表日> --parsed <harvest --emitのJSON> --source-url <URL> --doc-title <資料名> --scope-note <収録範囲>
 *   検証(令和8年度で通し): npx tsx scripts/td1-build-delivery.ts chiba 令和8年度 令和7年度 2026-02-13 --out <一時フォルダ>
 *
 * 出力: ops/deliverables/nendomatsu-pack-deliveries/<年度>-<県>-<区分>-<公表日>.{csv,json} と scope.txt(収録範囲)
 * ⚠️ fail-closed: 納品対象県(A+B かつ 再配布許諾ok)以外は作らない。0行なら作らない。送信はしない(納品は👤)。
 */
import fs from 'node:fs';
import path from 'node:path';
import { COMPETITION_RATE_BY_PREFECTURE } from '../src/data/competition-rates';
import { SCHOOL_MASTER_BY_PREFECTURE } from '../src/data/schools';
import { buildPackRows, toPackCsv } from '../src/lib/nendomatsu-pack-export';
import { getDeliverablePrefectures } from '../src/lib/nendomatsu-pack';
import { getPrefectureByCode } from '../src/lib/prefectures';

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
const [code, curLabel, prevLabel, published] = positional;
if (!code || !curLabel || !prevLabel || !/^\d{4}-\d{2}-\d{2}$/.test(published ?? '')) {
  console.error('使い方: npx tsx scripts/td1-build-delivery.ts <県コード> <当年度ラベル> <前年度ラベル> <公表日YYYY-MM-DD> [--stage 確定|速報] [--out <dir>]');
  process.exit(2);
}
const deliverable = getDeliverablePrefectures().find((d) => d.code === code);
if (!deliverable) {
  console.error(`${code} は納品対象県(A+B かつ 再配布許諾ok)ではありません。作成しません(fail-closed)。ops/baselines/td1-delivery-capability-2026-09.md を参照。`);
  process.exit(1);
}
const file = COMPETITION_RATE_BY_PREFECTURE[code];
const master = SCHOOL_MASTER_BY_PREFECTURE[code];
if (!file || !master) {
  console.error(`データ無し: ${code}`);
  process.exit(1);
}
const pref = getPrefectureByCode(code)?.name ?? code;
let effective = file;
const parsedPath = flag('--parsed');
if (parsedPath) {
  // 高速路: 県の公表PDFを harvest-prefecture.ts --emit で抽出したJSONから、DBへの取り込み前に納品ファイルを作る
  // （前年度は既存DBの令和8年度以前のレコード。DBへの取り込みは納品後でよい）。
  const sourceUrl = flag('--source-url');
  const docTitle = flag('--doc-title');
  const fetched = flag('--fetched') ?? published;
  const m = curLabel.match(/令和(\d+)年度/);
  if (!sourceUrl || !docTitle || !m || !flag('--scope-note')) {
    console.error('--parsed には --source-url <公表PDFのURL> --doc-title <資料名(区分が分かる語を含める: 志願変更後 等)> --scope-note <収録範囲の説明 例: 全日制の一般選抜(県立・市立)。定時制は含まない> が必要です。当年度ラベルは「令和N年度」の形で。');
    process.exit(2);
  }
  const fiscalYear = `${curLabel}（${2018 + Number(m[1])}年度）`;
  const parsed = (JSON.parse(fs.readFileSync(parsedPath, 'utf8')) as { rows: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }[] }).rows;
  const sourceIndex = file.sources.length;
  effective = {
    ...file,
    sources: [...file.sources, { url: sourceUrl, docTitle, fiscalYear, fetchedAt: fetched }],
    records: [
      ...file.records,
      ...parsed.map((r) => ({ schoolName: r.schoolName, department: r.department, quota: r.quota, finalApplicants: r.finalApplicants, finalRate: r.finalRate, fiscalYear, sourceIndex })),
    ],
  };
}
const built = buildPackRows(effective, master, { prefectureName: pref, currentYearLabel: curLabel, previousYearLabel: prevLabel, publishedDate: published });
if (built.rows.length === 0) {
  console.error(`${curLabel} のレコードが0行です。src/data/competition-rates/${code}.ts に ${curLabel} を追加してから実行してください。`);
  process.exit(1);
}
const stageOverride = flag('--stage');
if (stageOverride === '確定' || stageOverride === '速報') for (const r of built.rows) r.stage = stageOverride;
const stages = [...new Set(built.rows.map((r) => r.stage))];
if (stages.length !== 1 || stages[0] === '') {
  console.error(`区分(速報/確定)を資料名から判別できませんでした(${JSON.stringify(stages)})。--stage 確定 または --stage 速報 を付けて再実行してください。`);
  process.exit(1);
}
const stageEn = stages[0] === '確定' ? 'kakutei' : 'sokuho';
const outDir = flag('--out') ?? 'ops/deliverables/nendomatsu-pack-deliveries';
fs.mkdirSync(outDir, { recursive: true });
const base = `${curLabel.replace('令和', 'R').replace('年度', '')}-${code}-${stageEn}-${published}`;
fs.writeFileSync(path.join(outDir, `${base}.csv`), toPackCsv(built.rows), 'utf8');
fs.writeFileSync(
  path.join(outDir, `${base}.json`),
  JSON.stringify({ fiscalYear: curLabel, prefectureCode: code, prefecture: pref, stage: stages[0], publishedDate: published, recordCount: built.rows.length, records: built.rows }, null, 2) + '\n',
  'utf8'
);
const cov = effective.coverage;
const scopeLines = parsedPath
  ? [`収録範囲: ${flag('--scope-note')}`, '取り込み状況: 県の公表PDFから直接抽出（当社DBへの取り込みは納品後）']
  : [`取り込み状況: ${cov.status === 'complete' ? '全件' : '一部（下記の未収録あり）'}`, `収録済みの学科区分: ${cov.includedDepartments.join('、') || '（記載なし）'}`, `未収録の学科区分: ${cov.pendingDepartments.join('、') || 'なし'}`, `備考: ${cov.note}`];
fs.writeFileSync(
  path.join(outDir, `${base}.scope.txt`),
  [
    `${pref} ${curLabel} ${stages[0]}（公表日 ${published}）の収録範囲`,
    `収録行数: ${built.rows.length}`,
    ...scopeLines,
    `出典: ${[...new Set(built.rows.map((r) => r.sourceUrl))].join(' / ')}`,
    `学校コードの突合: ${built.schoolCodeMatched}/${built.schoolNamesDistinct}校（一意に突合できない学校は空欄）`,
    '',
  ].join('\r\n'),
  'utf8'
);
console.log(`作成: ${outDir}/${base}.{csv,json,scope.txt}（${built.rows.length}行・学校コード ${built.schoolCodeMatched}/${built.schoolNamesDistinct}・前年度比較 ${built.rows.filter((r) => r.previousRate !== null).length}行）`);
