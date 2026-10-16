'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';

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

  const multipleOptions = system.ratioOptions.length > 1;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
        <h2 className="text-xl font-bold text-slate-900">{system.name}の総合得点を計算</h2>
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
        {/* 比率オプション（複数ある県のみ） */}
        {multipleOptions && (
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              志望校の「内申：学力」の比率
              <span className="ml-2 text-xs font-normal text-slate-600">（高校・学科により異なります）</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {system.ratioOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOptionId(opt.id)}
                  aria-pressed={optionId === opt.id}
                  className={`min-h-[44px] rounded border-2 px-3 py-2 text-center text-sm font-bold transition-colors ${
                    optionId === opt.id
                      ? 'border-brand-700 bg-brand-50 text-brand-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-brand-50'
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
          <label htmlFor="total-score-academic" className="mb-2 block text-sm font-bold text-slate-900">
            学力検査の合計点
            <span className="ml-2 text-xs font-normal text-slate-600">
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
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          {academicInput !== '' && (
            <div className="mt-2 text-sm text-brand-700">
              → 換算：<strong className="text-base tabular-nums">{result.academic}点</strong> / {result.option.academicMax}点
            </div>
          )}
        </div>

        {/* 内申点 */}
        <div>
          <label htmlFor="total-score-report" className="mb-2 block text-sm font-bold text-slate-900">
            内申点（調査書点）
            <span className="ml-2 text-xs font-normal text-slate-600">（{system.report.rawMax}点満点）</span>
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
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          {reportInput !== '' && (
            <div className="mt-2 text-sm text-brand-700">
              → 換算：<strong className="text-base tabular-nums">{result.report}点</strong> / {result.option.reportMax}点
            </div>
          )}
          {system.report.note && <p className="mt-2 text-sm text-slate-600">{system.report.note}</p>}
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-sm font-bold text-slate-700">あなたの総合得点</div>
          <div className="mt-1 text-5xl font-bold tabular-nums text-slate-900">
            {result.total}
            <span className="ml-1 text-2xl font-bold text-slate-600">/{result.totalMax}</span>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-700">得点率 {percent.toFixed(1)}%</div>

          <dl className="mt-5 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
            <div className="px-4 py-3 first:pl-0">
              <dt className="text-xs text-slate-600">学力検査</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{result.academic}</dd>
              <dd className="text-xs text-slate-600">/{result.option.academicMax}点</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-xs text-slate-600">内申点</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{result.report}</dd>
              <dd className="text-xs text-slate-600">/{result.option.reportMax}点</dd>
            </div>
          </dl>

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

          <p className="mt-4 text-sm leading-[1.7] text-slate-600">
            ※ 満点・配点は{system.name}教育委員会の令和8年度入学者選抜要項に基づく目安です。実際の合否は倍率・他の受験者の得点で変動します。学校別の合格ボーダーは掲載していません。
          </p>
        </div>
      )}
    </div>
  );
}
