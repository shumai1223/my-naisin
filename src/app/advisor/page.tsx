import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, MessageCircleQuestion, AlertTriangle } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">アドバイザー（β）</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <MessageCircleQuestion className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">アドバイザー（β）</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              内申点・総合得点・偏差値・目標逆算について、既存の計算エンジンの結果だけで答えます。
            </p>
          </header>

          <section className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
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
