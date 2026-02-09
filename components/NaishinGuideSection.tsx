'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, HelpCircle, Calculator, GraduationCap, ChevronRight, MapPin } from 'lucide-react';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { getPrefectureByCode } from '@/lib/prefectures';

const FAQ_ITEMS = [
  {
    question: '内申点とは何ですか？',
    answer: '内申点（調査書点）とは、中学校での各教科の成績を点数化したものです。通知表の5段階評価をもとに計算され、高校入試の合否判定に使用されます。計算方法は地域・方式で大きく異なり、満点も45点〜450点以上まで様々です。詳しくは<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">東京都教育委員会</a>や<a href="https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">神奈川県教育委員会</a>の公式要綱でご確認ください。'
  },
  {
    question: '内申点はいつの成績が使われますか？',
    answer: '対象学年は地域・方式で比率が大きく異なります。例：東京都は中学3年生のみ（<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">公式要綱参照</a>）、神奈川県は中学2・3年、埼玉県は中学1〜3年など。お住まいの地域の教育委員会で最新の要綱をご確認ください。'
  },
  {
    question: '内申点を上げるにはどうすればいいですか？',
    answer: '内申点を上げるポイントは3つあります。①定期テストで高得点を取る、②提出物を期限内に丁寧に仕上げる、③授業に積極的に参加する。特に「主体的に学習に取り組む態度」の評価は、テストの点数に関係なく改善できる部分です。評価基準は学校によって異なる場合がありますので、在籍校の先生にご確認ください。'
  },
  {
    question: '実技4教科の内申点は重要ですか？',
    answer: '実技4教科の重要性は地域によって大きく異なります。東京都では実技4教科が2倍で計算され（<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">公式要綱第3章</a>）、1点上げると換算後2点分の価値があります。一方、等倍で計算する地域もあります。お住まいの地域の計算方式を確認し、戦略的に取り組みましょう。'
  }
];

const GUIDE_CARDS = [
  {
    icon: Calculator,
    title: '内申点の計算方法',
    summary: '9教科の5段階評価を合計して算出します。地域・方式で比率が大きく異なります。',
    detail: '計算方式は地域によって大きく異なります。例：東京都は実技4教科が2倍の「換算内申」方式（<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">公式要綱参照</a>）、神奈川県は中2・3年の成績を使用、大阪府は450点満点など。満点も45点〜450点以上まで様々です。'
  },
  {
    icon: GraduationCap,
    title: '高校受験での活用',
    summary: '入試の合否は「内申点」と「当日の学力検査」の合計で決まります。',
    detail: '配点比率は地域・高校・入試方式で大きく異なります。例：東京都立高校は内申:学力＝300:700（<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">公式要綱第4章</a>）、神奈川県はS値方式など。志望校の募集要項で必ず確認してください。'
  }
];

export function NaishinGuideSection() {
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);

  return (
    <>
      <FAQPageSchema faqItems={FAQ_ITEMS} />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 p-6 md:p-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">内申点ガイド</h2>
          <p className="text-sm text-slate-500">高校受験に役立つ基礎知識</p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {GUIDE_CARDS.map((card, index) => {
          const Icon = card.icon;
          const isExpanded = expandedCard === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-slate-800">{card.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {card.summary}
              </p>
              {isExpanded && (
                <div className="mt-3 overflow-hidden transition-all duration-300">
                  <p className="border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
                    <span dangerouslySetInnerHTML={{ __html: card.detail }} />
                  </p>
                </div>
              )}
              <button
                onClick={() => setExpandedCard(isExpanded ? null : index)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {isExpanded ? '閉じる' : '詳しく見る'}
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section with native details/summary (SSR-friendly) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-slate-800">よくある質問</h3>
        </div>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl border border-slate-100 bg-slate-50/50 transition-colors open:bg-blue-50/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 [&::-webkit-details-marker]:hidden">
                <span>Q. {item.question}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600">
                <p>A. <span dangerouslySetInnerHTML={{ __html: item.answer }} /></p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Prefecture Links for SEO */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-slate-800">都道府県別の内申点計算</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {[
            'tokyo',
            'kanagawa',
            'osaka',
            'aichi',
            'saitama',
            'chiba',
            'hokkaido',
            'fukuoka',
          ].map((code) => {
            const pref = getPrefectureByCode(code);
            if (!pref) return null;
            return (
              <Link
                key={code}
                href={`/${code}/naishin`}
                className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 p-2 text-center transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <span className="text-sm font-medium text-slate-700">{pref.name}</span>
                <span className="text-xs text-slate-500">{pref.maxScore}点満点</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs text-slate-400">その他の都道府県も対応しています</span>
        </div>
      </div>
    </section>
    </>
  );
}
