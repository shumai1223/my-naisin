'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

import type { TotalScoreSystem } from '@/lib/total-score/types';
import { computeTotalScore } from '@/lib/total-score/engine';
import { EVENTS, track } from '@/lib/track';
import { ParentShareLinkButton } from '@/components/ParentShareLinkButton';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';

interface Props {
  system: TotalScoreSystem;
  /** 入力後、総合得点の実測値を親へ通知（結果連動の名簿/送客導線用）。 */
  onResult?: (r: { total: number; max: number } | null) => void;
}

/**
 * 第1層県の汎用 総合得点計算機（registry のレコードを受け取り、engine で計算）。
 * 入力は「学力検査の合計点」「内申点（県の調査書スケール）」と、比率オプション（複数ある県のみ）。
 */
export function TotalScoreCalculator({ system, onResult }: Props) {
  const [academicInput, setAcademicInput] = React.useState('');
  const [reportInput, setReportInput] = React.useState('');
  const [optionId, setOptionId] = React.useState(system.ratioOptions[0].id);
  const [targetInput, setTargetInput] = React.useState('');
  const firedRef = React.useRef(false);

  const academicRaw = parseFloat(academicInput) || 0;
  const reportRaw = parseFloat(reportInput) || 0;
  const hasInput = academicInput !== '' || reportInput !== '';

  const result = computeTotalScore(system, { academicRaw, reportRaw, ratioOptionId: optionId });
  const percent = result.totalMax > 0 ? (result.total / result.totalMax) * 100 : 0;

  React.useEffect(() => {
    if (hasInput && !firedRef.current) {
      firedRef.current = true;
      track(EVENTS.CALC_COMPLETE, { tool: 'total-score', pref: system.code });
    }
  }, [hasInput, system.code]);

  // 総合得点の実測値を親へ通知（結果連動でCTAを個別化＝カード/保護者バトンを点灯）。
  React.useEffect(() => {
    onResult?.(hasInput ? { total: result.total, max: result.totalMax } : null);
  }, [hasInput, result.total, result.totalMax, onResult]);

  const reset = () => {
    setAcademicInput('');
    setReportInput('');
    setOptionId(system.ratioOptions[0].id);
    setTargetInput('');
  };

  const tone =
    percent >= 80
      ? 'text-red-700'
      : percent >= 65
        ? 'text-orange-700'
        : percent >= 50
          ? 'text-emerald-700'
          : 'text-blue-700';

  const multipleOptions = system.ratioOptions.length > 1;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-blue-600" />
          {system.name}の総合得点を計算
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
        {/* 比率オプション（複数ある県のみ） */}
        {multipleOptions && (
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              志望校の「内申：学力」の比率
              <span className="ml-2 text-xs font-normal text-slate-500">（高校・学科により異なります）</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {system.ratioOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOptionId(opt.id)}
                  className={`rounded-lg border-2 px-3 py-2 text-center text-xs font-bold transition-all ${
                    optionId === opt.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 学力検査 */}
        <div>
          <label htmlFor="total-score-academic" className="mb-2 block text-sm font-bold text-slate-700">
            学力検査の合計点
            <span className="ml-2 text-xs font-normal text-slate-500">
              （{system.academic.rawMax}点満点 / {system.academic.subjects}教科×{system.academic.perSubjectMax}点）
            </span>
          </label>
          <input
            id="total-score-academic"
            type="number"
            inputMode="decimal"
            min="0"
            max={system.academic.rawMax}
            value={academicInput}
            onChange={(e) => setAcademicInput(e.target.value)}
            placeholder={`例：${Math.round(system.academic.rawMax * 0.7)}`}
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {academicInput !== '' && (
            <div className="mt-2 text-xs text-blue-700">
              → 換算：<strong className="text-base">{result.academic}点</strong> / {result.option.academicMax}点
            </div>
          )}
        </div>

        {/* 内申点 */}
        <div>
          <label htmlFor="total-score-report" className="mb-2 block text-sm font-bold text-slate-700">
            内申点（調査書点）
            <span className="ml-2 text-xs font-normal text-slate-500">（{system.report.rawMax}点満点）</span>
          </label>
          <input
            id="total-score-report"
            type="number"
            inputMode="decimal"
            min="0"
            max={system.report.rawMax}
            value={reportInput}
            onChange={(e) => setReportInput(e.target.value)}
            placeholder={`例：${Math.round(system.report.rawMax * 0.75)}`}
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {reportInput !== '' && (
            <div className="mt-2 text-xs text-emerald-700">
              → 換算：<strong className="text-base">{result.report}点</strong> / {result.option.reportMax}点
            </div>
          )}
          {system.report.note && <p className="mt-2 text-xs text-slate-500">{system.report.note}</p>}
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 px-6 py-6">
          <div className="text-center">
            <div className="mb-1 text-xs font-bold text-slate-600">あなたの総合得点</div>
            <div className={`text-6xl font-black ${tone}`}>
              {result.total}
              <span className="text-2xl font-bold text-slate-400">/{result.totalMax}</span>
            </div>
            <div className="mt-2 text-sm font-bold text-slate-700">得点率 {percent.toFixed(1)}%</div>
          </div>

          <div className="mt-6 grid gap-2 text-center sm:grid-cols-2">
            <div className="rounded-lg border border-blue-100 bg-white p-3">
              <div className="text-[10px] font-bold uppercase text-blue-600">学力検査</div>
              <div className="text-xl font-black text-blue-700">{result.academic}</div>
              <div className="text-[10px] text-slate-500">/{result.option.academicMax}点</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-3">
              <div className="text-[10px] font-bold uppercase text-emerald-600">内申点</div>
              <div className="text-xl font-black text-emerald-700">{result.report}</div>
              <div className="text-[10px] text-slate-500">/{result.option.reportMax}点</div>
            </div>
          </div>

          {/* 目標との距離（S-3①：当日自己採点後に「あと何点」を確認する） */}
          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={result.total}
            totalMax={result.totalMax}
          />

          {/* 橋②：総合得点の結果を保護者に共有（実数つきで /hogosha へ着地→決裁者がオファーに触れる） */}
          <ParentShareLinkButton
            className="mt-5"
            tool="total-score"
            label="この結果をおうちの人に送る"
            ctx={{
              prefectureCode: system.code,
              prefectureName: system.name,
              score: result.total,
              max: result.totalMax,
              metricLabel: '総合得点',
            }}
          />

          <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
            ※ 満点・配点は{system.name}教育委員会の令和8年度入学者選抜要項に基づく目安です。実際の合否は倍率・他の受験者の得点で変動します。学校別の合格ボーダーは掲載していません。
          </p>
        </div>
      )}
    </div>
  );
}
