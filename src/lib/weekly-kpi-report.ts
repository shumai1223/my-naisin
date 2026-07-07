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
  type JulyGateInput,
  type TripwireInput,
  type FunnelStage,
} from '@/lib/velocity';

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
  /** ai_referralのソース別内訳（任意・件数降順でなくてよい＝表示側でソートする）。トリップワイヤー③の判定には使わず内訳表示のみ（G-2）。 */
  aiReferralBySource?: { source: string; count: number }[];
  /** 送客（affiliate_click）今週件数。 */
  affiliateClicks: number;
  /** ASP実測の確定発生件数（分からなければ0。¥は書かない）。 */
  confirmedConversions: number;
  gate: JulyGateInput;
  tripwires: TripwireInput;
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
  const gate = evaluateJulyGate(data.gate);
  const tripwires = evaluateTripwires(data.tripwires);
  const triggeredCount = tripwires.filter((t) => t.triggered).length;

  const subject = `週次KPI ${data.weekEnding} ｜ ゲート:${gate.verdictLabel.split('（')[0]} ｜ 警報${triggeredCount}件`;

  const lines: string[] = [];
  lines.push(`週次KPIレポート（${data.weekEnding} 時点）`);
  lines.push('');
  lines.push('■ 桁レバー（7/20 反証ゲート）');
  lines.push(`  判定: ${gate.verdictLabel}（${gate.decided ? `判定日到達` : `あと${gate.daysLeft}日`}）`);
  lines.push(`  クリック前季比: ${gate.clickMultipleLabel}（今季${fmt(gate.clicks)} / 前季${fmt(gate.clicksPrev)}）`);
  lines.push(`  発生（ASP実測）: ${gate.conversions}件 ／ 名簿累計: ${fmt(gate.leads)}件`);
  lines.push(`  ${gate.rationale}`);
  lines.push('');
  lines.push('■ 実測サマリ（今週）');
  lines.push(`  GSCクリック: ${fmt(data.gsc.clicksNow)}（${pctDelta(data.gsc.clicksNow, data.gsc.clicksPrev)}）／ 表示: ${fmt(data.gsc.impNow)}（${pctDelta(data.gsc.impNow, data.gsc.impPrev)}）`);
  lines.push(`  C_p（保護者接点 parent_landing_view）: ${fmt(data.parentLandingViews)}件`);
  lines.push(`  送客（affiliate_click）: ${fmt(data.affiliateClicks)}件`);
  lines.push(`  確定発生（ASP実測）: ${data.confirmedConversions}件`);
  lines.push('');
  lines.push('■ 名簿velocity');
  const weeklyPace = data.leadVelocity.targetPerWeek > 0 ? (data.leadVelocity.leadsThisWeek / data.leadVelocity.targetPerWeek) * 100 : null;
  lines.push(`  今週の登録: ${fmt(data.leadVelocity.leadsThisWeek)}件 ／ 目標: ${fmt(data.leadVelocity.targetPerWeek)}件/週${weeklyPace !== null ? `（達成率${weeklyPace.toFixed(0)}%）` : ''}`);
  lines.push(`  名簿累計: ${fmt(data.leadVelocity.leadsTotal)}件`);
  lines.push('');
  lines.push('■ 名簿3,000逆算（C-1）');
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
  if (data.funnelStages && data.funnelStages.length >= 2) {
    const bottleneck = findFunnelBottleneck(data.funnelStages);
    if (bottleneck) {
      lines.push(
        `  週次ボトルネック: ${bottleneck.fromLabel}(${fmt(bottleneck.fromCount)})→${bottleneck.toLabel}(${fmt(bottleneck.toCount)}) でドロップ${(bottleneck.dropRatio * 100).toFixed(0)}%`
      );
    }
  }
  lines.push('');
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
  lines.push('');
  lines.push('※ ¥予測は記載していません（先行指標のみで採点する運用のため）。');

  return { subject, text: lines.join('\n') };
}
