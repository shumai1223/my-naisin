import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, HelpCircle, AlertTriangle, ChevronRightSquare, BookOpenCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

const STEPS = [
  {
    title: '中間発表（志願状況）を確認する',
    body: '出願期間中、多くの都道府県教育委員会は「志願者数の途中経過」を発表します。これは出願がまだ締め切られていない段階の暫定的な数字であり、最終的な倍率とは異なる場合があります。まずはこれが「確定値ではない」と理解することが第一歩です。',
  },
  {
    title: '志願変更ができる制度か・期間はいつまでかを確認する',
    body: '多くの都道府県では、出願後の一定期間内に志願先を変更できる「志願変更」の制度があります（制度の有無・期間・条件は都道府県ごとに異なります）。倍率が高いと分かった学校から、倍率の低い学校へ変更する受験生もいるため、志願変更の期間が終わるまでは倍率が動く可能性があります。',
  },
  {
    title: '出願締切後の確定倍率（志願倍率）を確認する',
    body: '志願変更の期間が終わり出願が締め切られると、確定した志願者数をもとにした最終的な志願倍率が発表されます。中間発表の数字と比べて変動していることも珍しくありません。判断材料にするなら、この確定後の数字を基準にしましょう。',
  },
  {
    title: '倍率だけで合否を判断しない',
    body: '倍率はあくまで「志願者数と募集人員の比率」であり、受験者一人ひとりの実力までは表しません。同じ倍率でも受験者層の学力によって難易度は変わります。倍率の確認と合わせて、自分の内申点・当日点が志望校の水準にどのくらい近いかを確認しておくことが大切です。',
  },
];

const FAQS = [
  {
    question: '出願倍率はいつ発表されますか？',
    answer: '一般的に、出願期間中に暫定的な「志願状況（中間発表）」が発表され、志願変更の期間を経て、出願締切後に確定した「志願倍率」が発表されます。発表のタイミング・回数は都道府県によって異なるため、志望校がある都道府県教育委員会の公式発表スケジュールを確認してください。',
  },
  {
    question: '中間発表の倍率と最終的な倍率はなぜ違うのですか？',
    answer: '中間発表は出願がまだ確定していない途中経過の数字です。その後の志願変更（出願先の変更）や出願手続きの完了状況によって、最終的に確定する倍率と差が出ることがあります。判断材料にする場合は、志願変更の期間が終わったあとの確定倍率を基準にすることをおすすめします。',
  },
  {
    question: '志願変更とはどのような制度ですか？',
    answer: '出願後の一定期間内に、出願先の学校を変更できる制度です。倍率が高いと分かった学校から、別の学校へ変更する受験生もいます。制度の有無・期間・回数は都道府県ごとに異なるため、志望校がある都道府県教育委員会の募集案内で確認してください。',
  },
  {
    question: '倍率が高い学校は受けないほうがいいですか？',
    answer: '倍率だけで受験するかどうかを判断するのは早計です。倍率が高くても、自分の内申点・当日点の実力が志望校の水準に届いていれば十分に合格の可能性はあります。倍率は目安の一つとして捉え、実力の確認や担任の先生への相談と合わせて判断することをおすすめします。',
  },
  {
    question: '志願倍率と実質倍率、どちらを見ればいいですか？',
    answer: '出願期間中に判断材料として使えるのは志願倍率（志願者数÷募集人員）だけです。実質倍率（受験者数÷合格者数）は入試当日の欠席状況を反映するため、入試後にしか分かりません。出願先を検討する段階では志願倍率を、入試の難易度を振り返る段階では実質倍率を見る、という使い分けになります。',
  },
];

export const metadata: Metadata = {
  title: '出願倍率の読み方【中間発表・志願変更・確定倍率の違い】 | My Naishin',
  description:
    '高校入試の出願倍率の読み方を解説。中間発表（志願状況）と確定倍率の違い、志願変更の一般的な仕組み、倍率をどう受け止めればいいかまで。学校別の実数値は都道府県教育委員会の公式発表が最優先です。',
  keywords: ['出願倍率 読み方', '志願倍率とは', '志願変更とは', '高校入試 倍率 中間発表', '倍率 見方'],
  alternates: { canonical: `${SITE_URL}/koukou-bairitsu/yomikata` },
  openGraph: {
    title: '出願倍率の読み方【中間発表・志願変更・確定倍率の違い】',
    description: '中間発表と確定倍率の違い、志願変更の仕組み、倍率をどう受け止めるかを解説。',
    url: `${SITE_URL}/koukou-bairitsu/yomikata`,
    type: 'website',
  },
};

export default function BairitsuYomikataPage() {
  const url = `${SITE_URL}/koukou-bairitsu/yomikata`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '高校入試 倍率計算', url: `${SITE_URL}/koukou-bairitsu` },
          { name: '出願倍率の読み方', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        name="出願倍率の読み方"
        description="出願期間中に発表される倍率を、中間発表から確定倍率まで正しく読み解く一般的な手順"
        steps={STEPS.map((s) => ({ name: s.title, text: s.body }))}
        totalTime="P10D"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/koukou-bairitsu" className="hover:text-indigo-600">
              倍率計算
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">出願倍率の読み方</span>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">出願倍率の読み方</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              出願期間中に発表される倍率は、中間発表と確定発表で数字が変わります。どの段階の数字を見ればいいのか、一般的な読み方の流れをまとめました。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                発表のタイミング・回数・志願変更の制度は都道府県ごとに異なります。このページは一般的な読み方の目安であり、正式なスケジュールは志望校がある都道府県教育委員会の公式発表を必ず確認してください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-l-4 border-indigo-500 pl-3 text-lg font-bold text-slate-800">
              <BookOpenCheck className="h-5 w-5 text-indigo-500" />
              出願倍率を読む一般的な流れ
            </h2>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-indigo-100" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-bold text-slate-800">{s.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 flex items-start gap-1.5 text-sm font-bold text-slate-800">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    Q. {f.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/koukou-bairitsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                志願倍率・実質倍率を計算する
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/juken-schedule" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                受験の年間スケジュール
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/heigan-yuugu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                併願優遇の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tarinai-taisaku" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                当日点・内申が足りないときの対策
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
