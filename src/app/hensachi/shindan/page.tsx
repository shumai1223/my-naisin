import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ShindanResultFlow } from '@/components/Hensachi/ShindanResultFlow';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SHINDAN_GRADE_CONTENTS } from '@/lib/shindan-grade-content';
import { SHINDAN_PURPOSE_CONTENTS } from '@/lib/shindan-purpose-content';
import { SITE_URL } from '@/lib/naishin-dataset';

const SHINDAN_FAQS = [
  {
    question: '偏差値診断は点数が分からなくても使えますか？',
    answer: 'はい。この偏差値診断は、テストの点数・平均点・標準偏差が分からなくても、「順位はだいたいどのくらいか」など5つの質問に答えるだけで偏差値の目安を算出します。正確な点数が分かる場合は、偏差値計算サイトで30秒で正確な偏差値を計算できます。',
  },
  {
    question: 'この診断はどうやって偏差値を推定していますか？',
    answer: '「テストの順位はだいたいどのくらいか」という自己申告の回答を、偏差値計算サイトと同じ正規分布の数式（平均50・標準偏差10）に当てはめて偏差値の目安を算出しています。特別な統計モデルや独自の判定基準を使っているわけではなく、既存の偏差値計算と同じ数式です。',
  },
  {
    question: '診断結果の偏差値は本当の偏差値と同じですか？',
    answer: 'いいえ、あくまで目安です。自己申告の順位バンドから逆算しているため、実際の模試で正確な点数・平均点・標準偏差を使って計算した偏差値とはズレることがあります。正確な値は偏差値計算サイトでの計算をおすすめします。',
  },
  {
    question: '中学生向けの診断ですか？高校生も使えますか？',
    answer: '主に中学生（高校受験）向けに設計していますが、考え方自体は高校生の模試にも応用できます。学年は中1・中2・中3から選択してください。',
  },
];

export const metadata: Metadata = {
  title: '偏差値診断【点数不要・5問】あなたの今の立ち位置がわかる中学生向け | My Naishin',
  description:
    '点数・平均点が分からなくても大丈夫。学年・順位の感覚・都道府県・評定・気になっていることの5つの質問に答えるだけで、偏差値の目安と届く高校レベルを無料診断。次の一手（偏差値の上げ方・塾診断）まで案内します。',
  keywords: ['偏差値診断', '偏差値診断 中学生', '診断 中学生', '高校偏差値診断', '偏差値 テスト 無料', '偏差値 チェック'],
  alternates: { canonical: `${SITE_URL}/hensachi/shindan` },
  openGraph: {
    title: '偏差値診断【点数不要・5問】あなたの今の立ち位置がわかる | My Naishin',
    description: '点数が分からなくても5つの質問に答えるだけで偏差値の目安と届く高校レベルを診断。',
    url: `${SITE_URL}/hensachi/shindan`,
    type: 'website',
  },
};

const RELATED_LINKS = [
  { href: '/hensachi', title: '偏差値を正確に計算する', desc: '点数・平均点・標準偏差から30秒で正確な偏差値を算出。' },
  { href: '/hensachi/shiboukou', title: '偏差値→志望校レンジ逆引き', desc: '偏差値から安全圏・実力相応・チャレンジの3段階を確認。' },
  { href: '/hensachi/agekata', title: '偏差値の上げ方', desc: '偏差値を上げる具体的な5つの方法を解説。' },
  { href: '/juku-shindan', title: '塾診断（無料）', desc: '条件に合う塾・家庭教師を無料診断。無料体験へ。' },
  { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式で換算内申を計算。' },
];

export default function HensachiShindanPage() {
  return (
    <>
      <WebApplicationSchema
        name="偏差値診断 | My Naishin"
        description="点数が分からなくても、5つの質問に答えるだけで偏差値の目安と届く高校レベルを診断する無料ツール。"
        url={`${SITE_URL}/hensachi/shindan`}
        featureList={[
          '点数不要・5つの質問だけで診断',
          '偏差値の目安を正規分布の数式で算出',
          '内申（評定）との整合性チェック',
          '届く高校レベルを3段階で表示',
          '次の一手（偏差値の上げ方・塾診断）へ直結',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '偏差値診断', url: `${SITE_URL}/hensachi/shindan` },
        ]}
      />
      <HowToSchema
        id="howto-hensachi-shindan"
        name="点数が分からなくても偏差値の目安を診断する方法"
        description="学年・順位の感覚・都道府県・評定・気になっていることの5つの質問から偏差値の目安を診断する手順。"
        totalTime="PT1M"
        steps={[
          { name: '学年を選ぶ', text: '中1・中2・中3から選択します。' },
          { name: 'テストの順位の感覚を選ぶ', text: '正確な点数が分からなくても、だいたいの順位の感覚を選びます。' },
          { name: '都道府県を選ぶ', text: 'お住まいの都道府県を選択します。' },
          { name: '評定（通知表）の感覚を選ぶ', text: 'オール3・オール4など、だいたいの評定を選びます。' },
          { name: '気になっていることを選ぶ', text: '志望校のレベル・偏差値の上げ方・塾選びなど、今一番気になることを選びます。' },
          { name: '結果を確認する', text: '偏差値の目安・内申との整合性・届く高校レベル・次の一手が表示されます。' },
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
            <Link href="/hensachi" className="hover:text-blue-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">偏差値診断</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              偏差値診断【点数不要・中学生向け】
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              点数・平均点が分からなくても大丈夫。<strong>5つの質問</strong>に答えるだけで、
              偏差値の目安・届く高校レベル・次にやるべきことがわかります。
            </p>
          </header>

          {/* 診断ツール本体 */}
          <ShindanResultFlow />

          {/* 学年別で診断する */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">学年別で診断する</h2>
            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              学年ごとに診断結果の使い方（志望校の見通し・内申とのバランス確認など）が変わります。あらかじめ学年を選んだ状態で診断したい場合はこちらから。
            </p>
            <div className="flex flex-wrap gap-2">
              {SHINDAN_GRADE_CONTENTS.map((g) => (
                <Link
                  key={g.slug}
                  href={`/hensachi/shindan/${g.slug}`}
                  className="rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-50"
                >
                  {g.label}向け診断
                </Link>
              ))}
            </div>
          </section>

          {/* 目的別で診断する */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">目的別で診断する</h2>
            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              「志望校を決めたい」「内申を挽回したい」「塾に通うか迷っている」など、今知りたいことに合わせて診断したい場合はこちらから。
            </p>
            <div className="flex flex-wrap gap-2">
              {SHINDAN_PURPOSE_CONTENTS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/hensachi/shindan/mokuteki/${p.slug}`}
                  className="rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-50"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </section>

          {/* 偏差値クラスタのハブ */}
          <div className="mt-8">
            <HensachiClusterNav current="shindan" />
          </div>

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
