import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ChibaTotalScoreResultFlow } from '@/components/Chiba/ChibaTotalScoreResultFlow';

const CHIBA_FAQS = [
  {
    question: '千葉県の調査書点（内申点）は何点満点？',
    answer:
      '千葉県の調査書の評定は、中1〜中3の9教科を5段階評価した合計で、9教科×5×3学年＝135点満点が素点です。この素点に各高校が定める係数K（0.5〜2）を掛けた値が、実際の合否に使う調査書点になります。',
  },
  {
    question: '千葉県のK値とは何ですか？',
    answer:
      'K値は、調査書の評定（135点満点）の比重を調整するために各高校が定める係数です。K＝0.5なら67.5点満点、K＝1なら135点満点、K＝2なら270点満点になります。千葉・船橋・東葛飾・千葉東・佐倉・小金などの進学校はK＝0.5（学力検査重視）が多く、内申を重視する高校はK＝2に設定します。',
  },
  {
    question: '千葉県公立高校入試の総合得点はどう決まる？',
    answer:
      '総合得点は「学力検査（5教科×100＝500点満点）＋ 調査書点（評定135×K）＋ 調査書のその他（0〜50点）＋ 学校設定検査（10〜150点、専門学科は200点まで）」で構成されます。配点は高校ごとに異なるため、志望校の選抜・評価方法を必ず確認しましょう。',
  },
  {
    question: '選抜方法ⅠとⅡの違いは？',
    answer:
      '多くの高校が2段階選抜を採用しています。選抜方法Ⅰ（定員の約80%）は基本の配点で、選抜方法Ⅱ（残り約20%）では高校ごとに比重を変えて再評価します。同じ得点でも段階によって有利・不利が変わることがあります。',
  },
];

export const metadata: Metadata = {
  title: '千葉県公立高校 調査書点・K値・総合得点 計算【学力500+評定135×K】 | My Naishin',
  description:
    '千葉県公立高校入試の総合得点の計算方法を解説。学力検査500点＋調査書点（評定135×係数K）＋学校設定検査の仕組みを、K値早見表（K=0.5〜2）と計算例で確認。千葉・船橋など進学校のK=0.5も解説。2026年度入試対応。',
  keywords: ['千葉県 公立高校 K値 計算', '千葉県 調査書点 計算', '千葉 内申点 計算方法', '千葉県 K値とは', '千葉 学校設定検査', '千葉県 総合得点 計算', '千葉県 公立高校 合格点', '千葉 選抜方法'],
  alternates: {
    canonical: 'https://my-naishin.com/chiba/total-score',
  },
  openGraph: {
    title: '千葉県公立高校 調査書点・K値・総合得点 計算【学力500+評定135×K】 | My Naishin',
    description: '千葉県公立高校入試の学力検査500点＋調査書点（評定135×K値）＋学校設定検査をK値早見表で解説。',
    url: 'https://my-naishin.com/chiba/total-score',
  },
};

