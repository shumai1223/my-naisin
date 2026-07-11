'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { SAITAMA_MAX_GAKURYOKU, SAITAMA_ASSUMED_TOTAL_CEILING, computeSaitamaTotalScore } from '@/lib/total-score/saitama';

export interface SaitamaTotalScoreResult {
  total: number;
  max: number;
}

interface Props {
  onResult?: (r: SaitamaTotalScoreResult | null) => void;
}

/**
 * 埼玉県の総合得点 順方向計算機（S-3①・残タスク）。
 * 埼玉県は調査書点の満点・学力検査との比率が高校・学科ごとに異なり県内一律の換算式が無いため、
 * 他12県のような固定式の計算機は作れない（捏造ゼロ方針）。そのため「調査書点」は
 * ご自身が既に把握している換算後の点数をそのまま入力してもらう設計とし、合計は
 * あくまで自己申告値の合算＝目安であることを明示する。目標との距離表示(TargetDistancePanel)を
 * 使えるようにすることが本タスクの主目的。
 */
export function SaitamaTotalScoreCalculator({ onResult }: Props) {
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [chosashoInput, setChosashoInput] = React.useState('');
  const [targetInput, setTargetInput] = React.useState('');

  const gakuryoku = parseFloat(gakuryokuInput) || 0;
  const chosasho = parseFloat(chosashoInput) || 0;
  const hasInput = gakuryokuInput !== '' || chosashoInput !== '';
  const { total } = computeSaitamaTotalScore({ gakuryokuRaw: gakuryoku, chosashoRaw: chosasho });

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: SAITAMA_ASSUMED_TOTAL_CEILING } : null);
  }, [hasInput, total, onResult]);

  const reset = () => {
    setGakuryokuInput('');
    setChosashoInput('');
    setTargetInput('');
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-violet-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-violet-600" />
          埼玉県の総合得点（目安）を計算
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

      <div className="space-y-5 p-6">
        <div>
          <label htmlFor="saitama-gakuryoku" className="mb-1 block text-sm font-bold text-slate-800">
            学力検査点（500点満点）<span className="ml-2 text-xs font-normal text-slate-500">5教科×100点</span>
          </label>
          <input
            id="saitama-gakuryoku"
            type="number"
            inputMode="decimal"
            min={0}
            max={SAITAMA_MAX_GAKURYOKU}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：380"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
        </div>

        <div>
          <label htmlFor="saitama-chosasho" className="mb-1 block text-sm font-bold text-slate-800">
            調査書点（換算後）<span className="ml-2 text-xs font-normal text-slate-500">ご自身で把握している点数</span>
          </label>
          <input
            id="saitama-chosasho"
            type="number"
            inputMode="decimal"
            min={0}
            value={chosashoInput}
            onChange={(e) => setChosashoInput(e.target.value)}
            placeholder="例：260"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            調査書点の満点・換算方法は高校・学科ごとに異なります。上の「学年比率 早見表」で重み付けを確認したうえで、志望校の募集要項に沿ってご自身で換算した点数を入力してください。
          </p>
        </div>
      </div>

      {hasInput && (
        <div className="border-t-2 border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 px-6 py-6 text-center">
          <div className="mb-1 text-xs font-bold text-slate-600">学力検査＋調査書点の合計（目安）</div>
          <div className="text-5xl font-black text-violet-700">{total}</div>
          <div className="mx-auto mt-4 max-w-sm rounded-xl border border-violet-100 bg-white p-3 text-left">
            <div className="mb-2 text-xs font-bold text-slate-700">内訳</div>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>学力検査：{gakuryoku} / {SAITAMA_MAX_GAKURYOKU}点</li>
              <li>調査書点（自己申告）：{chosasho}点</li>
              <li className="border-t border-slate-100 pt-1 font-bold">合計：{total}点</li>
            </ul>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-slate-400">
            ※ 埼玉県は調査書点の満点・学力検査との比率が高校・学科ごとに異なるため、この合計は入力値をそのまま足しただけの目安です。学校別の合格ボーダーを示すものではありません。
          </p>

          <div className="mx-auto max-w-sm text-left">
            <TargetDistancePanel
              targetInput={targetInput}
              onTargetInputChange={setTargetInput}
              total={total}
              totalMax={SAITAMA_ASSUMED_TOTAL_CEILING}
              inputId="saitama-total-score-target"
            />
          </div>
        </div>
      )}
    </div>
  );
}
