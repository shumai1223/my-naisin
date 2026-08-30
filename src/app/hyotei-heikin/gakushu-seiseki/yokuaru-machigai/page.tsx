import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle, ChevronRightSquare, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: 'ここに載っている数値は文部科学省の公式計算例そのものですか？',
    answer:
      'いいえ。文部科学省の通知が示す公式計算例（理科3.66→3.7、全体120÷31=3.87→3.9）は、通知自身が「・・・」と省略した形の抜粋例であり、単位数や学年の内訳がすべて明らかになっているわけではありません。このページの3つの検証は、通知に明記された計算ルールに正確に基づいた、当サイトが作成したわかりやすい具体例です。数値を実際に動かして誤りとの差を確認できるようにしています。',
  },
  {
    question: 'なぜ単位数で重み付けしてはいけないのですか？',
    answer:
      '文部科学省の通知（別紙様式１「調査書記入上の注意事項等について」8(2)(4)）が示す計算例では、4単位の科目も2単位の科目も同じ「評定数1」として数えています。単位数は修得単位数の欄には記載されますが、学習成績の状況の計算式には一切登場しません。',
  },
  {
    question: '教科ごとの平均をさらに平均してはいけないのはなぜですか？',
    answer:
      '通知は「全体の学習成績の状況は、すべての教科・科目の評定の合計数をすべての評定数で除した数値」と定義しています（8(4)）。これは全科目の評定を1つのグループとして単純平均するという意味で、教科ごとに平均を出してから、その教科平均をさらに平均するという2段階の計算とは異なります。',
  },
  {
    question: '3年生の成績だけで計算してはいけないのはなぜですか？',
    answer:
      '学習成績概評の対象は「３か年間における全体の学習成績の状況」と定義されています（9(1)）。3年生の評定だけを使うと、1・2年生の評定が反映されず、通知が定義する概評の判定対象と異なる範囲になってしまいます。',
  },
];

const HOWTO_STEPS = [
  { name: '正しい計算方法を確認する', text: '文部科学省の通知が定めるルール（単位数不使用・全評定の単純平均・3か年間対象）を確認します。' },
  { name: 'よくある誤った方法の数値を確認する', text: '同じ入力データに誤った方法を適用すると、どれだけ違う数値になるかを具体例で確認します。' },
  { name: '自分の計算方法を見直す', text: '自分や周囲が使っている計算方法が、単位数の重み付け・教科平均の平均・単年度のみのいずれかに当てはまっていないか確認します。' },
];

export const metadata: Metadata = {
  title: 'よくある3つの誤り｜学習成績の状況の計算で間違えやすいポイント検証 | My Naishin',
  description:
    '学習成績の状況（大学受験の評定平均）の計算で実際に起こりやすい3つの誤り（単位数での重み付け・教科平均の平均・3年生のみでの計算）を、具体例で実際に計算して正しい方法との差を検証します。文部科学省の通知の該当箇所を出典付きで解説。',
  keywords: ['学習成績の状況 計算 間違い', '評定平均 計算 誤り', '評定平均 単位数', '学習成績の状況 教科平均'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/yokuaru-machigai` },
  openGraph: {
    title: 'よくある3つの誤り｜学習成績の状況の計算検証 | My Naishin',
    description: '単位数の重み付け・教科平均の平均・3年生のみ計算という3つの誤りを具体例で検証。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/yokuaru-machigai`,
    type: 'article',
  },
};

interface ErrorCase {
  title: string;
  reasonTitle: string;
  reason: string;
  data: string;
  correctLabel: string;
  correctValue: string;
  wrongLabel: string;
  wrongValue: string;
}

const ERROR_CASES: ErrorCase[] = [
  {
    title: '① 単位数で重み付けする',
    reasonTitle: '通知8(2)(4): 単位数は評定数に一切影響しない',
    reason:
      '文部科学省の計算例では、4単位の科目も2単位の科目も同じ「評定数1」として数えます。単位数による重み付けは行いません。',
    data: '具体例: 保健（評定2・2単位）／家庭総合（評定5・4単位）',
    correctLabel: '正しい方法（単位数を使わない単純平均）',
    correctValue: '(2 + 5) ÷ 2 = 3.5',
    wrongLabel: '誤った方法（単位数で加重平均）',
    wrongValue: '(2×2 + 5×4) ÷ (2+4) = 24 ÷ 6 = 4.0',
  },
  {
    title: '② 教科ごとの平均をさらに平均する',
    reasonTitle: '通知8(4): 全体は「すべての評定の合計÷すべての評定数」',
    reason:
      '全体の学習成績の状況は、履修した全科目の評定を1つのグループとして単純平均します。教科別の学習成績の状況（教科ごとの平均）をさらに平均する2段階計算ではありません。',
    data: '具体例: 国語（評定5・1科目）／数学（評定1・評定1・評定1の3科目）',
    correctLabel: '正しい方法（全評定の単純平均）',
    correctValue: '(5 + 1 + 1 + 1) ÷ 4 = 2.0',
    wrongLabel: '誤った方法（教科平均の平均）',
    wrongValue: '(国語5.0 + 数学1.0) ÷ 2 = 3.0',
  },
  {
    title: '③ 3年生の成績だけで計算する',
    reasonTitle: '通知9(1): 概評の対象は「３か年間における全体の学習成績の状況」',
    reason:
      '学習成績概評は、1〜3年生（定時制・通信制で修業年限が3年を超える場合は当該期間）の全体の学習成績の状況をもとに判定します。3年生の評定だけを使うと対象範囲が異なります。',
    data: '具体例: 体育（1年:評定3／2年:評定4／3年:評定5・各学年1科目分）',
    correctLabel: '正しい方法（3か年間の単純平均）',
    correctValue: '(3 + 4 + 5) ÷ 3 = 4.0',
    wrongLabel: '誤った方法（3年生の評定のみ）',
    wrongValue: '5 ÷ 1 = 5.0',
  },
];

