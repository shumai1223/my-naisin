import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Wallet, BookCheck, HelpCircle, TrendingUp, GraduationCap } from 'lucide-react';

import { EducationCostCalculator } from '@/components/EducationCostCalculator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { LEARNING_COST_ANNUAL, UNIVERSITY_ESTIMATE } from '@/lib/education-cost/data';
import { toManYen, highSchoolTotal } from '@/lib/education-cost/engine';

const FAQS = [
  {
    question: '中学生から高校卒業まで、教育費は総額いくらかかりますか？',
    answer:
      '文部科学省「子供の学習費調査（令和3年度）」の学習費総額をもとにすると、公立中学は年約54万円、公立高校は3年間で約165万円、私立高校は約340万円が目安です。中1から高校卒業までを公立で進むと、塾代を除いておおむね300万円前後、私立高校に進むと450万円前後になります。塾・習い事を加えるとさらに増えます。当ページのシミュレーターで、現在の学年・進路・通塾形態を選ぶと総額の目安がすぐ分かります。',
  },
  {
    question: '公立と私立で教育費はどれくらい変わりますか？',
    answer:
      '1年間の学習費総額は、中学が公立 約54万円・私立 約144万円、高校が公立 約51万円・私立 約105万円で、私立はおおむね公立の2〜2.7倍です。高校3年間だけでも公立 約165万円に対し私立 約340万円と、180万円前後の差になります。私立は就学支援金で授業料負担を軽減できる場合があるため、世帯の状況に応じて実支出を見積もることが大切です。',
  },
  {
    question: '塾代はどのくらい見込んでおけばよいですか？',
    answer:
      '形態と学年で変わりますが、集団塾で月1.5〜3万円、個別指導で月2〜4万円、家庭教師で月2.5〜4万円程度が目安です。受験学年（中3）は月謝・季節講習費とも上がり、中1から中3まで通うと総額で100万〜250万円程度になるケースもあります。教科を絞る・季節講習を必要な分だけにするなどで調整できます。塾代シミュレーターで形態別の総額を試算できます。',
  },
  {
    question: '大学進学も考えると、さらにいくら必要ですか？',
    answer:
      '大学費用は進路で大きく変わります。国立大学は4年間で約240万円（授業料535,800円/年＋入学金）、私立大学は文系で約400万円、理系で約540万円前後が概算の目安です。一人暮らしの場合は別途まとまった生活費がかかります。大学進学費用の詳しい目安は姉妹サイト「My Shingaku」で確認できます。',
  },
  {
    question: '教育費の負担を軽くする制度はありますか？',
    answer:
      '高校では「高等学校等就学支援金」で授業料の負担が軽減されます。公立は授業料が実質無償化され、私立も世帯年収の目安に応じて年額上限39万6,000円まで支援されます。授業料以外には「高校生等奨学給付金」、大学進学には日本学生支援機構（JASPO）の奨学金や各種教育ローンがあります。詳しくは「高校の学費支援・就学支援金ガイド」で解説しています。',
  },
];

const COMPARE = [
  { route: 'すべて公立（中学→公立高校）', high: 'public' as const },
  { route: '私立高校に進学（中学は公立）', high: 'private' as const },
];

export const metadata: Metadata = {
  title: '教育費シミュレーター｜中学生〜高校卒業までの総額はいくら？【2026年】| My Naishin',
  description:
    '中学生から高校卒業までにかかる教育費の総額を無料でシミュレーション。現在の学年・進学先（公立/私立）・塾の形態を選ぶだけで、学習費・塾代を合わせた総額の目安を内訳つきで自動計算。文部科学省「子供の学習費調査」の一次データに準拠。大学費用・就学支援金の目安も解説。',
  keywords: [
    '教育費 いくら',
    '教育費 総額 中学 高校',
    '子供 教育費 シミュレーション',
    '高校 教育費 公立 私立',
    '中学生 教育費',
    '高校卒業まで 費用',
    '学費 総額 計算',
  ],
  alternates: { canonical: `${SITE_URL}/kyouiku-hi` },
  openGraph: {
    title: '教育費シミュレーター｜中学生〜高校卒業までの総額【2026年】| My Naishin',
    description:
      '現在の学年・進路・塾の形態から、高校卒業までの教育費総額を内訳つきで無料試算。文科省データ準拠。',
    url: `${SITE_URL}/kyouiku-hi`,
    type: 'website',
  },
};

