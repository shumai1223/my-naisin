'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';

const RATIO_OPTIONS = [
  { label: '4:6（標準）', naishin: 4, gakuryoku: 6 },
  { label: '3:7（学力重視）', naishin: 3, gakuryoku: 7 },
  { label: '2:8（学力最重視）', naishin: 2, gakuryoku: 8 },
  { label: '5:5（バランス型）', naishin: 5, gakuryoku: 5 },
  { label: '6:4（内申重視）', naishin: 6, gakuryoku: 4 },
  { label: '7:3（内申最重視）', naishin: 7, gakuryoku: 3 },
];

export function KanagawaSValueCalculator() {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [tokushokuInput, setTokushokuInput] = React.useState('');
  const [ratioIndex, setRatioIndex] = React.useState(0);
  const [targetInput, setTargetInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0; // 135点満点
  const gakuryoku = parseFloat(gakuryokuInput) || 0; // 500点満点
  const tokushoku = parseFloat(tokushokuInput) || 0; // 最大100点（学校による）

  const ratio = RATIO_OPTIONS[ratioIndex];

  // S1値（特色検査なし）の計算式：
  // S1 = (内申/135 × 100 × 内申比率) + (学力/500 × 100 × 学力比率)
  // 比率の合計は10
  const naishinConverted = (naishin / 135) * 100 * ratio.naishin;
  const gakuryokuConverted = (gakuryoku / 500) * 100 * ratio.gakuryoku;
  const s1 = Math.round(naishinConverted + gakuryokuConverted);

  // S2値（特色検査あり） = S1 + 特色検査の比率（最大5）
  // 簡略化のため、特色検査を比例配分（最大5として加算）
  const s2 = Math.round(s1 + tokushoku * 5);

  const hasInput = naishinInput !== '' || gakuryokuInput !== '';

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
    setTokushokuInput('');
    setRatioIndex(0);
    setTargetInput('');
  };

  const getRankColor = () => {
    if (s1 >= 900) return 'text-red-700';
    if (s1 >= 800) return 'text-orange-700';
    if (s1 >= 700) return 'text-amber-700';
    if (s1 >= 600) return 'text-emerald-700';
    return 'text-blue-700';
  };

  const getRankLabel = () => {
    if (s1 >= 900) return '最難関校レベル（横浜翠嵐・湘南）';
    if (s1 >= 830) return '難関校レベル（柏陽・厚木・川和）';
    if (s1 >= 750) return '上位校レベル（光陵・希望ヶ丘・小田原）';
    if (s1 >= 680) return '中堅上位校レベル（鎌倉・大和・横浜緑ヶ丘）';
    if (s1 >= 600) return '中堅校レベル';
    return '基礎を固める段階';
  };

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-blue-600" />
            神奈川S値（S1・S2）を計算
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
        <p className="mt-2 text-xs text-slate-600">内申点・学力検査点・志望校の比率を入力してください</p>
      </div>

      <div className="p-6 space-y-5">
        {/* 内申点 */}
        <div>
          <label htmlFor="kanagawa-naishin" className="block text-sm font-bold text-slate-800 mb-1">
            内申点（135点満点）<span className="text-xs font-normal text-slate-500 ml-2">中2＋中3×2 / 9教科</span>
          </label>
          <input
            id="kanagawa-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：110"
            min="0"
            max="135"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="kanagawa-gakuryoku" className="block text-sm font-bold text-slate-800 mb-1">
            学力検査点（500点満点）<span className="text-xs font-normal text-slate-500 ml-2">5教科 × 100点</span>
          </label>
          <input
            id="kanagawa-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：400"
            min="0"
            max="500"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* 志望校の比率 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">志望校の比率（内申：学力）</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {RATIO_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setRatioIndex(i)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                  i === ratioIndex
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 特色検査（任意） */}
        <div>
          <label htmlFor="kanagawa-tokushoku" className="block text-sm font-bold text-slate-800 mb-1">
            特色検査（任意・最大100点）<span className="text-xs font-normal text-slate-500 ml-2">難関校のみ実施</span>
          </label>
          <input
            id="kanagawa-tokushoku"
            type="number"
            value={tokushokuInput}
            onChange={(e) => setTokushokuInput(e.target.value)}
            placeholder="例：70（実施しない場合は空欄）"
            min="0"
            max="100"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-6">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-2">あなたのS1値（1000点満点）</div>
            <div className={`text-5xl font-black ${getRankColor()}`}>{s1}<span className="text-xl">点</span></div>
            {tokushoku > 0 && (
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-600">S2値（特色検査込み）</div>
                <div className={`text-3xl font-black ${getRankColor()}`}>{s2}<span className="text-base">点</span></div>
              </div>
            )}
            <div className="mt-4 text-sm font-bold text-slate-700">{getRankLabel()}</div>

            <div className="mt-4 rounded-xl bg-white border border-blue-100 p-3 text-left">
              <div className="text-xs font-bold text-slate-700 mb-2">計算内訳</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>内申点換算：{naishin} ÷ 135 × 100 × {ratio.naishin} ＝ {Math.round(naishinConverted)}点</li>
                <li>学力検査換算：{gakuryoku} ÷ 500 × 100 × {ratio.gakuryoku} ＝ {Math.round(gakuryokuConverted)}点</li>
                <li className="font-bold pt-1 border-t border-slate-100">S1値：{Math.round(naishinConverted)} + {Math.round(gakuryokuConverted)} ＝ {s1}点</li>
                {tokushoku > 0 && (
                  <li className="font-bold">S2値：S1 + 特色検査{tokushoku}×5 ＝ {s2}点</li>
                )}
              </ul>
            </div>
          </div>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={s1}
            totalMax={1000}
            inputId="kanagawa-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
