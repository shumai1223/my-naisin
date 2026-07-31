import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { verifyPartnerInviteToken, listReferralsForPartner, getPartnerLedger } from '@/lib/juku-matching-db';
import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';

/**
 * 提携塾自身の直接マッチングダッシュボード（Λ-7・招待フロー・build-not-launch）。
 *
 * juku-saas(ZZ-4d)の/juku/dashboardと同じ招待トークン認証パターン(?token=)を、
 * 直接マッチング(juku_partners)向けに適用したもの。既存のNEXT_PUBLIC_JUKU_SAAS_ENABLED旗を
 * そのまま流用する(塾向けbuild-not-launch機能を1つの旗でまとめて管理する・新規旗は増やさない)。
 *
 * 読み取り専用（送客の状態更新・成約報告はadmin/juku-matchingから管理者が代行する設計を維持。
 * 塾自身による自己申告の成約報告を許すと金額の正当性検証が必要になるため、
 * この段階ではまず「見える化」だけを提供する＝Λ-7残作業の一部を意図的にスコープ外のまま残す）。
 */
export const metadata: Metadata = {
  title: '提携塾ダッシュボード（β）| My Naishin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function Gate() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold text-slate-800">招待トークンが必要です</h1>
      <p className="mt-2 text-sm text-slate-500">
        このページは招待された提携塾専用です。<code>?token=</code> に正しい招待トークンを付けてアクセスしてください。
      </p>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  sent: '送客済み(対応待ち)',
  contacted: '連絡済み',
  converted: '成約済み',
  declined: '辞退',
};

export default async function JukuMatchingPartnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    notFound();
  }

  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;
  const partner = token ? await verifyPartnerInviteToken(token) : null;
  if (!partner) {
    return <Gate />;
  }

  const [referrals, ledger] = await Promise.all([
    listReferralsForPartner(partner.id),
    getPartnerLedger(partner.id),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-black text-slate-900">{partner.name} 様 送客ダッシュボード</h1>
        <p className="mt-1 text-xs text-slate-500">
          take-rate {(partner.commissionRateBps / 100).toFixed(1)}% ・ 送客{referrals.length}件
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700">送客一覧（{referrals.length}）</h2>
          {referrals.length === 0 ? (
            <p className="text-sm text-slate-400">まだ送客はありません。</p>
          ) : (
            <div className="space-y-2">
              {referrals.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      {r.prefectureCode ?? '地域未指定'} ・ {r.format ?? '形式未指定'}
                    </span>
                    <span className="text-xs text-slate-500">{STATUS_LABEL[r.status] ?? r.status}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">{r.sentAt}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">成果計上台帳（{ledger.length}）</h2>
          {ledger.length === 0 ? (
            <p className="text-sm text-slate-400">まだ成果計上はありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">請求月</th>
                    <th className="py-2 pr-4 text-right">成約金額</th>
                    <th className="py-2 pr-4 text-right">取り分</th>
                    <th className="py-2 text-right">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((e) => (
                    <tr key={e.id} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-600">{e.billingPeriod}</td>
                      <td className="py-2 pr-4 text-right text-slate-600">{e.grossAmountYen}円</td>
                      <td className="py-2 pr-4 text-right font-semibold text-slate-700">{e.commissionAmountYen}円</td>
                      <td className="py-2 text-right text-slate-500">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-8 text-xs text-slate-400">
          送客の状態更新や成約のご報告は、担当者までご連絡ください。
        </p>
      </div>
    </div>
  );
}
