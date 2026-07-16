import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Scale, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { getPrefectureByCode } from '@/lib/prefectures';
import { getNaishinOmomiEntry, NAISHIN_OMOMI_CODES } from '@/lib/naishin-omomi-content';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

// 執筆済みの都道府県のみプリレンダする（未執筆分はページを生成しない＝見せかけの47ページ量産をしない）。
export function generateStaticParams() {
  return NAISHIN_OMOMI_CODES.map((code) => ({ prefecture: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture: code } = await params;
  const prefecture = getPrefectureByCode(code);
  const entry = getNaishinOmomiEntry(code);
  if (!prefecture || !entry) return {};

  const title = `${prefecture.name}の内申点の重みは全国的に見て特殊?【県別分析】 | My Naishin`;
  const description = `${prefecture.name}の内申点計算方式を、実技傾斜・学年比重の全国データと比較して分析。${entry.angle}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${code}/naishin-omomi` },
    openGraph: { title, description, url: `${SITE_URL}/${code}/naishin-omomi`, type: 'article' },
  };
}

export default async function NaishinOmomiPage({ params }: PageProps) {
  const { prefecture: code } = await params;
  const prefecture = getPrefectureByCode(code);
  const entry = getNaishinOmomiEntry(code);

  if (!prefecture || !entry) {
    notFound();
  }

  const url = `${SITE_URL}/${code}/naishin-omomi`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点格差レポート', url: `${SITE_URL}/naishin-kakusa` },
          { name: `${prefecture.name}の内申の重み`, url },
        ]}
      />
      <ArticleSchema
        title={`${prefecture.name}の内申点の重みは全国的に見て特殊?`}
        description={entry.angle}
        datePublished="2026-07-17"
        dateModified="2026-07-17"
        author="My Naishin"
      />
      <FAQPageSchema faqItems={entry.faqs} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-kakusa" className="hover:text-indigo-600">内申点格差レポート</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}の内申の重み</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {prefecture.name}の内申点、全国的に見て特殊?
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">{entry.angle}</p>
          </header>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">実技教科の重みの全国的な位置づけ</h2>
            <p className="text-sm leading-relaxed text-slate-600">{entry.skewPosition}</p>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">学年の重み付けと近隣県との違い</h2>
            <p className="text-sm leading-relaxed text-slate-600">{entry.gradeComparison}</p>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-amber-50/50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">満点の数字だけでは分からないこと</h2>
            <p className="text-sm leading-relaxed text-slate-700">{entry.maxScoreNote}</p>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href={`/${code}/naishin`}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                {prefecture.name}の内申点を計算する
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/naishin-kakusa"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                47都道府県 内申点格差レポート（全体版）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {entry.faqs.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
