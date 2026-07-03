'use client';

import * as React from 'react';

import { TokyoTotalScoreCalculator } from '@/components/TokyoTotalScore/TokyoTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

/**
 * 都立総合得点（1020点満点・買い意図最濃・CTR15.8%）の結果連動 換金フロー。
 * 総合得点の実測値を持ち上げ、計算後に SaveResultCTA を個別化＝成績カード＋保護者バトンを点灯。
 */
export function TokyoTotalScoreResultFlow() {
  const [result, setResult] = React.useState<{ total: number; max: number } | null>(null);

  return (
    <>
      <TokyoTotalScoreCalculator onResult={setResult} />

      <ParentCostBridge prefectureName="東京都" className="mb-6" />

      <div id="save-result" className="scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="tokyo"
          prefectureName="東京都"
          className="mt-6"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `都立総合得点${result.total}点（1020点満点）、日比谷や西まで「あと何点」を受け取りませんか？`
              : 'この総合得点と「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="総合得点アップのコツ・日比谷や西など志望校の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>
    </>
  );
}
