import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Calendar, ExternalLink, ChevronRightSquare, AlertTriangle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { MOCK_EXAMS } from '@/lib/mock-exam-data';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '模試の日程はいつ決まりますか？',
    answer: '模試の実施日程は運営会社が年度ごとに発表します。多くの模試は前年度末〜新年度はじめ（3〜4月頃）に年間予定を公表し、その後、各回の申込開始時期に合わせて詳細が更新されます。最新の日程は必ず各社の公式サイトでご確認ください。',
  },
  {
    question: 'このページの日程は確定情報ですか？',
    answer: 'このページに掲載している日程は、各社の公式サイトで実在確認できたものを掲載日時点の情報として記載しています。ただし申込締切や会場変更等で日程が更新される場合があるため、実際の申込前には必ず運営会社の公式サイトで最新情報をご確認ください。',
  },
  {
    question: '模試の日程がこのページに載っていない場合は？',
    answer: '公式サイトが日程一覧をJavaScript描画のみで公開している等、機械的に取得できなかった場合は、日程を推測せずに「公式サイトでご確認ください」と案内しています（不確かな日付を掲載しないため）。該当の模試は公式サイトへのリンクから直接ご確認ください。',
  },
];

export const metadata: Metadata = {
  title: '主要模試 公式日程一覧【Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研】2026年度 | My Naishin',
  description: 'Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の公式サイトで実在確認した2026年度の実施日程をまとめて掲載。すべて各社公式サイトの一次情報に基づき、断定できない日程は「公式サイトで確認」と明記しています。',
  keywords: ['模試 日程 2026', 'Vもぎ 日程', 'Wもぎ 日程', '北辰テスト 日程', '五ツ木模試 日程', '新教研 日程'],
  alternates: { canonical: `${SITE_URL}/hensachi/moshi/nittei` },
  openGraph: {
    title: '主要模試 公式日程一覧【2026年度】| My Naishin',
    description: '主要な地域模試の公式サイトで実在確認した実施日程をまとめて掲載。',
    url: `${SITE_URL}/hensachi/moshi/nittei`,
    type: 'article',
  },
};

export default function MockExamScheduleDbPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '模試の偏差値の見方', url: `${SITE_URL}/hensachi/moshi` },
          { name: '主要模試 公式日程一覧', url: `${SITE_URL}/hensachi/moshi/nittei` },
        ]}
      />
      <DatasetSchema
        name="主要地域模試 公式実施日程データ"
        description="Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の公式サイトで実在確認した実施日程の一覧"
        url={`${SITE_URL}/hensachi/moshi/nittei`}
        variableMeasured={['模試名', '実施回', '実施日', '運営会社']}
        dateModified="2026-07-17"
        keywords={['模試', '日程', '高校受験']}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/moshi" className="hover:text-purple-600">模試の偏差値の見方</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">主要模試 公式日程一覧</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <Calendar className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">主要模試 公式日程一覧</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の実施日程を、各社の公式サイトで実在確認できた範囲でまとめました。
            </p>
          </header>

          <div className="mb-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-800">
              日程は申込締切や会場都合で更新される場合があります。実際の申込前には必ず各社の公式サイトで最新情報をご確認ください。
              公式サイトで日付が確認できなかった回は掲載せず、「公式サイトで確認」とご案内しています。
            </p>
          </div>

          <section className="space-y-5">
            {MOCK_EXAMS.map((exam) => (
              <div key={exam.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{exam.name}</h2>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 ring-1 ring-purple-100">
                    {exam.regions.join('・')}
                  </span>
                </div>

                {exam.scheduleRounds && exam.scheduleRounds.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs text-slate-500">
                          <th className="py-2 pr-4">回</th>
                          <th className="py-2">実施日</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exam.scheduleRounds.map((r) => (
                          <tr key={r.round} className="border-b border-slate-100 last:border-0">
                            <td className="py-2 pr-4 font-medium text-slate-800">{r.round}</td>
                            <td className="py-2 text-slate-600">{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {exam.scheduleNote && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{exam.scheduleNote}</p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400">実在確認日: {exam.scheduleVerifiedDate}</span>
                  <a
                    href={exam.scheduleSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline"
                  >
                    公式サイトで確認
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi/moshi/ichiran" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                主要な地域模試ガイド（運営会社・対象地域）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi/moshi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                模試の偏差値の見方（母集団・推移の解説）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/juken-schedule" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                入試全体のスケジュールを見る
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                偏差値を計算する（無料）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

          <div className="mt-8">
            <HensachiClusterNav current="moshi" />
          </div>
        </div>
      </div>
    </>
  );
}
