'use client';

import * as React from 'react';

import type { ResultData } from '@/lib/types';

interface MotivationCardProps {
  result: ResultData;
}

const MOTIVATION_MESSAGES: Record<string, {
  title: string;
  message: string;
  subMessage: string;
  tips: string[];
}> = {
  S: {
    title: '最高ランクです',
    message: 'この成績を維持していきましょう。',
    subMessage: '志望校の選択肢を広げやすい成績です',
    tips: [
      '応用問題にどんどん挑戦',
      '後輩に教えることで理解を深める',
      '志望校の過去問を解いてみよう',
      '模試の復習は「原因→対策」まで書き出す',
      '記述問題で論理展開を意識して差をつける',
    ],
  },
  A: {
    title: 'Sランクまであと少しです',
    message: '苦手を克服すると、Sランクに近づけます。',
    subMessage: '得意科目をさらに磨き上げよう',
    tips: [
      '苦手科目を1つ選んで集中対策',
      '得意科目は満点を目指す',
      '計画的な学習スケジュールを',
      '週末に「弱点ノート」を1ページ埋める',
      '提出物は期限より2日前に仕上げる',
    ],
  },
  B: {
    title: '伸びしろがあります',
    message: '基礎力は身についています。ここから伸ばせる教科を探しましょう。',
    subMessage: '毎日少しずつ続けることが大切です',
    tips: [
      '毎日30分の復習を習慣に',
      '間違えた問題を記録しよう',
      '友達と教え合うのも効果的',
      'テスト2週間前からワークを2周',
      '授業のポイントを1行でまとめる癖をつける',
    ],
  },
  C: {
    title: 'ここから積み上げていきましょう',
    message: '今日から変えていけます。一歩ずつ進めましょう。',
    subMessage: '1教科ずつ伸ばしていきましょう',
    tips: [
      'まずは1教科を重点的に',
      '基礎問題を繰り返し解く',
      '分からないことはすぐ質問',
      '授業ノートを毎週見直して穴を発見',
      '1日10分でも継続して習慣化する',
    ],
  },
  D: {
    title: '無理のない目標から始めましょう',
    message: '今日からできることを1つずつ増やしていきましょう。',
    subMessage: '小さな成功体験を積み重ねよう',
    tips: [
      '教科書の基本に立ち返る',
      '1日10分から始めてみよう',
      '「できた」を増やしていこう',
      '提出物を期限内に出すことを最優先',
      '朝の5分だけ復習してリズムを作る',
    ],
  },
};

export function MotivationCard({ result }: MotivationCardProps) {
  // Safely get the rank code, defaulting to 'C' if undefined
  const rankCode = result?.rank?.code || 'C';
  const config = MOTIVATION_MESSAGES[rankCode] || MOTIVATION_MESSAGES.C;

  // Safely calculate percent (truncate decimals)
  const displayPercent = Math.floor(result?.percent || 0);

  // Cycling tips
  const [tipIndex, setTipIndex] = React.useState(0);
  const [showAllTips, setShowAllTips] = React.useState(false);

  React.useEffect(() => {
    setTipIndex(Math.floor(Math.random() * config.tips.length));
  }, [config.tips.length]);

  // Auto-cycle tips every 5 seconds
  React.useEffect(() => {
    if (showAllTips) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % config.tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.tips.length, showAllTips]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <h3 className="text-[17px] font-bold text-slate-900">{config.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{config.message}</p>

      {/* Stats row */}
      <dl className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
        <div className="py-3 pr-4">
          <dt className="text-xs text-slate-600">ランク</dt>
          <dd className="mt-1 text-2xl font-bold text-slate-900">{rankCode}</dd>
        </div>
        <div className="py-3 pl-4">
          <dt className="text-xs text-slate-600">達成率</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {displayPercent}<span className="text-sm">%</span>
          </dd>
        </div>
      </dl>

      {/* Tip */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-900">今日のアドバイス</div>
          <button
            type="button"
            onClick={() => setShowAllTips(!showAllTips)}
            aria-expanded={showAllTips}
            className="inline-flex min-h-11 items-center px-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            {showAllTips ? '閉じる' : 'すべて見る'}
          </button>
        </div>
        {showAllTips ? (
          <ul className="mt-1 list-disc space-y-2 pl-5 text-sm text-slate-900">
            {config.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p
            key={tipIndex}
            className="mt-1 text-sm leading-relaxed text-slate-900 motion-safe:animate-fade-in"
          >
            {config.tips[tipIndex]}
          </p>
        )}
        {!showAllTips && (
          <div className="mt-2 flex justify-center">
            {config.tips.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTipIndex(i)}
                aria-label={`アドバイス${i + 1}を表示`}
                aria-current={i === tipIndex ? 'true' : undefined}
                className="inline-flex h-11 w-11 items-center justify-center"
              >
                <span
                  className={
                    i === tipIndex
                      ? 'h-2.5 w-2.5 rounded-full bg-brand-700'
                      : 'h-1.5 w-1.5 rounded-full bg-slate-500'
                  }
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sub message */}
      <p className="mt-4 text-sm text-slate-600">{config.subMessage}</p>
    </div>
  );
}
