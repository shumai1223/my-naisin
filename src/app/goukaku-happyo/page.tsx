import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle, ChevronRightSquare } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const PASSED_STEPS = [
  { title: '合格発表を確認する', body: '掲示・学校ウェブサイト・郵送など、学校が指定する方法で結果を確認します。方法は学校ごとに異なるため、事前に案内を確認しておきましょう。' },
  { title: '入学手続きの案内を受け取る', body: '合格者には、入学手続きの期限・必要書類・入学金の納入方法などの案内が渡されます。期限が短いことが多いので、その場でスケジュールを確認しておくと安心です。' },
  { title: '必要書類・費用を期限内にそろえる', body: '入学承諾書・誓約書・入学金の納入などが一般的です。私立を併願していた場合は、辞退の手続きが必要になることもあります。' },
  { title: '入学準備を進める', body: '制服・体操着の採寸、教科書・学用品の購入、通学経路の確認など。学校説明会や入学前登校日で案内されることが多いです。' },
];

const FAQS = [
  {
    question: '合格発表はどうやって確認しますか？',
    answer: '学校の掲示板での掲示、学校ウェブサイトでの受験番号発表、郵送での通知など、確認方法は学校・都道府県によって異なります。受験票や出願時の案内に記載されている確認方法を事前にチェックしておくことをおすすめします。',
  },
  {
    question: '合格後の入学手続きはいつまでにすればいいですか？',
    answer: '入学手続きの期限は学校によって異なり、合格発表当日〜数日以内に設定されていることが多いです。期限を過ぎると合格が無効になる場合もあるため、案内をよく確認し、余裕を持って手続きを進めましょう。',
  },
  {
    question: '私立を併願していた場合、公立合格後にすべきことは？',
    answer: '公立高校に合格し進学する場合、併願していた私立高校への辞退手続き（入学辞退届の提出など）が必要になることが一般的です。私立高校ごとに手続き方法・期限が異なるため、出願時の案内を確認してください。',
  },
  {
    question: '合格発表後、中学校時代の内申点はもう関係ありませんか？',
    answer: '入試の合否判定という意味では、内申点の役目は合格発表をもって終わります。高校入学後の成績は高校での学習・定期テストによって新たに積み上げていくもので、中学校時代の内申点がそのまま引き継がれることはありません。ただし、県をまたぐ転校を将来的に検討する可能性がある場合は、都道府県ごとに内申点の重み付けの仕組み自体が異なる点は知っておくと安心です。',
  },
  {
    question: '第一志望に不合格だった場合、次にできることはありますか？',
    answer: '多くの都道府県では、公立高校の欠員募集（二次募集）や、私立高校の追加合格・二次募集が行われることがあります。実施の有無や日程は学校・都道府県によって異なるため、担任の先生や志望校に早めに相談することをおすすめします。まずは落ち着いて、学校からの案内・先生への相談を優先しましょう。',
  },
  {
    question: '合格発表の結果を見て、これからの流れが不安です。何をすればいいですか？',
    answer: '結果がどうであれ、まずは学校から渡される案内・指示に従うのが基本です。合格した場合は入学手続きの期限を確認し、不合格や進路に迷いがある場合は、担任の先生・スクールカウンセラーに早めに相談することをおすすめします。一人で抱え込まず、周囲に相談してください。',
  },
];

export const metadata: Metadata = {
  title: '合格発表後の手続き【入学準備・私立辞退の流れ】 | My Naishin',
  description:
    '高校入試の合格発表後にやることを一般的な流れで解説。入学手続き・必要書類・私立併願校の辞退手続き・入学準備のチェックリストまで。学校ごとの正式な指示が最優先です。',
  keywords: ['合格発表後 手続き', '合格発表 やること', '入学手続き 高校', '私立 辞退 手続き', '高校入試 二次募集'],
  alternates: { canonical: `${SITE_URL}/goukaku-happyo` },
  openGraph: {
    title: '合格発表後の手続き【入学準備・私立辞退の流れ】',
    description: '合格発表後の入学手続き・私立辞退・入学準備の一般的な流れ。',
    url: `${SITE_URL}/goukaku-happyo`,
    type: 'website',
  },
};

export default function GoukakuHappyoPage() {
  const url = `${SITE_URL}/goukaku-happyo`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '合格発表後の手続き', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        name="合格発表後の入学手続きの流れ"
        description="高校入試の合格発表後、入学までにやることの一般的な手順"
        steps={PASSED_STEPS.map((s) => ({ name: s.title, text: s.body }))}
        totalTime="P14D"
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">合格発表後の手続き</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">合格発表後の手続き</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              合格発表の後、入学までにやることを一般的な流れでまとめました。学校ごとの正式な手続き・期限は、学校から渡される案内が最優先です。
            </p>
          </header>

          <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-base leading-[1.8] text-amber-900">
              入学手続きの方法・必要書類・期限は学校ごとに大きく異なります。このページは一般的な流れの目安であり、正式な手続きは必ず学校から渡される案内に従ってください。
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              合格後の一般的な流れ
            </h2>
            <ol className="space-y-5">
              {PASSED_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="w-6 shrink-0 text-base font-bold tabular-nums text-brand-700">{i + 1}.</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              思うような結果でなかったときは
            </h2>
            <div className="space-y-3 text-base leading-[1.8] text-slate-900">
              <p>
                第一志望に届かなかった場合でも、多くの都道府県で公立高校の欠員募集（二次募集）や、私立高校の追加募集が実施されることがあります。実施の有無・日程は年度や地域によって異なるため、まずは担任の先生や志望校へ早めに相談することが大切です。
              </p>
              <p>
                結果がどうであれ、一人で抱え込まず、先生やご家族に相談してください。進路の選択肢は入試の結果だけで終わるものではありません。
              </p>
            </div>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">
                    Q. {f.question}
                  </h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-10">
            <ParentLeadCTA placement="hiyou" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/jikosaiten" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">自己採点のやり方</span>
                  <ChevronRightSquare className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/juken-toujitsu" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">受験当日の持ち物・タイムライン</span>
                  <ChevronRightSquare className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/heigan-yuugu" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">併願優遇の仕組み</span>
                  <ChevronRightSquare className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/koukou-hiyou" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">高校費用シミュレーター</span>
                  <ChevronRightSquare className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/naishin-kakusa" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">都道府県別 内申点格差レポート</span>
                  <ChevronRightSquare className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
