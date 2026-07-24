import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { KanagawaResultFlow } from '@/components/Kanagawa/KanagawaResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
// (発見: 旧ハードコードはdc4/nyusen/という現在は存在しない別パスを指していた)
const KANAGAWA_SOURCE_URL =
  getPrefectureByCode('kanagawa')?.sourceUrl ?? 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const KANAGAWA_S_VALUE_FAQS = [
  {
    question: 'S値とは何ですか？',
    answer:
      'S値とは、神奈川県公立高校入試の合否判定に使われる総合得点のことです。内申点（135点満点）と学力検査点（500点満点）をそれぞれ100点満点に換算し、志望校ごとに定められた比率（合計10）で合算した1000点満点の指標です。',
  },
  {
    question: 'S1値とS2値の違いは？',
    answer:
      'S1値は内申点＋学力検査の合計（1000点満点）、S2値はS1値に特色検査を加えた数値（特色検査実施校のみ）。横浜翠嵐・湘南など難関校はS2値で合否が決まります。',
  },
  {
    question: '神奈川の内申点はいつの成績？',
    answer:
      '神奈川県の内申点は中2の評定合計＋中3の評定合計×2で計算されます（135点満点）。中3の比重が大きいため、中3の成績アップが内申点全体に効きます。',
  },
  {
    question: '特色検査の比率は？',
    answer:
      '特色検査の比率は学校ごとに最大「5」まで設定されます。難関校（横浜翠嵐・湘南・厚木・柏陽・川和など）で実施され、S2値の合否判定に大きく影響します。',
  },
];

export const metadata: Metadata = {
  title: 'S値とは？神奈川県 自動計算【無料・S1/S2対応】公立高校入試の合否判定 | My Naishin',
  description: 'S値とは、神奈川県公立高校入試の合否判定に使われる内申点＋学力検査の総合得点（1000点満点）のこと。【無料】内申点135点・学力検査500点・志望校比率（4:6/3:7など）・特色検査を入力するだけで、S1値・S2値を瞬時に算出。横浜翠嵐・湘南など主要高校の合格目安にも対応。',
  keywords: ['S値とは', '神奈川県 S値', '神奈川県 s値 自動計算', 'S1値とは', 'S1値', 'S2値', '神奈川 公立高校', '内申点', '神奈川 内申', '横浜翠嵐', '湘南高校'],
  alternates: {
    canonical: 'https://my-naishin.com/kanagawa/s-value',
  },
  openGraph: {
    title: 'S値とは？神奈川県 自動計算【無料・S1/S2対応】公立高校入試の合否判定 | My Naishin',
    description: 'S値とは、内申点＋学力検査を合算した神奈川県公立高校入試の総合得点（1000点満点）。志望校比率に対応した合否判定ツールで瞬時に算出。',
    url: 'https://my-naishin.com/kanagawa/s-value',
  },
};

