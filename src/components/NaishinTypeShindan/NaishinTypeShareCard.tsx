'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';

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
        className="w-[375px] bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{APP_NAME}</div>
            <div className="text-[10px] text-slate-500">内申点タイプ診断{prefectureName ? `（${prefectureName}）` : ''}</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-blue-600">あなたの内申点タイプ</div>
          <div className="mt-1 text-2xl font-black text-slate-900">{type.label}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{type.basis}</p>
        </div>

        <div className="mt-5 text-center">
          <div className="text-[11px] text-slate-500">友達もタイプ診断してみよう</div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-bold text-slate-600">#内申点タイプ診断</span>
          </div>
        </div>
      </div>
    );
  }
);
