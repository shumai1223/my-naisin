'use client';

import * as React from 'react';

import { HokkaidoRankCalculator, type HokkaidoRankResult } from '@/components/Hokkaido/HokkaidoRankCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

/**
 * 北海道内申ランクページの結果連動フロー（B-5）。
 * 既存のHokkaidoRankCalculatorには結果連動のSaveResultCTA(LINE保存)自体が無かった。
 */
export function HokkaidoRankResultFlow() {
  const [result, setResult] = React.useState<HokkaidoRankResult | null>(null);

  return (
    <>
      <HokkaidoRankCalculator onResult={setResult} />

      <ParentCostBridge prefectureName="北海道" className="mt-8" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="hokkaido"
          prefectureName="北海道"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `北海道の総合点${result.total}点、志望校のランクに届いていますか？`
              : '北海道の内申ランクと「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="内申・当日点の伸ばし方、札幌南・札幌北など志望校の最新ランクとボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>
    </>
  );
}
