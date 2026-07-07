import {
  EXPERIMENTS,
  getExperiment,
  runningExperiments,
  judgeWinner,
} from '@/lib/experiments';
import { isLiveAffiliate } from '@/lib/affiliates';

describe('experiments registry', () => {
  it('全実験は arms[0] を control とし、id が一意', () => {
    const ids = new Set<string>();
    for (const e of EXPERIMENTS) {
      expect(e.arms.length).toBeGreaterThanOrEqual(2);
      expect(e.arms[0].id).toBe('control');
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
    }
  });

  it('running な実験のアームに割当てた送客先は live のみ（pendingを稼働させない）', () => {
    for (const e of runningExperiments()) {
      for (const arm of e.arms) {
        if (arm.affiliateId) expect(isLiveAffiliate(arm.affiliateId)).toBe(true);
      }
    }
  });

  it('既存の hogosha-cta-text-2026 を引ける', () => {
    const e = getExperiment('hogosha-cta-text-2026');
    expect(e).toBeDefined();
    expect(e?.arms[0].id).toBe('control');
    expect(runningExperiments().some((x) => x.id === 'hogosha-cta-text-2026')).toBe(true);
  });

  it('lead_submit を主要指標にする実験が稼働している（名簿velocityのA/B）', () => {
    const leadExps = runningExperiments().filter((e) => e.primaryMetric === 'lead_submit');
    expect(leadExps.length).toBeGreaterThanOrEqual(1);
    // SaveResultCTA が参照するコピーA/B。reward アームは ctaPrefix を持つ。
    const copy = getExperiment('lead-copy-2026');
    expect(copy?.primaryMetric).toBe('lead_submit');
    expect(copy?.arms.find((a) => a.id === 'reward')?.ctaPrefix).toBeTruthy();
  });

  // scaled-contentゲート（H-5）：A/B実験も「コピペで同じ物を2アーム分」という重複バグが起こり得る面。
  // control と実際に差分（送客先 or コピー）が無いアームは、有意差が絶対に出ない無意味な実験になる。
  it('control以外の各アームは、送客先・見出し・本文・CTA接頭辞のいずれかがcontrolと異なる（コピペ重複防止）', () => {
    for (const e of EXPERIMENTS) {
      const control = e.arms[0];
      for (const arm of e.arms.slice(1)) {
        const hasAnyDiff =
          arm.affiliateId !== control.affiliateId ||
          arm.heading !== control.heading ||
          arm.body !== control.body ||
          arm.ctaPrefix !== control.ctaPrefix;
        expect(hasAnyDiff).toBe(true);

        // 両アームが同じフィールドを定義している場合、値そのものが一致していないことも確認する
        // （片方だけ未定義で「差はある」と誤判定されるケースを潰す＝より厳密な重複検出）。
        if (arm.heading !== undefined && control.heading !== undefined) {
          expect(arm.heading).not.toBe(control.heading);
        }
        if (arm.body !== undefined && control.body !== undefined) {
          expect(arm.body).not.toBe(control.body);
        }
        if (arm.ctaPrefix !== undefined && control.ctaPrefix !== undefined) {
          expect(arm.ctaPrefix).not.toBe(control.ctaPrefix);
        }
      }
    }
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
