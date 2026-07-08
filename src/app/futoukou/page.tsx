import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Heart, CalendarX, FileText, ShieldCheck, HelpCircle, Route } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { FutoukouLeadCTA } from '@/components/FutoukouLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '不登校でも高校受験はできますか？',
    answer:
      'できます。不登校でも、公立・私立・通信制・定時制のいずれも受験できます。多くの都道府県には、調査書（内申点）よりも当日の学力検査・面接・作文を重視する選抜区分（自己推薦・特別選抜・チャレンジスクール／エンカレッジスクールなど）があり、不登校の事情を「自己申告書」で説明できる制度を設けている地域もあります。出席日数だけで受験できないということはありません。',
  },
  {
    question: '不登校だと内申点（評定）はどうなりますか？',
    answer:
      '評定は出席そのものではなく「学習の評価材料があるか」で決まります。テストを受けたり課題を提出したりして評価できる材料があれば評定がつきますが、材料が乏しい場合は評定が低くなったり、一部教科が「斜線（評価不能）」になることがあります。扱いは学校で異なるため、別室登校・保健室登校・課題提出・テスト受験など、評価材料を残す方法を担任に相談するのが有効です。',
  },
  {
    question: '欠席日数は調査書に書かれ、合否に影響しますか？',
    answer:
      '調査書には出欠の記録が記載されます。ただし出欠の扱いは都道府県・選抜区分で大きく異なり、当日点重視の区分では欠席日数の影響が小さくなります。多くの地域で、病気や不登校などの事情は「自己申告書」や面接で説明でき、欠席の理由が配慮されることがあります。欠席が多い場合ほど、当日点で勝負できる学校・区分を選ぶのが現実的な戦略です。',
  },
  {
    question: 'フリースクールに通うと「出席扱い」になりますか？',
    answer:
      '一定の条件を満たせば、フリースクールや自宅でのオンライン学習が在籍中学校の「出席扱い」として認められる場合があります（文部科学省の通知に基づく運用）。出席扱いになるかは在籍校の校長判断のため、利用前に学校と連携できる事業者を選び、担任・校長に相談しておくことが大切です。',
  },
  {
    question: '内申点が低くても行ける高校はありますか？',
    answer:
      'あります。通信制高校・定時制高校・一部のチャレンジスクール等は学力検査や面接・作文を中心に選抜し、内申点の比重が小さい、あるいは問わないところがあります。全日制でも当日点比率の高い区分を選べば、内申点の不利を当日点で補える可能性があります。まずは志望地域の選抜方式を確認し、当日点で何点取れば届くかを逆算しておくと戦略が立てやすくなります。',
  },
];

export const metadata: Metadata = {
  title: '不登校と内申点｜高校受験はできる？出席日数・調査書への影響をわかりやすく解説 | My Naishin',
  description:
    '不登校でも高校受験はできます。内申点（評定）はどうなるか、欠席日数は調査書にどう書かれ合否にどう影響するか、当日点重視の選抜区分・自己申告書・フリースクールの出席扱いまで、当事者目線でわかりやすく解説。通信制・定時制という選択肢や、内申点が低くても当日点で届く戦略も紹介します。',
  keywords: ['不登校 内申点', '不登校 高校受験', '不登校 調査書', '不登校 出席日数 高校', '不登校 評定', '欠席 多い 高校受験', '不登校 内申点 つかない'],
  alternates: { canonical: `${SITE_URL}/futoukou` },
  openGraph: {
    title: '不登校と内申点｜高校受験はできる？出席日数・調査書への影響',
    description: '不登校でも高校受験はできる。内申点・欠席日数・調査書への影響と、当日点で届く選抜区分・通信制という選択肢を解説。',
    url: `${SITE_URL}/futoukou`,
    type: 'website',
  },
};

