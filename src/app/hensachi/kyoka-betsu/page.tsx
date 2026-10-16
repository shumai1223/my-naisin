import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { SUBJECTS } from '@/lib/hensachi';

const FAQS = [
  {
    question: '教科別の偏差値はどうやって計算するの？',
    answer: '教科ごとに「自分の点数・その教科の平均点・標準偏差」を使って計算します。式は「偏差値＝50＋10×(自分の点数−平均点)÷標準偏差」。教科によって平均点が違うので、必ず教科ごとの平均点を使うのがポイントです。当ツールは5教科を一度に入力すると、教科別の偏差値と5教科合計の偏差値を同時に算出します。',
  },
  {
    question: '国語・数学・英語だけ（3教科）の偏差値も出せますか？',
    answer: 'はい。私立高校の一般入試は英語・数学・国語の3教科が主流です。当ツールでこの3教科だけ入力すれば、3教科の偏差値が分かります（理科・社会を空欄にすればその分は集計から除外されます）。公立志望なら5教科、私立併願も考えるなら3教科、と使い分けるのがおすすめです。',
  },
  {
    question: '同じ点数なのに教科で偏差値が違うのはなぜ？',
    answer: '偏差値は「平均点と標準偏差」で決まるためです。たとえば同じ70点でも、平均60点の教科なら偏差値は約56.7、平均50点の教科なら偏差値は約63.3になります。平均点が低い（＝難しい）テストほど、同じ点数でも偏差値は高く出ます。だから教科ごとに平均点を入れて比べることが大切です。',
  },
  {
    question: '苦手教科の偏差値を上げるには、どの教科から手をつけるべき？',
    answer: '「偏差値が一番低い教科」から取り組むのが、合計偏差値を最も効率よく上げる方法です。偏差値40の教科を50に上げる難易度は、偏差値60を65に上げるよりずっと低く、伸びしろが大きいからです。当ツールで5教科を入力し、最も偏差値が低い教科を特定してそこへ集中しましょう。',
  },
  {
    question: '5教科の偏差値はどう計算される？',
    answer: '5教科の合計偏差値は、各教科の偏差値をまとめて評価した値です（当ツールでは教科別偏差値の平均で概算）。模試では5教科の合計点に対して偏差値が出るのが一般的ですが、教科ごとの偏差値を把握しておくと、どの教科が足を引っ張っているかが分かり、対策の優先順位を決められます。',
  },
];

export const metadata: Metadata = {
  title: '教科別の偏差値 計算【国語・数学・英語・理科・社会】5教科/3教科対応・無料 | My Naishin',
  description: '【無料】教科別に偏差値を計算できるツール。国語・数学・英語・理科・社会それぞれの点数と平均点を入れるだけで教科別の偏差値を算出。5教科合計・3教科（英数国）にも対応し、苦手教科の見つけ方・教科別の上げ方も解説。2026年最新版・登録不要。',
  keywords: ['教科別 偏差値', '国語 偏差値 計算', '数学 偏差値 計算', '英語 偏差値', '理科 偏差値', '社会 偏差値', '3教科 偏差値', '5教科 偏差値', '偏差値 教科別 計算', '科目別 偏差値'],
  alternates: { canonical: 'https://my-naishin.com/hensachi/kyoka-betsu' },
  openGraph: {
    title: '教科別の偏差値 計算【国語・数学・英語・理科・社会】5教科/3教科対応・無料 | My Naishin',
    description: '教科ごとの点数と平均点から偏差値を算出。5教科合計・3教科にも対応した無料ツール。',
    url: 'https://my-naishin.com/hensachi/kyoka-betsu',
  },
};

