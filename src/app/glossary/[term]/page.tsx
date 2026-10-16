import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { GLOSSARY_TERMS, getGlossaryTerm, shortTermLabel, buildGlossaryTermFaqs } from '@/lib/glossary-terms';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ term: string }>;
}

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) return {};
  const label = shortTermLabel(t);
  const title = `${label}とは【意味・具体例・都道府県の違い】| My Naishin`;
  const description = `${label}の意味をわかりやすく解説。${t.description.slice(0, 70)}…具体例・注意点・都道府県ごとの違いまで。`;
  const url = `${SITE_URL}/glossary/${t.id}`;
  return {
    title,
    description,
    keywords: [`${label}とは`, `${label} 意味`, `${label} 内申点`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) notFound();

  const url = `${SITE_URL}/glossary/${t.id}`;
  const label = shortTermLabel(t);
  const faqs = buildGlossaryTermFaqs(t);
  const otherTerms = GLOSSARY_TERMS.filter((o) => o.id !== t.id);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '用語辞典', url: `${SITE_URL}/glossary` },
          { name: label, url },
        ]}
      />
      <FAQPageSchema faqItems={faqs} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/glossary" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">用語辞典</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{label}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">{label}とは</h1>
            <p className="mt-2 text-sm text-slate-600">読み方：{t.reading}</p>
          </header>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">意味・定義</h2>
            <p className="text-base leading-[1.8] text-slate-900">{t.description}</p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">具体例</h2>
            <p className="text-base leading-[1.8] text-slate-900">{t.example}</p>
          </section>

          {t.relatedPrefectures && (
            <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-3 text-xl font-bold text-slate-900">都道府県による違い</h2>
              <p className="text-base leading-[1.8] text-slate-900">{t.relatedPrefectures}</p>
            </section>
          )}

          <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
            <h2 className="mb-1 flex items-center gap-1.5 text-base font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意点
            </h2>
            <p className="text-base leading-[1.8] text-amber-900">{t.note}</p>
          </section>

          {t.links && t.links.length > 0 && (
            <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-3 text-xl font-bold text-slate-900">{label}を使って計算する</h2>
              <div className="flex flex-wrap gap-3">
                {t.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center gap-1 rounded border border-brand-700 bg-white px-4 py-2 text-base font-bold text-brand-700 hover:bg-brand-50"
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-10">
            <ParentLeadCTA placement="home" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">他の用語も見る</h2>
            <div className="flex flex-wrap gap-2">
              {otherTerms.map((o) => (
                <Link
                  key={o.id}
                  href={`/glossary/${o.id}`}
                  className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm text-brand-700 hover:bg-brand-50"
                >
                  {shortTermLabel(o)}
                </Link>
              ))}
              <Link
                href="/glossary"
                className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
              >
                用語辞典トップへ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
