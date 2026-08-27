import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, BookOpen, ChevronRightSquare, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { KyokaBetsuCalculator } from '@/components/HyoteiHeikin/KyokaBetsuCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '教科ごとの学習成績の状況が必要になるのはどんな場面ですか？',
    answer:
      '大学の出願基準には、全体の学習成績の状況だけでなく「英語の学習成績の状況が4.0以上」「数学および理科の学習成績の状況が3.8以上」のように、特定教科だけを指定する形式が実在します。全体の値しか出せない計算機では、こうした基準に自分が届いているか確認できません。',
  },
  {
    question: '教科ごとの学習成績の状況はどう計算しますか？',
    answer:
      '選んだ教科に属する科目の評定をすべて合計し、その教科の科目数（評定数）で割り、小数点以下第2位を四捨五入します。文部科学省の公式計算例では、理科（物理基礎3・化学基礎3・生物基礎5）の場合 (3+3+5)÷3=3.66… → 3.7 です。',
  },
  {
    question: '具体的な大学の基準値は載っていますか？',
    answer:
      'いいえ、載せていません。大学ごとの出願基準は年度や学部により変わり、当サイトが独自に推定した数値を載せると誤った情報になりかねないため、あえて掲載していません。必ず志望大学の最新の募集要項でご確認ください。',
  },
];

const HOWTO_STEPS = [
  { name: '教科を選ぶ', text: '学習成績の状況を確認したい教科（例: 理科）を選択します。' },
  { name: 'その教科の科目と評定を入力する', text: 'その教科に属する科目名と評定（5段階）を入力します。' },
  { name: '教科の学習成績の状況を確認する', text: '入力した科目の評定から、その教科だけの学習成績の状況が自動計算されます。' },
];

export const metadata: Metadata = {
  title: '教科別 学習成績の状況 計算ツール【英語・数学など単体で確認】| My Naishin',
  description:
    '「英語の学習成績の状況4.0以上」のような教科限定の出願基準に対応するため、教科ごとの学習成績の状況だけを計算できる無料ツール。文部科学省の公式計算方法どおりに算出します。大学別の具体的な基準値は掲載していません。',
  keywords: ['学習成績の状況 教科別', '評定平均 教科ごと', '英語 学習成績の状況', '理科 学習成績の状況'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/kyoka-betsu` },
  openGraph: {
    title: '教科別 学習成績の状況 計算ツール | My Naishin',
    description: '教科ごとの学習成績の状況だけを文部科学省の公式計算方法で算出。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/kyoka-betsu`,
    type: 'article',
  },
};

export default function KyokaBetsuPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
          { name: '教科別の学習成績の状況', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/kyoka-betsu` },
        ]}
      />
      <WebApplicationSchema
        name="教科別 学習成績の状況 計算ツール"
        description="教科ごとの学習成績の状況だけを文部科学省の公式計算方法で算出する無料ツール"
        url={`${SITE_URL}/hyotei-heikin/gakushu-seiseki/kyoka-betsu`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-kyoka-betsu"
        name="教科別の学習成績の状況の計算方法"
        description="教科を選び、その教科の科目と評定を入力して教科別の学習成績の状況を算出する手順"
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
            <span className="text-slate-700">教科別</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              教科別 学習成績の状況
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              「英語の学習成績の状況4.0以上」のような<strong className="text-emerald-700">教科限定の出願基準</strong>に対応するため、
              教科ごとの学習成績の状況だけを計算できます。
            </p>
          </header>

          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                <strong>大学別の具体的な基準値は掲載していません。</strong>
                出願基準は年度・学部により変わるため、推定値を載せると誤情報になりかねません。必ず志望大学の最新の募集要項でご確認ください。
              </p>
            </div>
          </div>

          <div id="calculator-section">
            <KyokaBetsuCalculator />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              文部科学省の公式計算例で検算する
            </h2>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
              <h3 className="font-bold mb-2">理科（物理基礎3・化学基礎3・生物基礎5）</h3>
              <div className="font-mono">(3+3+5) ÷ 3 = 3.66… → <strong className="text-base">3.7</strong></div>
            </div>
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
