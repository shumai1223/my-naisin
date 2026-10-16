import { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DashboardClient } from '@/components/Dashboard/DashboardClient';

export const metadata: Metadata = {
  title: '内申点の推移グラフ｜成績の記録ダッシュボード（中1→中3トラッキング）| My Naishin',
  description:
    '計算した内申点をブラウザに保存し、中1→中3の伸びを推移グラフで自動可視化。学期ごとに記録すれば、三者面談用のPDF・印刷資料にもそのまま使えます。志望校の目標ラインまでの差も一目で確認。登録不要・無料、データは端末内にのみ保存。',
  alternates: {
    canonical: 'https://my-naishin.com/dashboard',
  },
  openGraph: {
    title: '内申点の推移グラフ｜成績の記録ダッシュボード | My Naishin',
    description:
      '計算した内申点を保存して、中1→中3の伸びを推移グラフで可視化。三者面談用の資料にも使えます。',
    url: 'https://my-naishin.com/dashboard',
    type: 'website',
  },
};

const DASHBOARD_FAQS = [
  {
    question: '記録したデータはどこに保存されますか？',
    answer:
      'すべてお使いのブラウザ（localStorage）内にのみ保存され、サーバーには送信されません。会員登録も不要です。ブラウザの履歴を削除すると記録も消えるため、大事な記録は三者面談用PDFとして書き出しておくと安心です。',
  },
  {
    question: '中1→中3の推移はどう記録しますか？',
    answer:
      '内申点を計算して保存するたびに記録が増えます。各記録に「中1・1学期」などの学期ラベルを付けると、「学期順」表示で中1から中3への伸びが学期順のグラフになります。',
  },
  {
    question: '三者面談に使えますか？',
    answer:
      'はい。「三者面談用に印刷／PDF保存」ボタンから、推移グラフと記録一覧をそのまま印刷・PDF化できます。志望校の目標ラインまでの差も載るため、面談での共有資料に向いています。',
  },
  {
    question: '複数の都道府県で計算した記録も比較できますか？',
    answer:
      '満点の異なる都道府県が混在している場合は、比較できるよう達成率（%）でグラフ化します。単一の都道府県だけの記録なら、内申点の実数で推移を表示します。',
  },
];

export default function DashboardPage() {
  return (
    <>
      <WebApplicationSchema
        name="内申点 推移グラフ・成績記録ダッシュボード | My Naishin"
        description="計算した内申点を保存し、中1→中3の伸びを推移グラフで可視化。三者面談用PDFにも対応。"
        url="https://my-naishin.com/dashboard"
        featureList={[
          '計算した内申点をブラウザに保存',
          '中1→中3の推移を折れ線グラフで可視化',
          '学期ごとの記録と学期順トラッキング',
          '志望校の目標ラインまでの差を表示',
          '三者面談用のPDF・印刷出力',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '成績の記録ダッシュボード', url: 'https://my-naishin.com/dashboard' },
        ]}
      />
      <FAQPageSchema faqItems={DASHBOARD_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600 print:hidden">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">成績の記録</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">成績の記録ダッシュボード</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              計算した内申点を保存して、<strong>中1→中3の伸び</strong>を推移グラフで見える化。
              <br className="hidden sm:block" />
              学期ごとに記録すれば、そのまま三者面談の資料になります。
            </p>
          </header>

          <DashboardClient />

          {/* よくある質問（可視・FAQと一致） */}
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-4 md:px-5">
              {DASHBOARD_FAQS.map((faq) => (
                <details key={faq.question}>
                  <summary className="cursor-pointer py-3 text-base font-bold text-slate-900">
                    {faq.question}
                  </summary>
                  <p className="pb-4 text-base leading-[1.8] text-slate-900">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 関連ツール（内部リンク） */}
          <nav className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6 print:hidden">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">内申点を計算する（全国対応）</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">志望校から逆算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">偏差値を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">評定平均を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