// 調査書点 = 評定合計(最大135) × K。Kは各校が0.5〜2で設定（既定の素点はK=1の135）。
const HYOTEI_ROWS = ['135', '120', '105', '90', '75'];
const K_VALUES: { k: string; mul: number; label: string }[] = [
  { k: '0.5', mul: 0.5, label: '学力重視（進学校に多い）' },
  { k: '1.0', mul: 1.0, label: '標準（素点と同じ）' },
  { k: '1.5', mul: 1.5, label: 'やや内申重視' },
  { k: '2.0', mul: 2.0, label: '内申最重視' },
];

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default function ChibaTotalScorePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '千葉県', url: 'https://my-naishin.com/chiba' },
          { name: '調査書点・K値計算', url: 'https://my-naishin.com/chiba/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-chiba-total-score"
        name="千葉県公立高校 調査書点（K値）・総合得点を計算する方法"
        description="千葉県公立高校入試の総合得点を、学力検査・調査書の評定135×係数K・学校設定検査から算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '評定合計（135点満点）を求める', text: '中1〜中3の9教科の5段階評定をすべて合計します（最大135）。' },
          { name: '志望校のK値を確認', text: '志望校が定める係数K（0.5〜2）を確認します。進学校はK=0.5が多いです。' },
          { name: '調査書点を計算', text: '調査書点 ＝ 評定合計 × K。例：評定108・K=0.5なら54点。' },
          { name: '学力検査・学校設定検査と合算', text: '学力検査（500点）＋調査書点＋その他（0〜50）＋学校設定検査（10〜150）で総合得点を求めます。' },
        ]}
      />
      <FAQPageSchema faqItems={CHIBA_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/chiba" className="hover:text-blue-600">千葉県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">調査書点・K値計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              千葉県公立高校 調査書点・K値・総合得点 計算
            </h1>
            <div className="mt-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
              学力500点＋評定135×K＋学校設定検査・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              千葉県公立高校入試の合否は、学力検査（500点）と調査書点（評定135×係数K）などの合計で決まります。<br />
              わかりにくい「K値」の仕組みを早見表で整理しました。
            </p>
          </header>

          {/* 仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-teal-500" />
              千葉県の総合得点の内訳
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              千葉県公立高校入試の総合得点は、次の要素を合計して決まります。配点は高校ごとに異なります。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                <span className="font-bold text-teal-800">① 学力検査（5教科×100）</span>
                <span className="font-black text-teal-700">500点</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <span className="font-bold text-emerald-800">② 調査書点（評定135 × K値）</span>
                <span className="font-black text-emerald-700">67.5〜270点</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-700">③ 調査書のその他</span>
                <span className="font-black text-slate-600">0〜50点</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-700">④ 学校設定検査（面接・作文・適性検査など）</span>
                <span className="font-black text-slate-600">10〜150点</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              特徴は<strong>「K値」</strong>。調査書の評定（最大135点）に各高校が定めた係数K（0.5〜2）を掛けて、内申の比重を調整します。同じ評定でも、志望校のK値で調査書点が大きく変わります。
            </p>
          </section>

          {/* B-4: 実数入力の総合得点計算機（結果連動の名簿導線つき） */}
          <div className="mb-8">
            <ChibaTotalScoreResultFlow />
          </div>

          {/* K値 早見表 */}
          <section className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-emerald-500" />
              K値 早見表（評定合計 × K ＝ 調査書点）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              評定合計（中1〜中3の9教科、最大135）に志望校のK値を掛けた値が調査書点です。自分の評定合計と志望校のK値が交わるマスを見れば、調査書点がすぐわかります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white text-left">
                    <th className="border border-emerald-400 px-3 py-2 font-bold">評定合計＼K値</th>
                    {K_VALUES.map((kv) => (
                      <th key={kv.k} className="border border-emerald-400 px-3 py-2 font-bold text-right">K={kv.k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {HYOTEI_ROWS.map((sum) => (
                    <tr key={sum} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 font-bold">{sum}</td>
                      {K_VALUES.map((kv) => (
                        <td key={kv.k} className="border border-slate-200 px-3 py-2 text-right">
                          {fmt(Number(sum) * kv.mul)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid gap-1 text-[11px] text-slate-500 sm:grid-cols-2">
              {K_VALUES.map((kv) => (
                <div key={kv.k}>K={kv.k}：{kv.label}</div>
              ))}
            </div>
          </section>

          {/* 計算例 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-teal-500" />
              総合得点の計算例
            </h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                <h3 className="font-bold text-teal-900 mb-1">例：評定合計108・学力検査380点</h3>
                <ul className="text-teal-900 text-xs space-y-1 ml-4 list-disc">
                  <li>進学校（K=0.5）：調査書点 ＝ 108 × 0.5 ＝ 54。総合 ＝ 380 ＋ 54 ＝ <strong>434点</strong>（＋学校設定検査）</li>
                  <li>標準（K=1.0）：調査書点 ＝ 108。総合 ＝ 380 ＋ 108 ＝ <strong>488点</strong>（＋学校設定検査）</li>
                  <li>内申重視（K=2.0）：調査書点 ＝ 216。総合 ＝ 380 ＋ 216 ＝ <strong>596点</strong>（＋学校設定検査）</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                同じ評定・同じ当日点でも、志望校のK値で総合得点の構成が大きく変わります。当日点が強い人はK=0.5の進学校、内申が強い人はK=1.5〜2の高校が相対的に有利になりやすいです。
              </p>
            </div>
          </section>

          {/* 2タッチ目：AI個別指導（下のParentLeadCTAとは別プログラムで多様性確保。旧Z会/サプリ¥1.5-5.4/clickの代替） */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              AIが弱点を自動分析する個別指導
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              <AffiliateAd id="atama-text" hideLabel />（PR）の無料体験で、今の学力に必要な対策を確認できます。
            </div>
            <AffiliateAd id="atama-banner" />
          </section>

          {/* 保護者向けリード（旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mb-8"
            heading="千葉の志望校、K値に合った対策ができていますか？"
            body="志望校のK値で必要な内申・当日点のバランスは変わります。お子さまに合った対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* よくある質問 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {CHIBA_FAQS.map((faq, i) => (
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
                各高校のK値・学校設定検査の配点・選抜方法は学校ごと・年度ごとに異なります。志望校の正確な配点は各高校の発表および<a href="https://www.pref.chiba.lg.jp/kyouiku/shidou/koukou/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">千葉県教育委員会の公式情報</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/chiba/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">千葉県の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/chiba" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">千葉県の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">5教科の偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=chiba" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
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
