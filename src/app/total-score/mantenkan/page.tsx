import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ArrowLeftRight, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ScaleScoreCalculator } from '@/components/TotalScore/ScaleScoreCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '得点を1000点満点に換算する計算式は？',
    answer: '「得点 ÷ 元の満点 × 1000」で計算します。例えば500点満点中350点なら、350÷500×1000＝700点です。単純な比例計算なので、どんな満点のテストでも同じ式で1000点満点相当の点数に換算できます。',
  },
  {
    question: 'なぜ入試で「1000点満点に換算」する県があるのですか？',
    answer: '新潟県の公立高校一般選抜では、満点が異なる調査書（内申）135点と学力検査500点を比較・合算しやすくするため、それぞれをいったん1000点満点に換算してから、高校ごとの比率（調査書：学力＝7:3〜3:7）で合算する方式を採用しています。満点の異なる指標を同じ物差しに揃えるために1000点換算が使われる代表例です。',
  },
  {
    question: '1000点満点以外にも換算できますか？',
    answer: 'はい。当ツールは換算後の満点を1000点・500点・100点、または任意の数値に設定できます。模試や実力テストの得点を別の満点基準に揃えたい場合にも使えます。',
  },
  {
    question: '換算した点数で実際の合否は判定できますか？',
    answer: 'このツールは点数の比例換算のみを行う汎用計算機で、特定の都道府県の合否判定を再現するものではありません。都道府県ごとの総合得点の実際の計算方法は都道府県別 総合得点・合否の仕組み一覧で確認してください。',
  },
];

export const metadata: Metadata = {
  title: '得点を1000点満点に換算する計算機【任意の満点対応】| My Naishin',
  description: '内申点・学力検査・模試などの得点を、1000点満点（または任意の満点）に無料で換算。得点÷元の満点×換算後の満点の比例計算で、入力するだけで即結果表示。登録不要。',
  keywords: ['1000点換算', '1000点満点 換算', '得点 1000点 換算 計算', '点数 換算 計算機'],
  alternates: { canonical: `${SITE_URL}/total-score/mantenkan` },
  openGraph: {
    title: '得点を1000点満点に換算する計算機【任意の満点対応】| My Naishin',
    description: '内申点・学力検査・模試などの得点を、1000点満点（または任意の満点）に無料で換算する計算機。',
    url: `${SITE_URL}/total-score/mantenkan`,
    type: 'article',
  },
};

export default function TotalScoreMantenkanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '都道府県別 総合得点の仕組み', url: `${SITE_URL}/total-score` },
          { name: '1000点満点換算', url: `${SITE_URL}/total-score/mantenkan` },
        ]}
      />
      <WebApplicationSchema
        name="得点を1000点満点に換算する計算機"
        description="内申点・学力検査・模試などの得点を1000点満点（または任意の満点）に換算する無料ツール"
        url={`${SITE_URL}/total-score/mantenkan`}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/total-score" className="hover:text-blue-600">都道府県別 総合得点の仕組み</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">1000点満点換算</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <ArrowLeftRight className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">得点を1000点満点に換算する計算機</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              内申点・学力検査・模試など、<strong>満点がバラバラな得点</strong>を1000点満点（または任意の満点）にそろえて比較できます。
            </p>
          </header>

          <ScaleScoreCalculator />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">なぜ「1000点満点」に換算するの？</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              満点が違う得点どうしは、そのままでは大小を比べられません。そこで「得点 ÷ 満点 × 1000」の比例計算で、
              どんな満点の得点も同じ1000点満点の物差しに揃えます。実際に新潟県の公立高校一般選抜では、
              満点135点の調査書（内申）と満点500点の学力検査を、それぞれ1000点満点に換算してから
              高校ごとの比率で合算する方式を採用しています。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/total-score" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                都道府県別 総合得点の仕組みを見る
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi/mantenkan" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                満点変換つき偏差値計算はこちら
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
        </div>
      </div>
    </>
  );
}
