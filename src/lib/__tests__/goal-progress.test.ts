/**
 * 目標到達率(C-4)のテスト。dashboardの「保存中の目標」カードが継続的に最新化されることを固定する。
 */
import { computeLiveGoalProgress } from '@/lib/goal-progress';

describe('computeLiveGoalProgress', () => {
  it('直近の記録が無ければgoalのスナップショット値をそのまま使う(後方互換)', () => {
    const goal = { target: 38, score: 30, savedAt: '2026-04-01T00:00:00.000Z' };
    const result = computeLiveGoalProgress(goal, null);
    expect(result.currentScore).toBe(30);
    expect(result.gap).toBe(8);
    expect(result.isLive).toBe(false);
  });

  it('目標保存時と同じ記録(savedAtが一致)なら、直近の記録を使ってもisLive=false', () => {
    const goal = { target: 38, score: 30, savedAt: '2026-04-01T00:00:00.000Z' };
    const result = computeLiveGoalProgress(goal, { total: 30, savedAt: '2026-04-01T00:00:00.000Z' });
    expect(result.isLive).toBe(false);
    expect(result.currentScore).toBe(30);
  });

  it('目標保存後に新しい記録があれば、そちらを現在値として使い到達率を再計算する', () => {
    const goal = { target: 38, score: 30, savedAt: '2026-04-01T00:00:00.000Z' };
    const result = computeLiveGoalProgress(goal, { total: 35, savedAt: '2026-07-01T00:00:00.000Z' });
    expect(result.currentScore).toBe(35);
    expect(result.gap).toBe(3);
    expect(result.rate).toBe(Math.round((35 / 38) * 100));
    expect(result.isLive).toBe(true);
  });

  it('目標到達(gap<=0)を正しく表せる', () => {
    const goal = { target: 30, score: 25, savedAt: '2026-04-01T00:00:00.000Z' };
    const result = computeLiveGoalProgress(goal, { total: 32, savedAt: '2026-07-01T00:00:00.000Z' });
    expect(result.gap).toBeLessThanOrEqual(0);
    expect(result.rate).toBeGreaterThanOrEqual(100);
  });

  it('target<=0はrateをnullにする(0除算回避)', () => {
    const goal = { target: 0, score: 10, savedAt: '2026-04-01T00:00:00.000Z' };
    const result = computeLiveGoalProgress(goal, null);
    expect(result.rate).toBeNull();
  });
});
