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

  it('funnelByPlacementを渡すと最弱面とテコ入れ提案が出る（Q-3）', () => {
    const data = baseData({
      funnelByPlacement: [
        {
          placement: 'hensachi',
          stages: [
            { id: 'result_view', label: 'result_view', count: 1000 },
            { id: 'cta_view', label: 'cta_view', count: 900 },
          ],
        },
        {
          placement: 'juku-shindan',
          stages: [
            { id: 'cta_view', label: 'cta_view', count: 280 },
            { id: 'affiliate_click', label: 'affiliate_click', count: 20 },
          ],
        },
      ],
    });
    const { text } = formatWeeklyKpiEmail(data);
    expect(text).toContain('面別ファネル段差診断');
    expect(text).toContain('最弱面: juku-shindan');
    expect(text).toContain('提案:');
  });

  it('funnelByPlacement省略時は面別診断行を出さない', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).not.toContain('面別ファネル段差診断');
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

  it('ga4OrganicSessionsを渡すとConsent捕捉率セクションが出る（I-5）', () => {
    const data = baseData({ ga4OrganicSessions: 1038 }); // gsc.clicksNow=5820 → 約5.6x
    const { text } = formatWeeklyKpiEmail(data);
    expect(text).toContain('Consent捕捉率');
    expect(text).toContain('✅');
  });

  it('Consent捕捉率が基準から急変していると🚨で警告文を出す', () => {
    const data = baseData({ ga4OrganicSessions: 100 }); // 5820/100=58.2x
    const { text } = formatWeeklyKpiEmail(data);
    expect(text).toContain('🚨');
    expect(text).toContain('計測事故');
  });

  it('ga4OrganicSessions省略時はConsent捕捉率セクションを出さない', () => {
    const { text } = formatWeeklyKpiEmail(baseData());
    expect(text).not.toContain('Consent捕捉率');
  });

  describe('manualDataProvided=false（0-8：GSC自動取得のみの無人実行）', () => {
    it('C_p・送客・確定発生・名簿velocityを「未計測」と表示し、0件と混同させない', () => {
      const data = baseData({ manualDataProvided: false });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('C_p（保護者接点 parent_landing_view）: 未計測（手動値待ち）');
      expect(text).toContain('送客（affiliate_click）: 未計測（手動値待ち）');
      expect(text).toContain('確定発生（ASP実測）: 未計測（手動値待ち）');
      expect(text).toContain('今週の登録: 未計測（手動値待ち） ／ 名簿累計: 未計測（手動値待ち）');
      expect(text).not.toContain('確定発生（ASP実測）: 0件');
    });

    it('名簿3,000逆算セクションは未計測扱いになり数値の逆算を出さない', () => {
      const data = baseData({ manualDataProvided: false });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('名簿累計が未入力のため逆算不可');
      expect(text).not.toContain('必要velocity');
    });

    it('判定期限前（pending）なら未計測でも通常通りpendingを表示する（判定自体に影響しない）', () => {
      const data = baseData({ manualDataProvided: false });
      const { text, subject } = formatWeeklyKpiEmail(data);
      expect(text).toContain('判定前');
      expect(subject).toContain('ゲート:判定前');
    });

    it('判定期限到達後は「⚠️判定保留（未計測）」に切り替わり、conversions=0起因の誤判定を確定表示しない', () => {
      const data = baseData({
        manualDataProvided: false,
        gate: { now: D('2026-07-21'), clicks: 5820, clicksPrev: 1557, leads: 0, conversions: 0 },
      });
      const { text, subject } = formatWeeklyKpiEmail(data);
      expect(text).toContain('⚠️判定保留（未計測）');
      expect(text).toContain('実測値を渡して再実行し確定させてください');
      expect(text).not.toContain('PIVOT（仮説の見直し）');
      expect(subject).toContain('ゲート:判定保留');
    });

    it('manualDataProvided省略時は従来通り（true扱い）で既存挙動を維持する', () => {
      const { text } = formatWeeklyKpiEmail(baseData());
      expect(text).not.toContain('未計測');
    });
  });

  describe('newFunnelEvents（V-6：stats_optin/unlock/sticky-bar line）', () => {
    it('渡すと解放率つきで表示される', () => {
      const data = baseData({
        newFunnelEvents: { statsOptinView: 55, statsOptinGrant: 5, unlockTeaserView: 78, unlockGranted: 1, lineFriendClickStickyBar: 2 },
      });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('新規ファネルイベント');
      expect(text).toContain('stats_optin_view: 55件 ／ stats_optin_grant: 5件（解放率9.1%）');
      expect(text).toContain('unlock_teaser_view: 78件 ／ unlock_granted: 1件（解放率1.3%）');
      expect(text).toContain('line_friend_click（sticky-bar経由）: 2件');
    });

    it('省略時はセクション自体を出さない', () => {
      const { text } = formatWeeklyKpiEmail(baseData());
      expect(text).not.toContain('新規ファネルイベント');
    });

    it('一部だけ渡すと未指定項目のみ未計測になる', () => {
      const data = baseData({ newFunnelEvents: { statsOptinView: 10 } });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('stats_optin_view: 10件 ／ stats_optin_grant: 未計測（手動値待ち）');
    });
  });

  describe('実験ポートフォリオ（V-6：走行中A/BのjudgeWinner結線）', () => {
    it('走行中実験の一覧が本数付きで出る', () => {
      const { text } = formatWeeklyKpiEmail(baseData());
      expect(text).toMatch(/■ 実験ポートフォリオ（走行中\d+本・V-6）/);
    });

    it('データ未提供の走行中実験は「n不足」で打ち切らない旨を明記する', () => {
      const { text } = formatWeeklyKpiEmail(baseData());
      expect(text).toContain('⚪ lead-copy-2026: n不足（GA4データ未提供・判定保留。打ち切らず継続して母数を貯める）');
    });

    it('十分なサンプル+有意差ありなら🏆で採用推奨が出る', () => {
      const data = baseData({
        experimentArmResults: {
          'lead-copy-2026': [
            { id: 'control', impressions: 500, conversions: 40 },
            { id: 'reward', impressions: 520, conversions: 70 },
          ],
        },
      });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('🏆 lead-copy-2026:');
      expect(text).toContain('採用推奨');
    });

    it('サンプル不足なら⏳またはn不足で判定を急がない', () => {
      const data = baseData({
        experimentArmResults: {
          'lead-copy-2026': [
            { id: 'control', impressions: 10, conversions: 1 },
            { id: 'reward', impressions: 11, conversions: 3 },
          ],
        },
      });
      const { text } = formatWeeklyKpiEmail(data);
      expect(text).toContain('lead-copy-2026:');
      expect(text).not.toContain('🏆 lead-copy-2026:');
    });
  });
});
