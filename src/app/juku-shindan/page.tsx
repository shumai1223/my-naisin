import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Search } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { JukuShindanClient } from '@/components/JukuShindan/JukuShindanClient';
import { SITE_URL } from '@/lib/naishin-dataset';

const SHINDAN_FAQS = [
  {
    question: '塾は集団・個別・家庭教師・オンラインのどれを選べばいいですか？',
    answer:
      'お子さまの状況で向き不向きが変わります。競争環境で伸びるタイプは集団塾、苦手をピンポイントで埋めたいなら個別指導や家庭教師、送迎や通塾時間を省きたい・全国どこでも受けたいならオンラインが向いています。難関校志望なら学習コーチング型、登校が難しい場合は不登校専門のオンライン個別という選択肢もあります。当ページの診断では、県・学年・目標との差・希望形態・状況から、提携中の塾の中で条件に合うものだけを表示します。',
  },
  {
    question: 'この診断は何をもとにおすすめしていますか？',
    answer:
      '入力いただいた「都道府県・学年・志望校の目標との差・希望する形態（対面/オンライン）・お子さまの状況」をもとに、提携中の塾・家庭教師の中から条件に合うものを表示しています。表示するのは対応地域・形態・無料体験の有無といった確認できる事実のみで、合否や成績の保証はしていません。最終的な比較は、各塾の無料体験・無料相談で確かめるのがおすすめです。',
  },
  {
    question: '不登校でも通える塾はありますか？',
    answer:
      '在宅で学べるオンラインの個別指導や、不登校生向けのオンラインフリースクールなど、お子さまのペースに合わせて先生が伴走する学びの場があります。診断で「不登校・登校が難しい」を選ぶと、そうした不登校対応の選択肢だけを表示します。まずは無料体験・無料の資料請求で雰囲気を確かめてみてください。',
  },
  {
    question: '無料体験や無料相談は本当に無料ですか？',
    answer:
      '当ページで案内しているのは、各塾・家庭教師が提供する無料体験・無料相談・無料の資料請求です。体験や相談の時点で費用はかからず、その場で契約を迫られることもありません。実際に入塾するかどうかは、体験してからご家庭でゆっくり判断できます。',
  },
];

export const metadata: Metadata = {
  title: '塾診断｜結果に合う塾・家庭教師を無料で診断【高校受験・中学生】| My Naishin',
  description:
    '都道府県・学年・志望校との差・希望する形態（対面/オンライン）・状況を選ぶだけで、お子さまに合う塾・家庭教師を無料で診断。提携中の塾の中から条件に合うものだけを表示し、無料体験・無料相談へつなぎます。難関校・不登校の相談にも対応。',
  keywords: [
    '塾 診断',
    '塾 選び方',
    '塾 おすすめ 中学生',
    '個別指導 オンライン 比較',
    '家庭教師 診断',
    '不登校 塾',
    '高校受験 塾',
  ],
  alternates: { canonical: `${SITE_URL}/juku-shindan` },
  openGraph: {
    title: '塾診断｜結果に合う塾・家庭教師を無料で診断【高校受験】| My Naishin',
    description:
      '県・学年・目標との差・形態・状況から、お子さまに合う塾を無料診断。提携中の塾の無料体験・無料相談へ。',
    url: `${SITE_URL}/juku-shindan`,
    type: 'website',
  },
};

const RELATED_LINKS = [
  { href: '/juku-hiyou', title: '塾代シミュレーター', desc: '集団・個別・家庭教師の月謝相場と3年間の総額を試算。' },
  { href: '/mendan', title: '三者面談 準備チェックリスト', desc: '面談の前に「現在地」を整理。先生に聞くことリストつき。' },
  { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式で換算内申を計算。' },
  { href: '/hensachi', title: '偏差値を計算する', desc: '点数と平均点から偏差値を算出。志望校レンジも。' },
  { href: '/reverse', title: '志望校から逆算する', desc: '目標校から必要な内申点・当日点を逆算。' },
  { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・親ができることを整理。' },
];

export default function JukuShindanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '塾診断', url: `${SITE_URL}/juku-shindan` },
        ]}
      />
      <FAQPageSchema faqItems={SHINDAN_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">塾診断</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">塾診断｜結果に合う塾を無料で診断</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              都道府県・学年・<strong>志望校の目標との差</strong>・希望する形態・お子さまの状況を選ぶだけ。
              提携中の塾・家庭教師の中から、<strong>条件に合うものだけ</strong>を表示します。無料体験・無料相談のみで、費用はかかりません。
            </p>
          </header>

          {/* 診断ツール本体 */}
          <JukuShindanClient />

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {SHINDAN_FAQS.map((faq) => (
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

          <RelatedToolsSection className="mt-10" links={RELATED_LINKS} />
        </div>
      </div>
    </>
  );
}
