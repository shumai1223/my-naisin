import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, HandCoins, BookCheck, HelpCircle, ShieldCheck, Landmark } from 'lucide-react';

import { ShugakuShienEstimator } from '@/components/ShugakuShienEstimator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { SHUGAKU_SHIEN_TIERS } from '@/lib/education-cost/data';
import { formatYen, toManYen, highSchoolRealCost } from '@/lib/education-cost/engine';

const FAQS = [
  {
    question: '高校無償化とは何ですか？私立高校も無償になりますか？',
    answer:
      '「高校無償化」とは、国の高等学校等就学支援金制度で授業料の負担を軽減する仕組みのことです。公立高校は授業料が実質無償化されています。私立高校は世帯年収の目安に応じて、年額上限39万6,000円まで支援され、授業料の大部分がまかなわれる場合があります。ただし授業料以外（入学金・施設費・教材費・通学費など）は対象外で、完全に無料になるわけではありません。近年は所得制限の見直しや自治体独自の上乗せもあり、最新の内容は文部科学省・お住まいの都道府県でご確認ください。',
  },
  {
    question: '就学支援金は世帯年収いくらまでもらえますか？',
    answer:
      '目安として、世帯年収 約910万円未満で授業料相当（年11万8,800円）が支援され、私立高校で約590万円未満の区分はさらに上乗せされ年額上限39万6,000円まで支援されます。ただし「年収」はあくまで目安で、正確には世帯の「市町村民税の課税標準額×6%−調整控除額」で判定されます。共働きや家族構成によって基準額の見え方が変わるため、最終的には学校・自治体の案内で確認してください。',
  },
  {
    question: '授業料以外の費用（教材費・通学費など）の支援はありますか？',
    answer:
      'はい。授業料以外の教育費負担を軽減する「高校生等奨学給付金」があります。生活保護世帯・住民税非課税世帯などを対象に、教科書費・教材費・通学費・修学旅行費などにあてる給付（返済不要）が受けられます。金額や対象は都道府県が実施主体で異なるため、お住まいの都道府県の教育委員会の案内を確認してください。',
  },
  {
    question: '大学進学の費用が心配です。どんな支援がありますか？',
    answer:
      '大学・専門学校には、日本学生支援機構（JASPO）の奨学金（給付型・貸与型）や、国の「高等教育の修学支援新制度」（授業料減免＋給付型奨学金）があります。給付型は返済不要で、世帯収入や成績の基準を満たすと利用できます。このほか各大学独自の奨学金、教育ローン（日本政策金融公庫の国の教育ローンなど）もあります。大学進学費用と支援の詳細は姉妹サイト「My Shingaku」で解説しています。',
  },
  {
    question: '就学支援金を受け取るには手続きが必要ですか？',
    answer:
      '必要です。高校入学後に学校を通じて申請（オンライン申請システム e-Shien など）を行い、マイナンバー等で世帯の所得を確認します。申請しないと支援が受けられないため、入学時の案内を必ず確認しましょう。在学中も毎年度の届出（収入状況の確認）が必要です。',
  },
];

export const metadata: Metadata = {
  title: '高校無償化・就学支援金はいくら？年収の目安と私立の支援額【2026年】| My Naishin',
  description:
    '高校無償化（高等学校等就学支援金）はいくらもらえる？公立・私立別の支援額、世帯年収の目安、私立の上限39.6万円、授業料以外を補助する奨学給付金、大学の奨学金まで、教育費の支援制度を一次情報に基づき解説。世帯年収の区分を選ぶと支援額の目安が分かります。',
  keywords: [
    '高校無償化 年収',
    '就学支援金 いくら',
    '私立高校 無償化 年収',
    '高校 学費 支援',
    '就学支援金 私立 上限',
    '高校生等奨学給付金',
    '高校無償化 私立',
  ],
  alternates: { canonical: `${SITE_URL}/shougakukin` },
  openGraph: {
    title: '高校無償化・就学支援金はいくら？年収の目安と私立の支援額【2026年】| My Naishin',
    description: '公立・私立別の支援額、世帯年収の目安、私立の上限39.6万円、奨学給付金まで一次情報で解説。',
    url: `${SITE_URL}/shougakukin`,
    type: 'website',
  },
};

