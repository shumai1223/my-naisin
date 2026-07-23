import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { NaishinTypeShindanClient } from '@/components/NaishinTypeShindan/NaishinTypeShindanClient';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '内申点タイプ診断とは何ですか？',
    answer:
      '9教科の評定パターン（実技教科と主要教科のバランス・教科間の差）を、お住まいの都道府県の内申点計算方法（検証済みデータ）と組み合わせて4つのタイプに分類する無料診断です。タイプ間に優劣はありません。',
  },
  {
    question: 'タイプによって内申点の有利・不利が決まりますか？',
    answer:
      'いいえ。この診断はどのタイプが「良い」「悪い」かを判定するものではなく、あなたの評定パターンが、お住まいの都道府県の内申点計算方法にどう反映されるかという構造を示すものです。判定結果はどのタイプも対等に扱っています。',
  },
  {
    question: '正確な内申点も計算できますか？',
    answer: 'はい。正確な内申点は内申点計算ツールで、9教科の評定から都道府県ごとの計算方法に基づいて算出できます。',
  },
  {
    question: '診断結果は保存できますか？',
    answer: '診断結果と入力した評定は、LINEまたはメールでの登録により保存・記録できます。登録はいつでも解除可能です。',
  },
];

export const metadata: Metadata = {
  title: '内申点タイプ診断【9教科の評定パターンを4タイプに分類】 | My Naishin',
  description:
    '9教科の評定パターンを、お住まいの都道府県の内申点計算方法（検証済みデータ）と組み合わせて4タイプに無料診断。タイプに優劣はありません。バランス型・実技教科型・主要教科型・教科差型。',
  keywords: ['内申点タイプ診断', '内申点 診断', '評定 診断', '内申点 タイプ'],
  alternates: { canonical: `${SITE_URL}/naishin-type-shindan` },
  openGraph: {
    title: '内申点タイプ診断【9教科の評定パターンを4タイプに分類】',
    description: '9教科の評定パターンを都道府県の内申点計算方法と組み合わせて診断。タイプに優劣はありません。',
    url: `${SITE_URL}/naishin-type-shindan`,
    type: 'website',
  },
};

const RELATED_LINKS = [
  { href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式で正確な内申点を計算。' },
  { href: '/naishin-age-kata', title: '内申点の上げ方', desc: '内申点を上げる具体的な方法を解説。' },
  { href: '/naishin-kakusa', title: '都道府県別 内申点格差レポート', desc: '47都道府県の内申点の重みの違いを比較。' },
  { href: '/hensachi/shindan', title: '偏差値診断（無料）', desc: '点数不要・5つの質問で偏差値の目安を診断。' },
];

export default function NaishinTypeShindanPage() {
  const url = `${SITE_URL}/naishin-type-shindan`;
  return (
    <>
      <WebApplicationSchema
        name="内申点タイプ診断 | My Naishin"
        description="9教科の評定パターンを、都道府県の内申点計算方法（検証済みデータ）と組み合わせて4タイプに分類する無料診断ツール。"
        url={url}
        featureList={[
          '9教科の評定を入力するだけの決定論診断',
          '実技教科/主要教科のバランスから4タイプに分類',
          '都道府県の内申点計算方法との組み合わせで構造を解説',
          'タイプ間に優劣・ランクを設けない設計',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点タイプ診断', url },
        ]}
      />
      <HowToSchema
        id="howto-naishin-type-shindan"
        name="内申点タイプ診断のやり方"
        description="9教科の評定を入力し、都道府県の内申点計算方法と組み合わせてタイプを診断する手順。"
        totalTime="PT2M"
        steps={[
          { name: '都道府県を選ぶ', text: 'お住まいの都道府県を選択します。' },
          { name: '9教科の評定を入力する', text: '国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭の評定を入力します。' },
          { name: 'タイプを診断する', text: 'ボタンを押すと、評定パターンからタイプが表示されます。' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点タイプ診断</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">内申点タイプ診断</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              9教科の評定パターンを、お住まいの都道府県の内申点計算方法と組み合わせて4タイプに分類します。
              <strong>タイプに優劣はありません。</strong>
            </p>
          </header>

          <NaishinTypeShindanClient />

          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {faq.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedToolsSection className="mt-10" links={RELATED_LINKS} />
        </div>
      </div>
    </>
  );
}
