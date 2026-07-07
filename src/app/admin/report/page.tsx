import type { Metadata } from 'next';

import {
  getClickSummary,
  getClickTrend,
  getRefererSummary,
  getClickPeriodComparison,
  getRecentClicks,
  getClickTrustCounts,
  type ClickAggRow,
} from '@/lib/clicks-db';
import { classifyClick, type ClickTrust } from '@/lib/bot-filter';
import { getLeadSummary, getLeadDailyCounts } from '@/lib/leads-db';
import { getApiKeyStats, getFreemiumFunnel } from '@/lib/api-keys';
import { evaluateJulyGate, bucketDailyByWeek, type GateVerdict } from '@/lib/velocity';
import { checkExperimentPortfolioHealth, MIN_RUNNING_EXPERIMENTS } from '@/lib/experiments';
import { countActiveSubscriptions } from '@/lib/push-db';
import {
  economicsFor,
  estimatedLeadsLow,
  estimatedRevenueYen,
  confirmedRevenueYen,
  rankLiveOffersByEV,
  CONFIRM_RATE,
  yen,
} from '@/lib/affiliate-economics';
import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';
import { TrendChart } from '@/components/admin/TrendChart';

/**
 * 送客アナリティクス（管理ダッシュボード・認証付き・H5）。
 * 来季の直接送客契約（CPA交渉）の「実績データ」をいつでも出せる土台。
 *
 * 設計：
 *  - D1 のクリック実数（/go 経由）を program × 面 × 県 × 流入元 × 日 に分解して可視化。
 *  - 金額は2系統：推定発生額【楽観】と 推定確定額【保守＝主役】（convRateLow × CONFIRM_RATE 控除）。
 *  - 名簿（leads）・Push購読（push_subscriptions）の堀KPIも同画面で確認。
 *  - 認証：?token=＜ADMIN_REPORT_TOKEN＞ が一致した時だけ表示。未設定/不一致は何も出さない（noindex）。
 *  - D1 未バインド時は全ゼロで静かに動く（push=本番なので壊さない）。
 */

export const metadata: Metadata = {
  title: '送客アナリティクス（管理）| My Naishin',
  robots: { index: false, follow: false },
};

// 認証＋D1読み取りのため毎回サーバーで評価する。
export const dynamic = 'force-dynamic';

async function getAdminToken(): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (
      (env as unknown as { ADMIN_REPORT_TOKEN?: string }).ADMIN_REPORT_TOKEN ??
      process.env.ADMIN_REPORT_TOKEN
    );
  } catch {
    return process.env.ADMIN_REPORT_TOKEN;
  }
}

// ── 集計ヘルパ ───────────────────────────────────────────────
interface ProgramAgg {
  id: AffiliateId;
  name: string;
  clicks: number;
  optimistic: number;
  confirmed: number;
  leadsLow: number;
}

function aggregateByProgram(rows: ClickAggRow[]): ProgramAgg[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.affiliate_id, (map.get(r.affiliate_id) ?? 0) + r.clicks);
  return [...map.entries()]
    .map(([id, clicks]) => {
      const aid = id as AffiliateId;
      return {
        id: aid,
        name: (AFFILIATES[aid]?.name as string) ?? id,
        clicks,
        optimistic: estimatedRevenueYen(aid, clicks),
        confirmed: confirmedRevenueYen(aid, clicks),
        leadsLow: estimatedLeadsLow(aid, clicks),
      };
    })
    .sort((a, b) => b.confirmed - a.confirmed || b.clicks - a.clicks);
}

interface DimAgg {
  key: string;
  clicks: number;
  confirmed: number;
}
function aggregateByDim(rows: ClickAggRow[], pick: (r: ClickAggRow) => string | null): DimAgg[] {
  const map = new Map<string, { clicks: number; confirmed: number }>();
  for (const r of rows) {
    const key = pick(r) ?? '(不明)';
    const cur = map.get(key) ?? { clicks: 0, confirmed: 0 };
    cur.clicks += r.clicks;
    cur.confirmed += confirmedRevenueYen(r.affiliate_id as AffiliateId, r.clicks);
    map.set(key, cur);
  }
  return [...map.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.clicks - a.clicks);
}

function pct(n: number): string {
  return `${+(n * 100).toFixed(1)}%`;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const head = local.slice(0, 2);
  return `${head}${'*'.repeat(Math.max(1, local.length - head.length))}@${domain}`;
}

/** referer（URL）を読みやすいページ表記へ。自ドメインはパス、外部はホスト名。 */
function refPath(referer: string | null): string {
  if (!referer) return '(直接/不明)';
  try {
    const u = new URL(referer);
    if (u.hostname.endsWith('my-naishin.com')) return u.pathname || '/';
    return `外部: ${u.hostname}`;
  } catch {
    return referer.slice(0, 48);
  }
}

