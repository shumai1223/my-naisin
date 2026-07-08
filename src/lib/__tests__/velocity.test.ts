/**
 * 名簿velocity＆7/20ゲート（Build 3）の集計純関数テスト。週境界・空DB・ゲート判定を固定する。
 */
import {
  weekStartOf,
  bucketDailyByWeek,
  evaluateJulyGate,
  evaluateTripwires,
  evaluateRosterVelocityTarget,
  findFunnelBottleneck,
  evaluateConsentCapture,
  GATE_SCHEDULE,
  activeGateMilestone,
  GATE_DEADLINE,
  GATE_CLICK_MULTIPLE_TARGET,
  HENSACHI_CTR_ALERT_THRESHOLD,
  AI_REFERRAL_SHARE_ALERT_THRESHOLD,
  ROSTER_TARGET,
  ROSTER_TARGET_DEADLINE,
  CONSENT_CAPTURE_RATIO_BASELINE,
  CONSENT_CAPTURE_RATIO_TOLERANCE,
  evaluateSpecialRateNegotiationTrigger,
  SPECIAL_RATE_NEGOTIATION_THRESHOLD,
  findWeakestPlacementFunnel,
  suggestFunnelIntervention,
} from '../velocity';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('weekStartOf（月曜始まりの週開始・UTC）', () => {
  it('日曜は前の月曜に、月曜はその日に、火曜は同週の月曜に丸まる', () => {
    expect(weekStartOf(D('2026-07-05'))).toBe('2026-06-29'); // 日曜 → 前週の月曜
    expect(weekStartOf(D('2026-07-06'))).toBe('2026-07-06'); // 月曜 → その日
    expect(weekStartOf(D('2026-07-07'))).toBe('2026-07-06'); // 火曜 → 同週の月曜
    expect(weekStartOf(D('2026-07-12'))).toBe('2026-07-06'); // 日曜 → 同週の月曜
  });
});

describe('bucketDailyByWeek（日次→週次バケット）', () => {
  it('空配列でも weeks 個のゼロ埋めバケットを古い→新しい順で返す', () => {
    const b = bucketDailyByWeek([], 8, D('2026-07-15'));
    expect(b).toHaveLength(8);
    expect(b.every((x) => x.count === 0)).toBe(true);
    // 昇順（古い→新しい）
    for (let i = 1; i < b.length; i++) {
      expect(b[i].weekStart > b[i - 1].weekStart).toBe(true);
    }
    // 最終バケットは now の週
    expect(b[b.length - 1].weekStart).toBe('2026-07-13');
  });

  it('同じ週の日次カウントは1バケットに合算される（週境界の日曜/月曜で分かれる）', () => {
    const daily = [
      { date: '2026-07-06', count: 2 }, // 月（7/6週）
      { date: '2026-07-12', count: 3 }, // 日（7/6週）
      { date: '2026-07-13', count: 5 }, // 月（7/13週）
    ];
    const b = bucketDailyByWeek(daily, 3, D('2026-07-15'));
    const byStart = Object.fromEntries(b.map((x) => [x.weekStart, x.count]));
    expect(byStart['2026-07-06']).toBe(5); // 2+3
    expect(byStart['2026-07-13']).toBe(5);
  });

  it('対象範囲外・不正日付の行は無視する', () => {
    const daily = [
      { date: '2020-01-01', count: 99 }, // 遠い過去 → 対象外
      { date: 'not-a-date', count: 7 }, // 不正
      { date: '2026-07-13', count: 4 }, // 対象
    ];
    const total = bucketDailyByWeek(daily, 4, D('2026-07-15')).reduce((s, x) => s + x.count, 0);
    expect(total).toBe(4);
  });

  it('label は月/日表記', () => {
    const b = bucketDailyByWeek([], 1, D('2026-07-15'));
    expect(b[0].label).toBe('7/13');
  });
});