export default function HensachiKyokaBetsuPage() {
  return (
    <>
      <WebApplicationSchema
        name="教科別 偏差値計算ツール | My Naishin"
        description="国語・数学・英語・理科・社会、教科別に偏差値を計算する無料ツール。5教科・3教科対応。"
        url="https://my-naishin.com/hensachi/kyoka-betsu"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
          { name: '教科別の偏差値', url: 'https://my-naishin.com/hensachi/kyoka-betsu' },
        ]}
      />
      <HowToSchema
        id="howto-hensachi-kyoka"
        name="教科別の偏差値を計算する方法"
        description="国語・数学・英語・理科・社会、それぞれの点数と平均点から教科別の偏差値を計算する手順。"
        totalTime="PT1M"
        steps={[
          { name: '教科ごとの点数を入力', text: '5教科それぞれの自分の点数を入力します。3教科だけ見たい場合は英数国のみ入力します。' },
          { name: '教科ごとの平均点を入力', text: 'その教科の平均点を入力します。教科で平均点が違うため、必ず教科別に入れます。' },
          { name: '標準偏差を入力（任意）', text: '成績表に標準偏差があれば入力。なければ目安値（15）で概算されます。' },
          { name: '教科別・合計の偏差値を確認', text: '教科別の偏差値と5教科合計の偏差値が表示されます。最も低い教科が伸びしろの大きい教科です。' },
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
            <span className="text-slate-900">教科別の偏差値</span>
          </nav>

          {/* Header: パンくず → h1 → メタ行（運営者・更新日・計算式）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">教科別の偏差値を計算する</h1>
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <li className="flex flex-wrap items-center gap-2">
                監修・運営：ないしんパンダ
                <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  2026年度受験生
                </span>
              </li>
              <li>最終更新：2026年6月12日</li>
              <li>計算式：偏差値＝50＋10×(点数−平均)÷標準偏差</li>
            </ul>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              国語・数学・英語・理科・社会、<strong>教科ごとの点数と平均点</strong>を入れるだけで教科別の偏差値を算出。
              <strong>5教科合計</strong>も<strong>3教科（英数国）</strong>もこの1ツールで分かります。
            </p>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              偏差値は数式で確定する指標です。当ツールは標準的な偏差値の定義（平均50・標準偏差10）に厳密に従って算出します。
            </p>
          </header>

          {/* Calculator（教科別偏差値を同時算出） */}
          <HensachiCalculator />

          {/* 保護者リード */}
          <div className="mt-6">
            <ParentLeadCTA
              placement="hensachi"
              heading="苦手教科、どう伸ばす？保護者の方へ"
              body="教科別の偏差値が分かると「どこから対策するか」が見えてきます。お子さまに必要な教科の伸ばし方を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
              affiliateId="atama-text"
              ctaText="無料で資料・体験を申し込む"
              note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
            />
          </div>

          {/* 堀A */}
          <div className="mt-6">
            <SaveResultCTA source="hensachi-kyoka-betsu" />
          </div>

          {/* 教科別・点を取るコツ */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">教科別・偏差値を上げるワンポイント</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              偏差値は「平均点との差」で決まります。<strong>一番偏差値が低い教科</strong>から手をつけるのが、合計偏差値を最も効率よく上げる近道です。
            </p>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {SUBJECTS.map((s) => (
                <Link
                  key={s.key}
                  href={`/hensachi/kyoka-betsu/${s.key}`}
                  className="group block py-4"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[17px] font-bold text-slate-900">{s.label}</span>
                    {s.in3 && <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">3教科</span>}
                  </div>
                  <p className="text-base leading-[1.8] text-slate-900">{s.tip}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 group-hover:text-brand-800">
                    {s.label}の上げ方を詳しく見る
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 5教科 vs 3教科 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">5教科の偏差値と3教科の偏差値、どっちを見る？</h2>
            <div className="grid divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="py-4 md:pr-5">
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">5教科（国数英理社）</h3>
                <p className="text-base leading-[1.8] text-slate-900">
                  <strong>公立高校受験</strong>は5教科の学力検査が基本。公立志望なら5教科の偏差値を主軸に見ます。理科・社会は短期間でも伸びやすく、合計偏差値を底上げしやすい教科です。
                </p>
              </div>
              <div className="py-4 md:pl-5">
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">3教科（英数国）</h3>
                <p className="text-base leading-[1.8] text-slate-900">
                  <strong>私立高校の一般入試</strong>は英語・数学・国語の3教科が主流。私立を併願するなら3教科の偏差値も把握しておくと、併願校選びの目安になります。
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              偏差値だけで合否は決まりません。<Link href="/" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">内申点 計算サイト</Link>で内申点も確認し、
              <Link href="/hensachi/shiboukou" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">偏差値→志望校レンジ逆引き</Link>で届く高校レベルもチェックしましょう。
            </p>
          </section>

          {/* クラスタナビ */}
          <div className="mt-10">
            <HensachiClusterNav current="kyoka-betsu" />
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
