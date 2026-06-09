import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const AICHI_FAQS = [
  {
    question: '愛知県の内申点（評定得点）は何点満点？',
    answer:
      '愛知県公立高校入試の内申点は、中3の9教科の評定合計（最大45）を2倍した「評定得点」で、最大90点満点です。中3の成績のみが対象です。',
  },
  {
    question: '愛知県の当日点（学力検査）は何点満点？',
    answer:
      '学力検査は国語・数学・社会・理科・英語の5教科で、各教科22点・合計110点満点です（令和5年度入試以降のマークシート方式）。全日制単位制高校では、得点の高い3教科を2倍にする傾斜配点を行う場合があります。',
  },
  {
    question: '愛知県の評価方法Ⅰ〜Ⅴとは？',
    answer:
      '校内順位を決めるとき、内申点（評定得点）と当日点（学力検査）のどちらを重視するかを、各高校が5つの方法（Ⅰ〜Ⅴ）から選びます。Ⅰは等倍、Ⅱ・Ⅳは内申重視、Ⅲ・Ⅴは当日点重視です。志望校がどの方法かで、必要な得点配分が変わります。',
  },
  {
    question: '愛知県は内申と当日点どちらが重要？',
    answer:
      '志望校が選ぶ評価方法によります。評価方法Ⅳ（内申×2）の高校は内申点が重く、評価方法Ⅴ（当日点×2）の高校は当日点が重くなります。難関校では当日点を重視する評価方法Ⅲ・Ⅴを採用する学校が多い傾向です。志望校の評価方法を必ず確認しましょう。',
  },
];

export const metadata: Metadata = {
  title: '愛知県公立高校 総合得点 計算【評価方法Ⅰ〜Ⅴ・内申90+当日110】 | My Naishin',
  description:
    '愛知県公立高校入試の総合得点（校内順位）の計算方法を解説。内申点（評定得点・最大90点）＋当日点（学力検査・110点）を、志望校の評価方法Ⅰ〜Ⅴでどう重み付けするかを早見表で確認。評定合計→評定得点の換算表・計算例つき。2026年度入試対応。',
  keywords: ['愛知県 公立高校 内申点 当日点 計算', '愛知県 評価方法', '愛知 内申点 計算方法', '愛知県 校内順位', '愛知 当日点 計算', '愛知 評定得点', '愛知県 公立高校 総合得点', '評価方法 1 2 3 4 5 愛知'],
  alternates: {
    canonical: 'https://my-naishin.com/aichi/total-score',
  },
  openGraph: {
    title: '愛知県公立高校 総合得点 計算【評価方法Ⅰ〜Ⅴ・内申90+当日110】 | My Naishin',
    description: '愛知県公立高校入試の内申点（90点）＋当日点（110点）と評価方法Ⅰ〜Ⅴの計算を早見表で解説。',
    url: 'https://my-naishin.com/aichi/total-score',
  },
};

// 評価方法ごとの満点は「式」から再計算した確定値（内申最大90・当日最大110）。
// Ⅰ:90+110=200 / Ⅱ:135+110=245 / Ⅲ:90+165=255 / Ⅳ:180+110=290 / Ⅴ:90+220=310
const HYOKA_METHODS = [
  { type: 'Ⅰ', formula: '評定得点 ＋ 学力検査', naishinMax: 90, gakuryokuMax: 110, total: 200, note: '内申と当日点を等倍。標準的な配点。' },
  { type: 'Ⅱ', formula: '評定得点 ×1.5 ＋ 学力検査', naishinMax: 135, gakuryokuMax: 110, total: 245, note: 'やや内申重視。' },
  { type: 'Ⅲ', formula: '評定得点 ＋ 学力検査 ×1.5', naishinMax: 90, gakuryokuMax: 165, total: 255, note: 'やや当日点重視。進学校に多い。' },
  { type: 'Ⅳ', formula: '評定得点 ×2 ＋ 学力検査', naishinMax: 180, gakuryokuMax: 110, total: 290, note: '内申を最も重視。' },
  { type: 'Ⅴ', formula: '評定得点 ＋ 学力検査 ×2', naishinMax: 90, gakuryokuMax: 220, total: 310, note: '当日点を最も重視。難関校に多い。' },
];

