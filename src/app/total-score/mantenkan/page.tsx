import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ScaleScoreCalculator } from '@/components/TotalScore/ScaleScoreCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';
import { AdUnit } from '@/components/AdSlot';

const FAQS = [
  {
    question: '得点を1000点満点に換算する計算式は？',
    answer: '「得点 ÷ 元の満点 × 1000」で計算します。例えば500点満点中350点なら、350÷500×1000＝700点です。単純な比例計算なので、どんな満点のテストでも同じ式で1000点満点相当の点数に換算できます。',
  },
  {
    question: 'なぜ入試で「1000点満点に換算」する県があるのですか？',
    answer: '新潟県の公立高校一般選抜では、満点が異なる調査書（内申）135点と学力検査500点を比較・合算しやすくするため、それぞれをいったん1000点満点に換算してから、高校ごとの比率（調査書：学力＝7:3〜3:7）で合算する方式を採用しています。満点の異なる指標を同じ物差しに揃えるために1000点換算が使われる代表例です。',
  },
  {
    question: '100点満点に換算することもできますか？',
    answer: 'はい。当ツールは換算後の満点を1000点・500点・100点、または任意の数値に自由に設定できます。100点満点に設定すれば、テストの得点を「100点満点なら何点相当か」に換算できます。模試や実力テストの得点を別の満点基準に揃えたい場合にも使えます。',
  },
  {
    question: '換算した点数で実際の合否は判定できますか？',
    answer: 'このツールは点数の比例換算のみを行う汎用計算機で、特定の都道府県の合否判定を再現するものではありません。都道府県ごとの総合得点の実際の計算方法は都道府県別 総合得点・合否の仕組み一覧で確認してください。',
  },
];

export const metadata: Metadata = {
  title: '得点を100点・1000点など好きな満点に換算する計算機 | My Naishin',
  description: '内申点・学力検査・模試などの得点を、100点満点・1000点満点（または任意の満点）に無料で換算。得点÷元の満点×換算後の満点の比例計算で、入力するだけで即結果表示。登録不要。',
  keywords: ['1000点換算', '1000点満点 換算', '得点 1000点 換算 計算', '点数 換算 計算機', '100点換算', '100点満点 換算 サイト', '満点換算'],
  alternates: { canonical: `${SITE_URL}/total-score/mantenkan` },
  openGraph: {
    title: '得点を100点・1000点など好きな満点に換算する計算機 | My Naishin',
    description: '内申点・学力検査・模試などの得点を、100点満点・1000点満点（または任意の満点）に無料で換算する計算機。',
    url: `${SITE_URL}/total-score/mantenkan`,
    type: 'article',
  },
};

export default function TotalScoreMantenkanPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '都道府県別 総合得点の仕組み', url: `${SITE_URL}/total-score` },
          { name: '満点換算', url: `${SITE_URL}/total-score/mantenkan` },
        ]}
      />
      <WebApplicationSchema
        name="得点を100点・1000点など好きな満点に換算する計算機"
        description="内申点・学力検査・模試などの得点を100点満点・1000点満点（または任意の満点）に換算する無料ツール"
        url={`${SITE_URL}/total-score/mantenkan`}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/total-score" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">都道府県別 総合得点の仕組み</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">満点換算</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">得点を100点・1000点など好きな満点に換算する計算機</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              内申点・学力検査・模試など、<strong>満点がバラバラな得点</strong>を100点満点・1000点満点（または任意の満点）にそろえて比較できます。
            </p>
          </header>

          <ScaleScoreCalculator />

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">なぜ「1000点満点」に換算するの？</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              満点が違う得点どうしは、そのままでは大小を比べられません。そこで「得点 ÷ 満点 × 1000」の比例計算で、
              どんな満点の得点も同じ1000点満点の物差しに揃えます。実際に新潟県の公立高校一般選抜では、
              満点135点の調査書（内申）と満点500点の学力検査を、それぞれ1000点満点に換算してから
              高校ごとの比率で合算する方式を採用しています。
            </p>
          </section>

          {/* T-ADS1 AdSense RESULT_BELOW: 換算・早見面。計算機の入力欄・ボタンに隣接させないよう、答えの解説セクションの後に置く。
              NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="RESULT_BELOW" />

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              <li>
                <Link href="/total-score" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  都道府県別 総合得点の仕組みを見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi/mantenkan" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  満点変換つき偏差値計算はこちら
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              {FAQS.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
