import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, GraduationCap, FileText, ChevronRightSquare, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { GakushuSeisekiCalculator } from '@/components/HyoteiHeikin/GakushuSeisekiCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '「学習成績の状況」とは何ですか？「評定平均」と同じですか？',
    answer:
      '大学入学者選抜（総合型選抜・学校推薦型選抜）の調査書に記載される正式名称です。文部科学省の通知に「評定平均」という語は一度も出てきません。「評定平均（値）」は世間でよく使われる旧称・通称で、指す内容は同じです。',
  },
  {
    question: '各教科の学習成績の状況はどう計算しますか？',
    answer:
      '教科ごとに、その教科に属する各科目の評定の合計を、科目数（評定数）で割り、小数点以下第2位を四捨五入します。文部科学省の公式計算例では、理科（物理基礎3・化学基礎3・生物基礎5）の場合 (3+3+5)÷3=3.66… → 3.7 となります。',
  },
  {
    question: '全体の学習成績の状況はどう計算しますか？',
    answer:
      'すべての教科・科目の評定の合計を、すべての評定数で割り、小数点以下第2位を四捨五入します。教科ごとの学習成績の状況の平均ではなく、履修した全科目の評定を単純平均する点に注意が必要です。',
  },
  {
    question: '修得単位数は計算に影響しますか？',
    answer:
      '影響しません。文部科学省の計算例では、4単位の科目も2単位の科目も同じ「評定数1」として数えます。単位数による重み付けは行わないため、このツールでも単位数の入力欄自体を設けていません。',
  },
  {
    question: '複数学年にわたって履修する科目（保健体育など）はどう数えますか？',
    answer:
      '各学年ごとの評定を、それぞれ1科目分として取り扱います。例えば体育を1〜3年で履修していれば3科目分、保健を1〜2年で履修していれば2科目分として計算に加えます。',
  },
  {
    question: '学習成績概評A〜Eはどう決まりますか？',
    answer:
      '3か年間における全体の学習成績の状況の値により、5.0〜4.3はA、4.2〜3.5はB、3.4〜2.7はC、2.6〜1.9はD、1.8以下はEと区分されます。',
  },
];

const HOWTO_STEPS = [
  { name: '教科・科目・学年・評定を入力する', text: '通知表や成績表を見ながら、履修した科目を1つずつ追加します。複数学年にわたる科目は学年ごとに別の行として入力してください。' },
  { name: '教科ごとの学習成績の状況を確認する', text: '入力した科目が教科別に自動集計され、教科ごとの学習成績の状況が表示されます。' },
  { name: '全体の学習成績の状況と概評を確認する', text: 'すべての評定の単純平均として全体の学習成績の状況が計算され、学習成績概評A〜Eも同時に表示されます。' },
];

export const metadata: Metadata = {
  title: '学習成績の状況（大学受験の評定平均）計算ツール【単位数の重み付けなし】| My Naishin',
  description:
    '大学入学者選抜（総合型選抜・学校推薦型選抜）の調査書に書かれる「学習成績の状況」を、文部科学省の公式計算方法どおりに算出する無料ツール。修得単位数は計算に使わないため入力欄自体がありません。教科別・全体の値と学習成績概評A〜Eを同時に確認できます。',
  keywords: [
    '学習成績の状況',
    '評定平均 大学',
    '評定平均 計算 高校生',
    '調査書 学習成績の状況',
    '学習成績概評',
    '評定平均 自動計算 高校生',
  ],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
  openGraph: {
    title: '学習成績の状況（大学受験の評定平均）計算ツール | My Naishin',
    description: '文部科学省の公式計算方法どおりに「学習成績の状況」を算出。単位数の重み付けは行いません。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki`,
    type: 'article',
  },
};

