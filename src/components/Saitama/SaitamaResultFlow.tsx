'use client';

import * as React from 'react';

import { SaitamaTotalScoreCalculator, type SaitamaTotalScoreResult } from '@/components/Saitama/SaitamaTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';

/** 埼玉県総合得点ページの結果連動フロー（S-3①・残タスク）。 */
export function SaitamaResultFlow() {
  const [result, setResult] = React.useState<SaitamaTotalScoreResult | null>(null);

  return (
    <>
      <SaitamaTotalScoreCalculator onResult={setResult} />

      <ParentWindowBridge
        className="mt-6"
        metricLabel="総合得点（目安）"
        score={result?.total}
        max={result?.max}
        prefectureCode="saitama"
        prefectureName="埼玉県"
      />

      <ParentCostBridge prefectureName="埼玉県" className="mt-6" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="saitama"
          prefectureName="埼玉県"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `埼玉の総合得点(目安)${result.total}点、志望校の水準に届いていますか？`
              : '埼玉の学年比率に合わせた「あと何点」を受け取りませんか？'
          }
          body="調査書点・学力検査の伸ばし方、浦和・大宮など志望校の選抜基準と最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="saitama" />
      </div>
    </>
  );
}
