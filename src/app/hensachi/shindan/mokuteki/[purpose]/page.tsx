import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ShindanResultFlow } from '@/components/Hensachi/ShindanResultFlow';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { SHINDAN_PURPOSE_CONTENTS, getShindanPurposeContent } from '@/lib/shindan-purpose-content';
import { SHINDAN_GRADE_CONTENTS } from '@/lib/shindan-grade-content';
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/shindan" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値診断</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{content.label}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {content.label}のための偏差値診断
            </h1>
            <p className="mt-3 text-sm text-slate-600">{content.badge}</p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">{content.lead}</p>
          </header>

          {/* 診断ツール本体（Q5をあらかじめ選択済みで表示） */}
          <ShindanResultFlow defaultConcern={content.concern} />

          {/* この目的ならではの使い方 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {content.label}で診断結果をどう使うか
            </h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {content.useCase.map((u, i) => (
                <div key={u.title} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">{i + 1}. {u.title}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">{u.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 偏差値クラスタのハブ */}
          <div className="mt-10">
            <HensachiClusterNav current="shindan" />
          </div>

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-3">
              {content.faqs.map((f) => (
                <div key={f.question} className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他の目的への導線 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-[17px] font-bold text-slate-900">他の目的の偏差値診断</h2>
            <div className="flex flex-wrap gap-2">
              {SHINDAN_PURPOSE_CONTENTS.filter((p) => p.slug !== content.slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/hensachi/shindan/mokuteki/${p.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  {p.label}
                </Link>
              ))}
              <Link
                href="/hensachi/shindan"
                className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                目的を選ばず診断する
              </Link>
            </div>
          </section>

          {/* 学年別診断への導線（S-2⑤：目的軸↔学年軸のクロスリンク） */}
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-[17px] font-bold text-slate-900">学年で診断したい場合はこちら</h2>
            <div className="flex flex-wrap gap-2">
              {SHINDAN_GRADE_CONTENTS.map((g) => (
                <Link
                  key={g.slug}
                  href={`/hensachi/shindan/${g.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  {g.label}向け診断
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
