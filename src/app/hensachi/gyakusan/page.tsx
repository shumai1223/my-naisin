import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Undo2, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { HensachiGyakusanCalculator } from '@/components/Hensachi/HensachiGyakusanCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '目標偏差値まで「あと何点」はどう計算しますか？',
    answer: '偏差値の式（偏差値 = 50 + 10 ×（点数 − 平均点）÷ 標準偏差）を点数について解くと、「必要な点数 = 平均点 + 標準偏差 ×（目標偏差値 − 50）÷ 10」になります。今の得点との差が「あと何点」です。',
  },
  {
    question: '過去問の得点から偏差値は出せますか？',
    answer: 'はい。過去問や模試の得点・平均点・標準偏差が分かれば、通常の偏差値の計算式でそのまま算出できます。平均点・標準偏差が分からない場合は、一般的な定期テストの目安値（平均50・標準偏差15）で概算します。',
  },
  {
    question: '目標偏差値はどうやって決めればいいですか？',
    answer: '志望校が目安としている偏差値帯を目標にするのが一般的です。偏差値から届く高校レベルを確認したい場合は偏差値→志望校レンジ逆引きが使えます。',
  },
  {
    question: '「あと何点」が大きい場合、何を優先すればいいですか？',
    answer: '差が大きいほど、苦手教科の底上げや基礎の反復が効率的です。偏差値の上げ方の考え方は偏差値の出し方・上げ方ページで解説しています。',
  },
];

export const metadata: Metadata = {
  title: '目標偏差値まであと何点？逆算計算機【過去問・模試対応】| My Naishin',
  description: '過去問・模試の得点から今の偏差値を計算し、目標の偏差値に必要な点数を逆算。「あと何点」が一目でわかる無料ツール。平均点・標準偏差が分からなくても目安値で概算。登録不要。',
  keywords: ['偏差値 逆算', '目標偏差値 あと何点', '過去問 点数 偏差値', '偏差値 必要点数 計算'],
  alternates: { canonical: `${SITE_URL}/hensachi/gyakusan` },
  openGraph: {
    title: '目標偏差値まであと何点？逆算計算機【過去問・模試対応】| My Naishin',
    description: '過去問・模試の得点から偏差値を計算し、目標偏差値に必要な点数を逆算する無料ツール。',
    url: `${SITE_URL}/hensachi/gyakusan`,
    type: 'article',
  },
};

export default function HensachiGyakusanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '目標偏差値まであと何点？逆算', url: `${SITE_URL}/hensachi/gyakusan` },
        ]}
      />
      <WebApplicationSchema
        name="目標偏差値まであと何点？逆算計算機"
        description="過去問・模試の得点から偏差値を計算し、目標の偏差値に必要な点数を逆算する無料ツール"
        url={`${SITE_URL}/hensachi/gyakusan`}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">目標偏差値まであと何点？逆算</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <Undo2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">目標偏差値まであと何点？逆算計算機</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              過去問・模試の得点から今の偏差値を出し、<strong>目標の偏差値に必要な点数</strong>をその場で逆算します。
            </p>
          </header>

          <HensachiGyakusanCalculator />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">逆算の考え方</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              偏差値の式「偏差値 = 50 + 10 ×（点数 − 平均点）÷ 標準偏差」を点数について解くと、
              「必要な点数 = 平均点 + 標準偏差 ×（目標偏差値 − 50）÷ 10」になります。
              今の得点との差が、目標に届くまでの「あと何点」です。
              計算に使う式そのものは<Link href="/hensachi" className="font-bold text-purple-600 hover:underline">通常の偏差値計算</Link>と全く同じで、逆向きに解いているだけです。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi/shiboukou" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                偏差値→志望校レンジ逆引き
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi/agekata" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                偏差値の出し方・上げ方
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tarinai-taisaku" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                内申点・当日点が足りない冬の緊急対策
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
            <HensachiClusterNav current="gyakusan" />
          </div>
        </div>
      </div>
    </>
  );
}
