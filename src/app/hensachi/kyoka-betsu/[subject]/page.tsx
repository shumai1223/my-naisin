import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { SUBJECT_CONTENTS, getSubjectContent } from '@/lib/hensachi-subject-content';
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/kyoka-betsu" className="hover:text-purple-600">教科別の偏差値</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{content.label}の上げ方</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {content.label}の偏差値を計算＋上げる具体策
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">{content.lead}</p>
          </header>

          {/* Calculator（5教科同時算出。この教科の行に注目） */}
          <HensachiCalculator />

          {/* 教科別の上げ方 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-purple-500 pl-3 text-lg font-bold text-slate-800">
              {content.label}の偏差値を上げる具体的な方法
            </h2>
            <div className="space-y-4">
              {content.methods.map((m, i) => (
                <div key={m.title} className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                  <h3 className="mb-1 text-sm font-bold text-purple-900">方法{i + 1}：{m.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-800">{m.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {content.faqs.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他教科への導線 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">他の教科の偏差値の上げ方</h2>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_CONTENTS.filter((s) => s.slug !== content.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/hensachi/kyoka-betsu/${s.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </section>

          {/* クラスタナビ */}
          <div className="mt-8">
            <HensachiClusterNav current="kyoka-betsu" />
          </div>
        </div>
      </div>
    </>
  );
}
