import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HokkaidoRankResultFlow } from '@/components/Hokkaido/HokkaidoRankResultFlow';

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const HOKKAIDO_RANK_FAQS = [
  {
    question: '内申ランクとは何ですか？',
    answer:
      '内申ランクとは、北海道公立高校入試で使われる内申点（315点満点）を20点刻みでA〜Mの13段階に分類した指標です。Aランクが最上位（296〜315点）、Mランクが最下位（0〜75点）。志望校の合格判定にランクと学力検査の組み合わせが使われます。',
  },
  {
    question: '札幌南に合格するには何ランクが必要？',
    answer:
      '札幌南・札幌北などの最上位校はAランク（内申点296以上）が望ましく、学力検査でも270点以上が目安です。Bランク（276〜295）でも当日点が高ければ合格圏内です。',
  },
  {
    question: '中1からランクは決まる？',
    answer:
      '北海道の内申点は中1〜中3の3年間の成績を、2:2:3の比重で合算します。中3の比重が大きいですが、中1・中2の評定も無視できない比重を持つため、中1の最初の定期テストから内申点に影響します。',
  },
];

export const metadata: Metadata = {
  title: '北海道の内申ランク判定｜315点満点をA〜M全13段階に自動変換【無料・2026】 | My Naishin',
  description: '【無料】北海道の内申点（中1:中2:中3=2:2:3で合算した315点満点）から、A（296点以上）〜M（75点以下）の内申ランクを30秒で自動判定。学力検査点とあわせて札幌南・札幌北など主要校の合格目安とも比較できます。2026年度入試対応。',
  keywords: ['北海道 内申ランク', '北海道 ランク 計算', '北海道 公立高校', 'Aランク', 'Bランク', '札幌南', '札幌北', '内申点 北海道'],
  alternates: {
    canonical: 'https://my-naishin.com/hokkaido/rank',
  },
  openGraph: {
    title: '北海道の内申ランク判定｜315点満点をA〜M全13段階に自動変換【無料・2026】 | My Naishin',
    description: '北海道公立高校入試の内申ランクを瞬時に判定。主要校の合格目安と比較可能。',
    url: 'https://my-naishin.com/hokkaido/rank',
  },
};

