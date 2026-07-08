import { calcRequiredAverageForTarget } from '@/lib/hyotei-heikin';

describe('calcRequiredAverageForTarget', () => {
  it('現在4.0(18回)→目標4.3・残り9回なら必要平均は4.9', () => {
    const r = calcRequiredAverageForTarget(4.0, 18, 4.3, 9);
    expect(r.requiredAverageForRemaining).toBeCloseTo(4.9, 5);
    expect(r.achievable).toBe(true);
    expect(r.alreadyAchieved).toBe(false);
  });

  it('現在の実績が無い(count=0)場合は必要平均=目標平均そのもの', () => {
    const r = calcRequiredAverageForTarget(0, 0, 4.0, 9);
    expect(r.requiredAverageForRemaining).toBeCloseTo(4.0, 5);
  });

  it('残り回数が0なら現在の平均をそのまま返す', () => {
    const r = calcRequiredAverageForTarget(4.2, 18, 4.5, 0);
    expect(r.requiredAverageForRemaining).toBe(4.2);
    expect(r.requiredTotalForRemaining).toBe(0);
  });

  it('既に目標平均に達している場合はalreadyAchieved=true', () => {
    const r = calcRequiredAverageForTarget(4.5, 18, 4.0, 9);
    expect(r.alreadyAchieved).toBe(true);
  });

  it('count=0のときはalreadyAchievedにならない（実績が無いため判定不能）', () => {
    const r = calcRequiredAverageForTarget(0, 0, 4.0, 9);
    expect(r.alreadyAchieved).toBe(false);
  });

  it('必要平均が5を超える場合はachievable=false（5段階評価では理論上不可能）', () => {
    const r = calcRequiredAverageForTarget(2.0, 18, 4.8, 9);
    expect(r.requiredAverageForRemaining).toBeGreaterThan(5);
    expect(r.achievable).toBe(false);
  });

  it('requiredTotalForRemainingは必要合計の切り上げ値', () => {
    // 目標4.0×27回=108点、現在3.9×18回=70.2点 → 残り必要合計=37.8→切り上げ38
    const r = calcRequiredAverageForTarget(3.9, 18, 4.0, 9);
    expect(r.requiredTotalForRemaining).toBe(38);
  });

  it('負の入力は安全側に0扱いする（クラッシュしない）', () => {
    expect(() => calcRequiredAverageForTarget(4.0, -5, 4.0, -3)).not.toThrow();
    const r = calcRequiredAverageForTarget(4.0, -5, 4.0, -3);
    expect(r.requiredAverageForRemaining).toBe(4.0);
  });
});
