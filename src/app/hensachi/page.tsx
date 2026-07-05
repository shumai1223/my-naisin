import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, BookOpen, ChevronRight, Home, AlertTriangle, TrendingUp, Award, User, Calendar, ShieldCheck, FileCheck, Table2, Percent, BarChart3, GraduationCap, Target } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { PREFECTURES } from '@/lib/prefectures';
import { HensachiResultFlow } from '@/components/Hensachi/HensachiResultFlow';
import { AnswerBox } from '@/components/AnswerBox';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { StaticToolEntryLinks } from '@/components/StaticToolEntryLinks';
import { RankHensachiCalculator } from '@/components/Hensachi/RankHensachiCalculator';

// 偏差値 → 上位%・順位（正規分布に基づく数学的に厳密な対応値。偏差値の標準偏差=10で算出）
const PERCENTILE_ROWS: { h: string; top: string; r300: string; r1000: string; note?: string }[] = [
  { h: '75', top: '0.6%', r300: '約2位', r1000: '約6位', note: '超トップ層' },
  { h: '72.5', top: '1.2%', r300: '約4位', r1000: '約12位' },
  { h: '70', top: '2.3%', r300: '約7位', r1000: '約23位', note: '最難関校ライン' },
  { h: '67.5', top: '4.0%', r300: '約12位', r1000: '約40位' },
  { h: '65', top: '6.7%', r300: '約20位', r1000: '約67位', note: '難関校ライン' },
  { h: '62.5', top: '10.6%', r300: '約32位', r1000: '約106位' },
  { h: '60', top: '15.9%', r300: '約48位', r1000: '約159位', note: '上位校ライン' },
  { h: '57.5', top: '22.7%', r300: '約68位', r1000: '約227位' },
  { h: '55', top: '30.9%', r300: '約93位', r1000: '約309位' },
  { h: '52.5', top: '40.1%', r300: '約120位', r1000: '約401位' },
  { h: '50', top: '50%', r300: '150位', r1000: '500位', note: 'ちょうど平均' },
  { h: '47.5', top: '59.9%', r300: '約180位', r1000: '約599位' },
  { h: '45', top: '69.1%', r300: '約207位', r1000: '約691位' },
  { h: '40', top: '84.1%', r300: '約252位', r1000: '約841位' },
  { h: '35', top: '93.3%', r300: '約280位', r1000: '約933位' },
  { h: '30', top: '97.7%', r300: '約293位', r1000: '約977位' },
];

// 点数 → 偏差値 早見表（標準偏差15で算出）。行=自分の点数 / 列=平均点40・50・60・70
const HAYAMI_ROWS: { score: string; m40: string; m50: string; m60: string; m70: string }[] = [
  { score: '100点', m40: '90.0', m50: '83.3', m60: '76.7', m70: '70.0' },
  { score: '90点', m40: '83.3', m50: '76.7', m60: '70.0', m70: '63.3' },
  { score: '80点', m40: '76.7', m50: '70.0', m60: '63.3', m70: '56.7' },
  { score: '70点', m40: '70.0', m50: '63.3', m60: '56.7', m70: '50.0' },
  { score: '60点', m40: '63.3', m50: '56.7', m60: '50.0', m70: '43.3' },
  { score: '50点', m40: '56.7', m50: '50.0', m60: '43.3', m70: '36.7' },
  { score: '40点', m40: '50.0', m50: '43.3', m60: '36.7', m70: '30.0' },
  { score: '30点', m40: '43.3', m50: '36.7', m60: '30.0', m70: '23.3' },
];

