import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { getPrefectureByCode } from '@/lib/prefectures';
import { getReport2026Row, rankOf, REPORT_2026_ROWS } from '@/lib/report-2026-data';
import { getReport2026DigestEntry, REPORT_2026_DIGEST_CODES } from '@/lib/report-2026-digest-content';
import { SITE_URL } from '@/lib/naishin-dataset';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

// X-30: 執筆済みの都道府県のみプリレンダする（未執筆分はページを生成しない＝見せかけの47ページ量産をしない）。
export function generateStaticParams() {
  return REPORT_2026_DIGEST_CODES.map((code) => ({ prefecture: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture: code } = await params;
  const prefecture = getPrefectureByCode(code);
  const entry = getReport2026DigestEntry(code);
  const row = getReport2026Row(code);
  if (!prefecture || !entry || !row) return {};

  const title = `${prefecture.name}版 内申点白書2026ダイジェスト【1ページ版】 | My Naishin`;
  const description = `${prefecture.name}の内申点制度を全国データと比較したミニレポート。${entry.highlight}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/report/2026/${code}` },
    openGraph: { title, description, url: `${SITE_URL}/report/2026/${code}`, type: 'article' },
  };
}

export default async function Report2026PrefecturePage({ params }: PageProps) {
  const { prefecture: code } = await params;
  const prefecture = getPrefectureByCode(code);
  const entry = getReport2026DigestEntry(code);
  const row = getReport2026Row(code);

  if (!prefecture || !entry || !row) {
    notFound();
  }

  const url = `${SITE_URL}/report/2026/${code}`;
  const practicalRank = rankOf(code, 'practicalSkew');
  const grade3Rank = rankOf(code, 'grade3WeightPct');
  const maxScoreRank = rankOf(code, 'maxScore');

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点白書2026', url: `${SITE_URL}/report/2026` },
          { name: `${prefecture.name}版ダイジェスト`, url },
        ]}
      />
      <ArticleSchema
        title={`${prefecture.name}版 内申点白書2026ダイジェスト`}
        description={entry.highlight}
        datePublished="2026-07-23"
        dateModified="2026-07-23"
        author="ないしんパンダ"
      />
      <FAQPageSchema faqItems={entry.faqs} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/report/2026" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              内申点白書2026
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{prefecture.name}版</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {prefecture.name}版 内申点白書2026ダイジェスト
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              対象年度: 2026年度入試 ／ 出典：
              {row!.sourceUrl ? (
                <a
                  href={row!.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {prefecture.name}教育委員会
                </a>
              ) : (
                '各都道府県教育委員会'
              )}
              {' '}／ 発行日: 2026年7月23日
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">{entry.highlight}</p>
          </header>

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">この県の位置づけ</h2>
            <p className="text-base leading-[1.8] text-slate-900">{entry.context}</p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">全国47都道府県中の順位</h2>
            <dl className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
              <div className="px-3 py-3 md:px-4">
                <dt className="text-xs text-slate-600">実技傾斜倍率</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{row!.practicalSkew}倍</dd>
                <dd className="mt-1 text-xs text-slate-600">全国{practicalRank}位</dd>
              </div>
              <div className="px-3 py-3 md:px-4">
                <dt className="text-xs text-slate-600">中3の重み</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{row!.grade3WeightPct}%</dd>
                <dd className="mt-1 text-xs text-slate-600">全国{grade3Rank}位</dd>
              </div>
              <div className="px-3 py-3 md:px-4">
                <dt className="text-xs text-slate-600">満点</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{row!.maxScore}点</dd>
                <dd className="mt-1 text-xs text-slate-600">全国{maxScoreRank}位</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-600">
              順位は{REPORT_2026_ROWS.length}都道府県中（同値は同順位）。出典：
              {row!.sourceUrl ? (
                <a
                  href={row!.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {prefecture.name}教育委員会
                </a>
              ) : (
                '各都道府県教育委員会'
              )}
            </p>
          </section>

          <section className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/report/2026"
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-base text-slate-900 hover:bg-brand-50"
            >
              白書2026（47都道府県全件版）を見る
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
            </Link>
            <Link
              href={`/${code}/naishin`}
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-base text-slate-900 hover:bg-brand-50"
            >
              {prefecture.name}の内申点を計算する
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
            </Link>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {entry.faqs.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold leading-snug text-slate-900">Q. {f.question}</h3>
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