export default function YokuaruMachigaiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
          { name: 'よくある3つの誤り', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/yokuaru-machigai` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-yokuaru-machigai"
        name="学習成績の状況の計算でよくある誤りの確認方法"
        description="単位数での重み付け・教科平均の平均・3年生のみでの計算という3つの誤りを、正しい方法と比較して確認する手順"
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
            <Link href="/hyotei-heikin/gakushu-seiseki" className="hover:text-emerald-600">学習成績の状況</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">よくある3つの誤り</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              学習成績の状況｜よくある3つの誤り
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              同じ評定データでも、計算方法を間違えると<strong className="text-emerald-700">違う数値</strong>になります。
              実際に数字を動かして、正しい方法との差を検証します。
            </p>
          </header>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                以下の3つの検証で使う具体例は、文部科学省の通知に定められた<strong>計算ルール</strong>（単位数不使用・全評定の単純平均・3か年間対象）
                を正確に反映した、当サイトが作成したわかりやすい例です。通知自身が示す公式計算例（理科3.66→3.7・全体120÷31=3.87→3.9）は
                <Link href="/hyotei-heikin/gakushu-seiseki" className="font-bold text-emerald-700 underline">学習成績の状況 計算ツール</Link>
                のページで確認できます。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {ERROR_CASES.map((c) => (
              <section key={c.title} className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-800">{c.title}</h2>
                <div className="mb-3 text-xs font-bold text-emerald-700">{c.reasonTitle}</div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{c.reason}</p>
                <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600">{c.data}</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                      {c.correctLabel}
                    </div>
                    <div className="font-mono text-sm font-bold text-emerald-900">{c.correctValue}</div>
                  </div>
                  <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-red-700">
                      <XCircle className="h-4 w-4" />
                      {c.wrongLabel}
                    </div>
                    <div className="font-mono text-sm font-bold text-red-800">{c.wrongValue}</div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* 原文の定義をそのまま確認する */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              定義を原文で確認する
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              上の3つの誤りが起きやすい理由の1つは、文部科学省の通知が示す公式の計算例が
              「（国語4+3）＋（地歴5+4+4+4）＋・・・」のように途中を省略した略式表記になっており、
              定義そのものの一文を読み飛ばしてしまいやすいことです。定義の条文自体は次のとおりです。
            </p>
            <blockquote className="mb-3 border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「各教科の学習成績の状況は、指導要録に基づき、各教科ごとに各科目の評定の合計数を各教科の評定数で
              除した数値（小数点以下第2位を四捨五入）を記入すること。」
            </blockquote>
            <blockquote className="border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「全体の学習成績の状況は、指導要録に基づき、すべての教科・科目の評定の合計数をすべての評定数で
              除した数値（小数点以下第2位を四捨五入）を記入すること。」
            </blockquote>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号）
              調査書記入上の注意事項等について8(2)・8(4)
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
              2つの定義に共通するのは「合計数を評定数（科目数）で除する」という単純平均であり、単位数・重み・
              教科という中間段階を一切経由しない点です。「教科ごとの学習成績の状況」と「全体の学習成績の状況」は
              別々に、それぞれ指導要録の評定から直接計算する独立した値であることが、条文からも読み取れます。
            </p>
          </section>

          {/* T-N5第3ラウンド: 留学・IBという「計算に含める/含めない」の境界ケース */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              留学・国際バカロレアは含める？含めない？
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              「3つの誤り」以外にも、通知には計算対象の範囲そのものを左右する2つの規定があります。
              単位数の重み付けや教科平均の平均と違い、こちらは「この単位・評定を計算に入れるかどうか」の
              境界を定めたものです。
            </p>
            <h3 className="mb-2 text-sm font-bold text-slate-800">留学中に修得した単位は算入しない</h3>
            <blockquote className="mb-3 border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「「各教科の学習成績の状況」及び「全体の学習成績の状況」の欄については、次のように記入すること。
              なお、留学に係る修得単位については、算入する必要がない。」
            </blockquote>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              留学先の高等学校で修得した単位の評定は、学習成績の状況の計算そのものには含めなくてよいと
              定められています（留学の記録自体は別欄に記載されます）。
            </p>
            <h3 className="mb-2 text-sm font-bold text-slate-800">国際バカロレア（IB）の科目は含める</h3>
            <blockquote className="mb-3 border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm italic leading-relaxed text-slate-700">
              「国際バカロレア・ディプロマ・プログラムの科目に係る調査書の扱いについては、国際バカロレア・
              ディプロマ・プログラムの科目等の履修及び単位の修得をもって高等学校学習指導要領の科目の履修
              及び単位の修得とみなしている場合又は代替している場合についても、それらに係る学校設定科目等
              の評定を含めて学習成績の状況を算出すること（事務連絡参照）。」
            </blockquote>
            <p className="text-sm leading-relaxed text-slate-700">
              留学単位とは逆に、IBディプロマ・プログラムの科目が高等学校の科目の履修・単位修得とみなされて
              いる場合は、その学校設定科目等の評定を学習成績の状況の計算に含めることが明記されています。
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号）
              調査書記入上の注意事項等について8柱書・8(3)
              <a
                href="https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/hyotei-heikin/gakushu-seiseki" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                学習成績の状況 計算ツール
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link href="/hyotei-heikin/gakushu-seiseki/chousasho" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                調査書シミュレーター
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
