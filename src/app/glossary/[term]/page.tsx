import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, BookOpen, HelpCircle, AlertTriangle, MapPin, Lightbulb } from '@/components/icons';

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
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/glossary" className="hover:text-brand-600">用語辞典</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{label}</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-amber-500 text-white">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{label}とは</h1>
            <p className="mx-auto mt-2 text-sm text-slate-400">読み方：{t.reading}</p>
          </header>

          <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-amber-500" />
              意味・定義
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">{t.description}</p>
          </section>

          <section className="mb-6 rounded-lg border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Lightbulb className="h-5 w-5 text-brand-600" />
              具体例
            </h2>
            <p className="text-sm leading-relaxed text-brand-800">{t.example}</p>
          </section>

          {t.relatedPrefectures && (
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                <MapPin className="h-5 w-5 text-brand-500" />
                都道府県による違い
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">{t.relatedPrefectures}</p>
            </section>
          )}

          <section className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <h2 className="mb-1 text-sm font-bold text-amber-900">注意点</h2>
                <p className="text-sm leading-relaxed text-amber-800">{t.note}</p>
              </div>
            </div>
          </section>

          {t.links && t.links.length > 0 && (
            <section className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h2 className="mb-3 text-sm font-bold text-slate-700">{label}を使って計算する</h2>
              <div className="flex flex-wrap gap-2">
                {t.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {link.label}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              よくある質問
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-8">
            <ParentLeadCTA placement="home" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">他の用語も見る</h2>
            <div className="flex flex-wrap gap-2">
              {otherTerms.map((o) => (
                <Link
                  key={o.id}
                  href={`/glossary/${o.id}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                >
                  {shortTermLabel(o)}
                </Link>
              ))}
              <Link
                href="/glossary"
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
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
