import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Target, ShieldCheck, User, Calendar, FileCheck, AlertTriangle, BookOpen } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { HensachiTargetTool } from '@/components/Hensachi/HensachiTargetTool';
import { HIGH_SCHOOL_TIERS } from '@/lib/hensachi';

const TIER_BG: Record<string, string> = {
  red: 'bg-red-50 text-red-700',
  orange: 'bg-orange-50 text-orange-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  teal: 'bg-teal-50 text-teal-700',
  sky: 'bg-sky-50 text-sky-700',
  blue: 'bg-blue-50 text-blue-700',
  slate: 'bg-slate-50 text-slate-700',
};

const FAQS = [
  {
    question: '偏差値から行ける高校はどうやって調べるの？',
    answer: '模試の偏差値を入れると、その偏差値で「安全圏・実力相応・チャレンジ」の3段階で届く高校レベルの目安が分かります。一般的に、安全圏は自分の偏差値より3前後低いレベル、チャレンジは5前後高いレベルが目安です。具体的な学校名は、お住まいの都道府県の入試制度ページや進学塾の偏差値ランキングと併せて確認してください。',
  },
  {
    question: '偏差値50で行ける高校はどのくらいのレベル？',
    answer: '偏差値50はちょうど平均（上位50%）で、一般的には「中堅校」レベルにあたります。内申点では45点満点で30〜36程度が目安です。偏差値47前後の標準校が安全圏、偏差値55前後の中堅上位校がチャレンジ圏の目安になります。',
  },
  {
    question: '偏差値60あればどんな高校に行ける？',
    answer: '偏差値60は上位約16%で、一般的に「上位校」レベルです。内申点45点満点で37〜42程度が目安。地域の人気進学校が射程に入り、偏差値65前後の難関校がチャレンジ圏になります。',
  },
  {
    question: '偏差値と内申点はどう関係していますか？',
    answer: '偏差値（模試での位置）と内申点（通知表の評定の合計）は別々の物差しで、直接の換算式はありません。高校入試の合否は「内申点＋当日の学力検査点の合計」と各都道府県の制度で決まります。当ツールは、同じレベル帯の高校を志望する人にありがちな「偏差値と内申点の組み合わせ」を並べて表示する目安です。',
  },
  {
    question: '志望校の合格ボーダーはこのツールで分かる？',
    answer: 'いいえ。当ツールは「偏差値からどのレベル帯の高校が射程か」という一般的な目安を示すもので、特定校の合格ボーダーラインは扱いません。学校別の難易度は地域・年度で変動するため、最新の模試判定や学校の先生、各都道府県の入試制度ページで確認してください。',
  },
];

export const metadata: Metadata = {
  title: '偏差値から行ける高校がわかる｜志望校レンジ逆引きツール【無料】 | My Naishin',
  description: '【無料】偏差値を入れるだけで「行ける高校」のレベルが分かる逆引きツール。安全圏・実力相応・チャレンジの3段階で表示し、偏差値50・55・60・65で届く高校の目安、偏差値と内申点の関係まで解説。2026年度入試対応・登録不要。',
  keywords: ['偏差値 行ける高校', '偏差値から 高校', '偏差値 高校 レベル', '偏差値50 高校', '偏差値60 高校', '偏差値 志望校', '志望校 偏差値', '偏差値 内申点', '偏差値 逆引き', '偏差値 届く高校'],
  alternates: { canonical: 'https://my-naishin.com/hensachi/shiboukou' },
  openGraph: {
    title: '偏差値から行ける高校がわかる｜志望校レンジ逆引きツール【無料】 | My Naishin',
    description: '偏差値を入れるだけで届く高校レベルを安全圏・実力相応・チャレンジの3段階で表示。偏差値と内申点の関係も解説。',
    url: 'https://my-naishin.com/hensachi/shiboukou',
  },
};

