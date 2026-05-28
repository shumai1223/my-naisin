import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, TrendingUp, Award, User, Calendar, ShieldCheck, FileCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HyoteiHeikinCalculator } from '@/components/HyoteiHeikin/HyoteiHeikinCalculator';

const HYOTEI_FAQS = [
  {
    question: '評定平均と内申点の違いは？',
    answer: '「評定平均」は1教科あたりの平均値（4.2など）、「内申点（素内申）」は合計値（38など）で表現します。同じ通知表データを別の形で表したものです。当ツールでは両方を同時に確認できます。',
  },
  {
    question: '評定平均はいつの通知表を使う？',
    answer: '推薦入試では、中学3年の1学期または前期の成績を使うのが一般的です。一般入試で使う「内申点」は都道府県により異なり、中3のみ／中1〜3まで幅広く対象になる場合があります。',
  },
  {
    question: '評定平均は5段階？10段階？',
    answer: '公立中学校では原則として5段階評価が使われています。一部の私立中学では10段階を使うこともありますが、高校入試の調査書では5段階に換算されます。',
  },
  {
    question: '評定平均4.0で行ける高校は？',
    answer: '評定平均4.0は全中学生の上位30%圏内、偏差値換算で55〜62相当です。公立中堅上位校（駒場・小山台・松陽など）、私立の特進コース・準特進コース併願が現実的なターゲットになります。',
  },
  {
    question: '評定平均3.5で行ける高校は？',
    answer: '評定平均3.5は偏差値換算で48〜53相当。公立中堅校（偏差値50前後）、私立進学コース併願が現実的です。首都圏私立の併願優遇制度の最低基準（3.5以上）にちょうど合致します。',
  },
  {
    question: '評定平均はどう上げる？',
    answer: '①提出物を期限内＋丁寧に出す、②授業中の発言で「主体性」評価を上げる、③定期テストで安定して平均点+10点を取る、④実技4教科で「3→4」を狙う、⑤先生に質問する習慣を作る、の5つが効果的です。',
  },
  {
    question: '評定平均は推薦入試でどう使われる？',
    answer: '公立高校の推薦入試では「評定平均◯以上」が出願基準として明示されます。上位校で4.0〜4.5以上、中堅校で3.3〜3.8以上が基準。私立の併願優遇制度でも評定平均が出願基準になります。',
  },
];

export const metadata: Metadata = {
  title: '評定平均 計算サイト【中学生対応・無料】通知表から30秒で自動算出 | My Naishin',
  description: '【無料】評定平均 計算サイト。9教科の評定を入れるだけで、中学生の評定平均（4.2など）と素内申を30秒で自動算出。高校入試の推薦基準や私立併願優遇の出願目安にも対応。2026年最新版。',
  keywords: ['評定平均 計算サイト', '評定平均 計算', '評定平均 自動計算', '評定平均 中学生', '評定平均 自動計算 中学生', '通知表 平均', '内申点 評定平均', '素内申'],
  alternates: {
    canonical: 'https://my-naishin.com/hyotei-heikin',
  },
  openGraph: {
    title: '評定平均 計算サイト【中学生対応・無料】通知表から30秒で自動算出 | My Naishin',
    description: '9教科の評定から評定平均と素内申を瞬時に計算。中学生向け無料ツール。',
    url: 'https://my-naishin.com/hyotei-heikin',
  },
};

