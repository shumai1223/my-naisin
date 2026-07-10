'use client';

import * as React from 'react';

import { FukuokaScoreCalculator, type FukuokaScoreResult } from '@/components/Fukuoka/FukuokaScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';

/** 福岡内申点・当日点ページの結果連動フロー（B-5）。 */
export function FukuokaResultFlow() {
  const [result, setResult] = React.useState<FukuokaScoreResult | null>(null);

  return (
    <>
      <FukuokaScoreCalculator onResult={setResult} />

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：総合得点の現在地＋成績カードを面談へ持って行く導線（C-10） */}
      <ParentWindowBridge
        className="mt-6"
        metricLabel="総合得点"
        score={result?.total}
        max={result?.max}
        prefectureCode="fukuoka"
        prefectureName="福岡県"
      />

      <ParentCostBridge prefectureName="福岡県" className="mt-6" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="fukuoka"
          prefectureName="福岡県"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `福岡の内申＋当日点${result.total}点、A群の目安に届いていますか？`
              : '福岡の「内申＋当日点」のバランスと志望校情報を受け取りませんか？'
          }
          body="内申(中3)・当日点の伸ばし方、修猷館・福岡など志望校の最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="fukuoka" />
      </div>
    </>
  );
}
