'use client';

import * as React from 'react';
import { Info, ExternalLink, AlertTriangle } from '@/components/icons';

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
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-brand-700" />
        <span className="text-base font-bold text-slate-900">この計算の根拠</span>
      </div>

      <dl className="grid border-t border-slate-200 sm:grid-cols-2 sm:gap-x-8">
        <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-2.5">
          <dt className="text-sm text-slate-600">対象学年</dt>
          <dd className="text-right text-sm font-bold text-slate-900">{gradeText}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-2.5">
          <dt className="text-sm text-slate-600">倍率・配点</dt>
          <dd className="text-right text-sm font-bold text-slate-900">{multiplierInfo}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-2.5">
          <dt className="text-sm text-slate-600">満点</dt>
          <dd className="text-right text-sm font-bold tabular-nums text-slate-900">
            {max}点
            {prefecture.simplifiedCalc && typeof prefecture.actualMaxScore === 'number' && (
              <span className="mt-0.5 block text-xs font-normal text-amber-800">
                実選抜換算 {prefecture.actualMaxScore}点
              </span>
            )}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-2.5">
          <dt className="text-sm text-slate-600">あなたの得点率</dt>
          <dd className="text-right text-sm font-bold tabular-nums text-slate-900">{Math.round((total / max) * 100)}%</dd>
        </div>
      </dl>

      {prefecture.note && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            注意
          </p>
          <p className="mt-1 text-sm leading-relaxed">{prefecture.note}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {prefecture.sourceUrl && (() => {
          const trust = sourceTrustLabel(prefecture);
          const official = trust?.badge === '公式';
          return (
            <a
              href={prefecture.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded border border-slate-200 bg-white px-3 text-sm text-brand-700 transition-colors hover:bg-brand-50"
            >
              <ExternalLink className="h-4 w-4" />
              {official
                ? `${prefecture.name}教育委員会（公式）`
                : `出典を見る（${trust?.badge ?? '一次照合中'}）`}
            </a>
          );
        })()}

        <span className="text-sm text-slate-600">最終確認日：{prefecture.fiscalYear ?? '2025'}年度版</span>

        <span className="text-sm text-slate-600">計算式は各都道府県の公式資料に基づく</span>
      </div>

      {(() => {
        const trust = sourceTrustLabel(prefecture);
        return trust?.note ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{trust.note}</p>
        ) : null;
      })()}
    </div>
  );
}
