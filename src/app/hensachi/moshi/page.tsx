import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';

// 偏差値を上げるのに必要な「点数アップ」＝ Δ偏差値 ÷ 10 × 標準偏差（数式で確定）
const STD_DEV = 15; // 定期テスト・一般的な模試の目安
const RAISE_ROWS = [3, 5, 7, 10].map((d) => ({
  delta: d,
  points: Math.round((d / 10) * STD_DEV * 10) / 10,
}));

const FAQS = [
  {
    question: 'なぜ模試によって偏差値が違うの？',
    answer: '偏差値は「その模試を受けた集団（母集団）の中での位置」を表すため、母集団が違えば同じ学力でも偏差値は変わります。受験者層のレベルが高い模試ほど、同じ点数でも偏差値は低めに出ます。難関校志望者が多く受ける模試と、基礎層も含む模試では、同じ自分でも偏差値が数ポイント違うのは普通です。',
  },
  {
    question: '模試の回を重ねたら偏差値が下がった。学力が落ちた？',
    answer: '必ずしもそうとは限りません。学年が上がるにつれて受験者層が本格化（=母集団のレベルが上がる）し、同じ実力でも偏差値が下がって見えることがあります。逆に上がった場合も、母集団の変化が一因のことも。1回の数字で判断せず、同じ模試の同じシリーズで推移を見るのが正確です。',
  },
  {
    question: '複数の模試の偏差値はどう比べればいい？',
    answer: '異なる模試の偏差値を単純に比べるのは要注意です。母集団が違うため、A模試の偏差値60とB模試の偏差値60は同じ学力を意味しません。比較するなら「同じ模試・同じシリーズ」で時系列に見るのが基本。志望校判定は、その模試が出す合格判定（A〜E判定など）を併用しましょう。',
  },
  {
    question: '偏差値を5上げるには点数を何点上げればいい？',
    answer: '「必要な点数アップ＝上げたい偏差値 ÷ 10 × 標準偏差」で概算できます。標準偏差15のテストなら、偏差値を5上げるには約7.5点、10上げるには約15点のアップが目安です（平均点が一定の場合）。ただし周りも伸びると偏差値は上がりにくいので、苦手教科＝伸びしろの大きい教科から取り組むのが効率的です。',
  },
];

export const metadata: Metadata = {
  title: '模試の偏差値の見方【中学生】模試で偏差値が違う理由・回次別・推移の見方 | My Naishin',
  description: '模試の偏差値の正しい見方を解説。「模試によって偏差値が違う理由（母集団の違い）」「回を重ねて偏差値が下がる理由」「複数模試の比べ方」「偏差値を5上げるのに必要な点数」まで。同じ模試で推移を見るのがコツ。無料の偏差値計算ツール付き・2026年最新。',
  keywords: ['模試 偏差値 見方', '模試 偏差値 違う', '模試 偏差値 下がった', '偏差値 推移', '偏差値 比べ方', '模試 偏差値 上げる', '偏差値 母集団', '模試 判定 偏差値', '偏差値 何点で 上がる'],
  alternates: { canonical: 'https://my-naishin.com/hensachi/moshi' },
  openGraph: {
    title: '模試の偏差値の見方【中学生】模試で偏差値が違う理由・回次別・推移の見方 | My Naishin',
    description: '模試で偏差値が違う理由・回次別の見方・推移の追い方・偏差値を上げるのに必要な点数まで解説。無料ツール付き。',
    url: 'https://my-naishin.com/hensachi/moshi',
  },
};

