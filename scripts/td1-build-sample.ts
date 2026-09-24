#!/usr/bin/env -S npx tsx
/**
 * T-TD1 TD-2: 売り込み用サンプル(令和8年度・確定値・3県)を既存データから機械的に抽出する。
 *
 * 出力先: ops/deliverables/nendomatsu-pack-sample/
 *   sample-r8-<県>.csv   … BOM付きUTF-8・CRLF・日本語ヘッダ(Excelで文字化けしない)
 *   sample-r8-<県>.json  … 英語キー
 *   sample-manifest.json … 件数・学校コード突合率・出典
 *
 * 使い方: npx tsx scripts/td1-build-sample.ts （ネットワークなし）
 * 行の組み立ては src/lib/nendomatsu-pack-export.ts（2月の本納品 scripts/td1-build-delivery.ts と共通）。
 * ⚠️ 数値は手で打たない。倍率は公表値の転記。学校コードは学校名が一意に突合できた場合のみ。
 */
import fs from 'node:fs';
import path from 'node:path';
import { COMPETITION_RATE_BY_PREFECTURE } from '../src/data/competition-rates';
import { SCHOOL_MASTER_BY_PREFECTURE } from '../src/data/schools';
import { PUBLICATION_TIMING_NOTES } from '../src/lib/competition-rate-publication-notes';
import { buildPackRows, toPackCsv } from '../src/lib/nendomatsu-pack-export';
import { getPrefectureByCode } from '../src/lib/prefectures';

const OUT_DIR = 'ops/deliverables/nendomatsu-pack-sample';
/** 大規模・中規模・小規模。いずれも台帳で再配布許諾ok(data-license-ledger)かつ確定パーサ登録県から選んだ。 */
const SAMPLE_PREFECTURES: { code: string; size: string }[] = [
  { code: 'chiba', size: '大規模' },
  { code: 'nagano', size: '中規模' },
  { code: 'akita', size: '小規模' },
];

/** PUBLICATION_TIMING_NOTESの自然文('令和8年2月12日発表'等)から月日を取り出し、令和8年度=2026年として ISO化する。 */
function publishedIso(code: string): string | null {
  const t = PUBLICATION_TIMING_NOTES[code]?.publishedAt;
  const m = t?.match(/(\d{1,2})月(\d{1,2})日/);
  return m ? `2026-${String(Number(m[1])).padStart(2, '0')}-${String(Number(m[2])).padStart(2, '0')}` : null;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const manifest: Record<string, unknown>[] = [];
for (const { code, size } of SAMPLE_PREFECTURES) {
  const file = COMPETITION_RATE_BY_PREFECTURE[code];
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  if (!file || !master) throw new Error(`データ無し: ${code}`);
  const pref = getPrefectureByCode(code)?.name ?? code;
  const built = buildPackRows(file, master, {
    prefectureName: pref,
    currentYearLabel: '令和8年度',
    previousYearLabel: '令和7年度',
    publishedDate: publishedIso(code),
  });
  const rows = built.rows;
  fs.writeFileSync(path.join(OUT_DIR, `sample-r8-${code}.csv`), toPackCsv(rows), 'utf8');
  fs.writeFileSync(
    path.join(OUT_DIR, `sample-r8-${code}.json`),
    JSON.stringify({ fiscalYear: '令和8年度（2026年度）', prefectureCode: code, prefecture: pref, recordCount: rows.length, records: rows }, null, 2) + '\n',
    'utf8'
  );
  manifest.push({
    prefectureCode: code,
    prefecture: pref,
    scale: size,
    recordCount: rows.length,
    schoolNamesDistinct: built.schoolNamesDistinct,
    schoolCodeMatched: built.schoolCodeMatched,
    schoolCodeNoMatch: built.schoolCodeNoMatch,
    schoolCodeAmbiguous: built.schoolCodeAmbiguous,
    withPreviousYear: rows.filter((r) => r.previousRate !== null).length,
    stages: [...new Set(rows.map((r) => r.stage))],
    publishedDate: publishedIso(code),
    sourceUrls: [...new Set(rows.map((r) => r.sourceUrl))],
  });
}
fs.writeFileSync(path.join(OUT_DIR, 'sample-manifest.json'), JSON.stringify({ generatedBy: 'scripts/td1-build-sample.ts', prefectures: manifest }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(manifest.map((m) => ({ p: m.prefectureCode, n: m.recordCount, matched: m.schoolCodeMatched })), null, 0));
