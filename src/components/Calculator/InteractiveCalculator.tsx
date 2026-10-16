'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from '@/components/icons';

import { DEFAULT_SCORES } from '@/lib/constants';
import { calculateMaxScore, calculateTotalScore, calculatePercent, getRankForPercent, encodeScoresQuery } from '@/lib/utils';
import { InputForm } from '@/components/Calculator/InputForm';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { RankCard } from '@/components/Result/RankCard';
import { NextActionButtons } from '@/components/NextActionButtons';
import { PDFExportButton } from '@/components/PDFExportButton';
import { track, funnel } from '@/lib/track';
import type { Scores, SubjectKey } from '@/lib/types';

interface InteractiveCalculatorProps {
  prefectureCode: string;
  prefectureName: string;
  maxScore: number;
  /** 計算成立後、内申点の実測値を親へ通知（結果連動の名簿/送客導線用）。 */
  onResult?: (r: { total: number; max: number } | null) => void;
}

export function InteractiveCalculator({ prefectureCode, prefectureName, maxScore, onResult }: InteractiveCalculatorProps) {
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [showResult, setShowResult] = React.useState(false);
  // ファネル先頭（tool_start）を最初の入力で一度だけ送る
  const startedRef = React.useRef(false);

  const max = calculateMaxScore(prefectureCode);
  const total = calculateTotalScore(scores, prefectureCode);
  const percent = calculatePercent(total, max);
  const rank = getRankForPercent(percent);

  // 計算表示後、実測の内申点を親へ通知（結果連動でCTAを個別化＝カード/保護者バトンを点灯）。
  React.useEffect(() => {
    if (showResult) onResult?.({ total, max });
  }, [showResult, total, max, onResult]);

  const handleScoreChange = (subject: SubjectKey, value: number) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ pref: prefectureCode, tool: 'naishin', placement: 'prefecture' });
    }
    setScores(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const handleCalculate = () => {
    setShowResult(true);
    // 計算成立 → 結果表示。換金ファネルの分母（result_view）も送る。
    funnel.calcComplete({ pref: prefectureCode, tool: 'naishin', placement: 'prefecture' }, { total, percent });
    track('result_view', { source: 'prefecture', pref: prefectureCode });
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
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">
          {prefectureName}の内申点を計算する
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          下記に成績を入力すると、{maxScore}点満点で計算されます
        </p>

        <div className="mt-5">
          <InputForm
            prefectureCode={prefectureCode}
            scores={scores}
            onChange={handleScoreChange}
            maxGrade={5}
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCalculate}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded bg-brand-700 px-8 py-3 text-base font-bold text-white transition-colors duration-100 hover:bg-brand-800 sm:w-auto"
            >
              内申点を計算する
            </button>
          </div>
        </div>
      </section>

      {showResult && (
        <div id="result" className="rounded-lg border border-slate-200 bg-white p-5 md:p-6" role="status" aria-live="polite">
          <h3 className="mb-4 text-center text-[17px] font-bold text-slate-900">
            あなたの{prefectureName}での内申点
          </h3>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
            <ScoreGauge percent={percent} total={total} max={max} />
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold tabular-nums text-brand-700">{total}点</div>
              <div className="text-sm tabular-nums text-slate-600">/ {max}点満点（達成率 {percent}%）</div>
              <div className="mt-2">
                <RankCard result={{ prefectureCode, total, max, percent, rank }} />
              </div>
            </div>
          </div>

          {prefectureCode === 'kanagawa' && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <div className="text-sm font-bold text-slate-900">A（評定合計）と a値</div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm tabular-nums text-slate-900">
                <span>A（評定合計）: <strong>{total}点</strong></span>
                <span>a値（100点換算）: <strong>{Math.round((total / max) * 100)}点</strong></span>
              </div>
              <p className="mt-2 text-sm text-slate-600">a値はAを100点満点に換算した値です。</p>
            </div>
          )}

          {/* 2026-08-08 Cowork実地監査: 直下のNextActionButtonsの「志望校配点で逆算する」ボタンと
              遷移先(/reverse?pref=X&current=Y)が完全に重複していた「逆算機能への誘導」カードを削除。
              結果画面に逆算への導線が3つ連続で並び、うち2つの遷移先がほぼ同じという指摘への対応。 */}
          <div className="mt-4">
            <NextActionButtons
              prefectureCode={prefectureCode}
              scores={scores}
              totalScore={total}
              maxScore={max}
            />
          </div>

          <div className="mt-4">
            <PDFExportButton
              prefectureCode={prefectureCode}
              scores={scores}
              totalScore={total}
              maxScore={max}
            />
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-5">
            <h4 className="mb-2 text-base font-bold text-slate-900">さらに詳しい分析をご希望の方へ</h4>
            <p className="mb-4 text-sm leading-[1.8] text-slate-700">
              メインページでは、成績推移グラフ、教科別の詳細分析、目標設定機能、勉強タイマーなど、より充実した機能をご利用いただけます。
              {prefectureName}・入力済みの評定はそのまま引き継がれます。
            </p>
            <Link
              href={`/?pref=${prefectureCode}&scores=${encodeScoresQuery(scores)}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-100 hover:bg-brand-800"
            >
              詳細な分析・計算はこちら
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
