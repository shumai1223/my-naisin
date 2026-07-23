import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Wallet, Calculator, HandCoins, School, GraduationCap, HelpCircle, Info, Receipt } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTAExperiment } from '@/components/ParentLeadCTAExperiment';
import { SITE_URL } from '@/lib/naishin-dataset';

type Card = {
  href: string;
  title: string;
  desc: string;
  icon: typeof Wallet;
  external?: boolean;
};

const CARDS: Card[] = [
  {
    href: '/kyouiku-hi',
    title: '教育費シミュレーター（中学〜高校卒業）',
    desc: '現在の学年・進路・塾の形態から、高校卒業までの教育費総額を内訳つきで概算',
    icon: Wallet,
  },
  {
    href: '/shinro-hiyou',
    title: '高校〜大学の教育費（進路別）',
    desc: '高校・世帯年収・大学(国公立/私立)・自宅か下宿かから、卒業までの総額を就学支援金込みで概算',
    icon: GraduationCap,
  },
  {
    href: '/koukou-hiyou',
    title: '高校の費用シミュレーター',
    desc: '公立・私立の高校3年間にかかる学費・教材費・通学費の総額を試算',
    icon: School,
  },
  {
    href: '/juku-hiyou',
    title: '塾代シミュレーター',
    desc: '集団塾・個別指導・家庭教師の月謝相場と、受験までの総額の目安',
    icon: Calculator,
  },
  {
    href: '/juken-ryou',
    title: '受験料・模試代シミュレーター',
    desc: '公立の選抜手数料・私立の受験料・模試代・入学初期費用を併願校数から試算',
    icon: Receipt,
  },
  {
    href: '/shougakukin',
    title: '高校無償化・就学支援金ガイド',
    desc: '公立・私立別の支援額、世帯年収の目安、奨学給付金・大学の奨学金まで解説',
    icon: HandCoins,
  },
  {
    href: 'https://my-shingaku.com/gakuhi',
    title: '大学進学の費用（姉妹サイト）',
    desc: '国立・私立の学費、一人暮らしの生活費、奨学金の目安（My Shingaku）',
    icon: GraduationCap,
    external: true,
  },
];

const FAQS = [
  {
    question: '高校受験にかかるお金は、何から把握すればいいですか？',
    answer:
      'まず「教育費シミュレーター」で中学〜高校卒業までの総額の全体像をつかみ、次に「高校の費用」「塾代」で進路別・形態別に詳しく試算するのがおすすめです。授業料の負担は「高校無償化・就学支援金ガイド」で軽減できる金額を確認できます。早めに全体像を把握しておくと、進路の選択肢を狭めずに準備できます。',
  },
  {
    question: 'これらのツールは無料ですか？登録は必要ですか？',
    answer:
      'すべて完全無料・会員登録不要で使えます。数値は文部科学省「子供の学習費調査」などの一次データに基づく目安で、ご家庭の実額に合わせて編集することもできます。',
  },
  {
    question: '私立高校はどのくらいお金がかかりますか？',
    answer:
      '私立高校は学習費総額が年約105万円（公立は約51万円）で、3年間では約340万円が目安です。ただし高校無償化（就学支援金）で世帯年収の区分に応じて授業料が軽減されるため、実支出はこれより小さくなる場合があります。「高校の費用」「就学支援金ガイド」で具体的な金額を確認できます。',
  },
];

export const metadata: Metadata = {
  title: '高校受験・進学にかかるお金まとめ｜教育費・学費・塾代・無償化【2026年】| My Naishin',
  description:
    '高校受験・進学にかかるお金を無料でまとめて把握。教育費の総額シミュレーター、公立・私立の高校費用、塾代の相場、高校無償化・就学支援金の支援額、大学進学費用まで、文部科学省の一次データに基づいて確認できます。会員登録不要。',
  keywords: ['高校 費用 まとめ', '教育費 シミュレーション', '高校 学費', '塾代 相場', '高校無償化', '進学 費用'],
  alternates: { canonical: `${SITE_URL}/hiyou` },
  openGraph: {
    title: '高校受験・進学にかかるお金まとめ｜教育費・学費・塾代・無償化 | My Naishin',
    description: '教育費の総額・高校費用・塾代・高校無償化・大学費用を、文科省データで無料確認。',
    url: `${SITE_URL}/hiyou`,
    type: 'website',
  },
};

export default function HiyouHubPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'お金・費用まとめ', url: `${SITE_URL}/hiyou` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '高校受験・進学にかかるお金のツール・ガイド一覧',
            numberOfItems: CARDS.length,
            itemListElement: CARDS.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.title,
              url: c.external ? c.href : `${SITE_URL}${c.href}`,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">お金・費用まとめ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-600 text-white shadow-xl">
              <Wallet className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校受験・進学にかかるお金まとめ</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              教育費の総額・高校の学費・塾代・高校無償化（就学支援金）・大学費用まで。
              <strong>文部科学省の一次データ</strong>に基づき、進路にかかるお金を無料でまとめて把握できます。
            </p>
          </header>

          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                      {c.title}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.desc}</p>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* 保護者リード（hiyou-copy-2026・2026-06-17running開始も配線漏れで無データだったA/Bを2026-07-24接続） */}
          <ParentLeadCTAExperiment experimentId="hiyou-copy-2026" placement="hiyou" className="mb-10" />

          {/* なぜ早めに把握するか */}
          <section className="mb-10 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-indigo-500" />
              早めにお金の全体像を把握するメリット
            </h2>
            <p className="leading-relaxed text-slate-700">
              教育費は「いつ・いくら必要か」が見えていないと、進路選択や塾の利用をためらいがちです。
              高校3年間だけでも公立で約165万円・私立で約340万円かかり、塾代・大学費用を加えると数百万円規模になります。
              一方で、高校無償化（就学支援金）や奨学給付金で授業料の負担は大きく軽減できます。
              先に総額と支援額を見える化しておくと、<strong>お子さまの選択肢を狭めずに</strong>準備を進められます。
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-indigo-600" />よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
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

          {/* 関連ハブ */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">内申点を計算する（都道府県別）</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/tools" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">すべての受験ツールを見る</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hogosha" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">保護者の方へ</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/mendan" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">三者面談の準備チェックリスト</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
