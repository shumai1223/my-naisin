/**
 * 目標到達率（C-4：dashboardの継続トラッカー化）の純関数。
 *
 * 従来、保存した目標（SavedGoal.score/gap）は「目標を設定した瞬間」のスナップショットのまま
 * 固定表示され、その後に新しい通知表を記録してもdashboardの目標カードが更新されなかった
 * （＝一度きりの表示で終わり、継続的な進捗トラッカーになっていなかった）。
 *
 * ここでは「同じ都道府県の直近の記録（history）」があればそちらを優先し、無ければ
 * goalのスナップショット値にフォールバックする方針を純関数として切り出し、テスト可能にする。
 */

export interface GoalLike {
  target: number;
  score: number;
  savedAt: string;
}

export interface LatestMatchingEntry {
  total: number;
  savedAt: string;
}

export interface LiveGoalProgress {
  /** 表示に使う「現在の得点」（直近の記録があればそれ、無ければ目標保存時のスコア）。 */
  currentScore: number;
  /** 目標までの差（正=不足、0以下=到達）。 */
  gap: number;
  /** 目標到達率（%）。target<=0はnull（0除算回避）。 */
  rate: number | null;
  /** 直近の記録（目標保存時より新しいhistory）を使えたか。UIの「直近の記録を反映」表示に使う。 */
  isLive: boolean;
}

/**
 * goal（保存した目標）と、同一都道府県の直近history（あれば）から、常に最新の進捗を計算する。
 * latestMatching が無い、または目標保存時と同じ記録（新しい記録が無い）なら、
 * goal.score をそのまま使う（＝従来の一度きり表示と同じ結果になり後方互換）。
 */
export function computeLiveGoalProgress(
  goal: GoalLike,
  latestMatching: LatestMatchingEntry | null
): LiveGoalProgress {
  const isLive = latestMatching !== null && latestMatching.savedAt !== goal.savedAt;
  const currentScore = latestMatching ? latestMatching.total : goal.score;
  const gap = goal.target - currentScore;
  const rate = goal.target > 0 ? Math.round((currentScore / goal.target) * 100) : null;
  return { currentScore, gap, rate, isLive };
}