export default function AichiTotalScorePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '愛知県', url: 'https://my-naishin.com/aichi' },
          { name: '総合得点・評価方法計算', url: 'https://my-naishin.com/aichi/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-aichi-total-score"
        name="愛知県公立高校 総合得点（校内順位）を計算する方法"
        description="愛知県公立高校入試の校内順位を、内申点（評定得点）・学力検査点・志望校の評価方法Ⅰ〜Ⅴから算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '評定得点（90点満点）を求める', text: '中3の9教科の評定合計（最大45）を2倍して評定得点（最大90点）を算出します。' },
          { name: '学力検査点（110点満点）を求める', text: '5教科×22点の合計（最大110点）を算出します。' },
          { name: '志望校の評価方法を確認', text: '志望校が採用する評価方法Ⅰ〜Ⅴを確認します。内申重視か当日点重視かが変わります。' },
          { name: '評価方法の式で総合得点を計算', text: '例：評価方法Ⅲなら「評定得点 ＋ 学力検査×1.5」。校内順位はこの合計が高い順に決まります。' },
        ]}
      />
      <FAQPageSchema faqItems={AICHI_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/aichi" className="hover:text-blue-600">愛知県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合得点・評価方法計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              愛知県公立高校 総合得点・評価方法 計算
            </h1>
            <div className="mt-2 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
              内申90点＋当日110点・評価方法Ⅰ〜Ⅴ・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              愛知県公立高校入試の校内順位は、内申点（評定得点・最大90点）と当日点（学力検査・110点）を<br />
              志望校が選ぶ「評価方法Ⅰ〜Ⅴ」で重み付けして決まります。仕組みと早見表をまとめました。
            </p>
          </header>

          {/* 仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-rose-500" />
              愛知県の合否は「内申点＋当日点」を評価方法で重み付け
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-4 text-center">
                <div className="text-xs font-bold text-rose-600 mb-1">内申点（評定得点）</div>
                <div className="text-3xl font-black text-rose-700">90<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-rose-600 mt-1">中3の9教科評定合計(最大45)×2</div>
              </div>
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <div className="text-xs font-bold text-blue-600 mb-1">当日点（学力検査）</div>
                <div className="text-3xl font-black text-blue-700">110<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-blue-600 mt-1">5教科 × 22点</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              愛知県の特徴は、内申と当日点の比重を志望校ごとに<strong>「評価方法Ⅰ〜Ⅴ」</strong>の5パターンから選ぶ点です。同じ得点でも、志望校がどの評価方法かによって校内順位が変わります。
            </p>
          </section>

          {/* 評定得点 早見表 */}
          <section className="mb-8 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-rose-500" />
              評定合計 → 評定得点（90点満点）換算早見表
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              内申点（評定得点）は<strong>中3の9教科の評定合計を2倍</strong>するだけ。下の早見表で自分の評定得点をすぐ確認できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rose-600 text-white text-left">
                    <th className="border border-rose-400 px-3 py-2 font-bold">9教科の評定合計（／45）</th>
                    <th className="border border-rose-400 px-3 py-2 font-bold text-right">評定得点（×2・／90）</th>
                    <th className="border border-rose-400 px-3 py-2 font-bold">目安</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {[
                    ['45', '90', 'オール5'],
                    ['40', '80', '5と4が中心'],
                    ['36', '72', 'オール4'],
                    ['32', '64', '4と3が中心'],
                    ['27', '54', 'オール3'],
                    ['23', '46', '3と2が中心'],
                    ['18', '36', 'オール2'],
                  ].map(([sum, score, note]) => (
                    <tr key={sum} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold">{sum}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right font-bold">{score}</td>
                      <td className="border border-slate-200 px-3 py-2 text-xs">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 評定は中3のみが対象。9教科の評定を入れて合計を出すなら<Link href="/aichi/naishin" className="text-rose-600 underline font-bold">愛知県の内申点計算ツール</Link>が便利です。
            </p>
          </section>

          {/* 結果保存・名簿化（堀A） */}
          <SaveResultCTA
            source="prefecture"
            prefectureCode="aichi"
            prefectureName="愛知県"
            className="mb-8"
            heading="愛知の評価方法別「あと何点」を、忘れないうちに受け取りませんか？"
            body="内申・当日点の伸ばし方、旭丘・明和など志望校の評価方法と最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* 評価方法Ⅰ〜Ⅴ 早見表 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              評価方法Ⅰ〜Ⅴ 早見表（計算式・満点・特徴）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              校内順位は、志望校が選んだ評価方法の式で出した合計点が高い順に決まります。内申（最大90）と当日点（最大110）をどう重み付けするかで、満点も変わります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-700 text-white text-left">
                    <th className="border border-slate-500 px-3 py-2 font-bold">評価方法</th>
                    <th className="border border-slate-500 px-3 py-2 font-bold">計算式</th>
                    <th className="border border-slate-500 px-3 py-2 font-bold text-right">満点</th>
                    <th className="border border-slate-500 px-3 py-2 font-bold">特徴</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {HYOKA_METHODS.map((m) => (
                    <tr key={m.type} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold text-rose-700">{m.type}</td>
                      <td className="border border-slate-200 px-3 py-2 font-mono text-xs">{m.formula}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right font-bold">{m.total}</td>
                      <td className="border border-slate-200 px-3 py-2 text-xs">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 満点＝内申(最大90)・当日(最大110)を各式に当てはめた理論上の最大値。Ⅱ＝135+110、Ⅲ＝90+165、Ⅳ＝180+110、Ⅴ＝90+220。
            </p>
          </section>

          {/* 計算例 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-rose-500" />
              総合得点の計算例
            </h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <h3 className="font-bold text-rose-900 mb-1">例：評定合計38・当日点95点</h3>
                <ul className="text-rose-900 text-xs space-y-1 ml-4 list-disc">
                  <li>評定得点 ＝ 38 × 2 ＝ <strong>76点</strong></li>
                  <li>評価方法Ⅰ（等倍）：76 ＋ 95 ＝ <strong>171点</strong>（／200）</li>
                  <li>評価方法Ⅲ（当日×1.5）：76 ＋ 95×1.5 ＝ 76 ＋ 142.5 ＝ <strong>218.5点</strong>（／255）</li>
                  <li>評価方法Ⅳ（内申×2）：76×2 ＋ 95 ＝ 152 ＋ 95 ＝ <strong>247点</strong>（／290）</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                同じ生徒でも、志望校の評価方法によって有利・不利が変わります。当日点が強い人は評価方法Ⅲ・Ⅴの高校、内申が強い人は評価方法Ⅱ・Ⅳの高校が相対的に有利になりやすいです。
              </p>
            </div>
          </section>

          {/* アフィリエイト */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              目標点まであと一歩のあなたへ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              愛知県公立高校の対策には<AffiliateAd id="zkai-text-middle" hideLabel auditHide />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客） */}
          <ParentLeadCTA
            className="mb-8"
            heading="愛知の志望校、評価方法に合った対策ができていますか？"
            body="評価方法Ⅰ〜Ⅴで必要な得点配分は変わります。お子さまに合った対策を、まずは無料の資料で確認できます。請求は数分・費用はかかりません。"
          />

          {/* よくある質問 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {AICHI_FAQS.map((faq, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-800 text-sm">Q. {faq.question}</div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意 */}
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                本ページの計算方法は令和5年度入試以降の愛知県公立高校入学者選抜実施要項に基づく解説です。各高校が採用する評価方法・面接の有無・傾斜配点は学校により異なります。最新の情報は<a href="https://www.pref.aichi.jp/soshiki/kotogakko/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">愛知県教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/aichi/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">愛知県の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/aichi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">愛知県の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">5教科の偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=aichi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
