import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Undo2, AlertTriangle, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import {
  buildHensachiScoreLookupTable,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE,
  GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV,
} from '@/lib/hensachi';

const FAQ_HENSACHI_VALUES = [40, 45, 50, 55, 60, 65, 70];

export const metadata: Metadata = {
  title: '偏差値ごとの目安点数 早見表【5教科500点満点】| My Naishin',
  description:
    '「偏差値40は5教科何点？」など、偏差値ごとの目安点数を500点満点（平均250・標準偏差75の一般的な仮定）で一覧化。実際のテストで正確な点数を出すには、平均点・標準偏差を入力する逆算計算機を使えます。',
  keywords: ['偏差値 何点', '偏差値40 5教科 何点', '偏差値50 5教科 何点', '偏差値60 5教科 何点', '偏差値 早見表'],
  alternates: { canonical: `${SITE_URL}/hensachi/gyakusan/hayamihyou` },
};

export default function HensachiGyakusanHayamihyouPage() {
  const url = `${SITE_URL}/hensachi/gyakusan/hayamihyou`;
  const table = buildHensachiScoreLookupTable();

  const faqItems = FAQ_HENSACHI_VALUES.map((h) => {
    const row = table.find((r) => r.hensachi === h);
    return {
      question: `偏差値${h}は5教科何点ですか？`,
      answer: `5教科合計${GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点・平均${GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点・標準偏差${GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点という一般的な仮定では、偏差値${h}はおよそ${row?.requiredScore ?? '-'}点が目安です。ただし実際のテストの平均点・標準偏差はテストごとに異なるため、正確な点数を知るには自分のテストの平均点・標準偏差を使って計算する必要があります。`,
    };
  }).concat([
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
          { name: '偏差値ごとの目安点数 早見表', url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-purple-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi" className="hover:text-purple-600">偏差値計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hensachi/gyakusan" className="hover:text-purple-600">逆算計算機</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">早見表</span>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">偏差値ごとの目安点数 早見表</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              「偏差値40は5教科何点？」のような疑問に、一般的な仮定（5教科合計{GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点・平均{GYAKUSAN_HAYAMIHYOU_ASSUMED_AVERAGE}点・標準偏差{GYAKUSAN_HAYAMIHYOU_ASSUMED_STDDEV}点）で答えた早見表です。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                この表の点数は「よくある平均点・標準偏差」を仮定した目安であり、あなたが受けたテストの正確な点数ではありません。実際の平均点・標準偏差はテストごとに異なるため、正確な点数が知りたい場合は下の逆算計算機に自分のテストの数値を入力してください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-purple-500 pl-3 text-lg font-bold text-slate-800">
              偏差値ごとの目安点数（{GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点満点）
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <th scope="col" className="py-2 pr-3 font-bold">偏差値</th>
                    <th scope="col" className="py-2 font-bold">目安点数</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row) => (
                    <tr key={row.hensachi} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5 pr-3 tabular-nums">{row.hensachi}</td>
                      <td className="py-1.5 tabular-nums">
                        {row.requiredScore}点 / {GYAKUSAN_HAYAMIHYOU_ASSUMED_FULL_SCORE}点
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">自分のテストで正確な点数を出す</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              過去問・模試の平均点・標準偏差が分かれば、あなたの状況に合った正確な「あと何点」を計算できます。
            </p>
            <Link
              href="/hensachi/gyakusan"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-purple-700"
            >
              <Undo2 className="h-4 w-4" />
              目標偏差値まであと何点？逆算計算機へ
            </Link>
            <div className="mt-3">
              <Link href="/hensachi" className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700 hover:underline">
                <Calculator className="h-3.5 w-3.5" />
                通常の偏差値計算（点数から算出）はこちら
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
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
