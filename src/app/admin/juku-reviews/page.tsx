import type { Metadata } from 'next';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { getReviewsByStatus, type ReviewRow } from '@/lib/juku-reviews-db';
import { JukuReviewModerationActions } from '@/components/admin/JukuReviewModerationActions';

/**
 * 塾口コミのモデレーション管理画面（TIER R-1第3弾・内部ツール）。
 *
 * admin/report・admin/worklogと同じADMIN_REPORT_TOKEN認証を共有（admin-auth.ts単一ソース）。
 * 承認待ち（pending）を一覧表示し、承認/却下ボタンで即座に確定できる。
 * D1未バインド・migration未適用の間は常に0件表示（静かに動く＝push=本番デプロイでも壊さない）。
 *
 * ⚠️ 2026-07-09時点、投稿UI自体が未実装（👤の公開判断待ち）のため、実際にpendingが
 * 溜まることはまだない。この画面は投稿UIが公開された後に使う運用ツールとして先行整備。
 */

export const metadata: Metadata = {
  title: '塾口コミ モデレーション（管理）| My Naishin',
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

function ReviewCard({ review, token }: { review: ReviewRow; token: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500">#{review.id} ・ {review.juku_id}</span>
        <span className="text-xs text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {review.prefecture_code ?? '地域未指定'} ・ {review.created_at}
        </span>
        <JukuReviewModerationActions id={review.id} currentStatus={review.status} token={token} />
      </div>
    </div>
  );
}

export default async function AdminJukuReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  if (!token || !(await isAuthorizedAdminToken(token))) {
    return <Gate />;
  }

  const [pending, approved, rejected] = await Promise.all([
    getReviewsByStatus('pending'),
    getReviewsByStatus('approved', 10),
    getReviewsByStatus('rejected', 10),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-bold text-slate-900">塾口コミ モデレーション</h1>
        <p className="mt-1 text-sm text-slate-500">
          承認待ち {pending.length}件 ・ 承認済み直近{approved.length}件 ・ 却下直近{rejected.length}件
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700">承認待ち（{pending.length}）</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">承認待ちの口コミはありません。</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <ReviewCard key={r.id} review={r} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">承認済み（直近{approved.length}件）</h2>
          {approved.length === 0 ? (
            <p className="text-sm text-slate-400">承認済みの口コミはまだありません。</p>
          ) : (
            <div className="space-y-3">
              {approved.map((r) => (
                <ReviewCard key={r.id} review={r} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">却下済み（直近{rejected.length}件）</h2>
          {rejected.length === 0 ? (
            <p className="text-sm text-slate-400">却下済みの口コミはまだありません。</p>
          ) : (
            <div className="space-y-3">
              {rejected.map((r) => (
                <ReviewCard key={r.id} review={r} token={token} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
