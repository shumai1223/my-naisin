import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, BookMarked, ChevronRightSquare } from 'lucide-react';

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
            <Link href="/report/2026" className="hover:text-indigo-600">
              内申点白書2026
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}版</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-900 text-white shadow-xl">
              <BookMarked className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {prefecture.name}版 内申点白書2026ダイジェスト
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">{entry.highlight}</p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">この県の位置づけ</h2>
            <p className="text-sm leading-relaxed text-slate-600">{entry.context}</p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">全国47都道府県中の順位</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-[11px] font-bold text-slate-500">実技傾斜倍率</div>
                <div className="mt-1 text-xl font-black text-indigo-700">{row!.practicalSkew}倍</div>
                <div className="mt-1 text-[11px] text-slate-400">全国{practicalRank}位</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-[11px] font-bold text-slate-500">中3の重み</div>
                <div className="mt-1 text-xl font-black text-indigo-700">{row!.grade3WeightPct}%</div>
                <div className="mt-1 text-[11px] text-slate-400">全国{grade3Rank}位</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-[11px] font-bold text-slate-500">満点</div>
                <div className="mt-1 text-xl font-black text-indigo-700">{row!.maxScore}点</div>
                <div className="mt-1 text-[11px] text-slate-400">全国{maxScoreRank}位</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              順位は{REPORT_2026_ROWS.length}都道府県中（同値は同順位）。出典：
              {row!.sourceUrl ? (
                <a href={row!.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-indigo-600 underline">
                  {prefecture.name}教育委員会
                </a>
              ) : (
                '各都道府県教育委員会'
              )}
            </p>
          </section>

          <section className="mb-8 grid gap-2 sm:grid-cols-2">
            <Link
              href="/report/2026"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              白書2026（47都道府県全件版）を見る
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
            <Link
              href={`/${code}/naishin`}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              {prefecture.name}の内申点を計算する
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
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
