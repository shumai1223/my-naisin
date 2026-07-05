import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { OsakaTotalScoreCalculator } from '@/components/Osaka/OsakaTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const OSAKA_TOTAL_SCORE_FAQS = [
  {
    question: '大阪府の選抜タイプとは何ですか？',
    answer:
      '大阪府の公立高校入試では、学力検査と内申点の比率を志望校ごとに5パターン（タイプⅠ〜Ⅴ）から採用します。タイプⅠ（7:3）は学力検査重視、タイプⅤ（3:7）は内申重視。志望校がどのタイプかは事前に確認しましょう。',
  },
  {
    question: '大阪府の内申点はいつの成績？',
    answer:
      '大阪府の内申点は中1〜中3の3年間すべてが対象です。学年倍率は中1：中2：中3 ＝ 2：2：6で、中3の比重が最も大きいです。',
  },
  {
    question: '文理学科と普通科の違いは？',
    answer:
      '文理学科は北野・茨木・天王寺・大手前・四條畷・三国丘・豊中・高津・岸和田・生野の10校に設置され、難関大学進学を目指す高度な学習を行います。タイプⅠ（7:3）採用が多く、学力検査重視の選抜です。',
  },
];

export const metadata: Metadata = {
  title: '大阪府公立高校 タイプⅠ〜Ⅴ計算【無料・総合点シミュレーション】 | My Naishin',
  description: '【無料】大阪府公立高校入試の総合点を自動計算。学力検査450点・内申点450点をタイプⅠ（7:3）〜タイプⅤ（3:7）の選抜タイプ別に瞬時に算出。北野・茨木・天王寺など主要校の合格目安にも対応。2026年度入試対応。',
  keywords: ['大阪府公立高校 タイプ 1 計算方法', '大阪府 公立高校 タイプ', '大阪府 内申点', '大阪府 学力検査', '大阪 総合点', '北野高校', '茨木高校', '大阪 公立 合格点'],
  alternates: {
    canonical: 'https://my-naishin.com/osaka/total-score',
  },
  openGraph: {
    title: '大阪府公立高校 タイプⅠ〜Ⅴ計算【無料・総合点シミュレーション】 | My Naishin',
    description: '大阪府公立高校の総合点をタイプ別に瞬時に算出。志望校の合格目安と比較可能。',
    url: 'https://my-naishin.com/osaka/total-score',
  },
};

