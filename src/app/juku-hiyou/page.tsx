import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Wallet, Calculator, Users, GraduationCap, Lightbulb } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { JukuhiCalculator } from '@/components/JukuhiCalculator';
import { AnswerBox } from '@/components/AnswerBox';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SITE_URL } from '@/lib/naishin-dataset';

const JUKU_FAQS = [
  {
    question: '中学生の塾代は月いくらが相場ですか？',
    answer:
      '形態と学年で変わりますが、一般的な目安は集団塾で月1.5〜3万円、個別指導で月2〜4万円、家庭教師で月2.5〜4万円程度です。受験学年（中3）は週のコマ数が増え、月謝も上がる傾向があります。さらに夏期・冬期などの季節講習費が年間で数万〜数十万円かかる点に注意が必要です。正確な金額は塾・地域で大きく異なるため、無料体験や資料請求で比較するのが確実です。',
  },
  {
    question: '集団塾と個別指導、家庭教師では費用はどれくらい違いますか？',
    answer:
      '一般に「集団塾 ＜ 個別指導 ≒ 家庭教師」の順で高くなる傾向です。集団は一人あたりの単価が低く、個別・家庭教師は指導が手厚い分だけ単価が上がります。一方で季節講習費は集団塾が高額になりやすく、家庭教師は講習費が少なめなど、年間総額で見ると単純比較できません。当ページのシミュレーターで「月謝＋講習費」の年間・総額を試算して比べるのがおすすめです。',
  },
  {
    question: '中学3年間で塾代の総額はいくらになりますか？',
    answer:
      '通い始める学年と形態によりますが、中1から中3まで通うと総額でおおむね100万〜250万円程度になるケースが多いです。中3だけなら40万〜80万円程度が一つの目安です。高校の学費（3年間で公立約150万円・私立約300〜400万円）と合わせて、早めに総額を把握しておくと進路の選択肢を狭めずに済みます。',
  },
  {
    question: '塾代を抑えるコツはありますか？',
    answer:
      '①必要な教科だけ絞って受講する、②季節講習は本当に必要なコマだけ選ぶ、③兄弟割引・友人紹介・早期入塾の特典を確認する、④通信教育やオンライン塾と併用する、などが有効です。また、複数の塾の無料体験を受けて月謝・講習費・合格実績を比較すると、同じ予算でより良い選択ができます。',
  },
  {
    question: '塾はいつから通わせるべきですか？',
    answer:
      '内申点は中1から評価対象になる地域が多いため、内申重視の地域では早めの対策が有利です。一般的には中2の冬〜中3の春が一つの目安ですが、まずはお子さまの内申点・偏差値・志望校との差を把握し、必要性を判断してから決めると無駄がありません。',
  },
];

const RATE_TABLE = [
  { type: '集団塾', monthly: '1.5〜3万円', koushuu: '年10〜30万円', feature: '一人あたりの単価が低い／競争環境' },
  { type: '個別指導', monthly: '2〜4万円', koushuu: '年15〜30万円', feature: '1対1〜1対3／苦手に合わせやすい' },
  { type: '家庭教師', monthly: '2.5〜4万円', koushuu: '年5〜10万円', feature: '訪問・オンライン／講習費は少なめ' },
];

export const metadata: Metadata = {
  title: '塾代シミュレーター｜中学生の塾費用の相場・月謝・3年間の総額【2026年】| My Naishin',
  description:
    '中学生の塾代はいくら？集団塾・個別指導・家庭教師の月謝相場と、学年から受験までの総額を無料でシミュレーション。季節講習費まで含めた年間・総額の目安がすぐ分かります。高校の費用と合わせて、早めに教育費の全体像を把握しましょう。',
  keywords: [
    '塾代 相場',
    '塾 費用 中学生',
    '中学生 塾 月謝',
    '個別指導 月謝 相場',
    '家庭教師 料金 相場',
    '塾代 シミュレーション',
    '塾 いくら 中学',
    '中学 塾 費用 総額',
  ],
  alternates: { canonical: `${SITE_URL}/juku-hiyou` },
  openGraph: {
    title: '塾代シミュレーター｜中学生の塾費用の相場・3年間の総額【2026年】| My Naishin',
    description:
      '集団塾・個別指導・家庭教師の月謝相場と受験までの総額を無料でシミュレーション。季節講習費込みの目安がすぐ分かります。',
    url: `${SITE_URL}/juku-hiyou`,
    type: 'website',
  },
};

