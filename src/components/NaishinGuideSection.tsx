'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, HelpCircle, Calculator, GraduationCap, ChevronRight, MapPin } from 'lucide-react';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { getPrefectureByCode } from '@/lib/prefectures';

const FAQ_ITEMS = [
  {
    question: '内申点とは何ですか？',
    answer: '内申点（調査書点）とは、中学校での各教科の成績を点数化したものです。通知表の5段階評価をもとに計算され、高校入試の合否判定に使用されます。一般的には9教科×5点＝45点満点で計算されますが、都道府県や高校によって計算方法が異なります。'
  },
  {
    question: '内申点はいつの成績が使われますか？',
    answer: '都道府県によって異なります。東京都は中学3年生の成績のみ、神奈川県は中学2年と3年の成績、埼玉県は中学1年から3年までの成績が使われます。お住まいの地域の教育委員会のホームページで確認することをおすすめします。'
  },
  {
    question: '内申点を上げるにはどうすればいいですか？',
    answer: '内申点を上げるポイントは3つあります。①定期テストで高得点を取る、②提出物を期限内に丁寧に仕上げる、③授業に積極的に参加する。特に「主体的に学習に取り組む態度」の評価は、テストの点数に関係なく改善できる部分です。'
  },
  {
    question: '実技4教科の内申点は重要ですか？',
    answer: '非常に重要です。東京都の場合、実技4教科（音楽・美術・保健体育・技術家庭）の評定は2倍で計算されます。つまり実技教科で1点上げると、換算後は2点分の価値があります。実技教科を軽視せず、しっかり取り組みましょう。'
  }
];

const GUIDE_CARDS = [
  {
    icon: Calculator,
    title: '内申点の計算方法',
    summary: '9教科の5段階評価を合計して算出します。都道府県により倍率や対象学年が異なります。',
    detail: '例えば東京都では、5教科（国語・数学・英語・理科・社会）はそのまま、実技4教科（音楽・美術・保体・技家）は2倍して計算する「換算内申」方式を採用しており、5教科×5点＋4教科×5点×2＝65点満点となります。神奈川県は中2・中3の成績を使用し135点満点、大阪府は450点満点など、地域により大きく異なります。'
  },
  {
    icon: GraduationCap,
    title: '高校受験での活用',
    summary: '入試の合否は「内申点」と「当日の学力検査」の合計で決まります。',
    detail: '多くの高校では、内申点と当日の試験結果を一定の比率で合算して合否を決定します。例えば東京都立高校では、内申点300点＋学力検査700点＝1000点満点（7:3換算）で判定されます。さらに、ESAT-J（英語スピーキングテスト）の結果20点を加えて1020点満点として扱う説明も一般的です。内申点が高ければ、当日の試験で多少失敗しても挽回できる可能性があります。'
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
              {/* Hidden content for SEO - always in HTML */}
              <div className={`mt-3 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
                  {card.detail}
                </p>
              </div>
              {/* Noscript fallback - shows detail directly when JS is off */}
              <noscript>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
                  {card.detail}
                </p>
              </noscript>
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
                <p>A. {item.answer}</p>
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
