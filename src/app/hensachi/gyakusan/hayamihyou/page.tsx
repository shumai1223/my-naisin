import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';
import {
  buildHensachiScoreLookupTable,
  calcHensachi,
  roundHensachi,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV,
} from '@/lib/hensachi';
import { AdUnit } from '@/components/AdSlot';

const FAQ_HENSACHI_VALUES = [40, 45, 50, 55, 60, 65, 70];
const FAQ_SCORE_VALUES = [130, 160, 190, 220, 250, 280, 340, 370];

export const metadata: Metadata = {
  title: '偏差値と点数の早見表【5教科500点満点】点数から偏差値もわかる | My Naishin',
  description:
    '「250点は偏差値いくつ？」「偏差値40は5教科何点？」のどちらも一発でわかる早見表（500点満点・平均250・標準偏差75の一般的な仮定）。実際のテストで正確な値を出すには、平均点・標準偏差を入力する逆算計算機を使えます。',
  keywords: [
    '偏差値 何点',
    '偏差値40 5教科 何点',
    '偏差値50 5教科 何点',
    '偏差値60 5教科 何点',
    '偏差値 早見表',
    '250点 偏差値',
    '5教科250点 偏差値',
    '160点 偏差値',
    '点数から偏差値',
  ],
  alternates: { canonical: `${SITE_URL}/hensachi/gyakusan/hayamihyou` },
};

export default function HensachiGyakusanHayamihyouPage() {
  const url = `${SITE_URL}/hensachi/gyakusan/hayamihyou`;
  const table = buildHensachiScoreLookupTable();

  const faqItems = FAQ_SCORE_VALUES.map((score) => {
    const h = calcHensachi(score, GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE, GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV);
    return {
      question: `5教科${score}点は偏差値いくつですか？`,
      answer: `5教科合計${GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点・平均${GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点・標準偏差${GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点という一般的な仮定では、${score}点はおよそ偏差値${h !== null ? roundHensachi(h) : '-'}が目安です。ただし実際のテストの平均点・標準偏差はテストごとに異なるため、正確な偏差値を知るには自分のテストの平均点・標準偏差を使って計算する必要があります。`,
    };
  }).concat(
    FAQ_HENSACHI_VALUES.map((h) => {
      const row = table.find((r) => r.hensachi === h);
      return {
        question: `偏差値${h}は5教科何点ですか？`,
        answer: `5教科合計${GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点・平均${GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点・標準偏差${GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点という一般的な仮定では、偏差値${h}はおよそ${row?.requiredScore ?? '-'}点が目安です。ただし実際のテストの平均点・標準偏差はテストごとに異なるため、正確な点数を知るには自分のテストの平均点・標準偏差を使って計算する必要があります。`,
      };
    })
  ).concat([
    {
      question: 'この早見表の点数はどうやって計算していますか？',
      answer: `偏差値の計算式「偏差値 = 50 + 10 ×（点数 − 平均点）÷ 標準偏差」を点数について逆算しています。この早見表では、5教科合計${GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点のテストで平均点が${GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点（満点の50%）・標準偏差が${GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点（満点の15%）という一般的な仮定を置いて計算しています。`,
    },
    {
      question: 'なぜ正確な点数ではなく「目安」なのですか？',
      answer:
        '平均点・標準偏差はテストの難易度や受験者集団によって毎回変わるため、同じ偏差値でもテストが違えば必要な点数も変わります。実際に受けたテスト（過去問・模試）の平均点・標準偏差が分かる場合は、逆算計算機にその数値を入力すると、あなたの状況に合った正確な点数が分かります。',
    },
  ]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '目標偏差値まであと何点？逆算', url: `${SITE_URL}/hensachi/gyakusan` },
          { name: '偏差値と点数の早見表', url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

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
            <Link href="/hensachi/gyakusan" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">逆算計算機</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">早見表</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">偏差値と点数の早見表</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「250点は偏差値いくつ？」「偏差値40は5教科何点？」のどちらの疑問にも、一般的な仮定（5教科合計{GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点・平均{GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点・標準偏差{GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点）で答えた早見表です。下の表は「偏差値」列でも「目安点数」列でも探せます。
            </p>
          </header>

          <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              注意
            </p>
            <p className="mt-2 text-sm leading-[1.8]">
              この表の点数は「よくある平均点・標準偏差」を仮定した目安であり、あなたが受けたテストの正確な点数ではありません。実際の平均点・標準偏差はテストごとに異なるため、正確な点数が知りたい場合は下の逆算計算機に自分のテストの数値を入力してください。
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              偏差値と点数の対応表（{GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点）
            </h2>
            <div className="max-w-md overflow-x-auto">
              <table className="w-full min-w-[280px] text-base">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 font-bold">偏差値</th>
                    <th scope="col" className="py-2 text-right font-bold">目安点数</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row) => (
                    <tr key={row.hensachi} className="border-b border-slate-200">
                      <td className="py-1.5 pr-3 tabular-nums text-slate-900">{row.hensachi}</td>
                      <td className="py-1.5 text-right tabular-nums text-slate-900">
                        {row.requiredScore}点 / {GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">自分のテストで正確な点数を出す</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              過去問・模試の平均点・標準偏差が分かれば、あなたの状況に合った正確な「あと何点」を計算できます。
            </p>
            <Link
              href="/hensachi/gyakusan"
              className="inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-center text-base font-bold text-white transition-colors text-balance hover:bg-brand-800"
            >
              目標偏差値まであと何点？逆算計算機へ
            </Link>
            <div className="mt-3">
              <Link href="/hensachi" className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                通常の偏差値計算（点数から算出）はこちら
              </Link>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-10">
            <ParentLeadCTA placement="hensachi" />
          </div>

          {/* T-ADS1 AdSense RESULT_BELOW: 答え（対応表）の後・保護者CTAより下。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="RESULT_BELOW" />

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="divide-y divide-slate-200">
              {faqItems.map((f) => (
                <div key={f.question} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
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
