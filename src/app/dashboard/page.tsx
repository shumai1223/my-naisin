import { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, LineChart } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 print:hidden">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">成績の記録</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <LineChart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">成績の記録ダッシュボード</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              計算した内申点を保存して、<strong>中1→中3の伸び</strong>を推移グラフで見える化。
              <br className="hidden sm:block" />
              学期ごとに記録すれば、そのまま三者面談の資料になります。
            </p>
          </header>

          <DashboardClient />

          {/* よくある質問（可視・FAQと一致） */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {DASHBOARD_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <summary className="cursor-pointer list-none font-bold text-slate-800">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 関連ツール（内部リンク） */}
          <nav className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <h2 className="mb-3 text-sm font-bold text-slate-700">関連ツール</h2>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">内申点を計算する（全国対応）</Link>
              </li>
              <li>
                <Link href="/reverse" className="text-blue-600 hover:underline">志望校から逆算する</Link>
              </li>
              <li>
                <Link href="/hensachi" className="text-blue-600 hover:underline">偏差値を計算する</Link>
              </li>
              <li>
                <Link href="/hyotei-heikin" className="text-blue-600 hover:underline">評定平均を計算する</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
