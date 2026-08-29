import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, FileSpreadsheet, ChevronRightSquare, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { KakomonJisaitenCalculator } from '@/components/KakomonJisaiten/KakomonJisaitenCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '過去問自己採点から総合得点を出すツールですか？',
    answer:
      '過去問（学力検査の模擬・過去問演習）で自己採点した5教科の得点と、内申点を入力すると、志望する都道府県が公表している総合得点の算出方式（学力検査点＋内申点の合算方式）に基づいて総合得点を計算します。',
  },
  {
    question: '合格できるかどうか分かりますか？',
    answer:
      'いいえ、分かりません。このツールが出すのは、都道府県が公表している算出方式に基づく「総合得点」の数値のみです。合格ライン（ボーダー）は公表されておらず、学校ごとの倍率や当日の受験者層によっても変動するため、独自に推定して表示することは一切していません。',
  },
  {
    question: 'すべての都道府県で計算できますか？',
    answer:
      '総合得点の算出方式が単純な合算式で表せる都道府県は、このページ内で直接計算できます。学科・高校ごとに比重が異なる等の理由で単純計算できない都道府県は、その仕組みを解説する専用ページ、または専用の計算機ページへご案内します。いずれの場合も、47都道府県すべてで何らかの説明・計算にたどり着けます。',
  },
];

const HOWTO_STEPS = [
  { name: '都道府県を選ぶ', text: '過去問を解いた（受験予定の）都道府県を選択します。' },
  { name: '5教科の自己採点を入力する', text: '過去問・模擬試験で自己採点した5教科の得点を入力します。' },
  { name: '内申点を入力し、総合得点を確認する', text: '内申点（分からない場合は先に内申点計算ページで算出）を入力すると、その県の方式による総合得点が表示されます。' },
];

export const metadata: Metadata = {
  title: '過去問自己採点×内申点で総合得点を計算 | My Naishin',
  description:
    '過去問・模擬試験で自己採点した5教科の得点と内申点から、志望する都道府県が公表している総合得点の算出方式に基づいて総合得点を計算する無料ツール。合否判定・ボーダーラインの推定は一切行いません。',
  keywords: ['過去問 自己採点 総合得点', '内申点 当日点 合算', '総合得点 計算 都道府県'],
  alternates: { canonical: `${SITE_URL}/kakomon-jisaiten` },
  openGraph: {
    title: '過去問自己採点×内申点で総合得点を計算 | My Naishin',
    description: '過去問の自己採点と内申点から、都道府県公表の方式で総合得点を計算。',
    url: `${SITE_URL}/kakomon-jisaiten`,
    type: 'article',
  },
};

export default function KakomonJisaitenPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '過去問自己採点×総合得点', url: `${SITE_URL}/kakomon-jisaiten` },
        ]}
      />
      <WebApplicationSchema
        name="過去問自己採点×総合得点計算ツール"
        description="過去問・模擬試験の自己採点と内申点から、都道府県公表の方式で総合得点を計算する無料ツール"
        url={`${SITE_URL}/kakomon-jisaiten`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-kakomon-jisaiten"
        name="過去問自己採点から総合得点を計算する方法"
        description="都道府県を選び、5教科の自己採点と内申点を入力して総合得点を確認する手順"
        totalTime="PT2M"
        steps={HOWTO_STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-emerald-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">過去問自己採点×総合得点</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              過去問自己採点 × 内申点 → 総合得点
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              過去問を解いた点数と内申点を入力すると、<strong className="text-emerald-700">都道府県が公表している方式</strong>で
              総合得点を計算します。
            </p>
          </header>

          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                <strong>合格ライン（ボーダー）は表示しません。</strong>
                このツールが出すのは都道府県公表の算出方式に基づく総合得点の数値のみです。合否判定・ボーダーラインの推定は一切行いません。
              </p>
            </div>
          </div>

          <div id="calculator-section">
            <KakomonJisaitenCalculator />
          </div>

          {/* 総合得点方式が県ごとに違う理由 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              なぜ都道府県によって計算方法が違うのか
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              内申点と学力検査点（当日点）をどう合算するかは都道府県ごとに教育委員会が独自に定めており、
              全国共通の方式は存在しません。同じ「自己採点300点・内申点35」でも、志望する都道府県によって
              総合得点の出方はまったく異なります。実際に公表されている方式の中でも特徴的な3例を紹介します。
            </p>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">大阪府：学校が選んだ配点タイプで決まる</div>
                学力検査と内申点それぞれに倍率をかけて900点満点にしますが、その倍率は「学力7：内申3」から
                「学力3：内申7」までのタイプⅠ〜Ⅴの5パターンがあり、<strong>どのタイプを採用するかは受験する
                高校・学科ごとに異なります</strong>。同じ大阪府内でも高校によって内申点の重みが大きく変わります。
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">東京都：スピーキングテスト込みで固定比率</div>
                換算内申300点：学力検査700点（うちESAT-J＝英語スピーキングテスト20点分を含む）で
                内申30%：学力70%の比率が全校共通です。実技4教科の内申は2倍換算されるなど、
                内申点の内部計算も独自の方式を採ります。
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">埼玉県：学年比重が学校によって変わる</div>
                内申点の算出自体が「中1:中2:中3＝1:1:2」を基本としつつ、高校によって1:1:3や1:2:3などの
                比重を採用する場合があります。総合得点に占める内申の割合も学力7:内申3から学力6:内申4程度まで
                幅があり、県内で一律の正解値はありません。
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              出典：<Link href="/tokyo/total-score" className="text-emerald-700 underline">東京都の総合得点方式</Link>・
              <Link href="/osaka/total-score" className="text-emerald-700 underline">大阪府の総合得点方式</Link>・
              <Link href="/pref/saitama" className="text-emerald-700 underline">埼玉県の内申点計算</Link>
              （各ページに教育委員会の一次資料リンクあり）
            </p>
          </section>

          {/* 自己採点の注意点 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              自己採点を使う上での注意点
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              自己採点は、記述式の解答（部分点の有無）や配点の非公開部分によって、実際に高等学校側が
              採点する点数と一致しない場合があります。特に国語・数学・英語の記述問題は、模範解答と表現が
              異なるだけで採点が割れることがあります。このツールが示す総合得点は「自己採点どおりに採点され
              た場合」の参考値であり、実際の得点を保証するものではありません。合格ライン（ボーダー）も
              公表されていないため、このツールでは一切表示・推定しません。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/total-score" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                総合得点方式の一覧（47都道府県）
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link href="/hyotei-heikin/gakushu-seiseki" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                大学入試の過去問を使う場合はこちら
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
