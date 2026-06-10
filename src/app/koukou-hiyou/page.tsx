import type { Metadata } from 'next';
import Link from 'next/link';
import { School, Home, ChevronRight, HelpCircle, BookCheck } from 'lucide-react';

import { KoukouHiyouCalculator } from '@/components/KoukouHiyouCalculator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';

const FAQS = [
  {
    question: '高校3年間の費用はいくらかかりますか？',
    answer:
      '文部科学省「子供の学習費調査」の学習費総額をもとにすると、公立高校は3年間で約165万円、私立高校は約340万円が目安です（授業料・教材費・通学費・塾代などを含む総額）。入学時の制服・入学金などの準備費を加えると、私立ではさらに大きくなります。',
  },
  {
    question: '公立高校と私立高校で費用はどれくらい違いますか？',
    answer:
      '1年間の学習費総額は公立 約51万円、私立 約105万円で、約2倍の差があります。3年間では公立 約165万円に対し私立 約340万円となり、180万円前後の差になります。',
  },
  {
    question: '就学支援金で授業料は無料になりますか？',
    answer:
      '高等学校等就学支援金により、公立高校の授業料は実質無償化されています。私立高校も世帯年収の目安910万円未満で年額39万6,000円を上限に支援され、授業料負担が大きく軽減されます。本ツールの初期値は支援後の実支出に近い学習費総額を用いています。',
  },
];

export const metadata: Metadata = {
  title: '高校の費用シミュレーター｜公立・私立の3年間の学費と総額【2026年】 | My Naishin',
  description:
    '高校3年間にかかる費用を無料でシミュレーション。公立・私立を選ぶだけで、学費・教材費・通学費などの総額を自動計算。文部科学省「子供の学習費調査」の一次データに準拠（就学支援金考慮）。',
  alternates: { canonical: 'https://my-naishin.com/koukou-hiyou' },
};

export default function KoukouHiyouPage() {
  return (
    <>
      <WebApplicationSchema
        name="高校の費用シミュレーター | My Naishin"
        description="公立・私立の高校3年間にかかる費用を自動計算。文科省データに準拠。"
        url="https://my-naishin.com/koukou-hiyou"
        featureList={['公立・私立の高校費用を3年間で計算', '文科省 子供の学習費調査に準拠', '入学準備費・年間学習費を調整可能']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '高校の費用', url: 'https://my-naishin.com/koukou-hiyou' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-3.5 w-3.5" />ホーム</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700">高校の費用</span>
        </nav>

        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
          <School className="h-3.5 w-3.5" />無料・一次情報準拠
        </div>
        <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">高校3年間で、お金はいくらかかる？</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          公立・私立を選ぶだけで、高校3年間の費用（学費・教材費・通学費など）の総額を自動計算。
          数値は<strong>文部科学省「子供の学習費調査」</strong>に基づきます。
        </p>

        <div className="mt-6">
          <KoukouHiyouCalculator />
        </div>

        {/* 出典（一次情報準拠） */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <BookCheck className="h-3.5 w-3.5 text-blue-600" />
            出典・参考データ（一次情報）
          </div>
          <ul className="space-y-1.5 text-xs leading-relaxed">
            <li>
              <a href="https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                文部科学省「子供の学習費調査」
              </a>
              <span className="text-slate-400"> — 公立高校 約51万円/年・私立高校 約105万円/年（学習費総額）</span>
            </li>
            <li>
              <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm" target="_blank" rel="noopener" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                文部科学省「高校生等への修学支援（就学支援金）」
              </a>
              <span className="text-slate-400"> — 公立は授業料実質無償、私立は上限39.6万円/年の支援</span>
            </li>
          </ul>
        </div>

        {/* 保護者リード導線（収益／審査中は休眠） */}
        <div className="mt-8">
          <ParentLeadCTA
            auditHide
            placement="parent-lp"
            heading="高校の学費、今のうちに備えていますか？"
            body="高校3年間の費用は公立でも約165万円。早めの準備で選択肢が広がります。ご家庭に合った学習・進学プランを、まずは無料の資料で確認できます。"
          />
        </div>

        {/* 名簿化（費用に関心の高い保護者を受験本番まで保持） */}
        <div className="mt-6">
          <SaveResultCTA
            source="home"
            heading="進学費用と受験情報を、無料で受け取りませんか？"
            body="学費の備え方・就学支援金・志望校選びのコツを、LINEまたはメールでお届けします。いつでも解除できます。"
          />
        </div>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900"><HelpCircle className="h-5 w-5 text-blue-600" />よくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50">{f.question}<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" /></summary>
                <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 関連ツール */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">関連ツール</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 shadow-sm hover:border-blue-200">内申点を計算する →</Link>
            <Link href="/hensachi" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 shadow-sm hover:border-blue-200">偏差値を計算する →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
