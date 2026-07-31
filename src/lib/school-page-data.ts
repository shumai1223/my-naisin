/**
 * 個別学校ページ(Λ-2)のデータ層＝1県パイロット第一歩。
 *
 * 👤裁定(2026-08-01・47県展開・fable5-fullaccel-backlog-2026-07のΛ-2行参照)に基づく設計:
 *  - ①今季倍率＝学校固有の一次データ(competition-rates)をページの主役に置く
 *  - ④**今季倍率が無い学校(=学校名がschool-masterと突合できない学校を含む)はページを
 *    作らずスキップする**（school-name-match.tsの'no-match'/'ambiguous'は安全側に倒し
 *    誤った学校にデータを紐付けない・ここは緩めない）
 *  - 学科(department)別の複数レコードを持つ学校は、募集人員/応募者数を合算した
 *    「学校全体の今季倍率」を併せて算出する(表示側でどちらを使うか選べるようにする)
 *
 * ②(県内区分の多年度推移)③(近隣校リンク3本)は本ファイルのスコープ外
 * (competition-rate-history.tsとの結合・近隣校選定ロジックは後続タスクで積む)。
 */
import type { SchoolRecord } from '@/lib/school-master';
import type { CompetitionRateRecord } from '@/lib/competition-rate';
import { matchSchoolNames, type SchoolCodeMatchResult } from '@/lib/school-name-match';

export interface SchoolPageData {
  schoolCode: string;
  schoolName: string;
  address: string;
  /** この学校の今季倍率レコード(学科別・複数あり得る)。 */
  departmentRates: CompetitionRateRecord[];
  /** 学科別の募集人員・応募者数を合算した学校全体の値。 */
  totalQuota: number;
  totalApplicants: number;
  /** totalApplicants / totalQuota（小数第2位までの参考値。公式倍率は各departmentRates.finalRateを優先表示すること）。 */
  overallRate: number;
}

export interface SchoolPageDataSkipEntry {
  schoolName: string;
  reason: 'no-match' | 'ambiguous';
}

export interface PrefectureSchoolPageDataResult {
  schools: SchoolPageData[];
  skipped: SchoolPageDataSkipEntry[];
}

/**
 * 1県分の学校マスターと今季倍率レコードから、個別学校ページに必要なデータを組み立てる（純粋関数）。
 * 学校名→schoolCodeの突合ができない学校は正直にskippedへ回す（誤った紐付けをしない）。
 */
export function buildSchoolPageDataForPrefecture(
  masterRecords: SchoolRecord[],
  rateRecords: CompetitionRateRecord[]
): PrefectureSchoolPageDataResult {
  const schoolNames = rateRecords.map((r) => r.schoolName);
  const matchSummary = matchSchoolNames(schoolNames, masterRecords);

  const matchByName = new Map<string, SchoolCodeMatchResult>();
  for (const result of matchSummary.results) matchByName.set(result.inputName, result);

  const recordsByName = new Map<string, CompetitionRateRecord[]>();
  for (const rec of rateRecords) {
    const list = recordsByName.get(rec.schoolName) ?? [];
    list.push(rec);
    recordsByName.set(rec.schoolName, list);
  }

  const schools: SchoolPageData[] = [];
  const skipped: SchoolPageDataSkipEntry[] = [];

  for (const [schoolName, match] of matchByName) {
    if (match.reason !== 'matched' || !match.matchedCode || !match.matchedFullName) {
      skipped.push({ schoolName, reason: match.reason === 'ambiguous' ? 'ambiguous' : 'no-match' });
      continue;
    }
    const departmentRates = recordsByName.get(schoolName) ?? [];
    const totalQuota = departmentRates.reduce((acc, r) => acc + r.quota, 0);
    const totalApplicants = departmentRates.reduce((acc, r) => acc + r.finalApplicants, 0);
    const overallRate = totalQuota > 0 ? Math.round((totalApplicants / totalQuota) * 100) / 100 : 0;

    schools.push({
      schoolCode: match.matchedCode,
      schoolName: match.matchedFullName,
      address: masterRecords.find((m) => m.code === match.matchedCode)?.address ?? '',
      departmentRates,
      totalQuota,
      totalApplicants,
      overallRate,
    });
  }

  return { schools, skipped };
}
