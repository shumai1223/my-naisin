import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { getPrefectureByCode } from '@/lib/prefectures';
import { getNaishinOmomiEntry, NAISHIN_OMOMI_CODES } from '@/lib/naishin-omomi-content';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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
        author="ないしんパンダ"
      />
      <FAQPageSchema faqItems={entry.faqs} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-kakusa" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              内申点格差レポート
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{prefecture.name}の内申の重み</span>
          </nav>

          {/* 頭: h1 → メタ行（出典・最終確認）→ 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {prefecture.name}の内申点、全国的に見て特殊?
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {prefecture.sourceUrl && (
                <span>
                  計算方式の出典：
                  <a
                    href={prefecture.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {prefecture.sourceTitle ?? `${prefecture.name}教育委員会`}
                  </a>
                </span>
              )}
              {prefecture.lastVerified && <span>最終確認 {prefecture.lastVerified}</span>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">{entry.angle}</p>
          </header>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">実技教科の重みの全国的な位置づけ</h2>
            <p className="text-base leading-[1.8] text-slate-900">{entry.skewPosition}</p>
          </section>

          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">学年の重み付けと近隣県との違い</h2>
            <p className="text-base leading-[1.8] text-slate-900">{entry.gradeComparison}</p>
          </section>

          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">満点の数字だけでは分からないこと</h2>
            <p className="text-base leading-[1.8] text-slate-900">{entry.maxScoreNote}</p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              <li>
                <Link
                  href={`/${code}/naishin`}
                  className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  {prefecture.name}の内申点を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/naishin-kakusa"
                  className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  47都道府県 内申点格差レポート（全体版）
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA prefectureCode={prefecture.code} placement="prefecture" />
          </div>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200">
              {entry.faqs.map((f) => (
                <div key={f.question} className="py-4 last:pb-0">
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
