import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Undo2, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { HyoteiHeikinGyakusanResultFlow } from '@/components/HyoteiHeikin/HyoteiHeikinGyakusanResultFlow';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '残りで必要な評定平均はどう計算していますか？',
    answer: '「目標平均 ×（現在までの評価回数＋残り回数）－ 現在までの合計」を残り回数で割った逆算式です。現在の評定平均に評価済み回数を掛けた合計と、目標達成に必要な全体の合計との差分を、残りの回数で割ることで「残りで平均いくつ必要か」が出ます。',
  },
  {
    question: '「評価済み回数」には何を入れればいいですか？',
    answer: '目安は「9教科×これまでの学期数」です。例えば中3の1学期まで2学期分の通知表がある場合は9×2＝18回になります。推薦・総合型選抜で評価対象になる範囲（学年・学期）は学校・大学によって異なるため、ご自身の状況（何回分の評定が対象になるか）に合わせて入力してください。',
  },
  {
    question: '必要な平均が5を超えたらどうすればいいですか？',
    answer: '5段階評価の最大値（オール5）でも理論上届かないことを意味します。目標の評定平均自体を見直すか、評価対象の範囲や現在の実績を確認し直してください。評定平均自体の計算は評定平均計算ツールで確認できます。',
  },
  {
    question: '推薦・総合型選抜に必要な評定平均の目安は？',
    answer: '学校・大学・入試方式によって基準は大きく異なります。一般的な目安バンドは推薦・併願優遇の評定平均ガイドで解説しています。必ず最新の募集要項で確認してください。',
  },
];

const HOWTO_STEPS = [
  { name: '現在の評定平均と評価済み回数を入力する', text: '通知表から出した今の評定平均と、これまでに評価された回数（目安：9教科×学期数）を入力します。' },
  { name: '目標の評定平均を入力する', text: '推薦・総合型選抜などで目指す評定平均を入力します。プリセット（3.5/4.0/4.3/4.5/5.0）から選ぶこともできます。' },
  { name: '残りの評価回数を入力する', text: '出願までにあと何回評価されるか（目安：9教科×残り学期数）を入力すると、残りで必要な平均が自動で計算されます。' },
];

export const metadata: Metadata = {
  title: '推薦に必要な評定平均、残りでいくつ必要？逆算計算機 | My Naishin',
  description: '目標の評定平均に届かせるには、残りの学期・教科で平均いくつ取ればよいかを逆算する無料ツール。現在の評定平均・評価済み回数・残り回数を入力するだけ。推薦・総合型選抜の準備に。登録不要。',
  keywords: ['評定平均 逆算', '評定平均 目標 残り', '推薦 評定平均 必要', '評定平均 上げ方 計算'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gyakusan` },
  openGraph: {
    title: '推薦に必要な評定平均、残りでいくつ必要？逆算計算機 | My Naishin',
    description: '目標の評定平均に届かせるには、残りの学期・教科で平均いくつ取ればよいかを逆算する無料ツール。',
    url: `${SITE_URL}/hyotei-heikin/gyakusan`,
    type: 'article',
  },
};

export default function HyoteiHeikinGyakusanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '評定平均の逆算', url: `${SITE_URL}/hyotei-heikin/gyakusan` },
        ]}
      />
      <WebApplicationSchema
        name="評定平均の逆算計算機"
        description="目標の評定平均に届かせるには、残りの学期・教科で平均いくつ取ればよいかを逆算する無料ツール"
        url={`${SITE_URL}/hyotei-heikin/gyakusan`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-hyotei-heikin-gyakusan"
        name="評定平均の逆算計算機の使い方"
        description="現在の評定平均と残りの評価回数から、目標に必要な平均を計算する手順"
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
            <span className="text-slate-700">評定平均の逆算</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Undo2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">推薦に必要な評定平均、残りでいくつ必要？</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              現在の評定平均と評価済み回数から、<strong>目標に届かせるために残りで必要な平均</strong>をその場で逆算します。
            </p>
          </header>

          <HyoteiHeikinGyakusanResultFlow />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">逆算の考え方</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              評定平均は「評定の合計 ÷ 評価回数」で決まります。目標平均に必要な合計（目標平均×全体の回数）から、
              現在までの合計を引き、残りの回数で割ると「残りで必要な平均」が出ます。
              計算に使う式そのものは<Link href="/hyotei-heikin" className="font-bold text-emerald-600 hover:underline">通常の評定平均計算</Link>と同じ考え方で、逆向きに解いているだけです。
              推薦・総合型選抜で評価対象になる範囲（学年・学期）は学校・大学によって異なるため、
              ご自身の状況に合わせて「評価済み回数」「残り回数」を入力してください。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hyotei-heikin/suisen-kijun" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                推薦・併願優遇の評定平均ガイド
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/suisen-nyuushi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                推薦入試の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/sougou-gata-senbatsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                総合型選抜の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi/gyakusan" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                目標偏差値まであと何点？逆算
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
