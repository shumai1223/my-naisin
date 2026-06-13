// 総合得点エンジン（純粋関数・サーバー安全）。
// すべての第1層県を「内申・学力をそれぞれ換算満点へ線形換算し、選んだ比率オプションのもとで合算する」単一モデルで扱う。
// 固定式（兵庫・京都中期）も選択比率式（栃木・新潟・岩手・鳥取・大分）も、比率オプションの違いだけで表現できる。

import type { TotalScoreSystem, TsRatioOption, TsReport } from './types';

export interface TotalScoreInput {
  /** 学力検査の素点合計（0..academic.rawMax）。 */
  academicRaw: number;
  /** 内申換算素点（0..report.rawMax）。評定からは computeReportRaw で作れる。 */
  reportRaw: number;
  /** 比率オプションID（未指定なら先頭＝既定）。 */
  ratioOptionId?: string;
}

export interface TotalScoreResult {
  /** 換算後の学力検査点。 */
  academic: number;
  /** 換算後の内申点。 */
  report: number;
  /** 総合得点。 */
  total: number;
  /** この比率オプションの満点。 */
  totalMax: number;
  /** 採用した比率オプション。 */
  option: TsRatioOption;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * 評定合計（主要5教科・実技4教科）から、県固有の内申換算素点を作る。
 * coreSum / practicalSum は対象学年ぶんを合計済みの評定和。
 */
export function computeReportRaw(
  report: Pick<TsReport, 'coreMultiplier' | 'practicalMultiplier'>,
  evals: { coreSum: number; practicalSum: number },
): number {
  return evals.coreSum * report.coreMultiplier + evals.practicalSum * report.practicalMultiplier;
}

/** 比率オプションを解決（IDが無ければ先頭）。 */
export function resolveRatioOption(system: TotalScoreSystem, id?: string): TsRatioOption {
  return system.ratioOptions.find((o) => o.id === id) ?? system.ratioOptions[0];
}

/** 県の総合得点を計算する。 */
export function computeTotalScore(system: TotalScoreSystem, input: TotalScoreInput): TotalScoreResult {
  const option = resolveRatioOption(system, input.ratioOptionId);
  const academicRaw = clamp(input.academicRaw, 0, system.academic.rawMax);
  const reportRaw = clamp(input.reportRaw, 0, system.report.rawMax);

  const academic = Math.round((academicRaw / system.academic.rawMax) * option.academicMax);
  const report = Math.round((reportRaw / system.report.rawMax) * option.reportMax);
  const totalMax = option.academicMax + option.reportMax;

  return { academic, report, total: academic + report, totalMax, option };
}

/**
 * 評定満点（対象学年の主要5・実技4が全て満点）のときの内申換算素点。
 * 入力上限のバリデーションと、データ整合テスト（rawMax と一致するか）に使う。
 */
export function reportRawAtFullMarks(report: TsReport): number {
  const years = report.targetGrades.length;
  const coreSum = 5 * report.perGradeMax * years;
  const practicalSum = 4 * report.perGradeMax * years;
  return computeReportRaw(report, { coreSum, practicalSum });
}
