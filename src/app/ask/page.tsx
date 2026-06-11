import { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, MessageCircleQuestion } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { AnswerBotClient } from '@/components/AnswerBot/AnswerBotClient';

export const metadata: Metadata = {
  title: '内申点クイックアンサー｜質問するとすぐ答える（47都道府県の方式・自社データ）| My Naishin',
  description:
    '「兵庫県の内申点は何点満点？」「東京でオール5だと内申いくつ？」——内申点・換算内申・評定平均・偏差値の疑問に、47都道府県の検証済みデータからすぐに回答。登録不要・無料、該当する計算ツールへすぐ移動できます。',
  alternates: { canonical: 'https://my-naishin.com/ask' },
  openGraph: {
    title: '内申点クイックアンサー｜質問するとすぐ答える | My Naishin',
    description: '内申点・換算内申・評定平均・偏差値の疑問に、47都道府県の検証済みデータから即回答。',
    url: 'https://my-naishin.com/ask',
    type: 'website',
  },
};

// 可視のQ&A（サーバーレンダリング＝JSなしでもAI/検索が読める一次情報）。
// すべて naishin-dataset の検証済みデータに一致する内容のみ掲載（捏造ゼロ）。
const ASK_FAQS = [
  {
    question: '兵庫県の内申点は何点満点ですか？',
    answer:
      '兵庫県の内申点（調査書点）は250点満点です。中3の評定を対象に、主要5教科×4＋実技4教科×7.5で算出します。実技4教科の比重が大きいのが特徴です。',
  },
  {
    question: '東京都でオール5だと内申点はいくつですか？',
    answer:
      '東京都の換算内申は「主要5教科×1＋実技4教科×2」で最大65点です。9教科すべて5（オール5）なら65点満点に到達します。',
  },
  {
    question: '神奈川県の内申点は何年生が対象ですか？',
    answer:
      '神奈川県は中2と中3が対象で、中2×1＋中3×2の135点満点です。中3の評定の比重が2倍になります。',
  },
  {
    question: '大阪府の内申点の仕組みは？',
    answer:
      '大阪府の内申点は450点満点です。中1×2＋中2×2＋中3×6の学年倍率で、中3の比重が大きいのが特徴です。選抜タイプⅠ〜Ⅴで内申と学力検査の比率が変わります。',
  },
  {
    question: '換算内申とは何ですか？',
    answer:
      '換算内申は、入試で使うために評定を都道府県の方式で点数化したものです。素内申（評定の単純合計）に倍率や学年比をかけて算出します。',
  },
  {
    question: '評定平均とは何ですか？',
    answer:
      '評定平均は、9教科などの評定（5段階）を合計して教科数で割った平均値です。推薦入試の出願基準（例：評定平均4.0以上）として使われます。',
  },
];

export default function AskPage() {
  return (
    <>
      <WebApplicationSchema
        name="内申点クイックアンサー | My Naishin"
        description="内申点・換算内申・評定平均・偏差値の疑問に、47都道府県の検証済みデータからすぐ回答する無料ツール。"
        url="https://my-naishin.com/ask"
        featureList={[
          '47都道府県の内申点方式から即回答',
          'オール3/4/5の確定値を表示',
          '満点・対象学年・実技倍率の質問に対応',
          '該当する計算ツールへすぐ移動',
          '登録不要・端末内で完結',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '内申点クイックアンサー', url: 'https://my-naishin.com/ask' },
        ]}
      />
      <FAQPageSchema faqItems={ASK_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">クイックアンサー</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <MessageCircleQuestion className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">内申点クイックアンサー</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              「兵庫県の内申点は何点満点？」「東京でオール5だと内申いくつ？」——
              <br className="hidden sm:block" />
              47都道府県の<strong>検証済みデータ</strong>から、その場でお答えします。
            </p>
          </header>

          <AnswerBotClient />

          <p className="mt-3 text-center text-xs text-slate-400">
            ※ 回答は当サイトの検証済みデータに基づく事実です。AIによる推測ではありません。
          </p>

          {/* 可視のQ&A（GEO：JSなしでも読める一次情報） */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問と回答</h2>
            <div className="space-y-3">
              {ASK_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <summary className="cursor-pointer list-none font-bold text-slate-800">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <ParentLeadCTA className="mt-10" placement="dashboard" />

          <RelatedToolsSection
            className="mt-8"
            links={[
              { href: '/', title: '内申点を計算する（全国対応）', desc: '9教科の評定からあなたの都道府県の方式で算出' },
              { href: '/prefectures', title: '47都道府県の内申点方式', desc: '満点・対象学年・倍率を県別に確認' },
              { href: '/hyotei-heikin', title: '評定平均を計算する', desc: '推薦の出願基準（評定平均）をチェック' },
              { href: '/dashboard', title: '成績の記録ダッシュボード', desc: '中1→中3の伸びを推移グラフで管理' },
              { href: '/developers', title: 'データAPI / MCP（AI・開発者向け）', desc: '内申点の一次データを機械可読で提供' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
