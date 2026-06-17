import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Calculator, ArrowRight, HelpCircle, Sigma } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '調査書点と内申点は同じものですか？',
    answer:
      'ほぼ同じ意味で使われます。正確には、調査書に書かれた各教科の評定を、都道府県の方式で点数化したものが「調査書点（＝内申点）」です。地域によって「内申点」「調査書点」「調査書素点」など呼び方が異なりますが、指しているのは評定を点数化した数値です。',
  },
  {
    question: '調査書点はどうやって計算されますか？',
    answer:
      '基本は「9教科の5段階評定の合計（素内申・最大45）」を出発点に、都道府県ごとの方式で換算します。たとえば実技4教科を2倍にする地域、中1〜中3を一定比率で合算する地域、独自の満点（東京1020点・神奈川S値など）に直す地域があります。お住まいの都道府県の計算機で正確な値が出せます。',
  },
  {
    question: '調査書点と当日点（学力検査）はどう合わさりますか？',
    answer:
      '多くの地域で「調査書点＋当日点（学力検査）」の合計＝総合得点で合否を判定します。配点比率は地域でさまざまで、内申重視の地域もあれば当日点重視の地域もあります。志望校のボーダーから「あと何点必要か」を逆算しておくと、対策の優先順位が決まります。',
  },
  {
    question: '評定平均と調査書点の関係は？',
    answer:
      '評定平均は「9教科の評定の合計÷9（例：4.0）」で、推薦入試の出願基準などに使われます。調査書点（内申点）は同じ評定を入試用に点数化したもので、表現の仕方が違うだけで元データは同じ通知表の評定です。当ツールでは評定平均と素内申を同時に確認できます。',
  },
];

export const metadata: Metadata = {
  title: '調査書点と内申点・評定平均の関係｜評定がどう合否に効くか【高校受験】 | My Naishin',
  description:
    '調査書に書かれた評定が、内申点（調査書点）・評定平均にどう変換され、当日点と合わさって合否（総合得点）に効くのかをわかりやすく解説。評定→素内申→換算内申→調査書点→総合得点の流れを、都道府県別の無料計算ツールつきで確認できます。',
  keywords: ['調査書点', '調査書点 内申点', '調査書点 計算', '内申点 評定平均 違い', '調査書 評定', '総合得点 内申', '調査書 合否'],
  alternates: { canonical: `${SITE_URL}/chousasho/hyoutei` },
  openGraph: {
    title: '調査書点と内申点・評定平均の関係｜評定がどう合否に効くか',
    description: '評定→素内申→換算内申→調査書点→総合得点の流れを、都道府県別の無料計算ツールつきで解説。',
    url: `${SITE_URL}/chousasho/hyoutei`,
    type: 'website',
  },
};

const FLOW = [
  ['通知表の評定（5段階）', '各教科1〜5。日々の提出物・テスト・授業態度で決まる。'],
  ['素内申（合計）', '9教科の評定を単純合計（最大45）。オール3なら27。'],
  ['換算内申（都道府県方式）', '実技2倍・学年比率など地域の方式で点数化。'],
  ['調査書点（内申点）', '入試で使う最終的な内申の点数。満点は地域で異なる。'],
  ['総合得点', '調査書点＋当日点（学力検査）の合計で合否判定。'],
];

export default function ChousashoHyoteiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '調査書とは', url: `${SITE_URL}/chousasho` },
          { name: '内申点・評定平均との連動', url: `${SITE_URL}/chousasho/hyoutei` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/chousasho" className="hover:text-blue-600">調査書とは</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点・評定平均との連動</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">調査書点と内申点・評定平均の連動</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              調査書の<strong>評定</strong>が、<strong>内申点（調査書点）・評定平均</strong>にどう変換され、
              当日点と合わさって<strong>合否（総合得点）</strong>に効くのかを整理しました。
            </p>
          </header>

          <AnswerBox question="評定はどう「合否の点数」になる？">
            <p>
              通知表の<strong>評定</strong>を単純合計したのが<strong>素内申</strong>（最大45）、それを都道府県の方式で点数化したのが
              <strong>換算内申＝調査書点（内申点）</strong>です。入試では<strong>調査書点＋当日点（学力検査）＝総合得点</strong>で合否が決まります。
              評定平均（合計÷9）は同じ評定の別表現で、主に推薦の出願基準に使われます。
            </p>
          </AnswerBox>

          {/* フロー */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Sigma className="h-5 w-5 text-emerald-600" />
              評定 → 調査書点 → 総合得点 の流れ
            </h2>
            <ol className="space-y-2">
              {FLOW.map(([t, d], i) => (
                <li key={t}>
                  <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">{i + 1}</span>
                    <span>
                      <span className="block text-sm font-bold text-slate-800">{t}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{d}</span>
                    </span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div className="flex justify-center py-1"><ArrowRight className="h-4 w-4 rotate-90 text-slate-300" /></div>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* ツール導線 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/', title: '内申点を計算する（調査書点）', desc: '47都道府県の方式で評定→調査書点を換算' },
              { href: '/hyotei-heikin', title: '評定平均を計算する', desc: '推薦の出願基準と比べる（合計÷9）' },
              { href: '/total-score', title: '総合得点で合否を見る', desc: '調査書点＋当日点の合計で県別に判定' },
              { href: '/reverse', title: '志望校から逆算する', desc: 'ボーダーから必要な当日点を逆算' },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span>
                  <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-700">{c.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                </span>
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-emerald-600" />よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">{f.question}<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" /></span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
