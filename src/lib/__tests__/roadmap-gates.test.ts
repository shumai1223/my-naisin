/**
 * 能動運用ロードマップの目盛りゲート G1〜G6（2026-07-11ロードマップ）の判定純関数テスト。
 * 日付境界・未計測・努力/最高の閾値・G2（チェックリスト系）の分岐を固定する。
 */
import {
  ROADMAP_GATES,
  evaluateRoadmapGates,
  nextRoadmapGate,
  detectWinterAffiliateReadiness,
  winterAffiliateReadinessSummary,
  WINTER_SEASONAL_AFFILIATE_IDS,
  type RoadmapGateActuals,
} from '../roadmap-gates';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('ROADMAP_GATES（正準データ）', () => {
  it('G1〜G6の6件が日付昇順で定義されている', () => {
    expect(ROADMAP_GATES).toHaveLength(6);
    for (let i = 1; i < ROADMAP_GATES.length; i++) {
      expect(ROADMAP_GATES[i].dateIso > ROADMAP_GATES[i - 1].dateIso).toBe(true);
    }
    expect(ROADMAP_GATES.map((g) => g.id)).toEqual([
      'g1-roster-velocity',
      'g2-winter-prep',
      'g3-contract-api',
      'g4-cp-november',
      'g5-december-close',
      'g6-february-check',
    ]);
  });
});

describe('evaluateRoadmapGates（判定日前）', () => {
  it('判定日前は実測を渡してもupcomingのまま（先取り判定しない）', () => {
    const results = evaluateRoadmapGates({ rosterN: 200 }, D('2026-08-01'));
    expect(results[0].status).toBe('upcoming');
    expect(results[0].decided).toBe(false);
    expect(results[0].daysLeft).toBeGreaterThan(0);
  });
});

describe('G1 名簿velocity（8/31）', () => {
  const evalG1 = (actuals: RoadmapGateActuals) => evaluateRoadmapGates(actuals, D('2026-08-31'))[0];

  it('未計測ならunmeasured', () => {
    expect(evalG1({}).status).toBe('unmeasured');
  });
  it('N=150以上でon-track-max', () => {
    expect(evalG1({ rosterN: 150 }).status).toBe('on-track-max');
  });
  it('N=100〜149でon-track-effort', () => {
    expect(evalG1({ rosterN: 120 }).status).toBe('on-track-effort');
  });
  it('N=100未満でbehind', () => {
    const r = evalG1({ rosterN: 40 });
    expect(r.status).toBe('behind');
    expect(r.detail).toContain('Aレバー');
  });
});

describe('G2 冬案件申請（チェックリスト系・数値化しない）', () => {
  it('g2Confirmed未指定はmanual-check', () => {
    expect(evaluateRoadmapGates({}, D('2026-09-30'))[1].status).toBe('manual-check');
  });
  it('g2Confirmed=trueはon-track-max、falseはbehind', () => {
    expect(evaluateRoadmapGates({ g2Confirmed: true }, D('2026-09-30'))[1].status).toBe('on-track-max');
    expect(evaluateRoadmapGates({ g2Confirmed: false }, D('2026-09-30'))[1].status).toBe('behind');
  });
  it('detailに自動検出(winterAffiliateReadinessSummary)の要約を含む（👤確認を上書きしない補助情報）', () => {
    const r = evaluateRoadmapGates({}, D('2026-09-30'))[1];
    expect(r.detail).toContain('自動検出');
    expect(r.detail).toContain('冬季アフィリ');
  });
});

describe('T-6：G2自動検出補助（冬季アフィリのlive化状況）', () => {
  it('WINTER_SEASONAL_AFFILIATE_IDSは冬期講習/直前案件の2件', () => {
    expect(WINTER_SEASONAL_AFFILIATE_IDS).toEqual(['winter-koushuu-trial', 'last-minute-trial']);
  });

  it('detectWinterAffiliateReadinessは各IDのlive状況を返す（現状は両方ともpending枠なのでfalse）', () => {
    const readiness = detectWinterAffiliateReadiness();
    expect(readiness).toHaveLength(2);
    for (const r of readiness) {
      expect(typeof r.live).toBe('boolean');
      expect(typeof r.name).toBe('string');
    }
  });

  it('winterAffiliateReadinessSummaryは"N/M件live化"の形式を含む', () => {
    const summary = winterAffiliateReadinessSummary();
    expect(summary).toMatch(/冬季アフィリ\d+\/\d+件live化/);
  });

  it('全てliveなIDリストを渡すとN/Mが一致する（isLiveAffiliateの実データに依存しないユニットテスト）', () => {
    // 実在の常時live案件（affiliates.ts）を使い、検出ロジック自体の正しさをpending枠と独立に確認する。
    const summary = winterAffiliateReadinessSummary(['sora-juku-text']);
    expect(summary).toContain('冬季アフィリ1/1件live化');
  });
});

