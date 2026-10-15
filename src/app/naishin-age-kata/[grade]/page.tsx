import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, Calculator, TrendingUp } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { GRADE_CONTENTS, getGradeContent } from '@/lib/naishin-grade-content';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ grade: string }>;
}

export function generateStaticParams() {
  return GRADE_CONTENTS.map((g) => ({ grade: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade } = await params;
  const content = getGradeContent(grade);
  if (!content) return {};
  const title = `${content.label}の内申点の上げ方【中学生】今からやるべきこと | My Naishin`;
  const description = `${content.label}向けに、内申点を上げるために今やるべきことを具体的に解説。${content.lead.slice(0, 60)}…無料・登録不要で内申点を計算できます。`;
  const url = `${SITE_URL}/naishin-age-kata/${content.slug}`;
  return {
    title,
    description,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function GradeNaishinAgeKataPage({ params }: PageProps) {
  const { grade } = await params;
  const content = getGradeContent(grade);
  if (!content) notFound();

  const url = `${SITE_URL}/naishin-age-kata/${content.slug}`;
  const faqItems = content.faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点の上げ方', url: `${SITE_URL}/naishin-age-kata` },
          { name: `${content.label}の内申点の上げ方`, url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-age-kata" className="hover:text-brand-600">内申点の上げ方</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{content.label}</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
              {content.badge}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {content.label}の内申点、今から何をやるべきか
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">{content.lead}</p>
          </header>

          {/* まず現状把握 */}
          <section className="mb-8 rounded-lg border-2 border-brand-200 bg-brand-50 p-6 text-center">
            <h2 className="mb-2 text-lg font-bold text-slate-800">まずは今の内申点を計算する</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">対策を始める前に、現在地を数値で把握すると優先順位が決まります。</p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-700">
                <Calculator className="h-4 w-4" />内申点を計算する（47都道府県）
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-50">
                <TrendingUp className="h-4 w-4" />伸びを記録・グラフ化する
              </Link>
            </div>
          </section>

          {/* 学年別の優先事項 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 border-l-4 border-brand-500 pl-3 text-lg font-bold text-slate-800">
              {content.headline}
            </h2>
            <div className="space-y-4">
              {content.priorities.map((p, i) => (
                <div key={p.title} className="rounded-lg border border-brand-100 bg-brand-50/50 p-4">
                  <h3 className="mb-1 text-sm font-bold text-brand-900">{i + 1}. {p.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-800">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-8">
            <ParentLeadCTA
              placement="naishin-up"
              heading={`${content.label}の今、対策を続けられるかが分かれ目です`}
              body="やるべきことは分かっても、正しい順番で継続できるかで差がつきます。お子さまに必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* FAQ */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
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

          {/* 他学年への導線 */}
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">他の学年の内申点の上げ方</h2>
            <div className="flex flex-wrap gap-2">
              {GRADE_CONTENTS.filter((g) => g.slug !== content.slug).map((g) => (
                <Link
                  key={g.slug}
                  href={`/naishin-age-kata/${g.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  {g.label}
                </Link>
              ))}
              <Link
                href="/naishin-age-kata"
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
              >
                4軸の全体解説へ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
