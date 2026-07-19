import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, HandHeart, ListChecks, HelpCircle, AlertCircle, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '併願優遇とは何ですか？',
    answer:
      '併願優遇とは、私立高校が「公立高校を第一志望として受験する生徒」を対象に、一定の内申点などの基準を満たせば入試（学力検査）での合格可能性を高める、または合格をほぼ確約する仕組みです。「公立が不合格だった場合の受け皿」を確保しつつ、公立第一志望を貫けるのが特徴です。関東を中心に多くの地域で見られますが、制度の有無・呼び方（併願優遇／併願確約など）は都道府県・学校により異なります。',
  },
  {
    question: '併願優遇の基準（内申点など）はどこで確認できますか？',
    answer:
      '併願優遇の基準（必要な内申点・欠席日数の上限など）は高校・学科ごとに個別に設定され、非公表または限定的な公開（学校説明会・個別相談でのみ案内）となっている場合が多いです。当サイトでは特定校の基準を断定的には扱いません。正確な基準は、志望する私立高校の学校説明会・個別相談・募集要項で直接確認してください。',
  },
  {
    question: '併願優遇と単願推薦はどう違いますか？',
    answer:
      '単願推薦は「その私立高校のみを受験し、合格したら必ず入学する」ことを前提にした出願方式です。併願優遇は「公立高校を第一志望として受験しつつ、私立を併願する」ことを前提にしており、公立が第一志望のまま進められる点が単願推薦との大きな違いです。一般的に単願推薦のほうが基準はやや緩やかで、併願優遇は基準がやや高めに設定される傾向があると言われますが、学校により異なります。',
  },
  {
    question: '併願優遇を利用すれば入試（学力検査）は受けなくていいのですか？',
    answer:
      '学校によります。併願優遇でも学力検査（入試本番）を受験する必要がある学校が多く、基準を満たしていれば「よほどのことがない限り合格」という運用がされる場合と、当日点も一定程度考慮される場合があります。当日の試験の位置づけは学校ごとに異なるため、事前に確認しておきましょう。',
  },
  {
    question: '併願優遇の基準を満たしていれば、内申点はもう気にしなくていいですか？',
    answer:
      '基準を満たしていても、その後の学期で評定が大きく下がったり、出席状況に問題があったりすると、優遇が取り消される場合があります。併願優遇はあくまで「出願時点の見込み」であり、確約ではないケースもあるため、出願後も気を抜かずに過ごすことが大切です。',
  },
];

export const metadata: Metadata = {
  title: '併願優遇とは？併願校の制度をわかりやすく解説【単願推薦との違い】 | My Naishin',
  description:
    '私立高校の「併願優遇」とは何か、単願推薦との違い、一般的な仕組みと注意点をわかりやすく解説。学校ごとの内申点基準は非公表・個別設定のため断定はせず、確認すべきポイントを整理しました。',
  keywords: ['併願優遇とは', '併願優遇 基準', '併願優遇 単願推薦 違い', '併願校', '私立高校 併願', '併願確約'],
  alternates: { canonical: `${SITE_URL}/heigan-yuugu` },
  openGraph: {
    title: '併願優遇とは？併願校の制度をわかりやすく解説【単願推薦との違い】',
    description: '私立高校の併願優遇の仕組み・単願推薦との違い・確認すべきポイントを解説。',
    url: `${SITE_URL}/heigan-yuugu`,
    type: 'website',
  },
};

export default function HeiganYuuguPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '併願優遇・併願校の制度解説', url: `${SITE_URL}/heigan-yuugu` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-teal-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">併願優遇・併願校の制度解説</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xl">
              <HandHeart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">併願優遇・併願校の制度解説</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              私立高校の「併願優遇」とは何か、単願推薦との違い、確認すべきポイントをわかりやすく解説します。
            </p>
          </header>

          <AnswerBox question="併願優遇とは？">
            <p>
              私立高校が、<strong>公立高校を第一志望として受験する生徒</strong>を対象に、一定の基準（内申点など）を
              満たせば<strong>合格可能性を高める、または合格をほぼ確約する</strong>仕組みです。「公立が不合格だった場合の受け皿」を
              確保しながら、公立第一志望を貫けるのが特徴です。
            </p>
          </AnswerBox>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListChecks className="h-5 w-5 text-teal-600" />
              併願優遇の一般的な仕組み
            </h2>
            <ol className="space-y-3">
              {[
                { name: '学校説明会・個別相談で基準を確認', text: '各私立高校が独自に設定する基準（内申点・欠席日数の目安など）を、学校説明会や個別相談で確認します。基準は非公表または限定公開の場合が多く、学校ごとに異なります。' },
                { name: '出願前に基準を満たすか確認', text: '内申点などの見込みが基準を満たしているかを、担任や学校の進路指導も交えて確認します。' },
                { name: '公立第一志望として出願', text: '公立高校を第一志望として出願しつつ、併願優遇のある私立高校にも出願します。' },
                { name: '私立の入試（学力検査等）を受験', text: '併願優遇でも学力検査を受験する学校が多く、基準を満たしていれば高い確率で合格となる運用が一般的です（学校により異なります）。' },
                { name: '公立の結果に応じて進学先が決まる', text: '公立に合格すれば公立へ、公立が不合格だった場合は併願優遇で合格した私立へ進学するのが基本的な流れです。' },
              ].map((s, i) => (
                <li key={s.name} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-600 text-xs font-black text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{s.name}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">単願推薦・一般入試との違い</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">方式</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">公立の受験</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">合格時の扱い</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-teal-700">併願優遇</td>
                    <td className="border border-slate-200 px-3 py-2">公立を第一志望として受験できる</td>
                    <td className="border border-slate-200 px-3 py-2">公立が不合格の場合の受け皿</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-slate-700">単願推薦</td>
                    <td className="border border-slate-200 px-3 py-2">原則、公立は受験しない（専願）</td>
                    <td className="border border-slate-200 px-3 py-2">合格したら原則入学</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 font-bold text-slate-700">一般入試</td>
                    <td className="border border-slate-200 px-3 py-2">公立との併願も自由</td>
                    <td className="border border-slate-200 px-3 py-2">合否は当日の得点等で決定・確約なし</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 呼び方（併願優遇・併願確約など）や運用は都道府県・学校により異なります。必ず志望校の募集要項・学校説明会で確認してください。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertCircle className="h-4 w-4" />
              確認しておきたいポイント
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-amber-900">
              <li>・基準（内申点・欠席日数など）は学校ごとに個別設定され、非公表または限定公開のことが多い。</li>
              <li>・基準を満たしても、その後の評定低下や出席状況によって優遇が取り消される場合がある。</li>
              <li>・学力検査の有無・当日点の扱いは学校により異なる（受けても形式的な学校、当日点も考慮する学校がある）。</li>
              <li>・地域によって「併願優遇」という制度自体が無い、または呼び方が異なる場合がある。</li>
            </ul>
            <p className="mt-2 text-xs text-amber-800">
              ※ 当ページは併願優遇という制度の一般的な仕組みの解説です。特定校の基準・合否を保証するものではありません。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">あわせて確認</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/heigan-yuugu/tokyo" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md">
                オール3で行ける私立高校（東京都・公式基準つき）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/mendan" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md">
                三者面談の準備チェックリスト
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/koukou-hiyou" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md">
                私立高校の費用シミュレーター
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tarinai-taisaku" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md">
                内申点・当日点が足りない冬の緊急対策
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/juken-schedule" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md">
                受験スケジュール・出願時期
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-teal-600" />よくある質問</h2>
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