describe('evaluateJulyGate（7/20 反証ゲート）', () => {
  it('期限前は pending＝まだ判定しない（残り日数を出す）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-04'), clicks: 200, clicksPrev: 100, leads: 5, conversions: 0 });
    expect(g.verdict).toBe('pending');
    expect(g.decided).toBe(false);
    expect(g.daysLeft).toBe(16);
    expect(g.deadline).toBe(GATE_DEADLINE);
  });

  it('期限後・発生ありは GO（モデル成立）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 200, clicksPrev: 100, leads: 8, conversions: 1 });
    expect(g.verdict).toBe('go');
    expect(g.decided).toBe(true);
  });

  it('期限後・発生0だがクリックが前季比 target 倍以上は ITERATE（律速はオファー側）', () => {
    const g = evaluateJulyGate({
      now: D('2026-07-21'),
      clicks: 100 * GATE_CLICK_MULTIPLE_TARGET,
      clicksPrev: 100,
      leads: 3,
      conversions: 0,
    });
    expect(g.verdict).toBe('iterate');
    expect(g.clickMultiple).toBeCloseTo(GATE_CLICK_MULTIPLE_TARGET, 5);
  });

  it('期限後・発生0でクリックも伸びていなければ PIVOT', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 100, clicksPrev: 100, leads: 0, conversions: 0 });
    expect(g.verdict).toBe('pivot');
  });

  it('前季クリック0は倍率を出さない（null・ラベルは —）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 50, clicksPrev: 0, leads: 0, conversions: 0 });
    expect(g.clickMultiple).toBeNull();
    expect(g.clickMultipleLabel).toBe('—');
    expect(g.verdict).toBe('pivot'); // 発生0＆倍率不明 → pivot
  });

  it('期限ちょうど（7/20）は判定確定フェーズに入る', () => {
    const g = evaluateJulyGate({ now: D('2026-07-20'), clicks: 10, clicksPrev: 1, leads: 0, conversions: 0 });
    expect(g.decided).toBe(true);
    expect(g.daysLeft).toBe(0);
  });

  it('deadlineIsoを渡すと8/20等の月次ゲート（I-3）にも同じ関数を再利用できる', () => {
    const pending = evaluateJulyGate({
      now: D('2026-08-01'),
      deadlineIso: '2026-08-20',
      clicks: 100,
      clicksPrev: 100,
      leads: 0,
      conversions: 0,
    });
    expect(pending.deadline).toBe('2026-08-20');
    expect(pending.verdict).toBe('pending');

    const decided = evaluateJulyGate({
      now: D('2026-08-21'),
      deadlineIso: '2026-08-20',
      clicks: 100,
      clicksPrev: 100,
      leads: 0,
      conversions: 2,
    });
    expect(decided.verdict).toBe('go');
  });

  it('deadlineIso省略時は既定のGATE_DEADLINE（7/20）を使う', () => {
    const g = evaluateJulyGate({ now: D('2026-07-04'), clicks: 200, clicksPrev: 100, leads: 5, conversions: 0 });
    expect(g.deadline).toBe(GATE_DEADLINE);
  });
});

describe('GATE_SCHEDULE / activeGateMilestone（月次ゲート定例化・I-3）', () => {
  it('7/20→8/20→9/20の3回が日付順に揃う', () => {
    expect(GATE_SCHEDULE.map((m) => m.deadlineIso)).toEqual(['2026-07-20', '2026-08-20', '2026-09-20']);
    expect(GATE_SCHEDULE[0].deadlineIso).toBe(GATE_DEADLINE);
  });

  it('各マイルストーンはPIVOT条件（focus）を持つ', () => {
    for (const m of GATE_SCHEDULE) {
      expect(m.focus.length).toBeGreaterThan(0);
    }
  });

  it('未到来の最初のマイルストーンを返す', () => {
    expect(activeGateMilestone(D('2026-07-04')).id).toBe('july-20');
    expect(activeGateMilestone(D('2026-07-21')).id).toBe('august-20');
    expect(activeGateMilestone(D('2026-08-21')).id).toBe('september-20');
  });

  it('全て過ぎていれば最後（9/20）を返す', () => {
    expect(activeGateMilestone(D('2026-12-01')).id).toBe('september-20');
  });
});

