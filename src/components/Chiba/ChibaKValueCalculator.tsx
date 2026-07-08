'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

const K_PRESETS = [0.5, 1.0, 1.5, 2.0] as const;

export interface ChibaKValueResult {
  total: number;
  max: number;
}

interface Props {
  /** 総合得点(概算)が変わるたびに呼ばれる（結果連動の名簿導線に使う）。 */
  onResult?: (r: ChibaKValueResult | null) => void;
}

/**
 * 千葉県の調査書点（評定合計×K値）＋学力検査＋その他＋学校設定検査の実数計算機。
 * 既存の/chiba/total-scoreは評定合計×Kの早見表(静的プリセット)のみで、
 * 実際の数値を入力して自分の総合得点を出すインタラクティブな計算機が無かった（B-4）。
 * 神奈川S値計算機(KanagawaSValueCalculator)と同じ「入力→即結果」のUXパターンを踏襲する。
 */
export function ChibaKValueCalculator({ onResult }: Props) {
  const [hyoteiInput, setHyoteiInput] = React.useState(''); // 評定合計（135点満点）
  const [gakuryokuInput, setGakuryokuInput] = React.useState(''); // 学力検査（500点満点）
  const [kValue, setKValue] = React.useState('1.0');
  const [othersInput, setOthersInput] = React.useState(''); // 調査書のその他（0〜50、任意）
  const [schoolExamInput, setSchoolExamInput] = React.useState(''); // 学校設定検査（0〜150、任意）

  const hyotei = parseFloat(hyoteiInput) || 0;
  const gakuryoku = parseFloat(gakuryokuInput) || 0;
  const k = parseFloat(kValue) || 1.0;
  const others = parseFloat(othersInput) || 0;
  const schoolExam = parseFloat(schoolExamInput) || 0;

  const hasInput = hyoteiInput !== '' || gakuryokuInput !== '';

  const reportScore = hyotei * k;
  const total = Math.round(gakuryoku + reportScore + others + schoolExam);
  // 満点はK値・その他・学校設定検査の入力有無で変わる（概算の目安として算出）。
  const max = Math.round(500 + 135 * k + (othersInput !== '' ? 50 : 0) + (schoolExamInput !== '' ? 150 : 0));

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max } : null);
  }, [hasInput, total, max, onResult]);

  const reset = () => {
    setHyoteiInput('');
    setGakuryokuInput('');
    setKValue('1.0');
    setOthersInput('');
    setSchoolExamInput('');
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-emerald-600" />
          千葉県の総合得点（K値）を計算
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
          <label htmlFor="chiba-hyotei-sum" className="mb-1 block text-sm font-bold text-slate-800">
            評定合計（135点満点）<span className="ml-2 text-xs font-normal text-slate-500">9教科×5段階×3学年</span>
          </label>
          <input
            id="chiba-hyotei-sum"
            type="number"
            inputMode="decimal"
            min={0}
            max={135}
            value={hyoteiInput}
            onChange={(e) => setHyoteiInput(e.target.value)}
            placeholder="例：108"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label htmlFor="chiba-gakuryoku" className="mb-1 block text-sm font-bold text-slate-800">
            学力検査点（500点満点）<span className="ml-2 text-xs font-normal text-slate-500">5教科×100点</span>
          </label>
          <input
            id="chiba-gakuryoku"
            type="number"
            inputMode="decimal"
            min={0}
            max={500}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：380"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-800">志望校のK値</label>
          <div className="flex flex-wrap gap-2">
            {K_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setKValue(String(p))}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  Number(kValue) === p ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                }`}
              >
                K={p}
              </button>
            ))}
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              min={0.5}
              max={2}
              value={kValue}
              onChange={(e) => setKValue(e.target.value)}
              className="h-8 w-20 rounded-full border border-slate-200 px-3 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              aria-label="K値を直接入力"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">調査書のその他（任意・0〜50）</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={50}
              value={othersInput}
              onChange={(e) => setOthersInput(e.target.value)}
              placeholder="未入力なら0点"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">学校設定検査（任意・0〜150）</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={150}
              value={schoolExamInput}
              onChange={(e) => setSchoolExamInput(e.target.value)}
              placeholder="未入力なら0点"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>
      </div>

      {hasInput && (
        <div className="border-t-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 text-center">
          <div className="mb-1 text-xs font-bold text-slate-600">あなたの総合得点（目安）</div>
          <div className="text-5xl font-black text-emerald-700">
            {total}
            <span className="text-xl font-bold text-slate-400">/{max}</span>
          </div>
          <div className="mx-auto mt-4 max-w-sm rounded-xl border border-emerald-100 bg-white p-3 text-left">
            <div className="mb-2 text-xs font-bold text-slate-700">計算内訳</div>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>調査書点：評定合計{hyotei} × K{k} ＝ {Math.round(reportScore * 10) / 10}点</li>
              <li>学力検査：{gakuryoku}点</li>
              {othersInput !== '' && <li>調査書のその他：{others}点</li>}
              {schoolExamInput !== '' && <li>学校設定検査：{schoolExam}点</li>}
              <li className="border-t border-slate-100 pt-1 font-bold">総合得点：{total}点</li>
            </ul>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-slate-400">
            ※ K値・学校設定検査の配点は高校ごとに異なります。満点は入力した項目から概算した目安です。
          </p>
        </div>
      )}
    </div>
  );
}
