import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, BookOpen, ChevronRight, Home, AlertTriangle, TrendingUp, Award, User, Calendar, ShieldCheck, FileCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';

const HENSACHI_FAQS = [
  {
    question: '偏差値計算サイトは無料で使えますか？',
    answer: 'はい、My Naishin の偏差値計算サイト（5教科対応）は完全無料で利用できます。会員登録不要で、点数・平均点・標準偏差を入力するだけで30秒で偏差値を算出できます。',
  },
  {
    question: '学校のテストの偏差値はどう計算する？',
    answer: '学校のテストの偏差値は、クラスや学年全体の平均点と標準偏差を使って計算します。先生に平均点と標準偏差を聞けば当ツールの詳細モードで正確に計算できます。標準偏差が分からない場合は、簡易モード（標準偏差15）でおおよその目安が分かります。',
  },
  {
    question: '偏差値はマイナスになる？100を超える？',
    answer: '理論上、偏差値は計算式上マイナスにも100超にもなり得ます。極端に低い点数や、満点近い得点を平均点との差が大きい状況で取った場合などです。ただし、模試などでは通常25〜75程度の範囲に収まります。',
  },
  {
    question: '偏差値を1ヶ月で5上げることは可能？',
    answer: '苦手教科の底上げによっては可能です。たとえば苦手教科が偏差値40なら、基本問題を集中的に演習することで1ヶ月で偏差値50近くまで上げられる場合があります。ただし、偏差値60以上を1ヶ月で5上げるのは現実的に困難です。',
  },
  {
    question: '学校ごとの偏差値（合格偏差値）はどう見る？',
    answer: '「○○高校の偏差値は65」という表現は、その学校に合格するための目安となる偏差値です。模試で偏差値65が安定して取れていれば、その学校に十分挑戦できるレベルといえます。志望校の偏差値は、進学塾や受験情報サイトで確認できます。',
  },
  {
    question: '内申点と偏差値、どちらを重視すべき？',
    answer: '両方とも重要ですが、優先度は都道府県により異なります。東京・神奈川など内申比率の高い地域では内申点が重要、当日点比率の高い地域では模試偏差値が重要です。',
  },
  {
    question: '偏差値50は平均ですか？',
    answer: 'はい、偏差値50はその模試・テストを受けた集団のちょうど平均に位置することを意味します。偏差値55で上位30%、偏差値60で上位16%、偏差値65で上位7%、偏差値70で上位2%が目安です。',
  },
  {
    question: '5教科の偏差値と3教科の偏差値、どちらを見る？',
    answer: '公立高校受験は5教科で評価されるため、5教科の偏差値を主に見ます。私立高校は3教科（英語・数学・国語）入試が主流のため、3教科の偏差値も参考になります。当ツールは5教科対応ですが、教科別偏差値も同時に算出できるため、3教科だけ抽出して確認することも可能です。',
  },
];

export const metadata: Metadata = {
  title: '偏差値計算サイト 5教科【中学生・高校生対応】無料・30秒で算出 | My Naishin',
  description: '【無料】5教科対応の偏差値計算サイト。点数と平均点・標準偏差を入れるだけで、中学生・高校生の偏差値を30秒で自動算出。教科別偏差値・志望校との距離も同時に確認。2026年最新版。',
  keywords: ['偏差値計算サイト', '偏差値計算サイト 5教科', '偏差値計算サイト 中学生', '偏差値計算', '偏差値 計算', '偏差値 求める サイト', '偏差値 出す サイト', '5教科 偏差値', '中学生 偏差値', '高校生 偏差値'],
  alternates: {
    canonical: 'https://my-naishin.com/hensachi',
  },
  openGraph: {
    title: '偏差値計算サイト 5教科【中学生・高校生対応】無料・30秒で算出 | My Naishin',
    description: '5教科の点数と平均点から偏差値を瞬時に計算。中学生・高校生向け無料ツール。',
    url: 'https://my-naishin.com/hensachi',
  },
};

