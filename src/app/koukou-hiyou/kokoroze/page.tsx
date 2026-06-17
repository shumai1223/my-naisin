import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, School, HelpCircle, Wallet } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { KoukouKokorozeCalculator } from '@/components/KoukouKokorozeCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '高校無償化（就学支援金）は私立でもいくらもらえますか？',
    answer:
      '世帯年収 約590万円未満（目安）なら私立高校は年額上限39万6,000円（3年で最大118.8万円）まで支援されます。約590〜910万円なら公立・私立とも年11万8,800円（授業料相当）、約910万円以上は従来対象外です（所得制限の見直しや自治体独自補助があるため要確認）。正確には市町村民税の課税標準額等で判定します。',
  },
  {
    question: '公立と私立の3年間の費用の差はどれくらいですか？',
    answer:
      '文部科学省「子供の学習費調査」の学習費総額（授業料・教材費・通学費・学校外活動費等を含む全日制1年あたり）では、公立は約51万円/年、私立は約105万円/年です。就学支援金を反映すると、世帯年収によって実質負担の差は大きく変わります。当ページのシミュレーターで、ご家庭の年収区分での公私の実質負担を比較できます。',
  },
  {
    question: '学習費総額には何が含まれますか？塾代は別ですか？',
    answer:
      '学習費総額は授業料・学校教育費（教材・制服・通学費など）・学校給食費・学校外活動費（塾・習い事など）を含む年間総額です。地域差や個人差が大きいため目安としてご覧ください。塾代だけを別に試算したい場合は塾代シミュレーターをご利用ください。',
  },
  {
    question: '無償化があるなら私立を選んでも大丈夫ですか？',
    answer:
      '授業料は就学支援金で軽減されますが、入学金・施設費・制服・修学旅行費などは対象外で、私立は公立より高くなる傾向があります。実質負担の差と、お子さまに合う校風・進学実績・通学のしやすさを総合して判断するのがおすすめです。家計全体の見通しは、教育資金に詳しい専門家FPに無料で相談できます。',
  },
];

export const metadata: Metadata = {
  title: '公立vs私立 高校3年間の費用はいくら違う？就学支援金（無償化）込みで比較 | My Naishin',
  description:
    '公立高校と私立高校で、3年間の実質負担がいくら違うのかを、世帯年収（就学支援金＝高校無償化）を反映してシミュレーション。年収約590万円未満なら私立は年39.6万円・3年で最大118.8万円支援。文部科学省データに基づく無料計算ツールで、ご家庭の年収区分での公私の差を比較できます。',
  keywords: ['公立 私立 高校 費用', '高校 学費 公立 私立 比較', '高校無償化 私立 いくら', '就学支援金 私立', '私立高校 3年間 費用', '公立 私立 違い 費用'],
  alternates: { canonical: `${SITE_URL}/koukou-hiyou/kokoroze` },
  openGraph: {
    title: '公立vs私立 高校3年間の費用はいくら違う？就学支援金込みで比較',
    description: '世帯年収別に公立・私立の3年間の実質負担を比較（高校無償化＝就学支援金を反映）。文科省データの無料ツール。',
    url: `${SITE_URL}/koukou-hiyou/kokoroze`,
    type: 'website',
  },
};

export default function KokorozePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'お金・費用まとめ', url: `${SITE_URL}/hiyou` },
          { name: '高校の費用', url: `${SITE_URL}/koukou-hiyou` },
          { name: '公立vs私立 3年総額', url: `${SITE_URL}/koukou-hiyou/kokoroze` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hiyou" className="hover:text-blue-600">お金・費用まとめ</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/koukou-hiyou" className="hover:text-blue-600">高校の費用</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">公立vs私立 3年総額</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <School className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">公立vs私立 高校3年間の費用はいくら違う？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校無償化（就学支援金）を<strong>世帯年収で反映</strong>して、公立・私立の3年間の<strong>実質負担</strong>を比較します。
              文部科学省データに基づく無料シミュレーターです。
            </p>
          </header>

          <AnswerBox question="公立と私立、3年間の実質負担はどれだけ違う？">
            <p>
              学習費総額は<strong>公立 約51万円/年・私立 約105万円/年</strong>（文科省・全日制）。これに高校無償化（就学支援金）が効きます。
              世帯年収<strong>約590万円未満</strong>なら私立は<strong>年39万6,000円・3年で最大118.8万円</strong>支援され、公私の差は大きく縮みます。
              約910万円以上は従来対象外（所得制限の見直し・自治体補助あり）。下のシミュレーターでご家庭の年収区分の差を確認できます。
            </p>
          </AnswerBox>

          <div className="mt-8">
            <KoukouKokorozeCalculator />
          </div>

          {/* 保護者リード（学費＝権限ズレ0・FP無料相談） */}
          <div className="mt-6">
            <ParentLeadCTA
              placement="hiyou"
              heading="私立・公立どちらでも、家計の見通しを早めに立てておくと安心です"
              body="就学支援金で授業料は軽くなりますが、入学金・施設費・大学進学費用は別。我が家はいくら必要か・どう準備するかを、教育資金に詳しい専門家FPへ無料で相談できます（その場で契約を迫られることはありません）。"
            />
          </div>

          {/* 回遊 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Wallet className="h-5 w-5 text-emerald-600" />
              関連する費用ツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の学費・教材費・通学費の総額' },
                { href: '/shougakukin', title: '高校無償化・就学支援金ガイド', desc: '世帯年収別の支援額と申請のしくみ' },
                { href: '/shinro-hiyou', title: '高校〜大学の教育費（進路別）', desc: '大学進学まで含めた総額を就学支援金込みで概算' },
                { href: '/juken-ryou', title: '受験料・模試代シミュレーター', desc: '受験シーズンに出ていくお金の目安' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="group flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
                  <span>
                    <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-700">{c.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
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
