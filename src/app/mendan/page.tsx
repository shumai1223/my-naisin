import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Users,
  Calculator,
  TrendingUp,
  Target,
  ClipboardList,
  CheckSquare,
  MessageCircleQuestion,
  CalendarClock,
} from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { PrintButton } from '@/components/PrintButton';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SITE_URL } from '@/lib/naishin-dataset';

const MENDAN_FAQS = [
  {
    question: '三者面談はいつ行われますか？',
    answer:
      '多くの中学校では年に2〜3回、7月（1学期末・夏休み前）と12月（2学期末）に行われます。特に中3の12月の面談は、内申点（2学期までの評定）が確定し、出願校を実質的に決める最重要の面談です。7月の面談は、夏休みの過ごし方と志望校の方向性を確認する場になります。',
  },
  {
    question: '三者面談の前に準備しておくべきことは？',
    answer:
      'いちばん大事なのは「現在地を数値で把握しておくこと」です。①今の内申点（換算内申）②模試などの偏差値③志望校との差――この3つを面談前に確認しておくと、先生の話が具体的に理解でき、的確に質問できます。当サイトの無料ツールで内申点・偏差値・志望校からの逆算を数分で計算できるので、結果を印刷またはメモして持参するのがおすすめです。',
  },
  {
    question: '面談で先生に何を聞けばいいですか？',
    answer:
      '「今の内申点・偏差値で、志望校は安全圏・合格圏・努力圏のどれか」「内申をあと何点上げると選択肢が広がるか」「併願校（私立）のおすすめと併願基準」「2学期/3学期で評定を上げる具体策」などです。本ページの質問リストを印刷して持っていくと、聞き忘れを防げます。',
  },
  {
    question: '内申点が足りない場合、面談でどう相談すればいい？',
    answer:
      'まず「志望校との差が何点か」を数値で共有し、「2学期・3学期で現実的に上げられる教科はどれか」「当日点（学力検査）でカバーできる比率はどのくらいか（地域の配点による）」を先生に確認しましょう。内申比率の高い地域か当日点比率の高い地域かで戦略が変わります。当サイトの都道府県別ページで配点比率を事前に確認しておくと相談がスムーズです。',
  },
  {
    question: '保護者は面談で何を準備していけばいいですか？',
    answer:
      '志望校の費用感（公立・私立の学費、塾代を含む総額）と通学範囲を家庭で話し合っておくと、面談での進路の絞り込みが現実的になります。費用は無料の資料請求や無料体験で比較しておくと、選択肢を狭めずに判断できます。お子さまの数値（内申・偏差値・差）と合わせて整理しておきましょう。',
  },
];

/** 先生に聞くべき質問リスト（印刷して持参できるよう簡潔に） */
const QUESTIONS = [
  '今の内申点・偏差値で、志望校は「合格圏・努力圏・チャレンジ」のどれですか？',
  '内申点をあと何点上げると、選べる高校の幅が広がりますか？',
  'うちの子が2学期・3学期で評定を上げやすい教科はどれですか？',
  '当日点（学力検査）でどのくらい内申をカバーできますか？',
  'おすすめの併願校（私立）と、その併願基準（内申・偏差値）は？',
  '今の成績で出願して、安全といえるラインはどこですか？',
  '夏休み／冬休みに優先して取り組むべきことは何ですか？',
];

/** 面談前の準備3ステップ（数値の持参を促す） */
const PREP_STEPS = [
  {
    icon: Calculator,
    title: '① 内申点を計算して持参する',
    body: 'お住まいの都道府県の最新方式で換算内申を計算。実技4教科の倍率が高い地域もあるため、数値で把握しておくと面談での話が具体的になります。',
    href: '/',
    cta: '内申点を計算する',
  },
  {
    icon: TrendingUp,
    title: '② 偏差値・評定平均を確認する',
    body: '模試の点数から偏差値を、通知表から評定平均を計算。当日点・推薦の判断材料になります。通知表が出る7月・12月の面談前にちょうど更新できます。',
    href: '/hensachi',
    cta: '偏差値を計算する',
  },
  {
    icon: Target,
    title: '③ 志望校から逆算して差を出す',
    body: '志望校の目安から、必要な内申点・当日点を逆算。「あと何点」が一目でわかるので、面談で先生に的確に相談できます。',
    href: '/reverse',
    cta: '志望校から逆算する',
  },
];

