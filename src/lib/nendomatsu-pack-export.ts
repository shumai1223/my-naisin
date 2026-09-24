/**
 * T-TD1: 年度末パックの納品ファイル(CSV/JSON)の行組み立て・CSV化の純関数。
 * サンプル(scripts/td1-build-sample.ts)と2月の本納品(scripts/td1-build-delivery.ts)が同じ関数を使う。
 *
 * ⚠️ 数値は src/data/competition-rates(1データ点1出典・Y-0)からの抽出のみ。倍率は公表値の転記で計算しない。
 *    前年度差だけは公表倍率どうしの単純差(computeSchoolRateYoy)。学校コードは学校名が一意に突合できた場合のみ。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';
import { resolveRecordSourceIndex } from '@/lib/competition-rate';
import { matchSchoolNames } from '@/lib/school-name-match';
import { computeSchoolRateYoy } from '@/lib/exam-competition-rate-yoy';
import type { SchoolMasterFile } from '@/lib/school-master';

export interface PackRow {
  prefecture: string;
  schoolCode: string | null;
  schoolName: string;
  department: string;
  quota: number;
  applicants: number;
  rate: number;
  stage: '速報' | '確定' | '';
  publishedDate: string | null;
  sourceUrl: string;
  checkedDate: string;
  previousRate: number | null;
  rateDelta: number | null;
}

export const PACK_CSV_HEADER_JA = ['県', '学校コード', '学校名', '学科', '募集人員', '出願者数', '倍率', '区分', '公表日', '出典URL', '確認日', '前年度倍率', '前年度差'];

/** 資料名から 速報(志願変更前)/確定(志願変更後・最終) を判別する。判別できなければ空。 */
export function classifyStage(docTitle: string): '速報' | '確定' | '' {
  if (/変更前|速報/.test(docTitle)) return '速報';
  if (/変更後|最終|確定|調整後|締切後|本出願/.test(docTitle)) return '確定';
  return '';
}

export interface BuildPackRowsOptions {
  prefectureName: string;
  /** 例: '令和9年度' （fiscalYearに部分一致するレコードを対象にする） */
  currentYearLabel: string;
  /** 例: '令和8年度' （前年度倍率の比較対象） */
  previousYearLabel: string;
  /** 県が資料に記載した公表日(確認できた場合のみ)。不明はnull。 */
  publishedDate: string | null;
}

export interface BuildPackRowsResult {
  rows: PackRow[];
  schoolNamesDistinct: number;
  schoolCodeMatched: number;
  schoolCodeNoMatch: number;
  schoolCodeAmbiguous: number;
}

export function buildPackRows(file: PrefectureCompetitionRateFile, master: SchoolMasterFile, opts: BuildPackRowsOptions): BuildPackRowsResult {
  const current = file.records.filter((r) => {
    const fy = r.fiscalYear ?? file.sources[0]?.fiscalYear ?? '';
    return fy.includes(opts.currentYearLabel) && !r.commercialSourceOnly;
  });
  const match = matchSchoolNames(current.map((r) => r.schoolName), master.schools);
  const byName = new Map(match.results.map((m) => [m.inputName, m]));
  const yoy = new Map(
    computeSchoolRateYoy(file)
      .filter((e) => e.currentFiscalYear.includes(opts.currentYearLabel) && e.previousFiscalYear.includes(opts.previousYearLabel))
      .map((e) => [`${e.schoolName}\u0000${e.department}`, e])
  );
  const rows: PackRow[] = current.map((r) => {
    const idx = resolveRecordSourceIndex(r, file.sources);
    const src = idx !== null ? file.sources[idx] : undefined;
    const m = byName.get(r.schoolName.trim());
    const y = yoy.get(`${r.schoolName}\u0000${r.department}`);
    return {
      prefecture: opts.prefectureName,
      schoolCode: m?.reason === 'matched' ? m.matchedCode : null,
      schoolName: m?.reason === 'matched' && m.matchedFullName ? m.matchedFullName : r.schoolName,
      department: r.department,
      quota: r.quota,
      applicants: r.finalApplicants,
      rate: r.finalRate,
      stage: src ? classifyStage(src.docTitle) : '',
      publishedDate: opts.publishedDate,
      sourceUrl: src?.url ?? '',
      checkedDate: src?.fetchedAt ?? '',
      previousRate: y ? y.previousRate : null,
      rateDelta: y ? y.rateDelta : null,
    };
  });
  return {
    rows,
    schoolNamesDistinct: match.results.length,
    schoolCodeMatched: match.matchedCount,
    schoolCodeNoMatch: match.noMatchCount,
    schoolCodeAmbiguous: match.ambiguousCount,
  };
}

function csvCell(v: string | number | null): string {
  const s = v === null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** BOM付きUTF-8・CRLF・日本語ヘッダのCSV文字列(Excelで文字化けしない)。 */
export function toPackCsv(rows: PackRow[]): string {
  const body = rows.map((r) =>
    [r.prefecture, r.schoolCode, r.schoolName, r.department, r.quota, r.applicants, r.rate, r.stage, r.publishedDate, r.sourceUrl, r.checkedDate, r.previousRate, r.rateDelta]
      .map((v) => csvCell(v as string | number | null))
      .join(',')
  );
  return '﻿' + [PACK_CSV_HEADER_JA.join(',')].concat(body).join('\r\n') + '\r\n';
}
