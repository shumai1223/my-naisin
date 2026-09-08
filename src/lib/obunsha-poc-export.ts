/**
 * T-Y11F §5順序#5: 旺文社PoC納品物v0の純関数群。
 *
 * `src/data/competition-rates/`（Y-2/Y-6・47都道府県の学校別入試競争率）から、配布可能な
 * レコード（`licensableRecords()`＝商用第三者資料のみを唯一の出典とするものを除く）を
 * フラット化し、CSV/JSON化・年次差分（R7→R8）を作る。ページ・APIへの露出は行わない
 * （このモジュールは純粋なデータ整形のみ・出力先はビルドスクリプト側の責務）。
 */
import {
  COMPETITION_RATE_BY_PREFECTURE,
} from '@/data/competition-rates';
import type { PrefectureCompetitionRateFile, CompetitionRateRecord } from './competition-rate';
import { licensableRecords, resolveRecordSourceIndex } from './competition-rate';
import { getPrefectureByCode } from './prefectures';
import { computeAllSchoolRateYoy, type SchoolRateYoyEntry } from './exam-competition-rate-yoy';

/** 配布用フラットレコード（1行=1校1学科1年度）。 */
export interface ObunshaPocRecord {
  prefectureCode: string;
  prefectureName: string;
  schoolName: string;
  area: string;
  department: string;
  fiscalYear: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
  sourceUrl: string;
  docTitle: string;
  fetchedAt: string;
}

function resolvedFiscalYear(record: CompetitionRateRecord, file: PrefectureCompetitionRateFile): string {
  return record.fiscalYear ?? file.sources[0]?.fiscalYear ?? '';
}

/** 47都道府県分の配布可能レコードを1本のフラット配列にする（licensableRecordsを都道府県ごとに適用）。 */
export function buildFullExportRecords(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): ObunshaPocRecord[] {
  const out: ObunshaPocRecord[] = [];
  for (const code of Object.keys(byPrefecture)) {
    const file = byPrefecture[code];
    if (!file) continue;
    const prefectureName = getPrefectureByCode(code)?.name ?? code;
    for (const r of licensableRecords(file)) {
      const sourceIndex = resolveRecordSourceIndex(r, file.sources);
      const source = sourceIndex !== null ? file.sources[sourceIndex] : undefined;
      out.push({
        prefectureCode: code,
        prefectureName,
        schoolName: r.schoolName,
        area: r.area ?? '',
        department: r.department,
        fiscalYear: resolvedFiscalYear(r, file),
        quota: r.quota,
        finalApplicants: r.finalApplicants,
        finalRate: r.finalRate,
        sourceUrl: source?.url ?? '',
        docTitle: source?.docTitle ?? '',
        fetchedAt: source?.fetchedAt ?? '',
      });
    }
  }
  return out;
}

const CSV_COLUMNS: (keyof ObunshaPocRecord)[] = [
  'prefectureCode',
  'prefectureName',
  'schoolName',
  'area',
  'department',
  'fiscalYear',
  'quota',
  'finalApplicants',
  'finalRate',
  'sourceUrl',
  'docTitle',
  'fetchedAt',
];

function csvEscape(value: string | number): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** ObunshaPocRecord[]をCSV文字列化する（ヘッダ行付き・カンマ区切り・UTF-8想定）。 */
export function toCsv(records: ObunshaPocRecord[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = records.map((r) => CSV_COLUMNS.map((c) => csvEscape(r[c])).join(','));
  return [header, ...rows].join('\n') + '\n';
}

const R7_PREFIX = '令和7年度';
const R8_PREFIX = '令和8年度';

/**
 * R7→R8の年次差分。既存のT-N1-4エンジン（`computeAllSchoolRateYoy`）をそのまま再利用し
 * （重複実装を避ける）、「収録されている直近2年度」の中から前年度=R7・当年度=R8のペアだけに
 * 絞り込む（R6→R7等の別ペアが混入する県があれば正直に除外する＝水増ししない・Y-0）。
 */
export function buildYearOverYearDiff(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): SchoolRateYoyEntry[] {
  const files = Object.values(byPrefecture).filter((f): f is PrefectureCompetitionRateFile => f !== undefined);
  const licensableFiles = files.map((f) => ({ ...f, records: licensableRecords(f) }));
  return computeAllSchoolRateYoy(licensableFiles).filter(
    (e) => e.previousFiscalYear.startsWith(R7_PREFIX) && e.currentFiscalYear.startsWith(R8_PREFIX)
  );
}
