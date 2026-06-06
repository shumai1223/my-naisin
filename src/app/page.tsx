import type { Metadata } from 'next';
import Link from 'next/link';
import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import { getAllPosts } from '@/lib/blog-data';
import HomeClient from './HomeClient';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { PrefectureNaishinTable } from '@/components/PrefectureNaishinTable';
import { KantenHyokaOfficial } from '@/components/KantenHyokaOfficial';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { Calculator, BookOpen, MapPin, Sparkles, ShieldCheck, ChevronRight, Calendar, Clock, ArrowRight, Zap, TrendingUp, Target, HelpCircle } from 'lucide-react';

const HOME_FAQS = [
  {
    question: '内申点 計算サイトは無料で使えますか？',
    answer: 'はい、My Naishin の内申点 計算サイトは完全無料で利用できます。会員登録も不要で、9教科の評定を入力するだけで47都道府県の方式に従った内申点を瞬時に算出できます。',
  },
  {
    question: '内申点の計算方法は都道府県で違いますか？',
    answer: 'はい、内申点の計算方法は都道府県ごとに大きく異なります。たとえば東京都は中3のみで換算内申65点満点、神奈川県は中2＋中3×2で135点満点、北海道は中1〜中3で315点満点（ランクA〜M判定）です。当サイトの内申点 計算サイトは47都道府県すべての方式に対応しています。',
  },
  {
    question: '内申点の計算はいつから意識すべきですか？',
    answer: '都道府県によって対象学年が異なります。東京都・愛知県・福岡県などは中3のみが対象、神奈川県・富山県は中2＋中3、北海道・宮城県・福島県など多数の県は中1〜中3の3年間が対象です。中1〜中3対象の県では中1の最初の定期テストから内申点に影響するため、早めの対策が重要です。',
  },
  {
    question: '内申点と評定平均の違いは何ですか？',
    answer: '内申点は9教科の評定の合計値（例：38点）、評定平均は平均値（例：4.2）です。同じ通知表データを別の形で表現しています。推薦入試では「評定平均◯以上」、一般入試では「内申点◯点以上」と使い分けられることが多いです。当サイトでは内申点計算サイトと評定平均 計算サイトの両方を無料で提供しています。',
  },
  {
    question: '内申点 計算サイトで実技4教科の2倍計算に対応していますか？',
    answer: 'はい、東京都・宮城県・秋田県・福島県・群馬県・大分県・宮崎県・沖縄県など、実技4教科を2倍計算する都道府県の方式に対応しています。それ以外にも兵庫県（実技7.5倍）、鹿児島県（実技50点換算）など特殊な方式にも対応しています。',
  },
  {
    question: '内申点 計算結果はスマホで保存できますか？',
    answer: 'はい、計算結果はスマホやPCのブラウザに自動保存されます（端末内のみに保存され、外部に送信されません）。複数回の計算を履歴として残せるため、定期テスト後の評定変化や、目標との差を継続的に追跡できます。',
  },
  {
    question: '内申点 計算結果から志望校の合否目安はわかりますか？',
    answer: 'はい、当サイトでは計算結果と都道府県別の主要高校のボーダーライン一覧を比較できます。また「志望校から逆算」ツールを使えば、志望校の合格基準点から、入試当日に取るべき学力検査の点数を逆算できます。',
  },
  {
    question: '内申点を上げる最も効率的な方法は？',
    answer: '①提出物を期限内＋丁寧に出す、②授業中の発言で「主体性」評価を上げる、③定期テストで安定して平均点+10点を取る、④実技4教科で「3→4」を狙う（特に実技2倍方式の都道府県では効果絶大）、⑤先生に質問する習慣を作る、の5つが効果的です。詳しくは内申点を上げる方法の記事もご参考ください。',
  },
];

