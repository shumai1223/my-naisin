/**
 * 週次KPI 1枚メール（I-1）の組み立てロジック（純関数・実際のAPI取得/送信はscripts/側）。
 *
 * 北極星：Google一点依存下で「悪化に気づかず数週間放置」を防ぐ常設の定点観測。
 * C_p（保護者接点）・名簿velocity・送客・確定額（すべて実測。¥予測はしない）＋
 * 7/20反証ゲート判定＋トリップワイヤー4本を1通にまとめ、月曜に読むだけで済む形にする。
 */

import {
  evaluateJulyGate,
  evaluateTripwires,
  evaluateRosterVelocityTarget,
  findFunnelBottleneck,
  evaluateConsentCapture,
  evaluateSpecialRateNegotiationTrigger,
  findWeakestPlacementFunnel,
  suggestFunnelIntervention,
  type JulyGateInput,
  type TripwireInput,
  type FunnelStage,
  type PlacementFunnel,
} from '@/lib/velocity';
import { evaluateRoadmapGates, nextRoadmapGate, upcomingGateReminders, type RoadmapGateActuals } from '@/lib/roadmap-gates';
import { runningExperiments, judgeWinner, type ArmResult } from '@/lib/experiments';

export interface WeeklyKpiData {
  /** レポート対象週の終端日（'YYYY-MM-DD'）。 */
  weekEnding: string;
  /** GSC総クリック・総表示（今週/前週）。 */
  gsc: { clicksNow: number; clicksPrev: number; impNow: number; impPrev: number };
  /** C_p（保護者起点クリック=parent_landing_view）今週件数。 */
  parentLandingViews: number;
  /** 名簿velocity：今週のlead_submit件数と、逆算目標（例：約20/日）。 */
  leadVelocity: { leadsThisWeek: number; targetPerWeek: number; leadsTotal: number };
  /** 週次ファネル段階（任意・古い→新しいでなく上流→下流の順）。あればボトルネック特定行を出す（C-1）。 */
  funnelStages?: FunnelStage[];
  /** 面（ページ/placement）別の週次ファネル（任意）。あれば最弱面の特定+テコ入れ提案行を出す（Q-3）。 */
  funnelByPlacement?: PlacementFunnel[];
  /** ai_referralのソース別内訳（任意・件数降順でなくてよい＝表示側でソートする）。トリップワイヤー③の判定には使わず内訳表示のみ（G-2）。 */
  aiReferralBySource?: { source: string; count: number }[];
  /** GA4 Organic Searchセッション（今週。任意）。あればConsent捕捉率の定点観測行を出す（I-5）。 */
  ga4OrganicSessions?: number;
  /**
   * 新規ファネルイベント（T-1紹介解放機構・S-1統計オプトイン・sticky-bar経由のLINE導線）の今週件数（任意）。
   * GA4はOAuthのみでCI非対応のため他の手動値と同様、GA4 MCP等で取得した数値を渡す運用（V-6）。
   * 未指定の項目は表示側で「未計測」扱い（0件と混同させない）。
   */
  newFunnelEvents?: {
    statsOptinView?: number;
    statsOptinGrant?: number;
    unlockTeaserView?: number;
    unlockGranted?: number;
    lineFriendClickStickyBar?: number;
    /** ZZ-2d：SaveResultCTA（保護者バトン/LINE/メール受け皿）が視界に入った回数（到達率の分母）。 */
    saveResultCtaView?: number;
  };
  /**
   * 走行中A/B実験のアーム別実測（GA4のexperiment_impression×primaryMetricを手動で集計・任意・V-6）。
   * キー=実験ID、値=judgeWinnerにそのまま渡すArmResult[]（arms[0]=control）。
   * データが無い走行中実験は「n不足（データ未提供）」と明記し、早期に打ち切り判定をしない。
   */
  experimentArmResults?: Record<string, ArmResult[]>;
  /** 当月のASP発生件数累計（任意）。あれば特単交渉トリガー（D-1・閾値50件/月）の判定行を出す。 */
  conversionsThisMonth?: number;
  /**
   * 能動運用ロードマップ目盛りG1〜G6（[[session-2026-07-11-revenue-forecast-roadmap]]）の実測。
   * 未入力の項目はそのゲートが「unmeasured」表示になるだけで他のゲートには影響しない。
   */
  roadmapGateActuals?: RoadmapGateActuals;
  /** 送客（affiliate_click）今週件数。 */
  affiliateClicks: number;
  /** ASP実測の確定発生件数（分からなければ0。¥は書かない）。 */
  confirmedConversions: number;
  gate: JulyGateInput;
  tripwires: TripwireInput;
  /**
   * GA4/ASP由来の手動値（C_p・送客・確定発生・名簿velocity・gate.leads/conversions）が
   * 実際に渡されたか（既定true=従来通り数値をそのまま表示）。
   * false＝GSC自動取得のみの無人実行＝これらの数値欄は「未計測」と表示し、実測の0と混同させない
   * （0-8：CIからGSC_SA_KEYのみで自動送信する運用を安全にするための区別。とくに7/20等の判定日に
   * 手動値なしでconversions=0のまま確定判定してしまう誤判定を防ぐ）。
   */
  manualDataProvided?: boolean;
}

