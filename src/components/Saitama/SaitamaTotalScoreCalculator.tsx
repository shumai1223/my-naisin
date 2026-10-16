'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
        <h2 className="text-xl font-bold text-slate-900">埼玉県の総合得点（目安）を計算</h2>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          <RotateCcw className="h-4 w-4" />
          リセット
        </button>
      </div>

      <div className="space-y-5 px-5 py-6 md:px-6">
        <div>
          <label htmlFor="saitama-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（500点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科×100点</span>
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
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        <div>
          <label htmlFor="saitama-chosasho" className="mb-1 block text-sm font-bold text-slate-900">
            調査書点（換算後）<span className="ml-2 text-xs font-normal text-slate-600">ご自身で把握している点数</span>
          </label>
          <input
            id="saitama-chosasho"
            type="number"
            inputMode="decimal"
            min={0}
            value={chosashoInput}
            onChange={(e) => setChosashoInput(e.target.value)}
            placeholder="例：260"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          <p className="mt-2 text-sm leading-[1.7] text-slate-600">
            調査書点の満点・換算方法は高校・学科ごとに異なります。上の「学年比率 早見表」で重み付けを確認したうえで、志望校の募集要項に沿ってご自身で換算した点数を入力してください。
          </p>
        </div>
      </div>

      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-sm font-bold text-slate-700">学力検査＋調査書点の合計（目安）</div>
          <div className="mt-1 text-5xl font-bold tabular-nums text-slate-900">{total}</div>
          <div className="mt-4 max-w-sm border-t border-slate-200 pt-3">
            <div className="mb-1 text-sm font-bold text-slate-900">内訳</div>
            <ul className="space-y-1 text-sm tabular-nums text-slate-700">
              <li>学力検査：{gakuryoku} / {SAITAMA_MAX_GAKURYOKU}点</li>
              <li>調査書点（自己申告）：{chosasho}点</li>
              <li className="border-t border-slate-200 pt-1 font-bold text-slate-900">合計：{total}点</li>
            </ul>
          </div>
          <p className="mt-4 text-sm leading-[1.7] text-slate-600">
            ※ 埼玉県は調査書点の満点・学力検査との比率が高校・学科ごとに異なるため、この合計は入力値をそのまま足しただけの目安です。学校別の合格ボーダーを示すものではありません。
          </p>

          <div className="max-w-sm">
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