export default function ShougakukinPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '高校無償化・就学支援金ガイド', url: `${SITE_URL}/shougakukin` },
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
            <span className="text-slate-700">高校無償化・就学支援金ガイド</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <HandCoins className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校無償化・就学支援金はいくら？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校の授業料を軽減する<strong>「高等学校等就学支援金」</strong>（いわゆる高校無償化）の支援額を、
              進学先と世帯年収の区分から概算できます。私立の上限・授業料以外の支援・大学の奨学金まで、
              <strong>一次情報に基づいて</strong>わかりやすく解説します。
            </p>
          </header>

          {/* エスティメーター */}
          <section className="mb-8">
            <ShugakuShienEstimator />
          </section>

          {/* 保護者リード（最高インテント＝支援額を調べた直後） */}
          <ParentLeadCTA placement="hiyou" className="mb-10" />

          {/* 区分早見表 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Landmark className="h-5 w-5 text-emerald-600" />
              世帯年収の区分別・支援額の目安
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">世帯年収の区分（目安）</th>
                    <th className="px-4 py-3 text-left font-bold">公立高校</th>
                    <th className="px-4 py-3 text-left font-bold">私立高校</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {SHUGAKU_SHIEN_TIERS.map((t) => (
                    <tr key={t.bracket} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3 font-bold">{t.label}</td>
                      <td className="px-4 py-3">{t.publicAnnual > 0 ? `${formatYen(t.publicAnnual)}/年` : '対象外'}</td>
                      <td className="px-4 py-3">{t.privateAnnual > 0 ? `${formatYen(t.privateAnnual)}/年` : '対象外'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 公立は授業料相当（年11万8,800円）が実質無償化、私立は区分に応じて年額上限39万6,000円まで。年収は目安で、正確な判定は課税標準額で行われます。
            </p>
          </section>

          {/* 公立 vs 私立の「実質負担」比較（就学支援金を差し引いた手出し＝差別化指標） */}
          <section className="mb-10">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Landmark className="h-5 w-5 text-emerald-600" />
              無償化後の「実質負担」で公立・私立を比べる
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              「私立は高い」と決める前に、就学支援金を差し引いた高校3年間の<strong>実質負担の目安</strong>で比べてみましょう。
              低所得の区分では、私立でも公立との差が大きく縮まります。
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">世帯年収の区分（目安）</th>
                    <th className="px-4 py-3 text-left font-bold">公立高校（3年・実質）</th>
                    <th className="px-4 py-3 text-left font-bold">私立高校（3年・実質）</th>
                    <th className="px-4 py-3 text-left font-bold">差</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {SHUGAKU_SHIEN_TIERS.map((t) => {
                    const pub = highSchoolRealCost('public', t.bracket);
                    const pri = highSchoolRealCost('private', t.bracket);
                    return (
                      <tr key={t.bracket} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3 font-bold">{t.label}</td>
                        <td className="px-4 py-3">{toManYen(pub)}</td>
                        <td className="px-4 py-3">{toManYen(pri)}</td>
                        <td className="px-4 py-3 text-emerald-700">＋{toManYen(pri - pub)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 実質負担＝学習費総額（3年）−就学支援金（3年）の目安。授業料以外（入学金・施設費・教材費・通学費など）も含む総額からの概算で、就学支援金は授業料部分が対象です。私立は学校により学費が大きく異なります。
            </p>
          </section>

          {/* 3つの支援を整理 */}
          <section className="mb-10 grid gap-4 sm:grid-cols-3">
            <SupportCard
              title="① 就学支援金（国）"
              body="高校の授業料を軽減。公立は実質無償、私立は世帯年収の区分で上限39.6万円まで。入学後に学校経由で申請。"
            />
            <SupportCard
              title="② 奨学給付金（都道府県）"
              body="授業料以外（教科書・教材・通学費など）を補助。住民税非課税世帯などが対象の給付（返済不要）。"
            />
            <SupportCard
              title="③ 大学の修学支援・奨学金"
              body="大学・専門学校はJASSOの給付型/貸与型奨学金、国の修学支援新制度、教育ローンなどがある。"
            />
          </section>

          {/* 出典 */}
          <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <BookCheck className="h-3.5 w-3.5 text-emerald-600" />
              出典・参考（一次情報）
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed">
              <li>
                <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  文部科学省「高校生等への修学支援（就学支援金・奨学給付金）」
                </a>
              </li>
              <li>
                <a href="https://www.mext.go.jp/kaikakusuishin/" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  文部科学省「高等教育の修学支援新制度」
                </a>
                <span className="text-slate-400"> — 大学等の授業料減免・給付型奨学金</span>
              </li>
            </ul>
          </div>

          {/* 名簿化 */}
          <div className="mb-10">
            <SaveResultCTA
              source="home"
              audience="parent"
              heading="教育費の支援・受験情報を、無料で受け取りませんか？"
              body="就学支援金・奨学金の最新情報や、志望校選び・費用の備え方を、LINEまたはメールでお届けします。いつでも解除できます。"
            />
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-emerald-600" />よくある質問
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
              { href: '/kyouiku-hi', title: '教育費シミュレーター', desc: '中学〜高校卒業までの総額を内訳つきで試算' },
              { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の費用を試算' },
              { href: '/juku-hiyou', title: '塾代シミュレーター', desc: '集団・個別・家庭教師の月謝と総額の目安' },
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・親ができること' },
              { href: 'https://my-shingaku.com/gakuhi', title: '大学進学の費用（姉妹サイト）', desc: '学費・一人暮らし・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function SupportCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-emerald-900">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        {title}
      </div>
      <p className="text-xs leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}