export default function HensachiPage() {
  return (
    <>
      <WebApplicationSchema
        name="偏差値計算サイト | My Naishin"
        description="5教科の点数から偏差値を瞬時に計算。中学生・高校生向け無料ツール。"
        url="https://my-naishin.com/hensachi"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
        ]}
      />
      <HowToSchema
        id="howto-hensachi"
        name="5教科の偏差値を計算する方法"
        description="自分の点数・平均点・標準偏差から、中学生・高校生向けに5教科の偏差値を瞬時に計算する手順。"
        totalTime="PT1M"
        steps={[
          { name: '点数を入力する', text: '5教科それぞれの自分の点数（0〜100点など）を入力します。' },
          { name: '平均点を入力する', text: 'テストごとの平均点を入力します。平均点が不明な場合は簡易モードで概算できます。' },
          { name: '標準偏差を入力する（任意）', text: '標準偏差が分かる場合は入力すると、より正確な偏差値が算出できます。分からない場合は自動推定モードに切り替わります。' },
          { name: '結果を確認する', text: '5教科の合計偏差値と教科別偏差値が瞬時に表示されます。志望校の合格基準偏差値と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={HENSACHI_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">偏差値計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              偏差値計算サイト【5教科対応】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              中学生・高校生向けの、偏差値を無料で求められる計算サイト。<br />
              点数・平均点・標準偏差を入れるだけで、あなたの偏差値を瞬時に算出します。
            </p>
          </header>

          {/* クイックナビ：ページ内ジャンプ + 他ツール誘導 */}
          <div className="mb-6 -mx-2 overflow-x-auto pb-1 px-2">
            <div className="flex gap-2 whitespace-nowrap">
              <a href="#calculator-section" className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700">
                <Calculator className="h-3.5 w-3.5" />
                計算ツールへ
              </a>
              <a href="#real-examples" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                実例5パターン
              </a>
              <a href="#hensachi-koukou" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                偏差値と高校
              </a>
              <a href="#hensachi-faq" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
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
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
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
                  現役中学生エンジニアが、47都道府県すべての教育委員会一次資料を読み解いて作った計算ツールです。
                  <Link href="/about/editor-profile" className="font-bold text-purple-600 hover:underline ml-1">
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
                    計算ロジック：文部科学省 学習指導要領準拠
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ファーストビュー直下のPRストリップ */}
          <div className="mb-6 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 px-4 py-3">
            <p className="text-xs text-slate-700 leading-relaxed text-center">
              偏差値を上げる定番教材：<AffiliateAd id="zkai-text-middle" className="mx-1" hideLabel />（PR）/
              <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />
            </p>
          </div>

          {/* What is 偏差値 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              偏差値とは？
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              偏差値とは、ある集団の中で自分がどの位置にいるかを数値化したものです。平均点を「50」とし、上位ほど数字が大きくなります。
              一般的に、<strong className="text-slate-800">偏差値60は上位16%、偏差値70は上位2%</strong>に相当します。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
                <div className="text-2xl font-black text-blue-700">70+</div>
                <div className="text-xs text-blue-600">上位2%</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-black text-emerald-700">60+</div>
                <div className="text-xs text-emerald-600">上位16%</div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                <div className="text-2xl font-black text-amber-700">50</div>
                <div className="text-xs text-amber-600">平均</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="text-2xl font-black text-slate-700">40-</div>
                <div className="text-xs text-slate-600">下位16%</div>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <div id="calculator-section">
            <HensachiCalculator />
          </div>

          {/* 計算結果直後の最高エンゲージ位置：Z会CTA */}
          <section className="mt-6 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 px-6 py-6 shadow-md text-center">
            <div className="text-base font-bold text-slate-800 mb-1">
              この偏差値を上げる、最短ルート
            </div>
            <div className="text-xs text-slate-600 mb-4 leading-relaxed">
              <AffiliateAd id="zkai-text-advanced" hideLabel />（PR）— 添削指導で「テストで点を取れる思考力」を鍛える定番教材
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <a
                href="https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+CUQYA"
                rel="nofollow sponsored noopener"
                target="_blank"
                className="block w-full rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-95"
              >
                無料で資料をもらう（PR）
              </a>
            </div>
          </section>

          {/* Formula */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-purple-500" />
              偏差値の計算式
            </h2>
            <div className="rounded-xl bg-slate-900 p-4 text-center text-slate-100">
              <div className="font-mono text-sm md:text-base">
                偏差値 = 50 + 10 × (自分の点数 − 平均点) ÷ 標準偏差
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              標準偏差（σ）が分からない場合、模試では一般的に15前後、定期テストでは15〜20が目安です。
              当ツールではこの目安値を初期値として使用しています。より正確な偏差値が必要な場合は、模試の成績表に記載されている標準偏差を入力してください。
            </p>
          </section>

          {/* 中学生が5教科の偏差値を出す方法（「偏差値計算サイト 5教科」「偏差値計算サイト 中学生」の意図直撃） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              中学生が5教科の偏差値を計算する方法【定期テスト・模試対応】
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                「学校の定期テストでは偏差値が出ない」という中学生は多いはずです。多くの中学校では順位や平均点までしか開示されないためです。
                ただし、<strong>自分の点数・教科ごとの平均点</strong>さえ分かれば、この偏差値計算サイトで5教科それぞれの偏差値を出せます。
                平均点は答案返却時に先生が口頭で伝えることが多いので、5教科分メモしておきましょう。
              </p>

              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">中学生が偏差値を出す3ステップ</h3>
                <ol className="ml-4 list-decimal space-y-1.5 text-purple-800">
                  <li>5教科それぞれの<strong>自分の点数</strong>を用意する（テストの点数そのまま）。</li>
                  <li>5教科それぞれの<strong>クラス・学年の平均点</strong>を用意する（先生に聞くのが確実）。</li>
                  <li>標準偏差が分かれば入力、分からなければ<strong>定期テストは15〜20</strong>を目安に。あとは上の計算ツールに入れるだけ。</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-1">「5教科合計の偏差値」には2つの考え方がある</h3>
                <p>
                  中学生がよく混乱するのが「5教科トータルの偏差値」です。実は出し方は2通りあります。
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1.5">
                  <li>
                    <strong>① 各教科の偏差値を平均する方法</strong>：国語58・数学52・英語60・理科54・社会56 → 平均して偏差値56。教科ごとの得意不得意を反映しやすい方法です。
                  </li>
                  <li>
                    <strong>② 5教科の合計点で偏差値を出す方法</strong>：5教科合計点（例：500点満点中380点）と、5教科合計の平均点・標準偏差から計算します。模試の「総合偏差値」はこちらに近い考え方です。
                  </li>
                </ul>
                <p className="mt-2 text-xs text-slate-500">
                  当ツールは①の「教科別偏差値の平均」を総合偏差値として表示します。模試の総合偏差値（②）とは数値が微妙にずれる場合がありますが、自分の立ち位置を把握する目的では十分に使えます。
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-1">定期テストと模試で偏差値が違うのはなぜ？</h3>
                <p>
                  同じ実力でも、<strong>受けた集団（母集団）が違えば偏差値は変わります</strong>。学年全体が受ける定期テストと、受験者層がそろう模試では平均点も標準偏差も異なるため、定期テストの偏差値が高めに出ることがよくあります。
                  志望校判定では、必ず<strong>同じ模試どうしの偏差値</strong>で比較してください。中学生のうちは、定期テストの偏差値で日々の調子を確認し、年数回の模試で受験者層の中での実力を測る、という使い分けが王道です。
                </p>
              </div>
            </div>
          </section>

          {/* 偏差値の意味と特性 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値の意味と6つの特性
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">1. 平均点を基準とした「相対評価」である</h3>
                <p>
                  偏差値は「集団の中での自分の位置」を示す数値です。100点満点で80点を取っても、平均点が85点なら偏差値は50を下回ります。逆に、20点満点で15点でも、平均点が10点で標準偏差が5なら偏差値は60になります。つまり、点数の絶対値ではなく、集団内での相対的な位置を表すのが偏差値の本質です。詳しい用語の意味は<Link href="/glossary" className="text-blue-600 underline font-medium">用語辞典</Link>でも解説しています。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">2. 平均点が「偏差値50」になる</h3>
                <p>
                  どの集団でも、平均点を取った人の偏差値は必ず50になります。これは偏差値の計算式が「平均点との差」を基にしているためです。「偏差値50＝平均」と覚えておけば、自分の立ち位置がすぐに把握できます。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">3. 標準偏差により分布の「広がり」を表現する</h3>
                <p>
                  標準偏差（σ）は、得点の散らばり具合を表す数値です。標準偏差が大きいほど、点数の差が大きい集団（実力差が広い）といえます。一般的な模試では標準偏差は12〜18の範囲に収まることが多く、当ツールでは中間値の15を初期値としています。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">4. 偏差値60で上位16%、偏差値70で上位2%</h3>
                <p>
                  偏差値は正規分布に従うとされており、偏差値55で上位31%、偏差値60で上位16%、偏差値65で上位7%、偏差値70で上位2.3%、偏差値75で上位0.6%という分布になります。トップ進学校に行くには偏差値65以上が必要、と言われるのはこの分布が根拠です。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">5. 模試の種類によって偏差値が変動する</h3>
                <p>
                  同じ実力でも、難関校志望者が多く受ける模試（駿台模試など）では偏差値が低めに、幅広い層が受ける模試（進研模試など）では偏差値が高めに出る傾向があります。これは母集団のレベルが違うためです。志望校判定を見るときは、必ず「同じ模試の偏差値」で比較してください。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">6. 単発の偏差値より「推移」を見る</h3>
                <p>
                  1回の模試の偏差値で一喜一憂しないでください。風邪や苦手分野が多く出題された等の偶発要因が大きいです。3回程度の模試の平均偏差値で、自分の実力を判断するのが王道です。
                </p>
              </div>
            </div>
          </section>

          {/* 偏差値を上げる方法 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値を上げる具体的な5つの方法
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">方法1：苦手教科を「平均点」まで引き上げる</h3>
                <p className="text-purple-800">
                  偏差値40の教科を50に上げる方が、すでに偏差値65の教科を70に上げるより圧倒的に簡単です。総合偏差値は5教科の平均で算出されるため、苦手教科の底上げが最も効率的に偏差値を伸ばします。具体的な勉強法は<Link href="/blog/improve-grades-from-all-3" className="text-purple-900 underline font-bold">オール3から成績を上げる方法</Link>で詳しく解説しています。定期テストで70点以上を安定して取れる状態を目指してください。
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">方法2：英語と数学を最優先で固める</h3>
                <p className="text-purple-800">
                  英語と数学は「積み上げ型」の科目で、一度成績が上がると下がりにくい特性があります。逆に、一度遅れを取ると追いつくのが困難です。日々の学習時間の60%以上を英語・数学に投資し、まずはこの2教科で偏差値55以上を目指すのが、総合偏差値を効率的に伸ばす王道戦略です。
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">方法3：模試の解き直しを「3回」やる</h3>
                <p className="text-purple-800">
                  模試を受けるだけでは偏差値は上がりません。間違えた問題を「当日」「1週間後」「1ヶ月後」の3回、解き直してください。1回目で覚えた知識は、人間の記憶特性上1週間で約70%忘れます。3回繰り返すことで長期記憶に定着し、次回の模試で確実に得点できるようになります。定期テストの活用法は<Link href="/blog/teiki-test-and-naishinten" className="text-purple-900 underline font-bold">定期テストと内申点の戦略</Link>もあわせて読んでください。
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">方法4：朝の20分を音読・暗記に使う</h3>
                <p className="text-purple-800">
                  脳が最も働く時間帯は起床後の2〜3時間。この時間を英単語の暗記、古文単語、社会の年号暗記など、暗記系の学習に充てると効率が2倍以上に上がります。逆に、夜遅い時間帯の暗記は定着率が落ちるので、夜は問題演習や復習にあてる方が効率的です。
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <h3 className="font-bold text-purple-900 mb-2">方法5：志望校の過去問を早めに解く</h3>
                <p className="text-purple-800">
                  中3の夏までに、志望校の過去問を1年分解いてみてください。今の学力で何点取れるかが分かり、必要な伸び率が明確になります。また、各学校で出題傾向が大きく異なるため、早期に過去問に触れることで、ピンポイントの対策が可能になります。志望校の必要点数が知りたい人は<Link href="/reverse" className="text-purple-900 underline font-bold">志望校から逆算する逆算ツール</Link>を使ってください。
                </p>
              </div>
            </div>
          </section>

          {/* 中間広告：スタサプ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-700 mb-1">
              スマホ・タブレットで全教科対策
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              月額2,178円で5教科+実技も学習できる<AffiliateAd id="sapuri-text" hideLabel />（PR）。無料体験あり。
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="sapuri-banner-468" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </section>

          {/* 偏差値と内申点の関係 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値と内申点の関係
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                高校入試では、内申点（調査書点）と当日の学力検査点の合計で合否が決まります。一般的に、偏差値と内申点の目安は以下のような対応関係があります：
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-3 py-2 text-left font-bold">偏差値</th>
                      <th className="border border-slate-200 px-3 py-2 text-left font-bold">内申点（45点満点）</th>
                      <th className="border border-slate-200 px-3 py-2 text-left font-bold">評定平均</th>
                      <th className="border border-slate-200 px-3 py-2 text-left font-bold">主な学校レベル</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">70+</td>
                      <td className="border border-slate-200 px-3 py-2">42〜45</td>
                      <td className="border border-slate-200 px-3 py-2">4.7〜5.0</td>
                      <td className="border border-slate-200 px-3 py-2">最難関校</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">65</td>
                      <td className="border border-slate-200 px-3 py-2">40〜43</td>
                      <td className="border border-slate-200 px-3 py-2">4.4〜4.8</td>
                      <td className="border border-slate-200 px-3 py-2">難関校</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">60</td>
                      <td className="border border-slate-200 px-3 py-2">35〜40</td>
                      <td className="border border-slate-200 px-3 py-2">3.9〜4.4</td>
                      <td className="border border-slate-200 px-3 py-2">上位校</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">55</td>
                      <td className="border border-slate-200 px-3 py-2">30〜35</td>
                      <td className="border border-slate-200 px-3 py-2">3.3〜3.9</td>
                      <td className="border border-slate-200 px-3 py-2">中堅上位</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">50</td>
                      <td className="border border-slate-200 px-3 py-2">27〜30</td>
                      <td className="border border-slate-200 px-3 py-2">3.0〜3.3</td>
                      <td className="border border-slate-200 px-3 py-2">中堅校</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">45</td>
                      <td className="border border-slate-200 px-3 py-2">24〜27</td>
                      <td className="border border-slate-200 px-3 py-2">2.7〜3.0</td>
                      <td className="border border-slate-200 px-3 py-2">中堅下位</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 font-bold">40</td>
                      <td className="border border-slate-200 px-3 py-2">21〜24</td>
                      <td className="border border-slate-200 px-3 py-2">2.3〜2.7</td>
                      <td className="border border-slate-200 px-3 py-2">入りやすい高校</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                ※ 都道府県や学校により異なります。あくまで全国平均の目安です。<Link href="/" className="text-blue-600 underline">内申点計算ツール</Link>で自分の地域の正確な値を確認できます。
              </p>
            </div>
          </section>

          {/* 実例5パターンで見る偏差値計算 */}
          <section id="real-examples" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              実例5パターンで見る「あなたの偏差値」
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              数式だけだとピンと来ないので、具体的な点数で偏差値を計算した5つのパターンを用意しました。自分に近いケースを探してみてください。
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-red-900">パターン1：高得点だが平均も高い</div>
                  <div className="text-xl font-black text-red-700">偏差値58.3</div>
                </div>
                <div className="text-xs text-red-800 space-y-1">
                  <div>• 自分の点数：85点 / 平均点：72点 / 標準偏差：15</div>
                  <div>• 計算：50 + 10 × (85 − 72) ÷ 15 = 50 + 8.67 = <strong>58.3</strong></div>
                  <div className="mt-1 italic">→ 「85点も取ったのに偏差値60行かない」と感じるかも。それは平均が高いから。</div>
                </div>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-orange-900">パターン2：難しいテストで健闘</div>
                  <div className="text-xl font-black text-orange-700">偏差値65.0</div>
                </div>
                <div className="text-xs text-orange-800 space-y-1">
                  <div>• 自分の点数：65点 / 平均点：43点 / 標準偏差：15</div>
                  <div>• 計算：50 + 10 × (65 − 43) ÷ 15 = 50 + 14.67 = <strong>65.0</strong></div>
                  <div className="mt-1 italic">→ 65点でも、難しいテストで周りが取れていなければ偏差値65に。難関模試あるある。</div>
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-amber-900">パターン3：平均ちょうど</div>
                  <div className="text-xl font-black text-amber-700">偏差値50.0</div>
                </div>
                <div className="text-xs text-amber-800 space-y-1">
                  <div>• 自分の点数：60点 / 平均点：60点 / 標準偏差：15</div>
                  <div>• 計算：50 + 10 × (60 − 60) ÷ 15 = <strong>50.0</strong></div>
                  <div className="mt-1 italic">→ 平均点ぴったり = 偏差値50。これが「真ん中」の意味。</div>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-emerald-900">パターン4：5教科で総合偏差値を出す</div>
                  <div className="text-xl font-black text-emerald-700">偏差値57.0</div>
                </div>
                <div className="text-xs text-emerald-800 space-y-1">
                  <div>• 国語60、数学55、英語60、理科55、社会55（5教科平均偏差値）</div>
                  <div>• 計算：(60+55+60+55+55) ÷ 5 = <strong>57.0</strong></div>
                  <div className="mt-1 italic">→ 当ツールは各教科の偏差値の平均値を「総合偏差値」として表示します（厳密な5教科合計偏差値とは微妙に異なります）。</div>
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-blue-900">パターン5：標準偏差が大きい問題</div>
                  <div className="text-xl font-black text-blue-700">偏差値55.0</div>
                </div>
                <div className="text-xs text-blue-800 space-y-1">
                  <div>• 自分の点数：70点 / 平均点：60点 / 標準偏差：20</div>
                  <div>• 計算：50 + 10 × (70 − 60) ÷ 20 = 50 + 5 = <strong>55.0</strong></div>
                  <div className="mt-1 italic">→ 標準偏差が大きい（点数のバラツキが大きい）テストでは、同じ「平均+10点」でも偏差値の上がり方が小さくなる。</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">
              上記の式に自分の数字を入れるのが面倒な人は、<a href="#calculator-section" className="text-purple-600 underline font-bold">ページ上部の計算ツール</a>を使ってください（数値を入れるだけ）。
            </p>
          </section>

          {/* 偏差値の3大誤解 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              中学生・保護者がハマる「偏差値の3大誤解」
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl bg-red-50 border border-red-200 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-black text-white">1</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">誤解1：偏差値は点数に比例する</h3>
                  <p className="text-sm text-red-800 leading-relaxed">
                    「テストで90点取れば偏差値も90」と思っている中学生・保護者は本当に多い。違います。偏差値は<strong>集団内の相対位置</strong>で、点数とは別次元の概念。100点満点で50点でも、平均が30点なら偏差値60以上になります。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-orange-50 border border-orange-200 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-600 font-black text-white">2</div>
                <div>
                  <h3 className="font-bold text-orange-900 mb-1">誤解2：模試の偏差値は全部同じ基準</h3>
                  <p className="text-sm text-orange-800 leading-relaxed">
                    駿台模試で偏差値55、進研模試で偏差値65、同じ実力でもこれくらい違います。母集団のレベルが全く違うからです。
                    <strong>志望校判定を見るときは「必ず同じ模試の偏差値」で比較</strong>してください。「進研模試で偏差値65だから安心」と思っていたら、駿台では55相当だった、というのはよくある話です。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-amber-50 border border-amber-200 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-600 font-black text-white">3</div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">誤解3：偏差値が高ければ内申点も自動的に高い</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    模試偏差値65でも、提出物未提出・授業中の私語が多い場合、内申点は3〜4が平均ということもザラ。<strong>偏差値（学力）と内申点（態度・主体性も含む総合評価）は別物</strong>です。
                    特に推薦入試は内申点が出願条件なので、偏差値だけ磨いても受験できない学校が出てきます。
                    詳しくは<Link href="/blog/teishutsubutsu-jugyou-taido-guide" className="font-bold underline">提出物・授業態度で評定アップする方法</Link>を参照。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2026年度入試の偏差値最新事情 */}
          <section className="mt-8 rounded-2xl border-2 border-purple-200 bg-purple-50/30 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              2026年度（令和8年度）入試の偏差値最新事情
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                <strong>1. 受験者数の減少で偏差値が変動傾向</strong><br/>
                少子化により高校受験者数は減少。2025年度入試では一部の中堅校で偏差値が2〜3ポイント下がる現象が観測されました。同じ偏差値でも、年度ごとに「行ける高校」が変わります。
              </p>
              <p>
                <strong>2. 都立高校の自校作成問題校の動向</strong><br/>
                日比谷・西・国立など自校作成問題校では、共通問題の偏差値より低めに出るのが特徴。同じ「偏差値70」でも、自校作成校では実質偏差値73〜75レベルの問題が出ます。
              </p>
              <p>
                <strong>3. ESAT-J（英語スピーキング）の偏差値への影響</strong><br/>
                2024年度から都立入試にESAT-Jが正式導入。スピーキング能力が偏差値に直結する時代に。詳しくは<Link href="/tokyo/total-score" className="text-blue-600 underline font-bold">都立高校総合得点計算ツール</Link>でシミュレーションできます。
              </p>
              <p>
                <strong>4. 新観点別評価制度の影響</strong><br/>
                2021年度から実施された3観点評価（知識・技能／思考・判断・表現／主体的に学習に取り組む態度）により、内申点と模試偏差値のギャップが広がる傾向。学力偏差値が高くても態度評価でCがつくと内申は3になることも。
              </p>
            </div>
          </section>

          {/* よくある質問（FAQPageSchema と完全一致） */}
          <section id="hensachi-faq" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値計算サイトに関するよくある質問
            </h2>
            <div className="space-y-3">
              {HENSACHI_FAQS.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
                  <summary className="flex cursor-pointer items-start gap-3 px-5 py-4 hover:bg-slate-100/60">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-black text-white">
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
            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/40 p-4 text-center">
              <p className="text-sm text-slate-700">
                さらに詳しく：<Link href="/blog/naishin-target-grades-by-prefecture" className="font-bold text-purple-700 underline">都道府県別の目標内申点ガイド</Link>・<Link href="/prefectures" className="font-bold text-purple-700 underline">47都道府県別ページ</Link>
              </p>
            </div>
          </section>

          {/* 偏差値と高校 */}
          <section id="hensachi-koukou" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              偏差値と高校レベルの目安
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2 border border-red-100">
                <span className="font-bold text-red-800">偏差値 70以上</span>
                <span className="text-red-700">最難関校（開成・筑駒・灘 / 日比谷・西・横浜翠嵐など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-2 border border-orange-100">
                <span className="font-bold text-orange-800">偏差値 65〜69</span>
                <span className="text-orange-700">難関校（戸山・青山・湘南・北野・天王寺など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 border border-amber-100">
                <span className="font-bold text-amber-800">偏差値 60〜64</span>
                <span className="text-amber-700">上位校（新宿・小山台・厚木・三国丘など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2 border border-emerald-100">
                <span className="font-bold text-emerald-800">偏差値 55〜59</span>
                <span className="text-emerald-700">中堅上位校（駒場・町田・大和・春日丘など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2 border border-blue-100">
                <span className="font-bold text-blue-800">偏差値 50〜54</span>
                <span className="text-blue-700">中堅校（平均的な公立高校）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 border border-slate-100">
                <span className="font-bold text-slate-800">偏差値 45〜49</span>
                <span className="text-slate-700">中堅下位校</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 border border-slate-100">
                <span className="font-bold text-slate-700">偏差値 40〜44</span>
                <span className="text-slate-600">入りやすい高校（オール3〜3.5レベル）</span>
              </div>
            </div>
          </section>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              偏差値を上げる学習教材
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              定期テスト対策で偏差値を底上げするなら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" auditHide />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" auditHide />
            </div>
            <div className="mt-3 text-xs">
              <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel auditHide />（PR）で詳細を確認
            </div>
          </section>

          {/* 注意点 */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">計算結果について</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-800">
                  <li>• 偏差値は受験する集団によって変動します。同じ点数でも、模試の種類や母集団によって偏差値は異なります。</li>
                  <li>• 標準偏差は概算値（15）を初期値としています。正確な値は模試の成績表でご確認ください。</li>
                  <li>• 偏差値は学習目標の目安として活用し、最終的な志望校判定は模試の判定結果や学校の先生にご相談ください。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* トップページ誘導：内申点も計算しよう */}
          <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                  次のステップ
                </div>
                <h2 className="text-2xl font-black mb-2">偏差値だけで合否は決まらない</h2>
                <p className="text-sm text-blue-100 leading-relaxed">
                  高校受験は「偏差値」だけでなく「内申点」も同じくらい重要です。47都道府県の正確な計算式で、あなたの内申点も確認しましょう。
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-blue-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
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
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">評定平均を自動計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/prefectures" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">47都道府県の入試制度</span>
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
            <p className="text-xs text-slate-500 mb-4">偏差値だけでなく、内申点も同時にチェックすると合格戦略が立てやすくなります</p>
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
                  className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-800 hover:bg-purple-100 hover:text-purple-900 transition-colors"
                >
                  {pref.name}の内申計算
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </Link>
              ))}
            </div>
          </section>

          {/* 関連コラム */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">偏差値・内申点に関する関連コラム</h2>
            <div className="space-y-3">
              {[
                { slug: 'all-3-high-school-options-2026-update', title: '【2026年】オール3の偏差値は40〜45｜内申27で行ける高校と逆転戦略' },
                { slug: 'naishin-target-grades-by-prefecture', title: '都道府県別の目標内申点ガイド｜偏差値別に必要な評定を解説' },
                { slug: 'how-to-raise-naishinten', title: '内申点を上げる15の方法【完全保存版】' },
                { slug: '2026-naishin-reversal-strategy', title: '2026年版・内申点逆転戦略｜短期間で偏差値5アップ' },
                { slug: 'naishin-guide', title: '内申点の仕組みを徹底解説【完全ガイド】' },
                { slug: 'teiki-test-and-naishinten', title: '定期テストと内申点の関係｜得点を内申に変える方法' },
                { slug: 'kansan-naishin-vs-su-naishin', title: '【図解】換算内申と素内申の違いとは？' },
                { slug: 'improve-grades-from-all-3', title: 'オール3から成績を上げる具体的な勉強法' },
              ].map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-purple-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">{article.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-purple-500" />
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/blog" className="text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline">
                すべての受験コラムを見る →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
