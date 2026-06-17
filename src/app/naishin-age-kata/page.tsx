import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, TrendingUp, ClipboardCheck, MessageSquare, Palette, Calculator, HelpCircle, BookOpen } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '内申点はどうやったら上がりますか？',
    answer:
      '内申点（評定）は定期テストの点数だけでは決まりません。①定期テストで平均点+10点 ②提出物を期限内・丁寧に ③授業中の発言・振り返りで「主体性」を示す ④実技4教科を妥協しない、の4軸で上がります。新学習指導要領では「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の3観点で評価されるため、テスト以外の行動が効きます。',
  },
  {
    question: 'テストで良い点なのに評定が上がらないのはなぜ？',
    answer:
      'テストは「知識・技能」の観点の一部にすぎず、提出物・授業態度・振り返り（主体的に取り組む態度）も評価対象だからです。90点でも提出物の遅れや授業態度の評価が低いと評定が4や3になることがあります。逆に70点台でも提出物完璧・積極性があれば評定が上がるケースもあります。',
  },
  {
    question: '中3からでも内申点は上げられますか？',
    answer:
      '上げられます。提出物を期限の数日前に出す、授業で1日1回発言する、振り返りシートに具体的な行動を書く——といった行動はすぐ始められ、次の学期の評定に反映されます。ただし内申は学期ごとの積み重ねなので、早いほど有利です。まずは現状の内申点を計算して、志望校との差を把握しましょう。',
  },
  {
    question: '実技4教科の内申点は上げにくいですか？',
    answer:
      '実技4教科（音楽・美術・保健体育・技術家庭）は作品・実技・提出物の比重が大きく、丁寧に取り組めば評定を上げやすい教科です。さらに多くの都道府県で実技4教科は内申点が2倍などに加重されるため、主要5教科を1上げるより合否への影響が大きいことがあります。',
  },
];

export const metadata: Metadata = {
  title: '内申点の上げ方｜定期テスト・提出物・授業態度・実技の4軸で上げる方法 | My Naishin',
  description:
    '内申点（評定）を上げる方法を、①定期テスト②提出物③授業態度・主体性④実技4教科の4軸で具体的に解説。新学習指導要領の3観点評価のしくみに基づく、今日から始められる行動リストつき。まずは現状の内申点を無料計算して志望校との差を把握しましょう。',
  keywords: ['内申点 上げ方', '内申点 上げる', '内申点 上げる方法', '評定 上げ方', '内申点 中3 上げる', '提出物 内申点', '授業態度 内申点'],
  alternates: { canonical: `${SITE_URL}/naishin-age-kata` },
  openGraph: {
    title: '内申点の上げ方｜定期テスト・提出物・授業態度・実技の4軸',
    description: '内申点を上げる方法を3観点評価に基づき4軸で解説。今日から始める行動リストつき。現状は無料計算で把握。',
    url: `${SITE_URL}/naishin-age-kata`,
    type: 'website',
  },
};

const AXES = [
  {
    icon: ClipboardCheck,
    title: '① 定期テストで「平均点+10点」',
    points: ['「知識・技能」観点の土台。学年平均65点なら最低75点を目標。', 'ワークを2周、テスト2週間前から計画的に。', '記述・応用問題は「思考・判断・表現」観点に直結。'],
  },
  {
    icon: BookOpen,
    title: '② 提出物は「期限の数日前」に丁寧に',
    points: ['「主体的に取り組む態度」観点に直結。1回の遅れで評定が1段階下がることも。', '期限の3日前に出すと見直しもでき、先生の信頼も得られる。', '空欄ゼロ・自分の言葉での要約で「考えている」を見せる。'],
  },
  {
    icon: MessageSquare,
    title: '③ 授業の発言・振り返りで主体性を示す',
    points: ['1日1回の発言・挙手。答えが不安なら「〜で合っていますか？」でOK。', '振り返りシートは「がんばる」でなく具体的な行動を書く。', '週1回でも先生に質問に行く習慣が態度評価を底上げ。'],
  },
  {
    icon: Palette,
    title: '④ 実技4教科を妥協しない',
    points: ['音楽・美術・保健体育・技術家庭は作品・実技・提出物の比重が大きい。', '多くの地域で実技は内申2倍などに加重＝合否への影響大。', '「受験で使わない」と捨てるのが最大の失点。'],
  },
];

export default function NaishinAgeKataPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点の上げ方', url: `${SITE_URL}/naishin-age-kata` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点の上げ方</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">内申点の上げ方</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              内申点（評定）は<strong>テストの点数だけ</strong>では決まりません。3観点評価に基づく
              <strong>4つの軸</strong>で、今日から上げる方法を整理しました。
            </p>
          </header>

          <AnswerBox question="内申点はどうやって上げる？">
            <p>
              内申点は<strong>①定期テスト（平均+10点）②提出物（期限内・丁寧）③授業態度・主体性（発言・振り返り）④実技4教科</strong>の4軸で上がります。
              新学習指導要領では「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の3観点で評価されるため、テスト以外の行動が効きます。
              中3からでも始められますが、内申は学期ごとの積み重ねなので早いほど有利です。
            </p>
          </AnswerBox>

          {/* まず現状把握 */}
          <section className="mt-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">まずは「今の内申点」と志望校との差を知る</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">上げ方を実践する前に、現在地を数値で把握すると対策の優先順位が決まります。</p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                <Calculator className="h-4 w-4" />内申点を計算する（47都道府県）
              </Link>
              <Link href="/reverse" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 ring-1 ring-blue-200 transition-colors hover:bg-blue-50">
                志望校から「あと何点」を逆算
              </Link>
            </div>
          </section>

          {/* 4軸 */}
          <section className="mt-8 space-y-4">
            {AXES.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></span>
                    {a.title}
                  </h2>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                    {a.points.map((p) => (
                      <li key={p} className="flex gap-2"><span className="text-blue-500">・</span><span>{p}</span></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          {/* 保護者リード（内申改善＝塾無料体験・live） */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="result"
              heading="行動は分かっても、続けられるかが分かれ目です"
              body="内申アップは「正しい順番で・継続できるか」で差がつきます。お子さまに必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* 深掘り（権威記事＝canonicalな解説へ） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">さらに詳しく（攻略記事）</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/blog/how-to-raise-naishinten', title: '内申点を上げる15の方法【完全保存版】' },
                { href: '/blog/teishutsubutsu-jugyou-taido-guide', title: '提出物・授業態度で評定アップする方法' },
                { href: '/blog/naishin-evaluation-criteria-3-points', title: '通知表の3観点評価を徹底解説' },
                { href: '/jitsugika', title: '実技4教科の内申点対策（倍率に注意）' },
                { href: '/chousasho', title: '調査書とは？内申点との違い' },
                { href: '/juku-hiyou', title: '塾代シミュレーター（無料体験の比較）' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                  {c.title}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
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

          <ToolClusterNav current="naishin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
