import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, FileText, ListChecks, Scale, HelpCircle, PenLine, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '調査書と内申点の違いは何ですか？',
    answer:
      '調査書は中学校が作成して高校に提出する「書類そのもの」で、学習の記録（各教科の評定）・特別活動・行動の記録・出欠などが書かれています。そのうち「各教科の評定」を高校入試用に点数化したものが内申点（調査書点）です。つまり調査書は書類全体、内申点はその中の数値部分を指します。',
  },
  {
    question: '調査書には何が書かれますか？',
    answer:
      '主に①各教科の学習の記録（5段階の評定）②総合所見および指導上参考となる諸事項（特別活動・部活動・委員会・資格など）③行動の記録④出欠の記録、が記載されます。高校入試で点数化されるのは主に①の評定で、②〜④は参考資料として扱われることが多いです（扱いは都道府県・学校で異なります）。',
  },
  {
    question: '調査書はいつの成績が対象になりますか？',
    answer:
      '都道府県によって異なり、「中3のみ」「中2・中3」「中1〜中3の3年間」の3パターンに大きく分かれます。中1から対象になる地域では、1年生の成績から入試に影響します。お住まいの地域の対象学年は都道府県別ページで確認できます。',
  },
  {
    question: '調査書は誰がいつ書きますか？申請は必要ですか？',
    answer:
      '調査書は在籍する中学校（担任・進路指導の先生）が作成します。受験校が決まる中3の冬（出願前）に、生徒・保護者が学校へ「調査書の発行」を依頼するのが一般的です。私立の併願校ぶんも必要になるため、出願校数を早めに学校へ伝えておくとスムーズです。',
  },
  {
    question: '調査書の内容は自分で確認できますか？',
    answer:
      '評定（成績）は通知表で確認できますが、調査書そのものは原則として開封・閲覧できない形（厳封）で高校へ提出されます。気になる場合は三者面談などで先生に「今の評定」「記載される活動」を確認しておくと安心です。出欠や行動の記録も見られるため、日々の積み重ねが大切です。',
  },
];

export const metadata: Metadata = {
  title: '調査書とは？内申点との違い・記載内容・いつの成績かをわかりやすく解説 | My Naishin',
  description:
    '高校受験の「調査書」とは何かを、内申点との違い・記載内容（学習の記録/特別活動/行動の記録/出欠）・対象学年・誰がいつ書くかまで、当事者目線でわかりやすく解説。調査書の評定を点数化した「内申点（調査書点）」は、お住まいの都道府県の方式で無料計算できます。',
  keywords: ['調査書', '調査書とは', '調査書 内申点 違い', '調査書 記載内容', '調査書 高校受験', '内申書', '調査書 いつの成績', '調査書点'],
  alternates: { canonical: `${SITE_URL}/chousasho` },
  openGraph: {
    title: '調査書とは？内申点との違い・記載内容をわかりやすく解説 | My Naishin',
    description: '調査書の意味・内申点との違い・記載内容・対象学年を当事者目線で解説。内申点（調査書点）は都道府県別に無料計算。',
    url: `${SITE_URL}/chousasho`,
    type: 'website',
  },
};

const CONTENTS = [
  {
    icon: ListChecks,
    title: '調査書に書かれる4つの内容',
    items: [
      ['学習の記録（各教科の評定）', '9教科の5段階評定。入試で点数化される中心部分（＝内申点）。'],
      ['総合所見・特別活動の記録', '部活動・委員会・生徒会・ボランティア・資格・表彰など。'],
      ['行動の記録', '基本的な生活態度や責任感などの項目別の記録。'],
      ['出欠の記録', '欠席・遅刻の日数。理由が記載される場合もあります。'],
    ],
  },
];

