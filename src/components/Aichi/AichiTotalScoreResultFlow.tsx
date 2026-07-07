'use client';

import * as React from 'react';

import { AichiHyokaCalculator, type AichiHyokaResult } from '@/components/Aichi/AichiHyokaCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

/** 愛知評価方法ページの結果連動フロー（B-5）。 */
export function AichiTotalScoreResultFlow() {
  const [result, setResult] = React.useState<AichiHyokaResult | null>(null);

  return (
    <>
      <AichiHyokaCalculator onResult={setResult} />

      <ParentCostBridge prefectureName="愛知県" className="mt-6" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="aichi"
          prefectureName="愛知県"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `愛知の総合得点${result.total}点、志望校の評価方法に合っていますか？`
              : '愛知の評価方法別「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="内申・当日点の伸ばし方、旭丘・明和など志望校の評価方法と最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>
    </>
  );
}
