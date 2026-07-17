'use client';

import * as React from 'react';
import { Info, ExternalLink, Calendar, BookOpen, AlertTriangle } from 'lucide-react';

import { getPrefectureByCode, resolvePrefectureConfig } from '@/lib/prefectures';
import { sourceTrustLabel } from '@/lib/source-trust';

interface CalculationBasisProps {
  prefectureCode: string;
  variantCode?: string;
  total: number;
  max: number;
}

export function CalculationBasis({ prefectureCode, variantCode, total, max }: CalculationBasisProps) {
  const prefecture = React.useMemo(() => {
    const raw = getPrefectureByCode(prefectureCode);
    return raw ? resolvePrefectureConfig(raw, variantCode) : undefined;
  }, [prefectureCode, variantCode]);

  const multiplierInfo = React.useMemo(() => {
    if (!prefecture) return '';
    const { coreMultiplier, practicalMultiplier } = prefecture;
    if (coreMultiplier === 1 && practicalMultiplier === 1) {
      return '全教科同一配点';
    }
    if (coreMultiplier === 1 && practicalMultiplier === 2) {
      return '実技4教科2倍';
    }
    return `5教科×${coreMultiplier}、実技4教科×${practicalMultiplier}`;
  }, [prefecture]);

  if (!prefecture) return null;

  const targetGrades = prefecture.targetGrades ?? [3];
  const gradeText = targetGrades.length === 1
    ? `中学${targetGrades[0]}年のみ`
    : `中学${targetGrades.join('・')}年`;

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
          {prefecture.simplifiedCalc && typeof prefecture.actualMaxScore === 'number' && (
            <div className="mt-0.5 text-[11px] font-medium text-amber-600">
              実選抜換算 {prefecture.actualMaxScore}点
            </div>
          )}
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
        {prefecture.sourceUrl && (() => {
          const trust = sourceTrustLabel(prefecture);
          const official = trust?.badge === '公式';
          return (
            <a
              href={prefecture.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                official
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              {official
                ? `${prefecture.name}教育委員会（公式）`
                : `出典を見る（${trust?.badge ?? '一次照合中'}）`}
            </a>
          );
        })()}

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>最終確認日：{prefecture.fiscalYear ?? '2025'}年度版</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="h-3 w-3" />
          <span>計算式は各都道府県の公式資料に基づく</span>
        </div>
      </div>

      {(() => {
        const trust = sourceTrustLabel(prefecture);
        return trust?.note ? (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{trust.note}</p>
        ) : null;
      })()}
    </div>
  );
}