export default function HyoteiHeikinPage() {
  return (
    <>
      <WebApplicationSchema
        name="評定平均 自動計算 | My Naishin"
        description="9教科の評定から平均値を瞬時に計算。中学生向け無料ツール。"
        url="https://my-naishin.com/hyotei-heikin"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '評定平均 自動計算', url: 'https://my-naishin.com/hyotei-heikin' },
        ]}
      />
      <HowToSchema
        id="howto-hyotei-heikin"
        name="評定平均を計算する方法"
        description="通知表の9教科の評定（1〜5）から、中学生の評定平均と素内申を自動で算出する手順。"
        totalTime="PT1M"
        steps={[
          { name: '通知表を用意する', text: '直近の学期の通知表または成績通知書を手元に用意します。' },
          { name: '9教科の評定を入力', text: '国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭の9教科の5段階評定を入力します。' },
          { name: '評定平均と素内申を確認', text: '9教科の評定の平均値（評定平均）と合計値（素内申、最大45点）が瞬時に表示されます。' },
          { name: '私立併願優遇・推薦基準と比較', text: '志望校が示す評定平均の基準値（3.5以上、3.8以上など）と照らし合わせ、出願可否を確認できます。' },
        ]}
      />
      <FAQPageSchema faqItems={HYOTEI_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">評定平均 自動計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              評定平均 自動計算【中学生対応】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              通知表の9教科の評定（5段階）を入力するだけ。<br />
              評定平均値と、高校入試で使う「内申点（素内申）」を同時に算出します。
            </p>
          </header>

          {/* クイックナビ */}
          <div className="mb-6 -mx-2 overflow-x-auto pb-1 px-2">
            <div className="flex gap-2 whitespace-nowrap">
              <a href="#calculator-section" className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700">
                <Calculator className="h-3.5 w-3.5" />
                計算ツールへ
              </a>
              <a href="#shinrro-meyasu" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                進路目安
              </a>
              <a href="#tairaku-experience" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                体験談
              </a>
              <a href="#hyotei-faq" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                よくある質問
              </a>
              <Link href="/" className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100">
                内申点も計算
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* 運営者・検証情報カード（E-E-A-T強化） */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="text-sm font-bold text-slate-800">監修・運営：しゅうまい</div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    2026年度受験生
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  現役中学生エンジニア。47都道府県すべての教育委員会の入試要綱を直接読み込んで作った評定平均ツールです。
                  <Link href="/about/editor-profile" className="font-bold text-emerald-600 hover:underline ml-1">
                    運営者プロフィール →
                  </Link>
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    最終データ検証：2026年5月25日
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck className="h-3 w-3" />
                    新学習指導要領3観点評価対応
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ファーストビュー直下のPRストリップ */}
          <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-4 py-3">
            <p className="text-xs text-slate-700 leading-relaxed text-center">
              評定平均を上げる定番教材：<AffiliateAd id="zkai-text-middle" className="mx-1" hideLabel />（PR）/
              <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />
            </p>
          </div>

          {/* What is 評定平均 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              評定平均とは？
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-800">評定平均</strong>とは、通知表の9教科の評定（1〜5の5段階）を合計して教科数（9）で割った数値です。
              小数点第1位までで表すのが一般的で、たとえば全教科3なら「3.0」、5教科5・4教科3なら「4.0」となります。
            </p>
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="text-xs font-bold text-emerald-800 mb-1">計算式</div>
              <div className="font-mono text-sm text-emerald-900">
                評定平均 = （9教科の評定の合計）÷ 9
              </div>
            </div>
          </section>

          {/* Calculator */}
          <div id="calculator-section">
            <HyoteiHeikinCalculator />
          </div>

          {/* 計算結果直後の最高エンゲージ位置：Z会CTA */}
          <section className="mt-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 shadow-md text-center">
            <div className="text-base font-bold text-slate-800 mb-1">
              この評定平均を上げるなら
            </div>
            <div className="text-xs text-slate-600 mb-4 leading-relaxed">
              内申点アップに直結する学習なら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）。テキスト＋添削で定期テスト対策が万全。
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <a
                href="https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+CUQYA"
                rel="nofollow sponsored noopener"
                target="_blank"
                className="block w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
              >
                無料で資料をもらう（PR）
              </a>
            </div>
          </section>

          {/* 評定平均の計算方法（具体例） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定平均の計算方法と出し方
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                評定平均の計算は単純です。9教科の評定（1〜5）をすべて足して、教科数の9で割るだけ。小数点第1位までで表します。
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">計算例1：全教科オール3の場合</h3>
                <div className="font-mono text-sm text-emerald-900">
                  (3+3+3+3+3+3+3+3+3) ÷ 9 = 27 ÷ 9 = <strong className="text-base">3.0</strong>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">計算例2：主要5教科が4、実技4教科が3の場合</h3>
                <div className="font-mono text-sm text-emerald-900">
                  (4×5 + 3×4) ÷ 9 = (20 + 12) ÷ 9 = 32 ÷ 9 = <strong className="text-base">3.6</strong>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">計算例3：5教科5・実技4の場合</h3>
                <div className="font-mono text-sm text-emerald-900">
                  (5×5 + 4×4) ÷ 9 = (25 + 16) ÷ 9 = 41 ÷ 9 = <strong className="text-base">4.6</strong>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                <strong>注意：</strong>都道府県によっては「内申点（合計値）」を直接使うため、評定平均（小数）が使われない場合もあります。詳しくは<Link href="/prefectures" className="text-blue-600 underline">都道府県別ページ</Link>をご確認ください。
              </div>
            </div>
          </section>

          {/* 評定平均別の進路目安 */}
          <section id="shinrro-meyasu" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定平均別の高校・進路目安【2026年最新】
            </h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              評定平均がどのレベルだとどんな高校に行けるか、おおよその目安を解説します。実際の合否は当日点や面接も影響するため、参考値として活用してください。
            </p>
            <div className="space-y-4">
              {/* 評定平均5.0 */}
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-red-700 w-20 text-center shrink-0">5.0</div>
                  <div>
                    <h3 className="font-bold text-red-900">評定平均5.0｜最難関校レベル</h3>
                    <p className="text-xs text-red-700">全教科オール5。中学校で「学年トップ層」の評価。</p>
                  </div>
                </div>
                <div className="text-sm text-red-900 leading-relaxed">
                  <strong>狙える高校：</strong>開成、筑波大附属、灘、日比谷、西、横浜翠嵐、北野、天王寺など全国最難関の進学校。推薦入試の出願基準を圧倒的にクリア。当日点で大きく落とさなければほぼ確実。
                </div>
              </div>

              {/* 評定平均4.5 */}
              <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-orange-700 w-20 text-center shrink-0">4.5</div>
                  <div>
                    <h3 className="font-bold text-orange-900">評定平均4.5｜難関校レベル</h3>
                    <p className="text-xs text-orange-700">主要5教科オール5、実技で4が1〜2つ程度。</p>
                  </div>
                </div>
                <div className="text-sm text-orange-900 leading-relaxed">
                  <strong>狙える高校：</strong>戸山、青山、湘南、千葉、浦和、神戸、岡崎、修猷館などの地域トップ進学校。推薦入試の出願基準（多くの上位校4.3〜4.5）をクリア。
                </div>
              </div>

              {/* 評定平均4.0 */}
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-amber-700 w-20 text-center shrink-0">4.0</div>
                  <div>
                    <h3 className="font-bold text-amber-900">評定平均4.0｜上位校レベル</h3>
                    <p className="text-xs text-amber-700">9教科平均で4。「よくできる」評価が多数派。</p>
                  </div>
                </div>
                <div className="text-sm text-amber-900 leading-relaxed">
                  <strong>狙える高校：</strong>新宿、駒場、小山台、川和、市立金沢、寝屋川、四日市など中位上位校。多くの私立併願優遇の基準4.0をクリア。難関校は当日点での頑張りが必要。
                </div>
              </div>

              {/* 評定平均3.5 */}
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-emerald-700 w-20 text-center shrink-0">3.5</div>
                  <div>
                    <h3 className="font-bold text-emerald-900">評定平均3.5｜中堅上位レベル</h3>
                    <p className="text-xs text-emerald-700">5教科で3〜4が中心、実技でも4が混ざる。</p>
                  </div>
                </div>
                <div className="text-sm text-emerald-900 leading-relaxed">
                  <strong>狙える高校：</strong>中堅公立高校全般（偏差値55前後）。私立では併願優遇制度のある中堅校に多数チャレンジ可能。「平均より上」のポジション。
                </div>
              </div>

              {/* 評定平均3.0 */}
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-blue-700 w-20 text-center shrink-0">3.0</div>
                  <div>
                    <h3 className="font-bold text-blue-900">評定平均3.0｜平均レベル（オール3）</h3>
                    <p className="text-xs text-blue-700">全教科オール3。「ふつう」の評価。</p>
                  </div>
                </div>
                <div className="text-sm text-blue-900 leading-relaxed">
                  <strong>狙える高校：</strong>偏差値45〜50の中堅校が中心。私立は単願推薦で多くの選択肢あり。当日点で逆転して上位校を狙うことも可能。詳細は<Link href="/blog/all-3-high-school-options-2026-update" className="font-bold underline">オール3で行ける高校特集【2026年版】</Link>を参照。
                </div>
              </div>

              {/* 評定平均2.5 */}
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-slate-700 w-20 text-center shrink-0">2.5</div>
                  <div>
                    <h3 className="font-bold text-slate-900">評定平均2.5｜中堅下位レベル</h3>
                    <p className="text-xs text-slate-600">2が混ざる。一部の私立では出願制限があるかも。</p>
                  </div>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  <strong>狙える高校：</strong>偏差値40〜45の私立・公立高校。チャレンジ系の通信制高校も視野に。今からでも提出物・授業態度の改善で評定アップは十分可能。
                </div>
              </div>

              {/* 評定平均2.0以下 */}
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl font-black text-slate-700 w-20 text-center shrink-0">2.0</div>
                  <div>
                    <h3 className="font-bold text-slate-900">評定平均2.0以下｜下位レベル</h3>
                    <p className="text-xs text-slate-600">1や2が複数。出席日数も影響する場合あり。</p>
                  </div>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  <strong>選択肢：</strong>入りやすい私立高校、通信制高校、定時制高校、サポート校など。<Link href="/blog/futoukou-naishinten-high-school" className="font-bold underline">不登校でも行ける高校</Link>の特集記事もご参考に。状況によっては高卒認定試験という選択肢もあります。
                </div>
              </div>
            </div>
          </section>

          {/* 中間広告：スタサプ + 松陰塾 */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-sm">
              <div className="text-xs font-bold text-slate-700 mb-1">
                スマホで全教科対策
              </div>
              <div className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                月額2,178円で5教科+実技
              </div>
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-sm">
              <div className="text-xs font-bold text-slate-700 mb-1">
                自宅で個別指導
              </div>
              <div className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                内申点アップに直結する学習習慣
              </div>
              <AffiliateAd id="shoin-banner" />
            </div>
          </section>

          {/* 5段階評価の仕組み */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              中学校の5段階評価の仕組み
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                中学校の通知表に書かれる「評定」は、1〜5の5段階で付けられます。多くの保護者が「5＝90点以上」と思っていますが、現在の評定は単純に「テストの点数」で決まるわけではありません。2021年度以降、新学習指導要領の「観点別評価」に基づいた付け方になっています。
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">3つの観点で評価される</h3>
                <ul className="space-y-2 text-emerald-800">
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0">①</span>
                    <span><strong>知識・技能</strong>：教科書に書かれた知識を理解し、使える状態か。主に定期テストの点数で評価されます。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0">②</span>
                    <span><strong>思考・判断・表現</strong>：知識を組み合わせて問題を解いたり、自分の考えを表現したりできるか。応用問題・記述問題・発表で評価されます。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0">③</span>
                    <span><strong>主体的に学習に取り組む態度</strong>：授業への積極性、ノート提出、宿題、自主学習などで評価されます。</span>
                  </li>
                </ul>
              </div>
              <p>
                3つの観点それぞれを「A・B・C」の3段階で評価し、その組み合わせで最終的な1〜5の評定が決まります。一般的にはAAA→5、AAB→4、BBB→3、BBC→2、CCC→1という対応関係ですが、教科や学校により微妙に異なります。3観点の詳細は<Link href="/blog/naishin-evaluation-criteria-3-points" className="text-emerald-700 underline font-bold">3観点評価の徹底解説</Link>で詳しく解説しています。
              </p>
              <p>
                重要なのは、<strong>テストで90点取っても、提出物の出来や授業態度がCなら「3」になる可能性がある</strong>ということです。逆に、テストが70点でも、提出物完璧・授業態度良好なら「4」がつくことも珍しくありません。詳しい対策は<Link href="/blog/teishutsubutsu-jugyou-taido-guide" className="text-emerald-700 underline font-bold">提出物・授業態度で評定アップする方法</Link>を参照してください。
              </p>
            </div>
          </section>

          {/* 評定平均を上げる方法 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定平均を上げる7つの具体的な方法
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">1. 提出物は「期限内」かつ「丁寧に」</h3>
                <p className="text-emerald-800">
                  提出物の評価は「主体的に学習に取り組む態度」に直結します。締切を1日でも過ぎると評価が大きく下がり、評定が1段階落ちることもあります。期限の前日には必ず一度確認する習慣を付けてください。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">2. 授業中の発言・挙手を意識する</h3>
                <p className="text-emerald-800">
                  発言の正確さよりも、積極的に手を挙げる姿勢が評価されます。1日1回でも発言できれば、態度評価が確実に上がります。回答が間違っていても問題ありません。「考えようとする姿勢」が重要です。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">3. ノート・ワークは「色分け」と「自分の言葉」で</h3>
                <p className="text-emerald-800">
                  ただ黒板を写すだけのノートは評価されません。重要箇所を赤で、疑問点を青で、自分の言葉での要約を加えるなど、「考えながら書いている」ことが伝わるノートが評価されます。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">4. 定期テストで「平均点+10点」を目指す</h3>
                <p className="text-emerald-800">
                  「知識・技能」の観点を上げるには、定期テストで平均点+10点が目安です。学年平均65点なら、最低でも75点を目指してください。これでBの評価が確保でき、評定4以上が見えてきます。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">5. 実技4教科の「作品提出」を妥協しない</h3>
                <p className="text-emerald-800">
                  美術・技術家庭・音楽・保健体育では、作品や実技テストの評価が大きな比重を占めます。「実技は苦手だから」と妥協せず、与えられた課題に丁寧に取り組むことで評定5を狙えます。実技4教科は内申点で2倍になる地域も多く、影響が大きいです。詳しくは<Link href="/blog/practical-subjects-all-5-strategy-2026-update" className="text-emerald-900 underline font-bold">実技4教科でオール5を狙う戦略</Link>と<Link href="/blog/fukukyoka-bairitsu-by-prefecture" className="text-emerald-900 underline font-bold">都道府県別の副教科倍率</Link>を確認してください。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">6. 先生に質問する</h3>
                <p className="text-emerald-800">
                  授業後や休み時間に質問しに行く生徒は、それだけで「学習意欲が高い」と評価されます。週1回でも質問する習慣を付けることで、態度評価が確実に上がります。内容は些細なことでも構いません。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-900 mb-1">7. 「振り返りシート」「自己評価」に力を入れる</h3>
                <p className="text-emerald-800">
                  単元末の振り返りシートや自己評価アンケートは、「主体的な学習態度」を直接アピールできる絶好の機会です。具体的に「ここが分かるようになった」「次はこう取り組みたい」と書くことで、評価が上がります。
                </p>
              </div>
            </div>
          </section>

          {/* 評定平均の活用シーン */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定平均が必要になる場面
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">高校入試の推薦選抜</h3>
                <p>
                  公立高校の推薦入試（特色選抜・前期選抜）では、ほとんどの場合「評定平均○以上」という出願基準が設けられます。一般的に、上位校で4.0〜4.5以上、中堅校で3.3〜3.8以上が基準となります。学校により細かく異なるため、志望校の募集要項を必ず確認してください。地域ごとの目安は<Link href="/blog/naishin-target-grades-by-prefecture" className="text-blue-600 underline font-bold">都道府県別の目標内申点ガイド</Link>で確認できます。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">私立高校の併願優遇・単願推薦</h3>
                <p>
                  私立高校の併願優遇制度では、「評定平均○以上」を条件に合格内定がもらえる仕組みがあります。たとえば「評定平均3.8以上で内定確約」「4.0以上で授業料減免」など、評定平均によって特典が変わるケースが多いです。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">奨学金・特待生制度</h3>
                <p>
                  公立・私立を問わず、奨学金や特待生制度の選考基準として評定平均が使われます。「評定平均4.3以上で授業料全額免除」のような制度を設けている高校も少なくありません。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">中学校での三者面談・進路指導</h3>
                <p>
                  中3の三者面談では、現時点の評定平均を元に志望校の合否可能性が話し合われます。早めに自分の評定平均を把握しておくことで、面談時にスムーズに進路相談ができます。
                </p>
              </div>
            </div>
          </section>

          {/* 評定平均と入試 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              評定平均と高校入試の関係
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="text-2xl font-black text-red-700 w-16 text-center shrink-0">4.5+</div>
                <div className="text-red-800">
                  <div className="font-bold">最難関校レベル</div>
                  <div className="text-xs">トップ進学校・推薦入試で内申基準を確実にクリア</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="text-2xl font-black text-orange-700 w-16 text-center shrink-0">4.0+</div>
                <div className="text-orange-800">
                  <div className="font-bold">上位校レベル</div>
                  <div className="text-xs">多くの公立進学校で推薦基準をクリア</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-2xl font-black text-amber-700 w-16 text-center shrink-0">3.5+</div>
                <div className="text-amber-800">
                  <div className="font-bold">中堅上位レベル</div>
                  <div className="text-xs">多くの公立高校で安定して合格圏内</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-700 w-16 text-center shrink-0">3.0</div>
                <div className="text-emerald-800">
                  <div className="font-bold">平均レベル</div>
                  <div className="text-xs">全教科オール3。多くの中堅公立高校が選択肢</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-2xl font-black text-blue-700 w-16 text-center shrink-0">2.5</div>
                <div className="text-blue-800">
                  <div className="font-bold">中堅下位レベル</div>
                  <div className="text-xs">私立高校や入りやすい公立高校が選択肢に</div>
                </div>
              </div>
            </div>
          </section>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              評定平均を上げたいあなたへ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              定期テスト対策で評定を底上げするなら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-3 text-xs">
              <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）で詳細を確認
            </div>
          </section>

          {/* 都道府県別 推薦入試の評定平均基準 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              都道府県別 推薦入試の評定平均基準【2026年最新】
            </h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              推薦入試（特色選抜・前期選抜）の出願に必要な評定平均は都道府県・学校によって異なります。主要校の目安をまとめました。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">都道府県</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">トップ校の評定基準</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">中堅校の評定基準</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">東京（推薦）</td>
                    <td className="border border-slate-200 px-3 py-2">日比谷4.5以上、西4.4以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.8〜4.0以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">神奈川</td>
                    <td className="border border-slate-200 px-3 py-2">横浜翠嵐4.6以上、湘南4.5以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.7〜4.0以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">大阪（特色入試）</td>
                    <td className="border border-slate-200 px-3 py-2">北野4.5以上、天王寺4.3以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.5〜4.0以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">兵庫（特色選抜）</td>
                    <td className="border border-slate-200 px-3 py-2">神戸4.3以上、長田4.3以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.5以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">福岡</td>
                    <td className="border border-slate-200 px-3 py-2">修猷館・福岡4.5以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.8以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">愛知</td>
                    <td className="border border-slate-200 px-3 py-2">旭丘・岡崎4.5以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.5〜3.8以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">千葉</td>
                    <td className="border border-slate-200 px-3 py-2">千葉・船橋4.5以上</td>
                    <td className="border border-slate-200 px-3 py-2">3.8以上</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">埼玉</td>
                    <td className="border border-slate-200 px-3 py-2">浦和・大宮4.5以上（特別選抜なし）</td>
                    <td className="border border-slate-200 px-3 py-2">3.5以上（私立併願）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 上記は当サイトが各教育委員会の入試要綱を直接確認した参考値です。実際の出願基準は学校・年度により細かく変動するため、必ず最新の募集要項をご確認ください。
              詳しくは<Link href="/prefectures" className="text-emerald-600 underline font-bold">都道府県別の制度ページ</Link>へ。
            </p>
          </section>

          {/* 体験談：評定平均を3.2→4.1まで上げた中3 */}
          <section id="tairaku-experience" className="mt-8 scroll-mt-20 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              【実体験】中3で評定平均を3.2→4.1まで上げた具体策
            </h2>
            <div className="bg-white rounded-xl p-5 border border-emerald-100 mb-4">
              <p className="text-xs text-emerald-700 font-bold mb-2">運営者しゅうまいから</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                自分が中2の終わりまで評定平均3.2でした。「このままじゃ志望校に届かない」と気づき、中3の1学期で4.1まで上げました。やったことを正直に書きます。
              </p>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">1</div>
                <div>
                  <strong className="text-emerald-900">提出物を「期限の3日前」に出す習慣にした</strong><br/>
                  期限ギリギリで雑になるのを防ぐ。3日前なら見直しもできるし、先生から「真面目」評価がつく。<strong>これだけで実技4教科の評定が3→4に2教科上がりました。</strong>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">2</div>
                <div>
                  <strong className="text-emerald-900">授業中、最低1回は手を挙げると決めた</strong><br/>
                  答えがわからなくても「これは〜という解釈で合ってますか？」と質問する形でもOK。「考えている姿勢」が評価されます。3週間で先生に名前を覚えてもらえます。
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">3</div>
                <div>
                  <strong className="text-emerald-900">定期テスト3週間前から計画を立てた</strong><br/>
                  「テスト範囲を発表される前」から逆算して準備。学校のワークを2周回せる時間を確保。これで主要5教科のうち3教科で評定が1段階上がりました。
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">4</div>
                <div>
                  <strong className="text-emerald-900">「振り返りシート」に具体的な行動を書いた</strong><br/>
                  「がんばります」じゃなくて「水曜の放課後、ワークp.20-30を解く」のように、行動レベルで書く。先生は「自己分析できている生徒」として観点②③のAを付けやすい。
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">5</div>
                <div>
                  <strong className="text-emerald-900">先生に質問するために週1回職員室に行った</strong><br/>
                  「主体的に学習に取り組む態度」観点を上げる最強の方法。質問内容はその週の授業の細かい疑問でOK。<strong>これで「2」だった理科が「4」になりました。</strong>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-emerald-100 border border-emerald-200 p-4">
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>結果：</strong>中3の1学期で評定平均3.2 → 4.1（+0.9）。授業を変えずに、行動だけ変えました。「評定は努力で動く」と実感しました。
              </p>
            </div>
          </section>

          {/* 評定を下げる「やってはいけない3つの行動」 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定を下げる「やってはいけない3つの行動」
            </h2>
            <div className="space-y-3">
              <div className="flex gap-4 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-black text-white">×</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">行動1：提出物の遅れ</h3>
                  <p className="text-sm text-red-800 leading-relaxed">
                    1回でも提出物を出し忘れると、観点③「主体的に学習に取り組む態度」が大きく下がります。「忘れた」「家に置いてきた」は通用しない。<strong>1回の遅刻が評定を1段階下げる威力</strong>を持ちます。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-black text-white">×</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">行動2：授業中の私語・スマホ</h3>
                  <p className="text-sm text-red-800 leading-relaxed">
                    先生が見ていないようで見ています。たった1回でも注意されると、その学期は「態度」評価で減点対象。スマホは校則違反でもあり、評定だけでなく内申書全体に影響します。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-black text-white">×</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">行動3：実技教科を捨てる</h3>
                  <p className="text-sm text-red-800 leading-relaxed">
                    「美術は受験で使わないからどうでもいい」は最悪。<strong>東京都・神奈川県など多くの地域で実技4教科は内申点が2倍計算</strong>になります。実技で評定3を取り続けると、主要5教科を1〜2上げるよりダメージが大きい。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 親が知るべき評定平均の本当の意味 */}
          <section className="mt-8 rounded-2xl border-2 border-slate-200 bg-slate-50/30 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-slate-500 pl-3">
              保護者向け：親が知るべき評定平均の本当の意味
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                <strong>1. 「テストの点数」と「評定」は別物</strong><br/>
                親世代の評価制度（5段階の絶対評価）とは大きく異なります。今は「観点別評価」で、テストの点数だけでは評定が決まりません。「ウチの子テストは取れてるのに評定が低い」と思ったら、提出物・授業態度を確認してください。
              </p>
              <p>
                <strong>2. 評定平均は「親の声かけ」で変わる</strong><br/>
                「宿題やった？」より「今日の授業で何を考えた？」と聞く方が、子供は授業中の主体性が上がります。<Link href="/blog/2026-parent-support-guide" className="text-blue-600 underline font-bold">保護者向け中3サポート完全ガイド</Link>もご参考に。
              </p>
              <p>
                <strong>3. 推薦入試は評定平均で「出願権」が決まる</strong><br/>
                どんなに当日点で逆転できる学力があっても、評定平均が出願基準を満たさないと受験すらできません。中1から評定を意識して育てるのが、結果的に進路の選択肢を最大化します。
              </p>
              <p>
                <strong>4. 評定平均は「家族で確認」する習慣を</strong><br/>
                通知表が出るたびに、当ツールで評定平均を計算し、目標との差を家族で話し合うのがおすすめ。子供任せにすると現状を直視できないことが多い。
              </p>
            </div>
          </section>

          {/* よくある質問 */}
          <section id="hyotei-faq" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均と内申点の違いは？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  「評定平均」は1教科あたりの平均値（4.2など）、「内申点（素内申）」は合計値（38など）で表現します。同じ通知表データを別の形で表したものです。当ツールでは両方を同時に確認できます。素内申と換算内申の違いは<Link href="/blog/kansan-naishin-vs-su-naishin" className="text-blue-600 underline">図解で解説した記事</Link>もあります。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均はいつの通知表を使う？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  推薦入試では、中学3年の1学期または前期の成績を使うのが一般的です。一般入試で使う「内申点」は都道府県により異なり、中3のみ／中1〜3まで幅広く対象になる場合があります。中1から内申点を意識すべき理由は<Link href="/blog/naishinten-from-junior-1" className="text-blue-600 underline">中1からの内申点対策</Link>で詳しく解説しています。
                  詳しくは<Link href="/prefectures" className="text-blue-600 underline">都道府県別の制度ページ</Link>をご確認ください。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均は5段階？10段階？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  公立中学校では原則として5段階評価が使われています。一部の私立中学では10段階を使うこともありますが、高校入試の調査書では5段階に換算されます。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                当ツールは9教科すべてを等しい重みで計算する「素内申」ベースです。実技教科を1.3倍・2倍などに加重する「換算内申」については
                <Link href="/" className="text-amber-900 underline font-bold">トップページの内申点計算ツール</Link>をご利用ください。
              </p>
            </div>
          </div>

          {/* トップページ誘導：内申点も計算しよう */}
          <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                  次のステップ
                </div>
                <h2 className="text-2xl font-black mb-2">評定平均だけでは合否は決まらない</h2>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  都道府県によっては「素内申」より「換算内申」が使われ、実技教科が2倍計算される地域も。47都道府県の正確な計算式で、あなたの内申点を確認しましょう。
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-emerald-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                内申点を計算する
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </section>

          {/* 関連ツール */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">内申点を計算する（換算対応）</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/prefectures" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">47都道府県の内申点制度</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/tools" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">すべてのツール一覧</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/glossary" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">受験用語辞典</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>

          {/* 都道府県別計算 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">都道府県別の内申点を計算する</h2>
            <p className="text-xs text-slate-500 mb-4">評定平均だけでなく、地域固有の換算方式で内申点を算出できます</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { code: 'tokyo', name: '東京都' },
                { code: 'kanagawa', name: '神奈川県' },
                { code: 'chiba', name: '千葉県' },
                { code: 'saitama', name: '埼玉県' },
                { code: 'osaka', name: '大阪府' },
                { code: 'hyogo', name: '兵庫県' },
                { code: 'aichi', name: '愛知県' },
                { code: 'fukuoka', name: '福岡県' },
                { code: 'hokkaido', name: '北海道' },
              ].map((pref) => (
                <Link
                  key={pref.code}
                  href={`/${pref.code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                >
                  {pref.name}の内申計算
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </Link>
              ))}
            </div>
          </section>

          {/* 関連コラム */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">評定平均・内申点に関する関連コラム</h2>
            <div className="space-y-3">
              {[
                { slug: 'kansan-naishin-vs-su-naishin', title: '【図解】換算内申と素内申の違いとは？' },
                { slug: 'naishin-evaluation-criteria-3-points', title: '通知表の3観点評価を徹底解説｜A・B・Cの付き方' },
                { slug: 'teishutsubutsu-jugyou-taido-guide', title: '提出物・授業態度で評定アップする方法【保存版】' },
                { slug: 'how-to-raise-naishinten', title: '内申点を上げる15の方法【完全保存版】' },
                { slug: 'practical-subjects-all-5-strategy-2026-update', title: '実技4教科でオール5を狙う戦略【2026年最新】' },
                { slug: 'naishin-target-grades-by-prefecture', title: '都道府県別の目標内申点ガイド' },
                { slug: 'naishin-guide', title: '内申点の仕組みを徹底解説【完全ガイド】' },
                { slug: 'naishinten-from-junior-1', title: '中1から始める内申点対策｜逆算で考える3年計画' },
                { slug: 'teiki-test-and-naishinten', title: '定期テストと内申点の関係｜得点を内申に変える方法' },
                { slug: 'fukukyoka-bairitsu-by-prefecture', title: '都道府県別の副教科倍率まとめ' },
              ].map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">{article.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/blog" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline">
                すべての受験コラムを見る →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