describe('evaluateTripwires（週次KPIレポートの常設監視4本）', () => {
  const baseInput = {
    hensachiWeeklyCtr: [
      { weekStart: '2026-06-08', ctrPercent: 4.5 },
      { weekStart: '2026-06-15', ctrPercent: 4.2 },
      { weekStart: '2026-06-22', ctrPercent: 4.0 },
      { weekStart: '2026-06-29', ctrPercent: 4.3 },
    ],
    toolPages: { impNow: 1000, impPrev: 1000, clicksNow: 100, clicksPrev: 100 },
    aiReferralSharePercent: 3,
    headQueryCtrNow: 8.6,
    headQueryCtrPrev: 8.0,
  };

  it('全て健全なら4本とも発火しない', () => {
    const results = evaluateTripwires(baseInput);
    expect(results.every((r) => !r.triggered)).toBe(true);
    expect(results).toHaveLength(4);
  });

  it('①/hensachi CTRが4週連続で閾値未満なら発火', () => {
    const results = evaluateTripwires({
      ...baseInput,
      hensachiWeeklyCtr: [
        { weekStart: '2026-06-08', ctrPercent: 3.1 },
        { weekStart: '2026-06-15', ctrPercent: 3.0 },
        { weekStart: '2026-06-22', ctrPercent: 2.9 },
        { weekStart: '2026-06-29', ctrPercent: 3.15 },
      ],
    });
    expect(results.find((r) => r.id === 'hensachi-ctr')?.triggered).toBe(true);
  });

  it('①4週分のデータが無いと判定不可（発火しない）', () => {
    const results = evaluateTripwires({ ...baseInput, hensachiWeeklyCtr: [{ weekStart: '2026-06-29', ctrPercent: 1.0 }] });
    const r = results.find((r) => r.id === 'hensachi-ctr')!;
    expect(r.triggered).toBe(false);
    expect(r.detail).toContain('判定不可');
  });

  it('①4週中3週だけ閾値未満（1週だけ揺れ戻し）なら発火しない', () => {
    const results = evaluateTripwires({
      ...baseInput,
      hensachiWeeklyCtr: [
        { weekStart: '2026-06-08', ctrPercent: 3.0 },
        { weekStart: '2026-06-15', ctrPercent: 3.0 },
        { weekStart: '2026-06-22', ctrPercent: 3.0 },
        { weekStart: '2026-06-29', ctrPercent: 5.0 },
      ],
    });
    expect(results.find((r) => r.id === 'hensachi-ctr')?.triggered).toBe(false);
  });

  it('②表示回数が伸びてクリックが横ばいなら発火', () => {
    const results = evaluateTripwires({
      ...baseInput,
      toolPages: { impNow: 1500, impPrev: 1000, clicksNow: 103, clicksPrev: 100 },
    });
    expect(results.find((r) => r.id === 'tool-imp-click-divergence')?.triggered).toBe(true);
  });

  it('②表示もクリックも同じ比率で伸びていれば発火しない', () => {
    const results = evaluateTripwires({
      ...baseInput,
      toolPages: { impNow: 1500, impPrev: 1000, clicksNow: 150, clicksPrev: 100 },
    });
    expect(results.find((r) => r.id === 'tool-imp-click-divergence')?.triggered).toBe(false);
  });

  it('③ai_referralシェアが閾値超なら発火', () => {
    const results = evaluateTripwires({ ...baseInput, aiReferralSharePercent: 12 });
    expect(results.find((r) => r.id === 'ai-referral-share')?.triggered).toBe(true);
  });

  it('③閾値ちょうどは発火しない（境界値）', () => {
    const results = evaluateTripwires({ ...baseInput, aiReferralSharePercent: AI_REFERRAL_SHARE_ALERT_THRESHOLD });
    expect(results.find((r) => r.id === 'ai-referral-share')?.triggered).toBe(false);
  });

  it('④ヘッドクエリCTRが半減以下なら発火', () => {
    const results = evaluateTripwires({ ...baseInput, headQueryCtrNow: 3.9, headQueryCtrPrev: 8.0 });
    expect(results.find((r) => r.id === 'head-query-ctr-halved')?.triggered).toBe(true);
  });

  it('④半減未満（6割程度の低下）なら発火しない', () => {
    const results = evaluateTripwires({ ...baseInput, headQueryCtrNow: 5.0, headQueryCtrPrev: 8.0 });
    expect(results.find((r) => r.id === 'head-query-ctr-halved')?.triggered).toBe(false);
  });

  it('閾値定数はbacklogに記載の値と一致する', () => {
    expect(HENSACHI_CTR_ALERT_THRESHOLD).toBe(3.2);
    expect(AI_REFERRAL_SHARE_ALERT_THRESHOLD).toBe(10);
  });
});

