import type { Metadata } from 'next';

import { getClickSummary, type ClickAggRow } from '@/lib/clicks-db';
import {
  economicsFor,
  estimatedLeads,
  estimatedRevenueYen,
  yen,
} from '@/lib/affiliate-economics';
import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';

/**
 * 送客実績レポート（認証付き・H5）。来季の直接送客契約（CPA交渉）の「実績データ」をいつでも出せる土台。
 *
 * 設計：
 *  - D1 のクリック実数（/go 経由）を program 単位に集計し、推定リード数・推定発生額に変換して表示。
 *  - 金額は affiliate-economics.ts の「仮定」ベース（=営業の当たり）。実報酬は ASP管理画面が正、と明記。
 *  - 認証：?token=＜ADMIN_REPORT_TOKEN＞ が一致した時だけ表示。未設定/不一致は何も出さない（noindex）。
 *  - D1 未バインド時は「0件」として静かに動く（push=本番なので壊さない）。
 */

export const metadata: Metadata = {
  title: '送客実績レポート（管理）| My Naishin',
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

interface ProgramAgg {
  id: AffiliateId;
  name: string;
  clicks: number;
}

/** program×県×面の行を program 単位に畳む。 */
function aggregateByProgram(rows: ClickAggRow[]): ProgramAgg[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.affiliate_id, (map.get(r.affiliate_id) ?? 0) + r.clicks);
  }
  return [...map.entries()]
    .map(([id, clicks]) => ({
      id: id as AffiliateId,
      name: (AFFILIATES[id as AffiliateId]?.name as string) ?? id,
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks);
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

  const rows = await getClickSummary(days);
  const programs = aggregateByProgram(rows);

  const totals = programs.reduce(
    (acc, p) => {
      acc.clicks += p.clicks;
      acc.leads += estimatedLeads(p.id, p.clicks);
      acc.revenue += estimatedRevenueYen(p.id, p.clicks);
      return acc;
    },
    { clicks: 0, leads: 0, revenue: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-xl font-bold text-slate-900">送客実績レポート（管理）</h1>
        <p className="mt-1 text-sm text-slate-500">
          直近 <strong>{days}日</strong> の /go 経由クリック実数（D1）。期間は <code>?days=</code> で変更。
        </p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          ⚠ 推定リード数・推定発生額は <strong>未実測の「仮定」</strong>（CPA・転換率は affiliate-economics.ts の概算）です。
          確定報酬は各ASP管理画面が正。「発生」≠「着金」（承認・確定にラグあり）。実測が出たら係数を実数に置換します。
        </div>

        {/* サマリ */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: '総クリック（実数）', value: totals.clicks.toLocaleString('ja-JP') },
            { label: '推定リード数（仮定）', value: totals.leads.toFixed(1) },
            { label: '推定発生額（仮定）', value: yen(totals.revenue) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 text-lg font-black text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* プログラム別 */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-700 text-left text-white">
                <th className="px-3 py-2 font-bold">プログラム</th>
                <th className="px-3 py-2 text-right font-bold">クリック</th>
                <th className="px-3 py-2 text-right font-bold">推定CPA</th>
                <th className="px-3 py-2 text-right font-bold">推定リード</th>
                <th className="px-3 py-2 text-right font-bold">推定発生額</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                    クリックデータがありません（D1 未バインド、または期間内にクリックなし）。
                  </td>
                </tr>
              ) : (
                programs.map((p) => (
                  <tr key={p.id} className="odd:bg-white even:bg-slate-50">
                    <td className="px-3 py-2">
                      <span className="font-bold text-slate-800">{p.name}</span>
                      <span className="ml-1 text-[10px] text-slate-400">{p.id}</span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{p.clicks.toLocaleString('ja-JP')}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{yen(economicsFor(p.id).cpaYen)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{estimatedLeads(p.id, p.clicks).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums text-emerald-700">{yen(estimatedRevenueYen(p.id, p.clicks))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          来季の直接送客契約（塾・個別指導へのCPA交渉）の営業資料は、このクリック実績＋ scripts/generate-sales-report.ts の月次Markdownを使用。
        </p>
      </div>
    </div>
  );
}
