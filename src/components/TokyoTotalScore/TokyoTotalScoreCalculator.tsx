'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';

const ESAT_GRADES = [
  { grade: 'A', score: 20, label: '80点以上' },
  { grade: 'B', score: 16, label: '65〜79点' },
  { grade: 'C', score: 12, label: '50〜64点' },
  { grade: 'D', score: 8, label: '35〜49点' },
  { grade: 'E', score: 4, label: '20〜34点' },
  { grade: 'F', score: 0, label: '20点未満' },
  { grade: 'なし', score: 0, label: '未受験・対象外' },
];

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
  const esatScore = ESAT_GRADES.find((g) => g.grade === esatGrade)?.score ?? 0;

  // 学力検査700点換算
  const academicConverted = Math.round((academicScore / 500) * 700);
  // 調査書点300点換算
  const naishinConverted = Math.round((naishinValue / 65) * 300);
  // 総合得点
  const total = academicConverted + naishinConverted + esatScore;
  const percent = (total / 1020) * 100;

  const hasInput = scoreInput !== '' || naishinInput !== '';

  // 総合得点の実測値を親へ通知（結果連動でCTAを個別化＝カード/保護者バトンを点灯）。
  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: 1020 } : null);
  }, [hasInput, total, onResult]);

  const reset = () => {
    setScoreInput('');
    setNaishinInput('');
    setEsatGrade('A');
    setTargetInput('');
  };

  const getRankColor = () => {
    if (total >= 880) return 'text-red-700';
    if (total >= 800) return 'text-orange-700';
    if (total >= 720) return 'text-amber-700';
    if (total >= 640) return 'text-emerald-700';
    return 'text-blue-700';
  };

  const getRankLabel = () => {
    if (total >= 880) return '最難関校レベル（日比谷・西・国立）';
    if (total >= 840) return '難関校レベル（戸山・青山）';
    if (total >= 800) return '上位校レベル（新宿・駒場）';
    if (total >= 720) return '中堅上位校レベル（小山台・三田）';
    if (total >= 640) return '中堅校レベル（城東・広尾）';
    if (total >= 560) return '中堅下位校レベル';
    return '基礎を固める段階';
  };

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-blue-600" />
            総合得点を計算
          </h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600">5教科の合計点・換算内申・ESAT-J 評価を入力してください</p>
      </div>

      <div className="p-6 space-y-5">
        {/* 学力検査 */}
        <div>
          <label htmlFor="tokyo-total-score-exam" className="block text-sm font-bold text-slate-700 mb-2">
            5教科 学力検査の合計点
            <span className="ml-2 text-xs font-normal text-slate-500">（500点満点 / 各教科100点）</span>
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
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {scoreInput && (
            <div className="mt-2 text-xs text-blue-700">
              → 700点換算：<strong className="text-base">{academicConverted}点</strong>
            </div>
          )}
        </div>

        {/* 調査書点 */}
        <div>
          <label htmlFor="tokyo-total-score-naishin" className="block text-sm font-bold text-slate-700 mb-2">
            換算内申
            <span className="ml-2 text-xs font-normal text-slate-500">（65点満点 = 5教科の評定 + 実技4教科×2）</span>
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
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {naishinInput && (
            <div className="mt-2 text-xs text-emerald-700">
              → 300点換算：<strong className="text-base">{naishinConverted}点</strong>
            </div>
          )}
          <div className="mt-2 text-xs text-slate-500">
            <a href="/tokyo/naishin" className="text-blue-600 underline">東京都の内申点計算ツール</a>で換算内申を計算してから入力するとスムーズです
          </div>
        </div>

        {/* ESAT-J */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            ESAT-J 評価
            <span className="ml-2 text-xs font-normal text-slate-500">（英語スピーキング・最大20点）</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ESAT_GRADES.map((option) => (
              <button
                key={option.grade}
                type="button"
                onClick={() => setEsatGrade(option.grade)}
                className={`rounded-lg border-2 px-2 py-2 text-center transition-all ${
                  esatGrade === option.grade
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/50'
                }`}
                title={option.label}
              >
                <div className={`text-sm font-black ${esatGrade === option.grade ? 'text-amber-700' : 'text-slate-700'}`}>
                  {option.grade}
                </div>
                <div className={`text-[10px] ${esatGrade === option.grade ? 'text-amber-600' : 'text-slate-500'}`}>
                  {option.score}点
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 px-6 py-6 border-t-2 border-blue-200">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-1">あなたの総合得点</div>
            <div className={`text-6xl font-black ${getRankColor()}`}>
              {total}
              <span className="text-2xl font-bold text-slate-400">/1020</span>
            </div>
            <div className="mt-2 text-sm font-bold text-slate-700">
              得点率 {percent.toFixed(1)}%
            </div>
            <div className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-bold ${getRankColor()} bg-white shadow-sm`}>
              {getRankLabel()}
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3 text-center">
            <div className="rounded-lg bg-white border border-blue-100 p-3">
              <div className="text-[10px] font-bold text-blue-600 uppercase">学力検査</div>
              <div className="text-xl font-black text-blue-700">{academicConverted}</div>
              <div className="text-[10px] text-slate-500">/700点</div>
            </div>
            <div className="rounded-lg bg-white border border-emerald-100 p-3">
              <div className="text-[10px] font-bold text-emerald-600 uppercase">調査書点</div>
              <div className="text-xl font-black text-emerald-700">{naishinConverted}</div>
              <div className="text-[10px] text-slate-500">/300点</div>
            </div>
            <div className="rounded-lg bg-white border border-amber-100 p-3">
              <div className="text-[10px] font-bold text-amber-600 uppercase">ESAT-J</div>
              <div className="text-xl font-black text-amber-700">{esatScore}</div>
              <div className="text-[10px] text-slate-500">/20点</div>
            </div>
          </div>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={total}
            totalMax={1020}
            inputId="tokyo-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