function fmt(n: number): string {
  return n.toLocaleString('ja-JP');
}

function pctDelta(now: number, prev: number): string {
  if (prev === 0) return now > 0 ? '＋new' : '±0';
  const d = ((now - prev) / prev) * 100;
  return `${d >= 0 ? '＋' : '−'}${Math.abs(d).toFixed(0)}%`;
}

/** 週次KPIメールの本文（プレーンテキスト・1画面で読み切れる分量）を組み立てる。 */
export function formatWeeklyKpiEmail(data: WeeklyKpiData): { subject: string; text: string } {
  const manual = data.manualDataProvided !== false;
  const gate = evaluateJulyGate(data.gate);
  const gateUnverified = !manual && gate.decided;
  const tripwires = evaluateTripwires(data.tripwires);
  const triggeredCount = tripwires.filter((t) => t.triggered).length;
  const unmeasured = '未計測（手動値待ち）';

  const subject = `週次KPI ${data.weekEnding} ｜ ゲート:${gateUnverified ? '判定保留' : gate.verdictLabel.split('（')[0]} ｜ 警報${triggeredCount}件`;

  const lines: string[] = [];
  lines.push(`週次KPIレポート（${data.weekEnding} 時点）`);
  lines.push('');
  lines.push('■ 桁レバー（7/20 反証ゲート）');
  lines.push(`  判定: ${gateUnverified ? '⚠️判定保留（未計測）' : gate.verdictLabel}（${gate.decided ? `判定日到達` : `あと${gate.daysLeft}日`}）`);
  lines.push(`  クリック前季比: ${gate.clickMultipleLabel}（今季${fmt(gate.clicks)} / 前季${fmt(gate.clicksPrev)}）`);
  lines.push(`  発生（ASP実測）: ${manual ? `${gate.conversions}件` : unmeasured} ／ 名簿累計: ${manual ? `${fmt(gate.leads)}件` : unmeasured}`);
  if (gateUnverified) {
    lines.push('  ⚠️ leads/conversionsが未計測（GSC自動取得のみの無人実行）のため正式判定は保留。実測値を渡して再実行し確定させてください。');
  } else {
    lines.push(`  ${gate.rationale}`);
  }
  lines.push('');
  {
    const gateActuals: RoadmapGateActuals = {
      rosterN: manual ? data.leadVelocity.leadsTotal : undefined,
      conversionsThisMonth: data.conversionsThisMonth,
      ...data.roadmapGateActuals,
    };
    const nextGate = nextRoadmapGate(data.gate.now);
    const evaluations = evaluateRoadmapGates(gateActuals, data.gate.now);
    const statusIcon: Record<string, string> = {
      'on-track-max': '🟢',
      'on-track-effort': '🟡',
      behind: '🔴',
      unmeasured: '⚪',
      'manual-check': '⚪',
      upcoming: '·',
    };
    // ¥予測は書かない運用（このメールの一貫方針）＝G5/G6の目安・実測detailに含まれる金額表記は
    // このチャネルに限り伏せる（判定自体は内部でyen額を使って正しく行っている・数字はadmin/reportで確認）。
    const redactYen = (s: string): string => s.replace(/¥[\d,]+(?:万)?/g, '[金額はadmin/report参照]');
    lines.push(`■ ロードマップゲート（努力/最高シナリオ・次点: ${nextGate.label} ${nextGate.dateIso}）`);
    for (const ev of evaluations) {
      lines.push(`  ${statusIcon[ev.status] ?? '·'} ${ev.label}（${ev.dateIso}）: ${redactYen(ev.detail)}`);
    }

    // T-7：判定日が7日以内に迫っているゲートは、月次実測（ASP/契約/API管理画面）を渡すタイミングを明示する。
    const reminders = upcomingGateReminders(data.gate.now);
    if (reminders.length > 0) {
      lines.push('');
      for (const r of reminders) {
        lines.push(`  🔔 そろそろ月次実測を渡すタイミングです: ${r.label}（${r.dateIso}・あと${r.daysLeft}日）`);
      }
    }
  }
  lines.push('');
  lines.push('■ 実測サマリ（今週）');
  lines.push(`  GSCクリック: ${fmt(data.gsc.clicksNow)}（${pctDelta(data.gsc.clicksNow, data.gsc.clicksPrev)}）／ 表示: ${fmt(data.gsc.impNow)}（${pctDelta(data.gsc.impNow, data.gsc.impPrev)}）`);
  lines.push(`  C_p（保護者接点 parent_landing_view）: ${manual ? `${fmt(data.parentLandingViews)}件` : unmeasured}`);
  lines.push(`  送客（affiliate_click）: ${manual ? `${fmt(data.affiliateClicks)}件` : unmeasured}`);
  lines.push(`  確定発生（ASP実測）: ${manual ? `${data.confirmedConversions}件` : unmeasured}`);
  if (data.newFunnelEvents) {
    const fe = data.newFunnelEvents;
    const rate = (num?: number, den?: number): string => (num !== undefined && den !== undefined && den > 0 ? `（解放率${((num / den) * 100).toFixed(1)}%）` : '');
    lines.push('');
    lines.push('■ 新規ファネルイベント（今週・V-6）');
    lines.push(`  stats_optin_view: ${fe.statsOptinView !== undefined ? `${fmt(fe.statsOptinView)}件` : unmeasured} ／ stats_optin_grant: ${fe.statsOptinGrant !== undefined ? `${fmt(fe.statsOptinGrant)}件` : unmeasured}${rate(fe.statsOptinGrant, fe.statsOptinView)}`);
    lines.push(`  unlock_teaser_view: ${fe.unlockTeaserView !== undefined ? `${fmt(fe.unlockTeaserView)}件` : unmeasured} ／ unlock_granted: ${fe.unlockGranted !== undefined ? `${fmt(fe.unlockGranted)}件` : unmeasured}${rate(fe.unlockGranted, fe.unlockTeaserView)}`);
    lines.push(`  line_friend_click（sticky-bar経由）: ${fe.lineFriendClickStickyBar !== undefined ? `${fmt(fe.lineFriendClickStickyBar)}件` : unmeasured}`);
    if (fe.saveResultCtaView !== undefined) {
      lines.push(`  save_result_cta_view（保護者バトン/LINE導線への到達・ZZ-2d）: ${fmt(fe.saveResultCtaView)}件`);
    }
  }
  lines.push('');
  lines.push('■ 名簿velocity');
  if (manual) {
    const weeklyPace = data.leadVelocity.targetPerWeek > 0 ? (data.leadVelocity.leadsThisWeek / data.leadVelocity.targetPerWeek) * 100 : null;
    lines.push(`  今週の登録: ${fmt(data.leadVelocity.leadsThisWeek)}件 ／ 目標: ${fmt(data.leadVelocity.targetPerWeek)}件/週${weeklyPace !== null ? `（達成率${weeklyPace.toFixed(0)}%）` : ''}`);
    lines.push(`  名簿累計: ${fmt(data.leadVelocity.leadsTotal)}件`);
  } else {
    lines.push(`  今週の登録: ${unmeasured} ／ 名簿累計: ${unmeasured}`);
  }
  lines.push('');
  lines.push('■ 名簿3,000逆算（C-1）');
  if (manual) {
    const roster = evaluateRosterVelocityTarget({
      now: data.gate.now,
      currentRoster: data.leadVelocity.leadsTotal,
      observedDailyVelocity: data.leadVelocity.leadsThisWeek / 7,
    });
    lines.push(
      `  目標${fmt(roster.targetRoster)}件まで残り${fmt(roster.gap)}件／期限まで${roster.daysLeft}日 → 必要velocity ${roster.requiredDailyVelocity.toFixed(1)}件/日（${roster.requiredWeeklyVelocity.toFixed(0)}件/週）`
    );
    if (roster.paceRatio !== null) {
      lines.push(
        `  実測ペース ${(roster.observedDailyVelocity ?? 0).toFixed(1)}件/日＝必要ペース比${(roster.paceRatio * 100).toFixed(0)}%（${roster.onTrack ? 'オンペース' : '未達ペース'}）`
      );
    }
  } else {
    lines.push(`  ${unmeasured}（名簿累計が未入力のため逆算不可）`);
  }
  if (data.funnelStages && data.funnelStages.length >= 2) {
    const bottleneck = findFunnelBottleneck(data.funnelStages);
    if (bottleneck) {
      lines.push(
        `  週次ボトルネック: ${bottleneck.fromLabel}(${fmt(bottleneck.fromCount)})→${bottleneck.toLabel}(${fmt(bottleneck.toCount)}) でドロップ${(bottleneck.dropRatio * 100).toFixed(0)}%`
      );
    }
  }
  lines.push('');
  if (data.funnelByPlacement && data.funnelByPlacement.length > 0) {
    const weakest = findWeakestPlacementFunnel(data.funnelByPlacement);
    lines.push('■ 面別ファネル段差診断（Q-3・最優先でテコ入れすべき面）');
    if (weakest) {
      lines.push(
        `  最弱面: ${weakest.placement} の ${weakest.fromLabel}(${fmt(weakest.fromCount)})→${weakest.toLabel}(${fmt(weakest.toCount)}) でドロップ${(weakest.dropRatio * 100).toFixed(0)}%`
      );
      lines.push(`  提案: ${suggestFunnelIntervention(weakest)}`);
    } else {
      lines.push('  比較可能な面別データがありませんでした（各面2段階以上のデータが必要）。');
    }
    lines.push('');
  }
  lines.push(`■ トリップワイヤー（${triggeredCount}/4 発火）`);
  for (const t of tripwires) {
    lines.push(`  ${t.triggered ? '🚨' : '✅'} ${t.label}：${t.detail}`);
  }
  if (data.aiReferralBySource && data.aiReferralBySource.length > 0) {
    lines.push('');
    lines.push('■ ai_referral ソース別内訳（G-2）');
    const sorted = [...data.aiReferralBySource].sort((a, b) => b.count - a.count);
    for (const s of sorted) {
      lines.push(`  ${s.source}: ${fmt(s.count)}件`);
    }
  }
  if (data.ga4OrganicSessions !== undefined) {
    const consent = evaluateConsentCapture({ gscClicks: data.gsc.clicksNow, ga4OrganicSessions: data.ga4OrganicSessions });
    lines.push('');
    lines.push('■ Consent捕捉率 定点観測（I-5）');
    lines.push(`  ${consent.triggered ? '🚨' : '✅'} ${consent.detail}`);
    if (consent.triggered) {
      lines.push('  実測の変化ではなく計測事故（GTM/同意バナー/GA4タグ抜け）の可能性を疑って確認してください。');
    }
  }
  if (data.conversionsThisMonth !== undefined) {
    const nego = evaluateSpecialRateNegotiationTrigger(data.conversionsThisMonth);
    lines.push('');
    lines.push('■ 特単交渉トリガー（D-1・閾値50件/月）');
    lines.push(`  ${nego.triggered ? '🚨' : '✅'} ${nego.detail}`);
    if (nego.triggered) {
      lines.push('  → scripts/generate-sales-report.ts --conversions-this-month=… で交渉文面付きレポートを生成し、親名義で送信してください。');
    }
  }
  {
    const running = runningExperiments();
    if (running.length > 0) {
      lines.push('');
      lines.push(`■ 実験ポートフォリオ（走行中${running.length}本・V-6）`);
      for (const exp of running) {
        const armResults = data.experimentArmResults?.[exp.id];
        if (!armResults || armResults.length < 2) {
          lines.push(`  ⚪ ${exp.id}: n不足（GA4データ未提供・判定保留。打ち切らず継続して母数を貯める）`);
          continue;
        }
        const verdict = judgeWinner(armResults);
        if (!verdict) {
          lines.push(`  ⚪ ${exp.id}: n不足（アーム不足・判定不能）`);
          continue;
        }
        const icon = verdict.significant ? '🏆' : verdict.bestArm !== verdict.control ? '⏳' : '✅';
        lines.push(`  ${icon} ${exp.id}: ${verdict.recommendation}`);
      }
    }
  }
  lines.push('');
  lines.push('※ ¥予測は記載していません（先行指標のみで採点する運用のため）。');

  return { subject, text: lines.join('\n') };
}
