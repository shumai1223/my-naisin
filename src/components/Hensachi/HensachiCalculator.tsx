'use client';

import * as React from 'react';
import { Calculator, RotateCcw, Settings2 } from 'lucide-react';

import { track, funnel } from '@/lib/track';

const SUBJECTS = [
  { key: 'kokugo', label: '国語' },
  { key: 'sugaku', label: '数学' },
  { key: 'eigo', label: '英語' },
  { key: 'rika', label: '理科' },
  { key: 'shakai', label: '社会' },
] as const;

type SubjectKey = (typeof SUBJECTS)[number]['key'];

interface SubjectInput {
  score: string;
  average: string;
  stdDev: string;
}

const DEFAULT_INPUT: SubjectInput = { score: '', average: '50', stdDev: '15' };

function calcHensachi(score: number, average: number, stdDev: number): number | null {
  if (!Number.isFinite(score) || !Number.isFinite(average) || !Number.isFinite(stdDev) || stdDev <= 0) {
    return null;
  }
  return 50 + (10 * (score - average)) / stdDev;
}

interface EvalResult {
  label: string;
  textClass: string;
  subClass: string;
  bgGradient: string;
  borderClass: string;
}

function evaluateLabel(hensachi: number | null): EvalResult | null {
  if (hensachi === null) return null;
  if (hensachi >= 70)
    return {
      label: '最難関レベル（上位2%）',
      textClass: 'text-red-700',
      subClass: 'text-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderClass: 'border-red-200',
    };
  if (hensachi >= 65)
    return {
      label: '難関校レベル（上位7%）',
      textClass: 'text-orange-700',
      subClass: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderClass: 'border-orange-200',
    };
  if (hensachi >= 60)
    return {
      label: '上位校レベル（上位16%）',
      textClass: 'text-amber-700',
      subClass: 'text-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      borderClass: 'border-amber-200',
    };
  if (hensachi >= 55)
    return {
      label: '中堅上位レベル（上位31%）',
      textClass: 'text-emerald-700',
      subClass: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderClass: 'border-emerald-200',
    };
  if (hensachi >= 50)
    return {
      label: '平均レベル',
      textClass: 'text-blue-700',
      subClass: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderClass: 'border-blue-200',
    };
  if (hensachi >= 45)
    return {
      label: '平均より少し下',
      textClass: 'text-slate-700',
      subClass: 'text-slate-600',
      bgGradient: 'from-slate-50 to-slate-100',
      borderClass: 'border-slate-200',
    };
  if (hensachi >= 40)
    return {
      label: '中堅下位レベル',
      textClass: 'text-slate-700',
      subClass: 'text-slate-600',
      bgGradient: 'from-slate-50 to-slate-100',
      borderClass: 'border-slate-200',
    };
  return {
    label: 'もう一歩レベル',
    textClass: 'text-slate-700',
    subClass: 'text-slate-600',
    bgGradient: 'from-slate-50 to-slate-100',
    borderClass: 'border-slate-200',
  };
}

interface HensachiCalculatorProps {
  /** 合計偏差値が変わるたびに呼ばれる（親が結果連動の換金導線を出すため）。 */
  onResult?: (value: number | null) => void;
  /** 結果ボックス内（偏差値の直下＝最高エンゲージ位置）に差し込むCTA。 */
  resultFooter?: React.ReactNode;
}