export default function GakushuSeisekiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
        ]}
      />
      <WebApplicationSchema
        name="学習成績の状況（大学受験の評定平均）計算ツール"
        description="大学入学者選抜の調査書に記載される「学習成績の状況」を、文部科学省の公式計算方法どおりに算出する無料ツール"
        url={`${SITE_URL}/hyotei-heikin/gakushu-seiseki`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-gakushu-seiseki"
        name="学習成績の状況の計算方法"
        description="教科・科目・学年・評定を入力し、教科別/全体の学習成績の状況と学習成績概評を算出する手順"
        totalTime="PT2M"
        steps={HOWTO_STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-emerald-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin" className="hover:text-emerald-600">評定平均計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">学習成績の状況（大学受験）</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              学習成績の状況 計算ツール【大学受験】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              総合型選抜・学校推薦型選抜の調査書に書かれる「学習成績の状況」（通称：評定平均）を、
              文部科学省の公式計算方法どおりに算出します。<strong className="text-emerald-700">修得単位数は計算に使いません。</strong>
            </p>
          </header>

          {/* 出典カード */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-600">
                <div className="mb-1 font-bold text-slate-800">計算根拠</div>
                文部科学省「令和９年度大学入学者選抜実施要項について（通知）」（令和８年５月27日付け
                ８文科高第318号）別紙様式１「調査書記入上の注意事項等について」8・9の記載どおりに実装しています。
                大学別の出願基準など推定値は一切含みません。
              </div>
            </div>
          </div>

          <div id="calculator-section">
            <GakushuSeisekiCalculator />
          </div>

          {/* 調査書シミュレーターへの導線（§7①本命ページ） */}
          <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-white p-5 text-center shadow-sm">
            <h2 className="mb-2 font-bold text-emerald-900">
              実際の調査書と同じ見た目で確認したい方へ
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              「調査書 様式１」と同じ並び（学習の記録→教科別の学習成績の状況→全体→概評）でシミュレーションできるツールもあります。
            </p>
            <Link
              href="/hyotei-heikin/gakushu-seiseki/chousasho"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              調査書シミュレーターを開く
            </Link>
          </div>

          {/* なぜ単位数を入れないのか */}
          <section className="mt-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">なぜ単位数を入力しないのか</h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              文部科学省の通知が示す公式計算例では、4単位の科目も2単位の科目も、同じ「評定数1」として数えています。
              調査書には「修得単位数」の欄がありますが、<strong>学習成績の状況の計算式そのものには単位数が一切登場しません</strong>。
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              単位数で重み付けして計算すると、通知の定義とは異なる数値になってしまいます。当ツールは単位数の入力欄自体を設けないことで、
              この間違いが構造的に起こらないようにしています。
            </p>
          </section>

          {/* 公式計算例 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              文部科学省の公式計算例で検算する
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">教科の学習成績の状況（理科の例）</h3>
                <div className="font-mono text-sm text-emerald-900">
                  物理基礎3・化学基礎3・生物基礎5 → (3+3+5) ÷ 3 = 3.66… → <strong className="text-base">3.7</strong>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-bold text-emerald-900 mb-2">全体の学習成績の状況の例</h3>
                <div className="font-mono text-sm text-emerald-900">
                  評定の合計120 ÷ 評定数31 = 3.87… → <strong className="text-base">3.9</strong>
                </div>
              </div>
            </div>
          </section>

          {/* 概評の表 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              学習成績概評A〜Eの区分
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white text-left">
                    <th className="border border-emerald-400 px-3 py-2 font-bold">全体の学習成績の状況</th>
                    <th className="border border-emerald-400 px-3 py-2 font-bold text-center">学習成績概評</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {[
                    ['5.0 〜 4.3', 'A'],
                    ['4.2 〜 3.5', 'B'],
                    ['3.4 〜 2.7', 'C'],
                    ['2.6 〜 1.9', 'D'],
                    ['1.8 以下', 'E'],
                  ].map(([range, rank]) => (
                    <tr key={rank} className="odd:bg-white even:bg-emerald-50/40">
                      <td className="border border-slate-200 px-3 py-2 font-mono">{range}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold">{rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              ※ 学習成績概評は、同一学年生徒全員の3か年間における全体の学習成績の状況をもとに、高等学校が付与するものです。
              このツールは参考値として同じ区分表を用いて表示しています。
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              ※ 学習成績概評はA〜Eの5段階のみです。「特に優秀な者に上位区分を追加できる」旨の規定を見かけることがありますが、
              現行の実施要項（下記出典）の本文にも調査書の様式にもその記載は確認できません。
              古い年度の実施要項に基づく情報が更新されないまま残っている可能性があるため、当ページでは現行の要項に記載のある内容のみを掲載しています。
            </p>
          </section>

          {/* 調査書の全体像（学習成績の状況以外の記載欄） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              調査書は「学習成績の状況」以外に何が書かれているか
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              大学入学者選抜の調査書（別紙様式1）は1枚の中に9つの記載区分があり、「学習成績の状況」はそのうちの1つに過ぎません。
              残り8区分は、このツールが計算する数値には一切影響しませんが、調査書全体としては志願者の能力・意欲・適性等を
              多面的・総合的に評価するための材料として使われます。以下、様式の構成をそのまま解説します。
            </p>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800 mb-1">5. 総合的な探究の時間の記録</h3>
                <p>
                  「学習活動」「観点」「評価」の3列で構成されます。⚠️令和4年度以前の実施要項では
                  「総合的な<strong>学習</strong>の時間」という名称でしたが、現行の実施要項（8文科高第318号）では
                  新しい学習指導要領に対応した「総合的な<strong>探究</strong>の時間」に変わっています。
                  職業教育を主とする専門学科で「課題研究」等の履修によって代替した場合や、
                  理数科で「理数探究基礎」「理数探究」の履修によって代替した場合は、この欄に斜線が引かれます。
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800 mb-1">6. 特別活動の記録</h3>
                <p>
                  「ホームルーム活動」「生徒会活動」「学校行事」の3項目について、各学校が設定した観点に照らして
                  十分に満足できる活動状況にあると判断される場合に、学年ごと（第1〜第4学年）に○印が記入される表です。
                  部活動の実績はここではなく、次の「指導上参考となる諸事項」で扱われます。
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800 mb-1">7. 指導上参考となる諸事項</h3>
                <p>
                  生徒の特徴・特技や学校外の活動等について、学習指導等を進めていく上で必要な情報として精選して記入される欄です。
                  記入する内容が無い場合はその旨が明示され、複数の学年を通じた記入が適当である場合は各学年ごとの記入を要しません。
                  留学に該当する場合は留学期間・留学先の国名・学校名も、この欄に記入されます。
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800 mb-1">9. 出欠の記録</h3>
                <p>
                  学年ごとに「授業日数」「出席停止・忌引き等の日数」「留学中の授業日数」「出席しなければならない日数」
                  「欠席日数」「出席日数」「備考」を記載します。指導要録の当該欄の記載事項をそのまま転記するものとされており、
                  高等学校が独自に加工・要約することはありません。
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              ※ 8・9欄以外に「1. ふりがな・氏名等」「2. 各教科・科目等の学習の記録」「3. 各教科の学習成績の状況／全体の学習成績の状況」
              「4. 学習成績概評」「8. 備考」の計9区分で様式1枚が構成されています。
            </p>
          </section>

          {/* 令和9年度からの面接原則必須化 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              令和9年度から、総合型・学校推薦型選抜は面接が原則必須に
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              学習成績の状況は調査書に記載される数値の1つですが、それだけで合否が決まるわけではありません。
              現行の実施要項では、令和9年度大学入学者選抜から、総合型選抜・学校推薦型選抜の両方で面接が
              原則として必須化されました。
            </p>
            <blockquote className="border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「入学志願者の能力・意欲・適性等を多面的・総合的に評価・判定する総合型選抜の趣旨に鑑み、志望する
              学問分野に対する意欲や適性等に係る面接（ディベート、集団討論、プレゼンテーション、口頭試問等を
              含む。オンラインによる実施を含む。）による評価を必ず行う。」
            </blockquote>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号）
              第3 入試方法 1(2)②
              <a
                href="https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              学校推薦型選抜についても同様の面接必須化が定められています。ただし、令和8年度に既に実施されて
              いた選抜区分のうち面接の導入が難しいものについては、遅くとも令和11年度までの経過措置が設けられて
              います。学習成績の状況は「出願できるかどうか」の基準として使われることが多い一方、面接は出願後の
              合否判定に直接関わるため、両方を分けて準備しておく必要があります。
            </p>
          </section>

          {/* 「評定平均」から「学習成績の状況」への名称変更の経緯 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              なぜ「評定平均」ではなく「学習成績の状況」と呼ぶのか
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              世間では「評定平均」「評定平均値」という呼び方が広く定着していますが、これは大学入試の実務上の通称であり、
              文部科学省が定める公式名称ではありません。令和3年度以降の大学入学者選抜実施要項および調査書の様式では、
              一貫して「学習成績の状況」という表記が使われています。
            </p>
            <blockquote className="border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「『学習成績概評』の欄は、高等学校における同一学年生徒全員（中略）の3か年間における全体の学習成績の状況を
              次の区分に従って、A、B、C、D、Eの5段階に分け、その生徒の属する成績段階を記入すること。」
            </blockquote>
            <p className="mt-3 text-xs text-slate-500">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号文部科学省高等教育局長通知）
              調査書記入上の注意事項等について 9(1)
              <a
                href="https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              通知本文・調査書様式のいずれにも「評定平均」という語は一度も登場しません。「評定平均」は指導要録の評定を
              単純に平均するという計算方法をそのまま言い表した通称で、指す内容自体は「学習成績の状況」と同じです。
              進路指導の現場や受験情報サイトでは今も旧称が広く使われているため、両方の呼び方を知っておくと混乱しません。
            </p>
          </section>

          {/* なぜ学習成績の状況が重要なのか（T-N5第2ラウンド・外部一次ソースA） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              なぜ学習成績の状況が重要なのか（推薦・総合型選抜の実施状況）
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              一般選抜（学力試験中心）では学習成績の状況が直接問われる場面は限られますが、
              学校推薦型選抜では出願条件・選考資料として重視されます。文部科学省の調査によると、
              私立大学の入学者の<strong>約4割が学校推薦型選抜</strong>で入学しています。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4 font-normal">区分</th>
                    <th className="py-2 pr-4 text-right font-normal">学校推薦型選抜による入学者の割合</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-600">国立大学</td>
                    <td className="py-2 pr-4 text-right font-semibold text-slate-700">12.7%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-600">公立大学</td>
                    <td className="py-2 pr-4 text-right font-semibold text-slate-700">26.9%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-600">私立大学</td>
                    <td className="py-2 pr-4 text-right font-semibold text-slate-700">38.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和7年度国公私立大学入学者選抜実施状況」（令和7年5月1日現在集計）。
              学校推薦型選抜による入学者数（国立12,706人・公立9,732人・私立198,977人）を、
              入学者数総数（国立99,962人・公立36,236人・私立512,232人）で除して算出。
              <a
                href="https://www.mext.go.jp/content/20251126-mxt_daigakuc02-000045982_01.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              一般選抜だけを見て「学力試験の結果がすべて」と考えると、私立大学志望者の一部が
              重視する評価軸を見落とすことになります。学校推薦型選抜（総合型選抜を含まない）だけで
              入学者の4割近くを占める私立大学では、学習成績の状況を早い段階から把握しておく実益が
              大きいといえます。
            </p>
          </section>

          {/* 評定はどう付くのか（T-N5第2ラウンド・外部一次ソースB） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              評定はどう付くのか（3観点から5段階への総括）
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              このツールが計算する「学習成績の状況」は評定（5段階）を単純平均した値ですが、
              その評定自体がどう付くのかは国立教育政策研究所の資料で説明されています。
              各教科の学習評価は、まず3つの観点それぞれをA・B・Cの3段階で評価し、
              それらを<strong>総括</strong>したものが5段階の評定になります。
            </p>
            <blockquote className="border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「各教科における観点別学習状況の評価の観点については、「知識・技能」「思考・判断・表現」
              「主体的に学習に取り組む態度」の3観点に整理されています。」
            </blockquote>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：国立教育政策研究所 教育課程研究センター「学習評価の在り方ハンドブック 高等学校編」
              （令和元年6月）P6「学習評価の基本構造」
              <a
                href="https://www.nier.go.jp/kaihatsu/pdf/gakushuhyouka_R010613-02.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              同資料の図解では、「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」を
              観点ごとにA・B・Cの3段階で評価し、その結果を総括したものが5段階の評定であると
              整理されています。さらに、観点別評価や評定には示しきれない一人一人のよい点や可能性・
              進歩の状況は「個人内評価」として別に見取ることとされており、評定の数字だけが
              学習評価のすべてではない点も明記されています。「主体的に学習に取り組む態度」については、
              授業への取組の回数や挙手の多さのような表面的な行動ではなく、
              ①粘り強く学習に取り組もうとする側面と②自らの学習を調整しようとする側面の2つから
              評価することが求められる、と説明されています。
            </p>
          </section>

          {/* 相互リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/hyotei-heikin"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                中学生向け評定平均計算（9教科）
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gyakusan"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                目標に必要な評定を逆算する
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/suisen-kijun"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                推薦・併願優遇の評定基準を見る
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/kyoka-betsu"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                教科ごとの学習成績の状況を計算
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/gaihyou"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                概評A〜Eまであと何点？境界チェック
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/yokuaru-machigai"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                計算でよくある3つの誤りを検証
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/tousei-han-i"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                到達可能範囲をチェック（高1・高2向け）
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/kakomon-jisaiten"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                過去問の自己採点結果と併せて確認する
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/developers"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  API・MCPで自動計算する
                </span>
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
