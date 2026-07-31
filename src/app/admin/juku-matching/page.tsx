import type { Metadata } from 'next';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { listJukuPartners, listReferrals, type ReferralWithPartner } from '@/lib/juku-matching-db';
import { JukuReferralActions } from '@/components/admin/JukuReferralActions';
import { JukuPartnerCreateForm } from '@/components/admin/JukuPartnerCreateForm';

/**
 * 直接マッチング市場（Λ-7・Ω-6実行層）の管理画面。build-not-launch＝フラグoffで未公開。
 *
 * admin/juku-reviewsと同じADMIN_REPORT_TOKEN認証を共有（admin-auth.ts単一ソース）。
 * 招待フロー（塾側が自分でログインして操作する）はまだ無いため、この画面は
 * 管理者(👤)が提携塾の代わりに送客の状態更新・成約報告を行う代行ツールとして先行整備する。
 * D1未バインド・migration未適用の間は常に0件表示（静かに動く＝pushで本番を壊さない）。
 */

export const metadata: Metadata = {
  title: '直接マッチング管理（管理）| My Naishin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

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

function ReferralCard({ referral, token }: { referral: ReferralWithPartner; token: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500">
          #{referral.id} ・ {referral.jukuPartnerName}
        </span>
        <span className="text-[11px] text-slate-400">{referral.sentAt}</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">
        {referral.studentRef}（{referral.prefectureCode ?? '地域未指定'} ・ {referral.format ?? '形式未指定'}）
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">status: {referral.status}</span>
        <JukuReferralActions referralId={referral.id} currentStatus={referral.status} token={token} />
      </div>
    </div>
  );
}

export default async function AdminJukuMatchingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  if (!token || !(await isAuthorizedAdminToken(token))) {
    return <Gate />;
  }

  const [partners, pendingReferrals, convertedReferrals, declinedReferrals] = await Promise.all([
    listJukuPartners(),
    listReferrals('sent', 50),
    listReferrals('converted', 10),
    listReferrals('declined', 10),
  ]);
  const contactedReferrals = await listReferrals('contacted', 50);
  const awaitingAction = [...pendingReferrals, ...contactedReferrals].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-bold text-slate-900">直接マッチング管理（Λ-7・build-not-launch）</h1>
        <p className="mt-1 text-sm text-slate-500">
          提携塾{partners.length}件 ・ 対応待ち送客{awaitingAction.length}件 ・ 成約直近{convertedReferrals.length}件
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700">提携塾（{partners.length}）</h2>
          <div className="space-y-2">
            {partners.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                #{p.id} {p.name} ・ take-rate {(p.commissionRateBps / 100).toFixed(1)}% ・ status: {p.status}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <JukuPartnerCreateForm token={token} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">対応待ちの送客（{awaitingAction.length}）</h2>
          {awaitingAction.length === 0 ? (
            <p className="text-sm text-slate-400">対応待ちの送客はありません。</p>
          ) : (
            <div className="space-y-3">
              {awaitingAction.map((r) => (
                <ReferralCard key={r.id} referral={r} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">成約済み（直近{convertedReferrals.length}件）</h2>
          {convertedReferrals.length === 0 ? (
            <p className="text-sm text-slate-400">成約済みの送客はまだありません。</p>
          ) : (
            <div className="space-y-3">
              {convertedReferrals.map((r) => (
                <ReferralCard key={r.id} referral={r} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">辞退済み（直近{declinedReferrals.length}件）</h2>
          {declinedReferrals.length === 0 ? (
            <p className="text-sm text-slate-400">辞退済みの送客はまだありません。</p>
          ) : (
            <div className="space-y-3">
              {declinedReferrals.map((r) => (
                <ReferralCard key={r.id} referral={r} token={token} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
