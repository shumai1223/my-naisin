import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { SUBJECT_CONTENTS, getSubjectContent } from '@/lib/hensachi-subject-content';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ subject: string }>;
}

export function generateStaticParams() {
  return SUBJECT_CONTENTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subject } = await params;
  const content = getSubjectContent(subject);
  if (!content) return {};
  const title = `${content.label}の偏差値 上げ方【中学生】計算＋伸ばす具体策 | My Naishin`;
  const description = `${content.label}の偏差値を計算しながら、上げるための具体的な方法を解説。${content.lead.slice(0, 60)}…無料・登録不要。`;
  const url = `${SITE_URL}/hensachi/kyoka-betsu/${content.slug}`;
  return {
    title,
    description,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function SubjectHensachiPage({ params }: PageProps) {
  const { subject } = await params;
  const content = getSubjectContent(subject);
  if (!content) notFound();

  const url = `${SITE_URL}/hensachi/kyoka-betsu/${content.slug}`;
  const faqItems = content.faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <WebApplicationSchema
        name={`${content.label}の偏差値計算・上げ方 | My Naishin`}
        description={`${content.label}の偏差値を計算し、上げるための具体的な方法を解説する無料ツール。`}
        url={url}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '教科別の偏差値', url: `${SITE_URL}/hensachi/kyoka-betsu` },
          { name: `${content.label}の上げ方`, url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/kyoka-betsu" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">教科別の偏差値</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{content.label}の上げ方</span>
          </nav>

          {/* Header: パンくず → h1 → 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {content.label}の偏差値を計算＋上げる具体策
            </h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">{content.lead}</p>
          </header>

          {/* Calculator（5教科同時算出。この教科の行に注目） */}
          <HensachiCalculator />

          {/* 教科別の上げ方 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {content.label}の偏差値を上げる具体的な方法
            </h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {content.methods.map((m, i) => (
                <div key={m.title} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">方法{i + 1}：{m.title}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">{m.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA placement="hensachi" />
          </div>

          {/* FAQ */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {content.faqs.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他教科への導線 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">他の教科の偏差値の上げ方</h2>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_CONTENTS.filter((s) => s.slug !== content.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/hensachi/kyoka-betsu/${s.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </section>

          {/* クラスタナビ */}
          <div className="mt-10">
            <HensachiClusterNav current="kyoka-betsu" />
          </div>
        </div>
      </div>
    </>
  );
}
