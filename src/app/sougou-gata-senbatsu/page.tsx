import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, GraduationCap, CalendarClock, Scale, HelpCircle, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '総合型選抜に評定平均は何点必要ですか？',
    answer:
      '総合型選抜（旧AO）は評定基準を設けない大学も多いですが、国公立や難関私大では評定平均3.5〜4.0以上を求めるケースがあり、評定が高いほど有利です。学校推薦型（指定校・公募）はほぼ必須で、中堅私大3.3〜3.8／MARCH・関関同立3.8〜4.3／早慶クラス4.0〜4.5が目安。いずれも大学・学部・年度で変わるため募集要項で確認します。',
  },
  {
    question: '総合型選抜と学校推薦型選抜の違いは？',
    answer:
      '学校推薦型選抜（指定校・公募推薦）は「学校長の推薦」が必要で、評定平均の基準がほぼ必須です。総合型選抜（旧AO）は自己推薦で学校長の推薦は不要、志望理由書・面接・小論文・活動実績などを総合的に評価します。評定は不問〜4.0程度と大学によって幅があります。',
  },
  {
    question: '総合型選抜はいつから準備すればいいですか？',
    answer:
      '出願は高3の9月以降が中心ですが、評定平均は高1の1学期から積み上がるため、準備は実質「高校入学時」から始まっています。志望理由書や活動実績は一朝一夕では作れないので、高1〜高2のうちに探究活動・課外活動・資格などに取り組んでおくと有利です。中学生のうちに仕組みを知っておくと、高校選び・高校入学後の動き方が変わります。',
  },
  {
    question: '中学生のうちから総合型選抜を意識する意味はありますか？',
    answer:
      'あります。大学進学者の半数以上が総合型・学校推薦型で進む時代で、評定平均は高1の最初から算入されます。「高1は様子見」では出願資格で不利になりやすいため、高校入学直後から評定を意識できる人が選択肢を最大化します。高校受験のうちから、この構造と進路にかかる費用を知っておくと準備に差がつきます。',
  },
];

export const metadata: Metadata = {
  title: '総合型選抜とは？評定平均の目安・いつから準備・学校推薦型との違い【2026年】 | My Naishin',
  description:
    '急増する総合型選抜（旧AO）を、評定平均の目安・準備の時期・学校推薦型選抜との違いまでわかりやすく解説。大学進学者の半数以上が推薦・総合型で進む時代、評定平均は高1から算入されます。中学生のうちに仕組みを知り、高校選び・進学費用の準備に活かしましょう。',
  keywords: ['総合型選抜', '総合型選抜とは', '総合型選抜 評定平均', '総合型選抜 いつから', '学校推薦型選抜 違い', '旧AO入試', '総合型選抜 準備'],
  alternates: { canonical: `${SITE_URL}/sougou-gata-senbatsu` },
  openGraph: {
    title: '総合型選抜とは？評定平均の目安・いつから準備・学校推薦型との違い【2026年】',
    description: '総合型選抜（旧AO）の評定目安・準備時期・学校推薦型との違いを解説。評定平均は高1から算入。',
    url: `${SITE_URL}/sougou-gata-senbatsu`,
    type: 'website',
  },
};