export function HensachiCalculator({ onResult, resultFooter }: HensachiCalculatorProps = {}) {
  const [mode, setMode] = React.useState<'simple' | 'advanced'>('simple');
  const [inputs, setInputs] = React.useState<Record<SubjectKey, SubjectInput>>(() =>
    SUBJECTS.reduce((acc, s) => {
      acc[s.key] = { ...DEFAULT_INPUT };
      return acc;
    }, {} as Record<SubjectKey, SubjectInput>)
  );
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const updateField = (key: SubjectKey, field: keyof SubjectInput, value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'hensachi', placement: 'hensachi' });
    }
    setInputs((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const reset = () => {
    setInputs(
      SUBJECTS.reduce((acc, s) => {
        acc[s.key] = { ...DEFAULT_INPUT };
        return acc;
      }, {} as Record<SubjectKey, SubjectInput>)
    );
  };

  const results = SUBJECTS.map((s) => {
    const input = inputs[s.key];
    const score = parseFloat(input.score);
    const avg = parseFloat(input.average) || 50;
    const sd = parseFloat(input.stdDev) || 15;
    if (!input.score) return { ...s, hensachi: null as number | null };
    return { ...s, hensachi: calcHensachi(score, avg, sd) };
  });

  const validResults = results.filter((r) => r.hensachi !== null);
  const totalHensachi =
    validResults.length > 0
      ? validResults.reduce((sum, r) => sum + (r.hensachi as number), 0) / validResults.length
      : null;

  const totalEval = evaluateLabel(totalHensachi);

  // 換金ファネルの分母：合計偏差値が初めて算出された時点で1回だけ calc_complete / result_view を計測
  React.useEffect(() => {
    if (totalHensachi !== null && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'hensachi', placement: 'hensachi' }, { hensachi: Number(totalHensachi.toFixed(1)) });
      track('result_view', { source: 'hensachi' });
    }
  }, [totalHensachi]);

  // 合計偏差値を親へ通知（結果連動の換金導線＝41%流入の資産化）。onResult は安定参照前提（useStateのsetter）。
  React.useEffect(() => {
    onResult?.(totalHensachi);
  }, [totalHensachi, onResult]);

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-purple-600" />
            偏差値計算ツール
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {mode === 'simple' ? '詳細モード' : '簡易モードに戻す'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              リセット
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          {mode === 'simple'
            ? '5教科の点数と平均点を入力（標準偏差は15で計算）'
            : '各教科ごとに平均点と標準偏差を細かく設定できます'}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {SUBJECTS.map((subject, i) => {
          const input = inputs[subject.key];
          const result = results[i];
          const evalResult = evaluateLabel(result.hensachi);

          return (
            <div key={subject.key} className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-slate-800">{subject.label}</div>
                {result.hensachi !== null && evalResult && (
                  <div className="text-right">
                    <div className={`text-xl font-black ${evalResult.textClass}`}>
                      偏差値 {result.hensachi.toFixed(1)}
                    </div>
                    <div className={`text-[10px] font-bold ${evalResult.subClass}`}>
                      {evalResult.label}
                    </div>
                  </div>
                )}
              </div>
              <div className={`grid gap-3 ${mode === 'simple' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">点数</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={input.score}
                    onChange={(e) => updateField(subject.key, 'score', e.target.value)}
                    placeholder="例：80"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">平均点</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={input.average}
                    onChange={(e) => updateField(subject.key, 'average', e.target.value)}
                    placeholder="50"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                {mode === 'advanced' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">標準偏差</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={input.stdDev}
                      onChange={(e) => updateField(subject.key, 'stdDev', e.target.value)}
                      placeholder="15"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5教科合計の偏差値 */}
      {totalHensachi !== null && totalEval && (
        <div className={`bg-gradient-to-br ${totalEval.bgGradient} px-6 py-6 border-t-2 ${totalEval.borderClass}`} role="status" aria-live="polite">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-1">5教科の平均偏差値</div>
            <div className={`text-5xl font-black ${totalEval.textClass}`}>
              {totalHensachi.toFixed(1)}
            </div>
            <div className={`mt-2 text-sm font-bold ${totalEval.textClass}`}>
              {totalEval.label}
            </div>
            <div className="mt-4 text-xs text-slate-600">
              ※ 各教科の偏差値の平均値（厳密な5教科総合偏差値とは若干異なります）
            </div>
            {resultFooter}
          </div>
        </div>
      )}
    </div>
  );
}
