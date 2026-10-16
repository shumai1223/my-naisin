import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ExternalLink } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { getAllSourceHistories, getAllCompetitionRateSourceHistories } from '@/lib/source-history';
import { getStaleTop } from '@/lib/freshness-queue';
import { PREFECTURES, REGIONS } from '@/lib/prefectures';

// 47都道府県教育委員会の一次ソース確認履歴を蓄積する∞継続型アーカイブ(X-14)。
// 単年の情報提供でなく「一次ソースをいつ・どう確認したか」の履歴を積み上げることで、
// 教育行政研究者・長期取材の記者にとって代替不可能な資産になることを狙う。
// 過去のスナップショットは捏造せず、src/lib/source-history.tsの設計に従い実際に確認した
// 記録のみを追記していく。

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
  const rateHistories = getAllCompetitionRateSourceHistories();
  const totalRateSources = rateHistories.reduce((sum, h) => sum + h.sources.length, 0);
  const latestDate = histories
    .flatMap((h) => h.history.map((s) => s.date))
    .sort()
    .at(-1);
  // ZZ-9b: 最終確認日が古い県から順に並べた再検証キュー(自己改善メタループの入口)。
  const staleTop = getStaleTop(5);

  // 2026-08-30: 開設直後は「各都道府県1件から始まる」が事実だったが、再検証を重ねた結果
  // 全都道府県が複数件を保持するようになったため、件数のばらつきを固定文言でなく実データから
  // 算出する(reliability.tsxと同じく、数値の陳腐化を構造的に防ぐ)。
  const historyCounts = histories.map((h) => h.history.length);
  const minHistoryCount = Math.min(...historyCounts);
  const maxHistoryCount = Math.max(...historyCounts);
  const FAQS = [
    {
      question: 'このアーカイブは何を記録していますか？',
      answer:
        '47都道府県教育委員会が公表する公立高校入学者選抜実施要項等（一次ソース）を、本サイトがいつ・どのURLで確認したかの記録です。単なる現在の情報提供ではなく、確認履歴そのものを蓄積していく継続更新型のページです。',
    },
    {
      question: '都道府県ごとに記録件数が違うのはなぜですか？',
      answer: `2026年7月の新設時は各都道府県とも「最初の確認記録」1件からのスタートでしたが、その後は制度改定の確認や再検証を行うたびに記録を追加しています。現在は各都道府県${minHistoryCount}〜${maxHistoryCount}件の確認記録があり、再検証の頻度によって件数に差が出ています。年月を重ねるほど、都道府県ごとの変遷を追える資産になります。`,
    },
    {
      question: '記録の正確性はどう担保されていますか？',
      answer:
        '各記録には確認日と一次ソースのURLを明記しています。実際に確認した事実のみを記録し、推測や未確認の情報は一切含みません。',
    },
  ];

  // T-C9: 「何県分を、いつ確認したか」が一目で分かるサマリー表(47県×計算方式確認日×応募状況データ年度数)。
  // 詳細カード(下の県別セクション)は情報が多く俯瞰しにくいため、一覧性を優先した表を別途用意する。
  const summaryRows = PREFECTURES.map((p) => {
    const h = histories.find((x) => x.code === p.code);
    const r = rateHistories.find((x) => x.code === p.code);
    const latestNaishinDate = h ? [...h.history].map((s) => s.date).sort().at(-1) : undefined;
    const fiscalYearCount = r ? new Set(r.sources.map((s) => s.fiscalYear)).size : 0;
    const latestRateDate = r ? [...r.sources].map((s) => s.fetchedAt).sort().at(-1) : undefined;
    return {
      code: p.code,
      name: p.name,
      region: p.region,
      latestNaishinDate,
      fiscalYearCount,
      latestRateDate,
    };
  });

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
        author="ないしんパンダ"
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">一次ソース確認履歴アーカイブ</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              入試一次ソース確認履歴アーカイブ
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              現在{histories.length}都道府県ぶん・計{totalEntries}件の確認記録があります
              （最終更新: {latestDate}）。今後、制度改定の確認・再検証を行うたびに記録を追加していきます。
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              47都道府県教育委員会の公立高校入学者選抜に関する一次ソースを、いつ・どのURLで確認したかを
              記録し続ける継続更新型のページです。
            </p>
          </header>

          {/* T-C9: 47都道府県×確認日×応募状況データ年度数の一覧表（詳細カードより俯瞰しやすい表形式） */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">都道府県別サマリー</h2>
            <p className="mb-4 text-sm text-slate-600">
              「何県分を、いつ確認したか」が一目で分かる一覧です。詳細（出典URL・資料名）は下の県別セクションを参照してください。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th scope="col" className="px-2 py-2 font-bold">都道府県</th>
                    <th scope="col" className="px-2 py-2 font-bold">計算方式の最終確認日</th>
                    <th scope="col" className="py-2 pl-2 pr-6 text-right font-bold">応募状況データ収録年度数</th>
                    <th scope="col" className="px-2 py-2 font-bold">応募状況データの最終確認日</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr key={row.code} className="border-b border-slate-200">
                      <td className="px-2 py-2 font-bold text-slate-900">{row.name}</td>
                      <td className="px-2 py-2 tabular-nums text-slate-900">
                        {row.latestNaishinDate ?? '未確認'}
                      </td>
                      <td className="py-2 pl-2 pr-6 text-right tabular-nums text-slate-900">
                        {row.fiscalYearCount > 0 ? `${row.fiscalYearCount}年度分` : '未収録'}
                      </td>
                      <td className="px-2 py-2 tabular-nums text-slate-900">
                        {row.latestRateDate ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">次に再検証すべき都道府県（最終確認日が古い順）</h2>
            <p className="mb-3 text-sm text-slate-600">
              運営側の再検証キューです。ここに載っている県から順に、教育委員会の一次ソースが最新の内容と
              一致しているかを確認していきます。
            </p>
            <ol className="border-y border-slate-200 text-base text-slate-900">
              {staleTop.map((s, i) => (
                <li key={s.code} className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 last:border-b-0">
                  <span>
                    {i + 1}. {s.name}
                  </span>
                  <span className="text-sm tabular-nums text-slate-600">最終確認: {s.lastVerified}</span>
                </li>
              ))}
            </ol>
          </section>

          {REGIONS.map((region) => {
            const regionHistories = histories.filter((h) => h.region === region);
            if (regionHistories.length === 0) return null;
            return (
              <section key={region} className="mb-10">
                <h2 className="mb-3 text-xl font-bold text-slate-900">{region}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {regionHistories.map((pref) => (
                    <div key={pref.code} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{pref.name}</span>
                        <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                          {pref.history.length}件の記録
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {pref.history.map((snap) => (
                          <li key={`${pref.code}-${snap.date}`} className="text-sm leading-[1.7] text-slate-600">
                            <span className="tabular-nums">{snap.date}</span>
                            {' — '}
                            <a
                              href={snap.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                            >
                              {snap.sourceTitle}
                              <ExternalLink className="ml-0.5 inline h-4 w-4 align-text-bottom" />
                            </a>
                            <span>（{snap.note}）</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mb-10 border-t border-slate-200 pt-8">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              募集人員・応募者数・倍率データの一次ソース確認履歴
            </h2>
            <p className="text-base leading-[1.8] text-slate-900">
              上記は内申点の計算方式に関する確認履歴です。ここからは、各学校の募集人員・応募者数・倍率の
              数値データについて、都道府県教育委員会が公表する年度ごとの資料をいつ・どのURLで確認したかを
              記録します。現在{rateHistories.length}都道府県ぶん・計{totalRateSources}件の確認記録があります。
            </p>
          </section>

          {REGIONS.map((region) => {
            const regionRateHistories = rateHistories.filter((h) => h.region === region);
            if (regionRateHistories.length === 0) return null;
            return (
              <section key={`rate-${region}`} className="mb-10">
                <h3 className="mb-3 text-[17px] font-bold text-slate-900">{region}（倍率データ）</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {regionRateHistories.map((pref) => (
                    <div key={pref.code} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{pref.name}</span>
                        <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                          {pref.sources.length}件の資料
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {pref.sources.map((src) => (
                          <li key={`${pref.code}-${src.fiscalYear}-${src.url}`} className="text-sm leading-[1.7] text-slate-600">
                            <span className="tabular-nums">{src.fiscalYear}</span>
                            {' — '}
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                            >
                              {src.docTitle}
                              <ExternalLink className="ml-0.5 inline h-4 w-4 align-text-bottom" />
                            </a>
                            <span>（確認日: {src.fetchedAt}）</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link
                  href="/naishin-kakusa"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
                >
                  <span className="underline underline-offset-2">内申点格差レポート</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/nyushi-seido-henkou"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
                >
                  <span className="underline underline-offset-2">今年度入試変更点まとめ</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/report/2026"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
                >
                  <span className="underline underline-offset-2">内申点白書2026</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/reliability"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
                >
                  <span className="underline underline-offset-2">データ鮮度・稼働状況サマリー</span>
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