const POINTS = [
  {
    icon: ShieldCheck,
    title: '不登校でも高校受験はできる',
    body: '公立・私立・通信制・定時制のいずれも受験可能。当日点重視の選抜区分や自己申告書など、事情に配慮した制度を設ける地域も多くあります。',
  },
  {
    icon: FileText,
    title: '評定は「出席」でなく「評価材料」で決まる',
    body: 'テスト受験・課題提出など評価できる材料があれば評定はつきます。別室登校・保健室登校・オンライン提出など、材料を残す方法を担任に相談するのが有効です。',
  },
  {
    icon: CalendarX,
    title: '欠席日数より「当日点で届く区分」を選ぶ',
    body: '欠席日数の影響は選抜区分で大きく変わります。当日点比率の高い区分・学校を選べば、内申点の不利を当日点で補えます。',
  },
  {
    icon: Route,
    title: '通信制・定時制という現実的な選択肢',
    body: '通信制・定時制・チャレンジスクール等は学力検査や面接・作文中心で、内申点の比重が小さい／問わないところがあります。',
  },
];

export default function FutoukouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '不登校と内申点', url: `${SITE_URL}/futoukou` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">不登校と内申点</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">不登校と内申点</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              「学校に行けていない＝高校に行けない」ではありません。不登校で<strong>内申点（評定）はどうなるか</strong>、
              <strong>欠席日数は調査書にどう影響するか</strong>、そして<strong>当日点で届く道</strong>を、当事者目線で整理しました。
            </p>
          </header>

          <AnswerBox question="不登校でも高校受験はできる？内申点はどうなる？">
            <p>
              <strong>不登校でも高校受験はできます</strong>（公立・私立・通信制・定時制とも受験可能）。
              内申点（評定）は出席そのものではなく<strong>「学習の評価材料があるか」</strong>で決まり、テスト受験や課題提出で材料を残せば評定はつきます。
              欠席日数は調査書に記載されますが、<strong>当日点重視の選抜区分</strong>や<strong>自己申告書</strong>で事情を説明できる地域も多く、内申点の不利は当日点で補えます。
              まずは志望地域の選抜方式を確認し、当日点で何点必要かを逆算しておくと戦略が立てやすくなります。
            </p>
          </AnswerBox>

          {/* 4つのポイント */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
                    {p.title}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              );
            })}
          </section>

          {/* 内申点が低くても届くか確認（捏造しない・ツール誘導） */}
          <section className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">「当日点で何点取れば届くか」を逆算する</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              欠席が多い・内申点が低いときは、当日点で勝負できる学校・区分を選ぶのが現実的です。志望校のボーダーから、当日に必要な点数を逆算してみましょう。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/reverse" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose-700">
                <Route className="h-4 w-4" />志望校から必要な当日点を逆算する
              </Link>
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50">
                今の内申点を計算する（47都道府県）
              </Link>
            </div>
          </section>

          {/* 通信制・フリースクール子ページ */}
          <section className="mt-8 space-y-3">
            <Link href="/futoukou/tsugaku" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <Route className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-rose-700">通信制高校・フリースクールという選択肢<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">全日制以外の進路の違い（通信制・定時制・サポート校・フリースクール）と、出席扱いの仕組み・在宅で学ぶ方法。</span>
              </span>
            </Link>
            <Link href="/futoukou/shussekiatsukai" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-rose-700">「出席扱い」とは？相談の流れ<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">自宅学習・フリースクールが出席扱いになる仕組みと、学校への相談から校長判断までの一般的な流れ。</span>
              </span>
            </Link>
          </section>

          {/* 不登校専用の保護者リード（もしも live・内申不問/在宅/無料） */}
          <FutoukouLeadCTA className="mt-8" />

          {/* 回遊（調査書文脈で自然につながる） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ページ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/chousasho', title: '調査書とは？出欠・評定がどう書かれるか' },
                { href: '/naishin-age-kata', title: '内申点の上げ方（評価材料の残し方）' },
                { href: '/prefectures', title: '都道府県別の選抜方式（当日点比率）' },
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
            ※ 選抜区分・出欠の扱い・出席扱いの認定は都道府県・学校で異なります。最終的な判断は在籍校・志望校・各教育委員会の最新情報をご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
