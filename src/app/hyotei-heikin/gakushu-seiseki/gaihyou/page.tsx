import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Target, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { GaihyouDistanceCalculator } from '@/components/HyoteiHeikin/GaihyouDistanceCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '学習成績概評は境界で何が変わりますか？',
    answer:
      '学習成績概評はA〜Eの5段階で、全体の学習成績の状況の値によって区分が決まります（5.0〜4.3はA、4.2〜3.5はB、3.4〜2.7はC、2.6〜1.9はD、1.8以下はE）。同じ0.1の差でも、境界をまたぐかどうかで書類上の区分（例: B→A）が変わるため、自分が境界のどちら側にいるかを把握しておく価値があります。',
  },
  {
    question: '「あと0.1」と出た場合、本当に届きますか？',
    answer:
      'このツールが示す差は、全体の学習成績の状況（すべての評定の単純平均）を基準にした理論値です。実際に届くかは残りの評価回数・評定の付き方に左右されます。「残りの科目数から逆算する」欄に現在までの評定数と残りの評価回数を入力すると、残りで平均いくつ必要かを具体的に確認できます。',
  },
  {
    question: 'すでに概評Aの場合はどうなりますか？',
    answer:
      '概評Aは最上位の区分のため、「次の段階」はありません。ツールにも「すでに最上位の概評Aです」と表示されます。',
  },
];

const HOWTO_STEPS = [
  { name: '現在の全体の学習成績の状況を入力する', text: '学習成績の状況 計算ツールなどで算出した現在の全体の値を入力します。' },
  { name: '現在の概評と次の段階までの距離を確認する', text: '現在のA〜E区分と、1つ上の区分まであと何点必要かが表示されます。' },
  { name: '（任意）残りの科目数から逆算する', text: '現在までの評定数と残りの評価回数を入力すると、次の区分に届かせるために必要な平均が計算されます。' },
];

export const metadata: Metadata = {
  title: '学習成績概評A〜Eまであと何点？境界チェックツール | My Naishin',
  description:
    '大学受験の調査書に記載される学習成績概評（A〜E）は0.1の差で区分が変わります。現在の全体の学習成績の状況を入力するだけで、次の区分まであと何点必要かを算出。残りの科目数からの逆算にも対応。',
  keywords: ['学習成績概評', '学習成績概評 境界', '評定平均 A まで', '学習成績の状況 あと何点'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/gaihyou` },
  openGraph: {
    title: '学習成績概評A〜Eまであと何点？境界チェックツール | My Naishin',
    description: '現在の全体の学習成績の状況から、次の概評区分まであと何点必要かを算出。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/gaihyou`,
    type: 'article',
  },
};

export default function GaihyouDistancePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
          { name: '概評の境界まで', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/gaihyou` },
        ]}
      />
      <WebApplicationSchema
        name="学習成績概評 境界チェックツール"
        description="現在の全体の学習成績の状況から、次の学習成績概評区分まであと何点必要かを算出する無料ツール"
        url={`${SITE_URL}/hyotei-heikin/gakushu-seiseki/gaihyou`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-gaihyou-distance"
        name="概評の境界までの距離の確認方法"
        description="現在の全体の学習成績の状況から、次の学習成績概評区分までの距離を算出する手順"
        totalTime="PT1M"
        steps={HOWTO_STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-emerald-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin" className="hover:text-emerald-600">評定平均計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin/gakushu-seiseki" className="hover:text-emerald-600">学習成績の状況</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">概評の境界まで</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              学習成績概評 境界チェック
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              学習成績概評は<strong className="text-emerald-700">境界で1段階変わります</strong>。
              現在の全体の学習成績の状況を入力すると、次の区分まであと何点必要かがわかります。
            </p>
          </header>

          <div id="calculator-section">
            <GaihyouDistanceCalculator />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              学習成績概評A〜Eの区分
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white text-left">
                    <th className="border border-emerald-400 px-3 py-2 font-bold">全体の学習成績の状況</th>
                    <th className="border border-emerald-400 px-3 py-2 font-bold text-center">学習成績概評</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {[
                    ['5.0 〜 4.3', 'A'],
                    ['4.2 〜 3.5', 'B'],
                    ['3.4 〜 2.7', 'C'],
                    ['2.6 〜 1.9', 'D'],
                    ['1.8 以下', 'E'],
                  ].map(([range, rank]) => (
                    <tr key={rank} className="odd:bg-white even:bg-emerald-50/40">
                      <td className="border border-slate-200 px-3 py-2 font-mono">{range}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold">{rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 境界の丸め方の注意 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              「あと0.1」の境界は、四捨五入のどちらに転ぶかで決まる
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              全体の学習成績の状況は「すべての評定の合計数をすべての評定数で除した数値（小数点以下第2位を
              四捨五入）」と定義されています。つまり、生の平均値が4.25であれば四捨五入で4.3となりB、
              4.24であれば4.2のままCです。境界付近にいる場合、次の評価で評定が1つ変わるかどうかよりも先に、
              小数点第2位のわずかな差で区分が変わることがある点に注意してください。
            </p>
            <blockquote className="border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「『学習成績概評』の欄は、高等学校における同一学年生徒全員（中略）の3か年間における全体の学習成績の
              状況を次の区分に従って、A、B、C、D、Eの5段階に分け、その生徒の属する成績段階を記入すること。」
            </blockquote>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号）
              調査書記入上の注意事項等について9(1)
              <a
                href="https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
          </section>

          {/* Aの上に何があるか（正直な現状確認） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              Aの上の区分は無いのか
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              学習成績概評はA〜Eの5段階が全てで、現行の実施要項にAより上の区分は定められていません。
              過去の実施要項（令和4年度版・3文科高第284号）には「大学が希望する場合、学習成績概評Aに属する
              生徒のうち人物・学力ともに特に優秀な者について、欄にⒶ（丸囲みのA）と標示できる」という規定が
              ありましたが、現行の令和9年度実施要項（8文科高第318号）の本文・別紙様式1のいずれにもこの規定は
              見当たりません。年度によって様式や規定が更新されるため、「Aの上にⒶがある」という古い情報を
              見かけても、現行の要項では確認できない点に注意してください。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/hyotei-heikin/gakushu-seiseki" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                全体の学習成績の状況を計算
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link href="/hyotei-heikin/gakushu-seiseki/chousasho" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                調査書シミュレーター
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