export default function HensachiShiboukouPage() {
  return (
    <>
      <WebApplicationSchema
        name="偏差値→志望校レンジ逆引きツール | My Naishin"
        description="偏差値から届く高校レベルを安全圏・実力相応・チャレンジの3段階で逆引きする無料ツール。"
        url="https://my-naishin.com/hensachi/shiboukou"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
          { name: '偏差値→志望校レンジ逆引き', url: 'https://my-naishin.com/hensachi/shiboukou' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <DatasetSchema
        name="偏差値→高校レベル（難易度バンド）対応表"
        description="偏差値を高校の難易度レベル（最難関・難関・上位・中堅・標準・基礎）に対応づけた一般的な目安バンド表。各レベルの内申点（45点満点）の目安も併記。特定校のボーダーではなく、一般に公開された区分に基づく参照データ。"
        url="https://my-naishin.com/hensachi/shiboukou#tier-table"
        variableMeasured={['偏差値バンド', '高校レベル', '内申点(45点満点)の目安']}
        keywords={['偏差値 高校 レベル', '偏差値50 高校', '偏差値60 高校', '偏差値 内申点 目安']}
        citation="高校受験の偏差値ランキング・進学塾公開資料で広く共有される一般的な難易度区分。"
        dateModified="2026-06-12"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">志望校レンジ逆引き</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">偏差値から行ける高校がわかる</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              いまの<strong>模試の偏差値</strong>を入れるだけで、届く高校のレベルを<strong>安全圏・実力相応・チャレンジ</strong>の3段階で表示。
              偏差値と内申点の関係もその場で確認できます。
            </p>
          </header>

          {/* E-E-A-T カード */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-bold text-slate-800">監修・運営：しゅうまい</div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    2026年度受験生
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  レンジ判定は正規分布に基づく数学的な算出と、一般的な受験指導の経験則（安全圏≒−3／チャレンジ≒+5）に基づきます。特定校のボーダーは扱いません。
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />最終更新：2026年6月12日</span>
                  <span className="flex items-center gap-1"><FileCheck className="h-3 w-3" />算出根拠：正規分布＋一般的な難易度区分</span>
                </div>
              </div>
            </div>
          </div>

          {/* ツール */}
          <HensachiTargetTool />

          {/* 即効レバー：保護者リード */}
          <div className="mt-6">
            <ParentLeadCTA
              heading="このレンジの高校、本当に届く？保護者の方へ"
              body="偏差値の「いまの位置」と「志望校との差」は、対策しだいで十分に動きます。お子さまに必要な勉強を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
              affiliateId="atama-text"
              ctaText="無料で資料・体験を申し込む"
              note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
            />
          </div>

          {/* 堀A：名簿化 */}
          <div className="mt-6">
            <SaveResultCTA source="hensachi-shiboukou" />
          </div>

          {/* 偏差値→高校レベル対応表 */}
          <section id="tier-table" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-lg font-bold text-slate-800">
              偏差値→高校レベル 対応表【偏差値40〜70】
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              偏差値がどの難易度帯の高校に対応するかの一般的な目安です。あわせて、その帯の高校がよく見ている<strong>内申点（45点満点）</strong>の目安も並置しています。
              <span className="mt-1 block text-xs text-slate-500">※特定校の合否ラインではありません。実際の合否は内申点＋当日点の合計と各都道府県の制度で決まります。</span>
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="border border-purple-400 px-3 py-2 text-left font-bold">偏差値</th>
                    <th className="border border-purple-400 px-3 py-2 text-left font-bold">高校レベルの目安</th>
                    <th className="border border-purple-400 px-3 py-2 text-center font-bold whitespace-nowrap">内申(45点満点)</th>
                    <th className="border border-purple-400 px-3 py-2 text-left font-bold">イメージ</th>
                  </tr>
                </thead>
                <tbody>
                  {HIGH_SCHOOL_TIERS.map((t) => (
                    <tr key={t.id} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800 whitespace-nowrap">
                        {t.max === null ? `${t.min}〜` : `${t.min}〜${t.max - 1}`}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${TIER_BG[t.colorClass]}`}>{t.label}</span>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700 whitespace-nowrap">{t.naishin45}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-600">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 注意点 */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">レンジ判定の使い方</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-800">
                  <li>• 偏差値は模試の種類・母集団で変わります。複数回・同じ模試の平均で見るのがおすすめです。</li>
                  <li>• 「レベル帯」は一般的な区分です。具体的な学校名・合格ラインは最新の模試判定や学校の先生にご確認ください。</li>
                  <li>• 内申点の比重は都道府県で大きく異なります。内申重視の地域では、偏差値が届いていても内申で差がつくことがあります。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* クラスタナビ */}
          <div className="mt-8">
            <HensachiClusterNav current="shiboukou" />
          </div>

          {/* 都道府県別の内申計算 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">志望校が決まったら、内申点もチェック</h2>
            <p className="mb-4 text-xs text-slate-500">偏差値で候補を絞ったら、お住まいの都道府県の方式で内申点も計算しておきましょう。</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { code: 'tokyo', name: '東京都' },
                { code: 'kanagawa', name: '神奈川県' },
                { code: 'chiba', name: '千葉県' },
                { code: 'saitama', name: '埼玉県' },
                { code: 'osaka', name: '大阪府' },
                { code: 'aichi', name: '愛知県' },
              ].map((pref) => (
                <Link
                  key={pref.code}
                  href={`/${pref.code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-100"
                >
                  {pref.name}の内申計算
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </Link>
              ))}
            </div>
            <div className="mt-3 text-center">
              <Link href="/prefectures" className="text-sm font-bold text-purple-600 hover:underline">47都道府県すべての入試制度を見る →</Link>
            </div>
          </section>

          {/* アフィリエイト（旧Z会/サプリ¥1.5-5.4/clickは撤去し、全国オンライン個別¥84/clickへ） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="mb-1 text-sm font-bold text-slate-700">志望校との差を、効率よく埋める</div>
            <div className="mb-4 text-xs leading-relaxed text-slate-500">
              苦手教科だけをピンポイントで底上げする<AffiliateAd id="sora-juku-text" hideLabel />（PR）。無料体験あり。
            </div>
            <AffiliateAd id="sora-juku-banner" />
          </section>

          {/* FAQ */}
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

          {/* 関連コラム */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連コラム</h2>
            <div className="space-y-3">
              {[
                { slug: 'hensachi-koukou-ichiran-2026', title: '偏差値別 行ける高校一覧【2026年最新】偏差値40〜70の公立・私立' },
                { slug: 'all-3-high-school-options-2026-update', title: 'オール3（内申27）で行ける高校と逆転戦略【2026年】' },
                { slug: 'how-to-choose-high-school-2026', title: '失敗しない高校の選び方【2026年版】偏差値だけで決めない' },
              ].map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="group flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:border-purple-200 hover:bg-purple-50">
                  <BookOpen className="h-4 w-4 shrink-0 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">{a.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-purple-500" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