const KIND_LABEL: Record<string, { label: string; cls: string; dot: string }> = {
  'free-lead': { label: '無料体験', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'doc-request': { label: '資料請求', cls: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  paid: { label: '有料', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

function Bar({ value, max, className = 'bg-emerald-500' }: { value: number; max: number; className?: string }) {
  const w = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${className}`} style={{ width: `${w}%` }} />
    </div>
  );
}

function DeltaBadge({ cur, prev }: { cur: number; prev: number }) {
  if (prev <= 0) return <span className="text-[11px] font-bold text-emerald-600">新規</span>;
  const d = (cur - prev) / prev;
  const up = d >= 0;
  return (
    <span className={`text-[11px] font-bold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
      {up ? '▲' : '▼'}
      {Math.abs(d * 100).toFixed(0)}% <span className="font-normal text-slate-400">前期{prev}</span>
    </span>
  );
}

function Gate() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold text-slate-800">認証が必要です</h1>
      <p className="mt-2 text-sm text-slate-500">
        このページは管理用です。<code>?token=</code> に正しいトークンを付けてアクセスしてください。
      </p>
    </div>
  );
}

export default async function AdminReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;
  const expected = await getAdminToken();

  if (!expected || !token || token !== expected) {
    return <Gate />;
  }

  const daysRaw = typeof sp.days === 'string' ? Number(sp.days) : 30;
  const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(365, Math.round(daysRaw))) : 30;

  // 推移グラフ/表の粒度（日別 or 時間別）。時間別は粒度が細かいので窓を最大3日に絞る。
  const trendView: 'day' | 'hour' = sp.trend === 'hour' ? 'hour' : 'day';
  const trendDays = trendView === 'hour' ? Math.min(days, 3) : days;

  // クリックの清浄度：既定は「信頼（自サイト面から押された＝内部refererあり）」だけで集計。
  // ?clicks=all で疑わしい(/go直叩きスクレイパ)も含めた全数を表示。
  const trustedOnly = sp.clicks !== 'all';
  const to = { trustedOnly };

  const [
    rows,
    trend,
    refRows,
    compare,
    leads,
    pushCount,
    recentClicks,
    apiKeys,
    trust,
    weeklyClickTrend,
    leadDaily,
    apiFunnel,
  ] = await Promise.all([
    getClickSummary(days, to),
    getClickTrend(trendDays, trendView, to),
    getRefererSummary(days),
    getClickPeriodComparison(days, to),
    getLeadSummary(20),
    countActiveSubscriptions(),
    getRecentClicks(50),
    getApiKeyStats(50),
    getClickTrustCounts(days),
    getClickTrend(56, 'day', to),
    getLeadDailyCounts(56),
    getFreemiumFunnel(),
  ]);

  // ── 今季の桁レバー（Build 3）：7/20 反証ゲート＋週次velocity ──────────────────
  // 発生（conversions）は D1 に無い（ASP管理画面が一次）ため 0 で評価する＝GO判定は本人がASPで確認して読む。
  // クリックの今季/前季は表示中の期間（days）で比較。
  const gate = evaluateJulyGate({
    clicks: compare.current,
    clicksPrev: compare.previous,
    leads: leads.total,
    conversions: 0,
  });
  const experimentHealth = checkExperimentPortfolioHealth();
  const weeklyClicks = bucketDailyByWeek(
    weeklyClickTrend.map((r) => ({ date: r.bucket, count: r.clicks })),
    8
  );
  const weeklyLeads = bucketDailyByWeek(
    leadDaily.map((r) => ({ date: r.date, count: r.n })),
    8
  );
  const maxWeeklyClicks = Math.max(1, ...weeklyClicks.map((w) => w.count));
  const maxWeeklyLeads = Math.max(1, ...weeklyLeads.map((w) => w.count));
  const GATE_STYLE: Record<GateVerdict, { badge: string; ring: string }> = {
    pending: { badge: 'bg-slate-100 text-slate-600', ring: 'border-slate-200' },
    go: { badge: 'bg-emerald-100 text-emerald-700', ring: 'border-emerald-300' },
    iterate: { badge: 'bg-amber-100 text-amber-700', ring: 'border-amber-300' },
    pivot: { badge: 'bg-rose-100 text-rose-700', ring: 'border-rose-300' },
  };
  const gateStyle = GATE_STYLE[gate.verdict];

  // 直近クリックの信頼度分類（明細＋サマリ）。
  const classified = recentClicks.map((r) => ({ row: r, trust: classifyClick({ userAgent: r.user_agent, referer: r.referer }) }));
  const trustCount = (t: ClickTrust) => classified.filter((c) => c.trust === t).length;
  const recentTrust = { human: trustCount('human'), suspect: trustCount('suspect'), bot: trustCount('bot'), unknown: trustCount('unknown') };
  // 既定（trustedOnly）では明細も信頼クリックだけ表示。?clicks=all で全件。
  const visibleClicks = trustedOnly ? classified.filter((c) => c.trust === 'human') : classified;
  const suspectShare = trust.total > 0 ? Math.round((trust.suspect / trust.total) * 100) : 0;

  // API（堀B）の利用集計：発行キー数・当月リクエスト合計・ティア内訳。
  const apiThisMonth = apiKeys.reduce((s, k) => s + (k.this_month || 0), 0);
  const apiTotalReq = apiKeys.reduce((s, k) => s + (k.request_count || 0), 0);
  const apiByTier = apiKeys.reduce<Record<string, number>>((acc, k) => {
    acc[k.tier] = (acc[k.tier] ?? 0) + 1;
    return acc;
  }, {});

  const trendPoints = trend.map((r) => ({ label: r.bucket, value: r.clicks }));
  const maxTrend = Math.max(1, ...trend.map((r) => r.clicks));

  const programs = aggregateByProgram(rows);
  const byPlacement = aggregateByDim(rows, (r) => r.placement);
  const byPref = aggregateByDim(rows, (r) => r.prefecture);

  // 種別別（無料体験/資料請求/有料）
  const kindMap = new Map<string, { clicks: number; confirmed: number }>();
  for (const p of programs) {
    const k = economicsFor(p.id).kind;
    const cur = kindMap.get(k) ?? { clicks: 0, confirmed: 0 };
    cur.clicks += p.clicks;
    cur.confirmed += p.confirmed;
    kindMap.set(k, cur);
  }

  // 勝ち案件 × 勝ち面（program × placement）
  const comboMap = new Map<string, { program: string; placement: string; clicks: number; confirmed: number }>();
  for (const r of rows) {
    const aid = r.affiliate_id as AffiliateId;
    const placement = r.placement ?? '(不明)';
    const key = `${aid}__${placement}`;
    const cur = comboMap.get(key) ?? { program: (AFFILIATES[aid]?.name as string) ?? aid, placement, clicks: 0, confirmed: 0 };
    cur.clicks += r.clicks;
    cur.confirmed += confirmedRevenueYen(aid, r.clicks);
    comboMap.set(key, cur);
  }
  const combos = [...comboMap.values()].sort((a, b) => b.confirmed - a.confirmed || b.clicks - a.clicks).slice(0, 10);

  // 流入元ページ（referer）
  const refMap = new Map<string, { clicks: number; confirmed: number }>();
  for (const r of refRows) {
    const key = refPath(r.referer);
    const cur = refMap.get(key) ?? { clicks: 0, confirmed: 0 };
    cur.clicks += r.clicks;
    cur.confirmed += confirmedRevenueYen(r.affiliate_id as AffiliateId, r.clicks);
    refMap.set(key, cur);
  }
  const byReferer = [...refMap.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.clicks - a.clicks);

  const totals = programs.reduce(
    (acc, p) => {
      acc.clicks += p.clicks;
      acc.optimistic += p.optimistic;
      acc.confirmed += p.confirmed;
      acc.leadsLow += p.leadsLow;
      return acc;
    },
    { clicks: 0, optimistic: 0, confirmed: 0, leadsLow: 0 }
  );

  // オファーEVランキング（クリック実績と無関係の「1クリックの価値」＝配置最適化の物差し・提携済みlive全案件）。
  const evRanking = rankLiveOffersByEV();
  const maxEv = Math.max(1, ...evRanking.map((o) => o.confirmedPer1000));

  const maxProgClicks = Math.max(1, ...programs.map((p) => p.clicks));
  const maxPlacement = Math.max(1, ...byPlacement.map((p) => p.clicks));
  const maxPref = Math.max(1, ...byPref.map((p) => p.clicks));
  const maxRef = Math.max(1, ...byReferer.map((p) => p.clicks));
  const maxSource = Math.max(1, ...leads.bySource.map((s) => s.n));
  const maxCombo = Math.max(1, ...combos.map((c) => c.clicks));

  const card = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm';
  const sectionTitle = 'text-sm font-black text-slate-900';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ヘッダ */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900">送客アナリティクス（管理）</h1>
            <p className="mt-1 text-sm text-slate-500">
              直近 <strong>{days}日</strong> の /go 経由クリック実数（D1一次ログ）。期間は <code>?days=</code> で変更。
            </p>
          </div>
          <div className="flex gap-1.5 text-xs">
            {[7, 30, 90, 365].map((d) => (
              <a
                key={d}
                href={`?token=${encodeURIComponent(token)}&days=${d}${trustedOnly ? '' : '&clicks=all'}`}
                className={`rounded-lg px-2.5 py-1 font-bold ring-1 transition-colors ${
                  d === days ? 'bg-slate-800 text-white ring-slate-800' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'
                }`}
              >
                {d}日
              </a>
            ))}
          </div>
        </div>

        {/* 注意 */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          ⚠ 金額は <strong>未実測の「仮定」</strong>（CPA・転換率は affiliate-economics.ts の概算）。
          <strong>推定確定額（保守）</strong>＝クリック×保守転換率×CPA×却下控除(×{CONFIRM_RATE})で「着金見込み」に寄せた主役の数字。
          <strong>推定発生額（楽観）</strong>は理想上限。確定報酬は各ASP管理画面が正・「発生」≠「着金」。
        </div>

        {/* クリック清浄度＋表示切替（既定＝信頼クリックのみ） */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-600">
              直近{days}日の記録 <strong>{trust.total.toLocaleString('ja-JP')}</strong> 件中、
              <span className="font-bold text-emerald-700"> 信頼 {trust.trusted.toLocaleString('ja-JP')}</span>（自サイト面から）／
              <span className="font-bold text-amber-600"> 疑わしい {trust.suspect.toLocaleString('ja-JP')}</span>（{suspectShare}%・/go直叩き）
              <span className="ml-1 text-slate-400">※bot/空UA/IPバーストは記録前に除外済み</span>
            </div>
            <div className="flex gap-1.5 text-xs">
              {([['信頼のみ', ''], ['全件', 'all']] as const).map(([labelTxt, val]) => {
                const active = (val === 'all') === !trustedOnly;
                return (
                  <a
                    key={val || 'trusted'}
                    href={`?token=${encodeURIComponent(token)}&days=${days}${val ? `&clicks=${val}` : ''}`}
                    className={`rounded-lg px-2.5 py-1 font-bold ring-1 transition-colors ${
                      active ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {labelTxt}
                  </a>
                );
              })}
            </div>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            実ブラウザのCTAクリックは必ず自サイト(my-naishin.com)の referer を伴います。内部refererの無いブラウザUAクリックは
            /go を直接叩くスクレイパが大半のため、<strong>既定では「信頼」だけを集計</strong>しています（KPI・推移・プログラム別・面別・県別すべて）。
          </p>
        </div>

        {/* KPIカード */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className={card}>
            <div className="text-[11px] text-slate-500">{trustedOnly ? '信頼クリック（実数）' : '総クリック（全件）'}</div>
            <div className="mt-1 text-xl font-black text-slate-900 tabular-nums">{totals.clicks.toLocaleString('ja-JP')}</div>
            <div className="mt-0.5">
              <DeltaBadge cur={compare.current} prev={compare.previous} />
            </div>
          </div>
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 shadow-sm md:col-span-2">
            <div className="text-[11px] font-bold text-emerald-700">推定確定額（保守・主役）</div>
            <div className="mt-1 text-2xl font-black text-emerald-700 tabular-nums">{yen(totals.confirmed)}</div>
            <div className="mt-0.5 text-[11px] text-emerald-600/80">推定リード（保守）{totals.leadsLow.toFixed(1)} 件</div>
          </div>
          <div className={card}>
            <div className="text-[11px] text-slate-500">推定発生額（楽観・参考）</div>
            <div className="mt-1 text-xl font-bold text-slate-400 tabular-nums">{yen(totals.optimistic)}</div>
          </div>
          <div className={card}>
            <div className="text-[11px] text-slate-500">本物リード / Push</div>
            <div className="mt-1 text-xl font-black text-slate-900 tabular-nums">
              {leads.total.toLocaleString('ja-JP')}
              <span className="ml-1 text-xs font-normal text-slate-400">名簿</span>
            </div>
            <div className="text-[11px] text-slate-500">Push {pushCount} / 停止 {leads.unsubscribed}</div>
          </div>
        </div>

        {/* 今季の桁レバー（7/20 反証ゲート＋週次velocity）＝日曜60分でここだけ見る統治装置 */}
        <div className="mt-6">
          <h2 className={sectionTitle}>今季の桁レバー ― 7/20 反証ゲート</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
            桁を動かすのは保護者起点クリック（C_p）のみ。7/20 に「クリックN倍／発生M件」で GO / ITERATE / PIVOT を判定する。
            ¥予測はしない＝先行指標だけで読む。<strong>発生（conversions）はASP管理画面が一次</strong>（この画面では0で評価）。
          </p>

          {/* ゲート判定カード */}
          <div className={`mt-2 rounded-xl border-2 ${gateStyle.ring} bg-white p-4 shadow-sm`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-black ${gateStyle.badge}`}>{gate.verdictLabel}</span>
              <span className="text-xs text-slate-500">
                {gate.decided ? `判定日 ${gate.deadline} 到達` : `判定日 ${gate.deadline}（あと${gate.daysLeft}日）`}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{gate.rationale}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <div className="text-[11px] text-slate-500">クリック前季比</div>
                <div className="mt-0.5 text-lg font-black tabular-nums text-slate-900">{gate.clickMultipleLabel}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">今季 / 前季クリック</div>
                <div className="mt-0.5 text-lg font-black tabular-nums text-slate-900">
                  {gate.clicks.toLocaleString('ja-JP')}
                  <span className="text-xs font-normal text-slate-400"> / {gate.clicksPrev.toLocaleString('ja-JP')}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">発生（ASP実測）</div>
                <div className="mt-0.5 text-lg font-black tabular-nums text-slate-900">{gate.conversions}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">本物リード累計</div>
                <div className="mt-0.5 text-lg font-black tabular-nums text-emerald-700">{gate.leads.toLocaleString('ja-JP')}</div>
              </div>
            </div>
          </div>

          {/* 週次velocity（クリック / 新規リード） */}
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-bold text-slate-600">週次クリック（{trustedOnly ? '信頼・' : ''}直近8週）</div>
              <div className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                {weeklyClicks.map((w) => (
                  <div key={w.weekStart} className="flex items-center gap-3 text-sm">
                    <span className="w-12 shrink-0 text-right tabular-nums text-slate-500">{w.label}</span>
                    <div className="flex-1">
                      <Bar value={w.count} max={maxWeeklyClicks} className="bg-emerald-500" />
                    </div>
                    <span className="w-10 shrink-0 text-right font-bold tabular-nums text-slate-700">{w.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-600">週次 新規リード（直近8週）</div>
              <div className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                {weeklyLeads.map((w) => (
                  <div key={w.weekStart} className="flex items-center gap-3 text-sm">
                    <span className="w-12 shrink-0 text-right tabular-nums text-slate-500">{w.label}</span>
                    <div className="flex-1">
                      <Bar value={w.count} max={maxWeeklyLeads} className="bg-sky-500" />
                    </div>
                    <span className="w-10 shrink-0 text-right font-bold tabular-nums text-slate-700">{w.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            ※ line_friend_click / lead_submit の placement別（保護者起点クリックの主計器）は GA4 で本人が確認する
            （サイト側D1は /go 経由のアフィリクリックのみ計器化。LINE友だち追加・名簿送信はGA4イベント）。
          </p>
        </div>

        {/* クリック推移（折れ線＋表・日/時間切替・ホバーで件数表示） */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={sectionTitle}>
              クリック推移（{trendView === 'hour' ? `時間別・直近${trendDays}日` : '日別'}）
            </h2>
            <div className="flex gap-1.5 text-xs">
              {(['day', 'hour'] as const).map((v) => (
                <a
                  key={v}
                  href={`?token=${encodeURIComponent(token)}&days=${days}&trend=${v}${trustedOnly ? '' : '&clicks=all'}`}
                  className={`rounded-lg px-2.5 py-1 font-bold ring-1 transition-colors ${
                    v === trendView
                      ? 'bg-emerald-600 text-white ring-emerald-600'
                      : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {v === 'day' ? '日別' : '時間別'}
                </a>
              ))}
            </div>
          </div>

          {/* グラフ（ホバーで該当の日/時間と件数） */}
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <TrendChart points={trendPoints} granularity={trendView} />
          </div>

          {/* 推移表（新しい順） */}
          <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0">
                <tr className="bg-slate-700 text-left text-white">
                  <th className="px-3 py-2 font-bold">{trendView === 'hour' ? '日時（UTC）' : '日付'}</th>
                  <th className="px-3 py-2 text-right font-bold">クリック</th>
                  <th className="px-3 py-2 font-bold" />
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {trend.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-400">データなし</td>
                  </tr>
                ) : (
                  [...trend].reverse().map((r) => (
                    <tr key={r.bucket} className="odd:bg-white even:bg-slate-50">
                      <td className="px-3 py-1.5 tabular-nums">
                        {trendView === 'hour' ? `${r.bucket.slice(5, 10)} ${r.bucket.slice(11, 13)}時` : r.bucket.slice(5)}
                      </td>
                      <td className="px-3 py-1.5 text-right font-bold tabular-nums">{r.clicks.toLocaleString('ja-JP')}</td>
                      <td className="px-3 py-1.5">
                        <div className="w-32">
                          <Bar value={r.clicks} max={maxTrend} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 種別別サマリ */}
        <div className="mt-6">
          <h2 className={sectionTitle}>オファー種別ミックス</h2>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {(['free-lead', 'doc-request', 'paid'] as const).map((k) => {
              const v = kindMap.get(k) ?? { clicks: 0, confirmed: 0 };
              const meta = KIND_LABEL[k];
              const share = totals.confirmed > 0 ? Math.round((v.confirmed / totals.confirmed) * 100) : 0;
              return (
                <div key={k} className={card}>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <span className="text-xs font-bold text-slate-700">{meta.label}</span>
                  </div>
                  <div className="mt-1 text-lg font-black text-emerald-700 tabular-nums">{yen(v.confirmed)}</div>
                  <div className="text-[11px] text-slate-500">{v.clicks}クリック・確定額の{share}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* オファーEVランキング（提携済みlive・1クリックの価値＝配置最適化の物差し・“最適解”の単一ソース） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>オファーEVランキング（提携済みlive・1,000クリックあたり推定確定額）</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
            クリック実績と無関係の「1クリックがいくら生むか」の理論値（保守）。高インテント面ほど上位のオファーを置くのが最適。
            新規提携が live になると自動でここに正しい順位で並ぶ（affiliate-economics.rankLiveOffersByEV）。
          </p>
          <div className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {evRanking.map((o, i) => {
              const k = KIND_LABEL[o.kind] ?? KIND_LABEL['free-lead'];
              return (
                <div key={o.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 shrink-0 text-right tabular-nums text-slate-400">{i + 1}</span>
                  <span className="w-52 shrink-0 truncate">
                    <span className="font-bold text-slate-800">{o.programName}</span>
                    <span className={`ml-1 rounded px-1 py-0.5 text-[10px] font-bold ${k.cls}`}>{k.label}</span>
                  </span>
                  <div className="flex-1">
                    <Bar value={o.confirmedPer1000} max={maxEv} className="bg-emerald-500" />
                  </div>
                  <span className="w-24 shrink-0 text-right text-xs font-black tabular-nums text-emerald-700">
                    {yen(o.confirmedPer1000)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* プログラム別 */}
        <div className="mt-6">
          <h2 className={sectionTitle}>プログラム別（確定額＝保守の降順）</h2>
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-left text-white">
                  <th className="px-3 py-2 font-bold">プログラム</th>
                  <th className="px-3 py-2 text-right font-bold">クリック</th>
                  <th className="px-3 py-2 text-right font-bold">CPA</th>
                  <th className="px-3 py-2 text-right font-bold">転換 楽観/保守</th>
                  <th className="px-3 py-2 text-right font-bold text-slate-300">発生額(楽観)</th>
                  <th className="px-3 py-2 text-right font-bold">確定額(保守)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {programs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                      クリックデータがありません（D1 未バインド、または期間内にクリックなし）。
                    </td>
                  </tr>
                ) : (
                  programs.map((p) => {
                    const e = economicsFor(p.id);
                    const k = KIND_LABEL[e.kind] ?? KIND_LABEL['free-lead'];
                    return (
                      <tr key={p.id} className="odd:bg-white even:bg-slate-50">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{p.name}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${k.cls}`}>{k.label}</span>
                          </div>
                          <div className="mt-1 max-w-[160px]">
                            <Bar value={p.clicks} max={maxProgClicks} />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.clicks.toLocaleString('ja-JP')}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-500">{yen(e.cpaYen)}</td>
                        <td className="px-3 py-2 text-right text-xs tabular-nums text-slate-500">
                          {pct(e.convRate)} / <span className="font-bold text-slate-700">{pct(e.convRateLow)}</span>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-400">{yen(p.optimistic)}</td>
                        <td className="px-3 py-2 text-right font-black tabular-nums text-emerald-700">{yen(p.confirmed)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {programs.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-black text-slate-800">
                    <td className="px-3 py-2">合計</td>
                    <td className="px-3 py-2 text-right tabular-nums">{totals.clicks.toLocaleString('ja-JP')}</td>
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2 text-right tabular-nums text-slate-400">{yen(totals.optimistic)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-700">{yen(totals.confirmed)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* 勝ち案件 × 勝ち面 */}
        <div className="mt-6">
          <h2 className={sectionTitle}>勝ち案件 × 勝ち面（program × placement トップ10）</h2>
          <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {combos.length === 0 ? (
              <p className="text-sm text-slate-400">データなし</p>
            ) : (
              combos.map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0 truncate">
                    <span className="font-bold text-slate-800">{c.program}</span>
                    <span className="ml-1 text-xs text-slate-400">@{c.placement}</span>
                  </span>
                  <div className="flex-1">
                    <Bar value={c.clicks} max={maxCombo} className="bg-violet-400" />
                  </div>
                  <span className="w-8 shrink-0 text-right tabular-nums text-slate-600">{c.clicks}</span>
                  <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-emerald-700">{yen(c.confirmed)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 流入元ページ（referer） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>流入元ページ（どのページが押されたか・referer実測）</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            placement が未付与（素のバナー等）でも、全クリックの referer で送客元を取りこぼさず追える。
          </p>
          <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {byReferer.length === 0 ? (
              <p className="text-sm text-slate-400">データなし</p>
            ) : (
              byReferer.slice(0, 15).map((d) => (
                <div key={d.key} className="flex items-center gap-3 text-sm">
                  <span className="w-48 shrink-0 truncate font-mono text-xs text-slate-700">{d.key}</span>
                  <div className="flex-1">
                    <Bar value={d.clicks} max={maxRef} className="bg-teal-400" />
                  </div>
                  <span className="w-8 shrink-0 text-right tabular-nums text-slate-600">{d.clicks}</span>
                  <span className="w-16 shrink-0 text-right text-xs tabular-nums text-emerald-700">{yen(d.confirmed)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 面別 / 県別 */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className={sectionTitle}>面別（placement・付与分のみ）</h2>
            <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              {byPlacement.length === 0 ? (
                <p className="text-sm text-slate-400">データなし</p>
              ) : (
                byPlacement.slice(0, 12).map((d) => (
                  <div key={d.key} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 truncate font-medium text-slate-700">{d.key}</span>
                    <div className="flex-1">
                      <Bar value={d.clicks} max={maxPlacement} className="bg-indigo-400" />
                    </div>
                    <span className="w-8 shrink-0 text-right tabular-nums text-slate-600">{d.clicks}</span>
                    <span className="w-16 shrink-0 text-right text-xs tabular-nums text-emerald-700">{yen(d.confirmed)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h2 className={sectionTitle}>県別（トップ12）</h2>
            <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              {byPref.length === 0 ? (
                <p className="text-sm text-slate-400">データなし</p>
              ) : (
                byPref.slice(0, 12).map((d) => (
                  <div key={d.key} className="flex items-center gap-3 text-sm">
                    <span className="w-20 shrink-0 truncate font-medium text-slate-700">{d.key}</span>
                    <div className="flex-1">
                      <Bar value={d.clicks} max={maxPref} className="bg-sky-400" />
                    </div>
                    <span className="w-8 shrink-0 text-right tabular-nums text-slate-600">{d.clicks}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 名簿（堀A） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>名簿（堀A・配信母数）— 全期間</h2>
          <div className="mt-2 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 tabular-nums">{leads.total}</span>
                <span className="text-sm text-slate-500">本物リード（配信可能）</span>
              </div>
              <div className="mt-3 text-[11px] font-bold text-slate-500">経路別</div>
              <div className="mt-1 space-y-1.5">
                {leads.bySource.length === 0 ? (
                  <p className="text-sm text-slate-400">まだ0件。最初の1件が出たらここに乗る。</p>
                ) : (
                  leads.bySource.map((s) => (
                    <div key={s.source} className="flex items-center gap-2 text-sm">
                      <span className="w-24 shrink-0 truncate text-slate-700">{s.source}</span>
                      <div className="flex-1">
                        <Bar value={s.n} max={maxSource} className="bg-emerald-400" />
                      </div>
                      <span className="w-6 text-right tabular-nums text-slate-600">{s.n}</span>
                    </div>
                  ))
                )}
              </div>
              {leads.byPref.length > 0 && (
                <>
                  <div className="mt-3 text-[11px] font-bold text-slate-500">県別（上位）</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {leads.byPref.slice(0, 10).map((p) => (
                      <span key={p.prefecture_name} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {p.prefecture_name} {p.n}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-bold text-slate-500">最近の登録（最新20件・メールは伏字）</div>
              {leads.recent.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">まだ登録がありません。</p>
              ) : (
                <table className="min-w-full text-xs">
                  <tbody className="text-slate-600">
                    {leads.recent.map((r, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-1.5 tabular-nums text-slate-400">{r.created_at?.slice(5, 16)}</td>
                        <td className="px-3 py-1.5 font-medium text-slate-700">{maskEmail(r.email)}</td>
                        <td className="px-3 py-1.5 text-slate-500">{r.source ?? '—'}</td>
                        <td className="px-3 py-1.5 text-slate-500">{r.prefecture_name ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* API利用（堀B・課金ゲートの証拠＝誰がどれだけ呼んだか） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>API利用（堀B・課金ゲート）— B2B交渉の実績データ</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            発行済みAPIキーと利用量（D1 api_keys / api_usage）。未点火（migrations/0005未適用）なら空。
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className={card}>
              <div className="text-[11px] text-slate-500">発行キー数</div>
              <div className="mt-1 text-xl font-black text-slate-900 tabular-nums">{apiKeys.length}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">当月リクエスト</div>
              <div className="mt-1 text-xl font-black text-indigo-700 tabular-nums">{apiThisMonth.toLocaleString('ja-JP')}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">累計リクエスト</div>
              <div className="mt-1 text-xl font-bold text-slate-700 tabular-nums">{apiTotalReq.toLocaleString('ja-JP')}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">ティア内訳</div>
              <div className="mt-1 text-xs font-medium text-slate-700">
                {Object.keys(apiByTier).length === 0
                  ? '—'
                  : Object.entries(apiByTier).map(([t, n]) => `${t}:${n}`).join(' / ')}
              </div>
            </div>
          </div>
          {apiKeys.length > 0 && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-700 text-left text-white">
                    <th className="px-2 py-2 font-bold">キー</th>
                    <th className="px-2 py-2 font-bold">ティア</th>
                    <th className="px-2 py-2 font-bold">状態</th>
                    <th className="px-2 py-2 text-right font-bold">当月</th>
                    <th className="px-2 py-2 text-right font-bold">累計</th>
                    <th className="px-2 py-2 font-bold">最終利用</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {apiKeys.map((k, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="px-2 py-1.5 font-mono text-[10px] text-slate-700">{k.prefix}</td>
                      <td className="px-2 py-1.5 font-medium">{k.tier}</td>
                      <td className="px-2 py-1.5">
                        <span className={k.status === 'active' ? 'text-emerald-600' : 'text-rose-500'}>{k.status}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{(k.this_month || 0).toLocaleString('ja-JP')}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{(k.request_count || 0).toLocaleString('ja-JP')}</td>
                      <td className="px-2 py-1.5 tabular-nums text-slate-400">{k.last_used_at?.slice(5, 16) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Freemiumファネル（E-5・発行→利用開始→当月継続→pro転換） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>Freemiumファネル — 発行→利用→pro転換</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            free発行後に同メールでpro/scaleキーが発行されたら「転換」とみなす（tierは同一キーで書き換わらない設計＝stripe/webhook）。転換率の分母はメール登録があるfreeキーのみ。
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className={card}>
              <div className="text-[11px] text-slate-500">free発行</div>
              <div className="mt-1 text-xl font-black text-slate-900 tabular-nums">{apiFunnel.issuedFree}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">利用開始（1回以上）</div>
              <div className="mt-1 text-xl font-bold text-slate-700 tabular-nums">{apiFunnel.activatedFree}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">当月継続利用</div>
              <div className="mt-1 text-xl font-bold text-slate-700 tabular-nums">{apiFunnel.activeThisMonthFree}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">pro/scale発行</div>
              <div className="mt-1 text-xl font-black text-indigo-700 tabular-nums">{apiFunnel.issuedPaid}</div>
            </div>
            <div className={card}>
              <div className="text-[11px] text-slate-500">転換率（メール一致）</div>
              <div className="mt-1 text-xl font-black text-emerald-700 tabular-nums">
                {apiFunnel.distinctFreeEmails > 0 ? `${(apiFunnel.conversionRate * 100).toFixed(1)}%` : '—'}
              </div>
              <div className="mt-0.5 text-[10px] text-slate-400">
                {apiFunnel.convertedEmails}/{apiFunnel.distinctFreeEmails}件（メール登録済free）
              </div>
            </div>
          </div>
        </div>

        {/* A/B実験ポートフォリオの健全性（I-2・常時2本運用＋月次ローテーション） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>A/B実験ポートフォリオ — 常時{MIN_RUNNING_EXPERIMENTS}本運用</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className={card}>
              <div className="text-[11px] text-slate-500">稼働中の実験</div>
              <div className={`mt-1 text-xl font-black tabular-nums ${experimentHealth.belowMinimum ? 'text-rose-600' : 'text-slate-900'}`}>
                {experimentHealth.runningCount}本
              </div>
              {experimentHealth.belowMinimum && (
                <div className="mt-0.5 text-[10px] font-bold text-rose-500">下限{MIN_RUNNING_EXPERIMENTS}本を下回っています</div>
              )}
            </div>
            <div className={`${card} md:col-span-2`}>
              <div className="text-[11px] text-slate-500">月次ローテーション要（30日超・未決着）</div>
              {experimentHealth.overdueForRotation.length === 0 ? (
                <div className="mt-1 text-sm font-medium text-emerald-700">なし</div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {experimentHealth.overdueForRotation.map((r) => (
                    <span key={r.id} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      {r.id}（{r.daysRunning}日）
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 直近クリック明細（信頼度分類＝自己検証用） */}
        <div className="mt-6">
          <h2 className={sectionTitle}>直近クリック明細（信頼度分類）</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            👤信頼=ブラウザUA＋自サイトreferer（実際に面から押された）／⚠️疑わしい=ブラウザUAだが内部referer無し（/go直叩きスクレイパが大半）／🤖bot=UAがbot・空UA／—=UA記録前の旧データ。
            直近{classified.length}件：<span className="font-bold text-emerald-700">信頼 {recentTrust.human}</span> ・
            <span className="font-bold text-amber-600"> 疑わしい {recentTrust.suspect}</span> ・
            <span className="font-bold text-rose-500"> bot {recentTrust.bot}</span>
            {recentTrust.unknown ? ` ・旧 ${recentTrust.unknown}` : ''}
            <span className="ml-1 text-slate-400">（{trustedOnly ? '信頼のみ表示中・「全件」で疑わしいも表示' : '全件表示中・「信頼のみ」で絞り込み'}）</span>
          </p>
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-700 text-left text-white">
                  <th className="px-2 py-2 font-bold">時刻(UTC)</th>
                  <th className="px-2 py-2 font-bold">判定</th>
                  <th className="px-2 py-2 font-bold">案件</th>
                  <th className="px-2 py-2 font-bold">面</th>
                  <th className="px-2 py-2 font-bold">流入元</th>
                  <th className="px-2 py-2 font-bold">UA</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {visibleClicks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-6 text-center text-slate-400">
                      {trustedOnly ? '信頼できるクリックはまだありません（「全件」で疑わしいクリックも確認できます）。' : 'クリックがありません。'}
                    </td>
                  </tr>
                ) : (
                  visibleClicks.map(({ row: r, trust: t }, i) => {
                    const verdict =
                      t === 'human' ? '👤 信頼' : t === 'suspect' ? '⚠️ 疑わしい' : t === 'bot' ? '🤖 bot' : '—';
                    const rowBg = t === 'bot' ? 'bg-rose-50/60' : t === 'suspect' ? 'bg-amber-50/60' : '';
                    return (
                      <tr key={i} className={`border-b border-slate-50 last:border-0 ${rowBg}`}>
                        <td className="px-2 py-1.5 tabular-nums text-slate-400">{r.created_at?.slice(5, 16)}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{verdict}</td>
                        <td className="px-2 py-1.5 font-medium text-slate-700">
                          {(AFFILIATES[r.affiliate_id as AffiliateId]?.name as string) ?? r.affiliate_id}
                        </td>
                        <td className="px-2 py-1.5">{r.placement ?? '-'}</td>
                        <td className="px-2 py-1.5 font-mono text-[10px]">{r.referer ? refPath(r.referer) : '(直接/null)'}</td>
                        <td
                          className="max-w-[220px] truncate px-2 py-1.5 font-mono text-[10px] text-slate-400"
                          title={r.user_agent ?? ''}
                        >
                          {r.user_agent ? r.user_agent.slice(0, 60) : '(記録前)'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          来季の直接送客契約（塾・個別指導へのCPA交渉）の営業資料は、このクリック実績＋名簿件数＋
          scripts/generate-sales-report.ts の月次Markdownを使用。確定額は ASP 管理画面の実数で更新する運用。
        </p>
      </div>
    </div>
  );
}
