'use client';

import * as React from 'react';

import { ShindanQuiz, type ShindanResult, type Concern } from '@/components/Hensachi/ShindanQuiz';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { StatsOptIn } from '@/components/StatsOptIn';

interface ShindanResultFlowProps {
  defaultGrade?: number;
  defaultConcern?: Concern;
}

/**
 * 偏差値診断（/hensachi/shindan系ページ共通）の結果連動フロー（S-2④）。
 * 従来はShindanQuizが結果を内部で持つのみで、SaveResultCTA/ParentWindowBridge/StatsOptInの
 * いずれも配線されていなかった（他のhensachi/total-score系ページと揃っていなかった穴）。
 * ハブ（/hensachi/shindan）・学年別（[grade]）・目的別（mokuteki/[purpose]）の3系統で共通利用する。
 */
export function ShindanResultFlow({ defaultGrade, defaultConcern }: ShindanResultFlowProps) {
  const [result, setResult] = React.useState<ShindanResult | null>(null);

  return (
    <>
      <ShindanQuiz defaultGrade={defaultGrade} defaultConcern={defaultConcern} onResult={setResult} />

      <ParentWindowBridge
        className="mt-6"
        metricLabel="偏差値（診断目安）"
        score={result?.hensachi}
        max={undefined}
        prefectureCode={result?.prefectureCode}
        prefectureName={result?.prefectureName}
      />

      <ParentCostBridge className="mt-6" prefectureName={result?.prefectureName} />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="hensachi-shindan"
          score={result?.hensachi}
          grade={result?.grade}
          prefectureCode={result?.prefectureCode}
          prefectureName={result?.prefectureName}
          metricLabel="偏差値（診断目安）"
          heading={
            result
              ? `診断結果の偏差値目安${result.hensachi}、記録して伸びを追いかけませんか？`
              : '診断結果を記録して、伸びを追いかけませんか？'
          }
          body="今回の診断結果を保存し、正確な偏差値計算・志望校情報を受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン。同意済みなら診断の偏差値目安を匿名で自動送信 */}
      <div className="mt-6">
        <StatsOptIn metric="hensachi" value={result?.hensachi} prefectureCode={result?.prefectureCode} />
      </div>
    </>
  );
}
