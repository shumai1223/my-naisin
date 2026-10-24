/**
 * 公開用の倍率データ（新年度オーバーレイ合成後）の件数・年度範囲の集計。
 *
 * /developers の「掲載件数」の文言は、以前は件数を手書きしていた（新年度を載せるたびに手で直す必要があり、
 * 発表日当日の作業が増える・書き忘れると嘘になる）。ここから計算して表示すれば、データが増えても自動で正しい。
 */
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { licensableRecords, type PrefectureCompetitionRateFile } from './competition-rate';

export interface CompetitionRateStats {
  prefectureCount: number;
  totalRecords: number;
  totalLicensable: number;
  uniqueSchoolCount: number;
  /** 令和◯年度の◯（最小・最大）と、収録している年度の種類数。 */
  firstReiwa: number;
  lastReiwa: number;
  distinctYearCount: number;
  /** 県ごとの収録年度数の平均（切り捨て。「約◯年度分」と書くとき過大にならないようにする）。 */
  averageYearsPerPrefecture: number;
  /** 県ごとの収録年度数の平均（小数1桁の文字列。「平均約◯.◯年度」と書くとき用）。 */
  averageYearsPerPrefectureText: string;
  /** 県ごとの収録年度数の最小・最大（「県により◯〜◯年度」と書くとき用）。 */
  minYearsPerPrefecture: number;
  maxYearsPerPrefecture: number;
}

function reiwaOf(fiscalYear: string): number | null {
  const m = fiscalYear.match(/令和(\d+)年度/);
  return m ? Number(m[1]) : null;
}

export function computeCompetitionRateStats(
  byPrefecture: Partial<Record<string, PrefectureCompetitionRateFile>> = COMPETITION_RATE_BY_PREFECTURE
): CompetitionRateStats {
  const codes = Object.keys(byPrefecture);
  let totalRecords = 0;
  let totalLicensable = 0;
  const schools = new Set<string>();
  const allYears = new Set<number>();
  let yearsPerPrefSum = 0;
  let minYears = Infinity;
  let maxYears = 0;
  for (const code of codes) {
    const file = byPrefecture[code]!;
    totalRecords += file.records.length;
    totalLicensable += licensableRecords(file).length;
    const yearsOfPref = new Set<number>();
    for (const r of file.records) {
      schools.add(`${code}::${r.schoolName}`);
      const y = reiwaOf(r.fiscalYear ?? file.sources[0]?.fiscalYear ?? '');
      if (y !== null) {
        yearsOfPref.add(y);
        allYears.add(y);
      }
    }
    yearsPerPrefSum += yearsOfPref.size;
    minYears = Math.min(minYears, yearsOfPref.size);
    maxYears = Math.max(maxYears, yearsOfPref.size);
  }
  const years = [...allYears];
  return {
    prefectureCount: codes.length,
    totalRecords,
    totalLicensable,
    uniqueSchoolCount: schools.size,
    firstReiwa: Math.min(...years),
    lastReiwa: Math.max(...years),
    distinctYearCount: allYears.size,
    averageYearsPerPrefecture: codes.length > 0 ? Math.floor(yearsPerPrefSum / codes.length) : 0,
    averageYearsPerPrefectureText: codes.length > 0 ? (yearsPerPrefSum / codes.length).toFixed(1) : '0.0',
    minYearsPerPrefecture: codes.length > 0 ? minYears : 0,
    maxYearsPerPrefecture: maxYears,
  };
}
