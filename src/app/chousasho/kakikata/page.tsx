import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, PenLine, CalendarClock, HelpCircle, AlertCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '調査書はいつ頼めばいいですか？',
    answer:
      '受験校が固まる中3の11〜12月ごろに、学校（担任・進路指導）へ発行を依頼するのが一般的です。私立の出願は1月、公立は2月が中心のため、冬休み前には出願校（併願校を含む）を学校に伝えておくと、先生が必要枚数を準備できてスムーズです。学校ごとに締切や依頼様式が決まっているので、早めに確認しましょう。',
  },
  {
    question: '調査書は何通必要ですか？',
    answer:
      '出願する高校の数だけ必要です。公立1校＋私立の併願2〜3校なら3〜4通になることもあります。学校によっては発行に数日〜1週間かかるため、出願校が増えるほど早めの依頼が大切です。願書の提出方法（窓口・郵送・Web出願）も学校・高校で異なるので、あわせて確認しましょう。',
  },
  {
    question: '調査書の内容は生徒・保護者が書くのですか？',
    answer:
      '調査書そのものは中学校（先生）が作成します。生徒・保護者が記入するのは「発行依頼書」や、活動実績・資格などの申告（学校が指定する様式）です。部活動・委員会・検定・ボランティアなどは、申告しないと書かれないこともあるため、実績は早めに担任へ伝えておくとよいです。',
  },
  {
    question: '出欠（欠席日数）は合否に影響しますか？',
    answer:
      '多くの高校では、欠席日数だけで不合格になることは基本的にありませんが、極端に多い場合は面接で理由を聞かれることがあります。病気・ケガなどの正当な理由は、必要に応じて備考に記載してもらえる場合があります。気になる場合は三者面談で先生に相談しておくと安心です。',
  },
];

export const metadata: Metadata = {
  title: '調査書の書き方・発行の流れ｜いつ・誰に依頼？何通必要？【高校受験】 | My Naishin',
  description:
    '高校受験の調査書を「いつ・誰に・どう依頼するか」を時系列で解説。中3の11〜12月に学校へ発行を依頼、出願校（併願含む）の数だけ必要、活動実績は早めに申告——出願で慌てないための準備手順と注意点をまとめました。',
  keywords: ['調査書 書き方', '調査書 依頼', '調査書 発行', '調査書 いつ', '調査書 何通', '調査書 出願', '内申書 もらい方'],
  alternates: { canonical: `${SITE_URL}/chousasho/kakikata` },
  openGraph: {
    title: '調査書の書き方・発行の流れ｜いつ・誰に依頼？何通必要？',
    description: '中3冬の調査書の依頼〜出願の流れと注意点。出願校数の伝え方・活動実績の申告タイミングを解説。',
    url: `${SITE_URL}/chousasho/kakikata`,
    type: 'website',
  },
};

const STEPS = [
  { name: '出願校を決める（11月〜）', text: '公立・私立（併願含む）の出願校を、三者面談を経て固める。学校に必要な調査書の枚数が決まる。' },
  { name: '活動実績を申告する', text: '部活動・委員会・検定・表彰などを、学校指定の様式で担任へ申告。申告しないと書かれないこともある。' },
  { name: '学校へ発行を依頼する（11〜12月）', text: '発行依頼書を提出。学校ごとの締切・様式・必要日数（数日〜1週間）を確認する。' },
  { name: '願書とあわせて出願（1〜2月）', text: '私立は1月・公立は2月が中心。Web出願/窓口/郵送など高校ごとの方法に従って提出する。' },
];

export default function ChousashoKakikataPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '調査書とは', url: `${SITE_URL}/chousasho` },
          { name: '書き方・発行の流れ', url: `${SITE_URL}/chousasho/kakikata` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-chousasho"
        name="調査書を発行してもらう手順"
        description="高校受験で調査書を中学校に発行してもらい、出願するまでの手順。"
        totalTime="P30D"
        steps={STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/chousasho" className="hover:text-blue-600">調査書とは</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">書き方・発行の流れ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <PenLine className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">調査書の書き方・発行の流れ</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              調査書を<strong>いつ・誰に・どう依頼するか</strong>を時系列で整理。出願で慌てないための準備手順と注意点です。
            </p>
          </header>

          <AnswerBox question="調査書はいつ・誰に頼む？">
            <p>
              調査書は<strong>中学校（担任・進路指導の先生）が作成</strong>します。生徒・保護者は<strong>中3の11〜12月ごろ</strong>に
              「発行依頼書」を出し、<strong>出願校（併願を含む）の数だけ</strong>発行してもらいます。部活動・検定などの活動実績は
              申告しないと書かれないことがあるため、早めに担任へ伝えておきましょう。
            </p>
          </AnswerBox>

          {/* 手順 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <CalendarClock className="h-5 w-5 text-blue-600" />
              発行〜出願までの4ステップ
            </h2>
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{s.name}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* 注意 */}
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertCircle className="h-4 w-4" />
              よくある“出願直前のつまずき”
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-amber-900">
              <li>・併願校の調査書を頼み忘れる → 出願校が決まった時点で必要枚数を学校に伝える。</li>
              <li>・活動実績の申告漏れ → 検定・表彰・部活の役職は様式で早めに申告。</li>
              <li>・発行に時間がかかる → 学校の締切と必要日数（数日〜1週間）を先に確認。</li>
              <li>・学校ごと・高校ごとに様式や提出方法（Web/窓口/郵送）が違う → 募集要項を必ず確認。</li>
            </ul>
            <p className="mt-2 text-xs text-amber-800">
              ※ 具体的な締切・様式は中学校／受験校により異なります。必ず在籍校の進路指導と各高校の募集要項でご確認ください。
            </p>
          </section>

          {/* 回遊 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/chousasho', title: '調査書とは？（記載内容・内申点との違い）' },
              { href: '/chousasho/hyoutei', title: '調査書と内申点・評定平均の連動' },
              { href: '/chousasho/reibun', title: '活動報告書の書き方例文・依頼マナー' },
              { href: '/mendan', title: '三者面談の準備（先生に聞くこと）' },
              { href: '/juken-schedule', title: '受験スケジュール・出願時期' },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                {c.title}
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-blue-600" />よくある質問</h2>
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
