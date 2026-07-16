import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Percent, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { BairitsuCalculator } from '@/components/Bairitsu/BairitsuCalculator';
import { PREFECTURES } from '@/lib/prefectures';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '高校入試の「倍率」はどう計算しますか？',
    answer: '一般的に「倍率」と呼ばれるのは志願倍率で、「志願者数 ÷ 募集人員」で計算します。例えば募集200人に対して志願者280人なら、倍率は280÷200＝1.4倍です。',
  },
  {
    question: '志願倍率と実質倍率はどう違いますか？',
    answer: '志願倍率は出願時点の「志願者数 ÷ 募集人員」です。実際には出願後に志願先を変更する「志願変更」や、当日欠席する受験者がいるため、最終的な実質倍率（受験者数 ÷ 合格者数）は志願倍率と異なることがよくあります。合否の厳しさをより正確に表すのは実質倍率です。',
  },
  {
    question: '志望校の最新の倍率はどこで確認できますか？',
    answer: '倍率は年度・学校ごとに変動し、都道府県教育委員会が出願後・入試後に公式発表します。当サイトでは特定の学校・年度の倍率データは扱っていません（不正確な数字で誤解を与えないため）。志望校の最新倍率は、都道府県教育委員会の公式発表または志望校の学校説明会資料でご確認ください。',
  },
  {
    question: '倍率が高いほど合格は難しいですか？',
    answer: '倍率が高いほど競争は厳しくなりますが、倍率だけで合否のボーダーラインは決まりません。同じ倍率でも受験者層の学力によって難易度は変わります。倍率は目安の一つとして、内申点・当日点の実力と合わせて志望校を検討しましょう。',
  },
];

export const metadata: Metadata = {
  title: '高校入試 倍率計算サイト【志願倍率・実質倍率】無料計算機 | My Naishin',
  description: '高校入試の倍率（志願者数÷募集人員の志願倍率、受験者数÷合格者数の実質倍率）を無料で計算。倍率の意味・志願倍率と実質倍率の違いを解説。学校別の実数値は都道府県教育委員会の公式発表でご確認ください。',
  keywords: ['高校 倍率 計算', '高校入試 倍率計算サイト', '志願倍率とは', '実質倍率とは', '倍率 計算方法'],
  alternates: { canonical: `${SITE_URL}/koukou-bairitsu` },
  openGraph: {
    title: '高校入試 倍率計算サイト【志願倍率・実質倍率】無料計算機 | My Naishin',
    description: '高校入試の志願倍率・実質倍率を無料で計算する計算機。倍率の仕組みを解説。',
    url: `${SITE_URL}/koukou-bairitsu`,
    type: 'article',
  },
};

export default function KoukouBairitsuPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '高校入試 倍率計算', url: `${SITE_URL}/koukou-bairitsu` },
        ]}
      />
      <WebApplicationSchema
        name="高校入試 倍率計算サイト"
        description="高校入試の志願倍率（志願者数÷募集人員）・実質倍率（受験者数÷合格者数）を計算する無料ツール"
        url={`${SITE_URL}/koukou-bairitsu`}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">高校入試 倍率計算</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl">
              <Percent className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校入試 倍率計算サイト</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              募集人員・志願者数（または受験者数・合格者数）を入れるだけで、<strong>志願倍率・実質倍率</strong>を計算します。
            </p>
          </header>

          <BairitsuCalculator />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">志願倍率と実質倍率の違い</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              「倍率」という言葉には2種類あります。出願直後に発表される<strong>志願倍率</strong>（志願者数÷募集人員）と、
              入試後に確定する<strong>実質倍率</strong>（受験者数÷合格者数）です。出願後の志願変更や当日欠席があるため、
              この2つの数字は一致しないことがよくあります。実際の競争の厳しさをより正確に表すのは実質倍率です。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">都道府県別の入試制度・内申点を確認する</h2>
            <p className="mb-4 text-xs text-slate-500">
              倍率そのものの実数値は当サイトでは扱っていません。志望校の最新の倍率は都道府県教育委員会の公式発表でご確認ください。まずは内申点の仕組みを確認しましょう。
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {PREFECTURES.map((pref) => (
                <Link
                  key={pref.code}
                  href={`/${pref.code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-800 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                >
                  <span className="truncate">{pref.name}</span>
                  <ChevronRightSquare className="h-3 w-3 shrink-0 opacity-60" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                偏差値を計算する
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/total-score" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                都道府県別の総合得点の仕組みを見る
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/koukou-bairitsu/yomikata" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                出願倍率の読み方を見る
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/naishin-kakusa" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                都道府県別 内申点格差レポートを見る
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