export default function KyouikuHiPage() {
  return (
    <>
      <WebApplicationSchema
        name="教育費シミュレーター | My Naishin"
        description="中学生〜高校卒業までの教育費総額を内訳つきで自動計算。文科省 子供の学習費調査に準拠。"
        url={`${SITE_URL}/kyouiku-hi`}
        featureList={['中学の残り＋高校3年間＋塾代を合算', '公立・私立の進路別に総額を比較', '文科省 子供の学習費調査に準拠', '就学支援金・大学費用の目安も確認']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '教育費シミュレーター', url: `${SITE_URL}/kyouiku-hi` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">教育費シミュレーター</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
              <Wallet className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">中学〜高校卒業まで、教育費はいくら？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              現在の<strong>学年・進学先（公立/私立）・塾の形態</strong>を選ぶだけで、高校卒業までにかかる教育費の総額を
              内訳つきで概算します。数値は<strong>文部科学省「子供の学習費調査」</strong>の一次データに準拠します。
            </p>
          </header>

          <section className="mb-8">
            <EducationCostCalculator />
          </section>

          {/* 保護者リード（最高インテント＝お金を計算した直後） */}
          <ParentLeadCTA placement="hiyou" className="mb-10" />

          {/* 進路別ざっくり比較（engine算出・捏造ゼロ） */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              進路別・高校3年間の費用の目安
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">進路</th>
                    <th className="px-4 py-3 text-left font-bold">高校3年間の総額（準備費込み）</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {COMPARE.map((c) => (
                    <tr key={c.route} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3 font-bold">{c.route}</td>
                      <td className="px-4 py-3">{toManYen(highSchoolTotal(c.high))}（{c.high === 'public' ? '公立高校' : '私立高校'}）</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 文部科学省「子供の学習費調査（令和3年度）」の学習費総額（公立高校 約{toManYen(LEARNING_COST_ANNUAL.koukou.public)}/年・私立高校 約{toManYen(LEARNING_COST_ANNUAL.koukou.private)}/年）＋入学準備費の概算。塾代・大学費用は含みません。
            </p>
          </section>

          {/* 大学進学の橋渡し（姉妹サイト My Shingaku へ） */}
          <section className="mb-10 rounded-2xl border border-violet-200 bg-violet-50/50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-violet-900">
              <GraduationCap className="h-5 w-5 text-violet-600" />
              大学進学まで考えると（概算の目安）
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
              <li>・{UNIVERSITY_ESTIMATE.national.label}：4年間で {toManYen(UNIVERSITY_ESTIMATE.national.fourYear)}（{UNIVERSITY_ESTIMATE.national.note}）</li>
              <li>・{UNIVERSITY_ESTIMATE.privateHumanities.label}：4年間で {toManYen(UNIVERSITY_ESTIMATE.privateHumanities.fourYear)} 前後</li>
              <li>・{UNIVERSITY_ESTIMATE.privateScience.label}：4年間で {toManYen(UNIVERSITY_ESTIMATE.privateScience.fourYear)} 前後</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              ※ 大学費用は学部・大学で大きく異なります。一人暮らしの場合は別途生活費がかかります。
            </p>
            <Link
              href="https://my-shingaku.com/gakuhi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-800"
            >
              大学進学の費用を詳しく見る（姉妹サイト My Shingaku）
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          {/* 出典 */}
          <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <BookCheck className="h-3.5 w-3.5 text-indigo-600" />
              出典・参考データ（一次情報）
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed">
              <li>
                <a href="https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  文部科学省「子供の学習費調査（令和3年度）」
                </a>
                <span className="text-slate-400"> — 中学・高校の学習費総額（公立/私立）</span>
              </li>
              <li>
                <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  文部科学省「高校生等への修学支援（就学支援金）」
                </a>
                <span className="text-slate-400"> — 授業料の軽減制度</span>
              </li>
            </ul>
          </div>

          {/* 名簿化（費用に関心の高い保護者を受験本番まで保持） */}
          <div className="mb-10">
            <SaveResultCTA
              source="home"
              heading="教育費と受験情報を、無料で受け取りませんか？"
              body="学費の備え方・就学支援金・志望校選びのコツを、LINEまたはメールでお届けします。いつでも解除できます。"
            />
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-indigo-600" />よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
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

          <RelatedToolsSection
            links={[
              { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の費用を詳しく試算' },
              { href: '/juku-hiyou', title: '塾代シミュレーター', desc: '集団・個別・家庭教師の月謝と総額の目安' },
              { href: '/shougakukin', title: '高校の学費支援・就学支援金ガイド', desc: '高校無償化・私立支援・奨学金の目安' },
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・親ができること' },
              { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式に対応' },
              { href: 'https://my-shingaku.com/gakuhi', title: '大学進学の費用（姉妹サイト）', desc: '学費・一人暮らし・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}
