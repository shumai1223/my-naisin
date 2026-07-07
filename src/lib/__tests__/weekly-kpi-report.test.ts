/**
 * 週次KPIメール組み立て（I-1）のテスト。ゲート/トリップワイヤーとの結線と、
 * 出力に¥予測を書かないこと（[[no-revenue-projections-guideline]]）を固定する。
 */
import { formatWeeklyKpiEmail, type WeeklyKpiData } from '@/lib/weekly-kpi-report';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

function baseData(overrides: Partial<WeeklyKpiData> = {}): WeeklyKpiData {
  return {
    weekEnding: '2026-07-05',
    gsc: { clicksNow: 5820, clicksPrev: 1557, impNow: 158657, impPrev: 120000 },
    parentLandingViews: 0,
    leadVelocity: { leadsThisWeek: 2, targetPerWeek: 140, leadsTotal: 12 },
    affiliateClicks: 14,
    confirmedConversions: 0,
    gate: { now: D('2026-07-10'), clicks: 5820, clicksPrev: 1557, leads: 12, conversions: 0 },
    tripwires: {
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
    },
    ...overrides,
  };
}

describe('formatWeeklyKpiEmail', () => {
  it('件名にゲート判定とトリップワイヤー発火件数を含む', () => {
    const { subject } = formatWeeklyKpiEmail(baseData());
    expect(subject).toContain('週次KPI 2026-07-05');
    expect(subject).toContain('警報0件');
  });

  it('本文にC_p・送客・確定発生・名簿velocityの実測値を含む', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).toContain('C_p（保護者接点 parent_landing_view）: 0件');
    expect(text).toContain('送客（affiliate_click）: 14件');
    expect(text).toContain('確定発生（ASP実測）: 0件');
    expect(text).toContain('今週の登録: 2件');
  });

  it('¥予測は一切書かない（金額表記が本文に出現しない）', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).not.toMatch(/¥[\d,]/);
    expect(text).toContain('¥予測は記載していません');
  });

  it('トリップワイヤーが発火すると件名・本文の件数が増える', () => {
    const data = baseData({
      tripwires: {
        hensachiWeeklyCtr: [
          { weekStart: '2026-06-08', ctrPercent: 3.0 },
          { weekStart: '2026-06-15', ctrPercent: 2.9 },
          { weekStart: '2026-06-22', ctrPercent: 3.1 },
          { weekStart: '2026-06-29', ctrPercent: 2.8 },
        ],
        toolPages: { impNow: 1000, impPrev: 1000, clicksNow: 100, clicksPrev: 100 },
        aiReferralSharePercent: 15,
        headQueryCtrNow: 8.6,
        headQueryCtrPrev: 8.0,
      },
    });
    const { subject, text } = formatWeeklyKpiEmail(data);
    expect(subject).toContain('警報2件');
    expect(text).toContain('🚨 /hensachi CTR 4週連続低下');
    expect(text).toContain('🚨 ai_referral シェア上昇');
    expect(text).toContain('✅ 「内申点 計算」ヘッドクエリCTR半減');
  });

  it('ゲート判定が本文に反映される（期限後・発生ありでGO）', () => {
    const data = baseData({ gate: { now: D('2026-07-21'), clicks: 5820, clicksPrev: 1557, leads: 12, conversions: 3 } });
    const { text, subject } = formatWeeklyKpiEmail(data);
    expect(text).toContain('GO（モデル成立）');
    expect(subject).toContain('ゲート:GO');
  });

  it('名簿3,000逆算セクションを含む（C-1）', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).toContain('名簿3,000逆算');
    expect(text).toContain('必要velocity');
  });

  it('funnelStagesを渡すと週次ボトルネック行が出る（C-1）', () => {
    const data = baseData({
      funnelStages: [
        { id: 'cta_view', label: 'cta_view', count: 759 },
        { id: 'affiliate_click', label: 'affiliate_click', count: 14 },
      ],
    });
    const { text } = formatWeeklyKpiEmail(data);
    expect(text).toContain('週次ボトルネック');
    expect(text).toContain('cta_view(759)→affiliate_click(14)');
  });

  it('funnelStages省略時はボトルネック行を出さない', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).not.toContain('週次ボトルネック');
  });

  it('aiReferralBySourceを渡すと件数降順の内訳を出す（G-2）', () => {
    const data = baseData({
      aiReferralBySource: [
        { source: 'perplexity', count: 5 },
        { source: 'chatgpt', count: 20 },
      ],
    });
    const { text } = formatWeeklyKpiEmail(data);
    expect(text).toContain('ai_referral ソース別内訳');
    const chatgptIdx = text.indexOf('chatgpt');
    const perplexityIdx = text.indexOf('perplexity');
    expect(chatgptIdx).toBeGreaterThan(-1);
    expect(chatgptIdx).toBeLessThan(perplexityIdx);
  });

  it('aiReferralBySource省略時は内訳セクションを出さない', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).not.toContain('ソース別内訳');
  });
});
