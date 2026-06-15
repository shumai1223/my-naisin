import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Wallet, BookCheck, HelpCircle, TrendingUp, GraduationCap, PiggyBank } from 'lucide-react';

import { EducationPathSimulator } from '@/components/EducationPathSimulator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { simulateHighToUniversity, toManYen } from '@/lib/education-cost/engine';
import type { CourseType, UniversityType, Residence } from '@/lib/education-cost/types';

const FAQS = [
  {
    question: '高校から大学卒業まで、教育費は総額いくらかかりますか？',
    answer:
      '進路で大きく変わります。文部科学省「子供の学習費調査」と日本政策金融公庫の調査をもとにすると、公立高校→国公立大学（自宅）でおよそ460万円前後、私立高校→私立大学文系（下宿）では1,200万円を超えることもあります。当ページのシミュレーターで、高校（公立/私立）・世帯年収・大学の種別・自宅か下宿かを選ぶと、就学支援金を加味した総額の目安がすぐ分かります。',
  },
  {
    question: '大学で一人暮らし（下宿）をすると、いくら増えますか？',
    answer:
      '日本政策金融公庫の調査では、自宅外通学を始めるための費用が平均約39万円、年間の仕送り（家賃・生活費）が平均約96万円です。4年間では仕送りだけで約380万円、初期費用と合わせて約420万円が自宅通学より多くかかる計算になります。地域や住まいで変動するため、早めに見積もっておくことが大切です。',
  },
  {
    question: '就学支援金で高校の費用はどれくらい軽くなりますか？',
    answer:
      '高等学校等就学支援金では、公立高校は授業料相当（年11万8,800円）が実質無償化され、私立高校は世帯年収の目安に応じて年額上限39万6,000円まで支援されます。世帯年収が約590万円未満の目安なら私立の授業料の大部分がまかなわれる場合があります。当シミュレーターは世帯年収区分を選ぶと支援額を差し引いた「実質負担」を表示します。',
  },
  {
    question: '教育費の準備は、いつから・どう始めればよいですか？',
    answer:
      '大学進学を見据えると、必要額は数百万円〜1,000万円規模になり得ます。児童手当の活用・つみたて・学資保険・奨学金（日本学生支援機構）・教育ローンなど方法は複数あり、世帯の状況で最適解が変わります。「我が家はいくら必要で、どの方法で備えるか」は、教育資金に詳しいファイナンシャルプランナー（FP）に無料で相談して整理するのが近道です。',
  },
  {
    question: 'この金額はどこまで正確ですか？',
    answer:
      '文部科学省「子供の学習費調査（令和3年度）」の学習費総額、就学支援金の制度、日本政策金融公庫の自宅外通学費用という一次情報に基づく概算です。学校・学部・地域・受講内容で実際の金額は変動します。特定の学校の正確な費用は各校の募集要項でご確認ください。',
  },
];

/** 代表的な進路の総額比較（engine算出・捏造ゼロ）。世帯年収は中間区分(under910)を共通の目安に。 */
const PATHS: { label: string; high: CourseType; uni: UniversityType; res: Residence }[] = [
  { label: '公立高校 → 国公立大（自宅）', high: 'public', uni: 'national', res: 'home' },
  { label: '公立高校 → 私立文系（自宅）', high: 'public', uni: 'privateHumanities', res: 'home' },
  { label: '私立高校 → 私立文系（下宿）', high: 'private', uni: 'privateHumanities', res: 'away' },
  { label: '私立高校 → 私立理系（下宿）', high: 'private', uni: 'privateScience', res: 'away' },
];

export const metadata: Metadata = {
  title: '高校〜大学の教育費シミュレーター｜進路別の総額はいくら？【2026年】| My Naishin',
  description:
    '高校入学から大学卒業までにかかる教育費の総額を無料でシミュレーション。高校（公立/私立）・世帯年収・大学の種別（国公立/私立文系/理系）・自宅か下宿かを選ぶだけで、就学支援金を加味した総額の目安を内訳つきで自動計算。文部科学省・日本政策金融公庫の一次データに準拠。',
  keywords: [
    '高校 大学 教育費 総額',
    '大学まで 教育費 いくら',
    '子供 教育費 大学 シミュレーション',
    '私立 大学 一人暮らし 費用',
    '教育費 進路別',
    '大学 学費 自宅 下宿',
    '教育資金 いくら必要',
  ],
  alternates: { canonical: `${SITE_URL}/shinro-hiyou` },
  openGraph: {
    title: '高校〜大学の教育費シミュレーター｜進路別の総額【2026年】| My Naishin',
    description:
      '高校・世帯年収・大学・自宅/下宿から、卒業までの教育費総額を就学支援金込みで無料試算。文科省・日本政策金融公庫データ準拠。',
    url: `${SITE_URL}/shinro-hiyou`,
    type: 'website',
  },
};