const HENSACHI_FAQS = [
  {
    question: '偏差値計算サイトは無料で使えますか？偏差値テスト・偏差値チェックとの違いは？',
    answer: 'はい、My Naishin の偏差値計算サイト（5教科対応）は完全無料で利用できます。会員登録不要で、点数・平均点・標準偏差を入力するだけで30秒で偏差値を算出できます。「偏差値テスト」「偏差値チェック」も同じ意味で使われることが多く、当ページの計算ツールでそのままチェックできます。',
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
  {
    question: '偏差値60は上位何％ですか？順位だと何番目？',
    answer: '偏差値60は上位約15.9％（おおむね上位16％）です。300人の集団なら約48位、1,000人なら約159位に相当します。同様に偏差値65は上位約6.7％（300人中約20位）、偏差値70は上位約2.3％（300人中約7位）、偏差値55は上位約30.9％（300人中約93位）です。ページ内の「偏差値→上位％・順位 完全対応表」で偏差値30〜75まで確認できます。',
  },
  {
    question: '偏差値は自分で計算できますか？電卓でも出せる？',
    answer: 'はい、出せます。「偏差値＝50＋10×(自分の点数−平均点)÷標準偏差」の式に、自分の点数・テストの平均点・標準偏差を入れるだけです。標準偏差が分からない場合は定期テストなら15〜20を目安に。電卓でも計算できますが、5教科分をまとめて出すなら当ページの計算ツールが速く、平均点だけ分かれば「点数→偏差値 早見表」でおおよその値をその場で読み取ることもできます。',
  },
  {
    question: '高校の偏差値と大学の偏差値は同じ基準ですか？',
    answer: '別物です。偏差値は「その試験を受けた集団（母集団）の中での位置」なので、高校受験と大学受験では母集団が違い、同じ数字でも意味が変わります。一般に大学受験のほうが受験する層が絞られて学力レベルが上がるため、同じ人でも大学受験の偏差値は高校受験より低めに出やすい、と言われます。「高校偏差値65＝大学偏差値65の大学に入れる」ではない点に注意してください。',
  },
  {
    question: '偏差値ランキングだけで志望校を決めていい？',
    answer: '偏差値ランキングは合格難易度の目安としては有用ですが、それだけで志望校を決めるのは危険です。実際の合否は内申点（調査書点）と当日点の合計で決まり、地域によって内申の比重が大きく異なります。さらに通学時間・校風・大学進学実績・部活なども進路満足度を左右します。偏差値で候補を絞り、内申点計算ツールや各都道府県の入試制度ページで合格戦略を立てるのがおすすめです。',
  },
  {
    question: '偏差値シミュレーター（シュミレーター）とこの計算サイトの違いは？',
    answer: '「偏差値シミュレーター」「偏差値シュミレーター」は「偏差値計算」の一般的な言い換え・表記ゆれで、指しているツールは同じです。当ページは点数・平均点・標準偏差を入れて偏差値を算出する計算ツールであると同時に、点数を変えて何度でも試せる偏差値シミュレーターとしても使えます。志望校の合格ラインとの差を確認しながら、目標点を仮に変えて偏差値がどう動くか試してみてください。',
  },
];

export const metadata: Metadata = {
  title: '偏差値計算サイト 5教科【中学生・高校生対応】無料・30秒で算出 | My Naishin',
  description: '【無料】5教科対応の偏差値計算サイト。点数と平均点・標準偏差を入れるだけで偏差値を30秒で自動算出。点数→偏差値の早見表、偏差値→上位％・順位の完全対応表（偏差値60＝上位約16%）も収録。模試で偏差値が違う理由・高校と大学の偏差値の違いまで解説。2026年最新版。',
  keywords: ['偏差値計算サイト', '偏差値計算サイト 5教科', '偏差値計算サイト 中学生', '偏差値計算', '偏差値 計算', '偏差値診断', '偏差値診断 中学生', '中学生 偏差値 診断', '偏差値 求める サイト', '偏差値 出す サイト', '5教科 偏差値', '中学生 偏差値', '高校生 偏差値', '偏差値 上位 何%', '偏差値60 上位', '偏差値65 順位', '偏差値 早見表', '偏差値 順位 換算', '偏差値 とは', '模試 偏差値 違い', '大学 偏差値 違い', '偏差値シミュレーター', '偏差値シュミレーター', '高校偏差値診断', '偏差値テスト', '偏差値テスト 無料', '偏差値チェック'],
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
      <DatasetSchema
        name="偏差値→上位パーセンタイル・順位 対応表（偏差値30〜75）"
        description="偏差値を上位何パーセント・300人中／1,000人中の順位に換算した対応表。正規分布に基づき数学的に算出した一次参照データ。例：偏差値60＝上位約16%（300人中約48位）、偏差値65＝上位約6.7%、偏差値70＝上位約2.3%。"
        url="https://my-naishin.com/hensachi#hensachi-percentile"
        variableMeasured={['偏差値', '上位パーセンタイル(%)', '300人中の順位', '1000人中の順位']}
        keywords={['偏差値 上位 何%', '偏差値60 上位', '偏差値65 順位', '偏差値 パーセンタイル', '偏差値 順位 換算']}
        citation="正規分布（標準正規分布）に基づく算出。偏差値=50+10z。"
        dateModified="2026-06-03"
      />

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
              点数・平均点・標準偏差を入れるだけで偏差値を瞬時に算出。中学生の<strong>偏差値診断</strong>や、点数を変えて試せる<strong>偏差値シミュレーター</strong>としても使えます。
            </p>
          </header>

          {/* クイックナビ：ページ内ジャンプ + 他ツール誘導 */}
          <div className="mb-6 -mx-2 overflow-x-auto pb-1 px-2">
            <div className="flex gap-2 whitespace-nowrap">
              <a href="#calculator-section" className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700">
                <Calculator className="h-3.5 w-3.5" />
                計算ツールへ
              </a>
              <a href="#hensachi-hayami" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                <Table2 className="h-3.5 w-3.5" />
                点数→偏差値 早見表
              </a>
              <a href="#hensachi-percentile" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                <Percent className="h-3.5 w-3.5" />
                偏差値→上位％・順位
              </a>
              <a href="#hensachi-moshi" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                模試で偏差値が違う理由
              </a>
              <a href="#real-examples" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                実例5パターン
              </a>
              <a href="#hensachi-daigaku" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                <GraduationCap className="h-3.5 w-3.5" />
                高校と大学の偏差値
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

          {/* 答え先出し（GEO/AI引用・強調スニペット）。偏差値の定義式を即答する。 */}
          <div className="mb-6">
            <AnswerBox question="偏差値はどう計算する？偏差値60は上位何%？">
              偏差値は<strong>「50 ＋ 10 ×（自分の点数 − 平均点）÷ 標準偏差」</strong>で求めます。
              平均点を取ると偏差値50、<strong>偏差値60は上位約16%、偏差値70は上位約2.3%</strong>です（平均50・標準偏差10の正規分布で一定）。
              標準偏差が分からない場合は定期テストで15〜20が目安。下の計算ツールに点数・平均点を入れると、5教科の偏差値と上位％を自動算出できます（無料・登録不要）。
            </AnswerBox>
          </div>

          {/* 静的（計算前）内部リンク：/juku-shindan・/hogoshaのGooglebot可視性確保 */}
          <div className="mb-6">
            <StaticToolEntryLinks />
          </div>

          {/* Calculator＋結果連動の換金導線（偏差値の実測値をCTAへ配線＝41%流入の資産化） */}
          <HensachiResultFlow />

          {/* 偏差値クラスタのハブ：教科別・志望校レンジ・上げ方への内部リンク */}
          <div className="mt-6">
            <HensachiClusterNav current="hub" />
          </div>

          {/* 計算結果直後の最高エンゲージ位置：EV最上位のAI個別指導無料体験へ集中（旧Z会は低EVで撤去） */}
          <section className="mt-6 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 px-6 py-6 shadow-md text-center">
            <div className="text-base font-bold text-slate-800 mb-1">
              この偏差値を上げる、最短ルート
            </div>
            <div className="text-xs text-slate-600 mb-4 leading-relaxed">
              <AffiliateAd id="atama-text" hideLabel />（PR）— AIが弱点を自動分析する個別指導の無料体験
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="atama-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd
                id="atama-text"
                hideLabel
                ctaText="無料体験を申し込む（PR）"
                linkClassName="block w-full rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-95"
              />
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

          {/* 点数→偏差値 早見表（「偏差値 計算」「偏差値 出し方」意図 + 引用されやすい参照データ） */}
          <section id="hensachi-hayami" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              <Table2 className="h-5 w-5 text-purple-500" />
              点数→偏差値 早見表【平均点別・計算不要】
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              「自分の点数」と「テストの平均点」が分かれば、計算しなくても偏差値のおおよその値をこの表から読み取れます。
              標準偏差は定期テストで一般的な<strong>15</strong>で算出。正確な値は上の計算ツールに自分の標準偏差を入れてください。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="border border-purple-400 px-3 py-2 text-left font-bold whitespace-nowrap">自分の点数 ＼ 平均点</th>
                    <th className="border border-purple-400 px-3 py-2 text-center font-bold">平均40点</th>
                    <th className="border border-purple-400 px-3 py-2 text-center font-bold">平均50点</th>
                    <th className="border border-purple-400 px-3 py-2 text-center font-bold">平均60点</th>
                    <th className="border border-purple-400 px-3 py-2 text-center font-bold">平均70点</th>
                  </tr>
                </thead>
                <tbody>
                  {HAYAMI_ROWS.map((row) => (
                    <tr key={row.score} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800 whitespace-nowrap">{row.score}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.m40}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.m50}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.m60}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.m70}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              例：平均60点のテストで80点なら偏差値<strong className="text-purple-700">63.3</strong>、平均50点で70点なら偏差値<strong className="text-purple-700">63.3</strong>。
              同じ点数でも平均点が低いテストほど偏差値は高く出ます。教科ごとに平均点が違うので、5教科それぞれで読み取るのがコツです。
            </p>
          </section>

          {/* 偏差値→上位%・順位 完全対応表（「偏差値60 上位何%」「偏差値65 順位」直撃 + Dataset構造化でAI引用資産化） */}
          <section id="hensachi-percentile" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              <Percent className="h-5 w-5 text-purple-500" />
              偏差値→上位％・順位 完全対応表【偏差値30〜75】
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              「偏差値60って上位何％？」「偏差値65なら何位くらい？」に一発で答える対応表です。
              正規分布に基づいて<strong>数学的に算出</strong>した値なので、模試の種類に関係なく成り立ちます（300人・1,000人の集団に換算）。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border border-indigo-400 px-3 py-2 text-center font-bold">偏差値</th>
                    <th className="border border-indigo-400 px-3 py-2 text-center font-bold">上位</th>
                    <th className="border border-indigo-400 px-3 py-2 text-center font-bold">300人中</th>
                    <th className="border border-indigo-400 px-3 py-2 text-center font-bold">1,000人中</th>
                    <th className="border border-indigo-400 px-3 py-2 text-left font-bold">目安</th>
                  </tr>
                </thead>
                <tbody>
                  {PERCENTILE_ROWS.map((row) => (
                    <tr key={row.h} className={row.note ? 'bg-purple-50/70 font-medium' : 'odd:bg-white even:bg-slate-50'}>
                      <td className="border border-slate-200 px-3 py-2 text-center font-black text-indigo-700">{row.h}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.top}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.r300}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center text-slate-700">{row.r1000}</td>
                      <td className="border border-slate-200 px-3 py-2 text-left text-xs text-slate-500">{row.note ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              ※ 偏差値は「平均50・標準偏差10」の正規分布で定義されるため、上位％・順位はテストの種類によらず一定です。
              実際の模試では分布が完全な正規分布からややずれるため、端（偏差値75以上・25以下）では誤差が出ます。
            </p>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-slate-700">上の表にない値も計算する（偏差値⇔順位 双方向計算機）</h3>
              <RankHensachiCalculator />
            </div>
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

          {/* 偏差値診断（surgingクエリ「偏差値診断 中学生」を"立ち位置を知る"角度で捕捉） */}
          <section className="mt-8 rounded-2xl border-2 border-purple-200 bg-purple-50/30 p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値診断｜あなたの今の立ち位置がわかる（中学生向け）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              この偏差値計算サイトは、点数を入れるだけで使える<strong>中学生の偏差値診断ツール</strong>でもあります。
              「偏差値を計算する」とは、つまり<strong>自分が集団の中でどの位置にいるかを診断する</strong>こと。診断結果からは、次の3つがわかります。
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-purple-100 bg-white p-4">
                <div className="mb-1 text-sm font-bold text-purple-900">① 全体での立ち位置</div>
                <p className="text-xs leading-relaxed text-slate-600">偏差値60で上位16%、70で上位2%。同学年で自分が上位何%かが一目でわかります。</p>
              </div>
              <div className="rounded-xl border border-purple-100 bg-white p-4">
                <div className="mb-1 text-sm font-bold text-purple-900">② 志望校との距離</div>
                <p className="text-xs leading-relaxed text-slate-600">志望校の合格偏差値と今の偏差値の差から、あと偏差値いくつ伸ばせばいいかが明確になります。</p>
              </div>
              <div className="rounded-xl border border-purple-100 bg-white p-4">
                <div className="mb-1 text-sm font-bold text-purple-900">③ 教科ごとの強み弱み</div>
                <p className="text-xs leading-relaxed text-slate-600">教科別の偏差値を診断すれば、どこを伸ばせば総合が上がるか（＝苦手の底上げ）が見えます。</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <a
                href="#calculator-section"
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700"
              >
                点数を入れて診断する（無料）
              </a>
              <Link
                href="/hensachi/shindan"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-purple-700 ring-1 ring-purple-200 transition-all hover:bg-purple-50"
              >
                点数が分からない場合は5問で診断
                <ChevronRight className="h-4 w-4" />
              </Link>
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

          {/* 模試で偏差値が違う理由（「進研模試 偏差値」「駿台 偏差値 換算」「模試 偏差値 違い」意図） */}
          <section id="hensachi-moshi" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              模試によって偏差値が違うのはなぜ？【母集団の話】
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              「進研模試で偏差値65だったのに、別の模試では55だった」——よくある話です。原因は<strong>母集団（その模試を受けた集団）のレベルの違い</strong>。
              難関校志望者ばかりが受ける模試では周りが強いので偏差値は<strong>低めに</strong>、幅広い層が受ける模試では<strong>高めに</strong>出ます。同じ実力でも、受ける模試で偏差値は10前後も変わります。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="border border-slate-500 px-3 py-2 text-left font-bold whitespace-nowrap">模試のタイプ</th>
                    <th className="border border-slate-500 px-3 py-2 text-left font-bold">母集団</th>
                    <th className="border border-slate-500 px-3 py-2 text-center font-bold whitespace-nowrap">偏差値の出方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800">難関者が集中する模試<br /><span className="font-normal text-xs text-slate-500">（駿台中学生テスト など）</span></td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">上位層が多く、レベルが高い</td>
                    <td className="border border-slate-200 px-3 py-2 text-center font-bold text-red-600">低めに出る</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800">受験者層が標準的な模試<br /><span className="font-normal text-xs text-slate-500">（北辰テスト・Vもぎ/Wもぎ・五ツ木 など）</span></td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">その地域の受験生が幅広く受ける</td>
                    <td className="border border-slate-200 px-3 py-2 text-center font-bold text-amber-600">標準的</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800">学校一斉・基礎層も多い模試<br /><span className="font-normal text-xs text-slate-500">（進研模試 など）</span></td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">母集団が最も広く、平均的</td>
                    <td className="border border-slate-200 px-3 py-2 text-center font-bold text-emerald-600">高めに出る</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm leading-relaxed text-amber-900">
              <strong>判定で見るときの鉄則：</strong>志望校判定は<strong>必ず同じ模試どうしの偏差値</strong>で比較すること。
              「A模試で偏差値60、B模試で偏差値55」を直接くらべても意味がありません。各模試の判定（合格可能性%）と、複数回の<strong>平均偏差値</strong>で実力を見るのが正解です。
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              ※ 上の「低め/高め」はあくまで母集団の違いによる一般的な傾向です。模試名・年度により実際の出方は変わります。正確な換算は各模試の成績表・判定をご確認ください。
            </p>
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

          {/* 中間広告：そら塾（全国オンライン個別・EV¥84/click。旧サプリ¥5.4/clickは低EVで撤去し高EV枠へ振替） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-700 mb-1">
              全国どこでも受けられるオンライン個別指導
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              苦手教科だけをピンポイントで底上げする<AffiliateAd id="sora-juku-text" hideLabel />（PR）。無料体験あり。
            </div>
            <AffiliateAd id="sora-juku-banner" />
          </section>

          {/* 中間広告：atama+ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-700 mb-1">
              AIが苦手を自動分析・個別カリキュラムで偏差値アップ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              マンツーマンAI×担任サポート制の<AffiliateAd id="atama-text" hideLabel />（PR）。無料体験あり。
            </div>
            <AffiliateAd id="atama-banner" />
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
                ※ 都道府県や学校により異なります。あくまで全国平均の目安です。<Link href="/" className="text-blue-600 underline">内申点 計算サイト（47都道府県対応）</Link>で自分の地域の正確な値を確認できます。
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
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-center text-sm">
              <Link href="/blog/hensachi-koukou-ichiran-2026" className="font-bold text-amber-800 underline">
                偏差値別 行ける高校の一覧【2026年版・偏差値40〜70】をもっと詳しく →
              </Link>
            </div>
          </section>

          {/* 高校偏差値 vs 大学偏差値（「大学 偏差値」spillover意図 + 進学リテラシー） */}
          <section id="hensachi-daigaku" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              高校の偏差値と大学の偏差値は「別物」
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                「高校で偏差値65だから、大学も偏差値65のところに入れる」——これは<strong>大きな誤解</strong>です。
                偏差値はあくまで「その試験を受けた集団の中での位置」。高校受験と大学受験では<strong>受ける集団（母集団）がまったく違う</strong>ため、同じ数字でも意味が変わります。
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-sm font-bold text-blue-900">
                    <Target className="h-4 w-4" />
                    高校受験の偏差値
                  </div>
                  <p className="text-xs leading-relaxed text-blue-800">
                    母集団は「その地域の中学3年生ほぼ全員」。学力の幅が非常に広いため、上位に行くほど偏差値が伸びやすい傾向があります。
                  </p>
                </div>
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-sm font-bold text-violet-900">
                    <Target className="h-4 w-4" />
                    大学受験の偏差値
                  </div>
                  <p className="text-xs leading-relaxed text-violet-800">
                    母集団は「その大学を受ける受験生」に絞られ、進学校の生徒や浪人生も含むハイレベルな集団。同じ実力でも偏差値は<strong>低めに出やすい</strong>です。
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                よく「大学受験の偏差値は高校受験より10ほど下がる」と言われるのは、この母集団レベルの違いが理由です（学校・学部により差があります）。高校で安定して上位にいても、大学受験では新しいスタートラインに立つつもりで準備するのが安全です。
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-1 text-sm font-bold text-emerald-900">大学を見据えるなら「偏差値」より先に動けること</h3>
                <p className="text-xs leading-relaxed text-emerald-800">
                  大学受験の偏差値は高校に入ってからの勝負ですが、<strong>大学進学にかかるお金（学費・一人暮らし費用・奨学金）</strong>は今から把握できます。
                  早く知っておくほど、志望校の選択肢も、必要な準備も変わります。高校生になったら、学力（偏差値）と費用の両面で進学を設計していきましょう。
                </p>
              </div>
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

          {/* 偏差値→上位%・順位 早見表（SEO: 偏差値60 上位何% / 偏差値65 順位 / 偏差値 順位 換算） */}
          <section id="hensachi-percentile" className="mt-8 scroll-mt-20 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              偏差値→上位%・順位 換算早見表
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              「偏差値60は上位何%？」「偏差値65だと100人中何番目？」を一覧にした早見表です。偏差値は<strong>平均50・標準偏差10の正規分布</strong>を前提に、全体の中での位置（上位パーセント・順位）に換算できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white text-left">
                    <th className="border border-indigo-400 px-3 py-2 font-bold">偏差値</th>
                    <th className="border border-indigo-400 px-3 py-2 font-bold text-right">上位</th>
                    <th className="border border-indigo-400 px-3 py-2 font-bold text-right">100人中</th>
                    <th className="border border-indigo-400 px-3 py-2 font-bold text-right">1000人中</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {[
                    ['75', '0.6%', '約1位', '約6位'],
                    ['70', '2.3%', '約2位', '約23位'],
                    ['65', '6.7%', '約7位', '約67位'],
                    ['60', '15.9%', '約16位', '約159位'],
                    ['55', '30.9%', '約31位', '約309位'],
                    ['50', '50.0%', '約50位', '約500位'],
                    ['45', '69.1%', '約69位', '約691位'],
                    ['40', '84.1%', '約84位', '約841位'],
                    ['35', '93.3%', '約93位', '約933位'],
                  ].map(([hensachi, top, per100, per1000]) => (
                    <tr key={hensachi} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold">{hensachi}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">{top}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">{per100}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">{per1000}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              ※ 正規分布に基づく理論値です。実際の模試では受験者層により分布が偏るため目安としてご利用ください。自分の偏差値は上の<a href="#calculator-section" className="text-indigo-600 underline font-bold">偏差値計算ツール</a>で、内申点は<Link href="/" className="text-indigo-600 underline font-bold">内申点 計算サイト</Link>で確認できます。
            </p>
          </section>

          {/* 関連ツール */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">内申点 計算サイト（換算対応）</span>
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

          {/* 都道府県別の偏差値の目安と内申点（全47県の内部リンクハブ）。
              偏差値は全国共通の指標だが「行ける高校レベル」「内申の比重」は地域で大きく異なる。
              各県の /[pref]/naishin に、検証済みの高校ボーダー（内申・総合点）と入試制度がまとまっているので、
              「偏差値 ◯◯県」で来た人をその県の正準ページへ案内する（重複ページを作らず内部リンクで回遊）。 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">都道府県別の偏差値の目安と内申点</h2>
            <p className="text-xs text-slate-500 mb-4">
              偏差値は全国共通でも、同じ偏差値で「行ける高校」や内申の比重は地域で変わります。お住まいの都道府県のページで、検証済みの高校ボーダー（内申・総合点）と入試制度を確認できます。
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {PREFECTURES.map((pref) => (
                <Link
                  key={pref.code}
                  href={`/${pref.code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-800 hover:bg-purple-100 hover:text-purple-900 transition-colors"
                >
                  <span className="truncate">{pref.name}</span>
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              ※ 高校別の偏差値は模試・年度で変動するため、当サイトは各県教委の一次資料で確認できる内申・総合点のボーダーを掲載しています。偏差値の全国的な目安は
              <Link href="/hensachi/shiboukou" className="text-purple-600 underline">偏差値から行ける高校レベル</Link>をご覧ください。
            </p>
          </section>

          {/* 関連コラム */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">偏差値・内申点に関する関連コラム</h2>
            <div className="space-y-3">
              {[
                { slug: 'hensachi-koukou-ichiran-2026', title: '偏差値別 行ける高校一覧【2026年最新】偏差値40〜70の公立・私立' },
                { slug: 'all-3-high-school-options-2026-update', title: '【2026年】オール3の偏差値は40〜45｜内申27で行ける高校と逆転戦略' },
                { slug: 'naishin-target-grades-by-prefecture', title: '都道府県別の目標内申点ガイド｜偏差値別に必要な評定を解説' },
                { slug: 'naishinten-average-score', title: '内申点 平均は何点？45点満点の目安とオール3・オール4の立ち位置' },
                { slug: 'how-to-raise-naishinten', title: '内申点を上げる7つの方法｜3ヶ月で評定を上げる実践ガイド' },
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

          <ToolClusterNav current="hensachi" className="mt-8" />
        </div>
      </div>
    </>
  );
}
