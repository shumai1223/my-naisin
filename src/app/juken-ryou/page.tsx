import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Receipt, HelpCircle, Wallet } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { JukenRyouCalculator } from '@/components/JukenRyouCalculator';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '高校受験の受験料はいくらですか？',
    answer:
      '公立高校（全日制）の入学者選抜手数料は多くの自治体で2,200円前後です（条例により異なります）。私立高校の受験料は1校あたり15,000〜23,000円程度が目安で、併願校が増えるほど合計額も増えます。インターネット出願で受験料が割引になる学校もあります。',
  },
  {
    question: '模試代は1回いくら、年間でどのくらいかかりますか？',
    answer:
      '公開模試（北辰テスト・Vもぎ・Wもぎ・進研模試など）は1回あたり4,400〜6,000円程度が目安です。中3では年4〜8回受ける家庭が多く、年間で2〜5万円ほどになります。塾の内部模試は授業料に含まれる場合もあります。',
  },
  {
    question: '私立高校に入学する場合の初期費用は？',
    answer:
      '私立高校の入学金は150,000〜300,000円程度が目安で、これに施設費・制服・教材費などが加わります。公立高校の入学料は5,650円前後（自治体による）です。授業料そのものは高校無償化（就学支援金）で軽減される場合があります。詳しくは就学支援金ガイドをご確認ください。',
  },
  {
    question: '受験のお金で、最初に備えておくべきことは？',
    answer:
      '受験料・模試代は受験シーズンに集中して出ていきますが、家計に効くのは入学後の学費（3年総額）です。受験料の試算と合わせて、高校3年間〜大学までの教育費総額と、就学支援金・奨学金で実質負担がどれだけ下がるかを早めに把握しておくと、進路の選択肢を狭めずに準備できます。',
  },
];

export const metadata: Metadata = {
  title: '高校受験の受験料・模試代はいくら？併願校数で変わる費用シミュレーター | My Naishin',
  description:
    '高校受験にかかる受験料（公立の選抜手数料・私立の受験料）と模試代、入学時の初期費用を、併願校数・模試回数から試算できる無料シミュレーター。公立2,200円前後、私立は1校15,000〜23,000円、模試は1回4,400〜6,000円が目安。高校無償化（就学支援金）や教育費総額もまとめて確認できます。',
  keywords: ['高校受験 受験料', '私立高校 受験料', '模試代 相場', '高校 入学金', '受験 費用 高校', '併願 受験料', '高校受験 お金'],
  alternates: { canonical: `${SITE_URL}/juken-ryou` },
  openGraph: {
    title: '高校受験の受験料・模試代シミュレーター｜併願校数で変わる費用',
    description: '公立の選抜手数料・私立の受験料・模試代・入学初期費用を併願校数から試算。高校無償化・教育費総額もまとめて確認。',
    url: `${SITE_URL}/juken-ryou`,
    type: 'website',
  },
};

export default function JukenRyouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'お金・費用まとめ', url: `${SITE_URL}/hiyou` },
          { name: '受験料・模試代シミュレーター', url: `${SITE_URL}/juken-ryou` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hiyou" className="hover:text-blue-600">お金・費用まとめ</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">受験料・模試代</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Receipt className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校受験の受験料・模試代はいくら？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              受験シーズンに実際に出ていくお金（公立の選抜手数料・私立の受験料・模試代・入学初期費用）を、
              <strong>併願校数と模試回数から</strong>その場で試算できます。すべて無料・登録不要です。
            </p>
          </header>

          {/* 答え先出し（GEO/AnswerBox 的に要点を冒頭で） */}
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h2 className="mb-2 text-sm font-bold text-emerald-900">先に結論（費用の目安）</h2>
            <ul className="space-y-1 text-sm leading-relaxed text-emerald-900">
              <li>・公立高校の選抜手数料：<strong>2,200円前後</strong>（自治体による）</li>
              <li>・私立高校の受験料：<strong>1校あたり15,000〜23,000円</strong>（併願校数ぶん）</li>
              <li>・公開模試：<strong>1回あたり4,400〜6,000円</strong>（中3で年4〜8回が目安）</li>
              <li>・入学金：公立 5,650円前後／私立 <strong>15万〜30万円</strong>（施設費等は別途）</li>
            </ul>
          </div>

          {/* Calculator */}
          <JukenRyouCalculator />

          {/* 保護者リード（学費面＝権限ズレ0・FP無料相談） */}
          <div className="mt-6">
            <ParentLeadCTA
              placement="hiyou"
              heading="受験料の先にある「入学後のお金」、見通しは立っていますか？"
              body="受験料・模試代はスポットの出費ですが、家計に効くのは入学後の学費（3年〜大学の総額）です。我が家はいくら必要か・就学支援金や奨学金で実質負担がどれだけ下がるかを、教育資金に詳しい専門家FPへ無料で相談できます（その場で契約を迫られることはありません）。"
            />
          </div>

          {/* 学費クラスタへの回遊 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Wallet className="h-5 w-5 text-emerald-600" />
              入学後のお金もまとめて把握する
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の学費・教材費・通学費の総額' },
                { href: '/kyouiku-hi', title: '教育費シミュレーター', desc: '中学〜高校卒業までの総額を内訳つきで試算' },
                { href: '/shinro-hiyou', title: '高校〜大学の教育費（進路別）', desc: '就学支援金込みで卒業までの総額を概算' },
                { href: '/shougakukin', title: '高校無償化・就学支援金ガイド', desc: '世帯年収別の支援額と実質負担の目安' },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                >
                  <span>
                    <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-700">{c.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
              よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <ToolClusterNav current="hiyou" className="mt-8" />
        </div>
      </div>
    </>
  );
}
