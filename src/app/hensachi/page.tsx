import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, BookOpen, ChevronRight, Home, AlertTriangle, TrendingUp, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';

export const metadata: Metadata = {
  title: '偏差値計算サイト【5教科対応】中学生・高校生の偏差値を瞬時に算出 | My Naishin',
  description: '中学生・高校生向けの無料偏差値計算ツール。5教科の点数と平均点・標準偏差から、自分の偏差値を一瞬で計算。平均点しかわからない場合の簡易モードや、各教科の偏差値も同時に算出。志望校との距離も確認できます。',
  alternates: {
    canonical: 'https://my-naishin.com/hensachi',
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
              中学生・高校生向けの無料偏差値計算ツール。<br />
              点数・平均点・標準偏差から、あなたの偏差値を瞬時に算出します。
            </p>
          </header>

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
          <HensachiCalculator />

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

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-purple-500 pl-3">
              偏差値に関するよくある質問
            </h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 学校のテストの偏差値はどう計算する？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  学校のテストの偏差値は、クラスや学年全体の平均点と標準偏差を使って計算します。先生に平均点と標準偏差を聞いてもらえれば、当ツールの詳細モードで正確に計算できます。標準偏差が分からない場合は、簡易モード（標準偏差15）でおおよその目安が分かります。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 偏差値はマイナスになる？100を超える？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  理論上、偏差値は計算式上マイナスにも100超にもなり得ます。極端に低い点数や、満点近い得点を平均点との差が大きい状況で取った場合などです。ただし、模試などでは通常25〜75程度の範囲に収まります。当ツールでも同じ範囲を想定した表示にしています。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 偏差値を1ヶ月で5上げることは可能？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  苦手教科の底上げによっては可能です。たとえば苦手教科が偏差値40なら、基本問題を集中的に演習することで1ヶ月で偏差値50近くまで上げられる場合があります。ただし、偏差値60以上を1ヶ月で5上げるのは現実的に困難です。すでに高い偏差値帯では、伸びしろ自体が小さくなるためです。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 学校ごとの偏差値（合格偏差値）はどう見る？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  「○○高校の偏差値は65」という表現は、その学校に合格するための目安となる偏差値です。模試で偏差値65が安定して取れていれば、その学校に十分挑戦できるレベルといえます。志望校の偏差値は、進学塾や受験情報サイトで確認できます。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 内申点と偏差値、どちらを重視すべき？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  両方とも重要ですが、優先度は都道府県により異なります。<Link href="/tokyo/naishin" className="text-blue-600 underline">東京</Link>・<Link href="/kanagawa/naishin" className="text-blue-600 underline">神奈川</Link>など内申比率の高い地域では内申点が重要、当日点比率の高い地域では模試偏差値が重要です。詳しくは<Link href="/prefectures" className="text-blue-600 underline">都道府県別ページ</Link>や<Link href="/blog/naishin-target-grades-by-prefecture" className="text-blue-600 underline">都道府県別の目標内申点ガイド</Link>で確認してください。
                </p>
              </div>
            </div>
          </section>

          {/* 偏差値と高校 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-3 text-xs">
              無料の<AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）で詳細を確認
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
                { slug: 'all-3-high-school-options', title: '【2026年】オール3の偏差値は40〜45｜内申27で行ける高校と逆転戦略' },
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
