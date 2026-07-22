import { PREFECTURES, type PrefectureConfig } from '@/lib/prefectures';

/**
 * 内申点白書2026（X-1/X-30）の共通データ層。/report/2026（全県版）と
 * /report/2026/[prefecture]（県別ダイジェスト・X-30）の両方がこの一本のROWSを参照する
 * ことで、白書本体とダイジェスト版で数値が食い違う事故を構造的に防ぐ。
 * 全ての値は src/lib/prefectures.ts からの機械的な派生のみ（捏造ゼロ）。
 */

export interface Report2026Row {
  code: string;
  name: string;
  region: string;
  maxScore: number;
  practicalSkew: number;
  grade3WeightPct: number;
  gradeCount: number;
  sourceUrl?: string;
}

function grade3WeightShare(p: PrefectureConfig): number {
  const total = p.targetGrades.reduce((sum, g) => sum + (p.gradeMultipliers[g] ?? 0), 0);
  if (total === 0) return 0;
  return (p.gradeMultipliers[3] ?? 0) / total;
}

export const REPORT_2026_ROWS: Report2026Row[] = PREFECTURES.map((p) => ({
  code: p.code,
  name: p.name,
  region: p.region,
  maxScore: p.maxScore,
  practicalSkew: +(p.practicalMultiplier / p.coreMultiplier).toFixed(2),
  grade3WeightPct: Math.round(grade3WeightShare(p) * 1000) / 10,
  gradeCount: p.targetGrades.length,
  sourceUrl: p.sourceUrl,
})).sort((a, b) => b.practicalSkew - a.practicalSkew || a.name.localeCompare(b.name, 'ja'));

export const REPORT_2026_NO_SKEW_COUNT = REPORT_2026_ROWS.filter((r) => r.practicalSkew === 1).length;
export const REPORT_2026_GRADE3_ONLY = REPORT_2026_ROWS.filter((r) => r.grade3WeightPct === 100);

/** 指定した指標で、県コードの47県中の順位（1位=最大値）を返す。同値は同順位（1,1,3...）。 */
export function rankOf(code: string, metric: 'practicalSkew' | 'grade3WeightPct' | 'maxScore'): number {
  const sorted = [...REPORT_2026_ROWS].sort((a, b) => b[metric] - a[metric]);
  const target = REPORT_2026_ROWS.find((r) => r.code === code);
  if (!target) throw new Error(`unknown prefecture code: ${code}`);
  let rank = 1;
  for (const r of sorted) {
    if (r[metric] > target[metric]) rank++;
  }
  return rank;
}

export function getReport2026Row(code: string): Report2026Row | undefined {
  return REPORT_2026_ROWS.find((r) => r.code === code);
}
