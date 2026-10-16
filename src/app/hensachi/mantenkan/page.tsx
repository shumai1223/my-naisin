import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { FullScoreHensachiCalculator } from '@/components/Hensachi/FullScoreHensachiCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';
import { AdUnit } from '@/components/AdSlot';

const FAQS = [
  {
    question: '500点満点のテストで偏差値はどう計算しますか？',
    answer: '偏差値の計算式（偏差値 = 50 + 10 ×（自分の点数 − 平均点）÷ 標準偏差）は満点の大きさに関係なく使えます。500点満点でも100点満点でも、点数・平均点・標準偏差の関係が同じであれば同じ偏差値になります。平均点や標準偏差が分からない場合は、当ツールが満点に応じた目安値（平均=満点の50%、標準偏差=満点の15%）で概算します。',
  },
  {
    question: '1000点満点や900点満点のテストでも同じ計算式が使えますか？',
    answer: 'はい、使えます。模試や実力テストで500点・900点・1000点満点など独自の配点を採用している場合でも、当ページの計算機で満点を選択（または直接入力）すれば、その満点に応じた偏差値をそのまま算出できます。',
  },
  {
    question: '250点満点や300点満点のテストでも計算できますか？',
    answer: '計算できます。250点満点・300点満点はプリセットのボタンから選べるほか、それ以外の満点（例：350点・600点など）も直接入力すれば同じ式でそのまま計算できます。満点の大きさに関わらず、点数・平均点・標準偏差の関係だけで偏差値が決まります。',
  },
  {
    question: '満点が違うテストどうしの偏差値は比較できますか？',
    answer: '偏差値はもともと満点の違いを吸収するために作られた指標なので、同じ集団が受けた前提であれば、満点の異なるテストの偏差値を並べて比較すること自体は可能です。ただし、運営会社や受験者層（母集団）が異なるテストどうしを比べる場合は、母集団の違いに注意してください（詳しくは模試の偏差値の見方を参照）。',
  },
  {
    question: '平均点・標準偏差が分からないときはどうすればいいですか？',
    answer: '学校や塾の成績表に平均点の記載がある場合はそちらを入力してください。標準偏差までは記載がないことが多いので、その場合は空欄のままで構いません。当ツールが満点の15%を標準偏差の目安として自動計算します。',
  },
];

export const metadata: Metadata = {
  title: '満点変換つき偏差値計算【250点・300点・500点・900点・1000点満点対応】| My Naishin',
  description: '250点・300点・500点・900点・1000点満点など、100点満点以外のテスト・模試の偏差値を無料で計算。平均点・標準偏差が分からなくても満点から目安値を自動算出。登録不要・30秒で結果表示。',
  keywords: ['500点満点 偏差値', '1000点満点 偏差値', '900点満点 偏差値', '250点満点 偏差値', '300点満点 偏差値', '満点 偏差値 計算', '偏差値 満点変換'],
  alternates: { canonical: `${SITE_URL}/hensachi/mantenkan` },
  openGraph: {
    title: '満点変換つき偏差値計算【250点・300点・500点・900点・1000点満点対応】| My Naishin',
    description: '100点満点以外のテスト・模試の偏差値を無料で計算。満点から平均点・標準偏差の目安値も自動算出。',
    url: `${SITE_URL}/hensachi/mantenkan`,
    type: 'article',
  },
};

export default function MantenkanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '満点変換つき偏差値計算', url: `${SITE_URL}/hensachi/mantenkan` },
        ]}
      />
      <WebApplicationSchema
        name="満点変換つき偏差値計算"
        description="500点満点・1000点満点など100点満点以外のテスト・模試の偏差値を計算する無料ツール"
        url={`${SITE_URL}/hensachi/mantenkan`}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">満点変換つき偏差値計算</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">満点変換つき偏差値計算</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              250点満点・300点満点・500点満点・900点満点・1000点満点など、<strong>100点満点以外</strong>のテストや模試の偏差値をそのまま計算できます。
              平均点・標準偏差が分からなくても、満点から目安値を自動算出します。
            </p>
          </header>

          <FullScoreHensachiCalculator />

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">なぜ満点が違っても同じ式で計算できる？</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              偏差値は「平均点からどれだけ離れているか」を、テストのばらつき（標準偏差）を基準にして表す数値です。
              満点が100点でも1000点でも、「自分の点数・平均点・標準偏差」の3つの関係さえ分かれば同じ式（偏差値 = 50 + 10 ×（自分の点数 − 平均点）÷ 標準偏差）でそのまま計算できます。
              満点の大きさそのものは計算結果に影響しません。
            </p>
          </section>

          {/* T-ADS1 AdSense RESULT_BELOW: 換算・早見面。計算機の入力欄・ボタンに隣接させないよう、答えの解説セクションの後に置く。
              NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="RESULT_BELOW" />

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">あわせて確認</h2>
            <div className="divide-y divide-slate-200">
              <Link href="/hensachi" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">100点満点の偏差値を計算する（無料）</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/hensachi/moshi" className="group flex min-h-[44px] items-center gap-3 py-3 text-base text-slate-900 hover:text-brand-700">
                <span className="group-hover:underline">模試の偏差値の見方（母集団・推移の解説）</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500" />
              </Link>
            </div>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <HensachiClusterNav current="mantenkan" />
          </div>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