export default function KanagawaSValuePage() {
  return (
    <>
      <WebApplicationSchema
        name="神奈川県 S値 自動計算 | My Naishin"
        description="神奈川県公立高校入試のS1値・S2値（1000点満点）を瞬時に算出。志望校比率に対応。"
        url="https://my-naishin.com/kanagawa/s-value"
      />
      <DatasetSchema
        name="神奈川県 S値算出方式データ（1000点満点）"
        description="神奈川県公立高校入試のS1値・S2値の算出方式（内申点135点・学力検査500点を志望校が選ぶ比率(4:6〜7:3)で換算し合算する方法）。神奈川県教育委員会の入学者選抜情報に基づくデータ。"
        url="https://my-naishin.com/kanagawa/s-value"
        variableMeasured={['内申点換算値', '学力検査換算値', 'S1値', 'S2値', '志望校比率']}
        keywords={['S値', '神奈川県', '総合得点', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '神奈川県', url: 'https://my-naishin.com/kanagawa' },
          { name: 'S値計算', url: 'https://my-naishin.com/kanagawa/s-value' },
        ]}
      />
      <HowToSchema
        id="howto-kanagawa-s-value"
        name="神奈川県 S値（S1・S2）を計算する方法"
        description="神奈川県公立高校入試の合否判定に使われるS値を、内申点・学力検査点・志望校比率から自動算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '内申点（135点満点）を入力', text: '中2の評定合計＋中3の評定合計×2で算出した内申点（135点満点）を入力します。' },
          { name: '学力検査点（500点満点）を入力', text: '5教科×100点の合計点（500点満点）を入力します。' },
          { name: '志望校の比率を選ぶ', text: '志望校の内申：学力の比率（4:6/3:7/2:8など）をボタンで選択します。' },
          { name: '特色検査点を入力（任意）', text: '難関校で実施される特色検査の点数（最大100点）があれば入力します。S2値が自動算出されます。' },
          { name: 'S値と志望校比較', text: '1000点満点のS1値（S2値）が瞬時に算出され、横浜翠嵐・湘南・柏陽など主要高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={KANAGAWA_S_VALUE_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/kanagawa" className="hover:text-blue-600">神奈川県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">S値計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              神奈川県 S値 自動計算ツール
            </h1>
            <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              S1値・S2値対応・1000点満点・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              神奈川県公立高校入試の合否判定に使われる「S値」を瞬時に算出。<br />
              内申点・学力検査・志望校比率・特色検査の組み合わせを一括で計算できます。
            </p>
          </header>

          {/* S値の仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              神奈川県S値の仕組み
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              神奈川県の公立高校入試は、内申点（135点満点）と学力検査点（500点満点）を志望校ごとに定められた比率で合計したS値（1000点満点）で合否が判定されます。比率は<strong>2:8〜8:2</strong>の範囲で学校ごとに異なります。
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                <div className="text-xs font-bold text-blue-600 mb-1">S1値</div>
                <div className="text-2xl font-black text-blue-700">1000<span className="text-base">点満点</span></div>
                <div className="text-xs text-blue-600 mt-2">内申点＋学力検査の合計</div>
              </div>
              <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
                <div className="text-xs font-bold text-indigo-600 mb-1">S2値</div>
                <div className="text-2xl font-black text-indigo-700">最大1500<span className="text-base">点</span></div>
                <div className="text-xs text-indigo-600 mt-2">S1＋特色検査（最大500点換算）</div>
              </div>
            </div>
          </section>

          {/* Calculator・結果連動（S-1④） */}
          <KanagawaResultFlow />

          {/* S値の計算式 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-blue-500" />
              S値の計算式
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">S1値の計算式</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    S1 = (内申/135 × 100 × 内申比率) + (学力検査/500 × 100 × 学力比率)
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 比率の合計は10。内申比率と学力比率は学校ごとに「4:6」「3:7」「2:8」「5:5」などが設定されます。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">S2値の計算式（特色検査実施校）</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    S2 = S1 + (特色検査の素点 × 特色検査比率)
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 特色検査の比率は最大5（横浜翠嵐・湘南などの最難関校で適用）。
                </p>
              </div>
            </div>
          </section>

          {/* S値 換算早見表（SEO: 神奈川 内申 100点換算 / s値 早見表 / 学力検査 換算） */}
          <section className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-blue-500" />
              S値の換算早見表（手計算用）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              S値は「内申点（135満点）と学力検査（500満点）をそれぞれ<strong>100点満点に換算</strong>し、志望校の比率（合計10）で合算」します。下の早見表で自分の換算値をすぐ確認できます。
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {/* 内申135 → 100換算 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-blue-900">① 内申点（135満点）→ 100点換算</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white text-left">
                        <th className="border border-blue-400 px-3 py-1.5 font-bold">内申（／135）</th>
                        <th className="border border-blue-400 px-3 py-1.5 font-bold text-right">100点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['135', '100.0'], ['125', '92.6'], ['115', '85.2'], ['105', '77.8'],
                        ['95', '70.4'], ['85', '63.0'], ['75', '55.6'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-bold">{raw}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">換算式：内申 ÷ 135 × 100</p>
              </div>
              {/* 学力500 → 100換算 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-indigo-900">② 学力検査（500満点）→ 100点換算</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-600 text-white text-left">
                        <th className="border border-indigo-400 px-3 py-1.5 font-bold">学力（／500）</th>
                        <th className="border border-indigo-400 px-3 py-1.5 font-bold text-right">100点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['500', '100'], ['450', '90'], ['400', '80'], ['350', '70'],
                        ['300', '60'], ['250', '50'], ['200', '40'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-bold">{raw}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">換算式：学力 ÷ 500 × 100</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">S1の計算例（比率4:6の高校）</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                内申115（換算85.2）・学力400点（換算80）・比率<strong>内申4:学力6</strong>の場合：<br />
                S1 ＝ 85.2 × 4 ＋ 80 × 6 ＝ 340.8 ＋ 480 ＝ <strong className="text-blue-700">約821点</strong>（川和の目安S1 830にあと一歩）
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 比率は学校ごとに異なります（合計10）。特色検査実施校はS2値も必要。正確な値は上の計算ツールでご確認ください。
            </p>
          </section>

          {/* 主要校の比率と合格ライン */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              主要神奈川公立高校の比率と合格目安【2026年最新】
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">高校</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-center">比率（内申:学力:特色）</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">S値合格目安</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">横浜翠嵐</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">2:6:2</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">S2 1300+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">75</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">湘南</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">3:5:2</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">S2 1250+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">73</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">柏陽</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">3:5:2</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">S2 1180+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">71</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">厚木</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">3:5:2</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">S2 1150+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">70</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">川和</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">4:6</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">S1 830+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">68</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">光陵</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">4:6</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">S1 780+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">65</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">希望ヶ丘</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">4:6</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">S1 750+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">63</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">小田原</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">4:6</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">S1 740+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">63</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">鎌倉</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">4:6</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">S1 700+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">61</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">市立横浜サイエンスフロンティア</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">3:5:2</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">S2 1100+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">68</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。最新情報は神奈川県教育委員会の公式発表をご確認ください。
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
            heading="神奈川の志望校、S値はあと何点で届きますか？"
            body="S値は内申と当日点の伸ばし方で変わります。お子さまにいま必要な対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. S値とは何ですか？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  S値とは、神奈川県公立高校入試の合否判定に使われる総合得点のことです。内申点（135点満点）と学力検査点（500点満点）をそれぞれ100点満点に換算し、志望校ごとに定められた比率（合計10）で合算した1000点満点の指標です。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. S1値とS2値の違いは？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  S1値は内申点＋学力検査の合計（1000点満点）、S2値はS1値に特色検査を加えた数値（特色検査実施校のみ）。横浜翠嵐・湘南など難関校はS2値で合否が決まります。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 神奈川の内申点はいつの成績？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  神奈川県の内申点は<strong>中2の評定合計＋中3の評定合計×2</strong>で計算されます（135点満点）。中3の比重が大きいため、中3の成績アップが内申点全体に効きます。詳しくは<Link href="/kanagawa/naishin" className="text-blue-600 underline font-bold">神奈川県の内申点計算ツール</Link>もご覧ください。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 特色検査の比率は？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  特色検査の比率は学校ごとに最大「5」まで設定されます。難関校（横浜翠嵐・湘南・厚木・柏陽・川和など）で実施され、S2値の合否判定に大きく影響します。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                本ツールの計算結果は神奈川県教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href={KANAGAWA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">神奈川県教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/kanagawa/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">神奈川県の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/kanagawa" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">神奈川県の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=kanagawa" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/blog/kanagawa-naishin-calculation-guide" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">神奈川県の内申点ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
