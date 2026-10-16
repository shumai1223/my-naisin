import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

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
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-age-kata" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              内申点の上げ方
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{content.label}</span>
          </nav>

          {/* 頭: h1 → タグ → 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {content.label}の内申点、今から何をやるべきか
            </h1>
            <div className="mt-3">
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                {content.badge}
              </span>
            </div>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">{content.lead}</p>
          </header>

          {/* まず現状把握 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">まずは今の内申点を計算する</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">対策を始める前に、現在地を数値で把握すると優先順位が決まります。</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
                内申点を計算する（47都道府県）
              </Link>
              <Link href="/dashboard" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors hover:bg-brand-50">
                伸びを記録・グラフ化する
              </Link>
            </div>
          </section>

          {/* 学年別の優先事項 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">
              {content.headline}
            </h2>
            <ol className="mt-2 divide-y divide-slate-200">
              {content.priorities.map((p, i) => (
                <li key={p.title} className="py-4">
                  <h3 className="text-[17px] font-bold text-slate-900">{i + 1}. {p.title}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">{p.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA
              placement="naishin-up"
              heading={`${content.label}の今、対策を続けられるかが分かれ目です`}
              body="やるべきことは分かっても、正しい順番で継続できるかで差がつきます。お子さまに必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* FAQ */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              {content.faqs.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 他学年への導線 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">他の学年の内申点の上げ方</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              {GRADE_CONTENTS.filter((g) => g.slug !== content.slug).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/naishin-age-kata/${g.slug}`}
                    className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    {g.label}
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/naishin-age-kata"
                  className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  4軸の全体解説へ
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
