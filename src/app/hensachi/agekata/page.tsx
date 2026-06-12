import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, TrendingUp, Calculator, Eye, Rocket, User, ShieldCheck, Calendar, FileCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { buildPercentileTable } from '@/lib/hensachi';

// 「見方」セクションの上位%・順位表（数式で算出。引用される一次データ）
const SEE_ROWS = buildPercentileTable([70, 65, 60, 55, 50, 45, 40]);

const RAISE_STEPS = [
  {
    title: '① 一番偏差値が低い教科を特定する',
    body: '偏差値40の教科を50に上げるのは、偏差値60を65に上げるよりずっと簡単です。伸びしろが最大の教科に資源を集中するのが、合計偏差値を上げる最短ルート。まずは教科別の偏差値を出して、最も低い教科を見つけましょう。',
  },
  {
    title: '② 基本問題を「取りこぼしゼロ」にする',
    body: '偏差値50前後までは、難問より「みんなが取れる基本問題のミスをなくす」方が効きます。計算ミス・ケアレスミス・用語の取りこぼしを潰すだけで、偏差値は数ポイント動きます。',
  },
  {
    title: '③ 暗記分野（理科・社会・英単語）を固める',
    body: '直前でも伸びるのが暗記分野。理科の生物・地学、社会の歴史・地理、英単語は、覚えた分だけ点になります。短期間で偏差値を上げたいなら、まずここ。',
  },
  {
    title: '④ 同じ模試を複数回受けて「ブレ」を見る',
    body: '偏差値は1回の結果だと運に左右されます。同じ模試を継続して受け、平均と推移で判断しましょう。上がっているか下がっているかが分かると、対策の手応えが見えます。',
  },
];

const FAQS = [
  {
    question: '偏差値の出し方（計算方法）を教えてください。',
    answer: '偏差値は「偏差値＝50＋10×(自分の点数−平均点)÷標準偏差」で計算します。たとえば平均60点・標準偏差15のテストで80点なら、50＋10×(80−60)÷15＝約63.3です。標準偏差が分からない場合は定期テストなら15前後を目安に。当サイトの偏差値計算ツールに点数と平均点を入れれば自動で算出できます。',
  },
  {
    question: '偏差値は1ヶ月で5上げられますか？',
    answer: '苦手教科の底上げなら可能です。たとえば偏差値40の教科は、基本問題を集中演習することで1ヶ月で50近くまで上げられることがあります。一方、偏差値60以上を1ヶ月で5上げるのは難しめ。伸びしろの大きい（＝偏差値が低い）教科から取り組むのが、短期間で合計偏差値を上げるコツです。',
  },
  {
    question: '偏差値50は良い方ですか？偏差値の見方を教えてください。',
    answer: '偏差値50はちょうど平均（上位50%）です。偏差値55で上位約31%、偏差値60で上位約16%、偏差値65で上位約7%、偏差値70で上位約2%が目安。つまり偏差値50は「平均的」、55〜60で「平均より上」、60以上で「上位層」という見方ができます。',
  },
  {
    question: '勉強しているのに偏差値が上がらないのはなぜ？',
    answer: '偏差値は「自分の点数」だけでなく「周りの点数（平均）」でも決まるため、自分が伸びても周りも伸びていると偏差値は変わりにくいことがあります。また、得意教科をさらに伸ばすより、苦手教科を底上げする方が合計偏差値は動きやすいです。点数は上がっているのに偏差値が変わらない場合は、対策する教科の選び方を見直しましょう。',
  },
];

export const metadata: Metadata = {
  title: '偏差値の出し方・上げ方・見方【中学生】1ヶ月で上げるコツも | My Naishin',
  description: '偏差値の「出し方（計算方法）」「見方（偏差値50は上位何%？）」「上げ方（1ヶ月で上げるコツ）」を中学生向けにまとめて解説。偏差値の計算式、上位%・順位の早見表、苦手教科から効率よく上げる具体策まで。無料の偏差値計算ツール付き・2026年最新版。',
  keywords: ['偏差値 出し方', '偏差値 上げ方', '偏差値 見方', '偏差値 計算 方法', '偏差値 上げる方法', '偏差値 1ヶ月', '偏差値 5上げる', '偏差値 上がらない', '中学生 偏差値 上げ方', '偏差値 求め方'],
  alternates: { canonical: 'https://my-naishin.com/hensachi/agekata' },
  openGraph: {
    title: '偏差値の出し方・上げ方・見方【中学生】1ヶ月で上げるコツも | My Naishin',
    description: '偏差値の計算方法・見方・効率の良い上げ方を中学生向けに解説。無料の偏差値計算ツール付き。',
    url: 'https://my-naishin.com/hensachi/agekata',
  },
};