describe('G3 直接契約／API（10/31・OR条件とAND条件）', () => {
  const evalG3 = (actuals: RoadmapGateActuals) => evaluateRoadmapGates(actuals, D('2026-10-31'))[2];

  it('契約0・API0はbehind', () => {
    expect(evalG3({ contractCount: 0, apiCustomers: 0 }).status).toBe('behind');
  });
  it('契約1のみ（API0）はon-track-effort（片方のみ）', () => {
    expect(evalG3({ contractCount: 1, apiCustomers: 0 }).status).toBe('on-track-effort');
  });
  it('契約1かつAPI1はon-track-max', () => {
    expect(evalG3({ contractCount: 1, apiCustomers: 1 }).status).toBe('on-track-max');
  });
});

describe('G4 C_p実測（11/30・ASP発生0は絶対条件で即behind）', () => {
  const evalG4 = (actuals: RoadmapGateActuals) => evaluateRoadmapGates(actuals, D('2026-11-30'))[3];

  it('C_pが高くても発生0なら絶対条件未達でbehind', () => {
    const r = evalG4({ cpThisMonth: 200, conversionsThisMonth: 0 });
    expect(r.status).toBe('behind');
    expect(r.detail).toContain('絶対条件');
  });
  it('発生>0かつC_p>=100でon-track-max', () => {
    expect(evalG4({ cpThisMonth: 100, conversionsThisMonth: 3 }).status).toBe('on-track-max');
  });
  it('発生>0かつC_p40-99でon-track-effort', () => {
    expect(evalG4({ cpThisMonth: 50, conversionsThisMonth: 1 }).status).toBe('on-track-effort');
  });
});

describe('G5 窓フル回収（12/25・名簿Nと累計¥の両方が閾値を満たす必要）', () => {
  const evalG5 = (actuals: RoadmapGateActuals) => evaluateRoadmapGates(actuals, D('2026-12-25'))[4];

  it('片方だけ最高軌道でも到達しなければon-track-effort以下', () => {
    // N=900(最高超)だが累計¥が努力線未満 → behind（AND条件）
    const r = evalG5({ rosterN: 900, cumulativeConfirmedYen: 100_000 });
    expect(r.status).toBe('behind');
  });
  it('N>=880かつ累計>=62万でon-track-max', () => {
    expect(evalG5({ rosterN: 900, cumulativeConfirmedYen: 650_000 }).status).toBe('on-track-max');
  });
});

describe('G6 実測照合（2/28）', () => {
  const evalG6 = (actuals: RoadmapGateActuals) => evaluateRoadmapGates(actuals, D('2027-02-28'))[5];

  it('未計測はunmeasured', () => {
    expect(evalG6({}).status).toBe('unmeasured');
  });
  it('累計>=160万でon-track-max', () => {
    expect(evalG6({ cumulativeConfirmedYen: 1_700_000 }).status).toBe('on-track-max');
  });
  it('累計<56万でbehind', () => {
    expect(evalG6({ cumulativeConfirmedYen: 100_000 }).status).toBe('behind');
  });
});

describe('nextRoadmapGate', () => {
  it('全ゲート未到来の時点ではG1を返す', () => {
    expect(nextRoadmapGate(D('2026-07-15')).id).toBe('g1-roster-velocity');
  });
  it('G1〜G5を過ぎていればG6を返す', () => {
    expect(nextRoadmapGate(D('2027-01-15')).id).toBe('g6-february-check');
  });
  it('全ゲートを過ぎていれば最後のG6を返す', () => {
    expect(nextRoadmapGate(D('2027-05-01')).id).toBe('g6-february-check');
  });
});