export const metadata: Metadata = {
  // pos4.2まで上昇中の「内申点 計算」のCTR(5.8%)を上げるため、トップ固有のスニペットを最適化（タイトルは実績ある親defaultを維持）
  description:
    '【完全無料】内申点 計算サイト。9教科の評定を入れるだけで、全国47都道府県の方式に対応した内申点を30秒で自動計算。志望校のボーダー比較・評定平均・偏差値も同時にチェック。登録不要・2026年度（令和8年度）入試対応。',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  const latestPosts = getAllPosts().slice(0, 5);
  const sidebarPosts = latestPosts.slice(0, 3);

  return (
    <>
      <FAQPageSchema faqItems={HOME_FAQS} />
      {/* GEO: AIに「出典として引用される」ためのデータセット定義 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: '全国47都道府県 内申点 計算方式データ',
            description:
              '全国47都道府県の内申点（調査書点）の計算方式・満点・対象学年・実技4教科の倍率。各都道府県教育委員会の入学者選抜要綱に基づく一次データ。',
            creator: { '@type': 'Organization', name: 'My Naishin' },
            spatialCoverage: '日本（47都道府県）',
            variableMeasured: ['内申点満点', '対象学年', '実技4教科の倍率'],
            url: 'https://my-naishin.com/',
          }),
        }}
      />
      <HomeClient />

      {/* Latest Articles — homepage funnel */}
      <section className="mx-auto max-w-5xl px-4 pt-12">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                <Zap className="h-3 w-3" />
                新着記事
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                最新の受験コラム
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                内申点アップ・志望校選び・実技対策など、最新の入試情報を発信中。
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              すべての記事
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${
                  i === 0 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="flex-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-3">
                  {post.title}
                </h3>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                  記事を読む <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* PR ストリップ：コラム読了後のフック */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 text-center">
            <div className="text-xs text-slate-700">
              <AffiliateAd id="zkai-text-middle" hideLabel />（PR）の通信教育で内申＋偏差値を伸ばす。まずは
              <AffiliateAd id="zkai-text-request" hideLabel />（PR）で詳細を確認。
            </div>
          </div>
        </div>
      </section>

      {/* SEO Optimized Content Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column（min-w-0: gridトラックが内部の広い要素で押し広げられ右が見切れるのを防ぐ） */}
          <div className="min-w-0 lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="text-blue-600" />
                2026年度（令和8年度）入試対応の内申点計算
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>
                  My Naishinは、現役の中学生とその保護者のために開発された、<strong>全国47都道府県の最新計算方式に完全対応</strong>した内申点計算サイトです。
                  高校受験において、内申点（調査書点）は当日の学力検査と同様に、あるいはそれ以上に合否を分ける重要な要素です。
                </p>
                <p>
                  自分の地域のルールを正確に把握していなければ、効率的な受験戦略を立てることはできません。当サイトでは、各都道府県教育委員会が発表した最新の選抜基準に基づき、正確な計算機能と詳細な解説を提供しています。
                </p>
              </div>
            </div>

            {/* 5教科 偏差値計算サイトへの内部リンク強化（SEO: 偏差値計算サイト 5教科 / 中学生） */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-blue-50/60 p-6 md:p-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">
                <TrendingUp className="h-3 w-3" />
                内申点と合わせて使う
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                5教科の偏差値・評定平均も無料で算出（中学生・高校生対応）
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                内申点と並んで合否を左右するのが <strong>5教科の偏差値</strong>。
                <Link href="/hensachi" className="font-bold text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800">
                  偏差値計算サイト（5教科対応・中学生/高校生）
                </Link>
                では、点数・平均点・標準偏差から自分の偏差値を瞬時に算出。教科別の偏差値や、平均点しか分からない場合の簡易モードにも対応しています。通知表からそのまま入力できる
                <Link href="/hyotei-heikin" className="font-bold text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800">
                  評定平均の自動計算ツール
                </Link>
                と組み合わせれば、内申点・評定平均・偏差値を一気通貫で把握でき、志望校との距離をひと目で確認できます。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/hensachi"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
                >
                  <Target className="h-3.5 w-3.5" />
                  5教科の偏差値を計算する
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/hyotei-heikin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-all hover:bg-indigo-50"
                >
                  評定平均を計算する
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 都立高校 総合得点（1020点）計算ツールへの内部リンク強化 */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-violet-50/60 p-6 md:p-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                <Calculator className="h-3 w-3" />
                東京都の受験生向け
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                都立高校 総合得点（1020点満点）計算サイト ─ 学力検査・調査書点・ESAT-Jを一括算出
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                都立高校の一般入試は、<strong>学力検査700点＋調査書点300点＋ESAT-J 20点＝1020点満点</strong>の総合得点で合否が決まります。「都立高校 総合得点 計算サイト」では、3つの要素を入力するだけで合計点と志望校の合格目安までの距離を瞬時に算出。日比谷・西・国立・戸山など主要都立高校のボーダー比較にも対応しています。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/tokyo/total-score"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  都立 総合得点を計算する（1020点）
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/tokyo/naishin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-blue-700 ring-1 ring-blue-200 transition-all hover:bg-blue-50"
                >
                  東京都の内申点だけ計算する
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-emerald-600" />
                都道府県別の入試対策・計算ツール
              </h3>
              <div className="grid gap-6">
                {REGIONS.map(region => (
                  <div key={region} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                    <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">{region}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {getPrefecturesByRegion(region).map(pref => (
                        <Link
                          key={pref.code}
                          href={`/${pref.code}`}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-300"
                        >
                          {pref.name}
                          <ChevronRight className="h-3 w-3 opacity-30" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 47都道府県リンク直下：志望校選びの次の一手 */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      地域の制度を把握したら、学力対策を進める
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      スタディサプリ中学講座なら全教科のプロ講師の映像授業を月額料金で受けられます。
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <AffiliateAd id="sapuri-banner-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* 全国47都道府県の内申点計算方式 比較一覧表（被引用・スニペット獲得用の一次情報アセット） */}
            <PrefectureNaishinTable />

            {/* 「内申点 計算」semantic enrichment：GSCで pos 7 → 3 を狙うためのキーワード密度UP */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-white p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calculator className="text-blue-600 h-5 w-5" />
                内申点 計算サイトとしてのMy Naishinの強み
              </h2>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-3">
                <p>
                  <strong>内申点 計算</strong>を正確に行うには、お住まいの都道府県の最新の換算方式を把握する必要があります。My Naishinは<strong>47都道府県すべての内申点 計算方式</strong>を実装しており、9教科の評定を入力するだけで瞬時に正確な内申点を算出できる無料ツールです。
                </p>
                <p>
                  たとえば<strong>東京都の内申点 計算</strong>は中3のみが対象で、実技4教科を2倍にした「換算内申」65点満点で評価されます。<strong>神奈川県の内申点 計算</strong>は中2＋中3×2で135点満点、<strong>北海道の内申点 計算</strong>は中1〜中3の3年間で315点満点（A〜Mランク）と、地域によって全く異なります。手計算では間違いやすい複雑な計算も、当サイトなら<strong>30秒で正確に算出</strong>できます。
                </p>
                <p>
                  <strong>内申点 計算結果</strong>と志望校のボーダーラインを比較する機能、<strong>志望校から必要な当日点を逆算</strong>する機能、<strong>評定平均・偏差値の同時算出</strong>機能も完備。高校受験で合否を分ける内申点を「計算するだけ」で終わらせず、戦略立案までサポートします。
                </p>
                <div className="rounded-xl bg-white border border-blue-100 p-4 mt-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    内申点 計算でMy Naishinが選ばれる5つの理由
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 ml-1">
                    <li>✅ <strong>47都道府県完全対応</strong>：各都道府県教育委員会の公式入試要綱を直接読み込んで実装</li>
                    <li>✅ <strong>会員登録・課金不要</strong>：完全無料・広告のみで運営</li>
                    <li>✅ <strong>30秒で算出</strong>：9教科の評定を入力するだけ</li>
                    <li>✅ <strong>計算結果の保存</strong>：履歴管理で評定変化を追跡可能</li>
                    <li>✅ <strong>志望校との比較</strong>：高校別ボーダーラインを同時表示</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 文科省一次情報ベースの権威コンテンツ（独自性・E-E-A-T・外部権威リンク） */}
            <KantenHyokaOfficial />

            {/* 保護者向けリード導線（収益化の本命：広告表示→資料請求の送客） */}
            <ParentLeadCTA />

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles />
                内申点を1点でも上げるための3つの鉄則
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">1</div>
                  <p><strong>実技教科（副教科）を捨てない：</strong> 多くの県で実技教科は1.5倍〜2倍の配点になります。主要5教科で「5」を取るより、実技で「3」を「4」に上げる方が遥かに効率的です。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">2</div>
                  <p><strong>「主体的な態度」を軽視しない：</strong> 2021年度の学習指導要領改訂以降、テストの点数以上に授業への参加姿勢や振り返りシートの記述が評価に直結します。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">3</div>
                  <p><strong>志望校の「計算比率」を知る：</strong> 内申と当日点の比率が3:7の学校と7:3の学校では、対策が全く異なります。自分の持ち点に合わせた学校選びが逆転合格の鍵です。</p>
                </li>
              </ul>
            </div>

            {/* 内申点 計算 関連 FAQ（FAQPageSchema と一致した可視テキスト） */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="text-blue-600 h-5 w-5" />
                内申点 計算サイトのよくある質問
              </h2>
              <div className="space-y-3">
                {HOME_FAQS.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
                    <summary className="flex cursor-pointer items-start gap-3 px-5 py-4 hover:bg-slate-100/60">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                        Q
                      </span>
                      <span className="flex-1 pt-0.5 text-sm font-bold text-slate-800">{faq.question}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-slate-200 bg-white px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white">
                          A
                        </span>
                        <p className="flex-1 pt-0.5 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-center">
                <p className="text-sm text-slate-700">
                  もっと詳しく知りたい方は <Link href="/blog/naishin-guide" className="font-bold text-blue-700 underline">内申点ガイド</Link>・<Link href="/blog/how-to-raise-naishinten" className="font-bold text-blue-700 underline">内申点の上げ方</Link>・<Link href="/blog/naishinten-average-score" className="font-bold text-blue-700 underline">内申点の平均は何点？</Link>・<Link href="/koukou-hiyou" className="font-bold text-blue-700 underline">高校の費用シミュレーター</Link>・<Link href="/blog" className="font-bold text-blue-700 underline">受験コラム一覧</Link>へ
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar/Right Column（PC: stickyで本文が長くても右側が空かないよう追従＋回遊モジュール増設） */}
          <div className="min-w-0">
            <div className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-amber-600" />
                情報の正確性について
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                当サイトの情報は、全国47都道府県の教育委員会が発表した2026年度（令和8年度）入学者選抜の最新実施要綱を元に作成されています。
              </p>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <Link href="/quality" className="text-sm font-bold text-amber-900 hover:underline flex items-center gap-1">
                  情報の信頼性への取り組み <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 回遊モジュール：無料の計算ツール（内部リンク強化＋右側を埋める） */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <Calculator className="h-5 w-5 text-indigo-500" />
                無料の計算ツール
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/hensachi', label: '偏差値計算（5教科）' },
                  { href: '/hyotei-heikin', label: '評定平均 計算' },
                  { href: '/reverse', label: '志望校から逆算' },
                  { href: '/koukou-hiyou', label: '高校費用シミュレーター' },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
                  >
                    {tool.label}
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 回遊モジュール：よく見られる都道府県（高トラフィック県への内部リンク） */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <MapPin className="h-5 w-5 text-blue-500" />
                よく見られる都道府県
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'tokyo', name: '東京都' },
                  { code: 'kanagawa', name: '神奈川県' },
                  { code: 'osaka', name: '大阪府' },
                  { code: 'hyogo', name: '兵庫県' },
                  { code: 'hokkaido', name: '北海道' },
                  { code: 'aichi', name: '愛知県' },
                  { code: 'saitama', name: '埼玉県' },
                  { code: 'fukuoka', name: '福岡県' },
                ].map((pref) => (
                  <Link
                    key={pref.code}
                    href={`/${pref.code}/naishin`}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200"
                  >
                    {pref.name}
                    <ChevronRight className="h-3 w-3 opacity-40" />
                  </Link>
                ))}
              </div>
              <Link
                href="/prefectures"
                className="mt-3 block text-center text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                47都道府県すべて見る
              </Link>
            </div>

            {/* サイドバーPR：個別指導の選択肢 */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
              <h3 className="font-bold text-emerald-900 mb-3 text-sm">
                自宅で個別指導を受けるなら
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                ネット松陰塾は自宅でマンツーマンの個別指導を受けられる自立学習スタイル。内申点の底上げに。
              </p>
              <div className="flex justify-start">
                <AffiliateAd id="shoin-banner" centered={false} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                最新の受験コラム
              </h3>
              <div className="space-y-4">
                {sidebarPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                    <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.lastUpdated ?? post.date).toLocaleDateString('ja-JP')}更新
                    </p>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-6 block text-center text-sm font-bold text-blue-600 hover:text-blue-700">
                記事一覧を見る
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
