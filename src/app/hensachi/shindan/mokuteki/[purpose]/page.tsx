import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ShindanQuiz } from '@/components/Hensachi/ShindanQuiz';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { SHINDAN_PURPOSE_CONTENTS, getShindanPurposeContent } from '@/lib/shindan-purpose-content';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ purpose: string }>;
}

export function generateStaticParams() {
  return SHINDAN_PURPOSE_CONTENTS.map((p) => ({ purpose: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { purpose } = await params;
  const content = getShindanPurposeContent(purpose);
  if (!content) return {};
  const title = `${content.label}のための偏差値診断【点数不要・5問】| My Naishin`;
  const description = `${content.label}に悩んでいる方向けの偏差値診断。${content.lead.slice(0, 60)}…点数・平均点が分からなくても、5つの質問だけで診断できます。`;
  const url = `${SITE_URL}/hensachi/shindan/mokuteki/${content.slug}`;
  return {
    title,
    description,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function PurposeShindanPage({ params }: PageProps) {
  const { purpose } = await params;
  const content = getShindanPurposeContent(purpose);
  if (!content) notFound();

  const url = `${SITE_URL}/hensachi/shindan/mokuteki/${content.slug}`;
  const faqItems = content.faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '偏差値診断', url: `${SITE_URL}/hensachi/shindan` },
          { name: `${content.label}のための診断`, url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-blue-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/shindan" className="hover:text-blue-600">偏差値診断</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{content.label}</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
              <Sparkles className="h-3.5 w-3.5" />
              {content.badge}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {content.label}のための偏差値診断
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">{content.lead}</p>
          </header>

          {/* 診断ツール本体（Q5をあらかじめ選択済みで表示） */}
          <ShindanQuiz defaultConcern={content.concern} />

          {/* この目的ならではの使い方 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-purple-500 pl-3 text-lg font-bold text-slate-800">
              {content.label}で診断結果をどう使うか
            </h2>
            <div className="space-y-4">
              {content.useCase.map((u, i) => (
                <div key={u.title} className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                  <h3 className="mb-1 text-sm font-bold text-purple-900">{i + 1}. {u.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-800">{u.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 偏差値クラスタのハブ */}
          <div className="mt-8">
            <HensachiClusterNav current="shindan" />
          </div>

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {content.faqs.map((f) => (
                <div key={f.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他の目的への導線 */}
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">他の目的の偏差値診断</h2>
            <div className="flex flex-wrap gap-2">
              {SHINDAN_PURPOSE_CONTENTS.filter((p) => p.slug !== content.slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/hensachi/shindan/mokuteki/${p.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                >
                  {p.label}
                </Link>
              ))}
              <Link
                href="/hensachi/shindan"
                className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100"
              >
                目的を選ばず診断する
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
