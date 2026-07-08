import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Home as HomeIcon, MessageCircle, ClipboardCheck, Scale, HelpCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { FutoukouLeadCTA } from '@/components/FutoukouLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const STEPS = [
  { name: '担任・学校に相談する', text: 'まず在籍校の担任・スクールカウンセラーに、自宅やフリースクールでの学習を出席扱いにできないか相談する。学校ごとに対応や窓口が異なるため、早めの相談が大切。' },
  { name: '在籍校と連携できる学習方法を選ぶ', text: 'オンライン学習サービスやフリースクールの中には、在籍校と連携し学習状況を共有する仕組みを持つところがある。連携実績があるかを事前に確認する。' },
  { name: '学習の記録・報告を残す', text: '取り組んだ内容・時間・提出物などの記録を残し、学校に定期的に報告する。評価材料が残るほど、学校側も判断しやすくなる。' },
  { name: '校長の総合判断を待つ', text: '出席扱いにするかどうかは、最終的に在籍校の校長が総合的に判断する。認められるかは学校・状況によって異なるため、結果を急がず学校との対話を続ける。' },
];

const FAQS = [
  {
    question: '「出席扱い」とは何ですか？',
    answer:
      '学校に登校していなくても、自宅でのICT（オンライン）学習やフリースクールでの活動などが、在籍する中学校の「出席」として認められる仕組みです。文部科学省の通知に基づき、一定の要件を満たし在籍校の校長が認めた場合に扱われます。認められると調査書の出欠の記録にも反映されます。',
  },
  {
    question: '出席扱いになると、どんなメリットがありますか？',
    answer:
      '調査書に記載される出欠の記録が改善し、欠席日数だけで不利になる心配が和らぎます。ただし出欠の扱いは選抜区分によって重視される度合いが異なるため、出席扱いになった場合も、当日点重視の選抜区分など複数の選択肢を並行して確認しておくと安心です。',
  },
  {
    question: '出席扱いにしてもらうには、まず何をすればいいですか？',
    answer:
      'まずは在籍校の担任やスクールカウンセラーに相談することから始まります。学校ごとに窓口や進め方が異なるため、利用を検討している学習方法（オンライン学習・フリースクールなど）が決まっていなくても、早い段階で相談しておくとその後の調整がしやすくなります。',
  },
  {
    question: 'オンライン学習を使えば必ず出席扱いになりますか？',
    answer:
      '必ずなるわけではありません。学習方法が在籍校と連携できる体制を持っているか、学習の記録が残せるかなど複数の要素を踏まえ、最終的に校長が判断します。利用を検討する際は、学校と連携した実績があるサービスかどうかを確認するのが現実的です。',
  },
  {
    question: '出席扱いにならなかった場合、受験に不利になりますか？',
    answer:
      '出席扱いにならなかった場合でも、道が閉ざされるわけではありません。多くの都道府県には当日点（学力検査）を重視する選抜区分や、内申点の比重が小さい通信制・定時制という選択肢があります。欠席日数の影響を当日点でどれだけ補えるか、志望校の選抜方式から逆算しておくと戦略が立てやすくなります。',
  },
];

export const metadata: Metadata = {
  title: '「出席扱い」とは？認められる条件と相談の流れ｜不登校からの高校受験 | My Naishin',
  description:
    '不登校の子どもの自宅学習・フリースクールが「出席扱い」になる仕組みと、学校への相談から校長判断までの一般的な流れを解説。出席扱いになるとどう内申点・調査書に影響するか、ならなかった場合の当日点重視の選抜という選択肢まで、当事者目線で整理しました。',
  keywords: ['出席扱い 不登校', '出席扱い 申請', '出席扱い オンライン学習', 'フリースクール 出席扱い 条件', '不登校 出席扱い 相談'],
  alternates: { canonical: `${SITE_URL}/futoukou/shussekiatsukai` },
  openGraph: {
    title: '「出席扱い」とは？認められる条件と相談の流れ｜不登校からの高校受験',
    description: '自宅学習・フリースクールが「出席扱い」になる仕組みと、学校への相談から校長判断までの流れを解説。',
    url: `${SITE_URL}/futoukou/shussekiatsukai`,
    type: 'article',
  },
};

const STEP_ICONS = [MessageCircle, HomeIcon, ClipboardCheck, Scale];

export default function FutoukouShussekiatsukaiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '不登校と内申点', url: `${SITE_URL}/futoukou` },
          { name: '出席扱いとは', url: `${SITE_URL}/futoukou/shussekiatsukai` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-shussekiatsukai"
        name="出席扱いにしてもらうための一般的な流れ"
        description="自宅学習・フリースクールが出席扱いになるまでの、学校への相談から校長判断までの一般的な流れ"
        totalTime="P1M"
        steps={STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/futoukou" className="hover:text-blue-600">不登校と内申点</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">出席扱いとは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">「出席扱い」とは？相談の流れ</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              自宅学習・フリースクールが<strong>「出席扱い」</strong>になる仕組みと、学校への相談から校長判断までの一般的な流れを整理しました。
            </p>
          </header>

          <AnswerBox question="「出席扱い」とは？どうすればなりますか？">
            <p>
              「出席扱い」とは、学校に登校していなくても自宅でのICT学習やフリースクールでの活動が在籍校の「出席」として認められる仕組みです（文部科学省の通知に基づく運用）。
              認められるかどうかは<strong>在籍校の校長の総合判断</strong>によるため、まずは担任・スクールカウンセラーへの相談から始め、
              学習の記録を残しながら学校と連携を続けることが現実的な進め方です。認められると調査書の出欠の記録にも反映されます。
            </p>
          </AnswerBox>

          {/* 相談の流れ */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-slate-800">相談から判断までの一般的な流れ</h2>
            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <div key={s.name} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{i + 1}. {s.name}</div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              ※ 出席扱いの認定要件・進め方は在籍校・教育委員会によって異なります。最終的な判断は在籍校にご確認ください。
            </p>
          </section>

          {/* 通信制ページへの導線（内申が伸びなかった場合の選択肢） */}
          <section className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">出席扱いにならなくても、選択肢はあります</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              通信制・定時制など、内申点の比重が小さい進路や、当日点重視の選抜区分から届く学校を探すこともできます。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/futoukou/tsugaku" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose-700">
                通信制・フリースクールという選択肢を見る
              </Link>
              <Link href="/reverse" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50">
                当日点で届くか逆算する
              </Link>
            </div>
          </section>

          {/* 不登校専用の保護者リード */}
          <FutoukouLeadCTA className="mt-8" />

          {/* 回遊 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ページ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/futoukou', title: '不登校と内申点（高校受験はできる？）' },
                { href: '/futoukou/tsugaku', title: '通信制高校・フリースクールという選択肢' },
                { href: '/chousasho', title: '調査書とは？出欠・評定がどう書かれるか' },
                { href: '/mendan', title: '三者面談で進路を相談する準備' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                  {c.title}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-rose-600" />よくある質問</h2>
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

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            ※ 出席扱いの認定は在籍校の校長判断であり、要件・進め方は学校・教育委員会で異なります。最新情報は在籍校にご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
