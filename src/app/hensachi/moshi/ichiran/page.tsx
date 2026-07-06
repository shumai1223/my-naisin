import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, MapPin, Building2, AlertTriangle, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiClusterNav } from '@/components/Hensachi/HensachiClusterNav';
import { MOCK_EXAMS } from '@/lib/mock-exam-data';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: 'Vもぎと北辰テスト、どちらを受ければいいですか？',
    answer: '志望校がある都道府県によって決まります。VもぎとWもぎは東京都・神奈川県・千葉県の受験生向け、北辰テストは埼玉県、五ツ木模試は大阪・兵庫・京都・奈良・和歌山などの関西エリア、新教研は茨城県の受験生向けです。多くの場合、通っている中学校や塾で「その地域の模試」を案内されます。',
  },
  {
    question: 'VもぎとWもぎの偏差値は同じ意味ですか？',
    answer: 'いいえ、単純には比較できません。偏差値は受験した集団（母集団）の中での位置を表す数値のため、運営会社が違う模試どうしでは母集団が異なり、同じ偏差値でも意味する学力は同じとは限りません。志望校の判定は、同じ模試シリーズを継続して受け、その模試が出す合格判定を参考にするのが基本です。',
  },
  {
    question: '模試ごとの偏差値の換算表はありますか？',
    answer: '当サイトでは公開しません。各模試の運営会社は模試間の数値換算表を公式には公表しておらず、非公式な換算表は根拠が不確かなことが多いためです。模試を変える場合は、しばらく新しい模試を受け続けて自分の推移で判断するのが確実です。',
  },
  {
    question: '模試は全国模試と地域模試、どちらを受けるべきですか？',
    answer: '公立高校受験が中心なら、志望校がある地域の模試（Vもぎ・北辰テストなど）を受けるのが基本です。地域模試は都道府県ごとの入試傾向に合わせて作られており、その地域の受験者層の中での位置が分かります。全国模試は私立難関校の対策や、全国的な立ち位置を知りたい場合に活用されます。',
  },
];

export const metadata: Metadata = {
  title: '主要な地域模試ガイド【Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研】| My Naishin',
  description: 'Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研など、地域の高校受験模試の運営会社・対象地域・特徴を一覧で解説。模試どうしの偏差値の比べ方、換算表が無い理由まで。無料の偏差値計算ツール付き。',
  keywords: ['Vもぎ 偏差値', 'Wもぎ 偏差値', '北辰テスト 偏差値', '五ツ木模試 偏差値', '新教研 偏差値', 'Vもぎ Wもぎ 違い', '模試 換算表'],
  alternates: { canonical: `${SITE_URL}/hensachi/moshi/ichiran` },
  openGraph: {
    title: '主要な地域模試ガイド【Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研】| My Naishin',
    description: '地域模試の運営会社・対象地域・特徴を一覧で解説。模試どうしの比べ方まで。',
    url: `${SITE_URL}/hensachi/moshi/ichiran`,
    type: 'article',
  },
};

export default function MockExamIchiranPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '偏差値計算', url: `${SITE_URL}/hensachi` },
          { name: '模試の偏差値の見方', url: `${SITE_URL}/hensachi/moshi` },
          { name: '主要な地域模試ガイド', url: `${SITE_URL}/hensachi/moshi/ichiran` },
        ]}
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
            <Link href="/hensachi/moshi" className="hover:text-purple-600">模試の偏差値の見方</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">主要な地域模試ガイド</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <MapPin className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">主要な地域模試ガイド</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校受験では、志望校がある<strong>都道府県ごとに主流の模試</strong>が異なります。
              Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研の運営会社・対象地域・特徴を整理しました。
            </p>
          </header>

          {/* 模試一覧 */}
          <section className="space-y-4">
            {MOCK_EXAMS.map((exam) => (
              <div key={exam.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{exam.name}</h2>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 ring-1 ring-purple-100">
                    {exam.regions.join('・')}
                  </span>
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />運営：{exam.operator}</span>
                  <span>対象：{exam.grade}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{exam.summary}</p>
              </div>
            ))}
          </section>

          {/* 換算の考え方 */}
          <section className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              模試どうしの偏差値、どう比べればいい？
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              偏差値は「その模試を受けた集団（母集団）の中での位置」を表す数値です。運営会社が異なれば受験者層（母集団）も異なるため、
              <strong>「Vもぎで偏差値60」と「北辰テストで偏差値60」が同じ学力を意味するとは限りません</strong>。
            </p>
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              各社は模試間の数値換算表を公式には公表していません。ネット上に非公式な換算表が出回っていることがありますが、
              根拠が不確かなものも多いため、当サイトでは換算表を作成・掲載しません。
            </p>
            <div className="rounded-xl bg-white p-4">
              <div className="mb-1 text-sm font-bold text-slate-800">正確に立ち位置を知るには</div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-slate-600">
                <li>・志望校がある地域の模試を<strong>継続して</strong>受ける（同じ模試内の推移が最も正確）</li>
                <li>・模試を乗り換えた直後は、偏差値の変動を「学力の変化」と早合点しない</li>
                <li>・志望校の合否判定は、その模試が出す<strong>合格判定（A〜E判定など）</strong>も併せて確認する</li>
              </ul>
            </div>
          </section>

          {/* 内部リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi/moshi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                模試の偏差値の見方（母集団・推移の解説）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50/50">
                偏差値を計算する（無料）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

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

          {/* クラスタナビ */}
          <div className="mt-8">
            <HensachiClusterNav current="moshi" />
          </div>
        </div>
      </div>
    </>
  );
}
