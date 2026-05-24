import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, TrendingUp, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HyoteiHeikinCalculator } from '@/components/HyoteiHeikin/HyoteiHeikinCalculator';

export const metadata: Metadata = {
  title: '評定平均 自動計算【中学生対応】通知表からワンクリックで算出 | My Naishin',
  description: '中学生の評定平均（通知表の平均値）を自動計算する無料ツール。9教科の評定を入力するだけで、評定平均（4.2など）が瞬時に算出され、高校入試での「内申点」相当の数値も同時に確認できます。推薦入試の基準にもどうぞ。',
  alternates: {
    canonical: 'https://my-naishin.com/hyotei-heikin',
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
          <HyoteiHeikinCalculator />

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

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