const RELATED_LINKS = [
  { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式に対応。面談に数値を持参。' },
  { href: '/hensachi', title: '偏差値を計算する', desc: '点数と平均点から偏差値を算出。上位何%かもわかる。' },
  { href: '/hyotei-heikin', title: '評定平均を計算する', desc: '通知表から評定平均を計算。推薦基準の早見表つき。' },
  { href: '/reverse', title: '志望校から逆算する', desc: '目標校から必要な内申点・当日点を逆算。' },
  { href: '/chousasho', title: '調査書とは？（面談で評定を確認）', desc: '面談で確認したい評定・出欠が、調査書にどう使われるか。' },
  { href: '/juken-schedule', title: '高校受験の年間スケジュール', desc: '三者面談・出願の時期と、月別にやることを確認。' },
  { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・親ができることを整理。' },
];

export const metadata: Metadata = {
  title: '三者面談 準備チェックリスト｜先生に聞くこと・持ち物【高校受験 中学生】| My Naishin',
  description:
    '高校受験の三者面談を最大限に活かすための準備パック。先生に聞くべき質問リスト、面談前に計算しておく数値（内申点・偏差値・志望校との差）、印刷できるチェックリストを用意。7月・12月の面談前にそのまま使えます。',
  keywords: [
    '三者面談 中学',
    '三者面談 高校受験',
    '三者面談 準備',
    '三者面談 質問',
    '三者面談 聞くこと',
    '三者面談 持ち物',
    '中3 三者面談',
    '面談 志望校',
  ],
  alternates: { canonical: `${SITE_URL}/mendan` },
  openGraph: {
    title: '三者面談 準備チェックリスト｜先生に聞くこと・持ち物【高校受験】| My Naishin',
    description:
      '三者面談を活かす準備パック。質問リスト＋計算しておく数値＋印刷チェックリスト。7月・12月の面談前に。',
    url: `${SITE_URL}/mendan`,
    type: 'article',
  },
};

export default function MendanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '三者面談の準備', url: `${SITE_URL}/mendan` },
        ]}
      />
      <FAQPageSchema faqItems={MENDAN_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">三者面談の準備</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">三者面談 準備チェックリスト</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              三者面談は<strong>限られた時間</strong>です。お子さまの「現在地」を数値で把握し、聞くことを整理しておくだけで、
              貴重な面談を最大限に活かせます。<strong>7月・12月の面談前</strong>に、このページをそのままお使いください。
            </p>
          </header>

          {/* タイミングの案内 */}
          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <div className="mb-2 flex items-center gap-2 font-bold text-amber-800">
              <CalendarClock className="h-5 w-5" />
              面談の時期と狙い
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
              <li>・<strong>7月（1学期末）</strong>：1学期の評定が出る時期。夏休みの過ごし方と志望校の方向性を確認。</li>
              <li>・<strong>12月（2学期末・中3）</strong>：内申が実質確定し、出願校を決める最重要の面談。</li>
            </ul>
          </section>

          {/* 保護者リード（最高インテント・面談=保護者が決裁者） */}
          <ParentLeadCTA placement="mendan" className="mb-10" />

          {/* 面談前の準備3ステップ */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">面談前に「数値」を準備する3ステップ</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {PREP_STEPS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-bold text-slate-800">{s.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
                    <Link
                      href={s.href}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                      {s.cta}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 印刷できる：先生に聞くことリスト */}
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <MessageCircleQuestion className="h-5 w-5 text-indigo-600" />
                先生に聞くことリスト
              </h2>
              <PrintButton />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm text-slate-500">
                印刷して持参すると、聞き忘れを防げます。気になる項目にチェックを入れてお使いください。
              </p>
              <ul className="space-y-3">
                {QUESTIONS.map((q) => (
                  <li key={q} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                    <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 保護者が準備すること */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
              保護者が面談前に整理しておくこと
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700">
                <li>・志望校の<strong>費用感</strong>（公立・私立の学費、塾代を含む3年間の総額イメージ）</li>
                <li>・<strong>通学範囲</strong>（無理なく通える距離・通学時間）</li>
                <li>・併願（私立）をどこまで受けるか、家庭の方針</li>
                <li>・お子さまの数値（内申点・偏差値・志望校との差）を本人と共有しておく</li>
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                費用は無料の資料請求・無料体験で比較しておくと、選択肢を狭めずに判断できます。
              </p>
              <p className="mt-2 text-xs text-slate-500">
                英語が不安な場合は、
                <AffiliateAd id="moshimo-rewrite" hideLabel linkClassName="font-bold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700" />
                （PR）で受験英語専門の無料相談もできます。
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {MENDAN_FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {faq.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedToolsSection links={RELATED_LINKS} />
        </div>
      </div>
    </>
  );
}