describe('evaluateRosterVelocityTarget（名簿3,000逆算・C-1）', () => {
  it('既定値は3,000件・冬窓オープン(11/15)から逆算する', () => {
    const g = evaluateRosterVelocityTarget({ now: D('2026-07-16'), currentRoster: 0 });
    expect(g.targetRoster).toBe(ROSTER_TARGET);
    expect(g.gap).toBe(3000);
    // 7/16 → 11/15 は122日
    expect(g.daysLeft).toBe(122);
    expect(g.requiredDailyVelocity).toBeCloseTo(3000 / 122, 5);
    expect(g.requiredWeeklyVelocity).toBeCloseTo((3000 / 122) * 7, 5);
    expect(g.observedDailyVelocity).toBeNull();
    expect(g.paceRatio).toBeNull();
    expect(g.onTrack).toBeNull();
  });

  it('目標到達済み（gapは負にならず0）', () => {
    const g = evaluateRosterVelocityTarget({ now: D('2026-07-16'), currentRoster: 5000 });
    expect(g.gap).toBe(0);
    expect(g.requiredDailyVelocity).toBe(0);
  });

  it('実測ペースを渡すと必要ペース比・オンペース判定が出る', () => {
    const onTrack = evaluateRosterVelocityTarget({
      now: D('2026-07-16'),
      currentRoster: 0,
      observedDailyVelocity: 3000 / 122,
    });
    expect(onTrack.paceRatio).toBeCloseTo(1, 5);
    expect(onTrack.onTrack).toBe(true);

    const behind = evaluateRosterVelocityTarget({
      now: D('2026-07-16'),
      currentRoster: 0,
      observedDailyVelocity: 0.5,
    });
    expect(behind.paceRatio).toBeLessThan(1);
    expect(behind.onTrack).toBe(false);
  });

  it('期限当日でも残日数は最低1（ゼロ除算しない）', () => {
    const g = evaluateRosterVelocityTarget({ now: D(ROSTER_TARGET_DEADLINE), currentRoster: 100 });
    expect(g.daysLeft).toBeGreaterThanOrEqual(1);
    expect(Number.isFinite(g.requiredDailyVelocity)).toBe(true);
  });

  it('目標・期限は上書き可能', () => {
    const g = evaluateRosterVelocityTarget({
      now: D('2026-08-01'),
      currentRoster: 200,
      targetRoster: 1000,
      deadlineIso: '2026-09-01',
    });
    expect(g.targetRoster).toBe(1000);
    expect(g.gap).toBe(800);
    expect(g.daysLeft).toBe(31);
  });
});

describe('findFunnelBottleneck（週次ボトルネック特定・C-1）', () => {
  it('最大の相対ドロップ率を持つ遷移を返す', () => {
    const b = findFunnelBottleneck([
      { id: 'tool_start', label: 'tool_start', count: 477 },
      { id: 'cta_view', label: 'cta_view', count: 759 }, // 増加（ドロップ0扱い）
      { id: 'affiliate_click', label: 'affiliate_click', count: 14 }, // 759→14=98%ドロップ
      { id: 'lead_submit', label: 'lead_submit', count: 2 }, // 14→2=86%ドロップ
    ]);
    expect(b?.fromLabel).toBe('cta_view');
    expect(b?.toLabel).toBe('affiliate_click');
    expect(b?.dropRatio).toBeCloseTo((759 - 14) / 759, 5);
  });

  it('段階が1件以下はnull', () => {
    expect(findFunnelBottleneck([])).toBeNull();
    expect(findFunnelBottleneck([{ id: 'a', label: 'a', count: 10 }])).toBeNull();
  });

  it('前段が0件の遷移は比較不能として除外し、増加は負にならず0扱い', () => {
    const b = findFunnelBottleneck([
      { id: 'a', label: 'a', count: 0 },
      { id: 'b', label: 'b', count: 100 },
      { id: 'c', label: 'c', count: 50 },
    ]);
    // a→b は前段0で除外、b→c のみ比較対象＝(100-50)/100=0.5
    expect(b?.fromLabel).toBe('b');
    expect(b?.dropRatio).toBeCloseTo(0.5, 5);
  });
});

describe('evaluateConsentCapture（Consent捕捉率の定点観測・I-5）', () => {
  it('基準値ちょうどは発火しない', () => {
    const r = evaluateConsentCapture({ gscClicks: 560, ga4OrganicSessions: 100 });
    expect(r.ratio).toBeCloseTo(CONSENT_CAPTURE_RATIO_BASELINE, 5);
    expect(r.deviation).toBeCloseTo(0, 5);
    expect(r.triggered).toBe(false);
  });

  it('許容乖離ちょうど（境界）は発火しない', () => {
    const boundary = CONSENT_CAPTURE_RATIO_BASELINE * (1 + CONSENT_CAPTURE_RATIO_TOLERANCE);
    const r = evaluateConsentCapture({ gscClicks: boundary * 100, ga4OrganicSessions: 100 });
    expect(r.triggered).toBe(false);
  });

  it('許容乖離を超えて急増（計測事故で分母が急減した見え方）すると発火する', () => {
    const r = evaluateConsentCapture({ gscClicks: 5820, ga4OrganicSessions: 200 }); // 29.1x
    expect(r.triggered).toBe(true);
    expect(r.deviation).toBeGreaterThan(CONSENT_CAPTURE_RATIO_TOLERANCE);
  });

  it('許容乖離を超えて急減（GA4側が急に多く拾い出した＝Consent同意率が急上昇 or GSC側の失報）すると発火する', () => {
    const r = evaluateConsentCapture({ gscClicks: 5820, ga4OrganicSessions: 3000 }); // 1.94x
    expect(r.triggered).toBe(true);
    expect(r.deviation).toBeLessThan(-CONSENT_CAPTURE_RATIO_TOLERANCE);
  });

  it('GA4 organicセッション0件は判定不可（誤ってtriggeredにしない）', () => {
    const r = evaluateConsentCapture({ gscClicks: 5820, ga4OrganicSessions: 0 });
    expect(r.ratio).toBeNull();
    expect(r.triggered).toBe(false);
    expect(r.detail).toContain('判定不可');
  });

  it('基準値・許容乖離は上書き可能', () => {
    const r = evaluateConsentCapture({ gscClicks: 1000, ga4OrganicSessions: 100 }, 10, 0.1); // ratio=10=baseline
    expect(r.baseline).toBe(10);
    expect(r.triggered).toBe(false);
  });
});

