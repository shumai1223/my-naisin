/**
 * T-N4-1: 47都道府県横断の内申点比較データ（研究者向け）。
 *
 * 「内申点の扱いが全国でどう違うか」を研究に使える形で整理する。既存の`prefectures.ts`の
 * 再集計のみで、新規データ収集は行わない。Y-0憲法・T-N4本文の指示により、順位付け・優劣の
 * 評価は一切行わない（「どの県が公平か」等の評価軸を持つ関数・文言をこのファイルに含めない）。
 * 頻度の集計（例: 5段階評価を採用する県の数）は評価ではなく事実の記述として扱う。
 */
import { PREFECTURES, type PrefectureConfig } from './prefectures';

export interface PrefectureComparisonRow {
  code: string;
  name: string;
  region: string;
  maxScore: number;
  targetGrades: number[];
  gradeMultipliers: Record<number, number>;
  coreMultiplier: number;
  practicalMultiplier: number;
  /** practicalMultiplier / coreMultiplier（実技科目が5教科の何倍の重みを持つかの事実値）。 */
  practicalToCoreRatio: number;
  supports10PointScale: boolean;
  /** 内申点:当日点の配点比率。reverseCalc.defaultRatioが無い県はnull(推測で埋めない)。 */
  naishinToExamRatio: { naishin: number; exam: number } | null;
  sourceUrl: string;
}

function toComparisonRow(config: PrefectureConfig): PrefectureComparisonRow {
  return {
    code: config.code,
    name: config.name,
    region: config.region,
    maxScore: config.maxScore,
    targetGrades: config.targetGrades,
    gradeMultipliers: config.gradeMultipliers,
    coreMultiplier: config.coreMultiplier,
    practicalMultiplier: config.practicalMultiplier,
    practicalToCoreRatio: Math.round((config.practicalMultiplier / config.coreMultiplier) * 100) / 100,
    supports10PointScale: config.supports10PointScale ?? false,
    naishinToExamRatio: config.reverseCalc
      ? { naishin: config.reverseCalc.defaultRatio.naishin, exam: config.reverseCalc.defaultRatio.exam }
      : null,
    sourceUrl: config.sourceUrl ?? '',
  };
}

/** 47県分の比較行を生成する（既存データの再集計のみ）。 */
export function buildNationalComparison(): PrefectureComparisonRow[] {
  return PREFECTURES.map(toComparisonRow);
}

export interface DistributionSummary {
  totalPrefectures: number;
  /** 対象学年の組み合わせごとの件数（例: '1,2,3' → 42県）。評価ではなく頻度の記述。 */
  targetGradesDistribution: Record<string, number>;
  /** 評定の段階(5 or 10)ごとの件数。 */
  scaleDistribution: { fivePoint: number; tenPoint: number };
  /** 満点(maxScore)の最小値・最大値・中央値(descriptive statisticsであり優劣の評価ではない)。 */
  maxScoreRange: { min: number; max: number; median: number };
  /** 内申点:当日点比率のデータが存在する県の数。 */
  naishinToExamRatioAvailableCount: number;
}

/**
 * 頻度・分布の記述統計を作る。**優劣の評価語("公平"/"優れる"/"劣る"等)はここに一切含めない。**
 */
export function summarizeDistribution(rows: PrefectureComparisonRow[]): DistributionSummary {
  const targetGradesDistribution: Record<string, number> = {};
  let fivePoint = 0;
  let tenPoint = 0;
  let ratioAvailable = 0;
  const maxScores: number[] = [];

  for (const row of rows) {
    const key = row.targetGrades.join(',');
    targetGradesDistribution[key] = (targetGradesDistribution[key] ?? 0) + 1;
    if (row.supports10PointScale) tenPoint += 1;
    else fivePoint += 1;
    if (row.naishinToExamRatio) ratioAvailable += 1;
    maxScores.push(row.maxScore);
  }

  const sorted = [...maxScores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  return {
    totalPrefectures: rows.length,
    targetGradesDistribution,
    scaleDistribution: { fivePoint, tenPoint },
    maxScoreRange: { min: sorted[0], max: sorted[sorted.length - 1], median },
    naishinToExamRatioAvailableCount: ratioAvailable,
  };
}

/** 研究者向けCSV文字列を生成する（順位付け列を含まない・生データのみ）。 */
export function toCsv(rows: PrefectureComparisonRow[]): string {
  const header = [
    'code',
    'name',
    'region',
    'maxScore',
    'targetGrades',
    'coreMultiplier',
    'practicalMultiplier',
    'practicalToCoreRatio',
    'supports10PointScale',
    'naishinRatio',
    'examRatio',
    'sourceUrl',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.code,
        r.name,
        r.region,
        r.maxScore,
        `"${r.targetGrades.join(';')}"`,
        r.coreMultiplier,
        r.practicalMultiplier,
        r.practicalToCoreRatio,
        r.supports10PointScale,
        r.naishinToExamRatio?.naishin ?? '',
        r.naishinToExamRatio?.exam ?? '',
        r.sourceUrl,
      ].join(',')
    );
  }
  return lines.join('\n') + '\n';
}
