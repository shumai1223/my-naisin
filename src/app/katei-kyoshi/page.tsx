import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Users, ChevronRightSquare, CheckCircle, HelpCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { topLiveOfferByEV } from '@/lib/affiliate-economics';
import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '家庭教師とオンライン家庭教師、何が違いますか？',
    answer: '従来の家庭教師は指導者が自宅を訪問しますが、オンライン家庭教師はビデオ通話で指導を受けます。移動時間がなく地方在住でも都市部の指導者に習えることが多く、料金は訪問型よりやや抑えめな傾向があります。指導の質は運営会社・指導者による差が大きいため、無料体験で相性を確認するのがおすすめです。',
  },
  {
    question: '家庭教師と個別指導塾、どちらを選ぶべき？',
    answer: '家庭教師は1対1でその子だけに合わせたペース・カリキュラムを組みやすく、個別指導塾は複数の講師陣・自習室・進路指導のノウハウが強みです。「特定の教科だけ集中的に伸ばしたい」「自宅で落ち着いて学習したい」なら家庭教師、「塾の環境やライバルの存在も活用したい」なら個別指導塾が向く傾向があります。',
  },
  {
    question: '家庭教師の料金相場はどのくらいですか？',
    answer: '訪問型の家庭教師は1回（60〜90分）あたり3,000円〜8,000円程度、オンライン家庭教師は2,000円〜5,000円程度が一般的な目安です（指導者の経験・大学生か プロ講師かで幅があります）。月謝制・回数制など料金体系も会社によって異なるため、複数社の無料体験・資料請求で比較してから決めると失敗しにくいです。',
  },
  {
    question: '家庭教師はいつから始めるべきですか？',
    answer: '苦手教科が定期テストや模試で明確になったタイミング、または志望校との差が大きく「学校の授業ペースでは間に合わない」と感じたタイミングが目安です。内申点・偏差値を計算して現在地を数値で把握してから検討すると、必要な対策の量が具体的に見えてきます。',
  },
];

/** 家庭教師系オファーのうちEV最大を選ぶ（承認状況が変わっても自動で最適へ追従）。 */
const KATEI_KYOSHI_CANDIDATES = new Set<AffiliateId>(['moshimo-e-live', 'moshimo-manabuterasu', 'moshimo-studycoach']);
const bestOfferId = topLiveOfferByEV((o) => KATEI_KYOSHI_CANDIDATES.has(o.id)) ?? 'moshimo-e-live';
const bestOfferName = AFFILIATES[bestOfferId]?.name ?? 'オンライン家庭教師';

export const metadata: Metadata = {
  title: '家庭教師の選び方比較｜オンライン家庭教師との違い・料金相場 | My Naishin',
  description: '家庭教師とオンライン家庭教師、個別指導塾との違いを比較。料金相場・選び方のポイントを解説し、無料体験で比較検討できる情報を紹介します。',
  keywords: ['家庭教師 比較', '家庭教師 選び方', 'オンライン家庭教師', '家庭教師 料金相場', '家庭教師 個別指導 違い'],
  alternates: { canonical: `${SITE_URL}/katei-kyoshi` },
  openGraph: {
    title: '家庭教師の選び方比較｜オンライン家庭教師との違い・料金相場 | My Naishin',
    description: '家庭教師・オンライン家庭教師・個別指導塾の違いと料金相場を比較し、選び方のポイントを解説。',
    url: `${SITE_URL}/katei-kyoshi`,
    type: 'article',
  },
};

export default function KateiKyoshiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '家庭教師の選び方比較', url: `${SITE_URL}/katei-kyoshi` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">家庭教師の選び方比較</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">家庭教師の選び方比較</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              家庭教師・オンライン家庭教師・個別指導塾の違いと料金相場を整理し、お子さまに合う選び方をまとめました。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <CheckCircle className="h-5 w-5 text-indigo-500" />
              指導形態ごとの違い
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="text-sm font-bold text-indigo-900">訪問型 家庭教師</div>
                <p className="mt-1 text-xs leading-relaxed text-indigo-800">
                  指導者が自宅に来て1対1で指導。移動不要・自分のペースで質問しやすい。料金はやや高め（1回3,000〜8,000円目安）。
                </p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <div className="text-sm font-bold text-violet-900">オンライン家庭教師</div>
                <p className="mt-1 text-xs leading-relaxed text-violet-800">
                  ビデオ通話で1対1指導。地方在住でも都市部の指導者に習えることが多く、料金はやや抑えめ（1回2,000〜5,000円目安）。
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="text-sm font-bold text-emerald-900">個別指導塾</div>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  教室に通い1〜3対1で指導。自習室・複数講師・進路指導のノウハウが強み。教室により料金体系は様々。
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              ※料金は一般的な目安であり、指導者の経験（大学生／プロ）や地域・会社によって幅があります。正確な料金は各社の無料体験・資料請求でご確認ください。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">選び方のポイント</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
              <li>① まずはお子さまの内申点・偏差値を数値で把握し、志望校との差を確認する。</li>
              <li>② 苦手教科をピンポイントで伸ばしたいか、幅広く進路指導も含めて任せたいかを整理する。</li>
              <li>③ 無料体験・資料請求で複数社を比較し、指導者との相性を確認してから決める。</li>
              <li>④ 料金体系（月謝制／回数制／教材費の有無）を必ず事前に確認する。</li>
            </ul>
          </section>

          <ParentLeadCTA
            heading={`まずは${bestOfferName}の無料体験で相性を確認`}
            body="お子さまに合う指導者かどうかは、実際の体験授業で確認するのが一番確実です。費用はかからず、その場で契約を迫られることはありません。"
            affiliateId={bestOfferId}
            ctaText="無料体験・相談をする"
            note={`【${bestOfferName}】の無料体験（PR）`}
            className="mb-8"
          />

          <SaveResultCTA
            source="home"
            heading="家庭教師選びの参考情報を、受験本番まで無料で受け取りませんか？"
            body="内申点アップのコツ・志望校の最新情報を、受験本番まで無料でお届けします。LINEまたはメールで、いつでも解除できます。"
            className="mb-10"
          />

          <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/juku-hiyou" className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                塾代の相場を確認する
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/naishin-age-kata" className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50">
                内申点の上げ方（学年別）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              よくある質問
            </h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
