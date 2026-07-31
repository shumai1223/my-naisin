import type { Metadata } from 'next';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { getCommunityPostsByStatus, type CommunityPostRow } from '@/lib/community-posts-db';
import { CommunityPostModerationActions } from '@/components/admin/CommunityPostModerationActions';

/**
 * 保護者コミュニティ投稿のモデレーション管理画面（Λ-14・内部ツール・build-not-launch）。
 *
 * admin/juku-reviewsと同じADMIN_REPORT_TOKEN認証を共有（admin-auth.ts単一ソース）。
 * 承認待ち（pending）・要確認（flagged=PII自動フィルタが検知）を分けて一覧表示し、
 * 承認/却下ボタンで即座に確定できる。D1未バインド・migration未適用の間は常に0件表示
 * （静かに動く＝push=本番デプロイでも壊さない）。
 *
 * ⚠️ 2026-08-01時点、投稿UI自体が未実装（👤の運営方針・公開判断待ち）のため、実際に
 * pending/flaggedが溜まることはまだない。この画面は投稿UIが公開された後に使う運用ツール
 * として先行整備する（loop=機構試作／👤主導=運営方針・モデレーション、の役割分担どおり）。
 */

export const metadata: Metadata = {
  title: '保護者コミュニティ モデレーション（管理）| My Naishin',
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

function PostCard({ post, token }: { post: CommunityPostRow; token: string }) {
  const piiReasons = post.pii_risk_reasons ? post.pii_risk_reasons.split(',') : [];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500">
          #{post.id} ・ {post.category === 'question' ? '質問' : '相互支援'}
        </span>
        {piiReasons.length > 0 && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
            要確認: {piiReasons.join('・')}
          </span>
        )}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{post.body}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">{post.created_at}</span>
        <CommunityPostModerationActions id={post.id} currentStatus={post.status} token={token} />
      </div>
    </div>
  );
}

export default async function AdminCommunityPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  if (!token || !(await isAuthorizedAdminToken(token))) {
    return <Gate />;
  }

  const [pending, flagged, approved, rejected] = await Promise.all([
    getCommunityPostsByStatus('pending'),
    getCommunityPostsByStatus('flagged'),
    getCommunityPostsByStatus('approved', 10),
    getCommunityPostsByStatus('rejected', 10),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-bold text-slate-900">保護者コミュニティ モデレーション</h1>
        <p className="mt-1 text-sm text-slate-500">
          承認待ち {pending.length}件 ・ 要確認(PII検知) {flagged.length}件 ・ 承認済み直近{approved.length}件 ・ 却下直近
          {rejected.length}件
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700">要確認・PII自動フィルタ検知（{flagged.length}）</h2>
          {flagged.length === 0 ? (
            <p className="text-sm text-slate-400">要確認の投稿はありません。</p>
          ) : (
            <div className="space-y-3">
              {flagged.map((p) => (
                <PostCard key={p.id} post={p} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700">承認待ち（{pending.length}）</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">承認待ちの投稿はありません。</p>
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <PostCard key={p.id} post={p} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">承認済み（直近{approved.length}件）</h2>
          {approved.length === 0 ? (
            <p className="text-sm text-slate-400">承認済みの投稿はまだありません。</p>
          ) : (
            <div className="space-y-3">
              {approved.map((p) => (
                <PostCard key={p.id} post={p} token={token} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-slate-700">却下済み（直近{rejected.length}件）</h2>
          {rejected.length === 0 ? (
            <p className="text-sm text-slate-400">却下済みの投稿はまだありません。</p>
          ) : (
            <div className="space-y-3">
              {rejected.map((p) => (
                <PostCard key={p.id} post={p} token={token} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
