import {
  EXPERIMENTS,
  getExperiment,
  runningExperiments,
  queuedExperiments,
  nextQueuedExperiment,
  judgeWinner,
  checkExperimentPortfolioHealth,
  isExperimentRunning,
  MIN_RUNNING_EXPERIMENTS,
  ROTATION_INTERVAL_DAYS,
  requiredSampleSizePerArm,
  DEFAULT_TEST_ALPHA,
  DEFAULT_TEST_POWER,
  type ExperimentDef,
} from '@/lib/experiments';
import { isLiveAffiliate } from '@/lib/affiliates';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

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
  });

  // 2026-08-01: GA4のexperiment_idカスタムディメンション未登録により4実験
  // （hogosha-cta-text-2026/result-offer-2026/hiyou-copy-2026/lead-copy-2026）が
  // 41〜45日間判定不能のまま稼働し続けていたため停止した（[[fable5-fullaccel-backlog-2026-07]]
  // Λ-2の次の追加指示・②-a）。再開は個別に検証してから行う。
  it('lead-copy-2026はGA4 experiment_id未登録+月1件の低頻度で判定不能だったため停止済み(pausedかつcontrolのまま)', () => {
    const copy = getExperiment('lead-copy-2026');
    expect(copy?.status).toBe('paused');
    expect(copy?.primaryMetric).toBe('lead_submit');
    // SaveResultCTA が参照するコピーA/B。reward アームは ctaPrefix を持つ（停止中でもレジストリの形は維持）。
    expect(copy?.arms.find((a) => a.id === 'reward')?.ctaPrefix).toBeTruthy();
  });

  it('2026-08-01に停止した4実験のうちlead-copy-2026は依然pausedで、停止理由がnoteに記録されている', () => {
    const stillPausedIds = ['lead-copy-2026'];
    for (const id of stillPausedIds) {
      const e = getExperiment(id);
      expect(e?.status).toBe('paused');
      expect(e?.note).toContain('2026-08-01停止');
    }
  });

  it('hogosha-cta-text-2026とresult-offer-2026はGA4 experiment_idの実データ確認後、2026-08-04にstartedAtリセットで再開済み', () => {
    for (const id of ['hogosha-cta-text-2026', 'result-offer-2026']) {
      const e = getExperiment(id);
      expect(e?.status).toBe('running');
      expect(e?.startedAt).toBe('2026-08-04');
      expect(e?.note).toContain('2026-08-04再開');
    }
  });

  it('hiyou-copy-2026はGA4 experiment_idの実データ確認後、2026-08-05にstartedAtリセットで再開済み', () => {
    const e = getExperiment('hiyou-copy-2026');
    expect(e?.status).toBe('running');
    expect(e?.startedAt).toBe('2026-08-05');
    expect(e?.note).toContain('2026-08-05再開');
  });

  // scaled-contentゲート（H-5）：A/B実験も「コピペで同じ物を2アーム分」という重複バグが起こり得る面。
  // control と実際に差分（送客先 or コピー or 色 or タイミング）が無いアームは、有意差が絶対に出ない無意味な実験になる。
  it('control以外の各アームは、送客先・見出し・本文・CTA接頭辞・配色・表示タイミングのいずれかがcontrolと異なる（コピペ重複防止）', () => {
    for (const e of EXPERIMENTS) {
      const control = e.arms[0];
      for (const arm of e.arms.slice(1)) {
        const hasAnyDiff =
          arm.affiliateId !== control.affiliateId ||
          arm.heading !== control.heading ||
          arm.body !== control.body ||
          arm.ctaPrefix !== control.ctaPrefix ||
          arm.ctaColorClass !== control.ctaColorClass ||
          arm.revealDelayMs !== control.revealDelayMs ||
          arm.shareFrame !== control.shareFrame;
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

describe('isExperimentRunning（2026-08-01追加・useExperimentがトラフィック分割を止めるための判定）', () => {
  it('status=runningの実験はtrue', () => {
    expect(isExperimentRunning('line-cta-copy-2026')).toBe(true);
    expect(isExperimentRunning('hogosha-cta-text-2026')).toBe(true);
  });

  it('status=pausedの実験はfalse(2026-08-01停止分のうち再開していないもの)', () => {
    expect(isExperimentRunning('lead-copy-2026')).toBe(false);
  });

  it('レジストリに無いID(フォールバックアーム利用時)は既存動作を壊さないためtrue', () => {
    expect(isExperimentRunning('no-such-experiment-id')).toBe(true);
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

  it('サンプル不足時、検出力80%の目安件数を推奨文に含める（Q-2）', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 50, conversions: 5 }, // 10%
      { id: 'urgent', impressions: 50, conversions: 10 }, // 20%
    ]);
    expect(v!.requiredSampleEstimate).not.toBeNull();
    expect(v!.requiredSampleEstimate).toBeGreaterThan(0);
    expect(v!.recommendation).toContain('検出力80%の目安');
  });

  it('対照群のCVRが0またはリフト0のときはrequiredSampleEstimateがnull', () => {
    const v = judgeWinner([
      { id: 'control', impressions: 100, conversions: 0 },
      { id: 'urgent', impressions: 100, conversions: 0 },
    ]);
    expect(v!.requiredSampleEstimate).toBeNull();
  });
});

describe('requiredSampleSizePerArm（検出力サンプルサイズ計算・Q-2）', () => {
  it('既知の入力（5%→7%・α=0.05・power=0.8）で標準公式通りの値を返す', () => {
    // 手計算リファレンス: p1=0.05, p2=0.07, pbar=0.06
    // term1=1.96*sqrt(2*0.06*0.94)=0.6584, term2=0.8416*sqrt(0.05*0.95+0.07*0.93)=0.2824
    // n=(0.9408)^2/(0.02)^2 ≈ 2213
    const n = requiredSampleSizePerArm({ baselineRate: 0.05, minDetectableEffect: 0.02 });
    expect(n).toBeGreaterThanOrEqual(2100);
    expect(n).toBeLessThanOrEqual(2300);
  });

  it('検出したい差が小さいほど必要サンプルは大きくなる', () => {
    const small = requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.01 });
    const large = requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.05 });
    expect(small).toBeGreaterThan(large);
  });

  it('power=0.9はpower=0.8より必要サンプルが大きい（より厳しい検出力を要求するため）', () => {
    const p80 = requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.02, power: 0.8 });
    const p90 = requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.02, power: 0.9 });
    expect(p90).toBeGreaterThan(p80);
  });

  it('未対応のalpha/powerはエラーを投げる', () => {
    expect(() => requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.02, alpha: 0.2 })).toThrow();
    expect(() => requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0.02, power: 0.5 })).toThrow();
  });

  it('minDetectableEffectが0以下はエラーを投げる', () => {
    expect(() => requiredSampleSizePerArm({ baselineRate: 0.1, minDetectableEffect: 0 })).toThrow();
  });

  it('既定値はDEFAULT_TEST_ALPHA=0.05・DEFAULT_TEST_POWER=0.8', () => {
    expect(DEFAULT_TEST_ALPHA).toBe(0.05);
    expect(DEFAULT_TEST_POWER).toBe(0.8);
  });
});