export default function HensachiMoshiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
          { name: '模試の偏差値の見方', url: 'https://my-naishin.com/hensachi/moshi' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">模試の偏差値の見方</span>
          </nav>

          {/* Header: パンくず → h1 → メタ行（運営者・更新日・定義）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">模試の偏差値の見方</h1>
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <li className="flex flex-wrap items-center gap-2">
                監修・運営：ないしんパンダ
                <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  2026年度受験生
                </span>
              </li>
              <li>最終更新：2026年6月12日</li>
              <li>偏差値＝平均50・標準偏差10の正規分布</li>
            </ul>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「<strong>模試によって偏差値が違う</strong>」「<strong>回を重ねたら偏差値が下がった</strong>」——その理由と、
              偏差値の正しい<strong>見方・比べ方・推移の追い方</strong>を中学生向けに解説します。
            </p>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              偏差値の定義（母集団内の位置）と数式から、模試の偏差値の読み方を解説します。特定模試の換算は扱いません。
            </p>
          </header>

          {/* なぜ模試で偏差値が違う */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              模試によって偏差値が違うのはなぜ？
            </h2>
            <p className="text-base leading-[1.8] text-slate-900">
              偏差値は「<strong>その模試を受けた集団（母集団）の中で、自分がどの位置にいるか</strong>」を表す数字です。
              だから、母集団が違えば<strong>同じ学力でも偏差値は変わります</strong>。難関校志望者が多く集まる模試では、同じ点数でも偏差値は低めに出ます。
            </p>
            <div className="mt-4 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="py-4 sm:pr-4">
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">受験者層がハイレベルな模試</h3>
                <p className="text-base leading-[1.8] text-slate-900">上位層が多い→平均点が高い→同じ点数でも偏差値は低め。難関校の判定向き。</p>
              </div>
              <div className="py-4 sm:pl-4">
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">幅広い層が受ける模試</h3>
                <p className="text-base leading-[1.8] text-slate-900">基礎層も含む→平均点が下がる→同じ点数でも偏差値は高め。全体での位置確認向き。</p>
              </div>
            </div>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              つまり「A模試の偏差値60」と「B模試の偏差値60」は、<strong>同じ学力を意味しません</strong>。比べるなら同じ模試どうしで。
            </p>
          </section>

          {/* 回次別・推移の見方 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              回次別・偏差値の推移の見方
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
              <li><strong>1回の偏差値で判断しない。</strong>体調・出題分野の相性で数ポイントは普通に動きます。</li>
              <li><strong>同じ模試の同じシリーズで時系列に見る。</strong>これが一番正確な「伸びているか」の指標です。</li>
              <li><strong>学年が上がると母集団が本格化</strong>し、同じ実力でも偏差値が下がって見えることがあります（落ち込みすぎ注意）。</li>
              <li>志望校判定は、模試が出す<strong>合格判定（A〜E）</strong>も併せて見ると精度が上がります。</li>
            </ul>
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-base leading-[1.8] text-slate-900">
                偏差値や内申点の<strong>推移をグラフで記録</strong>しておくと、三者面談でも説得力が増します。
                <Link href="/dashboard" className="ml-1 text-brand-700 underline underline-offset-2 hover:text-brand-800">成績の記録ダッシュボードで推移を見える化 →</Link>
              </p>
            </div>
          </section>

          {/* レベル別・偏差値を上げるのに必要な点数 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              偏差値を「◯上げる」のに必要な点数の目安
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              偏差値を上げるのに必要な点数は<strong>「上げたい偏差値 ÷ 10 × 標準偏差」</strong>で概算できます（平均点が一定の場合）。
              標準偏差15のテストでの目安は次のとおり。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-4 text-left font-bold">上げたい偏差値</th>
                    <th scope="col" className="py-2 pl-4 text-right font-bold">必要な点数アップの目安</th>
                  </tr>
                </thead>
                <tbody>
                  {RAISE_ROWS.map((r) => (
                    <tr key={r.delta} className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-bold tabular-nums text-slate-900">偏差値 +{r.delta}</td>
                      <td className="py-2 pl-4 text-right tabular-nums text-slate-900">約 +{r.points}点</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              ※周りも伸びると偏差値は上がりにくいので、<strong>苦手教科＝伸びしろの大きい教科</strong>から取り組むのが効率的です。
              具体的な手順は<Link href="/hensachi/agekata" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">偏差値の上げ方</Link>へ。
            </p>
          </section>

          {/* 主要な地域模試ガイドへの導線 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Vもぎ・北辰テストなど、地域の模試について知りたい方へ</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              志望校がある都道府県ごとに主流の模試が異なります。Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の運営会社や対象地域を整理しました。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/hensachi/moshi/ichiran" className="inline-flex items-center gap-1.5 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
                主要な地域模試ガイドを見る
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/hensachi/moshi/nittei" className="inline-flex items-center gap-1.5 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                公式日程一覧を見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA
              placement="hensachi"
              heading="模試の判定が伸び悩んでいる…保護者の方へ"
              body="模試の偏差値が動かないのは「対策する教科の選び方」が原因のことも。お子さまに必要な勉強を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
              affiliateId="atama-text"
              ctaText="無料で資料・体験を申し込む"
              note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
            />
          </div>

          {/* クラスタナビ */}
          <div className="mt-10">
            <HensachiClusterNav current="moshi" />
          </div>

          {/* FAQ */}
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
        </div>
      </div>
    </>
  );
}