export default function JukuHiyouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '塾代シミュレーター', url: `${SITE_URL}/juku-hiyou` },
        ]}
      />
      <FAQPageSchema faqItems={JUKU_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">塾代シミュレーター</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
              <Wallet className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">塾代シミュレーター</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              中学生の塾代は<strong>形態と学年</strong>で大きく変わります。集団塾・個別指導・家庭教師の月謝に、
              見落としがちな<strong>季節講習費</strong>まで含めて、受験までの総額をその場で試算できます。
            </p>
          </header>

          {/* 答え先出し（GEO/AI引用） */}
          <div className="mb-8">
            <AnswerBox question="中学生の塾代は月いくら？3年間の総額は？">
              形態と学年で変わりますが、月謝の目安は<strong>集団塾 月1.5〜3万円・個別指導 月2〜4万円・家庭教師 月2.5〜4万円</strong>です。
              季節講習費を含め、中1から中3まで通うと<strong>総額でおおむね100万〜250万円</strong>、中3だけなら40万〜80万円程度が目安。
              下のシミュレーターで、形態・通い始める学年から「月謝＋講習費」の年間・総額を試算できます。
            </AnswerBox>
          </div>

          {/* シミュレーター */}
          <section className="mb-8">
            <JukuhiCalculator />
          </section>

          {/* 保護者リード（最高インテント＝お金を計算した直後） */}
          <ParentLeadCTA placement="hiyou" className="mb-10" />

          {/* 相場の目安テーブル */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-amber-600" />
              中学生の塾代の相場（目安）
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-amber-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">形態</th>
                    <th className="px-4 py-3 text-left font-bold">月謝の目安</th>
                    <th className="px-4 py-3 text-left font-bold">季節講習（年間）</th>
                    <th className="px-4 py-3 text-left font-bold">特徴</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {RATE_TABLE.map((r) => (
                    <tr key={r.type} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3 font-bold">{r.type}</td>
                      <td className="px-4 py-3">{r.monthly}</td>
                      <td className="px-4 py-3">{r.koushuu}</td>
                      <td className="px-4 py-3 text-xs">{r.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 一般的な相場の目安です。地域・塾・受講コマ数で大きく変動し、受験学年（中3）は月謝・講習費とも上がる傾向があります。
            </p>
          </section>

          {/* 抑えるコツ */}
          <section className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-900">
              <Lightbulb className="h-5 w-5 text-emerald-600" />
              塾代を賢く抑える4つのコツ
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
              <li>① <strong>必要な教科だけ</strong>に絞る（苦手・配点の高い教科を優先）</li>
              <li>② <strong>季節講習</strong>は本当に必要なコマだけ選ぶ（全部受けると総額が跳ね上がる）</li>
              <li>③ 兄弟割引・友人紹介・早期入塾などの<strong>特典</strong>を確認する</li>
              <li>④ 複数の塾の<strong>無料体験・資料請求</strong>で月謝・講習費・実績を比較してから決める</li>
            </ul>
          </section>

          {/* 塾リード接続（コツ④の「無料体験で比較」を実行可能に。FP相談=上部、塾体験=ここで二毛作）。
              page intent（塾を比べたい保護者）に最も合う全国オンライン個別の無料体験へ。cta_view計装つき。 */}
          <section className="mb-10 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/60 p-6 shadow-sm">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              <Users className="h-3.5 w-3.5" />
              塾選びは「無料体験」で比べてから
            </div>
            <h2 className="mb-2 text-lg font-bold text-amber-900">月謝の安さだけで決めない。相性は体験で分かる</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              同じ予算でも、指導の相性・講師・教室の雰囲気で伸び方は変わります。送迎不要・全国どこからでも受けられるオンライン個別指導なら、まず無料体験で「合うかどうか」を確かめてから決められます。費用はかかりません。
            </p>
            <AffiliateAd
              id="sora-juku-text"
              hideLabel
              trackView
              viewPlacement="juku-hiyou"
              ctaText="オンライン個別指導の無料体験を申し込む"
              linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-amber-700 active:scale-95 sm:w-auto"
            />
            <div className="mt-2 text-[11px] text-slate-400">そら塾（オンライン個別指導）の無料体験（PR）</div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {JUKU_FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {faq.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedToolsSection
            links={[
              { href: '/kyouiku-hi', title: '教育費シミュレーター', desc: '中学〜高校卒業までの総額を内訳つきで試算' },
              { href: '/shinro-hiyou', title: '高校〜大学の教育費（進路別）', desc: '大学まで含めた総額を自宅/下宿・就学支援金込みで試算' },
              { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の費用目安を試算' },
              { href: '/shougakukin', title: '高校無償化・就学支援金ガイド', desc: '公立・私立別の支援額と世帯年収の目安' },
              { href: '/hiyou', title: 'お金・費用まとめ', desc: '教育費・学費・塾代・無償化をまとめて確認' },
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・親ができること' },
              { href: 'https://my-shingaku.com/gakuhi', title: '大学進学の費用（姉妹サイト）', desc: '学費・一人暮らし・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}