export default function ShinroHiyouPage() {
  return (
    <>
      <WebApplicationSchema
        name="高校〜大学の教育費シミュレーター | My Naishin"
        description="高校入学〜大学卒業までの教育費総額を就学支援金・自宅外費用込みで自動計算。文科省・日本政策金融公庫データ準拠。"
        url={`${SITE_URL}/shinro-hiyou`}
        featureList={['高校3年＋大学4年の総額を進路別に概算', '就学支援金で実質負担を自動控除', '自宅/下宿の生活費差を反映', '文科省・日本政策金融公庫の一次データ準拠']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '高校〜大学の教育費シミュレーター', url: `${SITE_URL}/shinro-hiyou` },
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
            <span className="text-slate-700">高校〜大学の教育費シミュレーター</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
              <PiggyBank className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校〜大学卒業まで、教育費はいくら？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              <strong>高校（公立/私立）・世帯年収・大学の種別・自宅か下宿か</strong>を選ぶだけで、
              高校入学から大学卒業までの教育費総額を<strong>就学支援金込み</strong>で概算します。
              数値は<strong>文部科学省「子供の学習費調査」</strong>と<strong>日本政策金融公庫</strong>の一次データに準拠します。
            </p>
          </header>

          <section className="mb-8">
            <EducationPathSimulator />
          </section>

          {/* 保護者リード（最高インテント＝数百万〜1000万円規模と分かった直後の保護者を教育資金FP無料相談へ） */}
          <ParentLeadCTA placement="hiyou" className="mb-10" />

          {/* 代表的な進路の総額比較（engine算出・捏造ゼロ） */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              代表的な進路の総額の目安（世帯年収 590〜910万円の場合）
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">進路</th>
                    <th className="px-4 py-3 text-right font-bold">高校〜大学の総額（就学支援金込み）</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {PATHS.map((p) => {
                    const r = simulateHighToUniversity({ highCourse: p.high, incomeBracket: 'under910', universityType: p.uni, residence: p.res });
                    return (
                      <tr key={p.label} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3 font-bold">{p.label}</td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-700">{toManYen(r.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 高校＝文科省「子供の学習費調査（令和3年度）」、大学＝学費の概算、下宿＝日本政策金融公庫の自宅外通学費用。塾代は含みません。
            </p>
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
                <span className="text-slate-400"> — 高校の学習費総額（公立/私立）</span>
              </li>
              <li>
                <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  文部科学省「高校生等への修学支援（就学支援金）」
                </a>
                <span className="text-slate-400"> — 高校授業料の軽減制度</span>
              </li>
              <li>
                <a href="https://www.jfc.go.jp/n/findings/" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  日本政策金融公庫「教育費負担の実態調査結果」
                </a>
                <span className="text-slate-400"> — 自宅外通学の費用・仕送り</span>
              </li>
            </ul>
          </div>

          {/* 名簿化 */}
          <div className="mb-10">
            <SaveResultCTA
              source="home"
              heading="教育費の備え方と受験情報を、無料で受け取りませんか？"
              body="教育資金の準備・就学支援金・奨学金・志望校選びのコツを、LINEまたはメールでお届けします。いつでも解除できます。"
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
              { href: '/kyouiku-hi', title: '中学〜高校卒業までの教育費', desc: '現在の学年・進路・塾代から総額を試算' },
              { href: '/shougakukin', title: '就学支援金・高校無償化の判定', desc: '世帯年収の目安から支援額をチェック' },
              { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間を詳しく' },
              { href: '/juku-hiyou', title: '塾代シミュレーター', desc: '集団・個別・家庭教師の総額の目安' },
              { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式に対応' },
              { href: 'https://my-shingaku.com/gakuhi', title: '大学進学の費用（姉妹サイト）', desc: '学費・一人暮らし・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
          <p className="mt-6 flex items-center gap-1.5 text-center text-xs text-slate-400">
            <GraduationCap className="h-3.5 w-3.5" />
            大学費用の詳しい内訳は姉妹サイト My Shingaku が担当します。
          </p>
        </div>
      </div>
    </>
  );
}