export default function SougouGataSenbatsuPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '総合型選抜とは', url: `${SITE_URL}/sougou-gata-senbatsu` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合型選抜とは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              いま急増中の大学入試
            </div>
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">総合型選抜とは？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              大学進学者の<strong>半数以上</strong>が総合型・学校推薦型で進む時代。評定平均の目安・準備の時期・
              学校推薦型との違いを、中学生にもわかるように整理しました。
            </p>
          </header>

          <AnswerBox question="総合型選抜とは？評定平均は何点必要？">
            <p>
              <strong>総合型選抜（旧AO入試）</strong>は、志望理由書・面接・小論文・活動実績などで受験生を総合的に評価する大学入試です。
              学校長の推薦が不要（自己推薦）な点が学校推薦型と違います。評定平均は<strong>不問〜4.0程度</strong>と大学で幅があり、
              国公立・難関私大では<strong>3.5〜4.0以上</strong>が目安。評定平均は<strong>高1の1学期から算入</strong>されるため、準備は実質「高校入学時」から始まっています。
            </p>
          </AnswerBox>

          {/* 総合型 vs 学校推薦型 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Scale className="h-5 w-5 text-violet-600" />
              総合型選抜と学校推薦型選抜の違い
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-700 text-white text-left">
                    <th className="border border-slate-500 px-3 py-2 font-bold">　</th>
                    <th className="border border-slate-500 px-3 py-2 font-bold">学校推薦型選抜</th>
                    <th className="border border-slate-500 px-3 py-2 font-bold">総合型選抜</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="odd:bg-white even:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-bold">通称</td><td className="border border-slate-200 px-3 py-2">指定校推薦・公募推薦</td><td className="border border-slate-200 px-3 py-2">旧AO入試</td></tr>
                  <tr className="odd:bg-white even:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-bold">学校長の推薦</td><td className="border border-slate-200 px-3 py-2">必要</td><td className="border border-slate-200 px-3 py-2">不要（自己推薦）</td></tr>
                  <tr className="odd:bg-white even:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-bold">評定平均の基準</td><td className="border border-slate-200 px-3 py-2 font-bold text-violet-700">ほぼ必須（3.3〜4.5目安）</td><td className="border border-slate-200 px-3 py-2">大学による（不問〜4.0）</td></tr>
                  <tr className="odd:bg-white even:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-bold">主に評価されるもの</td><td className="border border-slate-200 px-3 py-2">評定平均・校内選考</td><td className="border border-slate-200 px-3 py-2">志望理由書・面接・小論文・活動実績</td></tr>
                  <tr className="odd:bg-white even:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-bold">出願時期</td><td className="border border-slate-200 px-3 py-2">高3の11月〜</td><td className="border border-slate-200 px-3 py-2">高3の9月〜</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 大学・学部・年度で大きく異なる目安です。指定校推薦の評定基準のレンジは
              <Link href="/hyotei-heikin/suisen-kijun" className="font-bold text-violet-600 hover:underline">推薦の評定基準ページ</Link>で詳しく確認できます。
            </p>
          </section>

          {/* タイムライン */}
          <section className="mt-8 rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-indigo-50/40 p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <CalendarClock className="h-5 w-5 text-violet-600" />
              準備は「高1の1学期」から始まっている
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              総合型・学校推薦型で使う評定平均（学習成績の状況）は、<strong>高1〜高3前期の5学期分</strong>の積み上げです。
              高3で急に上げようとしても、すでに4学期分が確定済みで挽回が難しい。さらに志望理由書や活動実績は短期間では作れません。
              <strong>高校選びの段階から「指定校の枠」「探究活動の充実度」を見ておく</strong>と、推薦の選択肢を最大化できます。
              中学生のいまから評定（内申）を意識する習慣が、そのまま大学受験の準備につながります。
            </p>
          </section>

          {/* my-shingaku 相互送客（推薦→大学ルート）＋大学受験Z会 */}
          <section className="mt-8 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
              推薦・総合型で大学へ進むなら、早めに「大学の選び方と費用」も把握を
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-slate-700">
              総合型・推薦は<strong>専願が原則</strong>のことが多く、進学先を早く絞るほど準備が進みます。評定平均で出願できる大学のレンジ、
              学費・一人暮らしの費用、奨学金の目安は、大学受験専門の姉妹サイトでまとめて調べられます。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <a
                href="https://my-shingaku.com/sougou-suisen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
              >
                大学の総合型・学校推薦型選抜と費用を調べる（My Shingaku）
                <ChevronRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center justify-center text-xs text-slate-500">
                高1から評定対策を始めるなら <AffiliateAd id="zkai-daigaku" className="mx-1" hideLabel placement="hiyou" />（PR）
              </span>
            </div>
          </section>

          {/* 回遊 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/hyotei-heikin', title: '評定平均を計算する（高校生・大学推薦対応）' },
              { href: '/hyotei-heikin/suisen-kijun', title: '推薦に必要な評定平均の早見表' },
              { href: '/shutsugan-junbi', title: '出願準備チェックリスト（タイムライン・必要書類）' },
              { href: '/chousasho', title: '調査書とは？（評定がどう使われるか）' },
              { href: '/shinro-hiyou', title: '高校〜大学の教育費（進路別）' },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                {c.title}
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </section>

          {/* 保護者リード（総合型→大学進学→教育資金。FP無料相談＝live・権限ズレ0の保護者面） */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="hiyou"
              heading="推薦・総合型で大学へ。進学費用の見通しは立っていますか？"
              body="総合型・推薦は専願が原則のことが多く、進学先を早く絞るほど準備が進みます。我が家はいくら必要か・就学支援金や奨学金で実質負担がどれだけ下がるかを、教育資金に詳しい専門家FPへ無料で相談できます（その場で契約を迫られることはありません）。"
            />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-violet-600" />よくある質問</h2>
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
