/**
 * 評定平均エンジン（TIER K-4で逆算計算を追加）。
 *
 * 「推薦に必要な評定平均に届かせるには、残りの評価で平均いくつを取ればよいか」を
 * 純粋な算数（現在の合計・残り回数からの逆算）で解く。学校推薦型・総合型選抜の
 * 出願で使われる評定平均の集計範囲（何学期分を対象にするか等）は学校・大学・
 * 制度によって異なり一次情報が無いため、ここでは「現在の評定平均×評価済み回数」と
 * 「残りの評価回数」をユーザー自身に入力してもらう汎用モデルとし、大学個別の
 * 基準値は一切書かない（捏造回避・[[hensachi.ts]]のGapToTarget系と同じ設計方針）。
 */

export interface HyoteiHeikinTargetPlan {
  /** 現在の評定平均（入力値そのまま）。 */
  currentAverage: number;
  /** 目標達成に残り評価で必要な平均（理論値・5を超える場合は非達成）。 */
  requiredAverageForRemaining: number;
  /** 残り評価の合計として必要な点数（切り上げ・「合計であと何点」の目安）。 */
  requiredTotalForRemaining: number;
  /** requiredAverageForRemaining が5.0以下＝5段階評価で理論上達成可能か。 */
  achievable: boolean;
  /** 残り評価を待たず、現時点で既に目標平均に達しているか。 */
  alreadyAchieved: boolean;
}

/**
 * 目標の評定平均に届かせるために、残りの評価で必要な平均を逆算する（純粋関数）。
 *
 * @param currentAverage 現在の評定平均（1〜5）
 * @param currentCount 現在までに評価された回数（9教科×学期数など。0も許容）
 * @param targetAverage 目標の評定平均（1〜5）
 * @param remainingCount 残りの評価回数（0の場合は現在の平均をそのまま返す）
 */
export function calcRequiredAverageForTarget(
  currentAverage: number,
  currentCount: number,
  targetAverage: number,
  remainingCount: number,
): HyoteiHeikinTargetPlan {
  const safeCurrentCount = Math.max(0, currentCount);
  const safeRemainingCount = Math.max(0, remainingCount);
  const currentSum = currentAverage * safeCurrentCount;
  const alreadyAchieved = safeCurrentCount > 0 && currentAverage >= targetAverage;

  if (safeRemainingCount === 0) {
    return {
      currentAverage,
      requiredAverageForRemaining: currentAverage,
      requiredTotalForRemaining: 0,
      achievable: alreadyAchieved,
      alreadyAchieved,
    };
  }

  const totalCount = safeCurrentCount + safeRemainingCount;
  const requiredSum = targetAverage * totalCount - currentSum;
  const requiredAverageForRemaining = requiredSum / safeRemainingCount;

  return {
    currentAverage,
    requiredAverageForRemaining,
    requiredTotalForRemaining: Math.max(0, Math.ceil(requiredSum)),
    achievable: requiredAverageForRemaining <= 5,
    alreadyAchieved,
  };
}
