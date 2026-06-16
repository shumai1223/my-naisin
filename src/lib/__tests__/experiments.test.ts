import {
  EXPERIMENTS,
  getExperiment,
  runningExperiments,
  judgeWinner,
} from '@/lib/experiments';

describe('experiments registry', () => {
  it('全実験は arms[0] を control とし、id が一意', () => {
    const ids = new Set<string>();
    for (const e of EXPERIMENTS) {
      expect(e.arms.length).toBeGreaterThanOrEqual(2);
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
    }
  });

  it('既存の hogosha-cta-text-2026 を引ける', () => {
    const e = getExperiment('hogosha-cta-text-2026');
    expect(e).toBeDefined();
    expect(e?.arms[0].id).toBe('control');
    expect(runningExperiments().some((x) => x.id === 'hogosha-cta-text-2026')).toBe(true);
  });
});

describe('judgeWinner', () => {
  it('十分なサンプルで明確な勝者を有意と判定する', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 1000, conversions: 100 }, // 10%
      { id: 'urgent', impressions: 1000, conversions: 200 }, // 20%
    ]);
    expect(v).not.toBeNull();
    expect(v!.bestArm).toBe('urgent');
    expect(v!.significant).toBe(true);
    expect(v!.lift).toBeCloseTo(1.0, 1);
  });

  it('サンプル不足では有意としない（判定保留）', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 50, conversions: 5 },
      { id: 'urgent', impressions: 50, conversions: 10 },
    ]);
    expect(v!.significant).toBe(false);
    expect(v!.recommendation).toContain('サンプル');
  });

  it('対照群が最良なら現状維持を推奨', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 1000, conversions: 200 },
      { id: 'urgent', impressions: 1000, conversions: 120 },
    ]);
    expect(v!.bestArm).toBe('control');
    expect(v!.significant).toBe(false);
    expect(v!.recommendation).toContain('現状維持');
  });

  it('差はあるが有意でない場合は継続を推奨', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 1000, conversions: 100 }, // 10.0%
      { id: 'urgent', impressions: 1000, conversions: 112 }, // 11.2%
    ]);
    expect(v!.bestArm).toBe('urgent');
    expect(v!.significant).toBe(false);
    expect(v!.recommendation).toContain('継続');
  });

  it('アームが1つ以下なら null', () => {
    expect(judgeWinner([{ id: 'control', impressions: 10, conversions: 1 }])).toBeNull();
  });
});
