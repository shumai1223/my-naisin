import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { AdvisorClient } from '@/components/Advisor/AdvisorClient';
import { isAdvisorEnabled } from '@/lib/advisor/flag';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * グラウンデッドAIアドバイザー（ZZ-3c・build-not-launch）。
 * NEXT_PUBLIC_ADVISOR_ENABLED='1'（既定off）のときだけ公開する。旗off時はnotFound()＝
 * 本番で実質不可視（sitemap.xmlには登録済みだが旗が立つまで200を返さない）。
 * AI層は実装しない（決定論エンジンのみ・docs/zz-specs/zz3-grounded-advisor-spec.md §8）。
 */
export const metadata: Metadata = {
  title: '内申点・偏差値アドバイザー（β） | My Naishin',
  description: '内申点・総合得点・偏差値・目標逆算について、決定論エンジンの計算結果だけで答えるアドバイザー（AIによる作文は行いません）。',
  robots: { index: false, follow: false },
};

export default function AdvisorPage() {
  if (!isAdvisorEnabled(process.env.NEXT_PUBLIC_ADVISOR_ENABLED)) {
    notFound();
  }

  const url = `${SITE_URL}/advisor`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'アドバイザー（β）', url },
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">アドバイザー（β）</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">アドバイザー（β）</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              内申点・総合得点・偏差値・目標逆算について、既存の計算エンジンの結果だけで答えます。
            </p>
          </header>

          <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-900" />
              <p className="text-base leading-[1.8] text-amber-900">
                この回答はAIによる作文ではなく、既存の計算ツールと同じ決定論エンジンの結果のみで構成されています。範囲外の質問には正直に「答えられません」とお伝えします。最終的な判断は学校の先生・保護者の方とご相談ください。
              </p>
            </div>
          </section>

          <AdvisorClient />
        </div>
      </div>
    </>
  );
}
