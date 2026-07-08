import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Users, ChevronRightSquare, HelpCircle, ClipboardCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const STEPS = [
  { name: '担任・進路指導の先生に意思を伝える', text: '学校推薦型選抜（指定校推薦・公募推薦）を希望する場合、まず担任や進路指導の先生に志望を伝えることから始まる。校内選考の実施時期・応募方法は学校ごとに異なるため、早めの相談が必要。' },
  { name: '校内選考への応募', text: '希望する大学・学部への推薦を申し出る。同じ大学・学部の枠を複数の生徒が希望した場合、学校内で候補を絞り込む選考が行われる。' },
  { name: '校内選考の実施', text: '評定平均・出席状況・面談・小論文など、学校が定める基準で選考が行われる。基準は学校ごとに異なり、公表されないことが多い。' },
  { name: '結果に基づき学校長が推薦', text: '校内選考を通過した生徒について、学校長の推薦のもとで正式に大学へ出願する。通過しなかった場合、その大学への学校推薦型選抜での出願はできない。' },
];

const FAQS = [
  {
    question: '校内選考とは何ですか？',
    answer:
      '学校推薦型選抜（指定校推薦・公募推薦）で、大学が学校に割り当てる推薦枠（人数）に対し、希望する生徒がそれを上回る場合に、学校内で推薦する生徒を絞り込む選考のことです。校内選考を通過しないと、学校長の推薦を受けて大学へ出願することはできません。',
  },
  {
    question: '校内選考の基準は何で決まりますか？',
    answer:
      '評定平均・出席状況・面談・小論文などが基準として使われることが一般的とされますが、具体的な基準やその重み付けは学校ごとに異なり、公表されないことが多いです。担任・進路指導の先生に、自分の学校での基準や過去の傾向を確認するのが確実です。',
  },
  {
    question: '校内選考に落ちたらどうなりますか？',
    answer:
      'その大学・学部への学校推薦型選抜での出願はできなくなります。ただし、総合型選抜や一般選抜（当日点による入試）など、他の入試方式で同じ大学に再挑戦できる場合があります。学校推薦型の対策と並行して、他の選択肢も検討しておくと安心です。',
  },
  {
    question: '校内選考はいつ頃行われますか？',
    answer:
      '学校推薦型選抜の出願は11月以降が中心のため、校内選考はそれ以前（多くは夏から秋にかけて）に行われることが一般的です。ただし具体的な時期は学校ごとに大きく異なるため、早めに担任・進路指導の先生に確認してください。',
  },
];

export const metadata: Metadata = {
  title: '校内選考とは？学校推薦型選抜の仕組みと準備【一般的な流れ】 | My Naishin',
  description: '学校推薦型選抜（指定校推薦・公募推薦）で行われる「校内選考」とは何か、一般的な流れと準備のポイントを解説。学校ごとの具体的な基準は非公表につき断定せず、担任・進路指導の先生への確認ポイントを整理。登録不要。',
  keywords: ['校内選考とは', '指定校推薦 校内選考', '公募推薦 校内選考', '学校推薦 選考基準', '校内選考 落ちる'],
  alternates: { canonical: `${SITE_URL}/shutsugan-junbi/kounai-senkou` },
  openGraph: {
    title: '校内選考とは？学校推薦型選抜の仕組みと準備',
    description: '学校推薦型選抜で行われる「校内選考」の一般的な流れと準備のポイントを解説。',
    url: `${SITE_URL}/shutsugan-junbi/kounai-senkou`,
    type: 'article',
  },
};

export default function KounaiSenkouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '出願準備チェックリスト', url: `${SITE_URL}/shutsugan-junbi` },
          { name: '校内選考とは', url: `${SITE_URL}/shutsugan-junbi/kounai-senkou` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-kounai-senkou"
        name="校内選考の一般的な流れ"
        description="学校推薦型選抜における校内選考の、意思表示から学校長推薦までの一般的な流れ"
        totalTime="P2M"
        steps={STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-violet-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/shutsugan-junbi" className="hover:text-violet-600">出願準備チェックリスト</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">校内選考とは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">校内選考とは？</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              学校推薦型選抜で行われる<strong>「校内選考」</strong>の一般的な流れと、準備のポイントをまとめました。
              学校ごとの具体的な基準は非公表につき断定せず、確認すべきポイントを整理します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-slate-800">校内選考の一般的な流れ</h2>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div key={s.name} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
                    <ClipboardCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{i + 1}. {s.name}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              ※ 校内選考の実施有無・基準・時期は学校ごとに異なります。学校推薦型選抜を検討する場合は、
              早めに担任・進路指導の先生に相談してください。
            </p>
          </section>

          <div className="mt-8">
            <ParentLeadCTA placement="suisen" />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ページ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/shutsugan-junbi', title: '出願準備チェックリスト' },
                { href: '/shutsugan-junbi/shibou-riyuusho', title: '志望理由書の書き方・構成' },
                { href: '/suisen-nyuushi', title: '推薦入試の仕組み' },
                { href: '/hyotei-heikin/suisen-kijun', title: '推薦に必要な評定平均 早見表' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                  {c.title}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-violet-600" />よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">{f.question}<ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" /></span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            ※ 校内選考の実施有無・基準・時期は学校・大学により異なります。最終的な情報は在籍校・志望大学の募集要項でご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
