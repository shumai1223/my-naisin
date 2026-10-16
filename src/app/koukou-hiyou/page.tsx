import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { KoukouHiyouCalculator } from '@/components/KoukouHiyouCalculator';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { MEXT_GAKUSHUHI_SOURCE, MEXT_SHUGAKU_SHIEN_SOURCE } from '@/lib/education-cost/data';

const FAQS = [
  {
    question: '高校3年間の費用はいくらかかりますか？',
    answer:
      '文部科学省「子供の学習費調査」の学習費総額をもとにすると、公立高校は3年間で約179万円、私立高校は約354万円が目安です（授業料・教材費・通学費・塾代などを含む総額）。入学時の制服・入学金などの準備費を加えると、私立ではさらに大きくなります。',
  },
  {
    question: '公立高校と私立高校で費用はどれくらい違いますか？',
    answer:
      '1年間の学習費総額は公立 約60万円、私立 約118万円で、約2倍の差があります。3年間では公立 約179万円に対し私立 約354万円となり、175万円前後の差になります。',
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
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline"><Home className="h-4 w-4" />ホーム</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">高校の費用</span>
        </nav>

        <header>
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">高校3年間で、お金はいくらかかる？</h1>
          <p className="mt-3 text-sm leading-[1.8] text-slate-600">
            出典：
            <a href={MEXT_GAKUSHUHI_SOURCE.url} target="_blank" rel="noopener" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
              文部科学省「子供の学習費調査」
            </a>
            （最終確認 {MEXT_GAKUSHUHI_SOURCE.lastChecked}）、
            <a href={MEXT_SHUGAKU_SHIEN_SOURCE.url} target="_blank" rel="noopener" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
              文部科学省「高校生等への修学支援（就学支援金）」
            </a>
            （最終確認 {MEXT_SHUGAKU_SHIEN_SOURCE.lastChecked}）
          </p>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            公立・私立を選ぶだけで、高校3年間の費用（学費・教材費・通学費など）の総額を自動計算。
            数値は<strong>文部科学省「子供の学習費調査」</strong>に基づきます。
          </p>
        </header>

        <div className="mt-6">
          <AnswerBox question="高校3年間の費用はいくら？公立と私立でどれくらい違う？">
            文部科学省「子供の学習費調査」をもとにすると、<strong>公立高校は3年間で約179万円、私立高校は約354万円</strong>が目安です
            （学費・教材費・通学費・塾代などを含む総額）。1年あたりは公立 約60万円・私立 約118万円で、私立はおおむね公立の約2倍。
            就学支援金で授業料負担は軽減できます。下のシミュレーターで公立・私立を選ぶと、3年間の総額の目安が分かります。
          </AnswerBox>
        </div>

        <section className="mt-6">
          <h2 className="sr-only">高校の費用シミュレーター</h2>
          <KoukouHiyouCalculator />
        </section>

        {/* 公立vs私立 3年総額（就学支援金＝無償化を年収で反映）への導線 */}
        <Link
          href="/koukou-hiyou/kokoroze"
          className="mt-6 block rounded-lg border border-slate-200 bg-brand-50 p-5 transition-colors hover:bg-brand-100"
        >
          <span className="block text-base font-bold text-brand-800">公立 vs 私立、3年間の「実質負担」を比較する →</span>
          <span className="mt-1 block text-sm leading-[1.8] text-slate-600">高校無償化（就学支援金）を世帯年収で反映。私立は無償化後いくらか・公立とどれだけ違うかが分かります。</span>
        </Link>

        {/* 出典（一次情報準拠） */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4">
          <div className="mb-2 text-sm font-bold text-slate-900">出典・参考データ（一次情報）</div>
          <ul className="space-y-2 text-sm leading-[1.8]">
            <li>
              <a href="https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm" target="_blank" rel="noopener" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
                文部科学省「子供の学習費調査」
              </a>
              <span className="text-slate-600"> — 公立高校 約60万円/年・私立高校 約118万円/年（学習費総額）</span>
            </li>
            <li>
              <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/index.htm" target="_blank" rel="noopener" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
                文部科学省「高校生等への修学支援（就学支援金）」
              </a>
              <span className="text-slate-600"> — 公立は授業料実質無償、私立は上限39.6万円/年の支援</span>
            </li>
          </ul>
        </div>

        {/* 保護者リード導線（収益） */}
        <div className="mt-8">
          <ParentLeadCTA
            placement="parent-lp"
            heading="高校の学費、今のうちに備えていますか？"
            body="高校3年間の費用は公立でも約179万円。早めの準備で選択肢が広がります。ご家庭に合った学習・進学プランを、まずは無料の資料で確認できます。"
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
          <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-base font-bold text-slate-900 marker:content-none hover:text-brand-700">{f.question}<ChevronRight className="h-4 w-4 shrink-0 text-slate-500 group-open:rotate-90" /></summary>
                <p className="border-t border-slate-200 px-5 py-4 text-base leading-[1.8] text-slate-900">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 関連ツール */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">関連ツール</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/kyouiku-hi" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">教育費シミュレーター（中学〜高校卒業）→</Link>
            <Link href="/juku-hiyou" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">塾代シミュレーター（相場・総額）→</Link>
            <Link href="/shinro-hiyou" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">高校〜大学の教育費（進路別シミュレーター）→</Link>
            <Link href="/shougakukin" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">高校無償化・就学支援金ガイド →</Link>
            <Link href="/hiyou" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">お金・費用まとめ →</Link>
            <Link href="/mendan" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">三者面談の準備チェックリスト →</Link>
            <Link href="/" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">内申点を計算する →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