export default function HokkaidoRankPage() {
  return (
    <>
      <WebApplicationSchema
        name="北海道 内申ランク判定 | My Naishin"
        description="北海道公立高校入試の内申ランク（A〜M）を瞬時に判定。志望校の合格目安と比較。"
        url="https://my-naishin.com/hokkaido/rank"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '北海道', url: 'https://my-naishin.com/hokkaido' },
          { name: '内申ランク判定', url: 'https://my-naishin.com/hokkaido/rank' },
        ]}
      />
      <HowToSchema
        id="howto-hokkaido-rank"
        name="北海道 内申ランク（A〜M）を判定する方法"
        description="北海道公立高校入試の合否判定に使われる内申ランクを、内申点と学力検査点から自動算出する手順。"
        totalTime="PT1M"
        steps={[
          { name: '内申点（315点満点）を入力', text: '中1×2 + 中2×2 + 中3×3の重みで計算された内申点（315点満点）を入力します。' },
          { name: '学力検査点（300点満点）を入力', text: '5教科×60点の合計点（300点満点）を入力します。' },
          { name: 'ランクと合格目安を確認', text: 'Aランク（最上位）〜Mランク（要努力）のどこに該当するかが瞬時に判定され、札幌南・札幌北など主要高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={HOKKAIDO_RANK_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hokkaido" className="hover:text-blue-600">北海道</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申ランク判定</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              北海道 内申ランク（A〜M）判定ツール
            </h1>
            <div className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              A〜M 13ランク・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              北海道公立高校入試で使われる「内申ランク」を瞬時に判定。<br />
              内申点・学力検査点から、Aランク〜Mランクのどこに該当するかと志望校との距離を確認できます。
            </p>
          </header>

          {/* ランクの仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              北海道の内申ランクA〜Mとは？
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              北海道公立高校入試では、内申点（315点満点）をAランク〜Mランクの13段階に分類し、志望校の合否判定に使います。<strong>Aランクが最上位、Mランクが最下位</strong>で、各ランクは20点刻みで区切られています。学力検査（300点満点）と合わせた総合点で合否が判定されます。
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">ランク</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">内申点（315点満点）</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">該当校レベル</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-red-700">Aランク</td><td className="border border-slate-200 px-3 py-2 text-right">296〜315</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌南・札幌北</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-red-600">Bランク</td><td className="border border-slate-200 px-3 py-2 text-right">276〜295</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌西・札幌東・札幌旭丘</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-orange-700">Cランク</td><td className="border border-slate-200 px-3 py-2 text-right">256〜275</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌月寒・札幌国際情報</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-orange-600">Dランク</td><td className="border border-slate-200 px-3 py-2 text-right">236〜255</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌北陵・札幌新川</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-amber-700">Eランク</td><td className="border border-slate-200 px-3 py-2 text-right">216〜235</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌啓成・市立札幌藻岩</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-amber-600">Fランク</td><td className="border border-slate-200 px-3 py-2 text-right">196〜215</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌平岸・札幌東陵</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-emerald-700">Gランク</td><td className="border border-slate-200 px-3 py-2 text-right">176〜195</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌厚別・札幌真栄</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-emerald-600">Hランク</td><td className="border border-slate-200 px-3 py-2 text-right">156〜175</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌東豊・市立札幌啓北商業</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-blue-700">Iランク</td><td className="border border-slate-200 px-3 py-2 text-right">136〜155</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌白石・札幌東商業</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-blue-600">Jランク</td><td className="border border-slate-200 px-3 py-2 text-right">116〜135</td><td className="border border-slate-200 px-3 py-2 text-xs">下位中堅校</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-slate-700">Kランク</td><td className="border border-slate-200 px-3 py-2 text-right">96〜115</td><td className="border border-slate-200 px-3 py-2 text-xs">札幌琴似工業など</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-slate-600">Lランク</td><td className="border border-slate-200 px-3 py-2 text-right">76〜95</td><td className="border border-slate-200 px-3 py-2 text-xs">基礎下位</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold text-slate-500">Mランク</td><td className="border border-slate-200 px-3 py-2 text-right">0〜75</td><td className="border border-slate-200 px-3 py-2 text-xs">要努力</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Calculator＋結果連動の名簿導線（B-5：SaveResultCTAが無かった穴を埋める） */}
          <HokkaidoRankResultFlow />

          {/* 内申点の計算式 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-emerald-500" />
              北海道の内申点・総合点の計算式
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">内申点（315点満点）の計算式</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    内申点 ＝ 中1の評定合計×2 ＋ 中2の評定合計×2 ＋ 中3の評定合計×3
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 9教科×5段階評価 × 学年倍率（2:2:3）で最大315点。中3の比重が大きい。詳細は<Link href="/hokkaido/naishin" className="text-blue-600 underline">北海道の内申点計算</Link>もご利用ください。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">総合点（615点満点）</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    総合点 ＝ 内申点（315点） ＋ 学力検査点（300点）
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 学力検査は5教科×60点で300点満点。総合点が高い順に合格者が決まります。
                </p>
              </div>
            </div>
          </section>

          {/* 2タッチ目：AI個別指導（下のParentLeadCTAとは別プログラムで多様性確保。旧Z会/サプリ¥1.5-5.4/clickの代替） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              AIが弱点を自動分析する個別指導
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              <AffiliateAd id="atama-text" hideLabel />（PR）の無料体験で、今の学力に必要な対策を確認できます。
            </div>
            <AffiliateAd id="atama-banner" />
          </section>

          {/* 保護者向けリード（換金の本命：オンライン個別の無料体験送客。旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mt-8"
            heading="北海道の志望校、内申ランクはあと何点で上がりますか？"
            body="ランクは中1〜中3の評定で決まり、残りの定期テストでまだ動きます。お子さまにいま必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 内申ランクとは何ですか？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  内申ランクとは、北海道公立高校入試で使われる内申点（315点満点）を20点刻みでA〜Mの13段階に分類した指標です。Aランクが最上位（296〜315点）、Mランクが最下位（0〜75点）。志望校の合格判定にランクと学力検査の組み合わせが使われます。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 札幌南に合格するには何ランクが必要？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  札幌南・札幌北などの最上位校はAランク（内申点296以上）が望ましく、学力検査でも270点以上が目安です。Bランク（276〜295）でも当日点が高ければ合格圏内です。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 中1からランクは決まる？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  北海道の内申点は<strong>中1〜中3の3年間</strong>の成績を、2:2:3の比重で合算します。中3の比重が大きいですが、中1・中2の評定も無視できない比重を持つため、中1の最初の定期テストから内申点に影響します。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                本ツールの計算結果は北海道教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href="https://www.dokyoi.pref.hokkaido.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">北海道教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/hokkaido/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">北海道の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hokkaido" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">北海道の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=hokkaido" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">評定平均を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