describe('checkExperimentPortfolioHealth（常時2本A/B運用・月次ローテーション・I-2）', () => {
  it('実レジストリは現在runningが2本以上あり下限を満たす', () => {
    const health = checkExperimentPortfolioHealth(EXPERIMENTS, D('2026-07-07'));
    expect(health.runningCount).toBeGreaterThanOrEqual(MIN_RUNNING_EXPERIMENTS);
    expect(health.belowMinimum).toBe(false);
  });

  it('running数が下限未満だとbelowMinimumが立つ', () => {
    const one: ExperimentDef[] = [
      {
        id: 'solo-2026',
        hypothesis: 'test',
        status: 'running',
        arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b', ctaPrefix: 'x' }],
        primaryMetric: 'cta_view',
        startedAt: '2026-07-01',
      },
    ];
    const health = checkExperimentPortfolioHealth(one, D('2026-07-07'));
    expect(health.runningCount).toBe(1);
    expect(health.belowMinimum).toBe(true);
  });

  it('ROTATION_INTERVAL_DAYSを超えて未決着で稼働中の実験をoverdueForRotationに挙げる', () => {
    const stale: ExperimentDef[] = [
      {
        id: 'stale-2026',
        hypothesis: 'test',
        status: 'running',
        arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b', ctaPrefix: 'x' }],
        primaryMetric: 'cta_view',
        startedAt: '2026-05-01',
      },
      {
        id: 'fresh-2026',
        hypothesis: 'test',
        status: 'running',
        arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b', ctaPrefix: 'y' }],
        primaryMetric: 'cta_view',
        startedAt: '2026-07-01',
      },
    ];
    const health = checkExperimentPortfolioHealth(stale, D('2026-07-07'));
    expect(health.overdueForRotation.map((r) => r.id)).toEqual(['stale-2026']);
    expect(health.overdueForRotation[0].daysRunning).toBeGreaterThanOrEqual(ROTATION_INTERVAL_DAYS);
  });

  it('startedAtが無い実験はローテーション判定から除外される（安全側）', () => {
    const noDate: ExperimentDef[] = [
      { id: 'a', hypothesis: 'x', status: 'running', arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b' }], primaryMetric: 'cta_view' },
      { id: 'b2', hypothesis: 'x', status: 'running', arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b' }], primaryMetric: 'cta_view' },
    ];
    const health = checkExperimentPortfolioHealth(noDate, D('2026-07-07'));
    expect(health.overdueForRotation).toHaveLength(0);
  });

  it('paused/decidedの実験はrunningCount・ローテーション判定に含まれない', () => {
    const mixed: ExperimentDef[] = [
      {
        id: 'running-1',
        hypothesis: 'x',
        status: 'running',
        arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b' }],
        primaryMetric: 'cta_view',
        startedAt: '2026-01-01',
      },
      {
        id: 'paused-1',
        hypothesis: 'x',
        status: 'paused',
        arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b' }],
        primaryMetric: 'cta_view',
        startedAt: '2026-01-01',
      },
    ];
    const health = checkExperimentPortfolioHealth(mixed, D('2026-07-07'));
    expect(health.runningCount).toBe(1);
    expect(health.overdueForRotation.map((r) => r.id)).toEqual(['running-1']);
  });

  it('queuedAvailableCountは実レジストリのqueued件数と一致する', () => {
    const health = checkExperimentPortfolioHealth();
    expect(health.queuedAvailableCount).toBe(EXPERIMENTS.filter((e) => e.status === 'queued').length);
  });
});

describe('実験バンク（TIER L-4・queued弾倉）', () => {
  it('queuedExperiments()はstatus=queuedのみを返し、15本以上ある', () => {
    const queued = queuedExperiments();
    expect(queued.length).toBeGreaterThanOrEqual(15);
    for (const e of queued) {
      expect(e.status).toBe('queued');
    }
  });

  it('queuedな実験はrunningExperiments()に含まれない（稼働数の誤カウント防止）', () => {
    const runningIds = new Set(runningExperiments().map((e) => e.id));
    for (const e of queuedExperiments()) {
      expect(runningIds.has(e.id)).toBe(false);
    }
  });

  it('queuedな実験は全てplacementを持つ（配線先が明示されている）', () => {
    for (const e of queuedExperiments()) {
      expect(e.placement).toBeDefined();
    }
  });

  it('nextQueuedExperiment(placement)は該当面の候補を優先して返す', () => {
    const e = nextQueuedExperiment('hensachi');
    expect(e?.placement).toBe('hensachi');
  });

  it('nextQueuedExperiment()はplacement未指定なら先頭の候補を返す', () => {
    const e = nextQueuedExperiment();
    expect(e).toEqual(queuedExperiments()[0]);
  });

  it('指定placementに一致する候補が無ければ先頭にフォールバックする', () => {
    const list: ExperimentDef[] = [
      { id: 'q1', hypothesis: 'x', status: 'queued', arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b', ctaPrefix: 'p' }], primaryMetric: 'cta_view', placement: 'result' },
      { id: 'q2', hypothesis: 'x', status: 'queued', arms: [{ id: 'control', label: 'c' }, { id: 'b', label: 'b', ctaPrefix: 'p' }], primaryMetric: 'cta_view', placement: 'hiyou' },
    ];
    expect(nextQueuedExperiment('mendan', list)?.id).toBe('q1');
    expect(nextQueuedExperiment('hiyou', list)?.id).toBe('q2');
  });
});