export default function OsakaTotalScorePage() {
  return (
    <>
      <WebApplicationSchema
        name="大阪府公立高校 総合点計算 | My Naishin"
        description="大阪府公立高校入試の総合点をタイプⅠ〜Ⅴ別に瞬時に算出。志望校の合格目安と比較。"
        url="https://my-naishin.com/osaka/total-score"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '大阪府', url: 'https://my-naishin.com/osaka' },
          { name: '総合点計算', url: 'https://my-naishin.com/osaka/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-osaka-total-score"
        name="大阪府公立高校 総合点を計算する方法"
        description="大阪府公立高校入試の合否判定に使われる総合点を、内申点・学力検査・選抜タイプから自動算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '内申点（450点満点）を入力', text: '3年間の評定合計から算出された内申点（450点満点）を入力します。' },
          { name: '学力検査点（450点満点）を入力', text: '5教科×90点の合計点（450点満点）を入力します。' },
          { name: '志望校の選抜タイプを選ぶ', text: 'タイプⅠ（7:3 学力最重視）〜タイプⅤ（3:7 内申最重視）から志望校のタイプを選択します。' },
          { name: '総合点と志望校比較', text: '450点満点の総合点が瞬時に算出され、北野・茨木・天王寺など主要府立高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={OSAKA_TOTAL_SCORE_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/osaka" className="hover:text-blue-600">大阪府</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              大阪府公立高校 総合点計算ツール
            </h1>
            <div className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              タイプⅠ〜Ⅴ対応・450点満点・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              大阪府公立高校入試の総合点を瞬時に算出。<br />
              内申点・学力検査・選抜タイプ（タイプⅠ〜Ⅴ）を一括で計算できます。
            </p>
          </header>

          {/* タイプの仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-orange-500" />
              大阪府の選抜タイプⅠ〜Ⅴとは？
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              大阪府公立高校の一般選抜では、学力検査と調査書（内申点）の比率を志望校ごとに「<strong>タイプⅠ〜タイプⅤ</strong>」の5パターンから選択します。学力検査重視の高校はタイプⅠ、内申重視の高校はタイプⅤを採用しています。
            </p>
            <div className="grid gap-2 sm:grid-cols-5">
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                <div className="text-xs font-bold text-red-700">タイプⅠ</div>
                <div className="text-xs text-red-600 mt-1">7:3</div>
                <div className="text-[10px] text-red-500 mt-1">学力最重視</div>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-center">
                <div className="text-xs font-bold text-orange-700">タイプⅡ</div>
                <div className="text-xs text-orange-600 mt-1">6:4</div>
                <div className="text-[10px] text-orange-500 mt-1">学力重視</div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                <div className="text-xs font-bold text-amber-700">タイプⅢ</div>
                <div className="text-xs text-amber-600 mt-1">5:5</div>
                <div className="text-[10px] text-amber-500 mt-1">標準</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                <div className="text-xs font-bold text-emerald-700">タイプⅣ</div>
                <div className="text-xs text-emerald-600 mt-1">4:6</div>
                <div className="text-[10px] text-emerald-500 mt-1">内申重視</div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
                <div className="text-xs font-bold text-blue-700">タイプⅤ</div>
                <div className="text-xs text-blue-600 mt-1">3:7</div>
                <div className="text-[10px] text-blue-500 mt-1">内申最重視</div>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <OsakaTotalScoreCalculator />

          {/* 結果保存・名簿化（堀A） */}
          <ParentCostBridge prefectureName="大阪府" className="mb-6" />

          <SaveResultCTA
            source="prefecture"
            prefectureCode="osaka"
            prefectureName="大阪府"
            className="mt-6"
            heading="この総合点と「あと何点」を、忘れないうちに受け取りませんか？"
            body="総合点アップのコツ・北野や茨木など文理学科の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* 計算式の解説 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-orange-500" />
              総合点の計算式
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">総合点の計算式（タイプ別共通）</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    総合点 ＝ 学力検査点 × 学力比率 ＋ 内申点 × 内申比率
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 学力検査450点・内申点450点をそれぞれの比率（タイプⅠ〜Ⅴ）で重み付けして合算します。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">内申点（450点満点）の計算</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    内申点 ＝ 中1〜中3 各9教科の評定合計 × 学年倍率
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 学年倍率は中1：中2：中3 ＝ 2：2：6（合計10）。中3の比重が最も大きいです。詳細は<Link href="/osaka/naishin" className="text-blue-600 underline">大阪府の内申点計算</Link>もご利用ください。
                </p>
              </div>
            </div>
          </section>

          {/* タイプ別 総合点 早見表（SEO: 大阪 タイプ1 計算方法 / 大阪 総合点 計算 / タイプ別 満点） */}
          <section className="mt-8 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-orange-500" />
              タイプⅠ〜Ⅴ 総合点の早見表（満点内訳）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              大阪府の総合点は<strong>学力検査（450満点）と内申点（450満点）を、志望校のタイプ比率で重み付け</strong>して合算（総合450点満点）します。タイプごとの満点内訳は下のとおり。「学力で何点・内申で何点とれば総合何点か」を素早く把握できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-600 text-white text-left">
                    <th className="border border-orange-400 px-3 py-2 font-bold">タイプ</th>
                    <th className="border border-orange-400 px-3 py-2 font-bold text-center">比率(学力:内申)</th>
                    <th className="border border-orange-400 px-3 py-2 font-bold text-right">学力の満点寄与</th>
                    <th className="border border-orange-400 px-3 py-2 font-bold text-right">内申の満点寄与</th>
                    <th className="border border-orange-400 px-3 py-2 font-bold text-right">総合満点</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {[
                    ['Ⅰ', '7 : 3', '315', '135'],
                    ['Ⅱ', '6 : 4', '270', '180'],
                    ['Ⅲ', '5 : 5', '225', '225'],
                    ['Ⅳ', '4 : 6', '180', '270'],
                    ['Ⅴ', '3 : 7', '135', '315'],
                  ].map(([type, ratio, gakuryoku, naishin]) => (
                    <tr key={type} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold">タイプ{type}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center">{ratio}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">{gakuryoku}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">{naishin}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right font-bold">450</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-xl bg-white border border-orange-100 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">総合点の計算例（タイプⅠ＝7:3 の文理学科）</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                学力360点・内申380点・<strong>タイプⅠ（学力0.7／内申0.3）</strong>の場合：<br />
                総合 ＝ 360 × 0.7 ＋ 380 × 0.3 ＝ 252 ＋ 114 ＝ <strong className="text-orange-700">366点</strong>（大手前の目安370にあと一歩）
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 学力・内申はいずれも450点満点。正確な総合点は上の計算ツールでご確認ください。
            </p>
          </section>

          {/* 主要校のタイプと合格ライン */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              主要大阪府立高校のタイプと合格目安【2026年最新】
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">高校</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-center">タイプ</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">合格目安</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">北野（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">395+</td><td className="border border-slate-200 px-3 py-2 text-right">76</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">茨木（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">385+</td><td className="border border-slate-200 px-3 py-2 text-right">75</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">天王寺（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">385+</td><td className="border border-slate-200 px-3 py-2 text-right">75</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">大手前（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">370+</td><td className="border border-slate-200 px-3 py-2 text-right">73</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">四條畷（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">355+</td><td className="border border-slate-200 px-3 py-2 text-right">72</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">三国丘（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">370+</td><td className="border border-slate-200 px-3 py-2 text-right">73</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">豊中（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">355+</td><td className="border border-slate-200 px-3 py-2 text-right">71</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">高津（文理学科）</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅰ（7:3）</td><td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">350+</td><td className="border border-slate-200 px-3 py-2 text-right">70</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">春日丘</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅱ（6:4）</td><td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">320+</td><td className="border border-slate-200 px-3 py-2 text-right">67</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">寝屋川</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅱ（6:4）</td><td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">315+</td><td className="border border-slate-200 px-3 py-2 text-right">66</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">池田</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅱ（6:4）</td><td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">305+</td><td className="border border-slate-200 px-3 py-2 text-right">65</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-bold">千里</td><td className="border border-slate-200 px-3 py-2 text-center">Ⅱ（6:4）</td><td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">300+</td><td className="border border-slate-200 px-3 py-2 text-right">64</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。最新情報は大阪府教育委員会の公式発表をご確認ください。
            </p>
          </section>

          {/* 2タッチ目：AI個別指導（下のParentLeadCTAとは別プログラムで多様性確保。旧Z会/サプリ¥1.5-5.4/clickの代替） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              AIが弱点を自動分析する個別指導
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              <AffiliateAd id="atama-text" hideLabel />（PR）の無料体験で、今の学力に必要な対策を確認できます。
            </div>
            <AffiliateAd id="atama-banner" />
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客。旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mt-8"
            heading="大阪の志望校、総合点はあと何点で届きますか？"
            body="総合点は学力と内申の伸ばし方で変わります。お子さまにいま必要な対策を、個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="campus-text"
            ctaText="無料体験を申し込む（個別指導キャンパス）"
            note="個別指導キャンパスの無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 大阪府の選抜タイプとは何ですか？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  大阪府の公立高校入試では、学力検査と内申点の比率を志望校ごとに5パターン（タイプⅠ〜Ⅴ）から採用します。タイプⅠ（7:3）は学力検査重視、タイプⅤ（3:7）は内申重視。志望校がどのタイプかは事前に確認しましょう。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 大阪府の内申点はいつの成績？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  大阪府の内申点は<strong>中1〜中3の3年間</strong>すべてが対象です。学年倍率は中1：中2：中3 ＝ 2：2：6で、中3の比重が最も大きいです。詳しくは<Link href="/osaka/naishin" className="text-blue-600 underline font-bold">大阪府の内申点計算ツール</Link>もご覧ください。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 文理学科と普通科の違いは？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  文理学科は北野・茨木・天王寺・大手前・四條畷・三国丘・豊中・高津・岸和田・生野の10校に設置され、難関大学進学を目指す高度な学習を行います。タイプⅠ（7:3）採用が多く、学力検査重視の選抜です。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                本ツールの計算結果は大阪府教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href="https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">大阪府教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/osaka/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">大阪府の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/osaka" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">大阪府の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=osaka" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">評定平均を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
