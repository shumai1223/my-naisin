import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Archive, ExternalLink } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { getAllSourceHistories } from '@/lib/source-history';
import { REGIONS } from '@/lib/prefectures';

// 47都道府県教育委員会の一次ソース確認履歴を蓄積する∞継続型アーカイブ(X-14)。
// 単年の情報提供でなく「一次ソースをいつ・どう確認したか」の履歴を積み上げることで、
// 教育行政研究者・長期取材の記者にとって代替不可能な資産になることを狙う。
// 過去のスナップショットは捏造せず、src/lib/source-history.tsの設計に従い実際に確認した
// 記録のみを追記していく。

const FAQS = [
  {
    question: 'このアーカイブは何を記録していますか？',
    answer:
      '47都道府県教育委員会が公表する公立高校入学者選抜実施要項等（一次ソース）を、本サイトがいつ・どのURLで確認したかの記録です。単なる現在の情報提供ではなく、確認履歴そのものを蓄積していく継続更新型のページです。',
  },
  {
    question: '各都道府県が1件しか記録されていないのはなぜですか？',
    answer:
      'このアーカイブは2026年7月に新設したばかりのため、各都道府県とも「最初の確認記録」1件から始まっています。今後、制度改定の確認や再検証を行うたびに記録を追加していきます。年月を重ねるほど、都道府県ごとの変遷を追える資産になります。',
  },
  {
    question: '記録の正確性はどう担保されていますか？',
    answer:
      '各記録には確認日と一次ソースのURLを明記しています。実際に確認した事実のみを記録し、推測や未確認の情報は一切含みません。',
  },
];

export const metadata: Metadata = {
  title: '47都道府県 入試一次ソース確認履歴アーカイブ | My Naishin',
  description:
    '各都道府県教育委員会が公表する公立高校入学者選抜実施要項等の一次ソースを、本サイトがいつ確認したかを記録する継続更新型アーカイブです。',
  keywords: ['入試 一次ソース', '教育委員会 選抜要項', '内申点 出典', '高校入試 制度 履歴'],
  alternates: { canonical: `${SITE_URL}/genten-archive` },
  openGraph: {
    title: '47都道府県 入試一次ソース確認履歴アーカイブ | My Naishin',
    description: '教育委員会の一次ソースをいつ確認したかを記録し続ける継続更新型アーカイブ。',
    url: `${SITE_URL}/genten-archive`,
    type: 'website',
  },
};

export default function GentenArchivePage() {
  const histories = getAllSourceHistories();
  const totalEntries = histories.reduce((sum, h) => sum + h.history.length, 0);
  const latestDate = histories
    .flatMap((h) => h.history.map((s) => s.date))
    .sort()
    .at(-1);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '一次ソース確認履歴アーカイブ', url: `${SITE_URL}/genten-archive` },
        ]}
      />
      <ArticleSchema
        title="47都道府県 入試一次ソース確認履歴アーカイブ"
        description="各都道府県教育委員会の一次ソースをいつ確認したかを記録する継続更新型アーカイブ"
        datePublished="2026-07-23"
        dateModified={latestDate ?? '2026-07-23'}
        author="しゅうまい"
      />
      <DatasetSchema
        name="47都道府県 入試一次ソース確認履歴データセット"
        description="各都道府県教育委員会が公表する公立高校入学者選抜実施要項等の一次ソースURLと、本サイトがそれを確認した日付の記録"
        url={`${SITE_URL}/genten-archive`}
        variableMeasured={['都道府県', '一次ソースURL', '確認日']}
        dateModified={latestDate ?? '2026-07-23'}
        keywords={['入試制度', '一次ソース', '教育委員会', '内申点']}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">一次ソース確認履歴アーカイブ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-xl">
              <Archive className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              入試一次ソース確認履歴アーカイブ
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              47都道府県教育委員会の公立高校入学者選抜に関する一次ソースを、いつ・どのURLで確認したかを
              記録し続ける継続更新型のページです。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
            <p className="text-sm leading-relaxed text-slate-700">
              現在{histories.length}都道府県ぶん・計{totalEntries}件の確認記録があります
              （最終更新: {latestDate}）。今後、制度改定の確認・再検証を行うたびに記録を追加していきます。
            </p>
          </section>

          {REGIONS.map((region) => {
            const regionHistories = histories.filter((h) => h.region === region);
            if (regionHistories.length === 0) return null;
            return (
              <section key={region} className="mb-8">
                <h2 className="mb-3 text-lg font-bold text-slate-800">{region}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {regionHistories.map((pref) => (
                    <div key={pref.code} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{pref.name}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                          {pref.history.length}件の記録
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {pref.history.map((snap) => (
                          <li key={`${pref.code}-${snap.date}`} className="text-xs leading-relaxed text-slate-500">
                            <span className="font-mono text-slate-400">{snap.date}</span>
                            {' — '}
                            <a
                              href={snap.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {snap.sourceTitle}
                              <ExternalLink className="ml-0.5 inline h-3 w-3" />
                            </a>
                            <span className="text-slate-400">（{snap.note}）</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/naishin-kakusa"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                内申点格差レポート
              </Link>
              <Link
                href="/nyushi-seido-henkou"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                今年度入試変更点まとめ
              </Link>
              <Link
                href="/report/2026"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                内申点白書2026
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
