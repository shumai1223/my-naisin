'use client';

import * as React from 'react';
import { Info, ExternalLink, Calendar, BookOpen, AlertTriangle } from 'lucide-react';

import { getPrefectureByCode } from '@/lib/prefectures';

interface CalculationBasisProps {
  prefectureCode: string;
  total: number;
  max: number;
}

export function CalculationBasis({ prefectureCode, total, max }: CalculationBasisProps) {
  const prefecture = React.useMemo(() => getPrefectureByCode(prefectureCode), [prefectureCode]);

  if (!prefecture) return null;

  const targetGrades = prefecture.targetGrades ?? [3];
  const gradeText = targetGrades.length === 1
    ? `中学${targetGrades[0]}年のみ`
    : `中学${targetGrades.join('・')}年`;

  const multiplierInfo = React.useMemo(() => {
    const { coreMultiplier, practicalMultiplier } = prefecture;
    if (coreMultiplier === 1 && practicalMultiplier === 1) {
      return '全教科同一配点';
    }
    if (coreMultiplier === 1 && practicalMultiplier === 2) {
      return '実技4教科2倍';
    }
    return `5教科×${coreMultiplier}、実技4教科×${practicalMultiplier}`;
  }, [prefecture]);

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-bold text-slate-700">この計算の根拠</span>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="mb-1 text-xs font-medium text-slate-500">対象学年</div>
          <div className="font-bold text-slate-800">{gradeText}</div>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="mb-1 text-xs font-medium text-slate-500">倍率・配点</div>
          <div className="font-bold text-slate-800">{multiplierInfo}</div>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="mb-1 text-xs font-medium text-slate-500">満点</div>
          <div className="font-bold text-slate-800">{max}点</div>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="mb-1 text-xs font-medium text-slate-500">あなたの得点率</div>
          <div className="font-bold text-slate-800">{Math.round((total / max) * 100)}%</div>
        </div>
      </div>

      {prefecture.note && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          <p className="text-xs text-amber-700">{prefecture.note}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
        {prefecture.sourceUrl && (
          <a
            href={prefecture.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <ExternalLink className="h-3 w-3" />
            {prefecture.name}教育委員会（公式）
          </a>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>最終確認日：{prefecture.fiscalYear ?? '2025'}年度版</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="h-3 w-3" />
          <span>計算式は各都道府県の公式資料に基づく</span>
        </div>
      </div>
    </div>
  );
}