export default function ChousashoPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '調査書とは', url: `${SITE_URL}/chousasho` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">調査書とは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">調査書とは？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校受験で中学校が作成・提出する「調査書」について、<strong>内申点との違い</strong>・<strong>記載内容</strong>・
              <strong>いつの成績が対象か</strong>を、当事者目線でわかりやすく整理しました。
            </p>
          </header>

          <AnswerBox question="調査書とは？内申点とどう違う？">
            <p>
              <strong>調査書</strong>は、中学校が作成して高校へ提出する書類そのものです。各教科の評定（5段階）・特別活動・行動の記録・出欠などが書かれています。
              このうち「各教科の評定」を高校入試用に点数化したものが<strong>内申点（調査書点）</strong>です。
              つまり<strong>調査書＝書類全体／内申点＝その中の数値部分</strong>。点数化の方法（満点・実技の倍率・対象学年）は都道府県で大きく異なります。
            </p>
          </AnswerBox>

          {/* 記載内容 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListChecks className="h-5 w-5 text-blue-600" />
              調査書に書かれる内容
            </h2>
            <div className="space-y-3">
              {CONTENTS[0].items.map(([t, d]) => (
                <div key={t} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-800">{t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 入試で点数化される中心は「学習の記録（評定）」です。特別活動・行動・出欠の扱いは都道府県・学校で異なります。
            </p>
          </section>

          {/* 調査書 vs 内申点 vs 通知表 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Scale className="h-5 w-5 text-blue-600" />
              「調査書」「内申点」「通知表」の関係
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">用語</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">何を指すか</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">誰が見る／使う</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">通知表</td>
                    <td className="border border-slate-200 px-3 py-2">学期ごとの成績表（評定・所見）。家庭で受け取る。</td>
                    <td className="border border-slate-200 px-3 py-2">生徒・保護者</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">調査書</td>
                    <td className="border border-slate-200 px-3 py-2">入試用に学校が作る書類（評定＋活動＋出欠など）。厳封で高校へ。</td>
                    <td className="border border-slate-200 px-3 py-2">高校（出願先）</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">内申点（調査書点）</td>
                    <td className="border border-slate-200 px-3 py-2">調査書の評定を都道府県方式で点数化した数値。</td>
                    <td className="border border-slate-200 px-3 py-2">合否判定（学力検査と合算）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              同じ「評定」が、家庭では通知表、入試では調査書という形になり、点数化されると内申点になります。素内申と換算内申の違いは
              <Link href="/blog/kansan-naishin-vs-su-naishin" className="font-bold text-blue-600 hover:underline">こちらの記事</Link>で図解しています。
            </p>
          </section>

          {/* 子ページ導線 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/chousasho/kakikata" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <PenLine className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-blue-700">調査書の書き方・発行の流れ<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">いつ・誰に・どう依頼するか。出願校数の伝え方と注意点。</span>
              </span>
            </Link>
            <Link href="/chousasho/hyoutei" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Calculator className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-blue-700">調査書と内申点・評定平均の連動<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">評定→内申点→調査書点へ。総合得点での合否の仕組み。</span>
              </span>
            </Link>
          </section>

          {/* ツール導線 */}
          <section className="mt-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">調査書の評定を「内申点」に換算してみる</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              調査書の中心は各教科の評定です。お住まいの都道府県の方式で、評定を内申点（調査書点）に無料で換算できます。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                <Calculator className="h-4 w-4" />
                内申点を計算する（47都道府県対応）
              </Link>
              <Link href="/total-score" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 ring-1 ring-blue-200 transition-colors hover:bg-blue-50">
                総合得点（内申＋当日点）で合否を見る
              </Link>
            </div>
          </section>

          {/* 保護者リード（調査書＝三者面談・出願の文脈。家庭教師の無料体験＝live） */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="mendan"
              heading="調査書（評定）で志望校に届くか、早めに見極めを"
              body="調査書の中心は日々の評定です。出願前に「今の成績で何が足りないか」を把握しておくと、三者面談や志望校選びが具体的になります。小中高対応のオンライン家庭教師の無料体験で、弱点を見える化できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* FAQ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              調査書 よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 調査書の「次のステップ」（推薦＝調査書で勝負／不登校＝出欠の文脈） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">調査書の次のステップ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/suisen-nyuushi', title: '推薦入試とは？（調査書で勝負する入試）', desc: '指定校・公募・総合型の違いと、調査書・評定の準備' },
                { href: '/hyouka-kijun', title: '観点別評価の仕組み（評定がどう決まる）', desc: '3観点で何が評価され、調査書の評定になるか' },
                { href: '/futoukou', title: '不登校と内申点（出欠の記録と受験）', desc: '欠席日数は調査書にどう書かれ、合否にどう影響するか' },
                { href: '/mendan', title: '三者面談で調査書・評定を確認する', desc: '面談で聞くこと・今の評定の把握' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="group flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
                  <span>
                    <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700">{c.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <ToolClusterNav current="naishin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
