import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { BairitsuCalculator } from '@/components/Bairitsu/BairitsuCalculator';
import { PREFECTURES } from '@/lib/prefectures';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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
    answer: '倍率は年度・学校ごとに変動し、都道府県教育委員会が出願後・入試後に公式発表します。当サイトでは、各県の教育委員会が公表した学校別の倍率・志願者数を、計算し直さずそのまま転記して学校別ページに掲載しています（出典は各県教育委員会。県によって掲載している年度・学校の範囲は異なります）。最新の数字や掲載のない学校は、都道府県教育委員会の公式発表または志望校の学校説明会資料でご確認ください。',
  },
  {
    question: '倍率が高いほど合格は難しいですか？',
    answer: '倍率が高いほど競争は厳しくなりますが、倍率だけで合否のボーダーラインは決まりません。同じ倍率でも受験者層の学力によって難易度は変わります。倍率は目安の一つとして、内申点・当日点の実力と合わせて志望校を検討しましょう。',
  },
];

export const metadata: Metadata = {
  title: '高校入試 倍率計算サイト【志願倍率・実質倍率】無料計算機 | My Naishin',
  description: '高校入試の倍率（志願者数÷募集人員の志願倍率、受験者数÷合格者数の実質倍率）を無料で計算。倍率の意味・志願倍率と実質倍率の違いを解説。学校別の倍率は各県教育委員会の公表値を転記して県別ページに掲載（最新の数字は教育委員会の公式発表でご確認ください）。',
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">高校入試 倍率計算</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">高校入試 倍率計算サイト</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              募集人員・志願者数（または受験者数・合格者数）を入れるだけで、<strong>志願倍率・実質倍率</strong>を計算します。
            </p>
          </header>

          <BairitsuCalculator />

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">志願倍率と実質倍率の違い</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              「倍率」という言葉には2種類あります。出願直後に発表される<strong>志願倍率</strong>（志願者数÷募集人員）と、
              入試後に確定する<strong>実質倍率</strong>（受験者数÷合格者数）です。出願後の志願変更や当日欠席があるため、
              この2つの数字は一致しないことがよくあります。実際の競争の厳しさをより正確に表すのは実質倍率です。
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">都道府県別の入試制度・内申点を確認する</h2>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              県ごとの内申点の仕組みを確認できます。学校別の倍率は、各県教育委員会の公表値を転記して県別の入試ページに掲載しています（掲載範囲は県によって異なります）。最新の倍率は都道府県教育委員会の公式発表でもご確認ください。
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-3 md:grid-cols-4">
              {PREFECTURES.map((pref) => (
                <li key={pref.code}>
                  <Link
                    href={`/${pref.code}/naishin`}
                    className="flex min-h-[44px] items-center text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {pref.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              <li>
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  偏差値を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/total-score" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  都道府県別の総合得点の仕組みを見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/koukou-bairitsu/yomikata" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  出願倍率の読み方を見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/naishin-kakusa" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  都道府県別 内申点格差レポートを見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA placement="prefecture" />
          </div>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              {FAQS.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
