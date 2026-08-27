import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Gauge, ChevronRightSquare, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { TouseiHanICalculator } from '@/components/HyoteiHeikin/TouseiHanICalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '到達可能範囲とはどういう意味ですか？',
    answer:
      'これまでの評定の実績（合計・件数）を踏まえ、残りの評価がすべて最高評価（5）だった場合の最大値と、すべて最低評価（1）だった場合の最小値を計算したものです。「今のペースならどこまで届き得るか」「まだAの可能性は残っているか」の目安になります。',
  },
  {
    question: '「現在までの評定の合計」「評定数」は何を入力すればいいですか？',
    answer:
      'これまで受けた評価の評定（1〜5）をすべて足した合計と、その件数です。例えば高1・高2の2年間で20件の評定を受け、合計70だった場合は「合計70・評定数20」と入力します。学習成績の状況 計算ツールで科目を入力した合計・件数を使うと正確です。',
  },
  {
    question: '「残りの評価回数」はどう見積もればいいですか？',
    answer:
      '高3の1学期（前期）まで対象になるため、残りの学期数×履修科目数のおおよその見込みで構いません。正確な回数は学校・履修状況によって異なるため、目安として使ってください。',
  },
];

const HOWTO_STEPS = [
  { name: '現在までの評定の合計と件数を入力する', text: 'これまで受けた評定の合計と件数を入力します。' },
  { name: '残りの評価回数を入力する', text: '卒業までに残っているおおよその評価回数を入力します。' },
  { name: '到達可能な最大値・最小値を確認する', text: '残り全部が5だった場合の最大値、全部が1だった場合の最小値と、それぞれの概評が表示されます。' },
];

export const metadata: Metadata = {
  title: '到達可能範囲チェック｜高1・高2から学習成績の状況はどこまで届く？ | My Naishin',
  description:
    '高1・高2終了時点の評定の実績から、卒業までに到達し得る全体の学習成績の状況の最大値・最小値を算出する無料ツール。「まだ概評Aに間に合うか」の目安がわかります。',
  keywords: ['学習成績の状況 到達可能', '評定平均 最大 最小', '学習成績概評A 間に合う', '評定平均 高1 高2'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/tousei-han-i` },
  openGraph: {
    title: '到達可能範囲チェック｜学習成績の状況はどこまで届く？ | My Naishin',
    description: '高1・高2の実績から、卒業までに到達し得る学習成績の状況の最大値・最小値を算出。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/tousei-han-i`,
    type: 'article',
  },
};

export default function TouseiHanIPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
          { name: '到達可能範囲', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/tousei-han-i` },
        ]}
      />
      <WebApplicationSchema
        name="到達可能範囲チェックツール"
        description="現在までの実績から、卒業までに到達し得る全体の学習成績の状況の最大値・最小値を算出する無料ツール"
        url={`${SITE_URL}/hyotei-heikin/gakushu-seiseki/tousei-han-i`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-tousei-han-i"
        name="到達可能範囲の確認方法"
        description="現在までの評定の合計・件数と残りの評価回数から、到達し得る最大値・最小値を算出する手順"
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
            <span className="text-slate-700">到達可能範囲</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Gauge className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              到達可能範囲チェック
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              高1・高2の実績から、<strong className="text-emerald-700">卒業までに到達し得る範囲</strong>を確認できます。
              「まだ概評Aに間に合うか」を知りたい高1・高2の方に向けたツールです。
            </p>
          </header>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                残りの評価がすべて最高評価（5）または最低評価（1）だった場合の理論値です。
                実際の到達値は今後の学習状況によって変わります。あくまで目安としてご利用ください。
              </p>
            </div>
          </div>

          <div id="calculator-section">
            <TouseiHanICalculator />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/hyotei-heikin/gakushu-seiseki" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                学習成績の状況 計算ツール
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link href="/hyotei-heikin/gakushu-seiseki/gaihyou" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                概評A〜Eまであと何点？境界チェック
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
