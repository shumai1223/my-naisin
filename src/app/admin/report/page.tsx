import type { Metadata } from 'next';

import {
  getClickSummary,
  getClickTrend,
  getRefererSummary,
  getClickPeriodComparison,
  type ClickAggRow,
} from '@/lib/clicks-db';
import { getLeadSummary } from '@/lib/leads-db';
import { countActiveSubscriptions } from '@/lib/push-db';
import {
  economicsFor,
  estimatedLeadsLow,
  estimatedRevenueYen,
  confirmedRevenueYen,
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

  const [rows, trend, refRows, compare, leads, pushCount] = await Promise.all([
    getClickSummary(days),
    getClickTrend(trendDays, trendView),
    getRefererSummary(days),
    getClickPeriodComparison(days),
    getLeadSummary(20),
    countActiveSubscriptions(),
  ]);

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
                href={`?token=${encodeURIComponent(token)}&days=${d}`}
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

        {/* KPIカード */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className={card}>
            <div className="text-[11px] text-slate-500">総クリック（実数）</div>
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
                  href={`?token=${encodeURIComponent(token)}&days=${days}&trend=${v}`}
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

        <p className="mt-6 text-xs text-slate-400">
          来季の直接送客契約（塾・個別指導へのCPA交渉）の営業資料は、このクリック実績＋名簿件数＋
          scripts/generate-sales-report.ts の月次Markdownを使用。確定額は ASP 管理画面の実数で更新する運用。
        </p>
      </div>
    </div>
  );
}