describe('evaluateSpecialRateNegotiationTrigger', () => {
  it('閾値未満は未発火', () => {
    const r = evaluateSpecialRateNegotiationTrigger(49);
    expect(r.triggered).toBe(false);
    expect(r.remaining).toBe(1);
    expect(r.threshold).toBe(SPECIAL_RATE_NEGOTIATION_THRESHOLD);
  });

  it('閾値ちょうどで発火', () => {
    const r = evaluateSpecialRateNegotiationTrigger(50);
    expect(r.triggered).toBe(true);
    expect(r.remaining).toBe(0);
  });

  it('閾値超過でも発火（remainingは0で頭打ち）', () => {
    const r = evaluateSpecialRateNegotiationTrigger(120);
    expect(r.triggered).toBe(true);
    expect(r.remaining).toBe(0);
  });

  it('閾値は上書き可能', () => {
    const r = evaluateSpecialRateNegotiationTrigger(30, 30);
    expect(r.triggered).toBe(true);
    expect(r.threshold).toBe(30);
  });
});

describe('findWeakestPlacementFunnel（面別ファネル段差の自動診断・Q-3）', () => {
  it('複数面のうちドロップ率が最大の面を返す', () => {
    const r = findWeakestPlacementFunnel([
      {
        placement: 'hensachi',
        stages: [
          { id: 'result_view', label: 'result_view', count: 1000 },
          { id: 'cta_view', label: 'cta_view', count: 900 }, // 10%ドロップ
          { id: 'affiliate_click', label: 'affiliate_click', count: 800 }, // 11%ドロップ
        ],
      },
      {
        placement: 'juku-shindan',
        stages: [
          { id: 'result_view', label: 'result_view', count: 300 },
          { id: 'cta_view', label: 'cta_view', count: 280 }, // 7%ドロップ
          { id: 'affiliate_click', label: 'affiliate_click', count: 20 }, // 93%ドロップ＝最悪
        ],
      },
    ]);
    expect(r?.placement).toBe('juku-shindan');
    expect(r?.fromLabel).toBe('cta_view');
    expect(r?.toLabel).toBe('affiliate_click');
    expect(r?.dropRatio).toBeCloseTo((280 - 20) / 280, 5);
  });

  it('全面が比較不能（1段以下）ならnull', () => {
    expect(
      findWeakestPlacementFunnel([
        { placement: 'a', stages: [{ id: 'x', label: 'x', count: 10 }] },
        { placement: 'b', stages: [] },
      ])
    ).toBeNull();
  });

  it('面が空配列ならnull', () => {
    expect(findWeakestPlacementFunnel([])).toBeNull();
  });
});

describe('suggestFunnelIntervention（テコ入れ方針の提案・Q-3）', () => {
  it('既知の遷移パターンには専用の方針文言を返す', () => {
    const bottleneck = findFunnelBottleneck([
      { id: 'result_view', label: 'result_view', count: 500 },
      { id: 'cta_view', label: 'cta_view', count: 100 },
    ]);
    expect(bottleneck).not.toBeNull();
    expect(suggestFunnelIntervention(bottleneck!)).toMatch(/配置・表示タイミング/);
  });

  it('未知の遷移には汎用の方針文言を返す', () => {
    const bottleneck = findFunnelBottleneck([
      { id: 'custom_a', label: 'カスタムA', count: 500 },
      { id: 'custom_b', label: 'カスタムB', count: 100 },
    ]);
    expect(bottleneck).not.toBeNull();
    expect(suggestFunnelIntervention(bottleneck!)).toMatch(/カスタムA→カスタムB/);
  });
});
