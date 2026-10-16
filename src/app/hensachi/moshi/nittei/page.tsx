import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ExternalLink, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { MOCK_EXAMS } from '@/lib/mock-exam-data';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/moshi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">模試の偏差値の見方</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">主要模試 公式日程一覧</span>
          </nav>

          {/* Header: パンくず → h1 → メタ行（年度・出典）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">主要模試 公式日程一覧</h1>
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <li>2026年度</li>
              <li>出典：各社の公式サイト</li>
            </ul>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の実施日程を、各社の公式サイトで実在確認できた範囲でまとめました。
            </p>
          </header>

          <div className="mb-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-[1.8]">
              日程は申込締切や会場都合で更新される場合があります。実際の申込前には必ず各社の公式サイトで最新情報をご確認ください。
              公式サイトで日付が確認できなかった回は掲載せず、「公式サイトで確認」とご案内しています。
            </p>
          </div>

          <section className="space-y-4">
            {MOCK_EXAMS.map((exam) => (
              <div key={exam.key} className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{exam.name}</h2>
                  <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                    {exam.regions.join('・')}
                  </span>
                </div>

                {exam.scheduleRounds && exam.scheduleRounds.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead>
                        <tr className="border-b border-slate-900 text-xs text-slate-600">
                          <th scope="col" className="py-2 pr-4 text-left font-bold">回</th>
                          <th scope="col" className="py-2 text-left font-bold">実施日</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exam.scheduleRounds.map((r) => (
                          <tr key={r.round} className="border-b border-slate-200 last:border-0">
                            <td className="py-2 pr-4 text-slate-900">{r.round}</td>
                            <td className="py-2 tabular-nums text-slate-900">{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {exam.scheduleNote && (
                  <p className="mt-3 text-sm leading-[1.8] text-slate-600">{exam.scheduleNote}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600">実在確認日: {exam.scheduleVerifiedDate}</span>
                  <a
                    href={exam.scheduleSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    公式サイトで確認
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">あわせて確認</h2>
            <div className="divide-y divide-slate-200">
              <Link href="/hensachi/moshi/ichiran" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">主要な地域模試ガイド（運営会社・対象地域）</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/hensachi/moshi" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">模試の偏差値の見方（母集団・推移の解説）</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/juken-schedule" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">入試全体のスケジュールを見る</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/hensachi" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">偏差値を計算する（無料）</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA placement="hensachi" />
          </div>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <HensachiClusterNav current="moshi" />
          </div>
        </div>
      </div>
    </>
  );
}
