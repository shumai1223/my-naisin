'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { TOKYO_ESAT_GRADES, TOKYO_TOTAL_SCORE_MAX, computeTokyoTotalScore, tokyoRankLabel } from '@/lib/total-score/tokyo';

interface TokyoTotalScoreCalculatorProps {
  /** 入力後、総合得点(1020点満点)の実測値を親へ通知（結果連動の名簿/送客導線用）。 */
  onResult?: (r: { total: number; max: number } | null) => void;
}

export function TokyoTotalScoreCalculator({ onResult }: TokyoTotalScoreCalculatorProps = {}) {
  const [scoreInput, setScoreInput] = React.useState('');
  const [naishinInput, setNaishinInput] = React.useState('');
  const [esatGrade, setEsatGrade] = React.useState('A');
  const [targetInput, setTargetInput] = React.useState('');

  const academicScore = parseFloat(scoreInput) || 0;
  const naishinValue = parseFloat(naishinInput) || 0;

  const { academicConverted, naishinConverted, esatScore, total, percent } = computeTokyoTotalScore({
    academicRaw: academicScore,
    naishinRaw: naishinValue,
    esatGrade,
  });

  const hasInput = scoreInput !== '' || naishinInput !== '';

  // 総合得点の実測値を親へ通知（結果連動でCTAを個別化＝カード/保護者バトンを点灯）。
  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: TOKYO_TOTAL_SCORE_MAX } : null);
  }, [hasInput, total, onResult]);

  const reset = () => {
    setScoreInput('');
    setNaishinInput('');
    setEsatGrade('A');
    setTargetInput('');
  };

  const getRankLabel = () => tokyoRankLabel(total);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">総合得点を計算</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-600">5教科の合計点・換算内申・ESAT-J 評価を入力してください</p>
      </div>

      <div className="space-y-5 px-5 py-6 md:px-6">
        {/* 学力検査 */}
        <div>
          <label htmlFor="tokyo-total-score-exam" className="mb-2 block text-sm font-bold text-slate-900">
            5教科 学力検査の合計点
            <span className="ml-2 text-xs font-normal text-slate-600">（500点満点 / 各教科100点）</span>
          </label>
          <input
            id="tokyo-total-score-exam"
            type="number"
            inputMode="decimal"
            min="0"
            max="500"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            placeholder="例：420"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          {scoreInput && (
            <div className="mt-2 text-sm text-brand-700">
              → 700点換算：<strong className="text-base tabular-nums">{academicConverted}点</strong>
            </div>
          )}
        </div>

        {/* 調査書点 */}
        <div>
          <label htmlFor="tokyo-total-score-naishin" className="mb-2 block text-sm font-bold text-slate-900">
            換算内申
            <span className="ml-2 text-xs font-normal text-slate-600">（65点満点 = 5教科の評定 + 実技4教科×2）</span>
          </label>
          <input
            id="tokyo-total-score-naishin"
            type="number"
            inputMode="decimal"
            min="0"
            max="65"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：50"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          {naishinInput && (
            <div className="mt-2 text-sm text-brand-700">
              → 300点換算：<strong className="text-base tabular-nums">{naishinConverted}点</strong>
            </div>
          )}
          <div className="mt-2 text-sm text-slate-600">
            <a href="/tokyo/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">東京都の内申点計算ツール</a>で換算内申を計算してから入力するとスムーズです
          </div>
        </div>

        {/* ESAT-J */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">
            ESAT-J 評価
            <span className="ml-2 text-xs font-normal text-slate-600">（英語スピーキング・最大20点）</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {TOKYO_ESAT_GRADES.map((option) => (
              <button
                key={option.grade}
                type="button"
                onClick={() => setEsatGrade(option.grade)}
                aria-pressed={esatGrade === option.grade}
                className={`min-h-[44px] rounded border-2 px-2 py-2 text-center transition-colors ${
                  esatGrade === option.grade
                    ? 'border-brand-700 bg-brand-50'
                    : 'border-slate-200 bg-white hover:bg-brand-50'
                }`}
                title={option.label}
              >
                <div className={`text-sm font-bold ${esatGrade === option.grade ? 'text-brand-800' : 'text-slate-700'}`}>
                  {option.grade}
                </div>
                <div className={`text-xs ${esatGrade === option.grade ? 'text-brand-700' : 'text-slate-600'}`}>
                  {option.score}点
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-sm font-bold text-slate-700">あなたの総合得点</div>
          <div className="mt-1 text-5xl font-bold tabular-nums text-slate-900">
            {total}
            <span className="ml-1 text-2xl font-bold text-slate-600">/{TOKYO_TOTAL_SCORE_MAX}</span>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-700">
            得点率 {percent.toFixed(1)}%
          </div>
          <div className="mt-3 inline-block rounded border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-900">
            {getRankLabel()}
          </div>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
            <div className="px-3 py-3 first:pl-0">
              <dt className="text-xs text-slate-600">学力検査</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{academicConverted}</dd>
              <dd className="text-xs text-slate-600">/700点</dd>
            </div>
            <div className="px-3 py-3">
              <dt className="text-xs text-slate-600">調査書点</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{naishinConverted}</dd>
              <dd className="text-xs text-slate-600">/300点</dd>
            </div>
            <div className="px-3 py-3">
              <dt className="text-xs text-slate-600">ESAT-J</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{esatScore}</dd>
              <dd className="text-xs text-slate-600">/20点</dd>
            </div>
          </dl>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={total}
            totalMax={TOKYO_TOTAL_SCORE_MAX}
            inputId="tokyo-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
