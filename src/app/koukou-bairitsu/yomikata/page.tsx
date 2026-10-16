import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/koukou-bairitsu" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              倍率計算
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">出願倍率の読み方</span>
          </nav>

          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">出願倍率の読み方</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              出願期間中に発表される倍率は、中間発表と確定発表で数字が変わります。どの段階の数字を見ればいいのか、一般的な読み方の流れをまとめました。
            </p>
          </header>

          <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              発表のタイミング・回数・志願変更の制度は都道府県ごとに異なります。このページは一般的な読み方の目安であり、正式なスケジュールは志望校がある都道府県教育委員会の公式発表を必ず確認してください。
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">出願倍率を読む一般的な流れ</h2>
            <ol className="mt-4 space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-sm font-bold tabular-nums text-slate-900">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold leading-snug text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

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

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA placement="home" />
          </div>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              <li>
                <Link href="/koukou-bairitsu" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  志願倍率・実質倍率を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/juken-schedule" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  受験の年間スケジュール
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/heigan-yuugu" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  併願優遇の仕組み
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/tarinai-taisaku" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  当日点・内申が足りないときの対策
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