export default function HensachiAgekataPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
          { name: '偏差値の出し方・上げ方', url: 'https://my-naishin.com/hensachi/agekata' },
        ]}
      />
      <HowToSchema
        id="howto-hensachi-raise"
        name="偏差値を効率よく上げる方法"
        description="苦手教科の特定から基本問題の取りこぼし対策まで、偏差値を効率よく上げる手順。"
        totalTime="PT5M"
        steps={RAISE_STEPS.map((s) => ({ name: s.title.replace(/^[①-④]\s*/, ''), text: s.body }))}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">出し方・上げ方・見方</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">偏差値の出し方・上げ方・見方</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              偏差値の<strong>計算方法（出し方）</strong>、<strong>偏差値50＝上位何%という見方</strong>、そして<strong>効率よく上げるコツ</strong>を中学生向けにまとめました。
            </p>
          </header>

          {/* E-E-A-T カード */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-bold text-slate-800">監修・運営：しゅうまい</div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    2026年度受験生
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  現役中学生エンジニアが、自分と周りの受験経験をもとにまとめた偏差値の使いこなしガイドです。
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />最終更新：2026年6月12日</span>
                  <span className="flex items-center gap-1"><FileCheck className="h-3 w-3" />上位%・順位は正規分布から算出</span>
                </div>
              </div>
            </div>
          </div>

          {/* 出し方 */}
          <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-purple-500" />
              偏差値の出し方（計算方法）
            </h2>
            <div className="rounded-xl bg-slate-900 p-4 text-center text-slate-100">
              <div className="font-mono text-sm md:text-base">偏差値 = 50 + 10 × (自分の点数 − 平均点) ÷ 標準偏差</div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              たとえば平均60点・標準偏差15のテストで80点を取ったなら、<strong>50＋10×(80−60)÷15＝約63.3</strong>。
              標準偏差が分からない場合は、定期テストなら15前後を目安にします。5教科をまとめて計算するなら、当サイトの計算ツールが速くて正確です。
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi" className="group flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-800 transition-all hover:bg-purple-100">
                偏差値を計算する（5教科・無料）
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/hensachi/kyoka-betsu" className="group flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-800 transition-all hover:bg-purple-100">
                教科別に偏差値を出す
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>

          {/* 見方 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 border-l-4 border-indigo-500 pl-3 text-lg font-bold text-slate-800">
              <Eye className="h-5 w-5 text-indigo-500" />
              偏差値の見方（偏差値50は上位何%？）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              偏差値50はちょうど平均（上位50%）。数字が大きいほど上位です。正規分布から計算した、偏差値→上位%・順位の対応は次のとおりです。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border border-indigo-400 px-3 py-2 text-left font-bold">偏差値</th>
                    <th className="border border-indigo-400 px-3 py-2 text-right font-bold">上位</th>
                    <th className="border border-indigo-400 px-3 py-2 text-right font-bold">300人中</th>
                    <th className="border border-indigo-400 px-3 py-2 text-right font-bold">1000人中</th>
                  </tr>
                </thead>
                <tbody>
                  {SEE_ROWS.map((r) => (
                    <tr key={r.h} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold text-slate-800">{r.h}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right text-slate-700">{r.upperPercent.toFixed(1)}%</td>
                      <td className="border border-slate-200 px-3 py-2 text-right text-slate-700">約{r.rank300}位</td>
                      <td className="border border-slate-200 px-3 py-2 text-right text-slate-700">約{r.rank1000}位</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              偏差値→届く高校レベルの目安は<Link href="/hensachi/shiboukou" className="font-bold text-indigo-600 hover:underline">志望校レンジ逆引きツール</Link>で確認できます。
            </p>
          </section>

          {/* 上げ方 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 border-l-4 border-rose-500 pl-3 text-lg font-bold text-slate-800">
              <Rocket className="h-5 w-5 text-rose-500" />
              偏差値の上げ方（効率の良い順番）
            </h2>
            <div className="space-y-3">
              {RAISE_STEPS.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-8">
            <ParentLeadCTA
              heading="偏差値を上げる、いちばん効率の良い方法は？保護者の方へ"
              body="どの教科から、どんな順番で対策すれば偏差値が上がるか——お子さまの状況に合わせた具体策を、AI個別指導の無料体験で確認できます（保護者の方向け・費用はかかりません）。"
              affiliateId="atama-text"
              ctaText="無料で資料・体験を申し込む"
              note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
            />
          </div>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="mb-1 text-sm font-bold text-slate-700">偏差値を上げる学習教材</div>
            <div className="mb-4 text-xs leading-relaxed text-slate-500">
              添削指導で「点を取れる思考力」を鍛える<AffiliateAd id="zkai-text-advanced" hideLabel />（PR）
            </div>
            <div className="hidden md:block"><AffiliateAd id="zkai-banner" auditHide /></div>
            <div className="md:hidden"><AffiliateAd id="sapuri-banner-300" auditHide /></div>
          </section>

          {/* クラスタナビ */}
          <div className="mt-8">
            <HensachiClusterNav current="agekata" />
          </div>

          {/* FAQ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
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
