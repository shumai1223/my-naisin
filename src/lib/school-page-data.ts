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
 * ②(県内区分の多年度推移)は本ファイルのスコープ外(competition-rate-history.tsとの結合は
 * 後続タスクで積む)。③(近隣校リンク3本)は`selectNearbySchools`で実装済み(area=学区が
 * 全学科レコードで一致することを東京都167校の実データで確認済み・2026-08-01)。
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
  /** 学区(市区町村等)。一次資料にareaが無い県ではundefined（近隣校選定は同区分の学校が対象外になる）。 */
  area?: string;
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
    // area(学区)は全学科レコードで一致する前提(東京都167校の実データで確認済み)。
    // 念のため先頭レコードの値を採用し、無ければundefined(近隣校選定の対象外になるだけで安全)。
    const area = departmentRates[0]?.area;

    schools.push({
      schoolCode: match.matchedCode,
      schoolName: match.matchedFullName,
      address: masterRecords.find((m) => m.code === match.matchedCode)?.address ?? '',
      departmentRates,
      totalQuota,
      totalApplicants,
      overallRate,
      area,
    });
  }

  return { schools, skipped };
}

export interface NearbySchool {
  schoolCode: string;
  schoolName: string;
  area?: string;
  overallRate: number;
}

/**
 * 近隣校リンク（③・同一県かつ同一学区(area)の他校）を最大maxCount件選ぶ（純粋関数）。
 * targetの`area`が無い（一次資料にareaが無い県）場合は空配列を返す（誤った近隣付けをしない）。
 * 選定順は「今季倍率が近い順」（受験生にとって併願候補として比較しやすいため）。
 * 同率の場合はschoolCodeの昇順で決定論を保つ（テスト可能性・表示の安定性のため）。
 */
export function selectNearbySchools(target: SchoolPageData, allSchools: SchoolPageData[], maxCount = 3): NearbySchool[] {
  if (!target.area) return [];
  const sameArea = allSchools.filter((s) => s.schoolCode !== target.schoolCode && s.area === target.area);
  sameArea.sort((a, b) => {
    const diff = Math.abs(a.overallRate - target.overallRate) - Math.abs(b.overallRate - target.overallRate);
    if (diff !== 0) return diff;
    return a.schoolCode.localeCompare(b.schoolCode);
  });
  return sameArea.slice(0, maxCount).map((s) => ({
    schoolCode: s.schoolCode,
    schoolName: s.schoolName,
    area: s.area,
    overallRate: s.overallRate,
  }));
}
