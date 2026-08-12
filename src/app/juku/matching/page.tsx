import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { listActivePartnersForPublic } from '@/lib/juku-matching-db';
import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { ReferralRequestButton } from '@/components/JukuMatching/ReferralRequestButton';

/**
 * 保護者向け・直接マッチング市場の公開送客導線（Λ-7残作業・Ω-6のフロントエンド第一歩）。
 *
 * juku-matching-db.tsのバックエンド（提携塾管理・送客ログ・成果計上）は既存だが、
 * これまで保護者が実際に送客を発生させる公開画面が存在しなかった（管理画面のみ）。
 * このページは`status='active'`（👤が審査・承認済み）の提携塾のみを一覧し、
 * クリックのみで送客ログ（studentRefはサーバー生成の匿名UUID）を記録する。
 *
 * **build-not-launch**: 既存のNEXT_PUBLIC_JUKU_SAAS_ENABLED旗を流用（旗offはnotFound）。
 * 実際にはjuku_partnersがまだ空（実提携塾を1件も審査・登録していない）ため、旗onでも
 * 「準備中」表示になる。👤が提携塾を審査・登録するまではこの導線に実害・実流入は発生しない。
 */
export const metadata: Metadata = {
  title: '提携塾を探す（β）| My Naishin',
  // 実提携塾が揃うまではindexしない（薄いページ化を避ける・Λ-2と同じ考え方）。
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function JukuMatchingPage() {
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    notFound();
  }

  const partners = await listActivePartnersForPublic();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-black text-slate-900">提携塾を探す</h1>
        <p className="mt-2 text-sm text-slate-500">
          My Naishinが個別に提携している塾・オンライン家庭教師の一覧です。気になる塾があれば、紹介を依頼できます（メールアドレス等の入力は不要です）。
        </p>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          【PR】掲載塾・オンライン家庭教師は、My Naishinと個別に提携契約を結んだ事業者です。紹介を通じて
          入塾等の成果が発生した場合、当サイトは提携事業者から紹介料（成果報酬）を受け取ります。
        </div>

        {partners.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">現在、提携塾を準備中です。近日公開予定です。</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {partners.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="font-bold text-slate-800">{p.name}</span>
                <ReferralRequestButton jukuPartnerId={p.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
