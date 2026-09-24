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
 *
 * ⚠️ 数値は手で打たない。既存の src/data/competition-rates（1データ点1出典・Y-0）からの抽出のみ。
 *   倍率は公表値をそのまま転記（出願者数から割り算しない）。前年度差だけは公表倍率どうしの単純差
 *   （T-N1-4の computeSchoolRateYoy と同じ算出）で、仕様書にその旨を明記する。
 *   学校コードは文科省「学校コード一覧」と学校名が一意に突合できた場合のみ入れる(no-match/ambiguousは空欄)。
 */
import fs from 'node:fs';
import path from 'node:path';
import { COMPETITION_RATE_BY_PREFECTURE } from '../src/data/competition-rates';
import { SCHOOL_MASTER_BY_PREFECTURE } from '../src/data/schools';
import { PUBLICATION_TIMING_NOTES } from '../src/lib/competition-rate-publication-notes';
import { resolveRecordSourceIndex } from '../src/lib/competition-rate';
import { matchSchoolNames } from '../src/lib/school-name-match';
import { computeSchoolRateYoy } from '../src/lib/exam-competition-rate-yoy';
import { getPrefectureByCode } from '../src/lib/prefectures';

const OUT_DIR = 'ops/deliverables/nendomatsu-pack-sample';
/** 大規模・中規模・小規模。いずれも台帳で再配布許諾ok(data-license-ledger)かつ確定パーサ登録県から選んだ。 */
const SAMPLE_PREFECTURES: { code: string; size: string }[] = [
  { code: 'chiba', size: '大規模' },
  { code: 'nagano', size: '中規模' },
  { code: 'akita', size: '小規模' },
];
const CURRENT_YEAR_LABEL = '令和8年度';

function classify(title: string): '速報' | '確定' | '' {
  if (/変更前|速報/.test(title)) return '速報';
  if (/変更後|最終|確定|調整後|締切後|本出願/.test(title)) return '確定';
  return '';
}

/** PUBLICATION_TIMING_NOTESの自然文('令和8年2月12日発表'等)から月日を取り出し、令和8年度=2026年として ISO化する。 */
function publishedIso(code: string): string | null {
  const t = PUBLICATION_TIMING_NOTES[code]?.publishedAt;
  if (!t) return null;
  const m = t.match(/(\d{1,2})月(\d{1,2})日/);
  if (!m) return null;
  return `2026-${String(Number(m[1])).padStart(2, '0')}-${String(Number(m[2])).padStart(2, '0')}`;
}

function csvCell(v: string | number | null): string {
  const s = v === null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADER_JA = ['県', '学校コード', '学校名', '学科', '募集人員', '出願者数', '倍率', '区分', '公表日', '出典URL', '確認日', '前年度倍率', '前年度差'];

fs.mkdirSync(OUT_DIR, { recursive: true });
const manifest: Record<string, unknown>[] = [];

for (const { code, size } of SAMPLE_PREFECTURES) {
  const file = COMPETITION_RATE_BY_PREFECTURE[code];
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  if (!file || !master) throw new Error(`データ無し: ${code}`);
  const pref = getPrefectureByCode(code)?.name ?? code;

  const current = file.records.filter((r) => {
    const fy = r.fiscalYear ?? file.sources[0]?.fiscalYear ?? '';
    return fy.includes(CURRENT_YEAR_LABEL) && !r.commercialSourceOnly;
  });
  const match = matchSchoolNames(current.map((r) => r.schoolName), master.schools);
  const byName = new Map(match.results.map((m) => [m.inputName, m]));
  const yoy = new Map(
    computeSchoolRateYoy(file)
      .filter((e) => e.currentFiscalYear.includes(CURRENT_YEAR_LABEL) && e.previousFiscalYear.includes('令和7年度'))
      .map((e) => [`${e.schoolName}\u0000${e.department}`, e])
  );

  const rows = current.map((r) => {
    const idx = resolveRecordSourceIndex(r, file.sources);
    const src = idx !== null ? file.sources[idx] : undefined;
    const m = byName.get(r.schoolName.trim());
    const y = yoy.get(`${r.schoolName}\u0000${r.department}`);
    return {
      prefecture: pref,
      schoolCode: m?.reason === 'matched' ? m.matchedCode : null,
      schoolName: m?.reason === 'matched' && m.matchedFullName ? m.matchedFullName : r.schoolName,
      department: r.department,
      quota: r.quota,
      applicants: r.finalApplicants,
      rate: r.finalRate,
      stage: src ? classify(src.docTitle) : '',
      publishedDate: publishedIso(code),
      sourceUrl: src?.url ?? '',
      checkedDate: src?.fetchedAt ?? '',
      previousRate: y ? y.previousRate : null,
      rateDelta: y ? y.rateDelta : null,
    };
  });

  const csv =
    '﻿' +
    [HEADER_JA.join(',')]
      .concat(
        rows.map((r) =>
          [r.prefecture, r.schoolCode, r.schoolName, r.department, r.quota, r.applicants, r.rate, r.stage, r.publishedDate, r.sourceUrl, r.checkedDate, r.previousRate, r.rateDelta]
            .map((v) => csvCell(v as string | number | null))
            .join(',')
        )
      )
      .join('\r\n') +
    '\r\n';
  fs.writeFileSync(path.join(OUT_DIR, `sample-r8-${code}.csv`), csv, 'utf8');
  fs.writeFileSync(
    path.join(OUT_DIR, `sample-r8-${code}.json`),
    JSON.stringify({ fiscalYear: '令和8年度（2026年度）', prefectureCode: code, prefecture: pref, recordCount: rows.length, records: rows }, null, 2) + '\n',
    'utf8'
  );

  const stages = [...new Set(rows.map((r) => r.stage))];
  manifest.push({
    prefectureCode: code,
    prefecture: pref,
    scale: size,
    recordCount: rows.length,
    schoolNamesDistinct: match.results.length,
    schoolCodeMatched: match.matchedCount,
    schoolCodeNoMatch: match.noMatchCount,
    schoolCodeAmbiguous: match.ambiguousCount,
    withPreviousYear: rows.filter((r) => r.previousRate !== null).length,
    stages,
    publishedDate: publishedIso(code),
    sourceUrls: [...new Set(rows.map((r) => r.sourceUrl))],
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'sample-manifest.json'), JSON.stringify({ generatedBy: 'scripts/td1-build-sample.ts', prefectures: manifest }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(manifest, null, 1));
