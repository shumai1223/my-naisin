'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calculator,
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';

import { DEFAULT_SCORES } from '@/lib/constants';
import { calculateMaxScore, calculateTotalScore, calculatePercent, getRankForPercent } from '@/lib/utils';
import { InputForm } from '@/components/Calculator/InputForm';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { RankCard } from '@/components/Result/RankCard';
import { NextActionButtons } from '@/components/NextActionButtons';
import { PDFExportButton } from '@/components/PDFExportButton';
import type { Scores, SubjectKey } from '@/lib/types';

interface InteractiveCalculatorProps {
  prefectureCode: string;
  prefectureName: string;
  maxScore: number;
}

export function InteractiveCalculator({ prefectureCode, prefectureName, maxScore }: InteractiveCalculatorProps) {
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [showResult, setShowResult] = React.useState(false);

  const max = calculateMaxScore(prefectureCode);
  const total = calculateTotalScore(scores, prefectureCode);
  const percent = calculatePercent(total, max);
  const rank = getRankForPercent(percent);

  const handleScoreChange = (subject: SubjectKey, value: number) => {
    setScores(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const handleCalculate = () => {
    setShowResult(true);
    if (typeof window !== 'undefined') {
      if (prefectureCode === 'kanagawa') {
        window.localStorage.setItem('my-naishin:kanagawa-A', String(total));
      }
      if (prefectureCode === 'tokyo') {
        window.localStorage.setItem('my-naishin:tokyo-kanso', String(total));
      }
    }
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {prefectureName}の内申点を計算する
          </h2>
          <p className="text-sm text-slate-500">
            下記に成績を入力すると、{maxScore}点満点で計算されます
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <InputForm
          prefectureCode={prefectureCode}
          scores={scores}
          onChange={handleScoreChange}
          maxGrade={5}
        />
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCalculate}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            内申点を計算する
          </button>
        </div>
      </div>

      {showResult && (
        <div id="result" className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-center text-lg font-bold text-slate-800">
            あなたの{prefectureName}での内申点
          </h3>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
            <ScoreGauge percent={percent} total={total} max={max} />
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-blue-600">{total}点</div>
              <div className="text-sm text-slate-500">/ {max}点満点（達成率 {percent}%）</div>
              <div className="mt-2">
                <RankCard result={{ prefectureCode, total, max, percent, rank }} />
              </div>
            </div>
          </div>

          {prefectureCode === 'kanagawa' && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="text-sm font-bold text-indigo-700">A（評定合計）と a値</div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                <span>A（評定合計）: <strong>{total}点</strong></span>
                <span>a値（100点換算）: <strong>{Math.round((total / max) * 100)}点</strong></span>
              </div>
              <p className="mt-2 text-xs text-slate-500">a値はAを100点満点に換算した値です。</p>
            </div>
          )}
          
          {/* 逆算機能への誘導 */}
          <div className="mt-6 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                <Target className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 font-bold text-slate-800">志望校から逆算する</h4>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">
                  目標の合計点から、必要な当日点や内申点を逆算できます。志望校の配点比率を入力して、自分の現在地を把握しましょう。
                </p>
                <Link
                  href={`/reverse?pref=${prefectureCode}&current=${total}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  <Target className="h-4 w-4" />
                  逆算機能で試す
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <NextActionButtons 
            prefectureCode={prefectureCode}
            scores={scores}
            totalScore={total}
            maxScore={max}
          />

          <PDFExportButton 
            prefectureCode={prefectureCode}
            scores={scores}
            totalScore={total}
            maxScore={max}
          />

          <div className="mt-4 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 flex-shrink-0 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="mb-2 font-bold text-slate-800">さらに詳しい分析をご希望の方へ</h4>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">
                  メインページでは、成績推移グラフ、教科別の詳細分析、目標設定機能、勉強タイマーなど、より充実した機能をご利用いただけます。
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  <Calculator className="h-4 w-4" />
                  詳細な分析・計算はこちら
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
