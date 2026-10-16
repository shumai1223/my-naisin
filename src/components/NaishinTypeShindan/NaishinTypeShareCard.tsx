'use client';

import * as React from 'react';

import { APP_NAME } from '@/lib/constants';
import type { NaishinTypeDefinition } from '@/lib/naishin-type-diagnosis';

export interface NaishinTypeShareCardProps {
  type: NaishinTypeDefinition;
  prefectureName?: string;
}

/**
 * 内申点タイプ診断のシェア画像（Λ-13）。
 * ShareCard.tsx（内申点計算・S/A/B/C式ランク表示）とは意図的に別デザインにする。
 * タイプ診断は「タイプに優劣はありません」が設計原則のため、ランク・トロフィー等
 * 優劣を想起させる表現を一切含めない（診断ロジック側の非優劣原則をシェア画像でも継承）。
 */
export const NaishinTypeShareCard = React.forwardRef<HTMLDivElement, NaishinTypeShareCardProps>(
  function NaishinTypeShareCard({ type, prefectureName }, ref) {
    return (
      <div
        ref={ref}
        className="w-[375px] bg-brand-50 p-6"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div>
          <div className="text-base font-bold text-slate-900">{APP_NAME}</div>
          <div className="text-sm text-slate-600">内申点タイプ診断{prefectureName ? `（${prefectureName}）` : ''}</div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          <div className="text-sm font-bold text-brand-700">あなたの内申点タイプ</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{type.label}</div>
          <p className="mt-3 text-sm leading-[1.8] text-slate-900">{type.basis}</p>
        </div>

        <div className="mt-5 text-center">
          <div className="text-sm text-slate-600">友達もタイプ診断してみませんか</div>
          <div className="mt-1 text-sm font-bold text-slate-600">#内申点タイプ診断</div>
        </div>
      </div>
    );
  }
);
